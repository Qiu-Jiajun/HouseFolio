# Phase 8A-2R-1：首页背景图资产接入与 CTA 链接修正

日期：2026-05-23

## 阶段性质

本阶段是 Phase 8A-2R 的小修补，不是重做首页，也不是全站改版。

## 修改内容

- 接入生成的首页居家背景图资产：`/images/phase-8a/home-hero-living-room.png`
- 移除首页前端重复渲染的 Home 手写文本，避免与背景图中的 Home 重叠。
- 保留中文主标题文案，并将大标题字重加粗。
- 将“了解如何辅助比较”链接修正为 `/demo`。
- 对三枚能力卡做尺寸与间距微调，减少拥挤与图文遮挡风险。

## 修改范围

- `src/app/page.tsx`
- `docs/dev-log/2026-05-23-phase-8a-2r-1-home-asset-polish.md`

`src/content/zh-cn.ts` 未新增业务能力或合同助手相关文案。

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
