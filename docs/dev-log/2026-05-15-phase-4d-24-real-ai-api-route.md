# Phase 4D-24｜Real AI API route minimal integration

Date: 2026-05-15

## Goal

Make `/api/ai/compare-explanation` real-provider-capable while keeping the current default route behavior mock-first.

This phase changes route internals only.

## Scope

Changed files:

- `src/app/api/ai/compare-explanation/route.ts`
- `src/app/api/ai/compare-explanation/route-contract-check.ts`

Added dev-log:

- `docs/dev-log/2026-05-15-phase-4d-24-real-ai-api-route.md`

## What changed

The route now supports server-side provider selection:

- default provider remains `mock`
- `AI_COMPARE_PROVIDER=deepseek` enables DeepSeek path
- provider label remains truthful
- missing DeepSeek configuration returns a safe error
- response shape remains `ok/provider/data` or `ok/error`
- request validation remains in route
- forbidden-key rejection remains in route

## What did not change

This phase did not change:

- Compare UI
- Settings
- localStorage
- privacy local-data registry
- AI output persistence
- AI history
- browser trigger behavior
- L2 scoring
- LBS
- photos or videos

## DeepSeek account note

The current user has not registered a DeepSeek API account.

That is acceptable for this phase because:

- default route behavior remains mock
- DeepSeek path is configuration-gated
- no real browser smoke test is claimed
- real provider path requires later configured environment and separate smoke test

## Boundary confirmation

The route still accepts only redacted `CompareExplanationInput`.

The route still rejects forbidden sensitive fields.

The route does not return raw provider response, prompt text, provider request URL, API key, stack trace, or provider internals.

The route does not persist AI output.

## Result

Phase 4D-24 makes the route real-provider-capable without exposing real AI to the browser by default.

Recommended next phase:

- Phase 4D-25: Real AI API route smoke test with mock/default path and DeepSeek-missing-config path