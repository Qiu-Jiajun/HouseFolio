# Phase 4D-1：AI provider implementation plan

## 0. Stage summary

Phase 4D-1 turns the Phase 4D-0 real AI provider boundary review into a staged implementation plan.

This stage only writes this architecture document:

    docs/architecture/phase-4d-1-ai-provider-implementation-plan.md

This stage does not implement AI.

It does not:

- connect DeepSeek;
- add lib/ai files;
- add API routes;
- write prompt builder code;
- write redaction code;
- write provider code;
- write mock provider code;
- store AI output;
- add localStorage keys;
- modify Settings;
- modify /compare UI;
- modify CompareTable;
- modify L2 comparison logic.

The goal is to define the safest implementation order for future AI compare explanation.

---

## 1. Current baseline

Current latest stable commit:

    d845232 docs: review real ai provider boundary

HouseFolio currently has:

    Phase 4A: comparison model layer
    Phase 4B: Compare UI main path
    Phase 4C: static L3-facing compare explanation surface
    Phase 4D-0: real AI provider boundary review

The current CompareExplanationPanel is static.

It does not:

- call a model provider;
- create prompts;
- send data to a server;
- persist AI output;
- read raw notes;
- read photos or videos;
- use DeepSeek.

This static panel remains the fallback even after future AI work.

---

## 2. Implementation principle

The safest AI implementation path is:

    boundary first
    → type/schema first
    → mock provider first
    → redacted input builder first
    → server route with mock first
    → UI confirmation later
    → real provider last

Do not jump directly to DeepSeek.

Do not create provider code before the input/output schema is stable.

Do not create UI trigger before the payload and confirmation boundary are stable.

Do not persist any AI output in the first version.

---

## 3. Proposed phase sequence

### Phase 4D-2：AI compare explanation type scaffold

Purpose:

Define provider-neutral types only.

Possible files:

    src/types/ai-compare-explanation.ts
    src/types/ai-compare-explanation-contract-check.ts

No provider.

No API.

No prompt.

No UI change.

Types may include:

    CompareExplanationInput
    CompareExplanationListingInput
    CompareExplanationOutput
    CompareExplanationSection
    CompareExplanationChecklistItem

Acceptance:

- build passes;
- no provider code;
- no fetch;
- no localStorage;
- no UI change.

---

### Phase 4D-3：Redacted input builder plan / implementation

Purpose:

Build a narrow, allowlisted input from existing ComparisonInput[].

Possible files:

    src/lib/ai/compare-explanation-input.ts
    src/lib/ai/compare-explanation-input-contract-check.ts

However, before adding lib/ai, confirm whether this module should live under:

    src/lib/ai

or temporarily under:

    src/lib/algorithm

Recommendation:

Use src/lib/ai only when AI-related types and contracts are ready.

The builder must use allowlisting, not blacklist stripping.

Allowed inputs:

- listingId;
- displayTitle;
- rentMonthly;
- areaSqm;
- layout;
- district;
- low-sensitive areaLabel;
- status;
- commuteMinutes;
- commuteSource;
- commute summary;
- lifeCircleScore;
- referenceScore;
- score breakdown summary;
- non-identifying subjectiveSummary;
- strengths;
- weaknesses;
- neutralFacts;
- missingFields;
- riskFlags;
- hasNotes;
- hasPhotos;
- photoCount.

Forbidden inputs:

- raw notes;
- exact full address;
- coordinates;
- Amap raw JSON;
- photo Blob;
- video Blob;
- object URL;
- prompt history;
- AI response history;
- third-party platform original listing content.

Acceptance:

- builder is pure;
- no fetch;
- no provider;
- no browser storage;
- no prompt construction;
- contract check rejects forbidden fields.

---

### Phase 4D-4：Mock provider scaffold

Purpose:

Introduce provider-neutral AI boundary without real provider.

Possible files:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/index.ts

No DeepSeek.

No API key.

No network call.

Mock provider returns deterministic static structured output from redacted input.

Acceptance:

- no DeepSeek string except documentation comments if necessary;
- no fetch;
- no API key;
- no environment variable dependency;
- output schema matches CompareExplanationOutput;
- build passes.

---

### Phase 4D-5：Server route plan

Purpose:

Plan, not implement, the eventual route.

Possible future route:

    src/app/api/ai/compare/explanation/route.ts

The route should be server-only and provider-neutral.

It must:

- validate request shape;
- reject unexpected fields;
- call only provider-neutral lib/ai function;
- never expose provider keys;
- never log raw prompt;
- never persist AI output;
- return narrow output.

This phase may remain documentation-only.

---

### Phase 4D-6：Mock API route implementation

Purpose:

Only after mock provider is stable, add a route using mock provider.

No real provider.

No DeepSeek.

No external network call.

Acceptance:

- route exists;
- route uses mock provider only;
- no provider key required;
- no persistence;
- no Settings changes;
- build passes;
- manual POST smoke test works.

---

### Phase 4D-7：Compare AI trigger UI plan

Purpose:

Plan user-triggered UI only after backend mock route exists.

UI must include:

- explicit user action;
- confirmation copy;
- loading state;
- failure state;
- static fallback remains visible;
- no automatic generation on page load;
- no background generation.

Still no real provider.

---

### Phase 4D-8：Compare AI trigger UI with mock route

Purpose:

Wire UI to mock route only.

No DeepSeek.

No real provider.

No persistence.

Acceptance:

- user clicks button;
- confirmation shown;
- mock output rendered;
- CompareTable remains visible;
- static explanation remains fallback;
- refresh loses generated result;
- no new localStorage key.

---

### Phase 4D-9：DeepSeek provider boundary review

Purpose:

Review the real provider before writing any real provider code.

This must check:

- official provider terms;
- server-side key handling;
- environment variable naming;
- payload minimization;
- logging rules;
- user disclosure;
- cost controls;
- model output safety;
- fallback behavior.

No code unless this review is complete.

---

### Phase 4D-10：DeepSeek provider implementation

Only after all prior phases.

Possible files:

    src/lib/ai/deepseek-provider.ts
    src/lib/config/ai.ts

Still no direct UI provider dependency.

No client-side provider key.

No persistent output by default.

---

## 4. Recommended immediate next phase

The next phase after 4D-1 should be:

    Phase 4D-2：AI compare explanation type scaffold

Why:

- types are low-risk;
- they do not require provider keys;
- they make the future payload boundary explicit;
- they allow contract checks before network code exists.

Phase 4D-2 should not add:

- real provider;
- API route;
- prompt;
- UI trigger;
- persistence.

---

## 5. File scope recommendation for Phase 4D-2

Recommended file scope:

    src/types/ai-compare-explanation.ts
    src/types/ai-compare-explanation-contract-check.ts
    docs/dev-log/2026-05-13-phase-4d-2-ai-compare-explanation-types.md

No other files.

Do not modify:

    src/components/compare-explanation-panel.tsx
    src/components/compare-selected-listings-panel.tsx
    src/components/compare-table.tsx
    src/content/zh-cn.ts
    src/app/compare/page.tsx
    src/app/api/*
    src/lib/ai/*
    src/lib/privacy/local-data.ts

If src/lib/ai does not exist yet, do not create it in Phase 4D-2.

---

## 6. Proposed type boundary for Phase 4D-2

Potential types:

    type CompareExplanationListingInput = {
      listingId: string;
      displayTitle: string;
      rentMonthly?: number;
      areaSqm?: number;
      layout?: string;
      district?: string;
      areaLabel?: string;
      status?: string;
      commuteMinutes?: number;
      commuteSource?: "listing" | "cachedTransit";
      lifeCircleScore?: number;
      referenceScore?: number;
      strengths: string[];
      weaknesses: string[];
      neutralFacts: string[];
      missingFields: string[];
      riskFlags: string[];
      hasNotes?: boolean;
      hasPhotos?: boolean;
      photoCount?: number;
    };

    type CompareExplanationInput = {
      listings: CompareExplanationListingInput[];
      generatedAt: string;
      locale: "zh-CN";
    };

    type CompareExplanationOutput = {
      summary: string;
      tradeoffs: string[];
      commuteNotes: string[];
      riskExplanations: string[];
      missingFieldNotes: string[];
      checklist: string[];
      disclaimer: string;
    };

Forbidden output fields:

    bestListingId
    ranking
    recommendationScore
    finalDecision
    shouldChoose
    verified
    authenticityVerdict

---

## 7. Contract check direction

Phase 4D-2 contract check should enforce:

1. Input has no raw notes.
2. Input has no address fields beyond district / areaLabel.
3. Input has no coordinates.
4. Input has no Amap raw data.
5. Input has no photo/video file data.
6. Input has no object URLs.
7. Output has no bestListingId.
8. Output has no ranking.
9. Output has no recommendationScore.
10. Output has no finalDecision.

Potential forbidden keys:

    note
    notes
    rawNote
    fullNote
    noteText
    address
    fullAddress
    preciseAddress
    doorNumber
    roomNumber
    buildingNumber
    unitNumber
    coordinate
    coordinates
    latitude
    longitude
    lng
    lat
    raw
    rawJson
    rawResponse
    amapRaw
    poiRaw
    routeRaw
    polyline
    steps
    photoBlob
    videoBlob
    blob
    objectUrl
    imageBase64
    thumbnailBase64
    prompt
    aiPrompt
    aiResponse
    bestListingId
    ranking
    recommendationScore
    finalDecision
    shouldChoose
    verified
    authenticityVerdict

---

## 8. No-persistence rule

The first AI implementation path must be session-only.

No storage should be added until separately reviewed.

Do not add:

    housefolio:ai-explanations
    housefolio:compare-ai-results
    housefolio:ai-history
    housefolio:prompt-history
    housefolio:compare-reports

Therefore Phase 4D-2 through Phase 4D-8 should not modify:

    src/lib/privacy/local-data.ts
    Settings local data panel
    JSON export
    JSON import whitelist
    clear local data behavior

If persistence becomes necessary later, create a separate data rights review first.

---

## 9. UI trigger rule

Future AI explanation must be user-triggered.

No automatic call:

- on /compare load;
- after selecting listings;
- after CompareTable render;
- in background;
- during build;
- during static generation.

User must click a button and confirm.

The static explanation panel remains visible even if AI generation fails.

---

## 10. Provider key rule

No client-side key.

Forbidden:

    NEXT_PUBLIC_DEEPSEEK_API_KEY
    NEXT_PUBLIC_AI_API_KEY
    provider key in browser bundle
    provider key in React component
    provider key in logs
    provider key committed to Git

Allowed future pattern:

    AI_PROVIDER=mock
    AI_PROVIDER=deepseek
    DEEPSEEK_API_KEY=<server only>

But Phase 4D-1 does not add env variables.

---

## 11. Testing strategy

Each future AI phase should run:

    npm.cmd run build
    git status

Additional checks for AI-related phases:

- grep for forbidden localStorage keys;
- grep for NEXT_PUBLIC_DEEPSEEK;
- grep for direct provider calls in components;
- confirm no raw notes in input builder;
- confirm no photo/video fields in input builder;
- confirm no bestListingId or recommendationScore in output schema.

Manual test later:

- /compare still works without AI;
- static panel still renders;
- AI action, once added, is manual;
- failure does not break CompareTable.

---

## 12. Product language rule

All AI-related copy must avoid:

- 最佳房源;
- 最优选择;
- 系统推荐;
- 推荐分;
- 替你决定;
- 真房源;
- 避坑保真;
- 可以放心签约;
- 真实可靠.

Allowed:

- AI 辅助解释;
- 辅助比较;
- 条件化说明;
- 取舍分析;
- 下一步核实;
- 不代表最终推荐;
- 请自行核实.

---

## 13. Documentation requirement

Every future AI implementation phase must include a dev-log.

At minimum:

- goal;
- file scope;
- exclusions;
- validation result;
- boundary confirmation;
- commit hash.

This is important because AI integration is a sensitive boundary compared with purely local UI work.

---

## 14. Decision summary

Phase 4D-1 decisions:

1. Next phase should be type scaffold, not provider code.
2. lib/ai should not be created until types and boundaries are stable.
3. Mock provider must come before real provider.
4. Server route must use server-side keys only.
5. Real DeepSeek provider is late-stage, not immediate next step.
6. AI output should be session-only at first.
7. Settings should not change unless AI artifacts are persisted.
8. Static explanation remains fallback.
9. No page/component should call provider directly.
10. No direct DeepSeek work should start before provider boundary and mock flow are validated.

---

## 15. Acceptance criteria

Phase 4D-1 is complete only if:

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

    docs: plan ai provider implementation