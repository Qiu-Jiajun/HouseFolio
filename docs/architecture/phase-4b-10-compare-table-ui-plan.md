# Phase 4B-10：Compare table UI plan

## 0. 阶段定位

Phase 4B-10 是 Compare table UI 的实现前计划阶段。

本阶段只写计划文档，不改 UI 代码，不实现横向表。

本阶段新增文件：

- docs/architecture/phase-4b-10-compare-table-ui-plan.md

本阶段不修改：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/content/zh-cn.ts
- src/lib/algorithm/comparison.ts
- src/types/comparison.ts
- src/lib/local-store/*
- src/lib/storage/*
- src/lib/lbs/*
- src/lib/ai/*
- src/lib/privacy/local-data.ts

## 1. 前置状态

当前已经完成：

- Phase 4A：L2 comparison model layer
- Phase 4B-0：Compare UI route review
- Phase 4B-1：Compare route minimal scaffold plan
- Phase 4B-2：Compare route scaffold implementation
- Phase 4B-3：Compare route scaffold regression
- Phase 4B-4：Portfolio selection UI plan
- Phase 4B-5：Portfolio selection minimal implementation
- Phase 4B-6：Portfolio selection regression
- Phase 4B-7：Compare selected listing data plan
- Phase 4B-8：Compare selected listings minimal implementation
- Phase 4B-9：Compare selected listings regression

当前 Compare 已具备：

- Portfolio 选择 2–4 套房源；
- 跳转 `/compare?ids=...`；
- `/compare` 解析 URL ids；
- Client Component 读取本机 listings；
- 调用 `buildComparisonInputs()`；
- 展示 ComparisonModel 结构化 summary preview；
- 不新增 selection localStorage；
- 不接 AI / 高德 / Supabase；
- 不读取照片 Blob。

当前尚未完成：

- 真正的横向对比表；
- 字段行分组；
- 2 / 3 / 4 套房源的列布局；
- 移动端横向滚动；
- riskFlags / missingFields 的表格化展示；
- 空值展示规范；
- Compare table 回归。

## 2. 为什么需要 table UI plan

当前 preview 已证明数据链路可用：

```text
Portfolio selection
→ /compare?ids=...
→ local listings
→ buildComparisonInputs()
→ ComparisonModel preview

下一步的关键问题不再是数据是否能读到，而是：

如何把 2–4 套房源组织成真正可比较的横向视图。

横向表是 HouseFolio L2 comparison 的核心表达界面，但它容易引入 UI 复杂度：

移动端宽度不足；
字段太多会拥挤；
空值太多会降低可读性；
风险信号可能过度吓人；
表格容易被误解为“系统推荐”；
如果加入照片，会扩大隐私和性能边界。

因此应先写 UI plan，再实现。

3. Table UI 的产品定位

Compare table 是 L2 结构化比较界面。

它的作用是：

把 2–4 套候选房源放在同一视野下；
按维度拆解差异；
帮用户识别 trade-off；
提示缺失字段和风险信号；
辅助用户返回 Portfolio 补充数据或继续看详情。

它不是：

推荐系统；
最佳房源判断；
AI 决策建议；
真房源认证；
价格真实性判断；
中介风控系统；
房源平台排序系统。

必须继续使用：

横向比较；
辅助比较；
参考评分；
维度拆解；
不代表最终推荐。

避免使用：

最佳房源；
最优选择；
系统推荐；
推荐分；
替你决定。
4. 第一版 table 的推荐结构

第一版建议采用：

左侧字段名列
右侧 2–4 套房源列

字段按组展示：

基础信息；
L1 通勤 / 生活圈；
L2 参考评分；
用户补充资料摘要；
缺失字段与风险信号。

桌面端：

左侧字段名列固定宽度；
每套房源一列；
2–4 列根据屏幕宽度分配；
表格外层允许横向滚动；
不做复杂 sticky column，除非后续必要。

移动端：

外层横向滚动；
保持字段名列可读；
不把每套房源拆成纵向卡片，否则失去横向比较意义；
若移动端体验较差，后续可独立做 mobile comparison cards。
5. 字段分组建议
5.1 顶部房源列头

每套房源列头展示：

title；
status；
district；
返回详情入口；
不展示照片本体；
不展示完整地址；
不展示来源 URL 全文。

可选展示：

sourcePlatform；
“查看详情”链接。

不展示：

完整地址门牌号；
经纬度；
照片 Blob / object URL；
房东 / 中介信息；
第三方平台原始描述。
5.2 基础信息组

字段：

月租；
面积；
户型；
区域；
位置线索状态；
当前状态；
来源平台。

展示规则：

缺失字段显示“待补充”；
不显示完整地址；
areaLabel 只显示 ComparisonModel 中的低敏摘要。
5.3 L1 空间信息组

字段：

通勤时间；
通勤来源；
生活圈参考值；
通勤摘要数量。

展示规则：

commuteSource 显示“默认参考值 / 本地通勤结果”；
commuteSummaries 只显示数量或简短摘要；
不显示完整高德路线；
不显示 polyline / steps；
不显示经纬度；
不触发新的高德调用。
5.4 L2 参考比较组

字段：

参考评分；
scoreBreakdown 简要状态；
strengths；
weaknesses；
neutralFacts。

第一版可以不展开 scoreBreakdown 具体数值，只保留：

是否有评分拆解；
主要字段占位。

原因：

当前 ComparisonScoreBreakdown 是宽松 Record；
直接展开可能导致 UI 混乱；
评分拆解可后续单独做一阶段。
5.5 用户资料摘要组

字段：

是否有笔记；
是否有照片；
照片数量；
主观评分摘要。

允许：

展示 hasNotes；
展示 hasPhotos；
展示 photoCount；
展示 subjectiveSummary 中的 light / quiet / decoration。

禁止：

展示完整笔记原文；
展示照片；
读取 IndexedDB；
生成 object URL；
展示视频；
展示联系方式；
展示合同条款原文。
5.6 缺失字段与风险信号组

字段：

missingFields；
riskFlags。

展示方式：

以 tag / badge 展示；
不使用恐吓式文案；
不宣称真假判断；
不宣称避坑保真；
不做自动结论。

建议文案：

“待补充字段”；
“需要人工确认的信号”；
“仅作辅助提醒”。
6. 第一版是否保留 summary preview

建议保留当前 summary preview 的部分能力，但逐步让 table 成为主视图。

可采用：

上方：状态摘要；
中间：横向对比表；
下方：辅助说明；
不再重复展示一大组 summary cards，避免页面过长。

但为了减少一次改动，可以第一版 table 实现后暂时保留部分 summary cards，后续再清理。

7. 组件拆分建议

后续实现建议新增组件：

src/components/compare-table.tsx

职责：

接收 models: ComparisonInput[]；
只负责渲染表格；
不读取 localStorage；
不调用 getAllClientListings；
不调用 buildComparisonInputs；
不接 AI / 高德 / Supabase；
不读取照片。

compare-selected-listings-panel.tsx 继续负责：

读取本地 listings；
根据 ids 过滤；
调用 builder；
处理空状态；
将 models 传入 CompareTable。

推荐数据流：

CompareSelectedListingsPanel
→ buildComparisonInputs()
→ <CompareTable models={comparisonModels} />

不建议让 CompareTable 自己读取数据。

8. 文件范围建议

后续实现阶段可涉及：

src/components/compare-table.tsx
src/components/compare-selected-listings-panel.tsx
src/content/zh-cn.ts

尽量不改：

src/app/compare/page.tsx

不应涉及：

src/components/portfolio-list.tsx
src/components/listing-card.tsx
src/lib/algorithm/comparison.ts
src/types/comparison.ts
src/lib/local-store/*
src/lib/storage/*
src/lib/lbs/*
src/lib/ai/*
src/lib/privacy/local-data.ts
9. 是否新增 localStorage key

不新增。

Compare table 只是渲染已有 ComparisonModel，不保存：

selection；
compare history；
table preferences；
column visibility；
user decision；
comparison report。

禁止新增：

housefolio:compare-selection
housefolio:compare-history
housefolio:compare-table-preferences
housefolio:last-compare

因此无需修改 Settings 数据权利。

10. 是否读取照片

不读取照片文件本体。

允许展示：

hasPhotos；
photoCount。

禁止：

getListingCoverPhoto；
getPhotoBlob；
getThumbnailBlob；
IndexedDB；
Blob；
object URL；
base64；
视频文件；
Portfolio 首图进入 Compare。

原因：

Compare table 是 L2 结构化比较；
照片展示是媒体资料能力；
若未来要展示封面，必须另设阶段评审。
11. 是否接入 AI

不接入。

Phase 4B table 仍是 L2 UI。

禁止：

DeepSeek；
prompt；
AI 总结；
AI 排序；
AI 推荐；
AI 判断最佳房源；
AI 读取笔记原文；
AI 读取照片或视频。

未来 L3 可在 Phase 4C 之后基于脱敏 ComparisonModel 做解释。

12. 是否接入 LBS / 高德

不接入。

Compare table 只消费已有字段：

commuteMinutes；
commuteSource；
commuteSummaries；
lifeCircleScore。

禁止：

Compare 页面重新计算通勤；
Compare 页面调用高德；
Compare 页面 geocode；
Compare 页面读取 coordinate；
Compare 页面读取 raw route JSON。
13. 是否接入 Supabase / 云端

不接入。

Compare table 只读取当前浏览器本机数据生成的模型。

禁止：

Supabase；
fetch；
server action；
API route；
云端保存 comparison；
云端保存 selection。
14. 空值展示规则

统一空值展示：

数字缺失：待补充
文本缺失：待补充
tag 列表为空：暂无
风险信号为空：暂无明显信号
缺失字段为空：字段较完整

不要用：

N/A
null
undefined
0 代替未知值
15. 表格字段优先级

第一版 P0 字段：

title；
rentMonthly；
areaSqm；
layout；
district；
status；
commuteMinutes；
commuteSource；
lifeCircleScore；
referenceScore；
subjectiveSummary；
missingFields；
riskFlags。

P1 字段：

sourcePlatform；
sourceUrl exists；
commuteSummaries count；
hasNotes；
hasPhotos；
photoCount；
strengths / weaknesses / neutralFacts。

暂不展开：

scoreBreakdown 明细；
sourceUrl 全文；
commuteSummaries 全文；
AI 解释；
照片。
16. 验证标准

Phase 4B-10 完成标准：

docs/architecture/phase-4b-10-compare-table-ui-plan.md 已创建；
npm.cmd run build 通过；
git status 只显示该文档变更，或提交后 clean；
未修改 UI 代码；
未新增 CompareTable；
未修改 compare-selected-listings-panel；
未新增 localStorage key；
未修改 Settings；
未接 AI / 高德 / Supabase；
未读取照片 Blob；
未实现横向表。
17. 后续阶段建议

建议后续拆分为：

Phase 4B-11：Compare table minimal implementation

目标：

新增 CompareTable；
渲染 2–4 套 ComparisonModel 的横向表；
不读取数据；
不接 AI / 高德 / Supabase；
不读取照片；
不新增 localStorage key。
Phase 4B-12：Compare table regression

目标：

验证 2 / 3 / 4 套；
验证缺失字段；
验证风险信号；
验证移动端横向滚动；
验证 build；
验证无敏感字段；
验证无 AI / 高德 / Supabase。
Phase 4B-13：Phase 4B closing checkpoint

目标：

总结 route scaffold；
总结 Portfolio selection；
总结 selected listings preview；
总结 compare table；
确认 Phase 4B 是否收口或进入 Phase 4C L3。
18. Commit 建议

建议 commit：

docs: plan compare table ui

本阶段完成后，再进入 Phase 4B-11 最小实现。