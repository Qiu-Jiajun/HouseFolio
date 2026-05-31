# Phase 9I-4｜Contract review structured model checkpoint

## 1. 阶段目标

Phase 9I-4 用于关闭 HouseFolio Phase 9I：Contract review structured model。

本阶段只记录 L2 合同风险结构化模型层已经形成的稳定边界，不新增功能代码，不继续横向扩张 L2 基础设施。

当前稳定点：

    a8db37b test: add contract review model checks

当前已确认：

    HEAD = main = origin/main = origin/HEAD = a8db37b
    npm.cmd run build passed
    working tree clean
    actual remote origin/main verified by git ls-remote

---

## 2. Phase 9I 已完成内容

Phase 9I 已完成：

    Phase 9I-0：Contract structured output model boundary review ✅
    Phase 9I-1：Contract structured output model implementation plan ✅
    Phase 9I-2：ContractReviewModel minimal implementation ✅
    Phase 9I-3：ContractReviewModel contract-check ✅
    Phase 9I-4：Contract review structured model checkpoint ✅

Phase 9I 的目标不是新增 UI、API route 或 AI provider，而是为后续 L3 人话解释建立克制、可复用、可审查的结构化输入基础。

---

## 3. ContractReviewModel 的精确职责

ContractReviewModel 负责把当前已经存在的 L1 / L2 合同风险结果整理为稳定结构：

    ContractClauseSegment[]
    → ContractRiskFinding[]
    → LegalBasisEntry[]
    → ContractReviewModel

该模型用于后续：

    L3 AI-safe 脱敏输入边界评审
    DeepSeek 合同风险人话解释 provider
    schema-validated final JSON
    用户可见合同风险提示 UI
    审读报告导出与本地数据权利覆盖

ContractReviewModel 的职责是：

    汇总已切分的合同条款
    汇总由 HouseFolio 规则库命中的风险项
    汇总已解析的法规依据背景
    保留稳定的风险等级与风险标识
    为后续 L3 提供结构化输入基础

ContractReviewModel 不负责：

    判定条款违法或无效
    生成正式法律意见
    预测诉讼、仲裁或投诉结果
    调用 DeepSeek
    决定风险等级
    新增 AI 推断出的风险项
    保存合同原文到服务端
    输出用户可见报告
    读取 OCR、PDF 或合同照片

风险等级仍然来自 HouseFolio L2 规则库，不来自 LLM。

法规依据仍然只作为：

    supporting context
    相关规则背景
    签前追问与澄清材料
    后续人话解释的背景信息

不得被包装为确定性法律结论。

---

## 4. Phase 9I-3 contract-check 覆盖范围

Phase 9I-3 已新增：

    src/lib/contract/review-model-contract-check.ts

该文件用于检查 ContractReviewModel 的纯模型边界与关键结构行为。

覆盖重点包括：

    review-model 可以消费条款切分结果
    review-model 可以消费风险规则 matcher 结果
    review-model 可以消费 legal basis resolver 结果
    风险条目保留 riskId
    法规依据保留 legalBasisId
    风险等级继续由 L2 规则结果提供
    review-model 不调用 DeepSeek
    review-model 不访问 API route
    review-model 不访问 localStorage 或 IndexedDB
    review-model 不读取 OCR、PDF 或合同照片
    review-model 不新增 persistence
    review-model 不输出律师式结论

该 contract-check 是纯 TypeScript 边界检查文件。

---

## 5. 测试 runner 的诚实边界

当前项目没有引入：

    tsx
    ts-node
    vitest
    jest
    jiti
    其他 test runtime dependency

因此：

    review-model-contract-check.ts 当前不会自动执行
    npm.cmd run build 负责 TypeScript 编译与 Next.js production build 校验
    当前没有为了单个 contract-check 草率修改 package.json 或 package-lock.json
    当前没有把 contract-check 导入页面、组件、API route 或 app runtime
    当前没有把测试逻辑伪装成已自动运行的测试套件

后续是否需要独立测试 runner、fixture runner 或 test framework，必须在出现真实工程需求后单独评审。

---

## 6. Phase 9I 明确停止扩张的内容

Phase 9I-4 完成后，停止继续横向新增 L2 基础设施。

不要继续新增：

    selector 层
    validator 层
    schema 层
    orchestrator 层
    display-model 层
    report-model 层
    coverage metrics 层
    额外 counts
    测试 runtime dependency

除非后续真实消费者出现明确、无法绕开的需求。

HouseFolio 不应演变为无止境的抽象层工程或 architecture document 工程。

---

## 7. 下一条主线

Phase 9I 完整关闭后，转入新的主线：

    L3 AI-safe 脱敏输入边界评审
    → DeepSeek 合同风险人话解释 provider
    → schema-validated final JSON
    → 用户可见合同风险提示 UI
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

下一阶段首先只做：

    L3 AI-safe 脱敏输入边界评审

不要直接写 DeepSeek provider，不要直接接 UI，不要跳过脱敏输入边界。

---

## 8. 中文优先原则

HouseFolio 面向中国大陆租客，合同风险提示功能使用 DeepSeek。

从下一阶段开始，所有 AI-facing 语义内容应尽可能使用清晰、克制、准确的中文完成对接，包括：

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

内部工程标识可以继续使用英文，包括：

    TypeScript 类型名
    函数名
    JSON 稳定字段名
    riskId
    legalBasisId

中文优先不代表放松结构化约束。后续 DeepSeek 输出仍必须接受 schema 校验，只使用最终结构化结果。

reasoning_content 必须继续遵守：

    不展示
    不保存
    不导出
    不写日志

---

## 9. 产品判断标准

Phase 9 的最终判断标准不是抽象层数量，而是：

    普通租客能否在签约前更快识别合同雷点
    能否知道应该问什么
    能否知道哪些内容最好写进合同或补充协议
    能否获得清晰、克制、可操作的人话提示

Phase 9I 至此完整关闭。