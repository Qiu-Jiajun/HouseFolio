# Phase 4D-0：Real AI provider boundary review

## 0. Stage summary

Phase 4D-0 is the boundary review for future real AI provider integration.

This stage only writes this architecture document:

    docs/architecture/phase-4d-0-real-ai-provider-boundary-review.md

This stage does not implement AI.

It does not:

- connect DeepSeek;
- add lib/ai;
- add API routes;
- write prompt builder code;
- write redaction code;
- write provider interfaces;
- store AI outputs;
- add localStorage keys;
- modify Settings;
- modify /compare UI;
- modify CompareTable;
- modify L2 comparison logic;
- modify Reference Score logic.

The purpose is to define what must be true before HouseFolio can safely move from a static compare explanation panel to a real AI-generated explanation.

---

## 1. Current project status

HouseFolio has completed:

    Phase 4A: L2 comparison model layer
    Phase 4B: Compare UI main path
    Phase 4C: static L3-facing compare explanation surface

The current /compare flow is:

    Portfolio selection
    → /compare?ids=...
    → local listings read on client
    → buildComparisonInputs()
    → CompareTable
    → CompareExplanationPanel
    → existing ComparisonModel preview cards

The current CompareExplanationPanel is static.

It does not call any model provider.

It does not create prompts.

It does not save output.

It does not send user data anywhere.

Phase 4D-0 starts from this safe baseline.

---

## 2. Why AI provider integration must not be rushed

Real AI integration changes the product boundary.

A static explanation panel only displays local UI copy.

A real AI explanation may involve:

- sending selected listing summaries to a third-party model provider;
- creating prompt payloads;
- redacting sensitive fields;
- handling provider errors;
- managing cost;
- explaining data transfer to users;
- deciding whether outputs are session-only or persistent;
- preventing hallucinated facts;
- preventing AI from turning L2 comparison into a recommendation system.

Therefore, HouseFolio must not directly connect DeepSeek or any model API before the following boundaries are stable:

- provider boundary;
- redaction boundary;
- prompt payload schema;
- user confirmation boundary;
- output language boundary;
- no-persistence default;
- Settings impact boundary;
- failure and fallback behavior.

---

## 3. Product boundary

HouseFolio remains a local-first private rental decision tool.

AI must not change HouseFolio into:

- an AI house-selection system;
- a real-listing verification system;
- a brokerage assistant;
- a contract advisor;
- a transaction decision engine;
- a public listing intelligence platform.

Future AI may only explain selected listings based on already-structured, redacted, low-sensitive comparison data.

Future AI must not:

- choose for the user;
- rank listings as final recommendations;
- verify authenticity;
- judge landlords or agents as reliable/unreliable;
- provide legal conclusions;
- encourage signing;
- crawl third-party platforms;
- analyze photos or videos;
- infer precise user movement patterns;
- produce market claims not present in the input.

---

## 4. L1 / L2 / L3 separation

The three-layer boundary remains:

    L1 LBS:
    commute, distance, life-circle, spatial calculation

    L2 Algorithm:
    reference score, sorting, filtering, comparison, risk flags, missing fields

    L3 AI:
    plain-language explanation, trade-off summary, checklist, conditional auxiliary advice

Future AI must only operate at L3.

AI must not do L1 work:

- no commute calculation;
- no distance calculation;
- no geocoding;
- no route planning;
- no map or POI lookup;
- no raw Amap data processing.

AI must not do L2 work:

- no scoring;
- no sorting;
- no filtering;
- no winner selection;
- no risk flag generation as source of truth;
- no Reference Score replacement.

AI may only explain L2 output.

---

## 5. Future lib/ai boundary

If a later phase adds AI code, it must go through lib/ai.

Pages and components must not directly call DeepSeek or any provider SDK.

Recommended future structure:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/deepseek-provider.ts
    src/lib/ai/redact.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/compare-explanation-contract-check.ts
    src/lib/config/ai.ts

But Phase 4D-0 does not create these files.

Future provider interface should hide provider-specific details from UI components.

Potential future function names:

    generateCompareExplanation()
    buildCompareExplanationInput()
    redactCompareExplanationInput()
    validateCompareExplanationOutput()

UI should only call a local service or route designed for this purpose.

---

## 6. Provider policy

DeepSeek may be considered later, but it must be treated as a replaceable provider.

Do not hard-code provider logic into:

- /compare page;
- CompareExplanationPanel;
- CompareTable;
- Portfolio components;
- listing model;
- comparison model.

Future provider config should be isolated in:

    src/lib/config/ai.ts

Future provider implementation should be isolated in:

    src/lib/ai/deepseek-provider.ts

The rest of the app should depend on provider-neutral functions and types.

---

## 7. API route boundary

A future AI API route may be needed because provider API keys must not be exposed to the browser.

Potential future route:

    src/app/api/ai/compare/explanation/route.ts

But Phase 4D-0 does not add it.

If implemented later, the route must:

- run server-side only;
- read provider key only from server environment variables;
- never use NEXT_PUBLIC_AI_KEY;
- never return provider key;
- never return raw provider error containing secrets;
- never log raw prompt payloads;
- never store raw prompts by default;
- validate request shape;
- reject unexpected fields;
- return a narrow explanation response;
- handle provider timeout and failure gracefully.

---

## 8. Environment variable boundary

Future AI provider keys must be server-side only.

Allowed future pattern:

    AI_PROVIDER=deepseek
    DEEPSEEK_API_KEY=<local server only>
    DEEPSEEK_MODEL=<model name>

Forbidden:

    NEXT_PUBLIC_DEEPSEEK_API_KEY
    NEXT_PUBLIC_AI_API_KEY
    public provider keys in client code
    provider keys in logs
    provider keys committed to git

Current .env files must remain untracked.

---

## 9. Compare explanation input boundary

Future AI should not consume raw ComparisonModel directly if that model grows over time.

Recommended future structure:

    ComparisonModel[]
    → CompareExplanationInput[]
    → redaction / field allowlist
    → prompt payload
    → provider
    → CompareExplanationOutput

The input schema should be deliberately narrow.

Allowed future input fields:

- listingId;
- displayTitle;
- rentMonthly;
- areaSqm;
- layout;
- district;
- areaLabel if low-sensitive;
- status;
- commuteMinutes;
- commuteSource;
- commuteSummaryText;
- lifeCircleScore;
- referenceScore;
- scoreBreakdown summary;
- subjectiveSummary if already non-identifying;
- strengths;
- weaknesses;
- neutralFacts;
- missingFields;
- riskFlags;
- hasNotes;
- hasPhotos;
- photoCount.

Forbidden input fields:

- raw notes;
- complete notes;
- chat records;
- landlord names;
- agent names;
- phone numbers;
- WeChat IDs;
- ID card numbers;
- exact door number;
- room number;
- building number;
- unit number;
- full address;
- exact work or school address;
- latitude;
- longitude;
- coordinates;
- Amap raw route JSON;
- Amap POI raw JSON;
- route steps;
- polyline;
- request URLs;
- API keys;
- photo Blob;
- video Blob;
- object URL;
- image base64;
- thumbnail base64;
- EXIF;
- third-party platform original listing body;
- third-party platform images;
- third-party screenshots.

---

## 10. Redaction boundary

A future redaction step is mandatory before real provider calls.

Redaction should remove or reject:

- phone numbers;
- WeChat-like contact strings;
- ID card-like numbers;
- precise address fragments;
- door / room / building / unit numbers;
- names when used as landlord or agent identity;
- raw contract clauses;
- any photo/video references beyond low-sensitive counts.

The first real AI implementation should prefer field allowlisting over after-the-fact redaction.

Safer approach:

    build payload from allowed fields only

Less safe approach:

    take large object and remove forbidden fields

HouseFolio should use the safer approach.

---

## 11. Prompt boundary

A future prompt must be short, structured, and defensive.

It should instruct the model to:

- only use supplied fields;
- not invent facts;
- not choose a final winner;
- not verify authenticity;
- not provide legal advice;
- not mention exact addresses;
- use conditional language;
- state missing information clearly;
- present trade-offs and next checks;
- keep output in Chinese.

Prompt must not include:

- raw notes;
- full addresses;
- coordinates;
- photos;
- videos;
- third-party original content;
- provider keys;
- hidden internal policies not meant for provider.

Phase 4D-0 does not write the prompt.

A future prompt design must be reviewed separately before implementation.

---

## 12. Output schema boundary

Future AI output should be structured rather than free-form only.

Possible future output schema:

    {
      summary: string;
      tradeoffs: string[];
      commuteNotes: string[];
      riskExplanations: string[];
      missingFieldNotes: string[];
      checklist: string[];
      disclaimer: string;
    }

Forbidden output shape:

    {
      bestListingId: string;
      ranking: string[];
      recommendationScore: number;
      finalDecision: string;
    }

The output must not contain:

- best listing;
- final ranking as recommendation;
- recommendation score;
- signing advice;
- real-listing guarantee;
- legal conclusion;
- claims based on facts not in input.

---

## 13. User confirmation boundary

Real AI generation must be user-triggered.

No automatic AI call when opening /compare.

No background AI generation.

No automatic batch generation.

Before generation, the UI should show a confirmation explaining:

- this is a third-party model call;
- only redacted structured comparison data will be sent;
- no full address, phone number, WeChat ID, ID card number, photo, or video should be sent;
- output is only auxiliary explanation;
- user must verify all housing and contract details independently.

Recommended future confirmation copy:

    本次 AI 解释会基于已选房源的脱敏结构化比较信息生成，包括租金、面积、户型、通勤摘要、参考评分、缺失字段和风险信号。请不要输入手机号、微信号、身份证号、完整门牌号、合同原文、照片或视频。AI 解释仅用于辅助比较，不代表最终推荐。

Phase 4D-0 does not add this UI.

---

## 14. Persistence boundary

Default future policy:

    do not persist AI output in the first real AI implementation

Reasons:

- avoids new localStorage key;
- avoids Settings export/import/clear changes;
- avoids AI output deletion concerns;
- avoids prompt/history privacy issues;
- keeps MVP simpler.

Possible future options:

### Option A: session-only output

Recommended first real implementation.

- no localStorage key;
- no Settings change;
- output disappears on refresh;
- simplest privacy posture.

### Option B: explicit user-saved output

Only later.

Requires:

- new localStorage key;
- Settings data snapshot update;
- JSON export/import whitelist update;
- clear local data update;
- user-facing privacy copy;
- delete control.

### Option C: cloud-saved output

Not suitable for current MVP.

Requires:

- account system;
- privacy policy;
- provider disclosure;
- cross-border review if applicable;
- deletion rights;
- stronger consent flow.

---

## 15. Settings impact

Phase 4D-0 has no Settings impact.

Future real AI session-only output also may have no Settings impact.

Settings must be updated only if the app stores:

- AI prompt;
- AI response;
- AI explanation history;
- saved compare report;
- provider metadata;
- token usage;
- model response logs.

If any persistent AI artifact is added, update:

    src/lib/privacy/local-data.ts
    Settings local data snapshot
    export JSON
    import whitelist
    clear local data behavior
    privacy copy

---

## 16. Error handling boundary

Future AI failure must not break Compare.

If provider call fails:

- CompareTable remains visible;
- static explanation remains available;
- user sees a plain failure message;
- no raw provider error is exposed;
- no API key or request payload is exposed;
- user can retry manually.

Error copy should avoid technical leakage.

Allowed:

    AI 解释暂时生成失败，请稍后重试。结构化对比表仍可正常使用。

Forbidden:

    raw provider error
    stack trace
    request URL
    API key
    full prompt payload

---

## 17. Cost and rate boundary

Future real AI calls should be manual and limited.

Recommended controls:

- no automatic generation;
- no batch generation;
- no generation for more than 4 listings in first version;
- simple cooldown or disabled loading state;
- no background retry loop;
- no streaming requirement in MVP.

This keeps cost and failure surface low.

---

## 18. Model output language policy

Future AI output must use auxiliary and conditional language.

Allowed:

- 如果你更重视通勤稳定，可以优先关注 A 的通勤优势。
- 如果你更重视面积和预算，B 的取舍更明显。
- 当前信息仍需要你补充实地看房记录。
- 该风险信号只表示需要进一步核实。
- 这不是最终推荐。

Forbidden:

- A 是最佳房源。
- 系统推荐 A。
- 推荐分最高的是 A。
- 你应该选择 A。
- A 真实可靠。
- 可以放心签约。
- 已经帮你避坑。
- 这是最优选择。

---

## 19. Compliance and disclosure boundary

If real AI provider integration is added, the user must be told that a third-party model service is involved.

The app should disclose:

- what categories of data are sent;
- why the data is sent;
- that the data is redacted and structured;
- that sensitive data should not be included;
- that output is auxiliary only;
- that user remains responsible for final verification.

If provider terms require additional disclosures, those must be reviewed at implementation time.

---

## 20. Phase 4D-0 decision summary

Phase 4D-0 decisions:

1. Do not connect DeepSeek yet.
2. Do not add lib/ai yet.
3. Do not add AI API routes yet.
4. Real AI must be user-triggered.
5. Provider keys must stay server-side.
6. Future AI must consume a redacted allowlisted explanation input, not raw ComparisonModel.
7. Future AI must not consume raw notes, full addresses, coordinates, photos, videos, Amap raw data, or third-party original content.
8. First real AI implementation should be session-only and not persist output.
9. Settings changes are required only if AI artifacts are persisted.
10. Future AI output must be structured, conditional, auxiliary, and non-recommendational.
11. Static explanation remains the fallback.
12. Real provider implementation requires a separate implementation plan after this review.

---

## 21. Recommended next phases

Recommended path:

### Phase 4D-1

AI provider implementation plan.

Still documentation-first.

Define:

- exact files;
- whether lib/ai scaffold is needed;
- input schema;
- output schema;
- route design;
- confirmation UI;
- no-persistence rule;
- validation checklist.

### Phase 4D-2

lib/ai scaffold and mock provider only.

No DeepSeek.

### Phase 4D-3

redacted input builder and contract check.

No provider call.

### Phase 4D-4

server route plan or implementation with mock provider.

No real key.

### Phase 4D-5

only after all above, review DeepSeek provider.

Do not skip directly to DeepSeek.

---

## 22. Acceptance criteria

Phase 4D-0 is complete only if:

- only this architecture document is added;
- no source code files are modified;
- no lib/ai files are added;
- no API route is added;
- no DeepSeek integration is added;
- no prompt builder is added;
- no localStorage key is added;
- no Settings file is modified;
- no /compare UI file is modified;
- npm.cmd run build passes;
- git status is clean after commit.

Recommended commit message:

    docs: review real ai provider boundary