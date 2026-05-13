# Phase 4B-9：Compare selected listings regression / boundary check

## 0. 阶段定位

Phase 4B-9 是 Compare selected listings minimal implementation 的回归与边界检查阶段。

本阶段只记录 Phase 4B-8 的实现是否稳定，不新增功能代码。

## 1. 前置状态

前置 commit：

- dd69c0b feat: show selected listing comparison preview

Phase 4B-8 已完成：

- 新增 `src/components/compare-selected-listings-panel.tsx`
- 修改 `src/app/compare/page.tsx`
- 更新 `src/content/zh-cn.ts`
- `/compare` 可以根据 URL ids 读取本机房源数据
- Client Component 调用 `getAllClientListings()`
- Client Component 调用 `buildComparisonInputs()`
- 页面展示结构化 ComparisonModel 预览
- 当前仍未实现完整横向表

## 2. 自动检查结果

已执行静态边界扫描，确认：

- `CompareSelectedListingsPanel` 是 Client Component
- 使用 `getAllClientListings()` 读取本机 listings
- 使用 `buildComparisonInputs()` 生成 ComparisonModel preview
- 根据 URL ids 过滤本机 listings
- 记录 missing ids
- 处理无 ids、超过 4 个 ids、有效房源不足 2 套等状态
- `src/app/compare/page.tsx` 仍只负责解析 URL ids 并传入 client panel

已确认未出现：

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

- `/compare` 无 ids 时显示无选择空状态
- `/compare?ids=listing-001` 显示有效房源不足 2 套
- `/compare?ids=listing-001,listing-002` 显示结构化比较预览
- `/compare?ids=listing-001,missing-id` 显示缺失数量提示，且有效房源不足 2 套时不展示比较预览
- 超过 4 个 ids 时提示第一版最多比较 4 套
- 从 Portfolio 选择 2 套后，可以跳转到 `/compare?ids=...`
- Compare 页面展示月租、通勤、参考评分、面积、户型、生活圈、缺失字段、风险信号
- Compare 页面保留“辅助比较，不代表最终推荐”的产品定位
- 未发现 AI 分析、高德重新计算、Supabase 调用或照片本体展示

## 5. 当前能力边界

当前 Compare selected listings preview 只做：

- 从 URL 读取 listing ids
- 在客户端读取本机 listings
- 过滤有效 listings
- 统计 missing ids
- 调用 ComparisonModel builder
- 展示结构化 summary preview

当前不做：

- 不持久化 selection
- 不新增 localStorage key
- 不写入 Settings 数据权利
- 不展示完整横向表
- 不读取完整笔记原文
- 不读取照片 Blob
- 不读取视频
- 不调用 AI
- 不调用高德
- 不调用 Supabase
- 不上传用户数据到服务端

## 6. 产品边界

当前 Compare 仍是 L2 comparison 主线的一部分。

它不是：

- 推荐系统
- AI 选房系统
- 最佳房源判断
- 真房源判断
- 房源平台能力
- 房源聚合能力

所有文案仍保持：

- 横向比较
- 辅助比较
- 结构化预览
- 不代表最终推荐

## 7. 后续建议

下一步建议进入：

- Phase 4B-10：Compare table UI plan

该阶段只评审横向表 UI，不直接实现。

原因：

- 当前 preview 已证明 URL ids → local listings → ComparisonModel 的链路可用
- 横向表涉及移动端滚动、字段分组、空值展示和风险信号展示
- 不应在当前阶段继续扩张 UI 表达层

## 8. 本阶段结论

Phase 4B-9 结论：

- Compare selected listings minimal implementation 已通过自动检查
- build 通过
- 浏览器手动回归通过
- 未新增 localStorage key
- 未接 AI / 高德 / Supabase
- 未读取照片 Blob
- 未把 Compare 写成推荐系统
- Phase 4B-8 可以视为稳定收口