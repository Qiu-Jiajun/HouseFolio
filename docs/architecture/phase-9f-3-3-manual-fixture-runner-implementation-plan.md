# Phase 9F-3-3｜Manual Fixture Runner Implementation Plan

Date: 2026-05-29

## 1. Phase goal

Phase 9F-3-3 defines the minimal implementation plan for manually executing the contract risk matcher fixture runner.

This phase is planning-only.

It does not implement the runner.
It does not modify package.json.
It does not add dependencies.
It does not modify existing matcher, rules, fixtures, UI, AI, legal basis, OCR, PDF, contract photo, storage, localStorage, IndexedDB, or Settings code.

## 2. Stable input

Previous stable point:

    88ec65d docs: review contract matcher fixture runner

Current fixture implementation:

    src/lib/contract/risk-matcher-fixture-contract-check.ts

Current exported runner:

    runContractRiskMatcherFixtureCheck()

Current limitation:

    npm.cmd run build type-checks the fixture file.
    It does not execute runContractRiskMatcherFixtureCheck().

## 3. Problem to solve

HouseFolio now has a useful local fixture runner, but no reliable command path to execute it.

A future implementation should answer:

    how to run runContractRiskMatcherFixtureCheck()
    how to avoid importing test code into app runtime
    how to avoid adding unnecessary dependencies
    how to keep the check local and deterministic
    how to make failure visible through a non-zero process exit code

## 4. Implementation principles

A future runner implementation should follow these principles:

    explicit command
    no UI import
    no app route import
    no AI import
    no legal-basis import
    no storage import
    no localStorage or IndexedDB
    no browser APIs
    no network calls
    no file reads beyond loading code
    no contract text persistence
    no package dependency unless reviewed first

The runner should only execute:

    runContractRiskMatcherFixtureCheck()

and print:

    PASS: contract risk matcher fixture check passed

or fail with:

    FAIL: contract risk matcher fixture check failed

A failure should exit with non-zero status.

## 5. Recommended future implementation shape

Recommended file:

    scripts/check-contract-risk-matcher-fixtures.mjs

Preferred script type:

    JavaScript ESM runner, only if it can reliably import compiled or runtime-transpiled TypeScript.

However, because this is a Next.js app using TypeScript path aliases such as "@/...", direct Node execution may not work without a TS runtime or alias loader.

Therefore, before implementation, check whether the project already has one of:

    tsx
    ts-node
    jiti
    vitest

If none exists, do not add a dependency casually.

## 6. Option analysis

### Option A: Use existing tsx if already installed

If tsx already exists in dependencies or devDependencies, future implementation may add:

    scripts/check-contract-risk-matcher-fixtures.ts

and a package script such as:

    "check:contract-risk-matcher": "tsx scripts/check-contract-risk-matcher-fixtures.ts"

Pros:

    clean
    explicit
    minimal
    supports TypeScript directly

Cons:

    requires tsx
    must verify "@/..." path aliases work or use relative imports

Assessment:

    Best option if tsx is already available.

### Option B: Use existing ts-node if already installed

If ts-node already exists, future implementation may use it only after verifying path alias support.

Pros:

    common TypeScript runtime

Cons:

    path alias setup may be awkward
    ESM / CJS behavior can be fragile

Assessment:

    Acceptable only if already configured.

### Option C: Use Vitest if already installed

If Vitest already exists, future implementation may convert fixtures into a proper unit test.

Pros:

    standard testing workflow
    scalable for future matcher and legal basis checks

Cons:

    introduces test framework scope
    may be larger than this small phase needs

Assessment:

    Good later if testing infrastructure already exists, but not necessary for the minimal runner.

### Option D: Add new dev dependency

Add tsx or Vitest as a new dev dependency.

Pros:

    reliable future test execution

Cons:

    expands tooling
    touches package.json / lockfile
    should be reviewed separately
    may be too much for Phase 9F-3-4

Assessment:

    Do not do this without a dedicated dependency review phase.

### Option E: Import runner into app code

Import runContractRiskMatcherFixtureCheck() from a page, route, or component.

Pros:

    none worth taking

Cons:

    pollutes app runtime
    can affect production behavior
    mixes tests with product code
    violates architecture separation

Assessment:

    Forbidden.

## 7. Recommended next implementation plan

Recommended next coding phase:

    Phase 9F-3-4: Minimal manual fixture runner implementation

Only proceed if package inspection confirms a reliable existing execution path.

### If tsx exists

Add:

    scripts/check-contract-risk-matcher-fixtures.ts

The script should:

    import { runContractRiskMatcherFixtureCheck } from "../src/lib/contract/risk-matcher-fixture-contract-check";
    call runContractRiskMatcherFixtureCheck();
    print PASS on success;
    catch errors;
    print FAIL on failure;
    set process.exitCode = 1 on failure.

Then optionally add package.json script only if explicitly approved:

    "check:contract-risk-matcher": "tsx scripts/check-contract-risk-matcher-fixtures.ts"

### If tsx does not exist

Do not implement a runner yet.

Instead, keep the fixture exported and consider:

    Phase 9F-3-4A: Testing runtime dependency review

This avoids adding brittle scripts that cannot actually execute.

## 8. Path alias consideration

Current source files use "@/..." path aliases.

A future runner must verify whether the chosen runtime can resolve "@/..." imports.

Potential solutions:

    use a runtime that supports tsconfig paths
    use a path registration layer
    use relative imports in the runner
    avoid runner implementation until proper test tooling exists

Do not hack around path aliases by duplicating matcher logic in the runner.

The runner must execute the real matcher and real fixture file.

## 9. Validation standard for future runner

When implemented, validation should include:

    npm.cmd run build
    the manual fixture runner command
    forbidden path checks
    forbidden implementation scan
    forbidden wording scan excluding fixture file
    git status

Expected runner output:

    PASS: contract risk matcher fixture check passed

Expected failure behavior:

    non-zero process exit code

## 10. Non-goals

Phase 9F-3-3 does not do:

    runner implementation
    package.json modification
    dependency installation
    test framework setup
    fixture file modification
    matcher modification
    risk rule expansion
    legal-basis.ts
    RAG
    DeepSeek
    AI route
    OCR
    PDF parsing
    file upload
    contract photo handling
    contract history persistence
    localStorage
    IndexedDB
    UI integration
    Settings update
    export report

## 11. Product correction preserved

The runner must continue to preserve Phase 9's product correction:

    policy clearance / demolition / forced vacating is only one risk domain
    different renters face different contract risks
    fixture expansion should cover many domains, not one illustrative case

Future fixture expansions should cover:

    deposits
    fees
    entry rights
    repairs
    safety
    early termination
    subletting and co-living
    handover evidence
    payment proof
    dispute handling

## 12. Completion standard

Phase 9F-3-3 is complete when:

    this plan exists
    npm.cmd run build passes
    git status is clean after commit
    no functional code is changed
    no package dependency is added
    no package.json script is added
    the next implementation phase is clearly conditional on existing tool support