# Phase 3G-5｜Phase 3D–3G 总回归日志

## 1. 阶段定位

本阶段是 Phase 3G-5：Phase 3D–3G 总回归检查。

本阶段目标是对 Phase 3D / 3E / 3F / 3G 做一次统一稳定性检查，确认本地照片持久化、结构化 JSON 导入、阶段 handoff 和 Portfolio 首图最小展示能力已经形成稳定闭环。

本阶段只记录检查结果，不修改功能代码。

---

## 2. 当前最新状态

当前最新 commit：

- 2d9b882 docs: add phase 3g handoff

当前最近关键 commits：

- 2d9b882 docs: add phase 3g handoff
- 391f2c3 docs: close portfolio cover photo phase
- abacd80 docs: log portfolio cover photo regression
- d758e53 feat: show local cover photo on listing cards
- 83c70ef docs: plan portfolio cover photo implementation
- d32e881 docs: review portfolio cover photo boundary
- 3679fd0 docs: add phase 3d 3e handoff
- ab0c019 docs: log phase 3d 3e total regression
- c4d34b1 docs: close json import phase

当前检查结果：

- git status clean
- npm.cmd run build 通过
- 工作树干净

---

## 3. build 检查

执行命令：

- npm.cmd run build

结果：

- Next.js production build 通过
- TypeScript 通过
- 静态页面生成通过
- 动态路由正常

当前路由：

- /
- /_not-found
- /api/lbs/commute/transit
- /portfolio
- /portfolio/[id]
- /portfolio/new
- /settings

结论：

- Phase 3D–3G 的代码与文档变更没有破坏 Next.js build；
- 当前路由结构没有新增 /compare、地图页、AI 页、Supabase 页或部署相关页面。

---

## 4. 文档存在性检查

以下文档均存在：

- docs/dev-log/2026-05-04-phase-3d-local-photo-persistence-checkpoint.md
- docs/dev-log/2026-05-04-phase-3e-5-json-import-closing.md
- docs/dev-log/2026-05-04-phase-3f-1-total-regression.md
- docs/dev-log/2026-05-04-phase-3f-2-phase-3d-3e-handoff.md
- docs/architecture/phase-3g-portfolio-cover-photo-review.md
- docs/architecture/phase-3g-cover-photo-implementation-plan.md
- docs/dev-log/2026-05-04-phase-3g-2c-cover-photo-regression.md
- docs/dev-log/2026-05-04-phase-3g-3-cover-photo-closing.md
- docs/dev-log/2026-05-04-phase-3g-handoff.md

结论：

- Phase 3D 本地照片持久化有 checkpoint；
- Phase 3E JSON 导入有 closing；
- Phase 3F 有总回归与 handoff；
- Phase 3G 有评审、计划、回归、收口与 handoff；
- 当前阶段文档链条完整。

---

## 5. 代码存在性检查

以下关键代码文件均存在：

- src/components/listing-photo-panel.tsx
- src/components/settings-photo-data-panel.tsx
- src/components/listing-card-cover-photo.tsx
- src/components/listing-card.tsx
- src/lib/storage/photos.ts
- src/lib/storage/local-photo-provider.ts
- src/lib/privacy/local-data-import.ts
- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts

结论：

- Detail 本机照片面板仍存在；
- Settings 照片数据权利面板仍存在；
- Portfolio 首图组件仍存在；
- Storage facade / provider 仍存在；
- JSON 导入 helper 仍存在；
- 中文文案中心仍存在。

---

## 6. 源码边界扫描结果

检查文件：

- src/components/listing-photo-panel.tsx
- src/components/settings-photo-data-panel.tsx
- src/components/listing-card-cover-photo.tsx
- src/components/listing-card.tsx
- src/lib/storage/photos.ts
- src/lib/storage/local-photo-provider.ts
- src/lib/privacy/local-data-import.ts
- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts

### 6.1 NUL 字节

所有检查文件：

- nul: 0

结论：

- 关键源码与中文文案未发现 NUL 字节异常。

### 6.2 IndexedDB

扫描结果：

- src/lib/storage/local-photo-provider.ts 命中 indexedDB
- 其他组件和 facade 未命中 indexedDB

判断：

- 这是预期结果；
- IndexedDB 只允许出现在 local photo provider 内部；
- 页面和组件没有直接访问 IndexedDB；
- ListingCard 和 ListingCardCoverPhoto 没有直接访问 IndexedDB。

结论：

- Storage 封装边界未破坏。

### 6.3 localStorage

扫描结果：

- src/lib/privacy/local-data-import.ts 命中 localStorage
- src/content/zh-cn.ts 命中 localStorage
- 其他检查文件未命中 localStorage

判断：

- local-data-import.ts 命中 localStorage 是预期结果，因为 Phase 3E 的 JSON 导入本来就是结构化 localStorage 数据导入；
- zh-cn.ts 命中 localStorage 是文案说明，不是功能调用；
- Portfolio 首图相关组件没有写入 localStorage。

结论：

- JSON 导入边界未破坏；
- 照片 Blob 没有进入 localStorage；
- object URL 没有进入 localStorage。

### 6.4 Supabase

扫描结果：

- src/content/zh-cn.ts 命中 supabase
- 其他检查文件未命中 supabase

判断：

- zh-cn.ts 命中 supabase 是用户可见说明文案命中；
- 当前没有新增 Supabase 功能；
- 页面和组件没有绑定 Supabase SDK。

结论：

- 云端能力边界未破坏。

### 6.5 ZIP

扫描结果：

- 检查文件均未命中 zip

结论：

- Phase 3G 没有接入 ZIP 照片导出；
- 没有接入 ZIP 照片导入；
- 当前 JSON 导入仍不包含照片。

### 6.6 AI / DeepSeek / 大模型

扫描结果：

- src/content/zh-cn.ts 命中 AI / DeepSeek / 大模型
- 其他检查文件未命中

判断：

- zh-cn.ts 命中 AI / DeepSeek / 大模型是文案说明命中；
- 当前没有新增 AI 图片分析；
- 当前没有把照片发送给 AI；
- 当前没有新增 DeepSeek 调用。

结论：

- L3 / AI 边界未破坏。

---

## 7. Portfolio 首图结构检查

检查结果：

- cover use client: True
- cover getListingCoverPhoto: True
- cover thumbnail facade: True
- cover blob fallback: True
- cover creates object URL: True
- cover revokes object URL: True
- card imports cover component: True
- card passes listingId: True
- card passes title: True

结论：

- ListingCardCoverPhoto 是 client component；
- 它通过 lib/storage/photos.ts facade 读取 cover photo；
- 它优先读取 thumbnail blob；
- 它具备原图 blob fallback；
- 它创建 object URL；
- 它释放 object URL；
- ListingCard 只负责轻接入；
- ListingCard 传入 listingId 和 title；
- ListingCard 没有直接读取底层 storage。

---

## 8. Phase 3D–3G 当前能力闭环

当前已经形成以下本地优先基础层闭环：

用户主动添加房源
→ Detail 添加本机看房照片
→ IndexedDB 持久化保存照片 Blob
→ Detail 刷新后照片仍显示
→ Settings 查看照片数量与占用空间
→ Settings 可清除全部本机照片
→ Portfolio 卡片只读展示本机首图
→ 删除照片或清除照片后 Portfolio 首图消失
→ Settings 导出 / 导入结构化 JSON
→ JSON 不包含照片
→ JSON 导入不恢复照片
→ 房源、笔记、评分、状态、通勤锚点、通勤结果继续保持结构化 localStorage 数据权利闭环

结论：

- Phase 3D / 3E / 3G 已经形成较完整的本地优先基础层；
- 结构化数据和照片 Blob 仍然保持两条清晰边界；
- 当前没有把 HouseFolio 推向云相册、公开图册或第三方图片平台。

---

## 9. 当前未完成内容

当前没有完成，也不应声称完成：

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
- EXIF 深度处理；
- 地图 UI；
- POI / 生活圈真实计算；
- Supabase 持久化；
- DeepSeek 接入；
- 正式 Phase 4A comparison data model。

这些能力如后续要做，必须重新立项并单独评审。

---

## 10. 风险判断

当前风险较低。

主要剩余风险：

- Portfolio 列表卡片增多时，每张卡片独立读取本机照片可能有轻微性能压力；
- 当前不做批量 cover map，符合小步实现策略；
- 后续如果做 ZIP 或云端照片，必须重新评审，不能直接复用当前首图能力扩张；
- 后续不宜继续堆照片能力，否则会偏离 L1 / L2 / L3 三层决策引擎主线。

---

## 11. 总回归结论

Phase 3G-5 总回归结论：

> Phase 3D–3G 当前状态稳定。HouseFolio 已完成本地照片持久化、Settings 照片数据权利、结构化 JSON 导入、Portfolio 首图最小只读展示，并保持本地优先、lib/storage 封装、JSON 与照片边界、L1 / L2 / L3 边界不被破坏。

建议下一步：

- Phase 3H：本地优先数据权利阶段总收口；
- 或者如果当前对话过长，先生成新对话 handoff；
- 暂不继续扩张照片功能。