# HouseFolio Phase 2F-0C｜Comparison Input Boundary Note

## 1. 本阶段目标

本阶段只定义未来 L2 comparison model 的输入边界，不实现正式对比模型，不新增页面，不新增 UI，不接 AI，不接数据库，不改现有 localStorage key。

本文件用于回答一个问题：

> 未来 HouseFolio 做多房源对比时，应该从现有 Listing、ScoreBreakdown、CommuteResult、Subjective Ratings 中读取哪些字段？

本阶段仍然属于 Phase 2F 的架构准备，不是 Phase 4A comparison data model。

## 2. Comparison input 的基本原则

未来 comparison input 应遵守以下原则：

1. 只读取 HouseFolio 已有的本地结构化数据；
2. 不访问第三方房源平台；
3. 不读取高德原始路线 JSON；
4. 不读取经纬度、polyline、steps、requestUrl、apiKey；
5. 不把 Reference Score 解释为系统推荐；
6. 不引入 AI 判断；
7. 不改变现有 Listing 原始数据；
8. 尽量使用运行时派生数据，而不是新建持久化字段。

## 3. 未来对比模型的候选输入字段

### 3.1 基础房源字段

来自 `Listing`：

```text
id
title
rent
area
layout
district
addressHint
sourcePlatform
status
createdAt

用途：

横向展示基础信息；
支持用户识别每套候选房源；
支持租金、面积、户型、区位等基础对比。

注意：

sourceUrl 不应默认进入对比表；
如后续显示，也只作为用户自己保存的原始链接，不做平台内容抓取。
3.2 L1 通勤相关字段

来自运行时 Listing 与 housefolio:commute-results：

commuteMinutes
commuteSource
cached commute summaries

其中 commuteSource 当前可能为：

listing
cachedTransit

用途：

显示通勤时间；
显示该通勤时间来自“默认参考值”还是“本地通勤结果”；
支持未来 compare table 中的通勤维度拆解。

当前 Phase 2E 策略：

只读取 transit；
多个 transit 结果暂取最短 durationMinutes；
不做复杂多锚点权重；
不计算平均通勤压力；
不做最差锚点惩罚。
3.3 L1 生活圈字段

来自 Listing：

lifeCircleScore

当前状态：

仍主要来自 mock / 默认字段；
尚未接入真实 POI 计算；
不应把它宣传为真实生活圈评估结果。

未来对比表中可展示，但必须保持“参考值”语气。

3.4 L2 参考评分字段

来自运行时 Listing 与 ScoreBreakdown：

compositeScore
scoreBreakdown.totalScore
scoreBreakdown.rentScore
scoreBreakdown.areaScore
scoreBreakdown.commuteScore
scoreBreakdown.lifeCircleScore
scoreBreakdown.subjectiveScore
scoreBreakdown.explanation

用途：

展示参考评分；
展示维度拆解；
帮助用户理解每套房源在不同维度上的差异。

边界：

只能叫“参考评分”；
只能用于辅助比较；
不得称为推荐分；
不得输出“最佳房源”“最优选择”“系统推荐”。
3.5 用户主观评分字段

来自 housefolio:listing-ratings：

lighting
quietness
decoration

用途：

进入 subjectiveScore；
在未来 compare table 中展示用户主观感受；
体现 HouseFolio 不是只看客观指标，也尊重用户看房后的实际感受。

边界：

主观评分来自用户自己；
不应被算法解释为客观事实。
3.6 用户笔记字段

来自 housefolio:listing-notes：

note count
latest note summary

当前 Phase 2F 不建议直接进入 comparison input。

原因：

笔记可能包含敏感信息；
笔记摘要未来更适合由 L3 在脱敏后处理；
当前 L2 comparison foundation 应先保持结构化字段优先。

未来如要加入，也应只加入：

hasNotes
notesCount
lastUpdatedAt

不要直接把原文笔记进入 compare model。

4. 暂不进入 comparison input 的字段

当前不进入：

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

原因：

与当前 L2 对比没有必要关系；
可能带来隐私、合规或平台数据风险；
部分字段属于 L3 脱敏后处理范围，不属于 L2。
5. 未来 ComparisonInput 草案

后续如进入代码阶段，可考虑类似结构：

type ComparisonInput = {
  listingId: string;
  title: string;
  rent: number;
  area: number;
  layout: string;
  district: string;
  addressHint: string;
  status: ListingStatus;
  commuteMinutes?: number;
  commuteSource?: ListingCommuteSource;
  lifeCircleScore?: number;
  compositeScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  subjectiveSummary?: {
    lighting?: number;
    quietness?: number;
    decoration?: number;
  };
  commuteSummaries?: {
    anchorName: string;
    mode: string;
    durationMinutes: number;
    distanceMeters: number;
    summary: string;
  }[];
};

这只是输入边界草案，不在本阶段落地为正式类型。

6. Phase 2F 后续建议

下一步可以进入：

Phase 2F-0D：Comparison foundation closing log

如果继续推进代码，也应先做：

Phase 2F-1：pure comparison input selector draft

但 Phase 2F-1 仍应满足：

只写纯函数；
不接 UI；
不新增页面；
不写入 localStorage；
不接 AI；
不改变现有评分逻辑；
不进入正式 Phase 4A comparison data model。