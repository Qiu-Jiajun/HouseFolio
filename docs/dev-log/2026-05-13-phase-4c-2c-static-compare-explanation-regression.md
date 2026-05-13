# Phase 4C-2C：Static compare explanation panel regression

## 0. Stage summary

Phase 4C-2B implemented the first static compare explanation panel.

Commit:

    0ef598e feat: add static compare explanation panel

This regression log confirms that the implementation stays within the Phase 4C boundary.

---

## 1. Files changed in implementation

Phase 4C-2B changed only:

    src/components/compare-explanation-panel.tsx
    src/components/compare-selected-listings-panel.tsx
    src/content/zh-cn.ts

No AI provider, API route, storage layer, L2 algorithm, Settings, or local data file was added or modified.

---

## 2. Implemented behavior

The implementation adds a static auxiliary explanation panel under the existing CompareTable.

Current rendering order:

    Compare page heading
    → selected listing preview / count
    → CompareTable
    → CompareExplanationPanel
    → existing ComparisonModel preview cards

The panel is static and explains how to interpret the current comparison.

It includes:

- trade-off explanation;
- commute stability explanation;
- data completeness / risk signal explanation;
- next-step checklist;
- auxiliary comparison disclaimer.

The panel returns null if fewer than 2 comparison models are present.

---

## 3. Boundary confirmation

The implementation does not:

- call DeepSeek;
- add lib/ai;
- add an AI API route;
- build prompt execution;
- save AI output;
- add localStorage keys;
- read localStorage directly;
- read sessionStorage;
- read IndexedDB;
- read photo Blob;
- read video Blob;
- generate object URLs;
- call Amap;
- call Supabase;
- modify L2 scoring;
- modify L2 sorting;
- modify L2 filtering;
- modify ComparisonModel;
- modify CompareTable logic.

The panel only consumes existing ComparisonInput[] already produced for the Compare page.

---

## 4. Product wording confirmation

The static panel keeps HouseFolio's product boundary:

Allowed framing used:

- 辅助解释;
- 结构化比较信息;
- 理解取舍;
- 不代表最终推荐;
- 进一步核实;
- 判断置信度;
- 不构成房源推荐、真实性判断或租赁建议.

Forbidden framing avoided:

- 最佳房源;
- 最优选择;
- 系统推荐;
- 推荐分;
- 替你决定;
- 真房源;
- 避坑保真;
- 可以放心签约;
- 真实可靠.

The panel does not name a winner and does not tell the user which listing to choose.

---

## 5. Data boundary confirmation

The static panel may inspect only low-sensitive model-level signals:

- models.length;
- missingFields;
- riskFlags.

It does not inspect:

- raw notes;
- exact addresses;
- coordinates;
- Amap raw data;
- photo files;
- video files;
- AI prompt;
- AI response.

This keeps Phase 4C-2 as a static explanation layer rather than a real AI layer.

---

## 6. Build validation

The project build passed after implementation:

    npm.cmd run build

The route table still includes:

    /compare

No new route was added.

---

## 7. Manual UI validation checklist

Recommended browser check:

1. Open Portfolio.
2. Select 2–4 listings.
3. Click compare action.
4. Confirm /compare?ids=... opens.
5. Confirm CompareTable still renders.
6. Confirm the static auxiliary explanation panel appears below CompareTable.
7. Confirm the panel copy uses auxiliary wording.
8. Confirm detail links still work.
9. Confirm returning to Portfolio still works.

---

## 8. Current limitation

This is not real AI.

The panel is intentionally static.

It does not:

- generate personalized AI analysis;
- call any model provider;
- persist explanation output;
- create prompt payloads.

Real AI explanation remains a later phase and requires a separate provider boundary review.

---

## 9. Conclusion

Phase 4C-2B is valid.

It adds a safe static L3-facing explanation surface while preserving:

- L1 boundary;
- L2 comparison boundary;
- L3 no-provider boundary;
- local-first privacy boundary;
- no-recommendation product language.

Next recommended phase:

    Phase 4C-3：Static compare explanation closing checkpoint

Recommended commit message for this log:

    docs: log static compare explanation regression