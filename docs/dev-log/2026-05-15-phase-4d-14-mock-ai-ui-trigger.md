# Phase 4D-14：Mock AI UI trigger minimal implementation

## Summary

Phase 4D-14 added a minimal /compare UI trigger for the Mock AI API route.

Changed files:

- src/components/compare-selected-listings-panel.tsx
- src/content/zh-cn.ts

Added file:

- docs/dev-log/2026-05-15-phase-4d-14-mock-ai-ui-trigger.md

The UI now can:

- build redacted CompareExplanationInput from current ComparisonInput[]
- POST to /api/ai/compare-explanation
- render CompareExplanationOutput in React page state
- show loading state
- show generic error state
- keep output session-only

No output is persisted.

## Boundaries

This phase did not:

- modify the API route
- modify the mock provider
- connect DeepSeek
- write a real prompt
- modify Settings
- add localStorage keys
- persist AI output
- add AI history
- change comparison scoring
- call LBS / Amap
- read photos or videos

## Validation

npm.cmd run build passed.

Node UTF-8 checks passed:

- panel imports buildCompareExplanationInput
- panel calls /api/ai/compare-explanation
- compareMockAiExplanationCopy exists
- Chinese copy contains 模拟 AI 辅助解释

Boundary checks passed:

- no forbidden boundary matches in panel
- no forbidden boundary matches in the new zh-cn mock AI copy block
- no AI persistence key matches
- no banned risk wording matches

## Recovery note

During validation, a long git diff opened in the less pager. Some pasted text was accidentally interpreted by less and created unrelated untracked files. These accidental files were removed. No source changes were restored or discarded.

## Conclusion

Phase 4D-14 passes implementation-level validation.

The mock AI UI trigger is user-triggered, mock-only, session-only, redacted-input based, non-persistent, non-recommending, isolated from Settings, and isolated from DeepSeek.