# Phase 4C-3：Static compare explanation closing checkpoint

## 0. Stage summary

Phase 4C introduced a static L3-facing compare explanation surface without connecting a real AI provider.

This checkpoint closes the static compare explanation subphase.

Current latest local commits in this subphase:

    733f1e8 docs: review l3 compare explanation boundary
    fbe9669 docs: plan static compare explanation
    0ef598e feat: add static compare explanation panel
    f4f316e docs: log static compare explanation regression

Phase 4C-3 itself only writes this closing checkpoint.

---

## 1. What Phase 4C completed

Phase 4C completed four steps:

### Phase 4C-0

File:

    docs/architecture/phase-4c-0-l3-compare-explanation-boundary-review.md

Purpose:

    Define the future L3 compare explanation boundary.

Decision:

    L3 explains L2 comparison results.
    L3 does not score, sort, filter, recommend, verify, or decide.
    Real AI provider integration requires a separate review.

### Phase 4C-1

File:

    docs/architecture/phase-4c-1-static-compare-explanation-plan.md

Purpose:

    Plan a static compare explanation panel before any real AI integration.

Decision:

    Static first.
    No DeepSeek.
    No lib/ai.
    No API route.
    No prompt.
    No persistence.

### Phase 4C-2B

Files:

    src/components/compare-explanation-panel.tsx
    src/components/compare-selected-listings-panel.tsx
    src/content/zh-cn.ts

Purpose:

    Implement a static auxiliary explanation panel under CompareTable.

Implemented:

    trade-off explanation;
    commute stability explanation;
    data completeness / risk signal explanation;
    next-step checklist;
    auxiliary comparison disclaimer.

### Phase 4C-2C

File:

    docs/dev-log/2026-05-13-phase-4c-2c-static-compare-explanation-regression.md

Purpose:

    Confirm build, product wording, data boundary, and no-AI implementation boundary.

---

## 2. Current Compare page structure

The current /compare main path is:

    Portfolio selection
    → /compare?ids=...
    → selected listing data read from local listings
    → buildComparisonInputs()
    → CompareTable
    → CompareExplanationPanel
    → existing ComparisonModel preview cards

The new explanation panel is placed after CompareTable.

This preserves the intended order:

    L2 structured comparison first
    L3-facing human-readable explanation second

The explanation panel does not replace the structured table.

---

## 3. Boundary confirmation

Phase 4C did not add:

    DeepSeek integration
    lib/ai
    AI API route
    prompt builder
    AI response schema
    AI output persistence
    compare history
    localStorage key
    Settings data rights changes
    Supabase
    Amap calls
    photo Blob access
    video Blob access
    object URL generation

Phase 4C did not modify:

    L1 commute calculation
    L2 scoring
    L2 sorting
    L2 filtering
    ComparisonModel type
    CompareTable logic
    Portfolio selection persistence
    Settings export/import/clear behavior

---

## 4. Product language confirmation

The static explanation panel uses auxiliary comparison language.

Allowed positioning retained:

    辅助解释
    结构化比较信息
    理解取舍
    不代表最终推荐
    进一步核实
    判断置信度
    不构成房源推荐、真实性判断或租赁建议

Forbidden positioning avoided:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真
    可以放心签约
    真实可靠

The panel does not name a winner.

The panel does not tell the user which listing to choose.

---

## 5. Data boundary confirmation

The static panel consumes existing ComparisonInput[] passed by the Compare page.

The panel only checks:

    models.length
    missingFields
    riskFlags

The panel does not inspect:

    raw notes
    exact addresses
    coordinates
    Amap raw route data
    photo files
    video files
    AI prompt
    AI response
    third-party platform original listing content

This keeps the implementation within a static explanation boundary.

---

## 6. Build and repository status

Validation performed during Phase 4C:

    npm.cmd run build

The build passed after the static panel implementation and after the regression log.

Expected route table still includes:

    /compare

No new route was added.

At the time this checkpoint is written, the working tree should remain clean after commit.

---

## 7. Current limitation

The explanation panel is not real AI.

It is intentionally static.

It does not generate personalized AI analysis.

It does not call a model provider.

It does not persist explanation output.

It does not create prompt payloads.

This is the desired Phase 4C result.

---

## 8. Recommended next phase

The next stable phase is:

    Phase 4C-4：Phase 4C push and handoff checkpoint

or, if continuing development after pushing:

    Phase 4D-0：Real AI provider boundary review

But Phase 4D-0 should still be documentation-first.

Do not directly connect DeepSeek.

Before any real AI work, the project must separately define:

    lib/ai provider boundary
    redaction boundary
    prompt payload schema
    no-persistence default
    user confirmation copy
    Settings impact if persistence is ever added

---

## 9. Conclusion

Phase 4C static compare explanation is complete.

The project now has:

    Phase 4A: comparison model layer
    Phase 4B: Compare UI main path
    Phase 4C: static L3-facing explanation surface

without breaking:

    local-first boundary
    L1/L2/L3 separation
    no-recommendation product language
    no-AI-provider boundary
    no new data rights burden

Recommended commit message:

    docs: checkpoint static compare explanation