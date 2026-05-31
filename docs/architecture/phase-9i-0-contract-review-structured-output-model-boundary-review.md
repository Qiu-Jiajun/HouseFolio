# Phase 9I-0: Contract review structured output model boundary review

Date: 2026-05-31

## 1. Stable point

Current confirmed stable point:

```text
5f5baf9 docs: checkpoint contract legal basis resolver
```

Confirmed state before this docs-only phase:

- `HEAD = main = origin/main = origin/HEAD = 5f5baf9`
- working tree clean
- `npm.cmd run build` passed
- actual remote `origin/main` was verified by `git ls-remote`
- Phase 9H is fully closed

## 2. Phase goal

Phase 9I-0 reviews the boundary for a future pure deterministic structured
aggregation model.

The future model layer should receive already-produced layers:

```text
ContractClauseSegment[]
+ ContractRiskFinding[]
+ resolved LegalBasisEntry[]
-> ContractReviewModel
```

It must not become an orchestrator, report builder, display model, prompt
builder, legal reasoning layer, or persistence model.

## 3. Current code names

Use the actual existing contract clause file and type names:

```text
src/lib/contract/clause-segmentation.ts
ContractClauseSegment
segmentContractClauses()
```

Do not use these rejected placeholder names for the implementation:

```text
src/lib/contract/clause-segmenter.ts
ContractClause
```

## 4. Architectural decision

Phase 9I-0 approves Option B for the first structured output model.

Approved Option B:

```text
ContractClauseSegment[]
+ ContractRiskFinding[]
+ resolved LegalBasisEntry[]
-> ContractReviewModel
```

Rejected Option A:

```text
ContractClauseSegment[]
-> builder internally calls matcher and resolver
-> ContractReviewModel
```

Option A would turn the model builder into an orchestration layer, hide layer
boundaries, increase coupling, and make contract checks less clear.

The future builder must not internally call:

- `segmentContractClauses()`
- `matchContractRisks()`
- `resolveLegalBasisForFinding()`
- `resolveLegalBasisForFindings()`

## 5. Recommended model name

Use:

```ts
ContractReviewModel
```

Do not use:

```ts
ContractReviewResult
```

`ContractReviewResult` sounds more like a final user-facing judgment object.
`ContractReviewModel` better describes an internal structured handoff model.

## 6. Candidate minimal model shape

Recommended candidate shape:

```ts
type ContractReviewModel = {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly legalBasisEntries: readonly LegalBasisEntry[];
  readonly counts: {
    readonly clauseCount: number;
    readonly findingCount: number;
    readonly legalBasisEntryCount: number;
  };
};
```

Clarification:

- `readonly` is a TypeScript boundary for the handoff model.
- the future minimal builder should not add `Object.freeze()`, deep cloning,
  runtime mutation guards, or validator logic.
- any future runtime immutability requirement must be reviewed separately.

The model should retain canonical objects and input references rather than
creating display-specific copies or enriched report rows.

## 7. Counts boundary

The v1 model should include only:

- `clauseCount`
- `findingCount`
- `legalBasisEntryCount`

Do not include in v1:

- `unmappedFindingCount`
- `mappedLegalBasisCount`
- `findingsWithLegalBasisCount`
- `findingsWithoutLegalBasisIdsCount`
- confidence score
- risk score
- legal severity score
- coverage percentage
- recommendation score

`unmappedFindingCount` is intentionally omitted because it is semantically
ambiguous. It could mean no attached `legalBasisIds`, attached IDs that do not
resolve, partial resolution, or legal-basis coverage quality. In product
surfaces, that ambiguity could become a misleading claim.

If future consumers truly need this count, review a clearly named pure selector
separately.

## 8. Grouping boundary

Do not store:

```ts
findingsByPriority
```

inside the v1 model.

Reasons:

- findings already preserve matcher order.
- stored grouping duplicates data.
- stored grouping creates another ordering surface.
- stored grouping can be reviewed later as a pure selector if UI or report
  needs it.

Do not add a selector in Phase 9I-0.

## 9. Recommended future builder API

Recommended future API:

```ts
buildContractReviewModel(input: {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly resolvedLegalBasisEntries: readonly LegalBasisEntry[];
}): ContractReviewModel
```

The input name `resolvedLegalBasisEntries` makes provenance explicit. The
output should use `legalBasisEntries`.

The builder only packages already-produced data. It does not reconcile
inconsistent input, repair missing mappings, validate external input, infer
legal basis, or substitute entries.

Any future input-boundary validation must be reviewed separately.

## 10. Allowed builder responsibility

The future builder may only:

- preserve clauses input order.
- preserve findings input order.
- preserve resolved legal basis entry order.
- assign clauses directly.
- assign findings directly.
- assign `resolvedLegalBasisEntries` to output `legalBasisEntries`.
- compute `clauseCount`.
- compute `findingCount`.
- compute `legalBasisEntryCount`.
- return a plain readonly structured model.

## 11. Forbidden builder responsibility

The future builder must not:

- inspect contract text beyond receiving existing clause segments.
- call `segmentContractClauses()`.
- call `matchContractRisks()`.
- call `resolveLegalBasisForFinding()`.
- call `resolveLegalBasisForFindings()`.
- infer risk.
- change risk priority.
- add findings.
- remove findings.
- sort findings.
- group findings.
- expand legal basis mappings.
- infer legal basis.
- reconcile mismatched input.
- generate summaries.
- generate recommendations.
- create user-facing copy.
- create negotiation scripts.
- generate citation sentences.
- generate AI prompt fragments.
- call AI.
- call DeepSeek.
- call RAG.
- access network.
- access storage.
- persist history.
- add `localStorage` or `IndexedDB` keys.
- create UI state.
- create API route behavior.
- introduce confidence scores.
- use recommendation wording.
- create legal conclusions.

## 12. Purity boundary

The future builder must remain:

- pure TypeScript.
- deterministic.
- side-effect-free.
- network-free.
- storage-free.
- UI-free.
- API-route-free.
- AI-free.
- RAG-free.
- environment-independent.

Do not allow:

- `fetch`
- `process.env`
- `localStorage`
- `IndexedDB`
- `console.log`
- `console.warn`
- runtime mutation of inputs

## 13. Later implementation file scope

A later minimal implementation should add exactly:

```text
src/lib/contract/review-model.ts
```

Avoid modifying any existing source file unless a concrete build blocker
appears.

A later contract-check phase may separately add:

```text
src/lib/contract/review-model-contract-check.ts
```

## 14. Later contract-check plan

Use two categories of checks.

### A. Behavioral checks in a later contract-check file

- empty inputs produce zero counts.
- clauses preserve input order.
- findings preserve input order.
- legal basis entries preserve resolver-provided order.
- `clauseCount` is correct.
- `findingCount` is correct.
- `legalBasisEntryCount` is correct.
- input arrays are not mutated.
- returned model remains plain structured data.
- repeated calls with equivalent input produce equivalent counts and ordering.

### B. Review-based boundary checks

Do not claim that runtime contract checks alone prove these constraints.

Verify through file scope review, import review, keyword scan, git diff review,
and `npm.cmd run build`:

- no `segmentContractClauses` import.
- no `matchContractRisks` import.
- no resolver import.
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

## 15. Explicit out of scope for Phase 9I-0

Phase 9I-0 does not include:

- `review-model.ts` implementation.
- `review-model-contract-check.ts` implementation.
- selector implementation.
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
- report export.
- user-facing legal basis display.
- generated recommendations.
- legal conclusion fields.
- package dependency.
- testing runtime dependency.
- docs/dev-log file.

## 16. Completion standard

Phase 9I-0 is complete when:

- this architecture review exists at
  `docs/architecture/phase-9i-0-contract-review-structured-output-model-boundary-review.md`.
- no source files are modified.
- no package files are modified.
- no implementation, selector, UI, API, AI, RAG, OCR, PDF, photo, persistence,
  or report export work is added.
- `npm.cmd run build` passes.
- `git diff --name-only` lists only this architecture review file.

Suggested commit message:

```text
docs: review contract structured output model boundary
```
