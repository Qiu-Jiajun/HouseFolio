# HouseFolio Phase 9M-R4B｜合同 AI route switch 边界评审

## 0. 文档用途

本文档用于锁定 Phase 9M-R4B 与后续 Phase 9M-R4C 的 API route 迁移边界。

本阶段不修改源码。

本阶段不恢复 UI stash。

本阶段不运行真实 DeepSeek 请求。

核心目标：

    在不破坏 legacy matched-findings 链路的前提下，
    为 full-redacted contract payload 增加明确、
    可审计、可回归的服务端 additive dispatch。

继续遵守：

    additive compatibility bridge
    增量兼容桥

---

## 1. 当前远端稳定点

当前稳定点：

    f265b01 feat: add full redacted contract route guard

完整 hash：

    f265b013774488b9ff17fb2a36074fb1e5395d20

已经确认：

    HEAD = main = origin/main = origin/HEAD
    git ls-remote 精确匹配
    npm.cmd run build passed
    git status clean
    VS Code integrated terminal 正常
    terminal.integrated.shellIntegration.enabled = false
    stash@{0} 完整保留

受保护 stash：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

精确文件清单：

    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx
    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts

在 Phase 9M-R5 前：

    不恢复
    不 pop
    不 drop
    不覆盖
    不修改

---

## 2. 当前 POST route 的真实行为

当前：

    src/app/api/ai/contract-review-explanation/route.ts

只执行 legacy 链路：

    readJsonBody(request)
    → parseAndSanitizeContractReviewAiInput(body)
    → generateContractReviewExplanation(input)
    → ContractReviewExplanationOutput
    → jsonNoStore(output)

当前 API 成功响应类型：

    ContractReviewExplanationOutput

当前尚未接入：

    parseAndSanitizeContractReviewFullRedactedAiInput()
    generateFullRedactedContractReviewExplanation()
    ContractReviewFullRedactedExplanationOutput

---

## 3. 当前已经存在的并行能力

### 3.1 legacy sanitizer

已经存在：

    parseAndSanitizeContractReviewAiInput(
      value: unknown
    ): ContractReviewAiInput

### 3.2 full-redacted sanitizer

已经存在：

    parseAndSanitizeContractReviewFullRedactedAiInput(
      value: unknown
    ): ContractReviewFullRedactedAiInput

### 3.3 legacy provider method

已经存在：

    generateContractReviewExplanation(
      input: ContractReviewAiInput
    ): Promise<ContractReviewExplanationOutput>

### 3.4 full-redacted provider method

已经存在：

    generateFullRedactedContractReviewExplanation(
      input: ContractReviewFullRedactedAiInput
    ): Promise<ContractReviewFullRedactedExplanationOutput>

### 3.5 v2 output schema

已经存在：

    ContractReviewFullRedactedExplanationOutput

包含：

    outputVersion
    summaryZh
    ruleSignalExplanations
    supplementalAttentionItems
    disclaimerZh

---

## 4. route switch 不采用破坏式替换

Phase 9M-R4C 不应直接删除 legacy route 行为。

禁止：

    只接受 full-redacted payload
    删除 legacy sanitizer
    删除 legacy provider method
    删除 legacy output schema
    直接让旧 UI WIP 失效

推荐：

    根据 payloadVersion 做 additive dispatch

---

## 5. payloadVersion additive dispatch

建议新增 route 内部纯函数：

    parseAndSanitizeContractReviewExplanationRequest(
      value: unknown
    ): ContractReviewExplanationRouteRequest

建议新增 discriminated union：

    type ContractReviewExplanationRouteRequest =
      | {
          readonly mode: "matched-findings";
          readonly input: ContractReviewAiInput;
        }
      | {
          readonly mode: "full-redacted-contract";
          readonly input: ContractReviewFullRedactedAiInput;
        };

dispatch 规则：

    value 必须是 object
    value 不得为 null
    value 不得为 array
    value.payloadVersion 必须是 string

    payloadVersion =
      CONTRACT_REVIEW_AI_INPUT_VERSION
    → parseAndSanitizeContractReviewAiInput(value)

    payloadVersion =
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION
    → parseAndSanitizeContractReviewFullRedactedAiInput(value)

    unknown payloadVersion
    → ContractReviewAiInputRouteGuardError
    → invalid_request

不要采用：

    根据 findings 是否存在猜测版本
    根据 redactedClauses 是否存在猜测版本
    根据 key 数量猜测版本
    try legacy catch full-redacted
    try full-redacted catch legacy

原因：

    版本分派必须显式、确定、可审计。
    不能让格式错误请求在两个 sanitizer 之间反复尝试。

---

## 6. POST route additive provider dispatch

建议 POST route 在获得 discriminated union 后执行：

    const requestInput =
      parseAndSanitizeContractReviewExplanationRequest(body);

    const output =
      requestInput.mode === "full-redacted-contract"
        ? await contractReviewDeepSeekProvider
            .generateFullRedactedContractReviewExplanation(
              requestInput.input,
            )
        : await contractReviewDeepSeekProvider
            .generateContractReviewExplanation(
              requestInput.input,
            );

    return jsonNoStore(output);

成功响应类型扩展为：

    ContractReviewExplanationOutput
    | ContractReviewFullRedactedExplanationOutput

错误响应保持：

    ContractReviewExplanationApiErrorResponse

---

## 7. 错误模型保持不变

继续复用：

    ContractReviewApiRequestError
    ContractReviewAiInputRouteGuardError
    ContractReviewDeepSeekProviderError

API error code 保持：

    unsupported_media_type
    request_too_large
    invalid_request
    missing_configuration
    invalid_configuration
    rate_limited
    request_timeout
    request_failed
    invalid_response
    unknown_failure

unknown payloadVersion：

    invalid_request
    HTTP 400

不得向用户暴露：

    provider 原始错误
    reasoning_content
    原始请求体
    API key
    Prompt
    内部 stack trace

---

## 8. Cache-Control 保持 no-store

所有响应继续统一通过：

    jsonNoStore()

必须保持：

    Cache-Control: no-store

包括：

    legacy success
    full-redacted success
    request validation error
    provider error
    unknown failure

---

## 9. request-body capacity 是 route switch 前置 gate

当前 route：

    MAX_REQUEST_BODY_CHARS = 100_000

当前 full-redacted payload 上游限制：

    maxRedactedClauseCount = 120
    maxRedactedClauseChars = 2400
    maxTotalRedactedChars = 30000
    maxRuleSignals = 60
    maxLegalBasesPerSignal = 6
    maxLegalBasisSummaryChars = 240
    maxRiskSummaryChars = 240
    maxWhyItMattersChars = 320

不能直接假设：

    100_000 chars 一定足够

原因：

    JSON payload 除了 30000 chars 脱敏正文，
    还会重复携带 rule signal metadata 与 legal basis metadata。

Phase 9M-R4B-2 必须执行：

    合法 full-redacted payload 序列化容量测量

必须至少测量：

    真实 fixture payload
    多 clause payload
    多 rule signal payload
    接近允许上限的 synthetic valid payload
    JSON.stringify(payload).length

如果合法 payload 可能超过当前上限：

    可以提高 MAX_REQUEST_BODY_CHARS

但必须：

    保持有限上限
    给出明确容量依据
    增加 request_too_large regression
    同时保留 Content-Length 预检查
    同时保留 request.text() 后长度检查

不得：

    取消 body limit
    使用无限制读取
    仅依赖 Content-Length
    静默裁剪 payload

---

## 10. route-contract-check 扩展原则

Phase 9M-R4C 默认修改：

    src/app/api/ai/contract-review-explanation/route.ts
    src/app/api/ai/contract-review-explanation/route-contract-check.ts

### 10.1 保留全部 legacy route regression

继续保留：

    unsupported_media_type
    invalid_request
    invalid JSON
    request_too_large
    rawText rejection
    Cache-Control: no-store

### 10.2 新增纯 dispatch helper regression

优先测试：

    parseAndSanitizeContractReviewExplanationRequest()

而不是通过真实 POST success 调用 provider。

原因：

    route.ts 当前使用真实 provider singleton。
    route switch contract-check 不得调用真实 DeepSeek。

必须覆盖：

    legacy payloadVersion
      → mode = "matched-findings"

    full-redacted payloadVersion
      → mode = "full-redacted-contract"

    unknown payloadVersion
      → invalid_request

    缺失 payloadVersion
      → invalid_request

    array
      → invalid_request

    null
      → invalid_request

    malformed legacy payload
      → invalid_request

    malformed full-redacted payload
      → invalid_request

### 10.3 route-level POST success mock 策略

如果必须验证成功分支 provider dispatch：

    不得运行真实 DeepSeek 请求

可选策略：

    将 provider dispatch 提取为可注入纯 helper
    或为 route 内部函数增加 provider 参数默认值
    或使用最小测试 seam

但默认优先：

    纯 request dispatch helper regression
    + provider contract-check
    + build

避免为了测试引入过度复杂依赖注入。

---

## 11. UI WIP stash 当前仍是 legacy 链路

只读 stash 审计已经确认：

    contract-review-panel.tsx

当前仍然：

    buildContractReviewAiInput(reviewModel)

并使用：

    ContractReviewExplanationOutput

当前仍然要求：

    hasFindings

才能生成 AI preview。

因此，Phase 9M-R4C route additive dispatch 完成后：

    旧 UI WIP 仍然可运行

进入 Phase 9M-R5 后再处理：

    buildContractReviewFullRedactedAiInput(reviewModel)
    ContractReviewFullRedactedExplanationOutput
    ruleSignals = [] 仍允许发送
    完整脱敏预览
    一次主动确认
    supplementalAttentionItems 展示

---

## 12. stash snapshot warning 的解释

本轮只读审计中：

    contract-review-ai-confirmation-panel.tsx
    contract-review-ai-explanation-panel.tsx

无法通过：

    git show stash@{0}:<path>

直接读取。

但：

    git stash show --name-only --include-untracked

仍然精确包含上述文件。

推测：

    两个文件属于 stash 的 untracked snapshot。

Phase 9M-R5 恢复前审计时，应使用 fallback：

    git show stash@{0}:<path>
    git show stash@{0}^3:<path>

当前：

    不恢复 stash
    不处理 stash
    不删除 stash

---

## 13. 默认允许修改范围

### Phase 9M-R4B-2

只允许：

    docs-only 容量测量记录
    docs-only route switch 实现计划

不修改 src。

### Phase 9M-R4C

默认只允许修改：

    src/app/api/ai/contract-review-explanation/route.ts
    src/app/api/ai/contract-review-explanation/route-contract-check.ts

如果容量测量证明必须调整 body limit：

    仍然只修改 route.ts 中的有限常量

默认禁止修改：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/types/ai-contract-review-explanation.ts
    src/components/**
    src/content/zh-cn.ts
    package.json
    package-lock.json
    .env.local
    .env.example

如果必须扩大 scope：

    停止
    汇报
    不自行修改

---

## 14. 默认禁止事项

禁止：

    恢复 stash
    删除 stash
    stash pop
    stash drop
    修改 UI
    修改中文文案
    运行真实 DeepSeek 请求
    调用真实 DeepSeek endpoint
    新增 OCR
    新增 PDF
    新增合同照片
    新增 RAG
    新增 persistence
    新增 localStorage key
    新增 IndexedDB key
    安装依赖
    使用 git add .
    使用 git add -A
    使用会关闭 VS Code integrated terminal 的顶层 exit 1
    恢复 shell integration

---

## 15. 产品原则

route dispatch 属于内部安全边界。

它不应增加用户操作。

用户无需理解：

    payloadVersion
    discriminated union
    sanitizer dispatch
    provider dispatch
    request body limit
    legal basis canonical rebuild

用户只需要：

    粘贴合同
    查看脱敏预览
    主动确认一次
    获得清晰的人话提示
    查看签约前问题清单

内部严格。

外部简单。

---

## 16. 后续阶段

### Phase 9M-R4B-2

负责：

    只读 payload capacity measurement
    docs-only route switch 实现计划

### Phase 9M-R4C

负责：

    payloadVersion additive dispatch
    POST route 双 provider 分派
    route-contract-check 扩展
    request body limit 有依据调整
    不运行真实 DeepSeek
    不恢复 stash

### Phase 9M-R5

负责：

    保留 stash 备份
    恢复 UI WIP
    嫁接 full-redacted builder
    v2 output 展示
    supplementalAttentionItems 展示
    文本变化后旧输出失效
    清除本次结果
    重新生成再次确认
