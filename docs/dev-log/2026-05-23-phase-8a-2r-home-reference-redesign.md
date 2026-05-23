# Phase 8A-2R：首页参考图复刻修正版

日期：2026-05-23

## 背景

上一轮 Codex UI 改版未能贴近参考图，已由用户回退，并备份到：

`backup/phase-8a-2-codex-unsat-c8d0102`

本阶段改为只做首页 `/` 的参考图复刻修正版，不扩展到 Portfolio、Compare、Settings 或其他页面。

## 使用工作流

本阶段使用 `pixel-perfect-reference-ui-zh`。

执行原则：

- 参考图是唯一视觉真相。
- 当前 HouseFolio 应用是唯一业务行为真相。
- 只做首页展示层视觉复刻。
- 不把参考图当灵感来源。
- 不下载外部素材。
- 不引入新依赖。

## 参考图

严格参考：

`docs/reference/phase-8a/HouseFolio-home-reference.png`

首页参考图画布尺寸为 `1672x941`。实现时重点对齐：

- 顶部白色导航栏
- 左侧 HouseFolio logo + brand
- 中间五个导航项
- 右侧主题按钮、头像占位和下拉符号
- 左侧 Home 手写体、大号中文标题、副标题和 CTA
- 右侧居家空间抽象插画
- 下方三枚能力卡
- 本地优先提示

## 修改文件

- `src/app/page.tsx`
- `src/content/zh-cn.ts`
- `docs/dev-log/2026-05-23-phase-8a-2r-home-reference-redesign.md`

## 未修改范围

- 未改 Portfolio。
- 未改 AppNav。
- 未改 ListingCard。
- 未改 PortfolioList。
- 未改 Compare。
- 未改 Settings。
- 未改 AI / LBS / Algorithm / API / localStorage。

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
