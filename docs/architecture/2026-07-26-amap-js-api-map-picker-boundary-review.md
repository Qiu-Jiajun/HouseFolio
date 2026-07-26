# P3 嵌入式高德地图标点（LocationMapPicker）边界评审

评审结论：本能力可以在不改变 HouseFolio 现有数据模型、P1 服务端 inputtips 链路和通勤链路的前提下实施。以下三项决策已锁定：

- 坐标只存在于地图弹层的运行时内存中；弹层对外仅返回与 P1 `LocationSuggestion` 同型的 `{ name, district, address }`，不得向 `Listing`、`WorkLocation`、本地存储或导入导出增加坐标字段。
- 弹层内使用高德 JS API 的 `AMap.AutoComplete`；弹层外继续使用 P1 服务端 inputtips。两套搜索入口各司其职，不替换、不合并。
- 同一个 `LocationMapPicker` 在小于 `lg` 时呈现为约 `85vh` 的底部抽屉，在 `lg` 及以上呈现为约 `70vh`、`max-w-2xl` 的居中对话框；两种形态共用同一状态机和同一套无障碍行为。

## 1. Key 治理模型

高德 Web 服务 key 与高德 Web 端（JS API）key 是两套用途、暴露边界和保护方式均不同的独立凭据，不得混用。

- 现有 Web 服务 key 只供服务端调用高德 Web 服务。它仍是服务端秘密，继续通过现有服务端边界读取，永不进入客户端代码、浏览器请求、日志或构建产物。
- JS API key 是高德为浏览器端 JS API 设计的公开型凭据。`NEXT_PUBLIC_AMAP_JS_API_KEY` 会由 Next.js 在构建期内联并暴露给浏览器，因此不能依赖“隐藏 key”提供安全性；必须在高德控制台配置域名白名单，并与 `NEXT_PUBLIC_AMAP_JS_SECURITY_CONFIG` 对应的 securityJsCode 配套使用。
- JS API key 及 securityJsCode 只允许通过环境变量配置。代码、注释、文档、提交信息和验证证据中不得写入、打印或记录任何真实值。

README 中原有“不使用 `NEXT_PUBLIC_AMAP_API_KEY`”的边界在实现阶段应修订为：

> Web 服务 key 永不前端化；JS API key（`NEXT_PUBLIC_AMAP_JS_API_KEY`）是高德公开型凭据，以域名白名单和 securityJsCode 保护。

这项修订只澄清两类凭据的治理边界，不放宽 Web 服务 key 的保密要求，也不允许将现有 Web 服务 key 复用于 JS API。

## 2. 坐标不持久化决策

地图仅用于帮助用户锚定地标级 POI，不用于建立精确坐标数据库。用户确认地点后，既有表单仍按 P1 规则保存 `name + district`；地图弹层产生的经纬度只服务于地图居中、Marker 放置与拖拽后的反向解析。

坐标不得越过 `LocationMapPicker` 的运行时边界：

- `onSelect` 载荷严格为 `{ name: string; district: string; address: string }`，不包含 `coordinate`、`location`、`lng`、`lat` 或同义字段。
- `address` 仅用于复用 P1 候选选中处理路径；下游仍按现有 `name + district` 规则去重和回填，不建立地图专用数据通道。
- 不修改 `Listing`、`WorkLocation`、localStorage、导出、导入或本地清除的数据结构，也不新增坐标或地图字段。
- 通勤计算继续走现有服务端 geocode 链路。其定位精度由 P1 形成的规范地标名称和区域信息保障，前端不以持久化坐标绕过该链路。

因此，本能力不会形成第二套地点事实来源，也不会触发新增本地字段的数据权利覆盖工作。

## 3. 加载策略

高德 JS API 不进入首屏 bundle。只有在 JS API key 已配置且用户点击“在地图上选择”后，客户端加载器才运行时动态注入 `<script>`。

- 加载器使用单例 Promise；并发打开或重复调用共享同一次加载，页面生命周期内只注入一个脚本。
- 注入脚本前先设置 `window._AMapSecurityConfig`，再加载包含 `AMap.AutoComplete`、`AMap.PlaceSearch` 和 `AMap.Geocoder` 插件的 JS API。
- 弹层内搜索只使用 `AMap.AutoComplete`；弹层外的 `LocationSuggestionInput` 与 `/api/lbs/poi/tips` 保持现状，继续使用 P1 服务端 inputtips。
- 关闭弹层时销毁当前 map 与 Marker 等实例并清理组件状态；已加载的脚本和加载器单例保留，因此再次打开无需重新下载脚本。
- 脚本加载失败时清除失败的单例状态，允许用户后续显式重试；不得通过新增 npm 加载器依赖实现该能力。

这一策略将网络与初始化成本推迟到用户明确需要地图时，同时保持 P1 文本输入始终独立可用。

## 4. 降级路径

降级以“不阻断原有 P1 输入”为原则：

- `NEXT_PUBLIC_AMAP_JS_API_KEY` 缺失时，父表单不渲染“在地图上选择”按钮。该判断使用构建期内联环境变量，页面不会出现可点击但无法工作的死入口，P1 文本 inputtips 保持完整可用。
- 脚本加载失败、超时、securityJsCode 配置无效或当前域名未进入白名单时，弹层显示明确的错误标题、说明和“手动输入”按钮。
- 用户选择“手动输入”后关闭弹层并回到原有 P1 文本输入；不得尝试绕过域名白名单、代理真实 key、将 Web 服务 key 暴露到前端，或伪造地图已成功加载的状态。
- 错误信息与诊断日志只描述错误类型和恢复动作，不包含任何 key 或 securityJsCode 值。

## 5. 无障碍

地图画布本身不作为键盘可达的选点控件。键盘和辅助技术用户的完整兜底路径是现有 P1 文本 inputtips；地图按钮属于可选增强，不得成为地点录入的唯一入口。

弹层必须满足以下要求：

- 容器使用 `role="dialog"`、`aria-modal="true"`，并以 `aria-labelledby` 关联可见标题。
- 打开后焦点进入搜索框；按 Escape、点击关闭按钮或点击遮罩均可关闭。
- 打开前记录触发按钮；关闭并完成实例清理后，将焦点归还给该按钮。
- 弹层打开期间锁定页面滚动，关闭或卸载时恢复原有滚动状态。
- 小于 `lg` 的底部抽屉与 `lg` 及以上的居中对话框使用同一组件、同一 DOM 语义、同一状态机和同一套焦点管理，不为两种视觉形态建立分叉的交互实现。
- 加载态、错误态、未选中态和确认按钮禁用态均提供可读文本，不以地图图形或颜色作为唯一信息来源。

## 6. 人工前置条件 checklist

在真实 key 联调、预览或生产部署前，由高德控制台管理员完成并复核：

- [ ] 申请“Web 端（JS API）”类型的独立 key，不复用现有 Web 服务 key。
- [ ] 为该 JS API key 启用并配置 securityJsCode。
- [ ] 将 JS API key 写入部署环境的 `NEXT_PUBLIC_AMAP_JS_API_KEY`，将对应 securityJsCode 写入 `NEXT_PUBLIC_AMAP_JS_SECURITY_CONFIG`；不在仓库、文档或验证证据中记录真实值。
- [ ] 域名白名单包含 `housefolio.cn`。
- [ ] 域名白名单包含 `*.housefolio.cn`。
- [ ] 域名白名单包含 `localhost`，用于本地开发。
- [ ] 域名白名单包含 `127.0.0.1`，用于本地 owned harness。
- [ ] 域名白名单包含实际使用的预览域名；预览域名变化时同步更新白名单。
- [ ] 为该 key 开通地图 JS API。
- [ ] 确认 `AMap.AutoComplete` 可用。
- [ ] 确认 `AMap.PlaceSearch` 可用。
- [ ] 确认 `AMap.Geocoder` 可用。
- [ ] 分别在本地、预览域名和生产域名验证白名单生效；失败时按错误态降级，不以放宽 Web 服务 key 边界解决。
