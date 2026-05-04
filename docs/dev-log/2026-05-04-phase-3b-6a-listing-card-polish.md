# HouseFolio 开发日志｜2026-05-04｜Phase 3B-6A ListingCard Micro Polish

## 1. 阶段目标

本阶段进入 Phase 3B-6A：ListingCard micro polish。

目标是在不改变功能、不改变数据、不改变算法、不新增页面、不新增入口的前提下，对 Portfolio 页面中的房源卡片做一次极小视觉层级微调。

本阶段只修改：

- src/components/listing-card.tsx

本阶段明确不做：

- 不新增 /compare 路由；
- 不新增多房源勾选；
- 不新增横向对比表；
- 不进入正式 ComparisonModel；
- 不接地图 UI；
- 不接 AI / DeepSeek；
- 不接 POI；
- 不接 Supabase；
- 不改 Reference Score 算法；
- 不改通勤数据来源；
- 不改 Portfolio 筛选 / 排序逻辑；
- 不新增任何推荐系统措辞。

## 2. 修改内容

本阶段对 ListingCard 做了轻量视觉 polish：

1. 强化卡片 hover 层级；
2. 强化租金字段的主视觉权重；
3. 将通勤时间与参考评分提升为更明显的决策字段；
4. 将面积、户型、生活圈保留为辅助字段；
5. 保留 commuteSource 显示；
6. 保留 Reference Score 的参考说明；
7. 略微增强“查看详情”按钮的行动感。

## 3. 未改变内容

本阶段没有改变：

- Listing 类型；
- localStorage 数据；
- mock 数据；
- Reference Score 计算逻辑；
- commute-results 读取逻辑；
- commuteSource 逻辑；
- Portfolio 筛选逻辑；
- Portfolio 排序逻辑；
- 路由结构；
- zhCN 文案内容；
- L1 / L2 / L3 产品边界；
- 合规 footer；
- Settings 数据权利能力。

## 4. 产品边界确认

本阶段没有引入以下风险：

- 没有房源抓取；
- 没有房源聚合；
- 没有公开房源库；
- 没有房源真实性认证；
- 没有联系房东、预约看房、撮合交易、佣金或保证金；
- 没有 AI 自动建议；
- 没有地图 UI；
- 没有 POI 真实计算；
- 没有 Supabase；
- 没有“最佳房源”“系统推荐”“替你决定”等推荐系统措辞。

Reference Score 仍然只是：

- 参考评分；
- 辅助比较；
- 维度拆解；
- 不代表最终推荐。

## 5. 验证结果

已确认：

- npm.cmd run build 通过；
- git status clean；
- 最新提交包含 ListingCard micro polish；
- src/components/listing-card.tsx 中存在 hover:border-slate-700；
- src/components/listing-card.tsx 中存在白色租金主卡；
- 旧的租金/月 inline 写法已不再存在。

最新相关 commit：

- 4fec7c style: polish listing card hierarchy

## 6. 当前阶段结论

Phase 3B-6A ListingCard micro polish 已完成。

本阶段是 Phase 3B 中第一处真实 UI 微调，范围控制良好：

- 只改一个组件；
- build 通过；
- 没有新增功能；
- 没有改业务逻辑；
- 没有扩大合规风险。

后续如继续 Phase 3B，可考虑：

1. Phase 3B-6B：Detail L1 / L2 readability micro polish；
2. Phase 3B-6C：Settings readability micro polish；
3. 或者先做 Phase 3B checkpoint，再决定是否继续视觉微调。