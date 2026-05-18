# Phase 4H-2：Compare demo presentation closing checkpoint

## 0. 阶段定位

Phase 4H-2 是 Compare browser regression / demo presentation checkpoint 的收口文档。

本阶段用于确认：

- Phase 4H-0 回归计划已完成；
- Phase 4H-1 浏览器手动回归已完成；
- Compare 主链路已经可以用于面试 / 作品集 Demo；
- 当前仍不做真实 DeepSeek success test；
- 当前仍不新增 AI 输出持久化、AI history 或 Settings AI 数据权利区。

本阶段只写文档，不修改功能代码。

## 1. 当前稳定点

当前最新稳定点：

- cd29387 docs: log compare browser regression

当前最后确认：

- HEAD = origin/main = origin/HEAD = cd29387
- git status clean
- npm.cmd run build passed
- Phase 4H-1 browser manual regression passed

## 2. 本阶段完成内容

Phase 4H 已完成：

### Phase 4H-0：Compare browser regression / demo presentation checkpoint plan

新增文件：

- docs/architecture/phase-4h-0-compare-browser-regression-demo-checkpoint-plan.md

提交：

- 944dacd docs: plan compare browser regression checkpoint

完成内容：

- 明确 Compare browser regression 的检查范围；
- 明确 Demo presentation 展示顺序；
- 明确不做真实 DeepSeek success test；
- 明确不改 src 功能代码；
- 明确不新增 localStorage key；
- 明确不改 Settings；
- 明确不让照片 / 视频进入 Compare。

### Phase 4H-1：Compare browser manual regression

新增文件：

- docs/dev-log/2026-05-18-phase-4h-1-compare-browser-manual-regression.md

提交：

- cd29387 docs: log compare browser regression

完成内容：

- /、/demo、/portfolio、/compare、/settings 页面检查通过；
- Portfolio 选择 1 套、2 套、3–4 套、超过 4 套行为通过；
- /compare?ids=... 主链路通过；
- CompareTable 横向表通过；
- 静态解释面板通过；
- AI confirmation UI 通过；
- mock AI output 通过；
- 刷新后 AI output 消失；
- localStorage 未发现 AI output / history / selection persistence；
- Settings 未出现 AI 数据区；
- Console 无红色 runtime error；
- 浏览器展示链路未发现禁止措辞问题。

## 3. 当前 Compare Demo 主链路

当前可用于 Demo 的主链路是：

Portfolio
→ 选择 2–4 套房源
→ /compare?ids=...
→ 本机 listings 读取
→ buildComparisonInputs()
→ ComparisonInput[] / ComparisonModel[]
→ CompareTable 横向表
→ CompareExplanationPanel 静态辅助解释
→ AI confirmation UI
→ /api/ai/compare-explanation
→ 默认 mock provider
→ session-only AI output
→ 刷新后 AI output 消失
→ Settings 不保存 AI 输出

## 4. Demo 展示顺序

建议面试 / 作品集展示顺序：

1. 打开首页，说明 HouseFolio 是私人找房决策管理工具，不是房源平台；
2. 进入 Portfolio，展示用户自行收集的候选房源；
3. 选择 2–4 套房源，说明这是临时比较动作，不做 selection 持久化；
4. 进入 Compare，展示横向对比表；
5. 解释 L2：参考评分、缺失字段、风险信号来自规则与结构化数据，不来自 LLM；
6. 展示静态解释面板，说明 L3 只做人话解释；
7. 点击 AI 辅助解释，展示 AI confirmation UI；
8. 说明用户确认后才会调用 AI 辅助解释；
9. 确认后生成 mock AI 输出；
10. 刷新页面，说明 AI output 是 session-only；
11. 进入 Settings，展示本地数据查看、导出、清除能力；
12. 回到产品边界：不抓取、不撮合、不认证真房源，核心是辅助用户比较自己收集的候选房源。

## 5. 当前可以对外讲清楚的能力

当前 HouseFolio 已经可以讲清楚以下能力：

- 用户主动添加候选房源；
- Portfolio 管理候选房源；
- Detail 记录笔记、评分、状态和本机照片；
- Settings 管理本地数据权利；
- Compare 支持 2–4 套候选房源横向比较；
- L2 comparison 使用结构化模型与规则结果；
- L3 只做人话解释，不做评分、排序、筛选或最终推荐；
- AI 触发前有确认步骤；
- 默认 mock AI provider 可用于 Demo；
- AI output 不持久化；
- 当前未做真实 DeepSeek success test。

## 6. 当前仍未做事项

当前仍未做，也不要声称完成：

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
- 云端账号系统。

## 7. 产品边界确认

当前 Compare / AI 展示仍然遵守 HouseFolio 的长期边界：

- 不抓取第三方房源页面；
- 不搬运贝壳、58、小红书、豆瓣等平台内容；
- 不公开用户房源库；
- 不做房东端、预约看房、联系房东、中介撮合、佣金、保证金；
- 不宣传真房源；
- 不宣传避坑保真；
- 不把 Reference Score 写成推荐系统；
- 不让 LLM 做评分、排序、筛选、真假判断；
- 不输出最佳房源、最优选择、系统推荐、推荐分、替你决定。

## 8. 阶段结论

Phase 4H：Compare browser regression / demo presentation checkpoint 已收口。

当前 HouseFolio 已具备一条稳定可演示的 Compare 主链路：

Portfolio
→ Compare
→ L2 横向对比
→ Static L3 explanation
→ AI confirmation
→ Mock AI output
→ Session-only output
→ Settings 本地数据边界

当前建议下一步进入：

- Phase 4I-0：Project demo / README / portfolio presentation review

或先生成新对话 handoff，把 Phase 4F–4H 的状态整理进 Project Sources。