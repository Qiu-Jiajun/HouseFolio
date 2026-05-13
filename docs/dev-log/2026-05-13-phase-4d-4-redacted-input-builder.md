# Phase 4D-4：AI compare explanation redacted input builder

## 0. Stage summary

Phase 4D-4 implements a pure redacted input builder for future AI compare explanation.

This stage adds:

    src/lib/ai/compare-explanation-input.ts
    src/lib/ai/compare-explanation-input-contract-check.ts
    src/lib/ai/index.ts
    docs/dev-log/2026-05-13-phase-4d-4-redacted-input-builder.md

This stage does not connect any AI provider.

---

## 1. Goal

The goal is to safely convert existing L2 comparison data into a narrow L3 explanation input shape:

    ComparisonInput[]
    → buildCompareExplanationInput()
    → CompareExplanationInput

This is an allowlisted mapper, not a provider integration.

---

## 2. Implementation

Added:

    buildCompareExplanationInput(models, generatedAt?)
    buildCompareExplanationListingInput(model)

The builder is:

- pure;
- synchronous;
- deterministic except generatedAt default timestamp;
- provider-neutral;
- side-effect free;
- allowlist-based.

It does not:

- call fetch;
- call AI;
- create prompts;
- access localStorage;
- access sessionStorage;
- access IndexedDB;
- read photos;
- read videos;
- read raw notes;
- read environment variables;
- persist output.

---

## 3. Data mapping

Allowed mappings:

    model.listingId → listingId
    model.title → displayTitle
    model.rentMonthly → rentMonthly
    model.areaSqm → areaSqm
    model.layout → layout
    model.district → district
    model.areaLabel → areaLabel
    model.status → status
    model.commuteMinutes → commuteMinutes
    model.commuteSource → commuteSource
    model.lifeCircleScore → lifeCircleScore
    model.referenceScore → referenceScore
    model.scoreBreakdown → scoreSummary
    model.subjectiveSummary → subjectiveSummary
    model.strengths / weaknesses / neutralFacts → string labels
    model.missingFields → missingFields
    model.riskFlags → riskFlags
    model.hasNotes → hasNotes
    model.hasPhotos → hasPhotos
    model.photoCount → photoCount

scoreSummary only extracts:

    commuteScore → commute
    rentScore → rent
    lifeCircleScore → lifeCircle
    subjectiveScore → subjective

It does not expose totalScore or ranking.

---

## 4. Boundary confirmation

This implementation does not include:

    DeepSeek
    mock provider
    real provider
    API route
    prompt builder
    model output generation
    AI output persistence
    localStorage key
    Settings update
    /compare UI change
    CompareTable change

It also does not include:

    raw notes
    full addresses
    coordinates
    Amap raw JSON
    photo Blob
    video Blob
    object URL
    image base64
    AI prompt
    AI response history
    third-party platform original listing content

---

## 5. Existing src/lib/ai note

Before this phase, src/lib/ai already existed with a minimal index.ts exposing:

    getAiProviderName() → "not-configured"

Phase 4D-4 preserves that function and adds provider-neutral builder exports.

This does not configure an AI provider.

---

## 6. Contract check

Added:

    src/lib/ai/compare-explanation-input-contract-check.ts

The contract check confirms:

- builder accepts ComparisonInput[];
- builder returns CompareExplanationInput;
- listing builder accepts ComparisonInput;
- listing builder returns CompareExplanationListingInput;
- explanation input keys are allowlisted;
- listing input keys are allowlisted;
- output keys remain non-recommendational;
- score summary keys are allowlisted;
- subjective summary keys are allowlisted;
- forbidden keys such as notes, address, coordinates, raw JSON, photo/video Blob, object URL, prompt, AI response, bestListingId, ranking, recommendationScore, and finalDecision are not present in the AI explanation types.

---

## 7. Validation

Required validation:

    npm.cmd run build

Expected:

- build passes;
- no provider code exists;
- no API route exists;
- no DeepSeek code exists;
- no UI behavior changes;
- no localStorage key is added.

---

## 8. Next recommended phase

Next phase:

    Phase 4D-5：Mock AI provider boundary review

Do not jump directly to DeepSeek.

Mock provider should come before real provider.

The mock provider should consume CompareExplanationInput and return CompareExplanationOutput deterministically.

---

## 9. Conclusion

Phase 4D-4 creates the first safe src/lib/ai implementation boundary.

It is not an AI integration.

It is a redacted input preparation layer for future AI explanation work.

Recommended commit message:

    feat: add redacted ai explanation input builder