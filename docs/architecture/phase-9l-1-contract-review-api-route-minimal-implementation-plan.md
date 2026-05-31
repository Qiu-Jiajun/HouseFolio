# Phase 9L-1｜Contract Review API Route Minimal Implementation Plan

## 0. 文档定位

本文档用于规划 HouseFolio 合同风险提示助手的最小 API route 实现。

本阶段名称：

    Phase 9L-1：Contract review API route minimal implementation plan

本阶段只写实现计划文档。

本阶段不修改 `src`，不新增 API route，不接 UI，不运行真实 DeepSeek 请求，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`。

本文档确认后，下一阶段进入：

    Phase 9L-2：Contract review API route minimal implementation

---

## 1. 当前稳定基础

当前稳定点：

    27e9b63 docs: review contract api route boundary

当前已经完成：

    合同文本输入
    → 条款切分
    → 风险规则命中
    → 法规依据映射
    → legal basis resolver
    → structured review model
    → AI-safe 脱敏输入
    → DeepSeek explanation prompt
    → DeepSeek explanation provider
    → API route boundary review

当前缺少：

    一个浏览器可以安全调用的合同风险解释 API route

Phase 9L-2 的任务不是重新设计合同助手，也不是扩张 AI 基础设施。

Phase 9L-2 只补齐：

    浏览器端 AI-safe payload
    → 服务端安全闸门
    → 现有 DeepSeek provider
    → schema-validated final JSON

---

## 2. Phase 9L-2 的一句话目标

实现一个严格受限的、单轮的、session-only 的服务端联网代理：

    POST /api/ai/contract-review-explanation

它只负责：

    接收最小 AI-safe payload
    → 请求体大小检查
    → Content-Type 检查
    → exact-key allowlist 校验
    → 禁止字段递归扫描
    → 字段长度与数量校验
    → 防御性二次脱敏
    → 重新构造安全输入
    → 调用 contractReviewDeepSeekProvider
    → 安全映射错误
    → 返回 schema-validated final JSON

它不负责：

    合同全文上传
    OCR
    PDF
    合同照片
    用户确认弹窗
    风险提示 UI
    本地历史
    AI 历史
    报告导出
    analytics
    RAG
    多轮对话
    provider registry
    mock provider
    真实 DeepSeek smoke test

---

## 3. Phase 9L-2 最小文件范围

Phase 9L-2 推荐只新增两个文件：

    src/lib/contract/ai-safe-input-route-guard.ts
    src/app/api/ai/contract-review-explanation/route.ts

不要修改：

    src/lib/contract/ai-safe-input.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-deepseek-provider-contract-check.ts
    src/content/zh-cn.ts
    src/components/*
    src/app/contract-review/*
    .env.local
    .env.example
    README.md
    package.json
    package-lock.json

如果 Phase 9L-2 实现过程中发现确实无法复用现有类型或脱敏逻辑，应停止扩张文件范围，先回到评审阶段。

不要为了“顺手重构”扩大 Phase 9L-2。

---

## 4. 文件一：ai-safe-input-route-guard.ts

建议新增：

    src/lib/contract/ai-safe-input-route-guard.ts

推荐导出：

    ContractReviewAiInputRouteGuardError
    parseAndSanitizeContractReviewAiInput(value: unknown)

可选导出：

    CONTRACT_REVIEW_AI_ROUTE_GUARD_LIMITS

### 4.1 Route guard 的职责

Route guard 接收：

    unknown

Route guard 返回：

    ContractReviewAiInput

Route guard 必须：

    1. 校验 value 为 object；
    2. 校验顶层 exact keys；
    3. 校验 payloadVersion；
    4. 校验 locale；
    5. 校验 disclaimerMode；
    6. 校验 findingCount；
    7. 校验 findings 数组数量；
    8. 校验 findingCount === findings.length；
    9. 校验每个 finding exact keys；
    10. 校验 riskId；
    11. 校验 riskLevel；
    12. 校验 category；
    13. 校验文本字段长度；
    14. 校验 clause exact keys；
    15. 校验 clauseOrder 为正整数；
    16. 校验 redactedClauseExcerpt 长度；
    17. 校验全部 excerpt 总长度；
    18. 校验 legalBases 数量；
    19. 校验每个 legal basis exact keys；
    20. 校验 legalBasisId；
    21. 校验 legalBasisSourceType；
    22. 对全部对象执行禁止字段递归扫描；
    23. 对 redactedClauseExcerpt 执行防御性二次脱敏；
    24. 返回重新构造的新对象。

Route guard 不得：

    原样返回客户端对象
    使用对象 spread 透传未知字段
    调用 DeepSeek
    读取环境变量
    访问网络
    写日志
    写 localStorage
    写 IndexedDB
    写数据库
    读取完整合同
    保存原始 payload

### 4.2 顶层字段 allowlist

只允许：

    payloadVersion
    locale
    disclaimerMode
    findingCount
    findings

必须确认：

    payloadVersion === CONTRACT_REVIEW_AI_INPUT_VERSION
    locale === "zh-CN"
    disclaimerMode === "contract-risk-prompt-only"
    findingCount === findings.length

### 4.3 Finding 字段 allowlist

每个 finding 只允许：

    riskId
    riskLevel
    category
    ruleTitleZh
    clause
    riskSummaryZh
    whyItMattersZh
    legalBases

### 4.4 Clause 字段 allowlist

每个 clause 只允许：

    clauseId
    clauseOrder
    redactedClauseExcerpt

### 4.5 Legal basis 字段 allowlist

每个 legal basis 只允许：

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

### 4.6 禁止字段递归扫描

任何层级出现以下字段均拒绝：

    rawText
    contractText
    fullContract
    clauseText
    unredactedClauseText
    prompt
    aiPrompt
    systemPrompt
    reasoning_content
    reasoningContent
    rawResponse
    providerResponse
    requestBody
    responseBody
    apiKey
    secretKey
    authorization
    model
    provider
    baseUrl
    timeoutMs
    maxTokens
    thinking
    reasoning_effort
    stream
    tools
    tool_choice
    legalConclusion
    illegalityVerdict
    invalidityVerdict
    litigationAdvice
    winProbability
    shouldSign
    finalDecision
    recommendation

### 4.7 字段限制

第一版建议沿用 AI-safe input builder 已确认限制：

    maxFindings: 20
    maxExcerptChars: 360
    maxLegalBasesPerFinding: 4
    maxLegalBasisSummaryChars: 240
    maxRiskSummaryChars: 240
    maxWhyItMattersChars: 320
    maxTotalExcerptChars: 6000

可以为 route guard 补充：

    maxClauseIdChars: 160
    maxRuleTitleZhChars: 160
    maxLegalBasisIdChars: 160
    maxLegalBasisTitleZhChars: 240

不要提高限制。

### 4.8 Canonical 校验策略

Phase 9L-2 实现前，应只读检查现有模块可复用导出。

优先复用：

    ContractReviewAiInput
    CONTRACT_REVIEW_AI_INPUT_VERSION
    现有 riskId literal 类型或 canonical rule 数组
    现有 riskLevel 类型
    现有 category 类型
    现有 legal basis literal 类型或 canonical basis 数组
    现有 legalBasisSourceType 类型
    现有脱敏函数或脱敏 helper

原则：

    不要维护第二套容易漂移的 canonical 数据源。

如果现有模块没有公开可复用导出：

    允许在 route guard 内部建立最小 allowlist；
    但必须在 Phase 9L-3 contract-check 中验证与现有 canonical 数据对齐。

不得为了复用而大面积修改现有稳定文件。

### 4.9 防御性二次脱敏

Route guard 必须对：

    redactedClauseExcerpt

再次执行脱敏。

原因：

    浏览器端 payload 不可信。
    客户端 builder 可以被绕过。
    自动脱敏可能遗漏。
    Route 是发送给 DeepSeek 前最后一个安全边界。

如果现有脱敏 helper 可以直接复用：

    优先 import 复用。

如果现有脱敏 helper 未导出：

    Phase 9L-2 允许在 route guard 内增加私有最小脱敏函数；
    不要在本阶段重构稳定的 AI-safe input builder。

脱敏范围继续包括：

    带标签姓名
    手机号
    身份证号
    邮箱
    微信号
    QQ
    合同编号
    权证编号
    精确门牌号组合
    收款账号
    签字信息
    长连续数字银行卡号

准确表达：

    防御性二次脱敏只能降低风险，不能保证完全脱敏。

---

## 5. 文件二：route.ts

建议新增：

    src/app/api/ai/contract-review-explanation/route.ts

推荐只导出：

    POST

不要导出：

    GET
    PUT
    PATCH
    DELETE

### 5.1 Route 处理顺序

推荐顺序：

    1. 检查 Content-Type；
    2. 调用 request.text()；
    3. 检查请求文本总长度；
    4. JSON.parse()；
    5. parseAndSanitizeContractReviewAiInput(value)；
    6. contractReviewDeepSeekProvider.generateContractReviewExplanation(
         sanitizedInput
       )；
    7. 返回 schema-validated final JSON；
    8. 设置 Cache-Control: no-store。

### 5.2 请求体上限

推荐：

    maxRequestBodyChars: 100000

处理顺序必须是：

    request.text()
    → 先判断长度
    → 再 JSON.parse()

不要直接：

    request.json()

原因：

    需要在 JSON parse 前限制请求体文本大小。

### 5.3 Content-Type

只接受：

    application/json

如果不符合：

    HTTP 415
    code: "unsupported_media_type"
    error: "请求格式不受支持，请返回检查后重试。"

### 5.4 请求体过大

如果请求文本超过限制：

    HTTP 413
    code: "request_too_large"
    error: "请求内容过长，请减少内容后重试。"

### 5.5 请求内容非法

如果：

    JSON 无法解析
    exact-key 校验失败
    字段类型失败
    字段长度失败
    数组数量失败
    禁止字段扫描失败
    canonical 校验失败
    防御性脱敏后无法形成有效输入

返回：

    HTTP 400
    code: "invalid_request"
    error: "请求内容未通过安全校验，请返回检查后重试。"

不得回显：

    字段值
    条款文本
    payload
    stack trace

### 5.6 Provider 错误映射

Route 应安全映射：

| Provider error code | HTTP status | 用户可见提示 |
| --- | ---: | --- |
| `missing_configuration` | 503 | 当前 AI 服务配置暂不可用。 |
| `invalid_configuration` | 503 | 当前 AI 服务配置暂不可用。 |
| `rate_limited` | 429 | 请求过于频繁，请稍后再试。 |
| `request_timeout` | 504 | 当前网络不稳定，请稍后重试。 |
| `request_failed` | 502 | AI 服务暂时不可用，请稍后重试。 |
| `invalid_response` | 502 | 本次 AI 响应未通过安全校验，请稍后重试。 |
| `unknown_failure` | 500 | AI 服务暂时不可用，请稍后重试。 |

未知错误：

    HTTP 500
    code: "unknown_failure"
    error: "AI 服务暂时不可用，请稍后重试。"

### 5.7 Route 响应边界

成功时只返回：

    ContractReviewExplanationOutput

失败时只返回：

    {
      error: string;
      code: string;
    }

响应 headers 推荐：

    Content-Type: application/json
    Cache-Control: no-store

不得返回：

    prompt
    request body
    provider request
    provider response
    DeepSeek choices
    DeepSeek message
    raw model content
    reasoning_content
    reasoning_content 长度
    reasoning_content 摘要
    reasoning_content hash
    API key
    Authorization header
    stack trace

### 5.8 日志策略

Phase 9L-2 默认不新增日志。

不要使用：

    console.log(payload)
    console.log(input)
    console.log(prompt)
    console.log(response)
    console.log(error)
    console.error(error)

原因：

    error 对象可能带有不应进入日志的上下文。

如果确有必要，只允许记录固定字符串或安全错误 code。

Phase 9L-2 第一版建议：

    不记录任何日志。

### 5.9 Runtime 策略

Phase 9L-2 优先保持标准 Next.js server route。

不要主动增加：

    Edge Runtime
    Vercel 专属能力
    Streaming
    Server-Sent Events
    WebSocket
    Cron
    Queue
    KV
    Blob
    Edge Config

如果现有 Compare route 没有显式 runtime 声明，合同 route 也不应为了形式增加额外配置。

---

## 6. Phase 9L-2 实现前只读检查

Phase 9L-2 写入前，必须先只读检查：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/risk-rules.ts 或对应规则模块
    src/lib/contract/legal-basis.ts 或对应法规依据模块
    src/lib/contract/legal-basis-resolver.ts
    src/types/ai-contract-review-explanation.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/app/api/ai/compare-explanation/route.ts

只读检查要回答：

    1. ContractReviewAiInput 的准确字段是什么？
    2. AI-safe input builder 的限制常量是否已经导出？
    3. 脱敏函数是否已经导出？
    4. riskId canonical 数据源在哪里？
    5. riskLevel canonical 数据源在哪里？
    6. category canonical 数据源在哪里？
    7. legalBasisId canonical 数据源在哪里？
    8. legalBasisSourceType canonical 数据源在哪里？
    9. Compare route 的错误响应格式是什么？
    10. 是否存在可复用的 JSON response helper？
    11. 是否存在不应复制的旧 route 模式？
    12. 是否可以严格控制 Phase 9L-2 只新增两个文件？

任何答案不清楚时：

    停止实现。
    不猜字段。
    不扩大文件范围。
    先回到评审。

---

## 7. Phase 9L-2 实现顺序

推荐顺序：

    Step 1：
    只读检查现有模块。

    Step 2：
    新增 src/lib/contract/ai-safe-input-route-guard.ts。

    Step 3：
    使用 Node UTF-8 检查中文提示。

    Step 4：
    npm.cmd run build。

    Step 5：
    git diff -- src/lib/contract/ai-safe-input-route-guard.ts。

    Step 6：
    新增 src/app/api/ai/contract-review-explanation/route.ts。

    Step 7：
    使用 Node UTF-8 检查中文提示。

    Step 8：
    npm.cmd run build。

    Step 9：
    git diff --stat。

    Step 10：
    git status。

    Step 11：
    只读复核 route 不包含日志、原始 payload 回显或 reasoning_content 回显。

    Step 12：
    只提交 Phase 9L-2 两个文件。

不要在一个脚本中同时：

    新增两个 src 文件
    直接 git add
    直接 commit
    直接 push

Phase 9L-2 应分步执行，便于人工审查。

---

## 8. Phase 9L-2 验收标准

Phase 9L-2 完成标准：

    只新增：
    src/lib/contract/ai-safe-input-route-guard.ts
    src/app/api/ai/contract-review-explanation/route.ts

    不修改已有 src 文件
    不新增 UI
    不修改 `.env.local`
    不修改 `.env.example`
    不修改 README
    不修改 package.json
    不修改 package-lock.json
    不安装依赖
    不运行真实 DeepSeek
    不新增 provider selector
    不新增 mock provider
    不新增 persistence
    不新增日志
    不新增 RAG
    不新增 OCR
    不新增 PDF
    不新增合同照片
    npm.cmd run build 通过
    git status 只显示两个新增 src 文件

建议 commit：

    feat: add contract review api route

---

## 9. Phase 9L-3 预留

Phase 9L-3 再新增 contract-check。

候选文件：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

Phase 9L-3 应覆盖：

    合法 payload 成功
    Content-Type 非 application/json
    请求体过长
    非法 JSON
    顶层额外字段
    finding 额外字段
    clause 额外字段
    legal basis 额外字段
    forbidden key
    findingCount 不一致
    超限 findings
    超限 excerpt
    总 excerpt 超限
    非法 riskId
    非法 riskLevel
    非法 category
    非法 legalBasisId
    非法 legalBasisSourceType
    二次脱敏生效
    missing_configuration
    invalid_configuration
    rate_limited
    request_timeout
    request_failed
    invalid_response
    unknown_failure
    reasoning_content 不进入响应
    Cache-Control: no-store
    不新增真实 DeepSeek 请求

不要在 Phase 9L-2 顺手实现 contract-check。

---

## 10. Phase 9L-4 预留

Phase 9L-4 用于：

    API route closing checkpoint
    build 回归
    route 文件边界扫描
    reasoning_content 隔离复核
    日志扫描
    git status clean
    push origin/main
    git ls-remote 真实远端校验
    docs closing log

Phase 9L 完整关闭后，再进入：

    用户主动确认 UI
    → 用户可见合同风险提示 UI
    → 报告导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

---

## 11. Phase 9L-1 非目标

Phase 9L-1 不做：

    route guard 实现
    API route 实现
    src 修改
    UI 修改
    用户确认弹窗
    AI 输出展示
    persistence
    localStorage
    IndexedDB
    合同历史
    AI 历史
    `.env.local` 修改
    `.env.example` 修改
    README 修改
    Vercel 环境变量修改
    真实 DeepSeek smoke test
    provider selector
    provider registry
    mock contract provider
    RAG
    OCR
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页
    全国法规自动适配
    司法案例检索
    自动投诉
    自动起诉
    自动索赔
    Chrome 插件
    Supabase
    package.json 修改
    package-lock.json 修改
    test runtime dependency
    test framework dependency

---

## 12. Phase 9L-1 验收标准

Phase 9L-1 完成标准：

    只新增：
    docs/architecture/phase-9l-1-contract-review-api-route-minimal-implementation-plan.md

    不修改 src
    不新增 route
    不修改 `.env.local`
    不修改 `.env.example`
    不修改 README
    不修改 package.json
    不修改 package-lock.json
    不运行真实 DeepSeek
    npm.cmd run build 通过
    git status 只显示新增 docs 文件

建议 commit：

    docs: plan contract review api route

---

## 13. 最终结论

Phase 9L-2 必须保持最小化。

正确实现是：

    两个新增文件
    → 一个 pure route guard
    → 一个 POST route
    → 一个现有 provider 调用
    → 一个 schema-validated final JSON 响应

不要把 Phase 9L-2 扩张为：

    provider registry
    mock provider
    日志系统
    持久化层
    UI 层
    OCR 层
    RAG 层
    测试框架引入
    平台专属基础设施