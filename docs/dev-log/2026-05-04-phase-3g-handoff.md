# HouseFolio 接续文档｜2026-05-04｜Phase 3G 收尾

## 0. 新对话里的 AI 请先读这段

我们继续 HouseFolio 项目。

当前项目已经以《HouseFolio 项目规划文档 v2.0》为上位规划文档。HouseFolio 当前定位是：

- 本地优先的私人找房决策工具；
- 用户主动添加候选房源；
- 本机保存看房照片；
- 本机导出 / 导入结构化数据；
- L1 / L2 / L3 三层决策引擎仍然是核心；
- 不抓取、不聚合、不公开、不撮合、不认证；
- 不默认云同步；
- 不把照片做成云相册或公共房源图册。

当前最新已完成到：

Phase 3G：Portfolio 首图最小只读展示闭环。

当前最后已确认 commit：

391f2c3 docs: close portfolio cover photo phase

当前已确认状态：

- npm.cmd run build 通过；
- git status clean；
- Portfolio 首图功能已完成最小实现；
- Portfolio 首图浏览器手动回归通过；
- Portfolio 首图收口检查通过；
- ListingCard 只轻接入首图组件；
- ListingCardCoverPhoto 只通过 lib/storage/photos.ts facade 读取本机照片；
- 页面和组件没有直接访问 IndexedDB；
- 没有新增 ZIP、AI、地图、Supabase、云同步、/compare 或 JSON 照片导入。

新对话第一步不要直接写新功能，应先执行启动检查，再决定是否进入下一阶段。

---

## 1. 当前最高优先级

继续保持：

- 基础闭环稳定；
- 架构边界清晰；
- 合规边界明确；
- 后续迁移友好；
- v2.0 本地优先路线清晰；
- 每次只做一件事；
- 每个阶段必须有目标、文件范围、验证标准和 commit。

不要直接跳到：

- AI / DeepSeek；
- 地图 UI；
- POI / 生活圈真实计算；
- Supabase；
- 部署；
- Chrome 插件；
- 复杂多锚点权重；
- 正式 Phase 4A comparison data model；
- /compare 路由；
- 多房源勾选；
- 横向对比表；
- ZIP 照片导出；
- ZIP 照片导入；
- 云端照片同步；
- AI 照片分析；
- 全站白色居家风重构；
- 继续扩张照片能力。

---

## 2. 当前最后完成节点

当前最后完成节点是：

Phase 3G-3：Portfolio 首图阶段收口日志

对应文件：

- docs/dev-log/2026-05-04-phase-3g-3-cover-photo-closing.md

对应 commit：

- 391f2c3 docs: close portfolio cover photo phase

这说明：

- Phase 3D：本地照片持久化闭环已完成；
- Phase 3E：结构化 JSON 导入闭环已完成；
- Phase 3F：阶段总回归与 handoff 已完成；
- Phase 3G：Portfolio 首图最小只读展示闭环已完成。

---

## 3. Phase 3G 完成内容总览

Phase 3G 完整推进顺序如下：

### Phase 3G-0：Portfolio 首图前置评审

新增文件：

- docs/architecture/phase-3g-portfolio-cover-photo-review.md

对应 commit：

- d32e881 docs: review portfolio cover photo boundary

结论：

Portfolio 首图可以作为后续小步增强，但不能作为普通 UI polish 直接实现。它必须被定义为“用户本机照片的只读缩略展示”，只用于帮助用户识别自己 portfolio 中的房源，不参与评分、排序、AI、云同步或公开展示。

---

### Phase 3G-1：Portfolio 首图实现计划

新增文件：

- docs/architecture/phase-3g-cover-photo-implementation-plan.md

对应 commit：

- 83c70ef docs: plan portfolio cover photo implementation

结论：

后续最小实现应优先新增独立子组件 `ListingCardCoverPhoto`，让 `ListingCard` 只负责轻接入展示，不直接读取 IndexedDB 或 storage provider。

---

### Phase 3G-2A：实现前代码边界检查

检查结果：

- `src/lib/storage/photos.ts` 已有 `getListingCoverPhoto`；
- `src/lib/storage/photos.ts` 已有 `getListingPhotoBlob`；
- `src/lib/storage/photos.ts` 已有 `getListingPhotoThumbnailBlob`；
- `src/lib/storage/provider.ts` 已有 `getCoverPhoto`；
- `src/lib/storage/provider.ts` 已有 `getPhotoBlob`；
- `src/lib/storage/provider.ts` 已有 `getThumbnailBlob`；
- `src/components/listing-card.tsx` 当前是轻展示卡片；
- 不需要先改 storage facade；
- 可以走最小实现路径。

---

### Phase 3G-2B：Minimal cover photo read-only implementation

新增文件：

- src/components/listing-card-cover-photo.tsx

修改文件：

- src/components/listing-card.tsx

对应 commit：

- d758e53 feat: show local cover photo on listing cards

完成能力：

- Portfolio 卡片可以展示当前 listing 的本机首图；
- 没有照片时返回无图状态；
- 读取失败时静默回退；
- 优先读取 thumbnail blob；
- 没有 thumbnail 时回退读取原图 blob；
- 使用 object URL 展示；
- cleanup 中释放 object URL；
- `ListingCard` 只轻接入子组件；
- 不直接访问 IndexedDB；
- 不直接访问 localStorage；
- 不接 ZIP、AI、地图、Supabase、云同步或 /compare。

---

### Phase 3G-2C：浏览器手动回归验证

新增文件：

- docs/dev-log/2026-05-04-phase-3g-2c-cover-photo-regression.md

对应 commit：

- abacd80 docs: log portfolio cover photo regression

手动回归通过：

- 无照片时 `/portfolio` 正常；
- 无照片卡片正常显示；
- Detail 添加照片后 Portfolio 卡片显示首图；
- 卡片租金、通勤、参考评分、状态、详情按钮正常；
- 刷新 `/portfolio` 后首图仍显示；
- 刷新详情页后照片仍显示；
- 删除单张照片后 Portfolio 首图消失或回到无图状态；
- Settings 清除全部本机照片后 Portfolio 首图消失；
- 清除照片不误删房源、笔记、评分、状态、通勤锚点、通勤结果；
- 未出现 ZIP、AI 图片分析、云同步、公开分享入口；
- 未提示 JSON 可以恢复照片。

---

### Phase 3G-2D：实现收口检查

检查通过：

- git status clean；
- npm.cmd run build 通过；
- Phase 3G 评审文档存在；
- Phase 3G 实现计划文档存在；
- Phase 3G 回归日志存在；
- `src/components/listing-card-cover-photo.tsx` 存在；
- `src/components/listing-card.tsx` 存在；
- 关键源码文件 NUL 字节为 0；
- `ListingCardCoverPhoto` 含 `"use client"`；
- `ListingCardCoverPhoto` 调用 `getListingCoverPhoto`；
- `ListingCardCoverPhoto` 调用 `getListingPhotoThumbnailBlob`；
- `ListingCardCoverPhoto` 具备 `getListingPhotoBlob` fallback；
- `ListingCardCoverPhoto` 创建 object URL；
- `ListingCardCoverPhoto` 释放 object URL；
- `ListingCard` 引入 `ListingCardCoverPhoto`；
- `ListingCard` 传入 `listingId={listing.id}`；
- `ListingCard` 传入 `title={listing.title}`。

特别说明：

- `src/lib/storage/local-photo-provider.ts` 中出现 `indexedDB` 是正常的，因为 IndexedDB 只能存在于 provider 内部；
- `src/lib/privacy/local-data-import.ts` 中出现 `localStorage` 是正常的，因为 Phase 3E 的 JSON 导入本来就是结构化 localStorage 数据导入；
- 这两处不构成边界破坏。

---

### Phase 3G-3：Portfolio 首图阶段收口日志

新增文件：

- docs/dev-log/2026-05-04-phase-3g-3-cover-photo-closing.md

对应 commit：

- 391f2c3 docs: close portfolio cover photo phase

结论：

Portfolio 首图能力已经以最小、可回滚、边界清晰的方式完成。它强化了用户本地 portfolio 的视觉识别能力，但没有改变 HouseFolio 的本地优先定位，也没有把照片能力扩张为云相册、公开图册、AI 图片分析或第三方图片搬运。

---

## 4. 当前关键文件

### 4.1 Portfolio 首图功能文件

- src/components/listing-card-cover-photo.tsx
- src/components/listing-card.tsx

### 4.2 照片 storage facade / provider

- src/lib/storage/photos.ts
- src/lib/storage/provider.ts
- src/lib/storage/local-photo-provider.ts
- src/lib/storage/index.ts
- src/types/listing-photo.ts

### 4.3 Detail 照片功能

- src/components/listing-photo-panel.tsx
- src/components/listing-detail-view.tsx

### 4.4 Settings 照片数据权利

- src/components/settings-photo-data-panel.tsx
- src/app/settings/page.tsx
- src/content/zh-cn.ts

### 4.5 JSON 导入边界

- src/lib/privacy/local-data.ts
- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts
- src/components/settings-local-data-panel.tsx

### 4.6 Phase 3G 文档

- docs/architecture/phase-3g-portfolio-cover-photo-review.md
- docs/architecture/phase-3g-cover-photo-implementation-plan.md
- docs/dev-log/2026-05-04-phase-3g-2c-cover-photo-regression.md
- docs/dev-log/2026-05-04-phase-3g-3-cover-photo-closing.md
- docs/dev-log/2026-05-04-phase-3g-handoff.md

---

## 5. 当前实现边界

Portfolio 首图当前是：

- 用户本机照片的只读缩略展示；
- 用于帮助用户识别自己 portfolio 中的房源；
- 通过 `lib/storage/photos.ts` facade 读取；
- 不直接读取 IndexedDB；
- 不写 localStorage；
- 不把 Blob 或 object URL 写入 listing；
- 不把照片放进 JSON 导入 / 导出；
- 不进入 L1；
- 不进入 L2；
- 不进入 L3；
- 不进入 AI；
- 不进入云同步；
- 不进入公开分享。

Portfolio 首图当前不是：

- 房源图册；
- 云端相册；
- 公共展示页；
- 第三方平台图片搬运；
- 真房源佐证；
- AI 看图分析入口；
- ZIP 备份入口；
- 云同步入口；
- Demo Mode 图片系统。

---

## 6. 当前未完成内容

不要误认为 Phase 3G 已经完成以下内容：

- ZIP 照片导出；
- ZIP 照片导入；
- 云端照片同步；
- AI 图片分析；
- 图片排序；
- 手动设置封面；
- Portfolio 批量 cover map 优化；
- Demo Mode 图片；
- /compare 首图；
- 公开分享图册；
- 第三方房源图片抓取；
- 图片 OCR；
- EXIF 深度处理。

这些能力如果后续要做，必须重新立项、重新评审、重新限定边界。

---

## 7. 当前阶段风险判断

当前风险较低。

主要注意点：

- 列表中房源数量增多时，每张卡片独立读取本机照片可能有轻微性能压力；
- 暂不需要提前做 cover map 或缓存层；
- object URL 生命周期必须继续保持 cleanup 逻辑；
- 如果后续引入 ZIP 或云端照片，不能与当前只读首图边界混淆；
- 不要继续把 Phase 3 的剩余时间都堆到照片能力上，否则会偏离 L1 / L2 / L3 主线。

---

## 8. 下一步建议

当前建议不要继续扩张照片功能。

更稳的下一步是：

### 选项 A：Phase 3G-5 / Phase 3D–3G 总回归

目标：

- 对 Phase 3D 本地照片；
- Phase 3E JSON 导入；
- Phase 3F 总回归；
- Phase 3G Portfolio 首图；
- 做一次统一稳定性检查。

适合当前马上执行。

### 选项 B：Phase 3H：本地优先数据权利阶段总收口

目标：

- 把 Phase 3D / 3E / 3G 作为一个“本地优先基础层强化”整体收口；
- 形成进入下一阶段前的稳定 handoff。

适合在总回归之后执行。

### 暂不建议

暂不建议直接进入：

- ZIP 备份包；
- 图片排序；
- 手动封面；
- AI 图片分析；
- 云同步；
- /compare；
- Phase 4A comparison data model；
- 地图 UI；
- POI / 生活圈真实计算。

---

## 9. 新对话启动检查建议

新对话如果继续 HouseFolio，应先执行：

1. `git status`
2. `npm.cmd run build`
3. `git log -12 --oneline`
4. 检查 Phase 3G 文档存在：
   - `docs/architecture/phase-3g-portfolio-cover-photo-review.md`
   - `docs/architecture/phase-3g-cover-photo-implementation-plan.md`
   - `docs/dev-log/2026-05-04-phase-3g-2c-cover-photo-regression.md`
   - `docs/dev-log/2026-05-04-phase-3g-3-cover-photo-closing.md`
   - `docs/dev-log/2026-05-04-phase-3g-handoff.md`
5. 检查关键代码文件：
   - `src/components/listing-card-cover-photo.tsx`
   - `src/components/listing-card.tsx`
   - `src/lib/storage/photos.ts`
   - `src/lib/storage/local-photo-provider.ts`
   - `src/lib/privacy/local-data-import.ts`
6. 确认 build 通过且 git clean 后，再进入下一阶段。

---

## 10. Phase 3G handoff 结论

Phase 3G 已经完成：

> Portfolio 首图最小只读展示闭环。

它完成了本地优先基础层的一个轻量体验增强，但没有扩张 HouseFolio 的产品边界，也没有破坏照片、本地数据、JSON 导入、L1 / L2 / L3、AI、地图或云同步边界。

下一步最稳妥路线：

> 先做 Phase 3D–3G 总回归，再做 Phase 3H 本地优先数据权利阶段总收口。不要继续扩张照片功能。