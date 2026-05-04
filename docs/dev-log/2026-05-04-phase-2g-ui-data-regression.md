# HouseFolio 开发日志｜2026-05-04｜Phase 2G｜UI / Data Regression Checkpoint

## 1. 本阶段目标

Phase 2G 是 Phase 2D–2F 之后的 UI / data regression checkpoint。

本阶段不写新功能，不新增页面，不新增路由，不接 AI，不接地图 UI，不接 POI，不接 Supabase，不进入正式 Phase 4A comparison data model。

目标是确认：

1. 当前代码仍然 build 通过；
2. Git 状态 clean；
3. Phase 2F 新增的 comparison selector 没有污染 UI / LBS / 隐私边界；
4. 关键 UI 与数据文件没有中文乱码；
5. Settings 本地数据权利覆盖当前所有 localStorage key。

## 2. 已执行检查

### 2.1 Git 与 build

已执行：

```powershell
git status
npm.cmd run build

结果：

working tree clean
build 通过
2.2 关键文件编码检查

检查文件：

src/lib/algorithm/comparison.ts
src/lib/algorithm/comparison-contract-check.ts
src/lib/local-store/listing-lookup.ts
src/components/listing-card.tsx
src/components/listing-detail-view.tsx
src/components/listing-commute-panel.tsx
src/lib/privacy/local-data.ts

检查项：

contains mojibake 鈥
contains garbled 北京 / 鍖椾含

结果：

全部 false

说明这些关键文件未发现已知中文乱码污染。

2.3 comparison selector 禁止字段扫描

检查文件：

src/lib/algorithm/comparison.ts

扫描禁止字段：

localStorage
fetch(
AMAP
NEXT_PUBLIC
apiKey
requestUrl
rawResponse
polyline
steps
coordinate
coordinates
sourceUrl
photo
photos
DeepSeek
supabase

结果：

无命中
comparison selector scan done

说明 comparison.ts 仍然保持纯函数 selector 边界，没有引入平台、地图、AI、隐私敏感字段或副作用。

2.4 Settings 本地数据 key 覆盖检查

检查文件：

src/lib/privacy/local-data.ts

确认以下 key 均已覆盖：

housefolio:work-locations
housefolio:commute-results
housefolio:listings
housefolio:listing-notes
housefolio:listing-ratings
housefolio:listing-status-overrides

结果：

全部 true

说明 Settings 的本地数据查看 / 导出 / 清除仍覆盖当前已使用的主要 localStorage 数据。

3. 当前结论

Phase 2G 回归检查通过。

当前确认：

Phase 2D 的 L1 Detail transit 闭环仍稳定；
Phase 2E 的 commute-results → Reference Score 闭环仍稳定；
Phase 2F 的 comparison input selector 没有影响 UI；
comparison selector 没有读取 localStorage；
comparison selector 没有访问高德 / AI / Supabase；
comparison selector 没有纳入坐标、原始路线、照片、sourceUrl 等不该进入 L2 comparison 的字段；
本地数据权利覆盖 work-locations 与 commute-results。
4. 当前项目状态

截至本日志，HouseFolio 当前已完成：

Phase 2D：L1 Detail 手动 transit 通勤计算闭环
Phase 2E：L1 commute-results → L2 Reference Score 最小闭环
Phase 2F：L2 comparison foundation + input boundary + pure selector draft
Phase 2G：UI / data regression checkpoint
5. 后续建议

下一步建议不要继续扩 comparison，也不要进入正式 Phase 4A。

更稳妥的后续方向是：

Phase 2H：Phase 2 closing / handoff document

目标是生成一份可加入 Project Sources 的接续文档，记录 Phase 2D–2G 的最终状态、最新 commit、下一步第一步该做什么。

如果继续开发，也应先做小范围回归或文档收口，不直接跳到 AI、地图 UI、POI、Supabase、部署、Chrome 插件或正式 comparison data model。