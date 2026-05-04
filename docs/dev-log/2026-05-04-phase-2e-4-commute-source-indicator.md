# HouseFolio 开发日志｜Phase 2E-4D｜Commute source indicator regression｜2026-05-04

## 1. 本阶段定位

本日志用于记录 Phase 2E-4B 与 Phase 2E-4C 的完成结果。

当前 HouseFolio 已完成：

```text
Phase 2E-4B：Add commute source indicator
Phase 2E-4C：commute source indicator regression check

本阶段不新增功能，只记录通勤数据来源标识的实现方式、回归验证结果、当前边界和下一步建议。

2. 当前完成的能力

当前 UI 已经可以区分 L1 通勤分钟数来源：

默认参考值：来自 listing.commuteMinutes / mock 字段
本地通勤结果：来自 housefolio:commute-results 的 cached transit

这解决了一个重要产品问题：

用户不应误以为所有通勤分钟数都来自真实高德计算。

现在当用户在 Detail 页手动计算公共交通参考通勤并保存到本地后，Portfolio 卡片和 Detail 页 L1 通勤时间卡片都会显示“本地通勤结果”。

如果没有 cached transit，则继续显示原始 mock / listing 字段，并标记为“默认参考值”。

3. 当前链路

当前完整链路为：

Detail 页手动计算公共交通参考通勤
→ /api/lbs/commute/transit 服务端 route
→ 高德计算结果转为 SaveCommuteResultInput[]
→ client upsert 到 housefolio:commute-results
→ listing-lookup.ts 读取 cached transit
→ 运行时覆盖 listing.commuteMinutes
→ 标记 commuteSource: "cachedTransit"
→ Portfolio 卡片显示“本地通勤结果”
→ Detail 页 L1 通勤卡片显示“本地通勤结果”
→ L2 Reference Score 使用更新后的 commuteMinutes

无 cached transit 时：

listing-lookup.ts 回退 listing.commuteMinutes
→ 标记 commuteSource: "listing"
→ UI 显示“默认参考值”
→ L2 Reference Score 继续使用默认字段
4. 实现范围

本阶段涉及 6 个文件：

src/types/listing.ts
src/lib/local-store/listing-lookup.ts
src/content/zh-cn.ts
src/components/listing-card.tsx
src/components/listing-detail-view.tsx
src/components/listing-commute-panel.tsx
4.1 Listing 类型

新增运行时来源字段：

export type ListingCommuteSource = "listing" | "cachedTransit";

commuteSource?: ListingCommuteSource;

注意：

commuteSource 是运行时 UI 辅助字段。
它不写回 localStorage。
它不改变 listing 原始数据。
它不代表永久数据来源。
4.2 listing-lookup.ts

新增逻辑：

1. 如果当前 listing 有 cached transit：
   - commuteMinutes 使用最短 transit durationMinutes
   - commuteSource 标记为 cachedTransit

2. 如果当前 listing 没有 cached transit：
   - commuteMinutes 保持 listing 原始字段
   - 若存在原始 commuteMinutes，则 commuteSource 标记为 listing

当前仍然保持 Phase 2E 的最小策略：

多个 transit 结果时取最短 durationMinutes

这只是当前阶段的最小实现，不是最终多通勤锚点模型。

4.3 中文文案

新增文案：

默认参考值
本地通勤结果

位置：

listingCard.commuteSource
listingDetailView.l1.commuteSource
4.4 Portfolio 卡片

Portfolio 卡片的 L1 通勤分钟数下方会显示来源标识：

默认参考值
或
本地通勤结果
4.5 Detail 页 L1 通勤卡片

Detail 页 L1 区域的通勤时间卡片也会显示同样的来源标识。

5. 回归验证结果

Phase 2E-4C 已完成浏览器手动验证。

验证 A：无 cached transit

操作：

localStorage.removeItem("housefolio:commute-results");
location.reload();

验证结果：

Portfolio 卡片正常显示通勤分钟数
通勤分钟数下方显示“默认参考值”
Detail 页 L1 通勤时间卡片显示“默认参考值”
页面无报错

结论：

无 cached transit 时，系统仍可回退 listing.commuteMinutes / mock 字段。
验证 B：有 cached transit

操作：

向 housefolio:commute-results 写入 listing-001 的 transit = 9 分钟

验证结果：

listing-001 Portfolio 卡片通勤时间显示 9 分钟
通勤分钟数下方显示“本地通勤结果”
Detail 页 L1 通勤时间显示 9 分钟
Detail 页 L1 通勤时间卡片显示“本地通勤结果”
已保存的参考通勤结果区域显示测试缓存摘要
页面无报错

结论：

commute source indicator 已正确区分默认字段与本地 cached transit。
6. 当前边界

本阶段没有做：

不改评分算法
不写回 listing
不新增 localStorage key
不做复杂多锚点权重
不接 AI
不接地图
不接 POI
不接 Supabase
不接部署

当前 source indicator 只是 UI 透明度增强，不改变 L1/L2 的基本职责。

7. 为什么这一步重要

这一阶段的价值不是新增计算能力，而是提高数据可信度表达。

当前 HouseFolio 同时存在两类通勤值：

1. mock / listing 原始字段
2. 用户手动计算后保存的本地 transit 结果

如果 UI 不区分来源，用户容易把默认 mock 值误认为真实高德结果。

现在通过“默认参考值 / 本地通勤结果”标识，可以更清楚地表达：

通勤数据来自哪里
是否已经经过本地手动计算
当前 Reference Score 使用的是哪类通勤输入

这符合 HouseFolio 的产品原则：

参考评分
辅助比较
维度拆解
不代表最终推荐
不夸大数据确定性
8. 当前风险与后续注意事项
8.1 “默认参考值”仍需后续解释

当前“默认参考值”可以说明不是 cached transit，但后续如果产品继续成熟，可能需要更明确说明：

该值来自示例数据或用户原始填写字段，未必经过真实路径规划。

但当前阶段不宜让卡片文案过重。

8.2 “本地通勤结果”不是永久承诺

“本地通勤结果”只表示：

该值来自本机保存的 commute-results 摘要。

它不表示：

路线保证
高德实时结果
最终推荐依据
长期不变通勤时间
8.3 多锚点策略仍未正式设计

当前多个 transit 结果取最短值，只是最小策略。

后续正式多通勤锚点模型应单独设计：

主锚点
次锚点
本人 / 伴侣 / 学校 / 孩子学校
最差锚点惩罚
平均通勤压力
硬性通勤上限
9. 当前验证状态

本阶段完成后应确认：

npm.cmd run build 通过
git status clean
最新 commit：feat: show commute source indicator
浏览器回归验证通过
10. 下一步候选路线
路线 A：Phase 2E-5 - L2 commute scoring policy note

建议优先级：高。

目标：

补充一份 L2 通勤评分策略说明，记录当前为什么只取 cached transit 的最短 durationMinutes，以及为什么暂不做复杂多锚点权重。

意义：

为后续多锚点 L2 模型预留清晰边界，避免下一阶段直接把多人通勤模型做复杂。
路线 B：Phase 2D-30 - Detail commute mode selection

建议优先级：中。

目标：

在 Detail L1 区域允许用户选择 transit / walking / cycling / driving。

但这会扩张 L1 功能，建议晚于 L2 收口说明。

路线 C：暂不建议
AI 决策建议
地图 UI
POI / 生活圈真实计算
Supabase
部署
Chrome 插件
11. 本阶段结论

Phase 2E-4 已完成一个轻量但关键的透明度增强：

L2 当前使用的通勤分钟数，不再只是一个无来源数字。
UI 已能标明它来自默认参考值，还是来自本地 cached transit 结果。

这使 HouseFolio 当前的 L1 → L2 链路更可信，也更符合“辅助比较、不替用户做决定”的产品边界。