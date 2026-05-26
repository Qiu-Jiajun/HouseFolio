# HouseFolio

HouseFolio 是一个面向中国大陆年轻租客的本地优先私人找房决策管理工具。

它帮助用户把自己主动收集的候选房源、看房笔记、本机照片、通勤锚点和后续签约前合同文本组织成一个私有工作台，并通过通勤参考、参考评分、横向比较、AI 辅助解释和合同风险提示，辅助完成“收集候选房源 → 看房比较 → 准备签约 → 检查合同风险”的租房决策链路。

HouseFolio 不是房源平台、中介平台、房源聚合平台、真房源认证平台，也不是 AI 法律服务平台。

- GitHub Repository: https://github.com/Qiu-Jiajun/HouseFolio
- Live Demo: https://house-folio.vercel.app/
- Demo Route: https://house-folio.vercel.app/demo

---

## 1. Why HouseFolio

租客找房时，真正困难的往往不是“哪里有房”，而是：

> 我已经从多个渠道收集了一批候选房源，应该如何比较、记录、复盘，并在签约前尽量识别合同里的常见风险点？

现实中的找房资料通常散落在多个地方：

- 贝壳、58、小红书、豆瓣等平台链接；
- 微信聊天记录；
- 实地看房照片；
- 自己的备忘录；
- 地图里的反复通勤查询；
- 对房源优缺点的主观印象；
- 签约前拿到的租赁合同文本或合同照片。

HouseFolio 不试图再造一个新的房源平台，而是把用户已经主动收集到的候选房源整理成一个私人决策工作台。

它关注的问题是：

- 哪套房通勤压力更小？
- 哪套房资料更完整？
- 哪套房更值得继续看？
- 多套候选房源之间应该如何横向比较？
- AI 如何在不替用户决定的前提下，把结构化比较结果解释成人话？
- 签约前，合同中有哪些押金、违约金、维修责任、入室权、提前解约等常见风险点值得追问或确认？

---

## 2. Product Positioning

HouseFolio 的定位是：

> 本地优先的私人找房决策管理工具。

它面向的是已经在多个渠道看过房源、需要把候选房源组织起来进行比较的租客，而不是房东、中介或平台运营方。

### HouseFolio 做什么

- 管理用户自行收集的候选房源；
- 记录看房笔记、主观评分、状态和本机照片；
- 保存工作 / 学习地点，即通勤锚点；
- 基于通勤、价格、面积、资料完整度等维度生成参考评分；
- 支持 2–4 套候选房源横向比较；
- 用 L3 AI 对结构化比较结果做辅助解释；
- 在 Settings 中提供本地数据查看、导出、导入和清除能力；
- 规划签约前合同风险提示助手：用户主动提供合同文本或 OCR 校对后的文本后，系统进行条款切分、规则命中和 AI 通俗解释。

### HouseFolio 不做什么

- 不抓取第三方房源页面；
- 不搬运贝壳、58、小红书、豆瓣等平台内容；
- 不公开用户房源库；
- 不做房东端、预约看房、联系房东、中介撮合、佣金或保证金；
- 不认证真房源；
- 不宣传“避坑保真”；
- 不输出“最佳房源”“最优选择”“系统推荐”“推荐分”或“替你决定”；
- 不让 LLM 做评分、排序、筛选或房源真假判断；
- 不把合同助手包装成 AI 律师、法律审查系统或违法判定器；
- 不承诺合同审查无遗漏，不提供正式法律意见。

---

## 3. Current Demo Workflow

当前稳定 Demo 主链路是：

1. 打开新版首页，了解 HouseFolio 的产品定位；
2. 进入 Portfolio，查看用户自行收集的候选房源；
3. 打开房源详情页，查看笔记、评分、状态、本机照片和通勤信息；
4. 在 Settings 中查看、导出、导入和清除本地数据；
5. 回到 Portfolio，选择 2–4 套候选房源；
6. 跳转到 `/compare?ids=...`；
7. 读取本机 listings；
8. 通过 `buildComparisonInputs()` 生成 `ComparisonInput` / `ComparisonModel`；
9. 展示 `CompareTable` 横向对比表；
10. 展示静态 L3-facing 辅助解释面板；
11. 点击 AI 辅助解释；
12. 展示 AI confirmation UI；
13. 用户确认后调用 `/api/ai/compare-explanation`；
14. 根据环境配置走 mock provider 或 DeepSeek provider；
15. 展示 session-only AI output；
16. 用户可以清除当前 AI 输出；
17. 刷新页面后 AI output 不持久化；
18. Settings 不保存 AI 输出，也没有 AI history。

这条链路用于作品集 Demo 和面试展示，核心展示的是：

- 本地优先数据管理；
- L1 / L2 / L3 分层架构；
- 多房源横向比较；
- AI 只做解释，不做决策；
- 隐私、合规和迁移边界控制。

---

## 4. Three-layer Architecture

HouseFolio 的核心架构是 L1 / L2 / L3 三层决策引擎。

### L1: LBS Layer

L1 负责空间关系和通勤相关能力。

当前已完成：

- 工作 / 学习地点，也就是通勤锚点，本地保存；
- Detail 页手动计算公共交通参考通勤；
- `/api/lbs/commute/transit` 服务端 route；
- LBS provider 封装；
- commute-results 本地保存；
- Settings 可查看、导出和清除通勤相关本地数据。

边界：

- 页面不直接调用高德 REST API；
- 不使用 `NEXT_PUBLIC_AMAP_API_KEY`；
- 不把真实高德 key 暴露到前端；
- 服务端 route 只返回通勤摘要；
- 不向客户端返回 coordinate、raw JSON、request URL、polyline、steps 或 apiKey。

### L2: Algorithm Layer

L2 负责结构化比较、参考评分和规则计算。

当前已完成：

- Reference Score 参考评分；
- L1 commute-results 接入 L2；
- Comparison model layer；
- `buildComparisonInputs()`；
- Portfolio 选择 2–4 套房源；
- `/compare` route；
- `CompareTable` 横向对比表；
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

### L3: AI Layer

L3 负责解释、总结和 checklist，不负责计算和决策。

当前已完成：

- 静态 L3-facing explanation panel；
- AI compare explanation types；
- redacted input builder；
- mock AI provider；
- DeepSeek provider layer；
- provider selection；
- AI confirmation UI；
- session-only AI output；
- AI output clear control；
- 真实 provider 的安全边界和 missing-config path；
- 真实 DeepSeek 演示链路的阶段性验证。

边界：

- L3 只能解释 L2 comparison 结果；
- 不做评分；
- 不做排序；
- 不做筛选；
- 不替用户决定；
- 不判断房源真假；
- 不输出“最佳房源”“最优选择”“系统推荐”“推荐分”或“替你决定”。

---

## 5. Contract Risk Assistant

合同风险提示助手是 HouseFolio v3.1 后新增的产品方向，目前属于规划与后续实现阶段，不应被理解为当前 Demo 已完整上线的功能。

### 目标

在用户准备签约前，辅助识别租房合同中的常见风险点，并生成：

- 风险条款提示；
- 风险等级或关注优先级；
- 通俗解释；
- 签约前追问清单；
- 建议改写方向；
- 审读报告。

### 第一版边界

第一版优先支持：

1. 用户主动粘贴合同文本；
2. 或用户通过 OCR 提取合同照片文字后，先人工校对文本；
3. 系统按条款切分；
4. L2 规则库命中常见风险类型；
5. L3 AI 只做人话解释、追问清单和建议改写方向；
6. 不直接输出法律结论。

### 不做

- 不把 AI 包装成律师；
- 不承诺审查无遗漏；
- 不直接判定条款违法、无效或霸王条款；
- 不输出维权结论；
- 不默认上传身份证、房产证、签字页、付款凭证等敏感材料；
- 不在未经用户确认和脱敏的情况下把合同全文发送给 AI；
- 不把合同助手变成法律服务平台。

---

## 6. UI / UX Direction

Phase 8A 已完成首页 UI/UX 受众匹配改版。

改版目标不是做一个更炫的工程 Demo，而是让 HouseFolio 更像中国大陆年轻租客能够理解和愿意使用的生活决策工具。

当前首页视觉方向：

- 温馨白色 / 米白色基调；
- 柔和绿色辅助色；
- 生活化居家背景图；
- 左侧大标题与主 CTA；
- 右侧居家场景视觉；
- 三枚横向悬浮能力卡；
- 本地优先隐私提示；
- 更像“租房清单 + 看房备忘录 + 消费决策工具”，而不是工程 dashboard。

首页关键入口：

- “开始整理候选房源” → `/portfolio`
- “了解如何辅助比较” → `/demo`
- 顶部导航“设置” → `/settings`

---

## 7. Routes

当前主要 routes：

| Route | Status | Purpose |
|---|---|---|
| `/` | Done | 首页与项目入口，已完成 Phase 8A 视觉改版 |
| `/demo` | Done | 作品集 Demo 展示页 |
| `/portfolio` | Done | 候选房源管理 |
| `/portfolio/new` | Done | 添加候选房源 |
| `/portfolio/[id]` | Done | 房源详情 |
| `/compare` | Done | 多房源横向比较 |
| `/settings` | Done | 本地数据权利与设置 |
| `/api/lbs/commute/transit` | Done | 服务端 LBS 通勤计算 route |
| `/api/ai/compare-explanation` | Done | AI 辅助解释 route，支持 provider selection |
| `/contract-review` | Planned | 合同风险提示助手，尚未实现 |
| OCR flow | Planned | 合同照片文字提取，必须先由用户校对文本后再进入 AI 分析 |

---

## 8. Privacy and Data Boundary

HouseFolio 采用本地优先设计。

当前本地数据包括：

- `housefolio:listings`
- `housefolio:listing-notes`
- `housefolio:listing-ratings`
- `housefolio:listing-status-overrides`
- `housefolio:work-locations`
- `housefolio:commute-results`
- IndexedDB 中的本机照片数据

当前 AI 输出：

- 不进入 localStorage；
- 不进入 Settings export；
- 不进入 AI history；
- 不持久化；
- 刷新后消失；
- 用户可清除当前 session 内的 AI 输出。

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

合同文本边界：

- 合同文本属于高敏资料；
- 第一版应默认本地优先；
- AI 调用前必须提示用户确认；
- OCR 后必须让用户校对文本；
- 不默认上传身份证、房产证、签字页等敏感材料；
- 不长期保存 AI prompt 原文。

---

## 9. Technical Highlights

当前技术栈与工程亮点：

- Next.js 16；
- TypeScript；
- Turbopack build；
- localStorage 本地结构化数据；
- IndexedDB 本机照片存储；
- `lib/local-store` 数据封装；
- `lib/storage` provider 封装；
- `lib/lbs` provider 封装；
- `lib/algorithm` comparison model；
- `lib/ai` provider boundary；
- mock AI provider；
- DeepSeek provider layer；
- API route contract check；
- browser manual regression；
- Windows + PowerShell 稳定开发流程。

架构原则：

- 页面和 UI 组件不得直接绑定平台 SDK；
- L1 通过 `lib/lbs`；
- L2 通过 `lib/algorithm`；
- L3 通过 `lib/ai`；
- 本机照片通过 `lib/storage`；
- 本地结构化数据通过 `lib/local-store` / `lib/privacy`；
- 后续迁移到国内云、国内 PostgreSQL、国内对象存储或国内模型 API 时，应尽量只替换 provider 层。

---

## 10. Current Status

当前已完成：

- Phase 4 主体 Demo 链路；
- Portfolio → Compare → AI explanation 主链路；
- L1 通勤摘要；
- L2 参考评分与横向比较；
- L3 AI 辅助解释；
- AI confirmation UI；
- session-only AI output；
- DeepSeek provider path；
- 本地数据查看、导出、导入和清除；
- 本机照片保存；
- Phase 8A 首页 UI/UX 受众匹配改版；
- Production Demo 基础演示闭环。

当前推荐阶段：

- Frozen Demo 使用期；
- 面试演示；
- 简历 / 作品集表达；
- Q&A 准备；
- UI/UX 继续向 Portfolio / Compare 受众匹配推进；
- 合同风险提示助手进入边界评审与最小实现规划。

---

## 11. Roadmap

### Near-term

- Phase 8B：Portfolio visual audience-fit review；
- 候选房源列表页视觉与信息层级优化；
- 保持首页、Portfolio、Compare 的生活化风格一致；
- 不改变核心数据结构；
- 不引入 Supabase；
- 不扩张房源平台能力。

### Contract Assistant Roadmap

- Phase 9A：Contract risk assistant boundary review；
- Phase 9B：合同文本粘贴版最小页面；
- Phase 9C：条款切分与风险规则库；
- Phase 9D：AI 通俗解释与追问清单；
- Phase 9E：审读报告导出；
- Phase 9F：OCR provider 评估与接入；
- Phase 9G：OCR 后文本校对流程；
- Phase 9H：合同助手数据权利接入 Settings。

---

## 12. Not Yet Implemented

当前仍未完成，也不应声称完成：

- `/contract-review` 页面；
- 合同风险提示助手正式 UI；
- 合同条款切分；
- 租房合同风险规则库；
- OCR provider 接入；
- OCR 后文本校对流程；
- 合同审读报告导出；
- 合同审读记录的数据权利覆盖；
- Settings AI 输出导出 / 删除；
- AI output persistence；
- AI history；
- selection localStorage；
- Compare history；
- 照片进入 Compare；
- 视频进入 Compare；
- 地图进入 Compare；
- Supabase；
- 云端账号系统；
- 真实 POI 生活圈计算；
- 公开运营能力；
- 房源真实性认证；
- AI 法律结论；
- 律师级合同审查。

---

## 13. Demo Presentation Script

推荐面试或作品集展示顺序：

1. 打开首页，说明 HouseFolio 是本地优先的私人找房决策工具，不是房源平台；
2. 说明新版首页已经从工程 Demo 调整为更生活化的租客工具入口；
3. 进入 Portfolio，展示用户自行收集的候选房源；
4. 打开 Detail，展示笔记、评分、状态、本机照片和通勤摘要；
5. 打开 Settings，展示本地数据查看、导出、导入和清除；
6. 回到 Portfolio，选择 2–4 套房源；
7. 进入 Compare，展示横向表；
8. 解释 L2：参考评分、缺失字段、风险信号来自规则与结构化数据，不来自 LLM；
9. 展示静态解释面板，说明 L3 只做人话解释；
10. 点击 AI 辅助解释，展示 confirmation UI；
11. 确认后生成 AI output；
12. 说明 AI output session-only，不进入本地历史；
13. 总结 L1 / L2 / L3 架构边界与合规克制；
14. 最后说明下一阶段会补充签约前合同风险提示助手，但不会把它包装成 AI 律师或法律审查系统。

---

## 14. Development Commands

Windows + PowerShell 环境下使用：

```powershell
Set-Location E:\Projects\housefolio
npm.cmd install
npm.cmd run dev
npm.cmd run build
