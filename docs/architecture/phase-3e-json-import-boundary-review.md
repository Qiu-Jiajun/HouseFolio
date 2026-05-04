# Phase 3E-0｜JSON Import Boundary Review

## 1. Phase Goal

Phase 3E-0 is a boundary review for HouseFolio local JSON import.

This phase only writes an architecture document. It does not implement JSON import, does not change UI, does not modify localStorage behavior, and does not touch IndexedDB photo storage.

The purpose is to define a safe import boundary before adding any import button or parser.

## 2. Product Context

HouseFolio v2.0 defines the product as a local-first private rental decision tool.

The current app already supports local data export and local photo persistence. However, export alone is not enough for a local-first product. Users also need a controlled way to restore or migrate their local HouseFolio data.

JSON import is therefore part of the basic data rights layer:

- export local structured data
- import local structured data
- clear local structured data
- keep photo file import as a later ZIP / backup package phase

This is not a cloud sync feature. It is not a backup account system. It is not a multi-device realtime sync feature.

## 3. Scope of Phase 3E

Phase 3E should focus on structured localStorage data only.

Allowed localStorage keys:

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

Explicitly out of scope:

- IndexedDB photo blobs
- photo thumbnails
- ZIP backup packages
- cloud storage
- Supabase
- AI analysis records
- map raw data
- Amap route raw JSON
- arbitrary browser localStorage keys
- third-party platform data
- automatic crawling or importing from rental websites

## 4. Layer Classification

This feature belongs to:

- Base layer: local candidate listing data management
- Privacy / data rights layer: export, import, clear, local-first migration

It does not belong to:

- L1 LBS calculation
- L2 algorithm scoring
- L3 AI analysis
- Demo Mode
- cloud sync

## 5. Import Boundary

The import function must only accept a user-selected local JSON file.

It must not:

- fetch a remote URL
- read third-party pages
- import from clipboard automatically
- scan local folders
- scan user photos
- import unknown localStorage keys
- import photo blobs
- call AI
- call Amap
- call Supabase

The user must explicitly choose a JSON file through a file input.

## 6. Data Safety Principles

JSON import must follow these principles:

1. Parse defensively.
   Invalid JSON should produce a user-readable error and must not write anything.

2. Whitelist known keys.
   Only known HouseFolio localStorage keys may be imported.

3. Ignore unknown keys.
   Unknown keys should be ignored or reported, but never written to localStorage.

4. Do not touch non-HouseFolio browser data.
   The import flow must never call localStorage.clear().

5. Do not touch IndexedDB photos.
   JSON import must not delete, overwrite, or attempt to restore local photo blobs.

6. Confirm before overwrite.
   The user must confirm that import may replace existing local HouseFolio structured data.

7. Recommend export before import.
   The UI should tell the user to export a backup before importing another JSON file.

8. Refresh after import.
   After successful import, the page should refresh local data status or prompt reload.

## 7. Minimal Import Behavior for MVP

The first implementation should use a conservative replace strategy:

- User selects JSON file.
- App parses JSON.
- App extracts only known HouseFolio keys.
- App shows confirmation.
- App writes only validated known keys into localStorage.
- App does not touch photos.
- App refreshes Settings local data snapshot.

No merge strategy in the first version.

Reason:

- merge rules are harder to explain
- duplicate IDs may create confusing states
- replacing known local HouseFolio data is simpler and safer
- user can export before import as backup

## 8. Expected User-Facing Warning

The import confirmation should communicate:

Importing a HouseFolio JSON file may replace your current local structured data, including saved listings, notes, ratings, statuses, commute anchors, and commute results.

This action will not restore or import local photo files. Photos are stored separately in this browser and will be handled by a later backup package feature.

Please export your current local data before importing another JSON file.

## 9. Relationship with Photos

Current Phase 3D photo storage uses IndexedDB.

JSON import must not claim to restore photos, because the current export JSON does not contain photo Blob data.

The correct product framing:

- JSON import restores structured local data.
- Photo restore belongs to a future ZIP backup package phase.
- Portfolio cover photos should not be implemented in this phase.
- ZIP photo export should not be implemented in this phase.
- ZIP photo import should not be implemented in this phase.

## 10. Relationship with v2.0 Roadmap

Phase 3E follows the v2.0 local-first roadmap.

The logic is:

- Phase 3D completed local photo persistence and photo clearing.
- Phase 3E begins structured local data restoration.
- JSON import is more fundamental than Portfolio cover photos because it improves data rights and single-device migration.
- Photo backup package can come later after JSON import is safe.

This keeps the project aligned with:

- local-first
- user data rights
- migration-friendly architecture
- no cloud-first sensitive data storage

## 11. Allowed Files for Future Implementation

Future Phase 3E implementation may touch:

- src/components/settings-local-data-panel.tsx
- src/lib/privacy/local-data.ts
- src/content/zh-cn.ts

Potential optional helper file:

- src/lib/privacy/local-data-import.ts

But Phase 3E-0 does not implement any code.

## 12. Forbidden Work in Phase 3E-0

Do not implement:

- JSON import UI
- file input
- parser
- schema validator
- localStorage writes
- IndexedDB photo restore
- ZIP export
- ZIP import
- Portfolio cover image
- AI analysis
- map UI
- Supabase
- deployment
- Chrome extension
- /compare route
- formal Phase 4A comparison model

## 13. Validation Standard for Phase 3E-0

Phase 3E-0 is complete when:

- docs/architecture/phase-3e-json-import-boundary-review.md exists
- npm.cmd run build passes
- git status is clean after commit
- no source code behavior changes
- no UI changes
- no new route
- no import implementation

## 14. Commit Message

Recommended commit:

docs: review json import boundary