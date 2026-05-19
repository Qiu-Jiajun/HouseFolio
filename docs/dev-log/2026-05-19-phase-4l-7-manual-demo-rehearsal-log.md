# Phase 4L-7：Manual demo rehearsal log

Date: 2026-05-19

## Stable point before rehearsal

Current stable point:

```text
0797819 docs: close post real ai demo prep

Startup check confirmed before this phase:

HEAD = origin/main = origin/HEAD = 0797819
git status clean
npm.cmd run build passed
.env.local is ignored by .gitignore
.env.local is not tracked
.env.local does not appear in normal git status
AI_COMPARE_PROVIDER shape check passed
DEEPSEEK_API_KEY shape check passed without printing the key
tracked files secret scan found no likely real sk-* API key
Phase goal

Phase 4L-7 records one manual demo rehearsal path after the real DeepSeek browser regression and post-real-AI demo preparation phase.

This phase is documentation-only.

Non-goals

This phase did not:

change UI
change AI provider logic
change Settings
change README
add AI history
persist AI output
run multi-round real AI pressure tests
start Chrome plugin / Chrome extension engineering
add Supabase
perform public launch readiness work
let L3 score, rank, filter, authenticate listings, or make final recommendations
Manual rehearsal path

The following demo path was manually rehearsed:

Home /
→ Demo /demo
→ Portfolio /portfolio
→ select 2–4 listings
→ /compare?ids=...
→ CompareTable
→ static explanation panel
→ AI explanation trigger
→ AI confirmation panel
→ real DeepSeek provider output
→ session-only output notice
→ clear current AI output
→ refresh page
→ Settings data-rights check
Manual result
Checkpoint    Result
Home page loads    PASS
Demo page loads    PASS
Portfolio page loads    PASS
2–4 listings can be selected for comparison    PASS
Compare route opens with selected listing ids    PASS
CompareTable renders    PASS
Static explanation panel renders    PASS
AI trigger is visible and gated by confirmation    PASS
AI confirmation panel appears before sending    PASS
Real DeepSeek output appears    PASS
Provider path is deepseek    PASS
AI output remains session-only    PASS
Clear current AI output works    PASS
Refresh removes AI output    PASS
Settings has no AI output / AI history section    PASS
Browser console has no red runtime error during rehearsal    PASS
Boundary confirmation

The rehearsal confirmed the intended current behavior:

AI output is not saved to localStorage
AI output is not saved to sessionStorage
AI output is not saved to IndexedDB
AI output is not added to Settings
AI output is not exported
AI output is not recorded as history
raw prompt is not displayed
raw request is not displayed
raw response is not displayed
DeepSeek API key is not printed
DeepSeek API key is not committed
Product boundary confirmation

The demo language and behavior remain within the current HouseFolio boundary:

HouseFolio remains a private rental decision management tool
Compare remains auxiliary comparison
Reference Score remains a reference score, not a recommendation score
L3 AI explains L1/L2 comparison results
L3 AI does not score
L3 AI does not rank
L3 AI does not filter
L3 AI does not judge listing authenticity
L3 AI does not make a final rental decision
Phase conclusion

Phase 4L-7 is complete.

The current demo path is suitable for interview rehearsal at the present product stage, with the important caveat that it is still a personal project demo rather than public launch readiness.