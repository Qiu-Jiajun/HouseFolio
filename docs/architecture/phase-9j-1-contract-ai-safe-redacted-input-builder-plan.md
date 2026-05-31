# Phase 9J-1｜Contract AI-safe redacted input builder minimal implementation plan

## 1. 阶段目标

Phase 9J-1 用于规划 HouseFolio 合同风险提示助手的 AI-safe 脱敏输入 builder 最小实现。

当前稳定点：

    ca2a6d4 docs: review contract ai safe redacted input boundary

Phase 9J-0 已完成：

    AI-safe redacted input boundary review ✅

Phase 9J-1 仍然只写实现计划，不修改 src。

本阶段不实现：

    TypeScript 类型
    redaction regex
    builder 函数
    contract-check
    DeepSeek provider
    prompt builder
    schema validator
    API route
    UI
    persistence
    RAG
    OCR
    PDF
    合同照片

---

## 2. 为什么需要独立 AI-safe input builder

当前 L2 已经形成：

    ContractClauseSegment[]
    → ContractRiskFinding[]
    → LegalBasisEntry[]
    → ContractReviewModel

但 ContractReviewModel 是本地 L2 结构化结果，不等于可以直接发送给 DeepSeek 的安全输入。

ContractReviewModel 可能包含：

    完整或较长条款文本
    完成本地规则判断所需的上下文
    不适合离开浏览器的字段
    超出人话解释任务最小必要范围的信息

因此，后续必须建立一个独立、纯函数、可检查的 builder：

    ContractReviewModel
    → buildContractReviewAiInput()
    → ContractReviewAiInput

builder 的任务是：

    只读取已有 L2 结果
    只保留 allowlist 字段
    只提取已命中风险项
    对条款片段做保守脱敏
    限制单条片段长度
    限制风险项数量
    限制法规依据数量
    限制总 payload 规模
    生成稳定、中文优先、可预览的 AI-safe payload

builder 不是：

    AI provider
    prompt builder
    schema validator
    API route
    UI view model
    persistence 层
    法律判断层
    新的 L2 规则引擎

---

## 3. Phase 9J-2 预计文件范围

Phase 9J-2 才进入纯 TypeScript 最小实现。

预计只新增：

    src/lib/contract/ai-safe-input.ts

第一版优先只新增一个文件。

不要同时新增：

    ai-safe-input-types.ts
    redaction.ts
    redaction-rules.ts
    ai-safe-input-validator.ts
    ai-safe-input-selector.ts
    ai-safe-input-orchestrator.ts
    prompt-builder.ts
    api route
    provider
    UI component

除非实际实现证明单文件无法保持清晰。

HouseFolio 当前应避免重新进入抽象层横向扩张。

---

## 4. 预计导出内容

Phase 9J-2 预计从：

    src/lib/contract/ai-safe-input.ts

导出：

    CONTRACT_REVIEW_AI_INPUT_VERSION
    CONTRACT_REVIEW_AI_INPUT_LIMITS
    redactContractClauseExcerpt()
    buildContractReviewAiInput()

以及必要的稳定类型：

    ContractReviewAiInput
    ContractReviewAiFindingInput
    ContractReviewAiLegalBasisInput

第一版不额外导出大量内部 helper。

内部 helper 可以保留为文件内私有函数。

---

## 5. 预计输入

builder 输入：

    ContractReviewModel

输入来自已经存在的本地 L2 结构化模型。

builder 不读取：

    原始文本输入框状态
    localStorage
    IndexedDB
    URL query
    浏览器环境
    API request
    DeepSeek 响应
    文件系统
    环境变量

builder 不访问：

    网络
    DeepSeek
    高德
    Supabase
    第三方 SDK

builder 必须是纯函数。

---

## 6. 预计输出：ContractReviewAiInput

第一版预计输出：

    ContractReviewAiInput

建议最小结构：

    payloadVersion
    locale
    disclaimerMode
    findingCount
    findings

其中：

    payloadVersion = "contract-review-ai-safe-v1"
    locale = "zh-CN"
    disclaimerMode = "contract-risk-prompt-only"
    findingCount = findings.length

建议结构示意：

    {
      payloadVersion: "contract-review-ai-safe-v1",
      locale: "zh-CN",
      disclaimerMode: "contract-risk-prompt-only",
      findingCount: 2,
      findings: [
        {
          riskId: "...",
          riskLevel: "high",
          category: "...",
          ruleTitleZh: "...",
          clause: {
            clauseId: "...",
            clauseOrder: 3,
            redactedClauseExcerpt: "..."
          },
          riskSummaryZh: "...",
          whyItMattersZh: "...",
          legalBases: [
            {
              legalBasisId: "...",
              legalBasisTitleZh: "...",
              legalBasisSummaryZh: "...",
              legalBasisSourceType: "..."
            }
          ]
        }
      ]
    }

第一版不应输出：

    完整合同
    全部条款
    未命中条款
    完整 ContractReviewModel
    原始敏感信息
    OCR 内容
    文件引用
    用户信息
    浏览器信息
    persistence key
    secret
    prompt 原文
    reasoning_content

---

## 7. allowlist 原则

Phase 9J-2 的 builder 必须使用 allowlist 思路。

允许进入 ContractReviewAiInput 的字段，只能包括：

### 7.1 请求级字段

    payloadVersion
    locale
    disclaimerMode
    findingCount

### 7.2 风险项字段

    riskId
    riskLevel
    category
    ruleTitleZh
    clause
    riskSummaryZh
    whyItMattersZh
    legalBases

### 7.3 条款字段

    clauseId
    clauseOrder
    redactedClauseExcerpt

### 7.4 法规依据字段

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

任何没有明确进入 allowlist 的字段，默认不得输出。

---

## 8. 条款片段选择策略

第一版 builder 只处理已命中风险项关联的条款片段。

应坚持：

    只发送命中风险的条款片段
    不发送完整合同
    不发送未命中普通条款
    不发送相邻条款
    不自动拼接大段上下文
    不让 DeepSeek 自由审查整份合同

如果一个风险项涉及多个命中条款，第一版优先选择：

    与 finding 直接关联的主要条款片段

如果当前数据模型天然保留多个片段，则：

    先在 Phase 9J-2 实现前检查真实模型
    优先保持最小实现
    不为了覆盖所有边界提前引入复杂 selector

如果上下文不足，未来 AI 输出应允许：

    当前片段信息不足，建议你结合完整合同进一步确认。

而不是要求 builder 自动扩张上下文。

---

## 9. 第一版保守脱敏范围

第一版 redactContractClauseExcerpt() 应采用：

    保守
    可解释
    可检查
    不假装绝对完整

的策略。

至少覆盖：

| 类别 | 示例 | 替换文本 |
| --- | --- | --- |
| 手机号 | 13812345678 | [手机号已脱敏] |
| 身份证号 | 18 位身份证号 | [身份证号已脱敏] |
| 邮箱 | name@example.com | [邮箱已脱敏] |
| 银行卡号 | 较长连续数字账号 | [银行卡号已脱敏] |
| 微信号 / QQ | 微信、wxid、QQ 后的账号 | [联系方式已脱敏] |
| 合同编号 | 合同编号、协议编号后的文本 | [合同编号已脱敏] |
| 权证编号 | 房产证、不动产权证号后的文本 | [权证编号已脱敏] |
| 精确门牌号 | 楼栋、单元、室、房间号组合 | [房屋地址已脱敏] |
| 收款账号 | 支付宝、收款账户后的文本 | [账号信息已脱敏] |
| 签字信息 | 甲方签字、乙方签字后的文本 | [签字信息已脱敏] |

姓名脱敏需要谨慎。

第一版不要用过度宽泛的中文姓名 regex，因为容易误删合同正常语义。

第一版优先采用带标签的保守规则，例如：

    甲方姓名：
    乙方姓名：
    出租人：
    承租人：
    联系人：

替换为：

    [姓名已脱敏]

第一版不承诺识别所有姓名、地址或账号。

---

## 10. 第一版长度限制

为降低隐私暴露、prompt 体积和成本，Phase 9J-2 应设置明确上限。

建议第一版常量：

    MAX_AI_FINDINGS = 20
    MAX_EXCERPT_CHARS = 360
    MAX_LEGAL_BASES_PER_FINDING = 4
    MAX_LEGAL_BASIS_SUMMARY_CHARS = 240
    MAX_RISK_SUMMARY_CHARS = 240
    MAX_WHY_IT_MATTERS_CHARS = 320
    MAX_TOTAL_EXCERPT_CHARS = 6000

说明：

    这些限制是第一版产品默认值。
    它们不是法律规则。
    它们可以在真实 DeepSeek smoke test 后单独评审调整。
    builder 应做确定性裁剪。
    builder 不应静默加入额外上下文。
    builder 不应为了凑满 token 自动扩大条款范围。

如果 finding 数量超过上限：

    第一版保持现有 L2 输出顺序
    截取前 MAX_AI_FINDINGS 项
    不在 builder 中重新定义风险排序逻辑

原因：

    风险等级和优先级仍然属于 L2。
    builder 只做安全裁剪，不做新的决策逻辑。

---

## 11. 红线：不要让脱敏函数变成虚假的安全承诺

第一版脱敏 regex 不可能覆盖全部敏感信息。

因此 UI 和后续文案必须保持克制：

    系统会尽量对常见敏感信息进行脱敏。
    自动脱敏可能存在遗漏。
    发送前请检查即将发送给 AI 的摘要。
    不要粘贴身份证照片、签字页、银行卡照片或其他无关材料。
    如摘要仍包含不希望发送的信息，请先返回修改。

不得宣传：

    绝对安全
    完全脱敏
    零泄露
    自动识别全部隐私信息
    无需用户检查

---

## 12. 浏览器端与服务端的职责边界

Phase 9J-2 只实现纯 builder。

未来浏览器端负责：

    调用 buildContractReviewAiInput()
    生成最小 payload
    展示即将发送的脱敏摘要
    允许用户取消
    允许用户返回修改
    用户主动确认后才发送

未来 API route 负责：

    接收 AI-safe payload
    allowlist 校验
    类型校验
    长度校验
    finding 数量校验
    服务端防御性二次脱敏
    安全错误返回
    不记录原始 payload

未来 DeepSeek provider 负责：

    接收已经通过服务端校验的最小 payload
    使用中文优先 prompt
    生成 schema-validated final JSON
    丢弃 reasoning_content
    不透传 reasoning_content
    不记录原始响应全文

Phase 9J-2 不实现 API route 或 provider。

---

## 13. 合同文本仍然属于不可信数据

即使 builder 只发送脱敏后的条款片段，条款内容仍然是不可信数据。

后续 prompt builder 必须：

    把条款片段放入明确的数据分隔结构
    明确条款内容不是指令
    明确忽略条款中的角色设定、命令、提示词或代码
    明确不得因为条款文本改变输出 schema
    明确不得泄露系统提示
    明确不得输出 reasoning_content

Phase 9J-2 不实现 prompt builder。

---

## 14. 中文优先原则

HouseFolio 面向中国大陆租客，合同风险提示功能使用 DeepSeek。

Phase 9J-2 的工程标识可以继续使用英文：

    ContractReviewAiInput
    ContractReviewAiFindingInput
    ContractReviewAiLegalBasisInput
    buildContractReviewAiInput()
    redactContractClauseExcerpt()
    riskId
    legalBasisId

但 AI-facing 语义字段应默认使用中文：

    ruleTitleZh
    riskSummaryZh
    whyItMattersZh
    legalBasisTitleZh
    legalBasisSummaryZh
    redactedClauseExcerpt

后续 prompt、schema 字段说明、免责声明和用户可见输出继续中文优先。

---

## 15. Phase 9J-2 实现前必须先检查真实上游模型

Phase 9J-2 不应盲写。

进入实现前，必须先检查当前真实文件：

    src/lib/contract/review-model.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/legal-basis.ts
    src/lib/contract/legal-basis-resolver.ts

必须确认：

    ContractReviewModel 当前字段
    ContractRiskFinding 当前字段
    clause segment 当前字段
    legal basis 当前字段
    当前已有中文语义字段名称
    是否已经存在稳定排序
    一个 finding 是否只关联一个 clause
    legal basis resolver 输出形态

实现时应复用当前真实字段。

不要为了迁就计划文档重构上游模型。

如果真实模型与本文示意字段不同：

    优先最小映射
    优先保持当前稳定 L2
    不要反向大改 L2
    不要引入额外 selector、orchestrator 或 adapter 层

---

## 16. Phase 9J-2 contract-check 后置

Phase 9J-2 只实现纯 builder。

之后建议单独进入：

    Phase 9J-3：AI-safe input builder contract-check / checkpoint

Phase 9J-3 才检查：

    payloadVersion 固定
    locale 固定为 zh-CN
    disclaimerMode 固定
    只输出 allowlist 字段
    不输出完整合同
    不输出未命中条款
    常见手机号被脱敏
    常见身份证号被脱敏
    常见邮箱被脱敏
    常见账号被脱敏
    片段长度上限生效
    finding 数量上限生效
    legal basis 数量上限生效
    builder 不访问网络
    builder 不读取 localStorage 或 IndexedDB
    builder 不调用 DeepSeek
    builder 不新增 persistence

当前项目没有自动 test runtime。

不要为了 contract-check 草率修改 package.json 或 package-lock.json。

---

## 17. Phase 9J-1 非目标

Phase 9J-1 不做：

    src 修改
    TypeScript 类型新增
    regex 实现
    builder 实现
    contract-check
    fixture runner
    test runtime dependency
    prompt builder
    DeepSeek provider
    API route
    schema validator
    UI
    localStorage
    IndexedDB
    persistence
    RAG
    OCR
    PDF
    合同照片
    全国法规自动适配
    司法案例检索
    自动投诉
    自动起诉
    自动索赔
    Chrome 插件
    Supabase
    package.json 修改
    package-lock.json 修改

---

## 18. Phase 9J-1 完成标准

Phase 9J-1 完成标准：

    新增一份 docs-only builder 实现计划
    明确 Phase 9J-2 预计只新增一个纯 TypeScript 文件
    明确 builder 输入为 ContractReviewModel
    明确输出为 ContractReviewAiInput
    明确 allowlist 字段
    明确只发送已命中风险条款片段
    明确保守脱敏范围
    明确姓名脱敏采用标签优先策略
    明确长度限制
    明确 builder 不做风险排序
    明确 builder 不访问网络或 storage
    明确中文优先原则
    明确实现前必须检查真实上游模型
    明确 contract-check 后置到 Phase 9J-3
    npm.cmd run build 通过
    git status clean
    commit 已 push 到 origin/main
    git ls-remote 真实远端校验通过

---

## 19. 后续最小路线

建议路线：

    Phase 9J-0：AI-safe input boundary review ✅
    Phase 9J-1：redacted input builder implementation plan
    Phase 9J-2：pure redacted input builder minimal implementation
    Phase 9J-3：builder contract-check / checkpoint
    → DeepSeek 合同风险人话解释 provider boundary review
    → provider implementation plan
    → provider minimal implementation
    → schema-validated final JSON
    → 用户可见合同风险提示 UI
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

不要继续横向扩张 L2 基础设施。

---

## 20. 产品判断标准

Phase 9J 的价值不在于 regex 数量或类型数量。

真正的判断标准是：

    是否尽量减少离开浏览器的合同信息
    是否只把已命中风险的必要片段交给 DeepSeek
    是否尽量删除身份信息、联系方式和精确地址
    是否允许用户在发送前检查脱敏摘要
    是否保持 HouseFolio 规则先行、AI 解释的边界
    是否让普通租客获得清晰、克制、可执行的中文提示