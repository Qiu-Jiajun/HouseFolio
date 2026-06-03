# Phase 10B-1-2B-0｜正式 OCR provider 最小闭包实现计划评审

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-0 的 docs-only 实现计划评审文档。

它用于：

    将 Phase 10B-1-2A-5 已锁定的正式实现闸门
    转换为可逐阶段执行、可独立验证、可随时停止的最小闭包计划

    明确正式 OCR provider 最小闭包的目标
    明确 G1–G8 的处理顺序
    明确每一个后续子阶段允许修改的文件
    明确每一个后续子阶段禁止触及的范围
    明确每一个后续子阶段的验证标准
    防止一次性安装、复制、编码、接 UI 和改配置

本文档不是：

    正式实现代码
    Codex Task Packet
    依赖安装批准
    静态资产复制批准
    模型文件复制批准
    src/lib/ocr 创建批准
    Worker 实现批准
    next.config.ts 修改批准
    CSP / COOP / COEP 配置批准
    OCR 页面开发批准
    多图片 UI 开发批准

本文档完成后，下一步只能进入：

    Phase 10B-1-2B-1
    → 第三方 notices、依赖清单与静态资产 manifest 准备
    → docs / manifest only

不得直接进入依赖安装。

---

# 1. 当前准确停点

## 1.1 当前远端稳定点

当前已经完成 A-5 docs-only 收口、commit、push、fetch 与真实远端校验。

稳定点：

    HEAD
    main
    origin/main
    remote refs/heads/main
    =
    c6f8c5b86aeec5e484819c264ba27b861a5fa0f6

提交：

    c6f8c5b docs: close formal ocr boundary review

## 1.2 Protected stash

必须继续原样保留：

    stash@{0}
    → 8a27c545465dc185f5506311392ab57dc6e67f84

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

禁止：

    git stash apply
    git stash pop
    git stash drop
    git stash clear
    改变 stash 顺序

## 1.3 `.env.local`

锁定 SHA-256：

    d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7

规则继续保持：

    不打印内容
    不读取 secret 值
    不主动修改
    不提交
    只允许核验存在性、形状与 SHA-256

## 1.4 Scratch workspace

必须保留：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

scratch 是：

    技术验证证据现场

scratch 不是：

    正式代码来源
    正式 public/ 目录来源
    可整体复制的生产闭包
    可自由清理的临时目录

禁止：

    删除 scratch
    清理 scratch
    覆盖 runner
    覆盖 logs
    覆盖 evidence
    整体复制 dist
    移动模型
    删除 ORT 资产
    未经阶段批准重新 build
    未经阶段批准重新运行 A / B / C / D runner

---

# 2. 上游结论继承

## 2.1 Phase 10B-1-2A 已关闭

上游正式结论：

    PHASE_10B_1_2A_RESULT
    → CLOSED_WITH_CONDITIONS

    FORMAL_OCR_PRE_IMPLEMENTATION_BOUNDARY_REVIEW
    → COMPLETE

但：

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED

## 2.2 browser-local smoke 的准确含义

已证明：

    BROWSER_LOCAL_PADDLEOCR_JS_FEASIBILITY
    → CONDITIONALLY_PROVEN

    THREADED_WASM_CAPABILITY
    → OBSERVED_WITH_PASS

只证明：

    单张
    虚构
    清晰
    中文合同测试图片
    → 可以在受控 scratch 环境中完成 browser-local OCR

尚未证明：

    真实手机拍照合同稳定识别
    连续 10–15 页稳定处理
    正式 HouseFolio Next.js 页面可用
    正式 Worker 打包可用
    正式 public/ 静态资产闭包可用
    低端设备可用
    移动端可用
    阴影、旋转、反光、模糊、透视变形可稳定处理
    threaded 可作为首版依赖

因此，B 阶段仍然必须坚持：

    先建立 provider 最小闭包
    再进入多图片 workflow
    再做真实图片回归
    最后才单独评审 threaded 增强

---

# 3. B 阶段的唯一目标

## 3.1 B 阶段做什么

Phase 10B-1-2B 只负责：

    在正式 HouseFolio 仓库中
    建立 browser-local OCR provider 的最小技术闭包

最小闭包包括：

    正式 runtime 依赖
    第三方 notices
    静态资产 manifest
    最小本地静态资产
    provider contract
    PaddleOCR.js adapter
    OCR service façade
    provider-level contract-check

## 3.2 B 阶段不做什么

Phase 10B-1-2B 不负责：

    多图片 queue
    缩略图 UI
    拖拽排序
    上传前隐私提醒 UI
    OCR 合并文本校对 UI
    失败页重试 UI
    追加 / 覆盖 / 取消
    contractText 注入
    Phase 9 页面接入
    真实手机拍照回归
    连续 10–15 页回归
    移动端适配
    PDF
    HEIC
    云 OCR
    threaded 默认启用
    全站 headers

这些内容分别属于：

    Phase 10B-1-2C
    → workflow 与 Phase 9 接入

    Phase 10B-1-2D
    → 真实图片与 10–15 页回归

    Phase 10B-1-2E
    → threaded 增强能力独立评审

---

# 4. B-0 的决策原则

B-0 不追求一次性决定全部实现细节。

B-0 的任务是：

    把已知结论固定下来
    把尚未验证的技术问题显式标记为 gate
    把每一个风险压缩到最小子阶段

B-0 不允许：

    因为 smoke 通过就跳过正式验证
    因为 scratch 能运行就整体搬运 scratch
    因为未来可能需要 threaded 就提前改 headers
    因为未来需要多图片就提前做 UI
    因为 Worker 打包尚未明确就凭经验写死路径
    因为静态资产候选已列出就默认复制全部文件

---

# 5. G1：正式依赖树范围

## 5.1 scratch runtime 已知依赖

| 依赖 | scratch 版本 | 角色 |
|---|---:|---|
| `@paddleocr/paddleocr-js` | `0.3.2` | 浏览器端 OCR orchestration |
| `onnxruntime-web` | `1.24.3` | 浏览器端 ONNX 推理 |
| `@techstark/opencv-js` | `4.10.0-release.1` | 图像处理 |
| `vite` | `8.0.16` | scratch build 工具 |
| `playwright-core` | `1.60.0` | scratch smoke runner |

## 5.2 正式依赖候选

正式 HouseFolio runtime 的候选最小集合：

    @paddleocr/paddleocr-js
    onnxruntime-web
    @techstark/opencv-js

版本候选：

    @paddleocr/paddleocr-js
    → 0.3.2

    onnxruntime-web
    → 1.24.3

    @techstark/opencv-js
    → 4.10.0-release.1

注意：

    以上是候选集合
    不是当前安装批准

B-1 必须先确认：

    1. 哪些包必须作为 HouseFolio 的直接依赖声明；
    2. 哪些包已经由 @paddleocr/paddleocr-js 传递依赖带入；
    3. 是否必须显式锁定 onnxruntime-web 版本；
    4. 是否必须显式锁定 @techstark/opencv-js 版本；
    5. package metadata 中是否存在运行时远程资源；
    6. LICENSE 与 notices 如何记录；
    7. package-lock.json 预计会引入哪些新增包；
    8. 是否存在不必要的 dev dependency。

## 5.3 明确禁止进入正式依赖树

默认禁止：

    vite
    playwright-core

原因：

    vite
    → 仅用于 scratch build
    → HouseFolio 正式项目已有 Next.js 构建链路

    playwright-core
    → 仅用于 scratch smoke runner
    → 不属于正式应用 runtime 依赖

如未来确实需要正式测试工具：

    单独评审
    单独确定 devDependency
    不得在 B-2 顺手加入

## 5.4 G1 当前状态

    G1
    → PROVISIONALLY_DEFINED
    → FINAL_APPROVAL_DEFERRED_TO_B-1

---

# 6. G2：正式静态资产复制范围

## 6.1 正式 public/ 候选目录

候选目录：

    public/
    └── ocr/
        └── paddleocr-js/
            └── 0.3.2/
                ├── models/
                └── ort/

## 6.2 当前四个候选资产

候选：

    public/ocr/paddleocr-js/0.3.2/models/
    PP-OCRv5_mobile_det_onnx.tar

    public/ocr/paddleocr-js/0.3.2/models/
    PP-OCRv5_mobile_rec_onnx.tar

    public/ocr/paddleocr-js/0.3.2/ort/
    ort-wasm-simd-threaded.jsep.mjs

    public/ocr/paddleocr-js/0.3.2/ort/
    ort-wasm-simd-threaded.jsep.wasm

注意：

    以上四个文件是 A-5 锁定的最小候选
    不是当前复制批准

## 6.3 B-1 必须再次确认

B-1 必须通过本地 evidence、package 源码与静态资产审计确认：

    1. single-thread baseline 是否确实只需要该候选四文件；
    2. 文件名带 threaded 是否仍可用于 numThreads = 1 的正式 baseline；
    3. 是否存在 single-thread baseline 额外必需的 ORT 资产；
    4. 是否存在 jsep 相关额外资产；
    5. det / rec 模型 tarball 是否为正式必需；
    6. 是否存在字典、配置或额外模型文件；
    7. 所有必需资产是否可以本地闭包；
    8. 是否存在运行时 CDN fallback；
    9. 是否存在配置缺失时的远程 fallback；
    10. 资产总大小是否可接受。

如果发现额外必需资产：

    不要静默复制
    不要扩大复制范围
    停止 B-1
    回到 docs-only 修订 manifest

## 6.4 禁止整体复制

禁止：

    整体复制 scratch dist
    整体复制 node_modules
    整体复制 assets 目录
    整体复制 ORT 目录
    整体复制 Vite 哈希 Worker bundle
    复制没有明确用途的文件

## 6.5 G2 当前状态

    G2
    → CANDIDATE_CLOSURE_ONLY
    → FINAL_APPROVAL_DEFERRED_TO_B-1

---

# 7. G3：模型再分发依据与 attribution

## 7.1 当前状态

模型进入正式 `public/` 前，必须明确：

    模型来源
    模型名称
    模型版本
    下载来源
    许可证
    再分发依据
    归属说明
    本项目是否允许公开部署该模型文件
    是否需要额外 notice

## 7.2 模型文件

候选模型：

    PP-OCRv5_mobile_det_onnx.tar
    PP-OCRv5_mobile_rec_onnx.tar

## 7.3 B-1 需要形成的记录

| 字段 | 说明 |
|---|---|
| `assetType` | model |
| `fileName` | 文件名 |
| `role` | detection / recognition |
| `source` | 来源 |
| `version` | 版本 |
| `license` | 许可证 |
| `redistributionBasis` | 再分发依据 |
| `sha256` | 文件哈希 |
| `sizeBytes` | 文件大小 |
| `targetPath` | 正式目标路径 |
| `notesRequired` | 是否需要 notice |

## 7.4 阻塞规则

如果模型再分发依据无法确认：

    G3
    → BLOCKED

    Phase 10B-1-2B-3
    → 不得开始

不得为了赶进度把模型文件直接放进 `public/`。

## 7.5 G3 当前状态

    G3
    → OPEN_BLOCKING_GATE

---

# 8. G4：THIRD_PARTY_NOTICES 方案

## 8.1 notices 的目标

正式 OCR 集成不应只加入二进制资产，而不记录来源和许可证。

建议 B-1 形成：

    THIRD_PARTY_NOTICES.md

并视需要形成：

    docs/third-party/ocr-assets-manifest.json

注意：

    文件名与目录结构可以在 B-1 最终确认
    本轮只锁定职责

## 8.2 notices 至少覆盖

    @paddleocr/paddleocr-js
    onnxruntime-web
    @techstark/opencv-js
    PP-OCRv5 mobile detection model
    PP-OCRv5 mobile recognition model
    ORT WASM 资产

## 8.3 notices 至少记录

    名称
    版本
    角色
    来源
    许可证
    版权或归属说明
    是否再分发
    再分发文件路径
    更新策略

## 8.4 G4 当前状态

    G4
    → OPEN_BLOCKING_GATE

---

# 9. G5：single-thread WASM baseline

## 9.1 首版默认策略

首版正式 provider 默认：

    backend
    → wasm

    actual mode
    → single-thread

首版暂不启用：

    webgpu
    auto backend
    threaded 默认模式

## 9.2 原因

    当前 smoke 已正式证明 WASM 路径可行
    WebGPU 会扩大设备差异和排障范围
    threaded 会引入 COOP / COEP 与 crossOriginIsolated 联动
    首版目标是最小、可控、可解释的本地 OCR baseline

## 9.3 未来扩展口

provider contract 可以保留未来扩展语义：

    requested mode
    actual mode
    fallback reason

但首版必须保持：

    实际只运行 single-thread
    不静默启用 threaded
    不静默走远程资源
    不静默切换云 OCR

## 9.4 G5 当前状态

    G5
    → APPROVED_FOR_BASELINE_PLAN

---

# 10. G6：首版暂不修改 CSP / COOP / COEP

## 10.1 首版保持不变

B 阶段不得修改：

    next.config.ts
    CSP
    COOP
    COEP
    CORP
    Permissions-Policy
    middleware
    proxy
    connect-src
    worker-src
    script-src

## 10.2 原因

    首版采用 single-thread baseline
    无需提前引入 cross-origin isolation
    全站 header 修改可能影响高德、现有页面和未来部署
    scratch CSP 不得直接复制到正式仓库

## 10.3 CSP 已知风险

scratch 已观察：

    仅 wasm-unsafe-eval
    → 不足以初始化

    加入 unsafe-eval
    → smoke 成功

可能来源：

    OpenCV.js / Emscripten bundle
    → new Function(...)

因此：

    不得顺手全站加入 unsafe-eval
    不得未经评审复制 scratch CSP

未来如需 CSP hardening：

    单独 docs-only 评审
    优先研究 OCR 页面级或 Worker 级最小隔离方案

## 10.4 G6 当前状态

    G6
    → APPROVED_FOR_BASELINE_PLAN
    → NO_HEADER_CHANGE

---

# 11. G7：Next.js Worker 打包方案

## 11.1 已锁定原则

Worker bundle 必须：

    由正式 Next.js 构建链路管理

禁止：

    手工复制 scratch 中的 Vite 哈希 Worker bundle
    把临时哈希文件名写死
    把 scratch dist 当成正式构建产物

## 11.2 当前尚未证明

当前尚未证明：

    PaddleOCR.js 在 HouseFolio 当前 Next.js 构建链路中的 Worker 入口形式
    Worker 是否由依赖内部创建
    是否需要 HouseFolio 自己提供 Worker source entry
    Turbopack / production build 下的 Worker 产物路径
    Worker 缓存策略
    部署后的 Worker 加载路径
    Worker 失败时的错误表现

## 11.3 B-1 必须先完成只读源码审计

B-1 应先检查：

    @paddleocr/paddleocr-js package 源码
    Worker 创建逻辑
    Worker entry 来源
    ORT Worker 与 OCR Worker 的区别
    workerUrl / wasmPaths / modelUrl 配置入口
    构建工具相关假设
    运行时 fallback

## 11.4 B-5 的实现约束

只有 B-1 明确 Worker 机制后，B-5 才允许：

    实现正式 adapter
    验证正式 build
    验证正式 Worker 加载
    验证部署路径
    验证没有远程 fallback

如果 Next.js Worker 打包无法形成稳定最小方案：

    停止 B-5
    不改 headers
    不复制 Vite bundle
    不开始 UI
    回到 docs-only 技术评审

## 11.5 G7 当前状态

    G7
    → OPEN_NEEDS_SOURCE_AUDIT_AND_RUNTIME_PROOF

---

# 12. G8：src/lib/ocr 最小文件范围

## 12.1 页面必须走封装层

页面和组件不得直接调用：

    PaddleOCR.js
    ORT
    OpenCV.js
    Worker
    WASM
    模型路径
    远程 URL
    public/ 静态资产路径

## 12.2 候选最小结构

候选：

    src/lib/ocr/
    ├── provider.ts
    ├── paddleocr-js-adapter.ts
    ├── service.ts
    └── index.ts

## 12.3 文件职责

### provider.ts

只定义 OCR provider contract 与稳定业务类型。

候选职责：

    初始化
    单页识别
    释放资源
    初始化状态
    识别结果
    进度事件
    错误分类
    取消信号
    实际运行模式
    fallback 原因

禁止：

    直接写 UI
    直接修改 contractText
    调用 Phase 9
    持久化图片
    持久化 OCR 文本
    发送网络请求

### paddleocr-js-adapter.ts

只负责把 PaddleOCR.js、ORT 与本地静态资产适配为 provider contract。

候选职责：

    本地资产路径
    PaddleOCR.js 初始化
    WASM baseline
    单页 OCR
    错误归一化
    dispose
    资源释放
    受控 fallback
    无远程 fallback

禁止：

    上传图片
    调用云 OCR
    调用 DeepSeek
    写 localStorage
    写 sessionStorage
    写 IndexedDB
    写 Analytics
    记录合同正文
    直接触发 UI

### service.ts

只提供页面未来可调用的稳定 façade。

候选职责：

    创建 OCR session
    初始化 provider
    识别单页
    释放 session
    对外隐藏 adapter 细节

禁止：

    多图片 queue 状态管理
    缩略图管理
    拖拽排序
    文本校对 UI
    contractText 注入

### index.ts

只提供受控出口。

禁止：

    暴露 PaddleOCR.js 底层对象
    暴露 ORT 底层对象
    暴露 Worker 内部实现
    暴露模型路径细节

## 12.4 Worker source entry

是否需要新增：

    src/lib/ocr/paddleocr.worker.*

当前不得预设。

处理规则：

    如果 B-1 源码审计确认不需要自定义 Worker entry
    → 不新增文件

    如果 B-1 源码审计确认必须新增
    → 先更新 B-0 docs-only 计划
    → 再单独批准文件范围

不得在 B-5 临时顺手新增。

## 12.5 G8 当前状态

    G8
    → PROVISIONALLY_DEFINED
    → FINAL_FILE_SCOPE_DEFERRED_TO_B-1

---

# 13. 远程 fallback 红线

## 13.1 必须主动关闭的远程面

正式 adapter 必须显式关闭：

    默认模型远程 URL
    ORT WASM CDN fallback
    jsDelivr fallback
    其他 CDN fallback
    云 OCR fallback
    DeepSeek OCR fallback

## 13.2 本地失败时的行为

本地资产缺失、初始化失败或 Worker 失败时：

    明确失败
    返回受控错误
    允许页面未来提示用户重试

不得：

    静默请求远程模型
    静默请求 CDN WASM
    静默上传图片
    静默切换第三方 OCR API
    伪装成功

## 13.3 B-7 必须验证

B-7 provider-level contract-check 至少验证：

    1. adapter 只使用版本化本地路径；
    2. 缺失模型时明确失败；
    3. 缺失 WASM 时明确失败；
    4. 不出现 jsDelivr URL；
    5. 不出现默认远程模型 URL；
    6. 不出现 DeepSeek OCR；
    7. 不出现第三方 OCR API；
    8. 不持久化图片；
    9. 不持久化 OCR 文本；
    10. dispose 后不可继续识别。

---

# 14. B 阶段子阶段拆分

## 14.1 Phase 10B-1-2B-1

    第三方 notices、依赖清单与静态资产 manifest 准备
    → docs / manifest only

### 目标

    关闭 G1 的依赖清单评审
    关闭 G2 的候选资产清单评审
    关闭 G3 的模型再分发依据评审
    关闭 G4 的 THIRD_PARTY_NOTICES 方案评审
    推进 G7 的 Worker 源码审计
    确认 G8 的最终文件范围

### 允许修改候选范围

    THIRD_PARTY_NOTICES.md

    docs/third-party/ocr-assets-manifest.json

    docs/architecture/
    2026-06-03-phase-10b-1-2b-1-ocr-runtime-dependencies-assets-and-notices-review.md

具体文件名在 B-1 开始前再次确认。

### 禁止

    不安装依赖
    不修改 package.json
    不修改 package-lock.json
    不复制资产
    不创建 src/lib/ocr
    不修改 next.config.ts
    不运行 runner
    不开始 UI

### 验证标准

    依赖清单有来源、有版本、有用途
    模型有来源、有许可证、有再分发依据
    四个候选资产有源路径、目标路径、sizeBytes、SHA-256
    single-thread 实际闭包已复核
    Worker 创建机制已只读审计
    远程 fallback 风险已逐项记录
    G1–G4 可以明确判定
    G7、G8 可以明确收敛

## 14.2 Phase 10B-1-2B-2

    安装最小正式依赖
    → package.json / package-lock.json only

### 前置条件

    G1
    → APPROVED

    B-1
    → CLOSED_WITH_PASS

### 允许修改

    package.json
    package-lock.json

### 禁止

    不复制资产
    不创建 src/lib/ocr
    不改 next.config.ts
    不开始 UI
    不修改 Phase 9

### 验证标准

    新增依赖精确匹配批准清单
    没有 vite
    没有 playwright-core
    没有额外无关依赖
    package-lock 变更可解释
    npm.cmd run build 通过
    git diff 仅包含 package.json 与 package-lock.json

## 14.3 Phase 10B-1-2B-3

    public/ocr 最小静态资产闭包
    → approved assets only

### 前置条件

    G2
    → APPROVED

    G3
    → APPROVED

    G4
    → APPROVED

    B-2
    → CLOSED_WITH_PASS

### 允许修改

    public/ocr/paddleocr-js/0.3.2/models/*
    public/ocr/paddleocr-js/0.3.2/ort/*

只允许复制 B-1 manifest 已批准资产。

### 禁止

    不整体复制 dist
    不整体复制 assets
    不复制 Vite Worker bundle
    不创建 src/lib/ocr
    不改 config
    不开始 UI

### 验证标准

    正式 public/ 文件清单精确匹配 manifest
    每个文件 SHA-256 精确匹配
    每个文件 sizeBytes 精确匹配
    不存在额外文件
    不存在远程 URL 配置
    npm.cmd run build 通过

## 14.4 Phase 10B-1-2B-4

    src/lib/ocr provider contract
    → provider.ts only

### 前置条件

    G8
    → FINAL_FILE_SCOPE_APPROVED

    B-3
    → CLOSED_WITH_PASS

### 允许修改

    src/lib/ocr/provider.ts

### 禁止

    不实现 PaddleOCR.js adapter
    不创建 UI
    不接 Phase 9
    不修改 public/
    不修改 config
    不增加 queue

### 验证标准

    provider contract 足够稳定
    只定义业务边界
    不泄漏底层依赖
    不包含 UI 逻辑
    不包含持久化逻辑
    不包含网络上传逻辑
    npm.cmd run build 通过

## 14.5 Phase 10B-1-2B-5

    browser-local PaddleOCR.js adapter
    → adapter only

### 前置条件

    G5
    → APPROVED_FOR_BASELINE

    G6
    → NO_HEADER_CHANGE

    G7
    → WORKER_PLAN_APPROVED

    B-4
    → CLOSED_WITH_PASS

### 允许修改

    src/lib/ocr/paddleocr-js-adapter.ts

如果 Worker 源码审计确认必须新增 Worker entry：

    先停止
    先补 docs-only 评审
    不得直接新增

### 禁止

    不修改 next.config.ts
    不加 CSP
    不加 COOP
    不加 COEP
    不接 UI
    不接 Phase 9
    不持久化
    不上传图片
    不接云 OCR
    不接 DeepSeek OCR

### 验证标准

    只使用版本化本地资产路径
    backend 固定 wasm
    首版 actual mode 固定 single-thread
    无静默 CDN fallback
    无静默模型远程 fallback
    无静默云 OCR fallback
    错误可归一化
    dispose 可用
    npm.cmd run build 通过
    正式 Worker 打包路径已验证

如果正式 Worker 打包无法验证：

    STOP
    → 回到 docs-only 技术评审

## 14.6 Phase 10B-1-2B-6

    OCR service façade
    → service.ts / index.ts only

### 前置条件

    B-5
    → CLOSED_WITH_PASS

### 允许修改

    src/lib/ocr/service.ts
    src/lib/ocr/index.ts

### 禁止

    不做 queue
    不做 UI
    不注入 contractText
    不修改 Phase 9
    不加 localStorage
    不加 sessionStorage
    不加 IndexedDB

### 验证标准

    页面未来只需调用稳定 façade
    adapter 细节不外泄
    底层对象不外泄
    service 可创建、使用和释放 OCR session
    npm.cmd run build 通过

## 14.7 Phase 10B-1-2B-7

    provider-level contract-check
    → no UI

### 前置条件

    B-6
    → CLOSED_WITH_PASS

### 允许修改候选范围

    src/lib/ocr/provider-contract-check.ts

如果现有项目测试组织方式要求其他命名：

    先只读确认
    再最小调整

### 禁止

    不接 UI
    不接 Phase 9
    不跑真实多图片 workflow
    不支持 PDF
    不启用 threaded 默认模式
    不改 headers

### 验证标准

    本地静态路径
    单页 OCR
    错误分类
    模型缺失失败
    WASM 缺失失败
    无远程 fallback
    无图片上传
    无 OCR 文本持久化
    dispose
    dispose 后拒绝识别
    build
    provider contract-check

B-7 完成后，B 阶段才允许判断：

    FORMAL_OCR_PROVIDER_MINIMUM_CLOSURE
    → CLOSED_WITH_PASS

然后进入：

    Phase 10B-1-2C-0
    → 多图片 workflow 实现计划评审
    → docs-only

---

# 15. B 阶段 commit 粒度

每个子阶段独立 commit。

候选 commit message：

    B-1
    docs: review ocr runtime assets and notices

    B-2
    chore: add browser local ocr runtime dependencies

    B-3
    chore: add local ocr runtime assets

    B-4
    feat: add ocr provider contract

    B-5
    feat: add paddleocr browser adapter

    B-6
    feat: add ocr service facade

    B-7
    test: add ocr provider contract checks

不得：

    一次 commit 包含多个阶段
    使用 git add .
    使用 git add -A
    自动 stage 非批准文件
    把 UI 改动混入 B 阶段

---

# 16. B 阶段默认关闭项

B 阶段期间继续禁止：

    不要开始多图片 queue
    不要开始缩略图 UI
    不要开始拖拽排序
    不要开始失败页重试 UI
    不要开始合并文本校对 UI
    不要注入 contractText
    不要修改 contract-review 页面
    不要修改 zh-cn.ts
    不要修改 Phase 9 route
    不要修改 Phase 9 provider
    不要修改 Phase 9 prompt
    不要修改 Phase 9 schema
    不要修改 next.config.ts
    不要添加 CSP
    不要添加 COOP
    不要添加 COEP
    不要扩大 connect-src
    不要开启 threaded 默认模式
    不要支持 PDF
    不要支持 HEIC
    不要接云 OCR
    不要接对象存储
    不要接 Supabase
    不要上传图片
    不要持久化图片
    不要持久化未确认 OCR 文本
    不要清理 scratch
    不要删除 evidence

---

# 17. G1–G8 状态总表

| Gate | 内容 | B-0 结论 | 后续关闭位置 |
|---|---|---|---|
| G1 | 正式依赖树范围 | `PROVISIONALLY_DEFINED` | B-1 |
| G2 | 静态资产复制范围 | `CANDIDATE_CLOSURE_ONLY` | B-1 |
| G3 | 模型再分发依据 | `OPEN_BLOCKING_GATE` | B-1 |
| G4 | `THIRD_PARTY_NOTICES` | `OPEN_BLOCKING_GATE` | B-1 |
| G5 | single-thread WASM baseline | `APPROVED_FOR_BASELINE_PLAN` | B-0 |
| G6 | 首版不改 CSP / COOP / COEP | `APPROVED_FOR_BASELINE_PLAN` | B-0 |
| G7 | Next.js Worker 打包 | `OPEN_NEEDS_SOURCE_AUDIT_AND_RUNTIME_PROOF` | B-1 / B-5 |
| G8 | `src/lib/ocr` 文件范围 | `PROVISIONALLY_DEFINED` | B-1 |

---

# 18. B-0 总结论

    PHASE_10B_1_2B_0_RESULT
    → PLAN_READY_WITH_GATES

    FORMAL_OCR_PROVIDER_MINIMUM_CLOSURE_PLAN
    → COMPLETE

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED

    DEPENDENCY_INSTALL_PERMISSION
    → NOT_GRANTED

    STATIC_ASSET_COPY_PERMISSION
    → NOT_GRANTED

    SRC_LIB_OCR_CREATION_PERMISSION
    → NOT_GRANTED

    NEXT_CONFIG_MODIFICATION_PERMISSION
    → NOT_GRANTED

    OCR_UI_IMPLEMENTATION_PERMISSION
    → NOT_GRANTED

---

# 19. 下一阶段入口

B-0 文档完成并经用户确认后，下一步只能进入：

    Phase 10B-1-2B-1
    → 第三方 notices、依赖清单与静态资产 manifest 准备
    → docs / manifest only

B-1 仍然不得：

    安装依赖
    修改 package.json
    修改 package-lock.json
    复制模型
    复制 ORT 资产
    创建 src/lib/ocr
    修改 next.config.ts
    添加 CSP / COOP / COEP
    运行正式 OCR
    开始 UI

B-1 的首要任务是关闭：

    G1
    G2
    G3
    G4

并进一步收敛：

    G7
    G8

---

# 20. 固定执行纪律

后续每一轮继续坚持：

    一次只做一件事

    先 docs-only
    再实现

    先 manifest
    再复制资产

    先依赖清单
    再安装依赖

    先 provider contract
    再 adapter

    先 adapter
    再 service façade

    先 provider-level check
    再 workflow

    先 workflow
    再真实图片回归

    最后才评审 threaded

    失败先诊断
    不盲目重跑

    保留 evidence
    不覆盖失败现场

    图片不离开设备

    不静默远程 fallback

    不静默云 OCR fallback

    不让页面直接调用 PaddleOCR.js

    不让 OCR 侵入 Phase 9

    不为了工程优雅增加用户负担

    不跳阶段

    不扩大 scope

    不让 Codex 自由发挥