# Phase 4G-3：Compare polish regression

## 1. 本阶段目标

本阶段用于记录 Phase 4G-2：Minimal Compare polish implementation 的回归结果。

Phase 4G-2 只修改了 src/content/zh-cn.ts，用于微调 Compare 相关文案、替换过时 scaffold 表述，并移除 Compare 目标文件中的禁止措辞。

本阶段只写回归日志，不做功能实现。

## 2. 当前稳定点

Phase 4G-2 已完成并推送到 origin/main。

当前最新稳定 commit：

- 450171b copy: polish compare guidance

最后确认状态：

- HEAD = origin/main = origin/HEAD = 450171b
- git status clean
- npm.cmd run build 通过

## 3. Phase 4G-2 修改范围

Phase 4G-2 只修改：

- src/content/zh-cn.ts

没有修改：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/app/api/ai/compare-explanation/route.ts
- src/lib/ai
- src/lib/algorithm
- src/lib/privacy
- src/app/settings
- src/components/settings

## 4. Phase 4G-2 完成内容

Phase 4G-2 完成了以下轻量 polish：

1. 将 compareRouteCopy 的 badge 从早期 scaffold 状态更新为 Phase 4G-2 横向比较。
2. 将 Compare route 的 subtitle 从“只校验 URL、不读取真实房源数据”的过时表述，改为当前真实 Compare 主链路表述。
3. 强化 noSelection / tooFew / tooMany 空状态文案。
4. 强化返回 Portfolio 重新选择的路径提示。
5. 明确当前选择只用于当前比较流程，不保存为本地记录。
6. 强化 CompareTable 边界说明：不读取照片文件本体、不重新计算通勤、不新增本地持久化。
7. 强化静态解释面板与 AI 辅助解释的边界：静态面板不调用 AI，AI 辅助解释需单独确认。
8. 将“系统推荐”相关禁止措辞替换为更安全的“辅助比较与解释”表述。

## 5. 禁止措辞扫描结果

本阶段对以下目标文件执行了禁止措辞扫描：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/content/zh-cn.ts

扫描词包括：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真
- 已认证
- 保证真实

结果：

- PASS：Compare target files 未发现禁止措辞。

## 6. 中文文案检查结果

已通过 Node UTF-8 检查确认：

- src/content/zh-cn.ts 包含 Phase 4G-2｜横向比较
- src/content/zh-cn.ts 包含 本次选择只用于当前比较流程
- src/content/zh-cn.ts 包含 AI 输出仅用于辅助比较与解释
- src/content/zh-cn.ts 不再包含 不代表系统推荐或最终决定

说明：

- 没有使用 PowerShell Get-Content 判断中文是否正常。
- 以 Node UTF-8 读取结果为准。

## 7. Build 回归结果

本阶段执行：

- npm.cmd run build

结果：

- build 通过
- /compare route 仍存在
- /portfolio route 仍存在
- /settings route 仍存在
- /api/ai/compare-explanation route 仍存在
- /api/lbs/commute/transit route 仍存在

## 8. 边界确认

Phase 4G-2 / 4G-3 均未做以下事项：

- 未做真实 DeepSeek success test
- 未改 /api/ai/compare-explanation route
- 未改 DeepSeek provider
- 未改 mock provider
- 未改 prompt builder
- 未改 Compare 组件结构
- 未改 Portfolio selection
- 未改 Settings
- 未新增 localStorage key
- 未持久化 AI 输出
- 未新增 AI history
- 未接 Supabase
- 未接新的高德能力
- 未做地图 UI
- 未让照片进入 Compare
- 未让视频进入 Compare

## 9. 当前产品边界状态

当前 Compare 仍然保持以下定位：

- 辅助比较
- 横向拆解
- 帮用户看清取舍
- 帮用户发现缺失字段
- 帮用户回到详情页或 Portfolio 补充资料
- 不代表最终推荐
- 不替用户做决定
- 不判断房源真实性

当前 AI 仍然保持以下定位：

- L3 人话解释层
- 只解释 L2 comparison 结果
- 不做评分
- 不做排序
- 不做筛选
- 不替用户决定
- 不判断房源真假
- 输出仍为 session-only

## 10. 是否需要浏览器手动回归

本阶段未强制浏览器手动回归。

原因：

- Phase 4G-2 只修改 src/content/zh-cn.ts
- 未改组件结构
- 未改 route
- 未改 state
- 未改 provider
- npm.cmd run build 已通过
- 禁止措辞扫描已通过

如果后续继续做 Compare UI 结构微调，则建议执行浏览器手动回归。

## 11. 本阶段结论

Phase 4G-3 回归通过。

当前可以判定：

- Phase 4G-0：Compare product polish / regression review completed
- Phase 4G-1：Compare polish scope plan completed
- Phase 4G-2：Minimal Compare polish implementation completed
- Phase 4G-3：Compare polish regression completed

下一步建议进入：

- Phase 4G-4：Compare product polish closing checkpoint

Phase 4G-4 只做阶段收口文档，不再继续扩张 Compare UI。