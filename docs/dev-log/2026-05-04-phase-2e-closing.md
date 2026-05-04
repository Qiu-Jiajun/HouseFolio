# HouseFolio 开发日志｜Phase 2E-6｜L2 commute-results closing｜2026-05-04

## 1. 本阶段定位

本日志用于收尾 Phase 2E。

Phase 2E 的核心目标是：

```text
让 L1 已计算并本地保存的公共交通参考通勤摘要，进入 L2 Reference Score 的最小评分闭环。

当前已完成：

Phase 2E-1：Use cached transit commute in L2 reference score
Phase 2E-2：L2 commute-results regression check
Phase 2E-3：L2 commute-results regression log
Phase 2E-4B：Add commute source indicator
Phase 2E-4C：commute source indicator regression check
Phase 2E-4D：commute source indicator regression log
Phase 2E-5：L2 commute scoring policy note
Phase 2E-6：Phase 2E closing log

本阶段只做阶段性记录，不新增功能。

2. Phase 2E 完成了什么

Phase 2E 完成了 HouseFolio 第一个真实的 L1 → L2 连接点：

Detail 页手动计算公共交通参考通勤
→ /api/lbs/commute/transit 服务端 route
→ 高德路径规划结果被转成 SaveCommuteResultInput[] 摘要
→ client 保存到 housefolio:commute-results
→ listing-lookup.ts 读取 cached transit
→ 运行时覆盖 listing.commuteMinutes
→ L2 Reference Score 使用更新后的 commuteMinutes
→ Portfolio 卡片、通勤排序、Detail 评分拆解同步生效
→ UI 标明“默认参考值 / 本地通勤结果”

这意味着 HouseFolio 不再只是展示 mock 通勤值，而是已经能让用户手动计算的 L1 transit 结果影响 L2 辅助比较。

3. 当前实现范围
3.1 L2 最小消费 commute-results

核心修改文件：

src/lib/local-store/listing-lookup.ts

当前策略：

1. 读取当前 listing 的 housefolio:commute-results；
2. 只筛选 mode === "transit"；
3. 过滤无效 durationMinutes；
4. 如果存在多个 transit 结果，取最短 durationMinutes；
5. 用该值在运行时覆盖 listing.commuteMinutes；
6. 不写回原始 listing；
7. 不修改 commute-results；
8. 不新增 localStorage key。

无 cached transit 时：

继续回退 listing.commuteMinutes / mock 数据。
3.2 通勤来源标识

涉及文件：

src/types/listing.ts
src/lib/local-store/listing-lookup.ts
src/content/zh-cn.ts
src/components/listing-card.tsx
src/components/listing-detail-view.tsx
src/components/listing-commute-panel.tsx

新增运行时字段：

export type ListingCommuteSource = "listing" | "cachedTransit";

commuteSource?: ListingCommuteSource;

UI 现在可以显示：

默认参考值
本地通勤结果

含义：

默认参考值：来自 listing.commuteMinutes / mock 字段
本地通勤结果：来自 housefolio:commute-results 的 cached transit

该字段只用于 UI 透明度提示，不写回 localStorage，也不改变原始 listing 数据。

3.3 L2 commute scoring policy note

新增文档：

docs/architecture/l2-commute-scoring-policy.md

该文档记录：

1. 当前 L2 为什么只读取 transit；
2. 为什么多个锚点暂取最短 durationMinutes；
3. 为什么这只是 Phase 2E 最小策略；
4. 为什么暂不做复杂多锚点权重；
5. 后续正式多锚点模型应考虑哪些因素；
6. L2 与 L3 的边界；
7. Reference Score 仍然是辅助比较，不是推荐系统。
4. 已完成回归验证
4.1 L2 commute-results regression

已手动验证：

1. 无 housefolio:commute-results 时：
   - Portfolio 正常显示；
   - 卡片仍显示默认通勤分钟数；
   - Reference Score 正常；
   - 通勤排序正常；
   - Detail 页 L2 正常。

2. 写入 listing-001 的 cached transit = 9 分钟后：
   - listing-001 卡片通勤时间显示 9 分钟；
   - Portfolio 按通勤排序时 listing-001 靠前；
   - Detail 页 L1 显示测试缓存摘要；
   - Detail 页 L2 commute breakdown 随之变化；
   - 页面无报错。

3. 多锚点 cached transit 场景：
   - listing-001 写入 42 分钟与 13 分钟；
   - 页面显示 13 分钟；
   - “多个 transit 结果取最短 durationMinutes”策略生效。
4.2 commute source indicator regression

已手动验证：

1. 无 cached transit：
   - Portfolio 卡片显示“默认参考值”；
   - Detail 页 L1 通勤时间卡片显示“默认参考值”。

2. 有 cached transit：
   - Portfolio 卡片通勤时间显示 cached transit 分钟数；
   - 通勤时间下方显示“本地通勤结果”；
   - Detail 页 L1 通勤时间卡片显示“本地通勤结果”；
   - 已保存参考通勤结果区域显示对应摘要。

验证后已清理测试 localStorage 数据。

5. 当前 Phase 2E 的边界

Phase 2E 没有做：

复杂多通勤锚点权重
主锚点 / 次锚点优先级
按本人 / 伴侣 / 孩子 / 室友加权
最差锚点惩罚
平均通勤压力
用户自定义通勤权重
Detail 多通勤方式选择
Portfolio 批量通勤计算
自动重新计算全部房源
AI 参与评分
地图 UI
POI / 生活圈真实计算
Supabase
部署
Chrome 插件

原因：

1. 当前目标只是让 L1 transit 摘要进入 L2 最小评分闭环；
2. Reference Score 仍是辅助比较，不是推荐系统；
3. 多通勤锚点模型需要单独产品设计；
4. L2 必须继续使用规则和简单数学；
5. AI 不应参与评分、排序、筛选；
6. 地图 / POI / Supabase 都会引入新的边界和合规复杂度。
6. 当前 L1 / L2 / L3 分层状态
L1 当前状态

L1 已具备：

1. 工作/学习地点（通勤锚点）本地保存；
2. LBS provider 封装；
3. 高德 geocode；
4. transit / walking / cycling / driving 底层 provider 能力；
5. Detail 页手动 transit 计算；
6. 服务端 route 调用高德；
7. 客户端只保存 commute-results 摘要。

L1 当前仍未做：

地图 UI
POI / 生活圈真实计算
多 mode 页面选择
Portfolio 批量计算
自动重算
L2 当前状态

L2 已具备：

1. Reference Score；
2. 评分拆解；
3. Portfolio 排序；
4. subjective rating 动态影响评分；
5. cached transit commute-results 动态影响评分；
6. 通勤来源标识。

L2 当前仍未做：

正式多锚点权重模型
对比视图数据模型
异常值检测
相对性价比
用户自定义权重
L3 当前状态

L3 仍是占位，不接 AI。

当前不做 L3 的原因：

1. L1 / L2 基础闭环仍在稳定；
2. AI 只能基于脱敏结构化数据生成；
3. 当前尚未设计 AI consent、redaction、provider、cost control；
4. 不应让 LLM 参与评分、排序、筛选；
5. 过早接 AI 会模糊产品边界。
7. 当前数据安全边界

当前 commute-results 只保存：

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

当前不保存：

经纬度
高德完整 route JSON
request URL
polyline
steps
公交站点列表
换乘详情
AMAP_API_KEY
NEXT_PUBLIC_AMAP_API_KEY

当前 L2 只读取：

durationMinutes

L2 不调用：

高德
API route
AMAP_API_KEY
AI
数据库
云服务
8. 当前 Reference Score 定位

Phase 2E 之后，Reference Score 更接近真实辅助比较工具，但仍然必须保持克制。

继续使用：

参考评分
辅助比较
维度拆解
仅作参考
不代表最终推荐
用户可根据硬性条件一票否决

避免使用：

最佳房源
最优选择
系统推荐
推荐分
替你决定

当前 UI 的“默认参考值 / 本地通勤结果”来源标识，也服务于这个定位：让用户知道评分输入来自哪里，而不是把所有数字都包装成确定结论。

9. 当前最新提交

Phase 2E 已完成的重要提交包括：

feat: use cached transit commute in reference score
docs: log l2 commute regression
feat: show commute source indicator
docs: log commute source indicator
docs: document l2 commute scoring policy

当前本阶段最后一个已确认 commit：

df396de docs: document l2 commute scoring policy

Phase 2E-6 完成后，应新增提交：

docs: close phase 2e commute scoring
10. 下一阶段候选路线

Phase 2E-6 完成后，建议不要立刻跳 AI、地图、POI、Supabase 或部署。

路线 A：Phase 2F - L2 comparison foundation

建议优先级：高。

目标：

开始为后续对比视图建立 L2 comparison foundation。

可先做：

1. comparison data model review；
2. 明确 compare view 需要哪些字段；
3. 明确哪些字段来自基础 listing；
4. 哪些字段来自 L1 commute-results；
5. 哪些字段来自 L2 score breakdown；
6. 暂不做复杂 UI；
7. 暂不接 AI。

注意：

这不是 Phase 4A 的正式 comparison data model。
Phase 2F 只适合做更轻的 L2 foundation review，避免跳太快。
路线 B：Phase 2D-30 - Detail commute mode selection

建议优先级：中。

目标：

在 Detail L1 区域允许用户选择 transit / walking / cycling / driving。

注意：

1. 需要新增 server route 或扩展现有 route；
2. 需要重新审查 route contract；
3. 仍然只保存摘要；
4. 不接 L2 复杂多 mode 权重；
5. 不接地图。
路线 C：Phase 2E-7 - L2 source / policy polish

建议优先级：中低。

目标：

进一步优化默认参考值说明，例如说明它来自示例数据或用户原始填写字段。

当前不急，因为 UI 不宜变重。

暂不建议
AI 决策建议
地图 UI
POI / 生活圈真实计算
Supabase
部署
Chrome 插件
公开运营
11. Phase 2E 结论

Phase 2E 的价值不是功能数量，而是完成了一个关键架构连接：

L1 产生真实 commute summary
L2 消费 commute summary
UI 解释 commute source
Reference Score 保持辅助比较定位

这让 HouseFolio 的“三层引擎”开始从概念走向可运行闭环：

L1：计算空间数据
L2：把空间数据纳入可比较结构
L3：暂不介入，等待脱敏结构化数据和明确授权边界

当前阶段可以视为 L1 commute 与 L2 reference scoring 的稳定连接点。