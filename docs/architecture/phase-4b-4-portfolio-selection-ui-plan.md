# Phase 4B-4：Portfolio selection UI plan

## 0. 阶段定位

Phase 4B-4 是 Portfolio selection UI 的实现前计划阶段。

本阶段只写计划文档，不改 Portfolio 代码，不新增 checkbox，不修改 ListingCard，不新增 localStorage key。

本阶段新增文件：

- docs/architecture/phase-4b-4-portfolio-selection-ui-plan.md

本阶段不修改：

- src/app/portfolio/page.tsx
- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/app/compare/page.tsx
- src/content/zh-cn.ts
- src/lib/local-store/*
- src/lib/privacy/local-data.ts
- src/lib/algorithm/comparison.ts
- src/types/comparison.ts

## 1. 前置状态

当前已经完成：

- Phase 4B-0：Compare UI route review
- Phase 4B-1：Compare route minimal scaffold plan
- Phase 4B-2：Compare route scaffold implementation
- Phase 4B-3：Compare route scaffold regression / boundary check

当前已有：

- /compare route scaffold
- URL ids 解析
- ids 数量校验
- 返回 Portfolio 入口
- 不读取真实 listings
- 不接 AI / 高德 / Supabase
- 不新增 selection localStorage

当前尚未完成：

- Portfolio 多房源勾选
- 比较已选房源按钮
- selection 临时状态
- 从 Portfolio 跳转到 /compare?ids=...
- Compare 读取真实 listing 数据
- Compare 渲染 ComparisonModel
- 横向对比表 UI

Phase 4B-4 的目标是先评审 Portfolio selection 应该如何最小接入，而不是直接实现。

## 2. 为什么 Portfolio selection 必须单独评审

Portfolio selection 会改变用户主路径：

首页
→ Portfolio
→ 选择 2–4 套候选房源
→ 点击比较
→ /compare?ids=...

这比单纯新增 /compare route 更敏感，因为它会影响：

- ListingCard 的点击区域
- 卡片 hover 与详情入口
- 移动端交互
- 选择数量限制
- 空状态和按钮禁用
- URL query 生成
- 是否新增状态
- 是否需要中文文案
- 是否会引入本地持久化

因此不应和 /compare scaffold 混在同一个阶段实现。

## 3. selection 的产品定位

Portfolio selection 是一次临时比较动作。

它不是：

- 长期收藏
- 用户偏好
- 房源状态
- 本地数据资产
- 可导出的用户资料
- Settings 需要管理的数据类型

因此第一版不应进入 localStorage。

禁止新增：

- housefolio:compare-selection
- housefolio:selected-listings
- housefolio:comparison-state
- housefolio:last-compare

第一版 selection 只应存在于 Portfolio 页面组件运行时状态中，并在点击按钮后编码到 URL query。

## 4. 推荐用户路径

第一版推荐路径：

1. 用户进入 Portfolio；
2. 每张 ListingCard 出现轻量选择控件；
3. 用户选择 2–4 套房源；
4. 页面显示已选数量；
5. 未满 2 套时，“比较已选房源”按钮禁用；
6. 满 2–4 套时，按钮可点击；
7. 点击后跳转到 /compare?ids=id1,id2,id3；
8. Compare scaffold 显示已收到 X 套待比较房源；
9. 后续阶段再接入真实 ComparisonModel。

## 5. 选择数量规则

第一版规则：

- 最少 2 套；
- 最多 4 套；
- 0 套：按钮禁用，提示需要选择 2–4 套；
- 1 套：按钮禁用，提示至少还需 1 套；
- 2–4 套：按钮可用；
- 超过 4 套：不允许继续选择，或显示轻提示。

推荐实现：

- 当已选数量达到 4 套时，其他未选卡片的 checkbox 禁用；
- 已选卡片仍可取消；
- 不弹复杂 modal；
- 不写入持久化；
- 不影响原有筛选 / 排序结果。

## 6. UI 位置评审

### 6.1 checkbox 放在 ListingCard 内部

优点：

- 用户直观看到每套房是否被选中；
- 选择动作贴近房源卡片；
- 后续可做卡片边框高亮。

风险：

- 需要修改 ListingCard props；
- 可能影响“查看详情”点击路径；
- 卡片组件会承担更多状态展示责任；
- 需要避免 checkbox 点击冒泡导致进入详情。

适用条件：

- ListingCard 当前结构清晰；
- props 扩展可控；
- 能明确区分“选择”和“查看详情”。

### 6.2 checkbox 放在 Portfolio list 外层包裹

优点：

- 尽量不改 ListingCard；
- selection UI 可由 PortfolioList 管理；
- 对现有卡片结构侵入更小。

风险：

- 外层布局可能不如卡片内部自然；
- 需要处理视觉对齐；
- 选择状态和卡片高亮可能分离。

适用条件：

- 想最小影响 ListingCard；
- Phase 4B 第一版只追求功能闭环，不追求精细视觉。

### 6.3 推荐方案

第一版优先选择：

- PortfolioList 管理 selection state；
- ListingCard 接收最小 props：selectable / selected / disabled / onToggleSelect；
- 选择控件可放在卡片内部右上角或标题区附近；
- 不改变 ListingCard 的核心信息结构；
- 不改变“查看详情”入口；
- 不改变 L2 Reference Score 展示。

如果实现时发现 ListingCard 结构不适合直接改，则采用外层 wrapper 方案。

## 7. 状态管理方案

第一版使用 React 本地状态：

- selectedListingIds: string[]
- toggleSelection(listingId)
- clearSelection()
- canCompare = selectedListingIds.length >= 2 && selectedListingIds.length <= 4

不使用：

- localStorage
- sessionStorage
- URL state in Portfolio
- Zustand / Redux / global store
- server state
- cookies

原因：

- selection 是临时动作；
- 不需要跨页面保存；
- 点击比较后 URL query 已经表达选择结果；
- 引入全局状态会过度工程化。

## 8. 跳转策略

点击“比较已选房源”后：

- 对 selectedListingIds 去重；
- 保持当前选择顺序；
- 生成逗号分隔 ids；
- router.push("/compare?ids=...") 或 Link href；
- 不传完整 listing 数据；
- 不传 JSON；
- 不传标题、地址、笔记、照片信息；
- 不传评分结果；
- 只传 listingId。

示例：

/compare?ids=listing-001,listing-002,listing-003

后续 /compare 页面再根据 ids 读取本地 listings。

但该读取真实 listings 的工作不属于 Phase 4B-4，也不属于第一版 selection plan。

## 9. 文案需求

后续实现需要新增中文文案，建议放入 src/content/zh-cn.ts。

建议文案项：

- 选择用于比较
- 已选择 X / 4 套
- 至少选择 2 套房源进行比较
- 最多选择 4 套房源
- 比较已选房源
- 清空选择
- 已达到第一版最多比较数量
- 横向比较仅用于辅助比较，不代表最终推荐

文案不得写成：

- 系统推荐
- 推荐分
- 最佳房源
- 最优选择
- 替你决定

## 10. 是否改变 AppNav

不改变。

Compare 仍然不进入 AppNav。

原因：

- Compare 的主入口应来自 Portfolio selection；
- 用户没有 selection 时直接进入 Compare 容易成为空页面；
- 当前 AppNav 不应加入半成品功能入口；
- 如果后续 Compare 成为稳定一级功能，再单独评审。

## 11. 是否改变 Settings

不改变。

原因：

- selection 不进入 localStorage；
- 不新增本地数据类型；
- 不需要导出 / 导入 / 清除；
- 不需要写入 src/lib/privacy/local-data.ts。

如果未来要保存比较记录，必须另设阶段评审，并同步 Settings 数据权利。

## 12. 是否读取照片

不读取。

Portfolio 卡片当前如已有本机首图能力，不在本阶段改动。

selection UI 只负责选择 listingId，不触碰：

- IndexedDB
- photo Blob
- object URL
- getListingCoverPhoto
- lib/storage

Compare 后续是否展示照片，也不在本阶段处理。

## 13. 是否接入 AI / 高德 / Supabase

不接入。

Portfolio selection 不需要：

- AI
- DeepSeek
- 高德
- LBS
- Supabase
- fetch
- axios
- server action
- API route

它只是前端临时选择状态和 URL query 跳转。

## 14. 文件范围建议

后续 Phase 4B-5 如进入最小实现，建议先检查现有文件结构，再决定实际范围。

可能涉及：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/content/zh-cn.ts

不应涉及：

- src/app/compare/page.tsx，除非只调整接收说明
- src/lib/algorithm/comparison.ts
- src/types/comparison.ts
- src/lib/local-store/*
- src/lib/privacy/local-data.ts
- src/lib/storage/*
- src/lib/lbs/*
- src/lib/ai/*

## 15. 实现拆分建议

建议后续拆成：

### Phase 4B-5：Portfolio selection minimal implementation

目标：

- Portfolio 页面可选择 2–4 套房源；
- 显示已选数量；
- 可清空选择；
- 未满 2 套按钮禁用；
- 超过 4 套不能继续选择；
- 点击后跳转 /compare?ids=...；
- 不新增 localStorage key；
- 不读取 AI / 高德 / Supabase。

### Phase 4B-6：Portfolio selection regression

验证：

- 0 套选择；
- 1 套选择；
- 2 套选择；
- 4 套选择；
- 第 5 套选择被阻止；
- 清空选择；
- 点击比较跳转 URL 正确；
- build 通过；
- git status clean；
- selection 未进入 localStorage；
- Settings 无需新增数据项。

### Phase 4B-7：Compare reads selected listing plan

只评审 /compare 如何根据 ids 读取本地 listings，并调用 ComparisonModel builder。

不直接实现。

## 16. 验证标准

Phase 4B-4 完成标准：

- docs/architecture/phase-4b-4-portfolio-selection-ui-plan.md 已创建；
- npm.cmd run build 通过；
- git status 只显示该文档变更，或提交后 clean；
- 未修改 Portfolio 代码；
- 未修改 ListingCard；
- 未修改 /compare/page.tsx；
- 未修改 zh-cn.ts；
- 未新增 localStorage key；
- 未修改 Settings；
- 未接 AI / 高德 / Supabase；
- 未读取照片 Blob；
- 未把 Compare 写成推荐系统。

## 17. Commit 建议

建议 commit：

docs: plan portfolio compare selection

本阶段完成后，再决定是否进入 Phase 4B-5 最小实现。