# Phase 4K-6：Real DeepSeek browser regression closing checkpoint

Date: 2026-05-19

## Goal

Close the minimal real DeepSeek browser regression after Phase 4K-5.

This checkpoint records only pass/fail and boundary results. It intentionally does not record full AI output, raw prompt, raw request body, raw response body, `.env.local`, API keys, or any DeepSeek secret material.

## Stable baseline

Previous stable commit:

```text
1a78ff3 docs: plan real deepseek browser regression

Confirmed before regression:

git status clean
npm.cmd run build passed
1a78ff3 contained in origin/main
.env.local ignored by git
.env.local not shown in git status
tracked files contained no likely real sk-* API key
DeepSeek env verified only by non-sensitive shape checks
Browser regression scope

Phase 4K-5 performed one minimal real DeepSeek browser regression through the existing Compare AI flow:

Portfolio
→ select 2–4 listings
→ /compare?ids=...
→ Compare table
→ AI explanation trigger
→ confirmation panel
→ real DeepSeek provider path
→ session-only AI output
→ clear current AI output
→ refresh
→ Settings check
Regression result
AI confirmation panel appears: PASS
Real DeepSeek output appears: PASS
Provider path: deepseek
Session-only note appears: PASS
Clear current AI output works: PASS
Refresh removes output: PASS
Settings has no AI output/history: PASS
Forbidden wording found: none
Console errors: none
Confirmed product boundaries

The regression confirms the intended L3 boundary:

L3 explains L2 comparison output.
L3 does not score.
L3 does not rank.
L3 does not filter.
L3 does not decide for the user.
L3 does not judge listing authenticity.
L3 does not present a final recommendation.

The regression also confirms the current AI data boundary:

AI output is session-only.
AI output is not written to localStorage.
AI output is not written to sessionStorage.
AI output is not written to IndexedDB.
AI output is not added to Settings.
No AI history feature exists.
No AI output export/delete feature exists yet.
Explicit non-goals

This phase did not do:

No full AI output logging
No raw prompt logging
No raw request logging
No raw response logging
No API key printing
No .env.local printing
No AI output persistence
No AI history
No Settings change
No README change
No Chrome extension work
No multi-round real AI stress test
No public launch readiness claim
Follow-up

The next safe step is to keep the real DeepSeek path closed and documented before deciding whether to enter a small follow-up phase such as:

Phase 4K-7：Real DeepSeek regression handoff

or pause the AI track and return to product / demo / portfolio presentation work.

Do not expand into AI history, Settings data rights, cost control, rate limiting, Chrome extension, Supabase, or public launch readiness without a separate boundary review.