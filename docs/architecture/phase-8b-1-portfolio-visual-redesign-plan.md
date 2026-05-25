# Phase 8B-1 Portfolio Visual Redesign Plan

## Reference

- Target page: `/portfolio`
- Reference image: `docs/reference/phase-8a/HouseFolio-portfolio-reference.png`
- Interpretation principle: use the reference as a design-spirit anchor, not a rigid pixel-by-pixel blueprint. The implementation should translate its warm, calm, renter-facing mood into the current Portfolio page while preserving HouseFolio's existing data model and component boundaries.

## Files To Modify

- `src/app/portfolio/page.tsx`
- `src/components/portfolio-list.tsx`
- `src/components/listing-card.tsx`
- `src/content/zh-cn.ts`

No API routes, storage keys, data models, AI, LBS, privacy, or algorithm internals should change.

## Visual Direction

- Move the page away from a dark dashboard surface toward a softer private candidate listing board.
- Use warm off-white backgrounds, gentle olive accents, soft borders, and breathable spacing.
- Reframe the page header as a renter-facing intro: users organize listings they already found elsewhere; HouseFolio supports commute reference, auxiliary comparison, and viewing notes.
- Keep cards readable and calm: rent and location should scan quickly, commute should be visible, and reference score should stay secondary.
- Keep controls visible but less like a metrics dashboard.

## Preserved Functionality

- Existing listing loading from local client data.
- Status filter and sort controls.
- Add Listing entry.
- Detail links from listing cards.
- Selecting 2 to 4 listings for Compare.
- Compare navigation through `/compare?ids=...`.
- No persistence of compare selection.

## Product And Compliance Boundaries

- Do not imply a listing platform, listing scraping, public database, matching, booking, certification, legal review, or AI decision system.
- Use language such as "候选房源", "辅助比较", "参考评分", "本地保存", and "不发布、不抓取、不撮合".
- Avoid all forbidden wording listed in the Phase 8B task brief.

## Regression Checks

- Run `npm.cmd run build`.
- Run forbidden wording scan for the modified source files.
- Run Chinese UTF-8 marker check for `src/content/zh-cn.ts`.
- Check `git status` and `git diff --stat`.
- Manually review `/portfolio` for warm reference-image adaptation, existing listing rendering, empty state, Add Listing link, detail links, and Compare selection behavior.
