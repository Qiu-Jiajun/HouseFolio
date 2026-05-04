# Phase 3F-1｜Phase 3D–3E 总回归日志

## 1. 阶段目标

本文件用于记录 HouseFolio Phase 3D–3E 的阶段总回归结果。

Phase 3D–3E 都属于 v2.0 本地优先基础层强化：

- Phase 3D：本地照片持久化、照片数据可见性、清除全部本机照片；
- Phase 3E：结构化 JSON 导入、导出、清除与数据权利闭环。

本阶段不是新功能开发，不改 UI，不改存储逻辑，不进入 AI、地图、Supabase、ZIP、Portfolio 首图或 /compare。

## 2. 当前最新提交

本日志生成前最新提交：

c4d34b1 docs: close json import phase

## 3. 最近 30 个提交

c4d34b1 docs: close json import phase
4bb63b1 docs: normalize json import regression log
9672348 docs: log json import ui regression
2193f35 fix: alert json import errors
005a638 feat: add settings json import ui
8829b54 fix: support exported json import shape
1ee0dc5 docs: localize json import ui plan
1f4cba1 docs: plan settings json import ui
734dfb5 docs: checkpoint json import helper
1208b34 feat: scaffold json import helper
db198b6 docs: review json import boundary
5071e0d docs: checkpoint local photo persistence
0006e58 docs: log photo clear all regression
55f3d00 feat: add settings photo clear action
af69ba4 feat: add photo storage clear all
51d91be docs: plan photo storage clear all
a7dd5c0 docs: log settings photo data status
8db47b8 feat: show settings photo data status
b0a44e8 docs: plan settings photo data visibility
1a3bcf0 docs: log detail photo panel regression
c8653f5 feat: add detail local photo panel
bd7bbc5 docs: realign roadmap with v2
bad7f1c docs: plan detail photo panel
286936b docs: checkpoint photo provider boundary
0ee027f docs: log indexeddb photo provider
da5d4ab feat: implement indexeddb photo provider
587d039 docs: plan indexeddb photo provider
d37a17e docs: log storage boundary scaffold
fc4283a feat: scaffold local photo storage boundary
73e6f19 docs: review local photo persistence boundary


## 4. 总体验证结果

本次 Phase 3F-0 总检查已确认：

- git status clean；
- 
pm.cmd run build 通过；
- 当前最新提交为 c4d34b1 docs: close json import phase；
- Phase 3D 本地照片 checkpoint 文件存在；
- Phase 3E JSON import closing 文件存在；
- Phase 3E JSON import UI regression 文件存在；
- Phase 3E JSON import boundary review 文件存在；
- Phase 3E Settings JSON import UI plan 文件存在；
- 关键 .ts / .tsx / .md 文件未发现 NUL 字节异常；
- 唯一包含 NUL 字节的文件是 src/app/favicon.ico，属于正常二进制图标文件。

## 5. Build 验证

执行命令：

- 
pm.cmd run build

结果：

- Next.js 16.2.4 build 通过；
- TypeScript 编译通过；
- 静态页面生成通过；
- 动态路由 /portfolio/[id] 正常；
- API route /api/lbs/commute/transit 正常纳入 build。

当前路由仍为：

- /
- /_not-found
- /api/lbs/commute/transit
- /portfolio
- /portfolio/[id]
- /portfolio/new
- /settings

确认没有新增：

- /compare
- 地图页面
- AI 页面
- Supabase 页面
- Chrome 插件入口
- ZIP 备份入口

## 6. Phase 3D 回归结论

Phase 3D 已完成本地照片持久化基础闭环。

已确认能力：

- Detail 页可以添加本地看房照片；
- 照片文件保存到浏览器本地 IndexedDB；
- 刷新后照片仍能显示；
- 可以删除单张照片；
- Settings 可以查看本机照片数量；
- Settings 可以查看本机照片占用空间；
- Settings 可以清除全部本机照片；
- 清除全部本机照片不会误删房源、笔记、评分、状态、通勤锚点或通勤结果。

关键边界：

- 照片默认本机保存；
- 照片不默认上传云端；
- 照片不进入 AI；
- 照片不用于公开展示；
- 页面不直接操作 IndexedDB；
- 照片存储继续通过 lib/storage 封装。

## 7. Phase 3E 回归结论

Phase 3E 已完成结构化 JSON 导入闭环。

已确认能力：

- Settings 可以导出本地 JSON；
- Settings 可以导入本地 JSON；
- 当前导出的 items 快照结构已被 import helper 支持；
- 无效 JSON 会被识别；
- 只包含未知 key 的 JSON 会被识别；
- 导入失败时页面显示红色提示；
- 导入失败时浏览器弹窗再次提示；
- 有效 HouseFolio JSON 可以导入；
- 导入前会出现覆盖确认；
- 导入成功后 Settings 本地数据快照会刷新；
- housefolio:commute-results 标签显示为“参考通勤结果”；
- JSON 导入不会删除本机照片；
- JSON 导入不会声称恢复照片。

当前允许导入的 key：

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

当前明确不导入：

- IndexedDB 照片 Blob；
- 照片缩略图；
- ZIP 备份包；
- AI 输出；
- AI prompt；
- 高德原始路线 JSON；
- 地图数据；
- Supabase 数据；
- 任意第三方平台数据；
- 任意未知 localStorage key。

## 8. NUL 字节检查结论

本次检查命令扫描了：

- docs
- src

发现：

- src/app/favicon.ico 包含 NUL 字节；
- 这是正常二进制图标文件；
- 不属于源码或 markdown 文档编码问题。

此前 docs/dev-log/2026-05-04-phase-3e-4e-json-import-ui-regression.md 曾因 1 个 NUL 字节被 Git 识别为 binary，已经通过提交 4bb63b1 docs: normalize json import regression log 修复。

当前确认：

- docs/dev-log/2026-05-04-phase-3e-4e-json-import-ui-regression.md 的 NUL 字节数为 0；
- docs/dev-log/2026-05-04-phase-3e-5-json-import-closing.md 的 NUL 字节数为 0。

## 9. 当前关键文件状态

本次检查确认以下文件仍处于可读、可构建状态：

- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts
- src/lib/privacy/local-data-import.ts
- src/lib/storage/local-photo-provider.ts
- docs/dev-log/2026-05-04-phase-3e-5-json-import-closing.md

其中：

- settings-local-data-panel.tsx 包含 JSON 导入 UI；
- zh-cn.ts 包含 JSON 导入与照片相关中文文案；
- local-data-import.ts 包含结构化 JSON 导入 helper；
- local-photo-provider.ts 仍只处理本机照片存储；
- Phase 3E closing 文档同时记录 JSON 导入和照片边界。

## 10. 产品边界确认

Phase 3D–3E 没有改变 HouseFolio 的长期定位。

HouseFolio 仍然是：

- 本地优先的私人找房决策工具；
- 用户主动添加候选房源；
- 用户本机保存看房照片；
- 用户本机导出 / 导入结构化数据；
- 不抓取第三方房源；
- 不公开房源库；
- 不撮合交易；
- 不认证真房源；
- 不默认云同步；
- 不把照片做成云端相册。

## 11. 架构边界确认

Phase 3D–3E 仍遵守 lib/* 封装原则：

- 照片通过 lib/storage；
- 本地结构化数据通过 lib/privacy 与 lib/local-store；
- JSON 导入通过 src/lib/privacy/local-data-import.ts；
- 页面没有直接调用 IndexedDB；
- 页面没有直接调用 Supabase；
- 页面没有直接调用 AI；
- 页面没有直接调用高德；
- 页面没有新增远程 fetch；
- 页面没有读取第三方平台网页。

## 12. 当前仍未完成

不要误判当前项目已经完成以下能力：

- 完整 Portfolio 备份包；
- 照片 ZIP 导出；
- 照片 ZIP 导入；
- Portfolio 首图；
- JSON import merge 策略；
- import preview 详细表格；
- schema validator；
- 云同步；
- Supabase 持久化；
- AI 分析；
- 地图 UI；
- POI / 生活圈真实计算；
- /compare 页面；
- Phase 4A comparison data model；
- Chrome 插件；
- 部署上线。

## 13. 下一步建议

Phase 3D–3E 当前已经形成一个较完整的本地优先基础层闭环。

下一步有三个合理选择：

### 方向 A：Phase 3F-2｜Phase 3D–3E handoff 文档

适合在当前对话较长时使用。

目标：

- 生成可加入 Project Sources 的接续文档；
- 明确当前最新 commit；
- 明确下轮第一步检查；
- 防止下一轮误跳 ZIP、Portfolio 首图、AI、地图、Supabase 或 /compare。

### 方向 B：Phase 3G-0｜Portfolio 首图前置评审

只做评审，不实现。

目标：

- 评估是否应该让 Portfolio 卡片读取本地照片首图；
- 检查是否会让照片能力过快扩张；
- 明确首图只读、只本机、只通过 lib/storage；
- 明确不做云相册、不做公开图册、不做第三方房源图片展示。

### 方向 C：Phase 3G-0｜完整备份包前置评审

只做评审，不实现。

目标：

- 评估 JSON + 照片 ZIP 备份包的合理顺序；
- 明确 JSON 导入已完成，但照片迁移仍缺口；
- 避免过早做复杂 ZIP 逻辑。

## 14. 当前推荐

当前最稳建议：

先做 Phase 3F-2：Phase 3D–3E handoff 文档。

理由：

- 当前对话已经较长；
- Phase 3D–3E 已形成闭环；
- handoff 文档可以作为下一轮 Project Sources；
- 下一轮可以在清晰状态下再决定做 Portfolio 首图评审还是完整备份包评审。

## 15. 验证标准

本阶段完成标准：

- 本文件存在；
- 
pm.cmd run build 通过；
- 提交后 git status clean；
- 没有源码行为变化；
- 没有 UI 行为变化；
- 仅新增 dev-log 文档。

## 16. 建议提交信息

建议 commit：

docs: log phase 3d 3e total regression