# Phase 4F-0：Real AI provider readiness review

## 1. 本阶段目标

本阶段目标是评审 HouseFolio 在执行真实 DeepSeek success test 之前，需要满足哪些工程、配置、隐私、日志、回滚和验收条件。

本阶段只做 readiness review，不做真实 DeepSeek success test。

当前用户尚未拥有 DeepSeek API 账号与 API key，因此真实成功路径继续后置。本阶段不要求用户注册账号，不要求用户提供 key，不写真实 smoke script，不触发真实 provider 调用。

## 2. 当前稳定状态

当前稳定点：

- 最新稳定 commit：1f81c91 docs: close ai confirmation ui phase
- main 与 origin/main 同步
- npm.cmd run build 通过
- git status clean
- /api/ai/compare-explanation 已存在
- route 已支持 server-side provider selection
- default provider path 仍为 mock
- DeepSeek path 已通过 missing-config safe error 验证
- Compare UI 已有真实 AI 调用前确认面板
- AI output 仍为 session-only
- Settings 暂无 AI 数据区
- localStorage 未新增 AI key

这说明当前工程已经具备 real-provider-capable route 的安全外壳，但还不具备真实 DeepSeek success test 的外部条件。

## 3. 本阶段明确不做

Phase 4F-0 不做以下事项：

- 不做真实 DeepSeek success test
- 不要求用户现在注册 DeepSeek
- 不要求用户提供 API key
- 不写真实 provider smoke script
- 不改 route
- 不改 provider
- 不改 prompt builder
- 不改 Compare UI
- 不改 Settings
- 不新增 localStorage key
- 不持久化 AI 输出
- 不做 AI history
- 不做成本 / 频控实现
- 不做 public launch readiness
- 不清理既有施工脚本
- 不顺手处理无关文件

本阶段文件范围仅限：

- docs/architecture/phase-4f-0-real-ai-provider-readiness-review.md

## 4. 真实 DeepSeek success test 的外部前置条件

真实 DeepSeek success test 必须等以下条件满足后单独进行：

1. 用户已经注册 DeepSeek 开放平台账号。
2. 用户已经获得有效 API key。
3. 用户确认可以消耗少量真实 API 额度。
4. API key 仅写入本地 .env.local 或当前 PowerShell 临时环境变量。
5. API key 不进入 git。
6. API key 不被打印到终端。
7. API key 不进入浏览器端 bundle。
8. API key 不出现在 NEXT_PUBLIC_* 变量中。
9. API key 不写入 localStorage、sessionStorage、IndexedDB 或 Settings 导出数据。
10. 用户明确接受本次测试会向第三方模型服务商发送脱敏后的 comparison input。

在以上条件满足前，真实 success test 不应执行。

## 5. 环境变量 readiness checklist

真实 DeepSeek path 至少需要确认以下配置：

- AI_COMPARE_PROVIDER=deepseek
- DEEPSEEK_API_KEY 存在
- DeepSeek request URL 使用服务端内部配置或 provider 内部常量
- 模型名称使用 provider 内部配置或默认值
- 可选超时配置存在默认值
- 可选温度 / token 上限存在保守默认值

检查 API key 时只允许判断是否存在，不允许打印实际值。

允许：

- 输出 DEEPSEEK_API_KEY is configured: true
- 输出 key length > 0
- 输出 provider readiness = configured

禁止：

- 打印完整 key
- 打印 key 前缀
- 打印 Authorization header
- 打印 Bearer token
- 打印完整 request body 中的敏感字段
- 打印完整 provider raw response

## 6. 不打印 key 的检查方式

未来真实测试前，可以使用只输出布尔值的方式检查环境变量。

示例原则：

- 只检查 Boolean(process.env.DEEPSEEK_API_KEY)
- 不 console.log(process.env.DEEPSEEK_API_KEY)
- 不把 key 拼进 error message
- 不把 key 拼进 thrown Error
- 不把 key 放进 client response
- 不把 key 写进 dev-log 原文

如果需要记录测试结果，文档中只能写：

- DEEPSEEK_API_KEY configured: yes
- provider selected: deepseek
- route response code: 200 / 4xx / 5xx
- provider returned valid structured output: yes / no

不能写：

- key 原文
- Authorization header
- request URL 里的认证信息
- raw response 全文
- prompt 全文

## 7. Prompt 与输入日志边界

真实 provider 测试时，不应把 prompt 全文或用户输入全文写入日志。

允许记录：

- selected listing count
- locale
- provider name
- response status
- error code
- duration bucket
- output structure validation result

禁止记录：

- 完整 prompt
- 完整 redacted input JSON
- 完整 user notes
- 完整 listing address
- 完整 sourceUrl
- 完整 provider raw response
- provider request URL
- Authorization header
- apiKey
- raw model content

原因：

HouseFolio 的 AI 输入即使已经脱敏，仍可能包含用户找房偏好、通勤锚点语义、主观看房记录摘要和候选房源结构化信息。真实 provider 测试不应把这些内容复制到 dev-log 或 console 中。

## 8. Valid provider response 标准

真实 DeepSeek success test 不应只看 HTTP 200，而应验证返回内容是否能转换为 HouseFolio 的 CompareExplanationOutput。

一个 valid provider response 至少需要满足：

1. HTTP 请求成功，或 provider 层能识别并包装错误。
2. 返回内容能解析为结构化 JSON 或能被 provider 安全转换为结构化对象。
3. 输出字段只包含 HouseFolio 允许的 CompareExplanationOutput 字段。
4. summary 存在，且为用户可读中文。
5. tradeoffs 为数组。
6. commuteNotes 为数组。
7. riskExplanations 为数组。
8. missingFieldNotes 为数组。
9. checklist 为数组。
10. disclaimer 存在。
11. 不包含最佳房源、最优选择、系统推荐、推荐分、替你决定等措辞。
12. 不包含 provider requestUrl、rawResponse、apiKey、Authorization、Bearer 等敏感字段。
13. 不包含完整地址、门牌号、手机号、微信号、身份证号。
14. 不声称房源真实可靠。
15. 不替用户作最终决策。

如果 provider 返回自然语言而非严格 JSON，provider 层必须安全失败或使用受控解析逻辑；不能把 raw text 直接当作可信结构输出。

## 9. Provider error handling readiness

真实 provider 失败时，route 必须返回安全错误。

允许返回：

- ok: false
- error.code
- error.message 使用安全中文文案
- provider: deepseek
- status: 400 / 401 / 429 / 500 / 503 等安全状态

禁止返回：

- provider raw error
- raw response body
- request URL
- Authorization header
- API key
- stack trace
- prompt
- redacted input 全文
- model 原始输出全文

关键错误场景：

1. missing_provider_configuration
2. invalid_input
3. provider_auth_failed
4. provider_rate_limited
5. provider_timeout
6. provider_invalid_response
7. provider_unavailable
8. unknown_provider_error

当前阶段不要求实现全部错误码，但 readiness review 需要把这些场景作为后续真实 provider smoke test 的观察对象。

## 10. UI 安全展示原则

真实 provider 测试失败时，Compare UI 只能展示用户可理解的安全提示。

推荐文案方向：

- 暂时无法生成 AI 辅助解释，请稍后重试。
- 当前 AI 服务配置暂不可用。
- 当前 AI 服务响应异常，已自动停止本次生成。
- 你可以继续使用横向对比表和静态 checklist 做辅助比较。

禁止展示：

- DeepSeek raw error
- HTTP raw body
- provider request URL
- API key 信息
- stack trace
- prompt
- JSON dump
- 内部模块路径

UI 不应因为真实 provider 失败而破坏 CompareTable、静态解释面板或返回 Portfolio 的主链路。

## 11. 回滚到 mock 的策略

真实 provider 测试失败时，最小回滚方式应是环境变量回滚，而不是代码回滚。

优先策略：

1. 清除当前 PowerShell 临时变量 AI_COMPARE_PROVIDER。
2. 清除当前 PowerShell 临时变量 DEEPSEEK_API_KEY。
3. 或在 .env.local 中把 AI_COMPARE_PROVIDER 改回 mock / 留空。
4. 重启 dev server。
5. 重新访问 /compare。
6. 确认 provider 返回 mock。
7. 确认 AI output 仍 session-only。
8. 确认 localStorage 无 AI key。
9. 确认 Settings 无 AI 数据区。

只有当 route/provider 代码被破坏时，才考虑 git revert。

## 12. 未来真实 success test 的建议边界

未来有 DeepSeek API key 后，应单独开一个阶段，例如：

- Phase 4F-1：Real DeepSeek smoke test plan
- Phase 4F-2：Real DeepSeek success path smoke test

Phase 4F-1 可以只写计划，不发请求。

Phase 4F-2 才允许真实请求，但必须满足：

- 用户明确确认已有 key
- key 不打印
- 请求只用最小 mock-like comparison payload
- 不使用真实个人房源数据
- 不使用真实完整地址
- 不使用真实笔记原文
- 不使用照片或视频
- 不持久化输出
- 不改 Settings
- 不新增 localStorage key
- 测试结束后清理临时环境变量
- 测试结果只记录 status、provider、结构化字段是否合格，不记录 prompt/raw response

## 13. 是否需要真实 provider smoke script

当前结论：Phase 4F-0 不写 smoke script。

未来如果写真实 provider smoke script，应满足：

- 脚本只在本地手动运行
- 脚本文件不包含 API key
- 脚本不打印 API key
- 脚本不打印完整 prompt
- 脚本不打印 raw response
- 脚本使用最小测试 payload
- 脚本输出仅包含 pass/fail、status code、provider、结构化字段检查结果
- 脚本运行后不写入 localStorage / IndexedDB / Settings
- 脚本不进入浏览器 UI 流程

是否提交该脚本需要单独评审。真实 key 出现前不应提前写入。

## 14. 是否需要 Settings AI 数据权利区

当前结论：不需要。

原因：

- AI output 当前仍 session-only
- 刷新后输出消失
- 没有 AI history
- 没有 AI artifact persistence
- 没有新增 AI localStorage key
- 没有云端 AI 记录
- 没有可导出 / 可删除的 AI 持久化数据

只有当未来出现以下能力时，才需要扩展 Settings：

- AI output 持久化
- AI history
- AI prompt 记录
- 云端 AI 调用记录
- 可恢复的 AI artifact
- 用户可导出 AI 分析记录
- 用户可删除 AI 分析记录
- 用户可撤回 AI 授权

在这些能力出现前，不应为了 readiness review 提前改 Settings。

## 15. 是否保持 session-only

当前结论：必须继续保持 AI output session-only。

理由：

- 降低隐私和数据权利复杂度
- 不增加 localStorage key
- 不扩展 Settings
- 不制造 AI history 管理问题
- 不把真实 provider 测试结果沉淀为用户数据
- 符合当前 MVP 的克制边界

真实 provider success test 即使成功，也不应改变 session-only 策略。

## 16. 是否具备 public launch readiness

当前结论：不具备，也不应在 Phase 4F-0 追求。

原因：

- 尚无真实 DeepSeek success test
- 尚无真实 provider 成本控制
- 尚无频控策略
- 尚无用户级额度隔离
- 尚无生产级错误观测
- 尚无正式隐私政策联动
- 尚未评估面向公众提供生成式 AI 能力的合规要求
- 当前仍是作品集 / MVP 展示阶段

Phase 4F-0 的 readiness 只面向“未来受控本地 smoke test”，不是 public launch。

## 17. Phase 4F-0 结论

当前 HouseFolio 状态可以判定为：

- mock AI flow ready
- DeepSeek missing-config path ready
- server-side provider selection ready
- AI confirmation UI ready
- session-only AI output ready
- Settings no-AI-persistence boundary ready
- localStorage no-AI-key boundary ready
- real DeepSeek success test not ready due to missing API account/key
- public launch readiness not ready and not in scope

因此，Phase 4F-0 的结论是：

HouseFolio 已经具备未来执行真实 DeepSeek success test 的工程外壳和安全边界基础，但在用户尚未拥有 DeepSeek API 账号与 key 的情况下，真实成功路径必须继续后置。下一步不应直接做真实调用，而应在用户拥有 key 后，先单独规划 Phase 4F-1：Real DeepSeek smoke test plan，再执行受控的 Phase 4F-2 smoke test。

## 18. 验收标准

本阶段验收标准：

- 只新增 docs/architecture/phase-4f-0-real-ai-provider-readiness-review.md
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
- commit 信息为 docs: review real ai provider readiness

## 19. 下一阶段建议

下一阶段不要直接做真实 DeepSeek success test。

建议路线：

1. 如果用户仍没有 DeepSeek API key：
   - 进入 Phase 4F-1A：Real AI provider readiness closing checkpoint
   - 或暂停 AI 主线，转回非真实 provider 依赖的产品主线

2. 如果用户已经有 DeepSeek API key：
   - 先进入 Phase 4F-1：Real DeepSeek smoke test plan
   - 只写测试计划，不发真实请求
   - 再进入 Phase 4F-2：Real DeepSeek success path smoke test
   - 使用最小测试 payload，不使用真实个人数据

不论选择哪条路线，都必须继续保持：

- L3 只做人话解释
- 不做评分 / 排序 / 筛选 / 决定
- AI output session-only
- Settings 暂不扩展
- no AI localStorage key
- no prompt/raw response logging