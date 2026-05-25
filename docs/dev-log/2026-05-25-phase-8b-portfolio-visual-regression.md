# Phase 8B Portfolio Visual Regression

Date: 2026-05-25

## Files Changed

- `src/app/portfolio/page.tsx`
- `src/components/portfolio-list.tsx`
- `src/components/listing-card.tsx`
- `src/content/zh-cn.ts`

## Build Result

- `npm.cmd run build`
- Result: PASS
- Next.js reported successful compile, TypeScript, static page generation, and final page optimization.

## Functional Checks

- `/portfolio` loads successfully in the local browser at `http://localhost:3000/portfolio`.
- Existing listing cards render; local browser check showed 3 cards.
- Add Listing CTA navigates to `/portfolio/new`.
- Detail link check navigates to `/portfolio/listing-001`.
- No API routes, data models, storage keys, LBS, AI, privacy, or algorithm internals were changed.

## Compare Selection Preservation

- Initial Compare action remains disabled with 0 selected listings.
- Selecting 2 listing cards enables the Compare action.
- Compare navigation preserved: `/compare?ids=listing-001,listing-002`.
- Selection remains session-state only in `PortfolioList`; no new localStorage or IndexedDB persistence was added.

## Forbidden Wording Scan

Command:

```bash
node -e "const fs=require('fs'); const files=['src/app/portfolio/page.tsx','src/components/portfolio-list.tsx','src/components/listing-card.tsx','src/content/zh-cn.ts']; const banned=['最佳房源','最优选择','系统推荐','推荐分','替你决定','真房源','避坑保真','AI律师','法律审查系统','判定违法','保证避坑','霸王条款检测','律师级审查']; for (const f of files) { if (!fs.existsSync(f)) continue; const s=fs.readFileSync(f,'utf8'); for (const b of banned) { if (s.includes(b)) { console.error('BANNED', b, 'in', f); process.exit(1); } } } console.log('PASS: no banned wording found');"
```

Result: PASS: no banned wording found

## Chinese UTF-8 Marker Check

Command:

```bash
node -e "const fs=require('fs'); const s=fs.readFileSync('src/content/zh-cn.ts','utf8'); const checks=['候选房源','辅助比较','本地保存']; for (const c of checks) { if (!s.includes(c)) { console.error('Missing marker:', c); process.exit(1); } } console.log('PASS: zh-cn markers found');"
```

Result: PASS: zh-cn markers found

## Visual Adaptation Notes

- The page now uses a warm off-white shell, olive primary actions, soft borders, and more breathable card spacing to align with `docs/reference/phase-8a/HouseFolio-portfolio-reference.png`.
- The header copy frames Portfolio as a private candidate listing board and viewing memo, not a listing platform or dashboard.
- Listing cards keep title, area hint, rent, commute reference, reference score, status, selection button, and detail link visible.
- Reference score copy was softened to "辅助比较" and "不代表最终建议".
- Empty state now explains self-added listings, commute reference, auxiliary comparison, viewing records, local storage, and the no publish/scrape/match boundary.

## Intentional Deviations From Reference

- The reference image includes a broader home-page-style navigation and a contract-check panel. Portfolio keeps the existing HouseFolio navigation and does not add unsupported contract, OCR, legal, booking, or matching actions.
- The reference uses a three-card preview and comparison summary layout. The implementation preserves the real Portfolio data flow, filter/sort controls, and existing listing card component rather than introducing fake data fields.
- The hero visual is an abstract warm memo surface rather than a literal copied sofa image, because the reference is used as design-spirit guidance and the task forbids forcing a one-to-one screenshot recreation.
- The Compare entry remains tied to selecting 2 to 4 real listings; it is not converted into a static comparison mock.

## Remaining Follow-Up Items

- The shared `AppNav` and `ComplianceFooter` still use the existing dark shared styling. They were left unchanged to avoid modifying homepage, settings, compare, demo, detail, and add-listing surfaces outside this Phase 8B scope.
