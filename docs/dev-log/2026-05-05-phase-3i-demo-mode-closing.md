# Phase 3I-7B：Demo Mode regression and closing log

## 1. 阶段定位

本文件是 Phase 3I Demo Mode 最小展示闭环的回归与收口日志。

阶段名称：

Phase 3I-7B：Demo mode regression and closing log

本阶段只写文档，不修改功能代码。

本阶段之前已经完成：

- Phase 3I-1：Demo Mode 前置评审
- Phase 3I-2：Demo Mode implementation plan
- Phase 3I-3：Demo data scaffold
- Phase 3I-4：Demo route shell
- Phase 3I-5：Demo portfolio presentation
- Phase 3I-6：Demo L3 explanation preview
- Phase 3I-7A：Add demo entry on home page

本阶段目标：

- 确认 Demo Mode 最小展示闭环已经形成；
- 确认首页可以进入 /demo；
- 确认 /demo 可以展示 L1 / L2 / L3；
- 确认 /demo 不读取真实用户数据；
- 确认 /demo 不调用高德、AI、云端服务；
- 确认 /demo 不使用真实房源、真实照片或视频；
- 确认 Demo Mode 可以作为求职作品集的稳定演示入口。

## 2. 当前最新结论

Phase 3I 可以正式收口。

当前 Demo Mode 已经形成最小展示闭环：

首页
→ 查看演示
→ /demo
→ 虚构通勤锚点
→ 虚构候选房源
→ L1 通勤摘要
→ L2 参考评分
→ L3 预生成解释
→ 数据隔离说明
→ 进入真实 Portfolio

当前 /demo 已经可以承担作品集展示任务：

- 面试官不需要从空白账户开始录入；
- 面试官可以快速理解 HouseFolio 的产品定位；
- 面试官可以看到 L1 / L2 / L3 三层叙事；
- 面试官可以理解本地优先和数据隔离边界；
- 项目可以先具备可展示入口，再继续推进 Phase 4A 或部署准备。

## 3. Phase 3I-1：Demo Mode 前置评审

新增文档：

docs/architecture/phase-3i-1-demo-mode-boundary-review.md

commit：

3ff6d20 docs: review demo mode boundary

主要结论：

- Demo Mode 必须只使用虚构数据；
- Demo Mode 不读取真实 localStorage；
- Demo Mode 不读取真实 IndexedDB 照片；
- Demo Mode 不修改真实用户数据；
- Demo Mode 不调用真实高德；
- Demo Mode 不调用真实 AI；
- Demo Mode 不使用真实房源图或中介视频；
- Demo Mode 不把 Reference Score 写成推荐系统；
- Demo Mode 不能变成房源平台展示页。

## 4. Phase 3I-2：Demo Mode 实现计划

新增文档：

docs/architecture/phase-3i-2-demo-mode-implementation-plan.md

commit：

36a9ebc docs: plan demo mode implementation

主要结论：

- 第一版采用 /demo 单页路线；
- 先做 demo data scaffold；
- 再做 demo route shell；
- 再做 demo portfolio presentation；
- 再做 demo L3 explanation preview；
- 最后补首页入口和回归日志；
- 不做 Demo Detail；
- 不做 Demo Compare；
- 不做 Demo Map；
- 不做 Demo 视频；
- 不做真实素材。

## 5. Phase 3I-3：Demo data scaffold

新增文件：

src/lib/demo/demo-data.ts
src/lib/demo/index.ts

commit：

c118de1 feat: scaffold demo mode data

完成内容：

- 新增完全虚构的 Demo 数据；
- 包含 3 套虚构房源；
- 包含 2 个虚构通勤锚点；
- 包含预置通勤摘要；
- 包含 L2 参考评分拆解；
- 包含预生成 AI 辅助分析文本；
- 数据源为只读静态数据；
- 不引用 localStorage；
- 不引用 IndexedDB；
- 不引用高德；
- 不引用 AI provider；
- 不包含 AMAP_API_KEY。

## 6. Phase 3I-4：Demo route shell

新增文件：

src/app/demo/page.tsx

commit：

5cb6b2a feat: add demo mode route shell

完成内容：

- 新增 /demo 路由；
- /demo 在 build route 表中显示为静态页面；
- 页面显示演示模式提示；
- 页面显示 Demo 数据统计；
- 页面显示 L1 / L2 / L3 方向说明；
- 页面显示数据隔离说明；
- 页面提供返回首页和进入真实 Portfolio 的入口。

边界：

- 不读 localStorage；
- 不读 IndexedDB；
- 不写真实用户数据；
- 不调用高德；
- 不调用 AI；
- 不接首页入口；
- 不接 AppNav 入口。

## 7. Phase 3I-5：Demo portfolio presentation

修改文件：

src/app/demo/page.tsx

commit：

0041b53 feat: add demo portfolio presentation

完成内容：

- /demo 展示 2 个虚构通勤锚点；
- /demo 展示 3 套虚构房源；
- 每套房展示租金、面积、户型、地址线索；
- 每套房展示 L1 通勤摘要；
- 每套房展示 L2 参考评分；
- 每套房展示主要优势和主要短板；
- 页面继续标注演示数据和数据隔离。

补充验证已通过：

- pageHasDemoPortfolio: true
- pageHasCommuteAnchor: true
- pageHasL2: true
- dataHasListingA: true
- dataHasFictional: true
- pageNoLocalStorage: true
- pageNoIndexedDB: true
- pageNoFetch: true
- pageNoAmapKey: true
- pageNoDeepSeek: true
- pageNoForbiddenBest: true
- pageNoForbiddenRecommend: true
- pageNoForbiddenRealListing: true

## 8. Phase 3I-6：Demo L3 explanation preview

修改文件：

src/app/demo/page.tsx

commit：

17b08c7 feat: add demo ai explanation preview

完成内容：

- /demo 展示 L3 解释预览；
- 每套房源卡片展示预生成分析文本；
- 每套房源卡片展示看房 checklist；
- 页面新增 L3 AI 解释层演示区域；
- 展示 trade-off；
- 文案明确为预生成演示文本；
- 页面明确不调用任何模型服务。

补充验证已通过：

- hasL3Preview: true
- hasChecklist: true
- hasGeneratedText: true
- hasNoFetch: true
- hasNoWindow: true
- hasNoLocalStorage: true
- hasNoIndexedDB: true
- hasNoAmapKey: true
- hasNoDeepSeek: true
- hasNoBest: true
- hasNoSystemRecommend: true
- hasNoTrueListing: true

## 9. Phase 3I-7A：首页 Demo 入口

修改文件：

src/app/page.tsx

commit：

dd7e24a feat: add demo mode entry

完成内容：

- 首页新增“查看演示”入口；
- 首页文案明确演示使用完全虚构的数据；
- 首页文案说明演示模式不会读取或修改真实本机数据；
- 首页可以跳转到 /demo。

补充验证已通过：

- hasDemoHref: true
- hasDemoText: true
- hasFictionalDataText: true
- hasNoLocalStorage: true
- hasNoIndexedDB: true
- hasNoFetch: true
- hasNoAmapKey: true
- hasNoDeepSeek: true

## 10. 当前 Demo Mode 能力

当前 Demo Mode 已经具备：

- 独立 /demo 路由；
- 首页可发现入口；
- 虚构静态数据源；
- 虚构通勤锚点；
- 虚构候选房源；
- 演示图片占位；
- L1 通勤摘要；
- L2 参考评分；
- L2 维度拆解；
- 优势 / 短板；
- L3 预生成解释；
- 看房 checklist；
- trade-off；
- 数据隔离说明；
- 进入真实 Portfolio 的入口；
- AppNav 和 ComplianceFooter。

当前 Demo Mode 不具备，也不应声称具备：

- 真实 AI 调用；
- 真实高德调用；
- 真实地图；
- 真实 POI；
- 真实房源；
- 真实图片；
- 视频展示；
- Demo Detail；
- Demo Compare；
- Demo Map；
- 交互式 Demo 编辑；
- 真实数据导入 / 导出；
- 云同步；
- 部署链接。

## 11. 当前关键文件

Demo data：

src/lib/demo/demo-data.ts
src/lib/demo/index.ts

Demo page：

src/app/demo/page.tsx

Home entry：

src/app/page.tsx

前置文档：

docs/architecture/phase-3i-1-demo-mode-boundary-review.md
docs/architecture/phase-3i-2-demo-mode-implementation-plan.md

## 12. 回归验证标准

当前已经验证：

- npm.cmd run build 通过；
- Route (app) 包含 ○ /demo；
- 首页包含 href="/demo"；
- 首页包含“查看演示”；
- 首页包含“完全虚构的数据”；
- /demo 包含 L1 通勤摘要；
- /demo 包含 L2 参考评分；
- /demo 包含 L3 解释预览；
- /demo 包含看房 checklist；
- demo data 包含虚构数据；
- demo data 包含演示房源；
- /demo 不包含 localStorage；
- /demo 不包含 indexedDB；
- /demo 不包含 fetch(；
- /demo 不包含 AMAP_API_KEY；
- /demo 不包含 DeepSeek；
- /demo 不包含“最佳房源”；
- /demo 不包含“系统推荐”；
- /demo 不包含“真房源”；
- git status clean。

## 13. 产品边界确认

Demo Mode 只能解释为：

作品集展示入口。

不能解释为：

- 真实房源平台；
- 房源推荐系统；
- 房源广告页；
- 中介撮合页；
- 真房源认证页；
- 云端样板房源库；
- AI 实时选房系统；
- 地图找房产品；
- 视频看房平台。

Demo Mode 的面试叙事应是：

这是我为作品集准备的 Demo Mode。它不读取真实用户数据，也不抓取平台房源，而是用虚构数据展示 HouseFolio 的核心产品逻辑：用户主动添加候选房源后，系统用 L1 通勤分析、L2 参考评分和 L3 条件化解释，帮助用户做租房决策。真实用户模式已经有本地添加、通勤、评分、照片和数据权利闭环；Demo Mode 是为了让面试官不用从空白账户开始录入，也能快速理解产品价值。

## 14. 后续建议

Phase 3I 到此可以收口。

下一步有两个合理方向：

### 方向 A：Phase 3J：Demo deploy preparation / portfolio link

适合近期目标：

- 做求职作品集；
- 准备面试展示；
- 给别人发链接；
- 需要一个随时可打开的作品集地址。

Phase 3J 应先做部署前评审，不直接部署。

应回答：

- 当前是否用 Vercel 作为作品集 Demo 环境；
- 是否只部署虚构 Demo；
- 是否需要隐藏真实测试数据；
- 是否需要补 privacy / disclaimer；
- 是否需要 README / 简历项目链接说明；
- 是否需要区分 Demo 环境与未来大陆正式运营环境。

### 方向 B：Phase 4A-0：L2 comparison 前置评审

适合继续强化产品硬核能力。

应回答：

- 是否新增 /compare；
- 是否做多房源勾选；
- comparison data model 如何接 Phase 2F selector；
- L2 是否仍然只用规则和简单数学；
- 是否禁止 LLM 参与评分、排序、筛选；
- 是否禁止处理笔记原文和照片。

## 15. 我的建议

如果近期目标是求职作品集和面试展示，建议下一步优先进入：

Phase 3J-0：Demo deploy preparation / portfolio link review

因为 Phase 3I 已经让项目具备最小可展示入口，但它仍然只是本地页面。要变成可以发给面试官的链接，需要进入部署前评审。

但 Phase 3J 仍应先只写文档，不要直接部署。