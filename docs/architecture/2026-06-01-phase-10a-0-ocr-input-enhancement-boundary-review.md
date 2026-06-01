# Phase 10A-0｜OCR input enhancement boundary review

## 0. 文档定位

本文档用于评审 HouseFolio Phase 10 的合同输入增强边界。

本阶段名称：

    Phase 10A-0：
    OCR input enhancement boundary review

本阶段只做 docs-only 架构边界评审。

本阶段不修改 `src`，不新增依赖，不安装 `@paddleocr/paddleocr-js`，不接入 PaddleOCR，不启动 OCR 服务，不启动 dev server，不上传图片，不调用云 OCR，不调用真实 DeepSeek，不修改 `.env.local`、README、`package.json`、`package-lock.json` 或任何配置，不恢复或删除 stash。

本文档确认后，下一步只能进入：

    Phase 10B：
    OCR technical spike

不得在本轮自动开始 Phase 10B 实现。

---

## 1. Phase 10 与 Phase 9 的关系

Phase 10 只增强输入，不重写 Phase 9。

Phase 9 已经关闭的能力保持冻结：

    用户粘贴完整合同文本
    浏览器本地切分全部条款
    浏览器本地自动脱敏全部条款
    本地规则扫描全部条款
    用户查看完整脱敏合同预览
    用户明确确认一次
    上传完整脱敏合同 + rule signals
    服务端防御性二次脱敏和 schema 校验
    DeepSeek provider 只返回结构化解释
    UI 展示规则解释和补充关注项
    输出 session-only

Phase 10 不改变：

    L2 风险规则模型
    L2-owned riskLevel
    法规依据 mapping
    AI-safe redacted input builder
    服务端 defensive re-redaction
    no-store
    reasoning_content 隔离
    Phase 9 发送前确认
    session-only AI 输出

Phase 10 的职责是把“用户只能粘贴文本”扩展为“用户可以从本机合同图片提取文本，再人工校对后进入 Phase 9 文本链路”。

OCR 是 Phase 9 文本输入之前的辅助输入层，不是新的合同审查引擎。

---

## 2. Phase 9 freeze line

Phase 9 只能因新的 P0 blocker 重新打开，例如：

    原始 PII 明显泄漏
    用户确认前发生网络请求
    mock path 调用 DeepSeek
    provider 错误静默 fallback
    AI 覆盖 L2 riskLevel
    无规则命中合同无法继续审查
    session-only 输出意外持久化
    reasoning_content 暴露
    核心页面不可用

以下内容不得借 Phase 10 回写 Phase 9：

    重做合同结果卡片
    重做风险等级体系
    重做法规依据模型
    重做 DeepSeek prompt
    重做 server route
    重做 redaction policy
    改变 Phase 9 的确认语义
    引入合同历史或云存储

如果 Phase 10 发现 OCR 文本质量问题，只能在 OCR 输入层、人工校对层或 Phase 10B spike 结论里处理，不应改动 Phase 9 已锁定的审查链路。

---

## 3. 已锁定的产品决定

Phase 10A-0 锁定以下产品方向。

第一，合同图片只作为本机输入来源。

    图片不得离开设备
    图片不得上传到 HouseFolio 服务端
    图片不得进入 DeepSeek
    图片不得进入 Supabase
    图片不得进入对象存储
    图片不得进入 analytics
    图片不得持久化到 localStorage 或 IndexedDB

第二，OCR 文本在确认前保持 session-only。

    未确认 OCR 文本不得上传
    未确认 OCR 文本不得保存
    刷新页面应清除未确认 OCR 文本
    清空输入应清除 OCR 中间状态

第三，用户必须人工校对 OCR 文本。

    OCR 结果不能直接自动进入 AI 审查
    OCR 结果不能绕过 Phase 9 的完整脱敏预览
    用户需要确认 OCR 文本已经可用于后续审查

第四，Phase 9 发送前确认继续存在。

    OCR 文本确认不是 AI 发送确认
    Phase 9 完整脱敏预览不能被跳过
    Phase 9 AI 发送前确认不能被替换

第五，第一版明确排除 PDF。

    PDF 解析
    PDF 多页渲染
    PDF 内嵌文本提取
    PDF 图片页 OCR
    PDF 上传

以上均不进入 Phase 10 第一版。

---

## 4. 多图片合同 OCR 用户流程

建议的第一版用户流程：

    用户进入合同审查页
    → 选择“从图片识别合同文本”
    → 从本机选择多张合同图片
    → 浏览器生成缩略图预览
    → 用户检查页序
    → 用户拖拽排序
    → 用户可以删除单页
    → 用户可以继续追加图片
    → 用户确认一次图片隐私知晓
    → 浏览器按页执行本机 OCR
    → UI 展示每页 OCR 状态
    → 成功页生成 OCR 文本
    → 失败页显示失败状态并允许单独重试
    → 默认合并全部成功页文本
    → 用页码分隔符保留来源边界
    → 用户人工校对合并文本
    → 用户确认 OCR 文本
    → OCR 文本进入 Phase 9 已有文本输入链路
    → Phase 9 生成完整脱敏预览
    → 用户执行 Phase 9 AI 发送前确认

OCR 失败不应清空已成功页面。

如果第 3 页失败而第 1、2、4 页成功，应保留成功页文本，并让用户决定：

    单独重试失败页
    删除失败页
    手动补录失败页
    暂不使用失败页继续校对

---

## 5. 图片数量上限

第一版至少支持 10 张图片。

Phase 10A-0 建议把具体上限评审在：

    12 至 15 张

推荐 Phase 10B spike 优先验证：

    默认上限：12 张
    可评估上限：15 张

理由：

    普通租赁合同拍照页数通常能被 10 张覆盖
    12 张为漏拍、封面、补充协议留出余量
    15 张可以覆盖较长合同但会增加 OCR 总耗时、内存压力和取消复杂度
    更高上限会放大 Worker、WASM、模型加载、图片解码和移动端内存风险

第一版不应支持无限图片。

超出上限时，UI 应阻止继续追加，并提示用户删除不需要的图片或等待未来 PDF / 批处理能力。

---

## 6. 多页编辑能力边界

第一版应具备以下基础输入能力。

缩略图预览：

    每张图片显示轻量缩略图
    缩略图只服务于页序确认
    不应把原图上传或缓存到远端
    不应生成可持久化分享链接

拖拽排序：

    用户可调整页序
    OCR 合并顺序以当前页序为准
    排序变更后应标记合并文本需要重新生成或重新确认

单页删除：

    用户可删除误选页面
    删除后释放对应 object URL 和中间 OCR 状态
    删除成功页后应同步移除其文本

继续追加：

    用户可继续选择图片追加到末尾
    追加后仍受总页数上限约束
    追加页面应独立进入 pending 状态

每页 OCR 状态：

    pending
    queued
    recognizing
    succeeded
    failed
    canceled

按页 OCR：

    每页有独立任务边界
    失败页可单独重试
    已成功页不应因其他页失败而被清空

---

## 7. 默认合并文本策略

第一版默认生成一个合并文本输入给 Phase 9。

合并格式建议：

    --- 第 1 页 ---
    <第 1 页 OCR 文本>

    --- 第 2 页 ---
    <第 2 页 OCR 文本>

页码分隔符的目的：

    保留合同页面来源
    方便用户定位 OCR 错误
    方便失败页补录
    帮助 Phase 9 切分时保留自然顺序

页码分隔符不是法律条款，不应被展示为风险依据。

如果 Phase 9 条款切分将页码分隔符识别成独立短句，后续可以在 Phase 10B 或 Phase 10C 评估文本规范化策略，但本轮不修改 Phase 9。

---

## 8. 三个确认节点

Phase 10 引入 OCR 后，必须区分三个确认节点。

### 8.1 上传前一次隐私知晓确认

该确认发生在本机 OCR 前或 OCR 启动前。

目的：

    告知用户图片只在本机处理
    告知用户不要选择与合同无关的敏感照片
    告知用户 OCR 可能出错
    告知用户后续必须人工校对

该确认不是 AI 发送确认。

### 8.2 OCR 文本人工校对确认

该确认发生在 OCR 文本生成后。

目的：

    用户确认 OCR 文本已经经过人工检查
    用户确认页序基本正确
    用户确认可以把该文本交给 Phase 9 脱敏和规则链路

该确认不是 DeepSeek 调用许可。

### 8.3 Phase 9 AI 发送前确认

该确认发生在 Phase 9 完整脱敏预览之后。

目的：

    用户确认脱敏后的合同文本可以发送
    用户确认只上传 redacted clauses + rule signals
    用户确认启动 AI 辅助审查

该确认必须保留，不得被 OCR 文本确认替代。

---

## 9. 隐私和数据生命周期

图片生命周期：

    仅来自用户本机选择
    仅存在于当前浏览器 session
    仅用于本机 OCR
    不上传
    不持久化
    不进入 DeepSeek
    不进入错误日志
    不进入 analytics
    删除页面或清空输入时释放引用

未确认 OCR 文本生命周期：

    session-only
    刷新页面清除
    清空输入清除
    不自动上传
    不自动持久化
    不进入本地历史

确认后的 OCR 文本：

    仅作为 Phase 9 文本输入
    仍需走 Phase 9 本地脱敏
    仍需完整脱敏预览
    仍需 AI 发送前确认

任何“图片进入云端识别后再返回文本”的路径均不属于第一版。

---

## 10. 严格禁止能力

本阶段和第一版 OCR 输入增强严格禁止：

    图片离开设备
    图片进入 DeepSeek
    静默云 OCR fallback
    未经评审的外部 CDN fallback
    自动上传原图
    自动上传未确认 OCR 文本
    OCR 文本绕过人工校对
    OCR 文本绕过 Phase 9 完整脱敏预览
    OCR 文本绕过 Phase 9 AI 发送前确认
    PDF 第一版
    Supabase
    对象存储
    Chrome 插件
    UI redesign
    真实 DeepSeek 回归
    安装 OCR 依赖
    实现 OCR provider

禁止静默 fallback 的含义是：

    如果本机 OCR 不可用，应明确失败
    不得悄悄改用云 OCR
    不得悄悄加载第三方 CDN 脚本
    不得悄悄上传图片换取文本

---

## 11. PaddleOCR.js 官方能力审计摘要

基于已完成的官方资料审计结论，PaddleOCR 官方已经提供 PaddleOCR.js。

npm 包：

    @paddleocr/paddleocr-js

已确认官方能力包括：

    浏览器客户端运行 PP-OCR
    PP-OCRv5
    Blob / File 输入
    多图片数组输入
    OcrResult[] 输出
    Worker 模式
    ONNX Runtime Web
    OpenCV.js

因此 Phase 10B 的第一优先验证候选是：

    浏览器侧 PaddleOCR.js
    + PP-OCRv5
    + Worker 模式
    + 显式配置 WASM 路径
    + 模型与静态资源自托管评估

本结论只是 spike 候选，不是最终选型。

Phase 10A 不安装依赖，不写 provider，不承诺生产可用。

---

## 12. PP-OCRv5 首轮轻量基线

Phase 10B 建议首轮验证：

    PP-OCRv5_mobile_det
    PP-OCRv5_mobile_rec

作为轻量基线。

验证重点：

    中文租赁合同图片识别质量
    手机拍照倾斜文本的检测效果
    模糊、阴影、折痕场景下的失败形态
    首次模型加载耗时
    单页 OCR 耗时
    12 页连续 OCR 内存峰值
    Worker 初始化和销毁行为
    WASM 路径配置稳定性
    OpenCV.js 加载策略

不得在 10A 宣布最终模型组合。

---

## 13. 模型、WASM、OpenCV 静态资源治理

OCR 能力涉及模型文件、WASM 文件、OpenCV.js 和 Worker 脚本。

Phase 10B 必须评估：

    资源是否能够自托管
    是否能显式配置资源路径
    是否能避免运行时外部 CDN
    资源版本是否能锁定
    资源 hash 是否能校验
    资源是否会进入 Next.js client bundle
    资源是否应放入 public 静态目录
    资源是否会影响 build 输出体积
    资源是否会被浏览器缓存
    资源释放和 Worker 销毁是否可靠

Next.js 本地文档提醒：

    大型 client 依赖会影响 bundle size
    自托管静态资源需要关注缓存和部署一致性
    CSP 需要显式允许 WASM 相关执行策略
    未经评审的外部脚本和资源域会扩大安全边界

因此，Phase 10B 不应只验证“能跑”，还要验证“资源如何被治理”。

---

## 14. lib/ocr provider abstraction

如果 Phase 10B spike 通过，后续实现建议建立：

    lib/ocr

候选边界：

    OcrProvider
    OcrPageInput
    OcrPageResult
    OcrPageStatus
    OcrSession
    OcrCancellationToken

provider abstraction 的目标：

    隔离 PaddleOCR.js 具体 API
    隔离 Worker 初始化细节
    隔离模型路径配置
    统一按页状态
    统一取消行为
    统一失败页重试
    保护 UI 不依赖 vendor result shape

第一版只允许浏览器本机 provider。

不得通过 abstraction 暗中加入 cloud provider。

---

## 15. Worker、WASM、headers、bundler 与资源释放风险

Phase 10B 必须验证以下风险。

Worker：

    是否支持独立 Worker 模式
    Worker 是否能被取消或终止
    Worker 崩溃时 UI 是否能恢复
    多页任务是否串行、限并发或队列化

WASM：

    WASM 路径是否可配置
    CSP 是否需要 wasm-unsafe-eval
    开发与生产行为是否一致
    静态部署路径是否稳定

Headers：

    如果后续启用更严格 CSP，需要明确 script-src、worker-src、connect-src、img-src、blob:、data: 和 WASM 策略
    不得为了 OCR 随意放宽全站 CSP

Bundler：

    PaddleOCR.js、ONNX Runtime Web、OpenCV.js 不应无审计地进入主交互 bundle
    应评估 lazy loading 和 route-level loading
    应评估模型文件是否被误打包

资源释放：

    删除单页时释放 object URL
    取消任务时停止后续页
    离开页面时终止 Worker
    清空输入时清理 OCR session
    失败重试不泄漏旧任务

---

## 16. 人工编辑保护

用户一旦开始人工编辑 OCR 文本，系统必须保护用户修改。

建议规则：

    OCR 重新运行不得静默覆盖人工编辑
    页序变化后需要提示重新合并
    单页重试成功后只更新该页原始 OCR 文本
    合并文本如果已被用户编辑，应要求用户确认是否重新生成
    用户手写补录的失败页内容不得被重试结果静默覆盖

目标是避免：

    用户校对半小时后被系统覆盖
    用户以为自己提交的是校对版，实际提交的是旧 OCR 原文

---

## 17. OCR 取消行为

第一版需要可解释的取消语义。

建议：

    OCR 运行中允许取消剩余任务
    已完成页保留成功结果
    正在运行页标记为 canceled 或 failed
    未开始页回到 pending
    取消不清空用户已编辑合并文本
    取消后允许继续重试单页或重新运行全部页

取消不是失败。

取消也不是上传中止，因为第一版图片不上传。

---

## 18. 桌面端优先与移动端边界

第一版应优先桌面端。

原因：

    多图排序更适合桌面
    人工校对长合同更适合桌面
    Worker、WASM、模型加载和内存压力在桌面更可控
    租客通常也更可能在桌面完成签约前审查

移动端第一版边界：

    可以允许选择图片
    可以查看基础状态
    不承诺完整拖拽体验
    不承诺 12 至 15 张稳定性能
    不承诺低端设备可用

移动端优化应后置。

---

## 19. 后置能力

以下能力可以进入后续 backlog，但不进入第一版：

    PDF 输入
    单页透视矫正
    自动裁边
    表格结构恢复
    合同目录识别
    手写批注识别
    双栏文本重排
    多语言 OCR
    OCR 置信度可视化
    ZIP 备份
    本地 OCR 历史
    IndexedDB 保存 OCR session
    云端 OCR
    对象存储
    移动端专门拍照流程

后置不代表默认允许。

任何涉及图片持久化、云处理或外部资源加载的能力都必须另做边界评审。

---

## 20. 仍待 Phase 10B 验证的问题

Phase 10B 必须至少验证：

    PaddleOCR.js 在当前 Next.js 16 / Turbopack 项目中的导入方式
    Worker 模式是否能在浏览器端稳定运行
    PP-OCRv5_mobile_det / rec 资源路径配置
    WASM 与 OpenCV.js 的自托管路径
    是否会触发 CSP 或 cross-origin 限制
    首次加载耗时
    单页耗时
    12 页任务总耗时
    12 页内存峰值
    失败页重试
    取消与 Worker 释放
    bundle size 影响
    build 是否通过
    离线或资源加载失败时是否明确失败

Phase 10B 产出应该是技术 spike 结论，而不是直接产品实现。

---

## 21. Phase 10B 技术 spike 建议

建议 Phase 10B 只做最小验证：

    单独 spike branch
    不接入正式合同审查 UI
    不调用 DeepSeek
    不上传图片
    不保存 OCR 文本
    不引入云 fallback
    使用测试图片或合成样例
    验证 build
    记录资源路径和加载行为

建议 spike 判断标准：

    本机浏览器可运行
    图片不离开设备
    Worker 可初始化和终止
    WASM / 模型 / OpenCV 路径可治理
    失败可见且不静默 fallback
    性能可以支撑 10 至 12 页

如果 spike 不通过，Phase 10 应回到候选方案评审，而不是强行实现。

---

## 22. 本轮禁止项

本轮禁止：

    修改 src/**
    修改 package.json
    修改 package-lock.json
    修改 .env.local
    修改 README.md
    修改现有 closing checkpoint
    修改任何配置
    修改任何 stash
    npm install
    npx ...
    安装 @paddleocr/paddleocr-js
    接入 PaddleOCR
    启动 OCR 服务
    启动 dev server
    浏览器 smoke
    云 OCR
    上传图片
    真实 DeepSeek
    PDF
    Supabase
    对象存储
    Chrome 插件
    UI redesign

本轮唯一允许新增文件：

    docs/architecture/2026-06-01-phase-10a-0-ocr-input-enhancement-boundary-review.md

---

## 23. 结论

Phase 10A-0 的结论是：

    可以进入 OCR 输入增强方向
    但第一版只允许本机多图片 OCR
    图片必须 session-only
    未确认 OCR 文本必须 session-only
    用户必须人工校对 OCR 文本
    Phase 9 完整脱敏预览和 AI 发送前确认必须保留
    禁止云 OCR fallback
    禁止未经评审的外部 CDN fallback
    禁止 PDF 第一版
    禁止自动进入实现

Phase 10B 的第一优先 spike 候选是：

    浏览器侧 PaddleOCR.js
    PP-OCRv5_mobile_det / PP-OCRv5_mobile_rec
    Worker 模式
    显式 WASM / OpenCV / 模型路径治理
    静态资源自托管评估

该候选仍需验证，不是最终选型。

下一步不得自动开始实现。
