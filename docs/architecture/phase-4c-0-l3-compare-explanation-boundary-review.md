# Phase 4C-0：L3 compare explanation boundary review

## 0. Stage summary

Phase 4C-0 is a boundary review for the future L3 compare explanation layer.

This stage only writes this architecture document:

    docs/architecture/phase-4c-0-l3-compare-explanation-boundary-review.md

This stage does not implement any product feature.

It does not:

- connect DeepSeek;
- write an AI API route;
- write prompt execution code;
- add or modify lib/ai;
- save AI outputs;
- modify /compare UI;
- modify CompareTable;
- modify Portfolio selection;
- add localStorage keys;
- add Settings data export/import/clear behavior;
- change L2 scoring, sorting, filtering, or comparison rules.

The purpose is to define how L3 should eventually explain L2 comparison results without becoming a scoring, ranking, recommendation, crawling, verification, or brokerage system.

---

## 1. Current project context

HouseFolio has completed the L2 comparison main path:

    Portfolio selection
    → /compare?ids=...
    → local listings read on the client
    → buildComparisonInputs()
    → ComparisonModel[]
    → CompareTable horizontal comparison

The current Compare experience is still an L2 interface.

It performs:

- structured comparison;
- field decomposition;
- reference score display;
- missing field indication;
- risk signal display;
- auxiliary comparison language.

It does not perform:

- AI explanation;
- AI recommendation;
- AI ranking;
- AI scoring;
- AI checklist generation;
- DeepSeek calls;
- prompt construction;
- AI output storage.

Phase 4C should therefore start by defining the boundary between:

    L2 comparison result
    → L3 human-readable explanation

rather than directly adding an AI integration.

---

## 2. Product position

HouseFolio remains a local-first private rental decision tool for renters in mainland China.

It is not:

- a listing platform;
- a brokerage platform;
- a listing aggregation platform;
- a real-listing verification platform;
- a public listing database;
- a public photo or media library;
- an AI house-selection system.

The long-term red lines still apply:

- no scraping third-party listing pages;
- no copying Beike, 58, Xiaohongshu, Douban, or other platform content;
- no public listing library;
- no landlord side;
- no viewing appointment workflow;
- no landlord contact or brokerage matching;
- no commission, deposit, or transaction handling;
- no real-listing guarantee;
- no language implying that the system makes the final decision.

---

## 3. Three-layer boundary

HouseFolio's three-layer engine remains:

    L1 LBS:
    commute, life-circle, map, and spatial relationship calculations

    L2 Algorithm:
    reference score, sorting, filtering, comparison, and risk signals

    L3 AI:
    summary, explanation, checklist, conditional advice, and human-readable interpretation

Phase 4C must preserve this split.

L3 must not take over L1 or L2.

L3 must not:

- calculate commute time;
- calculate distance;
- geocode addresses;
- call Amap;
- calculate reference scores;
- rank listings;
- filter listings;
- decide the best listing;
- judge listing authenticity;
- verify landlord or agent claims;
- infer exact user trajectory;
- make a final recommendation.

L3 may only explain already-structured L1/L2 outputs in a controlled, privacy-aware, conditional form.

---

## 4. Should L3 sit after CompareTable?

Yes.

The safest product structure is:

    CompareTable / L2 structured comparison
    → optional L3 explanation panel
    → user reads condition-based trade-off explanation
    → user makes the final decision

L3 should not replace CompareTable.

CompareTable is the source of structured truth for the user. L3 is only an explanation layer placed after the user has already seen the comparison data.

This prevents the product from becoming a black-box AI selector.

---

## 5. Future L3 explanation goals

A future L3 compare explanation may provide:

- trade-off summary;
- condition-based decision framing;
- risk signal explanation;
- missing field explanation;
- viewing checklist;
- next-step questions;
- preference reflection based on low-sensitive summaries;
- plain-language interpretation of Reference Score breakdown.

Example allowed framing:

    If you care most about commute stability, Listing A is worth further research.
    If you care more about area and monthly budget, Listing B has a clearer trade-off.
    This is not a final recommendation. It is an auxiliary explanation based on the current structured information.

Example forbidden framing:

    Listing A is the best listing.
    The system recommends Listing A.
    Listing A has the highest recommendation score.
    You should choose Listing A.
    Listing A is the optimal choice.
    The AI will decide for you.

---

## 6. Future L3 input source

The future L3 explanation should consume a deliberately reduced explanation input derived from ComparisonModel.

It should not directly read:

- localStorage;
- IndexedDB;
- object URLs;
- photo blobs;
- video blobs;
- raw user notes;
- Amap route responses;
- AI prompt history;
- AI response history.

Recommended future data flow:

    ComparisonModel[]
    → redacted CompareExplanationInput[]
    → optional user confirmation
    → L3 provider
    → explanation result

Phase 4C-0 does not implement this flow. It only defines the boundary.

---

## 7. Fields that L3 may consume in the future

Future L3 explanation may consume these low-sensitive structured or summarized fields:

- listingId;
- title or user-defined display name;
- rentMonthly;
- areaSqm;
- layout;
- district;
- areaLabel, if already low-sensitive;
- status;
- sourcePlatform, if not used to scrape or reproduce platform content;
- commuteMinutes;
- commuteSource;
- commuteSummaries as summarized duration/distance text;
- lifeCircleScore;
- referenceScore;
- scoreBreakdown;
- subjectiveSummary;
- strengths;
- weaknesses;
- neutralFacts;
- missingFields;
- riskFlags;
- hasNotes;
- hasPhotos;
- photoCount.

Important clarification:

subjectiveSummary is allowed only when it is already non-identifying and non-raw. For example:

- "采光较好";
- "楼下可能偏吵";
- "厨房偏小";
- "用户主观评分较低";
- "缺少实地看房记录".

It must not include phone numbers, WeChat IDs, names, door numbers, contract terms, or raw chat records.

---

## 8. Fields that L3 must not consume

Future L3 explanation must not consume:

- complete note text;
- raw user notes;
- landlord or agent names;
- phone numbers;
- WeChat IDs;
- ID card numbers;
- exact door numbers;
- room numbers;
- building numbers;
- unit numbers;
- full street address with precise door-level detail;
- exact work or school address;
- latitude;
- longitude;
- coordinates;
- Amap raw route JSON;
- Amap POI raw JSON;
- request URL;
- API key;
- Amap key;
- prompt history;
- raw AI response history;
- photo Blob;
- video Blob;
- object URL;
- image base64;
- thumbnail base64;
- IndexedDB internal key;
- third-party platform original listing body;
- third-party platform images;
- third-party listing screenshots as AI input.

Reason:

These fields either create privacy risk, third-party content risk, platform dependency risk, or model overreach risk. L3 does not need them to explain a structured comparison.

---

## 9. Notes and subjective information boundary

L3 should not read full user notes in the first implementation.

The safer path is:

    raw note
    → local redaction or manual summary
    → non-identifying subjectiveSummary
    → L3 explanation

Examples of allowed non-identifying subjective semantics:

- "采光很好";
- "楼下夜里可能吵";
- "厨房太小";
- "电梯老旧";
- "房间有霉味";
- "用户更在意地铁距离";
- "用户对安静程度评分较低".

Examples of forbidden raw note fragments:

- "中介张三电话 138...";
- "房东微信 xxx";
- "3 号楼 2 单元 1201";
- "合同写押一付三，违约金...";
- "身份证照片已拍";
- "门牌号是...".

This boundary preserves decision meaning without exposing sensitive identifiers.

---

## 10. Photo and video boundary

Current Compare only uses photo summary fields:

- hasPhotos;
- photoCount.

Future L3 may mention the existence or absence of photos only as a low-sensitive signal.

Allowed examples:

    This listing has local viewing photos, so it may be easier to review later.
    This listing has no local viewing photos, so the on-site memory may be weaker.

Forbidden behavior:

- reading photo Blob;
- generating object URLs;
- reading IndexedDB;
- analyzing photos;
- analyzing video;
- extracting layout from images;
- performing OCR;
- detecting faces;
- reading EXIF;
- transcribing audio;
- using landlord or agent media as prompt input.

Photo and video analysis requires a separate future boundary review and is not part of Phase 4C.

---

## 11. Address and commute boundary

L3 may consume commute summaries already produced by L1/L2, such as:

- commuteMinutes;
- commuteSource;
- summarized commute duration;
- summarized commute pressure;
- relative commute trade-off.

L3 must not consume:

- exact coordinates;
- origin/destination coordinates;
- exact full address;
- precise work/school address;
- raw route JSON;
- route steps;
- polyline;
- transfer details beyond summarized text;
- request URLs.

L1 calculates spatial facts. L3 explains those facts.

---

## 12. L2 and L3 boundary in comparison

L2 remains responsible for:

- Reference Score;
- comparison model;
- field normalization;
- sorting;
- filtering;
- structured risk signal generation;
- missing field detection;
- score breakdown.

L3 may explain:

- why a score difference matters;
- what a missing field means for decision confidence;
- what trade-offs exist between selected listings;
- what the user should verify next;
- how to interpret riskFlags in plain Chinese.

L3 must not:

- change scores;
- generate new scores;
- reorder listings;
- declare a winner;
- override L2 risk flags;
- invent facts absent from ComparisonModel;
- hallucinate POI, commute, market, or landlord information.

---

## 13. AI output language policy

AI output must use conditional, auxiliary, and non-final language.

Allowed:

- "如果你更重视通勤稳定，A 更值得继续研究。"
- "如果你更重视面积和预算，B 的取舍更明显。"
- "当前信息更适合做辅助比较，不代表最终选择。"
- "这条风险信号建议你下次看房时核实。"
- "由于缺少实地笔记，这套房的判断置信度较低。"

Forbidden:

- "最佳房源";
- "最优选择";
- "系统推荐";
- "推荐分";
- "替你决定";
- "你应该选择";
- "房源真实可靠";
- "已经避坑";
- "可以放心签约".

Every future L3 explanation panel should include a visible disclaimer:

    AI 解释仅基于当前结构化信息生成，用于辅助比较，不代表最终推荐。请自行核实房源、合同和交易信息。

---

## 14. User confirmation boundary

If future phases call a real AI provider, the call must be user-triggered.

No automatic L3 generation.

Before real AI generation, the UI should show a confirmation explaining:

- what data will be sent;
- that the payload is a redacted structured summary;
- that no full address, phone number, WeChat ID, ID card number, photo, or video should be sent;
- that AI output is only for auxiliary explanation;
- that the user remains responsible for final verification and decision.

Recommended confirmation copy:

    本次 AI 解释会基于已选房源的脱敏结构化比较信息生成，包括租金、面积、户型、通勤摘要、参考评分、缺失字段和风险信号。请不要输入手机号、微信号、身份证号、完整门牌号、合同原文、照片或视频。AI 解释仅用于辅助比较，不代表最终推荐。

Phase 4C-0 does not add this UI. It only defines the future requirement.

---

## 15. AI output storage boundary

Phase 4C-0 does not save AI output.

The safest first implementation path is:

    no persistent AI output storage

Future options:

1. Session-only explanation:
   - easiest;
   - no new localStorage key;
   - no Settings update required.

2. User-saved explanation:
   - requires explicit save action;
   - requires a new local data key;
   - requires Settings export/import/clear coverage;
   - requires privacy documentation;
   - requires delete control.

3. Cloud-saved explanation:
   - not suitable for current MVP;
   - requires stronger privacy policy and user consent;
   - should be deferred.

Recommendation:

First L3 explanation implementation should not persist AI output. It should generate or display a static/mock explanation first, then review persistence only if necessary.

---

## 16. Static mock before real AI

Phase 4C should not directly connect DeepSeek.

Recommended roadmap:

### Phase 4C-0

Write boundary review only.

### Phase 4C-1

Write static mock explanation plan.

Define:

- mock explanation content;
- input assumptions;
- UI placement;
- no API;
- no prompt;
- no storage;
- no Settings changes.

### Phase 4C-2

Implement static explanation panel.

Rules:

- no DeepSeek;
- no lib/ai provider;
- no prompt generation;
- no network call;
- no AI output persistence;
- no /compare route redesign.

### Phase 4C-3

Regression check.

Verify:

- build passes;
- CompareTable still works;
- no new localStorage key;
- no AI/API code;
- no sensitive fields used;
- product language remains auxiliary.

### Phase 4C-4

Only then review real AI provider boundary.

Real provider integration should require a separate architecture review.

---

## 17. Whether lib/ai should be added now

No.

Phase 4C-0 should not add lib/ai.

A future lib/ai boundary may include:

- provider interface;
- redaction helper;
- prompt builder;
- explanation schema;
- provider registry;
- mock provider;
- real provider.

But adding lib/ai before the explanation boundary is stable would invite premature API work.

Current decision:

    Do not add lib/ai in Phase 4C-0.

---

## 18. Whether /compare UI should change now

No.

Phase 4C-0 must not change:

- src/app/compare/page.tsx;
- src/components/compare-selected-listings-panel.tsx;
- src/components/compare-table.tsx;
- src/components/portfolio-list.tsx;
- src/components/listing-card.tsx;
- src/content/zh-cn.ts.

Future UI work may add a separate explanation panel after CompareTable, but that belongs to a later phase.

---

## 19. Whether Settings data rights need updates now

No.

Because Phase 4C-0 only writes an architecture document and does not add storage.

Settings updates are only required if a later phase adds:

- AI output storage;
- AI prompt history;
- explanation history;
- saved compare reports;
- new localStorage keys;
- IndexedDB AI artifacts;
- cloud-synced AI results.

If future AI outputs are persisted, the following must be updated:

- src/lib/privacy/local-data.ts;
- Settings local data snapshot;
- JSON export;
- JSON import whitelist;
- clear local data behavior;
- user-facing privacy explanation.

---

## 20. Risk analysis

### Risk 1: L3 becomes recommendation system

Mitigation:

- use conditional language;
- keep Reference Score as auxiliary;
- forbid "best", "recommendation", and final-decision language;
- keep L2 scores visible.

### Risk 2: L3 consumes sensitive data

Mitigation:

- derive a redacted explanation input from ComparisonModel;
- do not read raw notes;
- do not read photos/videos;
- do not read coordinates or full addresses;
- require explicit user trigger and confirmation.

### Risk 3: L3 hallucinates facts

Mitigation:

- prompt must instruct the model to only use supplied fields;
- explanation schema should distinguish "known facts" from "suggested next checks";
- output should mention missing fields rather than inventing them.

### Risk 4: L3 creates new data rights burden

Mitigation:

- first version should not save AI output;
- persistence requires a separate review and Settings update.

### Risk 5: L3 weakens L2 explainability

Mitigation:

- L3 sits after CompareTable;
- L2 data remains visible;
- AI explanation cannot hide or override the structured table.

---

## 21. Phase 4C-0 decision summary

Phase 4C-0 decisions:

1. L3 should sit after L2 CompareTable.
2. L3 should explain ComparisonModel, not replace it.
3. L3 may consume only low-sensitive structured summaries.
4. L3 must not consume raw notes, full addresses, coordinates, photos, videos, object URLs, Amap raw data, prompt history, or AI response history.
5. L3 must not score, sort, filter, recommend, verify, or decide.
6. L3 output must use conditional auxiliary language.
7. First implementation should be static/mock before any real AI provider.
8. Real AI integration requires a separate provider boundary review.
9. No AI output should be persisted in the first implementation.
10. Phase 4C-0 itself modifies no code and adds no feature.

---

## 22. Acceptance criteria

This phase is complete only if:

- only this document is added;
- no code files are modified;
- no /compare UI files are modified;
- no lib/ai files are added;
- no API routes are added;
- no DeepSeek or AI provider code is added;
- no localStorage key is added;
- npm.cmd run build passes;
- git status is clean after commit.

Recommended commit message:

    docs: review l3 compare explanation boundary