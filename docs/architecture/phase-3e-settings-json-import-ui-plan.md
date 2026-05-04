# Phase 3E-3｜Settings JSON 导入 UI 计划

## 1. 阶段目标

Phase 3E-3 用于定义 Settings 页面中的 JSON 导入 UI 方案。

本阶段只写规划文档，不实现 UI，不添加文件选择器，不调用导入 helper，不写入 localStorage，也不处理照片、ZIP、AI、地图、高德、Supabase 或任何云同步能力。

本阶段的目标是先把用户流程、文案、确认行为、错误状态和实现边界写清楚，避免后续把“结构化 JSON 导入”误扩张成照片备份包、云端同步或第三方平台数据导入。

## 2. 产品定位

JSON 导入属于 HouseFolio v2.0 的本地优先数据权利层。

它解决的是：

- 用户从当前浏览器导出 HouseFolio 本地结构化数据；
- 用户在另一个浏览器或设备上手动导入 JSON；
- 用户在单设备本地优先架构下拥有迁移和恢复路径。

它不是：

- 云同步；
- 账号备份；
- 多设备实时同步；
- 照片恢复；
- 第三方平台导入；
- AI 辅助导入；
- 房源网站抓取；
- 公开房源库。

## 3. 当前技术基础

已经完成：

- Phase 3E-0：JSON import boundary review；
- Phase 3E-1：纯函数导入 helper scaffold；
- Phase 3E-2：JSON import helper checkpoint。

已有 helper 文件：

- `src/lib/privacy/local-data-import.ts`
- `src/lib/privacy/local-data-import-contract-check.ts`

已有 helper 函数：

- `parseHouseFolioLocalDataImportJson`
- `applyHouseFolioLocalDataImportPayload`

当前允许导入的 localStorage keys：

- `housefolio:listings`
- `housefolio:listing-notes`
- `housefolio:listing-ratings`
- `housefolio:listing-status-overrides`
- `housefolio:work-locations`
- `housefolio:commute-results`

## 4. 未来 UI 所在位置

JSON 导入口应放在现有 Settings 本地数据管理区域，优先考虑放在：

- `src/components/settings-local-data-panel.tsx`

不应放在：

- Portfolio；
- Detail；
- Add Listing；
- AppNav；
- ComplianceFooter；
- 新路由；
- 只有弹窗、没有 Settings 入口的隐藏功能。

原因：

Settings 当前已经是本地数据权利的集中入口，包括：

- 查看本地数据；
- 导出本地 JSON；
- 清除本机结构化数据；
- 查看照片本机保存状态；
- 清除全部本机照片。

JSON 导入应和这些功能在同一数据权利区域内出现。

## 5. 建议 UI 结构

建议区块标题：

导入本地 JSON

建议说明文案：

从你之前导出的 HouseFolio JSON 文件中恢复本机结构化数据。导入会覆盖当前本机保存的房源、笔记、评分、状态、通勤锚点和通勤结果，但不会恢复看房照片。

建议控件：

- `.json` 文件选择；
- 导入按钮；
- 当前数据备份提醒；
- 写入前确认；
- 成功提示；
- 失败提示；
- 可选的已忽略字段提示。

建议按钮文案：

导入 HouseFolio JSON

建议文件选择区域提示：

导入前建议先导出当前本机数据作为备份。JSON 导入只恢复结构化数据，不包含本机照片文件。

## 6. 用户流程

未来实现时，预期流程如下：

1. 用户打开 Settings。
2. 用户进入本地数据管理区域。
3. 用户选择一个本地 JSON 文件。
4. 浏览器读取该 JSON 文件。
5. 使用 `parseHouseFolioLocalDataImportJson` 解析文件内容。
6. 如果解析失败，显示用户可理解的错误信息，不写入任何数据。
7. 如果解析成功，显示识别到的可导入数据项和覆盖提醒。
8. 用户二次确认。
9. 调用 `applyHouseFolioLocalDataImportPayload` 写入已识别的白名单 key。
10. 刷新 Settings 本地数据快照。
11. 显示导入成功提示。
12. 如有必要，提示用户刷新页面。

## 7. 确认行为

导入必须要求用户明确确认。

建议确认文案：

导入这个 JSON 文件会覆盖当前本机保存的 HouseFolio 结构化数据，包括房源、笔记、评分、状态、通勤锚点和通勤结果。此操作不会恢复或导入本机照片。建议你先导出当前数据作为备份。是否继续？

确认应发生在：

- 用户已选择文件；
- JSON 已成功解析；
- 至少识别到一个可导入 key；

确认必须发生在：

- 任何 localStorage 写入之前。

## 8. 错误状态

未来 UI 至少需要处理以下状态：

### 8.1 未选择文件

提示：

请选择一个 HouseFolio JSON 文件。

### 8.2 JSON 格式无效

提示：

导入文件不是有效的 JSON。

### 8.3 文件结构无效

提示：

导入文件结构不符合 HouseFolio 本地数据格式。

### 8.4 没有可导入字段

提示：

导入文件中没有可识别的 HouseFolio 本地数据键。

### 8.5 浏览器读取失败

提示：

文件读取失败，请重新选择 JSON 文件。

### 8.6 写入失败

提示：

导入失败，请确认浏览器允许本地存储。

### 8.7 导入成功

提示：

导入成功。本机结构化数据已更新。

## 9. 成功状态

导入成功后，Settings 应刷新：

- 本地数据快照；
- key 数量；
- 本地数据导出状态；
- 可选的当前页面提示信息。

第一版可以保持简单，只显示：

导入成功。已更新本机结构化数据。看房照片不包含在 JSON 导入中，如需迁移照片，请等待后续备份包功能。

未来可选显示：

- 已导入 key 数量；
- 已跳过 key 数量；
- 已忽略未知 key 数量。

## 10. 与照片能力的边界

UI 必须明确说明：

- JSON 导入不包含照片；
- 当前本机照片存储在浏览器 IndexedDB 中；
- 导入 JSON 不应删除当前已有照片；
- 照片迁移属于后续 ZIP 备份包阶段。

不得使用以下误导性说法：

- 恢复全部数据；
- 导入完整备份；
- 导入照片；
- 恢复 Portfolio 图片；
- 一键迁移全部资料。

推荐使用：

- 导入本地 JSON；
- 恢复结构化数据；
- 看房照片不包含在 JSON 导入中。

## 11. 后续实现允许修改的文件

未来真正实现 UI 时，允许考虑修改：

- `src/components/settings-local-data-panel.tsx`
- `src/lib/privacy/local-data-import.ts`
- `src/content/zh-cn.ts`

如有必要，可新增或微调：

- `src/lib/privacy/local-data.ts`

但应避免触碰以下文件：

- `src/lib/storage/local-photo-provider.ts`
- `src/lib/storage/photos.ts`
- `src/components/listing-photo-panel.tsx`
- `src/components/listing-card.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/portfolio/[id]/page.tsx`
- `src/app/api/lbs/commute/transit/route.ts`
- `src/lib/lbs`
- `src/lib/ai`
- Supabase 相关文件
- 地图 UI 文件

## 12. 后续实现规则

未来实现 UI 时必须遵守：

- 不调用 `localStorage.clear()`；
- 不写入未知 key；
- 不触碰 IndexedDB；
- 不触碰照片 storage；
- 不 fetch 远程 URL；
- 不读取第三方页面；
- 不调用 AI；
- 不调用高德；
- 不调用 Supabase；
- 不创建新路由；
- 不从剪贴板自动导入；
- 不扫描本机文件夹。

用户必须通过浏览器文件选择器主动选择本地 JSON 文件。

## 13. 未来 UI 阶段回归验证计划

未来接入 UI 后，应手动验证：

1. 导出当前本地 JSON。
2. 导入无效 JSON，确认本机数据不变。
3. 导入包含未知 key 的 JSON，确认未知 key 被忽略。
4. 导入包含合法 HouseFolio key 的 JSON，确认 Settings 快照更新。
5. 确认现有本机照片没有被删除。
6. 确认没有新增路由。
7. 确认 `npm.cmd run build` 通过。
8. 确认提交后 `git status` clean。

## 14. Phase 3E-3 完成标准

本规划阶段完成标准：

- `docs/architecture/phase-3e-settings-json-import-ui-plan.md` 存在；
- `npm.cmd run build` 通过；
- 提交后 `git status` clean；
- 没有源码行为变化；
- 没有 UI 变化；
- 没有导入实现。

## 15. 建议提交信息

建议 commit：

docs: localize json import ui plan