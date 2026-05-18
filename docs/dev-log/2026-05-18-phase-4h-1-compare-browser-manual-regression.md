# Phase 4H-1：Compare browser manual regression

## 0. 阶段定位

Phase 4H-1 是一次浏览器手动回归记录，用于确认 Phase 4G 之后的 Compare 主链路已经可以稳定用于 Demo / 面试展示。

本阶段只记录浏览器回归结果，不修改功能代码。

本阶段不做：

- 不配置 DeepSeek API key；
- 不做真实 DeepSeek success test；
- 不做真实 DeepSeek browser regression；
- 不新增 AI output persistence；
- 不新增 AI history；
- 不新增 Settings AI 数据权利区；
- 不新增 selection localStorage；
- 不新增 Compare history；
- 不让照片 / 视频进入 Compare；
- 不改 Compare UI；
- 不改 ComparisonModel；
- 不改任何 src 功能代码。

## 1. 当前稳定点

回归前稳定点：

- 944dacd docs: plan compare browser regression checkpoint
- HEAD = origin/main = origin/HEAD = 944dacd
- git status clean
- npm.cmd run build passed

## 2. 测试环境

本轮浏览器回归基于本地开发环境完成。

环境：

- Windows + PowerShell
- 项目路径：E:\Projects\housefolio
- 启动方式：npm.cmd run dev
- 浏览器：本机浏览器
- 测试对象：本机 HouseFolio demo / mock listings / localStorage 数据

## 3. 回归范围

本轮检查范围包括：

- 首页 /
- Demo 页面 /demo
- Portfolio 页面 /portfolio
- Compare 页面 /compare
- Settings 页面 /settings
- Portfolio 选择 1 套、2 套、3–4 套房源的行为
- /compare?ids=... 主链路
- CompareTable 横向表
- 静态解释面板
- AI confirmation UI
- mock AI output
- 刷新后的 AI output session-only 行为
- localStorage / Settings 数据边界
- 浏览器 Console runtime error

## 4. 回归结果

### 4.1 基础页面

| 页面 | 结果 |
|---|---|
| / | 通过 |
| /demo | 通过 |
| /portfolio | 通过 |
| /settings | 通过 |
| /compare 空状态 | 通过 |

结论：

- 基础页面均可正常访问；
- 未发现白屏；
- 未发现阻断 Demo 展示的问题。

### 4.2 Portfolio → Compare

| 检查项 | 结果 |
|---|---|
| Portfolio 房源卡片展示 | 通过 |
| 选择 1 套房源 | 通过 |
| 选择 2 套房源 | 通过 |
| 选择 3–4 套房源 | 通过 |
| 超过 4 套限制 | 通过 |
| 跳转 /compare?ids=... | 通过 |
| 返回 Portfolio | 通过 |

结论：

- Portfolio selection 主链路正常；
- 2–4 套房源进入 Compare 的路径稳定；
- selection 仍然是临时比较动作，不需要持久化。

### 4.3 Compare 页面

| 检查项 | 结果 |
|---|---|
| URL ids 解析 | 通过 |
| 横向表 CompareTable | 通过 |
| 结构化 comparison preview | 通过 |
| 缺失字段 / 风险信号 tag | 通过 |
| 查看详情入口 | 通过 |
| 返回 Portfolio | 通过 |
| 辅助比较说明 | 通过 |

结论：

- Compare 页面可稳定展示选中房源的结构化比较结果；
- CompareTable 正常；
- 页面延续“辅助比较、不代表最终推荐”的产品定位。

### 4.4 静态解释面板

| 检查项 | 结果 |
|---|---|
| 静态解释面板展示 | 通过 |
| 取舍说明 | 通过 |
| checklist 引导 | 通过 |
| 风险解释边界 | 通过 |
| 不替用户决定 | 通过 |

结论：

- 静态解释面板正常；
- L3-facing 文案仍然是解释层，不做评分、排序、筛选或最终推荐。

### 4.5 AI confirmation / mock output

| 检查项 | 结果 |
|---|---|
| AI 辅助解释按钮 | 通过 |
| 点击后先出现确认步骤 | 通过 |
| 取消确认不生成输出 | 通过 |
| 确认后生成 mock AI 输出 | 通过 |
| loading 状态 | 通过 |
| mock AI 输出正常渲染 | 通过 |
| 刷新后 AI 输出消失 | 通过 |
| 返回后重进 Compare 不恢复 AI 输出 | 通过 |

结论：

- AI confirmation UI 正常；
- 默认走 mock provider，不需要 DeepSeek key；
- AI output 保持 session-only；
- 当前未做也不需要做真实 DeepSeek success test。

### 4.6 数据边界

| 检查项 | 结果 |
|---|---|
| localStorage 无 AI output key | 通过 |
| localStorage 无 AI history key | 通过 |
| localStorage 无 selection persistence key | 通过 |
| Settings 无 AI 数据区 | 通过 |
| Settings export 不包含 AI 输出 | 通过 |
| 照片 / 视频未进入 Compare | 通过 |
| Console 无红色 runtime error | 通过 |

结论：

- 本轮未发现 AI 输出持久化；
- 未发现 Compare history；
- 未发现 selection localStorage；
- Settings 未新增 AI 数据权利区；
- Compare 仍未读取照片 / 视频 Blob；
- Console 未发现红色 runtime error。

## 5. 禁止措辞边界

本轮浏览器检查中未发现 Compare / AI 展示链路出现以下越界表达：

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真

结论：

- Compare 仍定位为辅助比较；
- Reference Score 仍是参考评分；
- AI 输出仍是辅助解释；
- 页面没有把 HouseFolio 写成推荐系统或真房源认证工具。

## 6. Demo 展示判断

当前链路已经可以支持面试 / 作品集 Demo：

1. 首页说明项目定位；
2. Portfolio 展示用户自行收集的候选房源；
3. 选择 2–4 套房源；
4. 进入 Compare 横向对比；
5. 展示 L2 结构化比较；
6. 展示静态解释面板；
7. 触发 AI confirmation；
8. 生成 mock AI 辅助解释；
9. 刷新页面说明 AI output session-only；
10. 进入 Settings 展示本地数据权利。

## 7. 未做事项

本轮明确未做：

- 真实 DeepSeek success test；
- 真实 DeepSeek browser regression；
- AI output persistence；
- AI history；
- Settings AI 数据权利；
- AI 输出导出 / 删除；
- 真实 provider 成本 / 频控完善；
- selection localStorage；
- Compare history；
- 照片进入 Compare；
- 视频进入 Compare；
- 地图进入 Compare；
- Supabase / 云端账号系统。

## 8. 阶段结论

Phase 4H-1 浏览器手动回归通过。

当前 HouseFolio 已具备稳定的 Compare Demo 展示链路：

Portfolio
→ selection
→ /compare?ids=...
→ CompareTable
→ static explanation
→ AI confirmation
→ mock AI output
→ session-only output
→ Settings 数据边界

当前可以进入 Phase 4H-2：Compare demo presentation closing checkpoint，或先做一次命令行禁止措辞扫描与本地数据边界复核。