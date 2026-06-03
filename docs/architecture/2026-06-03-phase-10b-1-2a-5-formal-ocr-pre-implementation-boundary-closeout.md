# Phase 10B-1-2A-5｜正式 OCR 封装前边界评审总收口

## 0. 文档用途

本文档是 HouseFolio Phase 10B-1-2A 的 docs-only 总收口文档。

它用于：

```
统一收束 Phase 10B-1-2A-1 至 A-4 的评审结论
将分散条件转化为正式实现前置闸门
锁定后续实现阶段拆分
防止正式 OCR 集成一次性扩大 scope
防止 OCR 输入增强侵入或重写 Phase 9 文本审查链路
```

本文档不是：

```
正式 OCR 实现计划
Codex Task Packet
依赖安装批准
静态资产复制批准
src/lib/ocr 创建批准
next.config.ts 修改批准
CSP / COOP / COEP 配置批准
正式 OCR 页面开发批准
多图片 UI 开发批准
```

本文档完成后，下一阶段仍然只能进入：

```
Phase 10B-1-2B-0
→ 正式 OCR provider 最小闭包实现计划评审
→ docs-only
```

不得直接开始编码。

---

## 1. 权威来源与冲突处理顺序

Phase 10 后续动作必须继续遵守：

```
第一优先级：
《HouseFolio Phase 10 Harness｜多图片本地 OCR 合同输入增强总约束 v1.0.md》

第二优先级：
《HouseFolio Phase 9M-R Harness｜全文脱敏合同风险提示链路总约束 v1.0.md》

第三优先级：
最新 HouseFolio 接续文档

第四优先级：
实时 Git、stash、.env.local 指纹、scratch workspace 与仓库源码状态
```

发现冲突时：

```
不要猜测
不要自动修复
不要覆盖 evidence
不要清理 scratch
不要继续实现
先停止并说明冲突
```

---

## 2. 当前项目停点

当前接续文档记录的稳定快照：

```
HEAD
main
origin/main
=
8f63bd5c738e3cbc03d617084db6906e22fd1196
```

protected stash：

```
stash@{0}
→ 8a27c545465dc185f5506311392ab57dc6e67f84

stash@{0}^3
→ 60137e8e3bb7faae9eacac510a6bb2228901a227
```

.env.local SHA-256：

```
d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7
```

scratch workspace：

```
D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke
```

注意：

```
以上是文档记录的稳定快照。
任何后续正式写入前仍需重新只读核验。
scratch 是技术验证证据现场，不是生产代码来源。
```

---

## 3. 已完成阶段

```
Phase 9
→ 文本版合同风险提示 MVP
→ CLOSED_WITH_PASS

Phase 10A-0
→ 多图片本地 OCR 输入增强边界评审
→ CLOSED

Phase 10B-0
→ PaddleOCR.js browser-local technical spike boundary review
→ CLOSED

Phase 10B-1-0
→ browser-local feasibility smoke plan
→ CLOSED

Phase 10B-1-1A
→ candidate package and asset inspection
→ COMPLETED

Phase 10B-1-1B
→ single synthetic image browser-local feasibility smoke
→ CLOSED_WITH_PASS

Phase 10B-1-2A-0
→ 启动检查
→ CLOSED_WITH_PASS

Phase 10B-1-2A-1
→ 正式静态资产闭包边界评审
→ CLOSED_WITH_CONDITIONS

Phase 10B-1-2A-2
→ 正式 OCR provider 封装职责边界评审
→ CLOSED_WITH_CONDITIONS

Phase 10B-1-2A-3
→ CSP / COOP / COEP 与 threaded 降级策略边界评审
→ CLOSED_WITH_CONDITIONS

Phase 10B-1-2A-4
→ 多图片队列、session-only 数据生命周期与 Phase 9 接入边界评审
→ CLOSED_WITH_CONDITIONS
```

---

## 4. browser-local smoke 的准确含义

已证明：

```
BROWSER_LOCAL_PADDLEOCR_JS_FEASIBILITY
→ CONDITIONALLY_PROVEN

THREADED_WASM_CAPABILITY
→ OBSERVED_WITH_PASS
```

该结论仅证明：

```
一张虚构、清晰、中文合同测试图片
可以在受控 scratch 环境中
由 PaddleOCR.js 在浏览器本地完成 OCR
```

尚未证明：

```
真实手机拍照合同可稳定识别
连续 10–15 页合同可稳定处理
低端设备可稳定处理
移动端浏览器可稳定处理
阴影、反光、旋转、模糊和透视变形可稳定处理
正式 Next.js 页面已经可用
正式 Worker 打包已经可用
正式 public/ 静态资产闭包已经可用
正式 CSP / COOP / COEP 已经完成
threaded 模式可作为正式首版依赖
```

不得宣传：

```
OCR 已经完成
OCR 已经可直接上线
多页合同 OCR 已经稳定
移动端 OCR 已经稳定
threaded 性能已经得到正式保证
```

---

## 5. A-5 总收口结论

正式结论：

```
Phase 10B-1-2A
→ 正式 OCR 封装前边界评审
→ READY_TO_CLOSE_WITH_CONDITIONS
```

不是：

```
READY_TO_IMPLEMENT_IMMEDIATELY
```

权限状态：

```
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

CSP_COOP_COEP_PERMISSION
→ NOT_GRANTED

OCR_UI_IMPLEMENTATION_PERMISSION
→ NOT_GRANTED

MULTI_IMAGE_UI_PERMISSION
→ NOT_GRANTED
```

---

## 6. Phase 10 产品边界

Phase 10 只做：

```
多张合同图片
→ 浏览器本地逐页 OCR
→ 用户人工校对合并文本
→ 用户明确确认 OCR 文本
→ 注入既有 Phase 9 contractText
→ 进入既有文本审查链路
```

Phase 10 是：

```
输入方式增强
```

Phase 10 不是：

```
第二套合同审查系统
新的 AI 风险判断系统
新的规则引擎
新的法律结论系统
合同图片上传平台
云端 OCR 平台
云端合同归档系统
```

合同图片必须：

```
仅在浏览器本地处理
```

禁止：

```
上传到 DeepSeek
上传到 HouseFolio API
上传到 Vercel
上传到云数据库
上传到对象存储
上传到第三方 OCR API
上传到 Analytics
写入服务端日志
```

禁止静默 fallback：

```
本地 OCR 失败
≠
自动切换云 OCR
```

---

## 7. OCR 文本确认与 Phase 9 AI 确认

未经人工校对和明确确认的 OCR 文本不得：

```
进入 Phase 9
进入 L2 风险规则扫描
进入 AI-safe payload
上传给 DeepSeek
保存到 localStorage
保存到 sessionStorage
保存到 IndexedDB
写入日志
```

两次确认必须分开：

```
确认一：
OCR 文本校对完成
→ 用户确认识别文本是否准确
→ 用户确认将文本填入既有 contractText

确认二：
Phase 9 AI 发送前确认
→ 用户检查完整脱敏预览
→ 用户决定是否允许发送全文脱敏文本
```

绝对不能：

```
合并两次确认
OCR 完成后自动进入 AI
OCR 完成后自动发送
OCR 文本未经人工确认直接进入 Phase 9
```

---

## 8. Phase 9 复用边界

当前 /contract-review 页面已有：

```
用户粘贴合同文本
→ contractText

contractText
→ segmentContractClauses()

条款片段
→ matchContractRisks()

规则命中
→ resolveLegalBasisForFindings()

条款 + 命中 + 法规依据
→ buildContractReviewModel()

完整模型
→ buildContractReviewFullRedactedAiInput()

全文脱敏输入
→ 展示发送前确认

用户确认
→ POST /api/ai/contract-review-explanation

AI 输出
→ 风险提示、追问、建议写法方向、协商话术
```

Phase 10 OCR 文本最终只能注入既有：

```
contractText
```

不得：

```
复制第二套合同正文状态
新增第二套规则扫描
新增第二套法规依据 resolver
新增第二套全文脱敏 builder
新增第二套 AI route
新增第二套 provider
新增第二套 AI 确认弹窗
绕过现有 clearAiSessionState()
```

文本变化后必须：

```
旧 AI 预览失效
旧 AI 输出失效
用户重新确认
```

---

## 9. 正式静态资产闭包

scratch dist 不是正式生产闭包。

禁止：

```
整体复制 scratch dist
整体复制 node_modules
整体复制 Vite 产物
整体复制哈希 Worker bundle
将 scratch 目录视为正式 public/ 资产
```

正式 public/ 最小候选资产：

```
public/
└── ocr/
    └── paddleocr-js/
        └── 0.3.2/
            ├── models/
            │   ├── PP-OCRv5_mobile_det_onnx.tar
            │   └── PP-OCRv5_mobile_rec_onnx.tar
            └── ort/
                ├── ort-wasm-simd-threaded.jsep.mjs
                └── ort-wasm-simd-threaded.jsep.wasm
```

注意：

```
以上只是最小候选闭包
不是当前批准复制范围
```

Worker bundle 必须由正式 Next.js Worker 打包方案管理。

不得：

```
手工复制 scratch 中的 Vite 哈希 Worker bundle
将临时 dist 哈希文件写死为生产路径
```

正式实现必须显式关闭：

```
默认模型远程 URL
Worker 模式缺少 wasmPaths 时的 jsDelivr fallback
```

正式复制前必须完成：

```
静态资产 manifest
资产文件名
资产用途
资产来源
版本
SHA-256
许可证
模型再分发依据
THIRD_PARTY_NOTICES 记录
部署路径
runtime 验证标准
```

---

## 10. OCR provider 封装边界

正式 OCR 能力必须通过：

```
src/lib/ocr
```

页面和组件不得直接调用：

```
PaddleOCR.js
ORT
Worker
WASM
模型路径
远程 URL
静态资源路径
```

provider contract 至少覆盖：

```
init
recognizePage
dispose
```

并处理：

```
初始化状态
单页 OCR
逐页进度
错误分类
取消信号
资源释放
静态资产路径校验
single-thread baseline
未来 threaded 扩展口
```

provider 不得：

```
上传图片
调用云 OCR
调用 DeepSeek
持久化图片
持久化未确认 OCR 文本
直接修改 contractText
直接触发 Phase 9
写入 Analytics
记录合同正文
```

---

## 11. single-thread baseline 与 threaded 后置策略

首版正式 OCR 集成应优先采用：

```
single-thread WASM baseline
```

首版不得自动修改：

```
CSP
COOP
COEP
cross-origin isolation
connect-src
worker-src
script-src
```

任何 headers 调整必须：

```
独立 docs-only 评审
独立范围说明
独立兼容性检查
独立部署回归
```

threaded WASM 当前只能描述为：

```
OBSERVED_WITH_PASS
```

不得描述为：

```
正式首版依赖
稳定性能承诺
全端能力保证
生产环境默认方案
```

threaded 后置到：

```
Phase 10B-1-2E
→ threaded 增强能力独立评审
```

正式实现必须让降级可观察：

```
threaded 不可用
→ 明确使用 single-thread baseline
→ 不静默走远程资源
→ 不静默切换云 OCR
→ 不伪装成 threaded 已启用
```

---

## 12. 多图片 queue 与 session-only 生命周期

正式规划建议：

```
MAX_OCR_PAGES = 15
```

要求：

```
至少支持 10 张合同图片
建议上限 12–15 张
首版以 15 张作为规划目标
```

首版允许：

```
JPEG
PNG
WebP
```

首版明确不支持：

```
PDF
HEIC
HEIF
TIFF
ZIP
压缩包
```

queue 最小能力：

```
添加多张图片
继续追加图片
缩略图预览
拖拽排序
上移
下移
删除单页
逐页 OCR
逐页状态展示
成功页保留
失败页保留
失败页单独重试
合并文本展示
保留页码分隔
人工编辑合并文本
明确确认
```

页状态至少需要表达：

```
等待识别
识别中
识别成功
识别失败
等待重试
```

失败策略：

```
成功页结果保留
失败页明确标记
失败页允许单独重试
用户已编辑文本不得静默丢失
```

合并文本必须：

```
保留页码分隔
保持页面顺序
允许人工编辑
允许用户核对
允许用户确认
```

---

## 13. session-only 数据边界

允许暂存在浏览器会话内存：

```
原始 File / Blob
缩略图 object URL
图片页面顺序
逐页 OCR 状态
逐页 OCR 文本
合并 OCR 文本
OCR instance
Worker
初始化摘要
失败页错误
```

禁止写入：

```
localStorage
sessionStorage
IndexedDB
lib/storage
云端数据库
对象存储
服务端日志
客户端日志中的合同正文
Analytics
DeepSeek
高德
其他第三方服务
```

必须清理：

```
用户点击清空 OCR 会话
用户离开 OCR 流程
组件卸载
页面刷新
用户确认将 OCR 文本填入 contractText 后结束 OCR 会话
```

清理动作必须包括：

```
撤销 object URL
释放 Worker
dispose OCR instance
清除 File / Blob 引用
清除逐页 OCR 文本
清除合并 OCR 文本
清除失败页错误
清除 OCR 页面状态
```

---

## 14. OCR 文本注入 Phase 9 的交互边界

必须保留：

```
直接粘贴合同文本
```

OCR 是：

```
可选增强入口
```

不是：

```
强制入口
默认入口
唯一入口
```

OCR 工作区最小流程：

```
合同文本输入
├── 直接粘贴文本
└── 从合同图片识别

OCR 工作区
├── 上传前隐私提醒与一次确认
├── 添加图片
├── 缩略图与排序
├── 开始识别
├── 逐页状态
├── 失败页重试
├── 合并文本校对
└── 确认填入合同文本框
```

已有 contractText 内容时，OCR 注入必须提供：

```
追加
覆盖
取消
```

不得静默覆盖。

OCR 文本确认注入后：

```
结束 OCR 会话
清除图片
清除 object URL
释放 Worker
dispose OCR instance
清除未确认 OCR 文本
回到既有 Phase 9 文本审查流程
```

---

## 15. 正式实现前置闸门 G1–G12

A-5 总收口后，以下闸门必须继续保留。

每一轮只能明确打开与本轮目标直接相关的闸门。

### G1：正式依赖树范围批准

确认：

```
正式项目最小新增依赖
依赖版本
依赖用途
package-lock 影响
是否存在不必要依赖
是否存在运行时远程资源
```

### G2：四个静态资产复制范围批准

确认：

```
四个候选静态资产
源路径
目标路径
文件大小
SHA-256
用途
版本目录
```

### G3：模型再分发依据与 attribution 批准

确认：

```
模型来源
模型版本
许可证
是否允许再分发
归属说明
项目内 attribution 位置
```

### G4：THIRD_PARTY_NOTICES 方案批准

确认：

```
第三方包说明
ORT 说明
模型说明
许可证文本或链接记录
版本
归属
再分发依据
```

### G5：首版 single-thread WASM 策略批准

确认：

```
首版默认 single-thread
threaded 非阻塞
threaded 后置
无静默远程 fallback
```

### G6：首版暂不修改 CSP / COOP / COEP 批准

确认：

```
首版不修改全站 headers
不扩大 connect-src
不新增未经审阅的 worker-src
不影响高德等既有链路
```

### G7：Next.js Worker 打包技术方案批准

确认：

```
Worker 入口
Worker 打包方式
正式构建产物
正式 runtime 路径
缓存策略
失败表现
部署验证
```

### G8：src/lib/ocr 文件范围批准

候选范围：

```
src/lib/ocr/
├── provider.ts
├── paddleocr-js-adapter.ts
├── service.ts
└── index.ts
```

注意：

```
以上只是候选结构
不是当前批准写入范围
```

### G9：session-only 数据生命周期批准

确认：

```
哪些状态仅存在于内存
何时清理
如何撤销 object URL
如何 dispose
如何释放 Worker
如何避免持久化
如何避免日志泄漏
```

### G10：两次确认分离批准

确认：

```
OCR 文本确认
≠
Phase 9 AI 发送确认
```

### G11：多图片 UI 文件范围批准

确认：

```
允许修改哪些组件
是否需要新增组件
是否接入 zh-cn.ts
如何复用 contractText
如何避免第二套审查状态
如何保持页面入口可达
```

### G12：正式 runtime regression 方案批准

确认：

```
本地静态资产
无远程 fallback
Worker 正式加载
single-thread baseline
单页 fixture
多页 fixture
失败页重试
成功页保留
合并文本
页码分隔
手动编辑
追加 / 覆盖 / 取消
session-only 清理
Phase 9 注入
刷新清理
无图片上传
无未确认文本上传
```

---

## 16. 后续阶段树

### Phase 10B-1-2B：正式 OCR provider 最小闭包

```
Phase 10B-1-2B-0
→ 正式 OCR provider 最小闭包实现计划评审
→ docs-only

Phase 10B-1-2B-1
→ 第三方 notices 与静态资产 manifest 准备
→ docs / manifest only

Phase 10B-1-2B-2
→ 安装最小正式依赖
→ package.json / package-lock.json only

Phase 10B-1-2B-3
→ public/ocr 最小静态资产闭包
→ four assets only

Phase 10B-1-2B-4
→ src/lib/ocr provider contract
→ provider boundary only

Phase 10B-1-2B-5
→ browser-local PaddleOCR.js adapter
→ adapter only

Phase 10B-1-2B-6
→ OCR service façade
→ service / index only

Phase 10B-1-2B-7
→ provider-level contract-check
→ no UI
```

### Phase 10B-1-2C：多图片 workflow 与 Phase 9 接入

```
Phase 10B-1-2C-0
→ 多图片 workflow 实现计划评审
→ docs-only

Phase 10B-1-2C-1
→ session-only queue model

Phase 10B-1-2C-2
→ OCR 输入 UI

Phase 10B-1-2C-3
→ 失败页重试与合并文本校对

Phase 10B-1-2C-4
→ 注入既有 contractText

Phase 10B-1-2C-5
→ browser regression
```

### Phase 10B-1-2D：真实图片与 10–15 页回归

```
真实手机拍照合同
连续 10–15 页
阴影
旋转
反光
模糊
低清晰度
透视变形
失败页重试
成功页保留
资源压力
刷新清理
桌面浏览器体验
```

### Phase 10B-1-2E：threaded 增强能力独立评审

```
COOP
COEP
crossOriginIsolated
threaded WASM
single-thread fallback
用户可观察降级
部署环境兼容性
高德与现有页面潜在冲突
```

---

## 17. 正式实现前默认关闭项

A-5 关闭后仍然默认禁止：

```
不要安装依赖
不要复制静态资产
不要复制模型
不要创建 src/lib/ocr
不要修改 package.json
不要修改 package-lock.json
不要修改 next.config.ts
不要新增 CSP
不要新增 COOP
不要新增 COEP
不要扩大 connect-src
不要开始正式 OCR 页面
不要开始多图片 UI
不要支持 PDF
不要支持 HEIC
不要接云 OCR
不要增加云 OCR fallback
不要把图片发给 DeepSeek
不要让未确认 OCR 文本进入 AI
不要修改 Phase 9 route
不要重写 Phase 9 provider
不要复制第二套规则引擎
不要修改 Harness
不要清理 scratch
不要删除 evidence
不要自动 add
不要自动 commit
不要自动 push
```

---

## 18. 下一阶段入口

A-5 总收口完成后，下一步只能进入：

```
Phase 10B-1-2B-0
→ 正式 OCR provider 最小闭包实现计划评审
→ docs-only
```

B-0 仍然不得：

```
安装依赖
复制资产
写代码
修改配置
运行 runner
开始 UI
```

---

## 19. A-5 最终关闭声明

```
PHASE_10B_1_2A_RESULT
→ CLOSED_WITH_CONDITIONS

FORMAL_OCR_PRE_IMPLEMENTATION_BOUNDARY_REVIEW
→ COMPLETE

NEXT_ACTION
→ Phase 10B-1-2B-0
→ formal OCR provider minimum closure implementation plan review
→ docs-only

IMPLEMENTATION_PERMISSION
→ NOT_GRANTED

SCOPE_EXPANSION_PERMISSION
→ NOT_GRANTED
```

---

## 20. 固定执行原则

```
一次只做一件事

先边界评审
再技术验证
再实现

失败先诊断
不盲目重跑

保留证据
不覆盖失败现场

多图片
不是单图演示

本地 OCR
不是云端上传

图片不离开设备

OCR 只增强输入
不重做 Phase 9 审查引擎

OCR 文本必须人工校对

用户确认文本后才能进入 Phase 9

Phase 9 脱敏预览继续保留

Phase 9 AI 发送前确认继续保留

不让图片进入 DeepSeek

不让未校对文本进入 AI

图片与未确认文本 session-only

刷新后清除

第一版明确不支持 PDF

不为了技术炫技增加依赖

不为了安全形式主义增加无意义操作

不跳阶段

不扩大 scope

不让 Codex 自由发挥
```
