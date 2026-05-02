# Amap Commute Implementation Plan｜Phase 2D-0

## 1. 目的

本文档用于约束 HouseFolio 后续接入高德通勤计算的最小实现路径。

当前状态：

- `geocodeAddress` 已完成最小高德接入；
- 高德 Web 服务 Key 已在本地 `.env.local` 验证；
- 本地 geocode smoke test 已通过；
- `calculateCommute` 仍未接入真实高德 API；
- `searchNearbyPoi` 仍未接入真实高德 API；
- 页面仍未接入真实 LBS 结果。

Phase 2D-0 只写计划，不写真实请求代码。

---

## 2. 通勤计算的产品定位

HouseFolio 的通勤计算属于 L1 LBS 层。

它只回答：

```text
候选房源到工作/学习地点（通勤锚点）之间的参考通勤关系

包括：

参考通勤时间；
路线距离；
交通方式；
多个通勤锚点之间的空间折中；
后续 L2 参考评分和排序的结构化输入。

它不回答：

哪套房一定最好；
实际每天一定需要多少分钟；
是否保证准时到达；
是否替用户做最终选择。

产品文案必须使用：

参考通勤时间
路线距离估算
基于高德路径规划计算
仅作辅助比较

避免使用：

精准通勤预测
真实通勤保障
保证通勤时间
系统推荐最佳通勤房源
3. 支持的通勤模式

HouseFolio 的内部通勤模式继续使用：

type LbsTravelMode = "walking" | "cycling" | "transit" | "driving";

含义：

mode    含义    用途
walking    步行    短距离到地铁站、学校、公司附近
cycling    骑行    3–8 公里通勤参考
transit    公共交通 / 地铁公交    北京租房场景的核心模式
driving    驾车    家庭、远距离或特殊通勤场景

MVP 优先级：

1. transit
2. cycling
3. walking
4. driving

实际实现时可以先只做一个模式，例如 transit，再扩展其他模式。

4. 输入与输出

统一入口仍然是：

calculateCommute(input)

输入：

{
  origin: LbsCoordinate;
  destination: LbsCoordinate;
  mode: LbsTravelMode;
  anchorName?: string;
  listingId?: string;
}

输出：

{
  provider: "amap";
  isMock: false;
  mode: LbsTravelMode;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
}

示例：

{
  provider: "amap",
  isMock: false,
  mode: "transit",
  durationMinutes: 37,
  distanceMeters: 12800,
  summary: "到「伴侣公司」公共交通约 37 分钟，路线距离约 12.8 公里"
}
5. 数据缓存边界

允许缓存：

listingId
anchorName
mode
durationMinutes
distanceMeters
provider
calculatedAt

谨慎缓存：

起点经纬度
终点经纬度

默认不缓存或只本地保存：

精确工作地点
完整家庭住址
完整通勤轨迹

禁止缓存：

高德完整路线 JSON
完整路线轨迹 polyline
完整公交站点列表
完整换乘详情
完整请求 URL
可复用路径数据库
地图瓦片

核心原则：

只缓存决策摘要，不缓存第三方地图原始数据。
6. 原始响应处理流程

未来真实实现时，处理流程必须是：

高德路径规划原始响应
→ adapter 读取第一条或最合适路线
→ 提取 distance / duration
→ 转换为 CalculateCommuteResult
→ 丢弃原始响应

不得把高德原始响应传给：

页面
localStorage
L2 算法
L3 AI
Settings 导出

L2 只能读取摘要字段：

durationMinutes
distanceMeters
mode

L3 只能读取脱敏摘要：

到锚点 A 公共交通约 37 分钟
路线距离约 12.8 公里
7. 多通勤锚点策略

HouseFolio 不把通勤输入简化为单一工作地点。

后续计算应支持：

房源 A → 我的公司
房源 A → 伴侣公司
房源 A → 学校

MVP 阶段最多 1–3 个锚点。

对每套房源，应形成类似结构：

[
  {
    anchorName: "我的公司",
    mode: "transit",
    durationMinutes: 32,
    distanceMeters: 9800
  },
  {
    anchorName: "伴侣公司",
    mode: "transit",
    durationMinutes: 41,
    distanceMeters: 14200
  }
]

后续 L2 可以计算：

平均通勤压力
最长通勤压力
主要锚点通勤压力
多人空间折中评分

但 Phase 2D 暂时只做 L1 通勤摘要，不急着改 L2 评分模型。

8. 错误与降级

真实路径规划失败时，不得影响基础 Portfolio 使用。

允许策略：

1. 返回明确错误；
2. UI 后续显示“通勤数据暂不可用”；
3. 保留用户手动填写 / 估算通勤备注；
4. 开发阶段可回落 mock provider；
5. 不允许静默编造真实通勤时间。

错误信息不得包含：

AMAP_API_KEY
完整请求 URL
完整高德响应体
用户精确地址
完整经纬度轨迹
9. Phase 2D 实施拆分建议

不要一次性接完整通勤。

建议拆为：

Phase 2D-1：Amap commute contract types
Phase 2D-2：transit commute provider minimal implementation
Phase 2D-3：local smoke script for transit commute
Phase 2D-4：cycling / walking mode planning
Phase 2D-5：commute result local-store model planning
Phase 2D-6：Settings / Listing 页面接入前评审

当前不建议直接做页面接入。

10. Phase 2D-1 开始前检查清单

真正写 calculateCommute 代码前，必须确认：

 npm.cmd run build 通过；
 git status clean；
 .env.local 不进入 Git；
 不使用 NEXT_PUBLIC_AMAP_API_KEY；
 页面不直接调用高德；
 仍然只通过 lib/lbs；
 不缓存高德完整路线 JSON；
 不缓存完整路线轨迹；
 不把完整路线信息传给 AI；
 错误信息不包含 key 或完整请求 URL；
 保留 mock provider 作为降级路径；
 继续支持 1–3 个工作/学习地点（通勤锚点）。
11. 当前结论

Phase 2D-0 只是通勤计算接入计划，不是通勤计算实现。

下一步如果继续，应进入：

Phase 2D-1：Amap commute contract types

仍然先定义类型和 adapter 输出，不直接打真实路径规划 API。