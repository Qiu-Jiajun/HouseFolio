# HouseFolio Phase 9M-R4｜完整脱敏合同 route guard adaptation 边界评审

## 0. 文档用途

本文档用于锁定 Phase 9M-R4 的服务端输入安全边界。

本阶段的核心问题不是 UI，也不是 Prompt。

核心问题是：

    如何让服务端安全接收完整脱敏合同 payload，
    同时继续以本地 canonical 数据为准，
    防止浏览器伪造规则信号，
    防止完整合同原文或额外字段绕过安全边界，
    并为后续 route switch 提供可审计的并行 sanitizer。

Phase 9M-R4 继续遵守：

    additive compatibility bridge
    增量兼容桥

旧 matched-findings sanitizer 暂时保留。

新版 full-redacted sanitizer 以并行方式新增。

---

## 1. 当前稳定点

当前远端稳定点：

    f349d98 feat: add full redacted contract provider adaptation

完整 hash：

    f349d9852784edba96d0efada60129753937d034

Phase 9M-R3 已完成：

    完整脱敏合同 Prompt
    v2 输出 schema
    DeepSeek provider 并行路径
    provider contract-check
    reasoning_content 隔离
    final content only 解析

当前已经确认：

    HEAD = main = origin/main = origin/HEAD
    git ls-remote 精确匹配
    npm.cmd run build passed
    git status clean
    VS Code integrated terminal 正常
    terminal.integrated.shellIntegration.enabled = false
    protected stash@{0} 完整保留

受保护 stash：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

精确包含：

    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx
    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts

在 Phase 9M-R5 前：

    不恢复
    不删除
    不覆盖
    不修改

---

## 2. Phase 9M-R4-0 只读审计结论

### 2.1 当前 route 仍然走旧版链路

当前：

    src/app/api/ai/contract-review-explanation/route.ts

仍然执行：

    const body = await readJsonBody(request);

    const input =
      parseAndSanitizeContractReviewAiInput(body);

    const output =
      await contractReviewDeepSeekProvider
        .generateContractReviewExplanation(input);

    return jsonNoStore(output);

因此当前 POST route 仍然是：

    旧 matched-findings 请求体
    → 旧 sanitizer
    → 旧 provider method
    → 旧 ContractReviewExplanationOutput

### 2.2 当前 route guard 仍然只有旧 sanitizer

当前：

    src/lib/contract/ai-safe-input-route-guard.ts

导出：

    ContractReviewAiInputRouteGuardErrorCode
    ContractReviewAiInputRouteGuardError
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS
    parseAndSanitizeContractReviewAiInput()

旧 sanitizer 返回：

    ContractReviewAiInput

它只接受：

    payloadVersion = CONTRACT_REVIEW_AI_INPUT_VERSION

### 2.3 当前 route-contract-check 仍然围绕旧链路

当前：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

只导入并检查：

    CONTRACT_REVIEW_AI_INPUT_VERSION
    ContractReviewAiInput
    parseAndSanitizeContractReviewAiInput()

当前 fixture 仍然是：

    findingCount
    findings[]
    redactedClauseExcerpt

### 2.4 R3 已经提供新版 provider method

当前：

    src/lib/ai/contract-review-deepseek-provider.ts

已经提供：

    generateFullRedactedContractReviewExplanation(
      input: ContractReviewFullRedactedAiInput
    )

因此：

    R4 可以新增服务端 full-redacted sanitizer，
    但暂时不必立即修改 route.ts。

---

## 3. R4 分阶段策略

### Phase 9M-R4A：route-guard parallel adaptation

负责：

    新增 full-redacted route guard 并行 sanitizer
    防御性二次脱敏
    exact-key 校验
    payloadVersion 校验
    reviewMode 校验
    redactedClauses 校验
    ruleSignals 校验
    canonical rule signal 重建
    ruleSignals 允许为空
    扩展 route-contract-check 中的 guard regression

默认不修改：

    route.ts

### Phase 9M-R4B：route switch boundary review

单独评审：

    POST route 是否切换到 full-redacted sanitizer
    POST route 是否切换到 full-redacted provider method
    API 成功响应是否切换到 v2 schema
    旧 route 行为是否还需要兼容
    UI WIP 在恢复前是否已经具备 v2 请求体
    route-contract-check 如何模拟 provider 而不发起真实 DeepSeek 请求

### Phase 9M-R5

再处理：

    git stash apply "stash@{0}"
    保留 stash 备份
    UI WIP 创造性嫁接
    一次主动确认
    session-only 结果展示
    AI 补充关注项区域
    文本变化后旧结果失效
    清除本次结果
    重新生成再次确认

---

## 4. Phase 9M-R4A 默认允许修改范围

默认只允许修改：

    src/lib/contract/ai-safe-input-route-guard.ts

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

### 4.1 默认禁止修改

禁止修改：

    src/lib/contract/ai-safe-input.ts
    src/app/api/ai/contract-review-explanation/route.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/types/ai-contract-review-explanation.ts
    src/components/**
    src/content/zh-cn.ts
    .env.local
    .env.example
    package.json
    package-lock.json
    README.md
    src/lib/local-store/**
    src/lib/privacy/**
    src/lib/storage/**
    src/lib/db/**
    src/lib/lbs/**

禁止：

    恢复 stash
    删除 stash
    修改 stash
    运行真实 DeepSeek 请求
    新增 OCR
    新增 PDF
    新增合同照片
    新增 RAG
    新增 persistence
    新增 localStorage key
    新增 IndexedDB key
    修改 shell integration
    使用会关闭 VS Code integrated terminal 的顶层 exit 1

如果确实必须修改默认禁止文件：

    停止
    汇报
    不自行扩大 scope

---

## 5. full-redacted route guard 的职责

新增 export：

    parseAndSanitizeContractReviewFullRedactedAiInput(
      value: unknown
    ): ContractReviewFullRedactedAiInput

它必须：

    拒绝非 object
    拒绝 array
    拒绝 null
    拒绝 unknown top-level keys
    拒绝 forbidden keys
    校验 payloadVersion
    校验 locale
    校验 reviewMode
    校验 redactedClauses
    校验 ruleSignals
    重建新的 top-level object
    重建新的数组
    重建每一个 clause object
    重建每一个 rule signal object
    对所有进入 provider 的文本执行防御性二次脱敏
    对 prompt boundary 文本执行中和
    不信任浏览器传入的 canonical metadata

---

## 6. full-redacted 顶层 exact-key 边界

只允许：

    payloadVersion
    locale
    reviewMode
    redactedClauses
    ruleSignals

必须严格校验：

    payloadVersion =
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION

    locale =
      "zh-CN"

    reviewMode =
      "full-redacted-contract"

不得接受：

    rawText
    rawContractText
    contractText
    fullContract
    originalText
    sourceText
    clauseText
    reasoning_content
    prompt
    systemPrompt
    aiPrompt
    extraField

---

## 7. redactedClauses 边界

每项只允许：

    clauseId
    clauseOrder
    redactedClauseText

### 7.1 基础校验

必须：

    redactedClauses 是 array
    redactedClauses 不为空
    数量 <= maxRedactedClauseCount
    每项必须是 object
    每项 exact-key 校验
    clauseId 是规范 string
    clauseOrder 是正整数
    redactedClauseText 是非空 string
    单条文本长度 <= maxRedactedClauseChars
    全部条款总长度 <= maxTotalRedactedChars

### 7.2 clauseId 与 clauseOrder

必须继续采用 canonical 关系：

    clauseId = `clause-${clauseOrder}`

必须拒绝：

    非 canonical clauseId
    重复 clauseId
    重复 clauseOrder
    clauseId 与 clauseOrder 不一致
    非法 clauseOrder
    跳过 canonical 校验的自由文本 id

### 7.3 服务端防御性二次脱敏

浏览器传入的：

    redactedClauseText

仍然不可信。

服务端必须再次调用：

    redactContractClauseText()

目的：

    防止浏览器遗漏手机号
    防止浏览器遗漏邮箱
    防止浏览器遗漏联系人姓名
    防止 prompt boundary 注入
    防止 UI payload 被手工篡改

### 7.4 不允许静默裁剪

对于超过上限的：

    条款数量
    单条字符数
    总字符数

必须拒绝：

    invalid_request

不得：

    truncate
    slice 后继续
    静默丢弃条款
    静默丢弃文本

原因：

    完整合同审读不能在用户不知情时悄悄变成局部审读。

---

## 8. ruleSignals 边界

ruleSignals：

    允许为空

这是新版链路与旧版 findings gate 的关键区别。

每项只允许：

    riskId
    riskLevel
    category
    ruleTitleZh
    clauseId
    clauseOrder
    riskSummaryZh
    whyItMattersZh
    legalBases

### 8.1 rule signal 基础校验

必须：

    ruleSignals 是 array
    数量 <= maxRuleSignals
    每项必须是 object
    每项 exact-key 校验
    clauseId 必须存在于 redactedClauses
    clauseOrder 必须与对应 clause 一致
    riskId 必须是 canonical ContractRiskId

### 8.2 不信任浏览器传入 canonical metadata

以下浏览器字段都不可信：

    riskLevel
    category
    ruleTitleZh
    riskSummaryZh
    whyItMattersZh
    legalBases

服务端必须使用本地 canonical 数据重新计算并重建：

    riskLevel
      ← contractRiskRules 中对应规则的 priority

    category
      ← contractRiskRules 中对应规则的 category

    ruleTitleZh
      ← contractReviewAiRiskMetadata[riskId].ruleTitleZh

    riskSummaryZh
      ← contractRiskRules 中对应规则的 ruleReason
      再按既有上限处理

    whyItMattersZh
      ← contractReviewAiRiskMetadata[riskId].whyItMattersZh
      再按既有上限处理

    legalBases
      ← contractRiskRules[riskId].legalBasisIds
      → contractLegalBasisEntries
      → canonical legal basis input

浏览器只提供定位线索：

    riskId
    clauseId
    clauseOrder

其余 canonical metadata：

    必须验证
    或直接从本地重建

推荐：

    直接从本地重建
    并拒绝浏览器伪造值与 canonical 值不一致的情况

### 8.3 signal identity

使用：

    riskId + clauseId

作为复合 identity。

必须拒绝：

    完全重复的复合 identity

允许：

    相同 riskId 命中不同 clauseId

不应仅按：

    riskId

去重。

### 8.4 legalBases

每项只允许：

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

必须：

    exact-key 校验
    数量 <= maxLegalBasesPerSignal
    使用本地 legal basis entries 重建
    拒绝 unknown legalBasisId
    拒绝伪造 title
    拒绝伪造 summary
    拒绝伪造 source type

---

## 9. 复用与新增 limits

### 9.1 上游已有全文脱敏 limits

继续以：

    CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS

为准。

不得在 route guard 自创不一致限制。

包括：

    maxRedactedClauseCount
    maxRedactedClauseChars
    maxTotalRedactedChars
    maxRuleSignals
    maxLegalBasesPerSignal
    maxLegalBasisSummaryChars
    maxRiskSummaryChars
    maxWhyItMattersChars

### 9.2 route guard 可新增结构性限制

如果既有 route guard 已经存在：

    maxStringChars
    maxObjectDepth
    maxObjectKeys
    maxArrayItems

可继续复用。

新增 full-redacted 专属限制时：

    必须有明确安全目的
    不得与上游 builder 冲突
    不得隐式降低完整合同容量
    不得导致正常 builder 输出被 route guard 拒绝

---

## 10. forbidden keys

full-redacted route guard 必须递归拒绝危险字段。

继续保留旧 guard 的 forbidden keys。

至少覆盖：

    rawText
    rawContractText
    contractText
    fullContract
    originalText
    sourceText
    clauseText
    prompt
    aiPrompt
    systemPrompt
    reasoning_content
    reasoningContent
    rawResponse
    providerResponse
    apiKey
    secretKey

不得错误禁止：

    redactedClauseText

原因：

    redactedClauseText 是新版安全 payload 的必要字段。

但它进入 provider 前必须再次脱敏。

---

## 11. route-contract-check 扩展策略

Phase 9M-R4A 继续扩展：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

### 11.1 保留旧检查

现有旧检查全部保留：

    旧 sanitizer type assertion
    旧 fixture
    旧重建对象检查
    旧二次脱敏检查
    旧 prompt boundary neutralization
    旧 extra field rejection
    旧 rawText rejection
    旧 empty findings rejection
    旧 forged riskLevel rejection
    旧 forged category rejection
    旧 forged ruleTitleZh rejection
    旧 forged summary rejection
    旧 clauseId 校验
    旧 legal basis 校验
    旧总长度校验
    旧 route media type 错误
    旧 request body 错误
    旧 Cache-Control: no-store

### 11.2 新增 full-redacted guard type assertion

新增：

    ReturnType<
      typeof parseAndSanitizeContractReviewFullRedactedAiInput
    >

必须精确等于：

    ContractReviewFullRedactedAiInput

### 11.3 新增 full-redacted fixture

新增：

    createFullRedactedFixtureInput()

至少包含：

    2 条 redactedClauses
    2 条 ruleSignals
    一条 high signal
    一条 medium signal
    联系人姓名
    手机号
    邮箱
    full-redacted prompt boundary 注入文本

新增：

    createFullRedactedFixtureInputWithoutRuleSignals()

必须：

    redactedClauses.length > 0
    ruleSignals = []

### 11.4 新增正向 guard 检查

确认：

    返回新 top-level object
    返回新 redactedClauses array
    返回新 ruleSignals array
    返回新 clause object
    返回新 rule signal object
    服务端二次脱敏姓名
    服务端二次脱敏手机号
    服务端二次脱敏邮箱
    服务端中和 full-redacted Prompt boundary
    ruleSignals = [] 可以通过
    相同 riskId 命中不同 clauseId 可以通过

### 11.5 新增负向 guard 检查

至少新增：

    top-level extraField 拒绝
    rawText 拒绝
    错误 payloadVersion 拒绝
    错误 locale 拒绝
    错误 reviewMode 拒绝
    redactedClauses = [] 拒绝
    超过 maxRedactedClauseCount 拒绝
    单条 redactedClauseText 超长拒绝
    总 redactedClauseText 超长拒绝
    非 canonical clauseId 拒绝
    clauseId 与 clauseOrder 不一致拒绝
    duplicate clauseId 拒绝
    duplicate clauseOrder 拒绝
    超过 maxRuleSignals 拒绝
    unknown riskId 拒绝
    forged riskLevel 拒绝
    forged category 拒绝
    forged ruleTitleZh 拒绝
    forged riskSummaryZh 拒绝
    forged whyItMattersZh 拒绝
    unknown clauseId in signal 拒绝
    signal clauseOrder mismatch 拒绝
    duplicate riskId + clauseId 拒绝
    forged legal basis title 拒绝
    forged legal basis summary 拒绝
    forged legal basis source type 拒绝
    unknown legal basis id 拒绝
    nested forbidden key 拒绝

---

## 12. 本阶段暂不修改 route.ts

Phase 9M-R4A 默认禁止修改：

    src/app/api/ai/contract-review-explanation/route.ts

原因：

    route.ts 当前仍然返回旧 ContractReviewExplanationOutput。
    UI WIP 尚未恢复。
    route switch 会改变成功响应 schema。
    route switch 需要单独评审 mock 策略。
    route switch 需要确认前端请求体已经切换。
    route switch 不应与 sanitizer 实现混在同一个提交中。

Phase 9M-R4A 的验收目标是：

    新 sanitizer 已存在
    新 sanitizer 有回归检查
    旧 route build 仍然通过
    旧 route 行为保持不变

---

## 13. route switch 必须单独评审的问题

进入 Phase 9M-R4B 前，必须回答：

    1. POST route 是否只接受新版 full-redacted payload？
    2. 是否仍需要兼容旧 matched-findings payload？
    3. UI WIP 恢复后会发送哪一种 payload？
    4. 成功响应是否切换到 ContractReviewFullRedactedExplanationOutput？
    5. 是否需要 union response type？
    6. route-contract-check 如何避免真实 DeepSeek 请求？
    7. 当前 provider 是否需要依赖注入或 fixture provider？
    8. 是否需要保留旧 route smoke？
    9. API 错误 schema 是否保持不变？
    10. Cache-Control: no-store 是否保持不变？
    11. MAX_REQUEST_BODY_CHARS = 100_000 是否足以承载 full-redacted payload？
    12. 是否需要单独评估请求体容量上限？
    13. 是否需要新增 request_too_large regression？
    14. 是否需要 UI 在发送前展示完整脱敏文本预览？
    15. 是否需要文本变化后使旧 AI 结果失效？

---

## 14. 默认不新增文件

Phase 9M-R4A 默认：

    不新增 route-guard 文件
    不新增 route-contract-check 文件
    不新增 provider 文件
    不新增类型文件
    不新增脚本文件

如果 Codex 判断必须新增文件：

    停止
    汇报原因
    不自行扩大 scope

---

## 15. Phase 9M-R4A 验收标准

必须满足：

    只修改 2 个批准文件
    不新增文件
    旧 sanitizer 继续存在
    新 full-redacted sanitizer 已新增
    旧 route.ts 不修改
    旧 route build 继续通过
    旧 route-contract-check 全部保留
    新 full-redacted guard checks 已新增
    ruleSignals = [] 可以通过
    redactedClauses 不允许为空
    服务端再次脱敏 redactedClauseText
    full-redacted Prompt boundary 被中和
    不静默裁剪合同文本
    canonical metadata 从本地重建
    forged canonical metadata 被拒绝
    duplicate riskId + clauseId 被拒绝
    相同 riskId + 不同 clauseId 可以通过
    无真实 DeepSeek 请求
    无 route switch
    无 UI 修改
    无 persistence
    stash@{0} 完整保留
    npm.cmd run build passed
    git diff --check clean

---

## 16. 后续阶段

### Phase 9M-R4A

负责：

    full-redacted route guard parallel adaptation
    route-contract-check guard regression

### Phase 9M-R4B

负责：

    route switch docs-only boundary review
    API 成功响应 schema 评审
    request body size 评审
    route regression 策略
    provider mock 策略

### Phase 9M-R4C

在 R4B 评审通过后再决定：

    是否修改 route.ts
    是否切换 POST route
    是否保留旧 payload compatibility

### Phase 9M-R5

负责：

    恢复并嫁接 UI WIP
    保留 stash 备份
    一次主动确认
    完整脱敏预览
    session-only 输出
    AI 补充关注项
    文本变化后旧结果失效

---

## 17. 产品判断

route guard 不是为了增加用户操作。

它是隐藏在服务端内部的安全边界。

用户不需要理解：

    canonical metadata
    exact-key validation
    additive compatibility bridge
    server-side second redaction
    composite signal identity

用户只需要获得：

    简单的合同粘贴入口
    清晰的脱敏预览
    一次主动确认
    克制、实用、可读的风险提示
    可继续核实的问题清单

内部严格。

外部简单。
