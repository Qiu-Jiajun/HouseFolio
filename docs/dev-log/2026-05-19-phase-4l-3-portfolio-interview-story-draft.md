# Phase 4L-3：Portfolio interview story draft

Date: 2026-05-19

## 1. Purpose

Phase 4L-2 confirmed that the current Compare / AI copy boundary is acceptable.

This phase converts the current HouseFolio product and engineering milestones into an interview-ready story draft.

This document is not UI copy.
This document is not README copy.
This document is a preparation note for explaining HouseFolio in interviews, portfolio reviews, or product manager screening conversations.

## 2. Stable baseline

Latest stable commit before this draft:

d8c4344 docs: log contextual compare ai copy scan

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- Phase 4L-2 pushed to origin/main
- tracked files contained no likely real sk-* API key
- DeepSeek API key remained only in local .env.local

## 3. One-sentence project definition

HouseFolio is a local-first private rental decision management tool that helps renters organize self-collected candidate listings and compare them through commute context, rule-based reference scoring, structured comparison, and AI-assisted explanation.

## 4. What problem it solves

HouseFolio does not solve “where can I find listings.”

Existing platforms such as Beike, 58, Xiaohongshu, Douban, agents, and chat groups already create an information-rich but fragmented rental search environment.

The real problem I focused on is:

Renters already have several candidate listings, but their decision information is scattered across platforms, screenshots, chat records, notes, maps, and memory. They lack a private workspace that turns those candidate listings into comparable decision objects.

HouseFolio therefore focuses on:

- collecting user-added candidate listings
- organizing notes and local viewing materials
- using commute anchors as spatial decision context
- turning listing attributes into structured comparison
- using AI only to explain the comparison in human-readable language

## 5. Why I narrowed the original idea

The original idea was broader: an LBS + AI rental decision product.

During execution, I narrowed it for three reasons.

First, a personal project should prove a complete decision chain instead of trying to become a platform.

Second, scraping, aggregating, or redisplaying third-party listing content would push the product into platform and compliance risk.

Third, the most defensible MVP is not owning more listing data, but helping users make better sense of the listings they already collected.

So HouseFolio became a private decision workspace instead of a listing platform.

This narrowing is a product judgment, not a technical compromise.

## 6. Core product positioning

HouseFolio is:

- a private rental decision workspace
- a local-first personal data tool
- a comparison and explanation aid
- a portfolio project demonstrating product judgment and AI-assisted engineering

HouseFolio is not:

- a listing platform
- a listing aggregator
- a brokerage product
- a landlord matching service
- a true-listing verification service
- an AI final recommendation system
- a Chrome extension project at the current stage

## 7. Three-layer architecture story

The core architecture is L1 / L2 / L3.

### L1: LBS / commute / spatial context

L1 turns a listing from a static text record into a spatial decision object.

The key product idea is that renters do not only care about the listing address itself. They care about how that location relates to work, school, partner commute, child school, transit access, and daily life.

HouseFolio uses commute anchors rather than a single work location, because real rental decisions often involve multiple people or multiple frequent destinations.

### L2: rule-based reference score and comparison

L2 turns multiple listings into a comparable structure.

This layer uses rules and simple math instead of LLMs.

The reason is deliberate: scoring, sorting, filtering, and comparison are structured decision problems. They should remain deterministic, explainable, and inspectable.

L2 produces reference scores, comparison tables, missing-field hints, and risk signals.

The score is only a reference score. It is not a recommendation score.

### L3: AI explanation layer

L3 explains L2 comparison output in natural language.

It does not calculate commute.
It does not score listings.
It does not rank listings.
It does not filter listings.
It does not judge authenticity.
It does not decide for the user.

The role of AI is to translate structured comparison results into human-readable explanation, checklist, and conditional advice.

## 8. Current demo story

A strong demo path is:

1. Open Portfolio.
2. Explain that listings are user-added candidate records.
3. Open a Detail page.
4. Show notes, subjective ratings, commute context, and local-first data handling.
5. Return to Portfolio.
6. Select 2–4 listings.
7. Enter Compare.
8. Show the structured comparison table.
9. Explain that Reference Score is auxiliary and does not represent a final recommendation.
10. Trigger AI explanation.
11. Show the AI confirmation panel.
12. Explain that AI receives structured comparison data, not raw private records.
13. Generate a real DeepSeek explanation.
14. Explain that output is session-only.
15. Clear current AI output.
16. Refresh and confirm it does not persist.
17. Optionally open Settings to show local data rights.

This demo path proves the decision chain without claiming public launch readiness.

## 9. How to explain DeepSeek

DeepSeek is a replaceable L3 provider behind lib/ai.

It is not the product brain.

Correct explanation:

- DeepSeek is only triggered after user confirmation.
- DeepSeek receives structured comparison input.
- DeepSeek returns an explanation.
- The output is currently session-only.
- The provider is replaceable through the lib/ai boundary.

Incorrect explanation:

- DeepSeek chooses the best listing.
- DeepSeek scores listings.
- DeepSeek verifies authenticity.
- DeepSeek stores the user rental profile.
- DeepSeek is required for L1 or L2.

## 10. Engineering decisions worth highlighting

The most valuable engineering decisions to mention are:

### Local-first data boundary

User-sensitive data such as detailed listing information, notes, photos, commute anchors, and local decision data are treated as private local data first.

Settings supports local data inspection, export, import, and clearing.

### Provider boundary

Platform-dependent capabilities are isolated behind lib modules:

- lib/lbs for LBS and commute logic
- lib/algorithm for reference scoring and comparison
- lib/ai for AI providers and explanation logic
- lib/storage for local photos and media boundary
- lib/local-store and lib/privacy for local data handling

This makes future migration easier.

### LLM boundary

The model is not used for deterministic scoring, sorting, filtering, or authenticity judgment.

This demonstrates AI product judgment: use AI where language understanding and explanation are valuable, not where deterministic rules are better.

### Session-only AI output

AI output is not persisted by default.

Users can clear the current AI output.

Refreshing removes AI output.

Settings currently has no AI history or AI output persistence surface.

## 11. Key tradeoffs

### Why no scraping

Scraping would shift the product from private decision support into listing aggregation.

That would create platform data rights risk, copyright risk, anti-scraping risk, and product positioning confusion.

The safer and cleaner product boundary is user-added listings.

### Why no true-listing guarantee

Authenticity certification is a platform-level responsibility.

A personal decision tool should not claim to verify listings or guarantee safety.

HouseFolio can help users organize questions, risks, and comparison signals, but it must not promise truth certification.

### Why local-first

Rental decisions involve sensitive data: candidate home locations, commute anchors, notes, photos, budget, preferences, and possibly third-party contact details.

Local-first is a deliberate privacy architecture, not a missing cloud feature.

### Why AI is explanation-only

AI can improve readability and decision support, but the final decision must remain with the user.

The product should help users think, not replace their judgment.

## 12. One-minute interview answer

HouseFolio is a local-first private rental decision tool I built from a broader LBS + AI rental product idea.

I noticed that renters often already have candidate listings from many channels, but their decision information is scattered across platforms, screenshots, chat records, notes, and map searches.

So I narrowed the product from a listing platform idea into a private decision workspace. Users manually add candidate listings, manage notes and local data, compare listings through commute context and rule-based reference scores, and can trigger AI to explain the comparison.

The architecture is split into three layers: L1 handles commute and spatial context, L2 handles deterministic reference scoring and structured comparison, and L3 uses AI only for explanation. I deliberately do not let AI score, rank, verify, or decide.

This project demonstrates my product judgment around scope control, privacy boundary, compliance risk, and AI feature design.

## 13. Three-minute interview answer

HouseFolio started from a broader idea: using LBS and AI to improve rental decisions.

But during product scoping, I realized that trying to build another listing platform was not the right direction for a personal MVP. Existing platforms already contain enough listing information, and scraping or aggregating them would create compliance and platform-data risks.

So I redefined the product around a more concrete user problem: renters often have multiple candidate listings, but the information is scattered across screenshots, links, chat records, notes, maps, and memory. The harder problem is not just finding listings; it is comparing the listings the user has already found.

HouseFolio therefore became a local-first private decision workspace. Users add their own candidate listings, keep notes and local viewing materials, define commute anchors such as work, school, or partner workplace, and compare listings through a structured decision model.

The product architecture has three layers. L1 is spatial context, including commute and location-related reasoning. L2 is deterministic comparison, including reference scores, comparison tables, missing fields, and risk signals. L3 is AI explanation, where DeepSeek is used only after user confirmation to explain the structured comparison in natural language.

One important design principle is that AI does not score, rank, filter, verify, or decide. Those tasks either belong to deterministic rules or to the user. AI only helps translate structured results into a more readable explanation.

From an engineering perspective, I used Next.js and TypeScript, and separated platform-dependent logic behind lib boundaries such as lib/lbs, lib/algorithm, lib/ai, lib/storage, and lib/local-store. I also designed the AI output to be session-only at this stage: it can be cleared, it disappears after refresh, and it is not added to Settings or history.

The project is not public-launch ready, and I do not present it as such. Its value as a portfolio project is that it demonstrates a complete product decision chain, strong boundary control, and practical AI product judgment.

## 14. Possible interviewer follow-up questions

### Q1: Why not just build a listing platform?

Because the core problem I chose is not supply discovery, but decision management after discovery. Building a listing platform would also introduce scraping, verification, brokerage, and public content risks that are not suitable for this MVP.

### Q2: Why use local-first storage?

Because rental decisions involve sensitive location, budget, note, and viewing-material data. Local-first keeps the product closer to a private workspace and reduces unnecessary cloud exposure.

### Q3: Why not let AI recommend the best listing?

Because “best” depends on hard constraints and personal tradeoffs. AI should explain tradeoffs, not make the final decision. The project uses AI as L3 explanation, not as a recommendation engine.

### Q4: What is the most important product decision you made?

The most important decision was narrowing the scope from a platform-like rental product into a private decision workspace. This made the product more buildable, safer, and more coherent.

### Q5: What does this project prove about your AI product thinking?

It proves that I know when to use AI and when not to use AI. L1 and L2 remain deterministic and explainable. AI is reserved for language explanation and checklist generation.

## 15. Recommended next phase

The next safe phase is:

Phase 4L-4：Interview answer refinement or demo talking script

This should remain a documentation / presentation task unless a separate implementation plan is created.

Do not continue into AI history, Settings AI data rights, cost control, rate limiting, Supabase, Chrome extension, public launch readiness, photo AI, video AI, or multi-round real AI stress testing without a separate boundary review.