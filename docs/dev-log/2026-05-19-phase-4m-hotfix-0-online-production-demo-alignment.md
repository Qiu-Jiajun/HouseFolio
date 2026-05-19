# Phase 4M-hotfix-0｜Online production demo alignment log

Date: 2026-05-19
Phase: 4M-hotfix-0
Type: Production demo alignment log
Status: Completed

## 1. Purpose

This log records a small online-demo alignment action after Phase 4M was frozen.

The issue was not a local code blocker. The local frozen demo was already complete, but the public Vercel production environment did not have the required provider environment variables configured. As a result, the online site could not fully demonstrate the real AI / LBS-backed demo path.

This log records the non-sensitive production alignment result.

## 2. Stable code version

Production deployment was confirmed as:

    Branch: main
    Commit: 0e9722b
    Message: docs: close frozen demo handoff
    Status: Ready

This means Vercel Production is deployed to the Phase 4M frozen demo code version.

## 3. Production environment variables

The following Production environment variable names were added in Vercel Project Settings:

    AI_COMPARE_PROVIDER
    DEEPSEEK_API_KEY
    LBS_PROVIDER
    AMAP_API_KEY

Sensitive values were not printed, pasted, documented, committed, or exposed.

No NEXT_PUBLIC_* secret variable was added.

Specifically, the following must remain forbidden:

    NEXT_PUBLIC_DEEPSEEK_API_KEY
    NEXT_PUBLIC_AMAP_API_KEY

## 4. Redeploy result

After adding Production environment variables, Vercel required a new deployment for changes to take effect.

Production was redeployed.

Redeploy result:

    Status: Ready
    Branch: main
    Commit: 0e9722b
    Message: docs: close frozen demo handoff

## 5. Online validation result

Initial online validation did not reveal obvious issues.

Verified at a high level:

    house-folio.vercel.app can load
    Production code is aligned with the frozen demo stable point
    Production environment variables are available to the new deployment
    Online AI / LBS basic validation did not show immediate blockers

This means the previous online demonstration gap is substantially reduced.

## 6. What this changes

Before this alignment:

    local frozen demo could show the complete Compare + AI explanation path
    online production could not reliably show the real provider-backed path

After this alignment:

    online production is now capable of supporting the real demo path
    interview/demo usage can rely more on house-folio.vercel.app
    the project is better aligned with the Phase 4M frozen demo state

## 7. What this does not mean

This alignment does not mean:

    public launch readiness
    production compliance readiness
    anti-abuse protection
    rate limiting
    AI cost control
    AI history
    AI output persistence
    Settings AI data-rights coverage
    cloud account system
    Supabase integration
    Chrome extension readiness

The site remains a portfolio / interview demo, not a public commercial launch.

## 8. Safety boundaries retained

The following boundaries remain unchanged:

    AI output is session-only
    AI output is not persisted
    no AI history is added to Settings
    no raw prompt is stored
    no raw model response is stored
    no API key is committed
    no API key is exposed to the browser
    L3 does not score, rank, filter, verify authenticity, or make final recommendations

## 9. Demo usage note

Because HouseFolio remains local-first, online Portfolio data is still stored in the browser's localStorage.

For interview usage, the demo browser should be prepared in advance with:

    3–4 credible candidate listings
    1–2 non-sensitive commute anchors
    at least one successful Compare run
    at least one successful AI explanation run
    a cleared AI output before the actual interview demo

Do not use incognito mode or clear site data before presentation.

## 10. Next state

After this log, the project should return to:

    Frozen Demo usage period

No new feature development is started by this hotfix log.

Recommended next activities remain:

    interview presentation
    resume/project narrative refinement
    Q&A preparation
    controlled demo rehearsal
    observation logging

Avoid starting:

    Phase 5
    Supabase
    Chrome extension
    public launch readiness
    AI history
    Settings AI data-rights implementation
    UI/UX polish
    map UI
    new AI prompt iteration