# Phase 4B-6：Portfolio selection regression / boundary check

## 0. 阶段定位

Phase 4B-6 是 Portfolio selection minimal implementation 的回归与边界检查阶段。

本阶段只记录 Phase 4B-5 的实现是否稳定，不新增功能代码。

## 1. 前置状态

前置 commit：

- 9a06406 feat: add portfolio compare selection

Phase 4B-5 已完成：

- Portfolio 页面支持临时选择 2–4 套候选房源；
- 显示已选择数量；
- 支持清空选择；
- 未满 2 套时“比较已选房源”不可用；
- 达到 4 套后不允许继续选择第 5 套；
- 点击后跳转 `/compare?ids=...`；
- selection 不进入 localStorage；
- 不接 AI / 高德 / Supabase；
- 不读取照片 Blob；
- 不调用 ComparisonModel builder。

## 2. 自动检查结果

已执行静态边界扫描，确认：

- `src/components/portfolio-list.tsx` 使用 React 本地状态 `selectedListingIds`；
- `src/components/portfolio-list.tsx` 使用 `useRouter` 跳转 `/compare?ids=...`；
- 第一版最少选择 2 套；
- 第一版最多选择 4 套；
- 达到 4 套后不继续追加 selection；
- `src/components/listing-card.tsx` 只新增 selection UI props；
- `src/app/compare/page.tsx` 仍保持 route scaffold；
- `src/content/zh-cn.ts` 中存在 `portfolioCompareSelectionCopy`。

已确认未出现：

- `localStorage`
- `sessionStorage`
- `indexedDB`
- `fetch`
- `axios`
- DeepSeek
- Supabase
- AMAP / amap
- `@/lib/storage`
- `@/lib/lbs`
- `@/lib/ai`
- `housefolio:compare`
- `compare-selection`
- `selected-listings`
- “最佳房源”
- “系统推荐”
- “推荐分”
- “替你决定”

## 3. Build 检查

已执行：

```powershell
npm.cmd run build

结果：

build 通过；
/compare route 仍在 route table 中；
Portfolio 页面正常参与构建；
TypeScript 检查通过。
4. 浏览器手动验证

已手动验证：

Portfolio 页面能正常打开；
房源卡片出现“选择比较”按钮；
选择 1 套后，按钮变为“已选择”，已选数量更新；
选择 2 套后，“比较已选房源”按钮可点击；
选择到 4 套后，其他未选房源不能继续选择；
点击“清空选择”后，已选数量回到 0；
重新选择 2 套后，点击“比较已选房源”；
页面跳转到 /compare?ids=...；
Compare 页面显示已收到待比较房源；
Compare 页面仍提示“辅助比较，不代表最终推荐”。
5. 当前能力边界

当前 Portfolio selection 只做：

临时选择 listingId；
前端运行时状态；
生成 URL query；
跳转 Compare route scaffold。

当前不做：

不持久化 selection；
不新增 localStorage key；
不写入 Settings 数据权利；
不读取真实 ComparisonModel；
不展示横向对比表；
不读取照片；
不读取完整笔记；
不调用 AI；
不调用高德；
不调用 Supabase。
6. 产品边界

当前 Compare 仍是 L2 comparison 主线的一部分，但还只是 route scaffold + Portfolio 临时选择入口。

它不是：

推荐系统；
AI 选房系统；
最佳房源判断；
真房源判断；
房源平台能力；
房源聚合能力。

所有文案仍保持：

横向比较；
辅助比较；
不代表最终推荐。
7. 后续建议

下一步建议进入：

Phase 4B-7：Compare reads selected listing plan

该阶段只评审 /compare 如何根据 URL ids 读取本地 listings，并调用 Phase 4A 已建立的 ComparisonModel builder。

不要直接实现真实 Compare table。

8. 本阶段结论

Phase 4B-6 结论：

Portfolio selection minimal implementation 已通过自动检查；
build 通过；
浏览器手动回归通过；
selection 没有进入 localStorage；
未接 AI / 高德 / Supabase；
未读取照片 Blob；
未把 Compare 写成推荐系统；
可以认为 Phase 4B-5 已稳定收口。