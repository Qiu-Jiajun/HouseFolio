# LBS API 生产限流配置建议

> 状态：本文档仅提供生产配置建议，当前规则尚未生效。必须在部署时由项目管理员人工确认、启用并验证；本文档本身不会修改 Vercel、高德或其他生产配置。

## 目标规则

HouseFolio 建议在生产入口为两个服务端 LBS 路径分别建立固定窗口、按来源 IP 计数的限流规则：

| API | 条件 | 窗口 | 单 IP 上限 | 超限动作 |
| --- | --- | ---: | ---: | --- |
| POI 候选 | `POST /api/lbs/poi/tips` | 60 秒 | 60 次 | HTTP 429 |
| 通勤计算 | `POST /api/lbs/commute/transit` | 60 秒 | 20 次 | HTTP 429 |

上述数值是 HouseFolio 的生产策略，不是高德官方配额。通勤接口的一次客户端请求可能触发多次上游地理编码与路径规划调用，因此它采用更低的客户端请求上限。

## Vercel WAF 控制台配置示例

对每条 API 分别执行：

1. 进入 Vercel 项目，打开 **Firewall → Configure → New Rule**。
2. 添加全部必须同时满足的条件：
   - `Request Method` equals `POST`
   - `Request Path` equals 对应的精确 API 路径
3. `Then` 选择 **Rate Limit**。
4. 算法选择 **Fixed Window**，计数键选择 **IP**。
5. `Time Window` 设为 `60s`，`Request Limit` 分别设为 `60` 或 `20`。
6. 首次上线建议先用 `Log` 观察正常流量，再将后续动作切换为默认 `429`。
7. 选择 **Save Rule → Review Changes → Publish**。
8. 回到 Firewall Overview，按规则筛选流量，确认命中、放行和 429 均符合预期。

Vercel 当前允许所有套餐使用固定窗口和 IP 计数，但 Hobby 每项目仅有 1 条 rate-limit rule，Pro 为 40 条，Enterprise 为 1000 条。若生产项目是 Hobby，无法同时按上述两个阈值建立两条独立规则；部署应暂停，直到升级套餐、采用等效网关，或重新批准合并规则的策略。

官方参考：

- [Vercel WAF Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [Vercel：Add Rate Limiting](https://vercel.com/kb/guide/add-rate-limiting-vercel)

## 前端第一道防线

`LocationSuggestionInput` 已在浏览器侧实施：

- 300 ms debounce；
- 关键词至少 2 个字才发起请求；
- 新查询会取消旧请求，并忽略过期响应。

这能减少正常输入产生的请求，但不能替代服务端或网关限流。恶意客户端可以绕过前端直接调用 API。

## HTTP 429 前端文案建议

Vercel WAF 的默认超限动作是 HTTP 429，但不应假设响应正文一定符合 HouseFolio 的 JSON shape。前端后续处理 429 时应先检查 `response.status`，再决定是否解析 JSON。

- POI 候选：`位置候选查询过于频繁，请稍后再试；你仍可手动填写位置提示。`
- 通勤计算：`参考通勤请求过于频繁，请稍后再试。`

本轮仅记录文案和接入建议，不修改现有前端错误处理。

## 高德配额监控

人工入口：

1. 登录高德开放平台控制台。
2. 打开 **流量分析 → 配额管理**。
3. 逐项核对生产 Web 服务 Key 的当前月/日调用量与 QPS：
   - 地理编码；
   - 输入提示；
   - 公交路径规划；
   - 步行路径规划；
   - 骑行路径规划（v4）；
   - 驾车路径规划。
4. 记录检查日期、操作者、当前配额、当前用量和下一次复查日期。

配额和 QPS 必须以控制台实时页面为准，不应把历史文档中的示例数值当作当前账号额度。

官方参考：

- [高德 Web 服务流量限制说明](https://lbs.amap.com/api/webservice/guide/tools/flowlevel)
- [高德配额管理控制台](https://console.amap.com/dev/flow/manage)
- [高德 Web 服务错误码](https://lbs.amap.com/api/web-service/tools/info)

## 超限表现与排查

高德的业务错误与 Vercel WAF 429 是两层不同的限制：

- `10003 DAILY_QUERY_OVER_LIMIT`：日调用量超限，通常次日 00:00 恢复。
- `10004 ACCESS_TOO_FREQUENT`：一分钟窗口内过频，通常下一分钟恢复。
- `10015 GATEWAY_TIMEOUT`：单机 QPS 限制，应降低请求 QPS。
- `10019` / `10020` / `10021`：服务、Key 或账号维度 QPS 超限，超出阈值的请求被拒绝。
- `10044 USER_DAILY_QUERY_OVER_LIMIT`：账号维度日调用量超限。

排查时同时查看 Vercel Firewall 命中记录、函数日志和高德配额管理页面。不得把密钥、完整上游请求 URL 或原始高德响应写入前端错误消息或公开日志。

## 部署验收

- [ ] 确认 Vercel 套餐支持两条独立 rate-limit rule。
- [ ] 两条规则先以 Log 模式观察正常流量。
- [ ] 切换为 429 后分别验证第 60/61 次与第 20/21 次请求的边界。
- [ ] 验证正常请求仍返回原有 HouseFolio API shape。
- [ ] 验证 429 不会导致前端泄露上游响应、请求 URL 或密钥。
- [ ] 在高德控制台确认六项服务权限、当前配额和 QPS。
- [ ] 将启用日期、操作者和回滚方法记录到部署变更单。

