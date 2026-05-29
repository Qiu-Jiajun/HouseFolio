# Phase 9F-3-2｜Manual Fixture Runner Review

Date: 2026-05-29

## 1. Phase goal

Phase 9F-3-2 reviews how HouseFolio should reliably execute the contract risk matcher fixture runner in a future phase.

This phase is review-only.

It does not implement a runner.
It does not modify package.json.
It does not modify the matcher.
It does not modify risk rules.
It does not connect UI.
It does not connect AI.
It does not add legal-basis.ts.
It does not add RAG, OCR, PDF parsing, contract photos, contract history, localStorage, or IndexedDB.

## 2. Stable input

Previous stable point:

    906d6fa docs: log contract risk matcher fixtures

Current implemented fixture file:

    src/lib/contract/risk-matcher-fixture-contract-check.ts

Current exported runner:

    runContractRiskMatcherFixtureCheck()

Current limitation:

    npm.cmd run build type-checks the fixture file.
    It does not automatically execute runtime fixture assertions.

This limitation is intentional and was documented in Phase 9F-3-1.

## 3. Why this review is needed

The matcher fixture file now provides useful regression checks, but the runtime assertions are not executed unless a future phase explicitly calls the runner.

This creates a clear next question:

    How should we execute runContractRiskMatcherFixtureCheck() safely, predictably, and without weakening the HouseFolio architecture boundary?

This review prevents accidental choices such as:

    assuming build executes unimported runtime assertions
    adding a test runner too early
    adding dependencies without review
    importing fixture checks into UI routes
    using app runtime as a test harness
    mixing contract tests with AI / legal basis / OCR work

## 4. Current runner boundary

The current fixture runner is intentionally isolated.

It:

    uses local synthetic clauses
    calls matchContractRisks()
    checks positive fixture matches
    checks negative fixtures
    checks sorting behavior
    checks forbidden ruleReason wording
    does not run on import
    does not write files
    does not read files
    does not call network
    does not call AI
    does not access browser APIs
    does not access localStorage or IndexedDB

This is the right boundary.

The missing piece is a reliable execution path.

## 5. Options for future runner execution

### Option A: Keep manual-only, no code change

Description:

    Keep runContractRiskMatcherFixtureCheck() exported.
    Do not wire it into any script yet.
    Reviewers can inspect fixture data and rely on npm.cmd run build for type checks.

Pros:

    no extra dependency
    no build coupling
    no risk of test code entering runtime routes
    lowest complexity

Cons:

    runtime assertions are not actually executed
    false confidence may remain
    fixture drift might not be caught
    future developers may forget to run it

Assessment:

    Acceptable only as a temporary state.
    This is what Phase 9F-3-1 currently has.

### Option B: Add a dedicated script using a TS runtime

Description:

    Add a future script such as scripts/check-contract-risk-matcher-fixtures.ts.
    The script imports runContractRiskMatcherFixtureCheck() and executes it.
    A package script could later call it, for example:
        npm.cmd run check:contract-risk-matcher

Pros:

    clear explicit execution
    easy to document
    does not affect app runtime
    suitable for manual regression

Cons:

    may require tsx / ts-node / similar runtime
    may require package dependency or npx usage
    adds tooling complexity
    must handle TS path aliases

Assessment:

    Good long-term direction if HouseFolio starts adding more pure local checks.
    Should not be added casually without reviewing dependency and path-alias behavior.

### Option C: Add a temporary Node/compiled JS runner

Description:

    Build TypeScript first, then execute compiled output or a small JS runner.

Pros:

    avoids UI/runtime coupling
    can be explicit

Cons:

    Next.js build output is not structured as a simple library build
    TS path aliases may still complicate direct execution
    brittle for a Next.js app
    may create misleading assumptions about compiled file locations

Assessment:

    Not recommended for this project at this stage.

### Option D: Import runner into an existing app route or component

Description:

    Import the fixture runner somewhere in app code so it executes during build or page load.

Pros:

    assertions may execute during certain build/runtime paths

Cons:

    violates architecture cleanliness
    risks test code entering production runtime
    may execute in unexpected environments
    may affect user-facing pages
    mixes test logic with product code

Assessment:

    Do not use.

### Option E: Add a proper test runner

Description:

    Add a test framework such as Vitest and write proper unit tests for matcher behavior.

Pros:

    clean testing model
    scalable
    standard developer workflow
    good for future matcher / legal basis / AI redaction tests

Cons:

    adds dependency and configuration
    requires test naming conventions
    may be more than Phase 9 currently needs
    should be planned as a separate testing-infrastructure phase

Assessment:

    Good future direction, but not yet necessary.
    If chosen, it should be a dedicated phase, not mixed with legal-basis or UI work.

## 6. Recommended path

Recommended near-term path:

    Phase 9F-3-3: Manual fixture runner implementation review

Then, if still appropriate:

    Phase 9F-3-4: Minimal manual fixture runner implementation

The implementation should prefer a dedicated script over importing test logic into app runtime.

However, before implementation, check whether the project already has a TS runtime available.

Questions to answer before coding:

    Is tsx already installed?
    Is ts-node already installed?
    Can a script import "@/..." path aliases without extra configuration?
    Should the script use relative imports instead of path aliases?
    Should package.json be modified, or should the first runner be a documented manual command only?
    Is adding a dev dependency acceptable at this stage?

If there is no reliable TS runtime, do not force a runner implementation. It is better to keep the fixture as an exported check than to add brittle tooling.

## 7. Boundary for future runner

A future runner may:

    import runContractRiskMatcherFixtureCheck()
    execute it once
    print PASS / FAIL
    exit with non-zero code on failure

A future runner must not:

    call DeepSeek
    call AI routes
    call LBS
    access localStorage
    access IndexedDB
    access browser APIs
    read contract files
    parse PDFs
    process OCR
    write reports
    persist contract history
    import UI components
    import app routes
    import legal-basis.ts unless a later phase explicitly allows it

## 8. Relationship to legal basis and AI

This runner work should stay separate from legal basis and AI.

Legal basis mapping should remain a later phase.

AI explanation should remain downstream of L2 findings.

The fixture runner should test only:

    clause segment input
    risk rule matching
    finding shape
    sorting
    forbidden wording boundaries

It should not test:

    legal citations
    AI explanation quality
    DeepSeek provider behavior
    report export
    UI display

## 9. Product correction preserved

The runner must not over-center policy clearance / demolition / forced vacating cases.

The fixture runner should continue to treat:

    policy_clearance_no_compensation

as one seed rule among multiple domains.

Future fixture additions should include broader renter-facing risks:

    deposits
    entry rights
    repairs
    early termination
    late fees
    safety
    subletting / co-living
    handover evidence
    payment proof
    dispute handling

This keeps Phase 9 aligned with the product correction:

    different renters face different contract risks
    no single illustrative case should dominate the contract assistant

## 10. Non-goals for Phase 9F-3-2

This phase does not do:

    code implementation
    package.json changes
    script creation
    dependency installation
    fixture execution wiring
    UI integration
    DeepSeek integration
    AI route
    legal-basis.ts
    RAG
    OCR
    PDF parsing
    contract photo upload
    contract history persistence
    localStorage key
    IndexedDB key
    Settings update
    export report

## 11. Completion standard

Phase 9F-3-2 is complete when:

    this review document exists
    npm.cmd run build passes
    git status is clean after commit
    no functional code is changed
    the document clearly states that build does not execute fixture runtime assertions
    the document recommends a separate future phase for runner implementation