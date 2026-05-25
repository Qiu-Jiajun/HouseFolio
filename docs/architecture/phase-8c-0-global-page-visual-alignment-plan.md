# Phase 8C-0 Global Page Visual Alignment Plan

## Visual Baseline

- Primary baseline: the current local `/portfolio` page, including its warm off-white shell, olive actions, soft cards, rounded hero, and moderate decorative illustration.
- Secondary reference: `docs/reference/phase-8a/HouseFolio-portfolio-reference.png`.
- Interpretation principle: design-spirit adaptation, not rigid pixel copying. Each page should keep its own purpose and workflow while adopting the calmer Portfolio visual language.

## Pages And Components To Inspect

- `/`
- `/portfolio`
- `/portfolio/new`
- `/portfolio/[id]`
- `/compare`
- `/settings`
- `/demo`
- Shared presentation components: `AppNav`, `ComplianceFooter`, add listing form, detail view panels, compare table and explanation panels, settings panels.

## Alignment Principles

- Warm renter-facing page shell: off-white backgrounds, olive accents, soft borders, and lighter card surfaces.
- Clear hierarchy: page intro, primary action or workflow area, then content cards/forms/tables.
- Keep existing business information visible; do not hide controls for aesthetics.
- Use rounded cards and breathable spacing without turning every surface into decoration.
- Preserve the current `/portfolio` redesign and hero illustration.

## Logic Preservation Rules

- Do not change data models, API routes, storage keys, AI/LBS/Supabase integrations, or local-store behavior.
- Do not alter form field meaning, validation requirements, submit behavior, compare selected-id handling, AI confirmation/output flow, settings export/import/clear behavior, notes, ratings, photos, status, or commute triggers.
- Keep changes focused on className/layout wrapper adjustments and equivalent copy only when needed.

## Regression Checks

- `npm.cmd run build`
- `git status`
- `git diff --stat`
- Forbidden wording scan across touched pages/components/content.
- Chinese UTF-8 marker check if `src/content/zh-cn.ts` changes.
- Browser checks for `/`, `/portfolio`, `/portfolio/new`, `/portfolio/[id]`, `/compare`, `/compare?ids=...`, `/settings`, and `/demo`.

## Boundaries

- No new AI, LBS, OCR, legal review, scraping, matching, true-listing certification, public listing database, transaction, landlord, commission, or deposit workflows.
- No new dependencies.
- No push to `origin/main`.
