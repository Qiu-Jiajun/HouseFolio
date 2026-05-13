# Phase 4D-7：Mock AI provider regression checkpoint

## 0. Stage summary

Phase 4D-7 validates the local mock AI provider boundary added in Phase 4D-6.

This stage only writes this regression checkpoint:

    docs/dev-log/2026-05-13-phase-4d-7-mock-ai-provider-regression.md

It does not modify source code.

---

## 1. Current latest implementation commit

Phase 4D-6 implementation commit:

    f99e4dd feat: add mock ai compare explanation provider

Phase 4D-6 added:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/mock-provider-contract-check.ts
    src/lib/ai/index.ts
    docs/dev-log/2026-05-13-phase-4d-6-mock-ai-provider.md

---

## 2. Build validation

Validation command:

    npm.cmd run build

Expected result:

    build passes

The build should still include the existing app routes, including:

    /compare

No new route is expected.

---

## 3. File boundary validation

The mock provider layer exists under:

    src/lib/ai

Expected files:

    provider.ts
    mock-provider.ts
    compare-explanation.ts
    mock-provider-contract-check.ts
    compare-explanation-input.ts
    compare-explanation-input-contract-check.ts
    index.ts

No AI API route should exist:

    src/app/api/ai

Expected result:

    Test-Path src\app\api\ai
    False

---

## 4. Technical boundary validation

The mock provider must not contain:

    DeepSeek
    fetch(
    axios
    localStorage
    sessionStorage
    indexedDB
    api/ai
    createCompletion
    chat.completions
    AMAP
    Supabase
    NEXT_PUBLIC_DEEPSEEK
    process.env

Reason:

Phase 4D-6 is a local deterministic mock provider, not a real provider integration.

It must not call the network.

It must not read environment variables.

It must not use provider keys.

It must not create an API route.

---

## 5. Product language validation

The mock provider must avoid:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真
    可以放心签约
    真实可靠

Allowed language remains:

    本地模拟解释
    辅助比较
    结构化比较信息
    取舍
    进一步核实
    不代表最终推荐
    不构成房源推荐、真实性判断或租赁建议

The mock output must not name a winner.

The mock output must not rank listings.

The mock output must not tell the user which listing to choose.

---

## 6. Data persistence boundary validation

Phase 4D-6 must not add any new localStorage key.

Forbidden keys include:

    housefolio:ai-explanations
    housefolio:compare-ai-results
    housefolio:ai-history
    housefolio:prompt-history
    housefolio:compare-reports

Settings should remain unchanged.

Files that should not be modified by Phase 4D-6:

    src/lib/privacy/local-data.ts
    src/components/settings-local-data-panel.tsx
    src/app/settings/page.tsx

Reason:

Mock provider output is not persisted.

The first AI-related flow remains session-only and library-only.

---

## 7. Current mock provider behavior

The mock provider consumes:

    CompareExplanationInput

and returns:

    CompareExplanationOutput

It can compute simple local counts:

    selected listing count
    missing field count
    risk flag count
    whether commute data exists
    whether local photo summary exists
    whether subjective summary exists

It does not:

    score listings
    sort listings
    choose a winner
    verify authenticity
    infer legal risk
    infer landlord reliability
    call any model provider

---

## 8. Current UI boundary

Phase 4D-6 does not wire the mock provider into /compare UI.

Current /compare still uses:

    CompareTable
    static CompareExplanationPanel

The mock provider exists only as a library boundary.

No user-facing AI trigger exists.

No confirmation modal exists.

No generated explanation output is displayed.

This is intentional.

---

## 9. Regression conclusion

Phase 4D-6 is valid if:

    npm.cmd run build passes
    src/lib/ai mock provider files exist
    src/app/api/ai does not exist
    no forbidden technical integration is found in src/lib/ai
    no forbidden product wording is found in src/lib/ai
    no new HouseFolio AI localStorage key is added
    git status is clean after commit

The project now has:

    Phase 4D-2: AI explanation types
    Phase 4D-4: redacted explanation input builder
    Phase 4D-6: local mock explanation provider

Still not implemented:

    real provider
    DeepSeek
    AI API route
    prompt builder
    /compare AI trigger
    AI output persistence

---

## 10. Recommended next phase

Recommended next phase:

    Phase 4D-8：Mock AI API route boundary review

That phase should be documentation-first.

Do not directly add:

    src/app/api/ai/compare/explanation/route.ts

until the route boundary is reviewed.

Recommended commit message:

    docs: log mock ai provider regression