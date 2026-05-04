# HouseFolio 接续文档｜2026-05-04｜Phase 3D–3E 收尾

## 0. 新对话里的 AI 请先读这段

我们继续 HouseFolio 项目。

当前项目已经以《HouseFolio 项目规划文档 v2.0》为上位规划文档。HouseFolio 当前定位是：

- 本地优先的私人找房决策工具；
- 用户主动添加候选房源；
- 本机保存看房照片；
- 本机导出 / 导入结构化数据；
- L1 / L2 / L3 三层决策引擎仍然是核心；
- 不抓取、不聚合、不公开、不撮合、不认证；
- 不默认云同步；
- 不把照片做成云相册或公共图册。

当前最新已完成到：

**Phase 3F-1：Phase 3D–3E 总回归日志**

当前最新 commit：

ab0c019 docs: log phase 3d 3e total regression

当前已确认状态：

- git status clean；
- 
pm.cmd run build 通过；
- Phase 3D 本地照片持久化闭环完成；
- Phase 3E 结构化 JSON 导入闭环完成；
- Phase 3F-1 总回归完成；
- 关键 .ts / .tsx / .md 文件未发现 NUL 字节异常；
- 唯一 NUL 文件为 src/app/favicon.ico，属于正常二进制图标文件。

---

## 1. 当前最高优先级

继续保持：

- 基础闭环稳定；
- 架构边界清晰；
- 合规边界明确；
- 后续迁移友好；
- v2.0 本地优先路线清晰；
- 每次只做一件事；
- 每个阶段必须有目标、文件范围、验证标准和 commit。

新对话不要直接跳到：

- AI / DeepSeek；
- 地图 UI；
- POI / 生活圈真实计算；
- Supabase；
- 部署；
- Chrome 插件；
- 复杂多锚点权重；
- 正式 Phase 4A comparison data model；
- /compare 路由；
- 多房源勾选；
- 横向对比表；
- ZIP 照片导出；
- ZIP 照片导入；
- 云端照片同步；
- AI 照片分析；
- 全站白色居家风重构。

---

## 2. 当前最近提交

最近 35 个提交如下：

ab0c019 docs: log phase 3d 3e total regression
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
5e0a399 docs: log detail readability polish
28adc91 style: polish detail readability
881e9a0 docs: checkpoint phase 3 ui
451fda5 docs: close phase 3b visual polish


---

## 3. 当前路由状态

当前 build 路由仍为：

- /
- /_not-found
- /api/lbs/commute/transit
- /portfolio
- /portfolio/[id]
- /portfolio/new
- /settings

当前没有新增：

- /compare
- 地图页面
- AI 页面
- Supabase 页面
- ZIP 备份页面
- Chrome 插件入口
- 部署相关页面

---

## 4. Phase 3D 当前完成情况：本地照片持久化基础闭环

Phase 3D 在 v2.0 下应理解为：

**本地优先基础层强化：高敏找房资料的本机持久化与数据权利前置。**

它不是单纯“照片功能”，而是本地优先产品形态的一部分。

### 4.1 已完成能力

当前已经完成：

- Detail 页“看房照片｜本机保存”模块；
- 用户可主动选择 JPG / PNG / WebP 图片；
- 单张图片限制 5MB；
- 图片文件保存到浏览器 IndexedDB；
- 刷新详情页后照片仍显示；
- 可以删除单张照片；
- Settings 显示本机照片数量；
- Settings 显示本机照片占用空间；
- Settings 显示本机照片存储位置；
- Settings 可以清除全部本机照片；
- 清除全部本机照片不会删除房源、笔记、评分、状态、通勤锚点、通勤结果。

### 4.2 关键边界

当前照片能力保持以下边界：

- 照片默认本机保存；
- 照片不默认上传云端；
- 照片不默认进入 AI；
- 照片不用于公开展示；
- 照片不进入 localStorage；
- 页面不直接操作 IndexedDB；
- 组件只通过 lib/storage 访问照片能力；
- 当前不做 Portfolio 首图；
- 当前不做 ZIP 导出；
- 当前不做 ZIP 导入；
- 当前不做云端照片同步。

### 4.3 Phase 3D 关键文件

照片类型与 storage：

- src/types/listing-photo.ts
- src/lib/storage/provider.ts
- src/lib/storage/local-photo-provider.ts
- src/lib/storage/photos.ts
- src/lib/storage/index.ts
- src/lib/storage/photos-contract-check.ts

Detail 照片面板：

- src/components/listing-photo-panel.tsx
- src/components/listing-detail-view.tsx

Settings 照片数据权利：

- src/components/settings-photo-data-panel.tsx
- src/app/settings/page.tsx
- src/content/zh-cn.ts

相关文档：

- docs/dev-log/2026-05-04-phase-3d-local-photo-persistence-checkpoint.md
- docs/dev-log/2026-05-04-phase-3d-4f-photo-clear-all-regression.md

---

## 5. Phase 3E 当前完成情况：结构化 JSON 导入闭环

Phase 3E 在 v2.0 下应理解为：

**本地优先数据权利层强化：结构化 localStorage 数据的导出、导入和清除。**

它不是完整备份系统，也不是照片迁移系统。

### 5.1 已完成能力

当前 Settings 本地数据区域已经支持：

- 查看 LocalStorage 数据快照；
- 导出本地 HouseFolio JSON；
- 清除本机结构化数据；
- 选择本地 .json 文件；
- 导入本地 HouseFolio JSON；
- 兼容当前导出的 items 快照结构；
- 只导入白名单内的 HouseFolio localStorage keys；
- 忽略未知 key；
- 无效 JSON 不写入；
- 没有可导入 key 时不写入；
- 导入前要求用户确认覆盖；
- 导入成功后刷新 Settings 本地数据快照；
- 导入失败时页面显示红色提示；
- 导入失败时浏览器弹窗再次提示；
- 文案明确 JSON 导入不包含看房照片。

### 5.2 当前允许导入的 key

当前只允许导入：

- housefolio:listings
- housefolio:listing-notes
- housefolio:listing-ratings
- housefolio:listing-status-overrides
- housefolio:work-locations
- housefolio:commute-results

这些属于结构化 localStorage 数据。

### 5.3 当前明确不导入的内容

当前 JSON 导入明确不处理：

- IndexedDB 照片 Blob；
- 照片缩略图；
- 照片 object URL；
- ZIP 备份包；
- 云端对象存储；
- AI 输出；
- AI prompt；
- 高德原始路线 JSON；
- 地图数据；
- Supabase 数据；
- 任意第三方平台数据；
- 任意未知 localStorage key；
- 浏览器中其他网站数据。

### 5.4 Phase 3E 关键文件

Privacy / local data：

- src/lib/privacy/local-data.ts
- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts

Settings UI：

- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts

Architecture / dev-log：

- docs/architecture/phase-3e-json-import-boundary-review.md
- docs/architecture/phase-3e-settings-json-import-ui-plan.md
- docs/dev-log/2026-05-04-phase-3e-2-json-import-helper-checkpoint.md
- docs/dev-log/2026-05-04-phase-3e-4e-json-import-ui-regression.md
- docs/dev-log/2026-05-04-phase-3e-5-json-import-closing.md

---

## 6. Phase 3F 当前完成情况

### 6.1 Phase 3F-0：阶段总回归检查

已确认：

- git status clean；
- 
pm.cmd run build 通过；
- Phase 3D checkpoint 文件存在；
- Phase 3E closing 文件存在；
- Phase 3E regression 文件存在；
- Phase 3E boundary review 文件存在；
- Phase 3E UI plan 文件存在；
- docs 与 src 下仅 src/app/favicon.ico 存在 NUL 字节；
- avicon.ico 是正常二进制图标文件，不属于源码或文档异常。

### 6.2 Phase 3F-1：总回归日志

已生成并提交：

- docs/dev-log/2026-05-04-phase-3f-1-total-regression.md

当前确认：

- NUL bytes = 0；
- build 通过；
- git clean。

---

## 7. 当前数据权利闭环

当前 HouseFolio 本地优先基础层已经形成：

`	ext
用户主动添加房源
→ localStorage 保存结构化数据
→ Detail 写笔记 / 评分 / 状态
→ Settings 查看本地数据快照
→ Settings 导出结构化 JSON
→ Settings 导入结构化 JSON
→ Settings 清除结构化数据
→ Detail 添加本机照片
→ IndexedDB 保存照片 Blob
→ Settings 查看照片数量和占用空间
→ Settings 清除全部本机照片

注意：

JSON 和照片仍然是两条独立边界：

JSON 只处理结构化 localStorage 数据；
照片文件本体保存在 IndexedDB；
当前还没有统一备份包；
当前还不能迁移照片；
当前不应声称“完整恢复全部数据”。
8. 当前产品边界

当前 HouseFolio 仍然是：

本地优先的私人找房决策工具；
用户主动添加候选房源；
用户本机保存看房照片；
用户本机导出 / 导入结构化数据；
不抓取第三方房源；
不搬运贝壳、58、小红书、豆瓣等平台内容；
不公开用户房源库；
不做房东端；
不预约看房；
不联系房东或中介；
不撮合交易；
不收佣金、保证金或服务费；
不认证真房源；
不宣传“最佳房源”“系统推荐”“替你决定”。
9. 当前架构边界

当前仍然遵守：

页面和组件不得直接调用平台 SDK；
照片能力通过 lib/storage；
本地结构化数据通过 lib/privacy 与 lib/local-store；
LBS 通过 lib/lbs；
L2 通过 lib/algorithm；
AI 未来必须通过 lib/ai；
UI 文案集中在 src/content/zh-cn.ts；
页面不得直接访问高德；
页面不得直接访问 Supabase；
页面不得直接访问 AI API；
页面不得直接读取第三方网页内容；
页面不得直接把照片上传云端。
10. Windows + PowerShell 规则

当前环境：

Windows + PowerShell
项目路径：E:\Projects\housefolio

所有命令默认使用：

npm.cmd run dev
npm.cmd run build
npm.cmd install
npx.cmd ...

不要默认输出：

npm run dev
npm run build
npm install
npx ...

写入 .tsx / .ts / .md / .json 等文件，尤其包含中文时，必须使用 .NET WriteAllText 写 UTF-8 无 BOM，或使用 Node fs.writeFileSync(..., "utf8")。

不要用：

@'
...
'@ | Set-Content file.tsx

不要用 PowerShell Get-Content 的显示结果判断中文是否损坏。

判断中文真实状态时，优先使用：

node -e "const fs=require('fs'); const s=fs.readFileSync('src/content/zh-cn.ts','utf8'); console.log(s.includes('首页'))"
npm.cmd run build

动态路由 [id] 读取必须使用：

Get-Content -LiteralPath "src\app\portfolio\[id]\page.tsx"
Get-ChildItem -LiteralPath "src\app\portfolio\[id]"
11. 新对话第一步建议检查

新对话开始后，不要直接写功能，先执行：

Set-Location E:\Projects\housefolio

git status

npm.cmd run build

git log -20 --oneline

Test-Path docs\dev-log\2026-05-04-phase-3f-1-total-regression.md
Test-Path docs\dev-log\2026-05-04-phase-3e-5-json-import-closing.md
Test-Path docs\dev-log\2026-05-04-phase-3d-local-photo-persistence-checkpoint.md

node -e "const fs=require('fs'); const files=['src/components/settings-local-data-panel.tsx','src/content/zh-cn.ts','src/lib/privacy/local-data-import.ts','src/lib/storage/local-photo-provider.ts']; for(const file of files){ const b=fs.readFileSync(file); const s=b.toString('utf8'); console.log(file, 'nul:', [...b].filter(x=>x===0).length, 'length:', s.length); }"

预期：

git status clean；
build 通过；
最新 commit 应为本 handoff 文档或之后的收口文档；
三个 Test-Path 均为 True；
关键 .ts / .tsx 文件 NUL 均为 0。
12. 下一轮建议路线

下一轮可以在以下方向中选择一个。

方向 A：Phase 3G-0｜Portfolio 首图前置评审

只做评审，不实现。

目标：

评估是否应该让 Portfolio 卡片读取本地照片首图；
检查它是否会让照片能力过快扩张；
明确首图只读、只本机、只通过 lib/storage；
明确不做云相册、不做公开图册、不做第三方房源图片展示；
明确是否需要先于完整备份包执行。
方向 B：Phase 3G-0｜完整备份包前置评审

只做评审，不实现。

目标：

评估 JSON + 照片 ZIP 备份包的合理顺序；
明确 JSON 导入已完成，但照片迁移仍缺口；
明确备份包会显著增加复杂度；
避免过早做复杂 ZIP 逻辑。
方向 C：Phase 3G-0｜Settings 数据权利文案总校准

只做小范围文案评审，不大改 UI。

目标：

检查 Settings 中 localStorage、照片、JSON 导入、清除数据的说明是否一致；
检查是否需要把 Phase 1 / Phase 2 的过时文案更新成 v2.0 本地优先表述；
不新增功能。
13. 当前推荐下一步

当前最稳建议：

Phase 3G-0｜Portfolio 首图前置评审

但注意：

只做评审文档；
不实现 Portfolio 首图；
不改 listing-card.tsx；
不读 IndexedDB；
不接 ZIP；
不接 AI；
不接云同步。

理由：

Phase 3D 已经完成 Detail 本机照片；
Portfolio 首图是自然的可见化增强；
但它也可能推动照片能力从“私人资料管理”滑向“房源图册展示”；
所以必须先评审产品边界，再决定是否实现。
14. 当前禁止误跳内容

下一轮不要直接跳到：

AI / DeepSeek；
地图 UI；
POI / 生活圈真实计算；
Supabase；
部署；
Chrome 插件；
/compare；
Phase 4A comparison data model；
ZIP 照片导出；
ZIP 照片导入；
Portfolio 首图实现；
云端照片同步；
AI 照片分析；
全站 UI 大改。
15. 建议提交信息

建议 commit：

docs: add phase 3d 3e handoff