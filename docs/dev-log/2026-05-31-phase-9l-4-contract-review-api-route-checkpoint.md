# Phase 9L-4｜Contract Review API Route Closing Checkpoint

## 0. 文档定位

本文档用于正式关闭：

    Phase 9L：Contract review API route

本阶段只记录 API route 收口状态。

本阶段不修改 `src`，不接 UI，不运行真实 DeepSeek 请求，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`。

---

## 1. 当前稳定点

Phase 9L-3 已经完成本地 commit、push、fetch 与真实远端校验。

当前稳定点：

    f1ada72 test: add contract review api route checks

完整 hash：

    f1ada7248728afa9b0a11970cf7f92174fc2b298

已经确认：

    HEAD = main = origin/main = origin/HEAD
    = f1ada7248728afa9b0a11970cf7f92174fc2b298

    git status clean
    npm.cmd run build passed
    git push origin main passed
    git fetch origin main passed
    git ls-remote origin refs/heads/main 精确匹配

---

## 2. Phase 9L 完成范围

Phase 9L 已完成：

    Phase 9L-0：Contract review API route boundary review
    Phase 9L-1：Contract review API route minimal implementation plan
    Phase 9L-2：Contract review API route minimal implementation
    Phase 9L-3：Contract review API route contract-check
    Phase 9L-4：Contract review API route closing checkpoint

---

## 3. Phase 9L 新增与修改文件

### 3.1 Docs-only 边界评审

新增：

    docs/architecture/phase-9l-0-contract-review-api-route-boundary-review.md
    docs/architecture/phase-9l-1-contract-review-api-route-minimal-implementation-plan.md

### 3.2 API route 最小实现

最小修改：

    src/lib/contract/ai-safe-input.ts

修改内容：

    导出 contractReviewAiRiskMetadata
    供 route guard 复用唯一 canonical metadata 数据源

新增：

    src/lib/contract/ai-safe-input-route-guard.ts
    src/app/api/ai/contract-review-explanation/route.ts

### 3.3 Contract-check

新增：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

---

## 4. API route 精确定位

当前新增 endpoint：

    POST /api/ai/contract-review-explanation

该 route 是：

    严格受限
    单轮
    session-only
    服务端联网代理

该 route 不是：

    完整合同原文上传入口
    OCR 入口
    PDF 入口
    合同照片入口
    多轮聊天接口
    合同历史服务
    AI 法律咨询服务
    自动维权服务
    模型调试接口
    reasoning_content 暴露接口

---

## 5. Route 输入边界

Route 只接收：

    ContractReviewAiInput

Route 不接收：

    完整合同原文
    未命中条款
    OCR 原始文本
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页
    聊天记录
    房源档案
    localStorage 全量数据
    IndexedDB 数据
    API key
    model 名称
    provider 名称
    prompt
    reasoning_content
    rawResponse
    providerResponse

---

## 6. Route 安全闸门

新增：

    parseAndSanitizeContractReviewAiInput(value: unknown)

核心职责：

    unknown payload
    → exact-key allowlist 校验
    → forbidden key 递归扫描
    → 字段长度与数量限制
    → canonical risk rule 校验
    → canonical metadata 校验
    → canonical legal basis 校验
    → clauseId 与 clauseOrder 绑定校验
    → redactedClauseExcerpt 防御性二次脱敏
    → prompt boundary 转义
    → 重新构造 ContractReviewAiInput

Route guard 不原样透传客户端对象。

---

## 7. Canonical 数据源策略

Route guard 直接复用：

    contractRiskRules
    contractLegalBasisEntries
    contractReviewAiRiskMetadata
    redactContractClauseExcerpt()

不维护第二套：

    riskId
    riskLevel
    category
    ruleTitleZh
    whyItMattersZh
    legal basis
    redaction rules

因此客户端不能自由改写：

    riskLevel
    category
    ruleTitleZh
    riskSummaryZh
    whyItMattersZh
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

---

## 8. Clause ID 完整性

现有 clause segmentation 生成：

    clause-1
    clause-2
    clause-3
    ...

Route guard 要求：

    clauseId 必须匹配 /^clause-[1-9]\d*$/
    clauseId 必须等于 `clause-${clauseOrder}`

这可以阻止客户端把任意自然语言或伪指令塞入 clauseId。

---

## 9. 请求体与响应边界

Route：

    只接受 application/json
    使用 request.text()
    在 JSON.parse() 前限制请求体文本长度
    maxRequestBodyChars = 100000
    只导出 POST
    不导出 GET / PUT / PATCH / DELETE
    设置 Cache-Control: no-store

成功响应：

    ContractReviewExplanationOutput

失败响应：

    {
      error: string;
      code: string;
    }

错误提示保持：

    中文
    安全
    克制
    不回显输入
    不回显 prompt
    不回显条款片段
    不回显 DeepSeek 原始 content
    不回显 reasoning_content
    不回显 API key
    不回显 request body
    不回显 response body
    不回显 stack trace

---

## 10. reasoning_content 隔离

DeepSeek Thinking Mode 可能返回：

    content
    reasoning_content

HouseFolio 只读取：

    content

必须保持：

    provider 只返回 schema-validated ContractReviewExplanationOutput
    route 只序列化 provider final output
    route 不返回 provider 原始响应
    route 不返回 provider error 原始对象
    route 不记录 reasoning_content
    route 不新增 reasoning_content telemetry
    route 不新增调试回显字段

reasoning_content 不得进入：

    客户端
    UI state
    localStorage
    IndexedDB
    数据库
    日志
    analytics
    导出报告
    错误对象

---

## 11. Session-only 边界

当前 route：

    不持久化
    不保存合同历史
    不保存 AI 输出历史
    不保存 prompt
    不保存 reasoning_content
    不保存 request body
    不保存 response body
    不保存条款片段
    不保存多轮会话
    不新增 analytics payload

后续 UI 只保留页面会话级结果。

用户刷新页面后：

    AI 人话解释可以消失

---

## 12. Contract-check 覆盖范围

新增：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

覆盖：

    guard 返回新对象
    forbidden key 拒绝
    防御性二次脱敏
    prompt boundary 转义
    顶层额外字段拒绝
    findingCount 不一致拒绝
    findings 上限
    excerpt 单项上限
    excerpt 总量上限
    riskLevel 伪造拒绝
    category 伪造拒绝
    ruleTitleZh 伪造拒绝
    riskSummaryZh 伪造拒绝
    whyItMattersZh 伪造拒绝
    clauseId 非 canonical 拒绝
    clauseId 与 clauseOrder 不一致拒绝
    legal basis 缺失拒绝
    legal basis 标题伪造拒绝
    Content-Type 非 application/json 拒绝
    空请求体拒绝
    非法 JSON 拒绝
    请求体过长拒绝
    route forbidden key 拒绝
    Cache-Control: no-store

Provider 层已有独立 contract-check 覆盖：

    fixture fetcher
    Thinking Mode 请求参数
    reasoning_content 丢弃
    missing_configuration
    invalid_configuration
    rate_limited
    request_failed
    request_timeout
    invalid_response

---

## 13. Contract-check 诚实边界

当前项目没有引入：

    tsx
    ts-node
    vitest
    jest
    jiti
    其他 test runtime dependency

因此：

    npm.cmd run build 会执行 TypeScript 编译集成检查
    contract-check runner 不在 import 时自动执行
    本轮没有运行真实 DeepSeek
    本轮没有运行合法 payload 的 route 联网调用
    本轮没有声称 runtime assertions 已通过专门测试运行器执行

这是当前最克制、最安全的实现边界。

未来如需要统一运行多个 contract-check runner：

    应单独评审 testing infrastructure
    不应为了单个 runner 草率增加依赖
    不应把测试逻辑导入页面、组件或 API route

---

## 14. Phase 9L 明确未做

Phase 9L 没有做：

    UI
    用户主动确认弹窗
    脱敏摘要预览
    AI 输出展示
    localStorage
    IndexedDB
    persistence
    合同历史
    AI 历史
    导出报告
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

## 15. 下一步

Phase 9L 完整关闭后，不要继续横向扩张 API route 基础设施。

下一条主线应回到用户可见价值：

    用户主动确认 UI
    → 脱敏摘要预览
    → 用户主动确认发送
    → AI 人话风险解释展示
    → 高风险细讲、中低风险简讲
    → 签前追问
    → 建议补充条款方向
    → 可复制协商话术
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

核心判断标准始终是：

    普通租客能否在签约前更快识别合同雷点
    能否知道应该问什么
    能否知道哪些内容最好写进合同或补充协议
    能否获得清晰、克制、可操作的人话提示

---

## 16. 建议提交

建议 commit：

    docs: close contract review api route phase