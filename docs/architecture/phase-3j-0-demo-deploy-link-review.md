# Phase 3J-0：Demo deploy preparation / portfolio link review

## 1. 阶段定位

本阶段是 Phase 3I Demo Mode 最小展示闭环之后的部署前评审阶段。

阶段名称：

Phase 3J-0：Demo deploy preparation / portfolio link review

中文名称：

Phase 3J-0：Demo 作品集链接部署前评审

本阶段只写评审文档，不改代码、不部署、不改环境变量、不接云数据库、不接 Supabase、不新增功能。

本阶段的核心目标不是继续扩张产品，而是判断：

HouseFolio 当前是否可以尽快交付一个可发给面试官、朋友或作品集评审者的稳定 Demo 链接。

## 2. 当前关键判断

结论：

可以进入 Demo 预览部署准备。

理由：

- Phase 3I 已经完成 Demo Mode 最小展示闭环；
- 首页已经有“查看演示”入口；
- /demo 已经是静态页面；
- /demo 使用完全虚构数据；
- /demo 展示 L1 / L2 / L3 三层叙事；
- /demo 不读取真实 localStorage；
- /demo 不读取 IndexedDB；
- /demo 不调用高德；
- /demo 不调用 AI；
- /demo 不使用真实房源、真实图片或视频；
- npm.cmd run build 已通过；
- git status clean。

因此，不需要等 Phase 4A、正式 Comparison、真实 AI、地图 UI 或完整 MVP 全部完成，HouseFolio 已经具备阶段性作品集展示基础。

## 3. Demo 链接的产品目的

Demo 链接的目的不是证明 HouseFolio 已经是完整商业产品。

Demo 链接的目的包括：

- 让面试官 5 分钟内理解 HouseFolio 的产品定位；
- 让对方不必从空白账户开始录入房源；
- 让对方看到 L1 / L2 / L3 三层决策引擎的最小叙事；
- 让对方理解 HouseFolio 不是房源平台、不是中介、不是推荐系统；
- 让项目可以进入简历、作品集、面试话术和项目介绍视频。

一句话：

Demo 链接是求职作品集入口，不是正式生产环境。

## 4. 当前可展示链路

当前已经形成：

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

这条链路足以解释：

- 用户主动添加候选房源；
- 工作/学习地点是通勤锚点；
- HouseFolio 关注“怎么选”，不是“哪里有房”；
- L1 处理空间关系；
- L2 做规则化辅助比较；
- L3 把结构化结果翻译成人话；
- 本地优先不是离线弱化，而是隐私架构选择。

## 5. 推荐部署策略

当前推荐：

使用 Vercel 作为作品集 Demo 预览环境。

但必须明确：

- Vercel 只作为 Demo / Preview 环境；
- 不作为未来大陆正式公开运营环境的最终承诺；
- 不在 Demo 中收集真实用户高敏数据；
- 不在 Demo 中上传真实看房照片；
- 不在 Demo 中接入真实 AI；
- 不在 Demo 中展示真实房源素材；
- 不在 Demo 中承诺“正式可用”。

未来如果面向大陆真实用户公开运营，应另行进入国内云、备案、境内存储和正式隐私合规路线。

## 6. 是否需要等完整 MVP 才部署

结论：

不需要。

对于求职作品集，等待完整 MVP 反而会降低效率。

当前更合理的节奏是：

先部署 Demo 预览链接
→ 简历 / 作品集可放链接
→ 面试时可展示
→ 后续继续迭代 Phase 4A / L2 comparison
→ 项目逐步增强

而不是：

等正式 Compare、真实 AI、地图 UI、POI、部署合规、正式用户闭环全部完成后才展示。

当前 Demo 链接应定位为：

阶段性作品集成果。

## 7. 线上 Demo 应展示什么

线上版本至少应展示：

- 首页；
- 首页的“查看演示”入口；
- /demo；
- /portfolio；
- /portfolio/new；
- /portfolio/[id]；
- /settings；
- ComplianceFooter；
- 本地数据权利说明。

但对外重点推荐访问路径应是：

/demo

因为：

- /demo 使用虚构数据；
- /demo 不依赖用户手动录入；
- /demo 不依赖高德 key；
- /demo 不依赖真实 localStorage；
- /demo 叙事更完整。

## 8. 是否担心真实模式被别人点进去

可以允许别人点击真实模式，但必须接受以下边界：

- 真实模式当前使用访问者自己的浏览器 localStorage / IndexedDB；
- 访问者可以自己添加测试房源；
- 添加的数据只在访问者自己的浏览器本机；
- 不会进入你的本机；
- 不会形成公共房源库；
- 不会上传到云数据库；
- 不会默认同步；
- 不会公开展示给别人。

这与 HouseFolio 当前本地优先定位一致。

但在作品集说明中，应建议面试官优先看 /demo。

## 9. 部署前必须避免的风险

部署前必须确认：

- 不提交 .env.local；
- 不提交 AMAP_API_KEY；
- 不使用 NEXT_PUBLIC_AMAP_API_KEY；
- Demo 页面不调用 /api/lbs/commute/transit；
- Demo 页面不调用 AI；
- Demo 数据不含真实房源链接；
- Demo 数据不含真实手机号、微信号、门牌号；
- Demo 数据不含真实图片或视频；
- README 不声称已完成真实 AI / 地图 / Compare；
- 页面不使用“真房源”“最佳房源”“系统推荐”等措辞；
- 部署链接不被包装成正式商业服务。

## 10. 当前是否需要环境变量

对于 /demo 预览链接：

原则上不需要真实高德 key 或 AI key。

原因：

- /demo 不调用高德；
- /demo 不调用 AI；
- /demo 只读取静态 demo data；
- /demo 是静态页面。

但项目中仍存在：

/api/lbs/commute/transit

如果线上访问者在真实模式中点击公共交通计算，可能因为缺少 AMAP_API_KEY 而失败。

当前可接受处理：

- Demo 链接主推 /demo；
- 不把线上真实模式宣传为完整可用生产环境；
- 后续如要让真实模式线上可演示，再单独配置安全的服务端 AMAP_API_KEY；
- 绝不使用 NEXT_PUBLIC_AMAP_API_KEY。

## 11. 是否需要先隐藏真实模式

当前不建议隐藏真实模式。

理由：

- HouseFolio 真实模式已经有本地数据闭环；
- 本地模式没有云端风险；
- 真实模式能证明不是纯静态 PPT；
- 面试官可以看到真实添加 / Settings / 数据权利逻辑。

但作品集介绍应清楚说明：

推荐先看 Demo Mode；真实模式用于体验本机保存闭环。

## 12. 是否需要补 README / 简历项目说明

需要，但可以放到 Phase 3J-1 或 Phase 3J-2。

建议 README 增加一段：

Demo Mode：

- /demo 使用虚构数据；
- 用于快速展示 L1 / L2 / L3；
- 不读取真实用户数据；
- 不调用高德或 AI；
- 不代表真实房源或租赁建议。

简历项目描述中可以写：

设计并实现 Demo Mode，使用虚构数据展示 L1 通勤分析、L2 参考评分和 L3 条件化解释，使面试官无需录入数据即可快速理解产品价值。

## 13. 是否需要补隐私与免责声明

当前已有 ComplianceFooter 和 Settings 数据权利说明。

部署前建议最小补充：

- README 中写清楚 Demo 数据虚构；
- /demo 已经写清楚数据隔离；
- footer 继续说明不抓取、不聚合、不撮合、不认证；
- 暂不新增正式隐私政策页面。

如果后续要公开给真实用户使用，再补正式 Privacy Policy / Terms。

## 14. 最小部署路线建议

Phase 3J 后续建议拆成：

### Phase 3J-1：Pre-deploy project check

只做本地检查和必要文档补充。

检查：

- git status clean；
- npm.cmd run build；
- git log 最近 commit；
- .env.local 未被跟踪；
- Demo route 存在；
- 首页入口存在；
- README 是否需要补 Demo 说明；
- 禁止字段扫描。

如需代码修改，应只改 README 或文档，不新增功能。

### Phase 3J-2：Deploy to Vercel preview

目标：

- 使用 Vercel 创建项目；
- 连接 GitHub 仓库；
- 部署当前 main；
- 获得作品集预览链接；
- 检查线上 /demo；
- 检查首页“查看演示”入口；
- 检查 /portfolio 和 /settings 可访问；
- 不配置真实高德 key，除非明确要演示真实通勤；
- 不配置 AI key。

### Phase 3J-3：Deployment regression log

目标：

- 记录部署链接；
- 记录线上 /demo 验证结果；
- 记录哪些能力是 Demo；
- 记录哪些能力尚未完成；
- 记录后续仍需 Phase 4A / L2 comparison；
- 形成可加入 Project Sources 的上线日志。

## 15. 当前阶段不做清单

Phase 3J-0 不做：

- 不部署；
- 不改代码；
- 不改首页；
- 不改 /demo；
- 不改 AppNav；
- 不接 Vercel；
- 不接 Supabase；
- 不接高德 key；
- 不接 AI key；
- 不改 README；
- 不新增 Privacy 页面；
- 不新增 Terms 页面；
- 不做国内云；
- 不备案；
- 不做正式生产运营判断。

## 16. Go / No-Go 判断

当前 Go 判断：

可以进入部署准备。

Go 条件：

- Demo Mode 已收口；
- /demo 路由存在；
- 首页入口存在；
- build 通过；
- git clean；
- Demo 不读写真数据；
- Demo 不调用外部服务；
- Demo 数据虚构；
- 产品边界清晰。

No-Go 条件当前未出现。

## 17. 最终结论

Phase 3J-0 的结论是：

HouseFolio 当前已经具备阶段性作品集展示基础，可以尽快进入 Demo 链接交付阶段。

下一步不应继续扩张 Demo 功能，而应进入：

Phase 3J-1：Pre-deploy project check

然后尽快进入：

Phase 3J-2：Deploy to Vercel preview

目标是在不等待完整 Phase 4 或完整 MVP 的情况下，先交付一个可发给面试官的稳定 Demo 链接。