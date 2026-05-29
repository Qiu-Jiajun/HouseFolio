# Phase 9C：合同风险规则库模型设计

## 0. 阶段结论

Phase 9C 的目标是设计 HouseFolio 合同助手第一版风险规则库模型。

本阶段只写文档，不写功能代码。

Phase 9C 不做：

    不新增 /contract-review 页面
    不新增组件
    不新增 API route
    不接 DeepSeek 合同接口
    不写 risk-rules.ts
    不写 legal-basis.ts
    不改 Settings
    不新增 localStorage key
    不做 OCR
    不做 PDF 多页扫描
    不上传合同照片
    不保存合同审读记录

Phase 9C 只回答一个问题：

    第一版合同助手应该识别哪些租房合同风险？
    每个风险如何触发？
    为什么属于高风险或中低风险？
    应该如何向普通租客解释？
    应该追问什么？
    应该建议写清楚什么？
    应该绑定哪些法规依据方向？

Phase 9C 的核心判断：

    风险规则库是合同助手的 L2 核心。
    DeepSeek 只能解释 L2 命中的风险，不能临场决定风险等级。
    法规依据只能作为支撑和解释来源，不能把产品变成法律咨询系统。
    用户可见输出应是人话风险提示，不是法务审查意见。

---

## 1. Phase 9C 在整体架构中的位置

Phase 9A 已确定合同助手产品边界：

    签约前风险提示
    不做 AI 律师
    不做法律结论
    不做 OCR / PDF / 合同照片
    第一版从文本粘贴审读开始

Phase 9B 已确定 AI + RAG 架构：

    L1 合同输入、切分、脱敏
    L2 风险规则、风险优先级、法规依据映射
    L3 DeepSeek thinking mode 人话解释
    reasoning_content 不展示、不保存、不导出、不写日志
    第一版采用 RAG-lite，不做大而全法律咨询 RAG

Phase 9C 进一步定义 L2 风险规则库。

正确链路是：

    合同条款
    → 条款切分
    → 规则命中
    → riskId
    → priority
    → legalBasisIds
    → DeepSeek 人话解释
    → 前端高风险 / 中低风险分组展示

错误链路是：

    合同全文
    → DeepSeek 自由审合同
    → AI 自己判断违法 / 无效 / 高风险
    → 用户看到法律结论

Phase 9C 必须防止后续实现走向错误链路。

---

## 2. 规则库设计原则

### 2.1 规则库不是法律判定器

规则库输出的是：

    风险提示
    关注优先级
    常见争议点
    签前追问方向
    建议补充条款方向
    法规依据关联

规则库不输出：

    违法
    无效
    霸王条款
    必须删除
    必须赔偿
    可以起诉
    投诉一定有效
    法院一定支持
    用户一定不能签

### 2.2 风险优先级由规则库决定

优先级字段建议为：

    high
    mediumLow

不用第一版就做复杂的 high / medium / low 三档。原因：

    普通租客更关心“哪些最先问清楚”；
    中低风险不需要过度展开；
    细分太多会让 UI 像法务审查表；
    当前核心是可解释、可规避，不是精细风控评级。

前端显示不建议直接写：

    高风险
    中风险
    低风险

更推荐写：

    最先问清楚
    建议写进合同
    容易扯皮
    知道重点即可

### 2.3 高风险必须细讲

高风险满足至少一个条件：

    可能导致短期失去住所
    可能造成明显金钱损失
    可能明显压缩居住安宁或隐私
    可能把出租方责任转嫁给租客
    可能导致押金或财物难追回
    可能触发单方解除、自动解除或快速清退
    可能与房屋合法稳定出租有关
    事后投诉或维权成本高、结果不确定

高风险输出必须包含：

    条款大意
    为什么麻烦
    真实场景里可能发生什么
    签前必须追问
    建议补充条款方向
    可复制沟通话术
    法规依据方向

### 2.4 中低风险只讲重点

中低风险一般满足：

    条款本身常见或有合理管理目的
    风险主要来自违约后果过重
    风险主要来自流程不清楚
    风险可通过简单追问确认

中低风险输出只需要：

    条款大意
    注意重点
    是否需要追问
    是否需要写清楚违约后果

### 2.5 规则应可测试

每条规则应包含：

    riskId
    category
    priority
    triggerPhrases
    negativeTriggerPhrases
    matchStrategy
    whyItMatters
    userVisibleTitle
    plainLanguageRisk
    whatMayHappen
    questionsToAsk
    saferWordingDirection
    legalBasisIds
    falsePositiveNotes

后续 Phase 9F 实现时，必须能用问题合同样例做命中回归。

---

## 3. 第一版风险分类

第一版规则库建议分为八类。

### 3.1 房源稳定性风险

核心问题：

    这套房能不能稳定住到合同期满？

典型风险：

    政府疏解
    拆迁
    腾退
    清退
    整治
    违建
    群租隔断
    消防整改
    政策原因导致合同自动终止
    租客不得索赔

这是第一版最重要的高风险类别之一。

### 3.2 居住安宁与入室风险

核心问题：

    房东 / 管理方能不能随便进房？

典型风险：

    随时进入
    无需通知
    必要时进入
    检查房屋
    带人看房
    租客必须配合
    不配合视为违约

### 3.3 押金与费用结算风险

核心问题：

    退租时钱能不能说清楚？

典型风险：

    押金退还时间不清
    扣押金条件不清
    押金凭证要求过严
    正常损耗未区分
    水电燃气费用结算不清
    管理费 / 服务费不清

### 3.4 违约金与滞纳金风险

核心问题：

    费用会不会因为几天延迟快速滚高？

典型风险：

    每日高额滞纳金
    无宽限期
    无提醒机制
    无上限
    几天逾期即解除合同
    违约金与押金重复扣

### 3.5 提前退租与解除风险

核心问题：

    真实生活中需要提前搬走时，会不会损失过重？

典型风险：

    提前退租固定赔一个月或两个月
    不区分原因
    房屋质量问题也算租客违约
    房东未维修也算租客违约
    政策清退也算租客违约
    押金和违约金重复扣

### 3.6 维修责任与安全责任风险

核心问题：

    房屋原本的问题会不会被算到租客头上？

典型风险：

    所有维修都由租客承担
    所有安全事故都由租客承担
    甲方不承担任何责任
    不区分自然损耗、设施老化、原有瑕疵、使用不当
    房东维修义务缺失

### 3.7 财物处理与退房交接风险

核心问题：

    退房或争议时，租客个人物品会不会被直接处理？

典型风险：

    遗留物品视为放弃
    甲方可自行处理
    无通知
    无保管期限
    无拍照清点
    贵重物品处理规则不清

### 3.8 日常管理约束风险

核心问题：

    条款本身可能合理，但后果是否过重？

典型风险：

    禁养宠物
    禁止电动车或电池入室
    不得转租
    不得改装
    配合看房
    不得改变用途
    不得留宿他人

这些通常归入中低风险，除非条款绑定“自动解除、押金不退、放弃权利、立即清退”等严重后果。

---

## 4. 风险规则数据模型建议

Phase 9C 只设计模型，Phase 9F 才实现代码。

建议数据结构：

    type ContractRiskRule = {
      riskId: ContractRiskId;
      category: ContractRiskCategory;
      priority: "high" | "mediumLow";
      userVisibleTitle: string;
      displayTag: string;
      triggerPhrases: string[];
      negativeTriggerPhrases?: string[];
      matchStrategy: "keyword" | "keyword_combo" | "pattern" | "semantic_later";
      whyItMatters: string;
      plainLanguageRisk: string;
      whatMayHappen: string;
      questionsToAsk: string[];
      saferWordingDirection: string;
      negotiationScript?: string;
      legalBasisIds: string[];
      falsePositiveNotes?: string;
    };

### 4.1 riskId 命名原则

riskId 应稳定、英文、可测试。

推荐格式：

    category_specific_problem

示例：

    policy_clearance_or_demolition_no_compensation
    landlord_entry_without_notice
    deposit_refund_unclear
    overhigh_late_fee_and_fast_termination
    early_termination_penalty_unclear
    maintenance_responsibility_overbroad
    tenant_all_safety_liability
    left_items_disposal_without_notice

不要使用：

    risk1
    highRiskA
    illegalClause
    badContract
    unsafeLaw
    overlordClause

### 4.2 category 建议

    housing_stability
    entry_privacy
    deposit_fee
    penalty_termination
    maintenance_safety
    property_handover
    daily_management

### 4.3 displayTag 建议

优先使用人话：

    最先问清楚
    建议写进合同
    容易扯皮
    知道重点即可

不要在 UI 上大量使用：

    high
    mediumLow
    legalRisk
    complianceRisk

### 4.4 matchStrategy 建议

第一版不做复杂 NLP。建议使用：

    keyword：单关键词触发
    keyword_combo：多个关键词组合触发
    pattern：简单正则或数值阈值
    semantic_later：后续再由 AI 或 embedding 辅助，不进入 Phase 9F 第一版

示例：

    “政府疏解” + “自动终止”
    “无需通知” + “进入”
    “每日” + “8%”
    “押金” + “视房屋情况”
    “遗留物品” + “视为放弃”

---

## 5. 高风险规则第一版

### 5.1 政府疏解 / 清退 / 拆迁 / 腾退无补偿

riskId：

    policy_clearance_or_demolition_no_compensation

category：

    housing_stability

priority：

    high

displayTag：

    最先问清楚

userVisibleTitle：

    这套房可能住不稳

triggerPhrases：

    政府疏解
    政策原因
    政府要求
    拆迁
    腾退
    清退
    整治
    违建
    合同自动终止
    无条件服从
    不得索赔
    不得主张赔偿
    不承担赔偿责任
    乙方不得因此向甲方主张任何赔偿责任

matchStrategy：

    keyword_combo

建议组合：

    出现 “政府疏解 / 拆迁 / 腾退 / 清退 / 整治 / 违建 / 政策原因” 任一
    且出现 “自动终止 / 无条件服从 / 不得索赔 / 不得主张赔偿 / 不承担赔偿责任” 任一

whyItMatters：

    这类条款可能意味着房源存在被清退、拆除、腾退、整治或无法稳定出租的风险。它不只是结算问题，而是房源稳定性问题。

plainLanguageRisk：

    这不是普通备注。它可能意味着如果房子因为政策、清退、拆迁、腾退或整治不能继续住，合同会直接结束，而你很难要求额外补偿。

whatMayHappen：

    即使对方退还部分租金和押金，你仍然可能承担临时搬家、短期住宿、重新找房、中介费、通勤变化和请假处理等损失。这些损失事后通常很难追回。

questionsToAsk：

    这套房是否属于违法建设、群租隔断、宿舍改造或政策整治范围？
    近期是否收到过街道、社区、住建、城管、消防、公安或其他部门的整改、清退、拆除、腾退通知？
    如果因政策原因提前终止，最少提前几天通知？
    未住期间租金是否全额退？
    押金是否全额退？
    临时搬家、短期住宿、重新找房等合理损失是否有协商机制？
    如果出租方签约前已知或应知风险却没有告知，责任如何承担？

saferWordingDirection：

    如因政府疏解、拆迁、腾退、清退、整治或其他非乙方原因导致合同提前终止，甲方应及时通知乙方，并给予乙方合理搬离时间；甲方应退还乙方未实际居住期间的租金、应退押金及其他未发生费用。若甲方在签约前已知或应知该房屋存在上述风险但未如实告知，导致乙方产生搬家、临时住宿、重新找房等合理损失的，双方应就补偿事宜另行协商或按法律规定处理。

legalBasisIds：

    housing-rental-regulation-article-7
    housing-rental-regulation-article-9
    housing-rental-regulation-article-12
    civil-code-contract-termination-settlement
    civil-code-force-majeure-notice-mitigation
    civil-code-change-of-circumstances

falsePositiveNotes：

    如果条款只是一般不可抗力表述，并明确写清通知、退费、押金和合理搬离时间，风险可降级。若同时出现不得索赔、无条件服从、自动终止等表述，应保持高风险。

---

### 5.2 房东 / 管理方无需通知随时进房

riskId：

    landlord_entry_without_notice

category：

    entry_privacy

priority：

    high

displayTag：

    最先问清楚

userVisibleTitle：

    房东或管理方不能想进就进

triggerPhrases：

    随时进入
    无需通知
    不必通知
    必要时进入
    有权进入房间
    进入房屋检查
    乙方应予配合
    无需承租方同意
    管理方有权进入
    带人看房

matchStrategy：

    keyword_combo

建议组合：

    “进入 / 进房 / 入室 / 检查 / 看房” 任一
    且 “无需通知 / 随时 / 不必通知 / 无需同意 / 应予配合” 任一

whyItMatters：

    该类条款可能影响租客的居住安宁、隐私边界和财物安全。

plainLanguageRisk：

    普通检查可以配合，但不能让对方拥有想进就进的权利。租房期间，房子虽然不是你的产权，但它是你的居住空间。

whatMayHappen：

    你不在家时，对方可能进入房间、带人看房或检查物品。一旦发生隐私争议或物品丢失，很难说清责任。

questionsToAsk：

    非紧急情况是否需要提前通知？
    提前多久通知？
    是否必须经过承租人确认？
    是否必须承租人在场？
    什么情况才算紧急情况？
    能否删除“无需通知”或“随时进入”的表述？

saferWordingDirection：

    非紧急情况下，甲方或管理方进入房屋应提前通知乙方，并经乙方确认；紧急维修、漏水、火灾等危及房屋或人身安全的情况除外。

legalBasisIds：

    housing-rental-regulation-article-9
    beijing-housing-rental-regulation-lessor-obligation

falsePositiveNotes：

    如果条款明确限定为火灾、漏水、抢修等紧急情况，且要求事后通知，可不判为高风险。若普通检查、看房也无需通知，应判为高风险。

---

### 5.3 押金退还与扣减不清

riskId：

    deposit_refund_unclear

category：

    deposit_fee

priority：

    high

displayTag：

    建议写进合同

userVisibleTitle：

    押金可能退得很被动

triggerPhrases：

    押金
    保证金
    视房屋情况退还
    验收后退还
    扣除费用
    不予退还
    不予处理
    保证金单据
    合同原件
    结清费用
    房屋损坏
    清洁费
    维修费

matchStrategy：

    keyword_combo

建议组合：

    “押金 / 保证金” 任一
    且 “视房屋情况 / 扣除 / 不予退还 / 不予处理 / 单据 / 验收” 任一

whyItMatters：

    押金是租房纠纷高发点。合同如果不写清返还时间、扣减条件、凭证要求和自然损耗处理，退租时租客容易处于被动。

plainLanguageRisk：

    合同写了押金会退，不代表一定好退。真正要看的是多久退、什么能扣、凭什么扣。

whatMayHappen：

    退租时，对方可能以卫生、墙面、家具磨损、费用未结清、单据缺失等理由拖延或扣押金。如果没有凭证要求和时间限制，你很难反驳。

questionsToAsk：

    退房交接后几天内退押金？
    哪些情况可以扣押金？
    扣押金是否必须提供照片、维修单或费用凭证？
    正常使用产生的自然损耗是否不扣押金？
    押金单据遗失时，能否用转账记录、收据照片或合同记录替代？
    押金能否和违约金重复扣？

saferWordingDirection：

    押金应在房屋交接完成并结清实际费用后若干日内退还；如需扣除，应说明扣除原因并提供相应凭证；正常使用产生的自然损耗不作为扣押金理由。

legalBasisIds：

    housing-rental-regulation-article-10
    beijing-housing-rental-regulation-contract-content-deposit

falsePositiveNotes：

    如果合同已明确押金返还时间、扣减情形、凭证要求和自然损耗处理，可降级为中低风险或不提示。

---

### 5.4 每日高额滞纳金 + 短期解除合同

riskId：

    overhigh_late_fee_and_fast_termination

category：

    penalty_termination

priority：

    high

displayTag：

    最先问清楚

userVisibleTitle：

    逾期费用可能滚得很快

triggerPhrases：

    滞纳金
    违约金
    每迟延一日
    每逾期一日
    每日
    8%
    5%
    3%
    逾期超过五日
    逾期超过三日
    甲方有权解除合同
    收回房屋
    单方解除

matchStrategy：

    pattern

建议规则：

    出现 “每日 / 每迟延一日 / 每逾期一日”
    且出现百分比或高额固定费用
    或同时出现 “逾期超过三日 / 五日” + “解除合同 / 收回房屋”

whyItMatters：

    逾期交租需要承担责任可以理解，但如果滞纳金比例过高、没有宽限期、没有提醒机制，还绑定快速解除合同，租客可能因短期延迟承担明显过重后果。

plainLanguageRisk：

    真正的问题不是晚交租不用负责，而是几天延迟可能迅速变成大额费用，甚至被直接解除合同。

whatMayHappen：

    因工资晚发、节假日转账延迟、忘记日期等原因晚交几天，对方可能按合同要求收取高额滞纳金，并同时主张解除合同。

questionsToAsk：

    是否有 1—3 天宽限期？
    逾期前是否会提醒？
    滞纳金是否有上限？
    偶发晚交几天是否会直接解除合同？
    是否可以先催告再解除？
    滞纳金和违约金是否会重复计算？

saferWordingDirection：

    乙方逾期支付租金的，甲方应先提醒；超过宽限期仍未支付的，乙方承担合理违约责任；违约金或滞纳金总额应设置上限。

legalBasisIds：

    civil-code-liquidated-damages-adjustment
    civil-code-rent-arrears-reasonable-period

falsePositiveNotes：

    如果逾期责任设置了合理宽限期、提醒流程和上限，可降级。若比例极高且绑定快速解除，应保持高风险。

---

### 5.5 提前退租补偿过重且无例外

riskId：

    early_termination_penalty_unclear

category：

    penalty_termination

priority：

    high

displayTag：

    最先问清楚

userVisibleTitle：

    提前退租可能损失很大

triggerPhrases：

    提前退租
    提前解除合同
    提前三十天
    支付一个月租金
    支付两个月租金
    补偿金
    违约金
    特殊情况退房
    不予退还押金
    押金不退

matchStrategy：

    keyword_combo

建议组合：

    “提前退租 / 提前解除 / 特殊情况退房” 任一
    且 “一个月租金 / 两个月租金 / 补偿金 / 违约金 / 押金不退” 任一

whyItMatters：

    提前退租是高频真实场景。工作变动、家庭变化、房屋质量、维修不及时、噪音、政策原因都可能导致提前搬走。如果合同不区分原因，租客可能在非自身原因下仍被要求赔偿。

plainLanguageRisk：

    这条真正麻烦的是把提前退租写得太死。以后不管为什么搬走，对方都可能拿合同说你违约。

whatMayHappen：

    即使因为房屋漏水、设施损坏、维修拖延、噪音严重或政策原因导致你想退租，对方仍可能要求你支付一个月或两个月租金，并扣押金。

questionsToAsk：

    如果是房屋质量问题导致退租，还要赔吗？
    如果甲方维修不及时导致无法正常居住，能否解除合同？
    如果提前通知并协助找新租客，补偿金能否减少？
    押金和补偿金会不会重复扣？
    政策原因导致退租如何处理？

saferWordingDirection：

    如因房屋质量、甲方未及时维修、甲方违约、政策原因或其他不可归责于乙方的原因导致合同解除，乙方不承担或相应减少提前退租补偿。

legalBasisIds：

    civil-code-contract-termination-settlement
    civil-code-lessor-maintenance-obligation
    civil-code-change-of-circumstances

falsePositiveNotes：

    如果条款明确区分乙方违约、甲方违约、房屋质量、不可抗力和协商解除，可降级。

---

### 5.6 维修责任过宽

riskId：

    maintenance_responsibility_overbroad

category：

    maintenance_safety

priority：

    high

displayTag：

    建议写进合同

userVisibleTitle：

    别把房子原本的问题背到自己身上

triggerPhrases：

    房屋及附属设施损坏
    由乙方负责维修
    乙方承担全部费用
    一切维修费用
    所有损坏
    自行维修
    甲方不负责维修

matchStrategy：

    keyword_combo

建议组合：

    “维修 / 损坏 / 设施 / 家电 / 管道 / 门窗” 任一
    且 “乙方承担 / 全部费用 / 甲方不负责 / 自行维修” 任一

whyItMatters：

    房屋和设施损坏不一定都是租客造成的。自然损耗、设施老化、原有瑕疵和房东维修义务需要区分。

plainLanguageRisk：

    你应该为自己使用不当造成的损坏负责，但不应该替房屋原本的问题背锅。

whatMayHappen：

    空调老化、管道漏水、热水器故障、门窗损坏等问题，可能被合同概括性地算到租客头上。

questionsToAsk：

    家电自然老化坏了谁修？
    入住前已有问题怎么算？
    水管、墙体、门窗等房屋本体问题谁负责？
    维修前是否需要双方确认责任和费用？
    能否做入住设施状态清单？

saferWordingDirection：

    应区分自然损耗、房屋原有瑕疵、设施老化和承租人使用不当。因乙方使用不当造成损坏的，由乙方承担；因房屋原有问题、自然老化或甲方未履行维修义务导致的维修，应由责任方承担。

legalBasisIds：

    civil-code-lessor-maintenance-obligation
    beijing-housing-rental-regulation-maintenance-responsibility

falsePositiveNotes：

    如果合同已明确维修责任划分和入住交接清单，可降级。

---

### 5.7 租客安全责任全部转嫁

riskId：

    tenant_all_safety_liability

category：

    maintenance_safety

priority：

    high

displayTag：

    最先问清楚

userVisibleTitle：

    安全责任不能全部推给租客

triggerPhrases：

    人身和财产安全由乙方自行负责
    所有安全事故由乙方承担
    与甲方无关
    甲方不承担任何责任
    房间内发生事故
    高空抛物
    水电使用不当
    房间内摔倒
    一切后果自负

matchStrategy：

    keyword_combo

建议组合：

    “安全 / 事故 / 人身 / 财产 / 后果” 任一
    且 “乙方自行负责 / 甲方无关 / 甲方不承担任何责任 / 一切后果自负” 任一

whyItMatters：

    该类条款可能试图把房屋设施、管理、维修、原有瑕疵带来的风险全部转嫁给租客。

plainLanguageRisk：

    租客当然要安全使用房屋，但不能用一句“所有安全事故都由乙方承担”免掉房东对房屋安全和维修的基本责任。

whatMayHappen：

    如果电路老化、热水器隐患、门窗损坏、墙体渗水或甲方维修不及时导致损失，对方仍可能拿合同说和甲方无关。

questionsToAsk：

    房屋设施本身存在问题导致事故，由谁负责？
    电路、水管、门窗、热水器老化问题由谁维修？
    如果甲方未及时维修导致损失，责任如何承担？
    入住前能否做安全和设施状态确认？

saferWordingDirection：

    乙方应安全、合理使用房屋及设施；因乙方使用不当造成损失的，由乙方承担。因房屋原有瑕疵、设施老化或甲方未履行维修义务导致的损失，应由责任方承担。

legalBasisIds：

    housing-rental-regulation-article-7
    civil-code-format-clause-liability
    civil-code-personal-injury-exemption-invalid

falsePositiveNotes：

    如果条款只要求租客对自身不当使用负责，并未免除甲方房屋安全与维修责任，可降级。

---

### 5.8 遗留物品直接视为放弃

riskId：

    left_items_disposal_without_notice

category：

    property_handover

priority：

    high

displayTag：

    容易扯皮

userVisibleTitle：

    退房时个人物品不能被直接处理

triggerPhrases：

    遗留物品
    视为放弃
    甲方自行处理
    有权处理
    不承担责任
    逾期不搬
    未搬清
    放弃一切权利
    乙方物品

matchStrategy：

    keyword_combo

建议组合：

    “遗留物品 / 未搬清 / 乙方物品 / 逾期不搬” 任一
    且 “视为放弃 / 自行处理 / 有权处理 / 不承担责任” 任一

whyItMatters：

    该类条款可能导致租客证件、电子产品、贵重物品或生活用品被直接处理，且缺少通知、清点和保管流程。

plainLanguageRisk：

    退房时东西没搬完，不应该立刻等于全部放弃。尤其是贵重物品、证件、电子产品，必须有通知和保管流程。

whatMayHappen：

    因时间冲突、沟通误会、突发情况没及时搬完东西，对方可能直接处理遗留物品，事后很难追回。

questionsToAsk：

    如果有遗留物品，是否会先通知？
    会保管多久？
    是否会拍照清点？
    贵重物品和证件怎么处理？
    是否有宽限期？

saferWordingDirection：

    如乙方遗留物品，甲方应通知乙方限期取回；逾期未取的，可按约定处理。贵重物品或证件类物品应尽量妥善保管并通知乙方。

legalBasisIds：

    civil-code-contract-termination-settlement
    civil-code-property-protection-general

falsePositiveNotes：

    如果条款明确通知期限、保管期限、拍照清点和贵重物品处理方式，可降级。

---

## 6. 中低风险规则第一版

### 6.1 禁养宠物

riskId：

    pet_ban_overpunished

category：

    daily_management

priority：

    mediumLow

displayTag：

    知道重点即可

userVisibleTitle：

    禁养宠物本身常见，重点看后果是否过重

triggerPhrases：

    禁止养宠物
    不得饲养宠物
    宠物
    猫
    狗
    饲养动物

plainLanguageRisk：

    禁养宠物本身在租赁合同里并不少见。真正需要注意的是：是否第一次违反就解除合同、押金不退或要求立即搬离。

questionsToAsk：

    如果违反是否先提醒整改？
    是否所有情况都直接解除合同？
    是否影响押金和剩余租金？
    是否可以经甲方书面同意后例外？

saferWordingDirection：

    可约定禁止养宠物，但违约后果应有提醒、整改期限和押金处理规则。

legalBasisIds：

    beijing-model-contract-pet-management-later

---

### 6.2 禁止电动车或电池入室

riskId：

    ebike_battery_ban_overpunished

category：

    daily_management

priority：

    mediumLow

displayTag：

    知道重点即可

userVisibleTitle：

    电动车电池入室有安全逻辑，但后果要问清楚

triggerPhrases：

    电动车
    电瓶车
    电池
    室内充电
    入室充电
    禁止充电
    锂电池

plainLanguageRisk：

    禁止电动车或电池入室通常有消防安全理由。重点不是删除这条，而是确认违约后果是否过重。

questionsToAsk：

    是否第一次违反先提醒整改？
    是否所有情况都直接解除合同？
    押金和剩余租金如何处理？
    是否有指定安全充电地点？

saferWordingDirection：

    可保留安全管理要求，但建议写清提醒、整改期限和解除条件。

legalBasisIds：

    housing-rental-regulation-article-7
    fire-safety-guidance-later

---

### 6.3 不得擅自转租

riskId：

    sublease_restriction_unclear

category：

    daily_management

priority：

    mediumLow

displayTag：

    知道重点即可

userVisibleTitle：

    不得擅自转租通常合理，但例外要问清

triggerPhrases：

    不得转租
    禁止转租
    擅自转租
    转借
    分租
    留宿

plainLanguageRisk：

    不得擅自转租通常是正常管理条款。重点是经书面同意后是否可以转租，以及亲友短期居住是否会被扩大解释。

questionsToAsk：

    经甲方书面同意是否可以转租？
    亲友短期借住是否算转租？
    合租或短期留宿边界是什么？
    违反后是否先通知整改？

saferWordingDirection：

    建议写清转租、转借、短期留宿和经书面同意后的例外规则。

legalBasisIds：

    civil-code-sublease-rules

---

### 6.4 不得擅自改装

riskId：

    renovation_restriction_unclear

category：

    daily_management

priority：

    mediumLow

displayTag：

    知道重点即可

userVisibleTitle：

    不得擅自改装合理，但什么算改装要问清

triggerPhrases：

    不得改装
    不得装修
    不得改变结构
    不得增设
    不得破坏
    恢复原状

plainLanguageRisk：

    不得擅自改装通常合理。真正需要确认的是粘钩、窗帘、置物架、简单家具调整是否算改装，以及退租时是否必须恢复。

questionsToAsk：

    粘钩、窗帘、置物架是否算改装？
    需要提前书面同意的范围是什么？
    退租时是否必须恢复原状？
    如果影响不大是否可以保留？

saferWordingDirection：

    建议区分结构性改造和日常居住布置，并写清恢复原状范围。

legalBasisIds：

    civil-code-improvement-addition-rules

---

### 6.5 配合看房过于宽泛

riskId：

    showing_access_without_appointment

category：

    entry_privacy

priority：

    mediumLow

displayTag：

    容易扯皮

userVisibleTitle：

    可以配合看房，但必须提前约、合理频率

triggerPhrases：

    配合看房
    带人看房
    不续租
    影响房屋正常出租
    任何理由不配合
    视为违约

plainLanguageRisk：

    租期快结束时配合合理看房可以理解，但不能变成对方想什么时候带人来，你就必须配合。

questionsToAsk：

    是否必须提前预约？
    提前多久通知？
    是否限定合理时间段？
    是否需要承租人在场？
    每周次数能否限制？

saferWordingDirection：

    如乙方不续租，应在不影响正常生活的前提下配合甲方合理看房；甲方应提前通知，并与乙方协商具体时间。

legalBasisIds：

    housing-rental-regulation-article-9

---

## 7. 规则命中策略

### 7.1 第一版以关键词组合为主

第一版先用简单、可解释、可测试的方法：

    triggerPhrases
    keyword_combo
    pattern
    数值阈值
    negativeTriggerPhrases

不要一开始使用 embedding 或 LLM 判断风险。原因：

    不可控；
    不好测试；
    容易让 AI 变成风险等级裁判；
    与 L2 规则先行原则冲突。

### 7.2 数值风险识别

对滞纳金、违约金、提前退租补偿可做简单数值规则。

示例：

    每日滞纳金 >= 日租金 1%：提示
    每日滞纳金 >= 月租金 3%：高风险
    提前退租补偿 >= 1 个月租金：提示
    提前退租补偿 >= 2 个月租金：高风险
    逾期 3—5 日即解除：高风险

注意：

    具体阈值应作为产品规则，不写成法律结论；
    规则输出是“费用后果偏重”，不是“违法”。

### 7.3 否定和降级条件

每条高风险应配置降级提示。

示例：

    政策清退条款如果明确退剩余租金、押金、通知期限、合理搬离时间，可降级。
    入室条款如果仅限紧急维修且要求通知，可降级。
    押金条款如果写清返还期限、扣减情形、凭证和自然损耗，可降级。
    提前退租条款如果区分甲方原因、房屋质量、协商转租，可降级。
    物品处理条款如果有通知、保管期限和拍照清点，可降级。

### 7.4 多规则冲突处理

同一条款可能命中多个风险。

示例：

    政府疏解自动终止 + 不得索赔
    可命中：
      housing_stability
      termination
      compensation_waiver

第一版处理方式：

    主风险只保留一个 primary riskId
    可保留 secondarySignals
    UI 优先展示 primary risk
    DeepSeek 输入中可带 secondarySignals，但不能让 AI 自行新增 riskId

---

## 8. 法规依据映射策略

Phase 9C 不实现法规库，但每条规则必须预留 legalBasisIds。

### 8.1 legalBasisIds 的作用

legalBasisIds 用于：

    约束 DeepSeek 解释范围
    支撑用户“查看依据”
    提供面试叙事可信度
    避免模型编造法条
    为 Phase 9D 法规依据库做准备

legalBasisIds 不用于：

    输出法律结论
    判定违法
    判定无效
    预测维权结果

### 8.2 第一版依据范围

第一版建议只覆盖：

    住房租赁条例
    民法典合同编相关条款
    北京市住房租赁条例
    官方示范文本或官方租赁提示

不覆盖：

    裁判文书
    律师文章
    自媒体解读
    法律问答网站
    大规模司法案例
    全国所有地方法规

### 8.3 用户可见依据表达

前端不要写：

    本条违法
    本条无效
    本条违反第 X 条

更合适写：

    相关依据方向：
    《住房租赁条例》要求合同中明确押金返还时间和扣减情形，因此押金条款如果只写“视情况退还”，签前最好让对方补清楚。

或者：

    这类条款和《住房租赁条例》中“出租人不得擅自进入租赁住房”的方向有关，因此建议把入室检查的通知和同意条件写清楚。

---

## 9. 用户可见输出样式

### 9.1 高风险卡片

高风险卡片建议结构：

    最先问清楚｜这套房可能住不稳

    这条在说什么：
    合同写到，如果遇到政府疏解、清退或拆迁，合同自动终止，租客无条件服从且不得索赔。

    真正麻烦的是：
    这可能意味着房子本身存在不稳定出租风险。即使对方退你剩余租金和押金，你仍可能承担搬家、临时住宿、重新找房等损失。

    签之前建议你问：
    1. 这套房是否属于违法建设、群租隔断或政策整治范围？
    2. 近期是否收到过整改、清退、拆除或腾退通知？
    3. 如果政策原因提前终止，提前多久通知？
    4. 未住期间租金和押金是否全额退？
    5. 临时搬家和重新找房费用是否有协商机制？

    最好写清楚：
    如果因政策原因提前终止，甲方应提前通知，给予合理搬离时间，退还未居住期间租金和应退押金；如甲方签约前已知风险但未告知，应就合理损失协商处理。

### 9.2 中低风险列表

中低风险建议结构：

    知道重点即可｜禁养宠物

    禁养宠物本身不罕见，重点是确认是否第一次违反就解除合同、押金不退或要求立即搬离。签前可以问：是否先提醒整改？是否影响押金和剩余租金？

### 9.3 不建议展示

不建议向普通用户展示：

    riskId
    matchStrategy
    triggerPhrases
    legalBasisIds
    priority: high
    JSON
    provider
    confidence
    DeepSeek
    RAG
    reasoning

这些可以留在开发日志、架构文档或调试模式中。

---

## 10. Phase 9C 后续到代码实现的映射

Phase 9C 完成后，后续可以按以下顺序进入代码。

### Phase 9D：法规依据库最小实现计划

继续只写文档，设计：

    LegalBasis 数据模型
    legalBasisIds 命名
    官方来源核验策略
    riskId → legalBasisIds 映射
    不做向量库
    不做联网检索

### Phase 9E：文本输入与条款切分最小实现

开始功能代码，但只做：

    /contract-review 页面
    textarea
    条款切分
    敏感信息提示
    不接 AI
    不做 OCR
    不保存历史

### Phase 9F：风险规则库最小实现

实现：

    risk-rules.ts
    risk-matcher.ts
    contract-review model
    用问题合同样例做命中回归

注意：

    Phase 9F 仍不接 DeepSeek。
    先验证规则库能命中关键风险。

### Phase 9G：DeepSeek 合同解释 provider

实现：

    prompt builder
    DeepSeek provider
    schema validation
    reasoning_content 丢弃
    AI 输出人话解释

---

## 11. Phase 9C 验收标准

Phase 9C 通过标准：

    只新增 docs/architecture/phase-9c-contract-risk-rule-model.md
    不改 src 代码
    不新增 route
    不新增 API
    不新增 localStorage key
    不接 DeepSeek 合同 API
    不做 OCR / PDF / 照片
    文档明确规则库是 L2 核心
    文档明确风险优先级由规则库决定
    文档覆盖高风险与中低风险规则
    文档必须包含政府疏解 / 清退 / 拆迁 / 腾退无补偿规则
    文档必须包含随时进房、押金、滞纳金、提前退租、维修责任、安全责任、遗留物品规则
    文档必须包含中低风险规则
    文档必须定义 riskId / category / priority / triggerPhrases / legalBasisIds
    文档必须说明规则不是法律判定
    文档必须说明后续代码实现顺序
    npm.cmd run build 通过
    git status clean 后提交

---

## 12. 阶段收口判断

Phase 9C 是 Phase 9 从“概念边界”走向“可执行模型”的关键一步。

如果不先做 Phase 9C，后续很容易出现：

    风险规则临时堆叠；
    DeepSeek 自行决定风险等级；
    法规依据无法稳定映射；
    高风险和中低风险展示混乱；
    用户看到的结果像法务表格而不是人话提醒；
    政府疏解、清退、拆迁这类真实高风险被埋在普通提示里。

Phase 9C 的核心成果是：

    把真实租房合同风险，转化为稳定、可测试、可解释、可人话渲染的规则模型。