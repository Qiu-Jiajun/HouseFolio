# Phase 3G-0｜Portfolio 首图前置评审

## 1. 阶段定位

本阶段是 Phase 3G-0：Portfolio 首图前置评审。

本阶段只做评审文档，不实现 Portfolio 首图，不修改 `src/components/listing-card.tsx`，不读取 IndexedDB，不接 ZIP，不接 AI，不接地图，不接 Supabase，不接 `/compare`，不接云同步。

当前 HouseFolio 已完成：

- Phase 3D：本地照片持久化闭环；
- Phase 3E：结构化 JSON 导入闭环；
- Phase 3F：阶段总回归与 handoff；
- 当前最后确认 commit：`3679fd0 docs: add phase 3d 3e handoff`。

Phase 3G-0 的目的不是立刻增强 UI，而是先判断 Portfolio 首图是否符合 v2.0 本地优先路线，以及它应该被限制在什么边界内。

---

## 2. 为什么需要先评审

Portfolio 首图看似只是一个轻量 UI 增强，但它会触碰 HouseFolio 的核心边界：

- 照片是高敏私人看房资料；
- 当前照片只在 Detail 页中作为用户主动添加的本机资料展示；
- 一旦进入 Portfolio 卡片，照片会从“详情资料”变成“列表层可见元素”；
- 如果边界不清，后续容易滑向房源图册、云端相册、公开展示或第三方房源图片搬运；
- Portfolio 是用户最常浏览的页面，首图会显著改变产品观感和数据读取路径。

因此，Portfolio 首图不能作为普通 UI polish 直接实现，必须先进行边界评审。

---

## 3. 与 v2.0 路线的关系

HouseFolio v2.0 的定位是：

- 本地优先的私人找房决策工具；
- 用户主动添加候选房源；
- 看房照片默认本机保存；
- 不抓取、不聚合、不公开、不撮合、不认证；
- 不把照片做成云相册或公共房源图册；
- 页面不得直接绑定 IndexedDB、OPFS、Supabase Storage、OSS、COS 等底层存储；
- 照片能力必须通过 `lib/storage` 封装访问。

在这个前提下，Portfolio 首图本身并不违背 v2.0。因为：

- 它展示的是用户本人主动添加的本机照片；
- 它可以帮助用户在 Portfolio 中快速识别房源；
- 它强化的是私人 portfolio 的可记忆性；
- 它不必引入云端、不必引入第三方图片、不必引入 AI。

但它必须被严格限定为：

> 本机照片的只读缩略展示，而不是房源图片平台、公开图册、云端相册或第三方图片搬运能力。

---

## 4. 可以做的范围

如果后续进入实现阶段，Portfolio 首图只能做以下最小版本：

### 4.1 展示范围

允许：

- 在 Portfolio 卡片中展示当前 listing 的本机封面照片或首张照片缩略图；
- 没有照片时显示原有无图卡片样式或轻量占位区；
- 图片只作为用户识别房源的辅助视觉线索；
- 图片不参与 L2 Reference Score；
- 图片不参与排序、筛选、推荐、异常检测；
- 图片不进入 AI；
- 图片不进入 JSON 导出；
- 图片不上传云端。

禁止：

- 展示第三方平台房源图片；
- 从 URL 自动抓取图片；
- 读取网页 og:image；
- 把图片作为公共房源展示素材；
- 做公开分享图册；
- 做云端照片同步；
- 做 AI 图片分析；
- 做 ZIP 导出或导入；
- 做图片压缩、EXIF 清理、封面设置、排序等扩展能力。

### 4.2 技术访问边界

允许：

- 通过 `lib/storage` 的 facade 读取照片；
- 使用类似 `getListingCoverPhoto(listingId)` 的业务函数；
- 在客户端组件中只处理已封装后的照片元数据和 Blob URL；
- 继续由 storage provider 负责 IndexedDB 细节；
- 在组件卸载或图片变更时释放 object URL。

禁止：

- 在 `listing-card.tsx` 中直接写 `indexedDB.open`；
- 在 `listing-card.tsx` 中直接访问 object store；
- 在页面或组件中直接操作 IndexedDB schema；
- 在页面或组件中直接访问 OPFS；
- 在页面或组件中直接调用 Supabase Storage / OSS / COS；
- 把 Blob 或 base64 塞进 localStorage；
- 把照片写入 JSON import/export 当前结构。

---

## 5. 为什么本阶段不实现

本阶段不实现，是因为当前仍需先确认三件事：

### 5.1 首图读取是否应该进入 ListingCard

`ListingCard` 当前是 Portfolio 的基础展示组件。如果直接把异步照片读取逻辑塞进卡片，会让卡片从纯展示组件变成带本地存储副作用的组件。

这可能带来：

- 列表渲染时多次异步读取；
- object URL 生命周期复杂；
- UI 卡顿或闪烁；
- 卡片职责膨胀；
- 后续测试和回归变复杂。

因此，后续实现前应先判断：

- 是让 `ListingCard` 自己读取封面；
- 还是让 Portfolio 上层读取 cover map 后传入；
- 或者新增 `ListingCardCoverPhoto` 小组件隔离异步读取。

当前倾向：

> 不让 `ListingCard` 直接接触 storage provider。优先考虑新增一个极小的 `ListingCardCoverPhoto` 客户端子组件，内部只通过 `lib/storage` facade 读取当前 listing 的 cover photo，并负责 object URL 清理。

### 5.2 是否需要先补 storage facade

当前 Phase 3D 已经有照片 storage boundary，但 Portfolio 首图对读取方式有更高要求：

- 它需要轻量；
- 它需要只读；
- 它需要适配列表多卡片；
- 它需要避免把 Blob 或 object URL 泄漏到上层数据模型。

如果现有 facade 已有 `getListingCoverPhoto()` 或等价能力，后续可复用。  
如果没有，应先补最小 facade，而不是在 UI 中绕过封装。

### 5.3 是否会影响当前数据权利闭环

当前 JSON 导入明确不包含照片。Portfolio 首图如果实现，也不能改变这个边界。

后续实现时必须继续说明：

- JSON 只能恢复结构化数据；
- 照片仍保存在 IndexedDB；
- Portfolio 首图只读取当前设备已有照片；
- 换设备后如果没有照片，Portfolio 卡片应自然回到无图状态；
- 不能误导用户以为 JSON 导入可以恢复照片。

---

## 6. 产品风险判断

### 6.1 低风险部分

Portfolio 首图的低风险理由：

- 数据来源是用户主动添加的本机照片；
- 展示范围限于用户自己的本地 Portfolio；
- 不公开、不分享、不云同步；
- 不进入 AI；
- 不做真实性背书；
- 不改变 HouseFolio 的私人决策工具定位。

### 6.2 中等风险部分

需要控制的风险：

- 用户可能误以为 HouseFolio 是房源图片管理平台；
- 面试或 PR 展示中容易被误解为“房源展示平台”；
- 如果未来接云同步，照片会迅速变成高敏云数据；
- 如果首图 UI 太强，产品重心可能从 L1 / L2 / L3 决策工具滑向房源图册；
- 列表页批量读取照片可能带来性能和工程复杂度。

### 6.3 必须避免的滑坡

禁止把 Portfolio 首图扩展成：

- 房源图册；
- 云端相册；
- 公共展示页；
- 第三方平台图片搬运；
- AI 看图分析；
- 房源真实性佐证；
- 自动抓图能力；
- ZIP 备份包实现入口；
- 营销展示素材库。

---

## 7. 推荐实现顺序，但本阶段不执行

如果后续确认要实现，建议拆成更小阶段：

### Phase 3G-1：Portfolio cover photo implementation plan

只写实现计划，不写代码。

目标：

- 明确组件职责；
- 明确是否新增 `ListingCardCoverPhoto`；
- 明确只通过 `lib/storage` facade；
- 明确 object URL 清理方式；
- 明确无照片 fallback；
- 明确不改 JSON import/export；
- 明确不接 ZIP / AI / 云同步。

### Phase 3G-2：Minimal cover photo read-only implementation

只做最小只读实现。

允许文件范围：

- `src/components/listing-card-cover-photo.tsx`，如需要新增；
- `src/components/listing-card.tsx`，只允许接入子组件或可选 prop；
- `src/lib/storage/photos.ts`，仅当缺少必要 facade 时做最小补充；
- `src/content/zh-cn.ts`，仅当需要极少量无图提示文案时修改。

禁止：

- 改照片 provider schema；
- 改 JSON import；
- 改 Settings；
- 改 Detail photo panel；
- 接 ZIP；
- 接 AI；
- 接云同步；
- 改 L2 算法；
- 改 Portfolio 筛选排序。

### Phase 3G-3：Build and manual regression

验证：

- 没有照片时 Portfolio 正常；
- 有照片时 Portfolio 显示首图；
- 刷新后首图仍显示；
- 删除照片后 Portfolio 回到无图；
- Settings 清除全部照片后 Portfolio 回到无图；
- JSON 导入后如果本机没有照片，Portfolio 不误报；
- build 通过；
- git status clean。

### Phase 3G-4：Dev log and commit

记录：

- 实现范围；
- 边界；
- 回归结果；
- 未完成内容。

---

## 8. 当前阶段结论

Phase 3G-0 的评审结论：

> Portfolio 首图可以作为后续小步增强，但不能作为普通 UI polish 直接实现。它必须被定义为“用户本机照片的只读缩略展示”，只用于帮助用户识别自己 portfolio 中的房源，不参与评分、排序、AI、云同步或公开展示。

当前最稳路线：

1. 本阶段只提交本评审文档；
2. 下一阶段若继续，应先做 `Phase 3G-1：Portfolio cover photo implementation plan`；
3. 不建议直接进入实现；
4. 不建议在同一阶段混入 ZIP 备份、AI 照片分析、云端照片同步或 `/compare`。

---

## 9. Phase 3G-0 验证标准

本阶段完成标准：

- 新增本文档；
- 不修改任何 `src` 功能代码；
- 不新增 UI；
- 不读取 IndexedDB；
- 不修改 `listing-card.tsx`；
- 不新增 ZIP / AI / 地图 / Supabase / `/compare` 相关内容；
- `npm.cmd run build` 通过；
- `git status` clean；
- 提交 commit。

建议 commit message：

`docs: review portfolio cover photo boundary`