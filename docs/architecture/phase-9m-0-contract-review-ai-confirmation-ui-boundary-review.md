# Phase 9M-0｜Contract Review AI Confirmation UI Boundary Review

## 0. 文档定位

本文档用于定义 HouseFolio 合同风险提示助手的 AI 联网确认 UI 边界。

本阶段名称：

    Phase 9M-0：Contract review AI confirmation UI boundary review

本阶段只做 docs-only 产品与交互边界评审。

本阶段不修改 `src`，不接 UI，不调用真实 DeepSeek，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`。

下一阶段在本文档确认后，再进入：

    Phase 9M-1：Contract review AI confirmation UI minimal implementation plan

---

## 1. 当前稳定基础

当前稳定点：

    6c7fbe2 docs: close contract review api route phase

当前已经完成：

    合同文本输入
    → 条款切分
    → 风险规则命中
    → 法规依据映射
    → structured review model
    → AI-safe 脱敏输入
    → DeepSeek explanation prompt
    → DeepSeek explanation provider
    → POST /api/ai/contract-review-explanation
    → route guard
    → API route contract-check
    → Phase 9L closing checkpoint

当前缺少：

    用户在联网前主动预览脱敏摘要
    用户主动确认发送
    用户取消发送
    用户返回修改
    AI 解释结果的页面级 session-only 展示

---

## 2. Phase 9M 的一句话目标

建立一个清晰、克制、可撤回的 AI 联网确认流程：

    用户本地完成合同风险规则分析
    → 预览即将发送给 AI 的脱敏摘要
    → 理解自动脱敏可能存在遗漏
    → 主动确认发送
    → 调用现有合同 review API route
    → 页面内展示 AI 人话解释
    → 用户可以清除本次 AI 结果

Phase 9M 不重新设计：

    风险规则库
    法规依据映射
    AI-safe input builder
    DeepSeek provider
    API route
    route guard

---

## 3. 核心产品原则

### 3.1 必须由用户主动确认

AI 联网调用必须由用户主动触发。

允许：

    用户点击“预览发送内容”
    → 打开确认区域或确认弹层
    → 用户阅读说明
    → 用户点击“确认并生成 AI 辅助解释”

禁止：

    粘贴合同后自动调用 AI
    条款切分后自动调用 AI
    风险命中后自动调用 AI
    页面加载后自动调用 AI
    后台静默调用 AI
    用户未确认时预加载 AI 请求
    用户未确认时批量发送

### 3.2 用户必须知道发送了什么

确认 UI 必须明确说明：

    只会发送命中风险规则的脱敏条款片段
    不会发送完整合同原文
    不会发送未命中条款
    不会发送本地房源档案
    不会发送 localStorage 全量数据
    不会发送 IndexedDB 全量数据
    不会发送合同照片
    不会发送 PDF
    不会发送 OCR 原始文本
    自动脱敏可能存在遗漏
    用户应在发送前预览并自行确认

### 3.3 AI 输出必须保持 session-only

AI 人话解释只保留在当前页面会话内。

允许：

    React state
    页面内临时状态
    用户主动清除本次 AI 结果
    用户主动重新生成

禁止：

    自动写 localStorage
    自动写 IndexedDB
    自动写数据库
    自动同步云端
    自动保存历史
    自动导出报告
    自动记录 prompt
    自动记录 reasoning_content
    自动记录 response body

---

## 4. 用户交互流程

推荐流程：

    Step 1：
    用户粘贴合同文本。

    Step 2：
    HouseFolio 在本地完成条款切分、风险规则命中和法规依据映射。

    Step 3：
    页面先展示本地规则结果。

    Step 4：
    用户点击“预览发送内容”。

    Step 5：
    页面调用本地 buildContractReviewAiInput()，
    生成即将发送给 AI 的 AI-safe payload。

    Step 6：
    页面展示脱敏摘要预览。

    Step 7：
    用户可以：
    - 返回修改
    - 取消发送
    - 确认并生成 AI 辅助解释

    Step 8：
    只有用户主动确认后，
    页面才调用：
    POST /api/ai/contract-review-explanation

    Step 9：
    页面展示 AI 人话解释。

    Step 10：
    用户可以清除本次 AI 结果。

---

## 5. 确认 UI 应展示什么

### 5.1 必须展示

确认 UI 至少展示：

    标题：
    发送前确认

    说明：
    HouseFolio 将把命中风险规则的脱敏条款片段发送给 AI，
    用于生成更易理解的风险说明、签约前追问和协商话术。

    风险项数量：
    findingCount

    每个风险项：
    风险等级
    风险标题
    条款顺序
    脱敏后的条款片段
    法规依据标题
    法规依据来源层级

    明确提示：
    自动脱敏可能存在遗漏，请在发送前确认摘要中没有不希望上传的信息。

    操作：
    返回修改
    取消发送
    确认并生成 AI 辅助解释

### 5.2 不需要默认展示

确认 UI 不需要默认展示：

    完整 JSON
    payloadVersion
    locale
    disclaimerMode
    riskId
    legalBasisId
    API route 地址
    provider 名称
    model 名称
    API key
    prompt
    system prompt
    reasoning_content

这些字段属于工程实现，不应干扰普通租客。

### 5.3 可选增强

后续如确有必要，可增加折叠区域：

    查看技术摘要

但第一版不建议增加。

原因：

    普通租客需要判断“哪些文字会上传”，
    而不是理解 JSON schema。

---

## 6. 确认 UI 文案策略

用户可见文案必须：

    中文优先
    清晰
    克制
    不恐吓
    不夸大
    不承诺完全脱敏
    不包装为 AI 律师
    不宣传零遗漏

推荐核心文案方向：

    AI 只会接收命中风险规则的脱敏条款片段，
    不会接收完整合同原文。

    自动脱敏可能存在遗漏。
    请在发送前确认摘要中没有不希望上传的信息。

    AI 解释仅用于辅助理解常见风险点，
    不构成正式法律意见。

后续用户可见文案应集中在：

    src/content/zh-cn.ts

不要将大量中文文案散落在 TSX 文件中。

---

## 7. 页面状态模型

Phase 9M 后续实现应明确区分以下状态：

    idle
    preview-ready
    submitting
    success
    safe-error
    canceled

### 7.1 idle

初始状态。

允许：

    用户查看本地规则结果
    用户点击“预览发送内容”

禁止：

    自动调用 AI

### 7.2 preview-ready

已经生成本地 AI-safe payload。

允许：

    展示脱敏摘要
    返回修改
    取消发送
    确认并发送

禁止：

    自动调用 AI
    自动保存 payload

### 7.3 submitting

用户已经主动确认，正在联网生成解释。

允许：

    显示 loading 状态
    禁止重复点击

建议：

    按钮显示“正在生成辅助解释…”

### 7.4 success

收到 schema-validated AI 输出。

允许：

    展示 AI 人话解释
    清除本次 AI 结果
    重新生成

禁止：

    自动写入持久化存储

### 7.5 safe-error

Route 返回安全错误。

允许：

    显示克制的中文错误提示
    允许用户稍后重试
    允许返回修改

禁止：

    显示 stack trace
    显示 provider 原始错误
    显示 DeepSeek 原始 content
    显示 reasoning_content

### 7.6 canceled

用户取消发送。

结果：

    不调用 API
    清空本地预览 payload
    保留本地规则结果
    返回合同风险提示页面

---

## 8. 发送前摘要边界

发送前摘要来源：

    buildContractReviewAiInput(reviewModel)

发送前摘要展示的数据必须来自：

    ContractReviewAiInput

不要重新从完整合同原文构造确认 UI。

不要绕开：

    AI-safe input builder

不要额外拼接：

    完整合同
    未命中条款
    用户身份信息
    房源档案
    本地存储内容

确认 UI 应展示：

    redactedClauseExcerpt

确认 UI 不应展示：

    原始 clause.text

---

## 9. 重新生成与清除边界

### 9.1 重新生成

允许用户主动重新生成。

重新生成时必须：

    再次展示发送前确认 UI
    再次由用户主动确认
    不复用上一次确认作为永久授权

### 9.2 清除本次 AI 结果

允许用户点击：

    清除本次 AI 结果

清除后：

    清空当前页面 AI 输出
    清空当前页面发送预览
    保留本地规则结果
    不影响用户粘贴的合同文本
    不影响本地条款切分结果

### 9.3 页面刷新

页面刷新后：

    AI 人话解释可以消失
    发送预览可以消失
    当前不要求恢复历史

---

## 10. 错误提示边界

Route 可能返回：

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

UI 应展示：

    error 字段中的安全中文提示

UI 不应展示：

    stack trace
    provider error object
    request body
    response body
    prompt
    DeepSeek 原始 content
    reasoning_content
    API key
    Authorization header

---

## 11. 视觉与 UX 原则

确认 UI 不应做成：

    开发者调试面板
    JSON viewer
    SaaS 后台弹窗
    法律恐吓页面
    复杂配置页

确认 UI 应保持：

    简约
    温馨
    可信赖
    生活化
    中文优先
    信息层级清楚
    操作按钮克制

视觉重点：

    “确认并生成 AI 辅助解释”
    应是清晰但不过度刺激的主操作。

    “返回修改”
    应易于发现。

    “取消发送”
    不应隐藏。

    “自动脱敏可能存在遗漏”
    应明确但不过度恐吓。

---

## 12. 组件边界候选

Phase 9M-1 再确认最终文件范围。

候选组件：

    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx

候选页面接入点：

    src/app/contract-review/page.tsx
    或现有合同 review client component

候选文案接入点：

    src/content/zh-cn.ts

Phase 9M-0 不提前决定：

    使用 modal
    使用 drawer
    使用 inline panel

建议 Phase 9M-1 结合现有 `/contract-review` 页面结构再决定。

---

## 13. 与 Codex 的边界

Phase 9M-0：

    网页版 ChatGPT 负责 docs-only 边界评审。

Phase 9M-1：

    网页版 ChatGPT 负责最小实现计划。

Phase 9M-2：

    可以交给 Codex 执行局部 UI 实现。

Codex 任务必须限制为：

    只修改确认 UI 所需页面、组件和 zh-cn 文案
    只调用现有 API route
    不修改 provider
    不修改规则库
    不修改法规依据
    不修改 route guard
    不修改环境变量
    不接 OCR
    不接 PDF
    不接合同照片
    不接 persistence
    不自动触发 AI
    不安装依赖
    npm.cmd run build
    汇报 git diff
    完成后停止

---

## 14. Phase 9M-0 非目标

Phase 9M-0 不做：

    UI 实现
    React component
    API route 修改
    route guard 修改
    provider 修改
    规则库修改
    法规依据修改
    prompt 修改
    用户确认弹窗实现
    AI 输出展示实现
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
    真实 DeepSeek 请求
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
    新增依赖

---

## 15. Phase 9M 推荐路线

推荐顺序：

    Phase 9M-0：
    Confirmation UI boundary review

    Phase 9M-1：
    Confirmation UI minimal implementation plan

    Phase 9M-2：
    Confirmation UI minimal implementation

    Phase 9M-3：
    Confirmation UI contract-check and regression

    Phase 9M-4：
    Confirmation UI closing checkpoint

Phase 9M 完成后，再进入：

    AI 人话风险解释展示强化
    → 报告导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

---

## 16. Phase 9M-0 验收标准

Phase 9M-0 完成标准：

    只新增：
    docs/architecture/phase-9m-0-contract-review-ai-confirmation-ui-boundary-review.md

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

    docs: review contract ai confirmation ui boundary

---

## 17. 最终结论

HouseFolio 合同风险提示助手的 AI 联网确认 UI 必须是：

    用户可理解
    用户可预览
    用户可取消
    用户可返回修改
    用户主动确认
    session-only
    不自动触发 AI
    不承诺完全脱敏
    不包装为 AI 律师

正确的数据流是：

    本地规则结果
    → buildContractReviewAiInput()
    → 脱敏摘要预览
    → 用户主动确认
    → POST /api/ai/contract-review-explanation
    → session-only AI 人话解释