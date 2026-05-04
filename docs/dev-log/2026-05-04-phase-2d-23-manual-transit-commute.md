# HouseFolio 开发日志｜Phase 2D-23｜Detail 手动公共交通通勤计算收尾

## 日期

2026-05-04

## 当前阶段

已完成：

```text
Phase 2D-22：Detail 手动计算 transit

本阶段将 HouseFolio 的 L1 LBS 能力从“底层 smoke test 可运行”推进到“用户可以在房源详情页手动触发公共交通参考通勤计算”。

一、本阶段完成内容
1. 新增服务端 transit commute API route

新增文件：

src/app/api/lbs/commute/transit/route.ts

职责：

客户端提交当前房源与工作/学习地点（通勤锚点）
→ 服务端调用 lib/lbs/service.ts
→ geocode 房源地址线索
→ geocode 通勤锚点地址线索
→ calculateCommute(mode: "transit")
→ 返回可保存的通勤摘要

该 route 只返回：

listingId
anchorId
anchorName
mode
provider
isMock
durationMinutes
distanceMeters
summary

不返回：

AMAP_API_KEY
高德原始 JSON
完整请求 URL
完整路线轨迹
经纬度
完整公交站点列表
完整换乘详情
2. Detail L1 面板新增手动计算按钮

更新文件：

src/components/listing-commute-panel.tsx
src/components/listing-detail-view.tsx
src/content/zh-cn.ts

新增能力：

房源详情页 L1 区域显示“计算公共交通参考通勤”按钮
点击后读取本地 work-locations
调用 /api/lbs/commute/transit
将返回摘要写入 housefolio:commute-results
刷新当前 L1 面板展示本地保存结果
3. Settings 本地数据闭环保持正常

已确认：

housefolio:commute-results 会出现在 Settings 本地数据快照中
导出本地 JSON 会包含 commute-results
清除本机数据会删除 commute-results
二、已验证结果

已完成手动验证：

git status clean
npm.cmd run build 通过
/api/lbs/commute/transit 出现在 Next.js 路由表
Detail 页按钮显示正常
点击按钮后可触发公共交通参考通勤计算
计算结果可保存到 housefolio:commute-results
Detail 页可展示已保存通勤摘要
Settings 可查看 commute-results

已完成安全检查：

.env.local 被 .gitignore 忽略
未发现真实 AMAP_API_KEY 泄露
未发现 NEXT_PUBLIC_AMAP
客户端组件不直接请求高德 restapi
客户端组件不读取 process.env.AMAP_API_KEY
三、重要架构边界

本阶段继续遵守 HouseFolio 的 L1 边界：

页面和组件不直接调用高德 API
高德 Key 只留在服务端
客户端只调用 HouseFolio 自己的 API route
LBS 调用继续通过 lib/lbs/service.ts
本地只保存计算摘要，不保存原始地图数据

当前流程是：

ListingCommutePanel client component
→ /api/lbs/commute/transit server route
→ lib/lbs/service.ts
→ active LBS provider
→ 返回 SaveCommuteResultInput[]
→ client upsert 到 housefolio:commute-results
四、当前未完成内容

本阶段没有做：

Portfolio 批量通勤计算
页面自动计算
walking / cycling / driving 页面接入
通勤偏好 UI
L2 参考评分读取真实 commute-results
AI 分析接入通勤摘要
地图 UI
POI / 生活圈真实计算
Supabase
DeepSeek
部署上线
Chrome 插件
五、下一步建议

下一步建议进入：

Phase 2D-24：Detail commute result UI refinement

目标不是扩展计算能力，而是轻量改善展示：

1. 在 Detail L1 通勤结果卡片中显示 anchorName
2. 显示 mode：公共交通
3. 显示 durationMinutes 和 distanceMeters 的结构化字段
4. 保留 summary
5. 继续强调“仅作辅助比较”

暂不建议直接进入：

L2 评分接入真实通勤
地图 UI
POI / 生活圈
AI 决策建议

原因：

当前刚完成页面触发真实 transit 计算。
应先让 Detail L1 展示更稳定、更可解释，再让 L2 或 L3 消费该结果。
六、本阶段提交

本阶段功能提交：

6cec9aa feat: add manual transit commute calculation

当前建议在本日志提交后保持 git clean，再进入下一阶段。