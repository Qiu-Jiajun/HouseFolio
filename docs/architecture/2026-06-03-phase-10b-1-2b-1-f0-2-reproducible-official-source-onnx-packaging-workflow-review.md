# Phase 10B-1-2B-1-F0-2｜可复现官方来源 ONNX 转换与打包工作流边界评审

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2B-1-F0-2 的 docs-only 边界评审文档。

它用于：

    记录现有两个 ONNX tarball 的来源链缺口
    阻止未经审计的 tarball 进入正式 public/
    固化官方来源、可复现转换、可复现打包和许可证记录原则
    为后续 scratch-only conversion spike plan 提供边界
    保持 G3 在证据充分前处于阻塞状态

本文档不是：

    模型下载批准
    模型转换批准
    模型解压批准
    模型重新打包批准
    public/ocr 资产复制批准
    src/lib/ocr 创建批准
    正式 OCR provider 实现批准
    Python 依赖安装批准
    PaddleX 安装批准
    Paddle2ONNX 执行批准
    Next.js Worker 验证批准

---

# 1. 当前稳定点

本文档写入前的稳定点：

    HEAD
    main
    origin/main
    =
    1d931b937135489e561588837ebd1269a1a5f5e5

protected stash：

    stash@{0}
    → 8a27c545465dc185f5506311392ab57dc6e67f84

    stash@{0}^3
    → 60137e8e3bb7faae9eacac510a6bb2228901a227

.env.local SHA-256：

    d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7

scratch workspace：

    D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke

---

# 2. 上游只读审计结论

Phase 10B-1-2B-1-0 已确认：

    G1 正式依赖树
    → READY_TO_DOCUMENT

    G2 静态资产复制范围
    → PARTIALLY_DEFINED

    G3 模型再分发依据
    → BLOCKED_PENDING_EVIDENCE

    G4 THIRD_PARTY_NOTICES
    → PARTIALLY_DEFINED

    G5 single-thread baseline
    → APPROVED_FOR_BASELINE_PLAN

    G6 no CSP / COOP / COEP change
    → NO_HEADER_CHANGE

    G7 Next.js Worker 打包
    → OPEN_BUT_NARROWED

    G8 src/lib/ocr 文件范围
    → PROVISIONALLY_DEFINED

Phase 10B-1-2B-1-F0-1 进一步确认：

    现有两个 ONNX tarball
    → DO_NOT_COPY_TO_PUBLIC

    G3
    → BLOCKED_PENDING_EVIDENCE

---

# 3. 现有 tarball 的锁定信息

## 3.1 Detection

    fileName
    → PP-OCRv5_mobile_det_onnx.tar

    sizeBytes
    → 4830208

    sha256
    → 236be1ff426a393717f792b59612bd417e8f8d7650109ffc875fa73eebd2b95a

    inference.yml model_name
    → PP-OCRv5_mobile_det

## 3.2 Recognition

    fileName
    → PP-OCRv5_mobile_rec_onnx.tar

    sizeBytes
    → 16712192

    sha256
    → 8ddeeca7015545d5a0e9c21a3ec4b24fff7b3bee15b68f958d737e01b44500d0

    inference.yml model_name
    → PP-OCRv5_mobile_rec

## 3.3 现有 tarball 的问题

已经可以确认：

    PaddleOCR.js 本地安装包定义了对应 bcebos 下载 URL
    scratch smoke 使用了本地 tarball
    两个 tarball 可以完成受控浏览器 OCR smoke
    两个 tarball 的 SHA-256 已锁定

仍未确认：

    两个具体 tarball 的逐文件许可证
    两个具体 tarball 的 ONNX 转换工具版本
    两个具体 tarball 的 ONNX 转换参数
    两个具体 tarball 的 tar 打包执行者
    两个具体 tarball 的 tar 打包命令
    两个具体 tarball 的 NOTICE 要求
    两个具体 tarball 是否允许原样复制到 HouseFolio public/

因此：

    Existing tarballs
    → DO_NOT_COPY_TO_PUBLIC

---

# 4. 官方来源基线

## 4.1 PaddleOCR 官方仓库

官方仓库：

    https://github.com/PaddlePaddle/PaddleOCR

许可证：

    Apache License 2.0

## 4.2 官方模型页面

Detection：

    https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_det

Recognition：

    https://huggingface.co/PaddlePaddle/PP-OCRv5_mobile_rec

两个官方模型页面均标注：

    License
    → apache-2.0

## 4.3 PaddleOCR.js 官方浏览器部署文档

官方文档：

    https://www.paddleocr.ai/latest/en/version3.x/inference_deployment/cross_platform/browser.html

官方文档要求自定义模型资产：

    必须是未压缩 .tar
    必须包含 inference.onnx
    必须包含 inference.yml
    inference.yml 中 model_name 必须匹配
    不符合要求时初始化失败
    不应静默 fallback

## 4.4 官方 ONNX 转换文档

官方文档：

    https://www.paddleocr.ai/main/en/version3.x/deployment/obtaining_onnx_models.html

官方文档说明：

    使用 PaddleX CLI 安装 Paddle2ONNX 插件
    使用 paddlex --paddle2onnx 执行转换
    输入 Paddle model directory
    输出 ONNX model directory
    记录 opset version

---

# 5. 可复现工作流原则

后续如需生成 HouseFolio 可公开部署的本地 OCR 模型闭包，必须满足：

    官方模型来源
    官方或一手许可证证据
    原始模型文件清单
    原始模型 SHA-256
    模型下载 URL
    下载时间
    转换工具名称
    转换工具版本
    Python 版本
    PaddleX 版本
    Paddle2ONNX 插件版本
    PaddlePaddle 版本
    转换命令
    转换参数
    opset version
    生成的 inference.onnx SHA-256
    保留或生成的 inference.yml SHA-256
    inference.yml model_name
    tar 打包命令
    tar archive format
    tarball SHA-256
    tarball sizeBytes
    LICENSE 归属
    attribution
    NOTICE 要求
    THIRD_PARTY_NOTICES 记录
    manifest 记录

缺失任意关键证据时：

    G3
    → 不得关闭

---

# 6. 建议的可复现转换链路

建议后续单独评审：

    PaddlePaddle 官方模型来源
    → 下载到独立 scratch conversion workspace
    → 锁定原始模型 SHA-256
    → 使用官方 PaddleX paddle2onnx 工作流转换
    → 生成 inference.onnx
    → 保留或生成 inference.yml
    → 校验 model_name
    → 使用未压缩 ustar tar 打包
    → 锁定 tarball SHA-256
    → 生成 evidence manifest
    → 单独评审再分发条件
    → 通过后才允许复制到正式 public/

禁止：

    直接复用来源链不完整的旧 tarball
    跳过原始模型 SHA-256
    跳过转换工具版本
    跳过转换命令
    跳过 tar 打包命令
    使用压缩 tar.gz
    没有 LICENSE / attribution 记录
    未经评审进入 public/

---

# 7. 后续阶段拆分

## 7.1 Phase 10B-1-2B-1-F0-3

    reproducible official-source conversion spike plan
    → docs-only
    → scratch-only execution plan
    → no download
    → no install
    → no conversion

目标：

    确定独立 scratch conversion workspace
    确定允许下载的官方来源
    确定工具链候选
    确定证据 manifest
    确定失败现场保留规则
    确定网络请求白名单
    确定许可证记录方式
    确定转换后验证方式

## 7.2 Phase 10B-1-2B-1-F0-4

    official-source conversion spike execution
    → scratch-only
    → requires separate approval

允许范围：

    独立 scratch conversion workspace

禁止：

    修改 HouseFolio 正式仓库
    覆盖现有 browser-local smoke scratch
    直接复制到 public/
    创建 src/lib/ocr
    修改 config
    开始 UI

## 7.3 Phase 10B-1-2B-1-F0-5

    reproducible model closure evidence review
    → read-only
    → docs-only gate decision

目标：

    校验原始模型 SHA-256
    校验工具链版本
    校验转换命令
    校验 inference.onnx
    校验 inference.yml
    校验 model_name
    校验 tar archive
    校验 tarball SHA-256
    校验许可证
    校验 attribution
    校验 NOTICE
    决定 G3 是否可以关闭

---

# 8. Gate 状态

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

# 9. 当前禁止事项

继续禁止：

    下载模型
    安装 PaddleX
    安装 Paddle2ONNX
    安装 Python 依赖
    解压模型
    转换模型
    重新打包模型
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

# 10. 总结论

    PHASE_10B_1_2B_1_F0_2_RESULT
    → CLOSED_WITH_PLAN

    EXISTING_TARBALLS
    → DO_NOT_COPY_TO_PUBLIC

    G3
    → BLOCKED_PENDING_REPRODUCIBLE_WORKFLOW

    NEXT_ACTION
    → Phase 10B-1-2B-1-F0-3
    → reproducible official-source conversion spike plan
    → docs-only

    IMPLEMENTATION_PERMISSION
    → NOT_GRANTED