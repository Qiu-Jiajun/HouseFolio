# Phase 4K-3｜Real DeepSeek route smoke test closing checkpoint

## Status

Phase 4K-3 is complete.

This checkpoint records the first successful real DeepSeek provider smoke test for the HouseFolio Compare AI explanation route.

## Previous stable point

```text
ba4eef0 docs: validate deepseek provider compatibility
Smoke test target

Tested route:

POST /api/ai/compare-explanation

Runtime mode:

AI_COMPARE_PROVIDER=deepseek

The API key was loaded from local .env.local. The key value is not recorded in this log.

Test method

A managed local Next.js dev server was started on a temporary smoke-test port.

The smoke test sent a redacted, synthetic Compare explanation payload with:

2 synthetic listing objects
no precise address
no coordinates
no raw route JSON
no raw prompt
no photo blob
no video blob
no private notes
no platform page content
no API key in the request body

The test used only synthetic values such as rent, area, commute minutes, reference score summary, missing field flags, and risk flags.

Success result

The real route returned a valid success response:

response.ok = true
provider = deepseek
summary length = 299
tradeoffs count = 3
commuteNotes count = 2
riskExplanations count = 1
missingFieldNotes count = 1
checklist count = 5
disclaimer length = 234

The full AI output was intentionally not pasted into the chat and is not recorded in this repository.

Boundary verification

Confirmed:

DeepSeek provider was selected by the server route.
The response shape matched CompareExplanationOutput.
The route returned structured output fields.
No full AI output was persisted.
No AI output history was created.
No localStorage key was added.
No sessionStorage key was added.
No IndexedDB store was added.
Settings was not changed.
No likely real sk-* API key pattern was found in tracked files.
git status remained clean after the smoke test.
Not included in this phase

This phase did not include:

real DeepSeek browser regression
AI output persistence
AI history
Settings AI data rights
AI output export / delete
cost or rate-limit controls
README changes
resume or interview copy changes
Chrome extension work
Product boundary

The real DeepSeek response remains part of L3 auxiliary explanation only.

It must not be treated as:

final recommendation
listing authenticity judgment
scoring engine
ranking engine
filtering engine
rental advice
user decision replacement

L1 and L2 remain responsible for spatial data and rule-based comparison. L3 only explains the already structured comparison result.

Next recommended phase

Next phase:

Phase 4K-4：Real DeepSeek browser regression plan

That phase should first define a minimal browser regression scope. It should verify that the real provider path works from the Compare UI while keeping AI output session-only and avoiding any persistence or Settings expansion.