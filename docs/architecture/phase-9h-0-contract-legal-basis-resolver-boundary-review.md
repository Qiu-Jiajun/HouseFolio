# Phase 9H-0: Contract legal basis resolver boundary review

Date: 2026-05-31

## 1. Stable point

Current confirmed stable point:

```text
7cf5c43 docs: log contract legal basis mapping checkpoint
```

Confirmed state before this docs-only phase:

- `HEAD = main = origin/main = origin/HEAD = 7cf5c43`
- working tree clean
- `npm.cmd run build` passed
- remote `origin/main` was verified by `git ls-remote`

## 2. Phase goal

Phase 9H-0 documents the boundary for a future pure TypeScript legal basis
resolver.

The future resolver would convert already-attached `legalBasisIds` from:

- `ContractRiskFinding`
- or `readonly ContractRiskFinding[]`

into:

- `readonly LegalBasisEntry[]`

The resolver is only a deterministic lookup layer. It is not implemented in
this phase.

## 3. Current state

The current contract risk layer already has:

- `contractRiskRules` as the source of risk metadata.
- `legalBasisIds` attached to selected risk rules.
- `matchContractRisks()` copying each rule's `legalBasisIds` onto each
  `ContractRiskFinding`.
- `contractLegalBasisEntries` as the canonical seed list of legal basis
  background records.
- type-level alignment checks that require rule-referenced legal basis IDs to
  exist in `contractLegalBasisEntries`.
- intentionally unmapped rules whose `legalBasisIds` arrays remain empty.

Current legal basis entries are supporting background only. They are not a
complete source library and are not a decision system.

## 4. Exact problem the resolver should solve

The resolver should solve one narrow problem:

```text
legalBasisIds already present on findings -> canonical LegalBasisEntry records
```

It should:

- read only the `legalBasisIds` already attached to `ContractRiskFinding`.
- return canonical `LegalBasisEntry` records from `contractLegalBasisEntries`.
- preserve the existing mapping decisions made by the risk-rule layer.
- provide a small reusable lookup boundary for later per-risk display and
  report-level aggregation.

It must not:

- inspect clause text.
- inspect matched phrases.
- infer legal basis from descriptions, keywords, or risk wording.
- decide whether a clause is risky.
- add, remove, or change risk IDs.
- broaden mappings merely to increase coverage.
- create legal conclusions.
- generate enriched objects, citation sentences, summaries, recommendations, or
  legal interpretation text.

The risk matcher decides what was found. The legal basis resolver should only
resolve references that already exist on the finding.

## 5. Candidate future API shape

Recommended candidate API shape for later implementation planning:

```ts
resolveLegalBasisForFinding(
  finding: ContractRiskFinding,
): readonly LegalBasisEntry[]

resolveLegalBasisForFindings(
  findings: readonly ContractRiskFinding[],
): readonly LegalBasisEntry[]
```

Both functions are candidate APIs only. Phase 9H-1 should confirm the minimal
export surface before implementation.

The single-finding function supports per-risk display.

The multi-finding function supports deduplicated report-level aggregation.

The single-finding function should be the primitive. The multi-finding function
should compose the same lookup behavior across a readonly findings array.

## 6. Return value

The resolver should return only:

```ts
readonly LegalBasisEntry[]
```

It should not return wrapper objects, display models, generated text,
diagnostics, source snippets, recommendation text, AI prompt fragments, or UI
state.

Returning canonical entries keeps the boundary small and lets later display or
plain-language explanation layers make their own bounded formatting choices.

## 7. Empty mapping behavior

The resolver should treat empty mappings as normal data.

Required behavior:

- A finding with `legalBasisIds: []` returns `[]`.
- An empty findings array returns `[]`.
- Intentionally unmapped rules are valid.
- Partial mapping coverage is intentional.
- Empty mappings must not warn, throw, log, or degrade runtime behavior.

This is important because the current seed legal basis set intentionally maps
only the risk rules that have focused supporting context. The resolver must not
pressure the project into broad mappings just to avoid empty output.

## 8. Deduplication and stable ordering

The single-finding resolver does not need cross-finding deduplication.

The multi-finding resolver should deduplicate by legal basis ID.

Recommended stable ordering:

1. Preserve input finding order.
2. Within each finding, preserve `legalBasisIds` order.
3. Deduplicate by legal basis ID.
4. Keep the first encountered entry.
5. Do not sort legal basis entries by title, date, source URL, category, or an
   independently invented ranking system.

This keeps report-level output aligned with the matcher's existing ordering and
does not introduce a second ranking model.

## 9. Purity boundary

The future resolver must remain:

- pure TypeScript.
- deterministic.
- runtime-side-effect-free.
- network-free.
- storage-free.
- UI-free.
- API-route-free.
- AI-free.
- RAG-free.
- logging-free.
- warning-free.
- environment-independent.

The resolver should not include `process.env` branches and should not behave
differently across production and development modes.

## 10. Runtime safety boundary

The Phase 9H minimal resolver should be protected primarily by:

- existing type-level legal basis alignment checks.
- later resolver-specific contract checks.

The resolver itself should not add runtime logging, warnings, or
environment-dependent throwing.

If future untrusted boundaries are introduced, such as JSON import, persisted
history restoration, API data, or data migration, HouseFolio should review a
separate input-boundary validator. That validator should remain separate from
the resolver.

Internal diagnostics must never become user-facing legal warnings.

## 11. Type-level protections to keep

The current type-level legal basis checks should remain the main protection for
internal static data:

- `contractLegalBasisEntries` conforms to `readonly LegalBasisEntry[]`.
- `contractRiskRules` conforms to `readonly ContractRiskRule[]`.
- legal basis entry IDs are unique.
- legal basis `relatedRiskIds` values are known `ContractRiskId` values.
- rule `legalBasisIds` values exist in `contractLegalBasisEntries`.

These checks fit the current architecture because legal basis IDs are authored
inside local TypeScript source files, not accepted from untrusted runtime input.

## 12. Later Phase 9H-3 contract checks

A later resolver contract-check phase should cover:

- empty finding mapping returns `[]`.
- empty findings array returns `[]`.
- one mapped finding resolves its expected canonical entry.
- intentionally unmapped findings remain valid.
- repeated basis IDs are deduplicated.
- first-encounter ordering is preserved.
- finding order is preserved.
- `legalBasisIds` order within a finding is preserved.
- resolver does not mutate findings.
- resolver does not mutate `contractLegalBasisEntries`.
- no inference occurs from clause text or matched phrases.
- no runtime side effects are introduced.

These checks should remain local and build-time oriented. They should not add a
test runtime dependency.

## 13. Legal and product boundary

Legal basis entries should be framed as:

- supporting context.
- relevant rule background.
- material for signing-stage clarification.
- background for future plain-language explanation.

They must not be framed as:

- formal advice.
- contract-effect determinations.
- rights-action determinations.
- dispute-process advice.
- automatic compensation claims.
- assured outcomes.

The resolver should not change this product stance because it does not create
new text. It only resolves internal IDs to canonical background records.

## 14. Boundary risks

### 14.1 Inference drift

The resolver could drift into reading clause text, matched phrases, rule
descriptions, or keywords. That would make it a second matcher and blur the
existing rule boundary.

### 14.2 Coverage pressure

Empty mappings could be treated as implementation failures. That would pressure
future phases to broaden legal basis mappings merely to increase coverage.

### 14.3 Ordering drift

An independently sorted legal basis list could conflict with the matcher order
and make report-level output harder to explain.

### 14.4 Display drift

Later UI, report, or AI layers could present supporting background too strongly.
The resolver should not create display text, because display wording needs its
own product and legal boundary review.

### 14.5 Runtime diagnostics drift

Runtime logs, warnings, or mode-specific throwing could turn internal alignment
issues into visible product behavior. Keep diagnostics outside the resolver.

## 15. Likely later implementation scope

Likely add:

- `src/lib/contract/legal-basis-resolver.ts`
- `src/lib/contract/legal-basis-resolver-contract-check.ts`
- a focused docs/dev-log entry for the implementation checkpoint

Avoid modifying unless Phase 9H-1 identifies a concrete need:

- `src/lib/contract/types.ts`
- `src/lib/contract/legal-basis-contract-check.ts`
- `src/lib/contract/risk-matcher.ts`

Do not touch:

- UI files
- API routes
- `src/lib/ai/**`
- `src/lib/local-store/**`
- `src/lib/storage/**`
- `src/lib/db/**`
- `package.json`
- `package-lock.json`

## 16. Explicit out of scope

Phase 9H-0 does not include:

- resolver implementation.
- `src` modification.
- UI integration.
- API route.
- DeepSeek.
- AI prompt builder.
- RAG.
- OCR.
- PDF.
- contract photo handling.
- contract history persistence.
- `localStorage` key.
- `IndexedDB` key.
- package dependency.
- `package.json` modification.
- `package-lock.json` modification.
- testing runtime dependency.
- mapping expansion.
- legal basis content expansion.

## 17. Validation commands

Use:

```powershell
npm.cmd run build
git diff --stat
git diff --name-only
git status
```

## 18. Completion standard

Phase 9H-0 is complete when:

- this architecture review exists at
  `docs/architecture/phase-9h-0-contract-legal-basis-resolver-boundary-review.md`.
- no source files are modified.
- no resolver is implemented.
- no UI, API, AI, RAG, OCR, PDF, photo, persistence, storage-key, or package
  change is introduced.
- `npm.cmd run build` passes.
- `git diff --name-only` lists only this architecture document.

Suggested commit message:

```text
docs: review contract legal basis resolver boundary
```
