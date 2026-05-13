# Phase 4B-3：Compare route scaffold regression / boundary check

## 0. 阶段定位

Phase 4B-3 是 Compare route scaffold 的回归与边界检查阶段。

本阶段只记录 Phase 4B-2 的最小路由骨架是否稳定，不新增功能代码。

## 1. 前置状态

前置 commit：

- e0193ae feat: add compare route scaffold

Phase 4B-2 已完成：

- 新增 `src/app/compare/page.tsx`
- 更新 `src/content/zh-cn.ts`
- 新增 `compareRouteCopy`
- `/compare` route 已出现在 build route table 中

## 2. 本阶段检查结果

### 2.1 路由文件检查

已确认：

- `src/app/compare` 存在
- `src/app/compare/page.tsx` 存在
- `src/content/zh-cn.ts` 中存在 `compareRouteCopy`
- `compareRouteCopy` 中存在“房源横向比较”中文标题

### 2.2 build 检查

已执行：

```powershell
npm.cmd run build

结果：

build 通过
Route table 中出现 /compare
当前 /compare 为动态 route，因为页面读取 searchParams
2.3 边界扫描

已对 src/app/compare/page.tsx 检查以下禁止项：

不导入 @/lib/local-store
不导入 @/lib/algorithm/comparison
不导入 @/lib/storage
不导入 @/lib/lbs
不导入 @/lib/ai
不使用 localStorage
不使用 sessionStorage
不使用 indexedDB
不使用 fetch
不使用 axios
不出现 DeepSeek / Supabase / AMAP / amap
不读取 Blob / objectUrl
不调用 listing lookup
不调用 comparison builder
不新增 compare selection key
不出现“最佳房源”“系统推荐”“推荐分”“替你决定”等措辞

结果：

通过

同时只对 src/content/zh-cn.ts 中的 compareRouteCopy block 做局部扫描，避免被该文件既有 Settings / 合规 / 迁移文案中的 localStorage / Supabase 命中干扰。

结果：

compareRouteCopy 局部扫描通过
3. 当前 /compare 行为边界

当前 /compare 只做：

读取 URL search params 中的 ids
解析逗号分隔的 listing ids
去重
统计当前选择数量
根据数量显示：
无选择
少于 2 套
超过 4 套
2–4 套占位状态
提供返回 Portfolio 入口
显示“辅助比较，不代表最终推荐”的定位说明

当前 /compare 不做：

不读取真实本地 listings
不调用 buildComparisonModels
不展示真实 ComparisonModel
不展示横向对比表
不展示照片
不读取笔记
不接 Portfolio checkbox
不新增 selection localStorage
不接 AI
不接高德
不接 Supabase
4. 当前产品边界

Compare 当前仍是 L2 comparison 的 route scaffold，不是完整 Compare UI。

它不构成：

推荐系统
AI 选房系统
最佳房源判断
真房源判断
房源平台能力
房源聚合能力

所有文案仍应使用：

横向比较
辅助比较
参考
不代表最终推荐

避免使用：

推荐分
最佳房源
最优选择
系统推荐
替你决定
5. 后续建议

下一步建议进入：

Phase 4B-4：Portfolio selection UI plan

但不要直接实现 Portfolio checkbox。

原因：

Portfolio selection 会改变真实用户操作路径
需要先评审 checkbox 位置、选择数量限制、移动端布局、卡片点击冲突
selection 第一版仍不应进入 localStorage
需要确认跳转 /compare?ids=... 的最小策略
6. 本阶段结论

Phase 4B-3 结论：

/compare 最小 route scaffold 已通过 build
路由存在
文案存在
当前 route 未越界读取真实数据
未新增 localStorage key
未接 AI / 高德 / Supabase
未读取照片 Blob
未把 Compare 写成推荐系统

Phase 4B-2 可以视为实现完成。