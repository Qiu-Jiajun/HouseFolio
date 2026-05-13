# Phase 4B-13：Phase 4B closing checkpoint

## 0. 阶段定位

Phase 4B-13 是 Phase 4B Compare UI 主链路的收口检查点。

本阶段只写收口文档，不新增功能代码。

## 1. 当前完成结论

Phase 4B 已经完成从 L2 comparison model layer 到 Compare UI 主链路的最小闭环。

当前已具备：

- /compare route；
- Portfolio 临时选择 2–4 套房源；
- URL query 传递 selected listing ids；
- /compare 根据 ids 读取本机 listings；
- Client Component 调用 buildComparisonInputs；
- 结构化 ComparisonModel preview；
- CompareTable 横向对比表；
- 缺失字段与风险信号展示；
- 查看详情入口；
- 辅助比较、不代表最终推荐的定位说明。

当前仍然不做：

- 不新增 selection localStorage；
- 不保存 compare history；
- 不接 AI；
- 不接高德；
- 不接 Supabase；
- 不读取照片 Blob；
- 不读取完整笔记原文；
- 不做真房源判断；
- 不把 Compare 写成推荐系统。

## 2. Phase 4B 关键提交

本阶段关键提交包括：

- 2cdf497 docs: review compare ui route
- 13727ef docs: plan compare route scaffold
- e0193ae feat: add compare route scaffold
- 771d932 docs: log compare route scaffold regression
- dc086d3 docs: plan portfolio compare selection
- 9a06406 feat: add portfolio compare selection
- e502005 docs: log portfolio compare selection regression
- a650096 docs: plan compare selected listings data
- dd69c0b feat: show selected listing comparison preview
- 2a80d4e docs: log compare selected listings regression
- 83fd47f docs: plan compare table ui
- 15a6938 feat: add compare table
- b9c112a docs: log compare table regression
- a448c14 fix: add compare table group keys

其中 a448c14 修复了 CompareTable 中 tableGroups.map 返回 Fragment 未设置 key 的 React runtime warning。

## 3. Phase 4B-0：Compare UI route review

文件：

- docs/architecture/phase-4b-0-compare-ui-route-review.md

阶段结论：

- 可以进入 Compare UI 主线；
- 但必须先评审，不直接新增 /compare；
- Compare 不应作为 AppNav 一级入口；
- 主入口应来自 Portfolio selection；
- selection 第一版不应持久化；
- /compare 不应接 AI / 高德 / Supabase；
- 不应读取照片 Blob；
- 不应读取完整笔记原文。

## 4. Phase 4B-1：Compare route minimal scaffold plan

文件：

- docs/architecture/phase-4b-1-compare-route-minimal-scaffold-plan.md

阶段结论：

- /compare 第一版只做 route scaffold；
- 只解析 URL ids；
- 只判断 0 / 1 / 2–4 / 超过 4 套；
- 不读取真实 listings；
- 不展示真实 ComparisonModel；
- 不新增 localStorage key；
- 不接 AI / 高德 / Supabase。

## 5. Phase 4B-2 / 4B-3：Compare route scaffold

代码文件：

- src/app/compare/page.tsx
- src/content/zh-cn.ts

日志文件：

- docs/dev-log/2026-05-13-phase-4b-3-compare-route-scaffold-regression.md

完成内容：

- 新增 /compare route；
- 支持 URL ids 解析；
- 支持无选择、少于 2 套、超过 4 套、2–4 套 ready 状态；
- 页面接入 AppNav；
- 页面接入 ComplianceFooter；
- 提供返回 Portfolio 入口。

边界：

- 不读取本地 listings；
- 不调用 buildComparisonInputs；
- 不接 AI；
- 不接高德；
- 不接 Supabase；
- 不新增 localStorage key。

## 6. Phase 4B-4 / 4B-5 / 4B-6：Portfolio selection

计划文件：

- docs/architecture/phase-4b-4-portfolio-selection-ui-plan.md

代码文件：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/content/zh-cn.ts

日志文件：

- docs/dev-log/2026-05-13-phase-4b-6-portfolio-selection-regression.md

完成内容：

- Portfolio 页面支持临时选择房源；
- 每张 ListingCard 支持“选择比较 / 已选择”；
- 支持选择 2–4 套；
- 选择 1 套时比较按钮禁用；
- 达到 4 套后阻止继续选择第 5 套；
- 支持清空选择；
- 点击后跳转 /compare?ids=...。

边界：

- selection 只存在于 React runtime state；
- 不写入 localStorage；
- 不新增 Settings 数据权利项；
- 不读取照片 Blob；
- 不接 AI / 高德 / Supabase；
- 不改变 ListingCard 核心信息结构；
- 不改变 Portfolio 数据模型。

## 7. Phase 4B-7 / 4B-8 / 4B-9：Selected listings preview

计划文件：

- docs/architecture/phase-4b-7-compare-selected-listing-data-plan.md

代码文件：

- src/components/compare-selected-listings-panel.tsx
- src/app/compare/page.tsx
- src/content/zh-cn.ts

日志文件：

- docs/dev-log/2026-05-13-phase-4b-9-compare-selected-listings-regression.md

完成内容：

- /compare 将 selectedIds 传给 client component；
- CompareSelectedListingsPanel 在客户端读取本机 listings；
- 根据 URL ids 过滤本地 listings；
- 记录 missing ids；
- 调用 buildComparisonInputs；
- 渲染 ComparisonModel 结构化 preview；
- 处理 no ids、too many ids、not enough found 等状态；
- 展示月租、通勤、参考评分、面积、户型、生活圈、缺失字段、风险信号。

边界：

- 本机 listings 读取只发生在 Client Component；
- page.tsx 仍是 route shell；
- 不新增 API route；
- 不上传用户本机数据；
- 不读取照片 Blob；
- 不读取完整笔记原文；
- 不接 AI / 高德 / Supabase；
- 不保存 compare history。

## 8. Phase 4B-10 / 4B-11 / 4B-12：Compare table

计划文件：

- docs/architecture/phase-4b-10-compare-table-ui-plan.md

代码文件：

- src/components/compare-table.tsx
- src/components/compare-selected-listings-panel.tsx
- src/content/zh-cn.ts

日志文件：

- docs/dev-log/2026-05-13-phase-4b-12-compare-table-regression.md

完成内容：

- 新增 CompareTable；
- CompareTable 只接收 models: ComparisonInput[]；
- CompareSelectedListingsPanel 继续负责读取 listings 与调用 builder；
- CompareTable 只负责渲染；
- 横向表支持 2–4 套房源；
- 表格具有横向滚动；
- 表格包含以下分组：
  - 基础信息；
  - L1 空间信息；
  - L2 参考比较；
  - 用户补充资料；
  - 缺失字段与风险信号；
- 每套房源列头展示标题、状态、查看详情入口；
- 缺失字段与风险信号以 tag 展示。

边界：

- CompareTable 不导入 local-store；
- CompareTable 不调用 getAllClientListings；
- CompareTable 不调用 buildComparisonInputs；
- CompareTable 不导入 storage / lbs / ai；
- CompareTable 不读取照片 Blob；
- CompareTable 不读取完整笔记原文；
- CompareTable 不写 localStorage；
- CompareTable 不接 AI / 高德 / Supabase。

## 9. React key warning 修复

问题：

- 打开 Compare 页面时出现 React runtime warning：
  Each child in a list should have a unique key prop.
- 位置：
  src/components/compare-table.tsx
- 原因：
  tableGroups.map 返回短 Fragment，但 Fragment 没有 key。

修复：

- 引入 Fragment；
- 将短 Fragment 改成 Fragment key={group.title}；
- 提交：
  a448c14 fix: add compare table group keys。

当前结论：

- 该 warning 已修复；
- 修复未改变产品能力；
- 修复未改变数据边界。

## 10. 当前 Compare 主链路

当前用户路径：

1. 用户进入 Portfolio；
2. 在房源卡片中选择 2–4 套候选房源；
3. 点击“比较已选房源”；
4. 页面跳转到 /compare?ids=...；
5. /compare 解析 selectedIds；
6. Client Component 读取本机 listings；
7. 根据 selectedIds 过滤有效 listings；
8. 调用 buildComparisonInputs；
9. 生成 ComparisonModel[]；
10. 展示结构化 preview；
11. 展示横向对比表；
12. 用户可返回 Portfolio 或进入详情页继续查看。

## 11. 当前保留边界

### 11.1 数据边界

当前没有新增：

- housefolio:compare-selection
- housefolio:compare-history
- housefolio:compare-table-preferences
- housefolio:last-compare
- housefolio:comparison-state

因此没有修改：

- src/lib/privacy/local-data.ts
- Settings 本地数据导出
- Settings 本地数据导入
- Settings 清除本地数据

### 11.2 L1 边界

Compare 只消费已有字段：

- commuteMinutes；
- commuteSource；
- commuteSummaries；
- lifeCircleScore。

Compare 不做：

- 不重新计算通勤；
- 不调用高德；
- 不 geocode；
- 不读取 coordinate；
- 不读取 raw route JSON；
- 不读取 polyline / steps。

### 11.3 L2 边界

Compare 当前属于 L2 comparison UI。

L2 做：

- 结构化比较；
- 字段拆解；
- 缺失字段提示；
- 风险信号提示；
- 参考评分展示。

L2 不做：

- LLM 评分；
- LLM 排序；
- LLM 筛选；
- LLM 推荐；
- 最佳房源判断。

### 11.4 L3 边界

当前没有 L3。

没有：

- DeepSeek；
- prompt；
- AI response；
- AI 对比总结；
- AI checklist；
- AI trade-off explanation；
- AI 推荐；
- AI 判断最佳房源。

### 11.5 照片 / 媒体边界

当前 Compare 只可能展示低敏摘要字段：

- hasPhotos；
- photoCount。

当前 Compare 不做：

- 不读取照片 Blob；
- 不生成 object URL；
- 不读取 IndexedDB；
- 不展示封面；
- 不播放视频；
- 不读取视频；
- 不进入 AI 图片或视频分析。

## 12. 当前产品措辞边界

当前继续允许：

- 横向比较；
- 结构化预览；
- 参考评分；
- 辅助比较；
- 维度拆解；
- 风险信号；
- 不代表最终推荐。

当前继续禁止：

- 最佳房源；
- 最优选择；
- 系统推荐；
- 推荐分；
- 替你决定；
- 真房源；
- 避坑保真。

## 13. 当前关键文件清单

Compare route：

- src/app/compare/page.tsx

Portfolio selection：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx

Compare data preview：

- src/components/compare-selected-listings-panel.tsx

Compare table：

- src/components/compare-table.tsx

Comparison model layer：

- src/types/comparison.ts
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts

Chinese copy：

- src/content/zh-cn.ts

Architecture docs：

- docs/architecture/phase-4b-0-compare-ui-route-review.md
- docs/architecture/phase-4b-1-compare-route-minimal-scaffold-plan.md
- docs/architecture/phase-4b-4-portfolio-selection-ui-plan.md
- docs/architecture/phase-4b-7-compare-selected-listing-data-plan.md
- docs/architecture/phase-4b-10-compare-table-ui-plan.md

Regression logs:

- docs/dev-log/2026-05-13-phase-4b-3-compare-route-scaffold-regression.md
- docs/dev-log/2026-05-13-phase-4b-6-portfolio-selection-regression.md
- docs/dev-log/2026-05-13-phase-4b-9-compare-selected-listings-regression.md
- docs/dev-log/2026-05-13-phase-4b-12-compare-table-regression.md

## 14. 当前验证状态

本阶段已确认：

- npm.cmd run build 通过；
- /compare route 存在；
- Portfolio selection 可跳转 /compare?ids=...；
- selected listings preview 可读取本机 listings；
- buildComparisonInputs 可生成 ComparisonModel；
- CompareTable 可横向展示 2–4 套；
- React key warning 已修复；
- git status clean；
- 最新 commit 已 push 到 origin/main。

## 15. 后续建议

下一步建议进入：

- Phase 4C-0：L3 compare explanation boundary review

但不要直接接 DeepSeek 或任何 AI API。

原因：

- Phase 4B 已经形成 L2 Compare UI 主链路；
- 下一步如果继续提升作品集叙事，最自然的是评审 L3 如何基于 ComparisonModel 做人话解释；
- 但 L3 必须先做边界评审；
- 不应直接实现 AI；
- 不应把 L3 做成推荐系统；
- 不应让 AI 读取完整笔记原文或照片。

Phase 4C-0 只应写评审文档，回答：

- L3 能消费 ComparisonModel 的哪些字段；
- 哪些字段必须脱敏或禁止；
- AI 输出应如何避免“最佳房源”；
- 是否先做静态 mock explanation；
- 是否需要用户点击确认；
- 是否需要 AI 使用提示；
- 是否需要记录 AI 输出；
- 是否需要 Settings 数据权利扩展。

## 16. Phase 4B 结论

Phase 4B 结论：

- Compare UI route 已完成；
- Portfolio selection 已完成；
- selected listings preview 已完成；
- Compare table 已完成；
- React runtime warning 已修复；
- build 通过；
- 当前没有新增 localStorage key；
- 当前没有接 AI / 高德 / Supabase；
- 当前没有读取照片 Blob；
- 当前没有读取完整笔记原文；
- 当前没有把 Compare 写成推荐系统；
- Phase 4B 可以视为稳定收口。