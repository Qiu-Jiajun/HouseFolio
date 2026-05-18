# Phase 4G-4：Compare product polish closing checkpoint

## 1. 本阶段目标

本阶段用于收口 Phase 4G：Compare product polish / regression review。

本阶段只写 closing checkpoint，不做功能实现。

## 2. 当前稳定点

当前最新稳定 commit：

- fc6ac83 docs: log compare polish regression

最后确认状态：

- HEAD = origin/main = origin/HEAD = fc6ac83
- git status clean
- npm.cmd run build 通过
- Compare 目标文件禁止措辞扫描通过

## 3. Phase 4G 完成范围

本阶段完成了：

- Phase 4G-0：Compare product polish / regression review
- Phase 4G-1：Compare polish scope plan
- Phase 4G-2A：Compare polish implementation pre-scan
- Phase 4G-2：Minimal Compare polish implementation
- Phase 4G-3：Compare polish regression
- Phase 4G-4：Compare product polish closing checkpoint

Phase 4G 的核心目标是：

在不依赖真实 DeepSeek API key 的前提下，回到 Compare 产品主线，检查并微调 Compare 作为作品集展示链路的文案、空状态、边界说明和禁止措辞。

## 4. Phase 4G-0 完成内容

新增文件：

- docs/architecture/phase-4g-0-compare-product-polish-regression-review.md

提交：

- ba979af docs: review compare product polish

完成内容：

- 明确当前不应继续真实 DeepSeek success test
- 明确应回到 Compare 产品主线
- 明确 Compare polish 只做轻量评审
- 明确不得改 route / provider / prompt builder / Settings
- 明确不得新增 localStorage key
- 明确不得持久化 AI 输出
- 明确不得做真实 provider browser regression

## 5. Phase 4G-1 完成内容

新增文件：

- docs/architecture/phase-4g-1-compare-polish-scope-plan.md

提交：

- 7b78ca4 docs: plan compare polish scope

完成内容：

- 规划 Phase 4G-2 的最小实现范围
- 限定允许修改文件范围
- 明确优先改文案，不改结构
- 明确禁止 UI 大改、状态模型大改、真实 AI 测试
- 明确禁止 selection localStorage、AI output persistence、Settings AI 数据区
- 明确禁止照片 / 视频进入 Compare
- 明确禁止措辞扫描范围

## 6. Phase 4G-2A 完成内容

Phase 4G-2A 是实现前扫描，没有提交。

扫描确认：

- git status clean
- npm.cmd run build 通过
- Compare target files 存在
- 发现 zh-cn.ts 中存在 1 处“系统推荐”禁止措辞
- 发现 compareRouteCopy 仍保留早期 scaffold 过时文案
- 确认 CompareSelectedListingsPanel 中 fetch("/api/ai/compare-explanation") 是既有 AI route 调用，不属于本次新增 provider 改动

Phase 4G-2A 结论：

- Phase 4G-2 可只改 src/content/zh-cn.ts
- 不需要改组件结构
- 不需要改 route/provider/Settings/localStorage

## 7. Phase 4G-2 完成内容

修改文件：

- src/content/zh-cn.ts

提交：

- 450171b copy: polish compare guidance

完成内容：

- 将 compareRouteCopy badge 从早期 scaffold 表述更新为 Phase 4G-2｜横向比较
- 将 Compare route subtitle 更新为当前真实 Compare 主链路表述
- 微调 noSelection / tooFew / tooMany 空状态文案
- 强化返回 Portfolio 重新选择路径
- 明确当前选择只用于当前比较流程，不保存为本地记录
- 强化 CompareTable 边界说明
- 强化静态解释面板与 AI 辅助解释的边界
- 替换“系统推荐”相关禁止措辞

Phase 4G-2 没有修改：

- Compare 组件结构
- API route
- AI provider
- prompt builder
- Settings
- localStorage key
- AI output persistence

## 8. Phase 4G-3 完成内容

新增文件：

- docs/dev-log/2026-05-18-phase-4g-3-compare-polish-regression.md

提交：

- fc6ac83 docs: log compare polish regression

完成内容：

- 记录 Phase 4G-2 的回归结果
- 确认禁止措辞扫描通过
- 确认 Node UTF-8 文案检查通过
- 确认 npm.cmd run build 通过
- 确认 /compare route 仍存在
- 确认 /portfolio route 仍存在
- 确认 /settings route 仍存在
- 确认 /api/ai/compare-explanation route 仍存在
- 确认 /api/lbs/commute/transit route 仍存在

## 9. 禁止措辞扫描结果

扫描范围：

- src/app/compare/page.tsx
- src/components/compare-selected-listings-panel.tsx
- src/components/compare-table.tsx
- src/components/compare-explanation-panel.tsx
- src/content/zh-cn.ts

扫描词：

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

## 10. 当前 Compare 产品边界

当前 Compare 仍定位为：

- 辅助比较
- 横向拆解
- 帮用户看清取舍
- 帮用户发现缺失字段
- 帮用户回到 Portfolio 或详情页补充资料
- 不代表最终推荐
- 不替用户做决定
- 不判断房源真实性

当前 Compare 不做：

- 系统推荐
- 最佳房源选择
- 真实房源认证
- selection 持久化
- Compare history
- 复杂排序
- 用户自定义权重
- 地图 UI
- 照片进入 Compare
- 视频进入 Compare

## 11. 当前 AI 边界

当前 AI 仍保持：

- L3 人话解释层
- 只解释 L2 comparison 结果
- 不做评分
- 不做排序
- 不做筛选
- 不替用户决定
- 不判断房源真假
- 输出仍为 session-only
- 刷新后消失
- 不进入 Settings
- 不新增 localStorage key

当前仍未做：

- 真实 DeepSeek success test
- 真实 DeepSeek browser regression
- AI output persistence
- AI history
- Settings AI 数据权利区
- AI 输出导出 / 删除

## 12. Build 与路由状态

Phase 4G-3 已确认：

- npm.cmd run build 通过

路由仍包含：

- /
- /_not-found
- /api/ai/compare-explanation
- /api/lbs/commute/transit
- /compare
- /demo
- /portfolio
- /portfolio/[id]
- /portfolio/new
- /settings

## 13. 本阶段未做事项

Phase 4G 全阶段未做：

- 未做真实 DeepSeek success test
- 未改 /api/ai/compare-explanation route
- 未改 DeepSeek provider
- 未改 mock provider
- 未改 prompt builder
- 未改 Settings
- 未新增 localStorage key
- 未持久化 AI 输出
- 未新增 AI history
- 未接 Supabase
- 未接新的高德能力
- 未做地图 UI
- 未让照片进入 Compare
- 未让视频进入 Compare
- 未做 UI 大改
- 未改 ComparisonModel
- 未新增 Compare history

## 14. 当前结论

Phase 4G 完成后，HouseFolio 的 Compare 主链路文案与边界说明更贴近当前真实实现状态：

- 不再停留在 route scaffold 表述
- 更清楚说明 URL selection 是临时比较流程
- 更清楚说明 Compare 不新增本地持久化
- 更清楚区分静态说明与 AI 辅助解释
- 已移除 Compare 目标文件中的“系统推荐”等禁止措辞

当前可以判定：

- Phase 4G-0 completed
- Phase 4G-1 completed
- Phase 4G-2A completed
- Phase 4G-2 completed
- Phase 4G-3 completed
- Phase 4G-4 completed

## 15. 下一步建议

下一步不建议继续真实 DeepSeek success test，除非用户已经准备好 DeepSeek API 账号与 key。

可选路线：

1. 生成新对话 handoff
   - 当前对话已经较长
   - 最稳做法是生成 Phase 4G closing handoff，加入 Project Sources

2. 进入 Compare browser regression
   - 如果希望继续验证用户可见链路，可做最小浏览器回归
   - 但当前 Phase 4G 只改文案，非强制

3. 暂停 AI / Compare 主线，回到其他产品展示材料
   - 例如 README、简历项目描述、面试叙事
   - 不影响当前代码稳定性

当前最推荐：

- 先生成新对话 handoff
- 下一轮再决定是否做 Compare browser regression 或项目展示材料整理