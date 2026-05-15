# Phase 4D-16｜Mock AI UI trigger closing checkpoint

Date: 2026-05-15

## Goal

Close the mock AI API route and mock AI UI trigger phase after successful browser regression and remote push.

This checkpoint documents the stable boundary before any real AI provider work.

## Current stable point

Latest stable commit:

- `70aacd4 docs: log mock ai ui trigger regression`

Confirmed:

- `HEAD = origin/main = origin/HEAD = 70aacd4`
- `git status` clean
- `70aacd4` contained in `origin/main`
- Phase 4D-15 browser regression passed
- Mock AI output remains session-only
- No AI-related localStorage key was introduced

## Completed scope in this sub-phase

The following Phase 4D items are now complete:

| Phase | Name | Status |
|---|---|---|
| Phase 4D-8 | Mock AI API route boundary review | Complete |
| Phase 4D-9 | Mock AI API route minimal implementation | Complete |
| Phase 4D-10 | Mock AI API route contract check | Complete |
| Phase 4D-11 | Mock AI API route smoke test | Complete |
| Phase 4D-12 | Mock AI provider Chinese copy encoding fix | Complete |
| Phase 4D-13 | Mock AI API route UI trigger boundary review | Complete |
| Phase 4D-14 | Mock AI UI trigger minimal implementation | Complete |
| Phase 4D-15 | Mock AI UI trigger browser regression | Complete |
| Phase 4D-16 | Mock AI UI trigger closing checkpoint | Current |

## Stable behavior

Current Compare flow:

1. User opens Portfolio.
2. User selects 2–4 listings.
3. User clicks compare selected listings.
4. App navigates to `/compare?ids=...`.
5. Compare page reads local listings.
6. Compare page builds `ComparisonInput[]`.
7. CompareTable renders L2 comparison.
8. Static explanation panel renders.
9. User manually clicks the mock AI trigger.
10. Client sends redacted comparison input to `/api/ai/compare-explanation`.
11. API route calls the mock provider only.
12. Mock AI explanation renders on the Compare page.
13. Refreshing the page clears the mock AI output.

Confirmed browser behavior:

- Mock AI generation is user-triggered.
- Mock AI output is not generated automatically.
- Mock AI output does not survive refresh.
- CompareTable remains stable after refresh.
- Static explanation panel remains stable.
- Settings does not expose any AI history or AI data section.
- No AI-related localStorage key was introduced.
- Browser console showed no red runtime error during regression.

## Boundary confirmation

Current mock AI route and UI trigger preserve the intended architecture:

- L1 still belongs to `lib/lbs`.
- L2 still belongs to `lib/algorithm`.
- L3 mock provider belongs to `lib/ai`.
- Compare UI does not call DeepSeek.
- Compare UI does not write prompt text.
- Compare UI does not persist AI output.
- Compare UI does not add localStorage keys.
- Settings is unchanged because no AI artifact is persisted.

## Explicitly not completed

The following are still not implemented and must not be claimed as complete:

- DeepSeek provider
- Real AI API route
- Real prompt builder
- Real provider environment variable handling
- Real AI confirmation dialog
- AI output persistence
- AI output history
- AI export / deletion
- Settings AI data rights coverage
- Real provider cost control
- Real provider rate limiting
- Real provider error handling
- Production AI privacy notice

## Product boundary

The current mock AI UI trigger remains an L3 explanation demo.

It does not:

- Score listings
- Rank listings
- Filter listings
- Select a final option
- Verify listing authenticity
- Replace user judgment
- Claim a best listing
- Claim a system recommendation

Allowed wording should continue to emphasize:

- Mock AI
- Auxiliary explanation
- Reference only
- User-triggered
- Not a final recommendation
- Not a true-listing verification

Forbidden positioning remains:

- Best listing
- System recommendation
- Recommendation score
- Decide for you
- True listing
- Guaranteed safe listing
- Final choice

## Files involved in the stable mock AI chain

AI types:

- `src/types/ai-compare-explanation.ts`
- `src/types/ai-compare-explanation-contract-check.ts`

Redacted input builder:

- `src/lib/ai/compare-explanation-input.ts`
- `src/lib/ai/compare-explanation-input-contract-check.ts`

AI provider layer:

- `src/lib/ai/provider.ts`
- `src/lib/ai/mock-provider.ts`
- `src/lib/ai/compare-explanation.ts`
- `src/lib/ai/mock-provider-contract-check.ts`
- `src/lib/ai/index.ts`

Mock API route:

- `src/app/api/ai/compare-explanation/route.ts`
- `src/app/api/ai/compare-explanation/route-contract-check.ts`

Compare UI:

- `src/components/compare-selected-listings-panel.tsx`
- `src/components/compare-table.tsx`
- `src/components/compare-explanation-panel.tsx`
- `src/app/compare/page.tsx`

Chinese copy:

- `src/content/zh-cn.ts`

Regression logs:

- `docs/dev-log/2026-05-15-phase-4d-9-mock-ai-api-route.md`
- `docs/dev-log/2026-05-15-phase-4d-10-mock-ai-api-route-contract-check.md`
- `docs/dev-log/2026-05-15-phase-4d-11-mock-ai-api-route-smoke-test.md`
- `docs/dev-log/2026-05-15-phase-4d-15-mock-ai-ui-trigger-browser-regression.md`

## Next recommended phase

Recommended next phase:

- Phase 4D-17: Real AI provider preflight boundary review

The next phase should still be documentation-first.

Do not directly implement DeepSeek after this checkpoint.

Before any real provider implementation, the next review must answer:

1. What exact user action triggers the real AI call?
2. What confirmation copy appears before sending data?
3. What redacted fields are allowed to leave the browser?
4. What fields are forbidden in the real prompt?
5. Which environment variables are server-only?
6. What route boundary prevents client-side key exposure?
7. What error states are safe to show to users?
8. Why AI output remains session-only in the first real-provider version?
9. Why Settings does not change until AI output persistence exists?
10. How to prevent L3 from becoming ranking, scoring, or recommendation?

## Result

Phase 4D-16 closes the mock AI UI trigger phase.

HouseFolio now has a stable mock L3 explanation chain:

Compare UI
→ redacted comparison input
→ mock API route
→ mock provider
→ session-only UI output

This is ready for a separate real AI provider boundary review, but not ready for direct DeepSeek implementation.