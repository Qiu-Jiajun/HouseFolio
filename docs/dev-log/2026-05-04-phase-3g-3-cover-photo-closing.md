# Phase 3G-3｜Portfolio 首图阶段收口日志

## 1. 阶段定位

本阶段是 Phase 3G-3：Portfolio 首图阶段收口日志。

Phase 3G 的目标是在不破坏 HouseFolio v2.0 本地优先边界的前提下，为 Portfolio 卡片增加用户本机看房照片的只读首图展示能力。

本阶段只记录 Phase 3G 的完整收口状态，不再修改功能代码。

---

## 2. 当前已完成节点

Phase 3G 已完成以下步骤：

- Phase 3G-0：Portfolio 首图前置评审；
- Phase 3G-1：Portfolio 首图实现计划；
- Phase 3G-2A：实现前代码边界检查；
- Phase 3G-2B：Minimal cover photo read-only implementation；
- Phase 3G-2C：浏览器手动回归验证；
- Phase 3G-2D：实现收口检查；
- Phase 3G-3：本收口日志。

当前最新功能实现 commit：

- d758e53 feat: show local cover photo on listing cards

当前最新回归日志 commit：

- abacd80 docs: log portfolio cover photo regression

---

## 3. 本阶段新增能力

Portfolio 卡片现在可以展示当前房源的本机首图。

具体能力：

- 如果某套房源在 Detail 页添加过本机看房照片，Portfolio 卡片会展示该房源的首图；
- 如果没有照片，卡片保持无图状态；
- 首图只作为视觉识别辅助；
- 首图不参与评分、排序、筛选、AI、地图、JSON 导入导出或云同步；
- 删除照片后，Portfolio 首图会消失；
- Settings 清除全部本机照片后，Portfolio 首图会消失；
- 房源、笔记、评分、状态、通勤锚点、通勤结果不会被误删。

---

## 4. 文件变化

### 4.1 新增文件

- `src/components/listing-card-cover-photo.tsx`

职责：

- 作为独立 client component；
- 接收 `listingId` 和 `title`；
- 通过 `lib/storage/photos.ts` facade 读取本机照片；
- 优先读取 thumbnail blob；
- 没有 thumbnail 时回退读取原图 blob；
- 创建 object URL；
- 在 cleanup 中释放 object URL；
- 无照片或读取失败时返回 `null`。

### 4.2 修改文件

- `src/components/listing-card.tsx`

修改内容：

- 只新增 `ListingCardCoverPhoto` 引用；
- 只在卡片顶部轻接入首图组件；
- 未改变卡片原有租金、通勤、参考评分、状态、详情入口等决策字段；
- 未直接访问 IndexedDB；
- 未直接访问 localStorage；
- 未绑定云存储；
- 未改变 L1 / L2 / L3 逻辑。

---

## 5. 架构边界复核

当前实现符合以下边界：

- `ListingCard` 不直接访问 IndexedDB；
- `ListingCard` 不直接访问 localStorage；
- `ListingCard` 不直接访问 storage provider；
- `ListingCardCoverPhoto` 通过 `lib/storage/photos.ts` facade 读取照片；
- IndexedDB 访问仍被限制在 `src/lib/storage/local-photo-provider.ts`；
- JSON 导入仍只处理结构化 localStorage 数据；
- 图片 Blob 未进入 localStorage；
- object URL 未写入 listing 数据；
- object URL 未写入 localStorage；
- 没有新增 ZIP；
- 没有新增 AI；
- 没有新增地图；
- 没有新增 Supabase；
- 没有新增云同步；
- 没有新增 `/compare`；
- 没有改变 L2 Reference Score。

---

## 6. 手动回归结果

Phase 3G-2C 已完成浏览器手动回归，结果通过。

已验证：

- 无照片时 `/portfolio` 正常；
- 无照片房源卡片正常显示；
- 添加照片后对应 Portfolio 卡片显示首图；
- 卡片租金、通勤、参考评分、状态、详情按钮正常；
- 刷新 `/portfolio` 后首图仍显示；
- 刷新详情页后照片仍显示；
- 删除单张照片后 Portfolio 首图消失或回到无图状态；
- Settings 清除全部本机照片后 Portfolio 首图消失；
- 清除照片不误删房源、笔记、评分、状态、通勤锚点、通勤结果；
- 未出现 ZIP、AI 图片分析、云同步、公开分享入口；
- 未提示 JSON 可以恢复照片。

---

## 7. 收口检查结果

Phase 3G-2D 已完成收口检查，结果通过。

已确认：

- `git status` clean；
- `npm.cmd run build` 通过；
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

## 8. 产品边界判断

Portfolio 首图当前仍然是：

> 用户本机看房照片的只读缩略展示，用于帮助用户识别自己 portfolio 中的房源。

它不是：

- 房源图册；
- 云端相册；
- 公共展示页；
- 第三方平台图片搬运；
- 真房源佐证；
- AI 看图分析入口；
- ZIP 备份入口；
- 云同步入口。

当前实现继续符合 HouseFolio v2.0 的本地优先路线。

---

## 9. 当前未完成内容

Phase 3G 没有完成，也不应声称完成：

- ZIP 照片导出；
- ZIP 照片导入；
- 云端照片同步；
- AI 图片分析；
- 图片排序；
- 手动设置封面；
- Portfolio 批量 cover map 优化；
- Demo Mode 图片；
- `/compare` 首图；
- 公开分享图册；
- 第三方房源图片抓取；
- 图片 OCR；
- EXIF 深度处理。

这些能力如果后续要做，必须重新立项、重新评审、重新限定边界。

---

## 10. 当前风险与后续建议

### 10.1 当前风险

当前实现的主要风险很低，主要集中在：

- 列表中卡片较多时，每张卡片单独读取本机照片可能存在轻微性能压力；
- object URL 生命周期需要持续保持当前 cleanup 逻辑；
- 如果未来引入云端照片或 ZIP 备份，必须避免与当前只读首图边界混淆。

### 10.2 后续不建议立刻做

Phase 3G 后不建议立刻继续扩张照片能力，例如：

- 手动设封面；
- 照片排序；
- ZIP 备份；
- AI 看图；
- 云同步；
- 公开分享。

原因：

- Phase 3D / 3E / 3G 已经把本地优先基础层推进较多；
- 继续堆照片能力容易让 HouseFolio 偏离 L1 / L2 / L3 三层决策引擎主线；
- 下一步更适合做阶段总回归或写 handoff，而不是继续加功能。

---

## 11. Phase 3G 结论

Phase 3G 结论：

> Portfolio 首图能力已经以最小、可回滚、边界清晰的方式完成。它强化了用户本地 portfolio 的视觉识别能力，但没有改变 HouseFolio 的本地优先定位，也没有把照片能力扩张为云相册、公开图册、AI 图片分析或第三方图片搬运。

建议下一步：

- Phase 3G-4：Phase 3G handoff 文档；
- 或者进行 Phase 3D–3G 总回归；
- 暂不继续扩张照片能力。