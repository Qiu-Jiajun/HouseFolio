# Phase 4D-6：Mock AI provider implementation

## 0. Stage summary

Phase 4D-6 implements a local deterministic mock provider for future compare explanation flow.

This stage adds:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/mock-provider-contract-check.ts
    src/lib/ai/index.ts
    docs/dev-log/2026-05-13-phase-4d-6-mock-ai-provider.md

This stage does not connect any real AI provider.

---

## 1. Goal

The goal is to introduce a provider-neutral mock boundary before any real model integration.

The mock provider consumes:

    CompareExplanationInput

and returns:

    CompareExplanationOutput

It is deterministic, local, and side-effect free.

---

## 2. Implemented files

### provider.ts

Defines:

    CompareExplanationProviderName
    CompareExplanationProvider

The provider interface is provider-neutral and does not mention any real model provider.

### mock-provider.ts

Defines:

    mockCompareExplanationProvider

The mock provider returns a structured CompareExplanationOutput using deterministic local logic.

It can count:

- selected listings;
- missing fields;
- risk flags;
- whether commute data exists;
- whether photo summary exists;
- whether subjective summary exists.

It does not score, sort, choose, rank, or verify listings.

### compare-explanation.ts

Defines:

    generateCompareExplanation()
    generateMockCompareExplanation()

Both use the provider-neutral interface.

### mock-provider-contract-check.ts

Confirms:

- mock provider satisfies provider interface;
- generation functions accept CompareExplanationInput;
- generation functions return CompareExplanationOutput;
- output type remains allowlisted;
- output type does not include final-decision or recommendation fields.

### index.ts

Exports the new provider-neutral mock flow and keeps:

    getAiProviderName() → "not-configured"

This means no real AI provider is configured.

---

## 3. Boundary confirmation

Phase 4D-6 does not add:

    DeepSeek
    real provider
    API route
    fetch call
    prompt builder
    model configuration
    provider key
    environment variable read
    localStorage key
    Settings update
    /compare UI change
    AI output persistence

It also does not read:

    raw notes
    full addresses
    coordinates
    Amap raw JSON
    photo Blob
    video Blob
    object URL
    third-party platform original listing content

---

## 4. Product language boundary

Mock output uses auxiliary language.

It avoids:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真
    可以放心签约
    真实可靠

It does not name a winner.

It does not produce ranking.

It does not tell the user which listing to choose.

---

## 5. Relationship to static panel

The current /compare UI still uses the static CompareExplanationPanel.

The mock provider is not wired into the UI yet.

This is intentional.

Current state:

    static panel remains visible
    mock provider exists only as a local library boundary
    no API route exists
    no UI trigger exists

---

## 6. Validation

Required validation:

    npm.cmd run build

Expected:

- build passes;
- no API route added;
- no DeepSeek string in src/lib/ai;
- no fetch in src/lib/ai;
- no localStorage in src/lib/ai;
- no indexedDB in src/lib/ai;
- no Settings changes;
- no /compare UI changes.

---

## 7. Next recommended phase

Next phase:

    Phase 4D-7：Mock AI provider regression checkpoint

After that, consider:

    Phase 4D-8：Mock API route boundary review

Do not jump directly to a real provider.

---

## 8. Conclusion

Phase 4D-6 adds a safe local mock provider boundary.

It is not a real AI integration.

It prepares the project for later mock API route and UI trigger work without introducing third-party provider risk.

Recommended commit message:

    feat: add mock ai compare explanation provider
