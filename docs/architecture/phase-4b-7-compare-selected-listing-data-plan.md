# Phase 4B-7：Compare reads selected listing plan

## 0. 阶段定位

Phase 4B-7 是 Compare 根据 URL ids 读取本地房源并生成 ComparisonModel 的实现前计划阶段。

本阶段只写计划文档，不改功能代码。

本阶段新增文件：

- docs/architecture/phase-4b-7-compare-selected-listing-data-plan.md

本阶段不修改：

- src/app/compare/page.tsx
- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/content/zh-cn.ts
- src/lib/algorithm/comparison.ts
- src/types/comparison.ts
- src/lib/local-store/*
- src/lib/privacy/local-data.ts
- src/lib/storage/*
- src/lib/lbs/*
- src/lib/ai/*

## 1. 前置状态

当前已完成：

- Phase 4A：L2 comparison model layer
- Phase 4B-0：Compare UI route review
- Phase 4B-1：Compare route scaffold plan
- Phase 4B-2：Compare route scaffold implementation
- Phase 4B-3：Compare route scaffold regression
- Phase 4B-4：Portfolio selection UI plan
- Phase 4B-5：Portfolio selection minimal implementation
- Phase 4B-6：Portfolio selection regression

当前已有能力：

- Portfolio 可临时选择 2–4 套房源；
- 点击后跳转 `/compare?ids=...`；
- `/compare` 可解析 URL ids；
- `/compare` 可根据 ids 数量显示占位状态；
- selection 不进入 localStorage；
- build 通过；
- 当前未接 AI / 高德 / Supabase；
- 当前未读取照片 Blob。

当前尚未完成：

- `/compare` 根据 ids 读取真实本地 listings；
- `/compare` 调用 ComparisonModel builder；
- `/compare` 渲染真实结构化字段；
- 横向对比表；
- L3 AI 对比解释。

## 2. 本阶段核心问题

Phase 4B-7 需要回答：

1. `/compare` 如何从 URL ids 进入本地 listings 读取？
2. 读取本地 listings 是否会破坏 Server Component / Client Component 边界？
3. `ComparisonModel` builder 应该在哪里调用？
4. 读取失败、id 不存在、房源被删除时如何处理？
5. 第一版是否直接做横向表，还是先展示 JSON-like structured preview？
6. 是否需要新增组件？
7. 是否需要新增 localStorage key？
8. 是否会增加 Settings 数据权利范围？

## 3. 关键技术判断：/compare 读取本地数据必须走 Client Component

当前 `src/app/compare/page.tsx` 是 route scaffold。它读取 `searchParams`，但没有读取浏览器本地数据。

HouseFolio 当前用户房源数据来自本地浏览器数据，因此：

- 读取 localStorage / client lookup 必须发生在 Client Component 中；
- Server Component 不应直接调用 `getAllClientListings()`；
- 不应在 server route 中读取用户本机 localStorage；
- 不应为了 Compare 把 listings 上传到服务端；
- 不应新增 API route 读取本机数据。

推荐结构：

```text
src/app/compare/page.tsx
= Server route shell
= 只读取 searchParams
= 将 ids 传给 client component

src/components/compare-selected-listings-panel.tsx
= "use client"
= 调用 getAllClientListings()
= 根据 ids 过滤 listings
= 调用 buildComparisonModels / comparison builder
= 渲染第一版结构化预览

这样可以保持：

页面路由由 App Router 管理；
本地数据读取只发生在客户端；
不上传用户本机数据；
不新增后端 API；
不引入 Supabase；
不破坏本地优先边界。
4. 推荐文件范围

后续实现阶段建议最小文件范围：

src/app/compare/page.tsx
src/components/compare-selected-listings-panel.tsx
src/content/zh-cn.ts

可能涉及但尽量不改：

src/lib/algorithm/comparison.ts

不应涉及：

src/components/portfolio-list.tsx
src/components/listing-card.tsx
src/lib/local-store/*
src/lib/privacy/local-data.ts
src/lib/storage/*
src/lib/lbs/*
src/lib/ai/*

原因：

Portfolio selection 已经稳定；
当前目标是让 /compare 消费已选 ids；
不应在同一阶段继续改 Portfolio；
不应改本地数据权利范围；
不应接入照片、AI、LBS 或云端。
5. 数据流设计

推荐数据流：

Portfolio selection
→ /compare?ids=listing-001,listing-002
→ page.tsx 解析 ids
→ CompareSelectedListingsPanel 接收 ids
→ client component 调用 getAllClientListings()
→ 根据 ids 过滤本地 listings
→ 调用 comparison builder 生成 ComparisonModel[]
→ 渲染结构化预览

关键约束：

URL 只传 listingId；
不在 URL 中传标题、地址、租金、评分、笔记或照片；
不在 URL 中传 JSON；
不持久化 selection；
不写入 localStorage；
不增加 Settings 数据管理项。
6. id 过滤规则

后续实现时应采用：

对 URL ids 去重；
保持 URL 中的选择顺序；
从本地 listings 中查找对应 id；
仅保留存在的 listings；
不存在的 id 进入 missing count；
有效 listings 少于 2 套时，显示空状态；
有效 listings 超过 4 套时，只提示回 Portfolio 重新选择，不强行展示。

推荐状态：

rawIdsCount：URL 中原始 ids 数量；
uniqueIdsCount：去重后 ids 数量；
foundListingsCount：本机找到的 listings 数量；
missingIdsCount：未找到的 ids 数量。
7. ComparisonModel 调用边界

后续应调用 Phase 4A 已建立的 comparison builder，而不是在 UI 里重新拼模型。

允许：

从 src/lib/algorithm/comparison.ts 导入 builder；
输入本地 runtime listings；
输出 ComparisonModel[];
UI 只渲染模型字段。

禁止：

页面里重新计算评分；
页面里重新排序；
页面里重新调用高德；
页面里重新调用 AI；
页面里读取完整笔记原文；
页面里读取照片 Blob；
页面里访问 IndexedDB；
页面里写 localStorage selection。
8. 第一版展示形态

Phase 4B 后续实现不建议立即做完整横向对比表。

建议第一版做：

已找到 X 套待比较房源；
缺失 Y 个 ids；
每套房源一张结构化 summary card；
展示 ComparisonModel 中的低敏字段：
title
rentMonthly
areaSqm
layout
district / areaLabel
status
commuteMinutes
commuteSource
referenceScore
hasNotes
hasPhotos
photoCount
strengths
weaknesses
missingFields
riskFlags

不展示：

完整笔记原文；
完整地址门牌号；
经纬度；
高德原始路线；
照片 Blob；
object URL；
视频；
AI prompt；
AI response；
第三方平台原始描述；
第三方平台图片。
9. 为什么不直接做横向表

横向表需要额外评审：

移动端横向滚动；
2 / 3 / 4 套房源的列宽策略；
字段行分组；
空值展示；
strengths / weaknesses / riskFlags 的可读性；
是否需要 sticky first column；
是否需要导出；
是否需要截图式展示；
是否需要 L3 解释入口。

这些属于 UI 表达层，不应和“读取 selected listings + 生成 ComparisonModel”混在同一阶段。

因此 Phase 4B-8 可以先做 structured preview，而不是完整 compare table。

10. 中文文案需求

后续实现可能需要新增：

正在读取本机房源数据；
已找到 X 套待比较房源；
有 Y 套房源未在本机数据中找到；
有效房源不足 2 套；
返回 Portfolio 重新选择；
当前为结构化预览，横向表将在后续阶段补充；
参考评分仅用于辅助比较，不代表最终推荐；
本阶段不读取照片文件本体，不接 AI。

文案应集中在：

src/content/zh-cn.ts

可新增：

compareSelectedListingsCopy

不建议把中文散落在 TSX 中。

11. 空状态设计

后续 client panel 应处理：

11.1 本地 listings 仍在加载

显示：

正在读取本机房源数据。
11.2 没有 ids

沿用当前 route scaffold：

当前还没有选择要比较的房源；
返回 Portfolio。
11.3 有 ids，但本机找不到对应房源

显示：

这些房源可能已被删除，或当前浏览器没有对应本地数据；
返回 Portfolio 重新选择。
11.4 有效 listings 少于 2 套

显示：

至少需要 2 套有效房源才能进行横向比较；
当前只找到 X 套；
返回 Portfolio。
11.5 有效 listings 为 2–4 套

显示：

结构化预览；
不直接输出“最佳”或“推荐”。
12. 是否新增 localStorage key

不新增。

读取 listings 本身不等于新增数据类型。

禁止新增：

housefolio:compare-selection
housefolio:compare-history
housefolio:last-compare
housefolio:comparison-state

因此无需修改：

src/lib/privacy/local-data.ts
Settings 本地数据导出
Settings 本地数据导入
Settings 清除本地数据
13. 是否读取照片

不读取照片文件本体。

允许使用 ComparisonModel 中已有低敏字段：

hasPhotos
photoCount

禁止：

getListingCoverPhoto
getPhotoBlob
getThumbnailBlob
IndexedDB
Blob
object URL
base64

原因：

Compare 当前是 L2 结构化比较；
照片本体属于基础层媒体资料；
照片展示需要单独评审；
不应在本阶段引入 lib/storage。
14. 是否接入 L3 AI

不接入。

允许未来阶段：

基于脱敏 ComparisonModel 生成 trade-off 总结；
基于 riskFlags 解释风险；
基于 missingFields 生成补充 checklist。

当前禁止：

AI 打分；
AI 排序；
AI 推荐；
AI 读取笔记原文；
AI 读取照片 / 视频；
AI 输出“最佳房源”；
DeepSeek 接入。
15. 是否接入 LBS / 高德

不接入。

Compare 只消费已有 L1 / L2 结果。

禁止：

新增高德调用；
在 Compare 页面触发地理编码；
在 Compare 页面触发通勤计算；
读取 coordinate；
读取 raw route JSON；
读取 polyline / steps。
16. 是否接入 Supabase / 云端

不接入。

Compare 当前只读取浏览器本地数据。

禁止：

Supabase；
fetch API；
server action；
API route；
云端保存 comparison；
云端保存 selection。
17. 后续阶段拆分建议

建议后续拆分为：

Phase 4B-8：Compare selected listings minimal implementation

目标：

新增 client component；
/compare 将 ids 传给 client component；
client component 读取本地 listings；
根据 ids 过滤 listings；
调用 ComparisonModel builder；
渲染结构化 summary preview；
不做横向表。
Phase 4B-9：Compare selected listings regression

目标：

验证有效 ids；
验证缺失 ids；
验证不足 2 套；
验证 2–4 套；
验证 build；
验证未新增 localStorage key；
验证未接 AI / 高德 / Supabase；
验证未读取照片 Blob。
Phase 4B-10：Compare table UI plan

目标：

只评审横向表结构；
解决移动端、字段行分组、空值展示、风险信号展示；
不直接实现。
18. 验证标准

Phase 4B-7 完成标准：

docs/architecture/phase-4b-7-compare-selected-listing-data-plan.md 已创建；
npm.cmd run build 通过；
git status 只显示该文档变更，或提交后 clean；
未修改 /compare/page.tsx；
未新增 client component；
未修改 Portfolio；
未修改 ListingCard；
未修改 zh-cn.ts；
未新增 localStorage key；
未修改 Settings 数据权利；
未接 AI / 高德 / Supabase；
未读取照片 Blob；
未实现横向表。
19. Commit 建议

建议 commit：

docs: plan compare selected listings data

本阶段完成后，再进入 Phase 4B-8 最小实现。