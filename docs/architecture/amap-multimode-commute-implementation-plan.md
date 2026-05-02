# Amap Multi-mode Commute Implementation Plan｜Phase 2D-4

## 1. 目的

本文档用于约束 HouseFolio 后续扩展多通勤方式的实现路径。

当前状态：

- `geocodeAddress` 已完成真实高德接入；
- `calculateCommute` 已完成 `transit` 公共交通最小实现；
- `transit` 本地 smoke test 已通过；
- `walking`、`cycling`、`driving` 尚未实现；
- 页面仍未接入真实通勤结果；
- localStorage 仍未保存真实通勤结果。

Phase 2D-4 只写计划，不写真实请求代码。

---

## 2. 产品判断

公共交通是默认通勤方式，但不是唯一通勤方式。

HouseFolio 后续必须支持用户偏好的通勤方式：

```text
公共交通
步行
骑行
驾车

原因：

北京租房场景中，公共交通通常是默认参考；
近距离场景下，步行可能比公交更准确；
3–8 公里场景下，骑行可能是年轻租客的重要选择；
小家庭或远距离场景下，驾车可能是主要通勤方式；
多人共同居住时，不同通勤锚点可能对应不同出行方式。
3. 内部 mode 设计

HouseFolio 内部继续使用：

type LbsTravelMode = "walking" | "cycling" | "transit" | "driving";

不要引入高德专属命名到页面或业务组件。

页面和业务逻辑只能感知 HouseFolio 自己的 mode：

walking
cycling
transit
driving

高德接口映射只允许存在于：

src/lib/lbs/amap-provider.ts

或未来更细的：

src/lib/lbs/amap-adapters/*
4. 高德接口映射计划

后续实现时，建议映射如下：

HouseFolio mode    高德能力    计划接口
transit    公共交通 / 地铁公交    /v3/direction/transit/integrated
walking    步行路径规划    /v3/direction/walking
cycling    骑行路径规划    /v4/direction/bicycling
driving    驾车路径规划    /v3/direction/driving

注意：

上表是实现计划，真实写代码前仍需再次核对官方文档；
不同接口返回结构可能不一致，必须做 adapter 归一化；
业务层不得直接读取高德原始字段。
5. 统一输出格式

无论底层调用哪个高德接口，最终都必须转成：

CalculateCommuteResult

结构：

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
  mode: "cycling",
  durationMinutes: 42,
  distanceMeters: 11800,
  summary: "到「学校」骑行约 42 分钟，路线距离约 11.8 公里"
}
6. 多模式结果结构

未来一个房源到一个通勤锚点，可以计算多个 mode：

[
  {
    anchorName: "伴侣公司",
    mode: "transit",
    durationMinutes: 47,
    distanceMeters: 14138
  },
  {
    anchorName: "伴侣公司",
    mode: "driving",
    durationMinutes: 28,
    distanceMeters: 12800
  },
  {
    anchorName: "伴侣公司",
    mode: "cycling",
    durationMinutes: 52,
    distanceMeters: 11800
  }
]

但 L2 评分不应简单平均所有 mode。

L2 应优先读取：

用户首选通勤方式

如果用户没有设置，则默认使用：

transit
7. 通勤偏好设计建议

后续 Settings 可以支持两层偏好。

全局默认通勤方式
默认通勤方式：公共交通

可选：

公共交通
骑行
步行
驾车
单个通勤锚点偏好

例如：

我的公司：公共交通
伴侣公司：驾车
学校：骑行

但当前阶段不要急着改 WorkLocation 数据模型。

后续如果确实要扩展，可考虑字段：

preferredCommuteModes?: LbsTravelMode[];
primaryCommuteMode?: LbsTravelMode;

暂不做：

anchorType
personLabel

这些仍然后置，避免 Phase 2D 过度扩展。

8. 缓存边界

允许缓存：

anchorName
listingId
mode
durationMinutes
distanceMeters
provider
calculatedAt

禁止缓存：

完整高德路线 JSON
完整路线 polyline
完整公交站点列表
完整驾车导航步骤
完整步行路线步骤
完整骑行路线步骤
完整请求 URL
可复用路径数据库

核心原则：

只缓存决策摘要，不缓存第三方地图原始数据。
9. API 失败处理

多模式计算时，某一种 mode 失败，不应导致全部失败。

例如：

transit 成功
cycling 成功
driving 失败
walking 成功

此时应返回成功结果，并记录 driving 不可用。

UI 后续可以显示：

驾车通勤暂不可用

不允许：

静默编造驾车时间
10. 实施拆分

建议继续小步推进：

Phase 2D-5：implement walking commute
Phase 2D-6：implement cycling commute
Phase 2D-7：implement driving commute
Phase 2D-8：multi-mode commute smoke script
Phase 2D-9：commute result local-store model planning
Phase 2D-10：页面接入前评审

不要一次性实现全部通勤方式，也不要同时接页面。

11. Phase 2D-5 开始前检查清单

真正写 walking commute 前，必须确认：

 npm.cmd run build 通过；
 git status clean；
 .env.local 不进入 Git；
 不使用 NEXT_PUBLIC_AMAP_API_KEY；
 页面不直接调用高德；
 只通过 lib/lbs；
 不缓存高德完整路线 JSON；
 不缓存路线 polyline；
 不把完整路线传给 AI；
 错误信息不包含 key 或完整请求 URL；
 保留 mock provider；
 transit smoke test 已通过。
12. 当前结论

Phase 2D-4 只是多通勤方式接入计划，不是多模式通勤实现。

下一步建议进入：

Phase 2D-5：implement walking commute

原因：

walking 接口相对简单；
返回结构和 transit 不同，但字段更直接；
适合作为多模式扩展的第一步。