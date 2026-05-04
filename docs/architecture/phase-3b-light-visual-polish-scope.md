# HouseFolio｜Phase 3B Light Visual Polish Scope

## 1. 阶段目标

Phase 3B 的目标是定义轻量视觉打磨范围，而不是立即做 UI 大改。

当前 HouseFolio 已经完成 Phase 2 的 L1 → L2 最小闭环，并完成 Phase 3A UI structure review。Phase 3B 只允许在不破坏现有功能、不扩大产品边界、不引入新平台能力的前提下，规划后续可执行的小范围视觉优化。

本阶段核心原则：

- 只做视觉层、结构层、可读性层面的轻量打磨；
- 不新增业务能力；
- 不新增页面；
- 不改变数据模型；
- 不接 AI；
- 不接地图 UI；
- 不接 POI；
- 不接 Supabase；
- 不进入正式 comparison model。

## 2. 当前 UI 状态判断

当前 UI 结构已经可用：

- 首页、Portfolio、Add Listing、Detail、Settings 均已接入 AppNav；
- 核心页面均已接入 ComplianceFooter；
- Settings 页面保留本地数据查看、导出、清除入口；
- Detail 页保留 L1 / L2 / L3 三层结构；
- 工作/学习地点（通勤锚点）设置入口已在 Settings 中；
- L1 通勤结果与 L2 Reference Score 的展示路径已稳定；
- 中文文案主要集中在 src/content/zh-cn.ts。

当前 UI 的主要问题不是功能缺失，而是视觉仍偏工程 Demo：

- 页面整体深色 slate 风格稳定，但不够接近后续目标的白色、素雅、居家风；
- 卡片层级和按钮主次关系可以更清楚；
- Portfolio 列表的信息密度后续需要优化；
- Detail 页模块很多，需要保持视觉节奏；
- Settings 页面数据权利区块可读性可以进一步强化；
- 移动端体验尚未专项打磨。

## 3. Phase 3B 允许评估的优化项

Phase 3B 允许评估但不一定立即执行的范围：

### 3.1 页面外壳一致性

允许评估：

- 首页、Portfolio、Add Listing、Detail、Settings 的容器宽度是否一致；
- 页面标题区的 eyebrow、title、description 是否使用一致结构；
- AppNav 与页面内容之间的间距是否统一；
- ComplianceFooter 与主体内容之间的距离是否统一。

暂不执行：

- 大规模 PageShell 抽象；
- 全站 layout 重构；
- 全站颜色主题切换。

### 3.2 卡片信息层级

允许评估：

- Listing Card 中价格、通勤、参考评分、状态标签的视觉优先级；
- Detail 页 summary cards 的信息层级；
- L1 通勤结果卡片的可读性；
- L2 Reference Score 维度拆解的层级。

暂不执行：

- 新增 compare card；
- 新增地图卡片；
- 新增 AI 建议卡片；
- 新增房源真实性提示或平台级标签。

### 3.3 按钮主次层级

允许评估：

- 主按钮与次按钮是否明显；
- 禁用按钮是否足够清楚；
- 危险操作按钮，如清除本机数据，是否有足够警示；
- 返回入口是否稳定、简洁。

暂不执行：

- 引入复杂组件库；
- 全面迁移 shadcn/ui；
- 改变按钮触发逻辑。

### 3.4 空状态与错误状态

允许评估：

- 没有通勤锚点时的提示是否清楚；
- 没有通勤结果时是否引导用户去 Settings；
- 清除本地数据后的状态是否容易理解；
- API 失败时是否保持用户可理解表达。

暂不执行：

- 新增 toast 系统；
- 新增全局 notification store；
- 新增复杂错误追踪服务。

### 3.5 Settings 数据权利区块

允许评估：

- 本地数据快照是否足够可读；
- 导出 / 清除 / 刷新按钮是否主次清楚；
- mock data 与用户本地数据的区别是否明确；
- 当前未接云端、AI、地图 API 的说明是否持续可见。

暂不执行：

- 新增账号删除；
- 新增云端数据导出；
- 新增 AI 授权撤回；
- 新增照片删除；
- 接入 Supabase 后端。

## 4. Phase 3B 明确禁止事项

Phase 3B 禁止做：

- 全站白色居家风重构；
- 新增 /compare 路由；
- 新增多房源勾选；
- 新增横向对比表；
- 正式 ComparisonModel；
- 异常值检测；
- 相对性价比；
- 复杂多锚点权重；
- POI / 生活圈真实计算；
- 地图 UI；
- AI / DeepSeek；
- Supabase；
- 部署；
- Chrome 插件；
- 房源抓取；
- 房源聚合；
- 真房源认证；
- 推荐系统措辞。

## 5. 后续执行建议

Phase 3B 后续可以拆成几个极小阶段：

### Phase 3B-2：Portfolio card hierarchy review

只评估 Listing Card 与 Portfolio List 的信息层级。

可能输出：

- 哪些信息应该更突出；
- 哪些信息应该降级；
- 哪些信息暂时不动；
- 是否需要一个很小的卡片样式调整。

### Phase 3B-3：Detail module rhythm review

只评估 Detail 页模块顺序、间距、卡片节奏。

可能输出：

- L1 / L2 / L3 分区是否需要视觉弱化或强化；
- 右侧栏信息是否需要重新排序；
- 是否需要减少视觉噪音。

### Phase 3B-4：Settings readability review

只评估 Settings 页面数据权利和通勤锚点设置的可读性。

可能输出：

- 是否需要更清楚的分组标题；
- 是否需要更明显的危险操作提示；
- 是否需要把数据快照卡片层级调整得更清楚。

### Phase 3B-5：Small visual polish implementation

只有在前面评审明确后，才允许做最小代码改动。

每次只允许改一个小目标，例如：

- 统一页面标题区间距；
- 微调 Listing Card 信息层级；
- 微调 Settings 数据权利按钮层级；
- 微调 Detail L1 / L2 卡片可读性。

## 6. 验收标准

Phase 3B 范围定义完成的验收标准：

- 本文档存在；
- npm.cmd run build 通过；
- git status clean；
- 没有修改功能代码；
- 没有新增页面；
- 没有新增依赖；
- 没有引入 AI、地图 UI、POI、Supabase 或 comparison model；
- 没有改变 HouseFolio 的合规边界；
- 没有把 Reference Score 写成推荐系统。

## 7. 当前结论

Phase 3B 应作为轻量视觉打磨的范围控制阶段。

在正式写任何 UI polish 代码前，必须先完成范围定义和局部评审，避免在“美化界面”的名义下引入新功能、新数据模型或新合规风险。