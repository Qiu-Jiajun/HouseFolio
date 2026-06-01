# Phase 9M-R6-1-hotfix-1｜Contract-review mock runtime implementation plan

## 0. 文档用途

本文档用于锁定合同风险提示助手 runtime mock-only path 的最小实现方案。

本阶段仍然是 docs-only implementation plan。

当前不得直接修改 src。

当前不得启动 dev server。

当前不得开始浏览器回归。

当前不得运行真实 DeepSeek 请求。

当前唯一目标是：

    在不改变用户流程、不改变 full-redacted payload、
    不改变 L2 风险规则、不修改 .env.local 的前提下，
    设计一个默认安全回退到 mock 的合同审查 runtime provider 选择路径。

---

## 1. 当前稳定点

当前远端稳定点：

    2ac3995 docs: review contract review mock runtime path

完整 hash：

    2ac3995f1e42dc60981d37cb4b2ae3af7025510f

当前已经确认：

    HEAD = main = origin/main = actual remote refs/heads/main
    git status clean
    npm.cmd run build passed
    src unchanged
    .env.local unchanged
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

## 2. 已经确认的 blocker

当前 contract-review route 默认依赖：

    contractReviewDeepSeekProvider

当前不存在：

    CONTRACT_REVIEW_AI_PROVIDER

或其他同等用途的合同审查 runtime provider selector。

当前已存在的：

    LBS_PROVIDER

仅用于：

    amap / mock LBS provider selection

当前已存在的：

    AI_COMPARE_PROVIDER

仅用于：

    compare explanation provider selection

它们都不得被复用为合同审查 provider selector。

route-contract-check.ts 中发现的：

    ContractReviewProviderMockState
    withMockedContractReviewProvider()

属于：

    contract-check dependency shadow
    测试替身
    route contract regression

不属于：

    dev server runtime mock provider
    浏览器回归 mock-only path
    可通过进程级环境变量选择的 provider registry

---

## 3. Harness 不变量

本 hotfix 不得改变 Phase 9M-R Harness。

继续坚持：

    内部严格，外部简单
    规则从 gate 改为 signal
    L2 决定 riskLevel
    AI 只做人话解释与补充关注
    用户确认前不得联网
    用户只保留一次必要的发送前确认
    不把内部复杂度暴露给用户

不得：

    增加前端步骤
    增加第二次确认
    恢复 matched-findings gate
    修改 full-redacted payload
    修改 payloadVersion
    修改 L2 风险规则
    修改 riskLevel 逻辑
    修改法规依据
    修改脱敏 primitive
    修改 UI
    修改中文文案
    修改 .env.local
    修改 package.json
    修改 package-lock.json
    改变 stash

---

## 4. 新增环境变量

新增服务端环境变量：

    CONTRACT_REVIEW_AI_PROVIDER

允许值：

    mock
    deepseek

安全默认行为：

    CONTRACT_REVIEW_AI_PROVIDER === "deepseek"
    → contractReviewDeepSeekProvider

    其他任何情况
    → contractReviewMockProvider

其他任何情况包括：

    未配置
    空字符串
    mock
    不支持值
    大小写不匹配
    多余空格
    拼写错误

推荐保持简单，不额外做 normalize：

    process.env.CONTRACT_REVIEW_AI_PROVIDER === "deepseek"
      ? contractReviewDeepSeekProvider
      : contractReviewMockProvider

理由：

    真实联网必须显式 opt-in。
    错误配置不得意外联网。
    mock-only 浏览器回归不需要修改 .env.local。
    前端无需新增 provider 设置。
    用户无需理解 provider。
    开发环境可以通过进程级环境变量临时指定 mock。
    后续正式 DeepSeek smoke 必须单独审批。

---

## 5. 批准的最小文件范围

下一阶段实现默认只允许修改三个文件：

    src/lib/ai/contract-review-mock-provider.ts

    src/app/api/ai/contract-review-explanation/route.ts

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

说明：

    contract-review-mock-provider.ts
    → 新增文件

    route.ts
    → 最小 provider selection 适配

    route-contract-check.ts
    → 扩展 selector 与 mock-only 回归检查

当前默认不批准新增：

    src/lib/ai/contract-review-mock-provider-contract-check.ts

原因：

    route-contract-check.ts 已经具备 dependency shadow、
    legacy payload、full-redacted payload 与 route 级回归能力。
    第一轮先避免扩大文件范围。

仅当后续实现中发现 route-contract-check.ts 无法合理锁定
mock provider 的独立行为，才允许回到 docs-only 评审，
单独讨论新增 mock-provider contract-check。

---

## 6. 明确禁止修改的文件

除非后续只读签名检查证明必要，不得修改：

    src/components/*
    src/content/zh-cn.ts
    src/lib/contract/*
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-deepseek-provider-contract-check.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/lib/ai/contract-review-ai-input.ts
    src/lib/ai/contract-review-full-redacted-ai-input.ts
    src/lib/ai/contract-review-full-redacted-ai-input-contract-check.ts
    .env.local
    package.json
    package-lock.json

不得新增：

    UI provider switch
    debug route
    test-only public endpoint
    browser-visible mock toggle
    secret logging
    provider response logging
    contract body logging

---

## 7. 新增 contract-review mock provider

新增文件：

    src/lib/ai/contract-review-mock-provider.ts

### 7.1 目标

提供 deterministic、无外部网络、schema-compatible 的合同审查 mock provider。

### 7.2 必须满足

mock provider 必须：

    不执行 fetch
    不读取 DEEPSEEK_API_KEY
    不读取 CONTRACT_REVIEW_AI_MODEL
    不访问外部 URL
    不写日志
    不保存合同内容
    不展示 reasoning_content
    不产生 reasoning_content
    不修改输入
    不改变 riskLevel
    不新建带 riskLevel 的 supplemental attention item
    不伪造法规依据
    保持中文用户可见输出
    保持法律边界 disclaimer

### 7.3 必须支持双轨输入

现有 route 支持：

    legacy payload
    full-redacted payload

mock provider 必须与当前 route 的 provider interface 对齐，支持：

    generateContractReviewExplanation()

    generateFullRedactedContractReviewExplanation()

实现前必须先只读确认真实签名。

不得凭记忆猜测：

    input type 名称
    output type 名称
    provider type 名称
    方法参数
    方法返回类型
    required 字段
    supplementalAttentionItems schema

### 7.4 legacy mock output

legacy output 应：

    基于传入 findings 生成稳定、可预测的中文解释
    维持已有 L2 riskLevel
    保持法律边界 disclaimer
    不引入真实法律结论
    不调用外部服务

### 7.5 full-redacted mock output

full-redacted output 应：

    基于传入 ruleSignals 生成稳定、可预测的中文规则提示
    支持 ruleSignals = []
    支持完整脱敏条款输入
    输出 summaryZh
    输出 disclaimerZh
    输出 ruleSignalExplanations
    输出 supplementalAttentionItems

规则提示必须：

    与 L2 riskId 对齐
    与 L2 riskLevel 对齐
    不修改 L2 风险等级

supplementalAttentionItems 必须：

    独立展示
    不带 riskLevel
    不伪装成规则命中
    使用谨慎表达
    强调进一步人工核实
    不输出违法、无效或必然结论

### 7.6 deterministic 原则

mock output 必须：

    相同输入
    → 相同输出

不得：

    使用随机数
    使用当前时间
    使用外部服务
    使用模型调用
    使用网络状态
    使用环境密钥
    使用不稳定排序

---

## 8. route.ts 最小适配

修改文件：

    src/app/api/ai/contract-review-explanation/route.ts

### 8.1 新增 import

新增：

    contractReviewMockProvider

### 8.2 新增 selector

新增服务端 selector，例如：

    function getServerConfiguredContractReviewProvider():
      ContractReviewExplanationRouteProvider {
      return process.env.CONTRACT_REVIEW_AI_PROVIDER === "deepseek"
        ? contractReviewDeepSeekProvider
        : contractReviewMockProvider;
    }

实际函数名、位置和类型以源码只读签名检查为准。

### 8.3 保持依赖注入

当前 route 已允许通过参数注入 provider。

必须继续保留：

    显式传入 provider
    → 使用注入 provider

    未显式传入 provider
    → 使用 runtime selector

这样：

    route-contract-check 仍可使用依赖 shadow
    浏览器 dev server 可使用进程级环境变量
    UI 无需感知 provider

### 8.4 不改变 route 其他职责

不得改变：

    payloadVersion 双轨 dispatch
    legacy payload validation
    full-redacted payload validation
    request body limits
    no-store
    safe error mapping
    reasoning_content 隔离
    服务端防御性校验
    ruleSignals = [] 支持
    supplementalAttentionItems schema
    客户端请求格式
    HTTP endpoint 路径

---

## 9. route-contract-check.ts 扩展

修改文件：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

### 9.1 继续保留既有检查

不得删除现有：

    legacy payload checks
    full-redacted payload checks
    route additive dispatch checks
    error mapping checks
    dependency shadow checks
    no-store checks
    invalid payload checks
    ruleSignals = [] checks

### 9.2 新增 selector 检查

增加：

    未配置 CONTRACT_REVIEW_AI_PROVIDER
    → runtime selector 使用 mock

    CONTRACT_REVIEW_AI_PROVIDER = mock
    → runtime selector 使用 mock

    CONTRACT_REVIEW_AI_PROVIDER = deepseek
    → runtime selector 使用 DeepSeek

    CONTRACT_REVIEW_AI_PROVIDER = unsupported
    → runtime selector 使用 mock

    CONTRACT_REVIEW_AI_PROVIDER = DEEPSEEK
    → runtime selector 使用 mock

    CONTRACT_REVIEW_AI_PROVIDER = " deepseek "
    → runtime selector 使用 mock

目的：

    锁定显式 opt-in
    防止错误配置意外联网

### 9.3 环境变量恢复

contract-check 修改环境变量时必须：

    保存原始值
    try
    执行断言
    finally
    恢复原始值

不得污染：

    后续 checks
    build
    dev server
    用户本机环境

### 9.4 mock-only 检查

增加：

    mock provider legacy output schema-compatible
    mock provider full-redacted output schema-compatible
    ruleSignals = [] 时 full-redacted mock 仍返回稳定输出
    mock 不执行 fetch
    mock 输出不包含 reasoning_content
    mock 输出不包含 secret
    supplementalAttentionItems 不包含 riskLevel
    riskLevel 仅来自 ruleSignals

### 9.5 DeepSeek 分支检查边界

selector = deepseek 时：

    只验证 provider selection
    不执行真实 DeepSeek fetch
    不读取真实 secret
    不运行真实 API 请求

可以使用：

    dependency shadow
    provider identity assertion
    fake provider
    mocked transport

不得：

    调用真实 https://api.deepseek.com
    消耗真实额度
    把真实合同内容发到外部网络

---

## 10. 后续实现顺序

Phase 9M-R6-1-hotfix-2 实现前先做：

    只读签名检查
    确认 provider interface
    确认 legacy input / output 类型
    确认 full-redacted input / output 类型
    确认 route 参数签名
    确认 route-contract-check 现有 helper
    确认 request dispatch 结构

只读检查完成后再写代码。

推荐实现顺序：

    1. 新增 contract-review-mock-provider.ts
    2. 修改 route.ts runtime selector
    3. 修改 route-contract-check.ts
    4. UTF-8 / no BOM / no replacement char 检查
    5. git diff --check
    6. npm.cmd run build
    7. 独立 diff 审阅
    8. 精确 stage
    9. commit
    10. push
    11. fetch
    12. git ls-remote
    13. clean status
    14. stash 保留检查
    15. 重新进入 mock-only dev launch preflight

---

## 11. 后续浏览器回归启动形态

hotfix 实现完成并远端收口后，才允许评审以下启动命令：

    Set-Location "E:\Projects\housefolio"

    $env:CONTRACT_REVIEW_AI_PROVIDER = "mock"

    npm.cmd run dev -- --port 3210

启动前仍需确认：

    当前端口可用
    HEAD = main = origin/main = actual remote
    git status clean
    stash 完整
    shell integration = false
    .env.local 未修改
    src clean
    进程级 env 生效
    不运行真实 DeepSeek 请求

当前不得执行该启动命令。

---

## 12. 验收标准

hotfix 实现只有同时满足以下条件才可收口：

    新增独立 contract-review mock provider
    新增 CONTRACT_REVIEW_AI_PROVIDER selector
    未配置时安全回退 mock
    mock 时使用 mock
    unsupported 时安全回退 mock
    只有精确 deepseek 时使用 DeepSeek
    mock 不执行 fetch
    mock 不读取 DEEPSEEK_API_KEY
    mock 不读取 CONTRACT_REVIEW_AI_MODEL
    legacy payload 继续通过
    full-redacted payload 继续通过
    ruleSignals = [] 继续通过
    L2 风险等级不被修改
    supplementalAttentionItems 不包含 riskLevel
    reasoning_content 不进入输出
    route contract-check 通过
    npm.cmd run build 通过
    UI 未修改
    .env.local 未修改
    stash 原样保留
    working tree clean
    真实远端校验通过

---

## 13. 本阶段明确不做

本阶段不做：

    src 实现
    dev server 启动
    浏览器回归
    真实 DeepSeek smoke
    修改 .env.local
    UI 修改
    中文文案修改
    payload 修改
    schema 修改
    L2 规则修改
    法规依据修改
    脱敏 primitive 修改
    OCR
    PDF
    合同照片
    文件上传
    Chrome 插件
    Supabase
    云端合同历史
    公开运营

---

## 14. 下一步

本 docs-only implementation plan 写入后：

    独立审阅完整文档
    验证 UTF-8 无 BOM
    验证末尾 LF
    运行 git diff --check
    运行 npm.cmd run build
    精确 stage 单个 docs 文件
    commit
    push
    fetch
    git ls-remote
    clean status
    stash 保留检查

然后进入：

    Phase 9M-R6-1-hotfix-2：
    implementation preflight and read-only signature inspection

当前不得直接修改 src。
