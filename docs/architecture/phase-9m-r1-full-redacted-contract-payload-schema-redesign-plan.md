# Phase 9M-R1｜Full-Redacted-Contract Payload and Schema Redesign Plan

## 0. 文档定位

本文档用于规划 HouseFolio 合同风险提示助手从：

    规则命中片段上传
    → AI 局部解释

迁移到：

    完整脱敏合同上传
    → 规则 signals 辅助
    → AI 全文上下文审读

本阶段名称：

    Phase 9M-R1：
    Full-redacted-contract payload and schema redesign plan

本阶段只写 docs-only 设计计划。

本阶段不恢复 Phase 9M-2 stash，不修改 `src`，不调用真实 DeepSeek，不修改 `.env.local`、`.env.example`、README、`package.json` 或 `package-lock.json`，不新增依赖。

本文档确认后，再进入：

    Phase 9M-R2：
    Full-redacted-contract AI-safe builder implementation

---

## 1. 当前稳定点

当前稳定点：

    c287598 docs: review full redacted contract ai boundary

Phase 9M-R0 已经锁定：

    完整合同本地自动脱敏
    → 一次完整预览
    → 一次主动确认
    → 上传完整脱敏合同 + 规则 signals
    → AI 全文上下文审读
    → 规则提示 + AI 补充关注项
    → session-only 统一结果

核心变化：

    本地规则从 gate 改为 signal。

核心产品原则：

    内部严格
    外部简单

    安全机制沉入系统
    必要确认保持最少
    不把复杂度转嫁给普通租客

---

## 2. 迁移策略：最小改造，不推倒重来

本轮不新增第二套合同审查 API。

继续复用：

    POST /api/ai/contract-review-explanation

继续复用：

    clause segmentation
    risk matcher
    legal basis entries
    legal basis resolver
    structured review model
    DeepSeek transport
    provider timeout
    provider safe error mapping
    reasoning_content isolation
    route no-store
    route request.text() + JSON.parse()
    route safe error envelope
    session-only UI state
    Phase 9M-2 WIP interaction framework

需要改变的是：

    AI-safe input payload
    route guard reconstruction
    Prompt
    AI output schema
    provider response validation
    UI preview content
    UI output grouping

---

## 3. 输入 payload 的最终方向

现有：

    ContractReviewAiInput

继续保留导出名称：

    ContractReviewAiInput

继续保留 builder 名称：

    buildContractReviewAiInput(model)

原因：

    降低迁移范围
    减少 import ripple
    保持 endpoint 稳定
    让现有 route 与后续 UI 更容易适配

但其语义改为：

    full-redacted-contract payload

---

## 4. ContractReviewAiInput 精确结构

建议调整为：

    type ContractReviewAiInput = {
      readonly payloadVersion:
        "contract-review-full-redacted-v1";

      readonly locale:
        "zh-CN";

      readonly reviewMode:
        "full-redacted-contract";

      readonly redactedClauses:
        readonly ContractReviewAiRedactedClause[];

      readonly ruleSignals:
        readonly ContractReviewAiRuleSignal[];
    };

### 4.1 ContractReviewAiRedactedClause

建议结构：

    type ContractReviewAiRedactedClause = {
      readonly clauseId: string;
      readonly clauseOrder: number;
      readonly redactedClauseText: string;
    };

含义：

    clauseId：
      继续使用 clause-1、clause-2、clause-3 ...

    clauseOrder：
      继续与条款顺序绑定

    redactedClauseText：
      完整条款经过本地自动脱敏后的文本

必须满足：

    redactedClauses.length > 0

必须禁止：

    原始 clause.text
    完整未脱敏合同
    OCR 原始文本
    合同照片
    PDF
    证件照片
    签字页

### 4.2 ContractReviewAiRuleSignal

建议结构：

    type ContractReviewAiRuleSignal = {
      readonly riskId: ContractRiskId;
      readonly riskLevel: ContractRiskLevel;
      readonly category: ContractRiskCategory;
      readonly clauseId: string;
      readonly ruleTitleZh: string;
      readonly riskSummaryZh: string;
      readonly whyItMattersZh: string;
      readonly legalBases:
        readonly ContractReviewAiLegalBasis[];
    };

其中：

    riskId
    riskLevel
    category
    ruleTitleZh
    riskSummaryZh
    whyItMattersZh
    legalBases

都必须来自 HouseFolio L2 canonical 数据源。

客户端不能自由伪造。

服务端必须重建。

关键变化：

    ruleSignals.length 可以为 0

原因：

    没有命中本地规则
    不代表无需进行 AI 全文辅助审读

---

## 5. 脱敏 primitive 迁移

现有：

    redactContractClauseExcerpt()

此前主要用于：

    规则命中条款片段脱敏

新架构需要：

    全部条款完整文本脱敏

推荐新增：

    redactContractClauseText()

建议关系：

    redactContractClauseText(text)
    → 作为统一全文条款脱敏 primitive

    redactContractClauseExcerpt(text)
    → 保留导出
    → 内部复用 redactContractClauseText(text)
    → 维持已有调用兼容性

这样可以：

    避免复制脱敏逻辑
    避免两套规则漂移
    保持旧 contract-check 可迁移
    支撑服务端防御性二次脱敏

---

## 6. 第一版安全上限

第一版不做自动分块，但必须定义集中化上限。

建议在 AI-safe input 层集中定义：

    maxRedactedClauseCount:
      120

    maxRedactedClauseChars:
      2400

    maxTotalRedactedChars:
      30000

    maxRuleSignalCount:
      60

    maxLegalBasesPerSignal:
      6

Route 现有请求体总长度限制：

    MAX_REQUEST_BODY_CHARS = 100_000

建议先保留。

原因：

    典型租房合同可覆盖
    附件型超长文本可以安全拒绝
    避免 token、延迟和成本无边界扩张
    不在第一版引入复杂分块调度

所有上限应：

    集中定义
    builder 复用
    route guard 复用
    contract-check 覆盖
    UI 使用安全中文提示

超过上限时：

    不自动发送
    不要求用户手动逐条拆分
    显示简洁提示
    引导用户暂时移除无关附件内容

后续再做：

    系统自动分块
    → 分块审读
    → 全局整合

自动分块属于系统责任，不应转嫁给用户。

---

## 7. Builder 迁移计划

修改：

    src/lib/contract/ai-safe-input.ts

目标：

    buildContractReviewAiInput(model)

从：

    只构造规则命中片段

调整为：

    1. 遍历 model.clauses；
    2. 对全部条款调用 redactContractClauseText()；
    3. 构造 redactedClauses；
    4. 遍历 model.findings；
    5. 将 findings 映射为 canonical ruleSignals；
    6. 允许 ruleSignals 为空；
    7. 校验条款数量、单条字符数与总字符数；
    8. 返回 full-redacted payload。

必须保持：

    不保存原始合同
    不联网
    不记录日志
    不读取环境变量
    不写 localStorage
    不写 IndexedDB

修改：

    src/lib/contract/ai-safe-input-contract-check.ts

覆盖：

    全部条款均被脱敏
    未命中规则时仍可构造 payload
    ruleSignals 可以为空
    redactedClauses 不可为空
    clauseId 与 clauseOrder 保持绑定
    手机号脱敏
    身份证号脱敏
    银行卡号脱敏
    姓名或地址类文本脱敏策略
    条款数量上限
    单条字符上限
    总字符上限
    ruleSignals 上限
    legalBases 上限
    无日志
    无环境变量
    无网络调用
    无 persistence

---

## 8. Route guard 迁移计划

修改：

    src/lib/contract/ai-safe-input-route-guard.ts

目标：

    parseAndSanitizeContractReviewAiInput(value)

从：

    校验规则命中 findings
    → 重建局部片段 payload

调整为：

    校验完整 redactedClauses
    → 校验 ruleSignals
    → 服务端再次脱敏全部条款
    → 重建可信 full-redacted payload

必须覆盖：

    payload exact-key 校验
    forbidden key 递归扫描
    payloadVersion 固定值
    locale 固定值
    reviewMode 固定值
    redactedClauses 不可为空
    ruleSignals 可以为空
    clauseId 格式校验
    clauseId 与 clauseOrder 绑定
    条款顺序唯一
    条款数量上限
    单条字符上限
    总字符上限
    ruleSignals 数量上限
    canonical risk rule 校验
    canonical metadata 校验
    canonical legal basis 校验
    legal basis 顺序校验
    服务端防御性二次脱敏
    prompt boundary 转义
    返回新对象
    不原样透传客户端对象

继续禁止：

    原始合同全文字段
    rawClauseText
    clause.text
    fullContractText
    OCR 原始文本
    PDF
    图片
    API key
    provider
    model
    prompt
    reasoning_content
    rawResponse
    providerResponse
    localStorage
    IndexedDB

---

## 9. API route 迁移判断

现有：

    src/app/api/ai/contract-review-explanation/route.ts

默认目标：

    优先不修改

原因：

    route 已经：
    - 只接受 POST
    - 校验 Content-Type
    - 使用 request.text()
    - 在 JSON.parse() 前限制请求体长度
    - 调用 parseAndSanitizeContractReviewAiInput()
    - 调用 provider
    - 返回安全错误
    - 设置 Cache-Control: no-store
    - 不记录日志
    - 不读取环境变量
    - 不暴露 reasoning_content

只有以下情况才允许修改 route：

    类型迁移导致编译必须调整
    新的安全错误码确有必要
    新的长合同提示需要安全映射

如果需要修改：

    Phase 9M-R4 单独评审
    不在 Phase 9M-R2 顺手修改

---

## 10. AI 输出 schema 的重新设计

修改：

    src/types/ai-contract-review-explanation.ts

继续保留顶层类型名称：

    ContractReviewExplanationOutput

建议调整为：

    type ContractReviewExplanationOutput = {
      readonly outputVersion:
        "contract-review-explanation-v2";

      readonly summaryZh:
        string;

      readonly disclaimerZh:
        string;

      readonly ruleSignalExplanations:
        readonly ContractReviewRuleSignalExplanation[];

      readonly supplementalAttentionItems:
        readonly ContractReviewSupplementalAttentionItem[];
    };

---

## 11. 规则信号解释：AI 不得重新决定 riskLevel

建议结构：

    type ContractReviewRuleSignalExplanation = {
      readonly riskId:
        ContractRiskId;

      readonly clauseId:
        string;

      readonly contextExplanationZh:
        string;

      readonly legalBasisNotesZh:
        readonly string[];

      readonly preSigningQuestionsZh:
        readonly string[];

      readonly suggestedClauseDirectionsZh:
        readonly string[];

      readonly negotiationScriptZh:
        string;

      readonly needsFurtherConfirmation:
        boolean;
    };

明确不让模型输出：

    riskLevel
    category
    ruleTitleZh
    canonical legal basis

原因：

    这些字段来自 HouseFolio L2 规则层
    不应由 DeepSeek 重写
    不应由 DeepSeek 降级
    不应由 DeepSeek升级
    不应由 DeepSeek 删除
    不应让 DeepSeek 成为风险等级裁判

UI 展示时：

    L2 ruleSignal
    + AI context explanation
    → 合并展示

Provider 必须验证：

    每个 ruleSignal explanation
    必须对应输入中的一个 riskId + clauseId

禁止：

    未知 riskId
    未知 clauseId
    重复 explanation
    模型伪造风险等级
    模型伪造法规依据

---

## 12. AI 补充关注项

建议结构：

    type ContractReviewSupplementalAttentionItem = {
      readonly attentionType:
        | "建议重点核对"
        | "信息不足"
        | "存在歧义"
        | "建议补充约定";

      readonly relatedClauseIds:
        readonly string[];

      readonly titleZh:
        string;

      readonly explanationZh:
        string;

      readonly preSigningQuestionsZh:
        readonly string[];

      readonly suggestedClauseDirectionsZh:
        readonly string[];

      readonly negotiationScriptZh:
        string;

      readonly needsFurtherConfirmation:
        true;
    };

AI 补充关注项可以用于：

    跨条款冲突
    模糊兜底表达
    退款时限缺失
    重要事项遗漏
    权利义务不对称
    多条款叠加后的实际风险
    需要人工进一步确认的信息

AI 补充关注项必须：

    明确标记为 AI 补充关注
    不构成法律结论
    不获得 HouseFolio 正式 riskLevel
    不混入规则命中风险等级
    relatedClauseIds 必须来自输入条款
    needsFurtherConfirmation 固定为 true

---

## 13. Provider 与 Prompt 迁移计划

修改：

    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-deepseek-provider-contract-check.ts

如已有 prompt contract-check，也同步修改。

Prompt 必须使用中文优先表达：

    输入包含完整脱敏合同条款。
    输入中的 ruleSignals 是 HouseFolio 本地规则辅助线索。
    ruleSignals 不是完整风险列表。
    ruleSignals 可能存在误报。
    未命中规则的条款仍然需要结合上下文审读。
    不得忽略跨条款关系。
    不得输出法律结论。
    不得判定条款违法、无效或一定可撤销。
    不得预测投诉、仲裁或诉讼结果。
    不得承诺无遗漏。
    只输出克制、可理解、可操作的中文提示。

Provider 必须：

    继续使用 thinking mode
    继续丢弃 reasoning_content
    只读取 final content
    校验 outputVersion
    校验 ruleSignalExplanations
    校验 supplementalAttentionItems
    拒绝未知 clauseId
    拒绝未知 riskId
    拒绝重复 rule signal explanation
    限制补充关注项数量
    限制文本长度
    限制数组数量
    只返回 schema-validated final output

---

## 14. Route contract-check 迁移计划

修改：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

覆盖：

    application/json
    request.text()
    请求体上限
    invalid JSON
    forbidden key
    redactedClauses 不可为空
    ruleSignals 可以为空
    clauseId 格式
    clauseId 与 clauseOrder 绑定
    条款顺序唯一
    条款数量上限
    单条字符上限
    总字符上限
    canonical rule signal 校验
    canonical legal basis 校验
    服务端二次脱敏
    no-store
    不触发真实 DeepSeek
    不使用合法 payload 调用联网 provider
    不暴露 reasoning_content
    不暴露 raw response
    不读取环境变量
    不记录日志

---

## 15. UI WIP 创造性嫁接计划

Phase 9M-2 UI 原型仍保存在：

    stash@{0}:
    wip: phase 9m-2 matched-findings confirmation ui

不要在 Phase 9M-R1 恢复。

Phase 9M-R5 再使用：

    git stash apply "stash@{0}"

不要使用：

    git stash pop

原因：

    apply 会保留 WIP 备份
    在适配完成前更安全

可以继承：

    confirmation panel 框架
    explanation panel 框架
    fetch 只在主动确认 handler 内执行
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

    命中片段列表预览
    → 完整脱敏合同滚动预览

    无规则命中时禁止 AI
    → 无规则命中时仍允许审查

    规则结果作为主流程 gate
    → 规则 signals 作为后台辅助线索

    单一结果列表
    → 规则提示 + AI 补充关注项分层展示

---

## 16. 简单交互原则

用户主流程保持：

    粘贴合同
    → 点击“开始辅助审查”
    → 查看完整脱敏合同预览
    → 点击“确认上传并开始审查”
    → 查看统一结果

不增加：

    逐条勾选
    多层弹窗
    手动分块
    技术 JSON
    模型设置
    provider 设置
    prompt 设置
    规则设置
    法规逐项确认

底层可以复杂。

用户流程不能复杂。

---

## 17. 分阶段实现范围

### Phase 9M-R2：Full-redacted AI-safe builder

默认只修改：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-contract-check.ts

目标：

    新 payload
    全条款脱敏
    ruleSignals 可为空
    集中化安全上限
    builder contract-check

默认不修改：

    route
    route guard
    provider
    prompt
    UI
    stash

### Phase 9M-R3：Prompt、输出 schema 与 provider

默认只修改：

    src/types/ai-contract-review-explanation.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    相关 contract-check

目标：

    outputVersion v2
    ruleSignalExplanations
    supplementalAttentionItems
    中文优先 Prompt
    reasoning_content 隔离
    schema validation

默认不修改：

    route
    route guard
    UI
    stash

### Phase 9M-R4：Route guard

默认只修改：

    src/lib/contract/ai-safe-input-route-guard.ts
    src/app/api/ai/contract-review-explanation/route-contract-check.ts

只有编译或安全错误映射确有必要时，单独评审：

    src/app/api/ai/contract-review-explanation/route.ts

目标：

    服务端重建 full-redacted payload
    ruleSignals 允许为空
    防御性二次脱敏
    route regression

### Phase 9M-R5：UI WIP 恢复与嫁接

恢复：

    stash@{0}

默认适配：

    src/components/contract-review-panel.tsx
    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx
    src/content/zh-cn.ts

目标：

    完整脱敏文本滚动预览
    一次确认
    无本地规则命中仍可审查
    两层结果展示
    session-only

### Phase 9M-R6：浏览器回归与收口

验证：

    操作是否简单
    完整脱敏预览
    用户确认前不联网
    无规则命中仍可审查
    取消和返回修改
    文本变化后状态失效
    规则提示与 AI 补充关注项区分
    长合同安全提示
    session-only
    no persistence
    no reasoning_content exposure

---

## 18. Codex 有限自治边界

Phase 9M-R2 之后可以让 Codex 执行局部工程任务。

Codex 可以：

    读取批准范围内文件
    修改批准范围内文件
    新增批准范围内 contract-check
    npm.cmd run build
    Node UTF-8 校验
    git diff --check
    git diff --stat
    git status
    关键词扫描
    在批准范围内自行修复

Codex 不可以：

    扩大 scope
    git commit
    git push
    git add .
    修改 `.env.local`
    修改 `.env.example`
    修改 README
    修改 package.json
    修改 package-lock.json
    安装依赖
    运行真实 DeepSeek
    恢复 stash，除非进入 Phase 9M-R5
    OCR
    PDF
    合同照片
    RAG
    Supabase
    Chrome 插件

---

## 19. Phase 9M-R1 非目标

本阶段不做：

    src 修改
    stash 恢复
    UI 实现
    builder 实现
    route guard 实现
    Prompt 修改
    provider 修改
    schema 修改
    contract-check 修改
    真实 DeepSeek
    OCR
    PDF
    合同照片
    RAG
    persistence
    localStorage
    IndexedDB
    Supabase
    Chrome 插件
    自动分块
    新增依赖
    `.env.local` 修改
    `.env.example` 修改
    README 修改
    package.json 修改
    package-lock.json 修改

---

## 20. Phase 9M-R1 验收标准

本阶段只新增：

    docs/architecture/phase-9m-r1-full-redacted-contract-payload-schema-redesign-plan.md

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

必须确认：

    npm.cmd run build 通过
    git status 只显示新增 docs 文件
    stash@{0} 仍然存在
    UTF-8 无 BOM

建议 commit：

    docs: plan full redacted contract payload redesign

---

## 21. 最终结论

迁移后的主线是：

    全部条款本地自动脱敏
    → redactedClauses
    → 本地规则扫描
    → ruleSignals
    → 一次完整预览
    → 一次主动确认
    → 同一 API route
    → AI 全文上下文审读
    → 规则提示 + AI 补充关注项
    → session-only 统一结果

风险等级继续由：

    HouseFolio L2 规则库

决定。

AI 负责：

    上下文解释
    追问
    建议补充条款方向
    协商话术
    补充关注项

AI 不负责：

    重新决定风险等级
    输出法律结论
    替用户决定能否签约