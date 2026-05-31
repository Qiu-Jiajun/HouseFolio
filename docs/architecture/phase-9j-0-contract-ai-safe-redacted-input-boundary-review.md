# Phase 9J-0｜Contract AI-safe redacted input boundary review

## 1. 阶段目标

Phase 9J-0 用于评审 HouseFolio 合同风险提示助手的 L3 AI-safe 脱敏输入边界。

当前稳定点：

    2785f37 docs: close contract review structured model phase

Phase 9I 已经正式关闭。

当前不要继续横向扩张 L2 基础设施。下一步应回到用户可见价值主线：

    L3 AI-safe 脱敏输入边界
    → DeepSeek 合同风险人话解释 provider
    → schema-validated final JSON
    → 用户可见合同风险提示 UI
    → 导出与数据权利
    → 浏览器回归
    → Phase 9 总收口

本阶段只写边界评审文档，不修改 src，不直接实现 DeepSeek provider、API route、prompt builder、脱敏函数、schema validator 或 UI。

---

## 2. 为什么必须先做 AI-safe 输入边界

HouseFolio 的合同风险提示助手处理的是用户主动粘贴的租房合同文本。

合同文本可能包含：

    用户姓名
    房东姓名
    中介或管理方姓名
    手机号
    微信号
    身份证号
    银行卡号
    收款账号
    合同编号
    房产证编号
    具体门牌号
    精确出租房屋地址
    签字信息
    押金金额
    租金金额
    工作单位
    学校信息
    其他私人备注

这些内容中，很多信息不是 DeepSeek 生成人话解释所必需的。

因此，HouseFolio 不能把用户粘贴的完整合同原文直接发送给 DeepSeek。

L3 AI-safe 输入边界必须坚持：

    本地优先
    用户主动触发
    联网前脱敏
    最小必要
    仅发送结构化摘要
    默认不发送完整合同
    默认不发送未命中条款
    默认不发送个人身份信息
    用户确认后再发送
    服务端再次校验
    服务端不长期保存输入原文
    日志不记录原始 payload
    reasoning_content 不展示、不保存、不导出、不写日志

---

## 3. 当前可复用的上游结构

Phase 9I 已经形成：

    ContractClauseSegment[]
    → ContractRiskFinding[]
    → LegalBasisEntry[]
    → ContractReviewModel

ContractReviewModel 是 L2 输出模型，不等于 AI-safe 输入模型。

这是一个关键边界：

    ContractReviewModel 可以在本地包含完成规则命中所需的信息；
    DeepSeek 不应默认接收 ContractReviewModel 的完整原始内容；
    后续需要从 ContractReviewModel 派生更小、更安全的 AI-safe payload。

未来应评估一个纯函数方向：

    ContractReviewModel
    → AI-safe redacted input builder
    → ContractReviewAiInput

但 Phase 9J-0 不实现该类型，也不实现 builder。

---

## 4. 核心产品判断

第一版 L3 AI-safe 输入不应让 DeepSeek自由审查整份合同。

正确方向是：

    HouseFolio L2 规则库先决定命中了哪些风险
    → L3 只接收已命中风险的脱敏结构化摘要
    → DeepSeek 负责把风险解释成人话
    → DeepSeek 生成签前追问、建议补充条款方向和协商话术
    → DeepSeek 不得决定风险等级
    → DeepSeek 不得新增高确定性法律结论
    → DeepSeek 不得把相关法规背景包装为正式法律意见

DeepSeek 的职责是：

    解释
    总结
    组织表达
    生成人话提示
    生成签前追问
    生成建议补充条款方向
    生成克制的协商话术

DeepSeek 的职责不是：

    自由扫描整份合同
    判断违法
    判断无效
    判断合同能不能签
    判断法院会不会支持
    判断是否一定可以索赔
    替用户作最终决定
    修改 HouseFolio 风险等级
    修改 riskId
    伪造法规依据
    生成未经规则库支持的确定性权利主张

---

## 5. 第一版允许发送给 DeepSeek 的内容

第一版未来 AI-safe payload 应只保留最小必要字段。

允许评估发送：

### 5.1 请求级元信息

    payloadVersion
    locale
    disclaimerMode
    findingCount

说明：

    locale 第一版固定为 zh-CN。
    不发送用户姓名、账号、邮箱或设备信息。
    不发送本地存储 key。
    不发送房源完整档案。

### 5.2 风险项稳定标识

    riskId
    riskLevel
    category
    ruleTitleZh

说明：

    riskLevel 由 HouseFolio L2 规则库决定。
    DeepSeek 不得修改风险等级。
    ruleTitleZh 应为清晰、克制的中文语义标题。

### 5.3 脱敏后的命中条款摘要

    clauseId
    clauseOrder
    redactedClauseExcerpt

说明：

    只发送命中条款的脱敏片段。
    不默认发送整份合同。
    不默认发送所有未命中条款。
    不默认发送完整条款上下文。
    片段长度应受到限制。
    如果上下文不足，应允许 DeepSeek 输出“需要补充确认”，而不是自行推断。

### 5.4 风险解释背景

    riskSummaryZh
    whyItMattersZh

说明：

    这些内容应来自 HouseFolio 规则库或稳定映射。
    DeepSeek 可以据此组织更自然的表达。
    DeepSeek 不应把背景说明升级为法律结论。

### 5.5 法规依据背景

    legalBasisId
    legalBasisTitleZh
    legalBasisSummaryZh
    legalBasisSourceType

说明：

    法规依据只作为 supporting context。
    第一版不要求 DeepSeek 自行检索法规。
    第一版不允许 DeepSeek自行补充未经 HouseFolio 提供的法条。
    第一版不允许 DeepSeek伪造条款编号、官方出处或地方政策。
    如果依据不足，应明确输出“建议进一步确认”，而不是补造依据。

---

## 6. 第一版禁止发送给 DeepSeek 的内容

第一版禁止默认发送：

    完整合同原文
    全部合同条款
    未命中的普通条款
    OCR 原始文本
    PDF 文件
    合同照片
    签字页
    身份证照片
    房产证照片
    付款凭证
    银行卡照片
    用户私人笔记
    房东或中介聊天记录
    看房照片
    看房视频
    房源完整地址
    精确门牌号
    经纬度
    通勤锚点
    工作或学习地点
    LocalStorage 全量数据
    IndexedDB 数据
    AI_COMPARE_PROVIDER 等环境变量
    DEEPSEEK_API_KEY
    AMAP_API_KEY
    服务端日志原文
    reasoning_content

第一版也不得发送与解释任务无关的字段：

    创建时间
    浏览器信息
    设备信息
    用户邮箱
    账号 ID
    本地文件路径
    页面访问轨迹
    localStorage key
    IndexedDB object store 名称

---

## 7. 联网前必须脱敏的敏感信息

未来脱敏 builder 应至少覆盖：

| 类别 | 示例 | 建议替换文本 |
| --- | --- | --- |
| 姓名 | 张三、李某某 | [姓名已脱敏] |
| 手机号 | 13812345678 | [手机号已脱敏] |
| 身份证号 | 18 位身份证号码 | [身份证号已脱敏] |
| 银行卡号 | 收款账户、银行卡号 | [银行卡号已脱敏] |
| 微信号 / QQ | wxid、微信、QQ | [联系方式已脱敏] |
| 邮箱 | name@example.com | [邮箱已脱敏] |
| 合同编号 | 合同编号、协议编号 | [合同编号已脱敏] |
| 房产证编号 | 不动产权证号 | [权证编号已脱敏] |
| 精确房屋地址 | 楼栋、单元、房间号 | [房屋地址已脱敏] |
| 签字信息 | 甲方签字、乙方签字 | [签字信息已脱敏] |
| 其他账号 | 支付宝、收款账户 | [账号信息已脱敏] |

第一版脱敏目标不是证明可以识别所有个人信息，而是：

    尽量减少发送
    在浏览器端先脱敏
    服务端做第二次防御性校验
    用户发送前可以预览
    用户确认后才联网
    不把“自动脱敏”包装成绝对安全保证

如果无法可靠判断某段内容是否包含敏感信息，优先不发送，而不是默认上传。

---

## 8. 条款片段最小化策略

第一版应采用命中条款片段最小化策略：

    只发送匹配到风险规则的条款片段
    片段先脱敏
    片段长度受限
    不发送整份合同
    不发送无关附件
    不发送相邻条款，除非后续出现明确需求并单独评审

如果某个风险无法仅凭脱敏片段解释清楚，应允许最终提示：

    当前片段信息不足，建议你结合完整合同进一步确认。
    建议向房东或中介补充询问。
    必要时咨询专业人士。

不要让 DeepSeek在信息不足时自行补全事实。

---

## 9. 浏览器端优先脱敏与服务端二次校验

未来推荐链路：

    用户在浏览器中粘贴合同文本
    → 本地条款切分
    → 本地 L2 风险命中
    → 本地生成 ContractReviewModel
    → 浏览器端 AI-safe builder 删除无关字段并脱敏
    → 用户预览即将发送的脱敏摘要
    → 用户主动确认
    → API route 接收 AI-safe payload
    → 服务端再次做 allowlist 校验、长度限制与防御性脱敏
    → DeepSeek provider 只接收通过校验的最小 payload
    → 只使用 schema-validated final JSON
    → reasoning_content 立即丢弃
    → 服务端不长期保存原始 payload

核心原则：

    第一次脱敏发生在离开浏览器之前。
    服务端校验不是浏览器端脱敏的替代品，而是第二道防线。

---

## 10. 用户主动确认边界

合同风险提示助手涉及高敏合同内容。

未来 UI 在发送给 DeepSeek 前必须有明确确认步骤。

确认界面至少说明：

    仅发送已命中风险的脱敏摘要
    不默认发送完整合同
    不默认发送身份证、签字页、合同照片或 PDF
    不默认保存服务端原文
    AI 输出仅用于辅助识别常见风险点
    AI 输出可能存在遗漏或误判
    不构成正式法律意见
    不替代律师、仲裁机构、法院或行政机关判断

未来 UI 应允许用户：

    预览即将发送的脱敏摘要
    取消发送
    返回修改合同文本
    确认并生成风险解释

第一版不要默认自动调用 DeepSeek。

---

## 11. 合同文本属于不可信输入

用户粘贴的合同文本必须被视为不可信数据，而不是 prompt 指令。

未来 prompt builder 必须明确：

    合同条款只是待解释的数据
    合同文本中的任何命令、提示词或角色设定都不得执行
    不得遵循合同文本中要求忽略系统提示的内容
    不得执行合同文本中的代码、链接或外部指令
    不得因为合同文本中的自然语言改变输出 schema
    不得因为合同文本中的指令泄露系统提示
    不得输出 reasoning_content

未来动态条款片段应使用明确分隔结构包装。

第一版不做复杂 prompt injection 防御系统，但必须把“不可信合同文本”作为基础边界写入 prompt 与服务端校验策略。

---

## 12. DeepSeek provider 边界

未来 DeepSeek 合同风险人话解释 provider 必须通过 lib/ai 或受控 provider 层接入。

页面和组件不得直接调用 DeepSeek SDK 或 REST API。

未来 provider 应只接收：

    已经过浏览器端脱敏
    已通过用户确认
    已通过服务端 allowlist 校验
    已通过服务端长度限制
    已经过服务端防御性脱敏
    已明确标记为 zh-CN
    已限定为已命中风险项
    已附带稳定法规依据背景
    已排除 reasoning_content 持久化路径

provider 不应接收：

    完整合同原文
    原始照片
    PDF
    OCR 原文
    localStorage 全量数据
    用户私人笔记
    房源完整档案
    未经规则库命中的自由扫描任务
    任何 secret

---

## 13. reasoning_content 安全边界

HouseFolio 后续可以使用 DeepSeek thinking mode。

但 reasoning_content 必须继续严格遵守：

    不展示给用户
    不写入 localStorage
    不写入 IndexedDB
    不写入数据库
    不写入文件
    不写入服务端日志
    不写入客户端日志
    不进入导出报告
    不进入错误信息
    不进入 analytics
    不进入 prompt history
    不用于 UI 渲染

系统只允许使用最终结构化结果。

如果 provider SDK 或 API 返回 reasoning_content：

    读取最终结果所需字段后立即丢弃 reasoning_content
    不透传 reasoning_content
    不序列化 reasoning_content
    不记录 reasoning_content 长度或内容
    不把 reasoning_content 暴露给调用方

---

## 14. 中文优先原则

HouseFolio 面向中国大陆租客，合同风险提示功能使用 DeepSeek。

后续所有 AI-facing 自然语言内容应尽可能使用清晰、克制、准确的中文完成对接，包括：

    system prompt
    user prompt
    风险解释指令
    条款摘要
    法规依据说明
    签前追问清单
    建议补充条款方向
    协商话术
    免责声明
    schema 字段说明
    用户可见输出

内部 TypeScript 标识可以继续使用英文：

    类型名
    函数名
    JSON 稳定字段名
    riskId
    legalBasisId

推荐原则：

    工程标识保持稳定英文
    发送给 DeepSeek 的语义内容默认中文
    面向用户的内容默认中文
    法律表达保持克制
    不使用律师式保证
    不输出确定性法律结论
    schema 字段说明优先中文
    输出错误提示优先中文

---

## 15. schema-validated final JSON 的位置

后续 DeepSeek provider 必须输出 schema-validated final JSON。

但 Phase 9J-0 不实现 schema。

需要明确区分：

    L2 ContractReviewModel
    L3 AI-safe redacted input
    L3 provider final JSON
    用户可见 UI view model

它们不是同一个模型，也不应被混成一个无限扩张的抽象层。

后续 schema 只应服务真实 DeepSeek provider 消费与 UI 渲染，不应为了架构完整性提前堆叠抽象。

最终 JSON 未来可以考虑包含：

    summaryZh
    findingExplanations[]
    preSigningQuestions[]
    suggestedClauseDirections[]
    negotiationScripts[]
    disclaimerZh

但这些字段必须在 DeepSeek provider 实现计划阶段再单独评审。

---

## 16. 服务端日志边界

未来 API route 与 provider 层日志只允许记录最小运行信息，例如：

    requestId
    provider 名称
    success / failure 状态
    HTTP 状态码
    错误类别
    耗时
    风险项数量
    token 使用量
    成本估算

禁止日志记录：

    完整合同原文
    脱敏前条款
    脱敏后条款片段
    姓名
    手机号
    身份证号
    房屋地址
    联系方式
    prompt 原文
    DeepSeek 完整响应原文
    reasoning_content
    用户可见风险解释全文
    secret
    API key

错误信息必须安全化，不得回显合同文本或 DeepSeek 原始响应。

---

## 17. Phase 9J-0 非目标

Phase 9J-0 不做：

    src 修改
    TypeScript 类型新增
    redaction builder 实现
    regex 实现
    prompt builder 实现
    DeepSeek provider 实现
    API route 实现
    schema 实现
    UI 实现
    localStorage 或 IndexedDB 新增
    合同历史保存
    报告导出
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
    test runtime dependency

---

## 18. Phase 9J-0 完成标准

Phase 9J-0 完成标准：

    新增一份 AI-safe 输入边界评审文档
    明确 ContractReviewModel 不等于 AI-safe input
    明确默认不发送完整合同原文
    明确默认只发送已命中风险的脱敏片段
    明确浏览器端优先脱敏
    明确服务端二次 allowlist 校验与防御性脱敏
    明确用户确认后才联网
    明确合同文本属于不可信输入
    明确 reasoning_content 不展示、不保存、不导出、不写日志
    明确 AI-facing 语义内容中文优先
    明确不直接实现 DeepSeek provider 或 UI
    npm.cmd run build 通过
    git status clean
    commit 已 push 到 origin/main
    git ls-remote 真实远端校验通过

---

## 19. 下一步建议

Phase 9J-0 完成后，建议进入：

    Phase 9J-1：AI-safe redacted input builder minimal implementation plan

但 Phase 9J-1 仍然只写实现计划，不直接改 src。

后续最小路线：

    Phase 9J-0：AI-safe input boundary review
    Phase 9J-1：redacted input builder implementation plan
    Phase 9J-2：pure redacted input builder minimal implementation
    Phase 9J-3：builder contract check / checkpoint
    → DeepSeek 合同风险人话解释 provider

不要继续新增与真实消费者无关的 L2 抽象层。

---

## 20. 产品判断标准

Phase 9J 的判断标准不是脱敏 regex 数量，也不是抽象层数量。

真正的判断标准是：

    是否尽量减少离开浏览器的合同信息
    是否让用户知道哪些内容会发送给 AI
    是否避免把完整合同和身份信息默认交给第三方模型
    是否只让 DeepSeek 解释 HouseFolio 规则库已识别的风险
    是否让普通租客得到清晰、克制、可执行的人话提示
    是否保持 AI 辅助而非 AI 律师的产品边界