# HouseFolio 开发日志｜2026-05-04｜Phase 3D-2B IndexedDB Photo Provider

## 一、本阶段目标

本阶段目标是实现最小 IndexedDB local photo provider。

本阶段仍然不接 UI，不修改 Portfolio、Detail、Settings，不保存任何用户可见照片，不接云端，不接 AI。

## 二、修改范围

本阶段只修改：

    src/lib/storage/local-photo-provider.ts

未修改：

    src/components/*
    src/app/*
    src/content/zh-cn.ts
    src/lib/local-store/*
    src/lib/algorithm/*
    src/lib/lbs/*
    src/types/listing-photo.ts
    src/lib/storage/photos.ts
    src/lib/storage/provider.ts

## 三、完成内容

### 1. IndexedDB 数据库边界

新增本地数据库：

    housefolio-photo-storage

版本：

    1

object stores：

    photos
    blobs

photos store 用于保存照片 metadata。

blobs store 用于保存照片 Blob 与可选缩略图 Blob。

### 2. photos metadata store

photos store 使用：

    keyPath: id

索引包括：

    listingId
    isCover
    createdAt

metadata 对应 ListingPhoto，包括：

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

### 3. blobs store

blobs store 使用：

    keyPath: objectKey

保存：

    objectKey
    photoId
    kind
    blob
    createdAt

kind 当前包括：

    original
    thumbnail

### 4. 已实现 provider 方法

已实现：

    savePhoto
    getPhotos
    getCoverPhoto
    getPhotoBlob
    getThumbnailBlob
    deletePhoto
    clearPhotosForListing
    getStorageSummary

### 5. cover photo 规则

当前规则：

    如果 input.isCover 为 true，则同 listingId 下其他照片取消 cover。
    如果该 listingId 下没有照片，则第一张自动成为 cover。
    删除 cover 后，会把同 listingId 下剩余第一张照片设为 cover。
    如果没有剩余照片，不做额外操作。

### 6. Blob 与 metadata 分离

本阶段实现了 metadata 与 Blob 分离：

    photos store 保存 metadata。
    blobs store 保存 original / thumbnail Blob。

这样为后续 Settings 统计、备份包、缩略图展示和清除操作保留空间。

### 7. 浏览器边界

IndexedDB 访问没有放在模块顶层。

provider 在函数执行时才访问：

    indexedDB

如果当前环境没有 IndexedDB，则抛出：

    IndexedDB is not available in this environment.

这避免了 Next.js build / server import 阶段直接访问浏览器 API。

## 四、验证结果

已执行：

    npm.cmd run build

结果：

    build 通过

已提交：

    da5d4ab feat: implement indexeddb photo provider

提交后状态：

    git status clean

## 五、边界确认

本阶段没有做：

    Detail 照片面板
    Portfolio 首图展示
    Settings 照片统计
    图片压缩
    缩略图生成
    EXIF 清理
    备份包导出
    云端同步
    Supabase Storage
    OSS / COS / OBS
    AI 照片分析
    照片真实性判断

## 六、当前限制

当前 provider 只具备底层保存、读取、删除能力。

还没有：

    浏览器 UI 触发入口
    手动选择照片面板
    图片预览
    object URL 生命周期管理
    用户友好的错误提示
    Settings 中的照片数据权利入口
    运行时浏览器 smoke test

## 七、建议下一步

建议进入：

    Phase 3D-2C：photo provider no-UI regression check

目标：

    在不接 UI 的前提下，做静态边界检查与 build 验证，确认：
    - local-photo-provider.ts 没有模块顶层 indexedDB.open；
    - 没有引入 cloud / Supabase / AI / LBS；
    - photos facade API 未变；
    - build 通过；
    - git clean。

不建议立刻接 Detail UI。先做 no-UI regression checkpoint 更稳。