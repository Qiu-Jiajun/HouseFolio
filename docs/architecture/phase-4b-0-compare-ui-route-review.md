# Phase 4B-0：Compare UI route review

## 0. 阶段定位

Phase 4B-0 是 Compare UI route review，也就是正式进入 Compare UI 前的路由与入口评审阶段。

本阶段只写架构评审文档，不实现 UI，不新增路由，不修改功能代码。

本阶段新增文件：

- docs/architecture/phase-4b-0-compare-ui-route-review.md

本阶段不新增：

- src/app/compare
- src/app/compare/page.tsx
- src/components/compare-*.tsx
- Portfolio 多房源勾选
- 横向对比表 UI
- selection localStorage
- AI 对比解释
- 地图 UI
- Supabase / DeepSeek / 高德新调用

## 1. 上一阶段状态

Phase 4A 已完成 L2 comparison model layer。

当前已经具备：

- ComparisonModel 领域类型
- comparison 纯函数 selector / builder
- comparison contract check
- model layer checkpoint
- 明确的敏感字段禁止边界
- 明确的 L2 / L3 分工边界

但当前尚未完成：

- /compare 路由
- compare 页面
- Portfolio 多房源勾选
- URL query selection
- selection 持久化
- 横向对比表 UI
- Compare UI 空状态
- Compare UI 入口
- L3 AI 对比解释

因此 Phase 4B-0 的核心问题不是“马上做页面”，而是先判断 Compare UI 应该以什么方式进入当前产品闭环。

## 2. 为什么需要先做 route review

Compare UI 会引入新的用户路径：

- 用户从哪里进入比较？
- 是否需要独立 /compare 页面？
- 用户如何选择 2-4 套房源？
- selection 如何传递？
- 页面刷新后是否保留 selection？
- AppNav 是否需要新增入口？
- Detail 页是否需要进入或返回 compare？
- Settings 是否需要新增 selection 数据权利说明？

这些问题如果不先评审，容易导致功能孤岛或过早引入持久化状态。

HouseFolio 的页面入口原则仍然是：任何新增页面或功能都必须能被用户找到、能返回、能解释，不制造孤岛。

## 3. 是否现在新增 /compare

### 3.1 可选方案

方案 A：新增独立 /compare 路由

优点：

- 路由语义清晰；
- 方便未来从 Portfolio、Detail、Demo 等多个入口跳转；
- 符合“多房源横向比较”作为 L2 核心界面的长期定位；
- 便于后续 URL query 承载 selection。

风险：

- 如果没有 Portfolio 入口，会成为功能孤岛；
- 如果直接加入 AppNav，用户可能在没有选择房源时进入空页面；
- 如果页面过早实现，容易绕过 Phase 4A model layer 的纯函数边界；
- 如果 selection 持久化，会增加 Settings 数据权利维护负担。

方案 B：先在 Portfolio 内做 comparison section

优点：

- 用户路径短；
- 不新增路由；
- 不会出现空的 /compare 页面；
- 比较动作和选择动作都在 Portfolio 内完成。

风险：

- Portfolio 页面会变重；
- 横向对比表可能挤压列表主任务；
- 未来 L3 对比解释、URL 分享、返回路径会变复杂；
- 可能把 Portfolio 从“候选房源管理”变成“所有 L2 能力堆叠页”。

方案 C：Phase 4B 暂不新增 UI，只继续强化 selector / adapter

优点：

- 最稳；
- 不引入用户路径复杂度；
- 不新增路由；
- 不改 UI。

风险：

- MVP 展示价值推进较慢；
- Phase 4A 已经完成 model layer，如果继续停在模型层，难以体现 L2 comparison 的产品价值。

### 3.2 当前判断

Phase 4B-0 的判断是：

- 可以把 /compare 作为 Phase 4B 后续的候选实现方向；
- 但 Phase 4B-0 本身不新增 /compare；
- 第一版 Compare UI 更适合走“Portfolio 选择 → /compare?ids=...”的路径；
- /compare 不应直接放进 AppNav 作为孤立入口；
- AppNav 可暂不新增 Compare 入口；
- Compare 的主要入口应来自 Portfolio 的“比较已选房源”。

结论：

Phase 4B-0 不实现 /compare。后续如进入 Phase 4B-1，可以考虑新增 /compare，但必须同时实现 Portfolio 入口和空状态，不能只建空路由。

## 4. Compare 入口设计评审

### 4.1 推荐入口

第一版推荐入口：

Portfolio 列表页
→ 用户勾选 2-4 套房源
→ 点击“比较已选房源”
→ 跳转到 /compare?ids=listing-001,listing-002,listing-003

理由：

- 用户比较行为天然发生在 Portfolio；
- selection 是一次性决策动作，不必长期保存；
- URL query 可表达当前比较对象；
- 刷新后可恢复当前 compare 页面；
- 不需要新增 localStorage key；
- 不增加 Settings 导出 / 导入 / 清除维护成本。

### 4.2 不推荐入口

第一版不建议：

- 首页直接进入 /compare；
- AppNav 直接放“Compare”；
- Detail 页直接加入“加入比较”复杂状态；
- Settings 管理 comparison selection；
- localStorage 保存最近比较选择；
- sessionStorage 保存 selection。

原因：

- compare 是基于候选房源的二级动作，不是一级导航；
- 没有选中房源时进入 compare 容易形成空壳页面；
- selection 不属于长期用户数据；
- 持久化 selection 会增加数据权利和回归成本。

## 5. selection 传递方式

### 5.1 可选方案

方案 A：URL query

示例：

/compare?ids=listing-001,listing-002,listing-003

优点：

- 简单；
- 可刷新；
- 不新增 localStorage；
- 可直接从 Portfolio 跳转；
- 后续可支持从 Detail 或 Demo 生成链接。

风险：

- URL 会暴露 listingId；
- 需要处理非法 id、重复 id、不足 2 个 id、超过 4 个 id；
- 如果 listingId 未来含敏感信息，需要先改 id 生成策略。

当前项目 listingId 不应包含地址、手机号、门牌号等敏感信息，因此第一版可接受 URL query。

方案 B：内存态

优点：

- URL 干净；
- 不暴露 id；
- 实现上适合纯前端状态。

风险：

- 刷新丢失；
- 直接访问 /compare 无法恢复；
- 从 Portfolio 到 Compare 的跨路由传递更麻烦。

方案 C：localStorage

优点：

- 刷新和关闭页面后可恢复；
- 可保存最近一次比较。

风险：

- 新增 HouseFolio 本地数据类型；
- 需要加入 src/lib/privacy/local-data.ts；
- 需要 Settings 查看 / 导出 / 导入 / 清除覆盖；
- 会把临时选择动作变成长期本地数据；
- 当前阶段不必要。

### 5.2 当前判断

第一版 selection 应优先使用 URL query，不进入 localStorage。

约束：

- 只允许 2-4 个 listingId；
- 去重；
- 忽略不存在的 listingId；
- 不足 2 套时显示空状态；
- 超过 4 套时提示回 Portfolio 重新选择；
- 不把 selection 写入 localStorage；
- 不新增 housefolio:compare-selection；
- 不修改 Settings 数据权利范围。

## 6. Compare UI 数据来源

Compare UI 不应直接从页面里拼业务逻辑。

推荐数据链路：

Portfolio local-store / lookup
→ 得到运行时 Listing[]
→ buildComparisonModels 或既有 comparison builder
→ Compare UI 只渲染 ComparisonModel[]

页面职责：

- 读取 URL query 中的 ids；
- 获取本地 listings；
- 过滤选中的 listings；
- 调用 lib/algorithm/comparison.ts 中的纯函数；
- 渲染 ComparisonModel[]。

页面不应做：

- 重新评分；
- 重新排序；
- 重新计算通勤；
- 读取高德；
- 读取 AI；
- 读取 IndexedDB 照片 Blob；
- 拼接完整笔记原文；
- 写入 localStorage；
- 写入 selection；
- 读取完整地址门牌号。

## 7. Compare UI 是否展示照片

当前 ComparisonModel 已允许 hasPhotos 与 photoCount，但不允许照片 Blob、object URL 或 IndexedDB 内部 key 进入模型。

第一版 Compare UI 建议：

- 不展示照片本体；
- 不读取本机首图；
- 只展示“有本机照片”或照片数量；
- 如需展示封面，必须后续单独做阶段评审；
- 封面读取必须通过 lib/storage，不得让 ComparisonModel 携带 Blob / object URL。

理由：

- Compare 是 L2 算法对比界面，不是房源图册；
- 读取照片会引入 IndexedDB 异步加载、object URL 生命周期、性能和隐私边界；
- Phase 4B 第一版应先让结构化对比跑通，而不是扩张媒体展示。

## 8. Compare UI 是否接 L3

Phase 4B 不接 L3。

允许未来在 Phase 4C 或后续阶段评审：

- 基于脱敏 ComparisonModel 摘要生成 trade-off 总结；
- 基于 riskFlags 解释风险信号；
- 基于 missingFields 生成补充信息 checklist；
- 基于 strengths / weaknesses 生成条件化建议。

Phase 4B 禁止：

- AI 打分；
- AI 排序；
- AI 判断最佳房源；
- AI 读取完整笔记原文；
- AI 读取照片或视频；
- AI 读取完整地址；
- AI 输出“系统推荐”或“最佳房源”。

## 9. Compare UI 是否需要 AppNav 入口

第一版不建议把 Compare 放进 AppNav。

原因：

- Compare 依赖 selection；
- 用户没有选房源时进入 Compare 没有明确任务；
- AppNav 应保持首页、Portfolio、Settings、Demo 等稳定入口；
- Compare 更适合作为 Portfolio 的任务流下游，而不是全局主导航。

后续如果 Compare 成为长期核心页面，可以再评审是否在 AppNav 增加“对比”入口。但即使加入，也必须有清晰空状态：

- 说明需要先去 Portfolio 选择 2-4 套房源；
- 提供返回 Portfolio 的按钮；
- 不制造死路。

## 10. Compare UI 空状态要求

如果后续新增 /compare，必须处理：

### 10.1 无 ids

显示：

- 当前还没有选择要比较的房源；
- 请先回 Portfolio 选择 2-4 套候选房源；
- 按钮：返回 Portfolio。

### 10.2 ids 不足 2 个

显示：

- 至少需要选择 2 套房源才能进行横向比较；
- 当前只找到 X 套有效房源；
- 按钮：返回 Portfolio 重新选择。

### 10.3 ids 超过 4 个

显示：

- 第一版最多支持比较 4 套房源；
- 请减少选择数量；
- 按钮：返回 Portfolio 重新选择。

### 10.4 ids 不存在或已删除

显示：

- 部分房源可能已被删除或不在当前本机数据中；
- 仅显示有效房源；
- 有效房源不足 2 套时返回空状态。

## 11. Compare UI 字段分区

第一版横向对比表建议按层分区：

### 11.1 基础信息

- 标题
- 月租
- 面积
- 户型
- 区域 / areaLabel
- 状态
- 来源平台
- 来源 URL 是否存在

### 11.2 L1 空间信息

- 通勤时间
- 通勤来源：默认参考值 / 本地通勤结果
- 通勤摘要数量
- 生活圈参考分

第一版不展示：

- 经纬度
- 完整地址
- 高德原始路线
- 站点列表
- polyline
- POI 原始数据

### 11.3 L2 参考比较

- 参考评分
- 评分拆解
- strengths
- weaknesses
- neutralFacts
- missingFields
- riskFlags

必须使用：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐

禁止使用：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

### 11.4 用户资料摘要

第一版只展示：

- 是否有笔记
- 是否有本机照片
- 照片数量
- subjectiveSummary 的结构化摘要

不展示：

- 完整笔记原文
- 照片 Blob
- 视频 Blob
- 房东 / 中介联系方式
- 门牌号
- 合同条款原文

## 12. Portfolio 是否需要改

Phase 4B-0 不改 Portfolio。

但为后续 Phase 4B-1 预留评审结论：

Portfolio 可能需要新增：

- 卡片 checkbox；
- 已选数量提示；
- “比较已选房源”按钮；
- 不足 2 套时按钮禁用；
- 超过 4 套时阻止选择或提示；
- 清空选择按钮。

第一版不建议：

- 把 selection 写入 localStorage；
- 把 selection 同步到 Settings；
- 在卡片里加入复杂 comparison 预览；
- 改变 ListingCard 的核心信息结构；
- 改变 Reference Score 的计算方式。

## 13. 路由与入口结论

Phase 4B-0 的结论：

1. Compare UI 是 Phase 4B 的合理主线，因为 Phase 4A 已完成模型层；
2. Phase 4B-0 不实现 /compare，只做路由与入口评审；
3. 后续第一版可以考虑 /compare?ids=...；
4. Compare 的主入口应来自 Portfolio 的 2-4 套房源选择；
5. 第一版 selection 不进入 localStorage；
6. 第一版不在 AppNav 放 Compare；
7. 第一版不展示照片本体，只展示 hasPhotos / photoCount；
8. Phase 4B 不接 L3；
9. Compare UI 必须基于 ComparisonModel，不绕过 lib/algorithm；
10. Compare UI 必须继续保持“辅助比较，不代表最终推荐”的产品定位。

## 14. 建议后续拆分

后续可以拆为：

- Phase 4B-1：Compare route minimal scaffold review / implementation plan
- Phase 4B-2：Portfolio selection UI plan
- Phase 4B-3：/compare minimal page implementation
- Phase 4B-4：Compare UI empty states
- Phase 4B-5：Compare table first pass
- Phase 4B-6：Compare UI regression / boundary check

但进入任何实现阶段前，仍需重新确认：

- git status clean
- npm.cmd run build 通过
- 不新增 selection localStorage
- 不接 AI
- 不读照片 Blob
- 不新增高德调用
- 不引入 Supabase
- 不破坏 ComparisonModel 边界

## 15. 本阶段验证标准

Phase 4B-0 完成标准：

- docs/architecture/phase-4b-0-compare-ui-route-review.md 已创建；
- npm.cmd run build 通过；
- git status 只显示该文档变更，或提交后 clean；
- src/app/compare 不存在；
- src/app/compare/page.tsx 不存在；
- 未修改 src 下功能代码；
- 未新增组件；
- 未新增 localStorage key；
- 未接 AI / 高德 / Supabase；
- 未把 Compare 写成推荐系统。

## 16. Commit 建议

建议 commit：

docs: review compare ui route

本阶段 commit 后，下一步不要直接进入 UI 实现，先检查是否需要补一份 Phase 4B-0 dev log 或直接进入 Phase 4B-1 implementation plan。