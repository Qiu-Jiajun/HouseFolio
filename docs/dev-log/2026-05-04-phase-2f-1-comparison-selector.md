# HouseFolio 开发日志｜2026-05-04｜Phase 2F-1B｜Pure Comparison Input Selector Closing

## 1. 本阶段目标

本阶段目标是为未来 L2 comparison model 准备一个最小、纯函数化的 comparison input selector draft。

本阶段不是正式 Phase 4A comparison data model。

本阶段不新增页面、不新增路由、不接 UI、不写 localStorage、不接 AI、不接数据库、不改变现有 Reference Score 逻辑。

## 2. 已完成内容

### 2.1 新增 comparison input selector draft

新增文件：

```text
src/lib/algorithm/comparison.ts

该文件新增：

ComparisonCommuteSummary
ComparisonSubjectiveSummary
ComparisonInput
BuildComparisonInputOptions
buildComparisonInput
buildComparisonInputs

当前作用：

从现有 Listing 读取基础房源字段；
从运行时 listing 读取 commuteMinutes、commuteSource、lifeCircleScore、compositeScore;
可选接收 ScoreBreakdown;
可选接收 StoredCommuteResult[];
可选接收 ListingSubjectiveRatings;
输出只读 ComparisonInput。
2.2 新增 contract check

新增文件：

src/lib/algorithm/comparison-contract-check.ts

作用：

用 mock listing 验证 buildComparisonInput;
用 mock commute result 验证 commute summary 输入边界；
用真实 ListingSubjectiveRatings 字段名验证主观评分结构；
防止 comparison input selector 与现有类型漂移。

本阶段曾暴露一次字段不一致：

ListingSubjectiveRatings 真实字段是 light / quiet / decoration / updatedAt
不是 lighting / quietness / decoration

已修复为真实字段名。

3. 当前边界

当前 comparison selector 只做数据整形，不做以下事情：

不计算 Reference Score；
不改变 calculatePortfolioScores;
不排序；
不筛选；
不写入 housefolio:*;
不读取 localStorage；
不访问高德；
不访问 AI；
不读取原始路线 JSON；
不读取 coordinates；
不读取 polyline / steps / requestUrl / apiKey；
不处理用户笔记原文；
不处理照片；
不输出“最佳房源”或“推荐分”。
4. 当前验证

本阶段已执行：

npm.cmd run build
git status

结果：

build 通过
git status clean

提交：

5828ce9 feat: add comparison input selector draft
5. 当前项目状态

截至本日志，HouseFolio 当前已完成：

Phase 2D：L1 Detail 手动 transit 通勤计算闭环
Phase 2E：L1 commute-results → L2 Reference Score 最小闭环
Phase 2F-0：L2 comparison foundation review 与 input boundary 收口
Phase 2F-1：Pure comparison input selector draft
6. 后续建议

下一步可以选择：

选项 A：Phase 2F-2｜Comparison selector regression review

只读取 comparison.ts 与现有类型，确认字段边界是否仍然安全。

选项 B：Phase 2F 收口

如果今天要停止开发，可以直接生成 Phase 2F closing log，记录当前已完成到 pure selector draft。

选项 C：暂缓 comparison 继续推进，转入 UI 稳定回归

对 /portfolio、/portfolio/[id]、/settings 做手动回归，确认 Phase 2D–2F 没有破坏已有闭环。

建议优先选择：

Phase 2F-2：Comparison selector regression review

但仍然不能接 UI、不能新增页面、不能进入正式 Phase 4A。