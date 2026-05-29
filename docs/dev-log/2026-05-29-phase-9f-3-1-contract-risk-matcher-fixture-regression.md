# Phase 9F-3-1 Contract Risk Matcher Fixture Regression Log

Date: 2026-05-29

## Phase

Phase 9F-3-1: Contract risk matcher fixture regression implementation.

## Stable input

Previous stable point:

    16ad54d docs: plan contract risk matcher fixtures

## Implementation commit

    b20f554 test: add contract risk matcher fixtures

## Files added

    src/lib/contract/risk-matcher-fixture-contract-check.ts

No existing files were modified.

## Implementation summary

This phase added a pure local fixture regression module for the contract risk matcher.

The fixture module exports:

    seedContractRiskIds
    positiveContractRiskFixtures
    negativeContractRiskFixtures
    sortingContractRiskFixture
    forbiddenRuleReasonWords
    runContractRiskMatcherFixtureCheck()
    contractRiskMatcherFixtureContractCheck

The runtime fixture assertions are not executed on import.

The runner is only executed if a future phase explicitly calls:

    runContractRiskMatcherFixtureCheck()

## Fixture coverage

Positive fixtures cover all six current seed rules:

    policy_clearance_no_compensation
    landlord_entry_without_notice
    excessive_late_fee_or_auto_termination
    unclear_deposit_deduction
    excessive_early_termination_penalty
    repair_responsibility_shifted_to_tenant

Negative fixtures cover multiple safe-clause domains:

    entry / privacy with prior notice and consent
    deposit return with deduction details
    repair responsibility for natural wear handled by landlord
    overdue payment with negotiation and reasonable cure period
    early termination cost limited to actual reasonable loss

Sorting fixture checks deterministic order by:

    priority
    clauseIndex
    rule order

## Product correction preserved

The policy clearance / demolition / forced vacating fixture remains one positive fixture among six.

It is not the center of the matcher regression file.

The fixture design continues the Phase 9F-2 correction:

    different renters face different contract risks
    rule expansion should cover deposits, fees, entry rights, repairs, safety, termination, subletting, evidence, payment, stability, and dispute handling
    no single illustrative case should dominate the contract risk system

## Boundary checks

This phase did not add:

    UI integration
    DeepSeek integration
    AI route
    legal-basis.ts
    RAG
    OCR
    PDF parsing
    file upload
    contract photo handling
    contract history persistence
    localStorage key
    IndexedDB key
    rule expansion
    matcher logic changes
    clause segmentation changes
    package dependencies
    test runner

The fixture file imports only:

    matchContractRisks
    contractRiskRules
    ContractClauseSegment type
    ContractRiskFinding type
    ContractRiskId type

## Forbidden wording handling

The fixture file intentionally contains forbidden legal-conclusion wording only inside:

    forbiddenRuleReasonWords

This is test data used to ensure actual ruleReason strings do not contain legal-conclusion wording.

Therefore, future forbidden wording scans should exclude:

    src/lib/contract/risk-matcher-fixture-contract-check.ts

or only scan production rule content such as:

    src/lib/contract/risk-rules.ts

## Validation result

npm.cmd run build passed before and after the implementation commit.

Forbidden path checks remained:

    /src/app/api/ai/contract-review-explanation: absent
    /src/lib/contract/legal-basis.ts: absent

Forbidden implementation scan over src/lib/contract returned no matches.

Forbidden wording scan excluding risk-matcher-fixture-contract-check.ts returned no matches.

Targeted fixture scan found forbidden wording only in forbiddenRuleReasonWords.

## Current limitation

The runtime fixture runner is not wired into npm.cmd run build.

This is intentional for Phase 9F-3-1.

Next build type-checks the file, but does not execute runtime assertions unless the runner is explicitly called in a future phase.

A later phase may add a dedicated manual fixture execution path or a test runner, but this phase deliberately avoids adding package dependencies or build wiring.

## Next suggested step

After this log is committed and pushed, the next safe phase can be either:

    Phase 9F-3-2: Manual fixture runner review

or:

    Phase 9G-0: Legal basis mapping implementation review

Do not jump directly to UI, DeepSeek, RAG, OCR, PDF, contract photos, or contract review history persistence.