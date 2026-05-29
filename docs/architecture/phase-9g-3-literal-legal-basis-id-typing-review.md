# Phase 9G-3: Literal legal basis id typing review

Date: 2026-05-29

## 1. Phase goal

Phase 9G-3 reviews whether HouseFolio should make contract risk rule
`legalBasisIds` literal-preserving in a later implementation phase.

This phase is review-only.

It does not modify:

- `src/lib/contract/risk-rules.ts`
- `src/lib/contract/legal-basis.ts`
- `src/lib/contract/legal-basis-contract-check.ts`
- `src/lib/contract/types.ts`
- matcher files
- UI
- API routes
- package files

## 2. Current typing diagnosis

`contractRiskRules` is currently exported with an explicit widened annotation:

```ts
export const contractRiskRules: readonly ContractRiskRule[] = [
  // rules
];
```

`ContractRiskRule` currently defines:

```ts
legalBasisIds: readonly string[];
```

This means each rule object is checked against the broad `ContractRiskRule`
shape at declaration time.

## 3. Why legalBasisIds are widened

Because the array is explicitly annotated as `readonly ContractRiskRule[]`,
TypeScript contextual typing widens each rule's `legalBasisIds` field to the
field type declared by `ContractRiskRule`.

So a rule like:

```ts
legalBasisIds: []
```

is treated as:

```ts
readonly string[]
```

instead of a literal tuple such as:

```ts
readonly []
```

Likewise, a future value such as:

```ts
legalBasisIds: ["deposit_handling_refund_context"]
```

would be widened to `readonly string[]` under the current export annotation.

This is why the current legal-basis alignment check can confirm the field shape,
but cannot fully reject a future unknown non-empty legal basis id without a
typing change in `risk-rules.ts`.

## 4. Proposed later change

A later implementation phase can make the rule list literal-preserving by
changing the export to:

```ts
export const contractRiskRules = [
  // rules
] as const satisfies readonly ContractRiskRule[];
```

This preserves literal values inside the array while still checking that the
array conforms to `readonly ContractRiskRule[]`.

Then a contract check can derive:

```ts
type RuleReferencedLegalBasisIds =
  (typeof contractRiskRules)[number]["legalBasisIds"][number];

type KnownLegalBasisIds =
  (typeof contractLegalBasisEntries)[number]["id"];
```

And assert:

```ts
type _RuleLegalBasisIdsExist = Assert<
  IsAssignable<RuleReferencedLegalBasisIds, KnownLegalBasisIds>
>;
```

When `legalBasisIds` are still empty, the referenced id union is `never`, which
is acceptable. When future rules add ids, the check can fail at build time if an
id is not present in `contractLegalBasisEntries`.

## 5. Runtime behavior impact

This typing change should not change matcher runtime behavior.

The emitted JavaScript rule array is the same data. The matcher reads rule
fields and iterates arrays; it does not mutate the rule list. Making the source
literal-preserving with `as const satisfies` changes TypeScript inference, not
the matching algorithm.

The matcher should continue to:

- read `anyKeywords`, `allKeywords`, and `negativeKeywords`
- use rule-owned `priority`
- copy `legalBasisIds` into findings
- avoid network, browser APIs, storage, or AI calls

## 6. Fixture check impact

Existing fixture checks should not need behavior changes.

Potential type-level impacts:

- Some inferred fields may become narrower literal types.
- Readonly arrays may be more visible to TypeScript.
- Existing checks that require assignability to `ContractRiskRule` should still
  pass because `satisfies readonly ContractRiskRule[]` keeps the compatibility
  contract.

If any fixture helper assumes mutable arrays, it should be adjusted to accept
readonly arrays. Current fixture usage is read-only, so no runtime change is
expected.

## 7. Why implementation should wait for Phase 9G-4

Phase 9G-3 is a review step because the change touches the source typing of the
rule list. Even though it should be low risk, it is better handled separately
from legal-basis seed data and alignment-check work.

Deferring to Phase 9G-4 keeps this sequence clean:

1. Seed legal basis entries.
2. Add alignment check and document current limitation.
3. Review literal-preserving typing.
4. Implement literal-preserving typing and strengthen the alignment check.

This avoids mixing review, type inference changes, and future id mapping in one
phase.

## 8. Likely Phase 9G-4 files

Likely files to modify:

- `src/lib/contract/risk-rules.ts`
  - Change `contractRiskRules` to `as const satisfies readonly ContractRiskRule[]`.

- `src/lib/contract/legal-basis-contract-check.ts`
  - Replace the current shape-only limitation with a stronger known-id
    assertion.
  - Update or remove the limitation comment.

Files likely not needed:

- `src/lib/contract/types.ts`
- `src/lib/contract/legal-basis.ts`
- `src/lib/contract/risk-matcher.ts`
- UI files
- API routes

## 9. Validation commands

Use:

```powershell
npm.cmd run build
```

Optional boundary scans:

```powershell
Get-ChildItem .\src\lib\contract -Recurse -File |
  Select-String -SimpleMatch -Pattern "DeepSeek","deepseek","/api/ai/contract-review","contract-review-explanation","RAG","OCR","ocr","PDF","pdf","type=`"file`"","accept=","localStorage","indexedDB","IndexedDB","setItem","getItem","createObjectStore","fetch(","process.env","window.","document."
```

```powershell
Get-ChildItem .\src\lib\contract -Recurse -File |
  Where-Object { $_.Name -ne "risk-matcher-fixture-contract-check.ts" } |
  Select-String -SimpleMatch -Pattern "自动索赔","法院会支持","可以直接起诉"
```

## 10. Non-goals

Phase 9G-3 does not:

- implement the typing change
- add a legal basis resolver
- modify risk rules
- modify matcher behavior
- add UI
- add API routes
- connect DeepSeek or any AI provider
- implement RAG
- add OCR, PDF, or photo handling
- save contract history
- add localStorage or IndexedDB keys
- add package dependencies
- add a test runtime
- change package files

## 11. Suggested implementation commit later

When Phase 9G-4 implements the change, a suitable commit message would be:

```text
test: preserve literal contract legal basis ids
```
