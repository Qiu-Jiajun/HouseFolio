# Phase 4A-1：Comparison data model 开发日志

日期：2026-05-12

## 1. 本阶段目标

本阶段目标是为 HouseFolio 正式 L2 comparison 主线建立第一版稳定数据模型。

本阶段只做类型层与纯函数 selector 调整，不进入 UI 实现。

本阶段不做：

- 不新增 /compare 路由
- 不新增 compare 页面
- 不修改 Portfolio UI
- 不做多房源勾选
- 不新增 selection localStorage key
- 不调用高德
- 不调用 AI
- 不调用 Supabase
- 不读取照片 Blob
- 不读取视频 Blob
- 不处理完整笔记原文
- 不修改 Settings 数据权利逻辑

## 2. 完成内容

本阶段新增：

- src/types/comparison.ts

本阶段更新：

- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts

## 3. 新增 ComparisonModel 类型

本阶段将正式 comparison 数据模型从 algorithm selector 中抽离到：

    src/types/comparison.ts

核心类型包括：

- ComparisonModel
- ComparisonCommuteSummary
- ComparisonSubjectiveSummary
- ComparisonScoreBreakdown
- ComparisonSignal
- ComparisonMissingField
- ComparisonRiskFlag

这样形成了更清晰的分层：

    src/types/comparison.ts
    = 稳定领域类型 / 数据合同

    src/lib/algorithm/comparison.ts
    = 纯函数 selector / builder

    src/lib/algorithm/comparison-contract-check.ts
    = 类型边界检查

## 4. ComparisonModel 第一版字段边界

第一版允许进入 ComparisonModel 的字段包括：

- listingId
- title
- rentMonthly
- areaSqm
- layout
- district
- areaLabel
- status
- sourcePlatform
- sourceUrl
- commuteMinutes
- commuteSource
- commuteSummaries
- lifeCircleScore
- referenceScore
- scoreBreakdown
- subjectiveSummary
- hasNotes
- hasPhotos
- photoCount
- strengths
- weaknesses
- neutralFacts
- missingFields
- riskFlags

第一版明确不进入 ComparisonModel 的内容包括：

- 完整笔记原文
- 完整地址门牌号
- 经纬度
- 高德原始路线 JSON
- 高德 POI 原始 JSON
- request URL
- apiKey
- AI prompt 原文
- AI 原始 response
- 照片 Blob
- 视频 Blob
- object URL
- IndexedDB 内部 key
- 第三方平台原始详情页正文
- 第三方平台图片

## 5. selector 调整

src/lib/algorithm/comparison.ts 继续保持纯函数边界。

当前 selector 仍然只做数据整形：

- 从 Listing 读取基础字段
- 从运行时 listing 读取 commuteMinutes
- 从运行时 listing 读取 commuteSource
- 从运行时 listing 读取 lifeCircleScore
- 从运行时 listing 读取 compositeScore
- 可选接收 ScoreBreakdown
- 可选接收 StoredCommuteResult[]
- 可选接收 ListingSubjectiveRatings
- 输出 ComparisonModel / ComparisonInput

当前 selector 不做：

- 不读取 localStorage
- 不写入 localStorage
- 不访问高德
- 不访问 AI
- 不访问 Supabase
- 不排序
- 不筛选
- 不重新评分
- 不推荐
- 不处理笔记原文
- 不处理照片
- 不处理视频

## 6. contract check 调整

src/lib/algorithm/comparison-contract-check.ts 增加了 ComparisonModel 禁止字段检查。

禁止字段包括：

- coordinate
- coordinates
- origin
- destination
- raw
- rawResponse
- requestUrl
- url
- polyline
- steps
- apiKey
- key
- prompt
- aiPrompt
- aiResponse
- photoBlob
- videoBlob
- blob
- objectUrl
- imageBase64
- fullNote
- noteText
- doorNumber
- roomNumber
- buildingNumber

这保证 ComparisonModel 不会意外吸收 LBS 原始数据、AI 原文、照片视频本体或精确地址字段。

## 7. Reference Score 边界

本阶段没有修改 Reference Score 算法。

ComparisonModel 只读取现有 listing.compositeScore 作为 referenceScore，并继续遵守：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐
- 用户可根据硬性条件一票否决

本阶段没有引入：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

## 8. L2 / L3 边界

本阶段继续确认：

- L2 comparison 只做规则与结构化数据处理
- L2 不使用 LLM 打分、排序、筛选或推荐
- L3 未来只能基于 ComparisonModel 的脱敏摘要做人话解释
- L3 不得读取完整笔记、照片、视频、完整地址或 AI prompt 原文
- L3 不得替用户决定最终房源

## 9. 验证结果

已执行：

    npm.cmd run build

结果：

- Next.js build 通过
- TypeScript 检查通过
- 路由未新增 /compare
- 现有路由保持不变

已执行 UTF-8 / NUL 检查：

- src/types/comparison.ts 无 NUL
- src/lib/algorithm/comparison.ts 无 NUL
- src/lib/algorithm/comparison-contract-check.ts 无 NUL
- 三个文件均未发现已知乱码标记

已执行 git 检查：

- 本阶段代码提交成功

提交：

    c7f5ad8 feat: add comparison data model

## 10. 当前阶段结论

Phase 4A-1 已完成。

HouseFolio 当前已经具备正式 L2 comparison 的第一版数据模型基础。

下一步建议进入：

    Phase 4A-2：Comparison selector extension review / regression

但下一阶段仍不应立即做 UI。

Phase 4A-2 应优先检查：

- buildComparisonInput 是否兼容旧调用
- ComparisonModel 字段是否足够支持后续横向对比
- missingFields / riskFlags 是否需要进一步规则化
- 是否需要补充 comparison selector regression log
- 是否继续不新增 /compare、不改 Portfolio UI、不做 selection state