# Phase 8D-0：UI/UX redesign total regression + interview presentation review

## 1. 阶段定位

Phase 8D-0 是 Phase 8A / 8B / 8C 之后的 UI/UX 总回归与面试展示复核。

当前项目已经不再停留在 Phase 8A 首页改版收口点。远端 main 已推进到：

    bea7ddf Add image to README for visual enhancement

在该稳定点之前，已经完成：

    Phase 8A：首页视觉受众匹配与首页视觉改版
    Phase 8B：Portfolio 视觉受众匹配与候选房源清单视觉改版
    Phase 8C：全局页面视觉对齐
    README：当前项目状态与视觉展示更新

因此，Phase 8D-0 的任务不是继续改 UI，也不是进入合同助手，而是先复核当前视觉改版是否形成一个完整、可讲、可演示、边界清晰的产品展示闭环。

本阶段只写本文档，不改功能代码。

## 2. 本阶段文件范围

允许新增：

    docs/architecture/phase-8d-0-ui-ux-redesign-total-regression-review.md

明确禁止：

    不改 src/app
    不改 src/components
    不改 src/content/zh-cn.ts
    不改 src/lib
    不改 README
    不改 public assets
    不改 ListingCard
    不改 Portfolio
    不改 Compare
    不改 Settings
    不改 Detail
    不改 Add Listing
    不新增合同助手
    不接 OCR
    不接 AI 新能力
    不接 LBS 新能力
    不接 Supabase
    不新增 localStorage / IndexedDB key

## 3. 当前真实稳定点

当前最新稳定点：

    bea7ddf Add image to README for visual enhancement

近期关键提交：

    bea7ddf Add image to README for visual enhancement
    bddc519 Revise README for clarity and feature updates
    7f5b1c9 feat: group listing source platform options
    66f64de fix: improve destructive button contrast
    b29ee74 docs: log global visual alignment regression
    2ade8e2 feat: align app pages with portfolio visual style
    2ad5786 docs: plan global visual alignment
    e27ea07 feat: add portfolio hero illustration
    29a03c6 docs: log portfolio visual regression
    b6e8962 feat: redesign portfolio visual experience
    8f23188 docs: plan portfolio visual redesign
    97e788b docs: review portfolio visual audience fit

当前已确认：

    git status clean
    npm.cmd run build passed
    Phase 8B-0 文档已存在
    Phase 8B-0 文档 Node UTF-8 读取正常
    本地 main 已与 origin/main 对齐

## 4. 为什么需要 Phase 8D-0

Phase 8A、8B、8C 已连续修改多个用户可见页面和 README。

这类连续视觉改版容易产生三个问题：

    1. 页面之间视觉风格不一致；
    2. 产品叙事与 README 表达不一致；
    3. 面试演示路径看起来完成，但用户真实操作路径仍有断点。

因此，在进入合同助手之前，需要先复核当前版本是否已经形成一个稳定展示闭环。

Phase 8D-0 的核心问题是：

    当前 HouseFolio 是否已经从工程 Demo 感，转向更适合中国大陆年轻租客理解的生活化找房决策工具？

## 5. 回归对象

Phase 8D-0 应复核以下页面：

    首页
    Portfolio
    Add Listing
    Detail
    Compare
    Demo
    Settings
    AppNav
    ComplianceFooter
    README

但本阶段只写复核标准，不实际打开浏览器记录结果。浏览器手动回归可以作为 Phase 8D-1。

## 6. 总体视觉标准

当前 UI/UX 改版后的目标气质应是：

    生活化
    轻量
    温馨
    可信
    低学习成本
    适合年轻租客
    像租房清单和看房备忘录
    不像 B 端后台或算法 dashboard

应避免：

    工程 Demo 感
    SaaS 控制台感
    房源平台感
    中介工作台感
    数据看板感
    过重表格感
    过密信息堆叠
    过度技术术语

## 7. 页面级复核标准

### 7.1 首页

首页应回答：

    HouseFolio 是什么？
    它不是房源平台，而是私人找房决策工具。
    用户为什么要整理候选房源？
    用户下一步应该去哪里？

检查重点：

    主视觉是否温馨、清晰、生活化；
    主 CTA 是否明确；
    首页是否没有过度工程术语；
    首页是否能自然引导到 Portfolio 或 Demo；
    首页是否没有误导为房源平台、真房源认证或中介服务。

### 7.2 Portfolio

Portfolio 应回答：

    我已经收集了哪些候选房源？
    哪些值得继续看？
    哪些可以比较？
    下一步是查看详情还是选择比较？

检查重点：

    是否像候选房源清单；
    是否像私人整理台，而不是后台表格；
    添加候选房源入口是否清楚；
    选择 2-4 套比较的路径是否自然；
    参考评分是否克制；
    卡片是否避免系统推荐感；
    平台来源分组是否便于中国大陆租客理解。

### 7.3 Add Listing

Add Listing 应回答：

    用户可以如何手动添加候选房源？
    来源平台如何选择？
    为什么不是自动抓取第三方平台？

检查重点：

    渠道分组是否清楚；
    平台选择是否覆盖主流渠道但不暗示官方接入；
    页面是否强调用户主动添加；
    是否没有出现自动抓取、聚合、搬运等错误暗示。

### 7.4 Detail

Detail 应回答：

    这套房的核心信息是什么？
    看房记录、照片、通勤、评分、风险信号如何沉淀？
    用户如何继续补充判断依据？

检查重点：

    信息层级是否清楚；
    通勤锚点表达是否仍是工作 / 学习地点或通勤锚点；
    L1 / L2 / L3 是否没有过度暴露给普通用户；
    参考评分是否仍是辅助比较，不是推荐；
    本地照片与笔记是否仍保持本地优先边界。

### 7.5 Compare

Compare 应回答：

    这几套房有什么差异？
    哪些维度值得注意？
    AI 只是解释，不替我决定。

检查重点：

    横向对比是否清晰；
    AI 解释是否有确认步骤；
    AI 输出是否保持 session-only；
    文案是否避免最佳房源、最优选择、系统推荐、替你决定；
    参考评分和 AI 说明是否足够克制。

### 7.6 Demo

Demo 应回答：

    面试官不录入数据，也能理解核心链路。

检查重点：

    Demo 是否不依赖真实用户隐私数据；
    Demo 是否不误导为真实运营平台；
    Demo 是否仍能展示 L1 / L2 / L3 的产品思路；
    Demo 与当前新版视觉是否一致。

### 7.7 Settings

Settings 应回答：

    我的数据在哪里？
    如何查看、导出、清除？
    当前哪些数据是本地保存？

检查重点：

    本地数据权利说明是否清楚；
    导出 / 清除能力是否仍可找到；
    是否说明当前未接云端、地图、AI 历史持久化等边界；
    是否没有遗漏新增数据类型。

### 7.8 AppNav / ComplianceFooter

检查重点：

    入口是否清楚；
    页面之间是否可到达；
    Footer 是否继续强调不抓取、不聚合、不认证、不撮合；
    合规边界是否与 README 和页面文案一致。

### 7.9 README

README 应回答：

    这是一个什么项目？
    当前已完成什么？
    项目边界是什么？
    面试官如何理解和查看？

检查重点：

    README 是否反映当前最新 UI/UX 改版；
    README 是否避免把 HouseFolio 写成房源平台；
    README 是否没有过度承诺合同助手或 OCR；
    README 里的截图 / 图片是否服务项目理解。

## 8. 产品边界复核

所有页面和 README 都必须继续避免：

    真房源
    避坑保真
    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    房源认证
    AI 律师
    违法判定
    霸王条款自动检测
    自动维权
    自动抓取
    平台聚合

允许使用：

    用户自行添加
    候选房源
    本地保存
    辅助比较
    参考评分
    通勤参考
    签约前检查
    常见风险提示
    不构成法律意见
    不代表最终推荐

## 9. 面试展示路径复核

当前推荐面试演示路径：

    1. 首页：说明产品定位和不是房源平台；
    2. Portfolio：展示候选房源清单；
    3. Add Listing：说明用户主动添加，不抓取；
    4. Detail：展示看房记录、通勤、照片、本地资料；
    5. Compare：展示 L2 辅助比较；
    6. AI explanation：展示 L3 解释但不替用户决策；
    7. Settings：展示本地数据权利；
    8. README：补充项目边界、技术栈和阶段成果。

面试讲述重点：

    HouseFolio 不是解决“哪里有房”，而是解决“我已经有候选房源后如何比较和决策”。
    UI/UX 改版是根据真实反馈，把工程型 Demo 调整为更贴近年轻租客的生活决策工具。
    参考评分不是推荐系统。
    AI 不做评分、排序、筛选，只做人话解释。
    所有高敏找房资料默认本地优先。
    合同助手和 OCR 是后续阶段，不是当前已完成能力。

## 10. 下一阶段建议

Phase 8D-0 后，建议进入：

    Phase 8D-1：UI/UX redesign browser regression log

Phase 8D-1 可以做浏览器手动检查，但仍不改代码。

Phase 8D-1 之后再判断：

    A. 若发现视觉断点，进入小型 hotfix；
    B. 若未发现明显问题，生成 Phase 8D closing checkpoint；
    C. Phase 8D 收口后，再进入 Phase 9A 合同助手边界评审。

不建议现在直接进入 OCR。

推荐路线：

    Phase 8D：视觉总回归与面试展示复核
    Phase 9：文本版合同风险提示 MVP
    Phase 10：OCR provider 与合同照片识别链路

## 11. Phase 8D-0 结论

当前 HouseFolio 已完成首页、Portfolio、全局页面和 README 的视觉与叙事更新。

在进入合同助手之前，必须先确认：

    页面体验一致；
    产品边界一致；
    README 叙事一致；
    面试演示路径一致；
    没有把产品误导为房源平台、AI 选房系统或法律服务平台。

Phase 8D-0 只完成评审文档，不做实现。

下一步建议是 Phase 8D-1：浏览器手动总回归记录。