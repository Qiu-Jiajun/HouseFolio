# HouseFolio 开发日志｜Phase 2D-26｜Detail 通勤结果展示与边界状态收尾

## 日期

2026-05-04

## 当前阶段

已完成：

```text
Phase 2D-24：Detail commute result UI refinement
Phase 2D-25：Detail commute result empty/error state polish

本阶段没有新增 LBS 计算能力，而是在已完成的 Detail 手动公共交通通勤计算基础上，补齐展示结构和边界状态。

一、Phase 2D-24 完成内容
1. 通勤结果卡片结构化展示

更新文件：

src/components/listing-commute-panel.tsx
src/content/zh-cn.ts

Detail 页 L1 区域的已保存通勤结果不再只展示 summary，而是拆成结构化字段：

通勤锚点 anchorName
通勤方式 mode
参考时长 durationMinutes
参考距离 distanceMeters
summary
计算时间 calculatedAt

当前支持 mode 的中文显示：

transit  → 公共交通
walking  → 步行
cycling  → 骑行
driving  → 驾车

但页面当前只触发 transit 计算；其他 mode 只是为后续展示兼容预留，不代表页面已经支持多模式计算。

二、Phase 2D-25 完成内容
1. 通勤锚点数量提示

Detail 页 L1 区域现在会显示：

当前本地通勤锚点：X 个

用于提醒用户当前计算依据来自 Settings 中保存的工作/学习地点（通勤锚点）。

2. 无通勤锚点状态

当本地没有任何工作/学习地点（通勤锚点）时：

计算公共交通参考通勤按钮禁用
页面提示用户先到 Settings 添加通勤锚点

这避免用户误以为功能损坏。

3. 房源缺少地址线索状态

当当前房源缺少 addressHint 时：

计算公共交通参考通勤按钮禁用
页面提示当前房源缺少可用于计算的地址线索

提示用户补充小区、地铁站、商圈或街道级地址，而不是要求精确门牌号。

4. API 失败状态

当服务端 route 或高德调用失败时：

页面展示用户可理解的失败提示
不直接暴露底层技术错误
不展示高德原始错误结构
不展示请求 URL
不展示任何 key 信息
三、已验证结果

已完成：

npm.cmd run build 通过
git status clean
Detail L1 已保存通勤结果展示正常
Detail L1 空状态提示正常
Detail L1 按钮禁用状态正常
Settings commute-results 数据闭环不受影响
四、架构边界保持情况

本阶段继续保持：

不在 client component 直接调用高德 API
不在 client component 读取 AMAP_API_KEY
不创建 NEXT_PUBLIC_AMAP_API_KEY
不保存高德原始 JSON
不保存完整路线轨迹
不保存经纬度
不接 L2
不接 L3 AI
不接地图 UI
不接 POI / 生活圈真实计算

当前 L1 Detail 通勤计算链路仍然是：

ListingCommutePanel client component
→ /api/lbs/commute/transit server route
→ lib/lbs/service.ts
→ active LBS provider
→ 返回 SaveCommuteResultInput[]
→ client upsert 到 housefolio:commute-results
→ Detail 展示本地摘要
→ Settings 可导出 / 清除
五、当前最新节点

截至本日志，HouseFolio 已完成到：

Phase 2D-26：Detail 通勤结果展示与边界状态收尾

当前 L1 已具备：

工作/学习地点（通勤锚点）本地设置
高德 geocode smoke test
transit / walking / cycling / driving 多模式底层计算
commute-results 本地摘要存储
Settings 导出 / 清除覆盖 commute-results
Detail 页手动计算 transit
Detail 页展示结构化通勤摘要
Detail 页处理无锚点 / 无地址 / 失败状态
六、下一步建议

下一步建议进入：

Phase 2D-27：Detail commute route/server boundary review

目标：

1. 回看 /api/lbs/commute/transit/route.ts
2. 确认 route 只返回摘要
3. 确认没有返回 coordinate / raw JSON / request URL / key
4. 确认错误提示不会泄露敏感信息
5. 确认 route 与 lib/lbs/service.ts 的边界清晰

仍然不建议直接进入：

L2 参考评分接入真实通勤
地图 UI
POI / 生活圈
AI 决策建议
Supabase
部署上线

原因：

L1 页面触发真实计算刚完成，应先完成 server boundary review，再考虑让 L2 消费该结果。
