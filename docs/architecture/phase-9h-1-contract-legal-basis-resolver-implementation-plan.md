# Phase 9H-1: Contract legal basis resolver implementation plan

Date: 2026-05-31

## 1. Stable point

Current confirmed stable point:

```text
34c7275 docs: review contract legal basis resolver boundary
```

Confirmed state before this docs-only phase:

- `HEAD = main = origin/main = origin/HEAD = 34c7275`
- working tree clean
- `npm.cmd run build` passed
- remote `origin/main` was verified by `git ls-remote`

## 2. Phase goal

Phase 9H-1 writes the minimal implementation plan for the future Phase 9H-2
pure TypeScript legal basis resolver.

Phase 9H-1 does not implement the resolver.

The future resolver should convert already-attached `legalBasisIds` from:

- `ContractRiskFinding`
- or `readonly ContractRiskFinding[]`

into:

- `readonly LegalBasisEntry[]`

The resolver must remain a deterministic lookup layer only.

## 3. Current state

The current contract risk layer already provides the data flow needed by the
future resolver:

- `contractRiskRules` owns risk metadata and selected `legalBasisIds`.
- `matchContractRisks()` copies each matched rule's `legalBasisIds` onto the
  produced `ContractRiskFinding`.
- `contractLegalBasisEntries` is the canonical legal basis entry list.
- `legal-basis-contract-check.ts` checks legal basis entry shape, unique entry
  IDs, known related risk IDs, and rule-referenced legal basis ID existence.
- some risk rules intentionally keep `legalBasisIds: []`.

The future resolver should not change this data ownership. It should only
resolve references that are already present on findings.

## 4. Phase 9H-2 file scope

Phase 9H-2 should add exactly one source file:

```text
src/lib/contract/legal-basis-resolver.ts
```

Phase 9H-2 should not add the resolver contract-check file.

Phase 9H-3 should later add:

```text
src/lib/contract/legal-basis-resolver-contract-check.ts
```

Avoid modifying these files unless Phase 9H-2 encounters a concrete build
blocker:

- `src/lib/contract/types.ts`
- `src/lib/contract/risk-rules.ts`
- `src/lib/contract/risk-matcher.ts`
- `src/lib/contract/legal-basis.ts`
- `src/lib/contract/legal-basis-contract-check.ts`

## 5. Future resolver API shape

Phase 9H-2 should export both APIs:

```ts
resolveLegalBasisForFinding(
  finding: ContractRiskFinding,
): readonly LegalBasisEntry[]

resolveLegalBasisForFindings(
  findings: readonly ContractRiskFinding[],
): readonly LegalBasisEntry[]
```

The single-finding API should be the primitive.

The multi-finding API should compose the single-finding behavior.

Both functions should return canonical `LegalBasisEntry` records directly.

Neither function should return wrapper objects, display models, generated text,
diagnostics, summaries, recommendations, citation sentences, AI prompt
fragments, or UI state.

## 6. Internal readonly lookup strategy

The resolver should derive one module-local readonly lookup only from:

```text
contractLegalBasisEntries
```

Recommended conceptual shape:

```ts
const legalBasisById: ReadonlyMap<ExistingLegalBasisIdType, LegalBasisEntry> =
  new Map(
    contractLegalBasisEntries.map((entry) => [entry.id, entry]),
  );
```

Implementation notes:

- use the project's actual existing legal basis ID type in implementation.
- do not invent a new type name merely for stylistic consistency.
- do not modify `types.ts` unless Phase 9H-2 encounters a concrete build
  blocker.
- the lookup must only be read.
- do not call `set()`, `delete()`, or `clear()` on the lookup.
- do not derive lookup data from rules, findings, text, matched phrases,
  keywords, descriptions, or risk wording.

## 7. Unknown-ID fallback behavior

Current type-level alignment checks should prevent unknown IDs in internal
static data. However, TypeScript `Map.get()` still returns
`LegalBasisEntry | undefined`.

The future resolver must remain a total, pure, deterministic function.

Recommended single-ID fallback behavior:

```ts
const entry = legalBasisById.get(id);

if (!entry) {
  return [];
}

return [entry];
```

For the multi-finding API, compose the same single-finding behavior.

Required boundary:

- an unknown ID should be skipped.
- skip unknown IDs individually.
- an unresolved ID must not discard other resolvable IDs from the same finding.
- do not warn.
- do not throw.
- do not log.
- do not branch on `process.env`.
- do not generate a user-facing message.
- do not convert internal lookup failure into a legal risk warning.
- this fallback is not a runtime validator.
- this fallback must not infer or substitute another legal basis entry.

If future untrusted inputs are introduced through JSON import, persisted
history restoration, API data, or migrations, review a separate input-boundary
validator later. Keep that validator separate from the resolver.

## 8. Empty mapping behavior

Required behavior:

- a finding with `legalBasisIds: []` returns `[]`.
- an empty findings array returns `[]`.
- intentionally unmapped findings remain valid.
- partial legal basis coverage is intentional.
- empty mappings must not warn, throw, log, or degrade behavior.

This keeps the resolver aligned with the current partial legal basis seed set.

## 9. Deduplication and stable ordering

The multi-finding resolver should:

1. Preserve input finding order.
2. Preserve `legalBasisIds` order inside each finding.
3. Deduplicate by legal basis ID.
4. Keep the first encountered canonical entry.
5. Do not sort by title, date, source level, source URL, category, or invented
   rank.

The single-finding resolver should preserve the `legalBasisIds` order for that
finding and should not invent an independent order.

## 10. Purity boundary

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

Forbid inside the resolver:

- `process.env`
- `console.log`
- `console.warn`
- `fetch`
- `localStorage`
- `IndexedDB`
- API route logic
- UI state
- AI calls
- RAG behavior
- runtime mutation of canonical mappings

The resolver should not change behavior between development and production.

## 11. Phase 9H-3 contract-check plan

Phase 9H-3 should use two categories of checks.

### A. Behavioral checks in the future contract-check file

Implement these in:

```text
src/lib/contract/legal-basis-resolver-contract-check.ts
```

Checks should cover:

- empty finding mapping returns `[]`.
- empty findings array returns `[]`.
- one mapped finding resolves expected canonical entry.
- intentionally unmapped finding remains valid.
- unknown ID fallback skips only the unresolved ID without warning or throw.
- other resolvable IDs from the same finding remain in the returned result.
- duplicate basis IDs deduplicate.
- first-encounter ordering is preserved.
- finding order is preserved.
- per-finding `legalBasisIds` order is preserved.
- repeated calls produce equivalent results.
- findings are not mutated.
- `contractLegalBasisEntries` are not mutated.
- changing clause text alone does not change resolver output.
- changing matched phrases alone does not change resolver output.
- canonical entry object identity is preserved when practical to assert.

### B. Boundary checks verified through review and scans

Do not claim that runtime contract checks alone prove these constraints.

Verify through file scope review, import review, keyword scan, git diff review,
and `npm.cmd run build`:

- no `fetch`.
- no storage access.
- no `console.log`.
- no `console.warn`.
- no `process.env`.
- no UI import.
- no API route import.
- no AI import.
- no RAG behavior.
- no package dependency.

## 12. Files Phase 9H-2 should avoid touching

Phase 9H-2 should avoid touching:

- `src/lib/contract/types.ts`
- `src/lib/contract/risk-rules.ts`
- `src/lib/contract/risk-matcher.ts`
- `src/lib/contract/legal-basis.ts`
- `src/lib/contract/legal-basis-contract-check.ts`
- UI files
- API routes
- `src/lib/ai/**`
- `src/lib/local-store/**`
- `src/lib/storage/**`
- `src/lib/db/**`
- `package.json`
- `package-lock.json`

The expected Phase 9H-2 diff should contain only:

```text
src/lib/contract/legal-basis-resolver.ts
```

## 13. Explicit out of scope for Phase 9H-1

Phase 9H-1 does not include:

- resolver implementation.
- contract-check implementation.
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
- mapping expansion.
- legal basis content expansion.

## 14. Validation commands

After creating this document, run:

```powershell
npm.cmd run build
git diff --stat
git diff --name-only
git status
```

## 15. Completion standard

Phase 9H-1 is complete when:

- this architecture plan exists at
  `docs/architecture/phase-9h-1-contract-legal-basis-resolver-implementation-plan.md`.
- no source files are modified.
- no resolver is implemented.
- no contract-check implementation is added.
- no UI, API, AI, RAG, OCR, PDF, photo, persistence, storage-key, or package
  change is introduced.
- `npm.cmd run build` passes.
- `git diff --name-only` lists only this architecture document.

Suggested commit message:

```text
docs: plan contract legal basis resolver implementation
```
