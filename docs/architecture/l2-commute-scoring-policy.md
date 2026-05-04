# HouseFolio 架构说明｜L2 commute scoring policy｜Phase 2E-5

## 1. 本文档定位

本文档记录 Phase 2E 当前 L2 Reference Score 如何消费 L1 commute-results。

当前 HouseFolio 已经完成：

```text
Detail 页手动计算公共交通参考通勤
→ 服务端 route 调用高德
→ 客户端只保存摘要到 housefolio:commute-results
→ listing-lookup.ts 读取 cached transit
→ 运行时覆盖 listing.commuteMinutes
→ L2 Reference Score 使用更新后的 commuteMinutes
→ UI 标明“默认参考值 / 本地通勤结果”

本文档只说明当前策略，不新增功能。

2. 当前 L2 通勤输入来源

当前 L2 Reference Score 的通勤维度仍然只读取一个字段：

commuteMinutes

这个字段在运行时可能来自两类来源：

1. listing.commuteMinutes
   - mock 数据
   - 用户原始添加字段
   - 默认参考值

2. housefolio:commute-results 中的 cached transit
   - 用户在 Detail 页手动计算公共交通参考通勤后产生
   - 只保存摘要
   - UI 标记为“本地通勤结果”

当前来源标识通过运行时字段表达：

commuteSource?: "listing" | "cachedTransit"

该字段只用于 UI 透明度提示，不写回 localStorage，不改变原始 listing 数据。

3. 当前最小策略：只读取 transit

Phase 2E 当前只让 L2 读取：

mode === "transit"

原因：

1. Detail 页当前只提供“计算公共交通参考通勤”按钮；
2. transit 是中国大陆城市租房决策中最常见的默认通勤参考方式；
3. walking / cycling / driving 虽然底层 provider 已支持，但页面尚未提供模式选择；
4. L2 不应提前消费 UI 尚未清晰暴露给用户的通勤模式；
5. 当前目标是打通 L1 → L2 最小闭环，而不是建立完整通勤偏好系统。

因此，walking / cycling / driving 暂不进入 L2 Reference Score。

4. 当前多锚点策略：取最短 durationMinutes

如果同一房源有多个 transit commute-results，当前 Phase 2E 策略是：

取最短 durationMinutes

即：

cachedTransitCommuteMinutes = min(all transit durationMinutes for this listing)

这是一个临时的最小策略。

它的优点：

1. 实现简单；
2. 可以验证 L1 commute-results 是否能进入 L2；
3. 不引入复杂权重；
4. 不需要新增用户配置；
5. 不破坏现有 Reference Score 结构。

它的局限：

1. 最短通勤不等于多人共同居住下的最优空间折中；
2. 可能忽略伴侣、孩子学校、次要锚点的通勤压力；
3. 不能表达“最差锚点过远”的问题；
4. 不能表达不同人对通勤的权重差异；
5. 不应被视为最终多锚点评分模型。
5. 为什么当前不做复杂多锚点权重

HouseFolio v1.4 已明确：L1 通勤输入不应被简化为单一工作地点，而应支持工作/学习地点（通勤锚点），覆盖本人公司、伴侣公司、学校、孩子学校等场景。

但 Phase 2E 当前仍不做复杂多锚点权重，原因是：

1. 当前刚完成 L1 transit 计算到 L2 Reference Score 的最小连接；
2. 多锚点模型需要明确产品语义，不能只从技术上加权；
3. 用户可能更关心最短通勤、平均通勤、最差通勤或主锚点通勤；
4. 不同家庭结构和合租关系下，权重差异很大；
5. 如果过早内置复杂公式，容易把参考评分误包装成推荐系统；
6. 当前阶段更重要的是保证链路稳定、边界清晰、解释可信。

因此，当前策略只用于 Phase 2E 的最小闭环验证。

6. 后续正式多锚点模型应考虑的因素

未来如果进入正式多锚点 L2 模型，应单独设计，不应在 Phase 2E 内顺手扩张。

后续可能的维度包括：

1. 主锚点 / 次锚点
   - 用户自己标记哪个锚点最重要

2. 人员标签
   - 我
   - 伴侣
   - 孩子
   - 室友

3. 锚点类型
   - 工作
   - 学习
   - 家庭
   - 其他

4. 平均通勤压力
   - 多个锚点的平均 durationMinutes

5. 最大通勤压力
   - 最远锚点 durationMinutes

6. 最差锚点惩罚
   - 只要某个锚点超过阈值，就降低参考分

7. 硬性通勤上限
   - 例如任何主要锚点超过 60 分钟，用户可一票否决

8. 通勤方式偏好
   - 公共交通
   - 步行
   - 骑行
   - 驾车

9. 用户自定义权重
   - 用户可手动调节，而不是系统替用户决定

这些设计应进入后续独立阶段，而不是混在当前最小 L2 接入中。

7. L2 与 L3 的边界

当前 L2 通勤评分策略必须继续遵守：

L2 用规则和简单数学
L2 不调用 LLM
L2 不调用高德
L2 不读取 AMAP_API_KEY
L2 不保存高德原始 JSON
L2 不做最终推荐

AI 后续只能在 L3 中基于脱敏后的结构化数据做解释，例如：

“这套房对主通勤锚点较友好，但对伴侣公司通勤压力偏高。”

但 AI 不应参与：

评分计算
排序规则
通勤时长估算
是否推荐某套房
8. Reference Score 的产品定位

当前通勤结果进入 L2 后，Reference Score 仍然只是：

参考评分
辅助比较
维度拆解
排序辅助

它不是：

最终推荐
最佳房源判断
系统替用户决定
通勤承诺
路线保证

UI 和文案应继续使用：

参考评分
辅助比较
仅作参考
不代表最终推荐
用户可根据硬性条件一票否决

避免使用：

最佳房源
最优选择
系统推荐
推荐分
替你决定
9. 当前数据安全边界

当前 L2 只读取本地摘要：

durationMinutes

不会读取或保存：

经纬度
高德完整 route JSON
request URL
polyline
steps
公交站点列表
换乘详情
AMAP_API_KEY

这延续了 Phase 2D 的边界：

客户端只保存通勤摘要
服务端 route 处理高德调用
route response 不暴露敏感字段
commute-results 不保存原始地图数据
10. 当前策略总结

Phase 2E 当前策略可以概括为：

有 cached transit：
  L2 使用本地 cached transit 的最短 durationMinutes
  UI 标记为“本地通勤结果”

没有 cached transit：
  L2 回退 listing.commuteMinutes
  UI 标记为“默认参考值”

这是 HouseFolio 当前阶段合适的最小方案。

它完成了 L1 → L2 的第一个真实连接点，同时没有越界到复杂推荐系统、AI、地图 UI、POI 或云端存储。

11. 下一阶段建议

完成本文档后，Phase 2E 已经具备一个阶段性收口点。

下一步可以二选一：

路线 A：Phase 2E closing log
  - 为 Phase 2E 做整体收尾日志
  - 记录 L1 → L2 最小闭环
  - 建议优先

路线 B：Phase 2D-30 Detail commute mode selection
  - 继续扩张 L1，增加 transit / walking / cycling / driving 模式选择
  - 建议稍后

暂不建议：

AI 决策建议
地图 UI
POI / 生活圈真实计算
Supabase
部署
Chrome 插件
