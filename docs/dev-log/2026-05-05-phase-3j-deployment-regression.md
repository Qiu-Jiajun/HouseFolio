# Phase 3J-4：Deployment regression log

## 1. 阶段定位

本文件是 Phase 3J 的部署回归与收口日志。

阶段名称：

Phase 3J-4：Deployment regression log

本阶段只写文档，不修改功能代码。

本阶段目标：

- 记录 HouseFolio 当前已经具备作品集预览链接；
- 记录 GitHub 仓库地址；
- 记录 Vercel 线上入口；
- 记录 Demo Mode 当前能力与边界；
- 记录部署前后的关键检查结果；
- 明确下一步不继续扩张 Demo，而是转入 Phase 4A-0 或面试材料整理。

## 2. 当前阶段性成果

HouseFolio 当前已经具备一个可以用于作品集展示的线上入口：

```text
https://house-folio.vercel.app/

GitHub 仓库：

https://github.com/Qiu-Jiajun/HouseFolio

当前项目已经不需要等完整 Phase 4 或完整 MVP 做完，才能向面试官、朋友或作品集评审者展示产品思路。

当前展示链路：

首页
→ 查看演示
→ /demo
→ 虚构候选房源
→ 虚构通勤锚点
→ L1 通勤摘要
→ L2 参考评分
→ L3 预生成解释
→ 数据隔离说明
→ 进入真实 Portfolio
3. 当前最新关键 commit

本阶段前的关键 commit 包括：

89219b0 docs: add demo mode readme note
edab08e docs: review demo deploy link
c1b1a7c docs: close demo mode phase
dd7e24a feat: add demo mode entry
17b08c7 feat: add demo ai explanation preview
0041b53 feat: add demo portfolio presentation
5cb6b2a feat: add demo mode route shell
c118de1 feat: scaffold demo mode data
36a9ebc docs: plan demo mode implementation
3ff6d20 docs: review demo mode boundary

部署前公开文案清理 commit：

645b7a4 copy: clean public demo phase labels

该 commit 已成功 push 到 GitHub：

origin/main
4. 当前线上 Demo 定位

当前 Vercel 链接是：

作品集预览链接

它不是：

正式商业服务；
房源平台；
中介撮合平台；
房源发布平台；
真实房源推荐系统；
真伪认证工具；
公开房源库；
AI 实时选房系统。

当前线上 Demo 的核心作用是：

让面试官不必从空白账户开始录入；
让对方 5 分钟内理解 HouseFolio 的产品定位；
展示 L1 / L2 / L3 三层决策引擎；
展示本地优先和数据隔离边界；
作为简历、作品集和面试讲解的入口。
5. 当前 Demo Mode 已具备能力

当前 /demo 已经具备：

独立静态路由；
首页可发现入口；
完全虚构的静态 demo data；
3 套虚构候选房源；
2 个虚构通勤锚点；
演示图片占位；
L1 通勤摘要；
L2 参考评分；
L2 维度拆解；
主要优势 / 主要短板；
L3 预生成解释；
看房 checklist；
trade-off；
数据隔离说明；
进入真实 Portfolio 的入口；
AppNav；
ComplianceFooter。
6. 当前 Demo Mode 不具备，也不应声称具备

当前不具备：

真实 AI 调用；
真实 DeepSeek 接入；
真实高德线上调用；
真实地图 UI；
真实 POI / 生活圈计算；
真实房源库；
真实房源图片；
视频展示；
Demo Detail；
Demo Compare；
Demo Map；
交互式 Demo 编辑；
云同步；
账号系统；
Supabase 持久化；
正式隐私政策页面；
正式用户协议页面。

这些能力后续可以评估，但不属于当前作品集预览链接的承诺范围。

7. 部署前本地回归结果

本阶段前已经多次确认：

npm.cmd run build 通过；
Route table 包含 /demo；
git status clean；
GitHub remote 已绑定；
main 分支已 push；
README 已补充 Demo Mode 说明；
首页已提供“查看演示”入口；
Demo 页面不读取真实 localStorage；
Demo 页面不读取 IndexedDB；
Demo 页面不调用高德；
Demo 页面不调用 AI；
Demo 数据为虚构数据；
未提交 .env.local；
未暴露 AMAP_API_KEY；
未使用 NEXT_PUBLIC_AMAP_API_KEY；
未暴露 DEEPSEEK_API_KEY。
8. 公开文案清理结果

Phase 3J-3B 已完成公开文案清理。

目标：

避免线上页面残留过时阶段标签；
避免用户侧出现生硬的区域 / 国别表述；
避免让面试官误解当前阶段。

已清理：

首页旧阶段表述；
footer 旧 Phase Demo 表述；
Portfolio / Settings 中过时的 Phase 表述；
公开页面中的 Phase 1 / Phase 2A 残留。

当前推荐公开表述：

作品集预览版；
Demo 预览；
当前演示版本；
正式上线；
国内云部署；
备案后的正式服务。

避免公开页面使用：

大陆生产环境；
大陆公开运营；
中国大陆居民；
最佳房源；
真房源；
系统推荐。

其中“系统推荐”只允许出现在否定性边界说明中，例如“不代表系统推荐或最终决定”。

9. 当前人工线上验收建议

部署完成后，应人工打开以下页面：

https://house-folio.vercel.app/
https://house-folio.vercel.app/demo
https://house-folio.vercel.app/portfolio
https://house-folio.vercel.app/settings

检查项：

首页可以打开；
首页可以看到“查看演示”；
/demo 可以打开；
/demo 展示 3 套虚构房源；
/demo 展示 2 个虚构通勤锚点；
/demo 展示 L1 / L2 / L3；
/demo 没有乱码；
/demo 没有明显样式破裂；
/portfolio 可以打开；
/settings 可以打开；
页面没有“大陆生产环境”这类生硬表述；
页面没有“最佳房源 / 真房源 / 系统推荐”这类误导性卖点。
10. 面试展示建议

面试或简历中优先给：

https://house-folio.vercel.app/demo

如果需要展示完整项目入口，再给：

https://house-folio.vercel.app/

推荐介绍话术：

这是我为 HouseFolio 准备的作品集 Demo。它不读取真实用户数据，也不抓取平台房源，而是用虚构数据展示核心产品逻辑：用户主动添加候选房源后，系统用 L1 通勤分析、L2 参考评分和 L3 条件化解释，帮助用户做租房决策。真实模式已经有本地添加、通勤、评分、照片和数据权利闭环；Demo Mode 是为了让面试官不用从空白账户开始录入，也能快速理解产品价值。
11. 当前阶段结论

Phase 3J 可以正式收口。

当前 HouseFolio 已经具备：

GitHub 仓库；
Vercel 作品集预览链接；
可发现的首页 Demo 入口；
独立 /demo 展示页；
L1 / L2 / L3 最小演示链路；
README Demo 说明；
本地优先数据权利闭环；
清晰的合规边界；
后续继续迭代的工程基础。

这已经满足“先交付一个可展示的作品集入口 / 链接”的阶段目标。

12. 下一步建议

Phase 3J 后，不建议继续扩张 Demo。

下一步可以二选一：

方向 A：Phase 4A-0：L2 comparison 前置评审

适合继续强化产品硬核能力。

应先只写评审文档，回答：

是否新增 /compare；
是否做多房源勾选；
ComparisonModel 如何接 Phase 2F selector；
L2 是否仍然只用规则和简单数学；
是否禁止 LLM 参与评分、排序、筛选；
是否禁止处理笔记原文和照片。
方向 B：Portfolio / Resume packaging

适合近期开始投递或准备面试。

应整理：

README 项目介绍；
简历项目 bullet；
面试 1 分钟 / 3 分钟 / 5 分钟讲法；
Demo 链接怎么展示；
GitHub 仓库怎么展示；
当前已完成与未完成能力边界。
13. 我的建议

如果接下来准备继续开发产品能力，进入：

Phase 4A-0：L2 comparison 前置评审

如果近期要投递和面试，进入：

Portfolio packaging：简历与面试展示材料整理

两者都可以。当前不要再继续扩张 Demo 功能。