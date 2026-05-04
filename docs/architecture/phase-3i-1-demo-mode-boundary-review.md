# Phase 3I-1：Demo Mode 前置评审

## 1. 阶段定位

本阶段是 Phase 3I-0 handoff 之后的第一个候选推进方向。

阶段名称：

Phase 3I-1：Demo Mode 前置评审

英文名称：

Phase 3I-1: Demo Mode Boundary Review

本阶段只写评审文档，不修改代码、不新增路由、不新增组件、不新增 mock 数据、不改 localStorage、不改 IndexedDB、不改 L1 / L2 / L3 逻辑。

Phase 3I-1 的目标不是马上做 Demo Mode，而是先定义 Demo Mode 的产品边界、数据边界、隐私边界、展示边界和后续实现顺序。

HouseFolio 是求职作品集项目。Demo Mode 的价值在于让面试官、朋友或评审者在 5 分钟内看懂：

- HouseFolio 不是房源平台；
- HouseFolio 是私人找房决策管理工具；
- 用户主动添加候选房源；
- 数据默认私有、本地优先；
- L1 / L2 / L3 三层决策引擎如何组织找房决策；
- Reference Score 只是参考评分，不是系统推荐；
- AI 只做解释和总结，不替用户决定；
- 项目有清晰合规边界和迁移边界。

## 2. 为什么现在需要 Demo Mode 前置评审

当前 Phase 3D–3H-1 已经完成：

- 本地照片持久化；
- Settings 照片数据可见；
- 清除全部本机照片；
- 结构化 JSON 导出；
- 结构化 JSON 导入；
- Portfolio 本机首图；
- 本地优先数据权利阶段总收口；
- 看房照片/视频本机保存边界评审。

这说明 HouseFolio 的“本地优先数据权利层”已经基本成型。

但作为求职作品集，如果面试官打开的是一个空白账户，产品价值会很难在短时间内被感知。Demo Mode 应解决这个展示问题：

- 不要求面试官手动添加房源；
- 不要求面试官先设置通勤锚点；
- 不要求面试官上传照片；
- 不要求面试官真实调用高德或 AI；
- 不要求面试官理解所有本地数据机制；
- 打开后即可看到一组完整但虚构的候选房源决策流程。

因此，Demo Mode 是展示层能力，不是核心业务数据层能力，也不是公共房源库。

## 3. Demo Mode 的一句话定义

Demo Mode 是一个基于完全虚构数据的只读演示环境，用来展示 HouseFolio 如何把用户主动收集的候选房源、通勤锚点、看房笔记、本机照片、L1 通勤摘要、L2 参考评分和未来 L3 条件化建议组织成可决策结构。

它不读取真实用户数据，不修改真实用户数据，不保存真实用户操作，不公开任何真实房源，不使用第三方平台素材。

## 4. Demo Mode 属于哪一层

Demo Mode 不属于 L1 / L2 / L3 中任一核心引擎。

它属于：

展示层

它的作用是让三层引擎可见化，而不是替代引擎本身。

分层关系：

| 层级 | Demo Mode 中的处理 |
| --- | --- |
| 基础层 | 使用虚构房源、虚构笔记、虚构照片或占位图 |
| L1 LBS | 使用预置的虚构通勤摘要，不实时调用高德 |
| L2 算法 | 可以展示预置或基于本地规则计算的参考评分 |
| L3 AI | 可以展示预生成静态文本，不实时调用模型 |
| 数据权利层 | 明确与真实 localStorage / IndexedDB 隔离 |
| 展示层 | 让面试官 5 分钟内看懂产品价值 |

## 5. Demo Mode 是否需要独立入口

结论：未来需要，但当前阶段不实现。

后续可以考虑两种入口：

### 方案 A：首页按钮

首页增加：

查看演示

优点：

- 面试官最容易找到；
- 符合作品集展示目标；
- 不需要知道隐藏路径。

风险：

- 如果文案不清晰，可能让用户误以为看到的是真实房源；
- 必须显著标明“演示数据均为虚构”。

### 方案 B：独立路由

未来新增：

/demo

优点：

- 真实模式和演示模式路径隔离；
- 容易做只读数据源；
- 便于面试时直接给链接；
- 不污染现有 /portfolio 真实用户闭环。

风险：

- 需要新增页面和入口；
- 需要明确和真实 localStorage 数据隔离。

当前推荐：

未来采用 /demo 独立路由，并在首页提供“查看演示”入口。

当前 Phase 3I-1 不新增路由。

## 6. Demo 数据是否必须完全虚构

结论：必须完全虚构。

Demo Mode 不得使用：

- 真实用户保存的房源；
- 用户自己的真实看房照片；
- 真实房东或中介信息；
- 真实聊天记录；
- 真实手机号、微信号、门牌号；
- 第三方平台房源图片；
- 贝壳、58、小红书、豆瓣等平台原始描述；
- 中介或房东发送的真实视频；
- 未授权的真实小区房源图片；
- 用户真实工作地点；
- 用户真实通勤锚点；
- 用户真实 AI prompt；
- 用户真实笔记原文。

允许使用：

- 虚构房源标题；
- 虚构租金、面积、户型；
- 真实城市和商圈作为背景，例如北京、海淀、朝阳、望京、五道口；
- 虚构小区名，或明确标记为演示用的小区名；
- 虚构通勤锚点，例如“演示公司 A”“演示学校 B”；
- AI 生成的室内示意图；
- 抽象占位图；
- 手工编写的假笔记；
- 手工编写的假 L1 / L2 / L3 输出。

如果使用真实商圈或地铁站名称，应避免让 Demo 看起来像真实房源发布或房源推荐。

## 7. Demo 是否允许使用照片

结论：允许，但必须严格限制为演示素材。

允许：

- AI 生成的虚构室内图；
- 自制占位图；
- 免版权素材，但必须确认授权；
- 抽象插画；
- 不对应真实出租房的样例图片。

不允许：

- 用户自己的真实看房照片；
- 平台房源图；
- 中介或房东提供的房源图；
- 带有真实门牌、人脸、合同、联系方式的图片；
- 看起来像真实房源广告的图片；
- 可被误认为真实可租房源的图片组合。

当前建议：

Demo Mode 早期可以不用真实照片文件，也不读取 IndexedDB。可以先用静态占位图或 CSS 视觉占位。这样最稳，不会影响 Phase 3D 的本机照片闭环。

## 8. Demo 是否允许使用视频

结论：当前不允许。

Phase 3H-1 已经将视频纳入长期“本机看房媒体资料”边界，但当前不实现视频功能。因此 Demo Mode 也不应提前展示视频能力。

Demo Mode 当前不做：

- 视频播放器；
- 视频占位；
- 视频上传；
- 视频 AI 分析；
- 视频 OCR；
- 语音转文字；
- 中介视频演示；
- 房东视频演示。

原因：

- 视频能力本身尚未实现；
- 提前在 Demo 中展示会造成能力误导；
- 视频素材的第三方内容和隐私风险更高；
- Demo Mode 当前应聚焦 L1 / L2 / L3 决策链路，而不是扩展媒体能力。

## 9. Demo 是否允许展示预置 L1 / L2 / L3

结论：允许，而且应当展示。

但要区分三类预置：

### L1 预置

可以展示：

- 演示通勤锚点；
- 演示公共交通时间；
- 演示距离；
- 演示生活圈摘要；
- 演示地理位置关系。

当前不应实时调用高德。

原因：

- Demo 应稳定；
- 不依赖本地 AMAP_API_KEY；
- 不消耗真实 API；
- 不暴露真实地址；
- 不让面试现场受网络和 key 配置影响。

### L2 预置

可以展示：

- 参考评分；
- 评分拆解；
- 通勤来源；
- 价格、面积、生活圈、主观评分等维度贡献；
- 对比摘要。

L2 可以用现有规则计算，也可以在 Demo 数据中预置结果。后续实现时应优先复用 lib/algorithm，避免写死过多逻辑。

### L3 预置

可以展示：

- 预生成 AI 分析文本；
- 条件化建议；
- 看房 checklist；
- 风险提示解释；
- trade-off 总结。

当前不应实时调用 DeepSeek 或其他模型。

原因：

- L3 尚未正式接入；
- Demo 应避免把未完成能力包装成实时能力；
- 预生成文本可以体现产品方向，同时保持稳定；
- 文案必须标明“演示文本，模拟未来 AI 辅助分析效果”。

## 10. Demo Mode 是否读取真实 localStorage

结论：不应读取真实 localStorage。

Demo Mode 必须与真实用户数据隔离。

不能读取：

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results
- IndexedDB 照片 Blob
- IndexedDB 缩略图
- 任何真实用户保存的本机资料

Demo Mode 应使用独立的静态 demo data source。

未来建议文件可能是：

- src/lib/demo/demo-listings.ts
- src/lib/demo/demo-work-locations.ts
- src/lib/demo/demo-commute-results.ts
- src/lib/demo/demo-ai-outputs.ts

但当前阶段不新增这些文件。

## 11. Demo Mode 是否允许修改真实用户数据

结论：不允许。

Demo Mode 必须只读。

不允许：

- 写入 localStorage；
- 写入 IndexedDB；
- 调用 saveListing；
- 调用 saveWorkLocation；
- 调用 upsertCommuteResult；
- 调用 savePhoto；
- 调用 clearLocalData；
- 调用 clearAllListingPhotos；
- 修改用户真实设置；
- 删除用户真实数据。

Demo 中如果出现按钮，应优先是演示按钮或禁用状态，不能触发真实数据写入。

未来如果做交互式 Demo，也应使用内存态，不落盘。

## 12. Demo Mode 和真实用户模式如何隔离

未来建议使用三层隔离。

### 数据源隔离

真实模式：

- localStorage；
- IndexedDB；
- /api/lbs/commute/transit；
- lib/local-store；
- lib/storage。

Demo 模式：

- 静态 demo data；
- 内存态交互；
- 预置通勤摘要；
- 预置 AI 文本；
- 不访问真实 localStorage；
- 不访问真实 IndexedDB。

### 路由隔离

真实模式：

- /portfolio
- /portfolio/new
- /portfolio/[id]
- /settings

Demo 模式：

- /demo

当前推荐未来只做 /demo，不把 Demo 混入 /portfolio。

### UI 提示隔离

Demo 页面顶部必须固定展示：

这是演示模式。所有房源、笔记、照片和分析均为虚构数据，不代表真实房源，不提供租赁建议。

Demo 卡片、详情页和 AI 文本附近也应有轻量标识：

演示数据

## 13. Demo Mode 是否会造成房源平台风险

如果处理不当，会。

风险点：

- Demo 房源看起来像真实可租房；
- Demo 有真实小区、真实价格、真实图片；
- Demo 有“推荐”“最佳房源”等措辞；
- Demo 提供类似房源发布页；
- Demo 有联系房东、预约看房、咨询入口；
- Demo 图片来自第三方平台；
- Demo 中展示中介视频或平台截图。

规避方式：

- 全部标记为虚构演示；
- 不提供任何联系入口；
- 不提供房源链接跳转；
- 不使用真实平台图片；
- 不声称真实性；
- 不写“系统推荐”；
- 不写“最佳房源”；
- 不写“真房源”；
- 不展示真实手机号、微信号；
- 不展示具体门牌号。

Demo Mode 必须服务于“找房决策工具演示”，不能变成“样板房源展示页”。

## 14. Demo Mode 是否会破坏本地优先定位

正确实现不会。

Demo Mode 不应削弱本地优先，反而应该帮助解释本地优先。

Demo 页面应展示：

- 哪些数据在真实模式下会保存在本机；
- 哪些字段会按需联网计算；
- 为什么照片默认本机保存；
- 为什么 JSON 导入 / 导出重要；
- 为什么 AI 只接收脱敏结构化摘要；
- 为什么 HouseFolio 不默认云同步。

Demo Mode 不是云端用户数据样板库，而是一个用虚构数据解释产品逻辑的展示层。

## 15. Demo Mode 与 Settings 的关系

当前不建议 Demo Mode 复用真实 Settings。

原因：

- Settings 是真实本机数据管理入口；
- Settings 可以清除真实 localStorage；
- Settings 可以清除真实照片；
- Settings 可以导入 JSON 覆盖真实结构化数据；
- Demo 用户不应误触真实数据管理。

未来如果 Demo 需要展示数据权利，可以做“Demo Settings Preview”或静态说明，不调用真实 Settings 动作。

Phase 3I-1 不实现任何 Settings Demo。

## 16. Demo Mode 与 L3 AI 的关系

Demo Mode 可以展示 L3 的未来形态，但不能误导为已实时接入 AI。

建议文案：

AI 辅助分析演示文本，基于虚构房源数据预生成，仅用于展示产品方向。

Demo L3 输出应保持 HouseFolio 的表达边界：

允许：

- 如果你优先通勤，A 更合适；
- 如果你优先面积，B 更稳；
- C 的价格低，但通勤压力和信息完整度较弱，建议谨慎核实；
- 下次看房建议确认噪音、潮湿、电梯等待时间。

禁止：

- A 是最佳房源；
- 系统推荐 A；
- 这套一定值得租；
- 这是真房源；
- 这套没有风险；
- 我替你判断选 A。

## 17. Demo Mode 与 L2 Reference Score 的关系

Demo Mode 可以展示 Reference Score，但必须继续强调：

- 参考评分；
- 辅助比较；
- 维度拆解；
- 不代表最终推荐；
- 用户可根据硬性条件一票否决。

Demo 中的排序也不能叫“推荐排序”，应叫：

- 按参考评分排序；
- 按通勤时间排序；
- 按租金排序；
- 按用户偏好排序。

禁止：

- 推荐分；
- 最优排序；
- 系统推荐；
- 替你决定。

## 18. Demo Mode 与 L1 LBS 的关系

Demo Mode 应展示 L1 的价值，但当前不应实时接高德。

允许展示：

- 预置通勤时长；
- 预置距离；
- 多个通勤锚点；
- 多通勤锚点之间的空间折中；
- 通勤压力摘要。

暂不展示：

- 真实地图；
- 真实 POI；
- 真实等时圈；
- 实时 geocode；
- 实时路径规划；
- 高德原始返回；
- 经纬度。

原因：

- 当前 Phase 2D 只完成了 Detail 手动 transit 计算；
- POI / 生活圈真实计算尚未完成；
- 地图 UI 尚未完成；
- Demo 不应展示尚未实现的真实能力。

如果展示生活圈，应标明为演示数据或模拟摘要。

## 19. Demo Mode 与照片能力的关系

Demo Mode 可以展示“房源有照片”的产品效果，但不应接入真实 IndexedDB 照片。

建议：

- 初期用占位图；
- 后续用 AI 生成或授权素材；
- 不读取用户本机照片；
- 不写入 IndexedDB；
- 不展示真实看房照片；
- 不展示第三方平台房源图；
- 不把 Demo 图片用于暗示房源真实性。

如果未来想展示本机照片能力，建议使用说明文案，而不是实际读写用户本机图片。

## 20. Demo Mode 后续最小实现建议

如果后续进入实现，建议按以下顺序推进：

### Phase 3I-2：Demo Mode implementation plan

只写计划，不改代码。

明确：

- 路由；
- 文件范围；
- demo data shape；
- 与真实数据隔离方式；
- UI 提示；
- 验证标准。

### Phase 3I-3：Demo data scaffold

新增静态 demo 数据，但不新增页面。

建议文件：

- src/lib/demo/demo-listings.ts
- src/lib/demo/demo-work-locations.ts
- src/lib/demo/demo-commute-results.ts
- src/lib/demo/demo-ai-outputs.ts

### Phase 3I-4：Demo route shell

新增 /demo 页面，只展示只读 Demo 首页或 Portfolio shell。

### Phase 3I-5：Demo portfolio / detail

展示虚构房源列表和详情。

### Phase 3I-6：Demo L1 / L2 / L3 presentation

展示预置 L1 / L2 / L3 输出。

### Phase 3I-7：Demo Mode regression and closing

验证 build、git clean、真实数据隔离、文案边界和功能入口。

当前不直接进入实现。

## 21. 当前阶段不做清单

Phase 3I-1 不做：

- 不新增 /demo；
- 不新增首页入口；
- 不新增 demo data；
- 不新增组件；
- 不改 AppNav；
- 不改 ComplianceFooter；
- 不改 Portfolio；
- 不改 Detail；
- 不改 Settings；
- 不改 localStorage；
- 不改 IndexedDB；
- 不改 L1 API route；
- 不改 L2 scoring；
- 不接 L3 AI；
- 不接 DeepSeek；
- 不调用高德；
- 不做地图；
- 不做 POI；
- 不做真实照片；
- 不做视频；
- 不做 Chrome 插件；
- 不做 Supabase；
- 不做部署。

## 22. 后续验收标准

Phase 3I-1 的验收标准：

- 新增本评审文档；
- 不修改任何源码；
- 不新增路由；
- npm.cmd run build 通过；
- git status clean；
- commit 信息为 docs: review demo mode boundary。

未来实现 Demo Mode 时的验收标准另行定义。

## 23. 最终结论

Demo Mode 是 HouseFolio 作为求职作品集的关键展示层能力。

但 Demo Mode 必须严格遵守以下原则：

- 只使用虚构数据；
- 不读取真实 localStorage；
- 不读取真实 IndexedDB；
- 不修改真实用户数据；
- 不使用第三方平台房源素材；
- 不公开真实房源；
- 不伪装成真实房源平台；
- 不实时调用高德或 AI；
- 不把预置 L3 文本说成实时 AI；
- 不把 Reference Score 说成推荐分；
- 不把 Demo 图片或未来视频作为真实房源材料；
- 不破坏本地优先定位。

Phase 3I-1 到此为止，只形成 Demo Mode 边界评审文档，不进入实现。

下一步如果继续 Demo Mode，应进入：

Phase 3I-2：Demo Mode implementation plan

仍建议先写计划文档，再小步实现。