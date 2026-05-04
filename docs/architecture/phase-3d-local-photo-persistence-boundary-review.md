# HouseFolio 架构评审｜Phase 3D-0｜v1.5 Local Photo Persistence Boundary Review

## 一、本阶段目标

本阶段目标是根据《HouseFolio 项目规划文档 v1.5》新增的“本地照片持久化版”要求，先完成照片能力的架构边界评审。

本阶段只写设计文档，不做功能实现，不新增页面，不修改现有 UI，不引入 IndexedDB / OPFS 代码，不接 Supabase Storage，不接 OSS / COS，不做云同步。

核心问题：

    HouseFolio 如何支持“用户第一次添加看房照片后，照片能长期保存在本机，并按 listingId 自动展示”，同时不把产品做成云端房源相册、房源图册或平台内容搬运工具。

## 二、v1.5 对照片能力的核心要求

根据 v1.5，照片能力必须遵守以下原则：

1. 照片属于用户主动添加的私人看房资料，不是平台房源图片。
2. MVP 默认本地优先，不默认云端同步。
3. 用户第一次选择照片后，应持久保存到当前设备与浏览器的本地数据库。
4. 照片必须按 listingId 与房源绑定。
5. 以后打开 Portfolio 或详情页时，应自动读取并展示对应照片。
6. localStorage 不保存图片本体。
7. 页面和组件不得直接操作 IndexedDB、OPFS、Supabase Storage、OSS 或 COS。
8. 照片能力必须通过 lib/storage 封装。
9. 照片默认不进入 AI。
10. 照片默认不公开分享。
11. 照片默认不用于 PR 展示真实用户数据。
12. 未来如做云同步，必须默认关闭，并由用户主动开启。

## 三、产品定位边界

### 3.1 应该如何描述

推荐使用：

    看房照片
    本机保存
    添加本地照片
    本机照片资料
    私人看房照片
    按房源保存照片

避免优先使用：

    上传照片
    云端相册
    房源图册
    公开图片库
    真房源照片
    平台房源图片

原因：

    “上传照片”容易让用户误解为照片会默认进入云端。
    “房源图册”容易让产品滑向房源平台。
    “真房源照片”容易制造真实性背书风险。

### 3.2 不能做的方向

MVP 和近期阶段不得做：

    自动读取系统相册
    扫描本机文件夹
    批量导入未经用户选择的照片
    默认云端保存照片
    公开展示照片
    公开分享带照片的房源报告
    将照片传给 AI 做识别
    使用第三方平台原图作为房源图片
    把照片能力包装成真房源认证

## 四、技术边界

### 4.1 存储层归属

照片能力应属于基础层 / storage 层。

它不是：

    L1 LBS
    L2 算法
    L3 AI

但它会给 L2 / L3 提供上下文：

    L2：通常不直接消费照片本体。
    L3：未来只能在用户单张选择、单独确认、脱敏 / 去 EXIF 后，才可能消费照片摘要或选定照片。

### 4.2 推荐目录

后续最小实现时，建议新增：

    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts
    src/types/listing-photo.ts

不要让页面直接调用 IndexedDB / OPFS。

页面只能调用类似业务函数：

    saveListingPhoto()
    getListingPhotos()
    getListingCoverPhoto()
    deleteListingPhoto()
    exportListingPhotos()

### 4.3 IndexedDB / OPFS 的角色

MVP 阶段建议优先评估 IndexedDB。

原因：

    浏览器支持更稳定。
    AI 生成代码更容易控制。
    足以保存少量看房照片和缩略图。
    与当前 localStorage 本地优先路线更一致。

OPFS 可以作为后续优化方向，但不建议 Phase 3D 立即引入。

原因：

    API 理解成本更高。
    兼容性和调试复杂度更高。
    对当前作品集 MVP 来说过早。

### 4.4 localStorage 的角色

localStorage 不应保存照片文件本体。

最多只能保存轻量状态或迁移标记，例如：

    是否存在本机照片
    照片数量摘要
    版本号
    storage provider 标记

但更推荐照片元数据也放到 storage provider 内部统一管理，避免数据分裂。

## 五、建议的数据模型草案

后续可新增类型：

    ListingPhoto

建议字段：

    id
    listingId
    fileName
    mimeType
    sizeBytes
    width
    height
    createdAt
    updatedAt
    isCover
    storageProvider
    localObjectKey
    thumbnailObjectKey
    note

说明：

    id：照片自身 ID。
    listingId：绑定房源。
    fileName：用户原始文件名，可选脱敏处理。
    mimeType：image/jpeg、image/png、image/webp 等。
    sizeBytes：用于 Settings 显示占用。
    width / height：用于 UI 布局。
    isCover：是否作为 Portfolio 卡片首图。
    storageProvider：当前可为 localIndexedDb。
    localObjectKey：照片本体在本地 provider 中的索引。
    thumbnailObjectKey：缩略图在本地 provider 中的索引。
    note：用户可选备注，后置功能。

MVP 不建议一开始做：

    照片排序
    云端同步状态
    EXIF 详情显示
    AI 分析状态
    分享权限字段
    多设备同步冲突字段

这些应放到后续阶段。

## 六、Settings / privacy 边界

照片能力进入实现后，Settings 必须同步扩展。

Settings 未来至少应显示：

    本机照片数量
    本机照片占用空间
    照片存储位置说明
    照片默认不上传云端的说明
    清除本机照片入口
    导出 Portfolio 备份包的入口或说明

当前已有的 JSON 导出不适合直接承载图片本体。

后续更合理的是：

    JSON 导出：listings、notes、ratings、status、work-locations、commute-results、photo metadata
    Portfolio 备份包：JSON + photos 目录的 zip

但 zip 导出不应在 Phase 3D-1 立即实现。应先做本地照片保存与读取闭环。

## 七、AI / L3 边界

照片默认不进入 AI。

未来如确实做 AI 看房照片分析，必须满足：

1. 用户主动选择某一张或少量照片。
2. 弹窗单独说明会发送照片给第三方 AI。
3. 用户单独确认。
4. 尽可能先去 EXIF。
5. 不发送门牌号、人脸、合同、身份证、联系方式等高敏内容。
6. AI 输出必须标识“AI 辅助生成，仅供参考”。
7. 不把照片分析做成房源真实性认证。

Phase 3D 不进入该能力。

## 八、与当前阶段的关系

当前最新稳定点：

    Phase 3B-6B Detail readability polish
    5e0a399 docs: log detail readability polish
    28adc91 style: polish detail readability

Phase 3D-0 只是基于 v1.5 做架构边界评审。

本阶段不应影响：

    Detail L1 / L2 readability polish
    L1 transit commute calculation
    L2 Reference Score
    Portfolio listing card polish
    Settings local data panel
    zhCN 文案中心
    /api/lbs/commute/transit route

## 九、建议后续拆分

### Phase 3D-1：storage boundary scaffold

目标：

    新建 src/lib/storage 目录下的 provider 类型和空实现。
    不接 UI。
    不真正保存照片。
    只建立接口边界。

可能文件：

    src/types/listing-photo.ts
    src/lib/storage/provider.ts
    src/lib/storage/photos.ts
    src/lib/storage/local-photo-provider.ts

### Phase 3D-2：local photo provider minimal IndexedDB implementation

目标：

    实现最小 IndexedDB 保存 / 读取 / 删除能力。
    仍不接 UI。
    增加 contract check。

### Phase 3D-3：Detail page local photo panel skeleton

目标：

    在 Detail 页加入“看房照片｜本机保存”面板。
    用户可选择图片。
    保存后刷新仍能显示。
    仅针对详情页，不改 Portfolio 卡片。

### Phase 3D-4：Portfolio cover photo minimal display

目标：

    Portfolio 卡片显示首张本机照片缩略图。
    没有照片时保留当前无图卡片样式。

### Phase 3D-5：Settings photo data visibility

目标：

    Settings 显示本机照片数量与占用空间。
    提供清除本机照片能力。
    暂不做 zip 备份包。

## 十、本阶段结论

v1.5 的本地照片持久化方向是合理且重要的。

但它必须按以下顺序推进：

    先边界评审
    再 lib/storage 封装
    再本地 provider
    再 Detail UI
    再 Portfolio 首图
    再 Settings 数据权利
    最后才考虑备份包或云同步

当前不应直接在组件里写 IndexedDB，也不应把照片能力做成临时 file input 预览。

关键原则：

    本地优先不等于每次重新上传。
    正确设计是一次添加，长期本机持久化，按 listingId 私有绑定。