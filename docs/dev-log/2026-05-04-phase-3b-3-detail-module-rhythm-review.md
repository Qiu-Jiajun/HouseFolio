# HouseFolio 开发日志｜2026-05-04｜Phase 3B-3 Detail Module Rhythm Review

## 1. 阶段目标

本阶段属于 Phase 3B 的轻量视觉打磨范围评审。

目标是评审 Detail 页面当前模块节奏，尤其是：

- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx

本阶段只做结构和视觉节奏评审，不修改代码，不新增功能，不新增页面。

明确不做：

- 不接 AI / DeepSeek；
- 不接地图 UI；
- 不接 POI / 生活圈真实计算；
- 不接 Supabase；
- 不进入正式 Phase 4A comparison data model；
- 不新增 /compare 页面；
- 不新增复杂多锚点权重；
- 不改变 Reference Score 计算逻辑；
- 不改变 L1 commute-results 存储逻辑。

## 2. 已检查文件

本阶段已检查：

- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx

检查重点：

- Detail 页模块顺序；
- 主内容区与右侧栏结构；
- L1 / L2 / L3 三层展示节奏；
- ListingCommutePanel 信息密度；
- ReferenceScorePanel 的视觉权重；
- 是否存在新增合规风险；
- 是否存在需要立即修复的真实乱码。

## 3. Detail 页面模块顺序评审

当前 Detail 页主内容区顺序为：

1. 房源基础摘要；
2. 房源状态管理；
3. 笔记与主观评分；
4. L1 通勤面板；
5. L2 参考评分；
6. L3 AI 占位。

右侧栏为：

1. 基础信息；
2. 合规边界。

当前优点：

- 先展示房源基础信息，再进入状态、笔记、通勤、评分与 AI 占位，符合用户阅读顺序；
- L1 位于 L2 之前，符合 L1 commute-results 进入 L2 Reference Score 的数据逻辑；
- L3 仍然只是禁用占位，没有实际 AI 调用，边界清楚；
- 右侧栏只承载补充信息和合规边界，没有干扰主决策流；
- 当前结构没有引入新功能孤岛。

当前不足：

- Detail 页模块数量已经较多，后续视觉上需要控制节奏；
- 状态、笔记、L1、L2 都是重量级卡片，视觉权重接近；
- 如果后续继续加入 compare、AI、地图 UI，必须重新评估 Detail 页承载能力；
- 当前不应继续往 Detail 页堆叠新模块。

当前结论：

- Detail 模块顺序合理；
- 暂不需要调整模块顺序；
- 后续 polish 应优先减少视觉噪音，而不是新增功能。

## 4. ListingCommutePanel 节奏评审

ListingCommutePanel 当前包含：

- L1 标题与说明；
- 通勤时间 / 生活圈评分 / 地图状态三张摘要卡；
- 已保存参考通勤结果区域；
- 通勤锚点数量；
- 手动计算公共交通按钮；
- 缺少地址 / 缺少通勤锚点 / 成功 / 失败状态；
- 通勤结果列表；
- reference-only disclaimer。

当前优点：

- L1 边界清楚；
- 客户端只调用 HouseFolio 内部 API route；
- 不直接调用高德 REST API；
- 不读取 AMAP_API_KEY；
- 不使用 NEXT_PUBLIC_AMAP_API_KEY；
- 只展示摘要结果；
- 本地缓存 commute-results 的展示路径清楚；
- 空状态和错误状态相对完整；
- 参考通勤说明没有夸大为精确推荐。

当前不足：

- L1 面板信息密度偏高；
- 摘要卡、缓存结果、按钮、状态提示和免责声明都在同一个大卡片内；
- 如果用户有多个通勤锚点，结果列表会变长；
- 地图状态目前只是“未接入”，后续地图 UI 前不应继续强化该区域；
- 当前通勤结果结构清楚，但视觉上偏工程化。

当前结论：

- ListingCommutePanel 当前可用；
- 不建议立即改代码；
- 后续小步 polish 可考虑降低“地图状态”权重、强化通勤结果主信息、弱化重复说明。

## 5. ReferenceScorePanel 节奏评审

ReferenceScorePanel 当前包含：

- 总参考评分；
- 解释文本；
- 五个维度分数；
- 每个维度的默认权重；
- 进度条；
- reference-only disclaimer。

当前优点：

- 能清楚解释 Reference Score 的维度拆解；
- 用户可以看到租金、面积、通勤、生活圈、主观评分各自贡献；
- disclaimer 明确说明参考评分只是辅助比较，不代表最终推荐；
- 符合 L2 用规则和简单数学、不用 LLM 的边界。

当前不足：

- 进度条和权重展示让面板略显“仪表盘化”；
- 对普通租客而言，默认权重可能显得偏技术；
- 当前 L2 说明较完整，但视觉上可能过重；
- 后续视觉 polish 时可以考虑让总分更清楚、维度解释更轻量。

当前结论：

- 当前阶段应保留 ReferenceScorePanel；
- 不修改评分逻辑；
- 不把 Reference Score 改成推荐系统；
- 后续只允许做视觉层级微调。

## 6. 右侧栏评审

右侧栏当前包含：

- 基础信息；
- 来源平台；
- 创建时间；
- 当前状态；
- 数据范围；
- 合规边界说明。

当前优点：

- 信息职责清楚；
- 没有混入操作按钮；
- 合规边界持续可见；
- 不引导用户公开房源、联系房东或进行交易。

当前不足：

- 右侧栏视觉存在感较弱；
- 在长 Detail 页中，合规边界可能被用户忽略；
- 后续可考虑轻微增强信息分组，但暂不做 sticky 或复杂布局。

当前结论：

- 右侧栏结构合格；
- 暂不需要调整。

## 7. 编码与乱码说明

PowerShell Get-Content 输出中再次显示 ListingCommutePanel 的 city 字段为类似 mojibake。

此前已经使用 Node UTF-8 检查确认：

- src/components/listing-commute-panel.tsx 中真实存在“北京”；
- 不存在“鍖椾含”。

结论：

- 这是 PowerShell 显示层编码问题；
- 不是文件真实损坏；
- 不需要修改 ListingCommutePanel；
- 后续继续以 Node UTF-8 检查 + npm.cmd run build + 浏览器显示判断中文文件状态。

## 8. 合规与产品边界检查

本阶段未发现以下问题：

- 没有房源抓取；
- 没有公开房源库；
- 没有真房源认证；
- 没有撮合交易；
- 没有联系房东、预约看房、佣金或保证金入口；
- 没有 AI 自动建议；
- 没有地图 UI；
- 没有 POI 真实计算；
- 没有 Supabase；
- 没有把 Reference Score 写成推荐系统。

当前 Detail 页仍然保持：

- L1：参考通勤摘要；
- L2：参考评分和维度拆解；
- L3：禁用占位；
- 合规边界：持续说明辅助决策属性。

## 9. 后续建议

如果后续进入 Phase 3B-5 Small visual polish implementation，Detail 页可考虑以下极小改动候选：

1. 略微降低 L1 面板中“地图状态”的视觉权重；
2. 强化“通勤时间”和“本地通勤结果”的主信息表达；
3. 降低 L2 维度权重说明的技术感；
4. 保留 Reference Score disclaimer，但减少重复噪音；
5. 保持 L3 占位禁用，不接 AI；
6. 不新增地图 UI、POI、comparison 或复杂多锚点权重。

## 10. 当前阶段结论

Phase 3B-3 Detail module rhythm review 完成。

结论：

- Detail 页模块顺序合理；
- L1 / L2 / L3 三层结构清楚；
- ListingCommutePanel 功能边界稳定，但信息密度偏高；
- ReferenceScorePanel 解释完整，但略显仪表盘化；
- 右侧栏结构清楚；
- 当前不需要修改代码；
- 后续可以做小范围视觉 polish，但必须避免夹带新功能。