# Phase 4D-2：AI compare explanation type scaffold

## 0. Stage summary

Phase 4D-2 adds provider-neutral AI compare explanation types.

This stage does not implement AI.

It only adds:

    src/types/ai-compare-explanation.ts
    src/types/ai-compare-explanation-contract-check.ts
    docs/dev-log/2026-05-13-phase-4d-2-ai-compare-explanation-types.md

---

## 1. Goal

The goal is to define a narrow type boundary for future AI-generated compare explanations before any provider, prompt, API route, or UI trigger exists.

This keeps the implementation sequence conservative:

    types
    → contract checks
    → redacted input builder
    → mock provider
    → mock API route
    → UI trigger
    → real provider review
    → real provider implementation

---

## 2. Added types

Added:

    CompareExplanationLocale
    CompareExplanationCommuteSource
    CompareExplanationMissingField
    CompareExplanationRiskFlag
    CompareExplanationScoreSummary
    CompareExplanationSubjectiveSummary
    CompareExplanationListingInput
    CompareExplanationInput
    CompareExplanationOutput

These types are intentionally provider-neutral.

They do not mention DeepSeek.

They do not contain prompt fields.

They do not contain provider response fields.

They do not contain storage fields.

---

## 3. Input boundary

CompareExplanationListingInput allows only low-sensitive structured summary fields:

    listingId
    displayTitle
    rentMonthly
    areaSqm
    layout
    district
    areaLabel
    status
    commuteMinutes
    commuteSource
    lifeCircleScore
    referenceScore
    scoreSummary
    subjectiveSummary
    strengths
    weaknesses
    neutralFacts
    missingFields
    riskFlags
    hasNotes
    hasPhotos
    photoCount

This type is designed for a future redacted input builder.

It is not built from raw notes or raw listing data directly.

---

## 4. Output boundary

CompareExplanationOutput allows:

    summary
    tradeoffs
    commuteNotes
    riskExplanations
    missingFieldNotes
    checklist
    disclaimer

It explicitly avoids fields such as:

    bestListingId
    ranking
    recommendationScore
    finalDecision
    shouldChoose
    verified
    authenticityVerdict

This preserves the no-recommendation boundary.

---

## 5. Contract check

The contract check enforces:

- input types have no forbidden sensitive keys;
- listing input keys are allowlisted;
- output keys are allowlisted;
- score summary keys are allowlisted;
- subjective summary keys are allowlisted;
- no raw note fields;
- no full address fields;
- no coordinate fields;
- no Amap raw data fields;
- no photo/video Blob fields;
- no object URL fields;
- no prompt or AI response history fields;
- no final recommendation fields.

---

## 6. Exclusions

Phase 4D-2 does not add:

    lib/ai
    mock provider
    DeepSeek provider
    API route
    prompt builder
    redaction function
    UI trigger
    localStorage key
    Settings update
    AI output persistence

It does not modify:

    /compare UI
    CompareTable
    CompareExplanationPanel
    ComparisonModel
    L2 score logic
    Settings local data rights

---

## 7. Validation

Required validation:

    npm.cmd run build
    git status

Expected:

- build passes;
- only the three Phase 4D-2 files are changed;
- no lib/ai folder is created;
- no API route is added;
- no DeepSeek string appears in source code files except prior documentation if any;
- no localStorage key is added.

---

## 8. Next recommended phase

Next phase:

    Phase 4D-3：AI compare explanation redacted input builder review

Recommended approach:

- write a boundary/plan first;
- then implement a pure allowlisted builder;
- no provider;
- no API;
- no UI trigger;
- no persistence.

---

## 9. Conclusion

Phase 4D-2 creates a safe type-only foundation for future AI compare explanation.

It does not change user-facing behavior.

It does not add any network or provider dependency.

Recommended commit message:

    feat: add ai compare explanation types