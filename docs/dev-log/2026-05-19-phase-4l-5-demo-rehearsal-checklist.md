# Phase 4L-5：Demo rehearsal checklist

Date: 2026-05-19

## 1. Purpose

Phase 4L-4 refined the Chinese interview talking script.

This phase turns the current HouseFolio demo path into a practical rehearsal checklist.

The goal is to make the project easier and safer to demonstrate during interviews, portfolio reviews, or product discussion sessions.

This document does not modify UI, README, Settings, AI provider, or product behavior.

## 2. Stable baseline

Latest stable commit before this checklist:

326f175 docs: refine interview talking script

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- Phase 4L-4 pushed to origin/main
- tracked files contained no likely real sk-* API key
- DeepSeek API key remained only in local .env.local

## 3. Pre-demo technical checklist

Before any live demo, run:

    git status
    npm.cmd run build

Expected result:

    working tree clean
    build passed

Do not open or print:

    .env.local
    DEEPSEEK_API_KEY
    raw request
    raw response
    raw prompt
    complete model output logs

If GitHub connectivity fails, it is not relevant for a local demo as long as the local build passes and the branch is already clean.

## 4. Recommended browser preparation

Before presenting:

1. Use a normal browser window, not a terminal-heavy workflow.
2. Open only the required tabs.
3. Avoid exposing devtools unless debugging is necessary.
4. Do not open .env.local.
5. Do not show terminal history containing environment variables.
6. Keep the demo on the app surface whenever possible.
7. If using real DeepSeek, verify AI_COMPARE_PROVIDER is already configured locally but do not display its value beyond non-sensitive status.

Recommended local URL:

    http://localhost:3222

Recommended startup command:

    npm.cmd run dev -- --port 3222

## 5. Main demo path

The recommended demo path is:

1. Open Home or Demo.
2. Explain that HouseFolio is a private rental decision management tool.
3. State clearly that it is not a listing platform.
4. Open Portfolio.
5. Show user-added candidate listings.
6. Open one listing detail page.
7. Explain notes, subjective ratings, commute context, local-first data handling, and viewing-material concept.
8. Return to Portfolio.
9. Select 2 to 4 listings.
10. Enter Compare.
11. Show the Compare table.
12. Explain that Reference Score is only auxiliary.
13. Explain that L2 is rule-based and not LLM-driven.
14. Trigger AI explanation.
15. Show AI confirmation panel.
16. Explain that AI is L3 explanation, not recommendation.
17. Generate real DeepSeek explanation if network and key are ready.
18. Do not read or paste the full AI output into notes.
19. Explain that the output is session-only.
20. Click clear current AI output.
21. Refresh and confirm output is not retained.
22. Optionally open Settings to show local data rights.

## 6. Three-sentence product opening

Use this opening when time is limited:

HouseFolio is a local-first private rental decision management tool for renters who already have several candidate listings.

It does not scrape or aggregate listings; instead, it helps users compare self-collected candidates through commute anchors, reference scoring, structured comparison, and AI-assisted explanation.

The core architecture is L1 for spatial context, L2 for deterministic comparison, and L3 for AI explanation only.

## 7. Key points to say during Compare demo

When showing Compare, say:

- This is not a recommendation page.
- The score is a reference score, not a recommendation score.
- The table helps users compare tradeoffs.
- Users can still reject any listing based on hard constraints.
- AI appears only after user confirmation.
- AI explains the structured comparison; it does not choose for the user.

## 8. Key points to say during AI demo

When showing AI, say:

- AI is the L3 explanation layer.
- It receives structured comparison information.
- It should not receive raw private records as a general product principle.
- It does not calculate scores.
- It does not rank listings.
- It does not verify listing authenticity.
- It does not make the final decision.
- The current AI output is session-only.
- The user can clear it.
- Refreshing removes it.

## 9. If real DeepSeek succeeds

If real DeepSeek output appears, say:

This proves the real provider path is wired through the existing AI boundary.

Then immediately reinforce:

This is still a portfolio MVP path, not public-launch readiness.
The output is not stored.
There is no AI history.
There is no Settings AI data surface yet.
The model is used only for explanation.

## 10. If real DeepSeek fails

If real DeepSeek fails during a live demo, do not panic.

Say:

The core product does not depend on the LLM for scoring or comparison.
L1 and L2 still work independently.
AI is only the final explanation layer.
The provider can fail safely without breaking the Compare table.

Then show:

- Compare table
- static explanation area
- safe error message if available
- local-first data boundary

This fallback supports the product story rather than weakening it.

## 11. What not to say in a demo

Do not say:

- HouseFolio finds listings for users
- HouseFolio verifies true listings
- HouseFolio guarantees safety
- HouseFolio recommends the best listing
- HouseFolio replaces user judgment
- HouseFolio is ready for public launch
- DeepSeek is the brain of the product
- AI scores the listings
- AI ranks the listings
- AI decides the final choice
- The app crawls platforms
- The app aggregates third-party housing data

## 12. What to say instead

Say:

- private decision workspace
- user-added candidate listings
- local-first data rights
- commute anchors
- reference score
- auxiliary comparison
- structured comparison table
- AI-assisted explanation
- session-only AI output
- no scraping
- no brokerage workflow
- no true-listing certification
- no final recommendation

## 13. Recommended demo time allocation

For a 3-minute demo:

- 30 seconds: product positioning
- 45 seconds: Portfolio and Detail
- 60 seconds: Compare table
- 30 seconds: AI confirmation and explanation
- 15 seconds: session-only output clearing
- 15 seconds: boundary summary

For a 5-minute demo:

- 45 seconds: product positioning
- 60 seconds: Portfolio and Detail
- 90 seconds: Compare table and L2 logic
- 60 seconds: AI explanation and session-only boundary
- 45 seconds: Settings and local-first rights
- 30 seconds: product boundary and next-step limitations

## 14. Closing line

A safe closing line is:

HouseFolio's value is not that it has more housing data, but that it helps users turn their own scattered rental information into a structured, private, and explainable decision process.

## 15. Next safe phase

The next safe phase is:

    Phase 4L-6：Phase 4L closing checkpoint

That phase should close the post-real-AI product and interview-preparation sequence.

Do not continue into AI history, Settings AI data rights, cost control, rate limiting, Supabase, Chrome extension, public launch readiness, photo AI, video AI, or multi-round real AI stress testing without a separate boundary review.