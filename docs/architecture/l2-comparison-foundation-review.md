# HouseFolio Phase 2F-0B｜L2 Comparison Foundation Review

## 1. 本阶段目标

本阶段只做 L2 comparison foundation review，不进入正式对比视图数据模型，不新增对比页面，不实现勾选房源、不实现横向对比表，也不进入 Phase 4A。

目标是确认当前 Phase 2E 后，HouseFolio 已经具备哪些 L2 对比基础，以及下一阶段应如何安全推进。

## 2. 当前已经具备的基础

### 2.1 Listing 运行时字段

当前 `src/types/listing.ts` 已包含：

- `commuteMinutes?: number`
- `commuteSource?: "listing" | "cachedTransit"`
- `compositeScore?: number`

这说明列表页和详情页已经能区分：

- 默认参考值；
- 本地通勤结果；
- 运行时参考评分。

这些字段目前用于 UI 透明度和 L2 参考评分，不应被理解为最终推荐依据。

### 2.2 commute-results 本地存储

当前 `src/lib/local-store/commute-results.ts` 已提供：

- `loadCommuteResults`
- `saveCommuteResults`
- `upsertCommuteResult`
- `getCommuteResultsForListing`
- `getCommuteResultForListingAnchorAndMode`
- `clearCommuteResults`

本地 key 为：

```text
housefolio:commute-results

该数据只保存通勤摘要结果，不保存高德原始路线 JSON、请求 URL、polyline、steps、经纬度或 API Key。

2.3 listing-lookup 已连接 L1 与 L2

当前 src/lib/local-store/listing-lookup.ts 已经负责：

读取本地房源；
合并状态覆盖；
读取主观评分；
读取 cached transit；
在运行时覆盖 commuteMinutes；
设置 commuteSource;
调用 calculatePortfolioScores;
输出带 compositeScore 的 listing。

这意味着 L2 当前已经可以消费 L1 transit 摘要，但仍然保持为运行时派生结果，不修改原始 listing 数据。

2.4 L2 score 算法已存在

当前 src/lib/algorithm/score.ts 已包含：

ScoreInput
ScoreBreakdown
ScoreWeights
DEFAULT_SCORE_WEIGHTS
calculatePortfolioScores
getScoreByListingId

当前评分维度包括：

rent
area
commute
life circle
subjective rating

这仍然是 Reference Score，只能作为辅助比较和维度拆解，不代表最终推荐。

2.5 Portfolio 已支持基础筛选与排序

当前 src/lib/algorithm/portfolio.ts 已支持：

按状态筛选；
租金升序 / 降序；
通勤时间升序；
参考评分降序；
创建时间倒序。

这说明 L2 的基础列表排序能力已经存在，但还不是正式 comparison model。

3. 当前明确不做的事

Phase 2F 当前不做：

不新增 compare 页面；
不新增 /compare 路由；
不做多房源勾选；
不做横向对比表；
不做正式 ComparisonModel;
不做异常值检测；
不做相对性价比；
不做复杂多锚点权重；
不接 AI；
不接 POI / 生活圈真实计算；
不接地图 UI；
不接 Supabase；
不进入正式 Phase 4A。
4. Phase 2F 可做的最小安全范围

Phase 2F 后续如继续推进，建议只做以下轻量基础：

定义 comparison foundation 的只读输入边界；
梳理 Listing / ScoreBreakdown / CommuteResult 的关系；
明确未来 compare table 需要哪些字段；
不改变现有 UI；
不改变现有 localStorage key；
不新增平台依赖；
不改变 Reference Score 的定位。

如果需要写代码，也应只允许极小范围的纯函数或类型草案，且不能被页面使用，避免提前进入正式 Phase 4A。

5. 后续建议

下一步建议是：

Phase 2F-0C：Comparison input boundary note

该阶段只定义未来对比模型可能需要的输入字段，不实现正式 comparison model。

候选输入字段包括：

listing id
title
rent
area
layout
district
addressHint
status
commuteMinutes
commuteSource
lifeCircleScore
compositeScore
scoreBreakdown
cached commute summaries
subjective ratings summary

该阶段仍然不做 UI、不做路由、不做 AI、不做数据库、不做复杂权重。