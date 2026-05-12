# Phase 4A-2：Comparison selector regression / boundary check

日期：2026-05-12

## 1. 本阶段目标

本阶段目标是对 Phase 4A-1 新增的 ComparisonModel 与 comparison selector 做一次边界回归检查。

本阶段只做回归记录与边界确认，不修改功能代码。

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

## 2. 当前已完成基础

Phase 4A-0 已完成 L2 comparison 前置评审：

    docs/architecture/phase-4a-0-l2-comparison-boundary-review.md

Phase 4A-1 已完成 Comparison data model：

    src/types/comparison.ts
    src/lib/algorithm/comparison.ts
    src/lib/algorithm/comparison-contract-check.ts

Phase 4A-1 对应提交：

    c7f5ad8 feat: add comparison data model
    eea41b2 docs: log comparison data model

## 3. 启动检查结果

已执行：

    git status

结果：

    working tree clean
    branch up to date with origin/main

已执行：

    npm.cmd run build

结果：

    Next.js build 通过
    TypeScript 检查通过
    路由保持不变

当前路由仍为：

    /
    /_not-found
    /api/lbs/commute/transit
    /demo
    /portfolio
    /portfolio/[id]
    /portfolio/new
    /settings

本阶段没有新增：

    /compare

## 4. 文件存在性检查

已确认以下文件存在：

- src/types/comparison.ts
- src/lib/algorithm/comparison.ts
- src/lib/algorithm/comparison-contract-check.ts
- docs/architecture/phase-4a-0-l2-comparison-boundary-review.md
- docs/dev-log/2026-05-12-phase-4a-1-comparison-data-model.md

## 5. selector 边界扫描

已对 src/lib/algorithm/comparison.ts 执行敏感调用扫描。

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

说明：

- comparison selector 没有读取 localStorage
- comparison selector 没有写入 localStorage
- comparison selector 没有访问 IndexedDB
- comparison selector 没有调用 fetch / axios
- comparison selector 没有调用高德
- comparison selector 没有调用 AI
- comparison selector 没有调用 Supabase
- comparison selector 没有读取照片或视频 Blob
- comparison selector 没有处理 AI prompt 或 AI response

当前 selector 仍然保持纯函数数据整形边界。

## 6. ComparisonModel 禁止字段扫描

已对 src/types/comparison.ts 执行禁止字段扫描。

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

说明 ComparisonModel 当前没有暴露：

- 经纬度
- 高德原始路线数据
- 高德请求 URL
- 高德 polyline
- API key
- 照片 Blob
- 视频 Blob
- object URL
- base64 图片
- 完整笔记原文
- 门牌号 / 房间号 / 楼栋号

这符合 Phase 4A-0 对 ComparisonModel 的字段边界要求。

## 7. L2 边界确认

当前 ComparisonModel 与 selector 仍然属于 L2 结构化比较能力。

它们可以支持后续：

- 横向对比
- 评分拆解展示
- 缺失字段提示
- 风险信号提示
- 通勤摘要展示
- 主观评分摘要展示
- 后续 L3 脱敏解释输入

但当前仍不承担：

- UI 渲染
- 页面路由
- 多房源选择状态
- 排序状态持久化
- AI 分析
- 地图计算
- 真实性判断
- 最终推荐

## 8. Reference Score 边界确认

当前 comparison model 只读取已有 listing.compositeScore 作为 referenceScore。

这仍然只能表述为：

- 参考评分
- 辅助比较
- 维度拆解
- 不代表最终推荐
- 用户可根据硬性条件一票否决

禁止表述仍然包括：

- 推荐分
- 最佳房源
- 最优选择
- 系统推荐
- 替你决定

## 9. L3 边界确认

当前阶段没有接入 L3。

未来 L3 只能基于 ComparisonModel 的脱敏摘要做人话解释。

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

## 10. 当前结论

Phase 4A-2 边界回归检查通过。

当前状态说明：

- ComparisonModel 已经有独立类型文件
- comparison selector 仍然是纯函数
- contract check 已覆盖主要禁止字段
- build 通过
- 没有新增 /compare
- 没有改 UI
- 没有新增 localStorage key
- 没有引入 AI、高德、Supabase 或照片视频读取

Phase 4A-2 可以收口。

下一步建议进入：

    Phase 4A-3：Comparison contract check hardening

Phase 4A-3 仍不应做 UI。

Phase 4A-3 可考虑：

- 是否补充更多禁止字段类型检查
- 是否把 ComparisonModel 与 ComparisonInput 的兼容关系写得更清楚
- 是否增加 missingFields / riskFlags 的类型覆盖检查
- 是否确认 src/types/comparison.ts 不依赖业务组件
- 是否确认 src/lib/algorithm/comparison.ts 不产生副作用