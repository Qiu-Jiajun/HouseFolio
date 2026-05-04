# HouseFolio 接续文档｜2026-05-05｜Phase 3I-0 Handoff

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
- 不把照片做成云相册或公共房源图册；
- 不把视频功能当成照片功能的简单后缀扩展。

当前最新已完成到：

Phase 3H-1：看房照片/视频本机保存边界评审

当前最后确认 commit：

1b6179a docs: review local viewing media boundary

当前已确认状态：

- npm.cmd run build 通过；
- git status clean；
- Phase 3D：本地照片持久化闭环完成；
- Phase 3E：结构化 JSON 导入闭环完成；
- Phase 3F：总回归与 handoff 完成；
- Phase 3G：Portfolio 本机首图完成；
- Phase 3H：本地优先数据权利阶段总收口完成；
- Phase 3H-1：看房照片/视频本机保存边界评审完成；
- 视频已经进入长期路线图边界，但当前不实现、不改 UI、不改 storage model、不重构 ListingPhoto。

本文件的目的：

把 Phase 3D–3H-1 的最终状态整理为新对话可直接读取的 Project Source，避免下一轮误判进度、重复做阶段、误跳 Demo Mode 或 Phase 4A。

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

不要直接跳到：

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
- AI 视频分析；
- 视频 OCR；
- 语音转文字；
- 全站白色居家风重构。

---

## 2. v2.0 总原则

v2.0 将 HouseFolio 定义为：

本地优先的私人找房决策工具。

这不是离线笔记工具，也不是削弱 L1 / L2 / L3。v2.0 的核心是把三层决策引擎放进一个更成熟、更安全、更适合个人开发者执行的本地优先产品形态中。

核心姿态：

- 用户主动添加；
- 默认私有；
- 本地优先；
- 按需联网；
- 只传必要字段；
- 尽量模糊；
- 不存高敏原文；
- 可导出；
- 可导入；
- 可清除；
- 云同步后置且可选。

三层引擎仍然是核心：

- L1 LBS：通勤、生活圈、地图、空间关系；
- L2 算法：参考评分、排序、筛选、对比、异常提示；
- L3 AI：总结、建议、解释、checklist、风险信号人话化。

当前已经形成的是本地优先基础层 + L1 → L2 最小闭环，不代表 L3 已接入。

---

## 3. 当前页面与路由状态

当前核心路由仍为：

- /
- /portfolio
- /portfolio/new
- /portfolio/[id]
- /settings
- /api/lbs/commute/transit

当前没有新增：

- /compare
- Demo Mode 页面
- 地图页面
- AI 页面
- Supabase 页面
- Chrome 插件入口
- 云同步入口

当前核心用户闭环：

首页
→ Portfolio
→ 添加房源
→ localStorage 保存
→ Portfolio 展示
→ 详情页
→ 写笔记
→ 打主观评分
→ 修改状态
→ Settings 添加工作/学习地点（通勤锚点）
→ Detail 手动计算 transit 参考通勤
→ /api/lbs/commute/transit 服务端调用高德
→ 客户端保存 commute-results 摘要
→ L2 Reference Score 使用 cached transit
→ Portfolio 卡片显示通勤来源与参考评分
→ Detail 添加本机照片
→ IndexedDB 保存照片 Blob
→ Portfolio 显示本机首图
→ Settings 查看 / 导出 / 导入 / 清除结构化数据
→ Settings 查看 / 清除本机照片数据

---

## 4. Phase 2 已完成主线摘要

### Phase 2D：L1 Detail 手动 transit 通勤计算闭环

已完成：

- Detail 页 L1 区域可手动计算公共交通参考通勤；
- 客户端只调用 /api/lbs/commute/transit；
- 服务端 route 调用 lib/lbs；
- 服务端不暴露高德 key；
- 服务端只返回 SaveCommuteResultInput[] 摘要；
- 客户端写入 housefolio:commute-results；
- Settings 可查看 / 导出 / 清除 commute-results。

边界：

- 不返回 coordinate；
- 不返回 raw JSON；
- 不返回 request URL；
- 不返回 polyline；
- 不返回 steps；
- 不返回 apiKey；
- 不使用 NEXT_PUBLIC_AMAP_API_KEY。

### Phase 2E：L1 commute-results → L2 Reference Score 最小闭环

已完成：

- listing-lookup.ts 读取本地 cached transit；
- 只读取 mode === "transit"；
- 多个 transit 结果暂取最短 durationMinutes；
- 没有 cached transit 时回退 listing 默认 commuteMinutes；
- commuteSource 标记为“默认参考值 / 本地通勤结果”；
- Portfolio 卡片、通勤排序、Detail L2 breakdown 均可消费运行时通勤值。

Reference Score 仍然只能是：

- 参考评分；
- 辅助比较；
- 维度拆解；
- 不代表最终推荐。

不能写成：

- 推荐分；
- 最佳房源；
- 最优选择；
- 系统推荐；
- 替你决定。

### Phase 2F：L2 comparison foundation

已完成：

- comparison foundation review；
- comparison input boundary；
- pure selector draft；
- src/lib/algorithm/comparison.ts；
- src/lib/algorithm/comparison-contract-check.ts。

当前 selector 只做数据整形：

- 不读取 localStorage；
- 不写入 localStorage；
- 不访问高德；
- 不访问 AI；
- 不访问 Supabase；
- 不排序；
- 不筛选；
- 不评分；
- 不推荐；
- 不处理笔记原文；
- 不处理照片。

正式 comparison data model 尚未开始。

---

## 5. Phase 3A–3C 已完成摘要

### Phase 3A：UI structure review / visual polish boundary

已完成：

- 检查首页、Portfolio、Add Listing、Detail、Settings；
- 确认核心页面均接入 AppNav；
- 确认核心页面均接入 ComplianceFooter；
- 确认 Detail 页可返回 Portfolio；
- 确认页面入口闭环完整；
- 确认当前 UI 仍保持工程 Demo 风格；
- 确认后续视觉 polish 应小步推进，不应大改。

### Phase 3B：Light visual polish + ListingCard micro polish

已完成：

- ListingCard 卡片层级微调；
- 租金字段视觉权重增强；
- 通勤时间和参考评分提升为更明显的决策字段；
- 面积、户型、生活圈保留为辅助字段；
- commuteSource 保留；
- referenceScoreNote 保留；
- 查看详情入口保留；
- 不改变数据、算法、路由、文案和产品边界。

### Phase 3C：Phase 3 UI checkpoint

已完成：

- Phase 3 UI checkpoint；
- build 通过；
- git clean；
- 确认 Phase 3A / 3B 文档完整；
- 确认 ListingCard micro polish 已回归；
- 确认产品边界未扩张；
- 确认技术边界未破坏；
- 确认未进入 Phase 4A、AI、地图、POI、Supabase。

---

## 6. Phase 3D：本地照片持久化闭环

Phase 3D 在 v2.0 下应理解为：

本地优先基础层强化：高敏找房资料的本机持久化与数据权利前置。

它不是孤立“照片功能”，而是 v2.0 本地优先产品形态的一部分。

已完成能力：

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

关键边界：

- 照片默认本机保存；
- 照片不默认上传云端；
- 照片不默认进入 AI；
- 照片不用于公开展示；
- 照片不进入 localStorage；
- 页面不直接操作 IndexedDB；
- 组件只通过 lib/storage 访问照片能力；
- 当前不做 ZIP 照片导出；
- 当前不做 ZIP 照片导入；
- 当前不做云端照片同步；
- 当前不做 AI 照片分析。

关键文件：

- src/types/listing-photo.ts
- src/lib/storage/provider.ts
- src/lib/storage/local-photo-provider.ts
- src/lib/storage/photos.ts
- src/lib/storage/index.ts
- src/lib/storage/photos-contract-check.ts
- src/components/listing-photo-panel.tsx
- src/components/listing-detail-view.tsx
- src/components/settings-photo-data-panel.tsx
- src/app/settings/page.tsx
- src/content/zh-cn.ts

---

## 7. Phase 3E：结构化 JSON 导入闭环

Phase 3E 在 v2.0 下应理解为：

本地优先数据权利层强化：结构化 localStorage 数据的导出、导入和清除。

它不是完整备份系统，也不是照片迁移系统。

已完成能力：

- Settings 查看 LocalStorage 数据快照；
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

关键文件：

- src/lib/privacy/local-data.ts
- src/lib/privacy/local-data-import.ts
- src/lib/privacy/local-data-import-contract-check.ts
- src/components/settings-local-data-panel.tsx
- src/content/zh-cn.ts

---

## 8. Phase 3F：总回归与 handoff

Phase 3F 完成了 Phase 3D–3E 的总回归与 handoff。

已确认：

- git status clean；
- npm.cmd run build 通过；
- Phase 3D checkpoint 文件存在；
- Phase 3E closing 文件存在；
- Phase 3E regression 文件存在；
- Phase 3E boundary review 文件存在；
- Phase 3E UI plan 文件存在；
- docs 与 src 下仅 src/app/favicon.ico 存在 NUL 字节；
- favicon.ico 是正常二进制图标文件，不属于源码或文档异常。

对应文档：

- docs/dev-log/2026-05-04-phase-3f-1-total-regression.md
- docs/dev-log/2026-05-04-phase-3f-2-phase-3d-3e-handoff.md

---

## 9. Phase 3G：Portfolio 本机首图

Phase 3G 完成了 Portfolio 本机首图能力。

当前应理解为：

本地照片能力的轻量可见化增强，而不是房源图册化、云相册化或公开展示。

已完成能力：

- Portfolio 卡片可以读取本机照片封面；
- 首图来自本机 IndexedDB；
- 图片不进入 localStorage；
- 图片不上传云端；
- 图片不进入 AI；
- 页面仍通过 lib/storage 读取照片；
- 不直接操作 IndexedDB；
- 不生成公开分享；
- 不从第三方平台搬运图片；
- 不做云端封面；
- 不做图片抓取；
- 不做平台房源图库。

边界：

- Portfolio 首图只是用户本人设备上的私有可见化；
- 它不代表 HouseFolio 变成房源展示平台；
- 不应用于 PR 真实案例素材；
- Demo Mode 未来只能使用虚构或授权素材。

---

## 10. Phase 3H：本地优先数据权利阶段总收口

Phase 3H 已完成并提交。

当前最新确认 commit 曾为：

71f0eb4 docs: close local first data rights phase

Phase 3H 将 Phase 3D–3G 统一收口为：

v2.0 本地优先数据权利层。

已确认阶段成果：

- 本地照片持久化；
- Settings 照片数据可见；
- 清除全部本机照片；
- 结构化 JSON 导出；
- 结构化 JSON 导入；
- Portfolio 本机首图；
- 本地优先数据权利阶段总收口。

Phase 3H 的重要判断：

- 当前不建议继续扩张照片能力；
- 下一步最稳是生成新对话 handoff；
- 或在 handoff 之后进入 Demo Mode 前置评审；
- 或在 handoff 之后进入 L2 comparison 前置评审。

---

## 11. Phase 3H-1：看房照片/视频本机保存边界评审

Phase 3H-1 已完成并提交。

当前最新确认 commit：

1b6179a docs: review local viewing media boundary

新增文档：

- docs/architecture/phase-3h-1-local-viewing-media-boundary-review.md

结论：

- 视频确实属于真实看房资料的一部分；
- 视频不应该被当成“照片功能顺手扩一下”；
- 当前不应马上实现视频存储；
- 短期保持“看房照片｜本机保存”稳定；
- 中期先做“看房照片/视频｜本机保存”的边界评审；
- 长期可把照片能力升级为“本机看房媒体资料”能力；
- 当前不改 UI；
- 当前不改 ListingPhoto；
- 当前不新增 ListingMedia；
- 当前不改 IndexedDB schema；
- 当前不新增视频 object store；
- 当前不做视频 AI 分析；
- 当前不做视频 OCR；
- 当前不做语音转文字；
- 当前不做云同步；
- 当前不做视频 ZIP 导出；
- 当前不抓取中介视频链接。

未来如果实现视频，必须坚持：

- 用户主动选择本机视频文件；
- 本机保存；
- 按 listingId 绑定；
- 只在 Detail 页按需播放；
- 不在 Portfolio 直接播放；
- 不 autoplay；
- 不进入 AI；
- 不上传云端；
- 不公开；
- 不作为 Demo 素材；
- 不做真实性背书；
- 不抓取第三方平台视频。

---

## 12. 当前本地数据权利闭环

当前 HouseFolio 已形成：

用户主动添加房源
→ localStorage 保存结构化数据
→ Detail 写笔记 / 评分 / 状态
→ Settings 查看本地数据快照
→ Settings 导出结构化 JSON
→ Settings 导入结构化 JSON
→ Settings 清除结构化数据
→ Detail 添加本机照片
→ IndexedDB 保存照片 Blob
→ Portfolio 显示本机首图
→ Settings 查看照片数量和占用空间
→ Settings 清除全部本机照片
→ Phase 3H-1 将视频纳入长期“本机看房媒体资料”边界，但不实现

注意：

JSON 和照片仍然是两条独立边界：

- JSON 只处理结构化 localStorage 数据；
- 照片文件本体保存在 IndexedDB；
- 当前还没有统一备份包；
- 当前还不能迁移照片；
- 当前不应声称“完整恢复全部数据”。

---

## 13. 当前尚未完成，不要误称完成

当前还没有完成：

- Demo Mode；
- Demo 入口；
- Demo 数据隔离；
- Demo 虚构房源；
- Demo 预置 L1 / L2 / L3 输出；
- L3 AI 接入；
- AI checklist；
- AI 对比建议；
- /compare 路由；
- 多房源勾选；
- 横向对比表；
- 正式 ComparisonModel；
- 异常值检测；
- 相对性价比；
- 复杂多锚点权重；
- POI / 生活圈真实计算；
- 地图 UI；
- Supabase；
- 部署；
- Chrome 插件；
- ZIP 照片导出；
- ZIP 照片导入；
- 统一备份包恢复；
- 云端照片同步；
- AI 照片分析；
- 视频存储；
- ListingMedia model；
- 视频播放器；
- 视频 OCR；
- 语音转文字。

---

## 14. 下一轮推荐二选一

Phase 3I-0 完成后，下一轮建议在以下两个方向中二选一。

### 方向 A：Phase 3I-1 Demo Mode 前置评审

适合情况：

希望继续服务求职作品集展示，让面试官 5 分钟内看懂产品价值。

只写评审文档，不改代码。

应回答：

- Demo Mode 是否需要独立入口；
- Demo 数据是否完全虚构；
- Demo 是否允许使用照片；
- Demo 是否允许展示预置 L1 / L2 / L3；
- Demo Mode 是否读取真实 localStorage；
- Demo Mode 是否允许修改真实用户数据；
- Demo Mode 和真实用户模式如何隔离；
- 当前阶段是否只做文档，不做代码。

建议文件：

- docs/architecture/phase-3i-1-demo-mode-boundary-review.md

### 方向 B：Phase 4A-0 L2 comparison 前置评审

适合情况：

希望回到三层引擎主线，正式推进 L2 对比视图前的模型边界。

只写评审文档，不改代码。

应回答：

- comparison data model 是否基于 Phase 2F selector；
- 是否新增 /compare 路由；
- 是否允许多房源勾选；
- 是否需要 ComparisonModel；
- 当前是否只做 input model，不做 UI；
- L2 comparison 是否仍然只用规则和简单数学；
- 是否禁止 LLM 参与评分、排序、筛选；
- 是否禁止处理笔记原文和照片。

建议文件：

- docs/architecture/phase-4a-0-l2-comparison-boundary-review.md

---

## 15. 我对下一步的建议

下一轮最稳建议：

优先进入 Phase 3I-1：Demo Mode 前置评审。

理由：

- HouseFolio 是求职作品集；
- Phase 3D–3H 已经补齐本地优先数据权利层；
- Demo Mode 能让面试官快速看到完整价值；
- Demo Mode 仍可先做边界评审，不需要马上改代码；
- 相比直接进入 Phase 4A，Demo Mode 更服务于“能展示、能讲故事”的目标。

但如果用户明确想回到 L2 主线，也可以进入 Phase 4A-0。

---

## 16. 新对话启动检查

新对话第一步必须让用户执行：

Set-Location E:\Projects\housefolio

git status

npm.cmd run build

git log -20 --oneline

Test-Path docs\architecture\phase-3h-1-local-viewing-media-boundary-review.md

Test-Path docs\dev-log\2026-05-04-phase-3h-local-first-data-rights-closing.md

Test-Path docs\dev-log\2026-05-04-phase-3f-2-phase-3d-3e-handoff.md

Test-Path docs\dev-log\2026-05-04-phase-3f-1-total-regression.md

根据输出判断：

1. build 是否通过；
2. git 是否 clean；
3. 最新 commit 是否至少包含 1b6179a docs: review local viewing media boundary；
4. Phase 3H-1 文档是否存在；
5. Phase 3H 收口文档是否存在；
6. Phase 3F handoff 是否存在；
7. 是否可以进入 Phase 3I-1 Demo Mode 前置评审，或 Phase 4A-0 L2 comparison 前置评审。

---

## 17. Windows + PowerShell 规则

当前环境：

Windows + PowerShell
项目路径：E:\Projects\housefolio

命令必须使用：

- npm.cmd run dev
- npm.cmd run build
- npm.cmd install
- npx.cmd ...

不要默认输出：

- npm run dev
- npm run build
- npm install
- npx ...

写入 .tsx / .ts / .md / .json 等文件，尤其包含中文时，必须使用 .NET WriteAllText 写 UTF-8 无 BOM。

不要使用：

- Set-Content file.tsx
- @' ... '@ | Set-Content file.tsx

动态路由 [id] 读取必须使用：

- Get-Content -LiteralPath "src\app\portfolio\[id]\page.tsx"
- Get-ChildItem -LiteralPath "src\app\portfolio\[id]"

不要用 PowerShell Get-Content 的显示结果判断中文文件是否损坏。Windows PowerShell 可能把 UTF-8 无 BOM 中文显示成乱码，但文件本身正常。

中文检查优先使用 Node UTF-8 检查 + build + 浏览器显示。

---

## 18. 当前最终结论

Phase 3I-0 到此为止。

当前状态应理解为：

Phase 3D–3H-1 已经完整收口为 v2.0 本地优先数据权利层 + 看房媒体长期边界。

下一轮不要继续扩张照片 / 视频能力。

下一轮推荐先做：

Phase 3I-1：Demo Mode 前置评审

或根据用户选择进入：

Phase 4A-0：L2 comparison 前置评审

两者都应先只写评审文档，不改代码。