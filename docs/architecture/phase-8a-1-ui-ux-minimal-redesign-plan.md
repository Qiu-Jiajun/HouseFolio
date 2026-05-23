# Phase 8A-1：首页信息架构与最小视觉改版计划

## 0. 本阶段结论

Phase 8A-1 是 HouseFolio 视觉设计环节的第一步。

本阶段不直接改 UI 代码，而是把 Phase 8A-2 / 8A-6 要做的最小视觉改版范围先钉住，避免出现“为了好看而重构全站”“为了像素复刻而破坏产品边界”“为了合同助手入口而提前实现合同助手”的问题。

Phase 8A-1 的核心结论：

HouseFolio 的视觉方向应从工程展示型 Demo 转为“轻量、生活化、可信赖的租房决策清单”。第一轮最小改版应优先改首页、Portfolio、Compare 和合同助手入口占位；Detail、Settings、Demo 只做必要同步，不做大改。

---

## 1. 本阶段范围

### 1.1 本阶段只做

- 写计划文档：docs/architecture/phase-8a-1-ui-ux-minimal-redesign-plan.md
- 明确视觉方向
- 明确首页 30 秒叙事
- 明确第一轮允许修改的文件范围
- 明确哪些页面先改、哪些页面后置
- 明确合同助手入口只做“准备签约前检查”的占位计划
- 明确 PixelClone 后置使用条件
- 明确 Phase 8A-2 的实施顺序

### 1.2 本阶段不做

- 不改 src 代码
- 不改 src/content/zh-cn.ts
- 不改页面组件
- 不实现合同助手
- 不新增 /contract-review
- 不新增 API route
- 不接 OCR
- 不改 AI provider
- 不改 LBS provider
- 不改 L2 algorithm
- 不新增 localStorage key
- 不改 IndexedDB
- 不使用 PixelClone
- 不引入新 UI 框架

---

## 2. 视觉方向

### 2.1 关键词

第一轮视觉改版的关键词：

```text
生活化
轻量
可信
不压迫
清单感
备忘录感
消费决策感
信息密度可控
低学习成本
合规边界清楚

不追求：

高级 SaaS 感
深色科技感
后台管理系统感
复杂数据看板感
高饱和营销页
复杂动效
像素级复刻
完整设计系统
2.2 视觉气质

HouseFolio 应更像：

租房清单
看房备忘录
私人候选资料夹
消费决策工具
签约前检查清单

而不是：

B 端后台
数据管理 Dashboard
AI 工具集合
法律服务平台
房源平台
地图平台
工程能力展示页
2.3 推荐视觉基调

第一轮可以采用：

背景：更轻、更暖的 off-white / warm gray
卡片：白色或轻微暖色，保留圆角和轻阴影
主色：稳妥、生活化、不过度科技感；优先用于主按钮和关键状态
强调色：只用于“通勤参考、辅助比较、准备签约前检查”等关键决策节点
字体层级：减少同时出现的标题层级，避免密集字段
间距：提高区块呼吸感，尤其首页和 Portfolio
图标：可使用轻量图标辅助理解，但不应堆叠
3. 首页信息架构计划
3.1 首页 30 秒内必须讲清

首页首屏必须让用户立刻理解：

HouseFolio 不是找房平台
用户把自己找到的房源放进候选清单
系统帮助用户比较通勤、价格、空间和风险
准备签约前可以检查合同常见风险
数据默认本地保存
参考评分和 AI 总结只做辅助，不替用户决定
3.2 首页推荐叙事

首屏主标题方向：

把你找到的房源，整理成一份能比较的租房清单

副标题方向：

记录候选房源、看房笔记和通勤参考，横向比较 2–4 套备选；准备签约前，再检查合同里有哪些常见风险点需要追问。

主按钮方向：

查看候选房源

次按钮方向：

了解如何辅助比较

可选轻入口：

准备签约？先做合同常见风险检查

注意：合同入口只做占位或文案规划，不实现审读逻辑。

3.3 首页模块顺序

建议首页从上到下：

Hero：一句话说明产品
三步路径：
收集候选房源
辅助比较
签约前检查
本地优先提示
当前可演示能力
合规边界
Demo / Portfolio 入口

不建议首屏直接展示：

L1 / L2 / L3 大段技术解释
provider / API / mock / route
复杂评分模型
DeepSeek / Amap 工程细节
大段法律免责声明
4. Portfolio 最小视觉计划
4.1 页面定位

Portfolio 应从“房源管理页”调整为：

候选房源清单

用户看到这里应觉得：

这是我自己收集的几套备选房，可以继续补充、看详情、做比较。
4.2 卡片信息层级

ListingCard 第一层：

房源标题
租金
区域 / 小区线索
看房状态

第二层：

通勤参考
面积 / 户型
参考评分

第三层：

笔记 / 照片 / 缺失信息
查看详情
加入比较
4.3 视觉调整方向

允许在后续 Phase 8A-2 中考虑：

更大的标题和租金层级
更清楚的状态标签
更少的同时可见字段
更生活化的空状态
更明确的“选择 2–4 套辅助比较”
卡片 hover 保持轻量，不做强 SaaS 感

暂不做：

照片大封面重构
Masonry layout
地图卡片
批量操作栏大改
selection localStorage
Compare history
图片 / 视频进入 Compare
5. Compare 最小视觉计划
5.1 页面定位

Compare 应明确是：

房源辅助比较

不是：

系统推荐
最优房源
AI 选房
推荐分
5.2 信息层级

Compare 首屏建议顺序：

当前比较对象数量
辅助比较说明
横向对比表
缺失信息和风险信号
AI 总结 / 辅助解释
返回 Portfolio 重新选择
5.3 视觉调整方向

后续 Phase 8A-2 可考虑：

降低表格压迫感
增加区块说明
将重点字段前置
风险信号用轻标签展示
AI 解释区域改成“总结卡片”而不是“模型输出框”
明确“AI 只解释，不排序、不推荐、不替你决定”

暂不做：

重新设计 ComparisonModel
新增权重设置
新增排序
新增推荐结论
新增持久化 AI 输出
新增 Settings AI 数据区
6. Detail 最小视觉计划

Detail 第一轮不大改。

只允许后续根据必要性做轻量同步：

标题更像“房源档案”
看房笔记更像备忘录
通勤参考和参考评分保持辅助定位
合同助手入口只在“准备签约前”场景出现

暂不做：

重构照片模块
视频能力
合同审读页面
OCR
房源状态机大改
地图 UI
7. Settings 最小视觉计划

Settings 第一轮不大改。

必须保留：

查看本地数据
导出本地 JSON
清除本机数据
mock data 与用户数据区别
当前未接云端同步的说明
本地优先和数据权利说明

后续若新增合同助手，Settings 必须扩展合同审读数据说明。但 Phase 8A 不实现合同数据。

8. 合同助手入口占位计划
8.1 入口定位

合同助手入口应被表达为：

准备签约前检查

而不是：

AI 律师
法律审查
违法判定
霸王条款检测
自动维权
8.2 第一轮入口位置

建议后续第一轮只放两个入口：

首页功能路径中展示“准备签约前检查”
Detail 页在合适区域预留“准备签约？检查合同常见风险”的轻入口或占位说明

Portfolio 顶部入口可后置。

AppNav 独立入口不建议第一轮就做，避免产品看起来像法律工具集合。

8.3 入口文案草案
准备签约前，可以把合同正文粘贴进来，辅助识别押金、违约金、维修责任、入室权等常见风险点。

必须配套说明：

仅提供常见风险提示，不构成法律意见。请勿上传身份证、房产证、签字页、付款凭证等敏感材料。

Phase 8A 只做入口和占位，不实现审读逻辑。

9. 第一轮允许修改文件范围建议

Phase 8A-2 若开始最小 UI/UX 改版，建议只允许以下文件：

src/content/zh-cn.ts
src/app/page.tsx
src/app/portfolio/page.tsx
src/components/listing-card.tsx
src/app/compare/page.tsx
src/components/compare-table.tsx
src/components/compare-explanation-panel.tsx
src/components/compliance-footer.tsx

谨慎修改：

src/components/listing-detail-view.tsx
src/components/listing-commute-panel.tsx
src/app/settings/page.tsx
src/app/demo/page.tsx

禁止修改：

src/lib/lbs/**
src/lib/algorithm/**
src/lib/ai/**
src/lib/local-store/**
src/lib/storage/**
src/lib/privacy/**
src/app/api/**
src/types/comparison.ts
src/types/listing.ts
package.json
next.config.*
.env*

除非后续单独开阶段评审，否则不碰上述文件。

10. PixelClone 后置条件

PixelClone 或类似工具不能在 Phase 8A-1 使用。

允许使用条件：

Phase 8A-1 已确定视觉方向
Phase 8A-2 已有最小改版方案
用户提供明确参考图、截图或 mockup
文件范围被锁定在展示层
不改业务逻辑
不改 provider
不改 API route
不新增 localStorage key
不删除合规提示
每次改版后 build 和浏览器回归

禁止做法：

“直接把 HouseFolio 改好看”
大面积复刻竞品页面
为了视觉统一删除合规说明
为了像素复刻重构业务层
让 PixelClone 自由改全站
11. Phase 8A-2 建议实施顺序

如果 Phase 8A-1 通过，下一步建议进入：

Phase 8A-2：首页 + Portfolio 最小视觉改版

原因：

首页决定用户第一印象
Portfolio 是用户真实使用起点
这两处最能快速改善“工程 Demo 感”
风险小于直接改 Compare 和 Detail

Phase 8A-2 不建议一次改全站。

推荐顺序：

首页首屏和路径表达
Portfolio 页面标题、空状态、候选清单表达
ListingCard 信息层级微调
build
浏览器检查首页和 Portfolio
commit

后续再进入：

Phase 8A-3：Compare 最小视觉改版
Phase 8A-4：Settings / ComplianceFooter 文案同步
Phase 8A-5：合同助手入口占位
Phase 8A-6：整体验收与回归
12. Phase 8A-1 验收标准

本阶段完成后应满足：

只新增 docs/architecture/phase-8a-1-ui-ux-minimal-redesign-plan.md
不改 src
不改功能代码
不实现合同助手
不使用 PixelClone
不改 provider / API route / localStorage key
build 通过
git status clean after commit
commit message 建议：docs: plan ui ux minimal redesign
13. 阶段结论

Phase 8A-1 的结论是：

HouseFolio 可以尽早进入视觉设计环节，但必须以“产品路径 + 信息架构 + 视觉方向”作为第一步，而不是立即让工具或 Codex 自由改 UI。

第一轮视觉设计的最小目标不是建立完整设计系统，而是让首页和 Portfolio 先摆脱工程 Demo 感，让用户理解：

我可以把候选房源放进来，
我可以比较 2–4 套，
我可以记录看房信息，
准备签约前还可以检查合同常见风险，
并且这些高敏资料默认本地保存。