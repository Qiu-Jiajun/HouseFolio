# Phase 10B-1-2B-1-F0-4B-2｜独立 scratch 模型转换环境最终 bootstrap 执行计划

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-1-F0-4B-2 的 docs-only 最终 bootstrap 执行计划。

它用于：

    固化独立 scratch conversion workspace 的后续创建边界
    固化 Python 3.12 primary candidate 与 Python 3.13 secondary candidate
    固化 PaddleOCR ONNX 官方插件路线
    固化 PaddleX、PaddlePaddle 与 Paddle2ONNX 已确认 artifact ledger
    固化代理 allowlist 缺口
    固化工具安装、模型下载、模型转换和打包之间的分阶段边界
    固化 evidence、日志、失败现场保留和禁止自动复制 public/ 的规则
    为后续 F0-4C-0 scratch bootstrap execution preflight 提供输入

本文档不是：

    conversion scratch 创建批准
    Python 3.12 安装批准
    venv 创建批准
    pip install 批准
    wheel 下载批准
    sdist 下载批准
    模型下载批准
    模型解压批准
    模型转换批准
    tar 打包批准
    public/ocr 复制批准
    src/lib/ocr 创建批准
    正式 OCR provider 实现批准
    Next.js Worker 验证批准

本文档完成后，下一步只能进入：

    Phase 10B-1-2B-1-F0-4C-0
    → scratch conversion workspace bootstrap execution preflight
    → read-only approval gate

不得直接创建 scratch。
不得直接创建 venv。
不得直接安装依赖。

---

# 1. 当前稳定点

本文档写入前的稳定点：

    HEAD
    main
    origin/main
    remote refs/heads/main
    =
    1711a9554822b937df956102fd40cff61b618de8

提交：

    1711a95 docs: plan ocr conversion scratch bootstrap

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

注意：

    F0-4B-2 不创建 conversion scratch。
    F0-4B-2 只写规划文档。

---

# 2. 上游结论继承

Phase 10B-1-2B-1-F0-4B-1-F0-1 已确认：

    PASS_WITH_CLOSURE

    READY_TO_WRITE_F0_4B_2_PLAN

当前可以：

    写入 F0-4B-2 docs-only 最终 bootstrap 执行计划

当前仍然不可以：

    创建 conversion scratch
    创建 venv
    安装 Python
    安装 Python package
    下载 artifact
    下载模型
    转换模型
    打包模型
    复制文件到 public/
    创建 src/lib/ocr

---

# 3. 官方路线选择

## 3.1 Primary route

首选规划路线：

    Route A
    → PaddleOCR ONNX 官方文档路线

Windows CPU conversion spike 候选步骤：

    隔离 Python 3.12.x x64
    → 独立 conversion scratch
    → 隔离 venv
    → 受控安装 PaddlePaddle CPU
    → 受控安装 PaddleX
    → paddlex --install paddle2onnx
    → paddlex --paddle2onnx
    → opset_version 7
    → 输出 inference.onnx
    → 校验 inference.yml
    → plain ustar tar
    → evidence closure

注意：

    上述只是规划链路。
    不代表当前允许执行。

## 3.2 Fallback route

fallback：

    Route C
    → standalone Paddle2ONNX

候选：

    Python 3.12.x x64 isolated
    → paddle2onnx 2.1.0 Windows cp312 wheel

仅当：

    PaddleX plugin 路线在受控 bootstrap 中无法闭合

才允许单独评审 standalone fallback。

不得自动切换。

## 3.3 不使用的路径

不得使用：

    未审计的第三方镜像
    未审计的博客脚本
    未审计的 bcebos 旧 tarball
    未审计的 CDN fallback
    任意个人网盘
    任意自动模型下载 fallback

---

# 4. Python 策略

## 4.1 Primary candidate

    Python
    → 3.12.x x64 isolated

原因：

    Paddle2ONNX 2.1.0
    → 存在 Windows cp312 wheel

    PaddlePaddle 3.3.1
    → 存在 Windows cp312 wheel

    独立 scratch
    → 可以避免污染系统 Python

状态：

    PRIMARY_CANDIDATE

注意：

    仍未批准安装 Python 3.12。
    仍未批准创建 venv。

## 4.2 Secondary candidate

当前本机：

    Python
    → D:\Python\python.exe
    → 3.13.7 x64

支持证据：

    PaddleX 3.6.1
    → 支持 Python 3.13

    PaddlePaddle 3.3.1
    → 存在 Windows cp313 wheel

阻塞：

    Paddle2ONNX 2.1.0
    → 未列出 Windows cp313 wheel

状态：

    SECONDARY_CANDIDATE

不得作为唯一执行环境。

## 4.3 系统 Python 保护规则

禁止：

    覆盖 D:\Python\python.exe
    修改系统 Python
    卸载系统 Python package
    将 conversion spike 依赖安装到系统 Python
    修改 PATH
    修改 PowerShell profile

所有转换依赖必须：

    安装到独立 scratch venv

---

# 5. 已确认 artifact ledger

## 5.1 PaddleX

    project
    → paddlex

    version
    → 3.6.1

    wheel
    → paddlex-3.6.1-py3-none-any.whl

    wheel SHA-256
    → a6008bba66703aaf2cfe75185210535c839f87052f9be45501aedb4b02258498

    sdist
    → paddlex-3.6.1.tar.gz

    sdist SHA-256
    → 4c6bdbd81a9fcef6b55c887272b71ba7ef8193bc257762341393420a492fabd7

优先：

    wheel

不得：

    自动 fallback 到 sdist

## 5.2 PaddlePaddle

    project
    → paddlepaddle

    version
    → 3.3.1

    Python 3.12 Windows wheel
    → paddlepaddle-3.3.1-cp312-cp312-win_amd64.whl

    Python 3.12 wheel SHA-256
    → 324b5122cf3887dfbd15db17f36e2421ef923fd4569d26111bf1a21fe84d442b

    Python 3.13 Windows wheel
    → paddlepaddle-3.3.1-cp313-cp313-win_amd64.whl

    Python 3.13 wheel SHA-256
    → 1203e2e1114b49e73a8440b68837ce5c93fdab51fe4838c5e5874ab40f58f747

注意：

    PaddleOCR Windows ONNX 官方路线仍提示 dev / nightly CPU PaddlePaddle。
    stable 3.3.1 与 nightly 路线的选择
    必须在后续 F0-4C-0 中单独确认。

不得：

    未经评审自动选择 stable
    未经评审自动选择 nightly

## 5.3 Paddle2ONNX

    project
    → paddle2onnx

    version
    → 2.1.0

    Python 3.12 Windows wheel
    → paddle2onnx-2.1.0-cp312-cp312-win_amd64.whl

    wheel SHA-256
    → 55fe0b6eba1227b3a9b362a0881f60a3fedb4c6251c3de7d42f0113ab26bbbf9

未列出：

    Windows cp313 wheel

因此：

    Python 3.12.x x64
    → primary candidate

    Python 3.13.7 x64
    → secondary candidate

---

# 6. 仍未锁定的 validation 依赖

尚未锁定精确 artifact：

    onnx
    onnxruntime
    numpy

已知可用：

    PyYAML
    → 本机已有 6.0.3

处理原则：

    F0-4C-0 必须先只读决定：
    1. ONNX graph inspection 是否纳入 bootstrap；
    2. ONNXRuntime validation 是否纳入 bootstrap；
    3. numpy 是否由上游依赖解析；
    4. 是否需要显式锁定；
    5. 是否需要分离 conversion 必需依赖与 validation-only 依赖。

不得：

    在 F0-4C 中顺手安装未经批准的 validation 依赖。

---

# 7. 网络 allowlist

## 7.1 Metadata-only

允许未来仅用于 metadata 核验：

    pypi.org
    github.com
    raw.githubusercontent.com
    paddleocr.ai
    www.paddleocr.ai
    paddlepaddle.github.io
    huggingface.co

## 7.2 Future toolchain install candidates

允许未来在独立批准后用于工具链安装：

    files.pythonhosted.org
    www.paddlepaddle.org.cn
    paddlepaddle.org.cn

注意：

    候选
    ≠
    当前允许下载

## 7.3 Future model redirect candidates

候选：

    cdn-lfs.hf.co
    cas-bridge.xethub.hf.co
    objects.githubusercontent.com

要求：

    F0-4D 前必须通过精确 redirect chain 观察再次确认。

## 7.4 Explicit deny

禁止作为正式模型来源：

    paddle-model-ecology.bj.bcebos.com

旧 bcebos tarball 仅可作为：

    历史 evidence

不得：

    作为正式下载来源
    作为 public/ 复制来源
    作为可复现模型来源

## 7.5 代理阻塞规则

如果 shell proxy 阻止官方 endpoint：

    不绕过代理
    不修改代理配置
    不使用第三方镜像
    不自动切换 host
    停止并输出 BLOCKED_BY_PROXY_ALLOWLIST

---

# 8. 独立 conversion scratch 规划

计划路径：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

候选目录：

    housefolio-phase-10b-1-official-model-conversion-spike/
    ├── README-boundary.txt
    ├── env/
    │   └── venv/
    ├── downloads/
    ├── source-models/
    ├── converted/
    ├── packaged/
    ├── evidence/
    └── logs/

注意：

    本文档不创建目录。

## 8.1 README-boundary.txt

后续创建时必须记录：

    scratch-only
    不得修改 HouseFolio 正式仓库
    不得覆盖 browser-local smoke scratch
    不得自动复制 public/
    不得记录 secret
    不得读取 .env.local 内容
    不得使用第三方镜像
    失败现场必须保留
    每次重跑使用新 runId

## 8.2 venv 规划路径

候选：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\env\venv

不得：

    安装到系统 Python
    安装到 HouseFolio 正式仓库
    安装到 browser-local smoke scratch

---

# 9. evidence 与日志规划

## 9.1 Run ID

规则：

    YYYYMMDD-HHMMSS-<phase>-<attempt>

示例：

    20260603-183000-f0-4c-1-attempt-01

不得覆盖旧 runId。

## 9.2 日志目录

候选：

    logs/<runId>/

至少包含：

    preflight.txt
    stdout.txt
    stderr.txt
    network-summary.txt
    package-resolution.txt
    final-status.txt

## 9.3 evidence 目录

候选：

    evidence/<runId>/

至少包含：

    environment.json
    toolchain.json
    packages.json
    network.json
    files.json
    sha256.json
    decision.txt

## 9.4 禁止记录

不得记录：

    secret
    token
    .env.local 内容
    用户合同
    OCR 文本
    图片
    个人信息

---

# 10. 后续阶段拆分

## 10.1 F0-4C-0

    scratch conversion workspace bootstrap execution preflight
    → read-only approval gate

目标：

    再次核验正式仓库 clean
    核验 browser-local scratch 完整
    核验 conversion scratch 不存在
    核验 Python 3.12 是否存在
    决定是否需要单独安装 Python 3.12
    决定 stable / nightly PaddlePaddle 路线
    决定 validation-only package 范围
    决定代理 allowlist 是否已满足
    输出允许创建的 scratch 文件范围
    输出允许执行的命令范围

禁止：

    创建目录
    创建 venv
    安装
    下载
    转换
    打包

## 10.2 F0-4C-1

    independent scratch workspace creation
    → scratch-only
    → requires separate approval

只允许：

    创建独立 conversion scratch
    创建目录结构
    创建 README-boundary.txt

禁止：

    创建 venv
    安装
    下载模型
    转换
    打包
    修改正式仓库

## 10.3 F0-4C-2

    isolated Python environment bootstrap
    → scratch-only
    → requires separate approval

目标：

    创建隔离 Python 3.12 venv
    升级或锁定 pip
    记录 Python、pip 与 venv evidence

禁止：

    安装 PaddleX
    安装 PaddlePaddle
    安装 Paddle2ONNX
    下载模型
    转换
    打包

## 10.4 F0-4C-3

    controlled toolchain installation
    → scratch-only
    → requires separate approval

目标：

    仅安装精确批准的 conversion 必需依赖
    记录 dependency resolution
    记录 host
    记录 artifact
    记录 SHA-256
    记录 stdout / stderr
    记录失败现场

禁止：

    下载模型
    转换
    打包
    修改正式仓库

## 10.5 F0-4D

    official-source model download
    → scratch-only
    → requires separate approval

## 10.6 F0-4E

    Paddle2ONNX conversion
    → scratch-only
    → requires separate approval

## 10.7 F0-4F

    deterministic plain ustar packaging
    → scratch-only
    → requires separate approval

## 10.8 F0-5

    reproducible model closure evidence review
    → read-only
    → docs-only gate decision

---

# 11. deterministic tar 规则

已确认：

    未压缩 tar
    → required

    --format ustar
    → supported

    -C
    → supported

    explicit entry order
    → required

候选命令结构：

    tar -c --format ustar -f <archive.tar> -C <model-dir> inference.onnx inference.yml

注意：

    当前只是命令结构。
    不允许执行。

仍未关闭：

    mtime normalization
    uid / gid normalization
    mode normalization
    uname / gname normalization
    Windows metadata stability
    cross-run reproducibility

因此：

    deterministic tar policy
    → OPEN_FOR_F0_4F

不阻塞：

    F0-4C scratch bootstrap

---

# 12. Gate 状态

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

    T1 Python strategy
    → READY_FOR_F0_4C_0

    T2 PaddleX
    → READY_FOR_F0_4C_0

    T3 PaddlePaddle
    → OPEN_STABLE_VS_NIGHTLY

    T4 Paddle2ONNX
    → READY_FOR_F0_4C_0

    T5 ONNX validation
    → OPEN_VALIDATION_SCOPE

    T6 PyYAML
    → AVAILABLE_BUT_NOT_LOCKED

    T7 deterministic tar
    → OPEN_FOR_F0_4F

    N1 PyPI metadata
    → BLOCKED_BY_PROXY_ALLOWLIST

    N2 Python artifact host
    → BLOCKED_BY_PROXY_ALLOWLIST

    N3 Hugging Face metadata
    → BLOCKED_BY_PROXY_ALLOWLIST

    N4 Hugging Face redirect host
    → OPEN_FOR_F0_4D

    N5 BCEBOS legacy endpoint
    → DO_NOT_USE

---

# 13. 默认关闭项

继续禁止：

    创建 conversion scratch
    创建目录
    创建 venv
    安装 Python 3.12
    修改系统 Python
    修改 PATH
    修改 PowerShell profile
    安装 Python dependency
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
    自动 add
    自动 commit
    自动 push

---

# 14. 总结论

    PHASE_10B_1_2B_1_F0_4B_2_RESULT
    → PLAN_READY_WITH_GATES

    PYTHON_PRIMARY_CANDIDATE
    → Python 3.12.x x64 isolated

    PYTHON_SECONDARY_CANDIDATE
    → existing Python 3.13.7 x64

    PREFERRED_OFFICIAL_ROUTE
    → PaddleOCR ONNX docs
    → PaddleX paddle2onnx plugin

    CONVERSION_SCRATCH
    → NOT_CREATED

    VENV
    → NOT_CREATED

    TOOLCHAIN_INSTALLATION
    → NOT_GRANTED

    MODEL_DOWNLOAD
    → NOT_GRANTED

    MODEL_CONVERSION
    → NOT_GRANTED

    MODEL_PACKAGING
    → NOT_GRANTED

    NEXT_ACTION
    → Phase 10B-1-2B-1-F0-4C-0
    → scratch conversion workspace bootstrap execution preflight
    → read-only approval gate

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED