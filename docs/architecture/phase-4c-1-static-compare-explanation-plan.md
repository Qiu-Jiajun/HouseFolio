# Phase 4C-1：Static compare explanation plan

## 0. Stage summary

Phase 4C-1 plans a static compare explanation panel for the future L3 layer.

This stage only writes this architecture document:

    docs/architecture/phase-4c-1-static-compare-explanation-plan.md

This stage does not implement the panel.

It does not:

- modify /compare UI;
- modify CompareTable;
- modify Portfolio selection;
- connect DeepSeek;
- add lib/ai;
- add an AI API route;
- build prompt execution;
- save AI output;
- add localStorage keys;
- modify Settings data rights;
- modify L2 scoring, sorting, filtering, or comparison logic.

The goal is to define the first safe UI-facing L3 step: a static, non-network, non-persistent explanation panel that demonstrates how L3 may explain L2 comparison output without becoming a recommendation engine.

---

## 1. Why static first

HouseFolio should not jump directly from L2 CompareTable to real AI integration.

A static explanation panel is safer because it can validate:

- where L3 explanation should appear;
- what tone and wording are acceptable;
- what data L3 should appear to explain;
- how to preserve the auxiliary-comparison boundary;
- how to avoid "best listing" or "system recommendation" language;
- how to demonstrate L3 value in the MVP without privacy or API risk.

This follows the Phase 4C-0 decision:

    L3 should sit after L2 CompareTable.
    L3 should explain ComparisonModel.
    L3 should not score, sort, filter, recommend, verify, or decide.
    Real AI provider integration requires a separate review.

---

## 2. Product goal

The future static compare explanation panel should help users understand the selected listings in plain Chinese.

It should make the L2 comparison more readable by summarizing:

- main trade-offs;
- commute vs rent tension;
- area vs budget tension;
- missing information;
- risk signals;
- what the user should verify next.

It should not tell the user which listing is best.

The intended product role is:

    L2 CompareTable = structured facts and comparison
    Static L3 explanation = human-readable interpretation of those facts
    User = final decision maker

---

## 3. Recommended UI placement

The future panel should be placed after the existing structured comparison area, not before it.

Recommended order on /compare:

    1. Compare page heading and boundary copy
    2. Selected listing preview
    3. CompareTable
    4. Static compare explanation panel
    5. Return / detail navigation

Reason:

- the structured L2 table remains the primary source of truth;
- the explanation does not replace the table;
- the user sees the underlying comparison before reading the interpretation;
- the product avoids black-box AI selector perception.

---

## 4. Panel title and framing

Recommended panel title:

    辅助解释｜基于当前对比信息

Alternative title:

    对比说明｜仅供辅助判断

Avoid:

- AI 推荐;
- 智能推荐;
- 最优选择;
- 最佳房源;
- 系统建议你选;
- AI 决策.

Recommended subtitle:

    以下说明基于当前已选房源的结构化比较信息生成，用于帮助你理解取舍，不代表最终推荐。

The first static version may avoid the word AI entirely, because no real AI is being called.

---

## 5. Static content structure

The static panel should contain four sections.

### 5.1 Trade-off summary

Purpose:

Explain the main visible trade-off among selected listings.

Example copy:

    当前几套房源的差异主要集中在租金、面积和通勤压力之间。租金较低的房源未必通勤更稳，通勤更短的房源也可能在面积或预算上有明显取舍。

Boundary:

- no listing winner;
- no final choice;
- no invented data.

### 5.2 Commute and daily routine explanation

Purpose:

Explain why commute differences matter.

Example copy:

    通勤时间会长期影响日常稳定性。如果某套房源在通勤上明显占优，可以优先核实它在噪音、采光、合同条款和居住体验上的短板是否可接受。

Boundary:

- only explain commute summaries already shown by L2;
- do not calculate new commute values;
- do not mention exact addresses or coordinates.

### 5.3 Missing fields and risk signals

Purpose:

Explain missing fields and risk signals in human language.

Example copy:

    如果某套房源缺少面积、户型、实地笔记或本机照片，当前比较的置信度会降低。建议在继续决策前补充这些字段，而不是只根据参考评分判断。

Boundary:

- do not verify authenticity;
- do not say "避坑";
- do not say "可靠" or "不可靠";
- present these as decision-confidence signals.

### 5.4 Next viewing checklist

Purpose:

Give non-sensitive next-step checks.

Example copy:

    下一次看房可以重点确认：实际通勤体验是否稳定、夜间噪音是否可接受、厨房和卫生间是否满足日常使用、合同条款是否清晰、押金和维修责任是否明确。

Boundary:

- generic checklist only;
- no legal advice;
- no brokerage action;
- no transaction assistance.

---

## 6. Data dependency rule

The first static implementation should not need any new data contract.

It can read only already-rendered comparison state, or even render generic static copy independent of selected listings.

Recommended first implementation:

    A static explanation panel rendered under CompareTable.
    It does not inspect raw notes.
    It does not inspect photos.
    It does not inspect videos.
    It does not call AI.
    It does not persist output.

If the implementation uses comparisonModels as props, it may only use:

- count of selected listings;
- visible title;
- rentMonthly;
- areaSqm;
- layout;
- commuteMinutes;
- commuteSource;
- referenceScore;
- missingFields;
- riskFlags;
- hasNotes;
- hasPhotos;
- photoCount.

It must not use:

- full notes;
- exact address;
- coordinates;
- route JSON;
- photo Blob;
- video Blob;
- object URL;
- prompt;
- AI response.

---

## 7. Component plan for next phase

If Phase 4C-2 implements this panel, the likely file should be:

    src/components/compare-explanation-panel.tsx

Possible props:

    type CompareExplanationPanelProps = {
      models: ComparisonModel[];
    };

However, the first implementation may keep the logic simple.

Recommended behavior:

- if models length is less than 2, show no explanation or show an empty-state note;
- if models length is 2 to 4, show static explanation sections;
- do not sort models;
- do not calculate new scores;
- do not infer a winner;
- do not mutate props;
- do not access browser storage;
- do not fetch.

---

## 8. Chinese copy location

Because this will be user-visible UI in a later phase, the eventual static panel copy should be added to:

    src/content/zh-cn.ts

But Phase 4C-1 does not modify zh-cn.ts.

Phase 4C-2 should decide whether to add a small compareExplanation copy group, such as:

    zhCN.compare.explanation.title
    zhCN.compare.explanation.subtitle
    zhCN.compare.explanation.tradeoffTitle
    zhCN.compare.explanation.tradeoffBody
    zhCN.compare.explanation.commuteTitle
    zhCN.compare.explanation.commuteBody
    zhCN.compare.explanation.riskTitle
    zhCN.compare.explanation.riskBody
    zhCN.compare.explanation.checklistTitle
    zhCN.compare.explanation.checklistItems
    zhCN.compare.explanation.disclaimer

The copy should remain centralized.

---

## 9. Suggested user-facing copy

Potential copy for Phase 4C-2:

Title:

    辅助解释｜基于当前对比信息

Subtitle:

    以下说明基于当前已选房源的结构化比较信息，用于帮助你理解取舍，不代表最终推荐。

Trade-off:

    当前对比的核心不是选出“最好”的房源，而是看清每套房在租金、面积、通勤和资料完整度之间的取舍。参考评分可以帮助你快速定位差异，但不能替代你的硬性条件。

Commute:

    通勤时间会长期影响日常稳定性。如果某套房源在通勤上更有优势，仍需要结合采光、噪音、合同条款和实际看房体验一起判断。

Missing fields and risk:

    缺少面积、户型、实地笔记或本机照片时，当前比较的置信度会下降。风险信号只表示需要进一步核实，不代表房源真假判断。

Checklist:

    下一步建议补充或核实：实际通勤体验、夜间噪音、采光通风、厨房卫生间状态、押金条款、维修责任和入住前费用。

Disclaimer:

    该说明仅用于辅助比较，不构成房源推荐、真实性判断或租赁建议。请自行核实房源、合同和交易信息。

---

## 10. Forbidden language

Future static panel copy must avoid:

- 最佳房源;
- 最优选择;
- 系统推荐;
- 推荐分;
- AI 推荐;
- 替你决定;
- 真房源;
- 避坑保真;
- 可以放心签约;
- 真实可靠;
- 这套最值得租;
- 你应该选择这套.

Allowed language:

- 辅助解释;
- 辅助比较;
- 当前信息;
- 取舍;
- 进一步核实;
- 置信度;
- 不代表最终推荐;
- 请自行核实;
- 如果你更重视 X，则可以优先关注 Y.

---

## 11. Risk control

### Risk: static text looks like AI output

Mitigation:

- do not call it "AI recommendation";
- do not claim it is generated by AI;
- call it "辅助解释" or "对比说明";
- keep a visible disclaimer.

### Risk: users think the system selected a winner

Mitigation:

- do not name a winner;
- do not sort listings inside the explanation;
- do not use best-choice language.

### Risk: the panel duplicates CompareTable

Mitigation:

- use the panel to explain how to interpret the table;
- do not reproduce all table values;
- focus on decision process and next checks.

### Risk: implementation becomes real AI accidentally

Mitigation:

- no fetch;
- no API route;
- no lib/ai;
- no prompt builder;
- no provider key;
- no persistence.

---

## 12. Phase 4C-2 proposed scope

Recommended next phase:

    Phase 4C-2：Static compare explanation panel implementation

File scope:

    src/components/compare-explanation-panel.tsx
    src/components/compare-selected-listings-panel.tsx
    src/content/zh-cn.ts

Potentially no other files.

Hard exclusions:

    no src/lib/ai
    no src/app/api/ai
    no DeepSeek
    no prompt code
    no localStorage key
    no Settings change
    no L2 algorithm change
    no CompareTable rewrite

Validation:

    npm.cmd run build
    manual /compare check with 2 to 4 selected listings
    confirm no AI/API/storage code added
    confirm wording avoids forbidden language
    git status clean after commit

---

## 13. Acceptance criteria for Phase 4C-1

Phase 4C-1 is complete only if:

- only this architecture document is added;
- no source code files are modified;
- no UI files are modified;
- no content file is modified;
- no AI/provider/API files are added;
- no localStorage key is added;
- npm.cmd run build passes;
- git status is clean after commit.

Recommended commit message:

    docs: plan static compare explanation