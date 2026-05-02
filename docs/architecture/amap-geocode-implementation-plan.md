# Amap Geocode Implementation Plan｜Phase 2C-6

## 1. 目的

本文档用于约束 HouseFolio 后续接入高德地理编码的最小实现路径。

当前状态：

- LBS provider interface 已完成；
- mock provider 已完成；
- amap provider skeleton 已完成；
- provider registry 已完成；
- runtime config 已完成；
- request / response contract types 已完成；
- 当前仍未接入高德真实 API。

下一步如果接入真实高德，只允许先实现：

```text
geocodeAddress

暂不实现：

calculateCommute
searchNearbyPoi
地图视图
前端地图 SDK
页面接入
2. 接入原则

高德地理编码只能作为 L1 LBS 的底层能力，不应直接暴露给页面和组件。

页面只能调用：

geocodeAddress(input)

不得直接调用：

fetch("https://restapi.amap.com/...")

不得直接读取：

process.env.AMAP_API_KEY
3. Key 管理

真实 key 只允许放在：

.env.local

变量名：

AMAP_API_KEY=
LBS_PROVIDER=amap

禁止：

NEXT_PUBLIC_AMAP_API_KEY

原因：当前阶段不做前端地图 SDK，地理编码请求应优先在服务端 provider 内完成，避免把 key 暴露到浏览器。

4. 最小实现范围

Phase 2C-7 只允许实现：

src/lib/lbs/amap-provider.ts

中的：

geocodeAddress(input)

输入：

addressHint
city
precision

输出必须适配为：

GeocodeAddressResult

不得把高德原始响应直接传给页面、localStorage、AI 或 L2 算法。

5. 原始响应处理原则

高德原始响应只允许在 adapter 内部短暂存在。

处理流程：

高德原始响应
→ adapter 提取 formattedAddress / coordinate / confidence / precision
→ 转换为 GeocodeAddressResult
→ 丢弃原始响应

禁止保存：

完整高德 geocode JSON
完整请求 URL
完整响应体
可复用地理数据库

允许保存或传递：

formattedAddress
latitude
longitude
precision
confidence
provider
isMock
6. 错误与降级

真实 geocode 失败时，不应影响 HouseFolio 基础闭环。

允许策略：

1. 返回明确错误，让 UI 后续提示用户手动确认地址；
2. 或在开发阶段回落 mock provider；
3. 不允许静默编造真实经纬度。

错误信息不得包含：

AMAP_API_KEY
完整请求 URL
高德完整响应体
用户精确地址
7. 合规边界

地理编码输入应优先使用模糊地址：

望京 SOHO 附近
五道口地铁站附近
国贸附近
某某学校附近
小区附近

谨慎处理：

精确门牌号
完整家庭住址
完整工作地址

工作/学习地点（通勤锚点）属于位置相关敏感信息，后续不得默认入云，不得直接传给 AI。

8. Phase 2C-7 开始前检查清单

真正写高德 geocode 代码前，必须确认：

 npm.cmd run build 当前通过；
 git status clean；
 .env.local 不进入 Git；
 .env.example 只有空 key 占位；
 不使用 NEXT_PUBLIC_AMAP_API_KEY；
 页面不直接调用高德；
 只改 src/lib/lbs/amap-provider.ts 或必要的 config；
 只实现 geocodeAddress；
 不实现通勤、POI、地图；
 不缓存高德原始响应；
 失败时不编造真实地理信息。
9. 当前结论

Phase 2C-6 只是计划文档，不是高德真实接入。

下一步如果继续，应进入：

Phase 2C-7：Amap geocode provider minimal implementation

但那一步开始需要真实 AMAP_API_KEY，并必须更谨慎处理 .env.local、服务端调用、错误降级和原始响应丢弃。