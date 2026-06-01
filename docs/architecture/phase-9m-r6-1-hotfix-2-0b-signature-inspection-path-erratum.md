# Phase 9M-R6-1-hotfix-2-0B｜Signature inspection path erratum

## 0. 文档用途

本文档用于修正 Phase 9M-R6-1-hotfix-1 implementation plan 中
关于 full-redacted input canonical source 文件路径的记录。

本勘误是 additive docs-only checkpoint。

不重写历史 commit。

不修改 src。

不修改 .env.local。

不改变 Harness。

不扩大三文件实现范围。

---

## 1. 当前稳定点

当前稳定点：

    2d26e0b docs: plan contract review mock runtime path

完整 hash：

    2d26e0bc71f73d159200389bf1d7c7b1795f54a4

当前已经确认：

    HEAD = main = origin/main = actual remote refs/heads/main
    git status clean
    npm.cmd run build passed
    src unchanged
    .env.local unchanged
    stash@{0} unchanged
    stash@{0}^3 unchanged

受保护 stash 必须继续原样保留：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

stash hash：

    8a27c545465dc185f5506311392ab57dc6e67f84

stash 第三父提交：

    60137e8e3bb7faae9eacac510a6bb2228901a227

禁止：

    git stash apply
    git stash pop
    git stash drop
    git stash clear

---

## 2. 需要修正的旧路径记录

此前只读探针与 implementation plan 曾假设存在：

    src/lib/ai/contract-review-full-redacted-ai-input.ts

该文件实际不存在。

此前路径假设不影响已经提交的源码。

此前路径假设不影响 full-redacted 功能本身。

此前路径假设不改变当前三文件 hotfix 实现方向。

---

## 3. 已确认的 canonical input 文件

legacy input type 与 full-redacted input type
实际共存于同一个 additive compatibility bridge：

    src/lib/contract/ai-safe-input.ts

该文件包含：

    CONTRACT_REVIEW_AI_INPUT_VERSION
    CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION
    CONTRACT_REVIEW_AI_INPUT_LIMITS
    CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
    ContractReviewAiLegalBasisInput
    ContractReviewAiFindingInput
    ContractReviewAiInput
    ContractReviewFullRedactedAiRedactedClauseInput
    ContractReviewFullRedactedAiRuleSignalInput
    ContractReviewFullRedactedAiInput
    ContractReviewFullRedactedAiInputError
    contractReviewAiRiskMetadata
    redactContractClauseExcerpt()
    redactContractClauseText()
    buildContractReviewFullRedactedAiInput()
    buildContractReviewAiInput()

因此：

    不得新增独立 full-redacted input 文件。
    不得移动现有 input 类型。
    不得修改 additive bridge。
    不得为本 hotfix 修改 src/lib/contract/ai-safe-input.ts。

---

## 4. 已确认的 canonical output schema 文件

legacy output schema 与 full-redacted output schema
实际共存于：

    src/types/ai-contract-review-explanation.ts

该文件包含：

    CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION
    ContractReviewFindingExplanation
    ContractReviewExplanationOutput
    ContractReviewRuleSignalExplanation
    ContractReviewSupplementalAttentionType
    ContractReviewSupplementalAttentionItem
    ContractReviewFullRedactedExplanationOutput

因此：

    不得新增独立 full-redacted output schema 文件。
    不得移动现有 output 类型。
    不得为本 hotfix 修改 src/types/ai-contract-review-explanation.ts。

---

## 5. 已确认的 route guard 文件

legacy 与 full-redacted route guard 实际共存于：

    src/lib/contract/ai-safe-input-route-guard.ts

该文件包含：

    parseAndSanitizeContractReviewAiInput()
    parseAndSanitizeContractReviewFullRedactedAiInput()

因此：

    不得新增独立 full-redacted route guard。
    不得为本 hotfix 修改 src/lib/contract/ai-safe-input-route-guard.ts。

---

## 6. 已确认的 provider interface

当前 DeepSeek provider interface 为：

    generateContractReviewExplanation(
      input: ContractReviewAiInput
    ): Promise<ContractReviewExplanationOutput>

    generateFullRedactedContractReviewExplanation(
      input: ContractReviewFullRedactedAiInput
    ): Promise<ContractReviewFullRedactedExplanationOutput>

新增 mock provider 必须实现同样的两个方法。

不得修改：

    src/lib/ai/contract-review-deepseek-provider.ts

---

## 7. 三文件最小实现范围保持不变

下一阶段只允许修改：

    src/lib/ai/contract-review-mock-provider.ts

    src/app/api/ai/contract-review-explanation/route.ts

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

说明：

    contract-review-mock-provider.ts
    → 新增 deterministic、无外部网络的 runtime mock provider

    route.ts
    → 增加 CONTRACT_REVIEW_AI_PROVIDER runtime selector
    → 仅精确 deepseek 才启用真实 provider
    → 其他情况安全回退 mock
    → 保持显式依赖注入能力

    route-contract-check.ts
    → 增加 selector 与 mock-only 回归检查
    → 不运行真实 DeepSeek fetch

---

## 8. 继续禁止修改

不得修改：

    src/components/*
    src/content/zh-cn.ts
    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/types/ai-contract-review-explanation.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    .env.local
    package.json
    package-lock.json

不得新增：

    独立 full-redacted input 文件
    独立 full-redacted output schema 文件
    独立 full-redacted route guard
    UI provider switch
    debug route
    test-only public endpoint
    browser-visible mock toggle
    secret logging
    provider response logging
    contract body logging

---

## 9. Harness 不变量

继续坚持：

    内部严格，外部简单
    规则从 gate 改为 signal
    L2 决定 riskLevel
    AI 只做人话解释与补充关注
    用户确认前不得联网
    用户只保留一次必要的发送前确认
    不把内部复杂度暴露给用户

新增 mock provider 不得：

    修改 riskLevel
    伪造法规依据
    暴露 reasoning_content
    保存合同文本
    访问外部网络
    读取 DEEPSEEK_API_KEY
    读取 CONTRACT_REVIEW_AI_MODEL
    添加前端步骤
    修改 payloadVersion
    修改 schema
    修改用户可见文案

---

## 10. 下一步

本 docs-only 路径勘误写入后：

    独立审阅完整文档
    验证 UTF-8 无 BOM
    验证末尾 LF
    git diff --check
    npm.cmd run build
    精确 stage 单个 docs 文件
    commit
    push
    fetch
    git ls-remote
    clean status
    stash 保留检查

完成远端收口后进入：

    Phase 9M-R6-1-hotfix-2-1：
    three-file minimal runtime mock implementation

当前不得直接修改 src。
