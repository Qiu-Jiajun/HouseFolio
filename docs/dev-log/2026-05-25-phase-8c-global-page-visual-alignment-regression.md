# Phase 8C Global Page Visual Alignment Regression

Date: 2026-05-26

## Files Changed

- `src/app/globals.css`
- `src/app/compare/page.tsx`
- `src/app/demo/page.tsx`
- `src/app/portfolio/[id]/page.tsx`
- `src/app/portfolio/new/page.tsx`
- `src/app/settings/page.tsx`
- `src/components/app-nav.tsx`
- `src/components/compliance-footer.tsx`

## Pages Touched

- `/compare`
- `/demo`
- `/portfolio/new`
- `/portfolio/[id]`
- `/settings`
- Shared navigation and compliance footer used by Portfolio-adjacent pages.

The homepage was not redesigned. The `/portfolio` page and hero illustration were not changed except through the shared navigation/footer styling.

## Build Result

- Command: `npm.cmd run build`
- Result: PASS
- Next.js completed compile, TypeScript, static page generation, and final optimization.

## Forbidden Wording Scan

- Result: PASS: no banned wording found
- Scope included the app pages, shared components, compare components, and `src/content/zh-cn.ts` listed in the Phase 8C brief.

## Chinese UTF-8 Marker Check

- Not run for this phase because `src/content/zh-cn.ts` was not changed.

## Manual Browser Regression

- `/` loads.
- `/portfolio` loads and the hero illustration remains present.
- `/portfolio/new` loads and the Add Listing form controls remain visible.
- `/portfolio/[id]` route is reachable.
- `/compare` loads.
- `/compare?ids=listing-001,listing-002` route is reachable.
- `/settings` loads; local data controls for export, clear, refresh, import, and photo data remain visible.
- `/demo` loads and demo cards render.
- Shared navigation remains visible on all touched pages.
- Compliance footer remains visible where previously used.

The local browser profile had an empty Portfolio data set during this check, so full detail-card and two-listing comparison content could not be verified with existing saved listings. No code paths for listing persistence, selected-id parsing, compare models, AI confirmation/output, notes, ratings, photos, status, settings import/export/clear, or commute calculation were modified.

## Workflows Preserved

- Add Listing form fields, validation, and submit handler were not changed.
- Portfolio detail status, notes, ratings, photos, commute, and reference-score logic were not changed.
- Compare selected-id parsing, table model, and AI explanation confirmation/output behavior were not changed.
- Settings local data export/import/clear and photo clearing logic were not changed.
- No API routes, `lib/*` files, data models, localStorage keys, or IndexedDB keys were changed.

## Known Follow-Up Items

- The alignment uses a narrow `hf-warm-scope` CSS layer to avoid large component rewrites. Future design passes can replace old dark utility classes directly inside individual panels when those components receive deeper UX work.
- Demo page copy and data semantics were left untouched; only its page shell and scoped visual treatment changed.
