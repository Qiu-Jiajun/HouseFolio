# Phase 4L-1：Demo / interview presentation path review

Date: 2026-05-19

## 1. Purpose

Phase 4K proved the real DeepSeek path.
Phase 4L-0 concluded that HouseFolio should not immediately expand AI engineering.

This review defines how to present the current product in a demo or interview setting.

The goal is not to add features.
The goal is to make the current MVP easier to explain.

## 2. Current stable baseline

Latest stable commit before this review:

6aa0722 docs: review post real ai direction

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- Phase 4L-0 pushed to origin/main
- tracked files contained no likely real sk-* API key
- DeepSeek API key remained only in local .env.local

## 3. Current product state

HouseFolio currently has a coherent portfolio-demo path:

Home
→ Demo
→ Portfolio
→ Add Listing
→ Detail
→ Settings
→ Compare
→ AI explanation

The stronger live demonstration path is:

Portfolio
→ select 2–4 listings
→ Compare
→ Compare table
→ AI confirmation
→ real DeepSeek explanation
→ clear session-only AI output
→ refresh confirms output is not persisted

This path demonstrates the current L1 / L2 / L3 structure without needing public launch readiness.

## 4. Recommended demo path

The recommended interview demo path is:

1. Open Home or Demo page.
2. Explain product positioning:
   HouseFolio is a private rental decision management tool, not a listing platform.
3. Open Portfolio.
4. Show that listings are user-added candidate listings.
5. Open one Detail page.
6. Show notes, ratings, local-first data handling, commute-related context, and local photo concept if available.
7. Return to Portfolio.
8. Select 2–4 listings.
9. Enter Compare.
10. Show the L2 comparison table.
11. Explain Reference Score as auxiliary comparison, not recommendation.
12. Trigger AI explanation.
13. Show AI confirmation panel.
14. Explain that AI receives structured / redacted comparison data, not raw private records.
15. Generate a real DeepSeek explanation.
16. Explain that the output is session-only.
17. Clear current AI output.
18. Refresh page and confirm it is not persisted.
19. Open Settings only if needed to demonstrate local data rights.
20. End by explaining the boundary:
    no scraping, no brokerage workflow, no true-listing certification, no AI final recommendation.

## 5. Core interview narrative

The concise narrative should be:

HouseFolio started from a broader LBS + AI rental decision idea, but I narrowed it into a local-first private decision workspace that a single developer can actually build and explain.

It does not solve “where to find listings.”
It solves “how to compare the candidate listings I already found.”

The product organizes self-collected listings, commute anchors, notes, ratings, local photos, comparison data, and AI explanation into one decision chain.

The architecture is split into:

- L1: LBS / commute / spatial context
- L2: rule-based reference score and comparison
- L3: AI explanation based on structured comparison data

The key product judgment is that AI does not score, rank, filter, verify, or decide.
AI only explains the structured L2 comparison in human-readable language.

## 6. What to emphasize

Emphasize:

- private decision workspace
- user-added listings
- local-first data rights
- multiple commute anchors
- reference score as auxiliary comparison
- compare table as structured decision support
- AI confirmation before sending data
- session-only AI output
- redacted / structured AI input
- no scraping
- no public listing database
- no brokerage workflow
- no true-listing certification
- no AI final recommendation

## 7. What not to say

Do not say:

- best listing
- optimal listing
- system recommendation
- recommendation score
- AI chooses for you
- true listing guarantee
- anti-scam guarantee
- authentic listing verification
- full production-ready AI product
- public launch ready
- crawler-based listing import
- automatic platform aggregation
- brokerage service
- landlord matching

## 8. How to explain DeepSeek

DeepSeek should be explained as:

A replaceable L3 explanation provider behind lib/ai.

It should not be explained as the product brain.

Correct framing:

- DeepSeek is used only after the user confirms.
- It receives structured comparison input.
- It returns an explanation.
- The output is currently session-only.
- The provider is replaceable through the lib/ai boundary.

Incorrect framing:

- DeepSeek decides which listing is best.
- DeepSeek scores listings.
- DeepSeek verifies authenticity.
- DeepSeek stores the user's rental profile.
- DeepSeek is required for L1 or L2 logic.

## 9. Demo failure fallback

If real DeepSeek fails during a live demo, the fallback narrative should be:

The Compare table and L2 comparison remain functional without AI.
AI is only the L3 explanation layer.
The provider can fall back to mock or show safe error states.
This validates that the product is not dependent on LLM for core scoring or comparison.

This is a strength, not a weakness.

## 10. Current readiness judgment

Current readiness:

- Good enough for portfolio demonstration.
- Good enough for interview discussion.
- Good enough to demonstrate AI product judgment.
- Not ready for public launch.
- Not ready for real user AI storage.
- Not ready for AI history.
- Not ready for paid or high-traffic usage.

## 11. Recommended next phase

After this review, the safest next phase is one of:

A. Phase 4L-2：Compare / AI copy boundary scan
B. Phase 4L-2：Portfolio interview story draft
C. Phase 4L-2：Demo path manual regression checklist

Recommended next step:

Phase 4L-2：Compare / AI copy boundary scan

Reason:

Before writing interview material, confirm that the actual UI copy still matches the product boundary.