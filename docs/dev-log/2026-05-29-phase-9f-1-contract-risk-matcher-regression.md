# Phase 9F-1 Contract Risk Matcher Regression Log

Date: 2026-05-29

## Phase

Phase 9F-1: Contract risk rule model and matcher minimal implementation.

## Stable input

Previous stable point:

    2718272 docs: plan contract risk rules implementation

This phase added the first pure TypeScript L2 contract risk rule layer.

## Files added

    src/lib/contract/types.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/risk-matcher-contract-check.ts

No existing files were modified in the implementation commit.

## Implementation summary

This phase added:

    ContractRiskId
    ContractRiskCategory
    ContractRiskPriority
    ContractRiskRule
    ContractRiskFinding
    contractRiskRules
    matchContractRisks()
    risk matcher contract check

The matcher accepts readonly ContractClauseSegment[] and returns ContractRiskFinding[].

The matcher is:

    pure
    deterministic
    local-only
    keyword-based
    side-effect-free

It does not call AI, API routes, LBS, storage, localStorage, IndexedDB, browser APIs, process.env, or legal basis modules.

## Seed rule clarification

The first six rules are only Phase 9F-1 seed rules.

They are not a complete rental contract risk taxonomy.

They include:

    policy_clearance_no_compensation
    landlord_entry_without_notice
    excessive_late_fee_or_auto_termination
    unclear_deposit_deduction
    excessive_early_termination_penalty
    repair_responsibility_shifted_to_tenant

Important product correction:

    policy clearance / demolition / relocation / forced vacating clauses are only one illustrative high-risk category.
    They must not become the center of Phase 9.
    Different renters face different contract risk points.
    Future rules should expand across deposits, fees, entry rights, repairs, safety, termination, subletting, evidence, payment, stability, and dispute-handling risks.

## Legal and product boundary

The contract assistant remains a pre-signing risk提示助手.

It is not:

    an AI lawyer
    a legal service platform
    a validity judgment tool
    a rights-protection tool
    a lawsuit tool
    an automatic compensation or claim tool

The rule layer does not output legal conclusions such as:

    illegal
    invalid
    void
    guaranteed risky
    guaranteed safe
    court-supported
    direct lawsuit advice

Risk priority is an internal sorting and attention field only. It is not a legal severity conclusion.

## Encoding check

Node UTF-8 check confirmed risk-rules.ts contains expected Chinese strings:

    政策清退
    政府清退
    征收
    拆迁
    腾退
    整治
    不予补偿
    随时进入
    无需通知
    不经乙方同意
    甲方有权自行进入
    乙方不得拒绝
    可随时检查
    滞纳金
    逾期
    押金不退
    扣除押金
    提前退租
    违约金
    维修
    自然损耗

The earlier mojibake-like display came from PowerShell Get-Content output and did not indicate real UTF-8 file corruption.

## Build result

npm.cmd run build passed after the implementation commit.

Build route table remained unchanged for Phase 9F-1:

    /contract-review remains static
    no new contract AI API route appeared

## Forbidden scope checks

Confirmed by implementation review and scan results:

    no /api/ai/contract-review-explanation
    no src/lib/contract/legal-basis.ts
    no DeepSeek integration
    no contract AI route
    no RAG
    no OCR
    no PDF parsing
    no file upload
    no contract photo handling
    no localStorage
    no IndexedDB
    no storage writes
    no UI changes
    no zh-cn.ts changes

## Current commit

Implementation commit:

    72d7157 feat: add contract risk matcher

## Next suggested step

After this regression log is committed and pushed, the next phase can be:

    Phase 9F-2: Contract risk matcher regression and rule expansion review

or, if keeping stricter sequence:

    Phase 9G-0: Legal basis mapping implementation review

Do not jump directly to UI, DeepSeek, RAG, OCR, PDF, or contract history persistence.