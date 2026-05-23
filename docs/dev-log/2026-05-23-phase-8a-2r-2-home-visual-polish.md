# Phase 8A-2R-2：首页首屏视觉细节 polish

日期：2026-05-23

## 阶段性质

本阶段是 Phase 8A-2R-2 首页首屏视觉细节 polish，基于用户人工验收反馈进行小修，不重做首页，不改全站。

## 修改内容

- 继续使用 `/images/phase-8a/home-hero-living-room.png` 作为首页居家背景图。
- 微调中文标题位置，修复与背景图中 Home 手写字的避让关系。
- 大标题加粗，但不继续放大字号。
- 优化副标题断行，将“常见合同风险”作为不拆开的短语展示。
- 弱化次按钮边框与图标颜色，并保持 `href="/demo"`。
- 缩小三枚能力卡，减小 icon 圆圈和卡片内边距，优化 icon、标题、副标题间距。
- 上移本地优先提示，让它更接近能力卡下方补充说明。
- 顶部导航“本地数据”改为“设置”，并将图标替换为统一线性齿轮图标。

## 修改范围

- `src/app/page.tsx`
- `src/content/zh-cn.ts`
- `docs/dev-log/2026-05-23-phase-8a-2r-2-home-visual-polish.md`

## 未修改范围

- 未修改 Portfolio。
- 未修改 AppNav。
- 未修改 ListingCard。
- 未修改 Compare。
- 未修改 Settings。
- 未修改 AI / LBS / Algorithm / API / localStorage。

## 未实现事项

- 未实现合同助手。
- 未新增 `/contract-review`。
- 未新增 API route。
- 未新增 localStorage key。
- 未新增依赖。

## 验收方式

- `npm.cmd run build`
- 对 `src/content/zh-cn.ts` 和 `src/app/page.tsx` 执行禁词扫描：
  `最佳房源|最优选择|系统推荐|推荐分|替你决定|AI 律师|法律审查系统|判定违法|霸王条款检测|保证避坑|自动维权|provider|payload`
