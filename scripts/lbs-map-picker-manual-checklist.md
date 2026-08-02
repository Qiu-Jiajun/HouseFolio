# LBS P3 地图选点人工验收清单

> 当前浏览器验收状态：**部分通过，尚未完成提交前的全部人工项**。2026-07-26 已在用户前台启动的 `http://localhost:3000` 上完成真实高德地图加载、两个入口的搜索选点与回填、脚本单例、桌面/移动端布局及核心 Dialog 行为；Marker 手工拖拽、完整坐标属性扫描、失败降级和生产域名/部署仍待人工完成。不得把整份清单标记为“全部通过”。
>
> 不得在命令、终端输出、截图、DevTools 导出或验收记录中读取、复制、打印或保存任何 Key。尤其不要记录高德脚本的完整 `src`，因为查询参数包含公开型 JS API key。

## 1. 高德控制台前置条件

由有权限的人工操作员在高德控制台逐项确认；只记录“已配置 / 未配置”，不要记录凭据值。

- [x] 已申请“Web端（JS API）”类型的独立开发 key；它与服务端 Web 服务 key 分离。
- [x] 已启用 `securityJsCode`，且未在验收记录中输出其值。
- [x] 开发 key 的域名白名单留空用于本地调试；高德控制台会拒绝 `localhost` 与 `127.0.0.1` 作为白名单条目。该 key 不用于部署。
- [ ] 生产 key 的白名单仍待配置：`housefolio.cn`、`*.housefolio.cn` 与实际预览域名。预览域名应尽量使用项目的精确域名或专用后缀，不使用过宽的 `*.vercel.app`。
- [x] 地图 JS API 已在真实浏览器中加载成功。
- [x] `AutoComplete` 插件已返回真实候选。
- [ ] `PlaceSearch` 的无坐标候选分支尚未单独触发。
- [ ] `Geocoder` 的 Marker 拖拽逆解析尚待人工验证。
- [x] 本次新增的是独立 Web端（JS API）key；未把服务端 Web 服务 key 前端化。

## 2. PowerShell 7 与 owned dev server

### 2.1 运行前确认

1. 在独立的 PowerShell 7 终端中进入仓库：

   ```powershell
   Set-Location -LiteralPath "E:\Projects\housefolio"
   $PSVersionTable.PSEdition
   $PSVersionTable.PSVersion
   ```

2. 断言 `PSEdition` 为 `Core`，主版本至少为 7。
3. 不运行 `Get-ChildItem Env:`，不输出任何 `NEXT_PUBLIC_*` 值，也不打开任何 `.env*` 文件。
4. 生成本次人工验收的唯一标识和临时证据目录：

   ```powershell
   $qaRunId = [Guid]::NewGuid().ToString("N")
   $qaRunDir = Join-Path ([IO.Path]::GetTempPath()) "housefolio-lbs-map-picker-qa-$qaRunId"
   New-Item -ItemType Directory -Path $qaRunDir
   ```

5. 选择一个仅绑定 `127.0.0.1` 的独立可用端口，并把 runId、端口和证据目录记入验收表；不要复用来源不明的现有 dev server。

### 2.2 启动与清理规范

在专用前台 PowerShell 7 终端启动，便于 `Ctrl+C` 明确终止本次 owned 进程：

```powershell
npm.cmd run dev -- -H 127.0.0.1 -p <本次独立端口>
```

启动和清理必须沿用 `scripts/lbs-browser-qa-server-owner.mjs` 的所有权原则：

- [ ] 每次运行使用唯一 runId、唯一临时目录和独立端口。
- [ ] 只访问本次 origin：`http://127.0.0.1:<本次独立端口>`。
- [ ] 若改用后台 owner，必须直接记录本次 child PID，并在 manifest 中绑定 runId、child PID、origin 和完成信号。
- [ ] 设置总超时并为清理预留时间；成功、失败或阻塞都必须进入清理。
- [ ] 先停止本次 owned child；只在它未退出时，按记录的精确 PID 清理其进程树。
- [ ] 禁止按 `node`/`npm` 进程名批量结束进程，禁止清理不属于本次 runId 的 PID。
- [ ] 结束后确认该端口已释放。
- [ ] 截图和日志只放 `$qaRunDir`，不得加入 Git。

若 dev server 再次报告读取 `.env.local` 为 `EPERM`，或浏览器策略拒绝同源访问：

1. 立即停止本次浏览器验收。
2. 清理本次 owned 进程并确认端口释放。
3. 在证据表中记为“阻塞”，不要记为“通过”。
4. 只记录错误类别与发生阶段，不复制环境文件内容或任何 key。

## 3. 缺失 JS API key 的降级路径

在一个明确未配置 JS API key 的独立测试环境中执行；不要通过读取、编辑或打印 `.env.local` 来制造或确认该状态。

### `/portfolio/new`

- [ ] 打开 `/portfolio/new`。
- [ ] “在地图上选择”按钮不渲染。
- [ ] 原有位置文本框仍渲染且可输入。
- [ ] 输入至少两个字后，P1 inputtips 仍能显示候选、键盘选择并回填。
- [ ] 页面不存在空白地图占位、不可点击的死按钮或阻塞保存的错误。

### `/settings`

- [ ] 打开 `/settings` 的“工作/学习地点（通勤锚点）”区域。
- [ ] “在地图上选择”按钮不渲染。
- [ ] 原有位置文本框、P1 inputtips 和保存流程仍完整可用。
- [ ] 隐私说明明确表示只保存地标名称与区域，不保存精确坐标。

## 4. 地图脚本按需加载与单例

使用已满足控制台前置条件的人工环境，并从新的浏览器上下文或全新页面加载开始。

1. 打开 `/portfolio/new`，在点击地图按钮前统计脚本数量。
2. 只运行返回数字的检查，不展开节点、不返回完整 URL：

   ```js
   document.querySelectorAll(
     'script[src^="https://webapi.amap.com/maps"]',
   ).length
   ```

3. 按顺序断言：

   - [ ] 首次点击前数量为 `0`。
   - [ ] 点击“在地图上选择”后出现 loading 状态。
   - [ ] 地图加载完成后数量为 `1`。
   - [ ] 关闭弹层后 script 保留，数量仍为 `1`。
   - [ ] 再次打开弹层不新增 script，数量仍为 `1`。
   - [ ] 从另一个接入点打开时也不新增 script。

4. 禁止执行或留存以下证据：

   - 完整 `script.src`；
   - Network 面板中含查询参数的请求 URL；
   - 高德请求的 HAR 导出；
   - 展示 key 或 security 配置值的截图。

## 5. 接入点一：新增房源

1. 打开 `/portfolio/new`。
2. 在“位置提示”中先输入一段现有文本。
3. 点击“在地图上选择”：

   - [ ] 地图搜索框预填当前 `addressHint`。
   - [ ] 搜索框中的 Enter 不提交外层新增房源表单。

4. 清空或替换搜索词为“望京SOHO”：

   - [ ] `AMap.AutoComplete` 返回实时候选。
   - [ ] 选择正确的望京 SOHO 相关候选。
   - [ ] 地图移动到候选位置。
   - [ ] 出现一个可拖拽 Marker。
   - [ ] 底部“已选”摘要显示候选名称和区域。

5. 拖拽 Marker 到附近位置：

   - [ ] 拖拽结束后触发逆地理解析。
   - [ ] 若附近有 POI，“已选”摘要吸附到最近 POI。
   - [ ] 否则摘要使用格式化地址。
   - [ ] 区域随逆解析结果更新。

6. 点击“确认使用该地点”：

   - [ ] 弹层关闭。
   - [ ] “位置提示”只按 P1 规则回填去重后的 `name + district`。
   - [ ] 独立“所在区域”字段同步为所选 district。
   - [ ] 不回填经纬度、候选对象或地图内部状态。
   - [ ] 后续房源保存流程仍可完成。

## 6. 接入点二：工作/学习地点

1. 打开 `/settings` 的“工作/学习地点（通勤锚点）”区域。
2. 先填写人工名称，并在位置文本框输入一段当前值。
3. 点击“在地图上选择”：

   - [ ] 地图搜索框预填当前 `addressHint`。
   - [ ] 搜索框中的 Enter 不提交外层锚点表单。

4. 重复“望京SOHO”候选选择、Marker 落点和拖拽逆解析。
5. 点击确认：

   - [ ] 位置文本框只按 P1 规则回填去重后的 `name + district`。
   - [ ] 人工填写的工作地点名称没有被地图擅自覆盖。
   - [ ] 保存锚点成功。
   - [ ] 刷新后只显示已保存的名称和位置文本，不出现坐标字段。

## 7. 无坐标持久化检查

只检查属性名；不要把完整 localStorage 值复制到终端、截图或验收记录。

1. 完成一次新增房源地图选择并保存。
2. 完成一次工作地点地图选择并保存。
3. 在 DevTools Console 运行下面的只返回属性路径检查：

   ```js
   (() => {
     const storageKeys = [
       "housefolio:listings",
       "housefolio:work-locations",
     ];
     const forbidden = new Set([
       "lat",
       "lng",
       "latitude",
       "longitude",
       "coordinate",
       "coordinates",
     ]);
     const hits = [];
     const visit = (value, path) => {
       if (Array.isArray(value)) {
         value.forEach((item, index) => visit(item, `${path}[${index}]`));
         return;
       }
       if (!value || typeof value !== "object") {
         return;
       }
       Object.entries(value).forEach(([key, child]) => {
         const nextPath = `${path}.${key}`;
         if (forbidden.has(key.toLowerCase())) {
           hits.push(nextPath);
         }
         visit(child, nextPath);
       });
     };
     storageKeys.forEach((storageKey) => {
       const raw = localStorage.getItem(storageKey);
       if (!raw) {
         return;
       }
       try {
         visit(JSON.parse(raw), storageKey);
       } catch {
         hits.push(`${storageKey}.[invalid-json]`);
       }
     });
     return {
       checkedStorageKeys: storageKeys,
       forbiddenPropertyPaths: hits,
     };
   })()
   ```

4. 断言：

   - [ ] `forbiddenPropertyPaths` 为空数组。
   - [ ] 房源持久化内容只有现有 `addressHint`、`district` 等规范字段。
   - [ ] 工作地点持久化内容只有现有 `name`、`addressHint`、`note` 等规范字段。
   - [ ] 不保存 AutoComplete tip、Marker、LngLat、逆解析响应或完整 POI 对象。

## 8. 响应式双形态

对同一接入点分别执行，不依赖仅改变颜色来判断形态。

### `<lg` 移动端

建议视口：`390 × 844`。

- [ ] 弹层从底部出现。
- [ ] 使用 `inset-x-0 bottom-0` 语义，接近 `85vh`。
- [ ] 顶部为大圆角 bottom sheet。
- [ ] 地图区域可见且不被底部操作栏完全遮挡。
- [ ] 搜索、拖拽、确认和手动输入均可完成。

### `≥lg` 桌面端

建议视口：`1280 × 800`。

- [ ] 弹层在视口中居中。
- [ ] 宽度接近 `max-w-2xl`，高度接近 `70vh`。
- [ ] 遮罩覆盖视口。
- [ ] 搜索、地图和底部操作区布局完整。
- [ ] 从移动端跨越到桌面断点后地图会 resize，没有空白或错位。

## 9. Dialog 与焦点行为

在两个接入点各执行一次。

- [ ] 弹层根节点具有 `role="dialog"`。
- [ ] `aria-modal="true"`。
- [ ] `aria-labelledby` 指向可见标题。
- [ ] 打开后焦点自动进入地图搜索框。
- [ ] 打开期间 `document.body.style.overflow` 被锁定。
- [ ] 按 Escape 关闭弹层。
- [ ] 点击遮罩关闭弹层。
- [ ] 点击关闭按钮关闭弹层。
- [ ] 点击“使用手动输入”关闭弹层。
- [ ] 每种关闭方式都会销毁当前 map 实例并恢复 body overflow。
- [ ] 每种关闭方式都会把焦点归还给本次点击的“在地图上选择”按钮。
- [ ] 关闭后原有 P1 文本 inputtips 可立即继续使用。

## 10. 地图加载失败与手动输入降级

在新的浏览器上下文中、首次点击地图按钮之前，由人工使用浏览器请求阻止功能只阻止 `webapi.amap.com` 域名；不要查看、复制或记录含 key 的完整请求 URL。

- [ ] 点击地图按钮后先出现 loading 状态。
- [ ] 加载失败后显示明确的错误标题和说明。
- [ ] 错误态提供“使用手动输入”按钮。
- [ ] 点击后弹层关闭，焦点归还触发按钮。
- [ ] P1 文本输入仍可输入、请求候选、键盘选择和回填。
- [ ] 失败后没有创建房源/工作地点坐标字段。
- [ ] 在新的干净上下文解除阻止后可重新尝试加载；失败状态不会被伪报为成功。

## 11. 证据记录表

截图保存到本次 `$qaRunDir`，不得加入 Git。截图不得包含环境变量、key、完整脚本 URL、Network 查询参数或 localStorage 的私密值。

| 场景 | 状态（未执行 / 部分通过 / 通过 / 失败 / 阻塞） | 核心断言 | 截图路径 | 备注 |
| --- | --- | --- | --- | --- |
| 当前自动浏览器验收 | 部分通过 | 真实地图、两个入口、双形态、脚本单例和核心 Dialog 行为已验证 | 见下方两张截图 | 仍有人工项 |
| 缺 key：新增房源 | 部分通过 | 按钮隐藏、原位置输入仍存在、无空白地图 |  | P1 候选键盘流程未复测 |
| 缺 key：工作地点 | 部分通过 | 按钮隐藏、原位置输入仍存在、无空白地图 |  | P1 候选键盘流程未复测 |
| 首次按需加载 | 部分通过 | loading 后地图成功，打开后脚本为 1 |  | 有效 key 环境下未单独留存点击前计数 |
| 关闭并重开 | 通过 | 关闭、重开及跨入口后脚本数量仍为 1 |  | 只记录数量，未记录 URL |
| 新增房源地图回填 | 通过 | 候选、Marker、拖拽更新地址、`name + district`、district 同步、房源保存及属性扫描通过 | 本机临时证据（未入库） |  |
| 工作地点地图回填 | 通过 | 人工名称保持不变，候选、Marker、拖拽更新地址、回填、保存及属性扫描通过 |  |  |
| localStorage 属性名 | 通过 | 两个存储键的 `forbiddenPropertyPaths` 均为空数组 |  | 只检查了属性路径，未输出存储值 |
| `<lg` bottom sheet | 通过 | `390×844` 下 `390×717`、贴底、顶部圆角、地图可见 | 本机临时证据（未入库） | 高度约 85vh |
| `≥lg` 对话框 | 通过 | `1440×900` 下 `672×630`、居中、地图与操作区完整 | 本机临时证据（未入库） | 高度 70vh |
| Dialog 与焦点 | 部分通过 | ARIA、自动聚焦、body lock、Escape、焦点归还通过 |  | 遮罩/关闭按钮/手动输入尚未逐一复测 |
| 加载失败降级 | 通过 | 无效非空 key 显示明确错误态；手动输入可用；恢复有效配置后按钮重新出现 |  | 未记录含 key 的请求 URL |
| owned 进程清理 | 未执行 | 用户前台 dev server 仍在运行 |  | 完成人工项后由用户 `Ctrl+C` 停止 |

## 12. 当前未验证项

以下事项仍未验证，不得暗示已通过：

- 缺 key 环境下两个入口的 P1 键盘候选流程。
- 遮罩、关闭按钮、手动输入三种关闭方式的逐项焦点恢复。
- `PlaceSearch` 的无坐标候选分支。
- 生产 key、生产/预览域名白名单、托管平台环境变量和部署联调。
- 当前用户前台 dev server 的最终 `Ctrl+C` 清理与端口释放确认。

## 13. 2026-07-26 真实浏览器验收记录

- Origin：`http://localhost:3000`（用户在 PowerShell 7 前台启动）。
- 凭据状态：用户仅以 `SET` 确认两个 `NEXT_PUBLIC_AMAP_*` 变量存在；验收过程未读取、打印或截图其值。
- 真实服务：地图 JS API、AutoComplete 候选、望京 SOHO 落点均成功。
- 新增房源回填：位置提示为 `望京SOHO 北京市朝阳区`，独立区域字段为 `北京市朝阳区`。
- 工作地点回填：人工名称“我的公司”保持不变；临时锚点保存成功，数据快照从 0 变为 1，删除后恢复为 0。
- 脚本单例：首次地图加载后为 1，关闭重开仍为 1。
- 桌面布局：视口 `1440×900`，Dialog `672×630`，坐标 `(384, 135)`，body overflow 锁定。
- 移动布局：视口 `390×844`，bottom sheet `390×717`，坐标 `(0, 127)`，底边为 `844`。
- Dialog：打开后搜索框获得焦点；关闭后 body overflow 恢复、焦点归还触发按钮。
- 发现并修复：高德 AutoComplete 会截断冒泡阶段的 Escape；keydown 监听改为捕获阶段后，真实 Escape 关闭、滚动恢复和焦点归还均复测通过。
- 浏览器限制：自动坐标拖拽被高德解释为平移地图，未能形成可靠 Marker 拖拽证据；必须人工补测。
- 观察项：自动平移地图期间高德脚本曾输出内部 `Network error`，地图与候选仍可用。请在用户自己的 Chrome 中确认是否仍出现；若出现，记录失败请求的域名与错误码，但不要记录含 key 的完整 URL。
- 代码验证：相关 P3 文件 ESLint 通过；仅出现与本功能无关的 npm `http-proxy` 配置弃用警告。
- 2026-07-27 用户 Chrome 人工补测：新增房源入口的 Marker 拖拽成功，拖拽后地址摘要已更新。
- 2026-07-27 用户 Chrome 人工补测：地图回填后的临时测试房源已成功保存，完整新增房源保存链路通过。
- 2026-07-27 用户 Chrome 人工补测：设置入口的 Marker 拖拽与地址更新成功，临时通勤锚点已成功保存。
- 2026-07-27 用户 Chrome 人工补测：只返回属性路径的持久化检查结果为 `forbiddenPropertyPaths: Array(0)`；房源和通勤锚点均未发现坐标属性。
- 2026-07-27 验收数据清理：临时通勤锚点已由用户删除。
- 2026-07-27 验收数据清理：临时测试房源已由用户彻底删除；本轮人工验收未遗留测试记录。
- 2026-07-27 用户 Chrome 人工补测：通过 PowerShell 临时空白覆盖前端地图 key 后，新增房源与设置页的地图按钮均隐藏，原位置输入框保留，未出现空白地图。
- 2026-07-27 环境恢复确认：移除 PowerShell 临时覆盖并重启 dev 后，两个入口的地图按钮均已恢复。
- 2026-07-27 用户 Chrome 人工补测：临时无效非空 key 触发明确加载错误态，“使用手动输入”可正常返回文本输入；移除临时覆盖并重启后地图按钮恢复。
- 2026-07-27 生产构建：`npm.cmd run build` 通过；Next.js 编译、TypeScript、页面数据收集及 12/12 静态页面生成均成功。
