# HouseFolio LBS Provider Boundary｜Phase 2C

## 1. 目的

本文档用于约束 HouseFolio 后续 L1 LBS 能力的接入方式。

当前已经完成 LBS provider 基础封装：

- `src/lib/lbs/provider.ts`
- `src/lib/lbs/mock-provider.ts`
- `src/lib/lbs/amap-provider.ts`
- `src/lib/lbs/registry.ts`
- `src/lib/lbs/service.ts`
- `src/lib/config/lbs.ts`

当前仍未接入高德真实 API。

## 2. 产品边界

HouseFolio 的 L1 LBS 层只做空间决策辅助，不做最终推荐，不替用户决定选择哪套房。

LBS 输入应使用：

```text
工作/学习地点（通勤锚点）

而不是单一“工作地点”。

典型锚点包括：

我的公司
伴侣公司
学校
孩子学校
实习单位
其他高频目的地

MVP 阶段优先支持 1–3 个通勤锚点。

3. 地址精度原则

优先支持模糊地址，不强制精确门牌。

推荐粒度：

商圈
地铁站
写字楼附近
学校附近
小区附近
街道级位置

谨慎处理：

具体门牌号
精确家庭住址
精确工作地点
完整通勤轨迹
4. Provider 封装原则

页面和 UI 组件不得直接调用高德 SDK 或高德 REST API。

禁止：

fetch("https://restapi.amap.com/...")
axios.get("https://restapi.amap.com/...")

推荐统一调用：

geocodeAddress(input)
calculateCommute(input)
searchNearbyPoi(input)

统一入口只能来自：

src/lib/lbs
5. Key 管理原则

高德 key 不得暴露到前端。

禁止默认使用：

NEXT_PUBLIC_AMAP_API_KEY

当前占位变量：

AMAP_API_KEY=
LBS_PROVIDER=

真实高德请求后续应通过服务端 provider 或 API route 发起。

6. 数据缓存边界

允许缓存计算结果：

通勤分钟数
距离米数
交通方式
生活圈评分
POI 分类计数
provider 名称
计算时间

禁止缓存：

高德返回的完整 POI JSON
完整路线轨迹
地图瓦片
可复用 POI 数据库
第三方地图原始数据库
用户共享地理标注数据库

核心原则：

只缓存决策所需摘要，不缓存第三方地图原始数据。
7. AI 调用边界

L1 LBS 输出可以作为 L3 AI 输入，但必须是脱敏后的结构化摘要。

可以传给 AI：

到锚点 A 地铁约 32 分钟
到锚点 B 骑行约 18 分钟
500m 内生活配套较丰富
生活圈参考评分 8.1

不应传给 AI：

完整家庭住址
完整工作地址
门牌号
完整经纬度轨迹
完整路线详情
高德原始返回 JSON
8. Phase 2C 当前允许范围

当前 Phase 2C 只允许做：

LBS 配置读取
provider registry
amap provider skeleton
边界文档
类型定义
mock contract check

当前暂不做：

真实高德 API 请求
真实地理编码
真实通勤计算
真实 POI 搜索
地图视图
前端地图 SDK
页面接入
9. 高德接入前检查清单

正式写真实高德请求前，必须确认：

 是否仍通过 lib/lbs 调用
 页面是否没有直接调用高德 SDK / REST API
 key 是否没有进入前端
 是否没有使用 NEXT_PUBLIC_AMAP_API_KEY
 是否只缓存计算结果
 是否不缓存完整 POI JSON
 是否不缓存完整路线轨迹
 是否不缓存地图瓦片
 是否不做公开地图标注系统
 是否不做外部区域价格热力图
 是否保留 mock provider 作为降级方案
 高德调用失败时是否不影响基础 Portfolio 使用
 是否继续使用“工作/学习地点（通勤锚点）”，而不是“单一工作地点”
10. 结论

HouseFolio 的 LBS 层必须始终是空间决策辅助层，不是地图数据平台。

正确边界是：

用户主动提供模糊位置
→ HouseFolio 通过封装层调用合法 LBS provider
→ 只保存通勤、距离、POI 数量、生活圈评分等摘要结果
→ L2 用这些结果做参考评分与排序
→ L3 用脱敏摘要做人话解释

不要把 HouseFolio 做成：

地图服务商
POI 数据库
房源聚合地图
公开标注平台
区域价格热力图平台