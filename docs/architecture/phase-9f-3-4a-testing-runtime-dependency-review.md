# Phase 9F-3-4A｜Testing Runtime Dependency Review

Date: 2026-05-29

## 1. Phase goal

Phase 9F-3-4A reviews whether HouseFolio should introduce a TypeScript runtime or test runner to execute the contract risk matcher fixture runner.

This phase is review-only.

It does not install dependencies.
It does not modify package.json.
It does not modify package-lock.json.
It does not create a runner script.
It does not modify matcher, rules, fixtures, UI, AI, legal basis, OCR, PDF, contract photos, storage, localStorage, IndexedDB, or Settings code.

## 2. Stable input

Previous stable point:

    02fdc43 docs: plan contract matcher fixture runner

Tool availability check:

    tsx false
    ts-node false
    vitest false
    jest false
    jiti false

Current status:

    git status clean
    HEAD = origin/main = origin/HEAD = 02fdc43

Current fixture runner exists as an exported function:

    runContractRiskMatcherFixtureCheck()

but there is no existing reliable TypeScript runtime or test runner to execute it from the command line.

## 3. Review conclusion

Do not implement a manual runner yet.

Reason:

    The project currently has no tsx, ts-node, vitest, jest, or jiti.
    Adding a runner now would require either:
        adding a new dependency,
        writing brittle Node execution logic,
        or importing test logic into app runtime.

All three choices should be avoided at this moment.

## 4. Option review

### 4.1 Add tsx

Potential future command:

    npm.cmd install -D tsx

Potential future script:

    "check:contract-risk-matcher": "tsx scripts/check-contract-risk-matcher-fixtures.ts"

Pros:

    lightweight
    directly runs TypeScript
    suitable for small manual checks

Cons:

    adds dependency
    modifies package.json and lockfile
    must verify "@/..." path alias behavior
    should not be introduced just for one small check without broader testing plan

Assessment:

    Reasonable future option, but not urgent.

### 4.2 Add Vitest

Potential future command:

    npm.cmd install -D vitest

Pros:

    proper testing framework
    scalable for matcher tests, legal basis tests, redaction tests, and pure algorithm tests
    cleaner long-term testing story

Cons:

    heavier than tsx
    requires test configuration and conventions
    expands project tooling scope
    may be premature while Phase 9 is still building basic contract assistant layers

Assessment:

    Better long-term option if HouseFolio starts adding several pure local tests.

### 4.3 Add ts-node

Pros:

    common TypeScript runtime

Cons:

    ESM / CJS and path alias setup can be fragile
    less attractive than tsx for this project

Assessment:

    Not preferred unless already present, which it is not.

### 4.4 Add jiti

Pros:

    can load TS / ESM / CJS in some contexts

Cons:

    adds another runtime layer
    less standard for this project's testing story
    not necessary now

Assessment:

    Not recommended now.

### 4.5 Use app runtime to execute fixture

Example:

    import runContractRiskMatcherFixtureCheck() into a page, API route, or component.

Assessment:

    Forbidden.

Reason:

    test code should not enter production runtime
    fixture assertions should not affect user-facing app behavior
    app routes are not test harnesses
    this would blur product and test boundaries

### 4.6 Use plain Node without TS runtime

Assessment:

    Not recommended.

Reason:

    source files are TypeScript
    imports use "@/..." path aliases
    Next.js build output is not a simple library target
    manually resolving compiled files would be brittle

## 5. Recommended path

Recommended immediate decision:

    Do not add a runtime dependency in Phase 9F-3-4A.
    Keep the fixture runner exported but not wired.
    Move next to Phase 9G-0 legal basis mapping implementation review, or pause Phase 9F runner work until a broader testing-infrastructure need appears.

Recommended future trigger for adding a test runner:

    multiple pure local modules need behavior checks
    legal basis mapper needs fixture tests
    AI redaction builder needs safety tests
    contract rule expansion becomes frequent
    matcher false-positive / false-negative behavior needs repeated validation

When those triggers exist, prefer a dedicated testing infrastructure phase.

Possible future phase:

    Phase 9T-0: Testing infrastructure review

or:

    Phase 9F-3-5: Contract matcher test runtime dependency plan

## 6. Current acceptable state

The current state is acceptable:

    risk matcher is implemented
    type-level contract checks exist
    fixture data and fixture runner exist
    npm.cmd run build passes
    runtime fixture runner is exported for future use
    no dependency bloat has been introduced

This is a good stopping point for Phase 9F runner work.

## 7. Relationship to Phase 9G

Phase 9G can proceed without a manual fixture runner.

Legal basis mapping should remain independent from fixture execution.

Phase 9G should not use AI or UI.

It should likely start with:

    Phase 9G-0: Legal basis mapping implementation review

before any code is added.

Phase 9G must preserve the same contract assistant boundaries:

    not an AI lawyer
    not legal advice
    not validity judgment
    not litigation prediction
    not automatic rights-protection tool

## 8. Product correction preserved

This review continues the Phase 9 correction:

    the policy clearance / demolition / forced vacating example is only one risk domain
    the contract assistant must support diverse renter risk profiles
    future rules and legal basis mapping should cover multiple domains

Examples:

    deposits
    fees
    entry rights
    repairs
    early termination
    safety
    subletting / co-living
    handover evidence
    payment proof
    dispute handling
    housing stability

## 9. Non-goals

This phase does not do:

    runner implementation
    dependency installation
    package.json changes
    package-lock changes
    test framework setup
    legal-basis.ts
    AI route
    DeepSeek
    RAG
    OCR
    PDF parsing
    contract photo upload
    contract history persistence
    localStorage
    IndexedDB
    UI integration
    Settings update
    report export

## 10. Completion standard

Phase 9F-3-4A is complete when:

    this review document exists
    npm.cmd run build passes
    git status is clean after commit
    no package dependency is added
    no package.json or package-lock.json change is made
    the document clearly explains why no runner implementation is added now
    the next recommended path is Phase 9G-0 or a later dedicated testing infrastructure review