# 2026-05-15｜Phase 4D-26｜Real AI route smoke test closing checkpoint

## 1. Phase status

Phase 4D-26 is the closing checkpoint for Phase 4D-25.

Latest stable commit before this checkpoint:

- 0a5ef0a docs: log real ai route smoke test

Confirmed status after Phase 4D-25:

- HEAD = origin/main = origin/HEAD = 0a5ef0a
- npm.cmd run build passed
- git status clean
- push succeeded

## 2. What Phase 4D-25 verified

Phase 4D-25 verified the real-provider-capable AI compare explanation API route at route level.

Verified paths:

1. Default mock provider path
2. DeepSeek provider selected but missing DEEPSEEK_API_KEY

## 3. Default mock provider path result

The default mock provider path passed.

Confirmed:

- ok = true
- provider = mock
- data.summary exists
- data.disclaimer exists
- no DeepSeek call was made
- no API key or raw provider response was exposed

Forbidden response markers checked:

- DEEPSEEK_API_KEY
- NEXT_PUBLIC_DEEPSEEK
- apiKey
- requestUrl
- rawResponse
- bestListingId
- ranking
- recommendationScore
- finalDecision
- shouldChoose

Result:

- PASS: default mock path smoke test passed

## 4. DeepSeek missing-config path result

The DeepSeek missing-config path passed.

Environment:

- AI_COMPARE_PROVIDER = deepseek
- DEEPSEEK_API_KEY was intentionally removed

Confirmed response:

- HTTP 503 Service Unavailable
- ok = false
- error.code = missing_provider_configuration
- error.message = 当前 AI 服务配置暂不可用。

Forbidden response markers checked:

- DEEPSEEK_API_KEY
- NEXT_PUBLIC_DEEPSEEK
- apiKey
- requestUrl
- rawResponse
- Authorization
- Bearer
- deepseek.com
- sk-

Result:

- PASS: DeepSeek missing-config path smoke test passed

## 5. Important implementation observations

### 5.1 Smoke payload must match the runtime validator

The route validator does not accept arbitrary ComparisonModel-like objects.

The accepted subjectiveSummary shape is:

- light
- quiet
- decoration

The following shape is invalid:

- averageRating
- highlights
- concerns

The accepted missingFields union does not include:

- photo

Invalid smoke payloads correctly returned:

- HTTP 400
- error.code = invalid_input
- error.message = Invalid compare explanation input.

This confirms request validation is active.

### 5.2 Next.js 16 dev server lock

Next.js 16 prevented running two dev servers from the same project directory at the same time.

Observed message:

- Another next dev server is already running.

To test different server-side environment variables, the previous dev server must be stopped first, then restarted with the intended environment.

For Phase 4D-25:

- default mock path used port 3210
- DeepSeek missing-config path used port 3211 after stopping the existing dev server

## 6. Boundary confirmation

Phase 4D-25 and Phase 4D-26 did not:

- perform a real DeepSeek success test
- require a DeepSeek account
- use a real DeepSeek API key
- modify Compare UI
- modify Settings
- add localStorage keys
- persist AI output
- add AI history
- add AI export or deletion
- change prompt builder
- change provider implementation
- change route implementation
- change user-facing AI trigger behavior

## 7. Current safe baseline

Current stable baseline after Phase 4D-25:

- 0a5ef0a docs: log real ai route smoke test

After this checkpoint commit, the new stable baseline should be:

- docs: close real ai route smoke test phase

## 8. Recommended next phase

The next safe phase should be:

- Phase 4E-0: Real AI user confirmation boundary review

Phase 4E-0 should only review the boundary for user confirmation before real AI calls.

It should not directly implement:

- real DeepSeek browser regression
- real AI confirmation modal
- AI output persistence
- Settings AI data section
- AI output history
- AI output export or deletion
- cost control or rate limiting
- public launch readiness

## 9. Next phase boundary

Before any real AI user-facing call, HouseFolio must define:

- what user sees before sending data to a third-party model
- what redacted data is sent
- what is not sent
- how to state that output is auxiliary and not a final recommendation
- why output remains session-only in the first implementation
- why Settings does not need AI data controls until AI artifacts are persisted

The next phase must keep L3 within its role:

- explain L2 comparison results
- generate checklist and tradeoff notes
- translate structured signals into human-readable language

L3 must not:

- score
- rank
- filter
- decide
- verify listing authenticity
- output best listing
- claim system recommendation