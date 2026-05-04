# HouseFolio 开发日志｜2026-05-04｜Phase 3D-5A Local Photo Persistence Checkpoint

## 一、本阶段目标

本阶段目标是对 Phase 3D 本地照片持久化能力做阶段性 checkpoint。

本阶段只写收口文档，不修改业务代码，不新增 UI，不改 provider，不改 Settings，不改 Detail，不进入 Portfolio 首图、ZIP 导出、JSON 导入、Demo Mode 或快速捕获改造。

## 二、当前稳定点

当前最新稳定提交：

    0006e58 docs: log photo clear all regression
    55f3d00 feat: add settings photo clear action
    af69ba4 feat: add photo storage clear all
    51d91be docs: plan photo storage clear all
    a7dd5c0 docs: log settings photo data status
    8db47b8 feat: show settings photo data status
    c8653f5 feat: add detail local photo panel
    bd7bbc5 docs: realign roadmap with v2

当前状态：

    npm.cmd run build 通过
    git status clean

## 三、Phase 3D 的重新定位

v1.5 时，Phase 3D 可以被理解为“本地照片持久化专项”。

v2.0 后，Phase 3D 应重新定位为：

    本地优先基础层强化：
    高敏找房资料的本机持久化与数据权利前置

其中，看房照片不是普通图片上传功能，而是用户主动添加的高敏找房资料。

它必须遵守：

    用户主动选择
    默认私有
    本机持久化
    按 listingId 绑定
    不默认上传云端
    不默认进入 AI
    不公开分享
    不做房源图册
    不做真房源认证
    可查看状态
    可删除
    可清除

## 四、当前已经完成的能力闭环

Phase 3D 当前已经完成以下闭环：

    lib/storage provider contract
    → local IndexedDB photo provider
    → public photos facade
    → Detail 页添加本地照片
    → Detail 页展示本机照片
    → Detail 页删除单张照片
    → Settings 展示本机照片数量
    → Settings 展示本机照片占用空间
    → Settings 展示本地优先 / 不云同步 / 不进 AI 说明
    → Settings 清除全部本机照片
    → 浏览器手动回归
    → dev-log 收口

这说明 Phase 3D 已经完成了本地照片能力的基础层闭环。

## 五、已完成文件范围

### 5.1 类型与 provider

已完成：

    src/types/listing-photo.ts
    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts
    src/lib/storage/index.ts
    src/lib/storage/photos-contract-check.ts

当前能力：

    saveListingPhoto
    getListingPhotos
    getListingCoverPhoto
    getListingPhotoBlob
    getListingPhotoThumbnailBlob
    deleteListingPhoto
    clearListingPhotos
    clearAllListingPhotos
    getListingPhotoStorageSummary

### 5.2 Detail UI

已完成：

    src/components/listing-photo-panel.tsx
    src/components/listing-detail-view.tsx
    src/content/zh-cn.ts

当前能力：

    Detail 页显示“看房照片｜本机保存”
    支持 JPG / PNG / WebP
    单张限制 5MB
    保存到 IndexedDB provider
    刷新后仍显示
    可删除单张照片
    object URL 生命周期已处理
    不接 AI
    不接云端

### 5.3 Settings 数据权利

已完成：

    src/components/settings-photo-data-panel.tsx
    src/app/settings/page.tsx
    src/content/zh-cn.ts

当前能力：

    Settings 显示本机照片数量
    Settings 显示本机照片占用空间
    Settings 显示存储位置
    Settings 说明照片不默认上传云端
    Settings 说明照片不默认发送给 AI
    Settings 说明清除浏览器数据风险
    Settings 说明后续备份包路线
    Settings 可清除全部本机照片
    清除全部照片有 confirm 二次确认
    清除照片不误删 localStorage 数据

## 六、关键边界确认

Phase 3D 当前没有做：

    云端照片同步
    Supabase Storage
    OSS / COS / OBS
    AI 照片分析
    照片真实性认证
    公开分享照片
    房源图册
    平台图片库
    自动读取系统相册
    扫描本机文件夹
    批量导入照片
    ZIP 导出
    ZIP 导入
    Portfolio 首图
    Demo Mode 假照片线
    图片压缩
    缩略图生成
    EXIF 清理
    照片备注
    照片排序
    设置封面

这符合 v2.0 对本地优先基础层的要求。

## 七、数据删除边界

当前“清除全部本机照片”只删除：

    IndexedDB photo storage 中的 photos metadata
    IndexedDB photo storage 中的 original / thumbnail blob records

不删除：

    housefolio:listings
    housefolio:listing-notes
    housefolio:listing-ratings
    housefolio:listing-status-overrides
    housefolio:work-locations
    housefolio:commute-results
    mock listings
    Detail 笔记
    L1 通勤结果
    L2 评分输入

这已经通过浏览器手动回归确认。

## 八、当前验证结果

已验证：

    npm.cmd run build 通过
    git status clean
    Detail 添加照片正常
    Detail 刷新后照片仍显示
    Detail 删除单张照片正常
    Settings 显示照片数量正常
    Settings 显示照片占用空间正常
    Settings 清除全部本机照片正常
    取消 confirm 不会误清除
    确认 clear-all 后照片数量变为 0
    Detail 刷新后照片消失
    房源、笔记、评分、状态、通勤锚点、通勤结果未误删

## 九、当前限制

当前仍未实现：

    Portfolio 卡片首图
    JSON 导入
    ZIP 照片导出
    ZIP 照片导入
    备份包恢复
    图片压缩
    缩略图生成
    EXIF 清理
    设置封面
    照片排序
    照片备注
    Demo Mode 假照片
    快速捕获 + 深入研究录入改造
    L3 AI 基于脱敏数据生成 checklist / 对比建议

## 十、后续路线判断

从 v2.0 的优先级看，Phase 3D 之后不建议继续立刻做 Portfolio 首图。

原因：

    Portfolio 首图主要是展示增强。
    但 v2.0 更强调单设备本地优先下的数据权利闭环。
    导出 / 导入是本地优先产品形态的关键能力。
    当前已经能保存和清除照片，下一步更应补足“本地 JSON 导入”路线，而不是继续扩张照片展示。

因此建议下一阶段进入：

    Phase 3E：JSON import foundation

优先目标：

    让 Settings 不只支持导出本地 JSON，也能导入本地 JSON。
    先只处理 localStorage 数据。
    不处理照片 ZIP。
    不恢复 IndexedDB 照片。
    不做云同步。
    不接 AI。

## 十一、建议下一阶段拆分

### Phase 3E-0：JSON import boundary review

目标：

    只写文档。
    明确导入 JSON 的边界。
    明确哪些 key 可以导入。
    明确导入前确认文案。
    明确导入后刷新策略。
    明确不处理照片文件本体。

### Phase 3E-1：JSON import schema and safety plan

目标：

    设计导入数据校验方式。
    避免把任意 JSON 写进 localStorage。
    避免覆盖非 HouseFolio 数据。
    明确版本字段和容错策略。

### Phase 3E-2：Settings JSON import minimal implementation

目标：

    SettingsLocalDataPanel 增加导入 JSON。
    只导入 HouseFolio 已知 localStorage keys。
    导入前 confirm。
    导入后刷新 snapshot。
    build 通过。

### Phase 3E-3：JSON import manual regression

目标：

    导出 JSON
    清除本地数据
    导入 JSON
    验证房源、笔记、评分、状态、通勤锚点、通勤结果恢复
    确认照片文件本体不会恢复
    写 dev-log

## 十二、当前结论

Phase 3D 已经可以阶段性收口。

它完成了 v2.0 本地优先基础层中“看房照片本机持久化 + 数据可见 + 可清除”的最小闭环。

下一步应从照片展示扩张转向本地数据权利闭环：

    导出 / 导入

因此建议进入：

    Phase 3E-0：JSON import boundary review