# Phase 10B-1-2B-1-F0-3｜可复现官方来源模型转换 spike 计划

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-1-F0-3 的 docs-only 计划文档。

它用于：

    把可复现官方来源模型转换路径拆分为可审计的小阶段
    锁定独立 scratch conversion workspace
    锁定下载来源、工具链、网络白名单和证据 manifest 规则
    锁定失败现场保留规则
    锁定转换后验证方式
    防止未经审计的模型进入正式 public/
    为后续 scratch-only spike 提供执行边界

本文档不是：

    模型下载批准
    Python 环境创建批准
    Python 依赖安装批准
    PaddleX 安装批准
    Paddle2ONNX 插件安装批准
    PaddlePaddle 安装批准
    模型解压批准
    ONNX 转换批准
    tar 打包批准
    public/ocr 资产复制批准
    src/lib/ocr 创建批准
    正式 OCR provider 实现批准
    Next.js Worker 验证批准

本文档完成后，下一步只能进入：

    Phase 10B-1-2B-1-F0-4A
    → scratch conversion environment feasibility preflight
    → read-only first

---

# 1. 当前稳定点

本文档写入前的稳定点：

    HEAD
    main
    origin/main
    remote refs/heads/main
    =
    720848ddf9276216ec8358de5b97c91d333766c4

提交：

    720848d docs: review reproducible ocr model packaging workflow

protected stash：

    stash@{0}
    → 8a27c545465dc185f5506311392ab57dc6e67f84

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

.env.local SHA-256：

    d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7

现有 browser-local smoke scratch：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

计划中的独立 conversion scratch：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

注意：

    F0-3 不得创建 conversion scratch。
    只允许在后续单独批准的 scratch-only 阶段创建。

---

# 2. 上游结论继承

Phase 10B-1-2B-1-F0-1 已确认：

    两个现有 ONNX tarball
    → DO_NOT_COPY_TO_PUBLIC

    G3
    → BLOCKED_PENDING_EVIDENCE

Phase 10B-1-2B-1-F0-2 已关闭：

    PHASE_10B_1_2B_1_F0_2_RESULT
    → CLOSED_WITH_PLAN

    EXISTING_TARBALLS
    → DO_NOT_COPY_TO_PUBLIC

    G3
    → BLOCKED_PENDING_REPRODUCIBLE_WORKFLOW

当前不得复用来源链不完整的旧 tarball 作为正式 public/ 资产。

---

# 3. 官方来源与格式基线

## 3.1 PaddleOCR 官方仓库

官方仓库：

    https://github.com/PaddlePaddle/PaddleOCR

许可证：

    Apache License 2.0

Apache-2.0 再分发处理原则：

    附带许可证副本
    标记修改
    保留适用的版权、专利、商标和归属信息
    如果上游包含 NOTICE，则处理 NOTICE 中适用的归属内容
    记录 HouseFolio 侧新增 attribution

## 3.2 PaddleOCR.js 浏览器部署文档

官方文档：

    https://www.paddleocr.ai/latest/en/version3.x/inference_deployment/cross_platform/browser.html

自定义模型资产要求：

    使用未压缩 .tar
    使用 plain ustar tar
    必须包含 inference.onnx
    必须包含 inference.yml
    inference.yml 的 model_name 必须匹配 create() 中传入的名称
    不符合规则时应初始化失败
    不应静默 fallback

## 3.3 官方 ONNX 转换文档

官方文档：

    https://www.paddleocr.ai/main/en/version3.x/deployment/obtaining_onnx_models.html

官方路径：

    Paddle 模型目录
    → PaddleX CLI
    → Paddle2ONNX 插件
    → ONNX 输出目录

候选转换命令结构：

    paddlex
    --paddle2onnx
    --paddle_model_dir <official paddle model directory>
    --onnx_model_dir <isolated output directory>
    --opset_version <locked integer>

注意：

    具体 PaddleX 版本
    Paddle2ONNX 插件版本
    PaddlePaddle 版本
    Python 版本
    opset version

    均不得在 F0-3 中预设为已批准值。
    必须在后续环境 feasibility preflight 中锁定。

## 3.4 官方模型候选页面

Detection：

    https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_det

Recognition：

    https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_rec

注意：

    官方模型页面只是候选下载来源。
    F0-3 不批准下载。
    F0-4A 必须先核验具体文件列表、下载 URL、许可证与大小。
    F0-4B 才允许提交精确下载白名单建议。

---

# 4. 独立 scratch conversion workspace

## 4.1 规划路径

计划路径：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

必须与现有 browser-local smoke scratch 分离。

禁止覆盖：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

## 4.2 规划目录

候选目录：

    housefolio-phase-10b-1-official-model-conversion-spike/
    ├── README-boundary.txt
    ├── env/
    ├── downloads/
    ├── source-models/
    ├── converted/
    ├── packaged/
    ├── evidence/
    └── logs/

注意：

    以上只是规划。
    F0-3 不创建目录。
    后续仅在单独批准的 scratch-only 阶段创建。

## 4.3 scratch-only 原则

后续 conversion spike 期间：

    只允许修改独立 conversion scratch
    不得修改正式 HouseFolio 仓库
    不得覆盖现有 browser-local smoke scratch
    不得自动复制任何文件到 public/
    不得创建 src/lib/ocr
    不得修改 package.json
    不得修改 package-lock.json
    不得修改 next.config.ts
    不得修改 Phase 9
    不得开始多图片 UI

---

# 5. 网络白名单原则

## 5.1 默认禁止联网

后续 scratch-only execution 默认：

    deny by default

仅允许精确白名单。

## 5.2 候选白名单来源

候选官方来源：

    github.com/PaddlePaddle/PaddleOCR
    huggingface.co/PaddlePaddle/PP-OCRv5_mobile_det
    huggingface.co/PaddlePaddle/PP-OCRv5_mobile_rec
    www.paddleocr.ai
    paddleocr.ai
    paddlepaddle.github.io

注意：

    候选来源
    ≠
    已批准下载 endpoint

F0-4A 必须先只读核验：

    具体文件列表
    具体下载 URL
    重定向链
    最终 host
    Content-Length
    文件名
    LICENSE
    NOTICE
    README
    model card

F0-4B 才允许提出：

    exact-download-url allowlist

不得使用：

    任意第三方镜像
    任意未审计 bcebos tarball
    任意博客下载链接
    任意个人网盘
    任意自动 CDN fallback

---

# 6. 工具链候选与锁定规则

## 6.1 候选工具链

候选：

    Python
    virtual environment
    PaddleX CLI
    Paddle2ONNX plugin
    PaddlePaddle
    tar packaging tool
    SHA-256 hashing
    YAML validation
    ONNX file inspection

## 6.2 F0-4A 必须只读核验

F0-4A 必须报告：

    Windows 版本
    PowerShell 版本
    Python 版本
    pip 版本
    venv 可用性
    Docker 是否存在
    WSL 是否存在
    磁盘剩余空间
    planned conversion scratch 是否不存在
    browser-local smoke scratch 是否完整
    PATH 中是否已有 PaddleX
    PATH 中是否已有 Paddle2ONNX
    PATH 中是否已有 PaddlePaddle
    是否存在可用 tar 工具
    是否存在可用 SHA-256 工具
    是否存在可用 YAML 校验方式
    是否存在可用 ONNX inspection 方式

F0-4A 仍然不得：

    创建 venv
    安装依赖
    下载模型
    创建 conversion scratch
    转换模型
    打包模型

## 6.3 工具链批准规则

后续只有形成精确 toolchain manifest 后，才允许创建环境。

toolchain manifest 至少记录：

    Python version
    pip version
    PaddleX version
    Paddle2ONNX plugin version
    PaddlePaddle version
    ONNX inspection version
    YAML parser version
    tar implementation
    operating system
    CPU architecture
    install command
    package index
    network endpoint
    package SHA-256 or lock evidence
    environment path

---

# 7. 证据 manifest 设计

后续 execution 必须生成可审计 evidence manifest。

## 7.1 Run metadata

记录：

    runId
    phaseId
    startedAt
    completedAt
    host OS
    PowerShell version
    Python version
    pip version
    working directory
    conversion scratch path
    browser-local smoke scratch path
    repository HEAD
    repository status

## 7.2 Network evidence

记录：

    requested URL
    redirect chain
    final URL
    final host
    request timestamp
    HTTP status
    Content-Length
    downloaded filename
    downloaded bytes
    downloaded SHA-256
    source type
    source license evidence
    source model card evidence

## 7.3 Toolchain evidence

记录：

    command
    arguments
    executable path
    executable version
    environment variables
    stdout log path
    stderr log path
    exit code
    durationMs

不得记录：

    secret
    token
    .env.local 内容

## 7.4 Source model evidence

记录：

    official model page
    downloaded source URL
    source archive filename
    source archive SHA-256
    extracted file list
    extracted file SHA-256
    LICENSE
    NOTICE
    README
    model card
    role
    version
    attribution

## 7.5 Conversion evidence

记录：

    paddle_model_dir
    onnx_model_dir
    opset version
    generated inference.onnx
    inference.onnx SHA-256
    inference.yml
    inference.yml SHA-256
    inference.yml model_name
    file sizes
    conversion stdout
    conversion stderr
    conversion exit code

## 7.6 Packaging evidence

记录：

    tar implementation
    tar command
    archive format
    tar entry list
    inference.onnx present
    inference.yml present
    no gzip compression
    tarball filename
    tarball sizeBytes
    tarball SHA-256

## 7.7 License evidence

记录：

    upstream project license
    model page license
    downloaded archive license
    applicable NOTICE
    conversion modification notice
    HouseFolio attribution
    redistribution decision
    unresolved items

---

# 8. 失败现场保留规则

任何失败都必须：

    停止
    不盲目重跑
    不覆盖日志
    不删除下载文件
    不删除失败输出
    不覆盖 evidence manifest
    不覆盖旧 tarball
    不复制失败资产到 public/
    保留 stdout
    保留 stderr
    保留 network evidence
    保留 SHA-256
    生成新的 runId 后才允许后续重跑

禁止：

    在同一目录静默覆盖
    删除失败现场后重新开始
    把失败输出混入成功输出
    自动清理临时文件
    自动复制结果到正式仓库

---

# 9. 后续细分阶段

## 9.1 Phase 10B-1-2B-1-F0-4A

    scratch conversion environment feasibility preflight
    → read-only first

目标：

    只读核验本机环境
    只读核验候选官方来源
    只读核验具体模型文件列表
    只读核验候选网络 endpoint
    只读核验工具链现状
    输出环境 feasibility 报告

禁止：

    创建 conversion scratch
    创建 venv
    安装工具链
    下载模型
    转换
    打包

## 9.2 Phase 10B-1-2B-1-F0-4B

    scratch conversion bootstrap plan
    → docs-only

目标：

    根据 F0-4A 报告
    锁定 conversion scratch 创建范围
    锁定 venv 路径
    锁定安装命令
    锁定包版本
    锁定 package index
    锁定网络白名单
    锁定下载 URL
    锁定证据 manifest schema
    锁定失败退出规则

禁止：

    创建目录
    创建 venv
    安装
    下载
    转换
    打包

## 9.3 Phase 10B-1-2B-1-F0-4C

    scratch conversion workspace bootstrap
    → scratch-only
    → requires separate approval

目标：

    创建独立 conversion scratch
    写入 boundary README
    创建 venv
    安装精确批准的工具链
    锁定工具版本
    写入 toolchain evidence

禁止：

    下载模型
    转换模型
    打包模型
    修改正式仓库

## 9.4 Phase 10B-1-2B-1-F0-4D

    official-source model download
    → scratch-only
    → requires separate approval

目标：

    只下载精确批准的官方文件
    锁定 URL
    锁定 redirect chain
    锁定 SHA-256
    锁定 LICENSE
    锁定 NOTICE
    锁定 model card

禁止：

    转换模型
    打包模型
    复制到 public/

## 9.5 Phase 10B-1-2B-1-F0-4E

    Paddle2ONNX conversion
    → scratch-only
    → requires separate approval

目标：

    使用锁定工具链
    使用锁定原始模型
    使用锁定 opset version
    生成 inference.onnx
    锁定输出 SHA-256
    校验 inference.yml
    校验 model_name

禁止：

    打包
    复制到 public/

## 9.6 Phase 10B-1-2B-1-F0-4F

    plain ustar tar packaging
    → scratch-only
    → requires separate approval

目标：

    打包未压缩 .tar
    只包含经过批准的文件
    校验 inference.onnx
    校验 inference.yml
    校验 model_name
    锁定 tarball SHA-256
    锁定 tarball sizeBytes

禁止：

    复制到 public/

## 9.7 Phase 10B-1-2B-1-F0-5

    reproducible model closure evidence review
    → read-only
    → docs-only gate decision

目标：

    校验来源
    校验许可证
    校验 NOTICE
    校验工具链
    校验转换
    校验 tar
    校验 SHA-256
    决定 G3 是否关闭

---

# 10. 与正式仓库的隔离

在 G3 关闭前，禁止：

    把模型复制进 public/
    把 ORT WASM 复制进 public/
    创建 src/lib/ocr
    修改 package.json
    修改 package-lock.json
    修改 next.config.ts
    修改 CSP
    修改 COOP
    修改 COEP
    开始多图片 UI
    修改 Phase 9

独立 conversion scratch 只是：

    证据生成现场

不是：

    正式生产资产目录
    public/ 来源自动批准
    模型再分发自动批准
    OCR provider 实现现场

---

# 11. Gate 状态

    G1
    → READY_TO_DOCUMENT

    G2
    → PARTIALLY_DEFINED

    G3
    → BLOCKED_PENDING_REPRODUCIBLE_WORKFLOW

    G4
    → PARTIALLY_DEFINED

    G5
    → APPROVED_FOR_BASELINE_PLAN

    G6
    → NO_HEADER_CHANGE

    G7
    → OPEN_BUT_NARROWED

    G8
    → PROVISIONALLY_DEFINED

---

# 12. 当前禁止事项

继续禁止：

    创建 conversion scratch
    下载模型
    安装 PaddleX
    安装 Paddle2ONNX
    安装 PaddlePaddle
    安装 Python 依赖
    创建 venv
    解压模型
    转换模型
    打包模型
    覆盖旧 tarball
    复制模型到 public/
    复制 ORT 到 public/
    创建 src/lib/ocr
    修改 package.json
    修改 package-lock.json
    修改 next.config.ts
    修改 CSP
    修改 COOP
    修改 COEP
    运行 OCR runner
    开始多图片 UI
    修改 Phase 9

---

# 13. 总结论

    PHASE_10B_1_2B_1_F0_3_RESULT
    → PLAN_READY_WITH_GATES

    EXISTING_TARBALLS
    → DO_NOT_COPY_TO_PUBLIC

    G3
    → BLOCKED_PENDING_REPRODUCIBLE_WORKFLOW

    NEXT_ACTION
    → Phase 10B-1-2B-1-F0-4A
    → scratch conversion environment feasibility preflight
    → read-only first

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED