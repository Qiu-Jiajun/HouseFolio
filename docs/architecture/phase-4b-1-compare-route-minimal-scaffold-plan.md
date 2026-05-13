# Phase 4B-1：Compare route minimal scaffold plan

## 0. 阶段定位

Phase 4B-1 是 Compare route minimal scaffold 的实现前计划阶段。

本阶段只写计划文档，不创建路由，不写页面，不改功能代码。

本阶段新增文件：

- docs/architecture/phase-4b-1-compare-route-minimal-scaffold-plan.md

本阶段不新增：

- src/app/compare
- src/app/compare/page.tsx
- src/components/compare-*.tsx
- Portfolio checkbox
- Compare table UI
- selection localStorage
- AI 对比解释
- 高德新调用
- Supabase / DeepSeek 接入

## 1. 前置状态

上一阶段 Phase 4B-0 已完成 Compare UI route review。

当前确认：

- Phase 4A model layer 已完成；
- Phase 4B-0 文档已提交；
- 当前仍没有 /compare 路由；
- 当前仍没有 Compare UI；
- 当前仍没有 Portfolio 多房源勾选；
- 当前 selection 不进入 localStorage；
- 当前 Compare 主线仍属于 L2，而不是 L3。

Phase 4B-1 的目的不是立即实现 Compare 页面，而是把后续最小 route scaffold 的边界、文件范围、验证标准和回滚方式写清楚。

## 2. 为什么需要 minimal scaffold

Compare UI 后续一定会涉及新的页面路径。

如果直接写完整横向对比表，风险较高：

- 容易一次改动过多文件；
- 容易把 route、selection、table、文案、空状态混在一起；
- 容易绕过 Phase 4A 已建立的 ComparisonModel 边界；
- 容易提前接入照片、AI 或 localStorage selection；
- 容易制造功能孤岛。

因此第一步只应做 minimal scaffold。

minimal scaffold 的定义是：

- 只建立 /compare 路由页面骨架；
- 只读取 URL query 中的 ids；
- 只做基础空状态；
- 不做完整横向表；
- 不做 Portfolio 选择入口；
- 不写 selection 持久化；
- 不读照片 Blob；
- 不接 AI；
- 不接高德；
- 不改 L2 算法。

## 3. 后续实现的建议文件范围

如果后续进入 Phase 4B-2 或 Phase 4B-3 实现，建议最小文件范围为：

- src/app/compare/page.tsx
- src/content/zh-cn.ts

可选文件：

- src/components/compare-empty-state.tsx

但第一版更建议先不新增组件，避免文件扩张。

不建议修改：

- src/components/listing-card.tsx
- src/components/portfolio-list.tsx
- src/lib/algorithm/comparison.ts
- src/types/comparison.ts
- src/lib/privacy/local-data.ts
- src/lib/local-store/*
- src/lib/storage/*
- src/lib/lbs/*
- src/lib/ai/*

除非后续阶段有独立评审。

## 4. /compare 页面第一版职责

后续 minimal /compare 页面只承担四个职责：

1. 从 URL search params 读取 ids；
2. 对 ids 做基础解析和校验；
3. 根据 ids 数量显示空状态或占位说明；
4. 提供返回 Portfolio 的入口。

第一版不承担：

- 不读取 localStorage；
- 不筛选真实 listings；
- 不调用 buildComparisonModels；
- 不展示横向对比表；
- 不展示真实 ComparisonModel；
- 不展示照片；
- 不展示笔记；
- 不展示 AI 分析；
- 不写入任何状态。

也就是说，第一版 /compare 是 route scaffold，不是完整 Compare UI。

## 5. URL query 规则

建议使用：

/compare?ids=listing-001,listing-002,listing-003

解析规则：

- ids 为空：显示“尚未选择房源”；
- ids 少于 2 个：显示“至少选择 2 套房源”；
- ids 超过 4 个：显示“第一版最多比较 4 套房源”；
- ids 有重复：去重后再判断；
- ids 只作为临时 route state，不持久化。

第一版不校验 listing 是否真实存在。

真实 listing 校验应留到后续阶段，因为那需要读取本地 listings，并接入 comparison builder。

## 6. 空状态设计

### 6.1 无 ids

文案方向：

- 当前还没有选择要比较的房源；
- 请先回 Portfolio 选择 2-4 套候选房源；
- 按钮：返回 Portfolio。

### 6.2 ids 不足 2 个

文案方向：

- 至少需要选择 2 套房源才能进行横向比较；
- 当前有效选择不足；
- 按钮：返回 Portfolio 重新选择。

### 6.3 ids 超过 4 个

文案方向：

- 第一版最多支持比较 4 套房源；
- 请减少选择数量；
- 按钮：返回 Portfolio 重新选择。

### 6.4 ids 数量合法

第一版仍只显示占位说明：

- 已收到 X 套待比较房源；
- 下一阶段将接入 ComparisonModel 渲染；
- 当前页面尚未读取真实本地房源数据；
- 按钮：返回 Portfolio。

这样做可以把 route scaffold 与真实数据渲染分开，降低风险。

## 7. 是否接入 AppNav

Phase 4B-1 不建议接入 AppNav。

原因：

- Compare 依赖 selection；
- 当前还没有 Portfolio 勾选入口；
- 直接加入 AppNav 会让用户进入一个空页面；
- AppNav 应保持稳定入口，不为半成品 route 增加导航。

后续如要加入 AppNav，应另设阶段评审。

## 8. 是否接入 Portfolio

Phase 4B-1 不接入 Portfolio。

Portfolio selection 应单独做 Phase 4B-2 评审或计划。

原因：

- Portfolio checkbox 会改动真实用户操作路径；
- 需要考虑 2-4 套选择限制；
- 需要考虑按钮禁用、清空选择、移动端布局；
- 需要考虑卡片交互是否与“查看详情”冲突；
- 不应和 route scaffold 混在同一个阶段。

## 9. 是否新增 localStorage key

不新增。

禁止新增：

- housefolio:compare-selection
- housefolio:selected-listings
- housefolio:comparison-state
- housefolio:last-compare

理由：

- selection 是临时决策动作；
- URL query 足够表达第一版状态；
- 新增 localStorage key 会增加 Settings 导出 / 导入 / 清除维护范围；
- 当前没有必要增加数据权利负担。

## 10. 是否读取照片

不读取。

即使 ComparisonModel 有 hasPhotos 与 photoCount，Phase 4B-1 route scaffold 不读取照片。

禁止：

- 读取 IndexedDB；
- 调用 getListingCoverPhoto；
- 生成 object URL；
- 把 Blob 放入 ComparisonModel；
- 在 Compare scaffold 中展示真实照片。

照片展示如果未来需要，必须单独评审。

## 11. 是否接入 AI

不接入。

Phase 4B-1 属于 L2 UI route scaffold，不属于 L3。

禁止：

- DeepSeek 调用；
- prompt 生成；
- AI 对比建议；
- AI 排序；
- AI 打分；
- “最佳房源”措辞。

未来 L3 只能基于脱敏后的 ComparisonModel 摘要做人话解释。

## 12. 文案放置原则

如果后续实现 /compare 页面，用户可见中文文案应优先进入：

- src/content/zh-cn.ts

页面从 zhCN 读取文案，避免大量中文散落在 TSX 文件中。

但 Phase 4B-1 当前只写计划文档，不改 zh-cn.ts。

## 13. 后续实现建议

建议后续拆分为：

### Phase 4B-2：Compare route scaffold implementation

目标：

- 新增 src/app/compare/page.tsx；
- 只解析 URL ids；
- 只显示空状态 / 占位状态；
- 不读取真实 listings；
- 不接 Portfolio；
- 不新增 localStorage key。

### Phase 4B-3：Compare route scaffold regression

目标：

- 验证 /compare 无 ids；
- 验证 /compare?ids=listing-001；
- 验证 /compare?ids=listing-001,listing-002；
- 验证超过 4 个 ids；
- 验证 build；
- 验证未新增 localStorage key；
- 验证未接 AI / 高德 / Supabase。

### Phase 4B-4：Portfolio selection UI plan

目标：

- 只评审 Portfolio checkbox；
- 判断是否改 ListingCard；
- 判断是否引入 selection state；
- 判断按钮位置与移动端交互；
- 不直接实现。

### Phase 4B-5：Portfolio selection minimal implementation

目标：

- 在 Portfolio 内选择 2-4 套；
- 点击后跳转 /compare?ids=...；
- 不持久化 selection；
- 不改 L2 评分。

## 14. 验证标准

Phase 4B-1 完成标准：

- docs/architecture/phase-4b-1-compare-route-minimal-scaffold-plan.md 已创建；
- npm.cmd run build 通过；
- git status 只显示该文档变更，或提交后 clean；
- src/app/compare 不存在；
- src/app/compare/page.tsx 不存在；
- 未新增 src/components/compare-*.tsx；
- 未修改 src/content/zh-cn.ts；
- 未修改 src/lib/algorithm/comparison.ts；
- 未修改 src/types/comparison.ts；
- 未新增 localStorage key；
- 未接 AI / 高德 / Supabase；
- 未读取照片 Blob；
- 未把 Compare 写成推荐系统。

## 15. Commit 建议

建议 commit：

docs: plan compare route scaffold

本阶段完成后，再决定是否进入真正的 Phase 4B-2 route scaffold implementation。