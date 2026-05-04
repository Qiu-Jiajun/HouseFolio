# HouseFolio 架构计划｜Phase 3D-4C｜Photo Storage Clear-All Contract Plan

## 一、本阶段目标

本阶段目标是为“清除全部本机照片”能力制定 provider contract 与 Settings destructive action 边界。

本阶段只写计划文档，不修改业务代码，不扩展 provider，不改 Settings 页面，不实现清除按钮，不删除任何照片。

当前稳定点：

    a7dd5c0 docs: log settings photo data status
    8db47b8 feat: show settings photo data status
    c8653f5 feat: add detail local photo panel

当前已完成：

    Detail 页可添加本机照片
    Detail 页可展示本机照片
    Detail 页可删除单张照片
    Settings 可展示本机照片数量
    Settings 可展示本机照片占用空间
    Settings 可说明照片不默认上传云端、不默认进入 AI

## 二、为什么需要 clear-all contract

当前照片 provider 已支持：

    savePhoto
    getPhotos
    getCoverPhoto
    getPhotoBlob
    getThumbnailBlob
    deletePhoto
    clearPhotosForListing
    getStorageSummary

但还没有：

    clearAllPhotos

因此 Settings 目前不能安全实现“清除全部本机照片”。

如果直接在 Settings 页面里遍历 IndexedDB 或调用 provider 内部实现，会破坏 v2.0 的工程边界：

    页面不得直接操作 IndexedDB
    页面不得直接依赖 local-photo-provider 内部实现
    页面只能通过 lib/storage/photos facade 访问照片能力

所以需要先扩展 provider contract，再由 facade 暴露业务函数，最后 Settings 调用该 facade。

## 三、建议新增能力

建议在 provider contract 中新增：

    clearAllPhotos: () => Promise<void>

在 public facade 中新增：

    clearAllListingPhotos(): Promise<void>

命名说明：

    clearAllPhotos 是 provider 内部接口，偏技术。
    clearAllListingPhotos 是业务 facade，偏产品语义。
    Settings 页面应调用 clearAllListingPhotos，不直接调用 provider。

## 四、实现边界

### 4.1 provider 层

修改文件：

    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts

provider contract 增加：

    clearAllPhotos

local IndexedDB provider 实现：

    打开 housefolio-photo-storage
    readwrite transaction 覆盖 photos / blobs stores
    删除 photos store 所有 metadata
    删除 blobs store 所有 Blob records
    transaction complete 后关闭 database

### 4.2 facade 层

photos.ts 增加：

    export async function clearAllListingPhotos(): Promise<void> {
      return activePhotoProvider.clearAllPhotos();
    }

### 4.3 Settings UI 层

修改文件：

    src/components/settings-photo-data-panel.tsx
    src/content/zh-cn.ts

SettingsPhotoDataPanel 后续新增：

    清除全部本机照片按钮
    confirm 二次确认
    清除成功提示
    清除失败提示
    清除后刷新 summary

注意：

    Settings 页面不得直接操作 IndexedDB。
    Settings 页面不得读取 local-photo-provider.ts。
    Settings 页面不得遍历 photos store。
    Settings 页面只调用 clearAllListingPhotos() 与 getListingPhotoStorageSummary()。

## 五、destructive action 文案边界

“清除全部本机照片”是不可逆操作，应使用明确但不恐吓的确认文案。

建议 confirm 文案：

    确认清除当前浏览器与设备中保存的全部看房照片吗？该操作不会删除房源、笔记、评分或通勤结果，但照片文件本体将从本机删除，且当前阶段无法恢复。

按钮文案：

    清除全部本机照片

成功提示：

    本机照片已清除。

失败提示：

    本机照片清除失败，请稍后重试。

说明文案：

    该操作只会清除当前浏览器与设备中的照片文件，不会删除 localStorage 中的房源、笔记、评分、状态、通勤锚点或通勤结果。

## 六、不能误删的数据

clearAllListingPhotos 只能删除 IndexedDB photo storage 中的：

    photos metadata
    blobs original records
    blobs thumbnail records

不能删除：

    housefolio:listings
    housefolio:listing-notes
    housefolio:listing-ratings
    housefolio:listing-status-overrides
    housefolio:work-locations
    housefolio:commute-results
    mock listings
    Settings localStorage snapshot
    Detail notes
    L1 commute results
    L2 score inputs

## 七、验证标准

Phase 3D-4D 实现后应验证：

1. npm.cmd run build 通过。
2. git status clean。
3. SettingsPhotoDataPanel 显示“清除全部本机照片”按钮。
4. 没有照片时点击清除不会报错。
5. Detail 页添加 1 张照片后，Settings 数量显示 1。
6. Settings 点击清除全部本机照片并确认后，数量变为 0。
7. 回到 Detail 页刷新后，照片不再显示。
8. 房源、笔记、评分、状态、通勤锚点、通勤结果仍然存在。
9. Settings localStorage snapshot 不被误清除。
10. 页面不直接访问 indexedDB。
11. SettingsPhotoDataPanel 只调用 lib/storage/photos facade。
12. 不新增 route。
13. 不接云端。
14. 不接 AI。
15. 不做 ZIP 导出。
16. 不做导入。

## 八、建议拆分

### Phase 3D-4D：photo storage clear-all provider implementation

目标：

    扩展 provider contract
    实现 clearAllPhotos
    facade 增加 clearAllListingPhotos
    不改 Settings UI

文件范围：

    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts
    src/lib/storage/photos-contract-check.ts

### Phase 3D-4E：Settings clear-all photo action implementation

目标：

    SettingsPhotoDataPanel 增加清除全部本机照片按钮
    增加 confirm
    增加成功 / 失败提示
    清除后刷新 summary

文件范围：

    src/components/settings-photo-data-panel.tsx
    src/content/zh-cn.ts

### Phase 3D-4F：clear-all manual regression

目标：

    浏览器手动验证不误删 localStorage 数据
    验证 Detail 照片被清除
    验证 Settings summary 更新
    写 dev-log

## 九、风险点

### 9.1 误删 localStorage

最大风险是把“清除全部照片”写成“清除全部 HouseFolio 数据”。

必须避免：

    clearLocalHouseFolioData()
    localStorage.clear()
    indexedDB.deleteDatabase() 之外误删其他数据库

当前建议不是删除整个 database，而是清空 photos / blobs stores。

### 9.2 用户误解

用户可能以为清除照片会删除房源。

因此文案必须明确：

    只清除照片文件本体
    不删除房源、笔记、评分、状态、通勤结果

### 9.3 后续导出 / 导入

清除全部照片不等于导出 / 导入。

备份包能力后续再做，不应混入 Phase 3D-4D / 4E。

## 十、本阶段结论

可以做“清除全部本机照片”，但必须先通过 provider contract 扩展，而不是让 Settings 页面直接碰 IndexedDB。

正确顺序是：

    先计划
    再 provider contract
    再 Settings destructive action
    再浏览器回归
    再 dev-log 收口

这样符合 v2.0 的本地优先数据权利方向，也能避免误删和边界破坏。