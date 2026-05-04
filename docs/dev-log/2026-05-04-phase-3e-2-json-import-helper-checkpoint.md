# Phase 3E-2｜JSON Import Helper Checkpoint

## 1. Phase Goal

Phase 3E-2 records the completion of the JSON import helper scaffold.

This checkpoint confirms that Phase 3E has moved from boundary review to a minimal pure-function helper layer, but the user-facing import flow has not been implemented yet.

## 2. Completed in Phase 3E-1

New files:

- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts

The helper currently provides:

- IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS
- ImportableHouseFolioLocalStorageKey
- HouseFolioLocalDataImportPayload
- parseHouseFolioLocalDataImportJson
- applyHouseFolioLocalDataImportPayload

The contract check verifies that:

- known HouseFolio localStorage keys are accepted
- unknown keys can be ignored
- the helper types compile
- the import payload stays constrained to known HouseFolio structured data keys

## 3. Current Importable Keys

The current whitelist is:

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

The whitelist deliberately does not include:

- IndexedDB photo blobs
- photo thumbnails
- arbitrary browser localStorage keys
- third-party platform data
- AI outputs
- Amap raw route data
- Supabase data
- cloud storage references

## 4. Current Behavior

The parser accepts JSON shaped either as:

- a direct object containing known HouseFolio localStorage keys
- an object with a data object
- an object with a localStorage object

It rejects:

- invalid JSON
- non-object JSON
- JSON without any importable HouseFolio keys

The apply function writes only known keys to localStorage.

It does not call localStorage.clear().

It does not touch IndexedDB.

It does not touch photo storage.

It does not call AI, Amap, Supabase, fetch, or any remote service.

## 5. Important Boundary

Phase 3E-1 is not a complete JSON import feature.

Still not implemented:

- Settings UI import button
- file input
- browser file reading
- user confirmation modal
- import preview
- import success / failure message
- local data snapshot refresh after import
- manual browser regression
- photo restore
- ZIP backup package
- JSON export format upgrade

## 6. Product Meaning

This helper belongs to the local-first data rights layer.

It supports HouseFolio v2.0 by preparing a safe structured-data restore path for single-device local-first use.

It does not turn HouseFolio into a cloud sync product.

It does not import third-party rental platform content.

It does not create a shared listing database.

## 7. Validation

Before this checkpoint:

- npm.cmd run build passed
- TypeScript compiled successfully
- git commit succeeded

Implementation commit:

- 1208b34 feat: scaffold json import helper

## 8. Next Recommended Step

Next phase:

Phase 3E-3: Settings JSON import UI plan

Recommended scope:

- write a small implementation plan before touching UI
- define the exact Settings UI copy
- define confirmation behavior
- define failure states
- still avoid photos / ZIP / cloud sync / AI / map / Supabase

## 9. Forbidden Next-Step Expansion

Do not jump directly to:

- photo ZIP export
- photo ZIP import
- Portfolio cover photos
- AI import analysis
- cloud backup
- Supabase sync
- /compare
- map UI
- Chrome extension