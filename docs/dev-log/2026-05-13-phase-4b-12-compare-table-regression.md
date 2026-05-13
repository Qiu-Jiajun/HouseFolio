# Phase 4B-12：Compare table regression / boundary check

## 0. 阶段定位

Phase 4B-12 是 Compare table minimal implementation 的回归与边界检查阶段。

本阶段只记录 Phase 4B-11 的实现是否稳定，不新增功能代码。

## 1. 前置状态

前置 commit：

- 15a6938 feat: add compare table

Phase 4B-11 已完成：

- 新增 `src/components/compare-table.tsx`
- 修改 `src/components/compare-selected-listings-panel.tsx`
- 更新 `src/content/zh-cn.ts`
- Compare 页面在 selected listings preview 基础上展示横向对比表
- 表格接收 `ComparisonInput[]`
- 表格不读取本地数据
- 表格不调用 builder
- 表格不接 AI / 高德 / Supabase
- 表格不读取照片 Blob

## 2. 自动检查结果

已执行静态边界扫描，确认：

- `CompareTable` 只接收 `models: ComparisonInput[]`
- `CompareTable` 不导入 `@/lib/local-store`
- `CompareTable` 不调用 `getAllClientListings`
- `CompareTable` 不调用 `buildComparisonInputs`
- `CompareTable` 不导入 `@/lib/storage`
- `CompareTable` 不导入 `@/lib/lbs`
- `CompareTable` 不导入 `@/lib/ai`
- `CompareTable` 具备横向滚动容器
- `CompareTable` 具备最小表格宽度
- `CompareTable` 包含以下分组：
  - 基础信息
  - L1 空间信息
  - L2 参考比较
  - 用户补充资料
  - 缺失字段与风险信号
- `CompareSelectedListingsPanel` 只负责读取本机 listings、生成 ComparisonModel，并传给 `CompareTable`
- `src/app/compare/page.tsx` 仍然只是 route shell

已确认未出现：

- localStorage 新 key
- sessionStorage
- indexedDB
- fetch
- axios
- DeepSeek
- Supabase
- AMAP / amap
- `@/lib/storage`
- `@/lib/lbs`
- `@/lib/ai`
- 照片 Blob / object URL / base64
- `housefolio:compare`
- `compare-selection`
- `selected-listings`
- “最佳房源”
- “系统推荐”
- “推荐分”
- “替你决定”

## 3. Build 检查

已执行：

npm.cmd run build

结果：

- build 通过
- `/compare` route 仍在 route table 中
- TypeScript 检查通过

## 4. 浏览器手动验证

已手动验证：

- 从 Portfolio 选择 2 套房源后，可进入 `/compare?ids=...`
- 从 Portfolio 选择 3 套房源后，可进入 `/compare?ids=...`
- 从 Portfolio 选择 4 套房源后，可进入 `/compare?ids=...`
- Compare 页面出现“横向对比表”
- 表格顶部显示每套房源标题、状态、查看详情入口
- 表格包含：
  - 基础信息
  - L1 空间信息
  - L2 参考比较
  - 用户补充资料
  - 缺失字段与风险信号
- 窄屏下表格可以横向滚动
- 缺失字段和风险信号以标签形式展示
- 页面保留“辅助比较，不代表最终推荐”的定位
- 未发现照片本体展示
- 未发现 AI 分析
- 未发现高德重新计算
- 未发现 Supabase 或云端行为
- 未发现“最佳房源”“系统推荐”“推荐分”“替你决定”等措辞

## 5. 当前能力边界

当前 Compare table 只做：

- 渲染已有 ComparisonModel
- 将 2–4 套候选房源按相同字段横向展开
- 展示基础信息、L1、L2、用户补充资料摘要、缺失字段与风险信号
- 提供查看详情入口
- 保留辅助比较定位

当前不做：

- 不持久化 selection
- 不新增 localStorage key
- 不保存 compare history
- 不读取照片 Blob
- 不读取完整笔记原文
- 不重新计算通勤
- 不调用 AI
- 不调用高德
- 不调用 Supabase
- 不上传用户数据到服务端

## 6. 产品边界

当前 Compare table 仍属于 L2 comparison UI。

它不是：

- 推荐系统
- AI 选房系统
- 最佳房源判断
- 真房源认证
- 房源平台能力
- 房源聚合能力

所有文案仍保持：

- 横向比较
- 辅助比较
- 参考评分
- 维度拆解
- 不代表最终推荐

## 7. 后续建议

下一步建议进入：

- Phase 4B-13：Phase 4B closing checkpoint

原因：

- `/compare` route scaffold 已完成
- Portfolio selection 已完成
- selected listings preview 已完成
- compare table 已完成
- Phase 4B 已经具备一条完整 L2 compare UI 主链路

Phase 4B-13 应只写收口文档，不继续扩 UI。

## 8. 本阶段结论

Phase 4B-12 结论：

- Compare table minimal implementation 已通过自动检查
- build 通过
- 浏览器手动回归通过
- 未新增 localStorage key
- 未接 AI / 高德 / Supabase
- 未读取照片 Blob
- 未把 Compare 写成推荐系统
- Phase 4B-11 可以视为稳定收口