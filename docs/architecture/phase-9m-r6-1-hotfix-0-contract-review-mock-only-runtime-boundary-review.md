# Phase 9M-R6-1-hotfix-0｜Contract-review mock-only runtime path boundary review

## 0. 文档用途

本文档用于评审 Phase 9M-R6-1 浏览器人工回归被阻塞后的最小修复边界。

当前不得直接修改 src。

当前不得启动 dev server。

当前不得开始浏览器回归。

当前不得运行真实 DeepSeek 请求。

当前唯一目标是：

    为合同风险提示助手增加一个可安全用于浏览器人工回归的
    contract-review runtime mock-only path。

---

## 1. 当前稳定点

当前远端稳定点：

    5345900 feat: integrate full redacted contract review ui

完整 hash：

    534590076ea822377a1a1c56432a9fd2623c5f4e

当前已经确认：

    HEAD = main = origin/main = actual remote refs/heads/main
    git status clean
    npm.cmd run build passed
    terminal.integrated.shellIntegration.enabled = false

当前受保护 stash 必须继续原样保留：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

stash hash：

    8a27c545465dc185f5506311392ab57dc6e67f84

stash 第三父提交：

    60137e8e3bb7faae9eacac510a6bb2228901a227

禁止：

    git stash apply
    git stash pop
    git stash drop
    git stash clear

---

## 2. R6-1-0 与 R6-1-0B 只读检查结论

### 2.1 已经通过的基础检查

已经确认：

    HEAD 精确匹配稳定点
    origin/main 精确匹配稳定点
    git ls-remote 精确匹配稳定点
    working tree clean
    build passed
    shell integration = false
    stash 完整保留
    .env.local 未修改
    src 未修改
    3210 等候选端口可用
    未启动 dev server
    未运行真实 DeepSeek 请求

### 2.2 已经识别的环境变量

.env.local 中存在：

    AI_COMPARE_PROVIDER
    AMAP_API_KEY
    DEEPSEEK_API_KEY
    LBS_PROVIDER

src 中使用：

    AI_COMPARE_PROVIDER
    AMAP_API_KEY
    CONTRACT_REVIEW_AI_MODEL
    DEEPSEEK_API_KEY
    LBS_PROVIDER

当前不存在：

    CONTRACT_REVIEW_AI_PROVIDER

或其他同等用途的合同审查 runtime provider selector。

### 2.3 三条链路必须区分

    LBS_PROVIDER
    → 只控制 LBS 通勤 provider
    → amap / mock

    AI_COMPARE_PROVIDER
    → 只控制房源对比 AI explanation provider
    → deepseek / mock

    CONTRACT_REVIEW_AI_PROVIDER
    → 当前尚不存在
    → 应作为合同风险提示助手独立 runtime selector

LBS_PROVIDER 不得被误用为合同审查 provider selector。

AI_COMPARE_PROVIDER 不得被误用为合同审查 provider selector。

### 2.4 合同审查 route 当前默认直接使用 DeepSeek

当前 contract-review route 默认参数：

    provider: ContractReviewExplanationRouteProvider =
      contractReviewDeepSeekProvider

当前 route：

    不读取合同审查 provider selector
    不包含 runtime mock 分支
    默认使用 contractReviewDeepSeekProvider

因此：

    当前不能通过进程级环境变量安全启动合同审查 mock-only dev server。

### 2.5 当前发现的 mock 仅属于 contract-check

当前 route-contract-check.ts 中存在：

    ContractReviewProviderMockState
    withMockedContractReviewProvider()

这些能力用于：

    contract-check
    dependency shadow
    测试替身
    route 边界验证

它们不属于：

    dev server runtime registry
    可通过环境变量选择的 contract-review mock provider
    浏览器回归可使用的 mock-only 链路

不得把 test-only mock 误判为 runtime mock。

---

## 3. 为什么必须补充 contract-review runtime mock-only path

Phase 9M-R6-1 的目标是：

    在不运行真实 DeepSeek 请求的前提下，
    完成 full-redacted 合同风险提示 UI 的浏览器人工回归。

需要验证：

    完整脱敏合同预览
    用户确认前不联网
    用户一次必要确认
    ruleSignals = [] 时仍可继续
    规则从 gate 改为 signal
    L2 决定 riskLevel
    AI 补充关注项不带 riskLevel
    文本变化后旧状态失效
    重新生成时再次确认
    清除本次结果
    session-only
    reasoning_content 不暴露

如果直接使用 contractReviewDeepSeekProvider：

    .env.local 已存在 DEEPSEEK_API_KEY
    最终确认后可能发出真实 DeepSeek 请求
    无法满足 mock-only 浏览器回归边界

因此必须增加一个独立、显式、可控、无外部联网的 contract-review runtime mock path。

---

## 4. Harness 不变量

本 hotfix 不改变 Phase 9M-R Harness。

继续坚持：

    内部严格，外部简单
    规则从 gate 改为 signal
    L2 决定 riskLevel
    AI 只做人话解释与补充关注
    用户确认前不得联网
    用户只保留一次必要的发送前确认
    不把内部复杂度暴露给用户

本 hotfix 不得：

    增加前端步骤
    增加第二次确认
    暴露 provider 选择器
    暴露模型选择器
    修改 full-redacted payload
    修改风险规则
    修改法规依据
    修改 riskLevel 逻辑
    恢复 matched-findings gate
    修改 stash
    接入真实 DeepSeek 回归
    修改 .env.local

---

## 5. 推荐新增的环境变量

推荐新增：

    CONTRACT_REVIEW_AI_PROVIDER

允许值：

    mock
    deepseek

推荐安全行为：

    CONTRACT_REVIEW_AI_PROVIDER === "deepseek"
    → 明确启用 contractReviewDeepSeekProvider

    其他情况
    → 回退至 contractReviewMockProvider

包括：

    未配置
    空字符串
    mock
    不支持的值

均应安全回退至 mock。

理由：

    真实 DeepSeek 必须显式 opt-in。
    缺少配置不得默认联网。
    浏览器回归不得依赖修改 .env.local。
    后续可以使用进程级环境变量启动 mock-only dev server。
    后续正式启用真实 DeepSeek 时必须单独评审与配置。

未来 mock-only 启动形态：

    $env:CONTRACT_REVIEW_AI_PROVIDER = "mock"
    npm.cmd run dev -- --port 3210

未来真实 DeepSeek 启用形态：

    CONTRACT_REVIEW_AI_PROVIDER = deepseek

但真实启用不得在本 hotfix 中执行。

---

## 6. 推荐的最小实现方向

### 6.1 新增 contract-review mock provider

推荐新增：

    src/lib/ai/contract-review-mock-provider.ts

职责：

    提供 deterministic mock output
    不执行 fetch
    不读取 DEEPSEEK_API_KEY
    不调用 DeepSeek
    不访问外部网络
    支持 legacy input
    支持 full-redacted input
    返回 schema-compatible output
    保持中文用户可见内容
    保持法律边界提示
    保持 supplementalAttentionItems 无 riskLevel

### 6.2 修改 contract-review route

推荐修改：

    src/app/api/ai/contract-review-explanation/route.ts

职责：

    服务端读取 CONTRACT_REVIEW_AI_PROVIDER
    只有精确值 deepseek 才启用真实 DeepSeek
    其他情况安全回退 mock
    继续支持依赖注入
    继续支持 legacy payload
    继续支持 full-redacted payload
    不改变客户端请求结构
    不改变用户操作流程

### 6.3 补充 contract-check

推荐修改：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

检查：

    未配置 provider selector 时使用 mock
    selector = mock 时使用 mock
    selector = deepseek 时使用 DeepSeek provider
    不支持值时回退 mock
    mock 不执行 fetch
    full-redacted mock output schema-compatible
    ruleSignals = [] 时仍可返回输出
    supplementalAttentionItems 不带 riskLevel
    reasoning_content 不进入响应

### 6.4 可选独立 mock provider contract-check

可选新增：

    src/lib/ai/contract-review-mock-provider-contract-check.ts

用途：

    锁定 deterministic mock output
    锁定 legacy / full-redacted 双轨支持
    锁定不包含 reasoning_content
    锁定 AI 补充关注项不包含 riskLevel
    锁定 disclaimer 存在
    锁定中文输出

是否新增该文件：

    进入 implementation plan 后再决定。
    不在本 docs-only review 中直接扩大 scope。

---

## 7. 默认文件范围

下一阶段 implementation plan 应优先限制为：

    src/lib/ai/contract-review-mock-provider.ts

    src/app/api/ai/contract-review-explanation/route.ts

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

可选增加：

    src/lib/ai/contract-review-mock-provider-contract-check.ts

除非只读检查证明必要，否则不要修改：

    src/components/*
    src/content/zh-cn.ts
    src/lib/contract/*
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-ai-input.ts
    src/lib/ai/contract-review-full-redacted-ai-input.ts
    .env.local
    package.json
    package-lock.json

---

## 8. 对前端与用户体验的约束

前端不得增加：

    provider 设置
    mock 设置
    DeepSeek 设置
    模型设置
    调试按钮
    环境变量说明
    JSON 预览
    第二次隐私确认

用户继续只看到：

    粘贴合同
    点击开始辅助审查
    查看完整脱敏合同预览
    点击确认上传并开始审查
    查看统一结果

内部 mock-only 切换：

    仅属于服务端开发与测试能力
    不属于用户功能
    不暴露在 UI 中

---

## 9. 本 hotfix 明确不做

本 hotfix 不做：

    浏览器人工回归
    真实 DeepSeek 请求
    真实 DeepSeek smoke
    修改 .env.local
    修改 UI
    修改中文文案
    修改 full-redacted builder
    修改 payloadVersion
    修改 schema
    修改 L2 risk rules
    修改 legal basis
    修改脱敏 primitive
    OCR
    PDF
    合同照片
    文件上传
    Chrome 插件
    Supabase
    云端合同历史
    公开运营

---

## 10. 下一步

本 docs-only boundary review 完成后：

    先独立审阅 diff
    再运行 build
    再提交 docs-only checkpoint
    再 push
    再真实远端校验
    再进入 Phase 9M-R6-1-hotfix-1 implementation plan

当前不要直接进入 implementation。

当前不要启动 dev server。

当前不要开始浏览器回归。
