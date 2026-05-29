# Phase 9G-7: Contract legal basis mapping regression checkpoint

Date: 2026-05-29

## Stable point

Current stable point:

```text
87f9587 feat: add contract risk legal basis mappings
```

## Phase 9G milestones

- Phase 9G-0: legal basis mapping review.
- Phase 9G-1: pure legal basis types and four seed entries.
- Phase 9G-2: legal basis alignment contract check.
- Phase 9G-3: literal legal basis id typing review.
- Phase 9G-4: literal-preserving `contractRiskRules` typing and stronger alignment check.
- Phase 9G-5: contract risk legal basis mapping review.
- Phase 9G-6: populated four minimal `legalBasisIds`.

## Build status

Validation command:

```powershell
npm.cmd run build
```

Status for this checkpoint: to be recorded by the implementation run after this
document is added.

## Current legal basis entries

Current seed entries:

- `deposit_handling_refund_context`
- `landlord_entry_living_privacy_context`
- `repair_responsibility_context`
- `lease_stability_policy_clearance_context`

These entries are background/context anchors for signing-stage risk prompts.
They are not a complete source library and do not provide formal advice.

## Current mapped risk rules

Current minimal mappings:

- `policy_clearance_no_compensation` -> `lease_stability_policy_clearance_context`
- `landlord_entry_without_notice` -> `landlord_entry_living_privacy_context`
- `unclear_deposit_deduction` -> `deposit_handling_refund_context`
- `repair_responsibility_shifted_to_tenant` -> `repair_responsibility_context`

## Intentionally unmapped rules

The following rules remain unmapped:

- `excessive_late_fee_or_auto_termination`
- `excessive_early_termination_penalty`

Reason:

- The current legal basis seed set does not yet include a dedicated context for
  late payment, cure period, termination conditions, or early-exit cost
  allocation.
- These rules should not be attached to a broad lease-stability basis only to
  reach full coverage.
- Keeping them unmapped preserves clearer domain boundaries for later expansion.

## Contract-check guarantees

The current contract checks verify:

- `contractLegalBasisEntries` conforms to `readonly LegalBasisEntry[]`.
- `contractRiskRules` conforms to `readonly ContractRiskRule[]`.
- legal basis entry ids are unique.
- legal basis `relatedRiskIds` values are valid `ContractRiskId` values.
- rule `legalBasisIds` are literal-preserving and must exist in
  `contractLegalBasisEntries`.
- matcher contract checks still confirm that the matcher accepts clause segments
  and returns `ContractRiskFinding[]`.

## Boundaries not crossed

Phase 9G did not add:

- legal basis resolver
- UI display for legal basis entries
- new API route
- DeepSeek or other AI connection
- RAG workflow
- OCR, PDF, or photo handling
- contract review history persistence
- localStorage or IndexedDB keys
- package dependency changes
- test runtime dependency

## Remaining limitations

- The legal basis entries are seed context records, not a complete basis library.
- There is still no resolver from `ContractRiskFinding` to `LegalBasisEntry[]`.
- Two seed risk rules remain unmapped until more focused context entries exist.
- Source freshness should be reviewed again before any public-facing display.
- No UI or AI workflow consumes legal basis entries yet.

## Recommended next phase

Recommended next step:

- Plan a pure resolver from `ContractRiskFinding` to `LegalBasisEntry[]`, without
  UI, API, AI, persistence, or package changes.

Alternative next step:

- Add a focused legal basis seed for late payment, cure period, termination
  conditions, and early-exit cost allocation before mapping the two remaining
  seed rules.

Either path should remain local, deterministic, and limited to background
context for signing-stage risk prompts.
