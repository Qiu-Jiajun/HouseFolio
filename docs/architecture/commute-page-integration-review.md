# Commute Page Integration Review｜Phase 2D-18

## 1. 目的

本文档用于评审 HouseFolio 后续如何把真实通勤计算接入页面。

当前状态：

- geocodeAddress 已完成真实高德接入；
- calculateCommute 已支持：
  - transit
  - walking
  - cycling
  - driving
- multi-mode commute smoke test 已通过；
- commute-results 本地存储模型已完成；
- Settings 本地数据快照、导出、清除已覆盖 `housefolio:commute-results`；
- 页面尚未接入真实通勤计算。

Phase 2D-18 只做评审，不写页面功能代码。

---

## 2. 页面接入的核心问题

真实通勤计算一旦接入页面，就会同时涉及：

```text
用户点击
→ 读取房源位置
→ 读取通勤锚点
→ 调用高德 API
→ 得到通勤摘要
→ 写入 localStorage
→ 页面展示
→ Settings 导出 / 清除覆盖

因此不能直接在页面组件里写高德调用逻辑。

页面只能调用 HouseFolio 自己封装的服务函数。

3. 推荐接入原则
原则一：先手动触发，不自动批量计算

初期不要一进入详情页就自动计算所有通勤方式。

推荐方式：

用户进入房源详情页
→ L1 通勤区域显示“尚未计算”
→ 用户点击“计算参考通勤”
→ 系统计算 selected listing × selected anchors × selected modes

原因：

避免高德 API 调用失控；
避免用户只是浏览详情页就触发位置计算；
更符合“用户主动触发”的隐私与成本边界；
便于失败时提示。
原则二：默认只计算 primary mode

当前未设计通勤偏好 UI，因此默认先计算：

transit

即公共交通。

后续再支持用户展开计算：

walking
cycling
driving

不要一开始默认四种 mode 全部计算。

原则三：先接 Detail 页面，不接 Portfolio 批量页

优先接入：

/portfolio/[id]

暂不接入：

/portfolio

原因：

详情页只处理一套房源，调用范围可控；
Portfolio 页面可能涉及多套房 × 多锚点 × 多模式，容易 API 爆炸；
详情页更适合解释“参考通勤时间”。
原则四：不在页面直接调用高德

禁止：

fetch("https://restapi.amap.com/...")

禁止：

process.env.AMAP_API_KEY

页面只能调用未来封装函数，例如：

calculateAndStoreCommuteResults(...)

该函数应放在：

src/lib/lbs

或：

src/lib/local-store

不得写在页面组件里。

4. 建议新增的中间服务层

建议下一阶段先新增：

src/lib/lbs/commute-workflow.ts

职责：

读取 listing coordinate
读取 work locations
调用 calculateCommute
转换为 SaveCommuteResultInput
写入 commute-results localStorage
返回 StoredCommuteResult[]

页面只调用 workflow，不关心高德、不关心 localStorage 细节。

5. 必须确认的输入条件

接入页面前，需要确认每套房源是否有可用于通勤计算的坐标。

当前问题：

用户添加的 listing 可能只有 addressHint，没有 latitude / longitude

因此页面接入有两个选择：

方案 A：先要求 listing 已有坐标

优点：

最简单；
不把 geocode 和 commute 混在一起；
可控。

缺点：

当前很多 listing 可能没有坐标。
方案 B：点击计算时先 geocode listing 和 anchors

优点：

用户体验更完整；
不需要提前保存坐标。

缺点：

一次点击会触发更多 API；
需要处理 geocode 失败；
需要谨慎决定是否保存坐标。
当前建议

Phase 2D-19 先采用：

方案 B，但只保存 commute summary，不保存起终点经纬度。

也就是说：

addressHint / anchor addressHint
→ 临时 geocode
→ 临时 calculateCommute
→ 保存 duration / distance / summary
→ 丢弃临时坐标
6. 通勤锚点选择策略

Settings 里已支持多个工作/学习地点（通勤锚点）。

页面接入时应：

读取 housefolio:work-locations

如果没有锚点，则显示：

请先到 Settings 添加工作/学习地点（通勤锚点）

不要默认编造锚点。

7. 通勤 mode 策略

初始版本建议：

只计算 transit

按钮文案：

计算公共交通参考通勤

后续扩展：

展开更多通勤方式
- 步行
- 骑行
- 驾车

不要一开始展示所有 mode，避免信息过载。

8. UI 展示建议

Detail 页 L1 区域可分三种状态：

未计算
尚未计算参考通勤
按钮：计算公共交通参考通勤
已计算
到「我的公司」公共交通约 32 分钟，路线距离约 9.8 公里
到「学校」公共交通约 45 分钟，路线距离约 14.2 公里
失败
通勤数据暂不可用，请稍后重试或检查地址是否过于模糊。

免责声明：

通勤结果基于高德路径规划计算，仅作辅助比较；实际通勤受等车、换乘、拥堵、天气等因素影响。
9. localStorage 写入边界

页面接入后只允许写入：

housefolio:commute-results

允许字段：

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

不得写入：

完整高德响应
完整请求 URL
完整路线 polyline
完整公交站点
完整换乘详情
完整导航步骤
AMAP_API_KEY
10. 失败处理

某一个锚点计算失败，不应导致所有锚点失败。

例如：

我的公司成功
伴侣公司失败
学校成功

页面应显示成功项，并对失败项显示：

该通勤锚点暂不可用

不得静默编造时间。

11. 成本与调用控制

初期建议：

点击触发；
不自动刷新；
已有结果时优先展示本地缓存；
提供“重新计算”按钮；
不做后台批量计算；
不做 Portfolio 列表批量计算。
12. 推荐实施拆分

下一步不要直接写 Detail 页面。

建议拆成：

Phase 2D-19：commute calculation workflow
Phase 2D-20：workflow contract check
Phase 2D-21：Detail L1 panel UI skeleton
Phase 2D-22：Detail 手动计算 transit
Phase 2D-23：Settings / export / clear 回归
13. 当前结论

Phase 2D-18 的结论是：

先接 Detail 页面
先手动触发
先只算 transit
先使用 workflow 封装
先保存摘要结果
暂不接 Portfolio 批量计算
暂不接 L2 / L3 / 地图

下一步应进入：

Phase 2D-19：commute calculation workflow

新增文件建议：

src/lib/lbs/commute-workflow.ts
