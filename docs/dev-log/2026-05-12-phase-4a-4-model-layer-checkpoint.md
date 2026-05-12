# Phase 4A-4：Phase 4A model layer checkpoint

日期：2026-05-12

## 1. 本阶段目标

本阶段目标是对 Phase 4A-0 至 Phase 4A-3 的 L2 comparison model layer 做阶段性收口检查。

本阶段只做 checkpoint 文档记录，不修改功能代码。

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

## 2. 当前完成阶段

当前 Phase 4A model layer 已完成：

### Phase 4A-0：L2 comparison 前置评审

文件：

- docs/architecture/phase-4a-0-l2-comparison-boundary-review.md

提交：

- 2389c9c docs: review l2 comparison boundary

完成内容：

- 明确 L2 comparison 应进入主线
- 明确第一步不做 UI
- 明确不新增 /compare
- 明确不做多房源勾选
- 明确不调用 AI、高德、Supabase
- 明确 ComparisonModel 禁止敏感字段
- 明确 Reference Score 仍是辅助比较，不是推荐系统

### Phase 4A-1：Comparison data model

文件：

- src/types/comparison.ts
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- docs/dev-log/2026-05-12-phase-4a-1-comparison-data-model.md

提交：

- c7f5ad8 feat: add comparison data model
- eea41b2 docs: log comparison data model

完成内容：

- 新增正式 ComparisonModel 类型
- 将 comparison 领域类型抽离到 src/types/comparison.ts
- 保持 src/lib/algorithm/comparison.ts 作为纯函数 selector / builder
- 保持 ComparisonInput 与 ComparisonModel 的兼容关系
- 初步加入 missingFields / riskFlags / signal 等结构

### Phase 4A-2：Comparison selector regression / boundary check

文件：

- docs/dev-log/2026-05-12-phase-4a-2-comparison-selector-regression.md

提交：

- 3763033 docs: log comparison selector regression

完成内容：

- 检查 comparison selector 无 localStorage / IndexedDB / fetch / AI / Supabase / Blob 调用
- 检查 ComparisonModel 无 coordinate / rawResponse / requestUrl / polyline / apiKey / photoBlob / videoBlob / noteText / doorNumber 等禁止字段
- 确认 selector 仍是纯函数数据整形层
- 确认没有新增 /compare
- 确认没有修改 UI

### Phase 4A-3：Comparison contract check hardening

文件：

- src/lib/algorithm/comparison-contract-check.ts
- docs/dev-log/2026-05-12-phase-4a-3-comparison-contract-hardening.md

提交：

- 78308dc test: harden comparison contract check
- cc0f5eb docs: log comparison contract hardening

完成内容：

- 扩展 ForbiddenComparisonModelKeys
- 新增 AllowedComparisonModelKeys 白名单检查
- 新增 ComparisonInput 与 ComparisonModel 同形检查
- 新增 ComparisonCommuteSummary / ComparisonSubjectiveSummary / ComparisonSignal 子结构禁止字段检查
- 新增 ComparisonMissingField / ComparisonRiskFlag 覆盖检查
- 修正一次 TypeScript 泛型断言写法导致的 build 失败
- 最终 build 通过

## 3. 当前文件存在性检查

已确认以下文件存在：

- docs/architecture/phase-4a-0-l2-comparison-boundary-review.md
- src/types/comparison.ts
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- docs/dev-log/2026-05-12-phase-4a-1-comparison-data-model.md
- docs/dev-log/2026-05-12-phase-4a-2-comparison-selector-regression.md
- docs/dev-log/2026-05-12-phase-4a-3-comparison-contract-hardening.md

## 4. 当前 build 检查

已执行：

    npm.cmd run build

结果：

- Next.js build 通过
- TypeScript 检查通过
- 当前路由保持不变

当前路由仍为：

    /
    /_not-found
    /api/lbs/commute/transit
    /demo
    /portfolio
    /portfolio/[id]
    /portfolio/new
    /settings

确认没有新增：

    /compare
    /compare/page.tsx

## 5. 当前边界扫描

已扫描 src/lib/algorithm/comparison.ts。

扫描关键词包括：

- localStorage
- sessionStorage
- indexedDB
- fetch
- axios
- amap
- AMAP
- DeepSeek
- supabase
- Blob
- objectUrl
- prompt
- aiResponse

结果：

    无命中

说明当前 comparison selector 仍然没有副作用，也没有直接访问平台、网络、浏览器存储或 AI。

已扫描 src/types/comparison.ts。

扫描关键词包括：

- coordinate
- rawResponse
- requestUrl
- polyline
- apiKey
- photoBlob
- videoBlob
- objectUrl
- imageBase64
- fullNote
- noteText
- doorNumber
- roomNumber
- buildingNumber

结果：

    无命中

说明当前 ComparisonModel 没有暴露 LBS 原始数据、AI 原文、照片视频本体、完整笔记原文或精确地址字段。

## 6. 当前 L2 comparison model layer 状态

当前已经形成：

    src/types/comparison.ts
    = comparison 稳定领域类型 / 数据合同

    src/lib/algorithm/comparison.ts
    = comparison 纯函数 selector / builder

    src/lib/algorithm/comparison-contract-check.ts
    = comparison 类型边界检查

这一层当前可以为后续 Compare UI 提供结构化输入基础，但本身不承担 UI、路由、选择状态、AI 解释或地图计算。

## 7. 当前明确未完成事项

当前尚未完成，也不应声称完成：

- /compare 路由
- compare 页面
- Portfolio 多房源勾选
- 横向对比表 UI
- URL query selection
- selection localStorage
- Compare UI 空状态
- Compare UI 入口
- L3 AI 对比解释
- 多通勤锚点权重模型
- 相对性价比正式规则
- 异常值检测正式规则
- 用户自定义权重

## 8. Reference Score 边界继续保持

当前 comparison model 只读取 referenceScore / scoreBreakdown 等结构化结果。

Reference Score 仍然只能表述为：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐
- 用户可根据硬性条件一票否决

仍然禁止表述为：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

## 9. L2 / L3 边界继续保持

当前 L2 comparison model layer：

- 不使用 LLM
- 不调用 AI
- 不做自然语言建议
- 不判断真房源
- 不替用户排序或决定

未来 L3 只能在 L2 结果之后做人话解释，并且只能基于脱敏后的 ComparisonModel 摘要。

未来 L3 不得：

- 读取完整笔记原文
- 读取照片或视频
- 读取完整地址门牌号
- 基于完整地址和通勤锚点做个人画像
- 用 AI 重新打分
- 用 AI 替用户排序
- 输出“最佳房源”
- 输出“系统推荐”
- 输出“真房源”判断

## 10. 当前阶段结论

Phase 4A model layer checkpoint 通过。

HouseFolio 当前已经具备正式 L2 comparison 的模型层基础：

- 有前置边界评审
- 有正式 ComparisonModel
- 有纯函数 selector
- 有边界回归日志
- 有加强版 contract check
- build 通过
- git clean
- 未新增 /compare
- 未改 UI
- 未接 AI / 高德 / Supabase

下一步建议进入：

    Phase 4B-0：Compare UI route review

但 Phase 4B-0 仍应先写评审文档，不应直接实现页面。

Phase 4B-0 应回答：

- 是否新增 /compare
- /compare 是否使用 URL query selection
- Portfolio 是否需要多房源勾选
- selection 是否持久化
- Compare 页面是否接入 AppNav / ComplianceFooter
- Compare 页面如何避免成为功能孤岛
- Compare UI 如何继续避免“推荐系统”措辞
- Compare UI 是否展示照片封面，以及是否需要单独评审