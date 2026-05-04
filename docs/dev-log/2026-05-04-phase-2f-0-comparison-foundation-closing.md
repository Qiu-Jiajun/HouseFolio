# HouseFolio 开发日志｜2026-05-04｜Phase 2F-0D｜L2 Comparison Foundation Closing

## 1. 本阶段目标

本阶段目标是对 Phase 2E 之后的 L2 comparison foundation 做一次只读评审与边界收口。

Phase 2F-0 不实现正式对比模型，不新增 compare 页面，不新增横向对比表，不做多房源勾选，不进入 Phase 4A comparison data model。

本阶段只回答三个问题：

1. 当前 L1 → L2 闭环完成后，已有的 comparison 基础是什么；
2. 未来 comparison model 可以读取哪些输入；
3. 当前阶段必须避免哪些越界开发。

## 2. 已完成内容

### 2.1 Phase 2F-0B：L2 Comparison Foundation Review

新增文档：

```text
docs/architecture/l2-comparison-foundation-review.md

该文档确认当前已有基础：

Listing 已包含 commuteMinutes、commuteSource、compositeScore;
housefolio:commute-results 已提供本地通勤摘要存储；
listing-lookup.ts 已在运行时合并 cached transit；
score.ts 已提供 ScoreInput、ScoreBreakdown、calculatePortfolioScores;
portfolio.ts 已支持状态筛选、租金排序、通勤排序、参考评分排序。

该文档同时明确：当前仍不是正式 comparison model。

提交：

a419a2e docs: review l2 comparison foundation
2.2 Phase 2F-0C：Comparison Input Boundary Note

新增文档：

docs/architecture/l2-comparison-input-boundary.md

该文档定义了未来 comparison input 的候选字段，包括：

基础房源字段；
L1 通勤字段；
L1 生活圈参考字段；
L2 参考评分字段；
用户主观评分字段；
未来可选的笔记统计字段。

同时明确暂不进入 comparison input 的字段：

sourceUrl
raw description
full notes
full AI output
coordinates
raw Amap response
polyline
steps
requestUrl
apiKey
exact address
door number
landlord contact
chat records
photos

提交：

7d11a21 docs: define l2 comparison input boundary
3. 当前项目状态

截至本日志，HouseFolio 已经完成：

Phase 2D：L1 Detail 手动 transit 通勤计算闭环
Phase 2E：L1 commute-results → L2 Reference Score 最小闭环
Phase 2F-0：L2 comparison foundation review 与 input boundary 收口

当前 L2 已有能力：

Portfolio 状态筛选；
租金排序；
通勤排序；
Reference Score 排序；
cached transit 进入 commuteMinutes;
cached transit 影响 Reference Score;
UI 区分“默认参考值 / 本地通勤结果”。
4. 当前明确不做的事

Phase 2F-0 完成后，仍然不要直接跳到：

AI / DeepSeek；
地图 UI；
POI / 生活圈真实计算；
Supabase；
部署；
Chrome 插件；
复杂多锚点权重；
正式 Phase 4A comparison data model。

尤其注意：

当前 Phase 2F-0 只是为未来 comparison model 做输入边界准备，不是开始实现对比模型。

5. 后续建议

下一步建议有两个安全选项：

选项 A：Phase 2F-1｜Pure comparison input selector draft

只写纯函数草案，不接 UI、不新增页面、不写 localStorage、不改评分逻辑。

可选文件范围：

src/lib/algorithm/comparison.ts
src/lib/algorithm/comparison-contract-check.ts

但这一阶段必须保持极小范围，只把现有 Listing / ScoreBreakdown / commute summaries 转成只读 comparison input，不做正式 compare model。

选项 B：Phase 2F 收口后暂缓，进入 Phase 3 前置 UI 稳定检查

如果担心过早进入 comparison 代码，可以先做 UI / 文案 / Settings / Detail 回归检查，确保 Phase 2D–2F 的基础闭环稳定。

6. 当前建议

更稳妥的下一步是：

Phase 2F-1：Pure comparison input selector draft

但必须满足：

只写纯函数；
不新增页面；
不新增路由；
不新增 UI；
不接 AI；
不接数据库；
不写入 localStorage；
不改变现有 Reference Score；
不把“参考评分”改成“推荐分”；
完成后必须 build 通过并提交。