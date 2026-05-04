# HouseFolio 架构计划｜Phase 3D-2A｜IndexedDB Photo Provider Implementation Plan

## 一、本阶段目标

本阶段目标是为 Phase 3D-2 的 IndexedDB local photo provider 最小实现制定实现计划。

本阶段只写架构计划，不修改业务代码，不实现 IndexedDB，不接 UI，不保存真实照片。

当前稳定点：

    d37a17e docs: log storage boundary scaffold
    fc4283a feat: scaffold local photo storage boundary

Phase 3D-1 已经建立：

    src/types/listing-photo.ts
    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts
    src/lib/storage/photos-contract-check.ts

Phase 3D-2 的任务是在不接 UI 的前提下，把 local-photo-provider 从 scaffold 推进到最小可用 IndexedDB provider。

## 二、核心原则

IndexedDB photo provider 必须遵守：

1. 照片文件本体保存在浏览器本机 IndexedDB。
2. localStorage 不保存图片本体。
3. 所有访问必须经过 lib/storage facade。
4. 页面不得直接操作 IndexedDB。
5. 照片按 listingId 与房源绑定。
6. 默认不上传云端。
7. 默认不进入 AI。
8. 不保存或展示 EXIF 细节。
9. 不做公开分享。
10. 不做真房源认证。

## 三、IndexedDB 设计

建议数据库名：

    housefolio-photo-storage

建议数据库版本：

    1

建议 object stores：

    photos
    blobs

### 3.1 photos store

用途：

    保存照片 metadata。

keyPath：

    id

建议索引：

    listingId
    isCover
    createdAt

metadata 字段对应 ListingPhoto：

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

说明：

    photos store 不保存 Blob 本体。
    photos store 只保存可展示、可统计、可索引的轻量元数据。

### 3.2 blobs store

用途：

    保存照片 Blob 与缩略图 Blob。

keyPath：

    objectKey

字段：

    objectKey
    photoId
    kind
    blob
    createdAt

kind 取值：

    original
    thumbnail

说明：

    original 保存照片原图或压缩后的主图。
    thumbnail 保存缩略图。
    Phase 3D-2 可以允许 thumbnailBlob 为空。
    如果没有 thumbnailBlob，getThumbnailBlob 可以返回 null。

## 四、id 与 objectKey 策略

### 4.1 photo id

建议生成方式：

    crypto.randomUUID()

兜底：

    photo-${Date.now()}-${Math.random().toString(36).slice(2)}

### 4.2 objectKey

建议格式：

    photo:${photoId}:original
    photo:${photoId}:thumbnail

这样可以避免直接暴露文件名，也方便删除时同步清理。

## 五、方法实现策略

### 5.1 savePhoto(input)

输入：

    SaveListingPhotoInput

行为：

1. 生成 photoId。
2. 生成 original objectKey。
3. 如果存在 thumbnailBlob，生成 thumbnail objectKey。
4. 写入 blobs store。
5. 写入 photos store。
6. 如果 input.isCover 为 true，需要把同 listingId 下其他照片的 isCover 改为 false。
7. 如果该 listingId 下原本没有任何照片，则第一张照片自动成为 cover。
8. 返回 ListingPhoto metadata。

边界：

    不压缩图片。
    不生成缩略图。
    不读取 EXIF。
    不上传云端。
    不调用 AI。

压缩与缩略图生成放到后续阶段。

### 5.2 getPhotos(listingId)

行为：

1. 使用 listingId index 查询 photos store。
2. 按 createdAt 升序或降序返回。

建议：

    MVP 阶段按 createdAt 升序返回即可。

### 5.3 getCoverPhoto(listingId)

行为：

1. 先查 listingId 下 isCover 为 true 的照片。
2. 如果没有 cover，但存在照片，则返回第一张。
3. 如果没有照片，返回 null。

### 5.4 getPhotoBlob(photoId)

行为：

1. 查询 photo metadata。
2. 读取 localObjectKey。
3. 从 blobs store 读取 original blob。
4. 返回 ListingPhotoBinary。
5. 如果任意一步缺失，返回 null。

### 5.5 getThumbnailBlob(photoId)

行为：

1. 查询 photo metadata。
2. 如果没有 thumbnailObjectKey，返回 null。
3. 从 blobs store 读取 thumbnail blob。
4. 返回 ListingPhotoBinary。
5. 如果任意一步缺失，返回 null。

### 5.6 deletePhoto(photoId)

行为：

1. 查询 photo metadata。
2. 删除 original blob。
3. 删除 thumbnail blob。
4. 删除 photo metadata。
5. 如果被删除的是 cover，需要为同 listingId 下剩余第一张照片设置 isCover = true。
6. 如果没有剩余照片，不做额外操作。

### 5.7 clearPhotosForListing(listingId)

行为：

1. 查询 listingId 下所有 photos。
2. 删除所有对应 blobs。
3. 删除所有 metadata。

### 5.8 getStorageSummary()

行为：

1. 遍历 photos store。
2. 统计 photoCount。
3. 汇总 totalSizeBytes。
4. 返回 ListingPhotoStorageSummary。

说明：

    只汇总 metadata 中的 sizeBytes。
    不需要读取所有 Blob 来计算体积，避免性能浪费。

## 六、事务边界

建议 savePhoto 使用 readwrite transaction 同时覆盖：

    photos
    blobs

目的：

    避免 metadata 与 blob 写入不一致。

deletePhoto / clearPhotosForListing 也应使用 readwrite transaction 同时覆盖：

    photos
    blobs

读取方法使用 readonly transaction。

## 七、浏览器边界

IndexedDB 只能在浏览器环境使用。

因此 provider 内部应检查：

    typeof indexedDB !== "undefined"

如果不可用，应抛出清晰错误或返回空状态。

由于当前 provider 未来只在 client component 或浏览器交互中被调用，Phase 3D-2 不需要接 server route。

但 build 阶段仍可能静态分析模块，因此不要在模块顶层直接访问 indexedDB。

正确做法：

    在函数执行时再访问 indexedDB。

错误做法：

    const request = indexedDB.open(...) 写在模块顶层。

## 八、错误处理策略

Phase 3D-2 的错误处理保持简单：

    IndexedDB 不可用：抛出 Error
    数据库打开失败：抛出 Error
    写入失败：抛出 Error
    读取缺失：返回 null 或空数组
    删除不存在 photoId：直接 return

不要把底层错误展示给用户，因为本阶段不接 UI。

未来 UI 层再把错误转换成用户可理解文案。

## 九、contract check 计划

更新：

    src/lib/storage/photos-contract-check.ts

目标：

    保持类型层面的调用检查。

不建议在 contract check 中真实执行 IndexedDB，因为 Next.js build / Node 环境没有浏览器 IndexedDB。

如果需要运行时 smoke test，应后续单独设计浏览器侧手动测试或 Playwright 测试。

Phase 3D-2 暂不引入 Playwright。

## 十、验证标准

Phase 3D-2 完成后应满足：

1. npm.cmd run build 通过。
2. git status clean。
3. 不新增 UI。
4. 不改 Portfolio / Detail / Settings。
5. 不改 zhCN 文案。
6. 不访问云端。
7. 不接 AI。
8. 不接 Supabase Storage。
9. 不新增 route。
10. local-photo-provider.ts 内没有模块顶层 indexedDB 调用。
11. photos facade API 不变。
12. getPhotos / getCoverPhoto / getStorageSummary 在无数据时能安全返回空状态。

## 十一、建议文件范围

Phase 3D-2 最小实现只建议修改：

    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos-contract-check.ts

如确实需要辅助类型，可修改：

    src/types/listing-photo.ts

不应修改：

    src/components/*
    src/app/*
    src/content/zh-cn.ts
    src/lib/local-store/*
    src/lib/algorithm/*
    src/lib/lbs/*

## 十二、后续阶段建议

Phase 3D-2B：

    实现 IndexedDB local photo provider。

Phase 3D-2C：

    做 provider no-UI regression check。

Phase 3D-3：

    Detail page local photo panel skeleton。

Phase 3D-4：

    Portfolio cover photo minimal display。

Phase 3D-5：

    Settings photo data visibility。

## 十三、本阶段结论

IndexedDB provider 应先作为 lib/storage 的内部实现存在，而不是页面功能。

正确顺序是：

    provider implementation
    no-UI verification
    Detail UI
    Portfolio cover
    Settings data rights

这样符合 v1.5 的产品与工程边界，也避免把照片能力写成临时 file input 预览。