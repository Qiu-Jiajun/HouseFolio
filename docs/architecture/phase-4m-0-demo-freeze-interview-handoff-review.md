# Phase 4M-0｜Demo freeze / interview handoff review

Date: 2026-05-19
Phase: 4M-0
Type: Architecture / product review
Status: Drafted for demo freeze boundary

## 1. Purpose

Phase 4M-0 exists to freeze the current HouseFolio demo state for interview and portfolio presentation.

This phase does not add product functionality. It defines what is already stable enough to show, what should be treated as the interview demo path, and what should not be changed before the next interview-facing handoff.

The goal is to avoid turning a working demo into a moving target.

## 2. Current stable point

Current stable commit:

    6898fdf docs: log manual demo rehearsal

Startup checks before this phase confirmed:

    HEAD = origin/main = origin/HEAD = 6898fdf
    git status clean
    npm.cmd run build passed
    6898fdf is contained in origin/main
    .env.local is ignored by git
    .env.local is not tracked
    .env.local does not appear in git status
    tracked files contain no likely real sk-* API key
    DeepSeek env shape check passed without printing the key

DeepSeek API key remains local-only:

    .env.local only
    not printed
    not pasted
    not committed
    not documented

## 3. What is frozen for interview demo

The following user-facing path should be treated as the current frozen demo path:

    Home
    → Demo page
    → Portfolio
    → Select 2–4 listings
    → Compare
    → Compare table
    → Static L3-facing explanation
    → AI confirmation
    → DeepSeek-backed AI explanation
    → Clear current AI output
    → Refresh confirms session-only output
    → Settings confirms no AI output/history persistence

The current demo story is:

    HouseFolio is not a listing platform.
    It is a private rental decision management tool.
    It helps renters compare self-collected candidate listings through:
    L1 LBS context,
    L2 reference comparison,
    L3 AI explanation.

## 4. Current interview-safe capabilities

The current demo can safely show:

    1. Private portfolio of candidate listings.
    2. Listing detail pages.
    3. Local-first data management in Settings.
    4. Compare flow from Portfolio to /compare.
    5. 2–4 listing selection.
    6. L2 comparison table.
    7. Reference-score framing as auxiliary comparison.
    8. Static explanation panel.
    9. AI confirmation before sending data.
    10. Real DeepSeek provider path.
    11. Session-only AI output.
    12. Clear current AI output.
    13. No AI output persistence.
    14. No AI history in Settings.
    15. Compliance-safe product positioning.

## 5. Demo freeze boundaries

During this freeze window, do not change:

    UI layout
    Compare table structure
    AI confirmation flow
    AI provider selection behavior
    Settings data rights surface
    README
    Demo page
    Home page
    Navigation
    Chinese copy center
    localStorage keys
    IndexedDB storage behavior
    API route contracts

The current purpose is interview handoff stability, not feature expansion.

## 6. Explicit non-goals

Phase 4M-0 does not do:

    UI polish
    AI prompt changes
    DeepSeek provider changes
    AI route changes
    Settings changes
    README changes
    Demo route changes
    Home route changes
    public launch readiness
    Supabase integration
    Chrome plugin or Chrome extension engineering
    AI output persistence
    AI history
    AI output export or deletion
    multi-round real AI stress testing
    L3 scoring
    L3 ranking
    L3 filtering
    L3 authenticity judgment
    L3 final recommendation

## 7. L1 / L2 / L3 boundary reminder

L1 remains responsible for spatial context:

    commute
    life-circle context
    map-related spatial relationship

L2 remains responsible for structured comparison:

    reference score
    comparison table
    missing fields
    risk flags
    rule-based auxiliary comparison

L3 remains responsible only for explanation:

    summary
    checklist
    trade-off explanation
    risk-signal humanization

L3 must not become:

    scoring engine
    ranking engine
    filtering engine
    recommendation system
    authenticity checker
    final decision-maker

Forbidden positioning remains:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真

Preferred positioning remains:

    参考分
    参考评分
    辅助比较
    维度拆解
    不代表最终推荐
    用户可根据硬性条件一票否决

## 8. Interview handoff story

The interview explanation should use this sequence:

    1. Problem:
       Renters already collect many candidate listings, but decision information is scattered.

    2. Product position:
       HouseFolio does not solve "where to find listings".
       It solves "how to decide among listings I already found".

    3. Core architecture:
       L1 turns location into spatial decision context.
       L2 turns multiple listings into comparable structured data.
       L3 turns L1/L2 results into human-readable explanation.

    4. Product judgment:
       LLM is not used for commute calculation, scoring, ranking, filtering, authenticity judgment, or final recommendation.

    5. Privacy judgment:
       Sensitive rental-decision data should remain local-first.
       AI is click-triggered, confirmation-gated, and session-only.

    6. Compliance judgment:
       The product does not scrape, aggregate, certify, broker, or publicly expose listings.

    7. Engineering judgment:
       Provider-facing capabilities are routed through lib layers rather than page-level SDK coupling.

## 9. Demo freeze acceptance criteria

Phase 4M-0 is acceptable if:

    1. Only this architecture document is added.
    2. No src files are modified.
    3. README is not modified.
    4. Settings is not modified.
    5. AI provider / route / prompt code is not modified.
    6. npm.cmd run build passes.
    7. git status is clean after commit.
    8. No tracked file contains a likely real sk-* key.
    9. .env.local remains ignored and untracked.

## 10. Recommended next phase

After Phase 4M-0, the next suitable step is:

    Phase 4M-1: Interview handoff checklist / frozen demo verification log

That next phase should still be documentation-first.

It should not implement new functionality unless the freeze review identifies a concrete blocker.