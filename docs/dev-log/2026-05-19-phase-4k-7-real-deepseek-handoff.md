# HouseFolio 接续文档｜2026-05-19｜Phase 4K-7 Real DeepSeek regression handoff

## 0. 新对话里的 AI 请先读这段

我们继续 HouseFolio 项目。

当前最新稳定点是：

9da0c86 docs: log real deepseek browser regression

当前最后已确认：

HEAD = origin/main = origin/HEAD = 9da0c86
git status clean
npm.cmd run build passed
Phase 4K-6 已完成并 push 到 origin/main
tracked files 中未发现疑似真实 sk-* API key
DeepSeek API key 仍只存在本机 .env.local，不打印、不粘贴、不提交

本轮已经完成：

Phase 4K-0：DeepSeek account / key setup preflight
Phase 4K-1：DeepSeek local env safety checkpoint
Phase 4K-2A：DeepSeek provider compatibility pre-scan
Phase 4K-2A.1：Targeted DeepSeek provider pre-scan
Phase 4K-2A.2：DeepSeek provider UTF-8 content verification
Phase 4K-2C：DeepSeek provider compatibility validation log
Phase 4K-2：Real DeepSeek API route smoke test
Phase 4K-3：Real DeepSeek route smoke test closing checkpoint
Phase 4K-4：Real DeepSeek browser regression plan
Phase 4K-5：Real DeepSeek browser regression
Phase 4K-6：Real DeepSeek browser regression closing checkpoint
Phase 4K-7：Real DeepSeek regression handoff

下一轮第一步必须先做启动检查，不要直接写新功能。

启动检查必须确认：

1. git status clean
2. npm.cmd run build 通过
3. 9da0c86 已在 origin/main
4. .env.local 仍被 .gitignore 忽略
5. .env.local 不出现在 git status
6. tracked files 中没有疑似真实 sk-* API key
7. DeepSeek env 只做非敏感形态检查，不打印 key

## 1. 当前项目长期定位

HouseFolio 是面向中国大陆租客的本地优先私人找房决策管理工具。

它不是：

房源平台
中介平台
房源聚合平台
真房源认证平台
AI 选房系统
公共房源库
公共照片库
房源视频库
Chrome 插件项目

长期红线：

不抓取第三方房源页面
不搬运贝壳、58、小红书、豆瓣等平台内容
不公开用户房源库
不做房东端、预约看房、联系房东、中介撮合、佣金、保证金
不宣传“真房源”
不宣传“避坑保真”
不把 Reference Score 写成推荐系统
不让 LLM 做评分、排序、筛选、真假判断
不输出“最佳房源 / 最优选择 / 系统推荐 / 推荐分 / 替你决定”
未经用户正式确认，不开启 Chrome 插件 / Chrome extension 工程

三层引擎边界：

L1 LBS：通勤、生活圈、地图、空间关系
L2 算法：参考评分、排序、筛选、对比、异常提示
L3 AI：总结、建议、解释、checklist、风险信号人话化

当前架构原则：

L1 通过 lib/lbs
L2 通过 lib/algorithm
L3 通过 lib/ai
照片 / 媒体通过 lib/storage
本地结构化数据通过 lib/local-store / lib/privacy
页面和组件不得直接绑定平台 SDK

## 2. 本地开发环境规则

当前环境：

Windows + PowerShell
项目路径：E:\Projects\housefolio

命令继续使用：

npm.cmd run build
npm.cmd run dev
npm.cmd install
npx.cmd ...

不要默认输出：

npm run build
npm run dev
npm install
npx ...

写入 .ts / .tsx / .md / .json，尤其包含中文时，继续使用 .NET WriteAllText 写 UTF-8 无 BOM。

不要用 PowerShell Get-Content 的显示结果判断中文是否损坏。Windows PowerShell 可能把 UTF-8 无 BOM 中文显示成乱码，但文件本身正常。

动态路由 [id] 读取时继续使用 -LiteralPath。

## 3. 当前最新稳定点

当前最新 commit：

9da0c86 docs: log real deepseek browser regression

近期关键 commits：

9da0c86 docs: log real deepseek browser regression
1a78ff3 docs: plan real deepseek browser regression
a1c0303 docs: log real deepseek route smoke
ba4eef0 docs: validate deepseek provider compatibility
dc50a6d docs: checkpoint deepseek env safety
0122972 docs: close ai session output control
57b3c4b feat: add ai session output clear control
9b9cc62 docs: close readme update phase

最后确认：

9da0c86 已 push 到 origin/main
git status clean
npm.cmd run build passed
tracked files 中未发现疑似真实 sk-* API key

## 4. Phase 4K 完成内容

Phase 4K 完成的是：

DeepSeek 本机 key 安全检查
DeepSeek provider compatibility validation
真实 DeepSeek API route smoke test
真实 DeepSeek 浏览器最小回归
真实 DeepSeek 回归日志与 handoff

## 5. DeepSeek key 与 env 状态

用户已经将 DeepSeek API key 写入本机：

.env.local

本机 env 当前应包含：

AI_COMPARE_PROVIDER=deepseek
DEEPSEEK_API_KEY=<local secret only>

注意：

不要打印 key
不要让用户粘贴 key
不要提交 .env.local
不要把 key 写入 docs
不要把 key 写入 README
不要把 key 写入任何 tracked file
不要记录 raw request / raw response / raw prompt

只允许做非敏感形态检查，例如：

AI_COMPARE_PROVIDER 是否为 deepseek
DEEPSEEK_API_KEY 是否存在
DEEPSEEK_API_KEY 是否以 sk- 开头
DEEPSEEK_API_KEY 长度是否大于安全阈值

## 6. 已确认的真实 DeepSeek 回归结果

Phase 4K-5 浏览器回归通过：

AI confirmation panel appears: PASS
Real DeepSeek output appears: PASS
Provider path: deepseek
Session-only note appears: PASS
Clear current AI output works: PASS
Refresh removes output: PASS
Settings has no AI output/history: PASS
Forbidden wording found: none
Console errors: none

Phase 4K-6 已记录该结果，但没有记录完整 AI 输出。

## 7. 当前 AI 数据边界

已确认：

AI 输出只在当前页面 session 中显示
用户可以点击“清除本次 AI 输出”
刷新页面后 AI 输出不保留
Settings 没有 AI output / AI history 数据项
没有新增 localStorage key
没有新增 sessionStorage key
没有新增 IndexedDB 写入
没有新增 AI history
没有新增 AI output export / delete
没有改 Settings
没有改 README

## 8. 当前 L3 边界

L3 只能解释 L2 comparison 结果。

L3 不能：

做评分
做排序
做筛选
替用户决定
判断房源真假
输出最佳房源
输出最优选择
输出系统推荐
输出推荐分
输出替你决定
变成最终推荐系统

## 9. 当前 Compare / AI 主链路状态

当前主链路：

Portfolio 选择 2–4 套房源
→ /compare?ids=...
→ 本机 listings 读取
→ buildComparisonInputs()
→ ComparisonInput[] / ComparisonModel[]
→ CompareTable 横向表
→ CompareExplanationPanel 静态辅助解释
→ AI trigger
→ AI confirmation panel
→ /api/ai/compare-explanation
→ provider selection
→ DeepSeek provider path
→ session-only AI output
→ clear current AI output

## 10. 下一步建议

下一轮不要直接继续扩 AI 功能。

优先选择以下之一：

A. 结束 Phase 4K，生成新对话启动检查
B. 回到产品展示 / Demo / 面试叙事整理
C. 做一次极小的 Compare / AI 文案复核
D. 暂停 AI track，进入下一条非高风险主线

不要直接进入：

AI history
AI output persistence
Settings AI data rights
AI output export / delete
cost control
rate limiting
Supabase
Chrome extension
public launch readiness
multi-round real AI stress test
照片进入 AI
视频进入 AI

如果后续要做以上任何一项，必须先写单独 boundary review。