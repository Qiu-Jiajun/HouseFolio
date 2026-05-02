# Commute Result Local Store Plan｜Phase 2D-12

## 1. 目的

本文档用于规划 HouseFolio 后续如何保存 L1 LBS 通勤计算结果。

当前状态：

- `geocodeAddress` 已完成真实高德接入；
- `calculateCommute` 已支持：
  - transit
  - walking
  - cycling
  - driving
- 四种通勤方式均已通过本地 smoke test；
- 当前仍未接页面；
- 当前仍未写入 localStorage；
- 当前仍未接入 Settings 导出 / 清除。

Phase 2D-12 只做规划，不写真实存储代码。

---

## 2. 产品定位

通勤结果属于 L1 LBS 输出。

它服务于：

```text
候选房源
→ 到 1–3 个工作/学习地点（通勤锚点）
→ 在不同通勤方式下的参考通勤关系

它不是最终推荐结果，也不是对实际每日通勤的承诺。

用户可见文案应使用：

参考通勤时间
路线距离估算
基于高德路径规划计算
仅作辅助比较

避免使用：

精准通勤
保证通勤
最佳通勤路线
系统推荐
3. 建议 localStorage key

后续新增本地存储 key：

housefolio:commute-results

该 key 后续必须同步纳入：

src/lib/privacy/local-data.ts

这样 Settings 页面才能继续覆盖：

本地数据快照；
导出本地 JSON；
清除本机数据。
4. 建议数据结构

建议使用数组结构：

interface StoredCommuteResult {
  id: string;
  listingId: string;
  anchorId?: string;
  anchorName: string;
  mode: "transit" | "walking" | "cycling" | "driving";
  provider: "amap" | "mock";
  isMock: boolean;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
  calculatedAt: string;
}

说明：

listingId：对应候选房源；
anchorId：对应工作/学习地点，如果已有稳定 id；
anchorName：便于用户理解；
mode：通勤方式；
durationMinutes：参考通勤分钟数；
distanceMeters：路线距离；
summary：人话摘要；
calculatedAt：计算时间，便于后续判断是否需要刷新。
5. 不建议保存的字段

禁止保存：

高德完整路线 JSON
完整请求 URL
完整 polyline
完整公交站点列表
完整换乘详情
完整步行导航步骤
完整骑行导航步骤
完整驾车导航步骤
AMAP_API_KEY

谨慎保存：

origin 经纬度
destination 经纬度
精确工作地点
精确家庭地址
完整通勤轨迹

当前阶段建议不保存起终点经纬度。

如后续必须保存，也应仅保存在本地，并在 Settings 数据说明里提示。

6. 多锚点结果模型

一套房源可能对应多个通勤锚点：

房源 A → 我的公司
房源 A → 伴侣公司
房源 A → 学校

每个锚点又可能对应多个通勤方式：

transit
walking
cycling
driving

因此同一套房源可能形成多条结果：

[
  {
    listingId: "listing-001",
    anchorName: "我的公司",
    mode: "transit",
    durationMinutes: 32,
    distanceMeters: 9800
  },
  {
    listingId: "listing-001",
    anchorName: "我的公司",
    mode: "cycling",
    durationMinutes: 41,
    distanceMeters: 11200
  },
  {
    listingId: "listing-001",
    anchorName: "伴侣公司",
    mode: "transit",
    durationMinutes: 47,
    distanceMeters: 14138
  }
]
7. 默认展示策略

后续页面接入时，不应一开始展示所有 mode 造成信息过载。

建议默认展示：

每个锚点的 primary mode

如果用户尚未设置偏好，则默认：

transit

用户可以展开查看：

步行
骑行
驾车

后续 Settings 可增加默认通勤方式设置，但当前暂不改 WorkLocation 数据模型。

8. L2 使用边界

L2 参考评分后续可以读取通勤摘要，但不能读取高德原始路线数据。

允许 L2 使用：

durationMinutes
distanceMeters
mode
anchorName

L2 不应简单平均所有 mode。

推荐策略：

1. 优先使用用户首选通勤方式；
2. 如果未设置，则使用 transit；
3. 多锚点时可计算最长通勤、平均通勤、主要锚点通勤压力；
4. 所有评分仍然只是参考评分，不代表最终推荐。
9. L3 AI 使用边界

L3 AI 后续只能读取脱敏摘要。

可以传给 AI：

到「我的公司」公共交通约 32 分钟
到「伴侣公司」公共交通约 47 分钟
到「学校」骑行约 41 分钟

不得传给 AI：

完整经纬度
完整路线轨迹
完整高德响应
完整家庭住址
完整工作地址
10. Settings 接入要求

一旦真正新增 housefolio:commute-results，必须同步更新：

src/lib/privacy/local-data.ts

Settings 页面必须继续支持：

查看本地数据快照；
导出本地 JSON；
清除本机数据；
说明当前保存的是通勤摘要，不是完整高德路线数据。
11. 建议实施拆分

后续建议继续小步推进：

Phase 2D-13：commute result type + local-store
Phase 2D-14：privacy local-data 纳入 commute-results
Phase 2D-15：local-store unit/smoke check
Phase 2D-16：Settings 本地数据快照验证
Phase 2D-17：页面接入前评审

暂不直接做：

页面展示
自动批量计算
L2 评分接入
AI 分析接入
地图可视化
12. 当前结论

Phase 2D-12 只是通勤结果本地存储规划。

下一步如果继续，应进入：

Phase 2D-13：commute result type + local-store

该阶段才会新增真实代码：

src/types/commute-result.ts
src/lib/local-store/commute-results.ts
