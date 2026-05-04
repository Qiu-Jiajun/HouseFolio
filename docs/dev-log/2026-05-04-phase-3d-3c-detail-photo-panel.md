# HouseFolio 开发日志｜2026-05-04｜Phase 3D-3B / 3D-3C Detail Local Photo Panel

## 一、本阶段目标

本阶段目标是在 v2.0 本地优先产品路线下，为 Detail 页新增“看房照片｜本机保存”最小闭环。

该能力属于基础层，不属于 L1、L2 或 L3。

它的定位不是云端相册，不是房源图册，不是照片认证能力，而是用户主动添加的高敏看房资料本机持久化能力。

## 二、完成内容

### 1. 新增 Detail local photo panel

新增文件：

    src/components/listing-photo-panel.tsx

组件能力：

    添加本地照片
    保存到 lib/storage/photos facade
    从本地 provider 读取照片 Blob
    使用 object URL 在页面展示
    删除本机照片
    空状态展示
    文件类型校验
    单张大小限制
    加载 / 保存 / 删除错误提示

支持文件类型：

    image/jpeg
    image/png
    image/webp

单张大小限制：

    5 MB

### 2. Detail 页接入

修改文件：

    src/components/listing-detail-view.tsx

接入位置：

    ListingNotesPanel 之后
    ListingCommutePanel 之前

原因：

    看房照片属于用户实地看房资料，和笔记更接近。
    它不是 L1 通勤能力，也不是 L2 评分能力。
    放在 L1 之前可以避免被误解为空间计算或算法输出。

### 3. 中文文案接入

修改文件：

    src/content/zh-cn.ts

新增：

    zhCN.listingPhotoPanel

包含：

    标题
    描述
    本机保存提示
    添加照片按钮
    删除按钮
    空状态
    保存成功提示
    删除成功提示
    文件类型错误
    文件大小错误
    读取失败
    保存失败
    删除失败

用户可见文案仍集中在 zhCN 中，没有大量散落在 TSX 文件里。

## 三、关键边界

本阶段遵守以下边界：

    页面只调用 lib/storage/photos facade
    页面不直接操作 IndexedDB
    不接 Supabase Storage
    不接 OSS / COS
    不上传云端
    不接 AI
    不做照片分析
    不公开分享
    不做真房源认证
    不改 Portfolio
    不改 Settings
    不新增 route
    不改 L1 通勤计算
    不改 L2 评分算法
    不做图片压缩
    不做 EXIF 清理
    不做 ZIP 导出

## 四、手动回归结果

已执行浏览器手动回归。

验证页面：

    /portfolio/listing-001

验证结果：

    Detail 页出现“看房照片｜本机保存”面板
    面板位于笔记面板之后、L1 通勤面板之前
    空状态正常显示
    可选择 JPG / PNG / WebP 图片
    保存后照片能在当前页面显示
    刷新页面后照片仍然显示
    删除后照片从页面消失
    再次刷新后照片仍然不存在
    非图片文件能够触发类型限制提示
    大于 5MB 的图片能够触发大小限制提示

用户确认：

    都没有问题，很顺利。

## 五、验证命令

已执行：

    npm.cmd run build

结果：

    build 通过

代码提交：

    c8653f5 feat: add detail local photo panel

## 六、v2.0 对本阶段的解释

根据 v2.0，HouseFolio 是本地优先的私人找房决策工具。

本阶段不是在做普通图片上传，而是在完成基础层的高敏资料本地持久化能力：

    用户主动添加
    默认私有
    本地保存
    按 listingId 绑定
    刷新后仍可读取
    可删除
    不默认上传云端
    不进入 AI
    不公开分享

这符合 v2.0 的本地优先路线。

## 七、当前限制

当前仍未实现：

    Portfolio 首图展示
    Settings 照片数量与占用空间
    清除全部本机照片入口
    JSON / ZIP 导出照片
    JSON / ZIP 导入照片
    图片压缩
    缩略图生成
    EXIF 清理
    设置封面
    照片排序
    照片备注
    AI 照片分析

这些应后续分阶段处理。

## 八、建议下一步

建议下一步进入：

    Phase 3D-4A：Settings photo data visibility plan

目标：

    先写计划，不直接实现。
    明确 Settings 如何展示照片数量、照片占用空间、清除本机照片入口、本地优先说明。
    继续不做 ZIP 导出。
    继续不做云同步。
    继续不做 AI 照片分析。

原因：

    v2.0 已把本地优先和数据权利提升为产品形态的一部分。
    Detail 照片闭环完成后，Settings 应逐步成为本地数据权利中心。