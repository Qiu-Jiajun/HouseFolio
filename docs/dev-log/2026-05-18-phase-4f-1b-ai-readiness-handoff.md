# HouseFolio 接续文档｜2026-05-18｜Phase 4F-1B AI readiness handoff

## 0. 新对话里的 AI 请先读这段

我们继续 HouseFolio 项目。

当前最新稳定点是：

- 7b72b5d docs: close real ai readiness review

当前最后已确认：

- HEAD = origin/main = origin/HEAD = 7b72b5d
- git status clean
- npm.cmd run build 通过
- Phase 4F-0 已完成并 push
- Phase 4F-1A 已完成并 push

当前不要直接进入真实 DeepSeek success test。

原因：

- 用户还没有 DeepSeek API 账号
- 用户还没有 DeepSeek API key
- 当前阶段只完成了 real AI provider readiness review
- 真实 provider success path 必须后置到单独 smoke test plan 阶段

---

## 1. 当前准确进度

当前 HouseFolio 已完成：

- Phase 4A：L2 comparison model layer
- Phase 4B：Compare UI 主链路
- Phase 4C：Static L3-facing compare explanation surface
- Phase 4D：Mock AI provider、mock route、mock UI trigger、real prompt builder、DeepSeek provider layer、real-provider-capable API route
- Phase 4E：AI user confirmation UI
- Phase 4F-0：Real AI provider readiness review
- Phase 4F-1A：Real AI provider readiness closing checkpoint
- Phase 4F-1B：AI readiness handoff

当前最新 commits：

- 7b72b5d docs: close real ai readiness review
- c78b92e docs: review real ai provider readiness
- 1f81c91 docs: close ai confirmation ui phase
- b2ca445 docs: log ai confirmation browser regression
- e471ba6 feat: add ai confirmation step
- 76da981 docs: plan real ai confirmation ui

---

## 2. 当前最高优先级

继续保持：

- 基础闭环稳定
- 架构边界清晰
- 合规边界明确
- 后续迁移友好
- AI 边界分阶段推进
- 不跳步做真实 DeepSeek success test
- 不让 L3 反客为主变成推荐系统

当前尤其要注意：

- L3 只能解释 L2 comparison 结果
- L3 不能做评分
- L3 不能做排序
- L3 不能做筛选
- L3 不能替用户决定
- L3 不能判断房源真假
- L3 不能输出“最佳房源”
- L3 不能输出“最优选择”
- L3 不能输出“系统推荐”
- L3 不能输出“推荐分”
- L3 不能输出“替你决定”

---

## 3. 本地开发环境规则

当前环境：

- Windows + PowerShell
- 项目路径：E:\Projects\housefolio

命令继续使用：

- npm.cmd run build
- npm.cmd run dev
- npm.cmd install
- npx.cmd ...

不要默认输出：

- npm run build
- npm run dev
- npm install
- npx ...

写入 .ts / .tsx / .md / .json，尤其包含中文时，继续使用 .NET WriteAllText 写 UTF-8 无 BOM。

不要用 PowerShell Get-Content 的显示结果判断中文是否损坏。Windows PowerShell 可能把 UTF-8 无 BOM 中文显示成乱码，但文件本身正常。

检查中文真实状态时，优先使用 Node。

动态路由 [id] 读取时继续使用 -LiteralPath。

---

## 4. GitHub 连接与代理注意事项

最近多次出现 GitHub HTTPS 连接失败：

- Failed to connect to github.com port 443
- Recv failure: Connection was reset
- curl 28 Failed to connect to github.com port 443

已确认代理端口可用：

- 127.0.0.1:10808

当普通 git push origin main 或 git fetch origin main 失败时，使用：

    git -c http.proxy=http://127.0.0.1:10808 `
        -c https.proxy=http://127.0.0.1:10808 `
        -c http.version=HTTP/1.1 `
        push origin main

fetch 同理：

    git -c http.proxy=http://127.0.0.1:10808 `
        -c https.proxy=http://127.0.0.1:10808 `
        -c http.version=HTTP/1.1 `
        fetch origin main

如果代理不可用，先检查：

    Test-NetConnection 127.0.0.1 -Port 10808

若 TcpTestSucceeded 为 False，先打开或重启代理工具，不要优先怀疑代码。

---

## 5. 项目长期定位

HouseFolio 是面向中国大陆租客的本地优先私人找房决策工具。

它不是：

- 房源平台
- 中介平台
- 房源聚合平台
- 真房源认证平台
- AI 选房系统
- 公共房源库
- 公共照片库
- 房源视频库

长期红线：

- 不抓取第三方房源页面
- 不搬运贝壳、58、小红书、豆瓣等平台内容
- 不公开用户房源库
- 不做房东端、预约看房、联系房东、中介撮合、佣金、保证金
- 不宣传“真房源”“避坑保真”“替你选房负责”
- 不把 Reference Score 写成推荐系统
- 不让 LLM 做评分、排序、筛选、真假判断

三层引擎边界：

- L1 LBS：通勤、生活圈、地图、空间关系
- L2 算法：参考评分、排序、筛选、对比、异常提示
- L3 AI：总结、建议、解释、checklist、风险信号人话化

架构原则：

- L1 通过 lib/lbs
- L2 通过 lib/algorithm
- L3 通过 lib/ai
- 照片 / 媒体通过 lib/storage
- 本地结构化数据通过 lib/local-store / lib/privacy
- 页面和组件不得直接绑定平台 SDK

---

## 6. 当前 Compare / AI 主链路状态

当前 /compare 主链路已经完成：

1. Portfolio 选择 2–4 套房源
2. 跳转 /compare?ids=...
3. 本机 listings 读取
4. buildComparisonInputs()
5. ComparisonInput[] / ComparisonModel[]
6. CompareTable 横向表
7. CompareExplanationPanel 静态辅助解释
8. Mock AI UI trigger
9. /api/ai/compare-explanation
10. 默认 mock provider
11. AI confirmation UI
12. session-only output

当前已具备：

- /compare route
- Portfolio 勾选 2–4 套房源
- URL query 传递 selected listing ids
- Client Component 读取本机 listings
- 结构化 ComparisonModel preview
- 横向对比表 CompareTable
- 缺失字段与风险信号 tag 展示
- 查看详情入口
- 静态辅助解释面板
- Mock AI 辅助解释按钮
- 真实 AI 触发前确认步骤
- server-side provider selection
- DeepSeek provider layer
- DeepSeek missing-config safe path
- session-only AI output
- 辅助比较、不代表最终推荐的定位说明

当前仍不做：

- 真实 DeepSeek success test
- 真实 DeepSeek browser regression
- AI output persistence
- AI output history
- Settings AI 数据权利覆盖
- AI 输出导出 / 删除
- 真实 provider 成本 / 频控完善
- 真实 provider public launch readiness
- selection localStorage
- 照片进入 Compare
- 视频进入 Compare

---

## 7. Phase 4F-0 完成内容

Phase 4F-0 新增文件：

- docs/architecture/phase-4f-0-real-ai-provider-readiness-review.md

提交：

- c78b92e docs: review real ai provider readiness

完成内容：

- 评审真实 DeepSeek success test 的外部前置条件
- 明确用户尚未拥有 DeepSeek API 账号和 key
- 明确真实 success test 不应执行
- 明确 API key 不得打印、不得提交、不得进入 NEXT_PUBLIC
- 明确 prompt / raw response 不应记录到日志
- 明确 valid provider response 标准
- 明确 provider error handling readiness
- 明确 UI 安全展示原则
- 明确回滚到 mock 的策略
- 明确 Settings 暂不需要 AI 数据权利区
- 明确 AI output 必须继续 session-only
- 明确 public launch readiness 不在当前范围

Phase 4F-0 没有改 src，没有改 route，没有改 provider，没有改 prompt builder，没有改 Compare UI，没有改 Settings，没有新增 localStorage key，没有持久化 AI 输出。

---

## 8. Phase 4F-1A 完成内容

Phase 4F-1A 新增文件：

- docs/dev-log/2026-05-18-phase-4f-1a-real-ai-readiness-closing.md

提交：

- 7b72b5d docs: close real ai readiness review

完成内容：

- 收口 Phase 4F-0
- 确认 readiness review 已完成
- 确认真实 DeepSeek success test 因缺少 API account/key 后置
- 确认当前真实 provider 工程外壳 ready
- 确认 mock fallback ready
- 确认 missing-config safe path ready
- 确认 AI confirmation UI ready
- 确认 no-AI-persistence boundary ready
- 确认 no Settings AI data section ready
- 确认 real DeepSeek success test not ready
- 确认 public launch readiness not ready

---

## 9. 当前 AI readiness 结论

当前可以判定为：

- mock AI flow ready
- DeepSeek missing-config path ready
- server-side provider selection ready
- AI confirmation UI ready
- session-only AI output ready
- Settings no-AI-persistence boundary ready
- localStorage no-AI-key boundary ready
- real DeepSeek success test not ready
- public launch readiness not ready

真实 DeepSeek success test 的 not ready 不是代码阻塞，而是外部账号与 key 条件尚未满足。

---

## 10. 下一轮启动检查

下一轮对话第一步必须执行：

1. 确认 git status clean
2. 确认 npm.cmd run build 通过
3. 确认 7b72b5d 已在 origin/main
4. 确认当前不进入真实 DeepSeek success test
5. 确认本轮要做基础层、L1、L2 还是 L3
6. 确认是否会引入 Supabase / 高德 / AI
7. 确认是否符合 lib/* 封装原则
8. 确认是否增加合规风险
9. 确认是否需要新增入口或导航
10. 确认中文文件是否需要 Node UTF-8 检查

建议启动检查命令：

    Set-Location E:\Projects\housefolio

    git status
    git --no-pager log -8 --oneline --decorate
    git fetch origin main
    git merge-base --is-ancestor 7b72b5d origin/main
    npm.cmd run build

如果 git fetch 失败，使用代理版 fetch。

---

## 11. 下一步路线建议

因为用户还没有 DeepSeek API 账号，下一轮不建议继续真实 AI provider 主线。

可选路线：

### 选项 A：暂停真实 AI，回到 L2 / Compare 产品增强

适合继续强化 HouseFolio 可演示性，但不要接真实 DeepSeek。

可能方向：

- Compare UI 小幅回归与文档收口
- Compare copy / layout 小修
- L2 comparison explanation 的非 AI polish
- Compare empty/error state 检查
- Demo 与真实 Compare 的叙事一致性检查

限制：

- 不新增 selection localStorage
- 不新增 AI persistence
- 不引入真实 provider
- 不扩展 Settings

### 选项 B：做 Phase 4F 最终 handoff 后暂停本轮

适合当前对话过长时使用。

输出一份可直接加入 Project Sources 的新对话接续文档，包含当前稳定点、完成范围、下一轮第一步。

### 选项 C：等用户拥有 DeepSeek API key 后，再进入 Phase 4F-1

只有用户明确说已经有 DeepSeek API key 时才进入。

路线应为：

- Phase 4F-1：Real DeepSeek smoke test plan
- Phase 4F-2：Real DeepSeek success path smoke test

Phase 4F-1 只写计划，不发真实请求。

Phase 4F-2 才允许真实请求，但必须：

- 不打印 key
- 不打印 Authorization header
- 不记录 prompt 全文
- 不记录 raw response 全文
- 使用最小 mock-like payload
- 不使用真实个人房源数据
- 不使用完整地址
- 不使用笔记原文
- 不使用照片或视频
- 不持久化输出
- 不新增 localStorage key
- 不改 Settings

---

## 12. 不建议下一步做的事

当前不建议：

- 真实 DeepSeek success test
- 真实 DeepSeek browser regression
- DeepSeek cost / rate control 实现
- AI output history
- Settings AI 数据权利区
- Supabase
- 云端账号系统
- 高德新能力
- 地图 UI
- POI / 生活圈真实计算
- 视频能力
- Chrome 插件
- 部署大改
- 全站 UI 大改

原因：

- 当前真实 provider 缺少外部 key 条件
- AI output 仍 session-only
- Settings 暂无 AI 数据需要管理
- HouseFolio 当前优先级仍是稳定闭环、边界清晰、可演示、可解释

---

## 13. 给下一轮对话的推荐开头

可以这样开启下一轮：

“我们继续 HouseFolio 项目。请参考 Project Sources 里的《HouseFolio 接续文档｜2026-05-18｜Phase 4F-1B AI readiness handoff》。当前最新稳定点应为 7b72b5d docs: close real ai readiness review，且已 push 到 origin/main。请先带我做启动检查，确认 git clean、build 通过、7b72b5d 已在 origin/main。注意：我还没有 DeepSeek API 账号，所以不要做真实 DeepSeek success test。请先判断下一步应该回到 L2 / Compare 产品增强，还是先做一个阶段性收尾。”

---

## 14. 本阶段验收标准

本阶段验收标准：

- 只新增本 handoff 文件
- 不修改 src
- 不修改 route
- 不修改 provider
- 不修改 prompt builder
- 不修改 Compare UI
- 不修改 Settings
- 不新增 localStorage key
- 不持久化 AI 输出
- npm.cmd run build 通过
- git status clean
- commit 信息为 docs: add ai readiness handoff
- push 到 origin/main 成功

---

## 15. 阶段结论

Phase 4F-1B 完成后，当前 AI readiness 阶段具备完整接续材料。

当前最新稳定状态应变为：

- Phase 4F-0：Real AI provider readiness review completed
- Phase 4F-1A：Real AI provider readiness closing checkpoint completed
- Phase 4F-1B：AI readiness handoff completed

下一步不应做真实 DeepSeek success test，除非用户已经准备好 DeepSeek API 账号与 key，并明确进入单独 smoke test plan 阶段。