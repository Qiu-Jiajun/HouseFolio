# HouseFolio 架构计划｜Phase 3D-4A｜Settings Photo Data Visibility Plan

## 一、本阶段目标

本阶段目标是为 Settings 页面展示本机照片数据状态制定实现计划。

本阶段只写计划文档，不修改业务代码，不改 Settings 页面，不清除照片，不实现导出 ZIP，不实现导入，不接云端，不接 AI。

当前稳定点：

    Phase 3D-3B：Detail local photo panel minimal implementation
    Phase 3D-3C：Detail photo panel manual regression

已完成能力：

    Detail 页可添加本地照片
    照片保存到 IndexedDB local photo provider
    照片按 listingId 绑定
    刷新后仍可展示
    可删除单张照片
    页面只调用 lib/storage/photos facade
    不直接操作 IndexedDB
    不接云端
    不接 AI

## 二、为什么下一步是 Settings photo data visibility

根据 v2.0，HouseFolio 是本地优先的私人找房决策工具。

本地优先不只是“把数据存在浏览器里”，还必须让用户知道：

    哪些数据保存在本机
    哪些数据占用了本机空间
    哪些数据可以清除
    哪些数据不会默认上传云端
    换设备 / 换浏览器 / 清除网站数据后会发生什么
    后续如何导出 / 导入恢复

当前 Detail 页已经完成照片本地保存闭环，因此 Settings 需要逐步纳入照片数据状态。

否则用户会看到照片能保存，却不知道：

    它保存在哪里
    占多少空间
    如何清除
    是否会上传云端
    是否会进入 AI

这不符合 v2.0 的本地优先透明度要求。

## 三、产品定位边界

Settings 中应使用的表达：

    本机照片数据
    看房照片｜本机保存
    当前浏览器与设备中的照片
    本机照片数量
    本机照片占用空间
    清除本机照片

避免使用：

    云端相册
    房源图册
    上传照片管理
    真房源照片
    认证照片
    平台图片库

原因：

    HouseFolio 不是云端房源相册。
    HouseFolio 不做真房源认证。
    HouseFolio 不公开展示用户照片。
    HouseFolio 不把照片作为平台房源内容资产。

## 四、Settings 未来应展示什么

### 4.1 当前最小展示项

Phase 3D-4B 最小实现建议展示：

    本机照片数量
    本机照片占用空间
    存储位置说明
    云端同步状态说明
    AI 使用状态说明

示例文案：

    本机照片数量：3 张
    本机照片占用空间：8.4 MB
    存储位置：当前浏览器与设备的本地数据库
    云端同步：当前未开启，照片不会默认上传云端
    AI 使用：当前不会发送照片给 AI

### 4.2 清除能力

Phase 3D-4B 可以考虑加入：

    清除全部本机照片

但需要谨慎。

原因：

    当前 provider 已有 getStorageSummary()
    但还没有 clearAllPhotos() facade
    目前只有 clearListingPhotos(listingId)
    如果要做“清除全部本机照片”，需要扩展 provider contract

因此建议拆分：

    Phase 3D-4B：只展示照片数量和占用空间，不提供清除全部照片
    Phase 3D-4C：扩展 provider clearAllPhotos contract
    Phase 3D-4D：Settings 加入清除全部本机照片入口

这样更稳，不会在一个阶段里同时改 UI、provider contract 和 destructive action。

### 4.3 导出 / 导入说明

Phase 3D-4B 可以只写说明：

    当前 JSON 导出暂不包含照片文件本体。
    后续会支持 Portfolio 备份包。
    备份包将包含 JSON 数据与 photos 目录。

但 Phase 3D-4B 不做：

    ZIP 导出
    ZIP 导入
    照片文件导出
    备份包恢复

这些应进入后续 Phase 3E 或 3H。

## 五、技术边界

### 5.1 允许调用

Settings 未来可以调用：

    getListingPhotoStorageSummary()

来源：

    src/lib/storage/photos.ts

返回：

    provider
    photoCount
    totalSizeBytes

### 5.2 不允许调用

Settings 页面和组件不得直接调用：

    indexedDB
    indexedDB.open
    IDBDatabase
    IDBObjectStore
    OPFS
    Supabase Storage
    OSS / COS / OBS SDK

也不得直接读取：

    local-photo-provider.ts 内部实现细节

正确结构：

    Settings component
    → lib/storage/photos facade
    → active provider
    → IndexedDB implementation

### 5.3 是否接入 local-data.ts

当前 `src/lib/privacy/local-data.ts` 主要覆盖 localStorage keys。

照片保存在 IndexedDB，不在 localStorage 中。

因此不要把照片硬塞进 localStorage snapshot。

更合理的结构是：

    SettingsLocalDataPanel：继续展示 localStorage 数据
    SettingsPhotoDataPanel：单独展示 IndexedDB photo storage 状态

这样避免把不同存储介质混在一个表格里，用户也更容易理解。

## 六、建议文件范围

Phase 3D-4B 最小实现建议新增：

    src/components/settings-photo-data-panel.tsx

建议修改：

    src/app/settings/page.tsx
    src/content/zh-cn.ts

可能读取：

    src/lib/storage/photos.ts
    src/types/listing-photo.ts

不应修改：

    src/lib/storage/local-photo-provider.ts
    src/lib/storage/provider.ts
    src/components/listing-photo-panel.tsx
    src/components/listing-detail-view.tsx
    src/components/listing-card.tsx
    src/components/portfolio-list.tsx
    src/lib/lbs/*
    src/lib/algorithm/*

## 七、UI 结构建议

Settings 页面中建议顺序：

    WorkLocationSettingsPanel
    SettingsLocalDataPanel
    SettingsPhotoDataPanel

或：

    SettingsPhotoDataPanel
    SettingsLocalDataPanel

更推荐第一种：

    先展示已有设置项
    再展示 localStorage 数据
    再展示照片这种 IndexedDB 数据

SettingsPhotoDataPanel 结构：

    标题：看房照片｜本机保存
    描述：展示当前浏览器与设备中保存的看房照片数据状态
    指标卡：
        本机照片数量
        本机照片占用空间
        存储位置
    说明区：
        照片不会默认上传云端
        照片不会默认发送给 AI
        清除浏览器网站数据可能导致照片丢失
        后续会支持备份包导出 / 导入

Phase 3D-4B 暂不提供清除按钮。

## 八、文案建议

新增 zhCN 字段：

    zhCN.settingsPhotoDataPanel

建议字段：

    title
    description
    metrics.photoCount
    metrics.totalSize
    metrics.storageLocation
    values.localIndexedDb
    notices.localOnly
    notices.noCloudSync
    notices.noAi
    notices.browserDataWarning
    notices.backupLater
    states.loading
    states.loadFailed

示例文案：

    标题：
    看房照片｜本机保存

    描述：
    这里展示当前浏览器与设备中保存的看房照片数据状态。照片文件本体不保存在 localStorage 中，也不会默认上传云端。

    本地提示：
    这些照片仅保存在当前浏览器与设备中。更换设备、清除网站数据或使用无痕模式可能导致照片不可见。后续将通过备份包支持导出与导入。

## 九、验证标准

Phase 3D-4B 实现后应验证：

1. npm.cmd run build 通过。
2. git status clean。
3. Settings 页面出现“看房照片｜本机保存”面板。
4. 没有照片时显示 0 张 / 0 B。
5. 在 Detail 页添加照片后，Settings 照片数量增加。
6. 删除照片后，Settings 照片数量减少。
7. 面板显示照片不会默认上传云端。
8. 面板显示照片不会默认发送给 AI。
9. 不出现清除全部照片按钮。
10. 不改 Detail photo panel。
11. 不改 Portfolio。
12. 不改 L1 / L2。
13. 不新增 route。
14. 不直接访问 indexedDB。
15. 只通过 lib/storage/photos facade 读取 summary。

## 十、后续拆分建议

### Phase 3D-4B：Settings photo data visibility minimal implementation

只实现：

    SettingsPhotoDataPanel
    getListingPhotoStorageSummary()
    展示数量、大小、本机保存说明

不实现清除。

### Phase 3D-4C：photo storage clear-all contract plan

规划：

    clearAllListingPhotos()
    destructive action 边界
    Settings confirmation copy

### Phase 3D-4D：photo storage clear-all implementation

实现：

    provider clearAllPhotos
    facade clearAllListingPhotos
    Settings 清除全部本机照片按钮

### Phase 3E：JSON import foundation

开始处理 v2.0 的导出 / 导入闭环。

## 十一、本阶段结论

Detail 本机照片闭环已经完成后，Settings 必须逐步承担照片数据透明度职责。

但下一步不应一次性做清除、导出、导入和 ZIP。

正确顺序是：

    先展示照片状态
    再规划清除全部照片
    再实现清除全部照片
    再进入导出 / 导入

这符合 v2.0 的本地优先路线，也保持每次只做一件事的开发节奏。