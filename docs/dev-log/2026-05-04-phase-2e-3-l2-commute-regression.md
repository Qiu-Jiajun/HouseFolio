# HouseFolio 开发日志｜Phase 2E-3｜L2 commute-results regression｜2026-05-04

## 1. 本阶段定位

本日志用于记录 Phase 2E-1 与 Phase 2E-2 的完成结果。

当前 HouseFolio 已完成：

```text
Phase 2E-1：Use cached transit commute in L2 reference score
Phase 2E-2：L2 commute-results regression check

Phase 2E-3 不新增功能，只记录 L2 最小消费 L1 通勤摘要的实现方式、回归验证结果、当前边界和下一步建议。

2. 当前完成的能力

Phase 2E-1 已让 L2 Reference Score 可以读取本地保存的 transit 通勤摘要。

当前链路：

Detail 页手动计算公共交通参考通勤
→ 结果保存到 housefolio:commute-results
→ listing-lookup.ts 读取当前 listing 的本地 transit 结果
→ 多个 transit 结果时取最短 durationMinutes
→ 运行时覆盖 listing.commuteMinutes
→ Portfolio 卡片显示更新后的通勤分钟数
→ Portfolio commuteAsc 排序使用更新后的通勤分钟数
→ calculatePortfolioScores() 使用更新后的 commuteMinutes
→ Detail 页 L2 Reference Score 与 commute breakdown 随之变化

这一步没有写回原始 listing 数据，也没有改动服务端 route。

3. 实现范围

本阶段核心修改文件：

src/lib/local-store/listing-lookup.ts

新增逻辑：

1. 引入 getCommuteResultsForListing；
2. 新增 getCachedTransitCommuteMinutes(listingId)；
3. 只读取 mode === "transit" 的 commute-results；
4. 过滤无效 durationMinutes；
5. 多个 transit 结果时取最短值；
6. 新增 attachCachedTransitCommuteMinutes(listings)；
7. getAllClientListings() 改为使用 getClientListingsForScoring()；
8. findClientListingScoreById() 改为使用 getClientListingsForScoring()。

当前策略：

有 cached transit → 使用 cached transit durationMinutes
无 cached transit → 回退 listing.commuteMinutes / mock 数据
4. Phase 2E-2 回归验证结果

已完成手动验证。

验证 A：无 commute-results 时回退正常

操作：

localStorage.removeItem("housefolio:commute-results");
location.reload();

验证结果：

Portfolio 页面正常显示
卡片仍有原始通勤分钟数
Reference Score 正常显示
按通勤时间排序仍可用
Detail 页 L2 参考评分正常显示

结论：

无 cached transit 时，系统可以回退 listing.commuteMinutes / mock 数据。
验证 B：写入单个 cached transit

操作：

向 housefolio:commute-results 写入 listing-001 的 transit = 9 分钟

验证结果：

listing-001 卡片通勤时间变为 9 分钟
Portfolio 按通勤时间排序时 listing-001 明显靠前
Detail 页 L1 区域显示 cached transit 摘要
Detail 页 L2 Reference Score 中 commute 维度随之变化
页面无报错

结论：

L2 已成功消费本地 cached transit 结果。
验证 C：多个通勤锚点时取最短 transit

操作：

向 listing-001 写入两个 transit 结果：
- 测试锚点 A：42 分钟
- 测试锚点 B：13 分钟

验证结果：

listing-001 卡片通勤时间显示 13 分钟

结论：

当前最小策略“多个 transit 结果取最短 durationMinutes”已生效。
5. 当前产品边界

当前 L2 对 commute-results 的消费仍是最小接入。

明确不做：

复杂多通勤锚点权重
主锚点 / 次锚点优先级计算
按家庭成员加权
按通勤方式偏好加权
自动重新计算全部房源
Portfolio 批量通勤计算
AI 参与评分
地图 UI
POI / 生活圈真实计算
Supabase

原因：

1. 当前目标是让 L1 transit 结果接入已有 L2 Reference Score 闭环；
2. Reference Score 仍然只是辅助比较工具，不是推荐系统；
3. 多锚点空间折中需要单独设计，不应在最小接入阶段复杂化；
4. L2 必须继续使用规则和简单数学，不引入 LLM。
6. 当前架构边界

本阶段继续遵守：

L1：负责通勤计算和 commute-results 摘要产生
L2：只读取摘要中的 durationMinutes 做参考评分输入
L3：暂不参与

当前 L2 没有：

调用高德
调用 API route
读取 AMAP_API_KEY
读取高德原始 JSON
调用 AI
写入 localStorage
修改 commute-results

L2 只是通过 listing-lookup.ts 在客户端读取本地已保存摘要，并把它转换为运行时 listing.commuteMinutes。

7. 当前风险与后续注意事项
7.1 最短 transit 是临时策略

当前多个通勤锚点取最短 transit，是 Phase 2E 的最小策略。

它适合验证链路，但并不代表最终多人共同居住决策模型。

后续如果进入更正式的多锚点 L2 模型，应考虑：

主锚点 / 次锚点
本人 / 伴侣 / 学校 / 孩子学校
最大通勤压力
平均通勤压力
最差锚点惩罚
用户自定义硬性条件

但这些都不应在当前阶段立刻做。

7.2 Reference Score 仍是辅助比较

必须继续使用：

参考评分
辅助比较
维度拆解
不代表最终推荐
用户可根据硬性条件一票否决

避免使用：

最佳房源
最优选择
系统推荐
推荐分
替你决定
7.3 不应把 commute-results 当作永久可信数据

当前 commute-results 是本地摘要缓存。

它的定位是：

辅助展示
辅助排序
辅助参考评分

不是：

精确承诺
路线保证
推荐依据
长期不变数据
8. 当前验证状态

本阶段完成后已确认：

npm.cmd run build 通过
git status clean
最新 commit：feat: use cached transit commute in reference score

Phase 2E-2 浏览器回归验证已顺利完成。

9. 下一步候选路线
路线 A：Phase 2E-4 - L2 commute source indicator

建议优先级：中高。

目标：

在 UI 上区分当前通勤分钟数来自：
1. mock / listing 原始字段；
2. cached transit commute-results。

意义：

让用户知道通勤数据来源，避免把 mock / 旧字段误认为真实高德计算结果。

但需要谨慎设计，不要造成 UI 过重。

路线 B：Phase 2E-5 - L2 commute scoring policy note

建议优先级：中。

目标：

补充一份架构说明，记录当前 L2 如何消费 commute-results，以及为什么暂不做多锚点复杂权重。
路线 C：Phase 2D-30 - Detail commute mode selection

建议优先级：中。

目标：

在 Detail L1 区域允许用户选择 transit / walking / cycling / driving。

但这会继续扩张 L1 功能，不是 L2 收口。

路线 D：暂不建议
AI 决策建议
地图 UI
POI / 生活圈真实计算
Supabase
部署
Chrome 插件
10. 本阶段结论

Phase 2E 当前已经完成最关键的小闭环：

真实 transit 通勤摘要
→ 本地 commute-results
→ L2 Reference Score
→ Portfolio 展示与排序
→ Detail 评分拆解

这标志着 HouseFolio 的 L1 与 L2 之间已经出现第一个真实连接点。

当前最重要的是继续保持克制：

不做最终推荐
不做复杂多锚点模型
不让 LLM 参与评分
不扩大到地图 / POI / AI

Phase 2E-3 可以作为 L2 最小消费 commute-results 的稳定记录点。