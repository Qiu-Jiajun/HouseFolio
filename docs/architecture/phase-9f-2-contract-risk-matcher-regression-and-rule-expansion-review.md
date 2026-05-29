# Phase 9F-2｜Contract Risk Matcher Regression and Rule Expansion Review

Date: 2026-05-29

## 1. Phase goal

Phase 9F-2 reviews the Phase 9F-1 contract risk matcher implementation and defines the expansion principles for the contract risk rule library.

This phase is a review and planning phase only.

It does not add new rules, modify matcher behavior, connect UI, connect AI, add legal basis mapping, add RAG, add OCR, add PDF parsing, or persist contract review history.

## 2. Stable input

Previous stable point:

    2e542d6 docs: log contract risk matcher regression

Phase 9F-1 completed:

    src/lib/contract/types.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/risk-matcher-contract-check.ts

The matcher currently accepts readonly ContractClauseSegment[] and returns ContractRiskFinding[].

## 3. Current Phase 9F-1 result

Phase 9F-1 added a pure local TypeScript rule layer.

Current properties:

    pure function
    deterministic matching
    local-only execution
    keyword-based matching
    no network calls
    no browser APIs
    no storage writes
    no AI calls
    no legal-basis module
    no UI integration
    no persistence

This is the correct implementation shape for the first L2 contract risk matcher.

## 4. Seed rules are not a complete taxonomy

The current six rules are only seed rules:

    policy_clearance_no_compensation
    landlord_entry_without_notice
    excessive_late_fee_or_auto_termination
    unclear_deposit_deduction
    excessive_early_termination_penalty
    repair_responsibility_shifted_to_tenant

They are not a complete rental contract risk taxonomy.

Important correction:

    policy clearance / demolition / relocation / forced vacating clauses are only one illustrative category.
    They must not become the center of Phase 9.
    Different renters face different contract risks.
    The rules must remain broad, extensible, and sensitive to different rental scenarios.

Future risk expansion must cover multiple domains, not only housing stability clauses.

## 5. Recommended future rule taxonomy

Future contract risk rules should be organized around risk domains.

### 5.1 Stability and right-to-rent risks

Examples:

    policy clearance
    demolition
    relocation
    forced vacating
    illegal construction
    group-rental partition risks
    ownership or authorization ambiguity
    temporary management housing
    early termination caused by third-party or policy reasons

These rules should not dominate the whole product. They are one domain among many.

### 5.2 Deposit and refund risks

Examples:

    unclear deposit deduction
    broad “other losses” deduction
    deposit forfeiture without clear conditions
    no refund timeline
    no handover checklist
    no deduction evidence requirement
    cleaning or restoration fees without standard

This domain is likely highly relevant for ordinary renters and should be expanded carefully.

### 5.3 Fees and payment risks

Examples:

    unclear utilities
    unclear property management fee
    unclear internet or service fees
    high late fees
    compounded overdue fees
    ambiguous payment recipient
    lack of receipt or payment proof
    rent period mismatch
    one-time large prepayment

### 5.4 Entry, privacy, and quiet enjoyment risks

Examples:

    landlord may enter anytime
    inspection without prior notice
    broad management access rights
    camera or monitoring clauses
    shared-space boundary ambiguity
    emergency access not clearly limited

### 5.5 Repair and maintenance risks

Examples:

    all repairs shifted to tenant
    natural wear and tear shifted to tenant
    major structural repair shifted to tenant
    appliance repair ambiguity
    emergency repair reimbursement ambiguity
    repair response time not specified

### 5.6 Early termination and breach risks

Examples:

    excessive early termination penalty
    deposit forfeiture plus extra penalty
    all remaining rent owed after early termination
    unilateral termination right imbalance
    automatic termination without cure period
    unclear notice period

### 5.7 Safety and habitability risks

Examples:

    electricity safety
    gas safety
    fire safety
    electric-bike battery restrictions
    illegal partition responsibility
    safety responsibility fully shifted to tenant
    hidden housing defects

### 5.8 Subletting, co-living, and occupancy risks

Examples:

    subletting prohibition
    family or partner stay ambiguity
    guest stay restrictions
    co-tenant change restrictions
    registration or reporting obligations
    unreasonable restrictions on normal residence

### 5.9 Evidence, handover, and promise risks

Examples:

    no furniture checklist
    no photo confirmation
    oral promises not written into contract
    no delivery condition record
    no meter reading confirmation
    no key / access card handover record

### 5.10 Dispute handling and notice risks

Examples:

    unclear notice method
    unclear delivery address
    one-sided interpretation clause
    distant jurisdiction or arbitration burden
    ambiguous platform / agency responsibility
    no clear contact person

## 6. Which risks are suitable for keyword matcher

Keyword matcher is suitable when a risk is expressed through explicit wording.

Good examples:

    随时进入
    无需通知
    押金不退
    不予补偿
    滞纳金
    提前退租
    全部维修由乙方承担
    剩余租金一次性支付

Keyword matcher is less suitable when risk depends on context, proportionality, local policy, or full-contract interpretation.

Examples requiring caution:

    whether a fee is reasonable
    whether a penalty is excessive
    whether a repair duty allocation is balanced
    whether a local housing policy applies
    whether a clause would be supported in dispute resolution

These cases should be framed as risk提示 and may later require legal-basis mapping or AI explanation. The matcher must not output legal conclusions.

## 7. Rule expansion principles

Future rules should follow these principles.

### 7.1 Rules should detect risk signals, not judge legality

Allowed language:

    建议签约前确认
    后续容易产生争议
    建议写清楚
    需要优先问清楚
    可能影响居住稳定性
    可能影响押金退还
    可能影响日常居住边界

Forbidden language:

    违法
    无效
    霸王条款
    一定可撤销
    法院会支持
    可以直接起诉
    保证避坑
    保证无遗漏
    自动维权
    自动索赔

### 7.2 Risk priority is internal

Risk priority is used only for sorting and attention.

It is not:

    a legal severity conclusion
    a guarantee of actual loss
    a validity judgment
    a litigation outcome prediction

Future UI should translate priority into user-facing language carefully, such as:

    最先问清楚
    建议重点确认
    容易扯皮
    了解即可

### 7.3 Rules must stay extensible

The current ContractRiskId union is acceptable for Phase 9F-1 seed rules, but future expansion may require a broader structure.

Before adding many rules, review whether ContractRiskId should remain a fixed union, become generated from the rule array, or be organized by domain.

### 7.4 Avoid single-case overfitting

No one case should dominate the risk system.

The product should support renters with different situations:

    students
    new graduates
    couples
    families
    co-living renters
    short-term renters
    long-term renters
    renters with pets
    renters with unstable work location
    renters facing agency-managed housing
    renters facing individual landlords

### 7.5 Legal basis should be mapped later

Phase 9F-2 should not implement legal-basis.ts.

Legal basis mapping should be a later phase with its own review.

The matcher should remain independent from legal basis content.

### 7.6 AI explanation should be downstream only

The matcher should produce structured findings.

DeepSeek or other AI should only explain already matched findings later.

AI must not decide:

    riskId
    priority
    legal validity
    whether the contract can be signed
    litigation outcome

## 8. Current matcher review

Current matcher design is acceptable for Phase 9F-1.

Strengths:

    clear pure-function boundary
    deterministic output
    no side effects
    rule-driven priority
    at most one finding per rule per clause
    simple and inspectable keyword strategy
    contract-check file validates type shape

Known limitations:

    keyword matching may miss paraphrased clauses
    keyword matching may produce false positives
    negativeKeywords can accidentally suppress useful matches
    clause segmentation quality affects matching quality
    priority is coarse
    no legal-basis mapping yet
    no AI explanation yet
    no test fixture suite yet

These limitations are acceptable for Phase 9F-1 because this phase only establishes the first minimal L2 matcher.

## 9. Recommended next engineering step

The next coding phase should not jump directly to UI or AI.

Recommended next phase:

    Phase 9F-3: Contract risk matcher fixture regression

Possible scope:

    add a pure local fixture-based contract-check or smoke script
    verify each seed rule can match at least one synthetic clause
    verify safe clauses do not match obvious risk findings
    verify sorting order is deterministic
    verify matchedPhrases are returned
    verify no legal conclusion wording appears in ruleReason

However, this should be planned first.

Alternative next phase:

    Phase 9G-0: Legal basis mapping implementation review

This should remain review-only before adding legal-basis.ts.

## 10. Explicit non-goals for Phase 9F-2

This phase does not do:

    UI integration
    contract review result display
    DeepSeek integration
    AI route
    RAG
    legal-basis.ts
    OCR
    PDF parsing
    contract photo upload
    contract history persistence
    localStorage key
    IndexedDB key
    Settings data rights update
    report export
    rule expansion implementation

## 11. Validation standard

Phase 9F-2 is complete when:

    this review document exists
    npm.cmd run build passes
    git status is clean after commit
    no functional code is changed
    the review clearly states that seed rules are not a complete taxonomy
    the review prevents overfitting to policy clearance / demolition examples