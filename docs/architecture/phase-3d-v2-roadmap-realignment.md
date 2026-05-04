# HouseFolio 架构校准｜Phase 3D-V2-0｜v2.0 Roadmap Realignment Checkpoint

## 一、本阶段目标

本阶段目标是根据《HouseFolio 项目规划文档 v2.0》重新校准当前开发路线。

本阶段只写架构校准文档，不修改业务代码，不新增 UI，不接照片面板，不改 Settings，不改 Portfolio，不改 L1 / L2 / L3 逻辑。

当前最新稳定点：

    bad7f1c docs: plan detail photo panel
    286936b docs: checkpoint photo provider boundary
    0ee027f docs: log indexeddb photo provider
    da5d4ab feat: implement indexeddb photo provider
    587d039 docs: plan indexeddb photo provider
    d37a17e docs: log storage boundary scaffold
    fc4283a feat: scaffold local photo storage boundary
    73e6f19 docs: review local photo persistence boundary

## 二、v2.0 的上位变化

v2.0 不是把 HouseFolio 改成离线笔记工具，也不是弱化 L1 / L2 / L3。

v2.0 的新主线是：

    本地优先的私人找房决策工具
    用户主动添加
    默认私有
    按需联网
    只传必要字段
    尽量模糊
    不存高敏原文
    可导出
    可导入
    可清除
    云同步后置且可选

v2.0 把此前的合规、迁移、多通勤锚点、本地照片持久化和本地优先隐私架构，从风险防御条款升级为产品形态定义。

这意味着后续每个阶段都要回答：

    这个任务属于基础层、L1、L2、L3，还是 Demo 展示层？
    它是否强化本地优先？
    它是否强化三层决策引擎？
    它是否会默认上传高敏找房画像？
    它是否会把 HouseFolio 推向房源平台、云端相册、撮合中介或真房源认证？

## 三、当前已完成能力如何映射到 v2.0

### 3.1 基础层

当前已完成：

    房源本地添加
    Portfolio 本地展示
    Detail 房源档案
    看房笔记
    主观评分
    房源状态
    Settings 本地数据查看 / 导出 / 清除
    工作/学习地点（通勤锚点）本地保存
    commute-results 本地保存
    local photo storage provider
    IndexedDB photo provider
    Detail photo panel implementation plan

v2.0 下的新解释：

    这些不是普通 CRUD，而是“用户主动收集的候选房源工作台”。
    本地保存不是临时权宜，而是产品形态。
    照片能力不是孤立图片功能，而是高敏找房资料本地持久化能力的一部分。

### 3.2 L1

当前已完成：

    工作/学习地点（通勤锚点）本地设置
    高德 provider 封装
    geocode smoke test
    transit / walking / cycling / driving 底层能力
    Detail 页手动 transit 计算
    /api/lbs/commute/transit 服务端 route
    commute-results 摘要保存
    Detail L1 展示本地通勤摘要

v2.0 下的新解释：

    L1 仍然是 HouseFolio 的空间决策引擎。
    但 L1 不能后台批量上传全部地址。
    L1 必须用户主动触发。
    L1 应优先支持模糊地址、地铁站、商圈、学校附近等粒度。
    L1 只缓存计算结果，不缓存高德原始路线、POI 原始 JSON、经纬度轨迹或地图数据库。

### 3.3 L2

当前已完成：

    Reference Score
    评分拆解
    Portfolio 筛选排序
    cached transit 进入 L2
    commute source indicator
    comparison input selector 草案

v2.0 下的新解释：

    L2 是结构化决策能力，不是推荐系统。
    L2 仍然只使用规则和简单数学。
    L2 不调用 LLM。
    L2 不说“最佳房源”“最优选择”“系统推荐”。
    L2 后续应逐渐走向对比视图、相对性价比、异常提示，但不能在基础层未稳时过早进入正式 Phase 4A。

### 3.4 L3

当前状态：

    Detail 页 L3 仍是 disabled placeholder。
    没有接 DeepSeek。
    没有 AI prompt。
    没有发送笔记、照片、地址给 AI。

v2.0 下的新解释：

    这是正确状态。
    L3 后续应是“隐私边界内的理解与表达层”，不是云端画像引擎。
    L3 只能在 L1 / L2 结构化数据基础上做人话解释、对比总结、checklist、风险信号解释。
    L3 不计算通勤、不评分、不排序、不认证、不替用户决定。
    照片默认不进入 AI。

### 3.5 Demo 展示层

当前状态：

    还没有 Demo Mode。
    当前展示仍依赖真实本地数据或 mock listings。
    尚未建立“虚构用户 + 虚构房源 + 假笔记 + 假照片 + 预置 L1/L2/L3 输出”的演示线。

v2.0 下的新解释：

    Demo Mode 已成为求职作品集刚需。
    它不是普通功能，而是面试展示能力。
    后续应进入路线规划，但不应抢在本地优先基础闭环之前。

## 四、Phase 3D 是否继续

结论：

    Phase 3D 应继续，但要重新解释。

旧解释：

    Phase 3D = 本地照片持久化专项

新解释：

    Phase 3D = 本地优先基础层强化：高敏找房资料的本机持久化与数据权利前置

因此，已经完成的：

    storage boundary scaffold
    IndexedDB photo provider
    no-UI regression check
    Detail photo panel plan

仍然有效。

但后续实现不能只以“照片能显示”为标准，而必须同时考虑：

    本地优先说明
    用户数据权利
    Settings 可见性
    导出 / 导入路线
    不进入 AI
    不默认云端同步
    不公开展示
    不做房源图册
    不做真房源认证
    不让页面直接操作 IndexedDB

## 五、是否立刻实现 Detail local photo panel

结论：

    可以实现，但应作为 Phase 3D-3B，并且必须控制范围。

理由：

    provider 已完成。
    no-UI regression 已完成。
    implementation plan 已完成。
    v2.0 明确看房照片是基础层高敏资料，应本地持久化、按 listingId 绑定。
    Detail 是最小合理入口，比 Portfolio 首图和 Settings 统计更靠近用户实际看房资料管理。

但 Phase 3D-3B 必须严格限制：

    只新增 Detail 照片面板。
    只支持单房源详情页添加 / 展示 / 删除本机照片。
    只调用 lib/storage/photos facade。
    不改 Portfolio 首图。
    不改 Settings。
    不做导出 / 导入。
    不做缩略图生成。
    不做图片压缩。
    不做 EXIF 处理。
    不接 AI。
    不接云端。
    不公开分享。

## 六、v2.0 后需要提前的任务

### 6.1 Settings 数据权利强化

v2.0 把本地优先和导出 / 导入提升为关键产品能力，因此 Settings 的优先级上升。

后续应从“本地数据面板”升级为：

    本地数据权利中心

至少逐步覆盖：

    本地 JSON 导出
    本地 JSON 导入
    本机照片数量
    本机照片占用空间
    清除本机照片
    单设备边界说明
    哪些数据仅在本机
    哪些功能会按需联网
    哪些数据不会默认上传云端

但这不应抢在 Detail 照片最小闭环之前。

### 6.2 导入能力

v2.0 明确导出 / 导入不是附加能力，而是单设备本地优先的关键闭环。

后续应拆为：

    Phase 3E-0：JSON import boundary review
    Phase 3E-1：JSON import schema check
    Phase 3E-2：Settings import JSON minimal implementation
    Phase 3E-3：import regression check

照片 ZIP 导入应后置，不进入当前阶段。

### 6.3 快速捕获 + 深入研究

v2.0 把房源添加从“填写表单”重新定义为：

    快速捕获 + 深入研究

这会影响首页和 Add Listing 页面。

但它是较大的产品流程调整，不应立刻插入 Phase 3D。

建议在照片闭环和 Settings 数据权利初步稳定后，再进入：

    Phase 3F：Capture / Research listing entry redesign

### 6.4 Demo Mode

v2.0 明确 Demo Mode 是求职展示刚需。

但 Demo Mode 会影响数据源、mock 数据、首页入口、演示路线和 PR 叙事。

建议暂不立刻实现，应先做：

    Phase 3G-0：Demo Mode product and data boundary review

再决定实现方式。

## 七、v2.0 后需要推迟的任务

以下任务继续推迟：

    正式 /compare 路由
    多房源勾选
    横向对比表
    L3 DeepSeek 接入
    地图 UI
    POI 生活圈真实计算
    Supabase
    部署
    Chrome 插件
    AI 照片分析
    云端照片同步
    公开分享报告
    复杂多锚点权重

原因：

    v2.0 强调先把用户主动添加、本地优先、数据权利和求职展示路径做稳。
    L1 / L2 / L3 仍然重要，但必须建立在稳定的本地优先工作台之上。

## 八、调整后的近期路线

### Phase 3D-3B：Detail local photo panel minimal implementation

目标：

    Detail 页新增“看房照片｜本机保存”面板。
    支持添加 JPG / PNG / WebP。
    单张限制 5MB。
    保存到 IndexedDB provider。
    刷新后仍显示。
    支持删除。
    object URL 正确释放。
    只通过 lib/storage/photos facade。

不做：

    Portfolio 首图
    Settings 照片统计
    JSON / ZIP 导出
    AI 分析
    云端同步

### Phase 3D-3C：Detail photo panel manual regression

目标：

    手动验证添加、刷新、删除。
    验证 object URL 生命周期。
    验证 build。
    验证不改其他页面。

### Phase 3D-4：Settings photo data visibility plan

目标：

    先写计划。
    明确如何展示照片数量、占用空间、清除照片。
    不立即做导出 ZIP。

### Phase 3E：JSON import foundation

目标：

    让本地优先的导出 / 导入闭环开始成立。
    先支持 JSON，不支持照片 ZIP。

### Phase 3F：Capture / Research listing entry redesign

目标：

    把 Add Listing 改为快速捕获 + 深入研究。
    不抓取网页。
    只保存 URL 与用户确认字段。
    L3 对用户主动粘贴文本的结构化提取后置。

### Phase 3G：Demo Mode preparation

目标：

    设计虚构用户、虚构房源、假笔记、假照片、预置 L1/L2/L3 输出。
    面试可 5 分钟展示。

## 九、下一步具体执行建议

下一步应进入：

    Phase 3D-3B：Detail local photo panel minimal implementation

但执行前先做一次本地状态确认：

    git status
    npm.cmd run build

然后读取当前相关文件：

    src/components/listing-detail-view.tsx
    src/content/zh-cn.ts
    src/lib/storage/photos.ts
    src/types/listing-photo.ts

再开始极小实现。

## 十、边界清单

Phase 3D-3B 必须遵守：

    1. 页面只调用 lib/storage/photos。
    2. 不直接操作 IndexedDB。
    3. 不接 Supabase Storage。
    4. 不接 OSS / COS。
    5. 不接 AI。
    6. 不上传云端。
    7. 不读取系统相册。
    8. 不批量导入照片。
    9. 不公开分享照片。
    10. 不做真房源认证。
    11. 不改 L1 通勤计算。
    12. 不改 L2 评分算法。
    13. 不新增路由。
    14. 不改 Portfolio。
    15. 不改 Settings。
    16. 中文文案必须集中到 src/content/zh-cn.ts。
    17. build 必须通过。
    18. git status 必须 clean。
    19. 每次只做一件事。
    20. 完成后写 dev-log。