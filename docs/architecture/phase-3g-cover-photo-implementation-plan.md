# Phase 3G-1｜Portfolio 首图实现计划

## 1. 阶段定位

本阶段是 Phase 3G-1：Portfolio 首图实现计划。

本阶段只写实现计划，不写功能代码，不修改 `src/components/listing-card.tsx`，不新增首图组件，不读取 IndexedDB，不改 storage provider，不接 ZIP，不接 AI，不接地图，不接 Supabase，不接 `/compare`，不接云同步。

当前前置阶段已经完成：

- Phase 3G-0：Portfolio 首图前置评审；
- 对应文档：`docs/architecture/phase-3g-portfolio-cover-photo-review.md`；
- 对应 commit：`d32e881 docs: review portfolio cover photo boundary`。

Phase 3G-0 的结论是：

> Portfolio 首图可以作为后续小步增强，但必须被定义为“用户本机照片的只读缩略展示”，只用于帮助用户识别自己 portfolio 中的房源，不参与评分、排序、AI、云同步或公开展示。

本阶段的目标是在不写代码的前提下，把后续 Phase 3G-2 的最小实现边界、文件范围、组件职责、验证标准和回滚方式提前确定清楚。

---

## 2. 实现目标

后续 Phase 3G-2 的目标应非常小：

> 在 Portfolio 房源卡片中展示该房源本机保存的封面照片或首张照片缩略图；没有照片时保持现有无图卡片样式或轻量占位，不影响当前 Portfolio 功能。

该能力只属于：

- 基础层；
- 本地优先数据展示；
- 用户私有 portfolio 识别辅助。

它不属于：

- L1 LBS；
- L2 算法；
- L3 AI；
- 地图；
- 云同步；
- 公开展示；
- 房源真实性判断。

---

## 3. 后续实现必须守住的产品边界

Portfolio 首图只允许展示：

- 用户主动在 Detail 页添加的本机照片；
- 当前浏览器 IndexedDB 中已经存在的照片；
- 当前 listing 对应的封面照片或首张照片；
- 只读缩略展示。

Portfolio 首图不得展示：

- 第三方平台房源图片；
- 自动抓取的 URL 图片；
- 网页 `og:image`；
- 用户未主动添加的图片；
- 云端图片；
- AI 生成图；
- Demo Mode 图片；
- 公开分享图片。

Portfolio 首图不得用于：

- Reference Score；
- 通勤排序；
- 价格排序；
- 筛选；
- 推荐；
- 异常检测；
- AI 分析；
- 房源真实性背书；
- ZIP 备份；
- 云同步；
- PR 公开房源图册。

---

## 4. 推荐组件职责

后续实现不建议让 `ListingCard` 直接读取 storage。

推荐新增一个极小客户端子组件：

- `src/components/listing-card-cover-photo.tsx`

推荐职责：

- 接收 `listingId`；
- 通过 `lib/storage` facade 读取该 listing 的 cover photo；
- 如果存在照片，读取 thumbnail blob 或 cover blob；
- 生成 object URL；
- 展示图片；
- 组件卸载或图片变化时释放 object URL；
- 没有照片时返回 `null` 或轻量 fallback；
- 读取失败时静默回退到无图状态，不打断 Portfolio 页面。

不推荐职责：

- 不直接访问 IndexedDB；
- 不直接打开 object store；
- 不改变照片数据；
- 不删除照片；
- 不上传照片；
- 不写 localStorage；
- 不处理 JSON 导入导出；
- 不改变 listing 数据模型；
- 不参与 L2 评分。

---

## 5. 推荐数据读取路径

后续推荐读取链路：

ListingCard
  -> ListingCardCoverPhoto
  -> lib/storage/photos.ts facade
  -> active photo storage provider
  -> local-photo-provider
  -> IndexedDB

禁止读取链路：

ListingCard
  -> indexedDB.open

ListingCard
  -> localStorage

PortfolioList
  -> indexedDB.open

page.tsx
  -> IndexedDB / OPFS / cloud storage SDK

核心原则：

> UI 组件可以调用 HouseFolio 自己的 `lib/storage` facade，但不得直接绑定底层存储实现。

---

## 6. 后续 Phase 3G-2 允许修改的文件范围

后续最小实现阶段建议只允许修改这些文件：

### 6.1 必须新增

- `src/components/listing-card-cover-photo.tsx`

用途：

- 隔离图片异步读取；
- 隔离 object URL 生命周期；
- 避免让 `ListingCard` 变得过重。

### 6.2 可修改

- `src/components/listing-card.tsx`

限制：

- 只允许接入 `ListingCardCoverPhoto`；
- 不允许直接访问 storage provider；
- 不允许直接访问 IndexedDB；
- 不允许改变评分、排序、状态、通勤来源展示逻辑；
- 不允许大改卡片布局。

### 6.3 仅在必要时修改

- `src/lib/storage/photos.ts`

限制：

- 只有当现有 facade 缺少 cover photo 读取能力时，才允许做最小补充；
- 补充函数应是只读函数；
- 不得修改 provider schema；
- 不得改变现有 Detail photo panel 行为；
- 不得改变 Settings photo summary / clear all 行为。

### 6.4 原则上不修改

- `src/lib/storage/local-photo-provider.ts`
- `src/lib/storage/provider.ts`
- `src/components/listing-photo-panel.tsx`
- `src/components/settings-photo-data-panel.tsx`
- `src/components/settings-local-data-panel.tsx`
- `src/lib/privacy/local-data.ts`
- `src/lib/privacy/local-data-import.ts`
- `src/lib/algorithm/*`
- `src/app/api/*`
- `src/app/portfolio/page.tsx`

除非 build 或类型检查表明必须做极小类型修正，否则不碰。

---

## 7. UI 方案

### 7.1 有照片时

Portfolio 卡片顶部或标题区附近展示一张低调首图。

建议视觉原则：

- 白底卡片中保持素雅；
- 图片不要抢过租金、通勤、参考评分等决策字段；
- 图片只作为识别线索；
- 图片区域不宜过高；
- 图片使用 `object-cover`；
- 图片容器应有圆角；
- 不叠加“房源图”“真房源”等误导文案。

### 7.2 无照片时

建议保持当前卡片样式，不强行插入大面积占位图。

可以接受：

- 返回 `null`，卡片保持原样；
- 或显示一个很轻的浅色占位区；
- 占位文案必须避免鼓励上传，建议使用“暂无本机照片”而不是“上传房源图片”。

当前更稳选择：

> 没有照片时返回 `null`，最大限度降低 UI 改动。

### 7.3 读取失败时

读取失败不应显示错误弹窗。

建议：

- `console.warn` 可选；
- UI 回退为无图状态；
- 不阻断 Portfolio；
- 不改变本地数据。

---

## 8. 性能与生命周期

后续实现必须注意：

- Portfolio 可能同时展示多个 ListingCard；
- 每个卡片如果都读取 IndexedDB，需要控制逻辑简洁；
- 首图组件应只在客户端运行；
- object URL 必须在 cleanup 中释放；
- 不应把 object URL 写入 listing 对象；
- 不应把 object URL 写入 localStorage；
- 不应把 blob/base64 传入父组件；
- 不应为了首图引入全局状态管理。

最小实现允许每张卡片独立读取自己的 cover photo。  
暂不做批量 cover map、缓存层或虚拟列表优化。

原因：

> 当前数据量小，Phase 3G-2 优先验证边界与体验，不提前引入复杂优化。

---

## 9. 与 JSON 导入的关系

Portfolio 首图实现后，必须继续维持 Phase 3E 边界：

- JSON 导入只恢复结构化 localStorage 数据；
- JSON 不包含照片 Blob；
- JSON 不包含缩略图；
- JSON 不包含 object URL；
- JSON 导入成功后，如果本机 IndexedDB 没有照片，Portfolio 不显示首图；
- 不得提示“JSON 已恢复照片”；
- 不得把照片塞入 localStorage 以配合 JSON 导入。

这意味着：

> 结构化数据恢复与照片恢复仍然是两条独立路线。Phase 3G 不解决照片迁移。

---

## 10. 与 Settings 清除照片的关系

后续实现后必须验证：

- Detail 添加照片后 Portfolio 显示首图；
- Settings 清除全部本机照片后 Portfolio 首图消失；
- 清除照片不影响房源、笔记、评分、状态、通勤锚点、通勤结果；
- Portfolio 卡片不能因为照片被清除而报错；
- 回到 Detail 后照片也应为空。

这能证明：

> Portfolio 首图只是本机照片的只读展示，不拥有独立数据副本。

---

## 11. 与 L1 / L2 / L3 的关系

Portfolio 首图不接入 L1。

- 不做地图；
- 不做通勤；
- 不做 POI；
- 不做空间关系。

Portfolio 首图不接入 L2。

- 不改变 Reference Score；
- 不改变排序；
- 不改变筛选；
- 不改变 comparison selector；
- 不改变异常检测；
- 不改变主观评分。

Portfolio 首图不接入 L3。

- 不进入 AI；
- 不做图片分析；
- 不做描述生成；
- 不做风险识别；
- 不做装修判断；
- 不做采光判断。

---

## 12. 后续 Phase 3G-2 验证标准

Phase 3G-2 如果执行，实现完成标准应包括：

### 12.1 build

- `npm.cmd run build` 通过。

### 12.2 基础页面

- `/portfolio` 正常打开；
- 没有照片时卡片正常显示；
- 有照片时卡片显示首图；
- 点击“查看详情”仍正常进入 Detail；
- `/settings` 正常打开；
- `/portfolio/new` 正常打开；
- `/portfolio/[id]` 正常打开。

### 12.3 照片行为

- Detail 添加照片后，回到 Portfolio 可显示首图；
- 刷新 Portfolio 后首图仍显示；
- Detail 删除单张照片后，Portfolio 首图更新或消失；
- Settings 清除全部照片后，Portfolio 首图消失；
- 无照片时没有错误弹窗；
- 读取失败时不阻断页面。

### 12.4 边界

- 没有新增 ZIP；
- 没有新增 AI；
- 没有新增地图；
- 没有新增 Supabase；
- 没有新增 `/compare`；
- 没有新增云同步；
- 没有改 JSON import/export；
- 没有改 L2 scoring；
- 没有改 commute-results；
- 没有让页面直接访问 IndexedDB。

---

## 13. 后续 Phase 3G-2 建议 commit

如果后续最小实现通过，建议 commit message：

`feat: show local cover photo on listing cards`

但如果实现过程中只新增子组件，且接入很轻，也可以使用：

`feat: add listing card cover photo`

---

## 14. 回滚方式

如果后续 Phase 3G-2 实现后出现问题，回滚应很简单：

- 删除 `src/components/listing-card-cover-photo.tsx`；
- 从 `src/components/listing-card.tsx` 移除该子组件引用；
- 如果 `src/lib/storage/photos.ts` 做过最小 facade 补充，确认是否被其他组件使用；
- 不应影响 Detail photo panel；
- 不应影响 Settings photo panel；
- 不应影响 JSON import；
- 不应影响 L1 / L2 / L3。

这也是本计划推荐新增独立子组件的原因：

> 让 Portfolio 首图成为可插拔的轻量展示层，而不是侵入现有卡片、照片存储或数据模型。

---

## 15. 本阶段结论

Phase 3G-1 的结论：

> 可以进入后续最小实现，但实现必须以新增 `ListingCardCoverPhoto` 子组件为优先路径，让 `ListingCard` 只负责接入展示，不直接读取 IndexedDB 或底层 provider。Portfolio 首图只展示用户本机保存的只读封面照片，不改变任何数据权利、AI、LBS、L2 或 JSON 导入边界。

建议下一阶段：

- Phase 3G-2：Minimal cover photo read-only implementation

但 Phase 3G-2 开始前，应先检查现有 `lib/storage/photos.ts` 是否已经暴露可复用的 cover photo facade，避免重复设计。

---

## 16. Phase 3G-1 验证标准

本阶段完成标准：

- 新增本文档；
- 不修改任何 `src` 功能代码；
- 不实现 Portfolio 首图；
- 不修改 `listing-card.tsx`；
- 不读取 IndexedDB；
- 不新增 ZIP / AI / 地图 / Supabase / `/compare` / 云同步；
- `npm.cmd run build` 通过；
- `git status` clean；
- 提交 commit。

建议 commit message：

`docs: plan portfolio cover photo implementation`