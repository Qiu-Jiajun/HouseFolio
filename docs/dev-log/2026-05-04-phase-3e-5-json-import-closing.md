# Phase 3E-5｜JSON 导入阶段收口 checkpoint

## 1. 阶段目标

本文件用于收口 HouseFolio Phase 3E：结构化 JSON 导入能力。

Phase 3E 的目标不是实现完整备份系统，而是在 v2.0 本地优先路线下，补齐结构化本地数据的导入能力，使用户具备更完整的数据权利闭环：

- 查看本地数据；
- 导出本地 JSON；
- 导入本地 JSON；
- 清除本机结构化数据；
- 明确照片与 JSON 的边界。

## 2. 当前最新提交

生成本 checkpoint 前的最新提交：

4bb63b1 docs: normalize json import regression log

## 3. Phase 3E 已完成内容

### 3.1 Phase 3E-0：JSON import boundary review

完成文件：

- docs/architecture/phase-3e-json-import-boundary-review.md

完成内容：

- 明确 JSON 导入只处理结构化 localStorage 数据；
- 明确不处理 IndexedDB 照片；
- 明确不处理 ZIP 备份包；
- 明确不触碰 AI、地图、高德、Supabase 或第三方平台数据；
- 明确导入必须基于用户主动选择的本地 JSON 文件。

### 3.2 Phase 3E-1：JSON import helper scaffold

完成文件：

- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts

完成内容：

- 新增可导入 key 白名单；
- 新增 parseHouseFolioLocalDataImportJson；
- 新增 pplyHouseFolioLocalDataImportPayload；
- 新增 contract check；
- 初步支持直接 key-value、data、localStorage 形态。

### 3.3 Phase 3E-2：JSON import helper checkpoint

完成文件：

- docs/dev-log/2026-05-04-phase-3e-2-json-import-helper-checkpoint.md

完成内容：

- 记录 helper 只属于纯函数层；
- 明确尚未接 UI；
- 明确不处理照片、ZIP、云同步、AI、地图或 Supabase。

### 3.4 Phase 3E-3：Settings JSON import UI plan

完成文件：

- docs/architecture/phase-3e-settings-json-import-ui-plan.md

完成内容：

- 定义 Settings UI 位置；
- 定义导入文案；
- 定义覆盖确认；
- 定义错误状态；
- 定义照片边界；
- 定义未来 UI 回归标准。

后续已将该文档中文化，确保 Project Sources / architecture 文档风格统一。

### 3.5 Phase 3E-4B：兼容当前导出 JSON 格式

完成文件：

- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts

完成内容：

- 修复 import helper 与当前 export JSON 格式不兼容的问题；
- 当前导出 JSON 真实格式为 items 快照数组；
- helper 已支持从 items 中提取 key 与 alue；
- exists: false 的项不会被导入；
- 未知 key 继续被忽略。

### 3.6 Phase 3E-4C：Settings JSON import minimal UI

完成文件：

- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts

完成内容：

- Settings 增加“导入本地 JSON”入口；
- 支持选择 .json 文件；
- 支持导入前二次确认；
- 支持导入成功提示；
- 支持导入失败提示；
- 导入成功后刷新本地数据快照；
- 文案明确：JSON 导入不包含看房照片。

### 3.7 Phase 3E-4D：错误提示增强

完成文件：

- src/components/settings-local-data-panel.tsx

完成内容：

- JSON 导入失败时，保留页面红色错误提示；
- 同时使用浏览器弹窗显示错误；
- 提高无效 JSON、未知 key JSON 等失败状态的可见性。

### 3.8 Phase 3E-4E：Settings JSON import UI regression log

完成文件：

- docs/dev-log/2026-05-04-phase-3e-4e-json-import-ui-regression.md

完成内容：

- 记录无效 JSON 回归通过；
- 记录仅包含未知 key 的 JSON 回归通过；
- 记录有效 HouseFolio JSON 导入回归通过；
- 记录照片未被误删；
- 记录导入 UI 不声称恢复照片；
- 修复该日志文件中 1 个 NUL 字节导致 Git 识别为 binary 的问题。

## 4. 当前 JSON 导入能力

当前 Settings 本地数据区域已经支持：

- 导出本地 JSON；
- 选择本地 .json 文件；
- 解析 HouseFolio JSON；
- 识别当前导出格式中的 items 快照；
- 只导入白名单内的 HouseFolio localStorage keys；
- 忽略未知 key；
- 无效 JSON 不写入；
- 没有可导入 key 时不写入；
- 导入前要求用户确认覆盖；
- 导入成功后刷新 Settings 本地数据快照；
- 导入失败时同时显示页面提示和浏览器弹窗。

## 5. 当前允许导入的 key

当前只允许导入：

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

这些属于结构化 localStorage 数据。

## 6. 明确不导入的内容

当前 JSON 导入明确不处理：

- IndexedDB 照片 Blob；
- 照片缩略图；
- 照片 object URL；
- ZIP 备份包；
- 云端对象存储；
- AI 输出；
- AI prompt；
- 高德原始路线 JSON；
- 地图数据；
- Supabase 数据；
- 任意第三方平台数据；
- 任意未知 localStorage key；
- 浏览器中其他网站数据。

## 7. 安全边界确认

当前 Phase 3E 没有做以下事情：

- 没有调用 localStorage.clear()；
- 没有读取第三方页面；
- 没有抓取贝壳、58、小红书、豆瓣等平台内容；
- 没有从剪贴板自动导入；
- 没有扫描本机文件夹；
- 没有读取系统相册；
- 没有访问 IndexedDB 照片 storage；
- 没有调用 AI；
- 没有调用高德；
- 没有调用 Supabase；
- 没有新增 route；
- 没有新增 /compare；
- 没有实现 Portfolio 首图；
- 没有实现 ZIP 导出或导入；
- 没有改变 L1 / L2 / L3 的边界。

## 8. 手动回归确认

已完成手动回归：

### 无效 JSON

结果：

- 显示“导入文件不是有效的 JSON。”
- 同时弹窗提示；
- 本地数据不变化。

### 仅未知 key JSON

结果：

- 显示“导入文件中没有可识别的 HouseFolio 本地数据键。”
- 同时弹窗提示；
- 未知 key 不写入；
- 本地数据不变化。

### 有效 HouseFolio JSON

结果：

- 能选择当前导出的 HouseFolio JSON；
- 能出现覆盖确认；
- 确认后导入成功；
- Settings 快照刷新；
- housefolio:commute-results 标签显示为“参考通勤结果”；
- 本机照片未被误删；
- UI 没有声称恢复照片。

## 9. 产品意义

Phase 3E 让 HouseFolio 的本地优先能力从“只能导出和清除”推进为：

- 可导出；
- 可导入；
- 可清除；
- 可解释照片边界；
- 可手动迁移结构化数据。

这符合 v2.0 的产品姿态：

- 用户主动选择；
- 默认私有；
- 本地优先；
- 可导出；
- 可导入；
- 可清除；
- 云同步后置且可选。

## 10. 当前仍未完成

不要把 Phase 3E 误判为完整备份系统。

仍未完成：

- 照片 ZIP 导出；
- 照片 ZIP 导入；
- 完整 Portfolio 备份包；
- Portfolio 首图；
- import preview 详细表格；
- schema validator；
- merge 策略；
- 云端同步；
- Supabase 持久化；
- AI 分析；
- 地图 UI；
- /compare 页面；
- Phase 4A comparison data model。

## 11. 下一阶段建议

Phase 3E 已经可以阶段性收口。

下一步不建议继续扩张 JSON import。

建议从以下方向中选择一个：

### 方向 A：Phase 3F｜阶段总回归与 handoff

适合在当前对话较长、功能刚完成一个闭环时使用。

目标：

- 全量确认 build；
- git log 记录；
- 关键文件 NUL 字节检查；
- Settings 导出 / 导入 / 清除边界确认；
- 生成 Phase 3D-3E handoff 文档。

### 方向 B：Phase 3F｜Portfolio 首图前置评审

只做评审，不实现。

目标：

- 评估 Portfolio 首图是否应该马上做；
- 检查它是否会推动照片能力过快扩张；
- 检查是否应先做完整备份包；
- 避免把本地照片能力做成房源图册平台。

### 方向 C：结束本轮，生成新对话接续文档

适合当前对话已经较长时使用。

目标：

- 生成 Project Sources 续接文档；
- 明确当前最高 commit；
- 明确下一轮第一步检查；
- 避免下一轮误跳 AI、地图、Supabase、ZIP、Portfolio 首图或 /compare。

## 12. 当前推荐

当前最稳建议：

Phase 3F：阶段总回归与 handoff。

原因：

- Phase 3D 完成了本地照片持久化；
- Phase 3E 完成了结构化 JSON 导入；
- 两者都属于 v2.0 本地优先基础层；
- 现在适合做一次阶段总回归，确认边界清晰后再决定下一阶段。

## 13. 验证标准

本 checkpoint 完成标准：

- 本文件存在；
- 
pm.cmd run build 通过；
- 提交后 git status clean；
- 当前 JSON import regression log 不含 NUL 字节；
- 没有源码行为变化；
- 仅新增 dev-log 文档。

## 14. 建议提交信息

建议 commit：

docs: close json import phase