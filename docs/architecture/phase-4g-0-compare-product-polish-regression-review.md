# Phase 4G-0：Compare product polish / regression review

## 1. 本阶段目标

Phase 4G-0 用于评审当前 Compare 主链路是否已经足够支撑作品集展示，以及是否需要进入小幅产品打磨阶段。

本阶段只做评审，不做实现。

当前已经完成 AI provider readiness 阶段：

- Phase 4F-0：Real AI provider readiness review
- Phase 4F-1A：Real AI provider readiness closing checkpoint
- Phase 4F-1B：AI provider readiness handoff

由于用户尚未拥有 DeepSeek API 账号与 API key，真实 DeepSeek success test 继续后置。

因此，下一步不应继续真实 AI provider 主线，而应回到不依赖真实 provider 的 Compare 产品主线。

## 2. 当前稳定点

当前最新稳定 commit：

- f2ac97c docs: add ai readiness handoff

最后确认状态：

- HEAD = origin/main = origin/HEAD = f2ac97c
- git status clean
- npm.cmd run build 通过
- Phase 4F-1B handoff 已提交并推送

## 3. 本阶段明确不做

Phase 4G-0 不做以下事项：

- 不做真实 DeepSeek success test
- 不改 /api/ai/compare-explanation
- 不改 DeepSeek provider
- 不改 mock provider
- 不改 prompt builder
- 不改 Compare UI
- 不改 Portfolio selection
- 不改 Settings
- 不新增 localStorage key
- 不持久化 AI 输出
- 不做 AI history
- 不接 Supabase
- 不接新的高德能力
- 不做地图 UI
- 不做照片进入 Compare
- 不做视频进入 Compare

本阶段文件范围仅限：

- docs/architecture/phase-4g-0-compare-product-polish-regression-review.md

## 4. 为什么现在回到 Compare 产品主线

当前 HouseFolio 已经具备：

1. Portfolio 选择 2–4 套房源
2. 通过 URL query 进入 /compare
3. 本机 listings 读取
4. buildComparisonInputs()
5. ComparisonModel preview
6. CompareTable 横向表
7. 静态解释面板
8. Mock AI trigger
9. AI confirmation UI
10. server-side provider selection
11. AI output session-only

这说明 Compare 已经是 HouseFolio 当前最完整的 L2 / L3 展示主链路。

在没有 DeepSeek API key 的情况下，继续真实 AI 主线会卡在外部条件；而 Compare 的产品展示质量仍然可以在不引入真实 provider 的前提下继续提升。

## 5. Compare 当前产品定位

Compare 不是“系统推荐页”。

Compare 的定位是：

- 辅助比较
- 横向拆解
- 帮用户看清取舍
- 帮用户发现缺失字段
- 帮用户回到详情页补充资料
- 帮用户基于自己收集的候选房源做判断

Compare 不能表达为：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定

当前 Compare 必须继续服务 HouseFolio 的三层引擎：

- L1：通勤、空间信息、生活圈参考
- L2：结构化比较、参考评分、缺失字段、风险信号
- L3：基于 L2 结果的人话解释和 checklist

## 6. Phase 4G 可能关注的问题

Phase 4G 后续如果进入实现，建议只做轻量打磨，不做大改。

可评审的问题包括：

### 6.1 Compare 空状态是否足够清楚

需要检查：

- 没有 ids 时，是否明确提示回到 Portfolio 选择房源
- ids 少于 2 套时，是否提示至少选择 2 套
- ids 超过 4 套时，是否提示只支持 2–4 套
- URL 中包含无效 id 时，是否安全忽略
- 本机没有对应房源时，是否给出可理解提示

### 6.2 Compare 返回路径是否完整

需要检查：

- /compare 是否能返回 Portfolio
- 每套房源是否能进入详情页
- 详情页是否能返回 Portfolio
- 用户能否理解“补充资料后再回来比较”

### 6.3 Compare 表格信息层级是否清楚

需要检查：

- 基础信息是否优先展示
- L1 空间信息是否和 L2 参考比较区分清楚
- 参考评分是否明确是辅助比较
- 缺失字段是否不会被误解为错误
- 风险信号是否不会被误解为平台认证结论

### 6.4 Compare 文案是否合规

需要检查是否出现禁止表达：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真
- 已认证
- 保证真实

如果存在，应在后续阶段修正为：

- 参考评分
- 辅助比较
- 维度拆解
- 取舍提示
- 不代表最终推荐
- 请自行核实

### 6.5 Compare 与 AI 边界是否清楚

需要检查：

- 静态解释面板是否与 AI 输出区区分清楚
- AI confirmation 是否仍然在真实 AI 调用前出现
- AI 输出是否仍然 session-only
- 刷新后 AI 输出是否消失
- Settings 是否仍然无 AI 数据权利区
- localStorage 是否仍然没有 AI key

### 6.6 Compare 是否适合作品集展示

需要从面试视角检查：

- 面试官能否 30 秒理解 Compare 的价值
- 页面是否清楚体现 L1 / L2 / L3 三层结构
- 是否能看出 HouseFolio 不是房源平台
- 是否能看出用户数据本地优先
- 是否能看出 AI 只做解释，不做推荐系统
- 是否能看出项目有合规和架构边界意识

## 7. Phase 4G 后续实现范围建议

如果 Phase 4G-0 评审后进入实现，建议只做很小的阶段：

### 可做

- Compare 空状态文案微调
- Compare 返回 Portfolio 入口加强
- Compare 表格辅助说明微调
- Compare 禁止措辞扫描
- Compare 页面 regression log
- Compare 面试展示说明补充
- 不涉及真实 AI 的轻量 polish

### 暂不做

- 大改 Compare layout
- 新增复杂排序
- 用户自定义权重
- selection localStorage
- Compare history
- AI output persistence
- Settings AI 数据区
- 照片进入 Compare
- 视频进入 Compare
- 地图进入 Compare
- DeepSeek success test

## 8. 推荐阶段拆分

Phase 4G 后续可按以下顺序推进：

1. Phase 4G-0：Compare product polish / regression review
2. Phase 4G-1：Compare polish scope plan
3. Phase 4G-2：Minimal Compare polish implementation
4. Phase 4G-3：Compare polish regression
5. Phase 4G-4：Compare product polish closing checkpoint

其中：

- Phase 4G-0 只写本评审文档
- Phase 4G-1 只写计划
- Phase 4G-2 才允许小范围改 UI / copy
- Phase 4G-3 做浏览器或静态回归
- Phase 4G-4 做阶段收口

## 9. 本阶段验收标准

本阶段验收标准：

- 只新增 docs/architecture/phase-4g-0-compare-product-polish-regression-review.md
- 不修改 src
- 不修改 route
- 不修改 provider
- 不修改 prompt builder
- 不修改 Compare UI
- 不修改 Settings
- 不新增 localStorage key
- 不持久化 AI 输出
- npm.cmd run build 通过
- git status clean
- commit 信息为 docs: review compare product polish

## 10. 阶段结论

Phase 4G-0 的结论是：

当前不应继续真实 DeepSeek success test。HouseFolio 应暂时回到 Compare 产品主线，在不依赖真实 provider 的前提下，检查并规划 Compare 作为作品集展示链路的轻量 polish 与 regression。

下一步建议进入：

- Phase 4G-1：Compare polish scope plan

Phase 4G-1 仍应只写计划，不直接实现。