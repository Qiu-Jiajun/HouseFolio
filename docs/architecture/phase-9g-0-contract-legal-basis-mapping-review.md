# Phase 9G-0: Contract legal basis mapping implementation review

## 1. Phase goal

Phase 9G-0 reviews how HouseFolio should implement contract legal basis mapping before adding any legal-basis code.

This phase only writes this architecture review:

    docs/architecture/phase-9g-0-contract-legal-basis-mapping-review.md

This phase does not implement:

    src/lib/contract/legal-basis.ts
    legal basis data
    UI display
    DeepSeek integration
    AI route
    RAG
    OCR
    PDF parsing
    contract photo handling
    contract review history
    localStorage or IndexedDB keys

The goal is to define:

    what legal basis mapping is
    what it is not
    how it should relate to contract risk rules
    how to avoid legal-conclusion wording
    what data model direction is safe
    what implementation sequence should follow

## 2. Stable input

Current stable point:

    221222c docs: review contract matcher test runtime

Current Phase 9 status:

    Phase 9A: contract assistant boundary review completed
    Phase 9B: contract AI + RAG architecture review completed
    Phase 9C: contract risk rule model design completed
    Phase 9D: legal basis minimal implementation plan completed
    Phase 9E: text input and clause segmentation completed
    Phase 9F-1: pure local contract risk rule model and matcher completed
    Phase 9F-3-1: contract risk matcher fixtures completed
    Phase 9F-3-4A: testing runtime dependency review completed

Important Phase 9F conclusion:

    Do not continue manual fixture runner implementation now.
    Do not add tsx, ts-node, vitest, jest, or jiti now.
    Do not modify package.json or package-lock.json for the runner.
    Do not import test logic into app runtime.

Phase 9G-0 should move the project from the matcher layer toward a carefully bounded legal basis mapping layer, but still as a review-only phase.

## 3. Why legal basis mapping is needed

The current matcher can identify contract risk signals from clause text and emit structured findings.

However, a contract risk finding without any basis context can feel arbitrary:

    why is this clause risky?
    which rental-contract issue does it touch?
    what should the user ask before signing?
    what kind of rule background supports the warning?

Legal basis mapping is needed to provide support for risk提示, not to produce legal judgments.

It should help HouseFolio say:

    This issue is related to deposit handling.
    This issue is related to entry rights and living privacy.
    This issue is related to repair responsibility allocation.
    This issue is related to lease stability and early termination.
    This issue is related to rent refund, deposit refund, or notice obligations.

It must not make HouseFolio say:

    This clause is illegal.
    This clause is invalid.
    You can sue and win.
    The court will support you.
    The landlord must compensate you.
    This is definitely a 霸王条款.

## 4. Legal basis is support, not legal conclusion

Legal basis entries should be treated as:

    background support
    source context
    related rules
    explanation anchors
    signing-stage checklist support

They are not:

    legal opinions
    judicial conclusions
    administrative conclusions
    enforceability judgments
    litigation advice
    validity judgments
    rights-protection instructions

HouseFolio should phrase legal-basis-backed output as:

    相关规则背景
    可作为签约前追问依据之一
    建议在签约前确认
    建议写清楚
    后续容易产生争议
    需要优先问清楚
    可能影响押金返还、居住稳定性或责任分配

HouseFolio should avoid phrasing such as:

    违法
    无效
    霸王条款
    一定可撤销
    法院会支持
    可以直接起诉
    一定能维权
    保证避坑
    保证无遗漏
    自动索赔
    比律师更便宜

## 5. What legal basis entries should contain

Future LegalBasisEntry records should contain only structured, restrained support metadata.

A safe future direction:

    id
    title
    sourceName
    sourceLevel
    jurisdiction
    articleRef
    shortSummary
    relevanceScope
    relatedRiskIds
    versionLabel
    lastVerifiedAt
    officialSourceHint
    userFacingCaveat

Field direction:

    id:
      Stable internal identifier, such as national_housing_lease_deposit_terms.

    title:
      Human-readable short title, such as 押金约定与返还相关规则背景.

    sourceName:
      Name of the source, such as 民法典, 住房租赁条例, 北京市住房租赁条例, or future official local source.

    sourceLevel:
      national_law, national_regulation, local_regulation, local_policy, official_guidance, or other controlled value.

    jurisdiction:
      national, Beijing, Shanghai, Shenzhen, Guangzhou, or unknown / general when not city-specific.

    articleRef:
      Article number or section reference, without over-quoting.

    shortSummary:
      Short paraphrase of the relevant rule background.

    relevanceScope:
      What kind of risk this basis can support, such as deposit, entry_rights, repairs, early_termination, policy_clearance, safety, fees.

    relatedRiskIds:
      List of ContractRiskId values this basis may support.

    versionLabel:
      Human-readable source version or effective-year label.

    lastVerifiedAt:
      Date the source was last manually checked against an official source.

    officialSourceHint:
      Non-user-facing note about where the source should be verified before implementation.

    userFacingCaveat:
      Reminder that the source is background support and not a legal conclusion.

## 6. What legal basis entries must not contain

LegalBasisEntry should not contain:

    litigation instructions
    lawsuit templates
    complaint templates
    legal conclusion text
    validity judgment
    compensation guarantee
    court prediction
    administrative enforcement prediction
    AI-generated uncited statute text
    long verbatim statutory quotations
    unofficial copied commentary as source truth
    model reasoning
    DeepSeek reasoning_content
    user contract text
    user personal information
    phone numbers
    names
    ID numbers
    addresses
    room numbers
    bank account data
    raw prompt text
    AI output history

LegalBasisEntry should not become a RAG document store in Phase 9G-1.

The first implementation should be a small typed mapping table, not a retrieval system.

## 7. Relationship between ContractRiskRule and LegalBasisEntry

Current contract risk rules already own:

    riskId
    category
    priority
    matchedPhrases
    ruleReason
    legalBasisIds
    shouldExplainWithAI

The rule layer should continue to decide:

    riskId
    category
    priority
    ruleReason
    matching logic
    sorting order
    whether AI explanation is needed

The future legal basis layer should only resolve:

    legalBasisIds -> LegalBasisEntry[]

This means:

    risk rules decide what was found.
    legal basis entries explain what rule background may support the warning.
    AI may later explain the finding in plain language using both, but cannot create new legal conclusions.

Recommended dependency direction:

    risk-rules.ts may reference legalBasisIds as strings.
    legal-basis.ts may export legal basis entries.
    a future resolver may map finding.legalBasisIds to entries.
    risk-matcher.ts should not need legal-basis.ts for matching.
    legal-basis.ts should not import AI, UI, API routes, local-store, storage, or process.env.

Preferred decoupling:

    ContractRiskRule remains usable without loading legal basis content.
    matchContractRisks() remains pure, local, deterministic, and side-effect-free.
    legal basis resolution should be a separate pure function in a later phase.

## 8. First legal basis candidates

The first legal basis candidates should be chosen by current seed rules and by broad rental relevance, not by one anecdotal case.

Current seed risk rules:

    policy_clearance_no_compensation
    landlord_entry_without_notice
    excessive_late_fee_or_auto_termination
    unclear_deposit_deduction
    excessive_early_termination_penalty
    repair_responsibility_shifted_to_tenant

First candidate basis groups:

    lease stability and policy clearance / forced vacating background
    landlord entry and tenant privacy / peaceful possession background
    deposit agreement, deduction, and refund background
    late payment, default liability, and termination background
    early termination and reasonable notice / liability allocation background
    repair responsibility and housing safety background

Candidate source categories:

    national civil contract rules
    national housing lease regulations
    local housing lease regulations for target city
    official housing rental management guidance where appropriate

The first implementation should avoid claiming that these sources are exhaustive.

It should say:

    first basis candidates
    source background
    last verified by project maintainer
    official source should be rechecked before public launch

It should not say:

    complete legal basis library
    latest legal basis
    authoritative legal conclusion
    nationwide automatic legal review

## 9. National vs local regulation boundary

HouseFolio Phase 9 should recognize three layers:

    national baseline
    local regulation or policy
    contract-specific facts

National baseline can support general rental contract risk提示.

Local regulation matters because rental rules and housing management practices differ by city.

Contract-specific facts matter because the same clause can mean different things depending on:

    property type
    city
    landlord status
    intermediary role
    building legality
    actual delivery condition
    notice history
    rent payment records
    deposit evidence
    communication records
    whether the user has already signed

Phase 9G must avoid building a fake nationwide law engine.

Safe product stance:

    First version uses a small manually curated basis mapping.
    It may include national and selected local sources.
    User-facing copy should state that rules may vary by city and situation.
    The tool is for signing-stage risk提示 only.
    The user should verify important issues with official channels or professionals.

## 10. Freshness and update risk

Legal basis entries can become outdated.

Therefore, every entry should support freshness metadata:

    versionLabel
    lastVerifiedAt
    sourceLevel
    jurisdiction
    officialSourceHint

User-facing copy should avoid:

    最新法规
    现行全部规定
    全国通用结论
    权威审查结果

Safer copy:

    依据背景
    相关规则背景
    依据版本
    最后核验日期
    建议结合所在城市现行规则确认
    本工具仅提供签约前风险提示，不构成正式法律意见

Before public launch, the project should do a separate legal-source freshness review.

## 11. Citation wording strategy

Legal basis display should be concise and careful.

Recommended user-facing structure:

    相关规则背景：
    该问题通常与押金约定、返还条件和扣减依据有关。签约前建议确认押金金额、返还时间、扣减范围和举证方式，并尽量写进合同或补充约定。

    依据提示：
    依据版本：某法规 / 某条，最后核验日期 YYYY-MM-DD。不同城市和具体情况可能存在差异，本提示不构成法律意见。

The product should not show long statute blocks in the first version.

Avoid:

    大段法条复制
    未核验来源
    AI 自由引用法条
    把法规依据显示成“判定结果”
    把 legal basis card 做成律师意见书样式

## 12. Forbidden legal conclusion wording

Future contract review output, AI prompt output, report output, and legal basis display must not use:

    违法
    无效
    霸王条款
    该条款不成立
    该条款一定可撤销
    你一定可以不履行
    法院会支持你
    行政机关一定会处罚
    可以直接起诉
    一定可以索赔
    房东必须赔偿
    保证不踩坑
    保证无遗漏
    律师级审查
    AI 律师
    自动维权
    自动索赔
    比律师更便宜

Safer substitutes:

    需要优先问清楚
    可能影响居住稳定性
    后续容易产生争议
    建议签约前确认
    建议写清楚
    可能影响押金返还
    可能影响维修责任分配
    可作为追问依据之一
    必要时咨询专业人士或官方渠道

## 13. Data model direction

This phase does not implement the data model.

A later Phase 9G-1 may consider:

    export type LegalBasisSourceLevel =
      | "national_law"
      | "national_regulation"
      | "local_regulation"
      | "local_policy"
      | "official_guidance"
      | "other";

    export type LegalBasisJurisdiction =
      | "national"
      | "beijing"
      | "shanghai"
      | "guangzhou"
      | "shenzhen"
      | "other";

    export type LegalBasisEntry = {
      id: string;
      title: string;
      sourceName: string;
      sourceLevel: LegalBasisSourceLevel;
      jurisdiction: LegalBasisJurisdiction;
      articleRef: string;
      shortSummary: string;
      relevanceScope: readonly string[];
      relatedRiskIds: readonly ContractRiskId[];
      versionLabel: string;
      lastVerifiedAt: string;
      userFacingCaveat: string;
    };

A later resolver may be:

    resolveLegalBasisForFinding(finding: ContractRiskFinding): LegalBasisEntry[]

But this should not be implemented in Phase 9G-0.

## 14. Implementation sequencing

Recommended sequence after Phase 9G-0:

    Phase 9G-1:
      Add pure TypeScript legal basis types and a tiny legal basis array.

    Phase 9G-2:
      Add legalBasisIds alignment check between risk rules and legal basis entries.

    Phase 9G-3:
      Add pure resolver from ContractRiskFinding to LegalBasisEntry[].

    Phase 9G-4:
      Add contract check for forbidden legal conclusion wording in basis summaries.

    Phase 9G-5:
      Add dev-log and build regression.

Only after that should the project consider:

    UI display of legal basis
    AI prompt inclusion of legal basis summaries
    contract review explanation route
    RAG-like retrieval
    report export
    Settings data-rights extension

## 15. Non-goals

Phase 9G-0 does not:

    implement legal-basis.ts
    add source data
    add legal basis resolver
    modify risk-rules.ts
    modify risk-matcher.ts
    modify fixtures
    add a test runner
    add package dependencies
    modify package.json
    modify package-lock.json
    add UI
    add API route
    connect DeepSeek
    implement RAG
    implement OCR
    parse PDFs
    handle contract photos
    save contract history
    add localStorage keys
    add IndexedDB stores
    update Settings data-rights UI
    claim legal authority

## 16. Completion standard

Phase 9G-0 is complete when:

    docs/architecture/phase-9g-0-contract-legal-basis-mapping-review.md exists.
    npm.cmd run build passes.
    git status shows only the new architecture document before commit.
    The document clearly defines legal basis as support, not legal conclusion.
    The document defines ContractRiskRule and LegalBasisEntry relationship.
    The document defines first legal basis candidate scope.
    The document rejects AI lawyer / legal-service positioning.
    The document keeps legal basis implementation for a later phase.
    No src/lib/contract/legal-basis.ts is added.
    No UI, API, AI, RAG, OCR, PDF, photo, persistence, or local data key is added.

Recommended commit message:

    docs: review contract legal basis mapping