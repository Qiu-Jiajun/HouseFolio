# Phase 9I-1: Contract review structured output model implementation plan

Date: 2026-05-31

## 1. Stable point

Current confirmed stable point:

```text
64bec9e docs: review contract structured output model boundary
```

Confirmed state before this docs-only phase:

- `HEAD = main = origin/main = origin/HEAD = 64bec9e`
- working tree clean
- `npm.cmd run build` passed
- actual remote `origin/main` was verified by `git ls-remote`
- Phase 9I-0 is fully closed

## 2. Phase goal

Phase 9I-1 writes the minimal implementation plan for the future Phase 9I-2
pure structured aggregation model.

Phase 9I-1 does not implement `review-model.ts`.

## 3. Future Phase 9I-2 file scope

Phase 9I-2 should add exactly one source file:

```text
src/lib/contract/review-model.ts
```

Phase 9I-2 should not add the contract-check file.

Phase 9I-3 should later add separately:

```text
src/lib/contract/review-model-contract-check.ts
```

Avoid modifying any existing source file unless a concrete build blocker
appears.

## 4. Approved model type

Future `review-model.ts` should export exactly:

```ts
export type ContractReviewModel = {
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

## 5. Approved builder API

Future `review-model.ts` should export exactly:

```ts
export function buildContractReviewModel(input: {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly resolvedLegalBasisEntries: readonly LegalBasisEntry[];
}): ContractReviewModel
```

## 6. Exact type-only imports

Phase 9I-2 should use only these imports:

```ts
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type { LegalBasisEntry } from "@/lib/contract/legal-basis";
import type { ContractRiskFinding } from "@/lib/contract/types";
```

Do not import runtime functions.

Do not import:

- `segmentContractClauses`
- `matchContractRisks`
- `resolveLegalBasisForFinding`
- `resolveLegalBasisForFindings`

## 7. Reference-preservation clarification

The future builder should create:

- a new top-level `ContractReviewModel` object.
- a new `counts` object.

The future builder should directly preserve these input array references:

```ts
clauses: input.clauses
findings: input.findings
legalBasisEntries: input.resolvedLegalBasisEntries
```

Do not:

- clone arrays
- spread arrays
- deep clone arrays
- sort arrays
- filter arrays
- group arrays
- deduplicate arrays
- reconcile arrays
- validate arrays
- mutate arrays
- call `Object.freeze()`
- add runtime mutation guards

`readonly` remains a TypeScript boundary only.

Any future runtime immutability requirement must be reviewed separately.

## 8. Future minimal implementation sketch

This is a future minimal implementation sketch:

```ts
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type { LegalBasisEntry } from "@/lib/contract/legal-basis";
import type { ContractRiskFinding } from "@/lib/contract/types";

export type ContractReviewModel = {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly legalBasisEntries: readonly LegalBasisEntry[];
  readonly counts: {
    readonly clauseCount: number;
    readonly findingCount: number;
    readonly legalBasisEntryCount: number;
  };
};

export function buildContractReviewModel(input: {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly resolvedLegalBasisEntries: readonly LegalBasisEntry[];
}): ContractReviewModel {
  return {
    clauses: input.clauses,
    findings: input.findings,
    legalBasisEntries: input.resolvedLegalBasisEntries,
    counts: {
      clauseCount: input.clauses.length,
      findingCount: input.findings.length,
      legalBasisEntryCount: input.resolvedLegalBasisEntries.length,
    },
  };
}
```

This sketch must not be implemented in Phase 9I-1. Phase 9I-2 will implement
only after this docs plan is reviewed and committed.

## 9. Counts boundary

The future builder computes only:

- `clauseCount`
- `findingCount`
- `legalBasisEntryCount`

Do not add:

- `unmappedFindingCount`
- `mappedLegalBasisCount`
- `findingsWithLegalBasisCount`
- `findingsWithoutLegalBasisIdsCount`
- confidence score
- risk score
- legal severity score
- coverage percentage
- recommendation score

## 10. Forbidden builder responsibility

The future builder must not:

- inspect contract text beyond receiving clause segments.
- call `segmentContractClauses()`.
- call `matchContractRisks()`.
- call `resolveLegalBasisForFinding()`.
- call `resolveLegalBasisForFindings()`.
- infer risk.
- change risk priority.
- add findings.
- remove findings.
- sort findings.
- filter findings.
- group findings.
- deduplicate findings.
- expand legal basis mappings.
- infer legal basis.
- reconcile inconsistent input.
- validate external input.
- clone inputs.
- deep clone inputs.
- call `Object.freeze()`.
- add runtime mutation guards.
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

## 11. Purity boundary

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

Forbid:

- `fetch`
- `process.env`
- `localStorage`
- `IndexedDB`
- `console.log`
- `console.warn`
- runtime mutation of inputs
- package dependency

## 12. Phase 9I-3 contract-check plan

Phase 9I-3 should add separately:

```text
src/lib/contract/review-model-contract-check.ts
```

### A. Behavioral checks suitable for the contract-check file

- empty inputs return zero counts.
- returned clauses reference is identical to input clauses.
- returned findings reference is identical to input findings.
- returned `legalBasisEntries` reference is identical to
  `resolvedLegalBasisEntries` input.
- clause order is preserved.
- finding order is preserved.
- legal basis entry order is preserved.
- `clauseCount` is correct.
- `findingCount` is correct.
- `legalBasisEntryCount` is correct.
- repeated calls with equivalent inputs produce equivalent fields and counts.
- input arrays are not mutated.
- model is a plain structured object.

### B. Review-based boundary checks

Verify through file scope review, import review, keyword scan, git diff review,
and `npm.cmd run build`:

- no `segmentContractClauses` import.
- no `matchContractRisks` import.
- no legal basis resolver import.
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

## 13. Phase 9I-3 runtime-execution honesty boundary

- `npm.cmd run build` may typecheck the future contract-check file.
- the future fixture runner must not be automatically executed by build.
- the future runner must not be called at module evaluation time.
- the future runner must not be connected to app runtime, UI, or API routes.
- do not claim runtime behavioral fixture assertions automatically passed
  during build.
- do not add a hidden module-level runner invocation.
- do not add a testing runtime dependency.
- any future fixture-runner execution strategy must be reviewed separately.

## 14. Explicit out of scope for Phase 9I-1

Phase 9I-1 does not include:

- `review-model.ts` implementation.
- `review-model-contract-check.ts` implementation.
- selector.
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

## 15. Completion standard

Phase 9I-1 is complete when:

- this architecture plan exists at
  `docs/architecture/phase-9i-1-contract-review-structured-output-model-implementation-plan.md`.
- no source files are modified.
- no package files are modified.
- no implementation, selector, UI, API, AI, RAG, OCR, PDF, photo, persistence,
  report export, or docs/dev-log work is added.
- `npm.cmd run build` passes.
- `git diff --name-only` lists only this architecture plan file.

Suggested commit message:

```text
docs: plan contract structured output model implementation
```
