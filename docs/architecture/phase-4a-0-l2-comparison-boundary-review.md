# Phase 4A-0：L2 comparison 前置评审

## 0. 本阶段结论

Phase 4A-0 的结论是：HouseFolio 当前应该进入 L2 comparison 主线，但本阶段只做边界评审，不进入功能实现。

本阶段新增文档：

    docs/architecture/phase-4a-0-l2-comparison-boundary-review.md

本阶段不修改任何功能代码。

本阶段不做：

- 不新增 /compare 路由
- 不新增 compare 页面
- 不新增 Portfolio 多房源勾选
- 不新增横向对比表 UI
- 不修改现有 Reference Score 算法
- 不新增排序、筛选或推荐逻辑
- 不读取照片 Blob 或视频 Blob
- 不处理完整笔记原文
- 不调用高德
- 不调用 AI
- 不调用 Supabase
- 不新增 localStorage key
- 不修改 Settings 数据导出 / 导入 / 清除逻辑

Phase 4A-0 只回答一个问题：

    HouseFolio 的正式 L2 comparison 应该怎么做，边界在哪里，第一版做到哪里为止。

---

## 1. 当前项目基础判断

HouseFolio 当前已经具备进入 L2 comparison 的前置基础。

已完成的相关基础包括：

- 工作/学习地点，即通勤锚点，本地保存
- Detail 页手动计算公共交通参考通勤
- /api/lbs/commute/transit 服务端 route 调用高德
- 客户端只保存 commute-results 摘要
- listing-lookup.ts 读取 cached transit
- L2 Reference Score 使用 cached transit
- Portfolio 卡片显示通勤来源与参考评分
- Settings 可查看、导出、清除 commute-results
- Phase 2F 已经有 comparison selector 草案
- Demo Mode 已完成，可用于作品集展示

这意味着 Phase 4A 不需要重新做 L1 通勤计算，不需要先做地图 UI，不需要先接 AI，也不需要继续扩张 Demo Mode。

当前最稳的下一步是：把已有 L1/L2 数据整理成正式 comparison data model。

---

## 2. 为什么 Phase 4A 应该进入 L2 comparison 主线

### 2.1 comparison 是 HouseFolio 的核心差异化

HouseFolio 不解决“哪里有房”，而解决“我该如何在自己已经找到的候选房源之间做决策”。

因此，多房源横向比较不是附属功能，而是 HouseFolio 的核心界面之一。

它承接三层引擎：

- L1：提供通勤、生活圈、空间关系等输入
- L2：把多套房源转化为可比较、可排序、可拆解的结构
- L3：在 L2 结果之后做人话解释

没有 comparison，HouseFolio 容易退化为“房源卡片 + 笔记 + 参考评分”的集合。  
有了 comparison，HouseFolio 才能把多个候选房源组织成真正的决策结构。

### 2.2 comparison 比继续扩张 Demo 更重要

Demo Mode 已经完成作品集预览入口，当前不应继续扩张 Demo Detail、Demo Compare、Demo Map 或 Demo 视频。

Demo 是展示层，不是产品主线。  
正式 L2 comparison 是产品主线。

后续可以让 Demo 引用正式 comparison 的结果或静态展示形态，但不应让 Demo 反向倒逼正式数据模型。

### 2.3 comparison 比立刻做 AI 更稳

当前不应直接进入 L3 AI 对比建议。

原因：

- AI 需要基于稳定的 ComparisonModel 输入
- L3 只能解释 L1/L2 结果，不能替代 L2 做评分、排序、筛选
- 如果没有稳定的 L2 comparison model，AI prompt 很容易读取过多原文笔记或隐私字段
- 先做 L2，可以把 AI 的输入边界压清楚

所以顺序应该是：

    Phase 4A：L2 comparison data model
    Phase 4B：Compare UI route review / implementation
    Phase 4C：Compare UI regression
    Phase 4D 或更后：L3 comparison explanation boundary

### 2.4 comparison 比先做地图 UI 更符合 MVP 展示目标

地图 UI 属于 L1 可视化，价值很强，但实现成本和边界风险更高。

当前已有 L1 commute-results 摘要，已经足够支撑 L2 comparison 的第一版。  
Phase 4A 可以先用已有的结构化通勤结果推进，不需要等待地图 UI 或 POI 真实计算。

---

## 3. Phase 4A-0 不新增 /compare 路由

本阶段不新增 /compare。

原因：

- 当前还没有正式 ComparisonModel
- 还没有 selection 边界
- 还没有决定 comparison 是独立页面还是 Portfolio 内嵌区域
- 直接做 UI 容易让页面绕过 Phase 2F selector，直接读各种本地数据
- 直接做 UI 容易把 Demo compare 与正式 compare 混在一起

建议拆分：

- Phase 4A-1：Comparison data model
- Phase 4A-2：Comparison selector extension
- Phase 4A-3：Comparison contract check
- Phase 4B-0：Compare UI route review
- Phase 4B-1：Compare UI implementation

只有 Phase 4A-1 到 4A-3 稳定后，才考虑 /compare 路由。

---

## 4. 第一版不持久化 comparison selection

第一版 comparison selection 不进入 localStorage。

原因：

- comparison 是临时决策动作，不一定需要长期保存
- 新增 localStorage key 会增加 Settings 导出、导入、清除维护成本
- selection 本身不属于核心找房资料
- 当前阶段应避免扩张数据权利范围
- 临时 selection 更容易回滚和调整

后续可以考虑两种方式：

1. 临时内存态 selection

适合 Portfolio 内部 comparison panel。  
刷新后丢失，行为简单。

2. URL query selection

例如：

    /compare?ids=listing-001,listing-002,listing-003

适合独立 /compare 页面。  
不需要 localStorage，但可以刷新保留。

当前建议：

    Phase 4A-1 / 4A-2 不做 selection state。
    Phase 4B-0 再评审是否使用 URL query 或内存态。

---

## 5. 必须复用或延续 Phase 2F selector

Phase 4A 必须复用或延续 Phase 2F 的 buildComparisonInput selector 思路。

原因：

- Phase 2F 已经建立了只读、纯函数、无副作用的数据整形边界
- comparison 不应由页面直接读取 localStorage
- comparison 不应由页面直接调用高德、AI 或 Supabase
- comparison 不应把 UI、数据整形、评分逻辑混在一起

当前 Phase 2F selector 的原则应继续保留：

- 不读取 localStorage
- 不写入 localStorage
- 不访问高德
- 不访问 AI
- 不访问 Supabase
- 不排序
- 不筛选
- 不评分
- 不推荐
- 不处理笔记原文
- 不处理照片
- 不处理视频

Phase 4A 可以在这个基础上扩展正式 ComparisonModel，但不应推翻该边界。

---

## 6. ComparisonModel 第一版字段边界

### 6.1 第一版允许字段

第一版 ComparisonModel 可以包含以下字段：

基础字段：

- listingId
- title
- rentMonthly
- areaSqm
- layout
- district
- areaLabel
- status
- sourcePlatform
- sourceUrl

L1 摘要字段：

- commuteMinutes
- commuteSource
- commuteSummaries
- lifeCircleScore
- locationConfidence
- missingLocationFields

L2 摘要字段：

- referenceScore
- scoreBreakdown
- pricePerSqm
- valueSignals
- riskFlags
- missingFields
- comparisonNotes

主观摘要字段：

- subjectiveSummary
- subjectiveRatingSummary
- userStatus
- hasNotes
- hasPhotos

展示辅助字段：

- strengths
- weaknesses
- neutralFacts

### 6.2 第一版禁止字段

ComparisonModel 第一版不得包含：

- 完整笔记原文
- 房东或中介姓名
- 手机号
- 微信号
- 身份证号
- 合同条款原文
- 完整地址门牌号
- 楼栋号
- 单元号
- 精确经纬度
- 高德原始路线 JSON
- 高德 POI 原始 JSON
- 完整 polyline
- request URL
- apiKey
- AMAP_API_KEY
- NEXT_PUBLIC_AMAP_API_KEY
- AI prompt 原文
- AI 原始 response
- 第三方平台原始详情页正文
- 第三方平台图片
- 照片 Blob
- 视频 Blob
- object URL
- IndexedDB 内部 key

### 6.3 hasPhotos 可以存在，但不读取照片本体

ComparisonModel 可以包含：

    hasPhotos: boolean
    photoCount?: number
    coverPhotoMeta?: lightweight metadata only

但不能包含：

    photoBlob
    thumbnailBlob
    objectUrl
    localObjectKey
    imageBase64

理由：

照片是高敏本机资料。comparison 第一版只需要知道“这套房是否有用户本机照片资料”，不需要读取或展示照片本体。

---

## 7. L2 comparison 与 Demo comparison 的区别

必须区分：

    Demo comparison = 展示层
    正式 L2 comparison = 产品主线

### 7.1 Demo comparison

Demo comparison 可以使用：

- 虚构用户
- 虚构房源
- 静态通勤数据
- 静态参考评分
- 静态 L3 解释
- 静态风险提示
- 预置展示文案

Demo comparison 不应该：

- 写入用户本地数据
- 调用真实 localStorage portfolio
- 调用高德
- 调用 AI
- 调用 Supabase
- 倒逼正式 ComparisonModel 字段

### 7.2 正式 L2 comparison

正式 L2 comparison 应使用用户本机真实结构化数据，但必须经过边界裁剪。

正式 comparison 应遵守：

- 本地优先
- 只读结构化数据
- 不读取照片或视频本体
- 不处理完整笔记原文
- 不调用 AI
- 不调用高德
- 不调用 Supabase
- 不改写原始 listing
- 不新增持久化 selection key
- 不把 Reference Score 表述为推荐系统

---

## 8. L2 继续只用规则和简单数学

L2 comparison 必须继续使用规则和简单数学，不使用 LLM。

L2 可以做：

- 评分拆解
- 排序
- 筛选
- 横向对比
- 相对差异
- 异常提示
- 缺失字段提示
- 多维度标记
- 价格单方米计算
- 通勤差异计算
- 面积差异计算
- 状态归类
- 决策维度标记

L2 不能做：

- LLM 打分
- LLM 排序
- LLM 筛选
- LLM 推荐
- LLM 判断真假
- LLM 判断最佳房源
- LLM 替用户决定
- LLM 读取完整隐私画像
- LLM 基于照片或视频做判断

原因：

- 通勤、价格、面积、评分都是计算问题，不是生成问题
- L2 的可解释性比“智能感”更重要
- 使用规则计算更低成本、更稳定、更适合本地优先
- 这能体现 HouseFolio 的 AI 产品判断：知道什么时候不用 AI

---

## 9. L3 在 comparison 中的位置

L3 只能在 L2 结果之后做人话解释。

未来允许做：

- 基于 ComparisonModel 的脱敏摘要生成对比解释
- 生成 checklist
- 生成 trade-off 总结
- 解释风险信号
- 把 scoreBreakdown 翻译成用户能理解的语言
- 输出条件化建议

未来禁止做：

- 直接读取完整笔记原文
- 读取照片或视频
- 读取完整地址门牌号
- 基于完整地址和通勤锚点做个人画像
- 用 AI 重新打分
- 用 AI 替用户排序
- 用 AI 输出“最佳房源”
- 用 AI 判断“真房源”
- 用 AI 认证房东或中介

推荐 L3 输出表达：

    如果你优先通勤，A 更合适。
    如果你优先面积，B 更稳。
    如果你最担心生活便利性，C 的不确定性更高。
    这不是最终推荐，只是基于当前字段的辅助比较。

禁止 L3 输出表达：

    最佳房源是 A。
    系统推荐你选择 A。
    A 是最优选择。
    AI 已经帮你决定。
    A 是真房源，B 有问题。

---

## 10. 第一版 comparison 应该做到哪里

Phase 4A 第一版应保持克制。

建议第一版目标：

    2–4 套房源的结构化横向对比输入模型
    纯函数生成 ComparisonModel[]
    不做 UI
    不做 /compare
    不做 selection state
    不做 L3

具体拆分：

### Phase 4A-1：Comparison data model

目标：

- 定义正式 ComparisonModel 类型
- 定义 ComparisonModel 的允许字段
- 定义 ComparisonModel 的禁止字段
- 明确它是 L2 数据模型，不是 UI 模型，不是 AI prompt 模型

可能文件：

- src/types/comparison.ts
- 或继续扩展 src/lib/algorithm/comparison.ts

建议优先评审后再决定是否新建 src/types/comparison.ts。

### Phase 4A-2：Comparison selector extension

目标：

- 基于现有 buildComparisonInput 扩展正式 buildComparisonModel
- 仍然保持纯函数
- 输入由调用方传入，不在 selector 内读取 localStorage
- 输出 ComparisonModel[]

### Phase 4A-3：Comparison contract check

目标：

- 用 TypeScript contract check 禁止敏感字段进入 ComparisonModel
- 禁止 coordinate、raw、prompt、blob、objectUrl、apiKey 等字段
- 确认 model 不包含完整笔记、照片、视频、地址门牌号

### Phase 4B-0：Compare UI route review

目标：

- 评审是否新增 /compare
- 评审使用 URL query 还是 Portfolio 内存态 selection
- 评审是否需要 AppNav 入口
- 评审如何避免功能孤岛

---

## 11. 第一版 comparison 的输入来源

ComparisonModel 的输入应来自调用方传入的结构化对象，而不是自己读取数据源。

允许输入：

- Listing[]
- ScoreBreakdown[]
- StoredCommuteResult[]
- ListingSubjectiveRatings
- listing status
- 轻量 photo metadata summary
- 已经脱敏或摘要化的 subjective summary

禁止输入：

- localStorage raw snapshot
- IndexedDB Blob
- full note text
- full address with door number
- AI prompt
- Amap raw response
- Supabase row object if未经过封装清洗
- third-party page raw content

---

## 12. comparison 与 Settings 数据权利的关系

Phase 4A-0 不新增 localStorage key，因此暂不需要修改 Settings。

如果未来新增持久化 comparison selection，则必须同步评审：

- 是否需要加入 src/lib/privacy/local-data.ts
- 是否需要 Settings 导出
- 是否需要 Settings 导入
- 是否需要 Settings 清除
- 是否需要说明它不是房源数据，而是临时选择状态

但当前建议：

    不新增 comparison selection 持久化 key。
    不改 Settings。

---

## 13. comparison 与照片 / 视频的关系

第一版 comparison 不读取照片或视频本体。

可以显示或计算的只是轻量状态：

- 是否有本机照片
- 本机照片数量
- 是否存在封面图元数据
- 是否有用户看房资料

但不应：

- 在 comparison model 中嵌入照片 Blob
- 在 comparison model 中嵌入视频 Blob
- 在 comparison model 中嵌入 object URL
- 在 L2 中分析照片采光、装修、户型
- 在 L2 中分析视频布局、声音、人脸
- 把用户照片或视频传给 L3

如果未来要在 compare UI 中展示封面图，必须另开阶段评审，并继续通过 lib/storage 读取，不得把 Blob 纳入 L2 model。

---

## 14. comparison 与 Reference Score 的关系

Reference Score 是 L2 的已有能力，comparison 应读取它的结果或拆解，而不是重新定义推荐系统。

必须保持措辞：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐
- 用户可根据硬性条件一票否决

避免措辞：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

comparison 中可以展示：

- referenceScore
- scoreBreakdown
- 维度差异
- 哪些字段导致分数差异
- 哪些字段缺失导致比较不完整

comparison 中不应展示：

- 系统推荐第 1 名
- AI 认为最好
- 最优解
- 最终选择

---

## 15. comparison 与多通勤锚点的关系

当前已有通勤锚点本地保存和 cached transit 摘要。

Phase 4A 第一版可以继续沿用当前最小策略：

- 只读取 transit
- 多个 transit 结果暂取最短 durationMinutes
- 没有 cached transit 时回退 listing 默认 commuteMinutes
- 不做复杂多锚点权重

但 comparison model 应预留多锚点摘要：

- commuteSummaries
- anchorName
- mode
- durationMinutes
- distanceMeters
- provider
- calculatedAt

第一版不做：

- 主锚点 / 次锚点权重
- 最差锚点惩罚
- 平均通勤压力
- 伴侣通勤权重
- 家庭通勤折中模型

这些应留到后续独立阶段。

---

## 16. comparison 风险提示边界

第一版可以做 missingFields 和 riskFlags，但只能是规则提示。

允许的 riskFlags：

- 缺少价格
- 缺少面积
- 缺少地址线索
- 缺少通勤结果
- 缺少主观评分
- 租金明显高于当前 portfolio 内其他候选
- 面积明显低于当前 portfolio 内其他候选
- 通勤时间明显长于当前 portfolio 内其他候选

禁止的 riskFlags：

- 假房源
- 黑中介
- 房东不可信
- 小区危险
- 房源违法
- 合同有诈
- 一定不要租
- AI 判断有问题

原因：

HouseFolio 不做真实性认证、不做中介判断、不做法律结论。  
第一版只做字段缺失、相对异常和辅助提醒。

---

## 17. 文件范围建议

Phase 4A-0 只新增：

- docs/architecture/phase-4a-0-l2-comparison-boundary-review.md

Phase 4A-0 不修改：

- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/app/portfolio/page.tsx
- src/app/demo/page.tsx
- src/content/zh-cn.ts
- src/lib/privacy/local-data.ts

---

## 18. 验证标准

Phase 4A-0 完成后，应验证：

- 文档文件存在
- npm.cmd run build 通过
- git status 只出现该文档
- 没有新增 /compare
- 没有新增组件
- 没有修改 src 下功能代码
- 没有新增 localStorage key
- 没有改 Settings
- 没有引入 AI、高德、Supabase
- 文档明确 L2 不使用 LLM
- 文档明确 Reference Score 不代表最终推荐
- 文档明确 ComparisonModel 禁止敏感字段

建议命令：

    Test-Path docs\architecture\phase-4a-0-l2-comparison-boundary-review.md
    npm.cmd run build
    git status

---

## 19. commit 建议

如果验证通过，提交：

    git add docs\architecture\phase-4a-0-l2-comparison-boundary-review.md
    git commit -m "docs: review l2 comparison boundary"
    git status

---

## 20. 后续阶段建议

完成 Phase 4A-0 后，下一阶段进入：

    Phase 4A-1：Comparison data model

Phase 4A-1 应继续保持小步：

- 先评审类型位置
- 再定义 ComparisonModel
- 再做 contract check
- 不做 UI
- 不做 /compare
- 不做 AI

Phase 4A-1 的目标不是让用户看到界面，而是让正式对比能力有稳定、可测试、可审查的数据模型基础。

---

## 21. 最终判断

Phase 4A-0 的最终判断：

HouseFolio 现在应该进入 L2 comparison 主线。  
这比继续扩张 Demo、更早接 AI、更早做地图 UI都更稳。

但是第一步不是写页面，而是建立边界：

- comparison 是 L2 结构化比较能力
- comparison 不是推荐系统
- comparison 不读取隐私原文
- comparison 不读取照片或视频本体
- comparison 不调用 AI
- comparison 不调用高德
- comparison 不新增持久化 selection
- comparison 应复用 Phase 2F 的纯函数 selector 边界

只有这个边界稳定后，才能进入 Phase 4A-1。