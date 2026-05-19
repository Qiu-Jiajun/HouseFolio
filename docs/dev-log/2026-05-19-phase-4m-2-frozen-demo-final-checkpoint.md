# Phase 4M-2｜Frozen demo final checkpoint / project source handoff

Date: 2026-05-19
Phase: 4M-2
Type: Final checkpoint / Project Source handoff
Status: Frozen demo handoff closed

## 0. New conversation startup note

We continue the HouseFolio project.

Current latest stable point is:

    30215f7 docs: add interview handoff checklist

Confirmed before this checkpoint:

    HEAD = origin/main = origin/HEAD = 30215f7
    git status clean
    npm.cmd run build passed during Phase 4M-1
    30215f7 is contained in origin/main
    tracked files contain no likely real sk-* API key
    .env.local remains ignored and untracked
    DeepSeek API key remains local-only in .env.local

The current frozen interview-demo phase is complete:

    Phase 4M-0: Demo freeze / interview handoff review
    Phase 4M-1: Interview handoff checklist / frozen demo verification log
    Phase 4M-2: Frozen demo final checkpoint / project source handoff

## 1. Current frozen stable point

Latest stable commit:

    30215f7 docs: add interview handoff checklist

Recent relevant commits:

    30215f7 docs: add interview handoff checklist
    841c995 docs: review demo freeze handoff
    6898fdf docs: log manual demo rehearsal
    0797819 docs: close post real ai demo prep
    c91801e docs: add demo rehearsal checklist
    326f175 docs: refine interview talking script
    2818961 docs: draft portfolio interview story
    d8c4344 docs: log contextual compare ai copy scan

## 2. Current product state

HouseFolio is currently positioned as:

    a local-first private rental decision management tool

It is not:

    a listing platform
    an agency platform
    a listing aggregator
    a true-listing certification system
    an AI house-picking system
    a public listing database
    a public photo/video listing library
    a Chrome extension project

Long-term red lines remain:

    do not scrape third-party listing pages
    do not move Beike / 58 / Xiaohongshu / Douban content into HouseFolio
    do not expose user listing libraries publicly
    do not broker rental transactions
    do not contact landlords or agents
    do not handle appointments, commissions, deposits, or contracts
    do not claim true-listing verification
    do not claim final recommendation
    do not let L3 perform scoring, ranking, filtering, authenticity judgment, or final decision-making
    do not start Chrome extension engineering without explicit user confirmation

## 3. Current completed main path

The current main product path already supports:

    Portfolio
    → select 2–4 listings
    → /compare?ids=...
    → local listings read
    → buildComparisonInputs()
    → ComparisonInput[] / ComparisonModel[]
    → CompareTable
    → static L3-facing explanation
    → AI trigger
    → AI confirmation panel
    → /api/ai/compare-explanation
    → provider selection
    → DeepSeek provider path
    → session-only AI output
    → clear current AI output

Current routes include:

    /
    /demo
    /portfolio
    /portfolio/new
    /portfolio/[id]
    /compare
    /settings
    /api/lbs/commute/transit
    /api/ai/compare-explanation

## 4. Frozen demo route for interviews

Use this interview demo path:

    1. Home:
       explain product positioning.

    2. Demo page:
       explain L1 / L2 / L3 architecture.

    3. Portfolio:
       show private candidate listing management.

    4. Select 2–4 listings:
       show comparison as a user-initiated decision workflow.

    5. Compare page:
       show structured L2 comparison table.

    6. Static explanation panel:
       show how L3-facing explanation is grounded in L2.

    7. AI confirmation:
       show that AI is not automatic and requires user confirmation.

    8. DeepSeek-backed explanation:
       show real provider path in local environment.

    9. Clear current AI output:
       show session-only output control.

    10. Refresh:
        show AI output does not persist.

    11. Settings:
        show local-first data rights and no AI output/history persistence.

## 5. What can be claimed safely

Safe interview claims:

    HouseFolio is a private rental decision management tool.
    It focuses on candidate listings users have already collected.
    It does not scrape or aggregate listings.
    It uses L1 / L2 / L3 separation.
    L1 handles spatial context.
    L2 handles rule-based reference comparison.
    L3 handles explanation and checklist-style guidance.
    AI is confirmation-gated.
    AI output is session-only.
    AI output is not persisted.
    DeepSeek provider path has been validated in local demo flow.
    The current demo is suitable for portfolio/interview presentation.

## 6. What must not be claimed

Do not claim:

    public launch readiness
    production compliance readiness
    Supabase integration
    cloud sync
    account system
    AI output history
    AI output export/delete
    Settings AI data-rights coverage
    multi-round DeepSeek pressure testing
    Chrome extension
    map UI
    full LBS life-circle computation
    automatic third-party listing import
    photo/video comparison
    AI scoring
    AI ranking
    AI filtering
    AI authenticity judgment
    final recommendation system

Avoid English phrasing:

    best listing
    system recommendation
    recommendation score
    verified listing
    AI decides
    final decision by AI

Avoid Chinese phrasing:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真

Prefer:

    reference score
    auxiliary comparison
    structured comparison
    trade-off explanation
    decision support
    dimension breakdown

Prefer Chinese phrasing:

    参考分
    参考评分
    辅助比较
    维度拆解
    取舍解释
    不代表最终推荐
    用户可根据硬性条件一票否决

## 7. Current architecture boundary

Architecture boundaries remain:

    L1 through lib/lbs
    L2 through lib/algorithm
    L3 through lib/ai
    storage through lib/storage
    local structured data through lib/local-store and lib/privacy
    pages and UI components must not directly bind platform SDKs

Current DeepSeek safety boundary:

    API key stays in .env.local only
    .env.local remains ignored and untracked
    never print the full key
    never paste the key into chat
    never commit the key
    never document the key
    never expose the key to the browser

## 8. Demo freeze rule

Before interview/demo usage, prioritize stability over expansion.

Do not modify:

    UI
    AI prompt
    AI provider
    AI route
    Settings
    README
    Demo page
    Home page
    Navigation
    Compare table structure
    localStorage keys
    storage model

unless a concrete blocker is found.

## 9. Recommended next conversation startup checklist

At the start of the next conversation, run:

    1. git status
    2. git log -8 --oneline --decorate
    3. git fetch origin main
    4. confirm latest stable commit is in origin/main
    5. npm.cmd run build
    6. confirm .env.local is ignored
    7. confirm .env.local is untracked
    8. run tracked-file sk-* secret scan
    9. confirm DeepSeek env only by non-sensitive shape check

Do not print the DeepSeek API key.

## 10. Recommended next phase

Recommended next phase:

    Pause feature work and use the frozen demo for interview / portfolio presentation.

If development continues, the safest next options are:

    Option A: documentation-only portfolio narrative refinement
    Option B: small interview Q&A preparation
    Option C: final manual demo rehearsal before presentation

Avoid starting:

    Supabase
    Chrome extension
    public launch readiness
    AI history
    Settings AI data-rights implementation
    map UI
    new UI polish
    new AI prompt iteration

unless explicitly re-scoped.