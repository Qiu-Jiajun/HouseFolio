# Phase 9L-0｜Contract Review API Route Boundary Review

## 0. 文档定位

本文档用于定义 HouseFolio 合同风险提示助手的 API route 边界。

本阶段名称：

    Phase 9L-0：Contract review API route boundary review

本阶段只做 docs-only 架构评审。

本阶段不新增 API route，不修改 `src`，不接 UI，不运行真实 DeepSeek 请求，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`。

下一阶段在本文档边界确认后，再进入：

    Phase 9L-1：Contract review API route minimal implementation plan

---

## 1. 当前稳定基础

当前稳定点：

    f11ad99 docs: close contract deepseek provider phase

当前已经完成：

    原始合同文本
    → clause segmentation
    → ContractClauseSegment[]
    → risk matcher
    → ContractRiskFinding[]
    → legal basis mapping
    → legal basis resolver
    → ContractReviewModel
    → buildContractReviewAiInput()
    → ContractReviewAiInput
    → buildContractReviewExplanationPrompt()
    → contractReviewDeepSeekProvider
    → ContractReviewExplanationOutput

当前 L2 与 L3 边界已经明确：

    L2 决定风险命中、风险等级、风险排序和法规依据映射。
    L3 只负责人话解释、签前追问、建议补充条款方向和协商话术。
    DeepSeek 不进入风险判断层，不改变 riskId，不改变 riskLevel，不替用户决定是否签约。

---

## 2. Phase 9L-0 的核心问题

Phase 9L-0 不追求尽快新增 endpoint。

本阶段真正要回答：

    1. Route 应接收什么输入？
    2. Route 必须拒绝什么输入？
    3. 浏览器端已经脱敏后，服务端是否仍需再次校验？
    4. 服务端是否仍需再次执行防御性脱敏？
    5. Route 如何调用合同 DeepSeek provider？
    6. 是否需要 provider selector？
    7. 错误如何安全映射？
    8. 如何确保 reasoning_content 永远不进入客户端？
    9. 如何保持 session-only？
    10. 用户主动确认应放在哪一层？

---

## 3. 推荐 endpoint

第一版推荐：

    POST /api/ai/contract-review-explanation

Route 只接受 POST。

不新增：

    GET
    PUT
    PATCH
    DELETE
    流式 SSE endpoint
    WebSocket
    多轮会话 endpoint
    历史记录 endpoint
    文件上传 endpoint

原因：

    第一版合同助手只需要一次性、单轮、用户主动触发的人话解释。
    不需要把合同助手扩张成聊天系统、文档平台或持久化法律服务。

---

## 4. Route 输入边界

### 4.1 Route 只接收 AI-safe payload

第一版 route 输入应为：

    ContractReviewAiInput

允许的顶层字段：

    payloadVersion
    locale
    disclaimerMode
    findingCount
    findings

允许的风险项字段：

    riskId
    riskLevel
    category
    ruleTitleZh
    clause
    riskSummaryZh
    whyItMattersZh
    legalBases

允许的条款字段：

    clauseId
    clauseOrder
    redactedClauseExcerpt

允许的法规依据字段：

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

Route 不应接收完整的 `ContractReviewModel`。

原因：

    ContractReviewModel 仍然包含比联网调用所需更多的本地结构化信息。
    API route 只应处理联网解释真正需要的最小字段集合。

### 4.2 Route 明确不得接收的内容

Route 必须拒绝：

    完整合同原文
    rawText
    clauseText
    fullContract
    未命中条款
    OCR 原始文本
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页
    房东或中介聊天记录
    看房照片
    房源档案
    localStorage 全量数据
    IndexedDB 数据
    API key
    Authorization header
    model 名称
    provider 名称
    prompt
    systemPrompt
    aiPrompt
    reasoning_content
    rawResponse
    providerResponse
    request body 调试副本
    response body 调试副本

Route 不接受客户端传入：

    CONTRACT_REVIEW_AI_MODEL
    DEEPSEEK_API_KEY
    baseUrl
    timeoutMs
    maxTokens
    reasoning_effort
    thinking
    stream
    tools
    tool_choice

这些配置只能由服务端代码和服务端环境变量决定。

---

## 5. 服务端必须再次执行 allowlist 校验

### 5.1 浏览器端 payload 不可信

即使浏览器端已经调用：

    buildContractReviewAiInput()

服务端仍不得信任客户端请求。

原因：

    客户端代码可以被绕过。
    请求可以被手工构造。
    浏览器端脱敏不是服务端安全边界。
    合同文本属于高敏资料。
    联网调用 DeepSeek 前必须再次建立最小必要边界。

### 5.2 推荐使用 pure route guard

后续实现时，推荐增加一个纯 TypeScript route guard。

候选命名：

    src/lib/contract/ai-safe-input-route-guard.ts

候选函数：

    parseAndSanitizeContractReviewAiInput(value: unknown)

职责：

    接收 unknown
    → 校验 exact keys
    → 校验字段类型
    → 校验 allowlist
    → 校验字段长度
    → 校验数组数量
    → 校验 findingCount 与 findings.length 一致
    → 执行禁止字段递归扫描
    → 对 redactedClauseExcerpt 执行防御性二次脱敏
    → 返回重新构造的 ContractReviewAiInput

Route guard 必须重新构造安全对象。

不得直接把客户端传入对象原样透传给 provider。

### 5.3 必须校验的字段

顶层必须校验：

    payloadVersion
    locale
    disclaimerMode
    findingCount
    findings
    顶层 exact keys

风险项必须校验：

    finding exact keys
    riskId allowlist
    riskLevel allowlist
    category allowlist
    ruleTitleZh 长度
    riskSummaryZh 长度
    whyItMattersZh 长度
    legalBases 数量

条款必须校验：

    clause exact keys
    clauseId 长度
    clauseOrder 为正整数
    redactedClauseExcerpt 长度
    全部条款片段总长度

法规依据必须校验：

    legalBasis exact keys
    legalBasisId allowlist 或 canonical 校验
    legalBasisTitleZh 长度
    legalBasisSummaryZh 长度
    legalBasisSourceType allowlist

禁止字段必须递归扫描。

---

## 6. 第一版请求限制

沿用 AI-safe input builder 已确认的边界：

    maxFindings: 20
    maxExcerptChars: 360
    maxLegalBasesPerFinding: 4
    maxLegalBasisSummaryChars: 240
    maxRiskSummaryChars: 240
    maxWhyItMattersChars: 320
    maxTotalExcerptChars: 6000

Route 还应增加请求文本总长度限制。

推荐第一版：

    maxRequestBodyChars: 100000

推荐处理方式：

    request.text()
    → 先检查文本总长度
    → 再 JSON.parse()
    → 再进入 route guard

不要直接对无限大小的请求体调用：

    request.json()

Route 应要求：

    Content-Type: application/json

Route 不应主动增加跨域 CORS 响应头。

---

## 7. 服务端防御性二次脱敏

### 7.1 结论

Route 收到浏览器端脱敏 payload 后，仍应对：

    redactedClauseExcerpt

执行防御性二次脱敏。

### 7.2 原因

浏览器端脱敏不能作为可信边界。

自动脱敏可能存在遗漏。

客户端请求可能绕过浏览器端 builder。

Route 是联网调用 DeepSeek 前最后一个可控边界。

### 7.3 脱敏范围

第一版继续覆盖：

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

必须准确表达：

    自动脱敏可能存在遗漏。
    不宣传完全脱敏。
    不宣传绝对安全。
    用户发送前仍需预览脱敏摘要。
    用户可以返回修改或取消发送。

---

## 8. Provider 接入策略

### 8.1 第一版推荐直接调用现有 provider

第一版 route 推荐直接调用：

    contractReviewDeepSeekProvider.generateContractReviewExplanation(
      sanitizedInput
    )

不需要立即增加：

    CONTRACT_REVIEW_AI_PROVIDER
    provider registry
    provider factory registry
    mock contract provider
    多 provider selector
    客户端 provider 参数
    query string provider 参数
    query string model 参数

### 8.2 为什么不立即新增 selector

当前只有一个明确合同解释 provider：

    deepseek

过早新增 registry 会扩大抽象层，而不会增加当前用户价值。

HouseFolio 当前更需要尽快形成：

    用户主动确认
    → 安全 route
    → 人话风险提示 UI

而不是继续横向扩张基础设施。

### 8.3 后续何时考虑 selector

只有出现以下明确需求时，再增加极小 selector：

    需要 mock provider 支持稳定浏览器回归
    需要本地 demo provider
    需要迁移到其他中文模型 API
    需要区分生产与测试 provider

即使后续增加 selector，也必须坚持：

    provider 由服务端配置决定
    客户端不得指定 provider
    客户端不得指定 model
    客户端不得指定 baseUrl
    客户端不得指定 API key

---

## 9. Provider 输出边界

现有 provider 已经返回：

    ContractReviewExplanationOutput

顶层结构：

    summaryZh
    findingExplanations
    disclaimerZh

风险项结构：

    riskId
    riskLevel
    titleZh
    explanationZh
    legalBasisNotesZh
    preSigningQuestionsZh
    suggestedClauseDirectionsZh
    negotiationScriptZh
    needsFurtherConfirmation

Route 只允许序列化：

    schema-validated ContractReviewExplanationOutput

Route 不得返回：

    DeepSeek transport response
    choices
    message
    provider raw content
    provider error 原始对象
    prompt
    request body
    response body
    reasoning_content
    reasoning_content 长度
    reasoning_content 摘要
    reasoning_content token 明细
    reasoning_content hash

任何 provider 越界响应：

    安全失败
    不返回部分结果
    不降级成自由文本
    不尝试修补非法 JSON
    不向客户端回显原始模型输出

---

## 10. reasoning_content 隔离策略

DeepSeek Thinking Mode 可能返回：

    content
    reasoning_content

它们处于同级。

HouseFolio 只读取：

    content

Route 必须保证：

    provider 只返回 ContractReviewExplanationOutput
    route 只序列化 schema-validated output
    route 不返回 provider 原始响应
    route 不返回 provider error 原始对象
    route 不记录 reasoning_content
    route 不增加调试回显字段
    route 不增加 reasoning_content telemetry
    route 不增加 reasoning_content token 统计
    route 不增加 reasoning_content hash

reasoning_content 不得进入：

    客户端
    UI state
    localStorage
    IndexedDB
    数据库
    日志
    analytics
    prompt history
    导出报告
    错误对象

---

## 11. Route 错误映射

### 11.1 Route 输入错误

建议增加 route 层安全错误：

    invalid_request

HTTP status：

    400

用户可见中文提示：

    请求内容未通过安全校验，请返回检查后重试。

不得回显具体字段值。

### 11.2 Provider 错误映射

建议映射：

| Provider error code | HTTP status | 用户可见语义 |
| --- | ---: | --- |
| `missing_configuration` | 503 | 当前 AI 服务配置暂不可用。 |
| `invalid_configuration` | 503 | 当前 AI 服务配置暂不可用。 |
| `rate_limited` | 429 | 请求过于频繁，请稍后再试。 |
| `request_timeout` | 504 | 当前网络不稳定，请稍后重试。 |
| `request_failed` | 502 | AI 服务暂时不可用，请稍后重试。 |
| `invalid_response` | 502 | 本次 AI 响应未通过安全校验，请稍后重试。 |
| `unknown_failure` | 500 | AI 服务暂时不可用，请稍后重试。 |

响应体建议保持最小：

    {
      error: string;
      code: string;
    }

错误响应必须：

    中文
    安全
    克制
    不回显输入
    不回显 prompt
    不回显条款片段
    不回显 DeepSeek 原始 content
    不回显 reasoning_content
    不回显 API key
    不回显 Authorization header
    不回显 request body
    不回显 response body
    不回显 stack trace

---

## 12. Session-only 边界

第一版 route 必须保持：

    route 不持久化
    provider 不持久化
    API 响应不自动写 storage
    不保存合同历史
    不保存 AI 输出历史
    不保存 prompt
    不保存 reasoning_content
    不保存 request body
    不保存 response body
    不保存条款片段
    不保存用户标识
    不保存多轮会话
    不保存 analytics payload

后续 UI 只保留会话级结果。

允许：

    页面内临时 React state

刷新页面后：

    AI 人话解释可以消失

当前不增加：

    localStorage
    IndexedDB
    Supabase
    数据库
    云端同步
    导出报告

导出与数据权利在 Phase 9L 之后单独评审。

---

## 13. 用户主动确认边界

Route 本身只能处理 POST 请求。

Route 无法替代 UI 层的用户确认。

后续 UI 必须在联网前提供确认界面。

确认界面应允许用户：

    预览即将发送给 AI 的脱敏摘要
    查看风险项数量
    理解只会发送命中条款的脱敏片段
    理解自动脱敏可能存在遗漏
    返回修改
    取消发送
    主动确认并调用 AI

不得：

    粘贴合同后自动调用 AI
    条款切分后自动调用 AI
    页面初始加载后自动调用 AI
    后台自动调用 AI
    未经用户确认批量调用 AI

Route 不需要接收：

    userConfirmed
    confirmationToken
    confirmationTimestamp

原因：

    客户端传入布尔值不能构成可靠安全证明。
    用户确认属于 UI 交互约束，不应伪装成服务端授权机制。

---

## 14. 日志策略

第一版 route 默认不记录 payload。

禁止记录：

    完整合同原文
    redactedClauseExcerpt
    prompt
    ContractReviewAiInput
    ContractReviewExplanationOutput
    DeepSeek 原始 content
    reasoning_content
    request body
    response body
    API key
    Authorization header

后续如确有排障或成本统计需求，只允许记录最小非内容型信息：

    请求成功或失败分类
    HTTP status
    provider error code
    耗时区间
    时间戳
    非内容型 request id

即使后续增加最小日志，也不得记录条款内容或模型思考内容。

---

## 15. Compare route 只能作为有限参考

现有 Compare AI route 可以作为 Next.js route 组织形式的参考。

但合同风险提示 route 不应机械复制 Compare route。

原因：

    合同片段比房源对比摘要更敏感。
    合同 route 必须增加 exact-key 校验。
    合同 route 必须增加禁止字段递归扫描。
    合同 route 必须增加请求体总长度限制。
    合同 route 必须增加服务端防御性二次脱敏。
    合同 route 必须明确拒绝完整合同原文。
    合同 route 必须更加严格地隔离 reasoning_content。

---

## 16. 后续最小文件范围建议

Phase 9L-1 再决定最终文件范围。

当前推荐候选：

    docs/architecture/phase-9l-1-contract-review-api-route-minimal-implementation-plan.md
    src/lib/contract/ai-safe-input-route-guard.ts
    src/app/api/ai/contract-review-explanation/route.ts

Phase 9L-3 再评审是否新增：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

不要在 Phase 9L-1 前提前实现。

不要为了理论完整度新增：

    provider registry
    provider selector
    mock provider
    persistence
    UI
    report builder
    analytics
    test runtime dependency
    test framework dependency

---

## 17. Phase 9L 推荐路线

推荐顺序：

    Phase 9L-0：API route boundary review
    Phase 9L-1：API route minimal implementation plan
    Phase 9L-2：API route minimal implementation
    Phase 9L-3：API route contract-check
    Phase 9L-4：API route closing checkpoint

完成 Phase 9L 后，再进入：

    用户主动确认 UI
    → 用户可见合同风险提示 UI
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

不要在 Phase 9L-0 直接跳到 Phase 9L-2。

---

## 18. Phase 9L-0 非目标

Phase 9L-0 不做：

    route 实现
    src 修改
    UI 修改
    React component
    用户确认弹窗
    AI 输出展示
    localStorage
    IndexedDB
    persistence
    合同历史
    AI 历史
    `.env.example` 修改
    README 修改
    `.env.local` 修改
    Vercel 环境变量修改
    真实 DeepSeek smoke test
    provider selector
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

## 19. 验收标准

Phase 9L-0 完成标准：

    只新增：
    docs/architecture/phase-9l-0-contract-review-api-route-boundary-review.md

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

    docs: review contract api route boundary

---

## 20. 最终结论

HouseFolio 合同风险提示 API route 的正确定位是：

    一个严格受限的、单轮的、session-only 的服务端联网代理。

它只负责：

    接收最小 AI-safe payload
    → 服务端 allowlist 校验
    → 防御性二次脱敏
    → 调用独立合同 DeepSeek provider
    → 返回 schema-validated final JSON

它不是：

    合同原文上传入口
    文件上传入口
    OCR 入口
    PDF 解析入口
    合同历史服务
    AI 聊天服务
    法律咨询服务
    自动维权服务
    模型调试接口
    reasoning_content 暴露接口