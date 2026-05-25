# Phase 8B-0：Portfolio visual audience-fit review

## 0. 阶段定位

Phase 8B-0 是 Portfolio / 候选房源列表页的视觉受众匹配评审。

本阶段只回答一个问题：

Portfolio 是否已经像一个面向中国大陆年轻租客的“候选房源清单 / 看房备忘录 / 消费决策工具”，还是仍然偏工程 Demo、后台管理页或算法看板？

本阶段只写文档，不做任何功能实现。

允许范围：

- docs/architecture/phase-8b-0-portfolio-visual-audience-fit-review.md

明确禁止：

- 不改 Portfolio 代码
- 不改 ListingCard
- 不改 Compare
- 不改 Settings
- 不改 AppNav
- 不改 ComplianceFooter
- 不改 src/content/zh-cn.ts
- 不改 src/lib/lbs
- 不改 src/lib/algorithm
- 不改 src/lib/ai
- 不改 src/lib/local-store
- 不改 src/lib/privacy
- 不改 src/app/api
- 不新增 localStorage / IndexedDB key
- 不实现合同助手
- 不接 AI / LBS / Supabase
- 不使用 PixelClone 直接改代码
- 不引入新 UI 框架或字体包

## 1. 上下文

Phase 8A 已完成首页视觉改版：首页从工程展示型 Demo 调整为更生活化、更轻量、更适合普通租客理解的入口。

但首页只是入口。用户真正开始使用 HouseFolio 时，会进入 Portfolio。Portfolio 承担的是候选房源汇总、筛选、比较入口和继续进入详情页的核心任务。

因此，Phase 8B 的核心判断是：

首页已经变得更像生活工具之后，Portfolio 是否也需要从“管理台式列表”调整为“租客真实找房清单”。

## 2. v3.1 对 Portfolio 的要求

根据 v3.1 的 UI/UX 受众匹配方向，Portfolio 不应只是展示数据卡片，而应帮助用户理解：

- 我已经收集了哪些候选房源
- 哪些房源值得继续看
- 哪些房源信息还不完整
- 哪些房源可以拿来横向比较
- 通勤、预算、面积、户型、看房印象等决策字段在哪里
- 下一步该添加、查看详情、比较，还是补充信息

Portfolio 的视觉气质应接近：

- 候选房源清单
- 看房备忘录
- 生活消费决策工具
- 私人整理工作台

应避免：

- B 端房源管理后台
- SaaS Dashboard
- 数据指标看板
- 工程 Demo 列表
- 过密的信息卡片
- 技术术语堆叠

## 3. 当前评审问题清单

### 3.1 首屏理解

需要评审：

- 用户进入 Portfolio 后，是否能在 5 秒内理解这里是“我的候选房源清单”
- 页面标题、说明文案、主按钮是否比首页更明确地承接“开始整理候选房源”
- 是否存在过多工程型表达，例如 mock、provider、payload、L1/L2/L3
- 是否能看出这是私人数据空间，而不是公开房源平台

理想状态：

Portfolio 首屏应让用户感到“这是我自己整理找房资料的地方”，而不是“这是一个房源数据库”。

### 3.2 信息层级

候选房源卡片应优先展示用户做决策最需要的信息：

第一层：

- 房源名称 / 小区或位置线索
- 租金
- 通勤参考
- 参考评分或辅助比较提示
- 当前状态或是否已加入比较

第二层：

- 面积
- 户型
- 朝向
- 楼层
- 标签
- 看房状态
- 信息完整度

第三层：

- 细碎字段
- 解释性说明
- 技术来源提示
- 次要元数据

需要避免：

- 所有字段等权展示
- 参考评分过度突出，像系统推荐
- 标签过多导致卡片噪音
- 技术来源提示压过租客关心的信息
- 一眼看上去像后台表格

### 3.3 主操作路径

Portfolio 的主操作应符合真实租客路径：

- 添加候选房源
- 查看详情
- 选择 2–4 套进行辅助比较
- 根据空状态提示补充数据
- 回到首页或进入设置管理本地数据

需要评审：

- “添加候选房源”是否是清晰主按钮
- “比较这几套”是否容易理解
- 多选比较是否让用户知道至少选 2 套、最多选 4 套
- 查看详情入口是否足够明确
- 空状态是否告诉用户下一步怎么做，而不是只显示暂无数据

### 3.4 Compare 入口与选择体验

Portfolio 是 Compare 的前置入口。当前不能改功能，但需要评审后续视觉调整方向：

- 勾选入口是否自然
- 比较按钮是否像“辅助比较”，而不是“系统推荐”
- 已选数量是否清楚
- 未满足 2 套时是否能温和提示
- 超过上限时是否避免生硬报错
- 比较入口是否不干扰普通浏览

后续视觉改版应继续使用：

- 辅助比较
- 横向比较
- 参考信息
- 不代表最终推荐

应避免：

- 最佳房源
- 系统推荐
- 推荐分
- 替你决定
- 最优选择

### 3.5 空状态

Portfolio 空状态非常关键，因为新用户第一次进入时大概率没有房源。

空状态应回答：

- 这里是做什么的
- 用户为什么要添加房源
- 添加后可以做什么
- 数据会保存在哪里
- HouseFolio 不抓取、不发布、不公开房源

推荐空状态方向：

- 标题：开始整理你的候选房源
- 说明：把你已经找到的房源记录到这里，再做通勤参考、辅助比较和看房记录。
- 主按钮：添加候选房源
- 辅助说明：房源信息由你自行添加，默认保存在本机；HouseFolio 不发布、不抓取、不撮合。

空状态不应像后台系统：

- 暂无数据
- 暂无记录
- empty list
- no listing found

### 3.6 文案与术语

Portfolio 面向普通租客，不应大量暴露工程词。

应优先使用：

- 候选房源
- 房源清单
- 看房记录
- 通勤参考
- 辅助比较
- 参考评分
- 本地保存
- 信息待补充
- 查看详情
- 比较这几套

应避免或仅放在文档 / 面试叙事中：

- L1
- L2
- L3
- provider
- mock
- payload
- API route
- cachedTransit
- localStorage key
- DeepSeek
- Amap

### 3.7 视觉气质

Portfolio 应延续 Phase 8A 首页的生活化方向，但不能为了好看牺牲信息可读性。

后续视觉原则：

- 背景更轻
- 卡片层级更柔和
- 信息密度适当下降
- 租金、通勤、状态形成清晰视觉焦点
- 主操作按钮比次要操作更明显
- 标签数量和视觉权重要克制
- 不把评分做成强推荐样式
- 不把页面做成重 dashboard

适合的感受：

- 清爽
- 私人
- 可整理
- 可比较
- 可信
- 不压迫

不适合的感受：

- 冰冷
- 后台
- 数据墙
- 房源平台
- 中介系统
- 算法控制台

## 4. 合规与产品边界

Portfolio 后续无论如何视觉改版，都必须继续守住这些边界：

- 用户自行添加房源
- 不抓取第三方房源页面
- 不搬运平台图片和描述
- 不公开用户房源库
- 不撮合交易
- 不联系房东或中介
- 不收佣金、保证金、服务费
- 不认证真房源
- 不承诺避坑保真
- 不把参考评分包装成推荐系统
- 不让 AI 评分、排序、筛选、决定

Portfolio 可以为未来合同助手预留“签约前检查”的场景理解，但不能在本阶段实现合同助手，也不能暗示已经能做法律审查。

允许的表达：

- 签约前检查
- 提示常见合同风险
- 准备签约前再核对

禁止的表达：

- AI 律师
- 法律审查系统
- 判定违法
- 霸王条款检测
- 保证避坑
- 自动维权
- 律师级审查

## 5. 后续可能涉及文件，但本阶段不修改

如果 Phase 8B 后续进入最小视觉改版，可能涉及：

- src/app/portfolio/page.tsx
- src/components/portfolio-list.tsx
- src/components/listing-card.tsx
- src/content/zh-cn.ts

但 Phase 8B-0 不修改上述文件。

Phase 8B-0 的输出只是一份评审文档，用于约束后续 Phase 8B-1 计划与 Phase 8B-2 最小实现。

## 6. 初步评审结论

Portfolio 应进入视觉受众匹配改版主线，但不能直接改代码。

原因：

1. Phase 8A 已经把首页从工程 Demo 调整为生活化入口。
2. Portfolio 是真实使用路径的下一站，如果仍然偏后台感，会造成体验断裂。
3. 候选房源列表页最能体现 HouseFolio 是否真的适合年轻租客使用。
4. Portfolio 视觉改版可以提升面试展示说服力，但不需要扩大功能边界。
5. 当前更适合先做评审和计划，而不是直接改 ListingCard。

## 7. Phase 8B-1 建议

Phase 8B-0 之后，建议进入：

Phase 8B-1：Portfolio visual minimal redesign plan

Phase 8B-1 仍建议只写计划文档，不直接改代码。

Phase 8B-1 应明确：

- 具体改哪些页面和组件
- 是否需要改中文文案
- 是否只改视觉层级，不改数据模型
- 是否保留现有 Portfolio selection / Compare 入口
- 如何保证不影响 Compare 主链路
- 如何验证 build 和浏览器回归
- 如何扫描禁止措辞
- 如何确认本地优先、合规边界没有被弱化

## 8. Phase 8B-0 验收标准

本阶段完成标准：

- 已新增 docs/architecture/phase-8b-0-portfolio-visual-audience-fit-review.md
- 未修改 src 代码
- 未修改 ListingCard
- 未修改 Portfolio 实现
- 未修改 Compare / Settings / AI / LBS / Supabase
- 未新增 npm 依赖
- 未新增图片资产
- npm.cmd run build 通过
- git status clean
- commit 信息为 docs: review portfolio visual audience fit

## 9. 当前阶段不做事项

本阶段不做：

- Portfolio 视觉实现
- ListingCard 改版
- Compare UI 改版
- 合同助手入口实现
- 合同助手页面
- OCR
- AI 法律审查
- 新 AI provider
- 新 LBS provider
- Supabase
- 云端同步
- Chrome 插件
- PixelClone 执行
- 新设计系统
- 移动端专项适配

## 10. 最终判断

Phase 8B-0 的核心结论是：

Portfolio 需要被重新评估为“候选房源清单”，而不是“房源管理后台”。

但本阶段只完成评审。后续必须继续遵守 HouseFolio 的节奏：

先评审，再计划，再最小实现，再回归，再收口。