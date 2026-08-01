# HouseFolio UI/UX 设计全面评估报告

- **评估日期**：2026-08-01
- **评估范围**：全部 8 个路由页面（`/`、`/portfolio`、`/portfolio/new`、`/portfolio/[id]`、`/compare`、`/viewing-log`、`/contract-review`、`/settings`）与 30+ 个组件
- **评估方法**：源码逐行审查（重点：主题体系、交互模式、a11y 属性）+ 真实浏览器渲染验证（1440px 桌面 / 390px 移动视口截图）+ WCAG 2.1 对比度实测计算 + 异步组件普查
- **证据材料**：本目录 `shots/` 下 7 张实测截图；文中所有问题均标注 `文件:行号`

---

## 总体结论（TL;DR）

HouseFolio 的**信息架构清晰、文案质量高、首页视觉出色、移动端布局扎实**，隐私边界与合规表达在同类工具中属于上乘。但当前 UI 层存在一个**根源性架构问题**：双主题体系靠 `hf-warm-scope` CSS 覆盖 hack 维系，由此派生出进度条不可见、深色块泄漏、对比度失败等一系列真实视觉缺陷。交互层的短板集中在**弹层/抽屉的焦点与键盘管理**、**破坏性操作确认口径不一**、**反馈消息生命周期缺失**三个方面。

**综合评分（10 分制）**：

| 维度 | 得分 | 简评 |
|---|---|---|
| 视觉一致性 | 5.5 | 暖色系本身美观，但三套色系 + 覆盖 hack 破坏一致性 |
| 布局合理性 | 7.5 | 网格与响应式扎实；详情页左右栏失衡、装饰元素占位 |
| 色彩体系 | 5.0 | 主色统一度尚可；语义色 4 套并存、多处对比度不达标 |
| 字体与排版 | 7.0 | 字体栈合理；字号/圆角阶梯无规范 |
| 交互直观性 | 6.5 | 星级评分、分组徽章直观；假控件、"v"字符箭头、双保存模型减分 |
| 导航与信息架构 | 7.0 | 五模块划分合理；无当前页指示、`<a>` 整页跳转 |
| 可用性反馈 | 5.5 | 加载/成功/错误三态口径混乱，原生 alert/confirm 与定制对话框混用 |
| 可访问性 | 5.0 | 个别组件（地点输入框）优秀；整体焦点管理、对比度、reduced-motion 缺口大 |

---

## 一、视觉设计评估

### 1.1 视觉一致性 —— 问题最集中的维度

**现状**：项目同时存在三套配色体系：

1. **首页手写暖色系**（`src/app/page.tsx`）：`#f6f1e7`、`#7d8654` 等，独立的一套 hex；
2. **新页面暖米色系**（`/viewing-log`、`/settings`、`/portfolio` 列表等）：`#f8f4ec`、`#727a3f`、`#fffaf2`；
3. **旧深色 slate 体系**：13 个组件仍写 `bg-slate-900`、`text-white`、`border-slate-800` 等深色类，依赖 `globals.css:32-143` 的 `.hf-warm-scope` 覆盖规则**在运行时把深色类重新映射成暖色**。

这意味着组件代码写的颜色和实际渲染的颜色完全无关，是一种"CSS 特异性战争"式的主题方案。实测发现以下派生缺陷：

| # | 问题 | 证据 |
|---|---|---|
| A1 | 映射表不全：新增深色类不会被映射。`bg-amber-950/50`（`listing-detail-view.tsx:123`）、`bg-red-950`（`add-listing-form.tsx:244`）、`bg-emerald-950`（`listing-status-panel.tsx:110`、`listing-notes-panel.tsx:121`）均未被覆盖 → **暖色页面上出现真实深色块** | 截图 `13-detail-l2.png` 中免责框为深棕色块，与页面格格不入 |
| A2 | `/portfolio` 列表页是唯一没有挂 `hf-warm-scope` 的内页（`src/app/portfolio/page.tsx:9`，其余 6 页均有）。`listing-card-cover-photo.tsx:77` 的 `border-slate-800 bg-slate-950` 在该页会以**真实深色**渲染——有封面照片的卡片会出现深色边框/底色，同组件在 `/viewing-log` 却是浅色 | 代码对比两页 scope 类即可复现 |
| A3 | **评分进度条功能性失效**：`ScoreRow`（`listing-detail-view.tsx:51-56`）设计意图是"白色进度条 + 深色轨道"，映射后填充色 `#fffaf2` vs 轨道色 `#f4f0e7`，对比度约 1.03:1，**进度信息完全丢失** | 截图 `13-detail-l2.png`：5 个贡献分卡片下的进度条几乎不可见 |
| A4 | `compare` 页使用第四套 neutral 灰色系（`compare-table.tsx`），其分组表头 `bg-neutral-950 text-white` 恰好命中映射规则 `.hf-warm-scope .bg-neutral-950.text-white`（`globals.css:87`）才"侥幸"变成橄榄绿——**正确渲染依赖巧合而非设计** | 截图 `06-compare.png` |

### 1.2 布局合理性

**做得好的**：
- 页面骨架统一：`AppNav + 标题 Hero 卡 + 内容区 + ComplianceFooter`，学习成本低；
- 响应式断点使用规范（`sm/lg/xl`），390px 移动视口下首页、列表页堆叠自然（截图 `09-home-mobile.png`、`10-portfolio-mobile.png`）；
- `compare` 表格 `min-w-[920px]` + 横向滚动 + 首列 sticky（`compare-table.tsx:279-330`）是合理的移动端表格策略。

**问题**：
- **详情页左右栏严重失衡**（`listing-detail-view.tsx:211`）：左栏 7 个长面板，右栏 aside 仅 2 个短卡片，页面下半部分右侧大面积空白（截图 `05-detail.png`）；
- **装饰性占位元素误导交互预期**：首页右上角用 span 拼装的假头像、假天气图标、字符"v"（`src/app/page.tsx:81-95`）看起来是可点击的用户菜单/下拉，实际无任何功能——违反可供性（affordance）原则；
- 首页大量使用固定像素（`h-[80px]`、`px-[52px]`、`w-[590px]` 等，`page.tsx` 多处），且中文标题 `whitespace-nowrap`（`page.tsx:118`），在极端视口或文案变长时有溢出风险；
- `viewing-log` 卡片为对付弹层层级，大量使用 `overflow-visible` + 手工 z-index（`viewing-log-workbench.tsx:916` `openTimeListingId === listing.id ? "z-40" : "z-0"`），是在与层叠上下文"搏斗"，后续维护极易回归。

### 1.3 色彩搭配

**主色**：橄榄绿 `#727a3f` + 米色系，气质统一、符合"安心决策"的产品定位；白字 on 橄榄绿实测对比度 4.59:1，压线通过 WCAG AA。

**问题**：
- **语义色四套并存**：错误色有 amber 系（`listing-photo-panel.tsx`、`listing-commute-panel.tsx:467`、`settings-photo-data-panel.tsx`）、red 系（`settings-local-data-panel.tsx`、`compare-selected-listings-panel.tsx:449`）、暖橙系（`contract-review-panel.tsx`）、硬编码 `#5f241f`（`listing-commute-panel.tsx:457`）四种；成功色有深色 emerald-950（未映射，显示为深绿块）与浅色 emerald-50（`viewing-log-workbench.tsx:1070`）两种；危险色另有 `#8f1f1b` 一套（删除对话框、危险区）。用户无法形成稳定的"红=错误、绿=成功"预期；
- **待看房分组引入品红 `#b7346d`**（`viewing-log-workbench.tsx:100-124`），与全站橄榄绿主色调冲突明显，且 hover 态 `hover:border-[#b7346d]` 把品红扩散到了时间选择控件（`:356`）；
- **文字对比度实测失败项**（WCAG AA 要求正文 ≥ 4.5:1）：

| 前景/背景 | 实测对比度 | 用途 | 判定 |
|---|---|---|---|
| `#82786a` on `#f4f0e7` | **3.81:1** | 全站卡片次级标签（text-xs，租金/通勤/面积标签等，出现频次极高） | ❌ 不达标 |
| `#958b7d` on `#fffaf2` | **3.22:1** | 详情页次级文字（text-slate-600 映射色） | ❌ 不达标 |
| `#a3a3a3` on `#ffffff` | **2.52:1** | compare 表"待补充"占位（neutral-400） | ❌ 严重不达标 |
| `#746c5f` on `#fffaf2` | 4.99:1 | 正文描述 | ✅ 通过 |
| 白 on `#727a3f` | 4.59:1 | 主按钮 | ✅ 压线通过 |

### 1.4 字体使用

- 字体栈设计合理（系统无衬线 + Noto Serif SC 衬线备选 + 等宽，`globals.css:6-8`），`lang="zh-CN"` 声明正确；
- **但无字号/字重设计阶梯**：H1 存在 `text-4xl font-semibold`（多数页面）、`text-4xl font-bold`（详情页 `:219`）、`text-3xl`（compare/settings）、`clamp(42px..74px)`（首页）四种规格；圆角同样失控——`rounded-xl / rounded-2xl / rounded-[1.5rem] / rounded-[1.75rem] / rounded-[2rem] / rounded-[9px] / rounded-[22px]` 七档混用；
- 首页 Logo 使用 "Segoe Script" 手写体回退栈（`page.tsx:62-66`），在 Windows 与 macOS 渲染差异大，品牌字不可控；
- `uppercase tracking-wide` 用于中文表头（`compare-table.tsx:283,317`）——对中文完全无效，暴露英文模板痕迹。

### 1.5 交互元素直观性

**好的**：
- 星级/爱心评分控件（`viewing-log-workbench.tsx:230-288`）带 hover 预览、`role="radiogroup"`、逐项 `aria-label`，语义完整；
- 三分组徽章同时使用色彩 + 文字双编码，不单纯依赖颜色；
- 删除房源对话框是全站交互质量标杆（`listing-delete-confirmation-dialog.tsx`）：`role="dialog"`、`aria-modal`、Escape 关闭、删除中禁用。

**问题**：
- 两处用纯字符 "v" 冒充下拉箭头（`page.tsx:94`、`viewing-log-workbench.tsx:438-440`），字体渲染不可控（实测截图中显示为斜体小写字母）；
- 卡片上"选择比较"按钮仅 12px 字号 + `py-1`（`listing-card.tsx:74-92`），触摸目标约 32px，低于 44px 建议值；星级按钮 `h-8 w-7`（`:266`）约 32×28px，同样偏小；
- 详情页 L3 面板放置一个永久 disabled 的"AI 分析尚未接入"按钮（`listing-detail-view.tsx:326-331`），占据页面显著位置却无任何价值，且 disabled 状态无解释性 tooltip。

---

## 二、用户体验评估

### 2.1 流畅性

- **内部导航混用 `<a>` 与 `next/link`**：以下位置使用原生 `<a>` 导致**整页刷新**（丢失客户端状态、白屏闪烁、localStorage 重读）：`src/app/portfolio/page.tsx:40,47`、`portfolio/new/page.tsx:12`、`portfolio/[id]/page.tsx:23`、`listing-card.tsx:172`（每张卡片的"查看详情"！）、`portfolio-list.tsx:341`；而 `viewing-log-workbench.tsx` 内全部使用 `<Link>`。同站跳转两种体验，用户能明显感知卡顿差异；
- 表单提交后跳转用 `window.location.href`（`add-listing-form.tsx:225`），同样是整页刷新；
- 无路由级 `loading.tsx` / `error.tsx`，异步编译期间无骨架屏；
- 列表页封面图逐卡片从 IndexedDB 异步读取（`listing-card-cover-photo.tsx:22-70`），无加载占位、无并发控制，列表变长后会出现图片逐张"闪现"。

### 2.2 导航逻辑

- 五大模块（房源/比较/看房/合同/设置）划分符合找房决策动线，信息架构合理；
- **但 `AppNav` 完全没有当前页指示**（`app-nav.tsx:38-47`）：6 个 pill 样式一致，无高亮、无 `aria-current="page"`，用户无法从导航判断身处何处；移动端下导航 pill 折成两行占据首屏大量空间（截图 `10-portfolio-mobile.png`）；
- 首页导航与内页导航是两套完全不同的组件（hero 大导航 vs pill 条），品牌体验断裂；
- 各内页"返回"链接样式随意（`← 返回候选房源` 纯文本小字，`portfolio/[id]/page.tsx:23-28`），位置与样式不统一。

### 2.3 信息架构

- 数据分层（L1 基础信息 → L2 参考评分 → L3 AI 建议）表达清晰，合规边界反复透传，信任感强；
- **状态同步心智模型不统一**：`/viewing-log` 卡片上评分/时间/备忘是**即时静默保存**（`viewing-log-workbench.tsx:686-730`，备忘录 onBlur 保存且**零反馈**，`:518`），而同一页面的抽屉里却是**显式"保存记录"按钮**。用户在卡片上改了东西找不到保存按钮会慌，在抽屉里改了又可能忘按保存；
- **"已保存"消息永驻**：`listing-status-panel.tsx:62`、`listing-notes-panel.tsx:91,104`、`listing-viewing-record-panel.tsx`、`work-location-settings-panel.tsx:83` 的成功提示设置后从不清除——用户再次编辑后"已保存"字样仍挂在那里，形成"新修改已保存"的假象（数据正确性信任问题）；
- **compare 页面向终端用户展示内部开发标签**：`Phase 4B-8｜Selected listings preview`、`Phase 4B-11｜Compare table`、`Phase 4C-2` 等 badge 直接渲染（截图 `06-compare.png` 证实），且存在"完整横向表将在后续阶段评审"的**过时文案**（表格就在下方）。文案位于 `zh-cn.ts:992,994,1025,1079,1116`。这直接损害产品的"完成度"观感；
- 详情页 aside 的"数据范围：本地保存的数据，未上传云端"（`listing-detail-view.tsx:397-404`）等表述重复度高，合规免责声明句式在全站出现 6+ 次，信息密度被稀释。

### 2.4 操作便捷性

**好的**：
- 列表页统计卡（总数/当前显示/平均月租）+ 筛选 + 排序 + 对比选择集中在一个面板，操作动线短；
- 空态设计有引导（`portfolio-list.tsx:333-347` 带 CTA）；
- 地点输入框（`location-suggestion-input.tsx`）是全站 a11y 与交互最好的组件：combobox/listbox/aria-activedescendant/Escape/输入法组合守卫齐全。

**问题**：
- **`/viewing-log` 空态无 CTA**（`viewing-log-workbench.tsx:876-884`），只有说明文字，没有"去添加房源"按钮；
- **抽屉无未保存拦截**：viewing-log 抽屉内表单修改后，点击遮罩直接关闭且无任何确认（`:1042-1048`），用户输入瞬间丢失；
- **照片删除零确认且不可逆**（`listing-photo-panel.tsx:166` 一带），是全站唯一无确认的破坏性操作；而设置页清除数据/导入覆盖/删除通勤锚点用的是浏览器原生 `confirm()`（`settings-local-data-panel.tsx:64,100`、`settings-photo-data-panel.tsx:51`、`work-location-settings-panel.tsx:87`），与删除房源的定制对话框体验割裂；
- **错误双通道打扰**：`settings-local-data-panel.tsx:51` 出错时同时弹 `window.alert` + 页面横幅；
- **表单校验体验弱**：`add-listing-form.tsx:179-207` 逐字段 `return` 单条报错，用户要反复提交才能发现所有问题；无字段级 `aria-invalid`/`aria-describedby` 关联；错误横幅无 `role="alert"`（`:243-247`）；提交中无 loading 态，可重复点击；
- **加载态语义混乱**：多处异步操作仅按钮文案变化（`contract-review-ai-confirmation-panel.tsx:150`、`compare-selected-listings-panel.tsx:358`）；`listing-commute-panel.tsx:533` 加载期间显示"待补充"——把占位符当 loading 用，用户无法区分"没有数据"和"正在加载"；
- **新增表单无草稿保护**：刷新/误触返回后已填内容全丢；
- 5MB 照片大小限制只在上传失败后才告知（`listing-photo-panel.tsx`）。

---

## 三、可用性问题与可访问性缺陷清单

### 3.1 可访问性（a11y）

| # | 缺陷 | 位置 | 影响 |
|---|---|---|---|
| C1 | 三处文字对比度不达标（3.81 / 3.22 / 2.52:1） | 见 §1.3 表 | 低视力用户、强光环境下次级信息不可读 |
| C2 | viewing-log 抽屉：无 `role="dialog"`/`aria-modal`、无焦点陷阱、无初始焦点、关闭后不返回焦点、背景滚动未锁、**Escape 无法关闭** | `viewing-log-workbench.tsx:1041-1193` | 键盘/读屏用户被困或迷失 |
| C3 | 卡片级弹层（时间选择、状态选择）：无 Escape、无外部点击关闭、无焦点管理 | `:316-465` | 键盘用户无法关闭弹层；弹层可能溢出视口 |
| C4 | 地图选择器遮罩是可聚焦 `<button>`，污染 Tab 序，无焦点陷阱 | `location-map-picker.tsx:479-484` | Tab 会聚焦到"看不见的遮罩"上 |
| C5 | 照片上传触发器是 `label` 伪装按钮 + `sr-only` input，无 `focus-within` 样式 | `listing-photo-panel.tsx:197-209` | 键盘聚焦时完全不可见 |
| C6 | 焦点样式不统一：新组件 `focus:ring-2`，旧 slate 组件仅 `focus:border-slate-400`（且该色未映射，暖色页面上显示为灰框）；viewing-log 主按钮、抽屉关闭按钮无 focus-visible 样式 | 多处 | 键盘导航轨迹不可见 |
| C7 | 全局无 `prefers-reduced-motion` 防护；卡片 hover 位移、星星 scale 动画对前庭敏感用户不友好 | `globals.css`（缺失） | 动效敏感用户不适 |
| C8 | 暗色模式半成品：`globals.css:19-24` 声明了 dark 变量，但全站硬编码 hex 完全无视它 → 系统暗色用户得到"黑底 + 浅色卡片"的破碎页面 | 全站 | 要么删除要么补完，当前是最差状态 |
| C9 | 无 skip-to-content 跳转链接；`AppNav` 位于 `<main>` 内部 | `layout.tsx`、各页面 | 键盘用户每页都要 Tab 过整个导航 |
| C10 | 触摸目标 < 44px（选择比较、删除、星级按钮） | 见 §1.5 | 移动端误触率高 |
| C11 | 表单错误未与字段关联（无 `aria-invalid`/`aria-describedby`） | `add-listing-form.tsx` 等 | 读屏用户不知错在哪个字段 |

### 3.2 用户可能的困惑点

1. **"我到底保存了没有？"** —— 卡片即时静默保存 vs 抽屉显式保存 vs 永驻的"已保存"消息（§2.3）；
2. **"参考评分 5.0 是什么意思？"** —— 卡片显示 `toFixed(1)` 的一位小数（如 5.0），但满分 10 分没有任何量纲提示（`listing-card.tsx:131-134`）；详情页同样是 X.X 裸数字；
3. **"待补充"是加载中还是没有数据？"** —— commute 面板加载态与空态同文案（`listing-commute-panel.tsx:533`）；
4. **"Phase 4B-8 是什么？这产品做完了吗？"** —— 内部标签泄漏（§2.3）；
5. **"已排除的房源为什么还出现在看房记录里？"** —— `已排除 ≠ 已看房` 的规则正确，但 rejected 分组卡片仍显示"原计划看房时间"字段（`viewing-log-workbench.tsx:169-186`），语义略显绕；
6. **"点星星和点心形有什么区别？"** —— 期待值用 ♥、总体评分用 ★（`:302`），图标语义切换无声提示，新用户需要猜；
7. **深色模式用户看到破碎页面**（C8）；
8. **状态徽章"关注中"（listing status）与分组徽章"待看房"（viewing group）并排出现**（截图 `03-viewing-log.png`），两套状态体系并列，需要用户自行理解映射关系——概念虽正确但缺乏首次使用引导。

---

## 四、问题优先级排序

### P0 —— 必须改进（影响功能正确性/数据安全/基本可用性）

| # | 问题 | 类别 |
|---|---|---|
| P0-1 | 主题架构：废弃 `hf-warm-scope` 覆盖 hack，统一设计令牌 | 架构/一致性（A1-A4 之根） |
| P0-2 | 评分进度条映射后不可见，功能信息丢失 | 功能缺陷（A3） |
| P0-3 | 面向用户展示 Phase 内部标签与过时文案 | 信任损害（§2.3） |
| P0-4 | 照片删除零确认；设置页原生 confirm/alert 与定制对话框混用；错误双通道 | 数据安全/一致性 |
| P0-5 | 三处文字对比度未达 WCAG AA | 可访问性合规 |

### P1 —— 应该尽快改进（显著影响体验）

| # | 问题 | 类别 |
|---|---|---|
| P1-1 | 抽屉/弹层焦点与键盘管理（Escape、焦点陷阱、初始/返回焦点、滚动锁、未保存拦截） | 可访问性/数据丢失 |
| P1-2 | 全站 `<a>` → `<Link>` 统一；`window.location.href` → `router.push`；AppNav 增加当前页高亮 + `aria-current` | 流畅性/导航 |
| P1-3 | 反馈消息生命周期：成功消息自动消退或编辑后失效；错误统一 `role="alert"`；loading 态统一 spinner + `aria-busy`；"待补充"与加载态分离 | 反馈一致性 |
| P1-4 | 统一保存心智模型：即时保存处增加"已自动保存 ✓"微反馈，或抽屉也改为即时保存 | 心智模型 |
| P1-5 | 表单校验升级：字段级即时提示 + `aria-invalid`/`aria-describedby` + 提交防重复 + loading | 表单体验 |
| P1-6 | 焦点可见性与触摸目标补齐（focus-visible 统一、≥44px） | 可访问性 |
| P1-7 | 暗色模式决策：删除 `prefers-color-scheme` 声明或完整实现 | 可访问性 |

### P2 —— 建议优化（打磨项）

| # | 问题 | 类别 |
|---|---|---|
| P2-1 | 设计令牌化：字号/字重/圆角/间距阶梯收敛（7 档圆角 → 3 档） | 一致性 |
| P2-2 | 硬编码中文回收进 `zh-cn.ts`（`compare-table.tsx:21-42` 与 `compare-selected-listings-panel.tsx:48-66` 两份重复 label 表合并；`listing-viewing-record-panel.tsx:51` 的 "n / 5" 死代码清理） | 可维护性 |
| P2-3 | 移除/禁用装饰性假控件（首页假头像、"v"字符）；换 SVG chevron | 交互直观性 |
| P2-4 | viewing-log 空态补 CTA；详情页 aside 失衡调整；L3 永久 disabled 占位改为" roadmap 说明卡"或隐藏 | 信息架构 |
| P2-5 | skip-to-content、`prefers-reduced-motion`、landmark 修正 | 可访问性 |
| P2-6 | 文案统一：省略号 `……`/`…` 混用、中英文页面名混杂（"Settings/Portfolio/Compare 页面"、"checklist"）、"人话化"口语、日期 `toLocaleString` 指定 `zh-CN` | 文案 |
| P2-7 | 参考评分增加量纲（"7.8 / 10"）；新增表单草稿保护；照片 5MB 限制前置提示；封面图加载占位 | 细节体验 |
| P2-8 | 城市硬编码配置化（"010" vs "北京" 分裂） | 功能正确性 |

---

## 五、逐项改进建议（方法 · 路径 · 预期效果）

### P0-1 主题架构统一（根因项）

- **方法**：以 Tailwind 4 的 `@theme` 为单一事实源，把现有暖色 hex 抽为语义化令牌（`--color-surface`、`--color-surface-raised`、`--color-ink`、`--color-ink-secondary`、`--color-accent`、`--color-danger`、`--color-success`、`--color-warning`），组件只引用语义类（`bg-surface`、`text-ink-secondary`），禁止再出现 `slate/neutral/amber/emerald` 等字面色类。
- **路径**：
  1. `globals.css` 定义令牌并删除全部 `.hf-warm-scope` 覆盖规则；
  2. 按组件逐个重写 13 个 slate 组件（建议顺序：`listing-card-cover-photo` → `listing-detail-view` 族 → `add-listing-form` → settings 三面板 → commute/photo/notes/status/viewing-record 面板），每改一个即可删除对应映射；
  3. 加一条 ESLint `no-restricted-syntax` 规则（或 `eslint-plugin-tailwindcss` 配置）禁止新增 `bg-slate-*` 等字面色类，防止 hack 回流。
- **成本**：中（13 个组件机械替换，约 1-2 天）；可先只做"补全映射表 + 给 `/portfolio` 加 scope"作为 1 小时的止血方案。
- **预期效果**：A1-A4 全部消解；暗色模式未来只需改令牌值；组件代码所见即所得。

### P0-2 评分进度条修复

- **方法**：进度条改用令牌色：轨道 `bg-[--color-surface-sunken]`、填充 `bg-[--color-accent]`，并加 `role="progressbar" aria-valuenow aria-valuemin/max`。
- **路径**：`listing-detail-view.tsx:51-56`（ScoreRow）；随 P0-1 一并完成。
- **成本**：小（0.5 小时）。
- **预期效果**：五项贡献分的相对强弱重新可见；读屏可朗读进度数值。

### P0-3 清除内部 Phase 标签

- **方法**：badge 改为用户语言（如"已选房源预览"、"横向对比表"、"AI 辅助解读"），删除"将在后续阶段评审"等路线图文案。
- **路径**：`src/content/zh-cn.ts:992,994,1025,1079,1116` 及对应 `compareRouteCopy`/`compareTableCopy` badge 字段；顺手 grep `Phase` 全库确认无遗漏。
- **成本**：小（0.5 小时）。
- **预期效果**：产品完成度观感立升；消除"半成品"印象。

### P0-4 破坏性操作确认统一

- **方法**：抽出通用 `ConfirmDialog`（以现有 `ListingDeleteConfirmationDialog` 为基座，参数化标题/描述/确认文案/危险级别），替换全部原生 `confirm()`/`alert()`；照片删除接入同一对话框；错误提示只保留页面内横幅单通道。
- **路径**：`settings-local-data-panel.tsx:51,64,100`、`settings-photo-data-panel.tsx:51`、`work-location-settings-panel.tsx:87`、`listing-photo-panel.tsx`（删除处理）。
- **成本**：中（0.5-1 天）。
- **预期效果**：所有不可逆操作均有统一、可键盘操作、带上下文的确认关卡；杜绝误删。

### P0-5 对比度修复

- **方法**：次级文字色从 `#82786a` 加深至约 `#6f665a`（对 `#f4f0e7` 可达 4.5+）；`#958b7d` → `#7a7166`；"待补充"占位从 `neutral-400` 改为 `#6b6560` 并配合斜体或"—"符号区分语义。全部进入令牌（`--color-ink-secondary`、`--color-ink-muted`）。
- **路径**：令牌定义 + 全局替换；`compare-table.tsx:100,108` 的 `text-neutral-400`。
- **成本**：小（2 小时）。
- **预期效果**：正文级文字全部 ≥ 4.5:1，过 WCAG AA。

### P1-1 抽屉与弹层可访问性

- **方法**：引入 `@radix-ui/react-dialog`（或 headlessui `Dialog`）替换手写抽屉/弹层——免费获得焦点陷阱、Escape、滚动锁、`aria-modal`、初始/返回焦点；抽屉关闭前检查表单脏状态，脏则弹确认；卡片级小弹层至少补 Escape + 外部点击关闭（`useEffect` 监听 pointerdown）。
- **路径**：`viewing-log-workbench.tsx:1041-1193`（抽屉）、`:316-465`（两个小弹层）、`location-map-picker.tsx:479-484`（遮罩改 `aria-hidden` 非聚焦元素）。
- **成本**：中（1 天）。
- **预期效果**：键盘/读屏用户可完整操作；误点遮罩不再丢数据；同时消除手工 z-index 搏斗代码。

### P1-2 导航统一

- **方法**：全部 `<a href="/...">` 换成 `next/link`；`add-listing-form.tsx:225` 换 `router.push`；`AppNav` 用 `usePathname()` 计算当前页，加高亮样式 + `aria-current="page"`；移动端把导航折叠进与首页一致的汉堡菜单组件（复用 `HomeMobileNav`，统一两套导航为一个 `AppNav` 响应式组件）。
- **路径**：§2.1 列出的 7 处文件 + `app-nav.tsx` 重构。
- **成本**：小-中（0.5 天）。
- **预期效果**：站内跳转无刷新卡顿；用户始终知道自己在哪；移动端首屏释放两行空间。

### P1-3 反馈消息生命周期

- **方法**：制定三态规范——成功：toast 或内联消息 3 秒自动消退（或字段再次编辑时清除）；错误：内联横幅 + `role="alert"`，字段级错误用 `aria-describedby` 挂到输入框；加载：按钮 spinner + `aria-busy="true"` + 禁用，内容区用骨架屏或"加载中…"文案，**禁止用"待补充"占位**。
- **路径**：`listing-status-panel.tsx:62`、`listing-notes-panel.tsx:91,104`、`listing-viewing-record-panel.tsx:95`、`work-location-settings-panel.tsx:83`、`listing-commute-panel.tsx:533`、各 AI 面板。
- **成本**：中（1 天）。
- **预期效果**：用户对每个操作的结果有确定、及时的感知；消除"假已保存"。

### P1-4 保存心智模型统一

- **方法**：推荐**全面转向即时保存**（与卡片一致）：抽屉内字段 onBlur/选择即存，配合"已自动保存 ✓ HH:mm"微反馈；移除"保存记录"按钮，保留"关闭"。若坚持显式保存，则卡片侧也要给出一致的已存反馈。
- **路径**：`viewing-log-workbench.tsx` 抽屉表单。
- **成本**：小（0.5 天）。
- **预期效果**：单一心智模型，零丢单焦虑。

### P1-5 表单校验升级

- **方法**：改为字段级校验（onBlur 校验 + 提交时全量校验并聚焦首个错误），错误文案挂在字段下方并 `aria-describedby` 关联；提交按钮 `disabled + aria-busy` 防重复。
- **路径**：`add-listing-form.tsx`（可抽象出 `FormField` 组件复用到 settings、work-location 表单）。
- **成本**：中（1 天）。
- **预期效果**：一次提交暴露全部错误；读屏用户定位错误字段；重复提交消除。

### P1-6 焦点与触摸目标

- **方法**：全局统一 `focus-visible:outline-2 outline-offset-2 outline-[--color-accent]`；小按钮最小高度 40px（移动端 44px）：星级按钮 `h-10 w-9`、卡片操作按钮 `py-2.5`。
- **路径**：`globals.css` 加一个 `.focus-ring` 工具类 + 全组件替换；`listing-card.tsx`、`viewing-log-workbench.tsx:266`。
- **成本**：小（0.5 天）。
- **预期效果**：键盘轨迹全程可见；移动端误触率下降。

### P1-7 暗色模式决策

- **方法**：当前产品无暗色设计资源，**建议直接删除** `globals.css:19-24` 的 `prefers-color-scheme: dark` 块，并在 `<html>` 加 `color-scheme: light` 锁定；待 P0-1 令牌化完成后，未来实现暗色只需映射令牌值。
- **成本**：极小（10 分钟）。
- **预期效果**：系统暗色用户不再看到破碎页面。

### P2 项（简列）

- **P2-1 令牌阶梯**：字号收敛为 `display/h1/h2/body/label/caption` 六档，圆角收敛 `lg(12)/xl(16)/2xl(24)` 三档，间距沿用 Tailwind 4 步进；改 `globals.css @theme` + 全库机械替换。
- **P2-2 文案回收**：合并两份 label 表至 `zh-cn.ts`，删除死代码 `ratingOptions`；可加一个简单单测断言"组件中无裸中文字符串字面量"（项目已有 contract-check 文化，模式可复用）。
- **P2-3 假控件**：首页右上角装饰组加 `aria-hidden` 的同时改成真实功能（主题切换入口/关于菜单）或直接移除；"v" 字符全部替换为 SVG chevron（复用 `NavIcon` 模式）。
- **P2-4 信息架构**：viewing-log 空态加"添加候选房源"CTA；详情页改单列 + 锚点目录，或把"基础信息/合规边界"移入左栏流；L3 占位改为说明卡（无按钮）。
- **P2-5 a11y 基建**：`layout.tsx` 加 skip link（`#main-content`）；`globals.css` 加 `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important } }`；`AppNav` 移出 `<main>` 或包 `<header>`。
- **P2-6 文案**：统一 `……`；页面名全中文（"设置/候选房源/辅助比较"）；"checklist"→"检查清单"；`toLocaleString("zh-CN")` 全库统一。
- **P2-7 细节**：评分显示 `7.8 / 10`；`add-listing-form` 用 sessionStorage 做草稿；照片限制文案前置到上传按钮旁；封面图加 `animate-pulse` 占位块。
- **P2-8 城市配置**：设置页增加"常用城市"字段，suggestion/commute/map 三处统一读取，不再硬编码。

---

## 六、其他改进方向（超越问题清单的建议）

1. **建立视觉回归防线**：当前任何样式改动都可能被 `hf-warm-scope` 这类隐式规则放大。建议引入 Storybook（或至少一个 `/dev/gallery` 路由）集中渲染全部组件的三态（空/数据/错误），配合 Playwright 截图基线做 CI 视觉回归。项目已有 `graphify-out` 依赖图，可用于圈定变更影响面。
2. **把"组件契约检查"文化扩展到 UI 层**：项目已有大量 `*-contract-check.ts`（值得称赞的工程习惯）。建议增加 `ui-copy-contract-check`：扫描 `src/components` 下裸中文字面量与 `Phase` 字样，CI 拦截，从机制上杜绝 P0-3/P2-2 复发。
3. **路由级状态外置 URL**：筛选/排序/抽屉选中态（`statusFilter`、`sortKey`、`selectedListingId`）写入 `searchParams`（compare 页已有 `?ids=` 范式），收获可分享链接、刷新不丢状态、浏览器前进后退可用三重收益。
4. **性能与感知性能**：首页 hero 图 `preload` + portfolio 页图 `priority` 的策略建议统一审计一次 LCP；封面图 ObjectURL 列表可做缩略图内存缓存（`Map<listingId, objectUrl>`）避免重复 IDB 读取；`next/font` 托管 "Noto Serif SC" 子集替代系统字体回退，消除品牌字跨平台差异。
5. **首次使用引导（Onboarding）**：`listing status`（关注中/候选…）与 `viewing group`（待看房/已看房/已排除）两套体系并存是产品核心概念，建议首次进入 `/viewing-log` 时给一个 3 步 Coachmark，或在分组标题旁加 `?` 说明气泡——比事后读文档有效得多。
6. **键盘快捷键与效率**：`/` 聚焦筛选、`Esc` 关闭顶层弹层、`g p` / `g v` 页面跳转等低成本快捷键能显著提升重度整理场景（一次看房季管理 20+ 房源）的效率。
7. **数据快照页分层**：`/settings` 的 LocalStorage 快照对普通用户过于技术化，建议默认折叠为"高级：查看原始数据键"，主视图保留人类语言的数据概览（X 套房源、Y 条笔记、Z 张照片）。
8. **空数据演示模式**：本次评估为了截图不得不手工注入 localStorage 种子数据——这本身就是信号：建议提供"载入示例数据"开关（设置页），既方便新用户探索，也方便你们自己做设计走查与演示。

---

## 附录 A：实测截图索引（`shots/`）

| 文件 | 内容 | 关键证据 |
|---|---|---|
| `01-home.png` | 首页 1440px | 视觉质量基线；假头像/"v"字符 |
| `02-portfolio.png` | 房源列表 1440px | 卡片体系、统计卡、对比选择条 |
| `03-viewing-log.png` | 看房记录 1440px | 三分组色彩编码；双状态徽章并列 |
| `06-compare.png` | 对比页 1440px | **Phase 内部标签泄漏**；neutral 灰色系 |
| `09-home-mobile.png` | 首页 390px | 移动端适配良好基线 |
| `11-viewing-drawer.png` | 抽屉打开态 | 遮罩/抽屉结构（焦点管理缺失） |
| `13-detail-l2.png` | 详情页 L2 评分区 | **进度条不可见**；深棕色免责块泄漏 |

## 附录 B：WCAG 对比度实测表

计算方法：WCAG 2.1 相对亮度公式，脚本实测。完整 16 组数据见 §1.3，不达标项：`#82786a on #f4f0e7 = 3.81`、`#958b7d on #fffaf2 = 3.22`、`#a3a3a3 on #ffffff = 2.52`。

## 附录 C：值得保持的优点

1. 删除确认对话框（`listing-delete-confirmation-dialog.tsx`）——全站交互标杆，建议以其为基座抽象 `ConfirmDialog`；
2. 地点输入框（`location-suggestion-input.tsx`）——combobox 范式完整，可作弹层改造参考；
3. 文案中隐私边界与合规表述的统一透传——产品信任感的核心资产；
4. 图标统一 `aria-hidden`、装饰图 `alt=""` 的细节习惯；
5. 移动端布局质量——390px 下无横向溢出、层级清晰。
