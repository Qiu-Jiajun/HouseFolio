# HouseFolio 开发日志｜2026-05-04｜Phase 3A UI Structure Review

## 1. 阶段目标

本阶段进入 Phase 3A：UI structure review / visual polish boundary。

目标不是改 UI、不是新增页面、不是接入新能力，而是对当前页面入口、页面结构、组件层次、视觉边界、合规覆盖和中文文案集中度做一次评审，确认 Phase 2 之后是否可以进入后续轻量视觉打磨。

本阶段明确不做：

- 不接 AI / DeepSeek；
- 不接地图 UI；
- 不接 POI / 生活圈真实计算；
- 不接 Supabase；
- 不部署；
- 不做 Chrome 插件；
- 不做复杂多锚点权重；
- 不进入正式 Phase 4A comparison data model；
- 不新增 /compare 页面；
- 不做大规模 Tailwind class 重构；
- 不做全站白色居家风切换。

## 2. 已检查的页面文件

本阶段已检查：

- src/app/page.tsx
- src/app/portfolio/page.tsx
- src/app/portfolio/new/page.tsx
- src/app/portfolio/[id]/page.tsx
- src/app/settings/page.tsx
- src/components/app-nav.tsx
- src/components/compliance-footer.tsx

结论：

- 首页、Portfolio、Add Listing、Detail、Settings 均已接入 AppNav；
- 首页、Portfolio、Add Listing、Detail、Settings 均已接入 ComplianceFooter；
- AppNav 覆盖首页、Portfolio、添加房源、Settings；
- Detail 页保留返回 Portfolio 的入口；
- 页面外壳保持一致的深色工程 Demo 风格；
- 主要页面文案基本从 zhCN 文案中心读取；
- 当前没有发现新功能孤岛。

## 3. 已检查的核心组件

本阶段已检查：

- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/components/listing-detail-view.tsx
- src/components/listing-commute-panel.tsx
- src/components/settings-local-data-panel.tsx
- src/components/work-location-settings-panel.tsx

结论：

- ListingDetailView 已形成主内容区 + 右侧信息区的结构；
- Detail 页当前模块顺序合理：
  - 房源基础摘要；
  - 状态管理；
  - 笔记与主观评分；
  - L1 通勤面板；
  - L2 参考评分；
  - L3 占位；
  - 右侧基础信息与合规边界。
- ListingCommutePanel 的 L1 边界清楚：
  - 客户端只调用 HouseFolio 内部 API route；
  - 不直接调用高德 REST API；
  - 不读取 AMAP_API_KEY；
  - 不使用 NEXT_PUBLIC_AMAP_API_KEY；
  - 只展示通勤摘要和本地缓存结果。
- SettingsLocalDataPanel 保留本地数据查看、导出、清除和刷新入口；
- WorkLocationSettingsPanel 支持工作/学习地点（通勤锚点）的新增、展示和删除，并保留隐私边界提示；
- L1 / L2 / L3 在 Detail 页中的视觉分区清楚。

## 4. 编码与乱码核查

本阶段发现 PowerShell Get-Content 输出中曾显示：

- Add Listing 返回链接出现类似 mojibake；
- ListingCommutePanel 中 city 字段显示为乱码。

已用 Node UTF-8 读取真实文件确认：

- src/app/portfolio/new/page.tsx 中真实存在正常左箭头；
- src/components/listing-commute-panel.tsx 中真实存在“北京”；
- src/components/listing-commute-panel.tsx 中不存在“鍖椾含”。

结论：

- 这些是 PowerShell 显示层编码问题；
- 不是文件真实损坏；
- 不需要修改代码；
- 后续仍应以 Node UTF-8 检查 + npm.cmd run build + 浏览器显示作为中文文件判断标准。

## 5. UI 结构评审结论

当前 UI 结构整体合格。

已经满足：

- 页面入口闭环完整；
- 核心页面均可通过导航或上下文入口到达；
- ComplianceFooter 覆盖核心页面；
- Settings 页面保留数据权利入口；
- Detail 页保持 L1 / L2 / L3 三层结构；
- 中文文案集中策略基本保持；
- 当前 UI 没有引入新的合规风险；
- 当前 UI 没有暗示“最佳房源”“系统推荐”“真房源认证”或“替你决定”。

当前不足：

- 整体视觉仍偏工程 Demo；
- 深色 slate 风格稳定但不够接近后续目标的白色、素雅、居家风；
- 页面外壳存在重复，未来可考虑 PageShell 抽象；
- Listing Card 和 Portfolio List 后续可能需要更清楚的信息层级；
- 移动端体验尚未做专项评审；
- 当前不应立即做大规模视觉重构。

## 6. 后续建议

Phase 3A 之后，可以进入轻量视觉边界收口或 Phase 3B。

建议后续优先级：

1. 先记录当前 UI 结构稳定；
2. 再决定是否做小范围视觉 polish；
3. 如果做视觉 polish，应优先只处理页面外壳一致性、卡片层级、按钮样式和空状态；
4. 不要立刻改成完整白色居家风；
5. 不要在 UI polish 中夹带新功能；
6. 不要新增地图 UI、AI 逻辑、POI、Supabase 或正式 comparison model。

## 7. 当前阶段结论

Phase 3A UI structure review 已完成。

本阶段没有修改功能代码，只完成结构评审与边界确认。

当前项目可以继续保持：

- 基础闭环稳定；
- 架构边界清晰；
- 合规边界明确；
- 后续迁移友好；
- UI 后续可小步 polish，但不应大改。