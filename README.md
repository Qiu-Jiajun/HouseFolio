# HouseFolio

HouseFolio 是一个面向中国大陆租客的本地优先私人找房决策管理工具。它帮助租客管理自己主动收集的候选房源，并通过通勤锚点、参考评分、横向对比和 AI 辅助解释，完成多房源比较与看房决策复盘。

它不是房源平台、中介平台、房源聚合平台或真房源认证平台。

- GitHub Repository: https://github.com/Qiu-Jiajun/HouseFolio
- Live Demo: https://house-folio.vercel.app/
- Demo Route: https://house-folio.vercel.app/demo

## 1. Why HouseFolio

租客找房时，真正困难的往往不是“哪里有房”，而是“我已经收集了几套候选房源，应该如何比较”。

现实中的候选信息通常散落在多个地方：

- 贝壳、58、小红书、豆瓣等平台链接；
- 微信聊天记录；
- 实地看房照片；
- 自己的备忘录；
- 地图里的反复通勤查询；
- 对房源优缺点的主观印象。

HouseFolio 选择不做新的房源平台，而是把用户自己主动收集的候选房源组织成一个私人决策工作台。

核心问题是：

- 哪套房通勤压力更小？
- 哪套房资料更完整？
- 哪套房的价格、面积、位置、主观感受更值得继续看？
- 多套候选房源之间应该如何横向比较？
- AI 应该如何在不替用户决定的前提下，把结构化结果解释成人话？

## 2. Product Positioning

HouseFolio 的定位是：

本地优先的私人找房决策管理工具。

HouseFolio 做：

- 管理用户自行收集的候选房源；
- 记录看房笔记、主观评分、状态和本机照片；
- 保存工作/学习地点，也就是通勤锚点；
- 基于通勤、价格、面积、资料完整度等维度做参考评分；
- 支持 2–4 套候选房源横向比较；
- 用 L3 AI 辅助解释结构化比较结果；
- 在 Settings 中提供本地数据查看、导出、导入和清除能力。

HouseFolio 不做：

- 不抓取第三方房源页面；
- 不搬运贝壳、58、小红书、豆瓣等平台内容；
- 不公开用户房源库；
- 不做房东端、预约看房、联系房东、中介撮合、佣金或保证金；
- 不认证真房源；
- 不宣传避坑保真；
- 不输出最佳房源、最优选择、系统推荐、推荐分或替你决定；
- 不让 LLM 做评分、排序、筛选或房源真假判断。

## 3. Current Demo Workflow

当前稳定 Demo 主链路是：

1. 进入 Portfolio，查看用户自行收集的候选房源；
2. 选择 2–4 套房源；
3. 跳转到 /compare?ids=...；
4. 读取本机 listings；
5. 通过 buildComparisonInputs() 生成 ComparisonInput / ComparisonModel；
6. 展示 CompareTable 横向对比表；
7. 展示静态 L3-facing 解释面板；
8. 点击 AI 辅助解释；
9. 先展示 AI confirmation UI；
10. 用户确认后调用 /api/ai/compare-explanation；
11. 默认走 mock AI provider；
12. 展示 session-only AI output；
13. 刷新页面后 AI output 消失；
14. Settings 不保存 AI 输出。

这条链路已经通过 Phase 4H browser manual regression，可用于作品集 Demo 和面试展示。

## 4. Three-layer Architecture

HouseFolio 的核心是 L1 / L2 / L3 三层决策架构。

### L1: LBS Layer

L1 负责空间关系和通勤相关能力。

当前已完成：

- 工作/学习地点，也就是通勤锚点，本地保存；
- Detail 页手动计算公共交通参考通勤；
- /api/lbs/commute/transit 服务端 route；
- LBS provider 封装；
- commute-results 本地保存；
- Settings 可查看、导出和清除通勤相关本地数据。

边界：

- 页面不直接调用高德 REST API；
- 不使用 NEXT_PUBLIC_AMAP_API_KEY；
- 不把真实高德 key 暴露到前端；
- 服务端 route 只返回通勤摘要；
- 不向客户端返回 coordinate、raw JSON、request URL、polyline、steps 或 apiKey。

### L2: Algorithm Layer

L2 负责结构化比较、参考评分和规则计算。

当前已完成：

- Reference Score 参考评分；
- L1 commute-results 接入 L2；
- Comparison model layer；
- buildComparisonInputs()；
- Portfolio 选择 2–4 套房源；
- /compare route；
- CompareTable 横向对比表；
- 缺失字段与风险信号 tag；
- Compare product polish；
- Compare browser regression。

边界：

- Reference Score 只是参考评分；
- 只用于辅助比较；
- 不代表最终推荐；
- 用户仍可根据硬性条件一票否决；
- 不把 L2 写成推荐系统；
- 不用 LLM 做评分、排序或筛选。

### L3: AI Explanation Layer

L3 负责把 L1 / L2 的结构化结果解释成人话。

当前已完成：

- Static L3-facing compare explanation panel；
- AI compare explanation type scaffold；
- redacted input builder；
- mock AI provider；
- /api/ai/compare-explanation；
- AI confirmation UI；
- session-only mock AI output；
- DeepSeek provider layer；
- real-provider-capable route selection；
- DeepSeek missing-config safe path；
- real provider readiness review。

当前未完成：

- 未做真实 DeepSeek success test；
- 未做真实 DeepSeek browser regression；
- 未做 AI output persistence；
- 未做 AI history；
- 未做 Settings AI 数据权利覆盖；
- 未做 AI 输出导出 / 删除；
- 未做真实 provider 成本 / 频控完善。

L3 边界：

- L3 只能解释 L2 comparison 结果；
- 不能做评分；
- 不能做排序；
- 不能做筛选；
- 不能替用户决定；
- 不能判断房源真假；
- 不能输出最佳房源、系统推荐或推荐分。

## 5. Current Features

### Portfolio

- 展示候选房源卡片；
- 支持状态展示；
- 显示租金、面积、通勤、参考评分等摘要信息；
- 支持选择 2–4 套房源进入 Compare；
- 选择状态是临时比较动作，不做持久化。

### Add Listing

- 用户主动添加候选房源；
- 不主动抓取第三方页面；
- 不自动搬运第三方平台内容。

### Detail

- 展示房源详情；
- 支持本地笔记；
- 支持主观评分；
- 支持状态管理；
- 支持本机照片保存与展示；
- 支持公共交通参考通勤计算；
- 显示 L1 / L2 相关信息。

### Compare

- /compare route；
- 通过 URL query 接收 selected listing ids；
- 读取本机 listings；
- 构建 ComparisonInput / ComparisonModel；
- 展示结构化 preview；
- 展示 CompareTable 横向表；
- 展示缺失字段和风险信号；
- 提供查看详情入口；
- 明确辅助比较、不代表最终推荐。

### AI-assisted Explanation

- 提供 AI 辅助解释入口；
- 触发前显示 confirmation UI；
- 默认 mock provider 可用于 Demo；
- 输出为 session-only；
- 刷新后 AI 输出消失；
- 当前不保存 AI 输出历史。

### Settings

- 查看本地数据；
- 导出本地 JSON；
- 导入本地 JSON；
- 清除本机结构化数据；
- 查看本机照片数量与占用空间；
- 清除本机照片；
- 说明 mock data 与用户数据区别；
- 说明当前未完成真实 AI success path。

## 6. Routes

当前主要 routes：

| Route | Status | Purpose |
|---|---|---|
| / | Done | 首页与项目入口 |
| /demo | Done | 作品集 Demo 展示页 |
| /portfolio | Done | 候选房源管理 |
| /portfolio/new | Done | 添加房源 |
| /portfolio/[id] | Done | 房源详情 |
| /compare | Done | 多房源横向比较 |
| /settings | Done | 本地数据权利与设置 |
| /api/lbs/commute/transit | Done | 服务端 LBS 通勤计算 route |
| /api/ai/compare-explanation | Done | AI 辅助解释 route，默认 mock provider |

## 7. Privacy and Data Boundary

HouseFolio 采用本地优先设计。

当前本地数据包括：

- housefolio:listings；
- housefolio:listing-notes；
- housefolio:listing-ratings；
- housefolio:listing-status-overrides；
- housefolio:work-locations；
- housefolio:commute-results；
- IndexedDB 中的本机照片数据。

当前 AI 输出：

- 不进入 localStorage；
- 不进入 Settings export；
- 不进入 AI history；
- 不持久化；
- 刷新后消失。

照片边界：

- 本机保存；
- 不默认上传云端；
- 不默认进入 AI；
- 不进入 Compare；
- 不公开展示；
- 不作为 Demo 素材对外搬运。

视频边界：

- 看房视频是合理的长期资料类型；
- 当前不实现视频存储；
- 当前不实现视频播放器；
- 当前不做 AI 视频分析；
- 当前不进入 Compare。

## 8. Technical Highlights

当前技术栈与工程亮点：

- Next.js 16；
- TypeScript；
- Turbopack build；
- localStorage 本地结构化数据；
- IndexedDB 本机照片存储；
- lib/local-store 数据封装；
- lib/storage provider 封装；
- lib/lbs provider 封装；
- lib/algorithm comparison model；
- lib/ai provider boundary；
- mock AI provider；
- DeepSeek provider readiness；
- API route contract check；
- browser manual regression；
- Windows + PowerShell 稳定开发流程。

架构原则：

- 页面和 UI 组件不得直接绑定平台 SDK；
- L1 通过 lib/lbs；
- L2 通过 lib/algorithm；
- L3 通过 lib/ai；
- 本机照片通过 lib/storage；
- 本地结构化数据通过 lib/local-store / lib/privacy；
- 后续迁移到国内云、国内 PostgreSQL、国内对象存储或国内模型 API 时，应尽量只替换 provider 层。

## 9. Current Status

当前已完成到：

- Phase 4A：Comparison model layer；
- Phase 4B：Compare UI main workflow；
- Phase 4C：Static L3-facing explanation；
- Phase 4D：Mock AI provider / API route / UI trigger / real route provider selection；
- Phase 4E：AI confirmation UI；
- Phase 4F：Real provider readiness review；
- Phase 4G：Compare product polish；
- Phase 4H：Compare browser regression / demo presentation checkpoint；
- Phase 4I-1：README current-state review。

当前最新稳定能力：

- Portfolio 选择 2–4 套房源；
- /compare?ids=...；
- CompareTable 横向对比；
- 静态解释面板；
- AI confirmation UI；
- mock AI output；
- session-only output；
- Settings 本地数据边界；
- build passed；
- browser regression passed。

## 10. Not Yet Implemented

当前仍未完成，也不应声称完成：

- 真实 DeepSeek success test；
- 真实 DeepSeek browser regression；
- AI output persistence；
- AI history；
- Settings AI 数据权利覆盖；
- AI 输出导出 / 删除；
- 真实 provider 成本 / 频控完善；
- 真实 provider public launch readiness；
- selection localStorage；
- Compare history；
- 照片进入 Compare；
- 视频进入 Compare；
- 地图进入 Compare；
- Supabase；
- 云端账号系统；
- 真实 POI 生活圈计算；
- 公开运营能力；
- 房源真实性认证。

## 11. Demo Presentation Script

推荐面试或作品集展示顺序：

1. 打开首页，说明 HouseFolio 是私人找房决策管理工具，不是房源平台；
2. 进入 Portfolio，展示用户自行收集的候选房源；
3. 打开 Detail，展示笔记、评分、状态和本机照片；
4. 打开 Settings，展示本地数据查看、导出、导入和清除；
5. 回到 Portfolio，选择 2–4 套房源；
6. 进入 Compare，展示横向表；
7. 解释 L2：参考评分、缺失字段、风险信号来自规则与结构化数据，不来自 LLM；
8. 展示静态解释面板，说明 L3 只做人话解释；
9. 点击 AI 辅助解释，展示 confirmation UI；
10. 确认后生成 mock AI output；
11. 刷新页面，说明 AI output session-only；
12. 总结 L1 / L2 / L3 架构边界与合规克制。

## 12. Development Commands

Windows + PowerShell 环境下使用：

    Set-Location E:\Projects\housefolio
    npm.cmd install
    npm.cmd run dev
    npm.cmd run build

不要默认使用：

    npm install
    npm run dev
    npm run build

## 13. Disclaimer

HouseFolio 是一个辅助比较工具，不代表最终推荐。

用户应自行核实房源信息、价格、合同条款、房东或中介身份、周边环境和实际居住条件。

HouseFolio 不发布、不抓取、不聚合、不审核任何房源信息，不提供房源真实性认证，不撮合交易，不参与租赁合同。