# HouseFolio Phase 9M-R4B｜合同 AI route switch 实现计划

## 0. 文档用途

本文档用于锁定 Phase 9M-R4C 的有限自治实现范围。

本阶段只规划：

    payloadVersion additive dispatch
    双单位请求体上限
    POST route 双 provider 分派
    route-contract-check 回归扩展

本阶段不修改源码。

本阶段不恢复 UI stash。

本阶段不运行真实 DeepSeek 请求。

---

## 1. 当前稳定点

当前远端稳定点：

    7ebae53 docs: review contract route switch boundary

完整 hash：

    7ebae534434d378edb2e02c5a78247068f8393aa

当前已经确认：

    HEAD = main = origin/main = origin/HEAD
    git ls-remote 精确匹配
    npm.cmd run build passed
    git status clean
    VS Code integrated terminal 正常
    terminal.integrated.shellIntegration.enabled = false
    stash@{0} 完整保留

受保护 stash：

    stash@{0}: On main: wip: phase 9m-2 matched-findings confirmation ui

精确包含：

    src/components/contract-review-ai-confirmation-panel.tsx
    src/components/contract-review-ai-explanation-panel.tsx
    src/components/contract-review-panel.tsx
    src/content/zh-cn.ts

在 Phase 9M-R5 前：

    不恢复
    不 pop
    不 drop
    不覆盖
    不修改

---

## 2. 当前 route 行为

当前：

    src/app/api/ai/contract-review-explanation/route.ts

只执行 legacy 链路：

    readJsonBody(request)
    → parseAndSanitizeContractReviewAiInput(body)
    → generateContractReviewExplanation(input)
    → ContractReviewExplanationOutput
    → jsonNoStore(output)

当前尚未接入：

    parseAndSanitizeContractReviewFullRedactedAiInput()
    generateFullRedactedContractReviewExplanation()
    ContractReviewFullRedactedExplanationOutput

---

## 3. route switch 采用 additive compatibility bridge

Phase 9M-R4C 不删除 legacy 行为。

必须继续支持：

    legacy payload
    legacy sanitizer
    legacy provider method
    legacy output schema

同时新增：

    full-redacted payload
    full-redacted sanitizer
    full-redacted provider method
    v2 output schema

采用：

    payloadVersion additive dispatch

不得采用：

    破坏式替换
    猜测 payload 类型
    try legacy catch full-redacted
    try full-redacted catch legacy
    根据字段数量猜测模式

---

## 4. payloadVersion request dispatch

建议在 route.ts 中新增：

    export type ContractReviewExplanationRouteRequest =
      | {
          readonly mode: "matched-findings";
          readonly input: ContractReviewAiInput;
        }
      | {
          readonly mode: "full-redacted-contract";
          readonly input: ContractReviewFullRedactedAiInput;
        };

新增纯函数：

    export function parseAndSanitizeContractReviewExplanationRequest(
      value: unknown
    ): ContractReviewExplanationRouteRequest

职责：

    value 必须是 object
    value 不得为 null
    value 不得为 array
    value.payloadVersion 必须是 string

    payloadVersion =
      CONTRACT_REVIEW_AI_INPUT_VERSION
    → {
        mode: "matched-findings",
        input:
          parseAndSanitizeContractReviewAiInput(value),
      }

    payloadVersion =
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION
    → {
        mode: "full-redacted-contract",
        input:
          parseAndSanitizeContractReviewFullRedactedAiInput(value),
      }

    unknown payloadVersion
    → throw ContractReviewAiInputRouteGuardError
    → code = "invalid_request"

不要暴露：

    原始 payload
    stack trace
    内部错误细节

---

## 5. POST route provider dispatch

POST route 在 readJsonBody() 后执行：

    const requestInput =
      parseAndSanitizeContractReviewExplanationRequest(body);

然后执行：

    const output =
      requestInput.mode === "full-redacted-contract"
        ? await contractReviewDeepSeekProvider
            .generateFullRedactedContractReviewExplanation(
              requestInput.input,
            )
        : await contractReviewDeepSeekProvider
            .generateContractReviewExplanation(
              requestInput.input,
            );

最后：

    return jsonNoStore(output);

成功响应类型扩展为：

    ContractReviewExplanationOutput
    | ContractReviewFullRedactedExplanationOutput

错误响应继续为：

    ContractReviewExplanationApiErrorResponse

---

## 6. 请求体容量测量记录

Phase 9M-R4B-2A 已完成只读测量。

仓库外报告：

    D:\Download\housefolio-phase-9m-r4b-payload-capacity-report.txt

报告签名：

    Bytes:
      2806

    SHA256:
      B8688ACF6D1798D7188BA46F9FD5DE63A6055C168649B32BB1BA81D94377D18E

当前 route 常量：

    MAX_REQUEST_BODY_CHARS = 100_000

当前存在单位混用：

    Content-Length
      → UTF-8 bytes

    request.text().length
      → JavaScript string chars

不能继续使用同一个常量。

---

## 7. 容量测量结果

### 7.1 最小 envelope

    JSON chars:
      210

    UTF-8 bytes:
      212

### 7.2 最大正文，无 ruleSignals

    JSON chars:
      38089

    UTF-8 bytes:
      98089

### 7.3 最大正文，60 个 ruleSignals，无 legalBases

    JSON chars:
      80489

    UTF-8 bytes:
      207809

结论：

    request.text().length 仍低于 100000

但：

    Content-Length byte precheck 已超过 100000

这证明：

    BYTE_CHAR_UNIT_MISMATCH_OBSERVED = true

### 7.4 结构性下界最大 envelope

    JSON chars:
      203129

    UTF-8 bytes:
      503969

### 7.5 保守规划 envelope

    JSON chars:
      274529

    UTF-8 bytes:
      651329

结论：

    CURRENT_LIMIT_INSUFFICIENT = true

---

## 8. 双单位有限上限

Phase 9M-R4C 应将单一常量：

    MAX_REQUEST_BODY_CHARS = 100_000

替换为：

    const MAX_REQUEST_BODY_CHARS = 350_000;

    const MAX_REQUEST_BODY_BYTES = 900_000;

依据：

    保守 chars envelope:
      274529

    chars 增加约 25% margin:
      343161.25

    向上取整:
      350000

    保守 UTF-8 bytes envelope:
      651329

    bytes 增加约 25% margin:
      814161.25

    向上取整:
      900000

必须保持：

    有限上限
    Content-Length 预检查
    request.text() 后检查
    超限 request_too_large
    不静默裁剪

---

## 9. readJsonBody() 调整

当前 Content-Length 检查：

    contentLength > MAX_REQUEST_BODY_CHARS

Phase 9M-R4C 修改为：

    contentLength > MAX_REQUEST_BODY_BYTES

当前 request.text() 后检查：

    text.length > MAX_REQUEST_BODY_CHARS

继续保留，但上限更新为：

    MAX_REQUEST_BODY_CHARS = 350_000

不得删除：

    text.trim().length === 0
    JSON.parse(text)
    unsupported_media_type
    invalid_request
    request_too_large

不得仅依赖：

    Content-Length

原因：

    客户端可能不发送 Content-Length。
    Content-Length 也可能不可用或异常。

---

## 10. route-contract-check 扩展

Phase 9M-R4C 默认修改：

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

必须保留全部现有 regression。

### 10.1 新增 request dispatch regression

为：

    parseAndSanitizeContractReviewExplanationRequest()

新增回归：

    legacy payloadVersion
      → mode = "matched-findings"

    full-redacted payloadVersion
      → mode = "full-redacted-contract"

    unknown payloadVersion
      → invalid_request

    missing payloadVersion
      → invalid_request

    array
      → invalid_request

    null
      → invalid_request

    malformed legacy payload
      → invalid_request

    malformed full-redacted payload
      → invalid_request

### 10.2 新增双单位 limit regression

必须覆盖：

    text length > 350000
      → request_too_large

    Content-Length > 900000
      → request_too_large

    中文 UTF-8 bytes > 100000
    但：
      chars < 350000
      bytes < 900000
    → 不应被旧 100000 byte gate 误拒绝

### 10.3 route-level POST success 策略

禁止真实 DeepSeek 请求。

优先使用最小测试 seam。

推荐新增：

    type ContractReviewExplanationRouteProvider =
      Pick<
        ContractReviewDeepSeekProvider,
        | "generateContractReviewExplanation"
        | "generateFullRedactedContractReviewExplanation"
      >;

新增内部函数：

    export async function handleContractReviewExplanationPost(
      request: Request,
      provider:
        ContractReviewExplanationRouteProvider =
          contractReviewDeepSeekProvider,
    )

公开：

    export async function POST(request: Request) {
      return handleContractReviewExplanationPost(request);
    }

这样 route-contract-check 可传入 mock provider。

不得新增复杂依赖注入框架。

不得改 provider singleton。

### 10.4 POST success mock regression

使用 mock provider 验证：

    legacy payload
      → 只调用 generateContractReviewExplanation()

    full-redacted payload
      → 只调用 generateFullRedactedContractReviewExplanation()

    legacy success
      → Cache-Control: no-store

    full-redacted success
      → Cache-Control: no-store

    success body
      → 与 mock provider 输出一致

不得调用真实 DeepSeek。

---

## 11. error model 保持不变

继续复用：

    ContractReviewApiRequestError
    ContractReviewAiInputRouteGuardError
    ContractReviewDeepSeekProviderError

API error code 保持：

    unsupported_media_type
    request_too_large
    invalid_request
    missing_configuration
    invalid_configuration
    rate_limited
    request_timeout
    request_failed
    invalid_response
    unknown_failure

unknown payloadVersion：

    HTTP 400
    code = "invalid_request"

不得向用户暴露：

    provider 原始错误
    stack trace
    reasoning_content
    原始请求体
    Prompt
    API key

---

## 12. Cache-Control 保持 no-store

所有响应继续通过：

    jsonNoStore()

必须覆盖：

    legacy success
    full-redacted success
    request error
    provider error
    unknown failure

必须继续返回：

    Cache-Control: no-store

---

## 13. Phase 9M-R4C 默认允许修改范围

只允许修改：

    src/app/api/ai/contract-review-explanation/route.ts

    src/app/api/ai/contract-review-explanation/route-contract-check.ts

不得修改其他文件。

不得新增文件。

---

## 14. 默认禁止修改范围

禁止修改：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/lib/ai/contract-review-explanation-prompt.ts
    src/types/ai-contract-review-explanation.ts
    src/components/**
    src/content/zh-cn.ts
    .env.local
    .env.example
    package.json
    package-lock.json
    src/lib/local-store/**
    src/lib/privacy/**
    src/lib/storage/**
    src/lib/db/**
    src/lib/lbs/**

如果必须扩大 scope：

    停止
    汇报
    不自行修改

---

## 15. 默认禁止操作

禁止：

    恢复 stash
    stash apply
    stash pop
    stash drop
    stash clear
    修改 UI
    修改中文文案
    运行真实 DeepSeek 请求
    访问真实 DeepSeek endpoint
    安装依赖
    新增 OCR
    新增 PDF
    新增合同照片
    新增 RAG
    新增 persistence
    新增 localStorage key
    新增 IndexedDB key
    使用 git add .
    使用 git add -A
    使用会关闭 VS Code integrated terminal 的顶层 exit 1
    恢复 shell integration

---

## 16. 推荐实施顺序

### Step 1：状态确认

执行：

    git rev-parse HEAD
    git status
    git stash list

必须确认：

    HEAD =
      7ebae534434d378edb2e02c5a78247068f8393aa

    git status clean

    stash@{0}
      完整保留

### Step 2：只读审计批准文件

读取：

    src/app/api/ai/contract-review-explanation/route.ts
    src/app/api/ai/contract-review-explanation/route-contract-check.ts

只读参考：

    src/lib/contract/ai-safe-input.ts
    src/lib/contract/ai-safe-input-route-guard.ts
    src/lib/ai/contract-review-deepseek-provider.ts
    src/types/ai-contract-review-explanation.ts

### Step 3：修改 route.ts

完成：

    双单位有限上限
    request dispatch helper
    provider test seam
    POST wrapper
    success union type
    保留错误模型
    保留 no-store

### Step 4：扩展 route-contract-check.ts

完成：

    request dispatch regression
    双单位容量 regression
    mock provider dispatch regression
    legacy regression 保留
    full-redacted sanitizer regression 保留

### Step 5：验证

执行：

    npm.cmd run build
    git diff --check
    git diff --stat
    git diff --name-only
    git status
    git stash list

使用 Node 检查：

    UTF-8 无 BOM
    无 replacement char
    route.ts 只新增预期 anchors
    route-contract-check.ts 只新增预期 regressions

### Step 6：汇报，不提交

不得：

    git add
    git commit
    git push
    恢复 stash

---

## 17. 验收标准

必须满足：

    只修改 2 个批准文件
    不新增文件
    route.ts 按 payloadVersion additive dispatch
    legacy payload 继续支持
    full-redacted payload 新增支持
    unknown payloadVersion → invalid_request
    missing payloadVersion → invalid_request
    MAX_REQUEST_BODY_CHARS = 350000
    MAX_REQUEST_BODY_BYTES = 900000
    Content-Length 使用 bytes 上限
    request.text().length 使用 chars 上限
    双重校验保留
    no-store 保留
    错误模型保留
    mock provider success regression 通过
    legacy provider 只在 legacy 请求中调用
    full-redacted provider 只在 full-redacted 请求中调用
    无真实 DeepSeek 请求
    npm.cmd run build passed
    git diff --check clean
    stash@{0} 完整保留

---

## 18. 产品原则

内部严格。

外部简单。

用户无需理解：

    payloadVersion
    chars
    bytes
    dispatch union
    provider test seam
    body limit

用户只需要：

    粘贴合同
    查看脱敏预览
    主动确认一次
    获得清晰的人话提示
    查看签约前问题清单

---

## 19. 后续阶段

### Phase 9M-R4C

负责：

    route.ts additive dispatch
    双单位有限上限
    route-contract-check 扩展
    mock provider success regression
    不恢复 stash
    不运行真实 DeepSeek

### Phase 9M-R5

负责：

    保留 stash 备份
    恢复 UI WIP
    嫁接 full-redacted builder
    v2 output 展示
    supplementalAttentionItems 展示
    文本变化后旧结果失效
    一次主动确认
    清除本次结果
    重新生成再次确认
