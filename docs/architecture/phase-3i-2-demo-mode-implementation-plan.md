# Phase 3I-2：Demo Mode implementation plan

## 1. 阶段定位

本阶段是 Phase 3I-1 Demo Mode 前置评审之后的实现计划阶段。

阶段名称：

Phase 3I-2：Demo Mode implementation plan

中文名称：

Phase 3I-2：Demo Mode 实现计划

本阶段只写计划文档，不修改源码、不新增路由、不新增组件、不新增 demo data、不修改首页入口、不修改 AppNav、不修改 localStorage、不修改 IndexedDB、不接高德、不接 AI。

Phase 3I-2 的目标是：

把 Phase 3I-1 中已经确定的 Demo Mode 边界，转化成后续可执行的最小实现路线，明确文件范围、数据源边界、页面范围、验证标准和 commit 顺序。

## 2. 为什么需要先写 implementation plan

Demo Mode 不是普通页面。

如果直接写代码，很容易出现以下风险：

- Demo 误读真实 localStorage；
- Demo 误读真实 IndexedDB 照片；
- Demo 误写真实用户数据；
- Demo 看起来像真实房源库；
- Demo 使用真实房源图、真实中介视频或第三方平台素材；
- Demo 把预置 AI 文案伪装成实时 AI；
- Demo 把 Reference Score 说成推荐分；
- Demo 让 HouseFolio 从私人决策工具滑向房源展示平台。

因此，Demo Mode 实现前必须先有计划文档。

本阶段不追求“马上能看到页面”，而是先把最小安全路线钉住。

## 3. Demo Mode 的实现目标

Demo Mode 的实现目标不是给用户另一个真实工作区，而是给面试官和评审者一个可快速理解 HouseFolio 的演示环境。

Demo Mode 第一版应让人看到：

- HouseFolio 不是房源平台；
- 用户主动添加候选房源；
- 数据默认私有、本地优先；
- 通勤锚点支持工作 / 学习地点；
- L1 可以把房源转化为空间决策信息；
- L2 可以把房源转化为参考评分和维度拆解；
- L3 未来可以把结构化信息解释成人话；
- Reference Score 只是参考评分，不是系统推荐；
- Demo 中所有数据都是虚构数据。

Demo Mode 第一版不追求完整功能，只追求展示主线清楚、安全边界明确、实现成本可控。

## 4. 推荐实现方式总览

未来推荐采用：

- 独立路由：/demo
- 独立静态 demo data source
- 只读页面
- 不读真实 localStorage
- 不读真实 IndexedDB
- 不写任何真实用户数据
- 不调用真实高德
- 不调用真实 AI
- 不使用真实房源图片
- 不支持视频
- 不支持真实导入 / 导出
- 不支持真实清除数据

第一版 Demo Mode 应是一个独立演示页，而不是把真实 /portfolio 页面切换成 demo 状态。

原因：

- 路由隔离最清晰；
- 面试链接最容易给；
- 不污染真实用户工作区；
- 不需要改动现有 Portfolio 数据读取逻辑；
- 不容易误删或误写真实用户数据。

## 5. 推荐路由设计

未来新增路由：

/demo

第一版只做：

/demo

暂不做：

/demo/[id]
/demo/settings
/demo/compare
/demo/map
/demo/ai

原因：

- 第一版先用一个页面展示完整故事；
- 不急于复刻真实 Detail；
- 不急于做 Demo 多页面结构；
- 避免制造新路由孤岛；
- 避免在演示模式中过早复用真实 Detail 的读写逻辑。

后续如果 /demo 一页不足，再进入 Demo Detail 阶段。

## 6. 首页是否增加 Demo 入口

结论：未来需要，但不在 Phase 3I-2 实现。

后续 Phase 3I-4 或 Phase 3I-5 可以考虑在首页加入：

查看演示

推荐文案：

查看演示
使用虚构数据了解 HouseFolio 如何辅助找房决策

必须同时标注：

演示数据均为虚构，不代表真实房源，不提供租赁建议。

当前 Phase 3I-2 只写计划，不改首页。

## 7. AppNav 是否增加 Demo 入口

第一版不建议马上加到 AppNav。

原因：

- AppNav 当前服务真实用户闭环：首页、Portfolio、添加房源、Settings；
- Demo Mode 是展示入口，不一定属于真实工作流；
- 如果 AppNav 直接加 Demo，可能让真实用户误入演示环境；
- 首页按钮足够服务作品集展示。

未来如果加，也应使用明确文案：

演示模式

并在 Demo 页面顶部持续标注虚构数据。

当前 Phase 3I-2 不改 AppNav。

## 8. Demo 数据文件放在哪里

未来建议新增：

src/lib/demo/demo-listings.ts
src/lib/demo/demo-work-locations.ts
src/lib/demo/demo-commute-results.ts
src/lib/demo/demo-reference-scores.ts
src/lib/demo/demo-ai-outputs.ts
src/lib/demo/index.ts

但第一版可以进一步收缩为：

src/lib/demo/demo-data.ts

理由：

- 第一版 demo 数据量不大；
- 单文件更便于审查；
- 减少文件数量；
- 先跑通展示，再拆分；
- 避免过早抽象。

推荐顺序：

Phase 3I-3 先新增 src/lib/demo/demo-data.ts
Phase 3I-4 再新增 /demo 页面读取该静态数据

当前 Phase 3I-2 不新增任何 demo data 文件。

## 9. Demo data 的基本形状

第一版 demo data 建议包含：

- demoListings
- demoWorkLocations
- demoCommuteSummaries
- demoScoreBreakdowns
- demoAiSummaries
- demoMeta

其中 demoMeta 应包含：

- isDemo: true
- disclaimer
- generatedAt 或 version
- source: "fictional"

示例字段方向：

demoListings：

- id
- title
- city
- district
- areaLabel
- rent
- areaSqm
- layout
- addressHint
- status
- sourcePlatform
- sourceUrlLabel
- commuteMinutes
- lifeCircleScore
- compositeScore
- commuteSource

demoWorkLocations：

- id
- name
- addressHint
- anchorType
- priorityLabel

demoCommuteSummaries：

- listingId
- anchorId
- anchorName
- mode
- durationMinutes
- distanceMeters
- summary
- calculatedAt
- provider
- isMock

demoScoreBreakdowns：

- listingId
- total
- rentContribution
- areaContribution
- commuteContribution
- lifeCircleContribution
- subjectiveContribution
- strengths
- weaknesses

demoAiSummaries：

- listingId
- summary
- checklist
- tradeoffs
- riskNotes

注意：

Demo data 不应复用真实 localStorage shape 到需要写入的程度。它可以结构相似，但必须是只读静态对象。

## 10. Demo 房源数量

第一版建议 3 套房源。

原因：

- 1 套无法展示比较；
- 2 套勉强能对比，但层次不够；
- 3 套足以展示 trade-off；
- 超过 4 套会增加 UI 和文案负担。

推荐设定：

房源 A：通勤优势明显，但租金略高、面积一般
房源 B：面积更大、价格适中，但通勤压力偏高
房源 C：价格低，但信息完整度和生活圈较弱

这样能展示 HouseFolio 的核心决策逻辑：

没有绝对最佳，只有基于偏好的辅助比较。

## 11. Demo 城市场景

第一版建议继续使用北京。

原因：

- 项目面向中国大陆租客；
- 北京高校 / 应届生 / 初级白领租房场景容易理解；
- 用户本人的求职作品集叙事也更贴合北京；
- 北京多通勤锚点、通勤压力和租金取舍典型。

但 Demo 房源必须虚构。

允许使用真实地理背景：

- 北京
- 海淀
- 朝阳
- 五道口
- 望京
- 中关村
- 国贸
- 地铁站附近

不允许使用：

- 真实可租房源；
- 真实房东 / 中介；
- 真实平台链接；
- 真实平台图片；
- 真实小区 + 真实价格 + 真实图片组合；
- 具体门牌号；
- 电话 / 微信 / 合同信息。

## 12. Demo 是否展示照片

第一版建议使用占位图，不接照片能力。

推荐方式：

- 使用 CSS 渐变或纯色占位；
- 使用“演示图片占位”文案；
- 或使用项目自制的抽象房间插画；
- 不读取 IndexedDB；
- 不使用用户真实照片；
- 不使用平台房源图。

原因：

- Phase 3D 的照片能力已经稳定，但属于真实本机数据；
- Demo 第一版不应接触真实 IndexedDB；
- 照片素材会引入版权和真实性误解；
- 作品集初期重点是展示 L1 / L2 / L3 决策链，不是图片质感。

后续如需更真实的视觉效果，可以单独进入 Demo visual assets review。

## 13. Demo 是否展示视频

第一版不展示视频。

原因：

- 视频能力尚未实现；
- Phase 3H-1 明确视频后置；
- 视频更高敏；
- Demo 使用视频容易误导面试官认为产品已支持视频；
- 中介 / 房东视频不得作为 Demo 素材。

Demo 页面可以完全不提视频。

如需提及，只能放在边界说明中：

看房视频属于后置能力，当前演示不包含视频。

## 14. Demo 是否展示 L1

第一版应展示 L1，但使用预置数据。

展示内容：

- 工作/学习地点（通勤锚点）
- 每套房到通勤锚点的公共交通参考时间
- 通勤压力摘要
- 生活圈简要评分
- 位置关系说明

不展示：

- 真实地图
- 真实 POI
- 高德调用按钮
- 真实路线详情
- 经纬度
- 原始路线 JSON
- 多交通模式实时计算

原因：

- Demo 要稳定；
- 不依赖 AMAP_API_KEY；
- 不消耗 API；
- 不受网络和地址解析影响；
- 不暴露真实地址；
- 不展示尚未正式完成的地图和 POI 能力。

## 15. Demo 是否展示 L2

第一版必须展示 L2。

展示内容：

- 参考评分；
- 维度拆解；
- 相对优势；
- 相对短板；
- “不代表最终推荐”的说明；
- 按参考评分排序的视觉效果；
- 可以展示一段“如果按通勤优先，这套更靠前”的解释。

不做：

- 真实多房源勾选；
- 正式 /compare；
- 用户自定义权重；
- 复杂多锚点权重；
- 异常值检测正式模型；
- 相对性价比正式模型。

第一版 Demo 的 L2 是展示产品思路，不是正式 Phase 4A。

## 16. Demo 是否展示 L3

第一版可以展示 L3，但必须标明是预生成演示文本。

推荐标注：

AI 辅助分析演示文本，基于虚构房源数据预生成，仅用于展示产品方向。

展示内容：

- 条件化建议；
- trade-off 总结；
- 看房 checklist；
- 风险提示解释；
- 不替用户决定的说明。

禁止：

- 最佳房源；
- 系统推荐；
- 推荐分；
- 这套一定值得租；
- 真房源；
- 零风险；
- 替你决定。

L3 第一版不调用 DeepSeek 或任何模型 API。

## 17. Demo 页面第一版结构建议

第一版 /demo 页面建议采用单页结构：

1. 顶部演示模式提示

内容：

这是演示模式。所有房源、笔记、图片占位和分析均为虚构数据，不代表真实房源，不提供租赁建议。

2. 一句话产品定位

HouseFolio 帮助租客管理自己主动收集的候选房源，并用 L1 通勤、L2 参考评分和未来 L3 AI 解释辅助比较。

3. Demo 用户场景

例如：

应届毕业生在北京找房，需要同时考虑本人工作地点和伴侣通勤锚点，预算有限，希望在通勤、面积、租金和生活便利之间做折中。

4. 通勤锚点区域

展示 2 个虚构锚点：

- 演示公司 A：望京附近
- 演示学校 / 公司 B：五道口附近

5. 候选房源卡片区域

展示 3 套虚构房源。

每张卡片展示：

- 虚构标题；
- 租金；
- 面积；
- 户型；
- 地址线索；
- 通勤摘要；
- 参考评分；
- 主要优势；
- 主要短板；
- 演示数据标签。

6. L1 / L2 / L3 解释区域

用三栏解释：

- L1：把地址变成通勤与生活圈数据；
- L2：把多套房源变成可比较结构；
- L3：把结构化结果翻译成人话建议。

7. 预生成 AI 分析区域

展示一段条件化建议：

如果你优先通勤，A 更稳；如果你优先面积，B 更适合；如果你优先预算，C 值得继续核实，但需要注意生活圈和信息完整度。

8. 数据权利说明

强调：

- 真实模式下，完整住址、笔记和照片默认保存在本机；
- Demo 不读取真实本机数据；
- Demo 不修改真实本机数据；
- Demo 不调用高德或 AI；
- Demo 数据均为虚构。

9. 进入真实 Portfolio 的入口

按钮：

开始管理我的候选房源

跳转：

/portfolio

注意文案：

进入真实模式后，你的数据将保存在当前浏览器本机。

## 18. 第一版是否做 Demo Detail

结论：第一版不做 Demo Detail。

理由：

- /demo 单页足以展示主线；
- Demo Detail 会迫使复刻真实 Detail 结构；
- 容易引入真实照片 / notes / localStorage 逻辑；
- 会扩大文件范围；
- 会分散 Phase 3I 的目标。

如果未来需要，可以做：

Phase 3I-6：Demo detail presentation

届时再单独设计 /demo/[id] 或页面内展开。

## 19. 第一版是否做 Demo Compare

结论：不做正式 Demo Compare。

但可以在 /demo 单页中用静态对比摘要模拟 comparison 价值。

原因：

- 正式 comparison 属于 Phase 4A 之后；
- 当前已有 Phase 2F comparison foundation，但还没有正式 compare 页面；
- Demo 不应抢跑 Phase 4A；
- 静态展示一段对比摘要即可说明产品价值。

可以展示：

- 三套房横向概览；
- L1 / L2 差异；
- AI trade-off 文字。

不做：

- 勾选多房源；
- /compare 路由；
- 可交互对比表；
- comparison model 重构；
- 用户自定义权重。

## 20. 第一版是否复用 ListingCard

建议第一版可以不复用真实 ListingCard。

原因：

- ListingCard 依赖真实 Listing 类型和运行时字段；
- Demo 单页可能只需要演示卡片；
- 复用真实组件可能引入不必要 props 适配；
- 不复用可以更清楚地保证 Demo 不写真实数据。

但如果未来为了视觉一致性，也可以在第二版考虑抽象 readonly card。

第一版建议新建独立 Demo card component，或者直接在 /demo/page.tsx 内部写只读 markup。

当前 Phase 3I-2 不做代码实现，因此只记录计划。

## 21. 推荐后续阶段拆分

### Phase 3I-3：Demo data scaffold

目标：

新增静态 demo data 文件。

建议文件：

- src/lib/demo/demo-data.ts
- src/lib/demo/index.ts

不新增页面。

验证标准：

- npm.cmd run build 通过；
- demo data 不引用 localStorage；
- demo data 不引用 IndexedDB；
- demo data 不引用高德；
- demo data 不引用 AI provider；
- demo data 中无真实 URL、手机号、微信号、门牌号；
- git status clean。

commit：

feat: scaffold demo mode data

### Phase 3I-4：Demo route shell

目标：

新增 /demo 页面壳。

建议文件：

- src/app/demo/page.tsx
- src/content/zh-cn.ts

可选文件：

- src/components/demo-mode-page.tsx

验证标准：

- /demo 可访问；
- 页面显示演示模式提示；
- 页面不读 localStorage；
- 页面不读 IndexedDB；
- 页面不调用高德；
- 页面不调用 AI；
- 页面不写数据；
- npm.cmd run build 通过；
- git status clean。

commit：

feat: add demo mode route shell

### Phase 3I-5：Demo portfolio presentation

目标：

在 /demo 页面展示 3 套虚构房源卡片和通勤锚点。

建议文件：

- src/components/demo-mode-page.tsx
- src/content/zh-cn.ts

验证标准：

- 显示 3 套虚构房源；
- 显示 2 个虚构通勤锚点；
- 显示 L1 通勤摘要；
- 显示 L2 参考评分；
- 显示“演示数据”标签；
- 不出现“最佳房源 / 系统推荐 / 真房源”等禁用措辞；
- 不读取真实用户数据；
- build 通过；
- git clean。

commit：

feat: add demo portfolio presentation

### Phase 3I-6：Demo L3 explanation preview

目标：

展示预生成 AI 辅助分析文本和 checklist。

验证标准：

- 文案明确“预生成演示文本”；
- 不调用 DeepSeek；
- 不调用任何 AI API；
- 不声称实时 AI；
- 不替用户决定；
- 不使用真实笔记；
- build 通过；
- git clean。

commit：

feat: add demo ai explanation preview

### Phase 3I-7：Demo entry and regression

目标：

在首页增加“查看演示”入口，并做总回归。

验证标准：

- 首页可以进入 /demo；
- /demo 可以进入 /portfolio；
- AppNav / ComplianceFooter 状态合理；
- Demo 不读写真实数据；
- build 通过；
- git clean；
- 新增回归日志。

commit：

feat: add demo mode entry

或如果只写日志：

docs: log demo mode regression

## 22. 当前阶段不做清单

Phase 3I-2 不做：

- 不新增 /demo；
- 不新增 demo data；
- 不新增首页入口；
- 不新增 AppNav 入口；
- 不新增组件；
- 不改 Portfolio；
- 不改 Detail；
- 不改 Settings；
- 不改 localStorage；
- 不改 IndexedDB；
- 不读照片；
- 不做视频；
- 不调用高德；
- 不调用 AI；
- 不接 DeepSeek；
- 不接 Supabase；
- 不做地图；
- 不做 POI；
- 不做 compare 页面；
- 不做 /compare；
- 不做多房源勾选；
- 不做云同步；
- 不做部署。

## 23. Phase 3I-2 验收标准

本阶段完成条件：

- 新增本计划文档；
- 不修改任何源码；
- 不新增路由；
- 不新增 demo data；
- npm.cmd run build 通过；
- git status clean；
- commit 信息为 docs: plan demo mode implementation。

## 24. 最终结论

Demo Mode 的后续最小实现应走：

Phase 3I-3：Demo data scaffold
→ Phase 3I-4：Demo route shell
→ Phase 3I-5：Demo portfolio presentation
→ Phase 3I-6：Demo L3 explanation preview
→ Phase 3I-7：Demo entry and regression

第一版 Demo Mode 采用 /demo 单页路线。

第一版只使用虚构静态数据，不读写真实用户数据，不调用高德，不调用 AI，不使用真实房源图，不展示视频，不做正式 compare 页面。

Demo Mode 的目标是服务作品集展示，让面试官快速理解 HouseFolio 的产品价值，而不是新增一个真实业务模式。