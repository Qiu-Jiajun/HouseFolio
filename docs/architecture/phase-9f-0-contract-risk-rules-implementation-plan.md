# Phase 9F-0｜Contract Risk Rules Minimal Implementation Plan

## Phase

Phase 9F-0：合同风险规则库最小实现计划

## Current stable baseline

Before Phase 9F, the latest stable point is:

    321a061 docs: close contract review text segmentation

Phase 9E completed:

    /contract-review page
    contract text textarea
    local clause segmentation preview
    session-only processing notice
    legal disclaimer
    homepage/AppNav entry for 签约前检查

Phase 9E deliberately did not implement:

    DeepSeek
    AI route
    risk rules
    legal basis code
    OCR
    PDF parsing
    photo upload
    contract history
    localStorage / IndexedDB persistence
    risk level display
    legal basis display

## Goal of Phase 9F

Phase 9F should introduce the minimal local contract risk rule layer.

Its purpose is to transform neutral clause segments from Phase 9E into structured risk findings through HouseFolio-owned rules.

Phase 9F should answer:

    Which contract clauses look risky?
    Which risk category do they belong to?
    Which risk level does HouseFolio assign?
    What should the renter ask before signing?
    What wording direction should the renter clarify?

Phase 9F must not answer:

    Whether the clause is illegal
    Whether the clause is invalid
    Whether the clause is unenforceable
    Whether the user can sue
    Whether the user can win a dispute
    Whether the tool guarantees no missed risk

## Product boundary

HouseFolio contract assistant remains:

    签约前合同风险提示助手
    常见租房合同风险点辅助识别
    签约前追问清单生成
    建议补充条款方向提示

It is not:

    AI 律师
    法律咨询平台
    违法条款判定器
    合同无效判定器
    自动维权工具
    自动索赔工具
    法院 / 仲裁结果预测工具

User-facing copy must continue to avoid:

    违法
    无效
    一定可撤销
    霸王条款判定
    保证避坑
    保证无遗漏
    自动维权
    自动索赔
    比律师更便宜

## Architecture boundary

Phase 9F belongs to the L2 rule layer.

HouseFolio Phase 9 architecture should remain:

    L1：合同输入、文本清理、条款切分
    L2：风险规则、风险等级、风险类别、追问清单、建议澄清方向
    L3：AI 人话解释、协商话术、审读摘要

Phase 9F only implements the L2 rule layer.

Phase 9F must not implement L3.

That means:

    Risk level must come from HouseFolio rules.
    Risk category must come from HouseFolio rules.
    Risk finding IDs must come from HouseFolio rules.
    AI must not decide risk level.
    AI must not decide whether a clause is risky.

## Recommended files for Phase 9F implementation

Phase 9F-1 may add:

    src/lib/contract/types.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/risk-matcher-contract-check.ts

Optional later:

    docs/dev-log/2026-05-29-phase-9f-1-contract-risk-rules.md

Phase 9F-1 should not modify:

    src/app/contract-review/page.tsx
    src/components/contract-review-panel.tsx
    src/app/api/**
    src/lib/ai/**
    src/lib/lbs/**
    src/lib/local-store/**
    src/lib/storage/**
    src/lib/db/**

Phase 9F should not immediately modify the UI. The first code step should establish the pure model and matcher only.

## Suggested type model

Recommended minimal types:

    ContractRiskLevel =
      "high" | "medium" | "low"

    ContractRiskCategory =
      "policy_clearance"
      | "deposit"
      | "entry_privacy"
      | "late_fee"
      | "early_termination"
      | "repair_responsibility"
      | "safety_liability"
      | "remaining_items"
      | "sublease"
      | "other"

    ContractRiskRule = {
      id: string;
      level: ContractRiskLevel;
      category: ContractRiskCategory;
      title: string;
      summary: string;
      keywords: string[];
      patterns?: RegExp[];
      legalBasisIds: string[];
      preSigningQuestions: string[];
      suggestedClarification: string;
    }

    ContractRiskFinding = {
      id: string;
      ruleId: string;
      level: ContractRiskLevel;
      category: ContractRiskCategory;
      title: string;
      summary: string;
      clauseId: string;
      clauseTitle: string;
      matchedText: string;
      matchedKeywords: string[];
      legalBasisIds: string[];
      preSigningQuestions: string[];
      suggestedClarification: string;
    }

Important:

    legalBasisIds are only string references in Phase 9F.
    Phase 9F should not create the legal basis database.
    Phase 9F should not display legal text.
    Phase 9G can implement legal-basis records separately.

## Rule matching strategy

The first matcher should be simple and deterministic.

Recommended strategy:

    1. Receive ContractClauseSegment[]
    2. For each clause, normalize text
    3. For each risk rule, check keyword or pattern matches
    4. Return ContractRiskFinding[]
    5. Sort findings by risk level priority and input clause order

The matcher must not:

    call AI
    call fetch
    call a server route
    use localStorage
    use IndexedDB
    mutate input clauses
    create persistent records
    infer legal conclusions

## Minimal high-risk rules for first implementation

The first rule set should be small and focused.

Recommended high-risk rules:

### 1. policy_clearance_no_compensation

Risk category:

    policy_clearance

Trigger examples:

    政府疏解
    清退
    腾退
    拆迁
    整治
    无条件搬离
    不予补偿
    不得索赔

Why high risk:

    The renter may suddenly lose housing stability.
    Even if rent and deposit are returned, moving cost, temporary accommodation, time cost, and re-rental cost may be hard to recover.

Output tone:

    这类条款需要优先问清楚，因为它可能影响能否稳定居住。

Do not say:

    该条违法
    该条无效
    一定可以索赔

### 2. landlord_entry_without_notice

Risk category:

    entry_privacy

Trigger examples:

    甲方可随时进入
    管理方可随时进入
    无需通知
    自行进入房屋
    乙方不得拒绝

Why high risk:

    It affects privacy, possession, belongings, and quiet enjoyment.

### 3. excessive_late_fee_or_auto_termination

Risk category:

    late_fee

Trigger examples:

    每日
    滞纳金
    千分之
    逾期
    自动解除
    立即解除
    收回房屋

Why high risk:

    Costs may expand quickly, and automatic termination consequences may be disproportionate.

### 4. unclear_deposit_deduction

Risk category:

    deposit

Trigger examples:

    押金不退
    扣除押金
    视为违约
    清洁费
    管理费
    维修费
    以实际为准

Why high risk:

    Deposit disputes are common, especially when deduction conditions are vague.

### 5. excessive_early_termination_penalty

Risk category:

    early_termination

Trigger examples:

    提前退租
    单方解除
    违约金
    押金不退
    剩余租金不退
    赔偿全部损失

Why high risk:

    Job changes, housing defects, policy changes, or family changes may trigger early termination needs.

### 6. repair_responsibility_shifted_to_tenant

Risk category:

    repair_responsibility

Trigger examples:

    一切维修由乙方承担
    所有损坏由乙方负责
    房屋设施由乙方自行维修
    甲方不承担维修责任

Why high risk:

    It may shift pre-existing defects and structural responsibilities to the renter.

## Medium / low risk rules

Phase 9F may include a small set of medium / low rules, but should not over-expand.

Possible medium / low rules:

    pet_ban_with_heavy_penalty
    sublease_absolute_ban
    decoration_or_modification_ban
    showing_cooperation_without_time_limit
    electric_bike_battery_ban

Medium / low risk findings should be shorter and less alarming.

## Legal basis handling in Phase 9F

Phase 9F may include legalBasisIds, but should not implement full legal text.

Example:

    legalBasisIds: [
      "CN_HOUSING_RENTAL_REG_2025_ART_10",
      "CN_HOUSING_RENTAL_REG_2025_ART_12",
      "CN_CIVIL_CODE_LEASE_ART_704"
    ]

These IDs are references only.

Phase 9G should later implement:

    instrument
    article
    version
    status
    effectiveFrom
    sourceName
    sourceUrl
    text
    plainSummary
    lastCheckedAt

RAG-lite should come after legal-basis data exists.

## UI integration boundary

Phase 9F should not immediately display risk findings in /contract-review.

Recommended sequence:

    Phase 9F-1：types + rules + matcher + contract check
    Phase 9F-2：matcher regression log
    Phase 9G：legal basis minimal data
    Phase 9H：contract-review UI risk preview integration

This avoids mixing model, matching, legal basis, and UI in one phase.

## Validation standards for Phase 9F-1

Phase 9F-1 should pass:

    npm.cmd run build

Recommended additional checks:

    TypeScript contract check imports compile.
    No AI route added.
    No DeepSeek import.
    No fetch call.
    No localStorage / IndexedDB usage.
    No legal-basis.ts implementation if Phase 9F is still rules-only.
    No UI modification unless explicitly approved.

## Forbidden scope for Phase 9F

Do not add:

    src/app/api/ai/contract-review-explanation
    DeepSeek contract review provider
    AI prompt builder
    OCR parser
    PDF parser
    file upload input
    contract photo upload
    contract history persistence
    localStorage key
    IndexedDB store
    legal-basis.ts full database
    RAG retrieval layer
    report export
    lawsuit advice
    legal conclusion output

## Codex usage recommendation

Phase 9F can use Codex, but only after this plan is approved.

Recommended Codex workflow:

    1. Ask Codex for plan-only output first.
    2. Let Codex inspect current src/lib/contract files.
    3. Restrict allowed files to src/lib/contract only.
    4. Require no UI modifications.
    5. Require npm.cmd run build.
    6. Review diff before commit.

## Result of Phase 9F-0

This document fixes the implementation boundary for Phase 9F.

Phase 9F should start with a pure local rule model and matcher, not with UI, AI, legal basis database, OCR, or storage.