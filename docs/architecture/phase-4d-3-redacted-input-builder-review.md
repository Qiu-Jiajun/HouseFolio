# Phase 4D-3：AI compare explanation redacted input builder review

## 0. Stage summary

Phase 4D-3 reviews the boundary for a future redacted input builder.

This stage only writes this architecture document:

    docs/architecture/phase-4d-3-redacted-input-builder-review.md

This stage does not implement the builder.

It does not:

- add src/lib/ai;
- connect DeepSeek;
- add API routes;
- write prompt builder code;
- write provider code;
- write mock provider code;
- store AI output;
- add localStorage keys;
- modify Settings;
- modify /compare UI;
- modify CompareTable;
- modify L2 comparison logic.

The goal is to decide how a future pure builder should convert existing ComparisonInput[] into CompareExplanationInput safely.

---

## 1. Current baseline

Current latest stable commit:

    1c8d7ac feat: add ai compare explanation types

Current AI-related foundation:

    src/types/ai-compare-explanation.ts
    src/types/ai-compare-explanation-contract-check.ts

Current Compare foundation:

    src/lib/algorithm/comparison.ts
    src/types/comparison.ts
    src/components/compare-selected-listings-panel.tsx
    src/components/compare-table.tsx
    src/components/compare-explanation-panel.tsx

Current /compare behavior:

    Portfolio selection
    → /compare?ids=...
    → local listings read on client
    → buildComparisonInputs()
    → CompareTable
    → static CompareExplanationPanel

No real AI provider exists.

No AI API route exists.

No lib/ai folder exists.

No AI output is persisted.

---

## 2. Why a redacted input builder is needed

A future AI provider should not receive raw ComparisonInput[] directly.

Reason:

ComparisonInput is already relatively narrow, but it is still a product-side comparison structure. It may evolve over time, and future fields may be added for UI or internal comparison that are not appropriate for AI payloads.

Therefore, HouseFolio needs a separate builder:

    ComparisonInput[]
    → allowlisted redacted builder
    → CompareExplanationInput

The builder should act as a safety gate between L2 Compare data and L3 AI explanation.

It should not be a convenience mapper only. It is a privacy and product-boundary component.

---

## 3. Placement decision

The future builder should live under:

    src/lib/ai

Recommended future files:

    src/lib/ai/compare-explanation-input.ts
    src/lib/ai/compare-explanation-input-contract-check.ts

Reason:

- the builder prepares input for an AI explanation use case;
- it belongs to the L3 boundary, not L2 algorithm;
- it should not pollute src/lib/algorithm;
- it should remain provider-neutral;
- it can later be reused by mock provider and real provider.

However, Phase 4D-3 does not create src/lib/ai.

The next implementation phase may create src/lib/ai only for this pure builder, not for provider code.

---

## 4. Future builder role

The future builder should do exactly one thing:

    Take ComparisonInput[] and return CompareExplanationInput.

It should be:

- pure;
- synchronous;
- deterministic;
- provider-neutral;
- side-effect free;
- allowlist-based;
- testable by TypeScript contract check.

It must not:

- call AI;
- call fetch;
- call API routes;
- access localStorage;
- access sessionStorage;
- access IndexedDB;
- access photos;
- access videos;
- read notes directly;
- read routes directly;
- read env variables;
- create prompts;
- persist output.

---

## 5. Input source

The builder should accept only existing L2 comparison models:

    ComparisonInput[]

It should not accept:

- Listing[];
- StoredCommuteResult[];
- raw localStorage values;
- raw note store;
- photo storage results;
- IndexedDB objects;
- URL query values;
- Amap route responses;
- AI history.

Reason:

ComparisonInput is already the result of the L2 comparison selector. It is the correct boundary object for L3 explanation.

The builder should be downstream of:

    buildComparisonInputs()

not parallel to it.

---

## 6. Output target

The builder should output:

    CompareExplanationInput

from:

    src/types/ai-compare-explanation.ts

Required shape:

    {
      locale: "zh-CN";
      generatedAt: string;
      listings: CompareExplanationListingInput[];
    }

generatedAt can be the local generation timestamp for the input object.

It is not an AI output timestamp.

It does not imply persistence.

---

## 7. Field allowlist

The future builder may copy or derive only these fields from ComparisonInput:

### Basic fields

- listingId → listingId
- title → displayTitle
- rentMonthly → rentMonthly
- areaSqm → areaSqm
- layout → layout
- district → district
- areaLabel → areaLabel
- status → status

### L1 / commute fields

- commuteMinutes → commuteMinutes
- commuteSource → commuteSource
- lifeCircleScore → lifeCircleScore

### L2 fields

- referenceScore → referenceScore
- scoreBreakdown → scoreSummary
- strengths → strengths
- weaknesses → weaknesses
- neutralFacts → neutralFacts
- missingFields → missingFields
- riskFlags → riskFlags

### User-data summary fields

- subjectiveSummary → subjectiveSummary
- hasNotes → hasNotes
- hasPhotos → hasPhotos
- photoCount → photoCount

These are acceptable because they are structured summaries or low-sensitive flags.

---

## 8. Explicitly forbidden fields

The builder must never introduce or pass through:

- raw notes;
- full notes;
- chat records;
- landlord names;
- agent names;
- phone numbers;
- WeChat IDs;
- ID card numbers;
- complete address;
- full street address;
- precise door number;
- room number;
- building number;
- unit number;
- exact work address;
- exact school address;
- latitude;
- longitude;
- coordinates;
- origin coordinate;
- destination coordinate;
- Amap raw route JSON;
- Amap POI raw JSON;
- request URL;
- route steps;
- polyline;
- API key;
- prompt;
- AI response;
- photo Blob;
- video Blob;
- object URL;
- image base64;
- thumbnail base64;
- EXIF;
- third-party listing body;
- third-party platform image;
- third-party screenshot.

The builder must remain an allowlist mapper. It should not accept broad objects and strip forbidden fields afterwards.

---

## 9. Missing fields and risk flags

The builder may pass existing missingFields and riskFlags from ComparisonInput.

But it must not create new risk flags as source of truth.

Reason:

Risk flag generation belongs to L2.

L3 input builder may preserve L2 risk signals for explanation.

It must not invent new signals.

Allowed:

    riskFlags: model.riskFlags

Forbidden:

    infer a new "suspicious landlord" flag
    infer authenticity risk
    infer contract risk from free text
    infer legal risk from notes
    infer hidden location risk from address

Future AI can explain riskFlags, but it must not become the authoritative detector.

---

## 10. Score summary mapping

If ComparisonInput contains scoreBreakdown, the builder may convert it into CompareExplanationScoreSummary.

Allowed fields:

    commute
    rent
    lifeCircle
    subjective

The builder should not create:

- recommendation score;
- final score;
- ranking;
- winner flag;
- best listing ID.

The score summary is only for explanation.

---

## 11. Subjective summary mapping

The builder may preserve non-identifying subjective scores:

    light
    quiet
    decoration

The builder must not include:

- raw text notes;
- chat fragments;
- landlord names;
- exact apartment details;
- sensitive personal information.

Subjective scores are acceptable because they are structured user-provided ratings.

---

## 12. Photo boundary

The builder may include only:

    hasPhotos
    photoCount

It must not include:

- photo IDs;
- photo filenames;
- object URLs;
- local storage keys;
- IndexedDB keys;
- image blobs;
- thumbnails;
- base64;
- EXIF;
- visual analysis result.

The AI explanation may later say:

    This listing has local viewing photos.

It must not analyze the photos.

---

## 13. Notes boundary

The builder may include only:

    hasNotes

It must not include:

- note text;
- note excerpts;
- note summaries unless a separate redaction pipeline exists;
- note IDs;
- note storage keys;
- chat records;
- contract clauses.

Current decision:

Do not include note content in the first builder.

Future note-summary work requires a separate boundary review.

---

## 14. GeneratedAt boundary

generatedAt should be included for traceability of the input object.

But it must not be used as:

- persistent history;
- audit log;
- AI output metadata;
- provider response timestamp.

It is merely a volatile timestamp for the current generated input.

---

## 15. Locale boundary

The first version should only support:

    locale: "zh-CN"

Do not add dynamic locale support now.

Reason:

HouseFolio current user-facing UI is zh-CN-first.

Adding i18n complexity is not part of Phase 4D.

---

## 16. Contract check requirements

Future implementation should include:

    src/lib/ai/compare-explanation-input-contract-check.ts

It should verify:

1. builder return type is CompareExplanationInput.
2. listing input keys remain allowlisted.
3. output contains no forbidden sensitive keys.
4. no raw note keys appear.
5. no address / coordinate keys appear.
6. no Amap raw keys appear.
7. no photo/video binary keys appear.
8. no prompt / AI response keys appear.
9. no recommendation-result keys appear.

It may reuse the forbidden key patterns from:

    src/types/ai-compare-explanation-contract-check.ts

---

## 17. Implementation phase proposal

Recommended next phase:

    Phase 4D-4：AI compare explanation redacted input builder implementation

Possible file scope:

    src/lib/ai/compare-explanation-input.ts
    src/lib/ai/compare-explanation-input-contract-check.ts
    src/lib/ai/index.ts
    docs/dev-log/2026-05-13-phase-4d-4-redacted-input-builder.md

Allowed in that implementation:

- create src/lib/ai;
- create pure builder;
- create contract check;
- export builder from src/lib/ai/index.ts.

Still forbidden:

- provider code;
- mock provider;
- DeepSeek provider;
- API route;
- prompt builder;
- UI trigger;
- localStorage;
- Settings changes.

---

## 18. Proposed future function

Potential function:

    buildCompareExplanationInput(models: ComparisonInput[]): CompareExplanationInput

Potential helper:

    buildCompareExplanationListingInput(model: ComparisonInput): CompareExplanationListingInput

Default behavior:

- copy allowlisted fields;
- map title to displayTitle;
- map scoreBreakdown to scoreSummary;
- map missingFields and riskFlags as-is;
- generatedAt = new Date().toISOString();
- locale = "zh-CN".

No mutation.

No sorting.

No filtering.

No scoring.

No recommendation.

---

## 19. Validation checklist for future implementation

Future implementation should run:

    npm.cmd run build

And check:

- no fetch in src/lib/ai;
- no localStorage in src/lib/ai;
- no indexedDB in src/lib/ai;
- no DeepSeek;
- no NEXT_PUBLIC_DEEPSEEK;
- no API route;
- no prompt;
- no AI response storage;
- no Settings changes;
- /compare still works;
- static explanation panel unchanged.

---

## 20. Decision summary

Phase 4D-3 decisions:

1. A redacted input builder is necessary before mock or real provider work.
2. The builder should live under src/lib/ai in the implementation phase.
3. The builder should accept ComparisonInput[] only.
4. The builder should output CompareExplanationInput only.
5. The builder must use allowlisting.
6. The builder must not read raw notes, addresses, coordinates, photos, videos, localStorage, IndexedDB, Amap raw data, or AI history.
7. The builder must not generate new scores, rankings, winners, or recommendations.
8. The builder may include hasNotes, hasPhotos, and photoCount only as low-sensitive summary signals.
9. The next implementation phase may create src/lib/ai, but only for pure input-building code.
10. Provider, API, prompt, UI trigger, persistence, and DeepSeek remain out of scope.

---

## 21. Acceptance criteria

Phase 4D-3 is complete only if:

- only this architecture document is added;
- no source code files are modified;
- no src/lib/ai folder is created;
- no API route is added;
- no DeepSeek integration is added;
- no prompt builder is added;
- no localStorage key is added;
- no Settings file is modified;
- no /compare UI file is modified;
- npm.cmd run build passes;
- git status is clean after commit.

Recommended commit message:

    docs: review redacted ai input builder