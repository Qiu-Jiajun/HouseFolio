# Phase 8A closing checkpoint: UI/UX audience-fit and home visual redesign

Date: 2026-05-23

## 1. Phase summary

Phase 8A was introduced after the v3.1 planning update to address a specific product problem:

The earlier HouseFolio UI was functional, but it still looked too much like an engineering demo / dashboard. It did not sufficiently match the target audience: young renters in mainland China who need a calm, trustworthy, low-learning-cost private rental decision tool.

The goal of Phase 8A was not to implement new business functionality. The goal was to make the first impression, entry path, visual tone, and home page information architecture better match the product positioning.

This phase focused on:

- UI/UX audience-fit review
- Minimal redesign planning
- Home page visual redesign
- Reference-image-driven execution
- Home hero background replacement
- Home logo asset iteration
- Vercel production deployment verification

## 2. Stable point

Current stable commit:

```text
17c1584 fix: use large home logo icon asset

Confirmed state:

git status clean
origin/main = 17c1584
Vercel Production deployment = 17c1584
https://house-folio.vercel.app/?v=17c1584 shows the new home page

The normal production URL may show the old page temporarily in some browsers due to browser cache or an old tab state:

https://house-folio.vercel.app/

Cache bypass confirmed the new page:

https://house-folio.vercel.app/?v=17c1584

This indicates that GitHub and Vercel deployment are correct. Any remaining old view is a browser cache issue, not a repository or deployment issue.

3. Phase 8A completed work
3.1 Phase 8A-0: UI/UX audience-fit review

Created:

docs/architecture/phase-8a-0-ui-ux-audience-fit-review.md

Purpose:

Evaluate whether the existing HouseFolio UI matched the target audience.
Identify the mismatch between an engineering-demo interface and a renter-facing decision tool.
Confirm that UI/UX is not surface decoration but part of the product positioning.
Preserve HouseFolio boundaries: not a listing platform, not a brokerage platform, not a true-listing certification tool.
3.2 Phase 8A-1: Minimal redesign plan

Created:

docs/architecture/phase-8a-1-ui-ux-minimal-redesign-plan.md

Purpose:

Define the minimal redesign scope.
Avoid redesigning the whole product at once.
Prioritize the home page and first impression.
Keep the product route focused on:
候选房源
辅助比较
看房记录
签约前检查
设置 / 本地数据
3.3 Phase 8A-2 series: Home visual redesign

The home page was redesigned toward the reference direction:

warm white / soft beige base
calm green accent
living-room hero visual
clearer first-screen narrative
user-facing Chinese copy
less dashboard-like presentation
more life-tool / rental checklist feeling

Key outcomes:

Home now uses a large living-room hero background.
The left text area is visually calmer and more readable.
The “Home” hand-written background mark is part of the hero asset.
Main CTA remains visually stronger than the secondary CTA.
Secondary CTA “了解如何辅助比较” links to /demo.
Three capability cards remain present but visually lighter.
Local-first privacy note remains visible.
Top navigation uses user-facing labels, including “设置”.
4. Reference assets and visual sources

Reference images were added under:

docs/reference/phase-8a/

Runtime image assets were added under:

public/images/phase-8a/

Important runtime assets:

public/images/phase-8a/home-hero-living-room.png
public/images/phase-8a/housefolio-logo-icon-large.png

The home page references assets through /images/phase-8a/..., not through docs/reference.

5. Logo iteration summary

The logo went through several iterations because the first full banner image was not suitable for a navigation bar.

Rejected approach:

Use full horizontal logo image directly in the navbar.

Reason:

It behaved like a pasted banner.
It was too small in the navbar.
It had too much canvas / whitespace.
It did not scale cleanly.

Accepted approach:

Use a separate house-book icon image + front-end rendered HouseFolio text.

Final direction:

Icon comes from a larger, clearer house-book image asset.
Text remains rendered in the page, not embedded in the image.
The brand area is now closer to a proper logo lockup:
icon
HouseFolio wordmark
HouseFolio text style was considered acceptable and not further changed.
The final icon path is:
/images/phase-8a/housefolio-logo-icon-large.png
6. Vercel production verification

After pushing the Phase 8A home visual work, the production deployment was checked in Vercel.

Confirmed from Vercel dashboard:

Production Deployment: Ready
Source branch: main
Commit: 17c1584 fix: use large home logo icon asset
Domain: house-folio.vercel.app

The normal domain initially appeared old in the browser, but opening the cache-busting URL succeeded:

https://house-folio.vercel.app/?v=17c1584

Conclusion:

GitHub, origin/main, and Vercel production deployment are aligned.
The old page view was caused by browser cache / old tab state.

Recommended browser-side checks:

Ctrl + F5
Ctrl + Shift + R
Open in incognito window
Use ?v=17c1584 for cache diagnosis only
7. Product boundaries preserved

Phase 8A did not change the HouseFolio product boundary.

Still true:

HouseFolio is a local-first private rental decision management tool.
It is not a listing platform.
It is not a brokerage platform.
It is not a listing aggregator.
It is not a true-listing certification product.
It does not scrape third-party listing platforms.
It does not move Beike / 58 / Xiaohongshu / Douban content into a public database.
It does not provide landlord-side workflows.
It does not do viewing appointments, landlord contact, brokerage matching, commission, or deposit flows.
It does not claim “真房源”, “避坑保真”, or “替你选房负责”.
8. Contract assistant boundary

Although v3.1 includes a future contract-risk prompt assistant direction, Phase 8A did not implement it.

Not implemented in this phase:

Contract assistant page
Contract OCR
Contract text review workflow
Legal-risk rule library
AI legal review
Legal conclusion output
Contract report export

The phrase “签约前检查” appears only as a user-facing navigation / scenario label. It is not a claim that the contract assistant has already been implemented.

9. Engineering boundaries preserved

Phase 8A did not intentionally change:

L1 LBS provider layer
L2 algorithm layer
L3 AI provider layer
API routes
localStorage data model
Settings data rights model
Portfolio business logic
Compare business logic
DeepSeek provider behavior
Amap provider behavior

No new external dependency or font package was added.

10. Known limitations

The current home page is acceptable for the current visual phase, but still has limitations:

The hero image is an asset-based visual approximation, not a full design-system implementation.
The logo icon is raster-based PNG, not a final production SVG.
The home page has been visually verified by browser inspection, but not by automated screenshot comparison.
Some differences from the original reference image remain acceptable because the goal was audience-fit improvement, not pixel-perfect cloning.
Browser cache can temporarily show the previous production home page.
11. Next recommended step

Do not continue polishing the home page unless a clear visual defect is found.

Recommended next step:

Phase 8A final handoff / new conversation source

or move to the next planned product phase after confirming the current visual baseline is acceptable.

If more UI work is needed later, it should be scoped separately:

Phase 8B: Portfolio visual redesign

Do not mix it with:

contract assistant implementation
AI provider work
Supabase / cloud work
Amap / LBS work
Chrome extension work
12. Validation checklist

Validation performed or expected for this closing checkpoint:

npm.cmd run build
git status
origin/main check
Vercel deployment commit check
browser cache-bypass check

Stable deployment URL for verification:

https://house-folio.vercel.app/?v=17c1584

Normal public URL:

https://house-folio.vercel.app/
