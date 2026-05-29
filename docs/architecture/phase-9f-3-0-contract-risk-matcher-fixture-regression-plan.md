# Phase 9F-3-0｜Contract Risk Matcher Fixture Regression Plan

Date: 2026-05-29

## 1. Phase goal

Phase 9F-3-0 plans a pure local fixture regression check for the contract risk matcher.

This phase is planning-only.

It does not implement fixtures yet.
It does not modify matcher logic.
It does not expand risk rules.
It does not connect UI, AI, legal basis, RAG, OCR, PDF parsing, contract photos, localStorage, IndexedDB, or contract history persistence.

## 2. Stable input

Previous stable point:

    85d3e32 docs: review contract risk matcher expansion

Current implemented matcher layer:

    src/lib/contract/types.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/risk-matcher-contract-check.ts

The matcher accepts readonly ContractClauseSegment[] and returns ContractRiskFinding[].

## 3. Why this phase is needed

Phase 9F-1 proved that the matcher can compile.

Phase 9F-2 clarified that the first six rules are only seed rules and should not become a complete taxonomy.

Phase 9F-3 should verify behavior with controlled fixtures before any UI, legal-basis mapping, or AI explanation is added.

This protects the project from:

    false confidence from TypeScript-only build checks
    overfitting to one policy-clearance example
    silent keyword mismatch
    unstable sorting
    accidental legal-conclusion wording
    unsafe coupling to UI / API / AI / storage layers

## 4. Proposed implementation file

Recommended file for the next coding phase:

    src/lib/contract/risk-matcher-fixture-contract-check.ts

Alternative name:

    src/lib/contract/risk-matcher-fixture-smoke.ts

Preferred choice:

    risk-matcher-fixture-contract-check.ts

Reason:

    It stays consistent with the existing contract-check pattern.
    It can be imported by TypeScript build.
    It does not require a test runner.
    It remains local, simple, and inspectable.

## 5. What the fixture check should verify

The fixture check should verify:

    each seed rule can match at least one synthetic clause
    safe clauses do not trigger obvious findings
    sorting is deterministic
    priority order is respected
    clauseIndex is preserved
    matchedPhrases is non-empty for matched findings
    ruleReason does not contain forbidden legal-conclusion wording
    matcher remains pure and local-only by dependency boundary

## 6. Seed positive fixtures

Each seed rule should have at least one synthetic clause.

### 6.1 policy_clearance_no_compensation

Example clause should include signals like:

    政策清退
    腾退
    不予补偿

Expected:

    riskId = policy_clearance_no_compensation

Important:

    This remains one fixture among many.
    It must not dominate the test file.

### 6.2 landlord_entry_without_notice

Example clause should include signals like:

    甲方有权随时进入
    无需通知
    乙方不得拒绝

Expected:

    riskId = landlord_entry_without_notice

### 6.3 excessive_late_fee_or_auto_termination

Example clause should include signals like:

    逾期
    滞纳金
    自动解除

Expected:

    riskId = excessive_late_fee_or_auto_termination

### 6.4 unclear_deposit_deduction

Example clause should include signals like:

    押金
    押金不退
    其他损失

Expected:

    riskId = unclear_deposit_deduction

### 6.5 excessive_early_termination_penalty

Example clause should include signals like:

    提前退租
    违约金
    押金不退

Expected:

    riskId = excessive_early_termination_penalty

### 6.6 repair_responsibility_shifted_to_tenant

Example clause should include signals like:

    维修
    一切维修
    由乙方承担
    自然损耗

Expected:

    riskId = repair_responsibility_shifted_to_tenant

## 7. Safe negative fixtures

The fixture check should include clauses that should not match.

Examples:

    甲方进入房屋应提前通知并经乙方同意。
    押金在双方结清费用后按约定退还，并列明扣除明细。
    自然损耗导致的主体维修由甲方承担。
    逾期付款双方可先协商并给予合理宽限期。
    提前退租费用由双方另行协商，以实际合理损失为限。

These negative fixtures help verify that negativeKeywords and allKeywords are not too broad.

## 8. Sorting fixture

The fixture check should include multiple matched clauses in mixed order and verify output order.

Expected sorting:

    priority high first
    then medium
    then low
    then clauseIndex ascending
    then rule order ascending

The fixture should not change priority. Priority remains defined only in risk-rules.ts.

## 9. Forbidden wording fixture

The fixture check should scan ruleReason strings for forbidden legal-conclusion wording.

Forbidden examples:

    违法
    无效
    霸王条款
    一定可撤销
    保证避坑
    保证无遗漏
    自动维权
    自动索赔
    法院会支持
    可以直接起诉
    高危
    中危
    低危

This ensures ruleReason stays as risk提示 rather than legal conclusion.

## 10. Dependency boundary

The fixture check must not import:

    UI components
    app routes
    API routes
    AI provider modules
    LBS modules
    local-store modules
    storage modules
    db modules
    legal-basis modules

Allowed imports:

    clause-segmentation types if needed
    contract risk matcher
    contract risk rules
    contract risk types

## 11. Runtime side-effect policy

The existing risk-matcher-contract-check.ts is type-only.

The fixture check may execute matcher with local in-memory synthetic clauses if needed.

Allowed:

    local constants
    matcher invocation
    throwing an error when fixture expectations fail

Forbidden:

    network calls
    file reads
    file writes
    browser APIs
    process.env
    localStorage
    IndexedDB
    timers
    randomness
    AI calls

## 12. Implementation approach

Recommended approach for next coding phase:

    define local synthetic ContractClauseSegment[] fixtures
    call matchContractRisks(fixtures)
    assert expected riskIds appear
    assert safe clauses do not produce findings
    assert sorting order is stable
    assert forbidden wording is absent from contractRiskRules
    export a constant such as contractRiskMatcherFixtureContractCheck

Use small helper functions:

    assert(condition, message)
    findFindingByClauseId(...)
    assertHasRisk(...)
    assertNoFindingForClause(...)
    assertSorted(...)

Because this file is imported by TypeScript build, failing assertions should break build early.

## 13. Validation commands for implementation phase

When implemented later, validate with:

    npm.cmd run build

Then run forbidden scans:

    Test-Path .\src\app\api\ai\contract-review-explanation
    Test-Path .\src\lib\contract\legal-basis.ts

And Select-String scans for:

    DeepSeek
    deepseek
    RAG
    OCR
    PDF
    localStorage
    IndexedDB
    fetch(
    process.env
    window.
    document.
    违法
    无效
    霸王条款
    保证避坑
    保证无遗漏
    自动维权
    自动索赔
    法院会支持
    可以直接起诉
    高危
    中危
    低危

## 14. Non-goals

Phase 9F-3 implementation must not do:

    UI result display
    contract review page integration
    DeepSeek explanation
    AI route
    legal-basis.ts
    RAG
    OCR
    PDF parsing
    photo upload
    contract history persistence
    localStorage key
    IndexedDB key
    Settings update
    export report
    broad rule expansion

## 15. Completion standard for Phase 9F-3-0

This planning phase is complete when:

    this document exists
    npm.cmd run build passes
    git status is clean after commit
    no functional code is changed
    next coding phase scope is limited to matcher fixture regression