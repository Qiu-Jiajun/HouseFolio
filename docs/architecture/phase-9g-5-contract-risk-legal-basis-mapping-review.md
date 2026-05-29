# Phase 9G-5: Contract risk legal basis mapping review

Date: 2026-05-29

## 1. Stable point

Current stable point:

```text
5d78c03 test: preserve literal contract legal basis ids
```

## 2. Phase goal

Phase 9G-5 reviews which current contract risk rules can safely reference the
existing legal basis seed entries.

This phase is review-only.

It does not:

- implement mappings
- add new legal basis entries
- add a resolver
- modify UI
- modify API routes
- connect DeepSeek
- implement RAG
- add OCR, PDF, or photo handling
- save contract history
- add localStorage or IndexedDB keys
- modify package files
- add test runtime dependencies

## 3. Current risk rules

Current seed rules:

- `policy_clearance_no_compensation`
- `landlord_entry_without_notice`
- `excessive_late_fee_or_auto_termination`
- `unclear_deposit_deduction`
- `excessive_early_termination_penalty`
- `repair_responsibility_shifted_to_tenant`

## 4. Current legal basis entries

Current legal basis seed entries:

- `deposit_handling_refund_context`
- `landlord_entry_living_privacy_context`
- `repair_responsibility_context`
- `lease_stability_policy_clearance_context`

These entries are context anchors only. They are not legal determinations or
outcome predictions.

## 5. Proposed minimal mapping

| Risk rule | Proposed legal basis id | Reason |
| --- | --- | --- |
| `policy_clearance_no_compensation` | `lease_stability_policy_clearance_context` | Existing basis covers lease stability and policy-clearance context. |
| `landlord_entry_without_notice` | `landlord_entry_living_privacy_context` | Existing basis covers entry boundary and living privacy context. |
| `unclear_deposit_deduction` | `deposit_handling_refund_context` | Existing basis covers deposit handling, deduction, and refund context. |
| `repair_responsibility_shifted_to_tenant` | `repair_responsibility_context` | Existing basis covers repair responsibility and natural-wear context. |

This mapping is intentionally partial.

## 6. Rules that should stay unmapped

The following rules should remain unmapped for now:

- `excessive_late_fee_or_auto_termination`
- `excessive_early_termination_penalty`

Reason:

- Current legal basis seeds do not yet include a dedicated late-payment,
  cure-period, or early-exit cost-allocation basis.
- These rules should not be forced into the lease-stability basis just to reach
  full coverage.
- Over-broad mapping would blur distinct risk domains and could make later
  explanations feel more certain than the data supports.

## 7. Is the current seed enough?

The current four-entry legal basis seed is enough for minimal mapping of four
of the six current risk rules.

It is not enough for full current-rule coverage. A later basis expansion should
add a focused payment delay / termination-condition / early-exit cost-allocation
context before mapping the remaining two rules.

## 8. Likely Phase 9G-6 implementation scope

Likely modify only:

- `src/lib/contract/risk-rules.ts`

Implementation direction:

- Set `legalBasisIds` for the four safely mapped rules only.
- Do not add new legal basis entries.
- Do not add a resolver.
- Do not change matcher behavior.
- Do not modify UI or API routes.

Expected mapping:

```ts
policy_clearance_no_compensation:
  ["lease_stability_policy_clearance_context"]

landlord_entry_without_notice:
  ["landlord_entry_living_privacy_context"]

unclear_deposit_deduction:
  ["deposit_handling_refund_context"]

repair_responsibility_shifted_to_tenant:
  ["repair_responsibility_context"]
```

The two unmapped rules should keep `legalBasisIds: []` until dedicated context
entries exist.

## 9. Boundary risks

### 9.1 Over-broad mapping

Mapping payment-delay or early-exit rules to a generic lease-stability basis
would be too broad. The mapping should remain domain-specific.

### 9.2 Legal conclusion drift

Legal basis ids should support background context only. They should not turn a
risk signal into a formal conclusion or outcome prediction.

### 9.3 Freshness risk

The current legal basis entries are manually checked seed data. Before any
public display, official source freshness should be reviewed again.

### 9.4 Future UI or AI misuse

Later UI or AI phases must keep legal basis context restrained. Legal basis
entries should be presented as signing-stage background and questions to
confirm, not as a final answer.

## 10. Validation commands

Use:

```powershell
npm.cmd run build
```

Optional implementation boundary scan:

```powershell
Get-ChildItem .\src\lib\contract -Recurse -File |
  Select-String -SimpleMatch -Pattern "DeepSeek","deepseek","/api/ai/contract-review","contract-review-explanation","RAG","OCR","ocr","PDF","pdf","type=`"file`"","accept=","localStorage","indexedDB","IndexedDB","setItem","getItem","createObjectStore","fetch(","process.env","window.","document."
```

Optional wording scan, excluding the fixture file that intentionally stores
forbidden-word test data:

```powershell
Get-ChildItem .\src\lib\contract -Recurse -File |
  Where-Object { $_.Name -ne "risk-matcher-fixture-contract-check.ts" } |
  Select-String -SimpleMatch -Pattern "自动索赔","法院会支持","可以直接起诉"
```

## 11. Non-goals

Phase 9G-5 does not:

- implement legal basis mappings
- add new legal basis entries
- add a legal basis resolver
- modify risk rule content
- modify matcher behavior
- add UI display
- add API routes
- connect DeepSeek or any AI provider
- implement RAG
- add OCR, PDF, or photo handling
- save contract history
- add localStorage or IndexedDB keys
- add package dependencies
- add test runtime dependencies

## 12. Suggested next commit

If this review document is committed directly, use:

```text
docs: review contract risk legal basis mapping
```
