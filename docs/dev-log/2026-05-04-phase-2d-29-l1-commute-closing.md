# HouseFolio 开发日志｜Phase 2D-29｜L1 commute phase closing｜2026-05-04

## 1. 本阶段定位

本日志用于收尾 Phase 2D 的 L1 通勤计算阶段。

当前 HouseFolio 已完成到：

```text
Phase 2D-28：Transit route contract check

Phase 2D-29 不新增功能，只记录当前 L1 commute 能力边界、已完成文件、验证结果、安全边界和下一步候选路线。

本阶段继续遵守 HouseFolio 的长期定位：

私人找房决策管理工具
不抓取
不聚合
不公开用户房源库
不撮合
不认证真房源
不替用户做最终决定
2. 当前 L1 commute 能力边界

当前 Detail 页已经具备最小可用的 L1 公共交通参考通勤闭环。

已完成链路：

ListingCommutePanel client component
→ 调用 /api/lbs/commute/transit
→ server route 调用 lib/lbs/service.ts
→ active LBS provider 调用高德 Web Service
→ 服务端 geocode 房源地址线索
→ 服务端 geocode 工作/学习地点（通勤锚点）
→ 服务端 calculateCommute(mode: "transit")
→ route 只返回 SaveCommuteResultInput[] 摘要
→ client upsert 到 housefolio:commute-results
→ Detail 页读取 localStorage 并结构化展示
→ Settings 可查看 / 导出 / 清除 commute-results

当前页面能力：

1. Detail 页 L1 区域可以手动计算公共交通参考通勤；
2. 只触发 transit，不触发 walking / cycling / driving；
3. 已保存结果会结构化展示：
   - 通勤锚点 anchorName
   - 通勤方式 mode
   - 参考时长 durationMinutes
   - 参考距离 distanceMeters
   - summary
   - calculatedAt
4. 没有通勤锚点时禁用按钮；
5. 房源缺少地址线索时禁用按钮；
6. API 失败时只展示用户可理解的通用失败提示；
7. 通勤结果始终标记为参考信息，只作辅助比较。

当前明确不做：

Portfolio 批量计算
页面默认自动计算
四种 mode 同时计算
通勤偏好 UI
L2 参考评分消费真实通勤结果
AI 分析消费通勤摘要
地图 UI
POI / 生活圈真实计算
Supabase
部署上线
Chrome 插件

原因：

当前刚完成 Detail 页真实 transit 计算闭环。
此时优先级是收尾、审查、稳定，而不是扩张功能面。
3. 当前完成到 Phase 2D-28

今天已经连续完成：

Phase 2D-22：Detail 手动计算 transit
Phase 2D-23：手动 transit 计算日志
Phase 2D-24：Detail 通勤结果结构化展示
Phase 2D-25：空状态 / 错误状态打磨
Phase 2D-26：通勤结果 UI 状态日志
Phase 2D-27：Detail commute route/server boundary review
Phase 2D-28：Transit route contract check
Phase 2D-29：L1 commute phase closing log

最近重要提交包括：

feat: add manual transit commute calculation
docs: log manual transit commute calculation
feat: refine commute result display
feat: polish commute empty states
docs: log commute result UI states
fix: sanitize transit commute route errors
test: add transit commute route contract check
4. 已完成关键文件清单
4.1 Detail L1 通勤 UI
src/components/listing-commute-panel.tsx
src/components/listing-detail-view.tsx
4.2 Transit API route
src/app/api/lbs/commute/transit/route.ts

职责：

1. 接收 Detail 页发来的 listing + workLocations；
2. 在服务端 geocode；
3. 在服务端 calculateCommute(mode: "transit")；
4. 只返回可保存摘要；
5. 不返回高德原始数据；
6. 不返回 key；
7. 不返回坐标；
8. 不返回底层 Error.message。
4.3 Transit route 共享类型与 contract check
src/types/transit-commute-route.ts
src/types/transit-commute-route-contract-check.ts

作用：

1. 抽出 /api/lbs/commute/transit 的 request / response 类型；
2. route.ts 与 ListingCommutePanel 复用同一套类型；
3. 用 TypeScript contract check 约束 response 不暴露敏感字段；
4. 防止后续改动把 rawResponse / requestUrl / polyline / steps / apiKey 等字段带回客户端。
4.4 commute-results 本地存储
src/types/commute-result.ts
src/lib/local-store/commute-results.ts

localStorage key：

housefolio:commute-results

允许保存：

listingId
anchorId
anchorName
mode
provider
isMock
durationMinutes
distanceMeters
summary
calculatedAt

禁止保存：

高德完整路线 JSON
完整请求 URL
完整 polyline
完整公交站点列表
完整换乘详情
完整步行 / 骑行 / 驾车导航步骤
经纬度
AMAP_API_KEY
4.5 工作/学习地点（通勤锚点）
src/types/work-location.ts
src/lib/local-store/work-locations.ts
src/components/work-location-settings-panel.tsx

localStorage key：

housefolio:work-locations

当前产品定义：

工作/学习地点（通勤锚点）

该定义不等同于单一工作地点，后续 L1 应继续支持 2–3 个通勤锚点之间的空间折中。

4.6 LBS provider / service
src/lib/lbs/provider.ts
src/lib/lbs/service.ts
src/lib/lbs/registry.ts
src/lib/lbs/amap-provider.ts
src/lib/lbs/amap-contract.ts
src/lib/lbs/mock-provider.ts
src/lib/lbs/index.ts

当前边界：

页面和组件不得直接调用高德 REST API
页面和组件不得读取 AMAP_API_KEY
所有真实 LBS 能力必须通过 lib/lbs 与 server route 边界进入
4.7 LBS config
src/lib/config/lbs.ts
src/lib/config/index.ts
4.8 Settings / privacy
src/lib/privacy/local-data.ts
src/components/settings-local-data-panel.tsx
src/app/settings/page.tsx

当前 Settings 已覆盖：

housefolio:work-locations
housefolio:commute-results

并支持本地数据快照、导出 JSON、清除本机 HouseFolio 数据。

4.9 中文文案
src/content/zh-cn.ts

注意：

不要用 PowerShell Get-Content 的显示结果判断中文是否损坏。
应使用 Node UTF-8 检查 + npm.cmd run build + 浏览器显示判断。
5. 本次收尾前已验证事项

本次 Phase 2D-29 前已执行并通过：

git status
npm.cmd run build
git check-ignore -v .env.local
Key / NEXT_PUBLIC_AMAP 检查
route 编码检查
route response 敏感字段检查

验证结果：

git status clean
npm.cmd run build 通过
.env.local 被 .gitignore 命中
未发现真实 key 泄露
未发现 NEXT_PUBLIC_AMAP
route.ts UTF-8 编码正常
contains 北京: true
contains garbled: false

route response 敏感字段检查结果：

只命中：
src\app\api\lbs\commute\transit\route.ts:158: origin: listingGeocode.coordinate,
src\app\api\lbs\commute\transit\route.ts:159: destination: anchorGeocode.coordinate,

解释：

这两个 coordinate 只在服务端内部用于调用 calculateCommute。
它们不进入 API response。
它们不进入 client。
它们不进入 localStorage。
它们不进入 Detail 展示。
6. route/server boundary 检查结果

当前 /api/lbs/commute/transit 的安全边界是可接受的。

已经确认：

1. client component 不直接请求高德 REST API；
2. client component 不读取 process.env.AMAP_API_KEY；
3. 没有 NEXT_PUBLIC_AMAP_API_KEY；
4. route 在服务端内部调用 lib/lbs/service.ts；
5. route response 只返回摘要；
6. route 不返回 coordinate；
7. route 不返回 raw JSON；
8. route 不返回 request URL；
9. route 不返回 polyline；
10. route 不返回 steps；
11. route 不返回 key / apiKey；
12. route 不把底层 Error.message 原样返回给客户端。

当前 route response contract 应保持：

{
  results: SaveCommuteResultInput[];
  failures: TransitCommuteFailure[];
}

其中 SaveCommuteResultInput 只应包含：

listingId
anchorId
anchorName
mode
provider
isMock
durationMinutes
distanceMeters
summary

失败项只应包含：

listingId
anchorId
anchorName
reason
7. contract check 已新增

Phase 2D-28 已新增：

src/types/transit-commute-route.ts
src/types/transit-commute-route-contract-check.ts

contract check 的意义：

1. 用共享类型固定 route request / response；
2. 防止 route.ts 与 ListingCommutePanel 类型分叉；
3. 用 TypeScript 约束 response 不暴露敏感字段；
4. 把安全边界从“人工记忆”推进到“编译期约束”。

明确禁止进入 response 的字段：

coordinate
coordinates
origin
destination
raw
rawResponse
requestUrl
url
polyline
steps
apiKey
key
AMAP_API_KEY
NEXT_PUBLIC_AMAP
8. 为什么当前不做 L2 / AI / 地图 / POI
8.1 暂不做 L2

L2 后续可以读取 housefolio:commute-results，让参考评分消费真实 transit 结果。

但当前不应立刻大改 L2，原因：

1. L1 刚完成真实 transit 闭环，需要先稳定；
2. 多通勤锚点如何进入 L2 权重仍需克制设计；
3. Reference Score 必须保持辅助比较，不能变成推荐系统；
4. L2 只能用规则和简单数学，不应引入 LLM；
5. 应先从最小读取 transit duration 开始，避免复杂化。
8.2 暂不做 AI

当前不接 L3 AI，原因：

1. AI 只能基于 L1/L2 脱敏结构化数据生成；
2. 当前只有 transit 摘要闭环，L2 尚未消费真实通勤；
3. AI 调用需要单独的同意、脱敏、成本控制与 provider 边界；
4. 过早接 AI 会掩盖 L1/L2 基础能力是否稳固。
8.3 暂不做地图 UI

当前不做地图 UI，原因：

1. 地图 UI 会引入新的高德前端 SDK 边界；
2. 需要重新审查 key 暴露、审图号、地图数据缓存等问题；
3. 当前最小 L1 价值是 Detail 页参考通勤，而不是地图可视化；
4. 应先完成通勤结果消费和稳定，再进入地图视图。
8.4 暂不做 POI / 生活圈真实计算

当前不做 POI，原因：

1. POI 涉及更多高德原始数据处理边界；
2. 只能保存数量和评分，不能缓存完整 POI JSON；
3. 生活圈评分属于另一个 L1 分支，应单独设计 provider contract；
4. 不应和 transit route 收尾混在一个阶段。
8.5 暂不做 Supabase / 部署 / Chrome 插件

当前不做这些方向，原因：

1. 当前仍是本地优先阶段；
2. 真实用户、云端存储、照片、AI prompt、精确位置都会抬高合规复杂度；
3. HouseFolio 当前优先级是基础闭环稳定和架构边界清晰；
4. Chrome 插件容易滑向第三方页面抓取，暂不进入。
9. 下一步候选路线

Phase 2D-29 完成后，不自动进入下一阶段，应先选择路线。

路线 A：Phase 2E - L2 Reference Score consume commute-results

建议优先级：较高。

目标：

让 L2 参考评分在可用时读取 housefolio:commute-results 的 transit 结果。
将当前 mock / listing.commuteMinutes 替换或补充为本地真实通勤摘要。
继续保持 reference-only，不做最终推荐。

最小做法：

1. 只读取 transit；
2. 只取当前 listing 已保存通勤结果中的最小 durationMinutes；
3. 或只取主通勤锚点 durationMinutes；
4. 不做复杂多锚点权重；
5. 不让 LLM 参与评分；
6. 不把 L2 改成推荐系统。
路线 B：Phase 2D-30 - Detail commute mode selection

建议优先级：中。

目标：

在 Detail L1 区域允许用户选择 transit / walking / cycling / driving。
复用已有 provider 能力。
仍然只保存摘要。

注意：

不要一次性做 Portfolio 批量计算。
不要自动计算全部房源。
不要接地图。
不要接 POI。
路线 C：继续 L1 但做 POI / 生活圈 contract

建议优先级：暂缓。

原因：

POI 数据边界比 transit 更复杂。
需要单独设计 contract、缓存字段、Settings 导出/清除边界。
路线 D：暂不建议
AI 决策建议
地图 UI
Supabase
公开部署
Chrome 插件
房源抓取
第三方内容搬运
10. 给下一个新对话的启动提示

如果下一个对话继续 HouseFolio，请先执行：

Set-Location E:\Projects\housefolio
git status
npm.cmd run build
git check-ignore -v .env.local

然后继续检查：

Select-String -Path ".env.example","scripts\*.mjs","src\lib\lbs\*.ts","src\lib\config\*.ts","src\components\*.tsx","src\app\**\*.ts","src\app\**\*.tsx" -Pattern "AMAP_API_KEY=.*[A-Za-z0-9]{8,}|NEXT_PUBLIC_AMAP"

node -e "const fs=require('fs'); const s=fs.readFileSync('src/app/api/lbs/commute/transit/route.ts','utf8'); console.log('contains 北京:', s.includes('北京')); console.log('contains garbled:', s.includes('鍖椾含'));"

Select-String -Path "src\app\api\lbs\commute\transit\route.ts","src\types\transit-commute-route.ts","src\components\listing-commute-panel.tsx" -Pattern "coordinate|rawResponse|requestUrl|polyline|steps|apiKey|NEXT_PUBLIC_AMAP|AMAP_API_KEY"

判断标准：

git status clean
npm.cmd run build 通过
.env.local 被忽略
无真实 key 泄露
无 NEXT_PUBLIC_AMAP
route 编码正常
敏感字段检查只允许服务端内部 coordinate
11. 本阶段结论

Phase 2D 已经完成从 LBS provider 到 Detail 页真实 transit 参考通勤计算的最小闭环。

当前最重要的成果不是“会调高德”，而是：

1. 用户在 Detail 页可以手动计算公共交通参考通勤；
2. 服务端 route 负责高德调用；
3. 客户端只保存可展示摘要；
4. Settings 能覆盖导出和清除；
5. route/server boundary 已审查；
6. transit route response contract check 已新增；
7. 没有泄露 AMAP_API_KEY；
8. 没有把高德原始路线数据带到客户端或 localStorage；
9. 没有越界到 L2 / AI / 地图 / POI。

因此，Phase 2D-29 可以视为 L1 commute 当前小阶段的稳定收口点。

下一阶段应在以下两条路线中择一：

A. Phase 2E：让 L2 Reference Score 最小消费 commute-results；
B. Phase 2D-30：继续 L1，做 Detail commute mode selection。

无论选择哪条路线，都必须继续遵守：

不抓取
不聚合
不公开
不撮合
不认证
L1 走 lib/lbs
L2 不用 LLM
L3 只基于脱敏结构化数据
高德 key 不进客户端
只缓存计算摘要，不缓存原始地图数据
