# Phase 4I-0：Project demo / README / portfolio presentation review

## 0. 阶段定位

Phase 4I-0 是 HouseFolio 面向作品集、GitHub README、Demo 展示和面试叙事的前置评审。

本阶段只回答：

- 当前项目应该如何对外展示；
- README / Demo / 面试介绍应该突出什么；
- 哪些能力可以讲，哪些能力不能夸大；
- 当前稳定 Demo 链路如何组织；
- 下一步是否进入 README / portfolio copy 修改。

本阶段不直接修改 README，不修改 src，不修改 Demo 页面，不新增功能代码。

## 1. 当前稳定点

当前最新稳定点：

- ddf74a8 docs: close compare demo checkpoint

当前已确认：

- HEAD = origin/main = origin/HEAD = ddf74a8
- git status clean
- npm.cmd run build passed
- Phase 4H：Compare browser regression / demo presentation checkpoint 已收口

## 2. 当前可展示主链路

当前 HouseFolio 已具备一条稳定 Demo 主链路：

Portfolio
→ 选择 2–4 套候选房源
→ /compare?ids=...
→ L2 横向对比表
→ 静态 L3 解释面板
→ AI confirmation UI
→ mock AI output
→ session-only output
→ Settings 本地数据权利

这条链路已经适合用于：

- GitHub README 项目说明；
- 简历项目链接说明；
- 面试现场 Demo；
- 作品集展示页文案；
- 项目复盘文章。

## 3. 对外展示的核心定位

HouseFolio 对外应继续定位为：

面向中国大陆租客的本地优先私人找房决策管理工具。

它解决的问题不是“哪里有房”，而是：

用户已经在多个渠道收集了一批候选房源后，如何把这些房源组织成可比较、可解释、可辅助决策的结构。

建议一句话定位：

HouseFolio 是一个本地优先的私人找房决策管理工具，帮助租客管理自己主动收集的候选房源，并通过通勤锚点、参考评分、横向对比和 AI 辅助解释，完成多房源比较与看房决策复盘。

## 4. README / Demo 应突出什么

### 4.1 产品判断

应突出：

- 不做房源平台；
- 不抓取第三方房源；
- 不撮合交易；
- 不认证真房源；
- 不替用户决定；
- 只辅助用户比较自己收集的候选房源。

### 4.2 三层引擎

应突出：

- L1 LBS：通勤锚点、空间关系、通勤分析；
- L2 Algorithm：参考评分、横向对比、缺失字段、风险信号；
- L3 AI：基于结构化结果做人话解释，不做评分排序。

### 4.3 本地优先

应突出：

- 候选房源、笔记、评分、状态、通勤锚点等本地保存；
- 本机照片通过 storage provider 管理；
- Settings 提供查看、导出、清除本地数据；
- AI output 当前 session-only，不持久化。

### 4.4 工程能力

应突出：

- Next.js + TypeScript；
- localStorage / IndexedDB 本地优先数据层；
- lib/* provider 封装；
- Compare model layer；
- AI provider boundary；
- mock provider 与 DeepSeek provider readiness；
- contract check / smoke test / browser regression；
- Windows + PowerShell 下稳定构建与提交流程。

## 5. README / Demo 不能夸大的点

当前不能声称：

- 已完成真实 DeepSeek success test；
- 已完成真实 AI browser regression；
- AI output 已支持历史记录；
- AI output 已支持导出 / 删除；
- Settings 已覆盖 AI 数据权利；
- 已接入 Supabase；
- 已做云端账号系统；
- 已做地图可视化；
- 已做真实 POI 生活圈计算；
- 已做照片进入 Compare；
- 已做视频能力；
- 已做真实房源认证；
- 已能判断房源真假；
- 已能系统推荐最佳房源。

## 6. README 建议结构

后续 README 可按以下结构重写或增强：

1. Project Overview
   - 一句话定位
   - Demo / GitHub links
   - 当前项目阶段

2. Why HouseFolio
   - 找房不是信息检索，而是决策管理
   - 租客痛点：信息分散、通勤反复计算、主观笔记难比较

3. Core Workflow
   - Portfolio
   - Detail
   - Settings
   - Compare
   - AI explanation

4. Three-layer Architecture
   - L1 LBS
   - L2 Algorithm
   - L3 AI

5. Privacy & Compliance Boundary
   - 不抓取
   - 不撮合
   - 不认证真房源
   - 本地优先
   - AI 脱敏与用户确认

6. Current Features
   - 候选房源管理
   - 笔记 / 评分 / 状态
   - 本机照片
   - 本地数据导出 / 导入 / 清除
   - Compare 横向对比
   - mock AI 辅助解释

7. Technical Highlights
   - Next.js + TypeScript
   - localStorage / IndexedDB
   - lib/* 封装
   - comparison model
   - AI provider abstraction
   - regression logs

8. Roadmap
   - 不应写过度宏大的运营路线
   - 优先写短期可交付方向

9. Disclaimer
   - 辅助比较，不代表最终推荐
   - 用户自行核实房源信息

## 7. 面试展示顺序

建议面试现场按以下顺序展示：

1. 用一句话说明项目定位；
2. 打开首页，解释不是房源平台；
3. 进入 Portfolio，说明房源来自用户自行收集；
4. 打开 Detail，展示笔记、评分、状态、本机照片；
5. 打开 Settings，展示本地数据权利；
6. 回到 Portfolio，选择 2–4 套房源；
7. 进入 Compare，展示横向表；
8. 解释 L2 参考评分和风险信号来自规则，不来自 LLM；
9. 展示静态解释面板；
10. 点击 AI 辅助解释，展示 confirmation UI；
11. 生成 mock AI output；
12. 刷新页面，说明 AI output session-only；
13. 总结 L1 / L2 / L3 架构边界与合规克制。

## 8. 下一步建议

Phase 4I 后续建议分为三步：

### Phase 4I-1：README current-state review

只检查当前 README 内容，不直接重写。

目标：

- 找出过时内容；
- 找出夸大内容；
- 找出缺失的 Compare / AI confirmation / 本地优先说明；
- 列出最小修改范围。

### Phase 4I-2：README minimal update

基于 4I-1 的评审结果，最小更新 README。

目标：

- 不写过度营销；
- 不声称未完成能力；
- 加入 Demo 主链路；
- 加入当前稳定能力；
- 加入边界说明。

### Phase 4I-3：Portfolio presentation copy checkpoint

整理简历 / 面试 / GitHub 三套展示话术。

目标：

- 一句话项目介绍；
- 200 字项目介绍；
- 面试 2 分钟介绍；
- 技术亮点版；
- 产品经理亮点版。

## 9. Phase 4I-0 验收标准

本阶段验收标准：

- 新增 docs/architecture/phase-4i-0-project-demo-readme-portfolio-presentation-review.md；
- npm.cmd run build 通过；
- git status clean；
- commit 完成；
- 不修改 README；
- 不修改 src；
- 不新增功能；
- 不触发真实 DeepSeek success test。