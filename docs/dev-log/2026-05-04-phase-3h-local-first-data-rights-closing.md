# Phase 3H｜本地优先数据权利阶段总收口

## 1. 阶段定位

本阶段是 Phase 3H：本地优先数据权利阶段总收口。

本阶段不新增功能代码，只对 Phase 3D / 3E / 3F / 3G 进行产品、架构、数据权利和后续路线层面的总收束。

当前前置阶段已经完成：

- Phase 3D：本地照片持久化闭环；
- Phase 3E：结构化 JSON 导入闭环；
- Phase 3F：Phase 3D–3E 总回归与 handoff；
- Phase 3G：Portfolio 首图最小只读展示闭环；
- Phase 3G-5：Phase 3D–3G 总回归检查。

当前最新确认 commit：

- 33d4f01 docs: log phase 3g total regression

---

## 2. 为什么需要 Phase 3H

Phase 3D / 3E / 3G 已经连续强化了 HouseFolio 的本地优先基础层：

- 照片本机保存；
- Settings 显示照片数量与占用空间；
- Settings 清除全部本机照片；
- 结构化 JSON 导出；
- 结构化 JSON 导入；
- Portfolio 卡片展示本机首图；
- JSON 与照片保持分离边界；
- 不默认云同步；
- 不把照片发给 AI；
- 不把照片做成公开图册。

这些功能已经可以形成一个阶段性成果，但也存在一个风险：

> 如果继续沿着照片、导入导出、备份包方向扩张，HouseFolio 容易从 L1 / L2 / L3 找房决策工具滑向“本地相册 + 数据管理工具”。

因此 Phase 3H 的作用是明确：

- 当前本地优先基础层已经够用；
- 当前照片能力不应继续扩张；
- 当前 JSON 导入已经达到结构化数据权利闭环；
- 未来如果做 ZIP、云同步、AI 图片分析，必须重新立项；
- 下一阶段应回到 HouseFolio 的三层决策引擎主线。

---

## 3. 当前本地优先基础层已经完成什么

### 3.1 结构化数据权利

当前 Settings 已覆盖结构化 localStorage 数据：

- 查看本地数据快照；
- 导出本地 HouseFolio JSON；
- 清除本机结构化数据；
- 导入本地 HouseFolio JSON；
- 只导入白名单内的 HouseFolio keys；
- 忽略未知 key；
- 无效 JSON 不写入；
- 导入前要求确认覆盖；
- 导入后刷新本地数据快照；
- 明确 JSON 导入不包含照片。

当前结构化数据包括：

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

结论：

> HouseFolio 当前已经具备结构化本地数据的查看、导出、导入和清除能力。

---

### 3.2 本机照片数据权利

当前照片能力已经覆盖：

- Detail 页添加本机看房照片；
- 照片保存到浏览器 IndexedDB；
- 刷新后照片仍然存在；
- Detail 页可删除单张照片；
- Settings 显示本机照片数量；
- Settings 显示本机照片占用空间；
- Settings 显示照片本机保存说明；
- Settings 可清除全部本机照片；
- 清除照片不影响房源、笔记、评分、状态、通勤锚点、通勤结果；
- Portfolio 卡片可以只读展示本机首图；
- 删除照片或清除全部照片后，Portfolio 首图回到无图状态。

结论：

> HouseFolio 当前已经具备照片本机保存、查看状态、单张删除、全部清除和列表首图识别能力。

---

### 3.3 JSON 与照片的边界

当前 JSON 与照片保持明确分离：

- JSON 只处理结构化 localStorage 数据；
- 照片 Blob 保存在 IndexedDB；
- JSON 不包含照片 Blob；
- JSON 不包含缩略图；
- JSON 不包含 object URL；
- JSON 导入不能恢复照片；
- Portfolio 首图只读取当前设备已有照片；
- 换设备后如果没有照片，Portfolio 卡片自然回到无图状态。

结论：

> 当前没有误导用户认为 JSON 可以完整恢复照片，也没有为了导入导出方便而把照片塞入 localStorage。

---

## 4. 当前架构边界

### 4.1 storage 边界

当前照片能力通过以下路径访问：

组件
→ lib/storage/photos.ts
→ active photo provider
→ local-photo-provider
→ IndexedDB

当前 IndexedDB 访问只允许存在于：

- src/lib/storage/local-photo-provider.ts

页面和组件不得直接访问 IndexedDB。

已确认：

- ListingPhotoPanel 不直接访问 IndexedDB；
- SettingsPhotoDataPanel 不直接访问 IndexedDB；
- ListingCardCoverPhoto 不直接访问 IndexedDB；
- ListingCard 不直接访问 IndexedDB；
- photos.ts facade 不直接暴露底层 object store；
- provider 内部封装 IndexedDB 细节。

结论：

> lib/storage 封装边界保持完整。

---

### 4.2 privacy / local-data 边界

当前结构化数据权利通过以下文件维护：

- src/lib/privacy/local-data.ts
- src/lib/privacy/local-data-import.ts
- src/components/settings-local-data-panel.tsx

当前边界：

- 只处理 HouseFolio 白名单 keys；
- 不读取浏览器其他网站数据；
- 不导入未知 localStorage key；
- 不导入照片 Blob；
- 不导入 IndexedDB；
- 不接云端；
- 不接 Supabase。

结论：

> 结构化本地数据权利边界清晰。

---

### 4.3 L1 / L2 / L3 边界

Phase 3D / 3E / 3G 没有改变 L1 / L2 / L3：

- 没有改 L1 LBS；
- 没有改高德 route；
- 没有改 commute-results；
- 没有改 L2 Reference Score；
- 没有改 comparison selector；
- 没有接 L3 AI；
- 没有把照片送给 AI；
- 没有让图片参与评分、排序、筛选或推荐。

结论：

> 本地优先基础层增强没有破坏三层决策引擎边界。

---

## 5. 产品边界收束

当前 HouseFolio 仍然是：

- 本地优先的私人找房决策工具；
- 用户主动添加候选房源；
- 用户本机保存看房照片；
- 用户本机导出 / 导入结构化数据；
- L1 / L2 / L3 三层决策引擎驱动辅助比较；
- 不抓取；
- 不聚合；
- 不公开；
- 不撮合；
- 不认证；
- 不默认云同步。

当前 HouseFolio 不是：

- 房源平台；
- 中介平台；
- 房源聚合平台；
- 真房源认证平台；
- 房源图片平台；
- 云端相册；
- 公共图册；
- AI 看图分析工具；
- ZIP 备份工具；
- 多端同步工具。

---

## 6. 当前不应继续扩张的方向

Phase 3H 之后，不建议立刻继续做：

- ZIP 照片导出；
- ZIP 照片导入；
- 手动设置封面；
- 图片排序；
- AI 图片分析；
- 云端照片同步；
- 公开分享图册；
- Demo Mode 图片；
- EXIF 深度处理；
- 图片 OCR。

原因：

- 当前照片能力已经覆盖 MVP 所需的本机保存、展示、清除和首图识别；
- 继续扩张照片能力会稀释 HouseFolio 的三层决策引擎主线；
- ZIP / 云同步 / AI 图片分析都会显著增加合规、架构和维护成本；
- 当前更需要回到 L1 / L2 / L3 或 Demo 展示层主线。

---

## 7. 当前可以进入的后续方向

Phase 3H 完成后，后续可以考虑以下路线，但应一次只做一件事。

### 7.1 路线 A：Phase 3I｜Demo Mode 前置评审

适合理由：

- v2.0 明确 Demo Mode 是求职作品集刚需；
- Demo Mode 能让面试官快速看到产品价值；
- Demo Mode 不应使用真实用户数据；
- 可以先只写评审，不实现。

注意：

- 不要直接生成大量假数据；
- 不要接 AI；
- 不要接地图；
- 不要改变真实用户数据；
- 不要把 Demo Mode 和真实 Portfolio 混在一起。

### 7.2 路线 B：Phase 4A 前置评审｜Comparison Data Model

适合理由：

- HouseFolio 已经完成较多基础层能力；
- L2 comparison 是三层决策引擎主线；
- Phase 2F 已经有 comparison selector 草案；
- 可以开始评审正式 ComparisonModel 的边界。

注意：

- 先评审，不直接做 /compare 页面；
- 不要做多房源勾选；
- 不要做横向对比 UI；
- 不要让 LLM 做评分、排序或筛选。

### 7.3 路线 C：Phase 3I｜阶段总 handoff

适合理由：

- 当前对话较长；
- Phase 3D–3H 已经形成完整成果；
- 适合生成给下一轮对话的接续文档；
- 可以防止后续丢失边界。

---

## 8. 当前建议

当前最稳建议：

> 先完成 Phase 3H 收口文档，再根据对话长度决定是否生成新对话 handoff。如果继续做功能方向，优先考虑 Demo Mode 前置评审或 L2 comparison model 前置评审，而不是继续扩张照片能力。

原因：

- Phase 3D / 3E / 3G 已经把本地优先基础层做得足够完整；
- 再继续做照片相关功能，边际收益下降；
- HouseFolio 的核心仍然是 L1 / L2 / L3；
- v2.0 也强调 Demo Mode 是求职展示的重要能力；
- Phase 4A 之前可以继续在聊天界面推进，但应回到产品主线。

---

## 9. Phase 3H 结论

Phase 3H 结论：

> Phase 3D–3G 已经完成了 HouseFolio v2.0 下“本地优先数据权利层”的主要 MVP 闭环：结构化数据可查看、导出、导入、清除；照片可本机保存、展示、删除、清除；Portfolio 可只读显示本机首图。当前不应继续扩张照片能力，应把后续重心转回 Demo 展示或 L2 comparison 主线。