# Phase 9J-4｜Contract AI-safe input builder checkpoint

## 1. 阶段目标

Phase 9J-4 用于关闭 HouseFolio Phase 9J：Contract AI-safe redacted input boundary and builder。

当前稳定点：

    b20264d test: add contract ai safe input checks

当前已确认：

    HEAD = main = origin/main = origin/HEAD = b20264d
    npm.cmd run build passed
    working tree clean
    actual remote origin/main verified by git ls-remote

Phase 9J 到此完整关闭。

---

## 2. Phase 9J 已完成内容

Phase 9J 已完成：

    Phase 9J-0：Contract AI-safe redacted input boundary review ✅
    Phase 9J-1：AI-safe redacted input builder minimal implementation plan ✅
    Phase 9J-2：Pure AI-safe redacted input builder minimal implementation ✅
    Phase 9J-3：AI-safe input builder contract-check ✅
    Phase 9J-4：AI-safe input builder closing checkpoint ✅

Phase 9J 的目标不是接入 DeepSeek，也不是建立完整 AI pipeline。

Phase 9J 的目标是：

    在任何合同内容离开浏览器前，
    先形成一个克制、可检查、最小必要的 AI-safe 脱敏结构化输入边界。

---

## 3. Phase 9J-0：输入边界评审结论

Phase 9J-0 已明确：

    ContractReviewModel 不等于 AI-safe input
    不默认发送完整合同原文
    不默认发送全部合同条款
    不默认发送未命中的普通条款
    只发送已命中风险的必要脱敏片段
    浏览器端优先脱敏
    服务端后续仍需做第二次 allowlist 校验与防御性脱敏
    用户主动确认后才联网
    合同文本属于不可信输入
    reasoning_content 不展示、不保存、不导出、不写日志
    AI-facing 自然语言内容中文优先

第一版仍然不做：

    OCR
    PDF
    合同照片
    身份证照片
    房产证照片
    签字页上传
    完整合同全文上传给 AI

---

## 4. Phase 9J-2：纯 builder 实现

Phase 9J-2 已新增：

    src/lib/contract/ai-safe-input.ts

该文件导出：

    CONTRACT_REVIEW_AI_INPUT_VERSION
    CONTRACT_REVIEW_AI_INPUT_LIMITS
    redactContractClauseExcerpt()
    buildContractReviewAiInput()
    ContractReviewAiInput
    ContractReviewAiFindingInput
    ContractReviewAiLegalBasisInput

核心链路：

    ContractReviewModel
    → buildContractReviewAiInput()
    → ContractReviewAiInput

builder 的职责：

    只读取已有 L2 ContractReviewModel
    只保留 allowlist 字段
    保留上游 L2 finding 顺序
    不重新定义风险排序逻辑
    通过 clauseId 提取直接关联条款片段
    对条款片段做常见敏感信息脱敏
    限制单条条款片段长度
    限制风险项数量
    限制单个 finding 的法规依据数量
    限制法规依据摘要长度
    限制风险摘要长度
    限制全部条款片段字符总量
    输出中文优先的 AI-safe payload

builder 不负责：

    调用 DeepSeek
    构建 prompt
    校验 DeepSeek 最终响应 schema
    访问网络
    访问 localStorage
    访问 IndexedDB
    访问环境变量
    保存合同历史
    决定风险等级
    修改 riskId
    新增风险项
    判断条款违法或无效
    生成正式法律意见

---

## 5. ContractReviewAiInput allowlist

第一版 AI-safe payload 只允许包含：

### 请求级字段

    payloadVersion
    locale
    disclaimerMode
    findingCount
    findings

### 风险项字段

    riskId
    riskLevel
    category
    ruleTitleZh
    clause
    riskSummaryZh
    whyItMattersZh
    legalBases

### 条款字段

    clauseId
    clauseOrder
    redactedClauseExcerpt

### 法规依据字段

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

任何没有进入 allowlist 的字段，默认不得进入 AI-safe payload。

---

## 6. 当前脱敏范围

第一版 redactContractClauseExcerpt() 已覆盖常见模式：

    带标签的姓名
    手机号
    身份证号
    邮箱
    微信号 / QQ
    合同编号
    权证编号
    精确门牌号组合
    收款账号
    签字信息
    长连续数字银行卡号

必须保持克制：

    自动脱敏可能存在遗漏。
    不得宣传完全脱敏。
    不得宣传绝对安全。
    用户发送前仍需预览即将发送给 AI 的摘要。
    如摘要仍包含不希望发送的信息，应允许用户返回修改或取消发送。

---

## 7. 当前限制常量

Phase 9J-2 已设置：

    maxFindings: 20
    maxExcerptChars: 360
    maxLegalBasesPerFinding: 4
    maxLegalBasisSummaryChars: 240
    maxRiskSummaryChars: 240
    maxWhyItMattersChars: 320
    maxTotalExcerptChars: 6000

这些限制是第一版产品默认值。

它们不是法律规则，也不是永久不变的参数。

后续可在真实 DeepSeek smoke test 与用户体验回归后单独评审调整。

---

## 8. 中文优先原则

HouseFolio 面向中国大陆租客，合同风险提示功能使用 DeepSeek。

AI-facing 自然语言内容默认使用清晰、克制、准确的中文，包括：

    system prompt
    user prompt
    条款摘要
    风险解释指令
    法规依据说明
    签前追问清单
    建议补充条款方向
    协商话术
    免责声明
    schema 字段说明
    用户可见输出
    错误提示

内部工程标识继续保持稳定英文，包括：

    TypeScript 类型名
    函数名
    JSON 稳定字段名
    riskId
    legalBasisId

中文优先不代表放松 schema、allowlist 或脱敏约束。

---

## 9. Phase 9J-3：contract-check 边界

Phase 9J-3 已新增：

    src/lib/contract/ai-safe-input-contract-check.ts

该文件覆盖：

    buildContractReviewAiInput() 返回类型检查
    redactContractClauseExcerpt() 返回类型检查
    固定 payloadVersion
    固定 locale = zh-CN
    固定 disclaimerMode
    顶层 allowlist 字段
    finding allowlist 字段
    clause allowlist 字段
    legal basis allowlist 字段
    手机号脱敏
    身份证号脱敏
    邮箱脱敏
    地址脱敏
    带标签姓名脱敏
    合同编号脱敏
    收款账号脱敏
    签字信息脱敏
    builder 不修改输入 model
    builder 保持上游 L2 顺序
    finding 数量限制
    单片段字符数限制
    总片段字符数限制
    单 finding 法规依据数量限制
    法规依据摘要字符数限制
    风险摘要字符数限制
    法规依据去重

---

## 10. contract-check 的诚实边界

当前项目没有引入：

    tsx
    ts-node
    vitest
    jest
    jiti
    其他 test runtime dependency

package.json 当前没有 test script。

因此：

    ai-safe-input-contract-check.ts 已通过 TypeScript 编译
    npm.cmd run build 已通过
    runContractReviewAiSafeInputChecks() 已导出
    runtime fixture runner 当前尚未自动执行

不得把 build 通过表述为 runtime fixture runner 已执行。

后续如果出现真实工程需求，再单独评审是否引入测试运行时。

不要为了单个 contract-check 草率修改 package.json 或 package-lock.json。

---

## 11. Phase 9J 停止扩张边界

Phase 9J-4 完成后，不继续横向新增：

    redaction-rules.ts
    ai-safe-input-types.ts
    ai-safe-input-selector.ts
    ai-safe-input-orchestrator.ts
    ai-safe-input-validator.ts
    client-adapter.ts
    display-model.ts
    report-model.ts
    fixture runner dependency
    test framework dependency

除非后续真实消费者出现明确、无法绕开的需求。

下一步应进入真实消费者主线，而不是继续扩张 builder 基础设施。

---

## 12. 下一条主线

Phase 9J 正式关闭后，进入：

    DeepSeek 合同风险人话解释 provider boundary review
    → provider implementation plan
    → provider minimal implementation
    → schema-validated final JSON
    → 用户可见合同风险提示 UI
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

下一阶段首先只做：

    DeepSeek 合同风险人话解释 provider boundary review

不要直接写 provider。

不要直接接 API route。

不要直接接 UI。

不要跳过 prompt injection、防止 reasoning_content 泄露、中文优先、schema-validated final JSON 和日志安全边界评审。

---

## 13. 产品判断标准

Phase 9J 的价值不在于 regex 数量，也不在于抽象层数量。

真正的判断标准是：

    是否尽量减少离开浏览器的合同内容
    是否只向 AI 发送已命中风险的必要脱敏片段
    是否避免默认上传完整合同与身份信息
    是否允许用户发送前预览脱敏摘要
    是否保持规则先行、AI 解释的边界
    是否使用清晰、克制、准确的中文
    是否避免把 HouseFolio 包装成 AI 律师

Phase 9J 至此完整关闭。
