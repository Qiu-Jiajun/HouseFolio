# Phase 9M-1｜Contract Review AI Confirmation UI Minimal Implementation Plan

## 0. 文档定位

本文档用于规划 HouseFolio 合同风险提示助手的 AI 联网确认 UI 最小实现。

本阶段名称：

    Phase 9M-1：Contract review AI confirmation UI minimal implementation plan

本阶段只写 docs-only 实现计划。

本阶段不修改 `src`，不调用真实 DeepSeek，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`，不新增依赖。

本文档确认后，再进入：

    Phase 9M-2：Contract review AI confirmation UI minimal implementation

Phase 9M-2 可以交给 Codex 执行局部 UI 实现，但必须严格遵守本文档文件范围与边界。

---

## 1. 当前稳定基础

当前稳定点：

    100226b docs: review contract ai confirmation ui boundary

当前已经完成：

    合同文本输入
    → 条款切分
    → 风险规则
    → 法规依据映射
    → structured review model
    → AI-safe 脱敏输入
    → DeepSeek explanation provider
    → POST /api/ai/contract-review-explanation
    → route guard
    → route contract-check
    → confirmation UI boundary review

---

## 2. 当前 UI 真实结构

当前：

    src/app/contract-review/page.tsx

已经接入：

    src/components/contract-review-panel.tsx

当前 `ContractReviewPanel` 是 client component。

现有状态：

    contractText

现有派生数据：

    segments =
      segmentContractClauses(contractText)

现有页面能力：

    粘贴合同文本
    清空当前文本
    本地条款切分
    条款片段数量
    条款片段预览
    页面会话级处理说明

当前尚未接入：

    risk matcher
    legal basis resolver
    buildContractReviewModel()
    buildContractReviewAiInput()
    本地风险结果
    脱敏摘要预览
    用户主动确认发送
    AI route fetch
    AI 人话解释
    清除本次 AI 结果
    重新生成

---

## 3. Phase 9M-2 的一句话目标

在现有 `ContractReviewPanel` 内完成最小用户可见闭环：

    合同文本
    → 本地条款切分
    → 本地规则匹配
    → 本地法规依据映射
    → 本地 review model
    → AI-safe 脱敏摘要
    → 用户预览
    → 用户主动确认
    → 调用现有合同 review API route
    → session-only AI 人话解释
    → 用户可以清除或重新生成

---

## 4. 重要修正：确认 UI 不能孤立实现

Phase 9M-2 不能只增加一个确认弹层或确认按钮。

原因：

    当前 ContractReviewPanel 只生成 segments。
    确认 UI 需要展示 ContractReviewAiInput。
    ContractReviewAiInput 必须来自 buildContractReviewAiInput(reviewModel)。
    reviewModel 必须来自本地规则匹配和法规依据映射。

因此，Phase 9M-2 必须在 UI orchestration 层接通已有本地模块。

但是：

    不得修改算法模块。
    不得修改规则库。
    不得修改法规依据表。
    不得复制 matcher 逻辑。
    不得复制 resolver 逻辑。
    不得在组件中自行重新实现脱敏。

正确方式：

    import 已有 lib/* 模块
    → 在 client component 内组合调用
    → 将派生数据用于 UI 展示与联网确认

---

## 5. Phase 9M-2 实现前只读检查

Phase 9M-2 写代码前，必须先只读确认：

    src/lib/contract/risk-matcher.ts
    src/lib/contract/legal-basis-resolver.ts
    src/lib/contract/review-model.ts
    src/lib/contract/ai-safe-input.ts

需要确认：

    1. matcher 的准确导出函数名与参数；
    2. resolver 的准确导出函数名与参数；
    3. buildContractReviewModel() 的准确输入；
    4. buildContractReviewAiInput() 的准确输入；
    5. 是否可以完全复用现有类型；
    6. 是否可以保持算法模块零修改；
    7. 是否可以保持法规依据模块零修改；
    8. 是否可以保持 route 与 provider 零修改。

任何签名不清楚时：

    停止实现。
    不猜函数名。
    不复制算法代码。
    不扩大文件范围。
    先返回评审。

---

## 6. 推荐的数据流

Phase 9M-2 推荐数据流：

    contractText
    → segmentContractClauses(contractText)
    → existing risk matcher
    → existing legal basis resolver
    → buildContractReviewModel({
         clauses,
         findings,
         resolvedLegalBasisEntries
       })
    → buildContractReviewAiInput(reviewModel)
    → aiPreviewInput
    → JSON.stringify(aiPreviewInput)
    → POST /api/ai/contract-review-explanation
    → ContractReviewExplanationOutput
    → React state only

必须保持：

    完整合同原文只在浏览器页面状态中处理。
    AI route 只接收 ContractReviewAiInput。
    不直接发送 contractText。
    不直接发送原始 clause.text。
    不绕开 buildContractReviewAiInput()。
    不绕开服务端 route guard。

---

## 7. 推荐文件范围

### 7.1 修改

推荐只修改：

    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts

### 7.2 新增

推荐新增：

    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx

### 7.3 默认不修改

默认不修改：

    src/app/contract-review/page.tsx
    src/lib/contract/clause-segmentation.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/legal-basis.ts
    src/lib/contract/legal-basis-resolver.ts
    src/lib/contract/review-model.ts
    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/app/api/ai/contract-review-explanation/route.ts
    src/types/ai-contract-review-explanation.ts
    `.env.local`
    `.env.example`
    README.md
    package.json
    package-lock.json

如果 Phase 9M-2 实现时确实必须修改默认不修改文件：

    停止。
    汇报原因。
    返回边界评审。
    不自行扩张 scope。

---

## 8. ContractReviewPanel 的职责

`ContractReviewPanel` 继续作为页面 orchestration owner。

建议新增派生数据：

    segments
    findings
    resolvedLegalBasisEntries
    reviewModel

建议新增页面级临时状态：

    aiPreviewInput
    aiStatus
    aiOutput
    aiError
    aiConfirmationVisible

推荐类型方向：

    aiPreviewInput:
      ContractReviewAiInput | null

    aiStatus:
      "idle"
      | "preview-ready"
      | "submitting"
      | "success"
      | "safe-error"

    aiOutput:
      ContractReviewExplanationOutput | null

    aiError:
      string | null

    aiConfirmationVisible:
      boolean

所有状态只保存在 React state。

不得写入：

    localStorage
    IndexedDB
    database
    analytics
    URL query
    cookie

---

## 9. 本地风险结果必须先展示

AI 不是第一层输出。

用户粘贴合同后，页面应先展示：

    本地条款切分结果
    本地规则命中数量
    本地风险项摘要
    风险等级
    风险标题
    对应条款顺序
    法规依据标题

然后才允许用户：

    预览发送给 AI 的内容

不得做成：

    粘贴合同
    → 直接生成 AI 结果

本地规则结果是：

    L2 结构化提示

AI 人话解释是：

    L3 辅助解释

风险等级仍然来自 HouseFolio 规则库，不来自 DeepSeek。

---

## 10. 无风险命中状态

Route guard 要求：

    findingCount > 0

因此，当本地规则没有命中时：

    不生成 AI-safe payload
    不展示确认发送按钮
    不调用 API route

页面应展示克制提示：

    当前没有识别到适合发送给 AI 进一步解释的常见风险项。
    这不代表合同没有风险，也不代表可以直接签署。
    建议继续人工逐条核对，必要时咨询专业人士。

禁止宣传：

    未发现风险
    合同安全
    可以放心签约
    已通过 AI 审查

---

## 11. 发送前确认 UI

推荐新增：

    src/components/contract-review-ai-confirmation-panel.tsx

第一版建议使用：

    inline panel

不建议第一版新增：

    modal dependency
    drawer dependency
    portal
    第三方 Dialog 库

原因：

    当前页面已经是双栏式本地预览结构。
    inline panel 更容易让用户停留阅读。
    inline panel 更容易展示多个脱敏风险片段。
    inline panel 不需要新增依赖。
    inline panel 更符合本地优先与克制风格。

确认 panel 必须展示：

    标题：
    发送前确认

    说明：
    只会发送命中风险规则的脱敏条款片段。
    不会发送完整合同原文。
    自动脱敏可能存在遗漏。
    请在发送前自行确认摘要。

    风险项数量：
    findingCount

    每个风险项：
    riskLevel
    ruleTitleZh
    clause.clauseOrder
    clause.redactedClauseExcerpt
    legalBases[].legalBasisTitleZh
    legalBases[].legalBasisSourceType

    操作：
    返回修改
    暂不发送
    确认并生成 AI 辅助解释

确认 panel 不展示：

    完整 JSON
    payloadVersion
    locale
    disclaimerMode
    riskId
    legalBasisId
    API route
    provider
    model
    prompt
    system prompt
    reasoning_content
    API key

---

## 12. 预览生成边界

用户点击：

    预览发送内容

之后才调用：

    buildContractReviewAiInput(reviewModel)

然后：

    setAiPreviewInput(...)
    setAiConfirmationVisible(true)

此时：

    不调用 fetch
    不调用 DeepSeek
    不保存 payload
    不写日志

用户只有点击：

    确认并生成 AI 辅助解释

之后才允许：

    fetch("/api/ai/contract-review-explanation", ...)

---

## 13. 文本变化必须使旧状态失效

任何合同文本变化，包括：

    用户输入
    用户删除
    用户粘贴新文本
    用户点击清空当前文本

都必须清除：

    aiPreviewInput
    aiOutput
    aiError
    aiConfirmationVisible

原因：

    旧预览不能对应新合同。
    旧 AI 输出不能继续显示为新合同解释。
    上一次用户确认不能视为永久授权。

建议封装：

    clearAiSessionState()

并在：

    handleContractTextChange()
    handleClearContractText()
    handleClearAiOutput()

中复用。

---

## 14. 发送与错误处理

确认后调用：

    POST /api/ai/contract-review-explanation

请求：

    Content-Type: application/json; charset=utf-8
    body: JSON.stringify(aiPreviewInput)

成功：

    setAiOutput(output)
    setAiStatus("success")
    setAiConfirmationVisible(false)

失败：

    尝试读取安全 JSON：
    {
      error: string;
      code: string;
    }

UI 只展示：

    error

如果响应不是预期安全结构：

    展示统一中文错误提示

UI 不展示：

    code 调试详情
    stack trace
    request body
    response body
    provider error object
    prompt
    DeepSeek 原始 content
    reasoning_content
    API key
    Authorization header

---

## 15. AI 输出展示

推荐新增：

    src/components/contract-review-ai-explanation-panel.tsx

第一版展示：

    summaryZh
    disclaimerZh

    findingExplanations[]:
      riskLevel
      titleZh
      explanationZh
      legalBasisNotesZh
      preSigningQuestionsZh
      suggestedClauseDirectionsZh
      negotiationScriptZh
      needsFurtherConfirmation

视觉策略：

    高风险优先展开
    中低风险保持清晰但不过度抢眼
    重点是可读与可操作
    不做开发者 JSON viewer
    不做复杂 dashboard
    不做法律恐吓页面

Phase 9M-2 第一版可以先采用简单卡片列表。

Phase 9N 再做更细致的：

    高风险细讲
    中低风险折叠摘要
    复制协商话术
    视觉层级强化
    移动端细化

---

## 16. 清除与重新生成

### 16.1 清除本次 AI 结果

用户点击：

    清除本次 AI 结果

应清除：

    aiOutput
    aiPreviewInput
    aiError
    aiConfirmationVisible

保留：

    contractText
    segments
    findings
    reviewModel
    本地规则结果

### 16.2 重新生成

用户点击：

    重新生成

必须：

    重新构造最新 AI-safe payload
    再次展示发送前确认 panel
    再次要求用户主动确认

禁止：

    复用上一次确认
    自动重新请求
    后台静默重新请求

---

## 17. 中文文案集中管理

用户可见文案继续集中在：

    src/content/zh-cn.ts

建议扩展：

    contractReviewCopy.localRisk
    contractReviewCopy.aiPreview
    contractReviewCopy.aiActions
    contractReviewCopy.aiStates
    contractReviewCopy.aiOutput

不要将大量用户可见中文散落在 TSX 文件中。

文案必须保持：

    中文优先
    克制
    易懂
    不夸大
    不承诺完全脱敏
    不承诺零遗漏
    不包装为 AI 律师
    不做法律结论

---

## 18. 视觉策略

Phase 9M-2 应延续当前合同页面：

    奶油白
    温馨白
    柔和浅绿
    淡蓝辅助色
    大圆角
    低压感
    生活化
    可信赖

不要改成：

    SaaS dashboard
    开发者调试控制台
    JSON 面板
    高饱和警报页
    黑红法律恐吓页

按钮层级：

    主操作：
    确认并生成 AI 辅助解释

    次操作：
    预览发送内容
    返回修改
    重新生成

    弱操作：
    暂不发送
    清除本次 AI 结果

---

## 19. Phase 9M-2 推荐实现顺序

推荐顺序：

    Step 1：
    只读检查 matcher 与 resolver 准确导出。

    Step 2：
    修改 src/content/zh-cn.ts，
    增加 confirmation UI 与 output UI 文案。

    Step 3：
    新增：
    src/components/contract-review-ai-confirmation-panel.tsx

    Step 4：
    新增：
    src/components/contract-review-ai-explanation-panel.tsx

    Step 5：
    修改：
    src/components/contract-review-panel.tsx

    接通：
    segments
    → matcher
    → resolver
    → reviewModel
    → ai-safe input preview
    → confirmation
    → fetch
    → session-only output

    Step 6：
    Node UTF-8 检查中文文案。

    Step 7：
    npm.cmd run build。

    Step 8：
    git diff --stat。

    Step 9：
    git status。

    Step 10：
    扫描：
    localStorage
    indexedDB
    reasoning_content
    rawResponse
    providerResponse
    process.env
    console.log
    console.error

    Step 11：
    汇报 diff。
    停止。
    不直接 commit。

---

## 20. Phase 9M-2 Codex 任务边界

Phase 9M-2 适合交给 Codex。

Codex 只允许：

    读取现有仓库
    只读确认 matcher 与 resolver 导出
    修改 src/content/zh-cn.ts
    修改 src/components/contract-review-panel.tsx
    新增 src/components/contract-review-ai-confirmation-panel.tsx
    新增 src/components/contract-review-ai-explanation-panel.tsx
    运行 npm.cmd run build
    运行 git diff --stat
    运行 git status
    汇报改动
    完成后停止

Codex 不允许：

    自动 commit
    自动 push
    修改 API route
    修改 route guard
    修改 provider
    修改 prompt
    修改算法模块
    修改规则库
    修改法规依据
    修改 `.env.local`
    修改 `.env.example`
    修改 README
    修改 package.json
    修改 package-lock.json
    安装依赖
    运行真实 DeepSeek 请求
    接 OCR
    接 PDF
    接合同照片
    接 persistence
    接 Supabase
    开始 Chrome 插件工程

---

## 21. Phase 9M-2 验收标准

Phase 9M-2 完成标准：

    只修改：
    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts

    只新增：
    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx

    不修改 lib/*
    不修改 API route
    不修改 route guard
    不修改 provider
    不修改 prompt
    不修改 `.env.local`
    不修改 `.env.example`
    不修改 README
    不修改 package.json
    不修改 package-lock.json
    不安装依赖
    不运行真实 DeepSeek
    不自动触发 AI
    不新增 persistence
    不写 localStorage
    不写 IndexedDB
    npm.cmd run build 通过
    git status 只显示预期四个文件

建议 commit：

    feat: add contract review ai confirmation ui

---

## 22. Phase 9M-3 预留

Phase 9M-3 用于：

    confirmation UI contract-check
    source boundary scan
    UTF-8 文案检查
    session-only 检查
    no-auto-fetch 检查
    input-change invalidation 检查
    build 回归
    浏览器人工回归准备

候选新增文件：

    src/components/contract-review-ai-confirmation-panel-contract-check.ts

具体是否需要新增 contract-check 文件：

    Phase 9M-3 再评审。
    不在 Phase 9M-2 顺手增加。

---

## 23. Phase 9M-4 预留

Phase 9M-4 用于：

    docs closing checkpoint
    git status clean
    build 回归
    push origin/main
    git ls-remote 真实远端校验
    Phase 9M 收口

---

## 24. Phase 9M-1 非目标

Phase 9M-1 不做：

    UI 实现
    React component
    src 修改
    API route 修改
    route guard 修改
    provider 修改
    prompt 修改
    matcher 修改
    resolver 修改
    规则库修改
    法规依据修改
    localStorage
    IndexedDB
    persistence
    合同历史
    AI 历史
    导出报告
    `.env.local` 修改
    `.env.example` 修改
    README 修改
    package.json 修改
    package-lock.json 修改
    新增依赖
    真实 DeepSeek 请求
    OCR
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页
    RAG
    全国法规自动适配
    司法案例检索
    自动投诉
    自动起诉
    自动索赔
    Chrome 插件
    Supabase

---

## 25. Phase 9M-1 验收标准

Phase 9M-1 完成标准：

    只新增：
    docs/architecture/phase-9m-1-contract-review-ai-confirmation-ui-minimal-implementation-plan.md

    不修改 src
    不修改 `.env.local`
    不修改 `.env.example`
    不修改 README
    不修改 package.json
    不修改 package-lock.json
    不运行真实 DeepSeek
    npm.cmd run build 通过
    git status 只显示新增 docs 文件

建议 commit：

    docs: plan contract ai confirmation ui

---

## 26. 最终结论

Phase 9M-2 不是孤立新增一个确认按钮。

正确闭环是：

    本地合同文本
    → 本地条款切分
    → 本地规则匹配
    → 本地法规依据映射
    → 本地 review model
    → 本地 AI-safe 脱敏摘要
    → 用户预览
    → 用户主动确认
    → 现有 API route
    → session-only AI 人话解释

所有联网调用必须：

    用户主动确认
    可取消
    可返回修改
    不自动触发
    不持久化
    不承诺完全脱敏
    不包装为 AI 律师