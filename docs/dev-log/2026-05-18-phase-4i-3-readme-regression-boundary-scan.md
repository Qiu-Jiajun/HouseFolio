# Phase 4I-3：README regression / boundary scan

## 0. 阶段定位

Phase 4I-3 是 README minimal update 之后的回归与边界扫描记录。

本阶段只记录 README 扫描结果，不修改 README，不修改 src，不新增功能代码。

## 1. 当前稳定点

当前最新稳定点：

- 0044e8e docs: update readme current status

当前已确认：

- HEAD = origin/main = origin/HEAD = 0044e8e
- git status clean
- npm.cmd run build passed

## 2. README required phrases scan

以下关键表达均已覆盖：

- 本地优先私人找房决策管理工具；
- /compare?ids=...；
- AI confirmation UI；
- mock AI provider；
- session-only；
- 未做真实 DeepSeek success test；
- 不抓取第三方房源页面；
- 不认证真房源；
- 不输出最佳房源；
- 不让 LLM 做评分、排序、筛选。

结论：

- README 已反映 Phase 4H 后的当前稳定 Demo 主链路；
- README 已明确真实 DeepSeek success test 尚未完成；
- README 已保留 HouseFolio 的产品边界和 L3 AI 边界。

## 3. README route coverage scan

README 已覆盖当前主要 routes：

- /
- /demo
- /portfolio
- /portfolio/new
- /portfolio/[id]
- /compare
- /settings
- /api/lbs/commute/transit
- /api/ai/compare-explanation

结论：

- README 已补齐 /compare；
- README 已补齐 /api/ai/compare-explanation；
- README route 状态与当前 build route table 一致。

## 4. 禁止措辞语境检查

扫描到以下敏感表达：

- 最佳房源；
- 最优选择；
- 系统推荐；
- 推荐分；
- 替你决定；
- 真房源；
- 避坑保真；
- 房源真实性认证。

这些词均出现在否定语境，例如：

- 不输出最佳房源、最优选择、系统推荐、推荐分或替你决定；
- 不认证真房源；
- 不宣传避坑保真；
- 它不是房源平台、中介平台、房源聚合平台或真房源认证平台。

结论：

- README 没有把 HouseFolio 写成推荐系统；
- README 没有承诺房源真实性认证；
- README 没有宣传避坑保真；
- README 没有把 Reference Score 写成推荐分；
- README 没有把 AI 写成最终决策者。

## 5. Overclaim scan

未发现以下过度声明：

- 已完成真实 DeepSeek success test；
- 真实 DeepSeek success test：通过；
- 真实 AI browser regression：通过；
- AI output persistence：已完成；
- AI history：已完成；
- Supabase：已完成；
- 云端账号系统：已完成；
- 系统推荐最佳房源。

扫描中出现“房源真实性认证”，但其语境是“不是房源平台、中介平台、房源聚合平台或真房源认证平台”，属于否定边界，不是功能承诺。

## 6. Build result

本轮执行：

- npm.cmd run build

结果：

- build passed；
- /compare route present；
- /api/ai/compare-explanation route present；
- /demo route present；
- /settings route present。

## 7. 阶段结论

Phase 4I-3 README regression / boundary scan 通过。

当前 README 已经比旧版更准确地反映当前状态：

- Compare 主链路已完成；
- AI confirmation UI 已完成；
- mock AI output 可用于 Demo；
- DeepSeek provider readiness 已有；
- 真实 DeepSeek success test 尚未做；
- AI output 当前 session-only；
- Settings 当前不保存 AI 输出；
- HouseFolio 仍保持本地优先、辅助比较、不抓取、不撮合、不认证真房源的边界。

建议下一步进入：

- Phase 4I-4：README update closing checkpoint

用于收口 Phase 4I 的 README 更新工作。