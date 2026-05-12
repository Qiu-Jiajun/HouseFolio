# Phase 4A-3：Comparison contract check hardening

日期：2026-05-12

## 1. 本阶段目标

本阶段目标是加强 ComparisonModel 的类型边界检查，避免后续 L2 comparison 扩展时把敏感字段、平台原始字段、AI 原文或照片视频本体误带入 comparison 数据模型。

本阶段只做 contract check hardening，不修改运行时业务逻辑。

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

## 2. 修改文件

本阶段只修改：

- src/lib/algorithm/comparison-contract-check.ts

未修改：

- src/types/comparison.ts
- src/lib/algorithm/comparison.ts
- 任何 UI 组件
- 任何路由
- 任何 Settings / privacy 文件

## 3. hardening 内容

本阶段加强了以下检查：

### 3.1 ComparisonModel 禁止字段检查

扩展 ForbiddenComparisonModelKeys，禁止字段覆盖：

- 经纬度类字段：coordinate、coordinates、latitude、longitude、lng、lat
- 高德 / LBS 原始字段：origin、destination、raw、rawData、rawJson、rawResponse、requestUrl、polyline、steps
- API key 类字段：apiKey、key、amapKey
- AI 类字段：prompt、aiPrompt、aiResponse、llmResponse
- 照片 / 视频本体字段：photoBlob、videoBlob、blob、objectUrl、imageBase64、thumbnailBase64
- 笔记原文字段：fullNote、noteText、rawNote
- 个人信息字段：phone、wechat、idCard
- 精确地址字段：doorNumber、roomNumber、buildingNumber、unitNumber

### 3.2 ComparisonModel allowed keys 白名单检查

新增 AllowedComparisonModelKeys，确认 ComparisonModel 当前只能包含已评审过的字段：

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

这能避免后续随手向 ComparisonModel 增加未评审字段。

### 3.3 ComparisonInput 与 ComparisonModel 同形检查

当前 ComparisonInput 仍作为 ComparisonModel 的兼容别名使用。

本阶段增加：

- ComparisonInput 与 ComparisonModel 的同形检查
- buildComparisonInput 输出可赋值给 ComparisonModel
- buildComparisonInputs 输出可赋值给 ComparisonModel[]

这保证旧 selector 命名与新模型之间仍保持兼容。

### 3.4 子结构禁止字段检查

本阶段也对以下子结构增加禁止字段检查：

- ComparisonCommuteSummary
- ComparisonSubjectiveSummary
- ComparisonSignal

确保 commute summary、subjective summary、signal 这类子对象也不会出现敏感字段。

### 3.5 missingFields / riskFlags 覆盖检查

本阶段增加：

- ComparisonMissingField 覆盖检查
- ComparisonRiskFlag 覆盖检查

当前 missingFields 覆盖：

- rentMonthly
- areaSqm
- layout
- district
- areaLabel
- commuteMinutes
- referenceScore
- subjectiveSummary

当前 riskFlags 覆盖：

- missingLocation
- missingCommute
- missingSubjectiveRating
- highRent
- lowArea
- longCommute

如果后续扩展 union type 但忘记同步数组检查，TypeScript 会在 build 阶段暴露问题。

## 4. 一次失败与修正

本阶段第一次 hardening 写法使用了嵌套泛型约束：

    AssertTrue<T extends true>

并在泛型断言中直接嵌套条件类型。

这导致 TypeScript 在定义阶段无法证明泛型条件恒为 true，build 报错：

    Type 'boolean' is not assignable to type 'true'.

随后修正为：

    true | never

风格的断言类型。

修正后 build 通过。

## 5. 验证结果

已执行：

    npm.cmd run build

结果：

- Next.js build 通过
- TypeScript 检查通过
- 现有路由保持不变
- 未新增 /compare

已执行 UTF-8 / NUL 检查：

- src/lib/algorithm/comparison-contract-check.ts 无 NUL
- src/lib/algorithm/comparison-contract-check.ts 无已知乱码标记

已执行 git diff 检查：

- 只修改 src/lib/algorithm/comparison-contract-check.ts

代码提交：

    78308dc test: harden comparison contract check

## 6. 当前边界确认

当前 comparison contract check 已经更明确地保护以下边界：

- ComparisonModel 不包含 LBS 原始数据
- ComparisonModel 不包含经纬度
- ComparisonModel 不包含 API key
- ComparisonModel 不包含 AI prompt 或 AI response
- ComparisonModel 不包含照片 / 视频 Blob
- ComparisonModel 不包含 object URL
- ComparisonModel 不包含完整笔记原文
- ComparisonModel 不包含手机号、微信号、身份证号
- ComparisonModel 不包含门牌号、房间号、楼栋号、单元号

这符合 Phase 4A-0 对 L2 comparison 的边界要求。

## 7. 当前阶段结论

Phase 4A-3 已完成。

HouseFolio 当前已完成：

- Phase 4A-0：L2 comparison 前置评审
- Phase 4A-1：Comparison data model
- Phase 4A-2：Comparison selector regression / boundary check
- Phase 4A-3：Comparison contract check hardening

下一步建议进入：

    Phase 4A-4：Phase 4A model layer checkpoint

Phase 4A-4 应只做阶段收口检查与文档记录，不应进入 UI。

Phase 4A-4 可检查：

- build 是否通过
- git 是否 clean
- ComparisonModel 是否存在
- contract check 是否存在
- selector 是否无副作用
- 是否仍未新增 /compare
- 是否仍未改 Portfolio UI
- 是否仍未接 AI / 高德 / Supabase