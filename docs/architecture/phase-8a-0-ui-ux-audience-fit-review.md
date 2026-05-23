# Phase 8A-0：UI/UX 受众匹配评审

## 0. 本阶段结论

Phase 8A-0 的结论是：

HouseFolio 当前不应直接进入合同助手实现，也不应立即使用 PixelClone 做视觉复刻。更稳妥的下一步是先完成 UI/UX 受众匹配评审，把产品从“工程展示型 Demo”调整为更像中国大陆年轻租客会理解、愿意使用的生活决策工具。

本阶段只写评审文档：

- 新增：docs/architecture/phase-8a-0-ui-ux-audience-fit-review.md
- 不改功能代码
- 不改页面代码
- 不改 src/content/zh-cn.ts
- 不实现合同助手
- 不接 OCR
- 不接法规依据
- 不使用 PixelClone
- 不让 Codex 大面积改 UI
- 不改 lib/lbs、lib/algorithm、lib/ai、lib/local-store、lib/storage
- 不新增 API route
- 不新增 localStorage key

Phase 8A-0 的核心任务不是“把页面变好看”，而是先回答：

HouseFolio 的目标用户是谁？
他们如何理解这个产品？
当前页面为什么像工程 Demo 或后台系统？
后续最小 UI/UX 改版应该围绕哪些页面、哪些路径、哪些文案和哪些验收标准展开？

---

## 1. v3.1 对 Phase 8A 的要求

v3.1 对 UI/UX 的判断已经非常明确：

HouseFolio 不能只证明“功能做出来了”，还必须证明它像一个真正面向中国大陆年轻租客的生活决策工具。

这意味着 UI/UX 不是最后的装饰，而是产品定位的一部分。

v3.1 要求前台表达从工程展示型 Demo 调整为：

- 租客可理解
- 低学习成本
- 可信赖
- 生活化
- 能支撑面试叙事
- 能自然串起候选房源、辅助比较、看房记录、准备签约、合同风险提示

v3.1 推荐的用户路径是：

1. 候选房源清单
2. 辅助比较
3. 看房记录
4. 准备签约
5. 合同风险提示

本阶段评审的直接依据就是这条路径。

---

## 2. 当前问题判断

### 2.1 当前版本的强项

当前 HouseFolio 已经具备较强的工程与产品架构证明力：

- Portfolio 能管理候选房源
- Detail 能查看房源详情和本地数据
- Compare 能选择 2–4 套房源做横向辅助比较
- L2 Reference Score 已经能作为辅助比较工具
- L3 AI 已经能做 session-only 辅助解释
- 本地优先、合规边界、数据导出/导入、清除能力已经有基础
- DeepSeek / Amap 等能力通过封装层和环境变量控制
- 项目具备较清楚的三层引擎叙事

这些能力适合作为产品经理求职作品。

### 2.2 当前版本的主要 UX 问题

当前问题不主要是“功能缺失”，而是“受众感知不匹配”。

具体表现：

1. 页面气质偏工程展示或 SaaS Dashboard
   - 用户看到的是功能模块和技术层级，而不是找房过程。
   - 面试官可能能理解架构，但普通租客不一定理解自己该怎么用。

2. 普通用户路径不够自然
   - 当前更像“我有几个页面可以点”，而不是“我正在一步步做租房决策”。
   - 首页、Portfolio、Compare、Detail、Settings 之间的生活场景串联还不够强。

3. 文案存在技术概念外露风险
   - L1、L2、L3、AI provider、mock、route、payload、session-only 等概念适合文档和面试解释，不适合普通用户界面高频出现。
   - 用户需要的是“通勤参考”“辅助比较”“AI 总结”“本地保存”“签约前检查”，而不是内部架构名词。

4. Compare 容易被误解为推荐系统
   - HouseFolio 的 Reference Score 只能是参考分和辅助比较，不代表最终推荐。
   - UI 必须持续避免“最佳房源”“系统推荐”“推荐分”“替你决定”等表达。

5. 合同助手如果入口处理不好，容易改变产品定位
   - 合同助手应该出现于“准备签约前检查”场景，而不是独立包装成法律工具。
   - 如果入口过重，会让 HouseFolio 看起来像 AI 法律服务平台。
   - 如果入口过弱，又无法体现 v3.1 新增价值。

---

## 3. 目标用户与受众匹配标准

### 3.1 目标用户

Phase 8A 的 UI/UX 目标用户不是后台管理员，也不是开发者，而是：

- 在北京等城市租房的 22–32 岁年轻租客
- 刚毕业或即将毕业的学生
- 互联网、金融、咨询、媒体等行业初级白领
- 住在学校外、需要考虑学校通勤的学生
- 小情侣、小家庭、合租者
- 已经在多个平台收集候选房源，但缺少整理和比较工具的人

### 3.2 用户心智

目标用户更熟悉的不是“仪表盘”，而是：

- 租房清单
- 看房备忘录
- 消费决策清单
- 候选项比较
- 签约前 checklist
- 本地保存的私人资料夹

因此，HouseFolio 的界面应更像：

- “我现在有几套候选房”
- “哪几套值得重点看”
- “每套房看房后记了什么”
- “通勤和价格是否能接受”
- “准备签这套前，合同里有没有需要追问的点”

而不是：

- “我在使用一个 LBS + AI Dashboard”
- “我在看系统模型输出”
- “我在操作一个数据平台”
- “我在调试 AI provider”

---

## 4. 产品路径重排判断

Phase 8A 后续最小改版应围绕一条主路径展开：

候选房源清单
→ 辅助比较
→ 看房记录
→ 准备签约
→ 合同风险提示

### 4.1 首页

首页应该在 30 秒内讲清楚：

- HouseFolio 是什么
- 用户为什么需要它
- 它不是房源平台
- 它如何帮助用户比较自己已经找到的候选房
- 它如何在准备签约前提示常见合同风险

首页不应优先展示内部技术层级。

建议首页叙事从：

“LBS + Algorithm + AI”

调整为用户路径：

“把你找到的房源放进候选清单，记录看房细节，对比通勤、价格和风险，准备签约前再检查合同常见问题。”

L1/L2/L3 可以保留在下方或面试说明区，但不应成为普通用户首屏的主要理解负担。

### 4.2 Portfolio

Portfolio 应更明确地像“候选房源清单”。

建议后续改版方向：

- 页面标题使用“候选房源清单”
- 卡片信息层级更贴近租客决策：
  - 租金
  - 区域 / 小区线索
  - 户型 / 面积
  - 通勤参考
  - 看房状态
  - 参考评分
  - 本地照片 / 笔记提示
- Compare 入口表达为“选择 2–4 套辅助比较”
- 避免让 Portfolio 像后台数据表或项目管理看板

### 4.3 Detail

Detail 应更像“单套房源档案 + 看房备忘录”。

建议后续改版方向：

- 突出这套房的决策信息
- 强化看房笔记、照片、本地保存说明
- 将“准备签约前检查合同”入口放在合适位置，但只作为后续能力入口规划
- 不在 Phase 8A-0 实现合同助手
- 不把合同助手做成法律审查系统

### 4.4 Compare

Compare 应明确是“辅助比较”，不是“系统推荐”。

建议后续改版方向：

- 标题使用“房源辅助比较”
- 保留“不代表最终推荐”的说明
- 表格降低压迫感，优先突出用户最关心字段：
  - 租金
  - 通勤
  - 面积 / 户型
  - 风险信号
  - 缺失信息
  - 看房状态
- AI 输出命名为“AI 总结”或“辅助解释”，不要叫“AI 推荐”
- 不输出“最佳房源”“最优选择”“系统推荐”“推荐分”

### 4.5 Settings

Settings 应继续承担数据权利说明，不应成为主功能入口。

必须保留：

- 查看本地数据
- 导出本地 JSON
- 清除本机数据
- 说明 mock data 与用户数据区别
- 说明当前本地优先、未默认云同步
- 后续如新增合同数据，必须纳入 local data 说明

Phase 8A 后续如调整 Settings 文案，应继续强调：

- 完整住址、通勤锚点、私人笔记、照片、合同文本默认本地保存
- AI / LBS 只在用户主动触发后处理必要字段
- 不默认上传完整找房画像

### 4.6 Demo

Demo 是面试展示工具，不应倒逼正式产品结构。

建议后续只做同步性检查：

- Demo 能讲清当前主链路
- Demo 不夸大合同助手能力
- Demo 不把真实 AI 输出包装成法律意见
- Demo 不使用真实用户数据
- Demo 不展示敏感地址、合同全文、联系方式或照片隐私

---

## 5. 合同助手入口评审

v3.1 新增合同风险提示助手，但 Phase 8A-0 不实现它。

本阶段只判断入口策略。

### 5.1 合同助手应放在哪里

最自然的位置是：

1. Detail 页：当某套房进入“准备签约”或“重点候选”状态时出现
2. 首页功能路径：作为完整租房决策链路最后一步展示
3. Portfolio 顶部轻入口：文案类似“准备签约？先检查合同常见风险”
4. AppNav：后置，不建议第一阶段就突出成独立法律工具
5. Settings：不适合作为主入口，只适合数据管理

### 5.2 合同助手入口文案原则

可用表达：

- 签约前检查
- 合同常见风险提示
- 生成追问清单
- 辅助识别需要确认的条款
- 不构成法律意见
- 建议粘贴合同正文，不建议上传敏感材料

避免表达：

- AI 律师
- 法律审查系统
- 判定违法
- 霸王条款检测
- 保证避坑
- 自动维权
- 律师级审查
- 比律师更便宜

### 5.3 第一版合同助手仍应后置

Phase 8A 的合理顺序是：

1. Phase 8A-0：UI/UX 受众匹配评审
2. Phase 8A-1：页面改版范围和视觉方向计划
3. Phase 8A-2：最小 UI/UX 改版
4. Phase 8A-3：UI/UX 回归与面试演示同步
5. Phase 9：文本版合同风险提示 MVP

不应在 Phase 8A-0 直接实现合同助手。

---

## 6. PixelClone 使用边界

PixelClone 或类似视觉复刻工具本阶段不使用。

原因：

- 现在还没有确定视觉方向
- 现在还没有确定参考稿
- 现在还没有明确文件范围
- 当前问题首先是产品路径和受众匹配，不是像素层美化
- 直接让工具“把 HouseFolio 改好看”会掩盖产品判断问题

后续允许使用 PixelClone 的条件：

- Phase 8A-0 已完成
- Phase 8A-1 已确定页面改版范围
- 已有明确参考风格或 mockup
- 文件范围限定在展示层
- 不改业务逻辑
- 不改 provider
- 不改 API route
- 不改 localStorage key
- 不删除合规提示
- 不改 AI / LBS / algorithm 边界

---

## 7. 后续 Phase 8A-1 建议范围

Phase 8A-1 应只写计划文档，不直接改 UI。

建议文件：

- docs/architecture/phase-8a-1-ui-ux-minimal-redesign-plan.md

Phase 8A-1 应回答：

1. 第一轮最小改版改哪些页面
2. 哪些页面暂时不动
3. 首页首屏怎么改
4. Portfolio 如何更像候选房源清单
5. Compare 如何降低推荐系统误解
6. 合同助手入口如何只做场景占位，不实现功能
7. 哪些中文文案进入 src/content/zh-cn.ts
8. 是否需要参考图或 mockup
9. PixelClone 是否还需要
10. 如何做 build、中文检查、边界扫描和回归

建议第一轮最小改版范围：

- src/content/zh-cn.ts
- src/app/page.tsx
- src/app/portfolio/page.tsx
- src/components/listing-card.tsx
- src/app/compare/page.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/components/compliance-footer.tsx

但这些文件只应在 Phase 8A-1 计划后、Phase 8A-2 才开始修改。

---

## 8. Phase 8A-0 验收标准

本阶段完成后，应满足：

- 只新增 docs/architecture/phase-8a-0-ui-ux-audience-fit-review.md
- 未修改 src
- 未修改 package.json
- 未修改 API route
- 未新增 localStorage key
- 未实现合同助手
- 未使用 PixelClone
- 未删除任何合规边界
- npm.cmd run build 通过
- git status clean after commit
- commit message 建议：docs: review ui ux audience fit

---

## 9. Phase 8A-0 后的建议命令

完成本文件写入后，建议执行：

1. npm.cmd run build
2. git status
3. git add docs\architecture\phase-8a-0-ui-ux-audience-fit-review.md
4. git commit -m "docs: review ui ux audience fit"
5. git status

如果 build 失败，先修复 build blocker，不进入 Phase 8A-1。

如果 git status 出现非本文件改动，先确认是否为已有脏改动，不要混入本阶段提交。

---

## 10. 最终判断

Phase 8A-0 的核心判断是：

HouseFolio 下一步确实应该处理 UI/UX 受众匹配问题，但不能把它理解成视觉美化任务。它本质上是一次产品表达和信息架构校准。

合同助手增强了 HouseFolio 的签约前价值，但必须等 UI/UX 路径稳定后再做；PixelClone 可以作为后续视觉执行工具，但不能替代产品判断。

当前最稳路线是：

Phase 8A-0：受众匹配评审
→ Phase 8A-1：最小改版计划
→ Phase 8A-2：有限展示层改版
→ Phase 8A-3：回归与面试演示同步
→ Phase 9：文本版合同风险提示 MVP