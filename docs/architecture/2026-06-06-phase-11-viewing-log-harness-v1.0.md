# Phase 11 Viewing Log Harness v1.0

## Product Boundary

HouseFolio is a local-first private rental decision tool for renters in mainland China. It helps a renter collect, compare, review, and decide among candidate listings they already found through other channels.

HouseFolio is not:

* a property listing platform;
* a property aggregation platform;
* an agency platform;
* a landlord-side tool;
* a viewing appointment platform;
* a real-listing verification service;
* a public listing or photo database;
* an AI housing judge.

## Phase 11 Background

Phase 10 OCR work remains preserved, but it no longer blocks v1.0. Phase 11 adds a new route:

```
/viewing-log
```

The page title is:

```
看房计划与记录
```

The navigation label is:

```
看房记录
```

## Page Responsibilities

`/portfolio/new` creates the base listing file.

`/portfolio` is the main candidate-listing archive workbench.

`/portfolio/[id]` is the complete detail view for a single listing.

`/viewing-log` is a quick projection and fast-edit panel for the viewing scenario. It should help the user prepare for visits, capture impressions after visits, and triage viewed or excluded listings without becoming a separate archive.

## Single Source of Truth

Phase 11 must use `listingId` as the relationship key for viewing-process data.

Do not establish a second listing database. Do not establish a duplicated sync layer. The `/viewing-log` page must project over the same canonical listing data used by `/portfolio` and `/portfolio/[id]`.

UI pages and components must call shared business-layer functions. They must not directly manipulate localStorage, IndexedDB, or platform SDKs.

## User Ratings

`/viewing-log` only shows user-entered star ratings.

Unviewed listings show:

```
期待值
```

Viewed listings show:

```
总体评分
```

These two ratings are stored independently. They must not overwrite or imply each other.

`/viewing-log` must not display system reference score, recommendation score, or system stars.

## Viewed Status

`已排除` is not the same as `已看房`.

The product needs an explicit viewed marker or timestamp field. Excluding a listing must not automatically mark it as viewed, and marking a listing as viewed must not automatically exclude it.

## UI Direction

The `/viewing-log` experience should use a card-style table that remains quick to scan during a viewing workflow.

Required groups:

* 待看房
* 已看房
* 已排除

Groups should be visually distinct, but the distinction must not rely only on color. Use text labels, layout, icons, density, or other non-color cues where practical.

Desktop should support a floating summary. Clicking an item should open a quick-edit drawer. Mobile should degrade to cards.

Avoid a heavy SaaS dashboard style. The route is a renter's field notebook and decision aid, not an operations cockpit.

## Data Rights

Any newly added local field must be covered by:

* Settings view;
* JSON export;
* JSON import;
* local clear.

This applies to the viewing-process record and any later local additions in the same area.

## Worktree Isolation

OCR technical line:

```
E:\Projects\housefolio
branch: phase10b-r10-controlled-salvage
```

Phase 11 product line:

```
E:\Projects\housefolio-v1-viewing-log
branch: phase11-viewing-log-workbench
```

Do not touch the Phase 10 OCR worktree, runner, scratch workspace, or evidence from Phase 11 tasks.

## Adaptive Codex Batching

Low-risk tasks should prefer one complete module delivery.

Medium-risk tasks should be split into 2 to 3 controlled stages.

High-risk tasks should begin with docs-only review.

Do not mechanically split a clear, low-risk module into tiny artificial tasks.

For Phase 11B-C, a cohesive implementation module is acceptable if the scope remains within the canonical viewing-record path and validation remains controlled.

## Windows PowerShell Notes

Use `npm.cmd` and `npx.cmd` on Windows PowerShell.

All newly written files must be UTF-8 without BOM.

Use literal paths when reading or editing dynamic `[id]` route files.

## Pause Conditions

Pause with:

```
PAUSE_FOR_REVIEW
```

when:

* canonical authority is unclear;
* old JSON import compatibility is uncertain;
* diff expands beyond approved files;
* build fails;
* task crosses into OCR or fragile shared state.
