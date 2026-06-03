# Phase 10B-1-2B-1-F0-4C-3-1｜Python 3.13 受控 package-resolution probe 计划

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-1-F0-4C-3-1 的 docs-only 计划文档。

它用于：

    固化 Python 3.13 隔离 venv 的当前基线
    固化首次 package-resolution probe 的最小范围
    固化代理与 allowlist gate
    固化 pip index、cache、artifact 与失败现场规则
    固化 Python 3.12 fallback 的触发条件
    防止未经批准的安装、模型下载和转换操作提前发生

本文档不是：

    pip install 批准
    pip install --dry-run 批准
    pip download 批准
    pip wheel 批准
    pip upgrade 批准
    PaddleX 安装批准
    PaddlePaddle 安装批准
    Paddle2ONNX 安装批准
    ONNXRuntime 安装批准
    模型下载批准
    模型转换批准
    tar 打包批准
    public/ocr 复制批准
    src/lib/ocr 创建批准

本文档完成后，下一步只能进入：

    Phase 10B-1-2B-1-F0-4C-3-2
    → official metadata and proxy allowlist closure preflight
    → read-only

不得直接安装 package。

---

# 1. 当前稳定点

正式仓库稳定点：

    HEAD
    main
    origin/main
    remote refs/heads/main
    =
    d3b82e34264d0b165a192767f465f9df8d5b836d

protected stash：

    stash@{0}
    → 8a27c545465dc185f5506311392ab57dc6e67f84

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

.env.local SHA-256：

    d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7

现有 browser-local smoke scratch：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

conversion scratch：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike

README-boundary.txt SHA-256：

    34fce853efb09b83f81e7f5c12920177a0692cb3ecf08972e60787e59ff89aac

隔离 venv：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\env\venv

venv Python：

    Python 3.13.7 x64 AMD64

venv pip：

    pip 25.2
    → ensurepip bootstrap
    → 未升级

venv packages：

    pip
    → only bootstrap package

---

# 2. 上游只读审计结论

Phase 10B-1-2B-1-F0-4C-3-0 已确认：

    PASS_WITH_FINDINGS

    正式仓库
    → clean

    venv
    → isolated
    → Python 3.13.7 x64 AMD64
    → system site packages disabled

    README-boundary.txt
    → unchanged

    downloads
    source-models
    converted
    packaged
    evidence
    logs
    → empty

    dependency installation
    → NOT_RUN

    pip upgrade
    → NOT_RUN

    model download
    → NOT_RUN

主要发现：

    Shell Invoke-WebRequest 访问 PyPI metadata endpoint
    → BLOCKED_BY_PROXY_ALLOWLIST

因此：

    不得直接进入 package installation
    不得直接执行 package-resolution probe
    必须先完成 official metadata and proxy allowlist closure preflight

---

# 3. 官方工具链路线

## 3.1 Primary official route

首选路线：

    PaddleOCR 官方 ONNX 文档
    → PaddleX CLI
    → paddlex --install paddle2onnx
    → paddlex --paddle2onnx
    → opset_version 7

官方文档：

    https://www.paddleocr.ai/main/en/version3.x/deployment/obtaining_onnx_models.html

注意：

    该路线是后续规划路线。
    当前不得执行命令。
    当前不得安装 PaddleX plugin。

## 3.2 Stable PaddleX baseline

官方 PaddleX 页面说明：

    Python
    → 3.8 至 3.13

    PaddleX 3.0.x
    → 依赖 PaddlePaddle 3.0.0 及以上

    CPU 示例：
    python -m pip install paddlepaddle==3.3.0 -i https://www.paddlepaddle.org.cn/packages/stable/cpu/

官方页面：

    https://pypi.org/project/paddlex/

注意：

    stable 示例
    ≠
    已批准的 HouseFolio conversion spike 安装命令

---

# 4. Python 策略

## 4.1 第一优先兼容性探针

当前：

    D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\env\venv\Scripts\python.exe

    → Python 3.13.7 x64 AMD64

状态：

    PRIMARY_COMPATIBILITY_PROBE

后续原则：

    优先在该隔离 venv 中进行最小 package-resolution probe
    不安装到系统 Python
    不修改 PATH
    不激活 venv
    始终使用明确 venv Python 路径

## 4.2 Python 3.12 fallback

Python 3.12.x x64 side-by-side：

    FALLBACK_ONLY_IF_REQUIRED

只有当后续受控 probe 产生明确证据：

    cp313 artifact 不存在
    或
    PaddleX plugin 无法解析 Python 3.13 依赖闭包

才允许：

    单独 docs-only 评审
    side-by-side 安装 Python 3.12
    独立安装目录
    不修改 PATH
    不覆盖 Python 3.13

不得自动切换。
不得现在下载或安装 Python 3.12。

---

# 5. pip 配置与 cache 规则

已知：

    venv pip
    → 25.2

    pip config
    → 未发现 global、user 或 site config 镜像覆盖

    proxy environment variables
    → present
    → values redacted

    user-level pip cache
    → exists
    → 当前 cache 内容为空或未发现可复用 artifact

后续 probe 必须：

    使用明确 venv Python 路径
    使用明确官方 index
    使用 --no-cache-dir
    禁止自动 fallback 到未批准 index
    禁止使用第三方镜像
    记录实际请求 host
    记录实际解析结果
    记录 stdout
    记录 stderr
    记录 exit code
    保留失败现场

不得：

    purge pip cache
    修改 pip config
    修改 proxy config
    输出 proxy secret
    输出 token

---

# 6. 首次 package-resolution probe 最小范围

首次 probe 只能用于：

    观察 Python 3.13 环境中的官方工具链依赖解析
    确认 cp313 compatibility
    确认代理 allowlist 是否满足
    确认 official artifact host
    确认依赖闭包
    确认是否需要 Python 3.12 fallback 评审

首次 probe 不得：

    下载模型
    解压模型
    转换模型
    打包 tar
    修改正式仓库
    修改 browser-local scratch
    自动复制 public/
    自动切换 Python 3.12
    顺手扩大 validation-only 依赖范围

---

# 7. 候选 package 分层

## 7.1 Layer 1：conversion compatibility probe

候选：

    PaddleX
    → paddlex 3.6.1

    PaddlePaddle
    → stable 3.3.1 candidate
    → stable vs nightly 仍需单独收敛

    Paddle2ONNX
    → PaddleX plugin route
    → 真实依赖闭包仍需观测

注意：

    上述均为 candidate。
    不是当前安装批准。

## 7.2 Layer 2：validation-only dependencies

候选：

    onnx
    onnxruntime
    PyYAML
    numpy

处理原则：

    单独评审
    不在首次 probe 中顺手安装
    不在 Layer 1 中隐式扩大范围

## 7.3 Layer 3：模型下载

单独阶段。

## 7.4 Layer 4：模型转换

单独阶段。

## 7.5 Layer 5：tar 打包

单独阶段。

---

# 8. package-resolution probe 语义 gate

后续必须在独立 docs-only 评审中决定：

    是否仅执行 metadata GET
    是否执行 pip install --dry-run
    是否执行 pip install --dry-run --report
    是否执行 pip download --no-deps
    是否允许下载 wheel
    是否允许下载 sdist
    是否要求 --only-binary :all:
    是否要求 --no-deps
    是否逐包拆分
    是否允许 PaddleX plugin 解析传递依赖
    是否先 stable 后 nightly
    是否允许 standalone paddle2onnx fallback

当前默认：

    pip install
    → NOT_GRANTED

    pip install --dry-run
    → NOT_GRANTED

    pip download
    → NOT_GRANTED

    wheel download
    → NOT_GRANTED

    sdist download
    → NOT_GRANTED

---

# 9. official metadata and proxy allowlist gate

在进入任何 package-resolution probe 之前，必须先完成：

    Phase 10B-1-2B-1-F0-4C-3-2
    → official metadata and proxy allowlist closure preflight
    → read-only

必须核验：

    pypi.org metadata endpoint
    files.pythonhosted.org artifact host
    www.paddlepaddle.org.cn stable CPU index
    PaddlePaddle nightly CPU index
    当前 shell proxy
    允许访问的 host
    被阻塞的 host
    是否需要人工调整 allowlist
    是否可以在不绕过代理的情况下读取官方 metadata
    是否可以在不下载 artifact 的情况下完成 ledger

如果仍被阻塞：

    STOP
    不绕过代理
    不修改代理配置
    不使用第三方镜像
    不安装 package

---

# 10. 后续阶段拆分

## 10.1 F0-4C-3-2

    official metadata and proxy allowlist closure preflight
    → read-only

## 10.2 F0-4C-3-3

    package-resolution probe execution plan
    → docs-only

前置条件：

    F0-4C-3-2
    → PASS_WITH_CLOSURE

## 10.3 F0-4C-3-4

    controlled Python 3.13 package-resolution probe
    → scratch-only
    → requires separate approval

目标：

    只执行精确批准的最小 probe
    记录解析结果
    记录 host
    记录 artifact
    记录 hash
    记录失败现场

禁止：

    下载模型
    转换模型
    打包 tar

## 10.4 Python 3.12 fallback review

仅在：

    明确 cp313 incompatibility

时进入。

---

# 11. 当前 gate 状态

    VENV
    → READY

    PYTHON_3_13
    → PRIMARY_COMPATIBILITY_PROBE

    PYTHON_3_12
    → FALLBACK_ONLY_IF_REQUIRED

    PIP_CONFIG
    → REVIEWED

    PIP_CACHE
    → REVIEWED
    → USE_NO_CACHE_DIR_LATER

    PYPI_METADATA
    → BLOCKED_BY_PROXY_ALLOWLIST

    PACKAGE_INSTALLATION
    → NOT_GRANTED

    MODEL_DOWNLOAD
    → NOT_GRANTED

    MODEL_CONVERSION
    → NOT_GRANTED

    TAR_PACKAGING
    → NOT_GRANTED

---

# 12. 当前禁止事项

继续禁止：

    修改正式仓库
    修改 browser-local scratch
    修改 README-boundary.txt
    激活 venv
    修改 PATH
    修改 PowerShell profile
    修改系统 Python
    安装 Python 3.12
    pip install
    pip uninstall
    pip upgrade
    pip download
    pip wheel
    pip cache purge
    下载 wheel
    下载 sdist
    下载模型
    解压模型
    转换模型
    打包 tar
    自动复制 public/
    创建 src/lib/ocr
    修改 package.json
    修改 package-lock.json
    修改 next.config.ts

---

# 13. 总结论

    PHASE_10B_1_2B_1_F0_4C_3_1_RESULT
    → PLAN_READY_WITH_PROXY_GATE

    VENV
    → READY

    PYTHON_PRIMARY_COMPATIBILITY_PROBE
    → Python 3.13.7 x64 AMD64

    PYPI_METADATA
    → BLOCKED_BY_PROXY_ALLOWLIST

    PACKAGE_INSTALLATION
    → NOT_GRANTED

    MODEL_DOWNLOAD
    → NOT_GRANTED

    MODEL_CONVERSION
    → NOT_GRANTED

    NEXT_ACTION
    → Phase 10B-1-2B-1-F0-4C-3-2
    → official metadata and proxy allowlist closure preflight
    → read-only

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED