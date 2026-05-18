# Phase 4G-1：Compare polish scope plan

## 1. 本阶段目标

Phase 4G-1 用于规划 Compare 页面后续最小 polish 范围。

本阶段只写计划，不做实现。

Phase 4G-0 已确认：在用户尚未拥有 DeepSeek API 账号与 API key 的情况下，不应继续真实 AI provider 主线，而应回到不依赖真实 provider 的 Compare 产品主线。

Phase 4G-1 的任务是把后续 Phase 4G-2 的实现范围压缩到足够小，避免 UI 大改、状态模型大改、AI 持久化或数据结构扩张。

## 2. 当前稳定点

当前最新稳定 commit：

- ba979af docs: review compare product polish

最后确认状态：

- HEAD = origin/main = origin/HEAD = ba979af
- git status clean
- npm.cmd run build 通过
- Phase 4G-0 已完成并 push 到 origin/main

## 3. 本阶段明确不做

Phase 4G-1 不做以下事项：

- 不改 src
- 不改 Compare UI
- 不改 Portfolio selection
- 不改 /api/ai/compare-explanation
- 不改 DeepSeek provider
- 不改 mock provider
- 不改 prompt builder
- 不改 Settings
- 不新增 localStorage key
- 不持久化 AI 输出
- 不做真实 DeepSeek success test
- 不做真实 DeepSeek browser regression
- 不接 Supabase
- 不接新的高德能力
- 不做地图 UI
- 不让照片进入 Compare
- 不让视频进入 Compare

本阶段文件范围仅限：

- docs/architecture/phase-4g-1-compare-polish-scope-plan.md

## 4. Phase 4G-2 允许修改的文件范围

如果进入 Phase 4G-2，建议只允许修改以下文件中的一小部分：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/content/zh-cn.ts

优先级顺序：

1. src/content/zh-cn.ts
2. src/app/compare/page.tsx
3. src/components/compare-selected-listings-panel.tsx
4. src/components/compare-table.tsx
5. src/components/compare-explanation-panel.tsx

原则：

- 优先改文案，不改结构
- 优先改说明，不改模型
- 优先改空状态，不改交互模型
- 优先增强返回路径，不新增持久状态
- 不触碰 provider / route / storage / privacy 之外的边界

## 5. Phase 4G-2 允许做的 polish

### 5.1 Compare 空状态微调

允许检查并微调：

- 没有 ids 时的提示
- 少于 2 套房源时的提示
- 超过 4 套房源时的提示
- URL 中存在无效 id 时的提示
- 本机找不到对应房源时的提示
- 返回 Portfolio 的按钮文案

目标：

让用户清楚知道下一步应该回到 Portfolio 选择 2–4 套候选房源。

不允许：

- 新增 selection localStorage
- 新增 Compare history
- 新增复杂错误页
- 新增多页面流程

### 5.2 返回路径微调

允许检查并微调：

- /compare 返回 Portfolio 的入口
- Compare 表格内查看详情入口
- 用户补充资料后继续比较的说明

目标：

让用户理解 Compare 不是终点，而是一个辅助比较工作台。发现缺失字段后，应回到详情页补充信息，再回到 Portfolio 重新选择比较。

不允许：

- 新增自动返回状态恢复
- 新增 selection 持久化
- 新增跨页面 session 管理

### 5.3 辅助比较定位说明微调

允许微调文案：

- 参考评分仅用于辅助比较
- 不代表最终推荐
- 用户可按硬性条件一票否决
- AI 解释仅基于当前结构化数据
- 房源真实性仍需用户自行核实

目标：

减少用户把 Compare 理解成“推荐系统”或“AI 选房系统”的风险。

不允许出现：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真
- 已认证
- 保证真实

### 5.4 Compare 表格说明微调

允许微调：

- L1 空间信息说明
- L2 参考比较说明
- 缺失字段说明
- 风险信号说明
- 待补充状态说明

目标：

让用户理解：

- 缺失字段不是错误
- 风险信号不是平台认证结论
- 参考评分只是辅助拆解
- Compare 展示的是用户已有资料的结构化结果

不允许：

- 新增复杂评分算法
- 新增权重配置
- 新增排序
- 新增筛选
- 新增推荐结果

### 5.5 AI 区域边界说明微调

允许微调：

- AI confirmation 前的说明
- 静态解释面板与 AI 输出区的区分
- session-only 输出说明
- 第三方 AI 调用提示

目标：

让用户理解：

- AI 是 L3 人话解释层
- AI 不做评分 / 排序 / 筛选
- AI 不替用户决定
- AI 输出刷新后消失
- 当前没有 AI history
- 当前 Settings 不需要 AI 数据区

不允许：

- 持久化 AI 输出
- 新增 AI history
- 新增 Settings AI 数据区
- 新增 AI 导出 / 删除
- 做真实 DeepSeek success test

## 6. Phase 4G-2 不允许做的事

Phase 4G-2 即使进入实现，也不允许做：

- UI 大改版
- Compare layout 重构
- Compare 数据模型重构
- ComparisonModel 字段扩张
- 新增 localStorage key
- selection 持久化
- Compare history
- AI output persistence
- Settings AI 数据权利区
- 用户自定义权重
- 复杂多锚点权重模型
- 相对性价比正式算法
- 异常值检测正式算法
- 地图 UI
- POI / 生活圈真实计算
- 照片进入 Compare
- 视频进入 Compare
- Supabase
- DeepSeek success test
- 真实 AI browser regression

## 7. 禁止措辞扫描范围

Phase 4G-2 可执行最小禁止措辞扫描。

扫描范围建议：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/content/zh-cn.ts

禁止措辞：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真
- 已认证
- 保证真实

替代表达：

- 参考评分
- 辅助比较
- 维度拆解
- 取舍提示
- 不代表最终推荐
- 请自行核实
- 用户可按硬性条件一票否决

## 8. Phase 4G-2 推荐最小实现方案

如果 Phase 4G-2 进入实现，推荐只做三件事：

1. Compare 空状态与返回 Portfolio 文案微调
2. Compare 表格上方辅助说明微调
3. 禁止措辞扫描与必要替换

优先不改组件结构。

如果必须改组件，限制为：

- 增加一小段说明文字
- 调整按钮文案
- 调整空状态文案
- 调整 disclaimer 文案
- 不新增复杂交互
- 不新增状态

## 9. Phase 4G-2 验收标准建议

Phase 4G-2 如果实施，应满足：

- npm.cmd run build 通过
- git status clean
- 不新增 localStorage key
- 不持久化 AI 输出
- 不改 API route
- 不改 provider
- 不改 prompt builder
- 不改 Settings
- 不做真实 DeepSeek success test
- /compare route 仍存在
- /portfolio route 仍存在
- 选择 2–4 套房源进入 Compare 的路径仍可用
- CompareTable 仍可渲染
- 静态解释面板仍可渲染
- AI confirmation UI 仍存在
- AI output 仍 session-only
- 禁止措辞扫描通过

## 10. Phase 4G-3 回归建议

Phase 4G-3 可做 regression log，建议检查：

1. /portfolio 正常打开
2. 可选择 2–4 套房源
3. 可进入 /compare?ids=...
4. Compare 空状态正常
5. CompareTable 正常
6. 查看详情入口正常
7. 返回 Portfolio 入口正常
8. 静态解释面板正常
9. AI confirmation UI 正常
10. 刷新后 AI 输出不持久化
11. localStorage AI key 检查仍为空
12. Settings 无 AI 数据区
13. 禁止措辞扫描通过
14. npm.cmd run build 通过
15. git status clean

## 11. 是否需要浏览器手动回归

Phase 4G-2 如果只改文案，可不强制浏览器手动回归，但建议做最小浏览器检查。

原因：

- Compare 是当前作品集展示主链路
- 文案和空状态属于用户可见层
- 面试展示依赖 Compare 的清晰度

最小浏览器检查即可，不需要真实 AI 调用，不需要 DeepSeek key。

## 12. 是否需要新增文案 key

Phase 4G-2 如果涉及用户可见中文，应优先改 src/content/zh-cn.ts。

不建议把大量中文散落到 TSX 文件中。

如果 TSX 中已有相邻硬编码中文，允许最小修正，但更推荐集中到 zhCN 文案对象。

检查中文时，不要相信 PowerShell Get-Content 显示；使用 Node UTF-8 检查。

## 13. 是否需要更新 Settings

当前结论：不需要。

原因：

- AI output 仍 session-only
- 没有 AI history
- 没有 AI localStorage key
- 没有 AI export / delete 对象
- 没有云端 AI 记录

因此 Phase 4G 不应改 Settings。

## 14. 是否需要更新 local-data.ts

当前结论：不需要。

原因：

- 不新增 localStorage key
- 不新增 AI persistence
- 不新增 Compare selection persistence
- 不新增 Compare history

因此 Phase 4G 不应改 src/lib/privacy/local-data.ts。

## 15. 阶段结论

Phase 4G-1 的结论是：

Phase 4G-2 可以进入最小 Compare polish implementation，但必须限制为轻量文案、空状态、返回路径和禁止措辞扫描，不得扩张成 UI 大改、状态模型大改、真实 AI 测试或数据持久化。

推荐下一步：

- Phase 4G-2：Minimal Compare polish implementation

Phase 4G-2 允许小范围改 src，但必须先执行文件范围和禁止项检查。