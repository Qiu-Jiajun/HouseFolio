# HouseFolio 接续文档｜2026-05-04｜Phase 2H｜Phase 2 Closing / Handoff

## 0. 新对话启动说明

我们继续 HouseFolio 项目。

当前最新进度：

- 已完成到 Phase 2G：UI / data regression checkpoint
- Phase 2D–2G 已经形成稳定收口
- 当前最后确认 commit：70aea67 docs: log phase 2g regression checkpoint

当前最高优先级：

- 基础闭环稳定
- 架构边界清晰
- 合规边界明确
- 后续迁移友好

新对话不要直接跳到：

- AI / DeepSeek
- 地图 UI
- POI / 生活圈真实计算
- Supabase
- 部署
- Chrome 插件
- 复杂多锚点权重
- 正式 Phase 4A comparison data model

## 1. 当前已经完成到哪里

当前已完成：

- Phase 2D：L1 Detail 手动 transit 通勤计算闭环
- Phase 2E：L1 commute-results → L2 Reference Score 最小闭环
- Phase 2F：L2 comparison foundation + input boundary + pure selector draft
- Phase 2G：UI / data regression checkpoint

当前没有完成，也不应声称完成：

- 正式 compare 页面
- /compare 路由
- 多房源勾选
- 横向对比表
- 正式 ComparisonModel
- 异常值检测
- 相对性价比
- 复杂多锚点权重
- POI / 生活圈真实计算
- AI 对比分析
- Supabase 持久化
- 地图 UI
- Chrome 插件

## 2. 当前核心能力闭环

当前 HouseFolio 已经形成：

- 工作/学习地点（通勤锚点）本地保存
- Detail 页手动计算公共交通参考通勤
- /api/lbs/commute/transit 服务端 route 调高德
- 服务端只返回 SaveCommuteResultInput[] 摘要
- 客户端 upsert 到 housefolio:commute-results
- listing-lookup.ts 读取 cached transit
- 运行时覆盖 listing.commuteMinutes
- 设置 listing.commuteSource
- L2 Reference Score 使用更新后的 commuteMinutes
- Portfolio 卡片显示更新后的通勤分钟数
- Portfolio 通勤排序生效
- Detail L2 commute breakdown 生效
- UI 标明“默认参考值 / 本地通勤结果”
- Settings 可查看 / 导出 / 清除 commute-results
- comparison input selector 能把现有结构整理为只读 ComparisonInput

这是当前第一个稳定的 L1 → L2 → comparison foundation 最小闭环。

## 3. Phase 2D 摘要

Phase 2D 完成了 L1 Detail transit 通勤计算闭环。

关键文件：

- src/components/listing-commute-panel.tsx
- src/app/api/lbs/commute/transit/route.ts
- src/types/transit-commute-route.ts
- src/types/transit-commute-route-contract-check.ts
- src/types/commute-result.ts
- src/lib/local-store/commute-results.ts
- src/lib/lbs/service.ts
- src/lib/lbs/amap-provider.ts
- src/lib/privacy/local-data.ts

关键边界：

- 客户端不直接调用高德
- 客户端不读取 AMAP_API_KEY
- 不使用 NEXT_PUBLIC_AMAP_API_KEY
- 服务端 route 只返回摘要
- 不返回 coordinate
- 不返回 raw JSON
- 不返回 request URL
- 不返回 polyline
- 不返回 steps
- 不返回 apiKey
- localStorage 只保存通勤摘要

## 4. Phase 2E 摘要

Phase 2E 完成了 L1 commute-results → L2 Reference Score 的最小连接。

关键文件：

- src/lib/local-store/listing-lookup.ts
- src/types/listing.ts
- src/components/listing-card.tsx
- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx
- docs/architecture/l2-commute-scoring-policy.md

当前策略：

- 只读取 mode === "transit"
- 多个 transit 结果暂取最短 durationMinutes
- 没有 cached transit 时回退 listing 默认 commuteMinutes
- 不写回原始 listing
- 不改变 housefolio:commute-results
- UI 显示“默认参考值 / 本地通勤结果”

Reference Score 只能是：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐

不能写成：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

## 5. Phase 2F 摘要

Phase 2F 完成了 L2 comparison foundation 的文档与纯函数草案。

新增 / 更新文件：

- docs/architecture/l2-comparison-foundation-review.md
- docs/architecture/l2-comparison-input-boundary.md
- docs/dev-log/2026-05-04-phase-2f-0-comparison-foundation-closing.md
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- docs/dev-log/2026-05-04-phase-2f-1-comparison-selector.md
- docs/dev-log/2026-05-04-phase-2f-2-comparison-selector-regression.md
- docs/dev-log/2026-05-04-phase-2f-closing.md

comparison.ts 当前只包含纯函数 selector 草案：

- ComparisonCommuteSummary
- ComparisonSubjectiveSummary
- ComparisonInput
- BuildComparisonInputOptions
- buildComparisonInput
- buildComparisonInputs

当前 selector 只做数据整形：

- 从 Listing 读取基础字段
- 从运行时 listing 读取 commuteMinutes
- 从运行时 listing 读取 commuteSource
- 从运行时 listing 读取 lifeCircleScore
- 从运行时 listing 读取 compositeScore
- 可选接收 ScoreBreakdown
- 可选接收 StoredCommuteResult[]
- 可选接收 ListingSubjectiveRatings
- 输出只读 ComparisonInput

当前 selector 不做：

- 不读取 localStorage
- 不写入 localStorage
- 不访问高德
- 不访问 AI
- 不访问 Supabase
- 不处理用户笔记原文
- 不处理照片
- 不排序
- 不筛选
- 不评分
- 不生成推荐

## 6. Phase 2G 摘要

Phase 2G 完成 UI / data regression checkpoint。

最新提交：

- 70aea67 docs: log phase 2g regression checkpoint

已确认：

- git status clean
- npm.cmd run build 通过
- 关键文件无 鈥 乱码
- 关键文件无 鍖椾含 乱码
- comparison.ts 禁止字段扫描无命中
- local-data.ts 覆盖以下 key：
  - housefolio:work-locations
  - housefolio:commute-results
  - housefolio:listings
  - housefolio:listing-notes
  - housefolio:listing-ratings
  - housefolio:listing-status-overrides

## 7. 当前重要文件清单

L1 / commute：

- src/components/listing-commute-panel.tsx
- src/app/api/lbs/commute/transit/route.ts
- src/types/transit-commute-route.ts
- src/types/transit-commute-route-contract-check.ts
- src/types/commute-result.ts
- src/lib/local-store/commute-results.ts

L2 / scoring / comparison foundation：

- src/lib/algorithm/score.ts
- src/lib/algorithm/portfolio.ts
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- src/lib/local-store/listing-lookup.ts

Work locations：

- src/types/work-location.ts
- src/lib/local-store/work-locations.ts
- src/components/work-location-settings-panel.tsx

UI：

- src/components/listing-card.tsx
- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx
- src/components/portfolio-list.tsx
- src/components/settings-local-data-panel.tsx

Privacy / local data：

- src/lib/privacy/local-data.ts

中文文案：

- src/content/zh-cn.ts

## 8. Windows + PowerShell 规则

当前环境：

- Windows + PowerShell
- 项目路径：E:\Projects\housefolio

所有命令默认使用：

- npm.cmd run dev
- npm.cmd run build
- npm.cmd install
- npx.cmd ...

不要默认输出：

- npm run dev
- npm run build
- npm install
- npx ...

## 9. 中文编码规则

不要用 PowerShell Get-Content 的显示结果判断中文文件是否损坏。

Windows PowerShell 可能把 UTF-8 无 BOM 中文显示成乱码，但文件本身正常。

判断中文是否真实正常，优先使用 Node UTF-8 检查 + npm.cmd run build + 浏览器显示。

写入 .tsx / .ts / .md / .json 等文件，尤其包含中文时，使用 .NET WriteAllText 写入 UTF-8 无 BOM。

## 10. 下一轮对话第一步

新对话第一步不要写代码。

先执行：

- Set-Location E:\Projects\housefolio
- git status
- npm.cmd run build
- git log -8 --oneline
- 关键文件乱码检查
- comparison selector 禁止字段检查
- local-data key 覆盖检查

预期：

- git status clean
- build 通过
- 最新 commit 包含 70aea67
- 关键文件乱码检查全部 false
- comparison selector 禁止字段无命中
- local-data key 全部 true

## 11. 下一步建议

下一步建议是：

- Phase 2H-1：Phase 2 final handoff validation

只做检查，不写功能。

如果继续开发，较稳的方向是：

- Phase 3A：UI structure review / visual polish boundary

但在进入 Phase 3A 前，必须先明确：

- 是否只做视觉与结构稳定
- 是否不新增产品能力
- 是否不接 AI
- 是否不接地图 UI
- 是否不接 POI
- 是否不接 Supabase
- 是否不进入正式 comparison model

暂不建议继续扩展 Phase 2F 的 comparison 代码。