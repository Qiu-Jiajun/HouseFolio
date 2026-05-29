# Phase 9D：合同助手法规依据库最小实现计划

## 0. 阶段结论

Phase 9D 的目标是为 HouseFolio 合同助手设计第一版法规依据库方案。

本阶段只写架构文档，不写功能代码。

Phase 9D 不做：

    不新增 /contract-review 页面
    不新增组件
    不新增 API route
    不接 DeepSeek 合同接口
    不写 legal-basis.ts
    不写 risk-rules.ts
    不写 risk-matcher.ts
    不改 Settings
    不新增 localStorage key
    不做 OCR
    不做 PDF 多页扫描
    不上传合同照片
    不保存合同审读记录
    不做向量库
    不做联网检索
    不做案例库
    不做律师复核
    不输出法律结论

Phase 9D 只回答：

    法规依据库第一版应该覆盖哪些来源？
    LegalBasis 数据结构应如何设计？
    riskId → legalBasisIds 如何映射？
    官方来源、核验日期、sourceUrl 如何记录？
    为什么第一版不用向量库、不联网检索、不接数据库？
    DeepSeek 为什么只能引用输入中的 legalBasis，而不能自由编法条？
    后续 Phase 9F / 9G 如何消费这些依据？

---

## 1. Phase 9D 在整体 Phase 9 中的位置

Phase 9A 已确定产品边界：

    合同助手是签约前风险提示工具，不是 AI 律师。
    第一版从合同文本粘贴审读开始。
    不做 OCR / PDF / 合同照片。
    不输出违法、无效、维权结论。

Phase 9B 已确定 AI + RAG 架构：

    DeepSeek 是 L3 解释器。
    DeepSeek thinking mode 可启用。
    reasoning_content 不展示、不保存、不导出、不写日志。
    第一版采用 RAG-lite，不做大而全法律咨询 RAG。

Phase 9C 已确定风险规则库模型：

    风险优先级由 L2 规则库决定。
    高风险细讲，中低风险简讲。
    政府疏解 / 清退 / 拆迁 / 腾退无补偿是顶级高风险。
    每条规则预留 legalBasisIds。

Phase 9D 进一步补齐：

    legalBasisIds 到底指向什么；
    法规依据如何维护；
    DeepSeek 能引用哪些法规；
    用户看到的“依据方向”如何表达。

正确链路是：

    riskId
    → legalBasisIds[]
    → LegalBasis[]
    → ContractReviewAIInput.legalBasis
    → DeepSeek 只基于输入依据做人话解释
    → 前端折叠展示依据方向

错误链路是：

    合同全文
    → DeepSeek 自己搜索或记忆法条
    → 编造法规或错误引用
    → 输出法律结论

Phase 9D 必须防止后续走向错误链路。

---

## 2. 法规依据库的产品定位

### 2.1 它是什么

法规依据库是合同助手的“依据约束层”。

它用于：

    支撑风险提示；
    限制 DeepSeek 输出范围；
    避免模型编造法条；
    让用户知道提示不是纯 AI 自由发挥；
    为面试叙事提供可信结构；
    为后续 RAG-lite 升级保留路径。

### 2.2 它不是什么

法规依据库不是：

    法律咨询知识库
    AI 律师法规库
    自动判案依据库
    全国法律数据库
    司法案例检索库
    裁判文书分析库
    维权策略库
    自动投诉依据库

第一版只做：

    固定法规依据表
    官方来源人工核验
    riskId → legalBasisIds 映射
    DeepSeek 输入依据约束

---

## 3. 第一版法规来源范围

Phase 9D 建议第一版只覆盖四类来源。

### 3.1 全国层面：住房租赁条例

来源名称：

    住房租赁条例

用途：

    出租住房安全；
    出租人权属材料和信息核验；
    不得擅自进入租赁住房；
    押金返还时间和扣减情形；
    依法解除合同时通知和合理腾退时间；
    房源信息真实、准确、完整。

建议优先纳入条文方向：

    第七条：出租住房安全与不得危及人身安全健康
    第九条：出租人出示权属材料、配合核验、不得擅自进入
    第十条：押金数额、返还时间、扣减情形
    第十二条：解除合同时通知承租人并留出合理腾退时间
    第十六条：住房租赁企业房源信息真实、准确、完整

sourceUrl 候选：

    https://www.mee.gov.cn/zcwj/gwywj/202507/t20250722_1123995.shtml

说明：

    该链接为政府网站转载的国务院令第812号《住房租赁条例》正文。
    实现前应再次核验官方来源和条文内容。

### 3.2 全国层面：中华人民共和国民法典

来源名称：

    中华人民共和国民法典

用途：

    合同解除后的结算；
    不可抗力通知与减损；
    情势变更；
    违约金调整；
    出租人维修义务；
    租金逾期合理期限；
    转租；
    改善或增设他物；
    格式条款责任；
    人身损害免责条款无效方向。

建议优先纳入条文方向：

    第五百三十三条：情势变更
    第五百六十六条：合同解除后的处理
    第五百八十五条：违约金调整
    第五百九十条：不可抗力通知与减损
    第七百一十二条：出租人维修义务
    第七百一十五条：承租人改善或增设他物
    第七百一十六条：转租
    第七百二十二条：租金逾期与合理期限
    第四百九十六条至第四百九十八条：格式条款提示、说明与解释方向
    第五百零六条：人身损害免责条款无效方向

sourceUrl 候选：

    https://flk.npc.gov.cn/detail?id=ff808081729d1efe01729d50b5c500bf&title=%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E6%B0%91%E6%B3%95%E5%85%B8

说明：

    全国人大法律法规数据库应作为民法典优先核验来源。
    具体条文摘要应在 Phase 9D 后续实现前再次核验，避免错引。

### 3.3 地方层面：北京市住房租赁条例

来源名称：

    北京市住房租赁条例

用途：

    北京市域内住房租赁合同内容；
    违法建设等不得出租房屋；
    押金、维修责任、解除合同合理告知期限；
    出租人安全管理责任；
    承租人知悉权；
    突发事件或紧急管控措施配合。

建议优先纳入条文方向：

    第十三条：依法不得出租房屋方向
    第十四条：住房租赁合同一般内容
    与出租人安全管理责任、承租人知悉权、紧急管控相关条文

sourceUrl 候选：

    https://www.bjrd.gov.cn/rdzl/dfxfgdxb/202206/P020220607351508221969.pdf

说明：

    北京是 HouseFolio 一期叙事重点城市。
    但 Phase 9 第一版不声称全国地方规则全覆盖。
    北京依据仅在 jurisdictionHint 包含北京或示例合同明显属于北京场景时优先展示。

### 3.4 官方示范文本：北京市住房租赁合同示范文本

来源名称：

    北京市住房租赁合同示范文本

用途：

    作为押金、租金、交接、维修、示范合同结构的参考；
    不作为法律强制判断依据；
    可用于提示“官方示范文本通常如何写得更清楚”。

sourceUrl 候选：

    https://www.beijing.gov.cn/fwcj/htsfwb/shxfl/fagnwu/677b9ec6663d0d63c3bf74ff.html

说明：

    示范文本不是法律条文。
    在 LegalBasis.sourceType 中应标为 official_model_contract，而不是 official_law。

---

## 4. LegalBasis 数据模型设计

Phase 9D 不写代码，但建议后续 Phase 9F / 9G 使用如下结构。

    type LegalBasis = {
      id: LegalBasisId;
      lawName: string;
      articleNo: string;
      jurisdiction: "national" | "beijing" | "local";
      sourceType: "official_law" | "official_regulation" | "official_model_contract" | "official_guidance";
      effectiveDate?: string;
      status: "active" | "superseded" | "unknown";
      shortText: string;
      relevanceSummary: string;
      topics: LegalBasisTopic[];
      sourceUrl: string;
      lastVerifiedAt: string;
      quotePolicy: "summary_only" | "short_quote_allowed";
    };

### 4.1 id

id 应稳定、英文、可用于映射。

推荐格式：

    law-scope-article-number

示例：

    housing-rental-regulation-article-7
    housing-rental-regulation-article-9
    housing-rental-regulation-article-10
    housing-rental-regulation-article-12
    housing-rental-regulation-article-16
    civil-code-article-533
    civil-code-article-566
    civil-code-article-585
    civil-code-article-590
    civil-code-article-712
    civil-code-article-715
    civil-code-article-716
    civil-code-article-722
    civil-code-article-496-498
    civil-code-article-506
    beijing-housing-rental-regulation-article-13
    beijing-housing-rental-regulation-article-14
    beijing-model-contract-deposit-return

### 4.2 lawName

中文法规名称。

示例：

    住房租赁条例
    中华人民共和国民法典
    北京市住房租赁条例
    北京市住房租赁合同示范文本

### 4.3 articleNo

条号。

示例：

    第七条
    第九条
    第十条
    第五百八十五条
    第十四条
    示范文本提示 3

### 4.4 jurisdiction

建议第一版只用：

    national
    beijing
    local

不要一开始建复杂地区层级。上海、深圳、广州等后续再扩展。

### 4.5 sourceType

建议：

    official_law：法律，例如民法典
    official_regulation：行政法规或地方性法规，例如住房租赁条例、北京市住房租赁条例
    official_model_contract：官方示范文本
    official_guidance：官方提示、办事指南

### 4.6 shortText

shortText 是摘要，不建议第一版在产品中全文搬运法条。

原因：

    长法条会干扰用户阅读；
    过多原文展示会让产品像法律工具；
    更适合用“相关依据方向”解释；
    全文可通过 sourceUrl 交给用户自行查看。

### 4.7 relevanceSummary

说明该依据为什么和某类风险有关。

示例：

    该条与出租住房安全有关，可用于支持“房屋原有安全隐患不应全部转嫁给租客”的风险提示。
    该条与押金返还时间和扣减情形有关，可用于支持“押金条款应写清楚退还期限和扣减规则”的风险提示。
    该条与不得擅自进入租赁住房有关，可用于支持“非紧急入室应提前通知并经承租人确认”的风险提示。

### 4.8 topics

建议枚举：

    housing_safety
    legal_rental_right
    landlord_entry
    deposit_return
    termination_notice
    rent_arrears
    late_fee
    early_termination
    maintenance
    sublease
    renovation
    format_clause
    personal_injury_exemption
    policy_clearance
    item_disposal
    model_contract

### 4.9 sourceUrl

必须使用官方来源或政府来源。

禁止第一版使用：

    自媒体文章
    律所公众号
    百度百科
    法律问答网站
    非官方转载
    未知来源 PDF
    裁判文书二次解读

如果暂时没有官方来源，应标为 sourceUrl 待核验，不得进入 DeepSeek 输入。

### 4.10 lastVerifiedAt

必须保留最后核验日期。

第一版建议使用人工核验日期，例如：

    2026-05-29

后续每次更新法规库，应同步更新 lastVerifiedAt。

### 4.11 quotePolicy

建议第一版默认：

    summary_only

只在必要时允许：

    short_quote_allowed

原因：

    用户需要的是签约前提醒，不是法条全文阅读器；
    避免过度法律化；
    减少误导用户以为系统在做完整法律审查。

---

## 5. 第一版 LegalBasis 清单建议

Phase 9D 建议后续实现第一版 LegalBasis 时，先加入以下条目。

### 5.1 住房租赁条例

#### housing-rental-regulation-article-7

lawName：

    住房租赁条例

articleNo：

    第七条

topics：

    housing_safety
    maintenance
    personal_injury_exemption

relevanceSummary：

    与出租住房安全、建筑、消防、燃气、室内装修等强制标准有关。可用于支持房屋安全责任不能全部转嫁给租客、出租住房应具备基本安全条件的风险提示。

适用风险：

    tenant_all_safety_liability
    maintenance_responsibility_overbroad
    policy_clearance_or_demolition_no_compensation

#### housing-rental-regulation-article-9

topics：

    legal_rental_right
    landlord_entry

relevanceSummary：

    与出租人出示权属材料、配合承租人核验、不得擅自进入租赁住房有关。可用于支持入室检查边界、出租权利核验、政策清退风险事前追问。

适用风险：

    landlord_entry_without_notice
    showing_access_without_appointment
    policy_clearance_or_demolition_no_compensation

#### housing-rental-regulation-article-10

topics：

    deposit_return

relevanceSummary：

    与押金数额、返还时间、扣减押金情形等事项有关。可用于支持押金条款应写清退还期限、扣减条件和凭证要求。

适用风险：

    deposit_refund_unclear

#### housing-rental-regulation-article-12

topics：

    termination_notice
    policy_clearance

relevanceSummary：

    与出租人依法解除合同时通知承租人、为腾退留出合理时间有关。可用于支持政策清退、自动解除、快速腾退等条款应写明通知和合理搬离安排。

适用风险：

    policy_clearance_or_demolition_no_compensation
    early_termination_penalty_unclear
    auto_termination_overbroad_later

#### housing-rental-regulation-article-16

topics：

    legal_rental_right
    policy_clearance

relevanceSummary：

    与住房租赁企业房源信息真实、准确、完整有关。可用于支持“如果出租方或机构已知房源存在清退、整治或无法稳定出租风险，应在签约前如实说明”的产品提示方向。

适用风险：

    policy_clearance_or_demolition_no_compensation

### 5.2 民法典

#### civil-code-article-533

topics：

    policy_clearance
    early_termination

relevanceSummary：

    与合同基础条件发生重大变化后的重新协商、变更或解除方向有关。用于支持政策变化或清退导致合同履行基础变化时，不宜只写租客无条件承担全部后果的提示。

适用风险：

    policy_clearance_or_demolition_no_compensation
    early_termination_penalty_unclear

#### civil-code-article-566

topics：

    termination_notice
    deposit_return
    policy_clearance

relevanceSummary：

    与合同解除后的履行终止、恢复原状、补救措施、损失处理方向有关。用于支持合同提前终止时应写清剩余租金、押金和费用结算。

适用风险：

    policy_clearance_or_demolition_no_compensation
    early_termination_penalty_unclear
    left_items_disposal_without_notice

#### civil-code-article-585

topics：

    late_fee
    early_termination

relevanceSummary：

    与违约金约定和过高违约金调整方向有关。用于支持每日高额滞纳金、提前退租高额违约金应设置合理边界和上限的提示。

适用风险：

    overhigh_late_fee_and_fast_termination
    early_termination_penalty_unclear

#### civil-code-article-590

topics：

    policy_clearance
    termination_notice

relevanceSummary：

    与不可抗力导致合同不能履行时的通知、证明和减损方向有关。用于支持政策原因提前终止时应写明通知、证明、退费和减损安排。

适用风险：

    policy_clearance_or_demolition_no_compensation

#### civil-code-article-712

topics：

    maintenance

relevanceSummary：

    与出租人维修义务方向有关。用于支持房屋原有瑕疵、自然老化、设施故障不应概括性全部由租客承担。

适用风险：

    maintenance_responsibility_overbroad
    tenant_all_safety_liability
    early_termination_penalty_unclear

#### civil-code-article-715

topics：

    renovation

relevanceSummary：

    与承租人改善或增设他物有关。用于支持改装、增设、恢复原状等条款应明确边界。

适用风险：

    renovation_restriction_unclear

#### civil-code-article-716

topics：

    sublease

relevanceSummary：

    与承租人转租规则方向有关。用于支持不得擅自转租条款的合理边界和书面同意机制。

适用风险：

    sublease_restriction_unclear

#### civil-code-article-722

topics：

    rent_arrears
    termination_notice

relevanceSummary：

    与承租人无正当理由未支付租金、出租人可请求合理期限内支付、逾期可解除合同方向有关。用于支持租金逾期不宜直接快速解除，最好设置催告或合理期限。

适用风险：

    overhigh_late_fee_and_fast_termination

#### civil-code-article-496-498

topics：

    format_clause

relevanceSummary：

    与格式条款提示说明、解释规则和不利解释方向有关。用于支持明显加重租客责任、免除出租方责任的格式条款应重点提示用户追问。

适用风险：

    tenant_all_safety_liability
    landlord_entry_without_notice
    policy_clearance_or_demolition_no_compensation
    left_items_disposal_without_notice

#### civil-code-article-506

topics：

    personal_injury_exemption
    format_clause

relevanceSummary：

    与造成对方人身损害的免责条款无效方向有关。用于支持“所有安全事故均由租客承担、甲方一概无责”的条款应高度谨慎。

适用风险：

    tenant_all_safety_liability

### 5.3 北京市住房租赁条例

#### beijing-housing-rental-regulation-article-13

topics：

    legal_rental_right
    housing_safety
    policy_clearance

relevanceSummary：

    与北京市依法不得出租房屋方向有关。用于支持用户签前核实房屋是否存在违法建设、违规隔断、消防或政策整治风险。

适用风险：

    policy_clearance_or_demolition_no_compensation
    tenant_all_safety_liability

#### beijing-housing-rental-regulation-article-14

topics：

    deposit_return
    maintenance
    termination_notice
    contract_content

relevanceSummary：

    与住房租赁合同一般应包括押金、维修责任、解除合同合理告知期限、违约责任等内容有关。用于支持押金、维修、解除等条款应写清楚。

适用风险：

    deposit_refund_unclear
    maintenance_responsibility_overbroad
    early_termination_penalty_unclear
    policy_clearance_or_demolition_no_compensation

### 5.4 北京市住房租赁合同示范文本

#### beijing-model-contract-deposit-return

topics：

    deposit_return
    model_contract

relevanceSummary：

    官方示范文本可作为押金返还、租金押金结算、合同交接流程的写法参考。注意：示范文本不是法律条文，不能作为违法或无效判断依据。

适用风险：

    deposit_refund_unclear

---

## 6. riskId → legalBasisIds 映射建议

Phase 9D 建议第一版映射如下。

### 6.1 policy_clearance_or_demolition_no_compensation

    housing-rental-regulation-article-7
    housing-rental-regulation-article-9
    housing-rental-regulation-article-12
    housing-rental-regulation-article-16
    civil-code-article-533
    civil-code-article-566
    civil-code-article-590
    civil-code-article-496-498
    beijing-housing-rental-regulation-article-13
    beijing-housing-rental-regulation-article-14

### 6.2 landlord_entry_without_notice

    housing-rental-regulation-article-9
    civil-code-article-496-498

### 6.3 deposit_refund_unclear

    housing-rental-regulation-article-10
    beijing-housing-rental-regulation-article-14
    beijing-model-contract-deposit-return

### 6.4 overhigh_late_fee_and_fast_termination

    civil-code-article-585
    civil-code-article-722
    civil-code-article-496-498

### 6.5 early_termination_penalty_unclear

    civil-code-article-566
    civil-code-article-585
    civil-code-article-712
    beijing-housing-rental-regulation-article-14

### 6.6 maintenance_responsibility_overbroad

    housing-rental-regulation-article-7
    civil-code-article-712
    beijing-housing-rental-regulation-article-14

### 6.7 tenant_all_safety_liability

    housing-rental-regulation-article-7
    civil-code-article-506
    civil-code-article-496-498
    beijing-housing-rental-regulation-article-13

### 6.8 left_items_disposal_without_notice

    civil-code-article-566
    civil-code-article-496-498

### 6.9 pet_ban_overpunished

    civil-code-article-496-498

### 6.10 ebike_battery_ban_overpunished

    housing-rental-regulation-article-7

### 6.11 sublease_restriction_unclear

    civil-code-article-716

### 6.12 renovation_restriction_unclear

    civil-code-article-715

### 6.13 showing_access_without_appointment

    housing-rental-regulation-article-9

---

## 7. DeepSeek 消费法规依据的方式

### 7.1 DeepSeek 输入

ContractReviewAIInput 中应包含：

    findings
    legalBasis

其中 findings 内包含：

    riskId
    clauseId
    priority
    legalBasisIds

legalBasis 内包含：

    id
    lawName
    articleNo
    shortText
    relevanceSummary

DeepSeek 不应接收：

    完整法规库
    无关法条
    未核验来源
    自媒体解释
    律师文章
    裁判文书片段
    用户未确认的合同原文

### 7.2 DeepSeek 输出要求

DeepSeek 只能使用输入 legalBasis 中提供的依据。

如果某个 riskId 没有 legalBasis：

    应输出“该风险为常见租房合同风险提示，当前未提供可引用法规依据。”
    不得自行补法条。
    不得凭记忆引用条号。

### 7.3 输出风格

不要让 DeepSeek 写：

    本条违反《某法》第 X 条
    本条无效
    本条违法
    房东必须赔偿
    用户可以直接起诉
    投诉一定有效

推荐写：

    这类条款与《住房租赁条例》中关于押金返还时间和扣减情形应写清楚的要求有关，因此签前建议把退还期限、扣减条件和凭证写进合同。
    这类条款和出租人不得擅自进入租赁住房的规则方向有关，因此建议把非紧急入室的通知和同意条件写清楚。
    这类条款涉及合同提前终止后的通知、腾退和费用结算问题，因此建议在合同中补充未住期间租金、押金和合理搬离时间安排。

---

## 8. 前端展示法规依据的方式

### 8.1 默认折叠

前端不应默认把法条铺满页面。建议：

    默认展示人话解释；
    法规依据放在折叠区；
    标题用“相关依据方向”；
    用户点击后查看。

### 8.2 推荐展示样式

示例：

    相关依据方向

    《住房租赁条例》第十条
    与押金返还时间、扣减情形有关。因此，如果合同只写“视房屋情况退还”，建议签前要求写清退还期限、扣减条件和凭证。

    《北京市住房租赁条例》第十四条
    北京市住房租赁合同一般应包含押金、维修责任、解除合同合理告知期限等内容，因此这些内容最好不要只靠口头承诺。

### 8.3 禁止展示样式

不要展示：

    AI 法律判断
    本条违法
    本条无效
    该条必然不能成立
    法院一定支持
    投诉一定有效
    建议立即维权

---

## 9. 为什么第一版不用向量库

Phase 9D 明确：第一版不做向量库。

原因：

    第一版风险类型有限；
    riskId 与法规依据可以人工稳定映射；
    向量库会增加工程复杂度；
    向量检索可能引入无关法条；
    法律类检索需要更强的核验机制；
    MVP 目标是验证合同风险提示价值，不是构建法律搜索系统；
    个人项目维护全国法规向量库成本过高。

### 9.1 未来什么时候考虑向量库

只有在满足以下条件后再考虑：

    风险规则已稳定；
    法规依据条目显著增多；
    需要支持多个城市；
    用户需要查看更多条文背景；
    有明确的法规更新维护流程；
    有能力做检索结果核验；
    不会把产品推向法律咨询平台。

### 9.2 未来可选方案

后续可考虑：

    本地 JSON + 关键词检索
    SQLite FTS
    PostgreSQL full-text search
    pgvector

但这些都不进入 Phase 9D / 9E / 9F 第一版。

---

## 10. 法规依据更新与核验流程

Phase 9D 建议后续维护流程：

    1. 只从官方来源新增 LegalBasis；
    2. 每条 LegalBasis 必须有 sourceUrl；
    3. 每条 LegalBasis 必须有 lastVerifiedAt；
    4. 每次修改 LegalBasis 必须记录 dev-log；
    5. 如果法规来源不可访问，不能新增为 active；
    6. 如果条文更新或失效，status 改为 superseded 或 unknown；
    7. DeepSeek 输入中只包含 status = active 的依据；
    8. 输出报告中不直接展示 sourceUrl，必要时提供“查看官方来源”链接；
    9. 不使用未经核验的第三方法律解读作为依据；
    10. 不把模型生成内容反写进法规依据库。

### 10.1 lastVerifiedAt 策略

第一版建议使用人工核验日期。

例如：

    lastVerifiedAt: "2026-05-29"

后续如果继续维护，应每次更新法规库时同步更新。

### 10.2 sourceUrl 策略

优先级：

    1. 全国人大法律法规数据库
    2. 中国政府网 / 国务院部门网站
    3. 地方人大 / 地方政府官网
    4. 官方示范文本页面
    5. 其他官方办事指南

不使用：

    自媒体
    律所文章
    问答社区
    百度百科
    未知 PDF
    商业法律数据库的二次摘要

---

## 11. 与 Phase 9C 风险规则的关系

Phase 9C 的每个规则都必须能映射到 legalBasisIds，但不要求每个风险都有很多依据。

### 11.1 高风险规则

高风险规则应尽量有 2—5 个 legalBasisIds 支撑。

例如政策清退风险：

    住房安全
    出租权利核验
    解除通知与合理腾退
    合同解除后结算
    情势变更或不可抗力通知减损
    格式条款责任

### 11.2 中低风险规则

中低风险可以只有 0—2 个 legalBasisIds。

例如禁养宠物：

    主要是合同约定和日常管理问题；
    可暂时仅绑定格式条款方向；
    不必强行找具体法规。

### 11.3 无依据风险处理

如果某条规则暂时无可靠法规依据：

    legalBasisIds 可为空；
    UI 不显示法规依据；
    DeepSeek 不得自行补；
    仍可作为常见租房风险提示输出。

---

## 12. 阶段验收标准

Phase 9D 通过标准：

    只新增 docs/architecture/phase-9d-contract-legal-basis-plan.md
    不改 src 代码
    不新增 route
    不新增 API
    不新增 localStorage key
    不接 DeepSeek 合同 API
    不做 OCR / PDF / 照片
    文档明确第一版采用固定法规依据表
    文档明确不做向量库、不联网检索、不做案例库
    文档定义 LegalBasis 数据模型
    文档定义 sourceUrl / lastVerifiedAt / status
    文档覆盖住房租赁条例、民法典、北京市住房租赁条例、北京市示范合同
    文档定义 riskId → legalBasisIds 映射
    文档明确 DeepSeek 只能引用输入 legalBasis
    文档明确不得编法条、不得输出法律结论
    npm.cmd run build 通过
    git status clean 后提交

---

## 13. 阶段收口判断

Phase 9D 是 Phase 9 从“规则模型”走向“可引用依据”的关键一步。

它的价值不在于马上写法规库代码，而在于建立三条约束：

    第一，法规依据必须来自官方来源和人工核验；
    第二，风险规则与法规依据之间必须有稳定映射；
    第三，DeepSeek 只能在输入依据范围内做人话解释。

这样后续 Phase 9F / 9G 才能避免：

    AI 编造法条；
    用户误以为系统作出法律结论；
    合同助手变成法律咨询产品；
    法规依据无法维护；
    法规展示压过人话风险提示。

Phase 9D 的最终判断：

    第一版只做 RAG-lite：固定法规依据表 + riskId 映射 + DeepSeek 输入约束。
    不做向量库，不联网检索，不做案例库，不做法律咨询 RAG。