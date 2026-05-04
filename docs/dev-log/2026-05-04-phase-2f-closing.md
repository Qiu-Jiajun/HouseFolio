# HouseFolio 开发日志｜2026-05-04｜Phase 2F Closing｜L2 Comparison Foundation

## 1. 本阶段目标

Phase 2F 的目标不是正式实现对比页面，也不是进入 Phase 4A comparison data model。

本阶段目标是：

1. 在 Phase 2E 的 L1 → L2 最小闭环之后，审查当前 L2 comparison foundation；
2. 明确未来 comparison input 可以读取哪些字段；
3. 写出最小纯函数 comparison input selector draft；
4. 回归检查 selector 是否保持安全边界；
5. 为未来正式 comparison data model 做准备，但不提前实现正式模型。

## 2. 已完成内容

### 2.1 Phase 2F-0B：L2 Comparison Foundation Review

新增文档：

```text
docs/architecture/l2-comparison-foundation-review.md

提交：

a419a2e docs: review l2 comparison foundation

确认当前已有基础：

Listing 已包含 commuteMinutes、commuteSource、compositeScore;
housefolio:commute-results 已提供本地通勤摘要存储；
listing-lookup.ts 已在运行时合并 cached transit；
score.ts 已提供 ScoreInput、ScoreBreakdown、calculatePortfolioScores;
portfolio.ts 已支持状态筛选、租金排序、通勤排序、参考评分排序。
2.2 Phase 2F-0C：Comparison Input Boundary Note

新增文档：

docs/architecture/l2-comparison-input-boundary.md

提交：

7d11a21 docs: define l2 comparison input boundary

明确未来 comparison input 可以读取：

基础房源字段；
L1 通勤字段；
L1 生活圈参考字段；
L2 参考评分字段；
用户主观评分字段；
未来可选的笔记统计字段。

同时明确暂不读取：

sourceUrl;
raw description;
full notes;
full AI output;
coordinates;
raw Amap response;
polyline;
steps;
requestUrl;
apiKey;
exact address;
door number;
landlord contact;
chat records;
photos.
2.3 Phase 2F-0D：Comparison Foundation Closing

新增文档：

docs/dev-log/2026-05-04-phase-2f-0-comparison-foundation-closing.md

提交：

3e77227 docs: close l2 comparison foundation review

作用：

收口 Phase 2F-0；
明确 Phase 2F-0 只是 review 与 input boundary；
防止直接滑入正式 Phase 4A。
2.4 Phase 2F-1A：Pure Comparison Input Selector Draft

新增文件：

src/lib/algorithm/comparison.ts
src/lib/algorithm/comparison-contract-check.ts

提交：

5828ce9 feat: add comparison input selector draft

新增类型和函数：

ComparisonCommuteSummary
ComparisonSubjectiveSummary
ComparisonInput
BuildComparisonInputOptions
buildComparisonInput
buildComparisonInputs

当前 selector 只做纯函数数据整形：

从 Listing 读取基础房源字段；
从运行时 listing 读取 commuteMinutes、commuteSource、lifeCircleScore、compositeScore;
可选接收 ScoreBreakdown;
可选接收 StoredCommuteResult[];
可选接收 ListingSubjectiveRatings;
输出只读 ComparisonInput。

本阶段曾发现 ListingSubjectiveRatings 字段名真实为：

light
quiet
decoration
updatedAt

并已修正 selector 和 contract check。

2.5 Phase 2F-1B：Pure Comparison Input Selector Closing

新增文档：

docs/dev-log/2026-05-04-phase-2f-1-comparison-selector.md

提交：

a97752f docs: log comparison input selector

作用：

记录 selector 草案边界；
确认未接 UI、未新增页面、未写 localStorage、未进入正式 Phase 4A。
2.6 Phase 2F-2：Comparison Selector Regression Review

新增文档：

docs/dev-log/2026-05-04-phase-2f-2-comparison-selector-regression.md

提交：

ae3ffda docs: log comparison selector regression

回归检查确认：

未引入 localStorage;
未引入 fetch;
未引入 AMAP / NEXT_PUBLIC / apiKey;
未引入 requestUrl / rawResponse / polyline / steps / coordinate;
未引入 sourceUrl;
未引入 photos;
未引入 DeepSeek / Supabase;
note 命中只是 listing-note 类型文件路径造成的可接受误报，不代表读取用户笔记原文。
3. 当前 Phase 2F 完成后的项目状态

截至本日志，HouseFolio 已完成：

Phase 2D：L1 Detail 手动 transit 通勤计算闭环
Phase 2E：L1 commute-results → L2 Reference Score 最小闭环
Phase 2F：L2 comparison foundation + input boundary + pure selector draft

当前已经形成：

工作/学习地点（通勤锚点）
→ Detail 手动 transit 通勤计算
→ commute-results 本地摘要
→ listing-lookup 运行时读取 cached transit
→ commuteMinutes / commuteSource / compositeScore 更新
→ Portfolio 与 Detail 展示
→ Reference Score 消费真实通勤摘要
→ comparison input selector 能把现有结构整理为只读 ComparisonInput
4. 当前明确没有完成的内容

Phase 2F 没有完成，也不应该声称完成：

compare 页面；
/compare 路由；
多房源勾选；
横向对比表；
正式 ComparisonModel;
异常值检测；
相对性价比；
用户自定义权重；
复杂多锚点权重；
POI / 生活圈真实计算；
AI 对比分析；
Supabase 持久化；
地图 UI；
Chrome 插件。
5. 当前边界

Phase 2F 当前产出的 comparison.ts 只能视为：

pure comparison input selector draft

它不是正式推荐系统，不是正式对比系统，也不负责排序、评分、筛选、AI 总结或数据库读写。

Reference Score 仍然只能叫：

参考评分
辅助比较
维度拆解
不代表最终推荐

不得改成：

推荐分
最佳房源
最优选择
系统推荐
替你决定
6. 验证状态

本阶段各步骤均执行过：

npm.cmd run build
git status

截至本日志前，最新状态为：

build 通过
git status clean

最近提交链：

ae3ffda docs: log comparison selector regression
a97752f docs: log comparison input selector
5828ce9 feat: add comparison input selector draft
3e77227 docs: close l2 comparison foundation review
7d11a21 docs: define l2 comparison input boundary
a419a2e docs: review l2 comparison foundation
4b08528 docs: close phase 2e commute scoring
7. 下一步建议

Phase 2F 已经可以收口。

下一步建议优先选择：

Phase 2G：UI / data regression checkpoint

目标：

回归 /portfolio;
回归 /portfolio/[id];
回归 /settings;
检查 housefolio:work-locations;
检查 housefolio:commute-results;
检查 Reference Score 与 commute source indicator;
检查 comparison selector 未影响现有 UI。

暂不建议继续向正式 comparison data model 推进。

如果后续要进入正式对比模型，应在独立阶段重新启动，并明确它仍不等于 AI 推荐、不等于系统替用户做决定。