# HouseFolio｜Phase 3B-5 Small Visual Polish Implementation Plan

## 1. 阶段目标

Phase 3B-5 的目标是把 Phase 3B-2、Phase 3B-3、Phase 3B-4 的评审结论收敛为一个可执行的小范围视觉微调计划。

本阶段仍然不是正式实现阶段，不修改功能代码，不新增页面，不改变数据模型。

Phase 3B-5 只回答三个问题：

1. 哪些视觉问题值得在当前阶段小步处理；
2. 哪些改动风险低、收益明确；
3. 哪些 UI 改动必须继续后置，避免扩大范围。

## 2. 当前输入来源

本计划基于以下已完成评审：

- Phase 3B-2：Portfolio card hierarchy review；
- Phase 3B-3：Detail module rhythm review；
- Phase 3B-4：Settings readability review。

当前已确认：

- PortfolioList 结构合格；
- ListingCard 信息层级可用；
- Detail 页模块顺序合理；
- ListingCommutePanel 功能边界稳定，但信息密度偏高；
- ReferenceScorePanel 解释完整，但略显仪表盘化；
- Settings 页面数据权利入口完整；
- 工作/学习地点（通勤锚点）设置可读；
- 当前没有真实乱码需要修复。

## 3. Phase 3B-5 允许进入实现候选的改动

### 3.1 ListingCard 信息层级微调

允许考虑的极小改动：

- 略微增强租金字段视觉权重；
- 让通勤时间和参考评分更像决策字段；
- 适度降低 referenceScoreNote 的重复视觉噪音；
- 稍微增强“查看详情”按钮的行动感。

不允许：

- 新增 compare 入口；
- 新增多选框；
- 新增地图入口；
- 新增 AI 建议入口；
- 新增“推荐”“最佳”“最优”等措辞。

建议优先级：

高。

原因：

Portfolio 是用户最常访问的候选房源管理页面。ListingCard 是最小、最安全、收益最明确的视觉 polish 起点。

### 3.2 Detail L1 / L2 面板可读性微调

允许考虑的极小改动：

- 降低 L1 面板中“地图状态：未接入”的视觉权重；
- 强化当前通勤时间与通勤来源提示；
- 让已保存通勤结果列表更易扫读；
- 让 L2 总参考分更清楚；
- 适度弱化默认权重说明的技术感。

不允许：

- 新增地图 UI；
- 新增 POI 真实计算；
- 新增 walking / cycling / driving 页面按钮；
- 改变通勤计算逻辑；
- 改变 Reference Score 算法；
- 改变多锚点最小策略；
- 接入 AI。

建议优先级：

中。

原因：

Detail 页目前结构稳定，L1 / L2 是核心差异化，但模块较重。可以轻微优化可读性，但不应大改。

### 3.3 Settings 按钮主次与危险操作视觉微调

允许考虑的极小改动：

- 让导出 JSON 成为主要正向操作；
- 让刷新快照成为低权重辅助操作；
- 让清除本机数据保持危险操作样式；
- 在视觉上进一步区分清除按钮和普通按钮；
- 轻微弱化 localStorage key 的视觉权重。

不允许：

- 新增账号删除；
- 新增云端数据导出；
- 新增 AI 授权撤回；
- 新增照片删除；
- 接入 Supabase；
- 改变 localStorage key；
- 改变数据清除范围。

建议优先级：

中低。

原因：

Settings 当前已经可用。数据权利入口完整，后续可以微调，但不是最优先。

## 4. 本阶段建议执行顺序

如果进入 Phase 3B-6 代码实现，建议只选一个最小目标开始：

### Phase 3B-6A：ListingCard micro polish

文件范围：

- src/components/listing-card.tsx

可选涉及：

- src/content/zh-cn.ts，仅在必须补充极少文案时使用。

目标：

- 优化卡片视觉层级；
- 不改变字段；
- 不改变数据来源；
- 不改变链接；
- 不新增功能。

验收标准：

- npm.cmd run build 通过；
- git status clean；
- 卡片仍显示租金、面积、户型、通勤、生活圈、参考评分；
- commuteSource 仍显示；
- Reference Score 仍保持参考语境；
- 不出现“推荐”“最佳”“最优”“真房源”等措辞。

### Phase 3B-6B：Detail L1 / L2 readability micro polish

文件范围：

- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx

目标：

- 只改善可读性；
- 不改变通勤计算；
- 不改变评分逻辑；
- 不新增地图 UI；
- 不新增 AI。

验收标准：

- npm.cmd run build 通过；
- L1 仍只显示通勤摘要；
- API route 调用逻辑不变；
- localStorage 写入逻辑不变；
- L2 disclaimer 仍存在；
- L3 仍为禁用占位。

### Phase 3B-6C：Settings readability micro polish

文件范围：

- src/components/settings-local-data-panel.tsx
- src/components/work-location-settings-panel.tsx

目标：

- 微调按钮主次；
- 强化危险操作视觉；
- 不改变数据权利功能；
- 不新增云端或 AI 能力。

验收标准：

- npm.cmd run build 通过；
- 导出 JSON 仍可用；
- 清除本机数据仍有 confirm；
- 刷新快照仍可用；
- 工作/学习地点新增和删除仍可用；
- 不新增 Supabase / AI / 地图能力。

## 5. 当前推荐的第一步实现

建议下一步优先做：

Phase 3B-6A：ListingCard micro polish。

原因：

- 文件范围最小；
- 不涉及 API；
- 不涉及 localStorage；
- 不涉及 LBS；
- 不涉及评分逻辑；
- 对用户第一眼体验提升最直接；
- 最适合作为 Phase 3B 第一处实际视觉 polish。

建议 3B-6A 的改动原则：

- 只改 Tailwind class 与局部 JSX 排列；
- 不改类型；
- 不改数据；
- 不改 zhCN 文案，除非必须；
- 不改 portfolio 排序 / 筛选逻辑；
- 不改 Reference Score 语义；
- 不新增任何入口。

## 6. 明确后置事项

以下事项继续后置：

- 全站白色居家风重构；
- PageShell 抽象；
- shadcn/ui 大规模迁移；
- 移动端专项重构；
- /compare 路由；
- 多房源勾选；
- 横向对比表；
- 正式 ComparisonModel；
- 异常值检测；
- 相对性价比；
- 复杂多锚点权重；
- POI / 生活圈真实计算；
- 地图 UI；
- AI / DeepSeek；
- Supabase；
- 部署；
- Chrome 插件。

## 7. 风险控制

任何 Phase 3B 后续视觉实现都必须遵守：

- 每次只改一个小目标；
- 每次只改少量文件；
- 每次执行 npm.cmd run build；
- 每次 git status 必须 clean 后再继续；
- 不在 UI polish 中夹带新功能；
- 不引入新依赖；
- 不新增数据模型；
- 不扩大合规风险；
- 不把 Reference Score 改成推荐系统。

## 8. 当前结论

Phase 3B-5 的结论是：

- 当前可以进入小范围视觉 polish；
- 第一优先级建议为 ListingCard micro polish；
- Detail 与 Settings 暂时只作为后续候选；
- 任何实现都必须保持功能不变、边界不变、合规不变。

建议下一阶段为：

Phase 3B-6A：ListingCard micro polish。