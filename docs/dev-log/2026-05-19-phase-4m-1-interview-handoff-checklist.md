# Phase 4M-1｜Interview handoff checklist / frozen demo verification log

Date: 2026-05-19
Phase: 4M-1
Type: Dev log / interview demo verification
Status: Frozen demo handoff checklist

## 1. Purpose

Phase 4M-1 records the frozen HouseFolio demo checklist for interview use.

This phase does not implement any new feature. It verifies the current demo-facing product story, confirms the safe presentation path, and records what should not be changed before using the project in portfolio or interview contexts.

Phase 4M-1 follows:

    Phase 4M-0: Demo freeze / interview handoff review

Current stable base:

    841c995 docs: review demo freeze handoff

## 2. Startup verification

Before writing this log, the following were confirmed:

    git status clean
    HEAD = origin/main = origin/HEAD = 841c995
    841c995 is contained in origin/main
    Phase 4M-0 was pushed successfully

The previous full startup check also confirmed:

    npm.cmd run build passed
    .env.local is ignored by git
    .env.local is not tracked
    .env.local does not appear in git status
    tracked files contain no likely real sk-* API key
    DeepSeek env shape check passed without printing the key

## 3. Frozen interview demo route

The recommended live demo route is:

    1. Open Home.
    2. Explain HouseFolio positioning:
       private rental decision management tool, not a listing platform.

    3. Open Demo page.
    4. Use Demo page as high-level architecture preview:
       L1 LBS,
       L2 reference comparison,
       L3 AI explanation.

    5. Open Portfolio.
    6. Select 2–4 listings.
    7. Enter /compare through the existing compare action.
    8. Show Compare table.
    9. Explain that the comparison table is L2 auxiliary comparison, not final recommendation.
    10. Show static L3-facing explanation panel.
    11. Trigger AI explanation.
    12. Confirm AI disclosure step.
    13. Show DeepSeek-backed AI explanation output.
    14. Explain session-only output and no persistence.
    15. Clear current AI output.
    16. Refresh to confirm output does not persist.
    17. Open Settings.
    18. Confirm local-first data rights and no AI output/history persistence.

## 4. Interview explanation checklist

Use the following structure when presenting the project.

### 4.1 Problem

Renters often collect candidate listings across multiple channels, but the decision information is scattered.

The hard problem is not only "where to find listings". The hard problem is:

    How do I compare the listings I have already found?

### 4.2 Product position

HouseFolio is:

    a private rental decision management tool

HouseFolio is not:

    a listing platform
    an agency platform
    a listing aggregator
    a true-listing certification system
    a brokerage service
    a public listing database

### 4.3 Three-layer architecture

L1 LBS:

    turns listing location into spatial decision context

L2 Algorithm:

    turns multiple listings into comparable structured data

L3 AI:

    turns L1/L2 results into human-readable explanation

### 4.4 Product judgment

The important product judgment is not "use AI everywhere".

The important judgment is:

    use deterministic systems for calculation,
    use rules and simple math for comparison,
    use LLM only for explanation.

### 4.5 Privacy judgment

HouseFolio treats rental-decision data as sensitive.

Therefore:

    data is local-first,
    AI is click-triggered,
    AI has a confirmation step,
    AI output is session-only,
    AI output is not persisted,
    Settings does not contain AI history.

### 4.6 Compliance judgment

HouseFolio does not:

    scrape third-party listing pages,
    move platform content into a public database,
    certify listing authenticity,
    broker transactions,
    contact landlords,
    collect commissions,
    provide final recommendations.

## 5. Demo pass checklist

The frozen demo is acceptable if the following remain true:

    Home loads.
    Demo page loads.
    Portfolio loads.
    Portfolio selection supports 2–4 listings.
    Compare route opens with selected ids.
    Compare table renders.
    Missing fields and risk flags render as auxiliary signals.
    Static L3 explanation panel renders.
    AI confirmation panel appears before AI call.
    DeepSeek provider path can return an AI explanation in local environment.
    AI output is shown as session-only.
    Clear current AI output works.
    Refresh removes the AI output.
    Settings has no AI output/history data section.
    Build passes.
    Git remains clean.
    No likely real sk-* key appears in tracked files.

## 6. Things not to demonstrate as completed

Do not claim the following are complete:

    public launch readiness
    Supabase integration
    cloud account system
    cloud sync
    AI output history
    AI output export / deletion
    Settings AI data-rights coverage
    multi-round real AI stress testing
    Chrome extension
    automatic third-party listing import
    map UI
    full LBS life-circle computation
    photo/video comparison
    AI scoring
    AI ranking
    AI filtering
    AI authenticity judgment
    final recommendation system

## 7. Forbidden interview phrasing

Avoid saying:

    HouseFolio recommends the best listing.
    HouseFolio finds true listings.
    HouseFolio verifies listing authenticity.
    HouseFolio replaces rental judgment.
    The AI decides which listing to choose.
    The score is a recommendation score.
    The system ranks listings by best choice.

Avoid Chinese phrasing:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真

## 8. Preferred interview phrasing

Use:

    reference score
    auxiliary comparison
    structured comparison
    trade-off explanation
    decision support
    dimension breakdown
    user remains final decision-maker

Use Chinese phrasing:

    参考分
    参考评分
    辅助比较
    维度拆解
    取舍解释
    不代表最终推荐
    用户可根据硬性条件一票否决

## 9. Demo freeze rule

Before interviews, prioritize stability over expansion.

Do not modify:

    UI
    AI provider
    AI prompt
    AI route
    Settings
    README
    localStorage keys
    storage model
    Compare table structure
    Demo page
    Home page
    Navigation

unless a concrete blocker is discovered.

## 10. Recommended next step

After Phase 4M-1, the suitable next step is:

    Phase 4M-2: Frozen demo final checkpoint / project source handoff

That phase should prepare a concise Project Source handoff so that a future conversation can resume from the frozen interview demo state.