# HouseFolio 开发日志｜2026-05-04｜Phase 2F-2｜Comparison Selector Regression Review

## 1. 本阶段目标

本阶段目标是对 `src/lib/algorithm/comparison.ts` 与 `src/lib/algorithm/comparison-contract-check.ts` 做边界回归检查。

本阶段不写功能、不接 UI、不新增页面、不新增路由、不读取 localStorage、不接 AI、不接地图、不接 Supabase。

## 2. 检查范围

检查文件：

```text
src/lib/algorithm/comparison.ts
src/lib/algorithm/comparison-contract-check.ts

检查是否误引入以下内容：

localStorage
fetch
AMAP
NEXT_PUBLIC
apiKey
requestUrl
rawResponse
polyline
steps
coordinate
coordinates
sourceUrl
notes 原文
photos
AI / DeepSeek
supabase
3. 检查结果

回归检查结果显示：

comparison.ts 中仅命中 note

该命中属于可接受误报，原因是 comparison.ts 引入了：

import type { ListingSubjectiveRatings } from "@/types/listing-note";

这里的 note 来自类型文件路径 listing-note，不是读取用户笔记原文，也不是把 notes 内容纳入 comparison input。

除此之外，未发现：

localStorage
fetch
AMAP
NEXT_PUBLIC
apiKey
requestUrl
rawResponse
polyline
steps
coordinate
coordinates
sourceUrl
photo
DeepSeek
supabase
4. 类型与函数存在性检查

已确认 comparison.ts 包含：

export type ComparisonInput
export function buildComparisonInput
export function buildComparisonInputs
commuteSummaries
subjectiveSummary
scoreBreakdown

说明 selector 草案仍保持在只读 input shaping 范围内。

5. 当前边界结论

当前 comparison selector 仍然符合 Phase 2F-1 的边界：

只做纯函数数据整形；
不读取 localStorage；
不写入 localStorage；
不访问高德；
不访问 AI；
不访问 Supabase；
不新增 UI；
不新增页面；
不改变 Reference Score；
不处理用户笔记原文；
不处理照片；
不进入正式 Phase 4A comparison data model。
6. 验证结果

已执行：

npm.cmd run build
git status

结果：

build 通过
git status clean
7. 后续建议

下一步建议进入：

Phase 2F closing log

用于整体收口 Phase 2F，记录当前已完成：

comparison foundation review；
comparison input boundary note；
pure comparison input selector draft；
comparison selector regression review。

Phase 2F 收口后，再决定是否继续做极小纯函数改进，或转入 UI 稳定回归。