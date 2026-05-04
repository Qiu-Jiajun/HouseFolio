# HouseFolio 架构计划｜Phase 3D-3A｜Detail Local Photo Panel Implementation Plan

## 一、本阶段目标

本阶段目标是为 Detail 页面接入“看房照片｜本机保存”面板制定实现计划。

本阶段只写计划文档，不修改业务代码，不新增组件，不改 zhCN 文案，不接 UI，不保存真实照片。

当前稳定点：

    286936b docs: checkpoint photo provider boundary
    0ee027f docs: log indexeddb photo provider
    da5d4ab feat: implement indexeddb photo provider
    587d039 docs: plan indexeddb photo provider
    d37a17e docs: log storage boundary scaffold
    fc4283a feat: scaffold local photo storage boundary
    73e6f19 docs: review local photo persistence boundary

Phase 3D-3 的目标不是做“上传照片”，而是做“看房照片｜本机保存”的 Detail 页最小入口。

核心原则：

    本地优先不等于每次重新上传。
    正确设计是一次添加，长期本机持久化，按 listingId 私有绑定。

## 二、产品边界

### 2.1 推荐文案方向

建议使用：

    看房照片｜本机保存
    添加本地照片
    本机照片资料
    已保存照片
    这些照片仅保存在当前浏览器与设备中

避免使用：

    上传照片
    云端相册
    房源图册
    真房源照片
    房源认证照片
    平台图片库

原因：

    上传照片容易让用户误解为默认进入云端。
    房源图册容易让产品滑向房源平台。
    真房源照片会制造真实性背书风险。

### 2.2 当前不做

Phase 3D-3 不做：

    Portfolio 首图
    Settings 照片统计
    照片导出 zip
    云端同步
    Supabase Storage
    OSS / COS / OBS
    AI 照片分析
    图片压缩
    自动生成缩略图
    EXIF 清理
    拖拽上传
    批量导入
    自动扫描本机相册
    公开分享带照片报告

## 三、建议文件范围

Phase 3D-3 最小实现建议修改：

    src/components/listing-photo-panel.tsx
    src/components/listing-detail-view.tsx
    src/content/zh-cn.ts

可能需要读取但不直接修改：

    src/lib/storage/photos.ts
    src/types/listing-photo.ts

不应修改：

    src/app/*
    src/lib/local-store/*
    src/lib/algorithm/*
    src/lib/lbs/*
    src/app/api/*
    src/components/listing-card.tsx
    src/components/portfolio-list.tsx
    src/components/settings-local-data-panel.tsx

## 四、组件设计

### 4.1 新组件

建议新增：

    src/components/listing-photo-panel.tsx

组件性质：

    client component

原因：

    需要使用 file input。
    需要读取浏览器本地 IndexedDB。
    需要创建 object URL 展示图片。
    需要处理浏览器事件。

### 4.2 Props

建议 props：

    listingId: string
    listingTitle: string

暂不需要传入 listing 完整对象。

原因：

    照片只需要按 listingId 绑定。
    listingTitle 可用于可访问性文案或空状态说明。
    不应让照片组件耦合房源评分、通勤或笔记逻辑。

## 五、UI 结构草案

Detail 页面中建议放置位置：

    ListingNotesPanel 之后
    ListingCommutePanel 之前

原因：

    看房照片属于用户实地看房资料，与 notes 更接近。
    它不是 L1 / L2 / L3。
    放在 L1 之前可以避免被误解为 LBS 或算法能力。

结构：

    卡片标题：看房照片｜本机保存
    说明文案：照片仅保存在当前浏览器与设备中，不会默认上传云端。
    添加按钮：添加本地照片
    空状态：还没有为这套房源保存看房照片
    列表区域：显示已保存照片
    每张照片：预览图、文件名、大小、删除按钮、封面标识

Phase 3D-3 最小实现可以只展示：

    图片预览
    文件名
    删除按钮

暂不做：

    设置封面按钮
    照片备注
    照片排序
    缩略图生成
    图片详情弹窗

## 六、数据流设计

### 6.1 初次加载

组件 mount 后：

    调用 getListingPhotos(listingId)
    对每个 photo 调用 getListingPhotoBlob(photo.id)
    用 URL.createObjectURL(blob) 生成预览地址
    存到组件 state

注意：

    object URL 必须在组件 unmount 或列表刷新时 revoke。

### 6.2 添加照片

用户点击 file input 后：

    获取 File
    校验 mimeType
    校验文件大小
    调用 saveListingPhoto({
      listingId,
      fileName,
      mimeType,
      sizeBytes,
      sourceBlob: file,
      width?,
      height?,
      isCover?
    })
    保存后重新 load photos

Phase 3D-3 可暂不读取 width / height。

原因：

    读取图片尺寸需要额外 Image object 逻辑。
    当前先完成本地持久化闭环更重要。

### 6.3 删除照片

用户点击删除：

    调用 deleteListingPhoto(photo.id)
    revoke 对应 object URL
    重新 load photos

删除不需要弹窗二次确认，Phase 3D-3 可使用浏览器 confirm 或暂时直接删除。

更推荐：

    先不使用 confirm，保持最小实现。
    后续再统一做 UI confirm。

### 6.4 刷新后展示

验证标准：

    用户在 Detail 页选择照片。
    页面显示照片。
    刷新浏览器。
    再次进入同一 listing Detail。
    照片仍然显示。

这才证明“本地优先 + 持久化”成立。

## 七、文件类型与大小边界

Phase 3D-3 建议允许：

    image/jpeg
    image/png
    image/webp

暂不允许：

    image/heic
    image/heif
    image/gif
    video/*
    application/pdf

建议单张大小限制：

    5 MB

原因：

    IndexedDB 能存 Blob，但过大的照片会影响浏览器存储与性能。
    MVP 先限制单张大小更稳。

后续可以加入压缩后再保存。

## 八、object URL 生命周期

必须注意：

    URL.createObjectURL(blob)

创建后需要释放：

    URL.revokeObjectURL(url)

建议设计：

    state 中保存 photo + objectUrl。
    每次 reload 前，先 revoke 旧 objectUrl。
    组件 unmount 时，revoke 所有 objectUrl。

不要把 objectUrl 写入 IndexedDB 或 localStorage。

objectUrl 只是当前浏览器 session 的临时展示地址。

## 九、错误处理

Phase 3D-3 的错误处理保持简单：

    IndexedDB 不可用：显示本机照片功能暂不可用
    文件类型不支持：显示仅支持 JPG / PNG / WebP
    文件过大：显示单张照片不能超过 5MB
    保存失败：显示保存失败，请稍后重试
    删除失败：显示删除失败，请稍后重试

错误文案应放入：

    src/content/zh-cn.ts

不要把底层 Error.message 原样展示给用户。

## 十、中文文案边界

Phase 3D-3 需要新增 zhCN 文案。

建议位置：

    zhCN.listingPhotoPanel

建议字段：

    title
    description
    addButton
    emptyTitle
    emptyDescription
    localOnlyNotice
    deleteButton
    savedPhotos
    unsupportedType
    fileTooLarge
    loadFailed
    saveFailed
    deleteFailed
    storageUnavailable

所有用户可见文案应集中在 zhCN。

不要把中文大量散落在 TSX 中。

## 十一、隐私与合规提示

组件内应展示短提示：

    照片仅保存在当前浏览器与设备中，不会默认上传云端。请避免保存身份证、合同、手机号、微信号、门牌号、人脸等敏感内容。

该提示不应夸大为：

    我们保证照片绝对安全
    我们认证真实房源
    我们替你判断风险

## 十二、验证标准

Phase 3D-3 实现后应验证：

1. npm.cmd run build 通过。
2. git status clean。
3. Detail 页出现“看房照片｜本机保存”面板。
4. 没有照片时显示空状态。
5. 可选择 JPG / PNG / WebP。
6. 文件大于 5MB 时被拒绝。
7. 保存后当前页面能显示照片。
8. 刷新页面后照片仍能显示。
9. 删除照片后页面消失。
10. 重新进入同一 listing 后删除结果仍生效。
11. 不改 Portfolio 卡片。
12. 不改 Settings。
13. 不接云端。
14. 不接 AI。
15. 不新增 route。
16. 不保存图片到 localStorage。
17. 页面只调用 lib/storage/photos facade。

## 十三、风险点

### 13.1 浏览器存储配额

IndexedDB 存储依赖浏览器配额。

Phase 3D-3 只做轻量提示，不做复杂配额检测。

### 13.2 object URL 泄漏

必须认真处理 revokeObjectURL。

这是 Phase 3D-3 的主要技术风险。

### 13.3 SSR / build

组件必须是 client component。

不要在服务端或模块顶层访问 File、Blob URL 或 window。

### 13.4 用户误解为云上传

文案必须强调“本机保存”，避免“上传”作为核心动词。

## 十四、后续阶段建议

Phase 3D-3B：

    Implement Detail local photo panel.

Phase 3D-3C：

    Manual browser regression check.

Phase 3D-4：

    Portfolio cover photo minimal display.

Phase 3D-5：

    Settings photo data visibility.

Phase 3D-6：

    Phase 3D local photo persistence checkpoint.

## 十五、本阶段结论

Detail local photo panel 应作为本地照片持久化闭环的第一个 UI 入口。

但它仍然必须保持克制：

    只绑定 listingId。
    只本机保存。
    只通过 lib/storage。
    只做 Detail 页。
    不做云同步。
    不做 AI。
    不做 Portfolio 首图。
    不做 Settings 统计。

这样才能符合 v1.5 的核心方向，同时不破坏当前 Phase 3 的稳定边界。