# Phase 4H-0：Compare browser regression / demo presentation checkpoint plan

## 0. 阶段定位

Phase 4H-0 是一次浏览器回归与 Demo 展示检查计划，不是功能开发阶段。

本阶段只做：

- 规划 Compare 主链路浏览器回归；
- 规划 Demo 展示顺序；
- 规划 Console / localStorage / Settings / 禁止措辞检查；
- 明确不做真实 DeepSeek success test；
- 明确不改 src 功能代码。

本阶段不做：

- 不配置 DeepSeek API key；
- 不做真实 DeepSeek success test；
- 不做真实 DeepSeek browser regression；
- 不新增 AI output persistence；
- 不新增 AI history；
- 不新增 Settings AI 数据权利区；
- 不新增 selection localStorage；
- 不新增 Compare history；
- 不让照片 / 视频进入 Compare；
- 不接 Supabase；
- 不改地图能力；
- 不改 ComparisonModel；
- 不改 Compare UI 结构。

当前稳定点：

- 216ca3a docs: close compare product polish
- HEAD = origin/main = origin/HEAD = 216ca3a
- git status clean
- npm.cmd run build passed

## 1. 当前主链路

当前 Compare 主链路是：

用户进入 Portfolio
→ 选择 2–4 套房源
→ 跳转 /compare?ids=...
→ 读取本机 listings
→ buildComparisonInputs()
→ ComparisonInput[] / ComparisonModel[]
→ CompareTable 横向表
→ CompareExplanationPanel 静态辅助解释
→ AI confirmation UI
→ /api/ai/compare-explanation
→ 默认 mock provider
→ session-only AI output

## 2. 回归目标

Phase 4H 的浏览器回归目标是确认：

1. Portfolio 到 Compare 的主链路可稳定演示；
2. Compare 空状态、异常 ids、有效 ids 均不崩溃；
3. CompareTable、静态解释面板、AI 确认步骤、mock AI 输出正常；
4. AI 输出只保存在当前 session，不进入 localStorage，不进入 Settings；
5. 页面没有红色 runtime console error；
6. Compare 和 AI 文案不越界，不把 HouseFolio 写成推荐系统或真房源认证系统；
7. 当前状态足以支撑面试 / 作品集 Demo 展示。

## 3. 浏览器回归检查清单

### 3.1 基础页面

| 编号 | 页面 | 检查点 | 通过标准 |
|---|---|---|---|
| A1 | / | 首页打开 | 无白屏，无红色 console error |
| A2 | /demo | Demo 页打开 | 可作为作品集入口说明 |
| A3 | /portfolio | Portfolio 打开 | 房源卡片正常展示 |
| A4 | /portfolio/new | 添加房源页打开 | 页面可访问，不影响现有数据 |
| A5 | /settings | Settings 打开 | 本地数据权利区域正常 |
| A6 | /compare | Compare 空状态 | 未带 ids 时显示合理提示，不崩溃 |

### 3.2 Portfolio selection

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| B1 | 房源卡片基础信息 | 标题、租金、面积、通勤、参考评分正常 |
| B2 | 勾选控件 | 可选择房源 |
| B3 | 选择 1 套 | 不应进入有效比较，应提示需要 2–4 套 |
| B4 | 选择 2 套 | 可进入 Compare |
| B5 | 选择 3–4 套 | 可进入 Compare |
| B6 | 超过 4 套 | UI 应阻止或提示上限 |
| B7 | 比较按钮 | 跳转到 /compare?ids=... |
| B8 | 返回 Portfolio | 返回入口可用，选择状态不需要持久化 |

### 3.3 Compare route

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| C1 | ids 解析 | 只展示被选中的有效房源 |
| C2 | 无效 id | 页面不崩溃，忽略或显示合理提示 |
| C3 | 重复 id | 不导致重复异常或 React key warning |
| C4 | 低于 2 个有效 id | 显示合理空状态 |
| C5 | 超过 4 个 id | 页面仍稳定，不扩大产品承诺 |
| C6 | 查看详情入口 | 可进入对应 /portfolio/[id] |
| C7 | 返回入口 | 可返回 Portfolio |

### 3.4 Compare content

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| D1 | Comparison preview | 结构化卡片正常 |
| D2 | CompareTable | 横向表正常展示 |
| D3 | 基础信息组 | 租金、面积、户型、区域等字段正常 |
| D4 | 通勤与评分组 | 显示参考评分与通勤信息 |
| D5 | 主观与资料组 | 显示 notes/photos 等摘要级信息，不展示原文 |
| D6 | 缺失字段 tag | 正常展示，不夸大 |
| D7 | 风险信号 tag | 正常展示，不做真假判断 |
| D8 | 辅助比较说明 | 明确只作辅助比较，不代表最终推荐 |

### 3.5 Static L3 explanation panel

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| E1 | 面板出现 | 位于 Compare 主内容之后 |
| E2 | 内容定位 | 解释取舍，不替用户决定 |
| E3 | checklist | 引导用户补充资料或回到详情页 |
| E4 | 风险解释 | 只做人话化解释，不判断房源真假 |
| E5 | 免责声明 | 延续参考评分 / 辅助比较定位 |

### 3.6 AI confirmation and mock output

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| F1 | AI 触发按钮 | 文案强调辅助解释 |
| F2 | 点击触发 | 先出现确认步骤，不直接发送 |
| F3 | 确认文案 | 提示第三方 AI、脱敏、不要输入敏感信息 |
| F4 | 取消确认 | 不调用 route，不产生输出 |
| F5 | 确认后调用 | 默认走 mock provider，不需要 DeepSeek key |
| F6 | loading 状态 | 正常显示 |
| F7 | mock AI 输出 | 正常渲染 |
| F8 | 输出定位 | 不出现“最佳房源 / 系统推荐 / 推荐分 / 替你决定” |
| F9 | 刷新页面 | AI 输出消失 |
| F10 | 返回后重进 Compare | AI 输出不被持久化恢复 |

### 3.7 本地数据边界

| 编号 | 检查点 | 通过标准 |
|---|---|---|
| G1 | localStorage | 不新增 AI output key |
| G2 | localStorage | 不新增 compare history key |
| G3 | localStorage | 不新增 selection persistence key |
| G4 | Settings | 不出现 AI 数据权利区 |
| G5 | Settings export JSON | 不包含 AI 输出 |
| G6 | IndexedDB photos | 不进入 Compare |
| G7 | Console | 无红色 runtime error |

## 4. 禁止措辞扫描

Phase 4H-1 手动回归前后都应扫描 Compare / AI 相关文件是否出现越界表达。

禁止措辞包括：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真

扫描范围建议：

- src/content/zh-cn.ts
- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/components/compare-ai-explanation-panel.tsx
- src/lib/ai/mock-compare-explanation-provider.ts
- src/lib/ai/compare-explanation-prompt.ts

通过标准：

- 不把 Compare 写成推荐系统；
- 不把 AI 写成最终决策者；
- 不承诺房源真实性；
- 不宣传“避坑保真”；
- 不把 Reference Score 写成推荐分。

## 5. Demo 展示顺序

推荐面试 / 作品集展示顺序：

1. 打开首页，说明 HouseFolio 是私人找房决策管理工具，不是房源平台；
2. 进入 Portfolio，展示用户自行收集的候选房源；
3. 选择 2–4 套房源，说明这是临时比较动作，不做 selection 持久化；
4. 进入 Compare，展示横向对比表；
5. 解释 L2：参考评分、缺失字段、风险信号来自规则与结构化数据，不来自 LLM；
6. 展示静态解释面板，说明 L3 只做人话解释；
7. 点击 AI 辅助解释，展示确认步骤；
8. 确认后生成 mock AI 输出；
9. 刷新页面，说明 AI 输出 session-only，不进入 Settings；
10. 进入 Settings，展示本地数据导出 / 清除能力；
11. 最后回到项目定位：不抓取、不撮合、不认证真房源，核心是辅助用户比较自己收集的候选房源。

## 6. Phase 4H-1 手动回归建议记录格式

Phase 4H-1 完成浏览器检查后，应新增 dev-log，建议记录：

- 测试环境：Windows + Chrome / Edge，localhost 端口；
- 启动命令：npm.cmd run dev；
- 测试数据：mock listings / 当前本机数据；
- 检查页面：/, /demo, /portfolio, /compare, /settings；
- Compare selection：2 套、3 套、4 套、异常 ids；
- AI confirmation：取消、确认、loading、mock output、刷新后消失；
- localStorage / Settings：无 AI output persistence；
- Console：无红色 runtime error；
- 禁止措辞扫描结果；
- 未做事项：真实 DeepSeek success test、真实 AI browser regression、AI output persistence、AI history。

## 7. Phase 4H-0 验收标准

Phase 4H-0 只要求完成计划文档与基础验证。

验收标准：

- 新增 docs/architecture/phase-4h-0-compare-browser-regression-demo-checkpoint-plan.md；
- npm.cmd run build 通过；
- git status clean；
- commit 完成；
- 不修改 src 功能代码；
- 不触发真实 DeepSeek success test；
- 不新增 localStorage key；
- 不改 Settings；
- 不改 Compare UI；
- 下一步进入 Phase 4H-1 浏览器手动回归。