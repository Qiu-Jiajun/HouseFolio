# HouseFolio 开发日志｜2026-05-04｜Phase 3D-4B Settings Photo Data Visibility

## 一、本阶段目标

本阶段目标是在 v2.0 本地优先产品路线下，让 Settings 页面展示本机照片数据状态。

该能力属于基础层 / 数据权利层，不属于 L1、L2 或 L3。

本阶段只展示照片数据状态，不提供清除全部照片，不做 ZIP 导出，不做导入，不接云端，不接 AI。

## 二、完成内容

### 1. 新增 Settings photo data panel

新增文件：

    src/components/settings-photo-data-panel.tsx

组件能力：

    读取本机照片 storage summary
    展示本机照片数量
    展示本机照片占用空间
    展示存储位置
    展示本地优先说明
    展示不默认上传云端说明
    展示不默认发送给 AI 说明
    展示清除浏览器数据风险说明
    展示后续备份包导出 / 导入说明
    支持手动刷新照片状态

### 2. Settings 页面接入

修改文件：

    src/app/settings/page.tsx

接入内容：

    SettingsPhotoDataPanel

当前 Settings 页面顺序：

    WorkLocationSettingsPanel
    SettingsLocalDataPanel
    SettingsPhotoDataPanel

说明：

    localStorage 数据与 IndexedDB 照片数据分开展示。
    没有把照片硬塞进 localStorage snapshot。
    这更符合 v2.0 的本地优先透明度要求。

### 3. 中文文案接入

修改文件：

    src/content/zh-cn.ts

新增：

    zhCN.settingsPhotoDataPanel

包含：

    标题
    描述
    刷新按钮
    本机照片数量
    本机照片占用空间
    存储位置
    本地数据库说明
    不默认上传云端说明
    不默认发送给 AI 说明
    清除浏览器数据风险说明
    后续备份包说明
    读取失败提示

用户可见文案继续集中在 zhCN 中。

## 三、技术边界

本阶段遵守以下边界：

    SettingsPhotoDataPanel 只调用 getListingPhotoStorageSummary()
    页面不直接操作 IndexedDB
    页面不调用 local-photo-provider 内部实现
    不接 Supabase Storage
    不接 OSS / COS / OBS
    不接 AI
    不接 LBS
    不新增 route
    不改 Detail photo panel
    不改 Portfolio
    不改 L1 通勤计算
    不改 L2 评分算法
    不提供清除全部照片按钮
    不实现 ZIP 导出
    不实现导入

## 四、验证结果

已执行：

    npm.cmd run build

结果：

    build 通过

已提交：

    8db47b8 feat: show settings photo data status

提交后状态：

    git status clean

## 五、浏览器手动回归

已在浏览器检查 Settings 页面。

验证结果：

    Settings 页面出现“看房照片｜本机保存”面板
    面板显示本机照片数量
    面板显示本机照片占用空间
    面板显示存储位置
    面板显示不默认上传云端
    面板显示不发送给 AI
    点击“刷新照片状态”没有报错
    如果 Detail 页曾保存照片，数量和占用空间可正确显示
    如果删除所有照片，显示 0 张 / 0 B
    页面没有“清除全部照片”按钮

用户确认：

    都没问题。

## 六、v2.0 对本阶段的解释

v2.0 明确 HouseFolio 是本地优先的私人找房决策工具。

因此，照片数据状态不应只藏在浏览器 IndexedDB 中，而应在 Settings 中被用户看见。

本阶段完成的是：

    本机照片数据可见性
    本地优先说明
    云端不同步说明
    AI 不使用照片说明
    后续备份包路线提示

这让 Detail 照片面板从“能保存照片”升级为“用户知道照片在哪里、是否上传、是否进 AI、如何理解单设备边界”。

## 七、当前限制

当前仍未实现：

    清除全部本机照片
    provider clearAllPhotos contract
    Settings 清除照片按钮
    JSON / ZIP 导出照片
    JSON / ZIP 导入照片
    Portfolio 首图展示
    图片压缩
    缩略图生成
    EXIF 清理
    设置封面
    照片排序
    照片备注
    AI 照片分析

## 八、建议下一步

建议下一步进入：

    Phase 3D-4C：photo storage clear-all contract plan

目标：

    只写计划。
    明确是否需要 clearAllListingPhotos()
    明确 destructive action 的确认文案和边界。
    明确 Settings 清除全部本机照片的验证标准。
    不直接实现清除按钮。

也可以选择先暂停照片线，进入：

    Phase 3E-0：JSON import boundary review

但从当前闭环连续性看，先规划 clear-all 更自然。