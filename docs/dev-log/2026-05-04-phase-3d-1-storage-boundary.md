# HouseFolio 开发日志｜2026-05-04｜Phase 3D-1 Storage Boundary Scaffold

## 一、本阶段目标

本阶段目标是根据 v1.5 的本地照片持久化方向，先建立 HouseFolio 照片能力的 storage 边界。

本阶段只做封装层骨架，不接 UI，不实现 IndexedDB，不保存真实照片，不改 Portfolio、Detail 或 Settings 页面。

## 二、完成内容

### 1. 新增照片类型

新增文件：

    src/types/listing-photo.ts

新增类型包括：

    ListingPhotoStorageProviderKind
    ListingPhoto
    SaveListingPhotoInput
    ListingPhotoStorageSummary
    ListingPhotoBinary

这些类型用于描述未来按 listingId 绑定的本机看房照片。

当前 provider kind 只定义为：

    localIndexedDb

这只是接口命名，不代表本阶段已经实现 IndexedDB。

### 2. 新增 storage provider contract

新增文件：

    src/lib/storage/provider.ts

定义：

    ListingPhotoStorageProvider
    ListingPhotoStorageRegistry

provider contract 规定未来页面不得直接操作 IndexedDB、OPFS、Supabase Storage、OSS 或 COS。

页面未来只能通过业务函数访问照片能力，例如：

    saveListingPhoto
    getListingPhotos
    getListingCoverPhoto
    deleteListingPhoto
    clearListingPhotos
    getListingPhotoStorageSummary

### 3. 新增 local photo provider scaffold

新增文件：

    src/lib/storage/local-photo-provider.ts

当前只是 scaffold：

    getPhotos 返回空数组
    getCoverPhoto 返回 null
    getPhotoBlob 返回 null
    getThumbnailBlob 返回 null
    getStorageSummary 返回 0
    savePhoto / deletePhoto 暂时抛出 not implemented

这保证本阶段不伪装成已经完成照片保存能力。

### 4. 新增 public storage facade

新增文件：

    src/lib/storage/photos.ts

该文件提供统一的照片业务函数入口。

后续 Detail / Portfolio / Settings 页面如果需要照片能力，应调用该 facade，而不是直接调用底层 provider。

### 5. 更新 storage index

更新文件：

    src/lib/storage/index.ts

保留原有：

    getStorageProviderName()

并新增 photo storage 相关导出。

这符合迁移友好封装原则，没有破坏已有 storage 占位导出。

### 6. 新增 contract check

新增文件：

    src/lib/storage/photos-contract-check.ts

用于 TypeScript 编译期检查 photo storage facade 的基本调用关系。

当前 contract check 不执行真实保存，不访问 IndexedDB，不产生浏览器副作用。

## 三、验证结果

已执行：

    npm.cmd run build

结果：

    build 通过

已提交：

    fc4283a feat: scaffold local photo storage boundary

提交后状态：

    git status clean

## 四、边界确认

本阶段没有做：

    IndexedDB 实现
    OPFS 实现
    照片上传 UI
    照片预览 UI
    Detail 照片面板
    Portfolio 首图展示
    Settings 照片统计
    照片导出 zip
    云端同步
    Supabase Storage
    OSS / COS / OBS
    AI 照片分析

## 五、与 v1.5 的关系

v1.5 明确要求：

    本地优先不等于每次重新上传。
    正确设计是一次添加，长期本机持久化，按 listingId 私有绑定。

本阶段完成的是第一步：

    页面不得直接碰底层存储。
    照片能力必须先经过 lib/storage 封装。

## 六、建议下一步

建议下一步进入：

    Phase 3D-2：local photo provider IndexedDB design and minimal implementation

但在写 IndexedDB 代码前，应先做一个极小 implementation plan，明确：

    IndexedDB 数据库名
    object store 设计
    photo metadata 与 blob 是否分 store
    id 生成策略
    listingId 查询索引
    clear / delete 行为
    StorageSummary 如何计算
    不保存 EXIF 细节
    不进入 AI
    不接 UI