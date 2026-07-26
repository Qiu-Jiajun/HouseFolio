# 高德位置输入与多方式通勤边界评审｜2026-07-26

## 1. 本轮目标

本轮收敛三个问题：

1. 自由文本地理编码静默取首个候选，用户无法确认识别结果；
2. `/portfolio/new` 与 Settings 的位置输入没有 POI 候选；
3. provider 已支持四种通勤方式，但页面和 route 仍锁死 `transit`。

本轮不实现前端地图、不新增本地位置字段、不改变 L2 评分公式，也不触碰 OCR 技术线。

## 2. P0：安全地址识别摘要

通勤 route 可以返回本次计算使用的安全识别摘要：

```text
kind
id
name
provider
isMock
formattedAddress
precision
heuristicConfidence
```

禁止返回：

```text
coordinate
latitude
longitude
高德原始 JSON
request URL
polyline
steps
apiKey
```

`heuristicConfidence` 是 HouseFolio 根据高德 `level` 做的本地启发式估算，不是高德官方置信度。UI 必须明确这一点，不能包装成第三方保证。

该摘要只保留在当前页面状态，不写入 localStorage。

## 3. P1：服务端 POI 输入提示

位置候选必须继续遵守统一 LBS 边界：

```text
Client combobox
→ POST /api/lbs/poi/tips
→ src/lib/lbs/service.ts
→ active LbsProvider
→ Amap / mock adapter
```

页面不得直接调用高德。

高德 Web 服务使用：

```text
/v3/assistant/inputtips
datatype=poi
citylimit=true
```

请求最少 2 字、最多 80 字；城市接受高德 citycode / adcode，并在 route 边界将受控别名“北京”“北京市”规范化为 citycode `010`；客户端 300ms 防抖并取消过期请求；provider 设置 8 秒超时；最多向页面返回 8 条规范候选。

页面只接收：

```text
POI ID
名称
区域
地址
provider / isMock
```

页面不接收坐标。选择候选后，本轮只把候选名称和区域写入既有 `addressHint`，不持久化候选详细地址；房源表单同时更新既有 `district`。

位置查询词会经 HouseFolio 服务端发送给高德，UI 必须在输入框附近明确披露。Listing 与 WorkLocation 仍只在浏览器本地持久化，但“本地持久化”不得被描述成“位置输入完全不联网”。

客户端防抖不是调用量保护。route 必须限制 body、字段长度与返回条数；公开部署还必须在 Vercel WAF（或等效网关）按路径为该 route 配置服务端限流，不能依赖单个 Serverless 实例的内存计数器。

### 3.1 已知限制

只保存规范文字、随后再次 geocode，能显著降低自由文本歧义，但不能严格保证未来仍命中用户当时选择的同一个 POI。

真正稳定的 POI 绑定需要另行评审 canonical `locationRef`，至少考虑：

```text
provider
poiId
displayLabel
```

或在完成隐私评审后，仅在浏览器本地保存确认坐标。该选择会改变本地数据与隐私语义，必须同时覆盖 Settings 查看、JSON 导出、JSON 导入、旧 JSON fallback 与本地清除，不能在本轮顺手加入。

## 4. P2：本次计算方式选择

本轮允许用户在 Detail 页为本次计算选择：

```text
transit
walking
cycling
driving
```

`/api/lbs/commute/transit` 暂时保留为兼容 URL，request 新增可选 `mode`：

```text
缺省 mode → transit
合法 mode → 运行时 allowlist 校验
非法 mode → HTTP 400
```

route 把校验后的 mode 传入 provider。公交计算同时使用 request 的 `city`，不再在 provider 内无条件固定北京。

为限制一次请求的高德调用量，route 最多接受 3 个通勤锚点，并对 body、ID、名称、地址提示、区域和城市执行长度上限；超限或混入非法锚点时直接返回 400/413，不静默截断。

既有 Settings、localStorage 和旧 JSON 允许保存 3 个以上锚点，因此不能在请求端直接让这些用户失去全部计算能力。Detail 页必须显式提供“本次最多选择 3 个”的锚点多选；默认选中本地列表中的前 3 个并明确提示，用户可调整。未选中的本地锚点不得被删除或改写。

Client 在发送前还必须把本地 `WorkLocation` 投影为 `id / name / addressHint`，不得把与路线计算无关的 `note / createdAt / updatedAt` 传出浏览器。

现有 commute-result ID 已包含：

```text
listingId + anchor + mode
```

因此四种结果可以并存，不需要新 localStorage key 或旧 JSON 迁移。

## 5. L2 评分保持不变

本轮 walking、cycling、driving 结果只用于保存、展示与人工比较。

L2 继续只读取：

```text
mode === "transit"
```

不要按 mode 暗中分桶或赋予不同价值，也不要在本轮加入 `WorkLocation.preferredMode`。未来若要让用户首选方式进入评分，必须先定义 primary mode、费用、停车、拥堵与多人锚点的透明产品语义。

## 6. 本地数据兼容性

本轮不新增：

```text
Listing 字段
WorkLocation 字段
localStorage key
```

因此既有 Settings 查看、JSON 导出、JSON 导入和本地清除路径无需修改，旧 JSON 保持兼容。

## 7. P3 前端地图的安全修正

前端地图不是本轮前置条件。POI 候选与稳定 `locationRef` 才是消除计算歧义的核心；地图的主要增量是可视化和任意落点。

如果后续实现高德 JS API：

1. Web 服务 key 继续只在服务端；
2. JS API key 使用独立 key，并配置适当的域名限制；
3. `securityJsCode` 不得作为生产前端明文配置；
4. 按高德官方建议，通过受限的同源 `serviceHost` 代理在服务端附加安全密钥；
5. 代理必须限制目标路径，不能成为开放代理；
6. 必须评审 CSP、配额滥用、第三方脚本/瓦片请求、Referrer、用户主动加载、失败降级、地图销毁和键盘可访问性；
7. 必须先决定 `locationRef` 与任意落点的本地隐私语义。

官方依据：

- 高德输入提示：<https://lbs.amap.com/api/webservice/guide/api-advanced/inputtips>
- 高德 JS API 安全密钥：<https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode>
- Next.js 环境变量：`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`

`NEXT_PUBLIC_*` 会在构建时写入浏览器 bundle 并冻结，不能用它承载生产安全密钥。

## 8. 验收边界

必须验证：

- 两个位置输入框在 2 字后出现候选；
- UI 明确披露候选查询词会发送至服务端和高德；
- 请求可取消，旧响应不会覆盖新输入；
- 键盘上下键、Enter、Escape 可操作候选；
- 候选 route 不返回坐标或高德原始数据；
- 通勤 route 缺省仍为 transit；
- 四种合法 mode 都能生成对应结果；
- 已有 4 个以上本地锚点时，可显式选择本次最多 3 个，不丢失其余锚点；
- 非法 mode 返回 400；
- P0 摘要不含坐标，并明确启发式含义；
- walking / cycling / driving 不改变 L2 transit-only 结果；
- build 与定向 lint 通过；
- OCR 文件、runner、scratch 和 evidence 未被修改。

公开部署另需在 Vercel WAF 或等效网关完成两条 LBS API 路径的限流配置；该平台级动作不由本地代码假装完成。
