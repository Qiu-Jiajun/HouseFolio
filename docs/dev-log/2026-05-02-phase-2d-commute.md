# HouseFolio 开发日志｜2026-05-02｜Phase 2D 通勤计算闭环

## 1. 本日志用途

本文档记录 HouseFolio Phase 2D 的完成情况。

当前已经完成的是：

```text
高德地理编码 + 多模式通勤计算 + 本地 smoke test + 通勤结果本地存储模型

但还没有完成：

页面接入
自动批量计算
L2 评分接入
AI 分析接入
地图 UI
POI / 生活圈真实计算

后续新对话继续 HouseFolio 时，不要把 Phase 2D 误判为完整 L1 LBS 引擎完成。

2. 当前产品边界

HouseFolio 仍然是私人找房决策管理工具，不是房源平台、中介平台、房源聚合平台或真房源认证平台。

L1 LBS 当前只用于：

用户主动提供的候选房源位置
→ 到 1–3 个工作/学习地点（通勤锚点）
→ 计算参考通勤时间与路线距离
→ 作为后续辅助比较输入

当前通勤结果只能表述为：

参考通勤时间
路线距离估算
基于高德路径规划计算
仅作辅助比较

不能表述为：

精准通勤预测
保证通勤时间
最佳房源推荐
系统替你决定
3. Phase 2D 已完成内容
Phase 2D-0：通勤计算 implementation plan

已完成文档：

docs/architecture/amap-commute-implementation-plan.md

明确了：

通勤计算属于 L1 LBS；
不代表最终推荐；
只缓存摘要结果；
不缓存完整高德路线 JSON；
不把完整路线传给 AI；
多通勤锚点必须继续支持。
Phase 2D-1：Amap commute contract types

已更新：

src/lib/lbs/amap-contract.ts
src/lib/lbs/index.ts

新增 / 完善了：

AmapCommuteApiKind
AmapCommuteStrategy
AmapCommuteRequestShape
AmapCommuteLegSummary
AmapCommuteAdapterOutput
AmapCommutePersistableSummary

目的：固定高德通勤结果只输出摘要，不暴露原始路线 JSON、polyline、站点列表或完整换乘详情。

Phase 2D-2：Transit commute provider

已在：

src/lib/lbs/amap-provider.ts

实现：

mode: "transit"

对应高德公共交通 / 地铁公交路径规划。

输出：

durationMinutes
distanceMeters
summary
Phase 2D-3：Transit smoke test

已新增：

scripts/smoke-amap-transit-commute.mjs

已验证：

望京 SOHO 附近 → 国贸附近
望京 SOHO 附近 → 五道口地铁站附近

公共交通通勤 smoke test 已通过。

Phase 2D-4：多通勤方式接入计划

已新增：

docs/architecture/amap-multimode-commute-implementation-plan.md

明确 HouseFolio 不能只支持公共交通。

应支持：

transit
walking
cycling
driving

公共交通是默认方式，但不是唯一方式。

Phase 2D-5：Walking commute provider

已实现：

mode: "walking"

对应高德步行路径规划。

Phase 2D-6：Walking smoke test

已新增：

scripts/smoke-amap-walking-commute.mjs

已验证步行通勤 smoke test 通过。

Phase 2D-7：Cycling commute provider

已实现：

mode: "cycling"

对应高德骑行路径规划。

Phase 2D-8：Cycling smoke test

已新增：

scripts/smoke-amap-cycling-commute.mjs

已验证骑行通勤 smoke test 通过。

Phase 2D-9：Driving commute provider

已实现：

mode: "driving"

对应高德驾车路径规划。

Phase 2D-10：Driving smoke test

已新增：

scripts/smoke-amap-driving-commute.mjs

已验证驾车通勤 smoke test 通过。

Phase 2D-11：Multi-mode commute smoke check

已新增：

scripts/smoke-amap-multimode-commute.mjs

已验证同一组起终点下，四种方式能形成统一摘要：

transit
walking
cycling
driving

脚本设计为：某一种 mode 失败，不中断其他 mode。

这符合产品逻辑：某一种通勤方式不可用，不应导致全部通勤计算失败。

Phase 2D-12：commute result local-store model planning

已新增：

docs/architecture/commute-result-local-store-plan.md

明确未来本地保存通勤结果时只保存摘要。

建议 key：

housefolio:commute-results

允许保存：

listingId
anchorId
anchorName
mode
provider
isMock
durationMinutes
distanceMeters
summary
calculatedAt

禁止保存：

高德完整路线 JSON
完整请求 URL
完整 polyline
完整公交站点列表
完整换乘详情
完整步行 / 骑行 / 驾车导航步骤
AMAP_API_KEY
Phase 2D-13：commute result type + local-store

已新增：

src/types/commute-result.ts
src/lib/local-store/commute-results.ts

已支持：

loadCommuteResults
saveCommuteResults
upsertCommuteResult
deleteCommuteResult
deleteCommuteResultsForListing
getCommuteResultsForListing
getCommuteResultForListingAnchorAndMode
clearCommuteResults
Phase 2D-14：privacy local-data 纳入 commute-results

已更新：

src/lib/privacy/local-data.ts

新增 key：

housefolio:commute-results

Settings 本地数据快照、导出 JSON、清除本机数据现在应覆盖该 key。

Phase 2D-15：commute result local-store contract check

已新增：

src/lib/local-store/commute-results-contract-check.ts

用于编译期验证通勤结果本地存储函数的调用结构。

Phase 2D-16：Settings local data regression check

已手动验证：

housefolio:commute-results 可出现在 Settings 本地数据快照
count 可显示为 1
导出 JSON 包含 commute-results
清除本机数据后该 key 被删除
git status clean
npm.cmd run build 通过
4. 当前关键文件
LBS provider
src/lib/lbs/amap-provider.ts
src/lib/lbs/provider.ts
src/lib/lbs/service.ts
src/lib/lbs/registry.ts
src/lib/lbs/index.ts
src/lib/lbs/amap-contract.ts
本地存储
src/types/commute-result.ts
src/lib/local-store/commute-results.ts
src/lib/local-store/commute-results-contract-check.ts
src/lib/privacy/local-data.ts
Smoke scripts
scripts/smoke-amap-geocode.mjs
scripts/smoke-amap-transit-commute.mjs
scripts/smoke-amap-walking-commute.mjs
scripts/smoke-amap-cycling-commute.mjs
scripts/smoke-amap-driving-commute.mjs
scripts/smoke-amap-multimode-commute.mjs
Architecture docs
docs/architecture/amap-geocode-implementation-plan.md
docs/architecture/amap-commute-implementation-plan.md
docs/architecture/amap-multimode-commute-implementation-plan.md
docs/architecture/commute-result-local-store-plan.md
docs/architecture/lbs-provider-boundary.md
5. 当前 .env.local 状态

本地 .env.local 已用于 smoke test：

LBS_PROVIDER=amap
AMAP_API_KEY=<local only>

注意：

.env.local 不进入 Git；
.gitignore 中 .env* 已覆盖 .env.local；
不要把真实 key 贴到对话里；
不要把真实 key 提交到 Git；
NEXT_PUBLIC_AMAP_API_KEY 仍然禁止使用。
6. 当前已完成能力

当前 LBS / commute 层已经具备：

真实高德 geocodeAddress
真实 transit calculateCommute
真实 walking calculateCommute
真实 cycling calculateCommute
真实 driving calculateCommute
multi-mode smoke test
commute-results 本地存储模型
Settings 数据导出 / 清除覆盖 commute-results
7. 当前尚未完成能力

以下内容仍未完成：

页面接入通勤计算
房源详情页展示真实通勤结果
Settings 页面触发通勤计算
自动批量计算房源 × 通勤锚点 × mode
L2 参考评分读取真实通勤结果
L3 AI 使用通勤摘要
POI / 生活圈真实计算
地图 UI
通勤结果过期刷新策略
通勤偏好 UI

不要误判为 L1 LBS 全部完成。

当前真实完成的是：

LBS provider 层 + 多模式通勤计算 + 本地 smoke test + 本地摘要存储基础。
8. 后续建议路线

下一步建议不要直接接页面。

建议先做：

Phase 2D-18：页面接入前评审

评审内容：

1. 页面应在哪里触发通勤计算？
2. 是否先做手动按钮，而不是自动批量计算？
3. 默认展示 transit，还是展示用户首选 mode？
4. 是否需要先设计通勤偏好？
5. 真实 LBS 结果写入 localStorage 后，如何避免重复调用高德？
6. 失败时如何显示？
7. 是否会把完整地址或经纬度暴露给 AI？

如果要继续做真实功能，建议之后按小步推进：

Phase 2D-18：页面接入前评审
Phase 2D-19：commute calculation service wrapper
Phase 2D-20：Detail 页面手动计算按钮
Phase 2D-21：Detail 页面展示 commute-results 摘要
Phase 2D-22：Settings / local data 回归

暂不建议直接做：

自动批量计算
L2 评分接入
AI 分析接入
地图可视化
POI / 生活圈真实计算
9. 当前结论

Phase 2D 已经完成“底层通勤能力闭环”，但还没有完成“产品页面闭环”。

当前状态可以概括为：

L1 LBS 通勤底层能力：基本完成
L1 LBS 页面体验：尚未接入
L2 / L3 使用通勤结果：尚未接入

下一步应先做页面接入前评审，而不是继续盲目堆功能。