# Phase 3G-2C｜Portfolio 首图手动回归日志

## 1. 阶段定位

本阶段是 Phase 3G-2C：Portfolio 首图手动回归验证。

前置实现阶段：

- Phase 3G-0：Portfolio 首图前置评审
- Phase 3G-1：Portfolio 首图实现计划
- Phase 3G-2B：Minimal cover photo read-only implementation

当前实现 commit：

- d758e53 feat: show local cover photo on listing cards

本阶段只记录浏览器手动回归结果，不修改功能代码。

---

## 2. 本次验证目标

验证 Portfolio 首图能力是否满足以下边界：

- 只展示用户本机保存的看房照片；
- 只作为 Portfolio 卡片识别辅助；
- 不影响房源卡片原有信息；
- 不影响 Detail 本机照片功能；
- 不影响 Settings 照片数据权利功能；
- 不影响结构化 JSON 导入 / 导出；
- 不接 ZIP、AI、地图、Supabase、云同步或公开分享；
- 不改变 L1 / L2 / L3 边界。

---

## 3. 手动回归结果

### 3.1 无照片状态

验证结果：通过。

已确认：

- 打开 `/portfolio` 正常；
- 没有照片的房源卡片仍正常显示；
- 没有错误弹窗；
- 控制台无明显报错。

结论：

- Portfolio 首图组件在无照片状态下可以安全回退；
- 无照片不会破坏原有卡片结构。

---

### 3.2 添加照片后

验证结果：通过。

已确认：

- 进入任意房源详情页 `/portfolio/[id]` 正常；
- 在“看房照片｜本机保存”区域添加 JPG / PNG / WebP 照片正常；
- 返回或重新打开 `/portfolio` 后，对应房源卡片显示首图；
- 房源卡片中的租金、通勤、参考评分、状态、查看详情按钮仍正常。

结论：

- Detail 页本机照片可以被 Portfolio 卡片以只读方式展示；
- Portfolio 首图没有破坏卡片原有决策字段；
- 首图仍然只是识别辅助，不参与评分或排序。

---

### 3.3 刷新持久化

验证结果：通过。

已确认：

- 刷新 `/portfolio` 后首图仍显示；
- 刷新详情页后照片仍显示。

结论：

- Portfolio 首图可以读取 IndexedDB 中已经持久化的本机照片；
- 当前实现没有把图片塞进 localStorage；
- 当前实现符合 Phase 3D 的本地照片持久化边界。

---

### 3.4 删除单张照片

验证结果：通过。

已确认：

- 回到详情页删除对应照片后，重新打开 `/portfolio`；
- 对应房源卡片首图消失或回到无图状态；
- 房源卡片仍正常显示。

结论：

- Portfolio 首图不是独立数据副本；
- Detail 删除照片后，Portfolio 只读展示会同步回退；
- 删除照片不会破坏 Portfolio 卡片。

---

### 3.5 Settings 清除全部照片

验证结果：通过。

已确认：

- 再次添加照片后，Settings 能显示本机照片数量和占用空间；
- 点击“清除全部本机照片”并确认后，照片被清除；
- 回到 `/portfolio` 后首图消失；
- 房源、笔记、评分、状态、通勤锚点、通勤结果没有被误删。

结论：

- Settings photo clear-all 与 Portfolio 首图之间的关系正确；
- Portfolio 首图只读取本机照片，不持有自己的照片副本；
- 清除照片不会误伤其他本地结构化数据。

---

### 3.6 边界确认

验证结果：通过。

已确认：

- 没有出现 ZIP 相关入口；
- 没有出现 AI 图片分析入口；
- 没有出现云同步入口；
- 没有出现公开分享入口；
- 没有提示 JSON 可以恢复照片。

结论：

- Phase 3G-2B 没有把 Portfolio 首图扩张为照片备份、AI 分析、云同步或公开图册能力；
- 当前实现仍然符合 HouseFolio v2.0 的本地优先路线。

---

## 4. 当前实现边界复核

本次实现涉及：

- `src/components/listing-card-cover-photo.tsx`
- `src/components/listing-card.tsx`

当前边界：

- `ListingCard` 只轻接入首图子组件；
- `ListingCard` 不直接访问 IndexedDB；
- `ListingCard` 不直接访问 localStorage；
- `ListingCard` 不直接绑定云存储；
- `ListingCardCoverPhoto` 通过 `lib/storage/photos.ts` facade 读取照片；
- object URL 由子组件创建并在 cleanup 中释放；
- 没有改照片 provider schema；
- 没有改 JSON import/export；
- 没有改 L2 scoring；
- 没有改 commute-results；
- 没有接 ZIP、AI、地图、Supabase、云同步或 `/compare`。

---

## 5. 产品判断

Portfolio 首图是合理的小步增强，但它必须继续被定义为：

> 用户本机看房照片的只读缩略展示，用于帮助用户识别自己 portfolio 中的房源。

它不能被解释为：

- 房源图册；
- 云端相册；
- 公共展示页；
- 第三方平台图片搬运；
- 真房源佐证；
- AI 看图分析入口；
- ZIP 备份入口。

当前实现仍然符合这个边界。

---

## 6. 未完成内容

本阶段没有完成，也不应声称完成：

- ZIP 照片导出；
- ZIP 照片导入；
- 云端照片同步；
- AI 图片分析；
- AI 装修 / 采光 / 风险判断；
- 图片排序；
- 用户手动设为封面；
- Portfolio 批量 cover map 优化；
- Demo Mode 图片；
- `/compare` 首图；
- 公开分享图册。

这些能力如后续要做，必须重新立项并单独评审。

---

## 7. 本阶段结论

Phase 3G-2C 手动回归结论：

> Portfolio 首图最小实现通过浏览器手动验证。该能力可以在不破坏 v2.0 本地优先边界、不破坏照片数据权利、不改变 L1 / L2 / L3 结构的前提下，为 Portfolio 卡片提供轻量视觉识别辅助。

建议下一步：

- Phase 3G-2D：Portfolio 首图实现收口检查；
- 检查 build、git status、关键文件敏感词、storage 边界；
- 通过后再写 Phase 3G closing / handoff。