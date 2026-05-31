# HouseFolio Phase 9M-R5｜全文脱敏合同风险提示 UI 最小嫁接边界评审

## 0. 文档用途

本文档是 Phase 9M-R5-1 的 docs-only UI integration boundary review。

本阶段不修改任何 `src` 文件，不恢复 stash，不启动浏览器回归，不运行真实 DeepSeek 请求。

本文档只回答一个问题：

    在不扩大产品与工程 scope 的前提下，
    如何把 Phase 9M 的 legacy matched-findings UI WIP
    最小嫁接到 Phase 9M-R 已完成的 full-redacted 服务端链路。

后续只有在本文档完成审阅、提交、push、fetch 与真实远端校验后，才允许进入 Phase 9M-R5-2。

---

## 1. 当前稳定点与前置条件

当前受保护远端稳定点：

    e1286e3 feat: add contract review route additive dispatch

完整 hash：

    e1286e39e7aa73fb79e4b73b22bed31b74ac1304

Phase 9M-R5-1-0 启动检查已经确认：

    HEAD
    → e1286e39e7aa73fb79e4b73b22bed31b74ac1304

    main
    → e1286e39e7aa73fb79e4b73b22bed31b74ac1304

    origin/main
    → e1286e39e7aa73fb79e4b73b22bed31b74ac1304

    git ls-remote origin refs/heads/main
    → e1286e39e7aa73fb79e4b73b22bed31b74ac1304

    git status
    → clean

    npm.cmd run build
    → passed

    VS Code integrated terminal
    → 正常

    terminal.integrated.shellIntegration.enabled
    → false

    PowerShell
    → Windows PowerShell 5.1

当前不得主动恢复 shell integration。

当前不得使用 PowerShell 7 才支持的三元运算符。

当前可复制执行脚本不得使用会关闭 VS Code integrated terminal 的顶层 `exit 1`。

Git 子进程必须显式使用：

    git -C "$RepoRoot" ...

或显式设置 WorkingDirectory。

---

## 2. 当前受保护 UI WIP stash

必须继续保留：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

不要执行：

    git stash pop
    git stash drop
    git stash clear

在 Phase 9M-R5-1 完成前，也不要执行：

    git stash apply "stash@{0}"

受保护 stash 精确包含四个文件：

    src/components/contract-review-ai-confirmation-panel.tsx

    src/components/contract-review-ai-explanation-panel.tsx

    src/components/contract-review-panel.tsx

    src/content/zh-cn.ts

stash 拓扑中存在：

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

两个新增组件来自 untracked snapshot：

    stash@{0}^3:src/components/contract-review-ai-confirmation-panel.tsx

    stash@{0}^3:src/components/contract-review-ai-explanation-panel.tsx

两个既有文件来自 tracked stash snapshot：

    stash@{0}:src/components/contract-review-panel.tsx

    stash@{0}:src/content/zh-cn.ts

不得误判两个新增组件已经丢失。

---

## 3. 重新锁定 Phase 9 的产品目标

Phase 9 的目标是：

    面向中国大陆租客的
    签约前租房合同风险提示助手。

它不是：

    AI 律师
    法律咨询平台
    合同效力判定器
    违法条款判定器
    自动维权工具
    诉讼策略工具
    仲裁预测工具
    自动索赔工具

Phase 9 应帮助普通租客：

    看懂哪些合同内容值得警惕
    理解以后可能出现的实际麻烦
    知道签约前应该追问什么
    知道哪些事项最好写清楚
    获得克制、实用、可执行的协商方向

必须长期坚持：

    事前规避 > 事后维权
    人话解释 > 法务表格
    高风险细讲 > 所有问题平均展开
    法规依据支撑 > 模型自由发挥
    用户能执行的追问 > 抽象法律教育

不得输出：

    法律结论
    合法或违法判定
    有效或无效判定
    胜诉概率
    投诉结果预测
    仲裁结果预测
    律师式保证
    无遗漏承诺
    替用户决定是否签署合同

---

## 4. 重新锁定 Phase 9 的三层架构

合同风险提示助手不是第四套法律系统，而是 HouseFolio 三层架构在签约前场景中的受限延伸。

| 层级 | 职责 | 可以做 | 不可以做 |
|---|---|---|---|
| L1 | 输入、切分与脱敏 | 文本规范化、条款切分、顺序标记、本地脱敏 | 风险判断、法律结论、调用 DeepSeek |
| L2 | 规则与法规映射 | 生成 `riskId`、`riskLevel`、规则命中、法规依据映射、canonical metadata | 让 LLM 决定风险等级、律师意见、效力判断 |
| L3 | DeepSeek 人话解释 | 人话说明、签前追问、建议写清楚的方向、协商话术、补充关注项 | 修改 L2 风险等级、伪造规则命中、法律裁判、展示推理过程 |

最高优先级不变量：

    riskLevel 必须来自 HouseFolio L2 规则层。

DeepSeek 不得：

    提升 riskLevel
    降低 riskLevel
    覆盖 riskLevel
    为 AI 补充关注项创建 riskLevel
    把 AI 补充关注项伪装成规则命中
    输出正式法律结论
    暴露 reasoning_content

---

## 5. Phase 9M 原型已经验证了什么

Phase 9M 的 legacy matched-findings UI WIP 不是失败实现。

它已经验证以下交互框架可用：

    用户主动触发
    发送前预览
    发送前一次确认
    取消发送
    返回修改
    session-only React state
    文本变化后旧预览与旧结果失效
    清除本次 AI 结果
    重新生成时再次确认
    AI 结果卡片展示
    用户可见中文文案集中管理

这些框架应当创造性继承，而不是推倒重来。

---

## 6. Phase 9M-R 为什么必须调整 UI 主流程

legacy matched-findings 链路是：

    用户粘贴完整合同
    → 本地切分
    → 本地规则匹配
    → 只选出规则命中的局部片段
    → 脱敏局部片段
    → 用户预览并确认
    → 只上传局部片段
    → AI 解释局部风险

该链路适合早期安全原型，但不适合作为正式主流程。

核心问题：

| 问题 | 原因 |
|---|---|
| 漏报会成为 AI 盲区 | 未被规则命中的条款不会进入 AI 上下文 |
| 误报难以被上下文纠正 | 模型看不到完整合同中的限定条件、例外和跨条款关系 |
| 难以识别组合风险 | 跨条款矛盾、模糊兜底表达、多项费用叠加可能被遗漏 |
| 操作认知不自然 | 普通租客希望系统统一辅助审读合同，而不是理解局部预筛选机制 |

Phase 9M-R 已经锁定新的主线：

    用户粘贴完整合同文本
    → 浏览器本地切分全部条款
    → 浏览器本地自动脱敏全部条款
    → 本地规则扫描全部条款
    → 本地规则生成辅助 signals
    → 用户查看完整脱敏合同预览
    → 用户一次主动确认
    → 上传完整脱敏合同条款 + ruleSignals
    → AI 结合全文上下文统一审读
    → 展示规则提示 + AI 补充关注项
    → session-only 统一结果

核心变化：

    规则从 gate 改为 signal。

规则层继续：

    识别已知风险
    决定 L2 riskLevel
    映射法规依据
    提供重点解释信号

但是规则层不再：

    决定 AI 可以看到哪些条款
    阻止无规则命中合同进入 AI 审读
    把 ruleSignals = [] 当成禁止请求条件

---

## 7. UX Harness：内部严格，外部简单

HouseFolio 不能为了降低风险、满足架构偏好或追求形式完整，而让普通租客承担内部复杂度。

推荐用户流程必须保持：

    粘贴合同
    → 点击“开始辅助审查”
    → 查看完整脱敏合同预览
    → 点击“确认上传并开始审查”
    → 查看统一结果

只保留一次必要的发送前确认。

不应增加：

    逐条勾选上传条款
    逐条决定哪些条款可以发送
    逐条确认法规依据
    用户手动拆分合同
    技术 JSON 预览
    schema 预览
    provider 设置
    prompt 设置
    模型设置
    多层弹窗
    复杂隐私配置

系统内部自动承担：

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

    内部可以复杂。
    用户流程不能复杂。
    不把系统内部责任转嫁给普通租客。

---

## 8. R5-2 的恢复策略

R5-2 开始时，必须使用：

    git stash apply "stash@{0}"

不要使用：

    git stash pop

原因：

    `apply` 会在恢复后继续保留原 stash 备份；
    便于出现冲突时回退；
    便于恢复后继续独立审阅；
    降低误覆盖与误删除风险。

恢复应发生在：

    R5-1 docs-only 文档完成审阅；
    R5-1 docs-only 文档完成精确提交；
    R5-1 docs-only 文档完成 push；
    fetch 后确认 origin/main；
    `git ls-remote origin refs/heads/main` 精确匹配；
    R5-2 单独启动检查完成；
    明确进入 R5-2 实现阶段。

不得在 R5-1 提前恢复 stash。

---

## 9. R5-2 恢复后的精确文件 scope

R5-2 默认只允许修改：

    src/components/contract-review-ai-confirmation-panel.tsx

    src/components/contract-review-ai-explanation-panel.tsx

    src/components/contract-review-panel.tsx

    src/content/zh-cn.ts

如果实现过程中发现必须修改第五个文件：

    立即停止；
    汇报原因；
    不自行扩大 scope；
    不顺手修改；
    回到 docs-only 边界评审。

R5-2 不得顺手修改：

    API route
    route guard
    prompt
    provider
    v2 output schema
    contract-check
    package.json
    package-lock.json
    README
    `.env.local`
    `.env.example`
    首页
    Portfolio
    Compare
    Settings
    LBS
    本地持久化
    OCR
    PDF
    合同照片
    文件上传

---

## 10. `contract-review-panel.tsx` 最小改造边界

### 10.1 需要继承

继续保留：

    用户主动点击后才准备 AI 请求
    发送前预览
    一次发送前确认
    取消发送
    返回修改
    session-only React state
    清除本次结果
    重新生成时再次进入确认
    文本变化后旧预览、旧结果与旧错误全部失效
    不新增 localStorage
    不新增 IndexedDB
    不新增云端历史
    不直接调用 provider

### 10.2 需要替换

legacy 主流程中的 gate：

    hasFindings

应替换为：

    hasText

也就是说：

    只要存在合同文本，
    就可以生成完整脱敏预览。

即使：

    ruleSignals = []

仍然允许：

    进入完整脱敏预览
    用户主动确认
    请求 AI 辅助审查

旧 builder 应替换为已经存在的 full-redacted builder：

    buildContractReviewFullRedactedAiInput()

旧 AI 输入类型应替换为：

    ContractReviewFullRedactedAiInput

旧 AI 输出类型应替换为已经存在的 v2 full-redacted output 类型：

    ContractReviewFullRedactedExplanationOutput

正式实现前必须以仓库只读检查为准，确认真实 import 路径、精确导出名称与当前 API route 请求体格式，不得凭记忆猜测。

### 10.3 网络行为边界

必须保持：

    用户确认前不得 fetch。

只允许在用户主动点击：

    确认上传并开始审查

之后发起网络请求。

不得：

    文本输入时自动联网
    规则扫描时自动联网
    生成脱敏预览时自动联网
    打开确认面板时自动联网
    取消发送后继续联网
    重新生成时绕过再次确认

---

## 11. `contract-review-ai-confirmation-panel.tsx` 最小改造边界

### 11.1 输入替换

旧面板输入：

    ContractReviewAiInput

旧预览核心：

    input.findings

应替换为：

    ContractReviewFullRedactedAiInput

新确认面板必须预览：

    完整脱敏合同条款
    条款总数
    ruleSignals 数量
    自动脱敏提醒
    上传前确认说明

### 11.2 展示方式

完整脱敏合同预览应：

    使用可滚动区域
    保持普通文本可读
    避免页面无限拉长
    允许用户快速返回修改
    明确这是脱敏后文本
    明确不会上传未经脱敏的合同原文

ruleSignals 应：

    作为重点提示摘要
    可以显示数量
    可以提供简洁摘要
    不要求用户逐项授权
    不成为发送 gate

### 11.3 不应增加

不要增加：

    技术 JSON
    payloadVersion
    schema
    provider
    prompt
    reasoning_content
    逐条上传勾选框
    逐条法规确认
    第二次确认弹窗
    复杂隐私设置

---

## 12. `contract-review-ai-explanation-panel.tsx` 最小改造边界

旧输出字段：

    output.findingExplanations

应切换为：

    output.ruleSignalExplanations

必须新增独立区块：

    output.supplementalAttentionItems

展示层必须明确区分：

    HouseFolio 规则提示

与：

    AI 补充关注

### 12.1 HouseFolio 规则提示

规则提示来源于：

    HouseFolio L2 ruleSignals

L2 已经决定：

    riskId
    clauseId
    category
    riskLevel
    ruleTitleZh
    canonical legalBases

AI 只补充：

    人话说明
    法规背景说明
    签约前追问
    建议写清楚的方向
    协商话术
    是否需要进一步确认

必须保持：

    riskLevel 来自 L2。
    AI 不得修改 riskLevel。

### 12.2 AI 补充关注

AI 补充关注来源于：

    DeepSeek 阅读完整脱敏合同后的额外发现。

适合覆盖：

    跨条款矛盾
    模糊兜底表达
    退款时限缺失
    权利义务不对称
    多项成本叠加
    重要事项遗漏
    需要进一步核实的信息

AI 补充关注不得：

    携带 riskLevel
    展示 riskLevel badge
    伪装成 HouseFolio 规则命中
    冒充法律结论
    冒充 L2 风险等级

AI 补充关注可以展示：

    标题
    关联条款或条款顺序
    人话说明
    为什么值得核实
    签约前追问
    建议写清楚的方向
    是否需要进一步确认

正式实现前必须以仓库当前 v2 类型为准，不得自行创造未经批准的字段。

---

## 13. `src/content/zh-cn.ts` 最小改造边界

只允许增加或修改 Phase 9M-R5 必需文案。

不要顺手大改：

    首页文案
    Portfolio 文案
    Settings 文案
    Compare 文案
    AppNav 文案
    Footer 文案
    其他视觉文案

新文案必须准确表达：

    发送完整脱敏合同条款
    不发送未经脱敏的合同原文
    规则命中项作为重点解释信号
    AI 可补充标记其他值得关注的条款
    AI 补充关注项不等同于 L2 规则风险等级
    自动脱敏可能存在遗漏
    用户确认前不得联网
    当前结果只保留在页面会话中
    AI 输出不构成正式法律意见
    重要事项仍需人工核实

用户可见文案应保持：

    中文优先
    简洁
    克制
    易懂
    不暴露工程术语
    不制造额外操作负担

---

## 14. R5-2 禁止扩大 scope

R5-2 只做 UI WIP 恢复与创造性嫁接。

R5-2 不做：

    浏览器人工回归
    真实 DeepSeek smoke
    UI 大改
    视觉重构
    状态管理重构
    新增 route
    修改 route
    修改 route guard
    修改 provider
    修改 prompt
    修改 schema
    新增 persistence
    新增 OCR
    新增 PDF
    新增合同照片
    新增文件上传
    新增依赖
    package.json 修改
    package-lock.json 修改
    README 修改
    Settings 扩展
    数据导出扩展
    Chrome 插件

完成后：

    只汇报；
    不 stage；
    不 commit；
    不 push；
    等待独立 diff 审阅。

---

## 15. R5-2 实现验收标准

R5-2 完成后，源码审阅至少必须确认：

### 15.1 文件范围

    只出现四个 UI 文件变更。

### 15.2 用户流程

    粘贴合同
    → 点击“开始辅助审查”
    → 查看完整脱敏合同预览
    → 点击“确认上传并开始审查”
    → 查看统一结果

### 15.3 输入边界

    上传完整脱敏合同条款。
    不上传未经脱敏的合同原文。
    ruleSignals 允许为空。
    无规则命中时仍可进入 AI 审读。

### 15.4 输出分层

    ruleSignalExplanations
    → 作为 HouseFolio 规则提示展示。

    supplementalAttentionItems
    → 作为 AI 补充关注展示。

    AI 补充关注项
    → 不显示 riskLevel。

### 15.5 网络与隐私

    用户确认前不联网。
    自动脱敏可能遗漏的提示仍然存在。
    当前结果 session-only。
    不新增 persistence。
    reasoning_content 不进入前端。
    不新增 console logging。
    不新增原文日志。

### 15.6 状态行为

    取消后不发请求。
    返回修改容易。
    文本变化后旧预览失效。
    文本变化后旧结果失效。
    文本变化后旧错误失效。
    清除本次结果可用。
    重新生成时再次进入同一个发送前确认。

---

## 16. R6 预留范围

R5 完成并提交后，才进入 Phase 9M-R6。

R6 负责：

    浏览器人工回归
    规则命中合同
    无规则命中合同
    完整脱敏合同预览
    一次主动确认
    确认前不联网
    取消发送
    返回修改
    文本变化后旧结果失效
    重新生成再次确认
    清除本次结果
    错误状态
    mock provider 回归
    边界扫描
    UTF-8 检查
    no persistence 检查
    stash 处理评审
    最终收口

真实 DeepSeek smoke：

    必须单独评审；
    必须显式批准；
    不得顺手执行。

---

## 17. Phase 9M-R5-1 本阶段允许范围

本阶段只允许新增：

    docs/architecture/
    phase-9m-r5-contract-review-full-redacted-ui-integration-boundary-review.md

本阶段不得：

    修改 src
    恢复 stash
    stage
    commit
    push
    启动浏览器回归
    运行真实 DeepSeek 请求
    跳到 R5-2
    扩大 scope

写入后只执行：

    Node UTF-8 校验
    git diff --no-index --check
    git status
    git stash list
    人工审阅

人工审阅通过后，再单独规划：

    精确 stage
    docs-only commit
    build
    push
    fetch
    git ls-remote
    R5-1 closing checkpoint

---

## 18. Phase 9M-R5-1 结论

Phase 9M-R5-1 边界评审结论：

    可以在后续 R5-2 中恢复 legacy UI WIP，
    但必须采用创造性嫁接，而不是原样沿用旧 matched-findings 主流程。

恢复策略：

    git stash apply "stash@{0}"

不得：

    git stash pop

默认实现 scope：

    src/components/contract-review-ai-confirmation-panel.tsx

    src/components/contract-review-ai-explanation-panel.tsx

    src/components/contract-review-panel.tsx

    src/content/zh-cn.ts

核心 UI 调整：

    hasFindings gate
    → hasText gate

    ContractReviewAiInput
    → ContractReviewFullRedactedAiInput

    input.findings
    → 完整脱敏合同条款预览 + ruleSignals 摘要

    output.findingExplanations
    → output.ruleSignalExplanations

    新增：
    output.supplementalAttentionItems 独立展示区块

长期不变量：

    内部严格，外部简单。
    规则从 gate 改为 signal。
    L2 决定 riskLevel。
    AI 只做人话解释与补充关注。
    用户确认前不得联网。
    用户只保留一次必要的发送前确认。
    不上传未经脱敏的合同原文。
    不把内部复杂度暴露给普通租客。
    不偏离 Phase 9、Phase 9M 与 Phase 9M-R 的总体目标。