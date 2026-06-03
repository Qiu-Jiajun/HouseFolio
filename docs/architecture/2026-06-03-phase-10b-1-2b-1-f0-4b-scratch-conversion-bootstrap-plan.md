# Phase 10B-1-2B-1-F0-4B｜独立 scratch 模型转换环境 bootstrap 计划

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-1-F0-4B 的 docs-only 计划文档。

它用于：

    记录 F0-4A 的本机环境审计结果
    固化独立 scratch conversion workspace 的 bootstrap 边界
    锁定后续环境创建前必须关闭的工具链兼容性 gate
    锁定网络白名单与 endpoint 核验规则
    锁定 venv、日志、evidence 与失败现场保留规则
    阻止未经审计的依赖安装、模型下载和模型转换
    为 F0-4B-1 官方兼容性与 endpoint 收敛评审提供输入

本文档不是：

    conversion scratch 创建批准
    venv 创建批准
    Python 安装批准
    Python 版本切换批准
    pip install 批准
    PaddleX 安装批准
    Paddle2ONNX 安装批准
    PaddlePaddle 安装批准
    ONNX 安装批准
    模型下载批准
    模型解压批准
    模型转换批准
    tar 打包批准
    public/ocr 复制批准
    src/lib/ocr 创建批准
    Next.js Worker 验证批准

本文档完成后，下一步只能进入：

    Phase 10B-1-2B-1-F0-4B-1
    → official toolchain compatibility and endpoint closure review
    → read-only
    → official-source only

---

# 1. 当前稳定点

本文档写入前的稳定点：

    HEAD
    main
    origin/main
    remote refs/heads/main
    =
    2c97b08c3f081e89581f9eff58a149a5bcb6b5ac

提交：

    2c97b08 docs: plan reproducible ocr model conversion spike

protected stash：

    stash@{0}
    → 8a27c545465dc185f5506311392ab57dc6e67f84

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

.env.local SHA-256：

    d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7

现有 browser-local smoke scratch：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

计划中的 conversion scratch：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

---

# 2. F0-4A 已确认环境

本机基础环境：

    Windows
    → Microsoft Windows NT 10.0.22631.0

    OS / CPU architecture
    → AMD64

    logical processors
    → 32

    D: free space
    → 239771901952 bytes

    E: free space
    → 248679124992 bytes

    Python executable
    → D:\Python\python.exe

    Python version
    → 3.13.7

    Python architecture
    → 64-bit

    pip
    → 26.0.1

    venv
    → available

    tar
    → C:\Windows\system32\tar.exe
    → bsdtar 3.7.2

    Get-FileHash
    → available

    certutil
    → available

    Git
    → 2.54.0.windows.1

    Node
    → v24.15.0

    npm.cmd
    → 11.12.1

    Docker
    → not found

    WSL
    → command exists
    → operational status unresolved

当前已存在 Python 包：

    PyYAML
    → 6.0.3

    numpy
    → 2.3.4

当前缺失：

    paddlex
    paddle2onnx
    paddlepaddle
    paddle
    onnx
    onnxruntime

---

# 3. 官方工具链基线

## 3.1 PaddleOCR ONNX 转换路径

官方 PaddleOCR 文档将 PaddleX 提供的 Paddle2ONNX 插件作为 ONNX 转换路径。

规划链路：

    官方 Paddle 模型
    → PaddleX
    → Paddle2ONNX plugin
    → ONNX 输出目录
    → 校验 inference.onnx
    → 校验 inference.yml
    → plain ustar tar
    → evidence closure

## 3.2 Python 版本

官方 PaddleX 最新文档支持：

    Python 3.8
    至
    Python 3.13

PaddlePaddle 官方安装指南支持：

    Python 3.9
    至
    Python 3.13

因此：

    Python 3.13.7
    → candidate only

不得直接推导：

    Python 3.13.7
    → 已经批准用于最终 conversion spike

F0-4B-1 必须核验：

    PaddleX 精确版本
    PaddlePaddle 精确版本
    Paddle2ONNX 精确版本
    对 Python 3.13 的逐包兼容性
    Windows x64 wheel 可用性
    CPU-only 路径可行性

如 Python 3.13 无法形成受控兼容组合：

    不修改系统 Python
    不覆盖 D:\Python\python.exe
    单独评审额外 Python 3.12 x64 安装
    单独创建隔离 venv

## 3.3 Paddle2ONNX 官方建议

Paddle2ONNX 官方仓库当前建议：

    PaddlePaddle
    → 3.0.0

    onnxruntime
    → >= 1.10.0

注意：

    官方建议
    ≠
    HouseFolio 已批准版本组合

F0-4B-1 必须继续锁定：

    PaddleX 与 PaddlePaddle 的兼容关系
    Paddle2ONNX 与 PaddlePaddle 的兼容关系
    onnx 与 onnxruntime 的版本组合
    Windows CPU wheel
    Python 3.13 wheel

---

# 4. 独立 conversion scratch 规划

规划路径：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

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

候选 venv 路径：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\env\venv

注意：

    F0-4B 不创建任何目录。
    F0-4B 不创建 venv。
    F0-4B 不安装任何依赖。

---

# 5. 工具链锁定 gate

## T1：Python 版本 gate

当前候选：

    Python 3.13.7 x64

状态：

    OPEN_NEEDS_PER_PACKAGE_COMPATIBILITY_REVIEW

不得直接批准。

## T2：PaddleX gate

必须锁定：

    精确版本
    官方来源
    Python 版本要求
    PaddlePaddle 版本要求
    Windows x64 支持
    CPU-only 路径
    安装命令
    package index
    wheel 或 sdist
    SHA-256 或 lock evidence

状态：

    OPEN

## T3：PaddlePaddle gate

必须锁定：

    精确版本
    CPU-only Windows x64 wheel
    Python 版本要求
    package index
    安装命令
    wheel filename
    wheel SHA-256
    依赖影响

状态：

    OPEN

## T4：Paddle2ONNX gate

必须锁定：

    安装方式
    精确版本
    PaddlePaddle 兼容关系
    onnxruntime 兼容关系
    Windows x64 可用性
    Python 3.13 可用性
    安装命令
    package 来源
    SHA-256 或 lock evidence

状态：

    OPEN

## T5：ONNX inspection gate

必须锁定：

    onnx 精确版本
    onnxruntime 精确版本
    CPU-only 路径
    Python 版本兼容性
    安装命令
    SHA-256 或 lock evidence

状态：

    OPEN

## T6：YAML gate

当前候选：

    PyYAML
    → 6.0.3

状态：

    AVAILABLE_BUT_NOT_YET_LOCKED

## T7：tar packaging gate

当前：

    Windows bsdtar
    → 3.7.2

尚未确认：

    plain ustar 参数
    entry 顺序
    路径规范化
    是否会写入不稳定 metadata
    是否能够生成可复现 archive

状态：

    OPEN_NEEDS_READ_ONLY_DOC_REVIEW

---

# 6. 网络白名单 gate

## N1：pip package metadata

候选 host：

    pypi.org

用途：

    package metadata
    release files
    hashes

状态：

    candidate only

## N2：pip package download

候选 host：

    files.pythonhosted.org

用途：

    wheel 或 sdist 下载

状态：

    candidate only
    F0-4B 不批准下载

## N3：官方模型页面

候选 host：

    huggingface.co

用途：

    官方模型页面
    model card
    API metadata

状态：

    candidate only

## N4：Hugging Face 文件托管

候选 host：

    cdn-lfs.hf.co
    cas-bridge.xethub.hf.co

用途：

    未来官方原始模型下载

状态：

    candidate only
    需要 redirect allowlist
    F0-4B 不批准下载

## N5：PaddleOCR.js 默认 tarball endpoint

host：

    paddle-model-ecology.bj.bcebos.com

用途：

    旧 tarball endpoint 证据复核

状态：

    metadata-only candidate
    不是正式下载批准
    不是正式再分发批准

## N6：官方文档与源码

候选 host：

    github.com
    raw.githubusercontent.com
    paddleocr.ai
    www.paddleocr.ai
    paddlepaddle.github.io

用途：

    文档
    LICENSE
    NOTICE
    README
    源码

状态：

    metadata-only candidate

---

# 7. endpoint 收敛要求

F0-4B-1 必须只读核验：

    PyPI paddlex release metadata
    PyPI wheel / sdist 列表
    PaddlePaddle Windows CPU package index
    PaddlePaddle Windows CPU wheel 文件名
    PaddlePaddle Windows CPU wheel Python tag
    PaddlePaddle wheel SHA-256
    Paddle2ONNX package metadata
    Paddle2ONNX 安装方式
    ONNX package metadata
    ONNXRuntime package metadata
    PyYAML package metadata
    numpy package metadata
    Hugging Face 官方模型 API metadata
    Hugging Face 文件列表
    redirect host
    Content-Length
    LICENSE
    NOTICE
    model card
    bcebos endpoint HEAD 状态
    Windows bsdtar plain ustar 参数

只允许：

    官方页面 GET
    官方 JSON metadata GET
    精确 endpoint HEAD
    读取 redirect chain
    读取 Content-Length
    读取 hash metadata

禁止：

    下载 wheel
    下载 sdist
    下载模型
    下载 tarball
    Range 请求
    安装依赖
    创建 scratch
    创建 venv

---

# 8. 后续阶段拆分

## 8.1 F0-4B-1

    official toolchain compatibility and endpoint closure review
    → read-only
    → official-source only

目标：

    关闭或进一步收敛 T1 至 T7
    关闭或进一步收敛 N1 至 N6
    输出精确 package 版本候选
    输出精确 endpoint 候选
    输出 redirect allowlist 候选
    输出 Python 3.13 是否可继续使用
    输出是否需要单独安装 Python 3.12

禁止：

    创建 scratch
    创建 venv
    安装
    下载
    转换
    打包

## 8.2 F0-4B-2

    final scratch bootstrap execution plan
    → docs-only

前置条件：

    F0-4B-1
    → PASS_WITH_CLOSURE

目标：

    锁定 conversion scratch 创建范围
    锁定 venv 创建命令
    锁定 Python executable
    锁定 pip 安装命令
    锁定包版本
    锁定 package index
    锁定网络白名单
    锁定 stdout / stderr
    锁定 evidence 路径
    锁定失败退出规则

## 8.3 F0-4C

    scratch conversion workspace bootstrap
    → scratch-only
    → requires separate approval

目标：

    创建独立 conversion scratch
    创建 boundary README
    创建 venv
    安装精确批准工具链
    锁定工具版本
    写入 evidence

禁止：

    下载模型
    转换
    打包
    修改正式仓库

## 8.4 F0-4D

    official-source model download
    → scratch-only
    → requires separate approval

目标：

    下载精确批准的官方模型文件
    锁定 redirect chain
    锁定 SHA-256
    锁定 LICENSE
    锁定 NOTICE
    锁定 model card

禁止：

    转换
    打包
    复制到 public/

## 8.5 F0-4E

    Paddle2ONNX conversion
    → scratch-only
    → requires separate approval

## 8.6 F0-4F

    plain ustar tar packaging
    → scratch-only
    → requires separate approval

## 8.7 F0-5

    reproducible model closure evidence review
    → read-only
    → docs-only gate decision

---

# 9. 当前 gate 状态

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

    T1
    → OPEN_NEEDS_PER_PACKAGE_COMPATIBILITY_REVIEW

    T2
    → OPEN

    T3
    → OPEN

    T4
    → OPEN

    T5
    → OPEN

    T6
    → AVAILABLE_BUT_NOT_YET_LOCKED

    T7
    → OPEN_NEEDS_READ_ONLY_DOC_REVIEW

    N1
    → CANDIDATE_ONLY

    N2
    → CANDIDATE_ONLY

    N3
    → CANDIDATE_ONLY

    N4
    → CANDIDATE_ONLY

    N5
    → METADATA_ONLY_CANDIDATE

    N6
    → METADATA_ONLY_CANDIDATE

---

# 10. 当前禁止事项

继续禁止：

    创建 conversion scratch
    创建 venv
    修改 PATH
    修改系统 Python
    安装 Python 3.12
    安装 Python 依赖
    安装 PaddleX
    安装 PaddlePaddle
    安装 Paddle2ONNX
    安装 onnx
    安装 onnxruntime
    下载 wheel
    下载 sdist
    下载模型
    解压模型
    转换模型
    打包 tar
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

# 11. 总结论

    PHASE_10B_1_2B_1_F0_4B_RESULT
    → PLAN_READY_WITH_OPEN_GATES

    PYTHON_3_13_7
    → CANDIDATE_ONLY

    CONVERSION_SCRATCH
    → NOT_CREATED

    TOOLCHAIN_INSTALLATION
    → NOT_GRANTED

    MODEL_DOWNLOAD
    → NOT_GRANTED

    MODEL_CONVERSION
    → NOT_GRANTED

    NEXT_ACTION
    → Phase 10B-1-2B-1-F0-4B-1
    → official toolchain compatibility and endpoint closure review
    → read-only
    → official-source only

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED