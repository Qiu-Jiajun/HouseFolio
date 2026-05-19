# Phase 4L-0：Post-real-AI product / demo readiness review

Date: 2026-05-19

## 1. Purpose

Phase 4K completed the first real DeepSeek route smoke test and the first minimal real DeepSeek browser regression.

This review decides what HouseFolio should do immediately after the real AI path has been validated.

The key conclusion is:

HouseFolio should not keep expanding AI features immediately.
The safer next direction is to return to product demonstration, portfolio presentation, and small boundary-preserving copy review.

## 2. Current stable baseline

Latest stable commit before this review:

2a1bd72 docs: add real deepseek handoff

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- Phase 4K-7 pushed to origin/main
- tracked files contained no likely real sk-* API key
- DeepSeek API key remained only in local .env.local
- .env.local remained ignored and untracked

## 3. What Phase 4K proved

Phase 4K proved that HouseFolio can complete the following chain:

Portfolio
→ select 2–4 listings
→ /compare?ids=...
→ local listings read
→ buildComparisonInputs()
→ ComparisonInput[] / ComparisonModel[]
→ CompareTable
→ AI confirmation panel
→ /api/ai/compare-explanation
→ provider selection
→ DeepSeek provider path
→ real DeepSeek response
→ session-only AI output
→ clear current AI output
→ refresh removes output

This is enough to demonstrate the L1 / L2 / L3 architecture in an interview or product portfolio setting.

## 4. What Phase 4K did not prove

Phase 4K did not prove public launch readiness.

It did not include:

- AI cost control
- rate limiting
- abuse prevention
- AI output persistence
- AI history
- AI export / delete
- Settings AI data rights
- multi-user account data boundary
- public legal policy
- production observability
- real user traffic
- multi-round real AI stress test

Therefore, the project should not claim that the real AI feature is production-ready for public operation.

## 5. Current AI boundary

The current AI path is acceptable for MVP demonstration because:

- The user must actively trigger AI.
- A confirmation panel appears before sending.
- The output is session-only.
- The output can be cleared.
- Refresh removes the output.
- Settings does not contain AI history or AI output records.
- The route uses provider selection through lib/ai boundaries.
- The DeepSeek key is server-side only and stored in local .env.local.
- No key is printed or committed.

This is enough for a portfolio demo, not enough for a public AI product.

## 6. L3 boundary that must remain unchanged

L3 is only an explanation layer for L2 comparison output.

L3 must not:

- calculate scores
- rank listings
- filter listings
- decide for the user
- judge listing authenticity
- output a final recommendation
- describe any listing as the best
- describe any listing as the optimal choice
- become a recommendation system

Allowed L3 framing:

-辅助解释
-条件化建议
-风险信号人话化
-看房 checklist
-基于当前对比结果的总结
-不代表最终推荐
-仍需用户自行判断

## 7. Recommended next direction

The recommended next direction is not more AI engineering.

The recommended next direction is:

A. Product / demo / interview presentation consolidation

This includes:

- clarifying how to present HouseFolio in interviews
- clarifying the current MVP story
- preparing a clean demo path
- explaining why the product is not a listing platform
- explaining why L3 is not a recommendation engine
- explaining why DeepSeek is used only as an explanation layer

B. Optional small Compare / AI copy review

This may include:

- checking whether Compare page copy still uses safe terms
- checking whether AI explanation copy avoids forbidden wording
- checking whether session-only AI boundary is clear to users
- checking whether “辅助比较、不代表最终推荐” remains visible

This should be copy review only unless a separate implementation plan is created.

## 8. Directions to avoid immediately

Do not immediately enter:

- AI history
- AI output persistence
- Settings AI data rights
- AI output export / delete
- cost control
- rate limiting
- public launch readiness
- Supabase
- Chrome extension
- map UI
- photo AI
- video AI
- multi-round DeepSeek stress test
- automatic prompt logging
- raw response logging

Each of those requires a separate boundary review.

## 9. Product interpretation for portfolio use

The current product story is strong enough:

HouseFolio helps renters organize self-collected candidate listings into a private decision workspace.

The product demonstrates:

- local-first data rights
- user-added listings
- commute anchors
- L1 commute / spatial reasoning foundation
- L2 reference score and comparison structure
- L3 AI explanation based on redacted structured data
- session-only AI output
- no scraping
- no listing aggregation
- no brokerage workflow
- no “true listing” certification
- no recommendation-system framing

This is coherent for a product manager portfolio project.

## 10. Suggested next phase

The next safe phase should be one of:

Phase 4L-1：Demo / interview presentation path review

or

Phase 4L-1：Compare / AI copy boundary scan

The stronger recommendation is:

Phase 4L-1：Demo / interview presentation path review

Reason:

The real DeepSeek path is now already validated. The project should convert the technical milestone into an explainable portfolio narrative before adding more engineering surface area.