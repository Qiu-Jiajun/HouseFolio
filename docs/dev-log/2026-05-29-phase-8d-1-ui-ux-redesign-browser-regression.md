# Phase 8D-1：UI/UX redesign browser regression log

## 1. 阶段定位

Phase 8D-1 是 Phase 8D-0 之后的 UI/UX redesign 浏览器手动回归记录。

上一个阶段已经完成：

    0f83054 docs: review ui ux redesign regression

Phase 8D-0 明确了当前需要在进入合同助手之前，先复核首页、Portfolio、Add Listing、Detail、Compare、Demo、Settings、AppNav、ComplianceFooter 和 README 是否形成一致的产品展示闭环。

本阶段只记录浏览器回归范围和检查结论，不改功能代码。

## 2. 本阶段范围

允许新增：

    docs/dev-log/2026-05-29-phase-8d-1-ui-ux-redesign-browser-regression.md

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

## 3. 当前稳定点

当前稳定点：

    0f83054 docs: review ui ux redesign regression

当前前置状态：

    git status clean
    npm.cmd run build passed
    Phase 8D-0 已 push 到 origin/main
    当前 UI/UX 改版总回归评审文档已完成

## 4. 回归目标

本次浏览器回归目标不是检查某个单点 UI，而是确认：

    1. Phase 8A 首页视觉改版；
    2. Phase 8B Portfolio 视觉改版；
    3. Phase 8C 全局视觉对齐；
    4. README 视觉展示更新；

是否共同形成稳定、连贯、适合面试展示的产品体验。

核心判断：

    当前版本是否已经从工程 Demo 感，转向更适合中国大陆年轻租客理解的生活化私人找房决策工具。

## 5. 建议浏览器回归路径

建议在本地开发环境或线上 Demo 中按以下路径检查。

### 5.1 首页

路径：

    /

检查项：

    页面首屏是否温馨、清晰、生活化；
    主视觉是否与 HouseFolio 当前定位一致；
    主 CTA 是否清楚；
    首页是否自然引导到 Portfolio 或 Demo；
    页面是否没有房源平台、中介平台、真房源认证暗示；
    页面是否没有过度工程术语。

预期结论：

    首页应像生活决策工具入口，而不是工程 Dashboard。

### 5.2 Portfolio

路径：

    /portfolio

检查项：

    页面是否像候选房源清单；
    页面是否像私人整理台，而不是后台管理表；
    添加候选房源入口是否可见；
    选择 2-4 套房源进入 Compare 的路径是否清楚；
    参考评分是否保持辅助比较定位；
    卡片是否没有强烈推荐系统感；
    页面整体是否延续首页的温和视觉气质。

预期结论：

    Portfolio 应承接首页改版后的生活化气质，而不是回到工程列表页。

### 5.3 Add Listing

路径：

    /portfolio/new

检查项：

    来源平台分组是否清楚；
    中国大陆主流渠道是否更易理解；
    页面是否强调用户主动添加；
    页面是否没有自动抓取、自动搬运、平台聚合等暗示；
    表单视觉是否与新版全局风格一致。

预期结论：

    Add Listing 应让用户理解“我自己把候选房源整理进来”，而不是让用户误解为系统会抓取第三方平台。

### 5.4 Detail

路径：

    /portfolio/[id]

检查项：

    详情页信息层级是否清晰；
    通勤锚点表达是否仍然适合学生、上班族、小家庭等多场景；
    照片、笔记、通勤、参考评分是否保持本地优先与辅助比较边界；
    页面是否没有把参考评分包装为最终推荐；
    返回 Portfolio 的路径是否自然。

预期结论：

    Detail 应像一套房源的私人档案，而不是平台房源详情页或中介展示页。

### 5.5 Compare

路径：

    /compare?ids=...

检查项：

    横向对比表是否清楚；
    参考评分是否仍是参考分；
    AI 解释是否仍有确认边界；
    AI 输出是否没有替用户决定；
    页面是否避免最佳房源、最优选择、系统推荐、推荐分、替你决定等措辞；
    页面视觉是否与 Portfolio 和首页一致。

预期结论：

    Compare 应是辅助比较工具，不是 AI 选房系统。

### 5.6 Demo

路径：

    /demo

检查项：

    Demo 是否仍适合面试官快速理解；
    Demo 是否不依赖真实用户隐私数据；
    Demo 是否没有被新 UI 风格割裂；
    Demo 是否没有误导为正式运营平台。

预期结论：

    Demo 应作为作品集展示入口，而不是正式运营承诺。

### 5.7 Settings

路径：

    /settings

检查项：

    本地数据权利是否清楚；
    查看本地数据、导出 JSON、清除本机数据是否可找到；
    是否仍能说明 mock data 与用户数据区别；
    是否没有暗示云端已保存完整用户资料；
    当前新增或已有本地数据类型是否没有被 Settings 遗漏。

预期结论：

    Settings 应继续承担数据权利与边界解释职责。

### 5.8 AppNav 与 ComplianceFooter

检查项：

    导航入口是否清楚；
    页面之间是否可达；
    Footer 是否继续表达不抓取、不聚合、不认证、不撮合；
    Footer 是否没有与 README 或页面文案冲突。

预期结论：

    AppNav 和 ComplianceFooter 应保证产品没有功能孤岛和合规表达断层。

### 5.9 README

路径：

    README.md

检查项：

    README 是否反映当前 UI/UX 改版；
    README 是否说明项目不是房源平台；
    README 是否没有把合同助手或 OCR 写成已完成能力；
    README 新增图片是否服务项目理解；
    README 是否适合面试官快速了解项目亮点、边界和当前状态。

预期结论：

    README 应服务作品集展示，不应制造过度承诺。

## 6. 禁止措辞回归清单

页面和 README 中应继续避免：

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

## 7. 当前回归结论

基于当前命令级检查：

    npm.cmd run build passed
    git status clean
    当前路由表正常
    Phase 8D-0 已完成并 push
    Phase 8D-1 仅新增回归日志，不触碰功能代码

本阶段暂不记录实际浏览器截图，也不引入自动化浏览器测试。

手动浏览器回归建议在下一步由用户按第 5 节路径逐页检查。如果未发现明显页面断点，可以进入 Phase 8D-2 closing checkpoint。

## 8. 风险判断

当前主要风险不是功能不可用，而是：

    1. 多轮 UI 改版后页面之间可能存在视觉断层；
    2. README 叙事可能领先或滞后于实际产品；
    3. 视觉更生活化后，仍需确保合规边界没有被弱化；
    4. 合同助手和 OCR 不能被 README 或页面误写成已完成能力。

因此，在进入 Phase 9 合同助手之前，应先完成 Phase 8D 收口。

## 9. 下一步建议

建议下一步进入：

    Phase 8D-2：UI/UX redesign closing checkpoint

Phase 8D-2 仍只写收口日志，不改功能代码。

Phase 8D 收口后，再进入：

    Phase 9A：合同助手边界评审

OCR 的合理开始点仍然是：

    Phase 10A：OCR provider boundary review
    Phase 10C：OCR 最小实现

不建议在 Phase 9A 直接开始 OCR。