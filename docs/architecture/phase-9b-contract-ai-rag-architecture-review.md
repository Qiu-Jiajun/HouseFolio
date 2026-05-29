# Phase 9B：合同助手 AI + RAG 架构评审

## 0. 阶段结论

Phase 9B 的结论是：HouseFolio 的合同助手需要 AI + 法规依据增强，但第一版不应做成“大而全法律咨询 RAG”。

更合理的架构是：

    L1：合同文本输入、条款切分、敏感信息脱敏
    L2：合同风险规则库、风险优先级、法规依据映射
    L3：DeepSeek thinking mode 人话解释、追问清单、建议补充条款方向、协商话术

也就是说，DeepSeek 不是“审合同的法律裁判”，而是 HouseFolio 的 L3 解释器。它只能基于 L2 已经命中的风险项和法规依据，把合同里的雷点翻译成普通租客能理解、能追问、能谈判、能事前规避的提示。

Phase 9B 只写架构评审文档，不实现功能代码。

本阶段不做：

    不新增 /contract-review 页面
    不新增 API route
    不接 DeepSeek 合同接口
    不写法规库代码
    不写风险规则库代码
    不做 OCR
    不做 PDF 多页扫描
    不上传合同照片
    不保存合同审读记录
    不改 Settings
    不改 src/content/zh-cn.ts
    不新增 localStorage key

---

## 1. Phase 9B 的核心问题

Phase 9A 已经确认合同助手的产品边界：

    合同助手是签约前风险提示工具，不是 AI 律师；
    第一版从文本粘贴审读开始，不做 OCR / PDF / 照片；
    高风险需要细讲，中低风险简讲；
    政府疏解、拆迁、清退、腾退无补偿属于顶级高风险；
    DeepSeek 可以启用 thinking mode，但 reasoning_content 不展示、不保存、不导出、不写日志。

Phase 9B 进一步回答：

    DeepSeek 在合同助手中到底怎么执行？
    法规依据如何进入 AI 输出？
    为什么第一版需要 RAG-lite，而不是大而全法律咨询 RAG？
    DeepSeek 的输入、输出、失败兜底和日志边界是什么？
    如何防止 AI 编造法条、输出法律结论或修改风险等级？
    后续 Phase 9C / 9D / 9G 应如何落地？

---

## 2. 总体架构判断

合同助手不能采用：

    合同全文 → DeepSeek 自由审查 → 输出法律判断

正确架构应是：

    用户主动粘贴合同文本
    → L1 条款切分
    → L1 敏感信息脱敏
    → L2 风险规则库命中
    → L2 决定高风险 / 中低风险
    → L2 绑定法规依据
    → 用户确认是否发送给 AI
    → L3 构造脱敏结构化输入
    → DeepSeek thinking mode 内部推理
    → 只取最终 message.content
    → 丢弃 reasoning_content
    → JSON schema 校验
    → 禁止字段扫描
    → 前端人话渲染

其中：

    L2 决定“这是什么风险、优先级多高、引用哪些法规依据”
    L3 负责“把风险讲成人话、生成追问和建议写法”

这能避免两个极端：

    一端是纯规则库：稳定但表达僵硬，用户不一定看得懂。
    另一端是纯 LLM：表达自然但容易越界、编法条、做法律判断。

HouseFolio 应采用中间路线：

    规则库保证边界
    法规依据保证可信
    DeepSeek 负责解释

---

## 3. DeepSeek 在 Phase 9 中的角色

### 3.1 DeepSeek 是 L3 解释器

DeepSeek 在合同助手中只做：

    把 L2 命中的风险解释成人话
    说明条款以后可能带来什么麻烦
    生成签约前追问问题
    生成建议补充条款方向
    生成与房东 / 中介沟通的话术
    生成审读摘要
    把高风险讲细，把中低风险讲重点

DeepSeek 不做：

    不决定风险等级
    不新增高确定性法律结论
    不判定条款违法
    不判定条款无效
    不判定霸王条款
    不判断用户能不能签
    不输出维权结论
    不预测法院 / 仲裁 / 12345 结果
    不承诺审读无遗漏
    不引用输入之外的法规依据
    不展示 reasoning_content

### 3.2 第一版启用 thinking mode

Phase 9 第一版应启用 DeepSeek thinking mode。

原因：

    合同条款解释需要更强的上下文理解；
    需要把风险翻译成真实生活场景；
    高风险条款需要展开“以后可能发生什么”；
    政府疏解、清退、押金、入室、滞纳金等条款需要更谨慎地生成追问和改写方向。

但 thinking mode 只是 provider 内部能力，不是用户可见能力。

### 3.3 reasoning_content 红线

DeepSeek 返回的 reasoning_content 不得：

    返回给前端
    展示给用户
    写入 React state
    写入 localStorage
    写入 IndexedDB
    写入服务端日志
    写入导出报告
    写入 Settings 数据查看
    写入错误报告
    作为“AI 已充分推理”的营销话术

provider 层必须只解析 message.content。reasoning_content 即使存在，也必须在 provider 内部丢弃。

---

## 4. DeepSeek 调用链路设计

后续实现时建议的调用链路：

    src/app/api/ai/contract-review-explanation/route.ts
        ↓
    lib/ai/contract-review-prompt.ts
        ↓
    lib/ai/deepseek-contract-review-provider.ts
        ↓
    DeepSeek API
        ↓
    provider 只读取 message.content
        ↓
    lib/ai/contract-review-schema.ts
        ↓
    返回前端安全 JSON

职责划分：

### 4.1 API route

API route 负责：

    接收前端传来的 ContractReviewAIRequest
    校验请求体大小
    校验用户确认标记
    调用 prompt builder
    调用 DeepSeek provider
    处理 missing config
    处理 provider error
    处理 schema validation error
    返回前端安全结果

API route 不负责：

    不直接拼 prompt
    不直接调用 DeepSeek SDK / fetch
    不写风险规则
    不写法规依据映射
    不记录 raw contract
    不记录 raw prompt
    不记录 raw response
    不记录 reasoning_content

### 4.2 Prompt builder

Prompt builder 负责：

    将 L2 的风险命中结果转为 AI 输入
    只放入脱敏后的条款片段
    只放入 L2 提供的 riskId / priority / legalBasis
    加入禁止法律结论的 system boundary
    要求 JSON output
    要求不要在 content 中包含 reasoning / chainOfThought / analysis 字段

Prompt builder 不负责：

    不决定风险等级
    不查法规
    不执行规则匹配
    不处理原始合同全文
    不把未脱敏文本放入 prompt

### 4.3 DeepSeek provider

DeepSeek provider 负责：

    读取 provider config
    设置 model / thinking / response format 等参数
    调用 DeepSeek API
    只解析 message.content
    丢弃 reasoning_content
    不 console.log 原始 response
    不返回 raw response
    不把 provider-specific 字段泄露给前端

provider 必须允许模型名和参数通过环境变量配置，避免硬编码过期模型名。

建议保留类似配置项：

    AI_CONTRACT_REVIEW_PROVIDER
    DEEPSEEK_CONTRACT_REVIEW_MODEL
    DEEPSEEK_API_KEY

注意：

    具体 DeepSeek API 参数名和模型名必须在实现 Phase 9G 前再次核对官方文档；
    Phase 9B 只确定架构边界，不把当前外部 API 细节写死到业务设计中。

### 4.4 Schema validator

Schema validator 负责：

    JSON.parse message.content
    校验字段类型
    校验数组长度
    校验 highRiskTips / lowerRiskTips 结构
    校验 riskId 是否来自输入 findings
    校验 priority 是否未被 AI 修改
    校验 legalBasis 是否只引用输入中提供的依据
    扫描 forbidden keys
    检查 disclaimer 是否存在

Schema validator 不负责：

    不自动修复模型输出中的法律结论
    不把无效输出展示给用户
    不让前端直接消费未校验结果

---

## 5. RAG-lite 设计判断

### 5.1 为什么需要法规依据增强

如果合同助手要引用《住房租赁条例》《民法典》或地方住房租赁条例，就不能只靠模型记忆。

原因：

    法规会更新；
    地方规则差异明显；
    模型可能编造不存在的条文；
    用户需要知道风险提示不是纯 AI 自由发挥；
    面试叙事需要体现“规则库 + 法规依据 + AI 解释”的产品判断；
    法规依据可以限制 DeepSeek 的输出范围。

因此 Phase 9 需要 RAG，但不是大而全法律咨询 RAG。

### 5.2 为什么第一版不做大而全法律咨询 RAG

第一版不应做：

    全国法规向量库
    裁判文书库
    司法案例库
    律师意见库
    法律问答库
    自动法规更新系统
    诉讼策略知识库
    自动维权法规库

原因：

    维护成本高；
    容易把产品推向法律咨询；
    容易引发用户对“法律结论”的期待；
    个人项目难以保证准确性和更新频率；
    对 MVP 验证价值不是必要条件；
    会拉长工程链路，延迟文本版合同助手落地。

### 5.3 第一版采用 RAG-lite

Phase 9 第一版应采用 RAG-lite：

    固定法规依据表
    riskId → legalBasisIds[] 映射
    人工维护
    不联网检索
    不向量检索
    不接数据库
    不做案例库
    不让 DeepSeek 自由查法条

结构是：

    risk rule 命中
    → 找到绑定的 legalBasisIds
    → 读取 LegalBasis 对象
    → 放入 ContractReviewAIInput
    → DeepSeek 只能引用输入里的法规依据

这样可以保证：

    AI 有依据；
    依据可控；
    来源可追踪；
    不依赖模型记忆；
    不引入复杂 RAG 基础设施；
    不把 Phase 9 变成法律咨询系统。

---

## 6. 法规依据库数据模型建议

Phase 9D 可进一步评审法规依据库。Phase 9B 先给出建议模型。

### 6.1 LegalBasis

建议结构：

    type LegalBasis = {
      id: string;
      lawName: string;
      articleNo: string;
      jurisdiction: "national" | "beijing" | "local";
      effectiveDate?: string;
      shortText: string;
      relevanceSummary: string;
      topics: string[];
      sourceType: "official_law" | "official_model_contract" | "official_guidance";
      sourceUrl?: string;
      lastVerifiedAt: string;
    };

字段说明：

    id：稳定引用 id，例如 housing-rental-regulation-article-9
    lawName：法规名称
    articleNo：条号
    jurisdiction：国家 / 北京 / 地方
    shortText：短摘要，不一定全文照录
    relevanceSummary：为什么和该风险有关
    topics：押金、入室、腾退、维修、解除、出租资质等
    sourceUrl：官方来源链接
    lastVerifiedAt：最后人工核验时间

### 6.2 RiskLegalBasisMap

建议结构：

    type RiskLegalBasisMap = Record<ContractRiskId, string[]>;

示例：

    policy_clearance_or_demolition_no_compensation
      → housing-rental-regulation-article-7
      → housing-rental-regulation-article-9
      → housing-rental-regulation-article-12
      → civil-code-contract-termination-settlement
      → civil-code-force-majeure-notice-mitigation

    landlord_entry_without_notice
      → housing-rental-regulation-article-9

    deposit_refund_unclear
      → housing-rental-regulation-article-10

注意：Phase 9B 不写代码，只确定模型方向。

---

## 7. DeepSeek 输入结构建议

后续 AI 输入不应是原始合同全文，而应是 ContractReviewAIInput。

建议结构：

    type ContractReviewAIInput = {
      reviewMode: "pre_signing_risk_hint";
      contractType: "housing_rental_contract";
      jurisdictionHint: "中国大陆" | "北京" | string;
      redactionLevel: "high";
      clauses: ContractClauseForAI[];
      findings: ContractRiskFindingForAI[];
      legalBasis: LegalBasisForAI[];
      outputRequirements: ContractReviewOutputRequirements;
      productBoundary: ContractReviewProductBoundary;
    };

### 7.1 clauses

    type ContractClauseForAI = {
      clauseId: string;
      order: number;
      redactedText: string;
      sourceSummary?: string;
    };

要求：

    只传脱敏文本；
    不传身份证号、手机号、银行卡号、签字页、完整门牌号；
    不传原始合同照片；
    不传 OCR 未校对文本。

### 7.2 findings

    type ContractRiskFindingForAI = {
      riskId: string;
      clauseId: string;
      category: string;
      priority: "high" | "mediumLow";
      ruleReason: string;
      matchedPhrases: string[];
      legalBasisIds: string[];
    };

要求：

    priority 由 L2 规则库提供；
    DeepSeek 不得修改；
    DeepSeek 不得新增未输入的高风险结论。

### 7.3 legalBasis

    type LegalBasisForAI = {
      id: string;
      lawName: string;
      articleNo: string;
      shortText: string;
      relevanceSummary: string;
    };

要求：

    只提供与当前 riskId 相关的少量依据；
    不把大段法规全文塞给 DeepSeek；
    不提供无关法条；
    如果某个 riskId 暂无依据，应明确标记 noLegalBasisProvided，而不是让模型补。

---

## 8. DeepSeek 输出结构建议

DeepSeek 最终 message.content 必须是 JSON object。

建议输出结构：

    type ContractReviewHumanOutput = {
      summary: string;
      highRiskTips: ContractRiskHumanTip[];
      lowerRiskTips: ContractRiskHumanTip[];
      askBeforeSigningScript: string;
      saferWordingSuggestions: string[];
      finalReminder: string;
      legalBasisIndex: LegalBasisOutputRef[];
    };

### 8.1 ContractRiskHumanTip

    type ContractRiskHumanTip = {
      riskId: string;
      clauseId: string;
      title: string;
      priority: "high" | "mediumLow";
      clauseSummary: string;
      plainLanguageRisk: string;
      whatMayHappen: string;
      legalBasisRefs: LegalBasisOutputRef[];
      questionsToAsk: string[];
      saferWordingDirection: string;
      negotiationScript?: string;
    };

### 8.2 用户可见渲染原则

前端不应显示成：

    riskId: policy_clearance_or_demolition_no_compensation
    priority: high
    provider: deepseek
    legalBasisIds: [...]

而应显示成：

    最先问清楚｜这套房可能住不稳

    合同里写了“政府疏解时合同自动终止、租客无条件服从且不得索赔”。这不是普通备注，它可能意味着房子存在被清退、腾退、拆迁、整治或无法稳定出租的风险。

    真正麻烦的是：即使对方退你剩余租金和押金，你仍然可能承担搬家、临时住宿、重新找房、中介费、交通和请假处理等损失。这些损失事后通常很难追回。

也就是说：

    后端结构化
    前端人话化

---

## 9. Prompt 边界建议

### 9.1 System prompt 必须包含的边界

System prompt 应明确：

    你是 HouseFolio 的合同风险提示解释层，不是律师、法院、仲裁机构或行政机关。
    你只能基于输入中的 findings 和 legalBasis 解释常见租房合同风险。
    你不得判定条款违法、无效或属于霸王条款。
    你不得判断用户能否签约。
    你不得给出维权、起诉、索赔结论。
    你不得承诺审查无遗漏。
    你不得编造法规条文、案例或政策依据。
    你不得修改 priority。
    你不得新增输入中没有的高确定性法律结论。
    你可以在内部使用 thinking mode，但最终 content 必须只输出 JSON object。
    JSON 中不得包含 reasoning、chainOfThought、analysis、思考过程、推理过程等字段。

### 9.2 User prompt 应包含的输入

User prompt 应包含：

    ContractReviewAIInput JSON
    输出 JSON schema 摘要
    禁止输出字段列表
    输出风格要求：人话、租客可理解、签前可执行
    高风险细讲，中低风险简讲
    法规依据只能来自 legalBasis
    没有依据时不得编造

### 9.3 输出风格要求

输出应接近：

    这句话哪里容易出事
    以后可能怎么坑到你
    签之前你该问什么
    最好让对方写清楚什么
    如果对方不愿意改，说明风险在哪里

不要输出成：

    法务审查意见
    律师函风格
    法院裁判理由
    合同无效判断
    违法结论
    技术风控表格

---

## 10. 禁止字段与安全扫描

DeepSeek 输出 JSON 中禁止出现以下字段：

    reasoning
    reasoningContent
    chainOfThought
    analysis
    思考过程
    推理过程
    legalConclusion
    illegalJudgment
    invalidityJudgment
    courtPrediction
    arbitrationPrediction
    lawsuitAdvice
    rightsEnforcementConclusion
    compensationGuarantee
    canSue
    mustSue
    guarantee
    noRisk

如果出现，应视为 schema validation failed，不能直接返回前端。

---

## 11. 失败兜底设计

### 11.1 missing provider config

如果缺少 DeepSeek API key 或 provider 配置：

    返回 missing_provider_configuration
    前端显示“当前 AI 解释服务未配置”
    不展示技术栈细节
    不输出 key 名称
    不泄露环境变量状态

### 11.2 DeepSeek 请求失败

如果 DeepSeek 请求失败：

    返回 provider_unavailable
    前端保留 L2 规则命中结果
    告知用户可先查看基础风险提示
    不重试过多
    不在错误中包含 raw response

### 11.3 JSON parse failed

如果 message.content 不是合法 JSON：

    返回 invalid_ai_output
    不展示原始文本
    记录脱敏错误类型
    提示用户稍后重试

### 11.4 schema validation failed

如果 JSON 结构不符合 schema：

    返回 invalid_ai_output_schema
    不展示原始输出
    不尝试让前端宽松渲染

### 11.5 reasoning leak detected

如果检测到 reasoning / chainOfThought 等字段：

    返回 unsafe_ai_output
    丢弃输出
    不展示给用户
    不写入本地存储
    不导出

### 11.6 legal conclusion detected

如果检测到明显法律结论字段或措辞：

    返回 unsafe_legal_output
    丢弃输出或降级为 L2 基础提示
    不展示“违法 / 无效 / 一定支持”等结论

---

## 12. 日志与隐私边界

服务端日志只能记录：

    requestId
    provider
    mode
    latency
    statusCode
    errorCode
    token usage 可选
    risk count
    high risk count
    schema validation success / failed

服务端日志不得记录：

    原始合同全文
    脱敏前文本
    原始 prompt
    DeepSeek raw response
    reasoning_content
    用户姓名
    手机号
    身份证号
    房间号
    银行卡号
    签字页内容
    房产证信息

前端本地存储不得保存：

    reasoning_content
    raw provider response
    raw prompt
    未脱敏合同全文，除非后续明确进入本地数据权利设计并由用户确认

---

## 13. 高风险样例：政府疏解 / 清退 / 拆迁 / 腾退

Phase 9B 再次确认：政策清退 / 拆迁 / 腾退条款必须作为顶级高风险进入 Phase 9C 规则库。

原因：

    它可能导致租客在租期内突然失去住所；
    即使退还部分租金和押金，也不覆盖搬家、短期住宿、重新找房、中介费、通勤变化、请假处理等损失；
    事后投诉或维权成本高、结果不确定；
    这类条款往往提示房源本身可能存在违法建设、群租隔断、清退、拆迁、腾退、消防整治或政策治理风险。

输出时应优先展示：

    最先问清楚｜这套房可能住不稳

而不是：

    风险等级：高
    riskId：policy_clearance_or_demolition_no_compensation

必须追问：

    这套房是否属于违法建设、群租隔断、宿舍改造或政策整治范围？
    近期是否收到过街道、社区、住建、城管、消防、公安或其他部门的整改、清退、拆除、腾退通知？
    如果因政策原因提前终止，最少提前几天通知？
    未住期间租金是否全额退？
    押金是否全额退？
    临时搬家、短期住宿、重新找房等合理损失是否有协商机制？
    如果出租方签约前已知或应知风险却没有告知，责任如何承担？

建议补充条款方向：

    如因政府疏解、拆迁、腾退、清退、整治或其他非乙方原因导致合同提前终止，甲方应及时通知乙方，并给予乙方合理搬离时间；甲方应退还乙方未实际居住期间的租金、应退押金及其他未发生费用。若甲方在签约前已知或应知该房屋存在上述风险但未如实告知，导致乙方产生搬家、临时住宿、重新找房等合理损失的，双方应就补偿事宜另行协商或按法律规定处理。

注意：

    这仍然是建议补充条款方向，不是法律结论。
    不得写成“房东必须赔偿全部损失”。
    不得写成“投诉一定有效”。
    不得写成“可以直接起诉且必胜”。

---

## 14. Phase 9B 后续阶段建议

Phase 9B 后，应继续：

### Phase 9C：合同风险规则库模型设计

只写文档，设计：

    riskId
    triggerPhrases
    category
    priority
    whyHighRisk
    questionsToAsk
    saferWordingDirection
    legalBasisIds

重点覆盖：

    政府疏解 / 清退 / 拆迁 / 腾退
    无需通知随时进房
    押金退还不清
    每日高额滞纳金
    提前退租补偿过重
    租客安全责任全部转嫁
    遗留物品直接视为放弃
    禁宠 / 电动车 / 转租 / 改装 / 看房等中低风险

### Phase 9D：法规依据库最小实现计划

只写文档，设计：

    LegalBasis 数据模型
    riskId → legalBasisIds 映射
    官方来源核验策略
    lastVerifiedAt 字段
    不做大而全法律咨询 RAG
    不做向量库
    不联网检索

### Phase 9E：文本输入与条款切分最小实现

开始写功能代码，但只做：

    /contract-review 页面
    textarea
    条款切分
    本地显示切分结果
    不接 AI
    不做 OCR
    不保存历史

---

## 15. Phase 9B 验收标准

Phase 9B 通过标准：

    只新增 docs/architecture/phase-9b-contract-ai-rag-architecture-review.md
    不改 src 代码
    不新增 route
    不新增 API
    不新增 localStorage key
    不接 DeepSeek 合同 API
    不做 OCR / PDF / 照片
    文档明确 DeepSeek 是 L3 解释器，不是法律裁判
    文档明确 thinking mode 可启用，但 reasoning_content 不展示、不保存、不导出、不写日志
    文档明确风险等级来自 L2 规则库
    文档明确第一版采用 RAG-lite，不做法律咨询 RAG
    文档明确法规依据只能来自输入 legalBasis，不允许模型编造
    文档明确失败兜底与日志隐私边界
    npm.cmd run build 通过
    git status clean 后提交

---

## 16. 阶段收口判断

Phase 9B 是必要的架构刹车阶段。

如果不先做 Phase 9B，后续很容易出现三类错误：

    把 DeepSeek 变成自由审合同的法律判断器；
    把法规依据增强做成失控的法律咨询 RAG；
    把 reasoning_content、raw prompt 或合同原文误写入日志 / 本地存储 / 导出报告。

正确路线是：

    Phase 9A 定产品边界
    Phase 9B 定 AI + RAG 架构
    Phase 9C 定风险规则库
    Phase 9D 定法规依据库
    Phase 9E 才开始文本输入实现

Phase 9B 不产生功能，但它决定 Phase 9 后续功能是否能在正确边界内落地。