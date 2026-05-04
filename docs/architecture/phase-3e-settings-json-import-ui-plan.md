# Phase 3E-3｜Settings JSON Import UI Plan

## 1. Phase Goal

Phase 3E-3 defines the Settings JSON import UI plan.

This phase does not implement UI code. It only documents the intended user flow, UI copy, confirmation behavior, error states, and implementation boundary before touching Settings.

The purpose is to prevent accidental expansion from structured JSON import into photo ZIP restore, cloud sync, or third-party data import.

## 2. Product Position

JSON import belongs to the local-first data rights layer.

It helps users restore or migrate their local HouseFolio structured data between browsers or devices.

It is not:

- cloud sync
- account backup
- multi-device realtime sync
- photo restore
- third-party platform import
- AI-assisted import
- rental website scraping

## 3. Current Technical Basis

Already completed:

- Phase 3E-0: JSON import boundary review
- Phase 3E-1: pure import helper scaffold
- Phase 3E-2: helper checkpoint

Existing helper files:

- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts

Existing helper functions:

- parseHouseFolioLocalDataImportJson
- applyHouseFolioLocalDataImportPayload

Current importable keys:

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

## 4. Future Settings UI Location

The JSON import entry should live in the existing Settings local data area, likely inside or near:

- src/components/settings-local-data-panel.tsx

It should not be placed in:

- Portfolio
- Detail
- Add Listing
- AppNav
- ComplianceFooter
- a new route
- a modal-only hidden feature without Settings entry

Reason:

Settings is the current home for local data rights:

- view local data
- export local JSON
- clear local data
- view photo storage status
- clear local photos

Import belongs to the same data rights cluster.

## 5. Suggested UI Structure

Recommended section title:

导入本地 JSON

Recommended short description:

从你之前导出的 HouseFolio JSON 文件中恢复本机结构化数据。导入会覆盖当前本机保存的房源、笔记、评分、状态、通勤锚点和通勤结果，但不会恢复看房照片。

Recommended controls:

- file input accepting .json
- import button
- current data backup reminder
- user confirmation before writing
- success message
- failure message
- ignored keys summary if needed

Recommended import button text:

导入 HouseFolio JSON

Recommended warning text before file input:

导入前建议先导出当前本机数据作为备份。JSON 导入只恢复结构化数据，不包含本机照片文件。

## 6. User Flow

Expected future flow:

1. User opens Settings.
2. User sees local data management area.
3. User clicks or selects a JSON file.
4. App reads the selected file in the browser.
5. App parses the file with parseHouseFolioLocalDataImportJson.
6. If parsing fails, show user-readable error and do not write anything.
7. If parsing succeeds, show recognized key count and overwrite warning.
8. User confirms.
9. App calls applyHouseFolioLocalDataImportPayload.
10. App refreshes local data snapshot.
11. App displays success message.
12. App suggests reloading the app if needed.

## 7. Confirmation Behavior

The import action must require explicit confirmation.

Recommended confirmation copy:

导入这个 JSON 文件会覆盖当前本机保存的 HouseFolio 结构化数据，包括房源、笔记、评分、状态、通勤锚点和通勤结果。此操作不会恢复或导入本机照片。建议你先导出当前数据作为备份。是否继续？

The confirmation should happen after:

- file has been selected
- JSON has been parsed successfully
- at least one importable key has been found

The confirmation should happen before:

- any localStorage write

## 8. Error States

The future UI should handle at least:

1. No file selected.
   Message: 请选择一个 HouseFolio JSON 文件。

2. Invalid JSON.
   Message: 导入文件不是有效的 JSON。

3. Invalid shape.
   Message: 导入文件结构不符合 HouseFolio 本地数据格式。

4. No importable keys.
   Message: 导入文件中没有可识别的 HouseFolio 本地数据键。

5. Browser read failure.
   Message: 文件读取失败，请重新选择 JSON 文件。

6. Import apply failure.
   Message: 导入失败，请确认浏览器允许本地存储。

7. Success.
   Message: 导入成功。本机结构化数据已更新。

## 9. Success State

After successful import, Settings should refresh:

- local data snapshot
- key counts
- export preview status if present

The UI may also show:

- imported key count
- skipped key count
- ignored key count

But the first version can keep this simple.

Recommended success copy:

导入成功。已更新本机结构化数据。看房照片不包含在 JSON 导入中，如需迁移照片，请等待后续备份包功能。

## 10. Boundary with Photos

The UI must clearly say:

- JSON import does not include photos.
- Current local photos are stored separately in the browser.
- Importing JSON should not delete current photos.
- Photo backup belongs to a later ZIP backup package phase.

It must not claim:

- restore all HouseFolio data
- restore photos
- migrate complete portfolio with images
- import backup package

Better wording:

导入本地 JSON

Avoid wording:

导入完整备份
恢复全部数据
导入照片
恢复 Portfolio 图片

## 11. Implementation Boundary for Future Phase

Future implementation may touch:

- src/components/settings-local-data-panel.tsx
- src/lib/privacy/local-data-import.ts
- src/content/zh-cn.ts

It should not touch:

- src/lib/storage/local-photo-provider.ts
- src/lib/storage/photos.ts
- src/components/listing-photo-panel.tsx
- src/components/listing-card.tsx
- src/app/portfolio/page.tsx
- src/app/portfolio/[id]/page.tsx
- src/app/api/lbs/commute/transit/route.ts
- src/lib/lbs
- src/lib/ai
- Supabase-related files
- any map UI files

## 12. Future Implementation Rules

When implementing the UI later:

- do not call localStorage.clear()
- do not write unknown keys
- do not touch IndexedDB
- do not touch photo storage
- do not fetch remote URLs
- do not read third-party pages
- do not call AI
- do not call Amap
- do not call Supabase
- do not create a new route
- do not import from clipboard automatically

The user must explicitly select a local JSON file.

## 13. Validation Plan for Future UI Phase

Future manual regression should verify:

1. Export current local JSON.
2. Import an invalid JSON file and confirm nothing changes.
3. Import a JSON file with unknown keys and confirm unknown keys are ignored.
4. Import valid HouseFolio keys and confirm Settings snapshot updates.
5. Confirm existing photos are not deleted.
6. Confirm no route changes.
7. Confirm npm.cmd run build passes.
8. Confirm git status clean after commit.

## 14. Phase 3E-3 Validation Standard

This planning phase is complete when:

- docs/architecture/phase-3e-settings-json-import-ui-plan.md exists
- npm.cmd run build passes
- git status is clean after commit
- no source code behavior changes
- no UI changes
- no import implementation

## 15. Recommended Commit Message

docs: plan settings json import ui