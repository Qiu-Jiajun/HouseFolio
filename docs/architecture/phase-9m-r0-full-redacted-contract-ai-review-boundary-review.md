# Phase 9M-R0｜Full-Redacted-Contract AI Review Boundary Review

## 0. 文档定位

本文档用于重新校准 HouseFolio 合同风险提示助手的 AI 审读边界。

本阶段名称：

    Phase 9M-R0：
    Full-redacted-contract AI review boundary review

本阶段只做 docs-only 架构修正评审。

本阶段不恢复 Phase 9M-2 stash，不修改 `src`，不调用真实 DeepSeek，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`，不新增依赖。

本文档确认后，再进入：

    Phase 9M-R1：
    Full-redacted-contract payload and schema redesign plan

---

## 1. 为什么需要插入 Phase 9M-R

Phase 9M-2 已经完成一个有价值的 UI 原型。

该原型证明以下能力可行：

    用户主动触发
    发送前确认
    取消发送
    返回修改
    session-only AI 输出
    文本变化后旧状态失效
    清除本次 AI 结果
    重新生成时再次确认
    AI 结果卡片展示
    中文文案集中管理

但该原型也暴露了一个产品层面的核心问题：

    规则命中片段不应成为 AI 审读范围的入口闸门。

旧流程是：

    合同原文
    → 本地条款切分
    → 本地规则命中
    → 只脱敏并上传规则命中的条款片段
    → AI 只对局部片段生成解释

该流程适合验证安全链路，但不适合作为正式用户体验。

---

## 2. 旧流程的结构性问题

### 2.1 规则漏报会变成 AI 盲区

当一条有风险的合同条款没有触发 HouseFolio 的本地规则时：

    该条款不会被上传
    AI 无法看到该条款
    AI 无法补充识别
    用户可能误以为系统已经完整审读合同

这会放大规则库覆盖不足的问题。

### 2.2 规则误报缺少合同上下文

某些条款可能因为关键词或结构命中规则。

但是：

    前文定义
    后文限定
    例外条款
    补充约定
    权利义务组合
    责任范围边界

都可能改变条款的真实含义。

如果 AI 只看到命中片段，就无法结合完整上下文做克制解释。

### 2.3 用户体验不自然

普通租客的直觉是：

    我把合同交给系统
    → 系统帮我完整看一遍
    → 告诉我需要重点确认什么

普通租客不应被要求理解：

    哪些条款先由规则筛选
    哪些条款没有被上传
    为什么某些片段可以发送
    为什么另一些片段被排除

HouseFolio 的目标是降低找房和签约前检查的复杂度，而不是创造新的学习成本。

---

## 3. 新的主流程

新流程应调整为：

    用户粘贴完整合同文本
    → 浏览器本地切分全部条款
    → 浏览器本地自动脱敏全部条款
    → 本地规则扫描全部条款
    → 本地规则生成辅助 signals
    → 用户查看完整脱敏合同预览
    → 用户一次主动确认
    → 上传完整脱敏合同 + 规则 signals
    → AI 结合全文上下文统一审读
    → 展示规则提示 + AI 补充关注项

核心变化：

    本地规则从 gate 改为 signal。

也就是说：

    规则层继续识别已知风险
    规则层继续决定规则风险等级
    规则层继续映射法规依据

但是：

    规则层不再决定 AI 可以看到哪些条款
    规则未命中不再阻止 AI 审读
    规则信号允许为空
    AI 仍然可以审读完整脱敏合同

---

## 4. 产品体验原则：内部严格，外部简单

HouseFolio 的安全机制应尽可能沉到系统内部。

用户看到的流程应尽可能接近：

    粘贴合同
    → 点击“开始辅助审查”
    → 查看完整脱敏合同预览
    → 点击“确认上传并开始审查”
    → 查看统一结果

用户只需要完成一个关键判断：

    这份脱敏后的合同文本，是否可以发送用于辅助审查？

第一版不应增加：

    逐条勾选风险条款
    逐条决定是否上传
    多层弹窗
    复杂隐私设置
    技术 JSON 预览
    法规依据逐项确认
    手动合同分块
    provider 选择
    模型选择
    prompt 配置

安全能力应由系统自动完成：

    本地自动脱敏
    服务端防御性二次脱敏
    条款切分
    规则扫描
    法规映射
    payload 构造
    schema 校验
    请求体大小限制
    reasoning_content 隔离
    no-store
    session-only

判断标准：

    不为了降低风险而让产品操作显著复杂化。
    不把系统内部责任转嫁给普通租客。
    不要求用户理解工程实现细节。
    只保留真正必要的一次发送前确认。

---

## 5. L1 / L2 / L3 职责重新校准

### 5.1 L1：输入、切分与脱敏

L1 负责：

    接收用户主动粘贴的合同文本
    规范化文本
    切分全部条款
    为全部条款标记顺序
    对全部条款执行本地自动脱敏
    生成完整脱敏合同预览

L1 不负责：

    风险判断
    法律结论
    DeepSeek 解释
    自动保存合同原文
    自动上传合同原文

### 5.2 L2：规则信号与法规依据

L2 负责：

    扫描全部条款
    命中已知风险规则
    生成 ruleSignals
    决定规则风险等级
    映射法规依据
    为 AI 提供辅助线索
    为用户提供确定性规则提示

L2 不负责：

    限制 AI 只能看到命中条款
    宣称未命中即安全
    判定合同有效或无效
    判定条款合法或违法
    替用户决定是否签约

### 5.3 L3：AI 全文上下文审读

L3 负责：

    阅读完整脱敏合同文本
    结合规则 signals 理解上下文
    解释规则命中项
    识别跨条款关系
    提示可能存在的歧义
    提示可能缺失的重要约定
    生成签前追问
    生成建议补充条款方向
    生成可复制协商话术
    输出 AI 补充关注项

L3 不负责：

    决定 HouseFolio 规则风险等级
    输出正式法律意见
    判定违法
    判定无效
    预测诉讼结果
    保证无遗漏
    替用户决定能否签约

---

## 6. 新的 AI-safe payload 方向

Phase 9M-R1 再锁定最终 TypeScript 类型。

本阶段只确认结构方向。

建议新 payload：

    payloadVersion:
      "contract-review-full-redacted-v1"

    locale:
      "zh-CN"

    reviewMode:
      "full-redacted-contract"

    redactedClauses:
      全部脱敏后的条款

    ruleSignals:
      本地规则命中结果

其中：

    redactedClauses 不可为空
    ruleSignals 可以为空

推荐结构方向：

    ContractReviewFullRedactedAiInput {
      payloadVersion
      locale
      reviewMode
      redactedClauses[]
      ruleSignals[]
    }

每个 redactedClause 至少包含：

    clauseId
    clauseOrder
    redactedClauseText

每个 ruleSignal 至少包含：

    riskId
    riskLevel
    category
    clauseId
    ruleTitleZh
    whyItMattersZh
    legalBases[]

关键边界：

    AI 接收完整脱敏条款
    AI 不接收原始合同全文
    AI 不接收原始 clause.text
    AI 不接收身份证、手机号、银行卡号等未脱敏信息
    AI 不接收本地房源资料
    AI 不接收 localStorage 或 IndexedDB 内容
    AI 不接收合同照片
    AI 不接收 PDF
    AI 不接收 OCR 原始文本
    AI 不接收 reasoning_content

---

## 7. 服务端二次防线

即使浏览器已经执行本地脱敏，服务端仍然必须执行防御性处理。

服务端应继续：

    校验 Content-Type
    先读取 request.text()
    限制请求体大小
    再 JSON.parse()
    exact-key 校验
    forbidden recursive scan
    条款数量上限
    单条字符上限
    总字符上限
    clauseId 与 clauseOrder 绑定
    ruleSignal canonical 校验
    legal basis canonical 校验
    服务端防御性二次脱敏
    只重建可信 payload
    调用 provider
    返回安全错误
    Cache-Control: no-store

服务端不得：

    原样信任客户端 payload
    原样转发未经重建的数据
    输出 raw response
    输出 provider response
    输出 reasoning_content
    输出 stack trace
    保存合同文本
    保存 prompt
    保存 AI 输出
    写日志记录合同内容

---

## 8. 结果展示需要分层

新结果不应把所有内容混成一个列表。

### 8.1 规则提示

规则提示来自 HouseFolio L2 规则库。

可以展示：

    风险等级
    风险标题
    对应条款
    为什么值得关注
    法规依据
    AI 上下文解释
    签前追问
    建议补充条款方向
    协商话术

规则提示中的风险等级来自：

    HouseFolio 规则库

不得来自：

    DeepSeek

### 8.2 AI 补充关注项

AI 阅读完整脱敏合同后，可以补充：

    跨条款冲突
    责任范围模糊
    退款时限缺失
    重要事项未写清楚
    权利义务不对称
    多个条款组合后的额外成本
    需要人工进一步确认的信息

AI 补充项必须明确标记：

    AI 补充关注
    需要进一步确认
    暂未完成规则映射
    不构成法律结论

AI 补充项不得获得 HouseFolio 的正式 riskLevel。

建议使用更克制的 attentionType：

    建议重点核对
    信息不足
    存在歧义
    建议补充约定

---

## 9. Prompt 边界

后续 Prompt 必须明确告诉 DeepSeek：

    你正在协助普通中国大陆租客理解租房合同。
    输入包含完整脱敏合同条款与本地规则 signals。
    规则 signals 是辅助线索，不是完整风险列表。
    规则 signals 可能存在误报。
    未被规则命中的条款也必须结合上下文审读。
    不得因为未命中规则而忽略条款。
    不得输出法律结论。
    不得判断条款必然违法、无效或一定可撤销。
    不得预测投诉、仲裁或诉讼结果。
    不得承诺无遗漏。
    只输出结构化、克制、可操作的人话提示。

DeepSeek thinking mode 可以使用。

但：

    reasoning_content 不展示
    reasoning_content 不保存
    reasoning_content 不导出
    reasoning_content 不写日志
    reasoning_content 不进入 UI

---

## 10. 长合同边界

全文脱敏审读必须预留长合同处理能力。

第一版应先定义：

    最大条款数量
    单条最大字符数
    脱敏合同总字符上限
    请求体总大小上限

第一版可以采用：

    在安全上限内：
    一次性发送全部脱敏条款

    超过安全上限：
    显示简洁提示
    不自动发送
    不要求用户理解技术限制
    引导用户删除无关附件或稍后使用分段审读能力

后续可以扩展：

    系统自动分块
    → 分块审读
    → 全局整合

但第一版不做：

    手动逐块粘贴
    用户自己切分合同
    多轮复杂向导
    并行任务系统
    后台任务队列

自动分块是系统责任，不应转嫁给用户。

---

## 11. UI 交互边界

第一版推荐：

    用户粘贴合同
    → 页面本地自动处理
    → 用户点击“开始辅助审查”
    → 页面展示完整脱敏合同预览
    → 用户可以返回修改或取消
    → 用户点击“确认上传并开始审查”
    → 页面展示统一结果

必须保留：

    自动脱敏可能存在遗漏提示
    用户发送前完整预览
    返回修改
    取消
    一次主动确认
    session-only
    文本变化后旧状态失效
    清除本次 AI 结果
    重新生成时再次确认

不应增加：

    逐项确认
    逐项勾选
    多层确认
    技术 JSON
    复杂设置
    用户手动选择规则
    用户手动选择法规依据
    用户手动拆分合同

---

## 12. Phase 9M-2 WIP 的处理

当前 Phase 9M-2 UI 原型已保存到：

    stash@{0}:
    wip: phase 9m-2 matched-findings confirmation ui

该 stash 中包含：

    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts
    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx

不要现在恢复 stash。

后续 Phase 9M-R5 再恢复并创造性嫁接。

可以原样继承：

    confirmation panel 结构
    explanation panel 结构
    用户主动确认后才 fetch
    cancel
    return modify
    clearAiSessionState()
    文本变化后旧状态失效
    session-only React state
    清除本次 AI 结果
    重新生成再次确认
    中文文案中心
    页面视觉方向

需要替换：

    只预览规则命中片段
    → 完整脱敏合同预览

    无规则命中时禁止 AI 审查
    → 无规则命中时仍允许全文辅助审查

    规则命中项决定上传范围
    → 规则命中项只作为辅助 signals

---

## 13. 可以原样保留的既有模块

可以原样保留：

    src/lib/contract/clause-segmentation.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/risk-matcher.ts
    src/lib/contract/legal-basis.ts
    src/lib/contract/legal-basis-resolver.ts
    src/lib/contract/review-model.ts
    POST /api/ai/contract-review-explanation endpoint path
    route 的 Content-Type 检查
    route 的 request.text() + JSON.parse()
    route 的请求体大小限制
    route 的 no-store
    provider 的 HTTP 传输能力
    provider 的 timeout
    provider 的安全错误映射
    provider 的 reasoning_content 隔离
    中文文案中心
    当前 UI 视觉方向

---

## 14. 必须修改的既有模块

后续需要修改：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-contract-check.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/types/ai-contract-review-explanation.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    相关 contract-check
    src/app/api/ai/contract-review-explanation/route-contract-check.ts
    Phase 9M-2 WIP UI 适配

是否需要修改：

    src/app/api/ai/contract-review-explanation/route.ts

应在 Phase 9M-R1 精确评审。

原则：

    可以复用现有 route
    优先不新增 endpoint
    不轻易扩大 surface area

---

## 15. 明确非目标

Phase 9M-R 第一版不做：

    OCR
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页
    RAG
    全国法规自动适配
    司法案例检索
    律师复核
    自动投诉
    自动起诉
    自动索赔
    诉讼策略
    胜诉概率
    Supabase
    Chrome 插件
    合同历史
    AI 历史
    数据库
    云同步
    自动持久化
    自动导出报告
    手动合同分块
    后台任务队列
    新增依赖
    修改 `.env.local`
    修改 `.env.example`
    修改 README
    修改 package.json
    修改 package-lock.json
    真实 DeepSeek 请求

---

## 16. Phase 9M-R 推荐路线

推荐顺序：

    Phase 9M-R0：
    Full-redacted-contract AI review boundary review

    Phase 9M-R1：
    Full-redacted-contract payload and schema redesign plan

    Phase 9M-R2：
    Full-redacted-contract AI-safe builder implementation

    Phase 9M-R3：
    Prompt, output schema and provider adaptation

    Phase 9M-R4：
    Route guard adaptation

    Phase 9M-R5：
    UI WIP recovery and creative integration

    Phase 9M-R6：
    Browser regression and closing checkpoint

Codex 可以在 Phase 9M-R2 之后参与局部工程执行。

但必须继续使用有限自治：

    可以读取
    可以修改批准范围内文件
    可以 build
    可以静态扫描
    可以在批准范围内修复
    不得扩大 scope
    不得 commit
    不得 push
    不得安装依赖
    不得修改环境变量
    不得运行真实 DeepSeek

---

## 17. Phase 9M-R0 验收标准

本阶段只新增：

    docs/architecture/phase-9m-r0-full-redacted-contract-ai-review-boundary-review.md

不得修改：

    src
    `.env.local`
    `.env.example`
    README
    package.json
    package-lock.json
    stash@{0}

不得执行：

    git stash apply
    git stash pop
    真实 DeepSeek 请求
    OCR
    PDF
    合同照片
    RAG
    persistence

必须确认：

    npm.cmd run build 通过
    git status 只显示新增 docs 文件
    stash@{0} 仍然存在
    UTF-8 无 BOM

建议 commit：

    docs: review full redacted contract ai boundary

---

## 18. 最终结论

HouseFolio 合同风险提示助手的新主线是：

    完整合同本地自动脱敏
    → 一次完整预览
    → 一次主动确认
    → 上传完整脱敏合同 + 规则 signals
    → AI 全文上下文审读
    → 规则提示 + AI 补充关注项
    → session-only 统一结果

核心产品原则：

    内部严格
    外部简单

    安全机制沉入系统
    必要确认保持最少
    不把复杂度转嫁给用户
    不让风险控制破坏产品直觉