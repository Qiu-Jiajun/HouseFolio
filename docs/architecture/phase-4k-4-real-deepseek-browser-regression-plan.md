# Phase 4K-4｜Real DeepSeek browser regression plan

## Status

Phase 4K-4 is a planning checkpoint.

This phase defines the minimal browser regression scope for testing the real DeepSeek provider path from the Compare UI.

It does not run the browser regression itself.

## Previous stable point

```text
a1c0303 docs: log real deepseek route smoke

Phase 4K-3 confirmed that the server route can successfully call the real DeepSeek provider:

POST /api/ai/compare-explanation
provider = deepseek
response.ok = true
Regression goal

Verify that the existing Compare UI can trigger the real DeepSeek provider path through the browser while preserving the current privacy and product boundaries.

The regression should confirm:

Portfolio selection still works.
Compare page still loads with 2–4 listings.
AI confirmation panel appears before sending.
The user must explicitly confirm before real provider call.
Real DeepSeek output appears in the Compare UI.
Output remains session-only.
Clear current AI output still works.
Refresh does not retain AI output.
Settings does not expose AI output or AI history.
No AI output is written to localStorage, sessionStorage, IndexedDB, or tracked files.
No API key is exposed in browser UI or repository files.
Required environment

Before running the browser regression:

AI_COMPARE_PROVIDER=deepseek
DEEPSEEK_API_KEY=<local .env.local only>

The key must stay in .env.local.

Do not paste the key into chat.
Do not commit the key.
Do not print the key.
Do not screenshot the key.

Dev server requirement

The browser regression must start a fresh dev server after .env.local is configured:

npm.cmd run dev -- --port 3222

The regression should use:

http://localhost:3222

If the port is occupied, clear the stale Node process first. Do not change application code just because the port is occupied.

Minimal browser regression path

Use one browser session only.

Open http://localhost:3222/portfolio.
Select 2–4 listings.
Click the Compare action.
Confirm that /compare?ids=... loads.
Confirm that the Compare table renders.
Confirm that the static explanation panel renders.
Open the AI auxiliary explanation section.
Click “生成 AI 辅助解释”.
Confirm that the pre-send confirmation panel appears.
Confirm the copy explains what may be sent and what will not be sent.
Click “确认并生成 AI 辅助解释”.
Wait for the real DeepSeek output to appear.
Confirm that the output is visible but do not copy the full output into chat.
Confirm that the session-only note appears.
Confirm that “清除本次 AI 输出” appears.
Click “清除本次 AI 输出”.
Confirm that the AI output disappears.
Confirm that the generation button can be used again.
Refresh the page.
Confirm that the AI output is not retained.
Open Settings.
Confirm there is no AI output / AI history persistence area.
What to record

The browser regression log should record only verification results such as:

AI confirmation panel appears: PASS
Real DeepSeek output appears: PASS
Provider path: deepseek
Session-only note appears: PASS
Clear current AI output works: PASS
Refresh removes output: PASS
Settings has no AI output/history: PASS
Console errors: none / details

Do not record:

full AI output
.env.local
API key
raw provider response
raw prompt
model raw JSON
screenshots that expose sensitive content
Boundary

This phase and the next browser regression must not add:

AI output persistence
AI history
Settings AI data rights
AI output export / delete
localStorage AI keys
sessionStorage AI keys
IndexedDB AI stores
Supabase integration
README changes
resume changes
Chrome extension work
Product boundary

Real DeepSeek output remains L3 auxiliary explanation.

It must not be treated as:

final recommendation
listing authenticity judgment
scoring engine
ranking engine
filtering engine
rental advice
user decision replacement

L1 and L2 remain responsible for spatial data and rule-based comparison. L3 only explains the already structured comparison result.

Cost boundary

The regression should use only one successful real browser generation.

Do not repeatedly click the generate button.
Do not run broad browser testing against the real provider.
Do not run load tests.
Do not test many listing combinations.

If the real provider path fails, capture only the error code / UI state / console summary, then stop.

Next phase

Next phase:

Phase 4K-5：Real DeepSeek browser regression

That phase should run exactly the minimal browser regression defined above and then write a closing log if it passes.