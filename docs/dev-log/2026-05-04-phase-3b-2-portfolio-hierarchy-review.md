# HouseFolio 开发日志｜2026-05-04｜Phase 3B-2 Portfolio Card Hierarchy Review

## 1. 阶段目标

本阶段属于 Phase 3B 的轻量视觉打磨范围评审。

目标是评审 Portfolio 页面中的信息层级，尤其是：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx

本阶段只做结构和视觉层级评审，不修改代码，不新增功能，不新增页面。

明确不做：

- 不新增 /compare 路由；
- 不新增多房源勾选；
- 不新增横向对比表；
- 不进入正式 ComparisonModel；
- 不接地图 UI；
- 不接 AI / DeepSeek；
- 不接 POI；
- 不接 Supabase；
- 不调整复杂多锚点权重；
- 不把 Reference Score 改成推荐系统。

## 2. 已检查文件

本阶段已检查：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx

检查重点：

- Portfolio 统计区结构；
- 筛选 / 排序控制区结构；
- 当前筛选状态提示；
- 空状态；
- Listing Card 的标题、状态、基础字段、L1/L2 字段、详情入口；
- Reference Score 的显示语境；
- 是否存在真实乱码；
- 是否存在合规越界措辞。

## 3. 编码与乱码核查

PowerShell Get-Content 曾在 portfolio-list.tsx 的筛选状态提示区域显示类似 mojibake 的字符。

已使用 Node UTF-8 真实读取确认：

- 文件中不存在 U+9225 乱码字符；
- 文件中存在正常中文左引号 U+201C；
- 文件中存在正常中文右引号 U+201D；
- 文件中存在 statusText[statusFilter] 表达式；
- 真实片段为正常的 “{statusText[statusFilter]}”。

结论：

- 这仍然是 PowerShell 显示层编码问题；
- 文件真实内容正常；
- 不需要修复 portfolio-list.tsx；
- 后续仍应优先使用 Node UTF-8 检查判断中文真实内容。

## 4. PortfolioList 信息结构评审

当前 PortfolioList 的结构为：

1. 统计卡片区；
2. 筛选 / 排序控制区；
3. 当前筛选状态说明；
4. 房源卡片网格；
5. 空状态。

当前优点：

- 页面先给用户整体数量感，再提供筛选和排序；
- 筛选条件与排序条件集中在同一区块，符合当前 Portfolio 管理页面定位；
- 当前可见房源数量与总房源数量分离，便于用户理解筛选结果；
- 已有候选数量提示，帮助用户理解 shortlist 状态；
- 空状态没有诱导用户抓取外部房源；
- 没有新增 compare、多选、地图或 AI 入口，符合当前阶段边界。

当前不足：

- 三个统计卡片的视觉权重接近，但业务优先级并不完全相同；
- 平均可见租金对用户有参考价值，但当前可能略抢视觉；
- 筛选 / 排序区与卡片列表之间的层次可读性仍偏工程 Demo；
- 后续可考虑让 Portfolio 更像私人决策工作台，而不是纯数据列表。

当前结论：

- PortfolioList 结构合格；
- 暂不需要代码调整；
- 后续如果做轻量 polish，应只做视觉层级微调，不新增功能。

## 5. ListingCard 信息层级评审

当前 ListingCard 的展示顺序为：

1. 区域 / 地址线索；
2. 房源标题；
3. 状态标签；
4. 租金 / 面积 / 户型；
5. 通勤 / 生活圈 / 参考评分；
6. 参考评分说明；
7. 查看详情入口。

当前优点：

- 卡片先展示房源识别信息，再展示基础字段，再展示 L1 / L2 决策字段；
- 租金、面积、户型被放在第一组卡片中，适合作为基础判断；
- 通勤、生活圈、参考评分被放在第二组，能承接 Phase 2 的 L1 → L2 闭环；
- commuteSource 已显示“默认参考值 / 本地通勤结果”，有利于数据透明；
- Reference Score 仍保持辅助比较语境；
- 没有使用“最佳房源”“系统推荐”“替你决定”“真房源”等越界表达。

当前不足：

- 租金通常是租客最敏感字段，当前与面积、户型同权，后续可稍微增强；
- 通勤和参考评分已经成为 HouseFolio 的核心差异化，但当前视觉权重偏弱；
- 六个字段分两排展示，信息密度略高；
- 每张卡都显示 referenceScoreNote，合规上安全，但视觉上有一定重复；
- 查看详情按钮是当前主要行动入口，视觉上可以略微增强，但不应变成推荐动作。

当前结论：

- ListingCard 当前可用；
- 不建议现在大改；
- 后续小步 polish 可以优先处理租金、通勤、参考评分三类信息的层级关系。

## 6. 合规与产品边界检查

本阶段未发现以下问题：

- 没有房源抓取入口；
- 没有公开房源库表达；
- 没有房源真实性认证措辞；
- 没有撮合、预约看房、联系房东或佣金相关入口；
- 没有 AI 自动决策表达；
- 没有把 Reference Score 写成推荐系统；
- 没有新增地图 UI；
- 没有进入正式 comparison model。

当前 Portfolio 仍然是：

- 私人候选房源管理；
- 筛选与排序；
- 参考评分辅助比较；
- 进入详情页继续查看 L1 / L2 / L3 结构。

## 7. 后续建议

后续如果进入 Phase 3B-5 Small visual polish implementation，可以考虑以下极小改动候选：

1. ListingCard 中略微增强租金字段视觉权重；
2. ListingCard 中让通勤和参考评分更像决策字段；
3. 降低 referenceScoreNote 的重复噪音；
4. 微调查看详情按钮层级；
5. 保持 PortfolioList 控制区不新增功能；
6. 不新增 compare 入口，直到正式进入 Phase 4A 或之后。

但当前阶段不建议立即改代码。

## 8. 当前阶段结论

Phase 3B-2 Portfolio card hierarchy review 完成。

结论：

- PortfolioList 结构合格；
- ListingCard 信息层级可用；
- 当前不需要修复乱码；
- 当前不需要代码改动；
- 后续可在明确边界后做极小视觉 polish；
- 不应在本阶段夹带 comparison、地图、AI、POI、Supabase 或复杂多锚点权重。