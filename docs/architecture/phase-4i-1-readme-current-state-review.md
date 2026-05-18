# Phase 4I-1：README current-state review

## 0. 阶段定位

Phase 4I-1 是对当前 README.md 的现状评审。

本阶段只做：

- 检查 README 是否存在；
- 检查 README 是否过时；
- 检查是否缺少当前 Compare / AI confirmation / mock AI 主链路；
- 检查是否存在夸大或越界表述；
- 判断下一步 Phase 4I-2 应如何最小更新 README。

本阶段不直接重写 README，不修改 src，不新增功能代码。

## 1. 当前稳定点

当前最新稳定点：

- eac219f docs: review project demo presentation

当前已确认：

- HEAD = origin/main = origin/HEAD = eac219f
- git status clean
- README.md exists
- README.md 当前约 10502 characters / 581 lines

## 2. README 当前已有优点

当前 README 已经正确表达了 HouseFolio 的几个核心边界：

- HouseFolio 是本地优先的私人找房决策工具；
- HouseFolio 不做房源平台；
- HouseFolio 不抓取第三方房源；
- HouseFolio 不撮合交易；
- HouseFolio 不认证真房源；
- HouseFolio 使用 L1 / L2 / L3 三层架构；
- L2 Reference Score 是参考评分，不代表最终选择；
- 本地结构化数据使用 localStorage；
- 本机照片使用 IndexedDB；
- 地图 / LBS 能力通过 lib/lbs 和服务端 route；
- 页面和组件不得直接读取高德 key；
- Demo Mode 使用虚构数据，不读取真实用户数据。

这些内容仍然有效，Phase 4I-2 更新 README 时不应删除。

## 3. README 当前主要过时点

README 当前明显停留在 Phase 4A 前后，已经落后于当前项目实际状态。

### 3.1 Current Status 过时

README 当前仍将以下能力列为尚未完成：

- 正式 Compare 页面；
- 多房源勾选；
- 横向对比表；
- AI 调用前授权弹窗；
- AI 真实 API 接入。

但当前实际已经完成：

- /compare route；
- Portfolio 选择 2–4 套房源；
- URL query 传递 selected listing ids；
- CompareTable 横向对比表；
- CompareExplanationPanel 静态解释面板；
- AI confirmation UI；
- /api/ai/compare-explanation；
- 默认 mock provider；
- session-only AI output；
- DeepSeek provider layer / missing-config safe path。

因此 Current Status 必须更新。

### 3.2 Roadmap 过时

README 当前 Roadmap 仍写：

- Phase 4A：L2 Comparison Foundation；
- Phase 4B：Compare UI Review；
- Phase 4C：Compare UI Implementation；
- Later：L3 AI Explanation。

但当前实际进度已经完成：

- Phase 4A：Comparison model layer；
- Phase 4B：Compare UI 主链路；
- Phase 4C：Static L3-facing explanation；
- Phase 4D：Mock AI provider / API route / UI trigger / real route provider selection；
- Phase 4E：AI confirmation UI；
- Phase 4F：Real provider readiness review；
- Phase 4G：Compare product polish；
- Phase 4H：Compare browser regression / demo presentation checkpoint。

因此 Roadmap 不能继续把 Compare UI 写成未来计划。

### 3.3 Core Workflow 缺少当前稳定 Demo 主链路

README 当前已经写了 Demo Mode，但没有突出当前真实模式下的 Compare Demo 主链路：

Portfolio
→ 选择 2–4 套候选房源
→ /compare?ids=...
→ L2 横向对比表
→ 静态 L3 解释面板
→ AI confirmation UI
→ mock AI output
→ session-only output
→ Settings 本地数据边界

Phase 4I-2 应新增或更新这一段。

### 3.4 AI 状态描述需要校准

README 当前说真实 AI 调用尚未作为正式功能接入，这个判断需要更精确。

当前更准确的说法应该是：

- 已有 AI provider boundary；
- 已有 mock AI provider；
- 已有 /api/ai/compare-explanation；
- 已有 AI confirmation UI；
- 已有 DeepSeek provider layer；
- 已有 missing-config safe path；
- 当前没有 DeepSeek API 账号 / key；
- 未做真实 DeepSeek success test；
- 未做真实 DeepSeek browser regression；
- AI output 当前 session-only，不持久化。

不能简单写“AI 还没接入”，也不能写“真实 AI 已完成”。

### 3.5 Routes 列表过时

README 当前主要路由列表缺少：

- /compare
- /api/ai/compare-explanation

Phase 4I-2 应补充。

## 4. 禁止措辞扫描判断

预扫描显示以下词存在：

- 真房源；
- 最佳房源；
- 系统推荐。

从当前 README 内容看，这些词主要出现在否定边界中，例如：

- 不做“真房源认证”；
- 不输出“最佳房源”或“系统推荐”。

这类出现是可接受的，因为它们用于说明产品红线，不是产品承诺。

Phase 4I-2 更新 README 时必须继续遵守：

- 可以在“不做 / 不输出 / 不声称”语境中使用这些词；
- 不得在正向宣传中使用这些词；
- 不得把 Reference Score 写成推荐分；
- 不得把 AI 写成最终决策者。

## 5. Phase 4I-2 README 最小更新范围

建议 Phase 4I-2 只更新 README，不改 src。

最小更新范围：

1. 更新 Project Overview / 当前一句话定位；
2. 更新 Current Features，加入 Compare 和 AI confirmation / mock AI；
3. 更新 Current Status，删除“正式 Compare 页面 / 多房源勾选 / 横向对比表 / AI 调用前授权弹窗尚未完成”等过时表述；
4. 更新 Roadmap，把已完成的 Phase 4A–4H 移到 completed / current status，把未完成项保留到 later；
5. 补充 /compare 和 /api/ai/compare-explanation route；
6. 补充 AI 当前真实状态：mock provider 可演示，DeepSeek provider readiness 已有，但未做真实 success test；
7. 补充 Demo presentation 主链路；
8. 保留合规边界和本地优先说明。

## 6. Phase 4I-2 不应做的事

Phase 4I-2 不应：

- 不改 src；
- 不改 Demo 页面；
- 不改 Compare UI；
- 不配置 DeepSeek API key；
- 不做真实 DeepSeek success test；
- 不新增 README 里无法兑现的功能承诺；
- 不把 HouseFolio 写成房源推荐系统；
- 不把 mock AI 写成真实 AI success path；
- 不写“最佳房源”“系统推荐”“推荐分”“替你决定”等正向营销表述。

## 7. 阶段结论

Phase 4I-1 结论：

当前 README 的产品定位和边界大体正确，但项目进度严重过时。

尤其需要更新：

- Compare 主链路；
- AI confirmation UI；
- mock AI output；
- session-only output；
- DeepSeek provider readiness but no success test；
- Phase 4H browser regression 后的 Demo 展示链路。

建议下一步进入：

- Phase 4I-2：README minimal update

目标是最小修正 README，使其准确反映当前项目状态，而不是重写成过度营销文档。