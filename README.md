# HouseFolio

> 一个本地优先的私人找房决策工具：帮助租客管理自己主动收集的候选房源，并用 LBS、规则算法和 AI 解释层辅助比较，而不是发布房源、抓取房源或撮合交易。

HouseFolio is a local-first rental decision management tool for portfolio demonstration. It helps renters organize self-collected candidate listings into a private workspace, then uses LBS, rule-based algorithms, and AI-assisted explanations to support comparison and decision-making.

---

## Live Demo

- GitHub Repository: https://github.com/Qiu-Jiajun/HouseFolio
- Demo Site: https://house-folio.vercel.app/
- Demo Mode: https://house-folio.vercel.app/demo

Demo Mode 使用完全虚构的数据展示 HouseFolio 的核心产品逻辑：

- L1：用通勤锚点和通勤摘要解释房源的空间关系；
- L2：用参考评分和维度拆解辅助比较候选房源；
- L3：用预生成说明文本展示 AI 如何把结构化结果翻译成人话建议。

Demo Mode 不读取真实用户数据，不读取本机照片，不调用高德，不调用 AI，也不代表真实房源或真实租赁建议。它的目的只是让面试官、朋友或作品集评审者无需从空白账户开始录入，也能快速理解 HouseFolio 的产品价值。

---

## 1. Product Positioning｜产品定位

HouseFolio 解决的不是“哪里有房”的问题，而是：

> 我已经从多个渠道收集了一批候选房源之后，应该如何记录、比较、排序和决策？

现实中的租房决策通常不是一次简单搜索，而是一个持续几天到几周的个人项目：

- 用户在贝壳、58、豆瓣、小红书、中介聊天、朋友转发中看到不同房源；
- 候选信息散落在网页、截图、微信、备忘录和相册里；
- 看房后产生主观笔记、照片、优缺点印象；
- 决策时还要考虑通勤、生活圈、预算、面积、采光、安静程度、共同居住者的工作/学习地点等因素。

HouseFolio 的目标是把这些候选房源组织成一个私有 Portfolio，并用三层决策引擎辅助比较：

    基础层：用户主动添加候选房源、笔记、评分、状态、看房照片
    L1 LBS：通勤锚点、通勤摘要、空间关系、生活圈分析
    L2 Algorithm：参考评分、排序、维度拆解、对比基础
    L3 AI：把 L1/L2 的结构化结果翻译成人话建议、checklist 和风险解释

HouseFolio 不是房源平台，不替代贝壳、58、小红书、豆瓣或中介。它站在用户自己的候选房源池之上，帮助用户做私人决策管理。

---

## 2. Core Idea｜三层决策引擎

HouseFolio 的核心不是“记录房源”，而是把租房决策拆成三个层次：

    L1 LBS：把地址变成空间决策数据
    L2 Algorithm：把多套房源变成可比较结构
    L3 AI：把结构化结果变成人话解释

### L1｜LBS 空间决策层

L1 负责把“地址线索”转化为空间决策信息。

它关注的问题不是“房源在哪里”，而是：

- 这套房到我的工作/学习地点有多远？
- 如果有多个通勤锚点，例如本人公司、伴侣公司、学校、孩子学校，这套房是否仍然合理？
- 这套房和其他候选房源相比，通勤压力如何？
- 它所在区域的生活便利程度如何？
- 它在我的整体找房地图中处于什么位置？

当前项目已建立 LBS provider 封装边界，并支持通过服务端 route 计算公共交通参考通勤。

当前 L1 相关能力包括：

- 工作/学习地点，即通勤锚点；
- 多个通勤锚点的空间折中；
- 公共交通参考通勤摘要；
- 通勤结果只保存摘要，不保存高德原始路线 JSON、经纬度、polyline 或 API key；
- 页面不直接调用高德 API，必须通过 `lib/lbs` 和服务端 API route。

当前相关代码：

    src/lib/lbs
    src/app/api/lbs/commute/transit/route.ts
    src/types/commute-result.ts
    src/types/work-location.ts
    src/lib/local-store/commute-results.ts
    src/lib/local-store/work-locations.ts

### L2｜规则算法与结构化比较层

L2 负责把多个候选房源变成可比较、可排序、可拆解的结构。

它关注的问题是：

- 哪套房通勤更稳？
- 哪套房租金、面积、生活圈、主观感受之间的 trade-off 更合理？
- 哪些房源只是“看起来便宜”，但通勤或生活圈成本较高？
- 哪些房源字段缺失，暂时不适合纳入严肃比较？
- 用户应该如何在 2–4 套候选房源之间横向对比？

当前项目已实现：

- Reference Score 参考评分；
- 评分拆解；
- 通勤结果对评分的最小接入；
- commute source indicator：区分“默认参考值”和“本地通勤结果”；
- comparison input selector 草案，用于后续正式横向对比视图。

关键原则：

- L2 使用规则和简单数学；
- 不用 LLM 打分；
- 不用 LLM 排序；
- 不输出“最佳房源”或“系统推荐”；
- Reference Score 只用于辅助比较，不代表最终选择。

当前相关代码：

    src/lib/algorithm/score.ts
    src/lib/algorithm/portfolio.ts
    src/lib/algorithm/comparison.ts
    src/lib/algorithm/comparison-contract-check.ts
    src/lib/local-store/listing-lookup.ts

### L3｜AI 解释层

L3 的定位不是“替用户决定”，而是把 L1/L2 的结构化结果翻译成自然语言。

它适合做：

- trade-off 总结；
- 看房 checklist；
- 风险信号解释；
- 条件化建议，例如“如果你优先通勤，A 更合适；如果你优先面积，B 更稳”。

当前 Demo Mode 中使用预生成文本展示 L3 的产品方向。真实 AI 调用尚未作为正式功能接入。

关键原则：

- L3 不负责通勤计算；
- L3 不负责评分排序；
- L3 不读取完整地址、照片、视频、联系方式或笔记原文；
- AI 分析应基于脱敏后的结构化摘要；
- AI 输出必须标注“仅供参考”。

---

## 3. Current Features｜当前已实现能力

### 3.1 Portfolio 基础闭环

当前真实模式支持：

- 首页入口；
- Portfolio 列表；
- 添加候选房源；
- 房源详情页；
- 房源状态管理；
- 看房笔记；
- 主观评分；
- Settings 数据管理。

主要路由：

    /
    /portfolio
    /portfolio/new
    /portfolio/[id]
    /settings
    /demo
    /api/lbs/commute/transit

### 3.2 本地优先数据管理

HouseFolio 当前采用 local-first 方式保存真实用户数据。

当前结构化数据主要保存在浏览器 localStorage 中：

    housefolio:listings
    housefolio:listing-notes
    housefolio:listing-ratings
    housefolio:listing-status-overrides
    housefolio:work-locations
    housefolio:commute-results

Settings 页面支持：

- 查看本地数据快照；
- 导出本地 HouseFolio JSON；
- 导入本地 HouseFolio JSON；
- 清除本机结构化数据；
- 说明 mock data / demo data 与真实用户数据的区别。

相关代码：

    src/lib/privacy/local-data.ts
    src/lib/privacy/local-data-import.ts
    src/components/settings-local-data-panel.tsx

### 3.3 工作/学习地点与通勤锚点

HouseFolio 不把 L1 输入简化为单一“工作地点”。

它使用“工作/学习地点”或“通勤锚点”的概念，适用于：

- 学生住在学校外；
- 小情侣有两个工作地点；
- 合租者需要共同考虑通勤；
- 家庭需要考虑孩子学校；
- 用户存在 2–3 个高频目的地。

当前支持在 Settings 中管理通勤锚点，并在详情页计算公共交通参考通勤。

### 3.4 本机看房照片

当前支持用户在房源详情页主动添加看房照片：

- 支持 JPG / PNG / WebP；
- 单张大小限制；
- 照片保存到浏览器本机 IndexedDB；
- 按 listingId 绑定；
- 刷新后仍可显示；
- 可删除单张照片；
- Settings 可查看照片数量和占用空间；
- Settings 可清除全部本机照片。

边界：

- 照片默认本机保存；
- 不默认上传云端；
- 不默认进入 AI；
- 不公开分享；
- 不进入 localStorage JSON 导入/导出；
- 当前不支持视频。

相关代码：

    src/types/listing-photo.ts
    src/lib/storage/provider.ts
    src/lib/storage/local-photo-provider.ts
    src/lib/storage/photos.ts
    src/components/listing-photo-panel.tsx
    src/components/listing-card-cover-photo.tsx
    src/components/settings-photo-data-panel.tsx

### 3.5 Demo Mode

Demo Mode 是作品集展示入口，用于让面试官或评审者快速理解 HouseFolio 的产品价值，而不是从空白账户开始录入。

Demo Mode 当前展示：

- 3 套虚构候选房源；
- 2 个虚构通勤锚点；
- 预置 L1 通勤摘要；
- L2 参考评分与维度拆解；
- L3 预生成解释文本；
- 数据隔离说明。

Demo Mode 的边界：

- 不读取真实房源；
- 不读取真实笔记；
- 不读取真实照片；
- 不读取真实通勤结果；
- 不写入真实用户数据；
- 不调用高德；
- 不调用 AI；
- 不调用云数据库或对象存储。

相关代码：

    src/app/demo/page.tsx
    src/lib/demo/demo-data.ts
    src/lib/demo/index.ts

---

## 4. Product Boundaries｜项目边界

HouseFolio 明确不做：

- 不发布房源；
- 不抓取第三方房源页面；
- 不聚合贝壳、58、小红书、豆瓣等平台内容；
- 不搬运平台图片、描述或评论；
- 不公开用户房源库；
- 不做房东端；
- 不预约看房；
- 不联系房东或中介；
- 不撮合交易；
- 不收佣金、服务费或保证金；
- 不做“真房源认证”；
- 不宣传“避坑保真”；
- 不替用户做最终决定。

HouseFolio 的合法性和产品价值都依赖这一点：它始终是用户的私人决策管理工具，而不是房源平台、房产中介平台或数据搬运平台。

---

## 5. Architecture｜技术架构

### 5.1 Tech Stack

当前项目使用：

    Next.js 16.2.4
    React 19.2.4
    TypeScript
    Tailwind CSS
    ESLint
    Browser localStorage
    Browser IndexedDB
    Vercel demo deployment

### 5.2 Provider Boundary

HouseFolio 坚持平台能力封装原则：页面和业务组件不直接绑定具体平台 SDK。

当前目录结构中已经按能力拆分：

    src/lib/algorithm       L2 规则算法
    src/lib/lbs             L1 LBS provider boundary
    src/lib/local-store     localStorage 数据访问
    src/lib/storage         本机照片 storage boundary
    src/lib/privacy         本地数据导出、导入、清除
    src/lib/demo            Demo Mode 静态数据
    src/lib/config          配置读取
    src/lib/ai              未来 AI provider 边界
    src/lib/db              未来数据库 provider 边界
    src/lib/auth            未来认证 provider 边界

这意味着未来如果从 Demo 环境迁移到国内云、国内 PostgreSQL、国内对象存储或国内 AI provider，应优先修改 `lib/*` provider，而不是重写页面。

### 5.3 Data Boundary

当前数据分层：

| 数据类型 | 当前保存位置 | 说明 |
|---|---|---|
| 候选房源结构化信息 | localStorage | 用户主动添加 |
| 看房笔记 | localStorage | 本机私有 |
| 主观评分 | localStorage | 用于 L2 辅助评分 |
| 通勤锚点 | localStorage | 工作/学习地点 |
| 通勤结果摘要 | localStorage | 只保存分钟数、距离、summary 等摘要 |
| 看房照片 Blob | IndexedDB | 不进入 localStorage JSON |
| Demo 数据 | 项目内静态数据 | 完全虚构 |
| AI 输出 | 当前仅 Demo 预生成文本 | 尚未接真实模型 |

---

## 6. Why Local-first｜为什么本地优先

找房数据具有明显隐私属性：

- 候选住址；
- 工作/学习地点；
- 通勤锚点；
- 看房照片；
- 主观笔记；
- 预算和居住偏好；
- 与房东/中介沟通内容。

HouseFolio 默认把这些资料保存在当前浏览器本机。它不默认把完整住址、精确通勤锚点、照片、笔记和居住偏好上传云端。

这不是功能缺失，而是产品判断：

> HouseFolio 的价值不在于占有用户数据，而在于把用户自己的找房资料组织成可决策的结构。

---

## 7. Demo Mode｜演示模式说明

HouseFolio 的 Demo Mode 是为了作品集展示而设计的。

真实模式下，用户需要自己添加候选房源、设置通勤锚点、写笔记、上传看房照片，才能形成自己的找房 Portfolio。这个流程符合真实产品逻辑，但不适合面试官或评审者快速理解产品价值。

因此，Demo Mode 提供一个只读演示空间：

- 使用虚构候选房源；
- 使用虚构用户场景；
- 使用预置通勤锚点；
- 使用预置通勤摘要；
- 使用预置参考评分；
- 使用预生成 AI 解释文本；
- 不触碰真实用户数据。

Demo Mode 的目标是让用户在几分钟内看懂：

    HouseFolio 不是房源平台
    HouseFolio 是候选房源的私人决策工作台
    L1 解释空间关系
    L2 提供结构化比较
    L3 把结构化结果解释成人话

---

## 8. Run Locally｜本地运行

我的本地开发环境主要是 Windows + PowerShell，因此命令使用 `npm.cmd`。

    git clone https://github.com/Qiu-Jiajun/HouseFolio.git

    Set-Location HouseFolio

    npm.cmd install

    npm.cmd run dev

打开：

    http://localhost:3000

生产构建：

    npm.cmd run build

启动生产版本：

    npm.cmd run start

---

## 9. Environment Variables｜环境变量

当前真实高德 API key 不应提交到 GitHub。

本地开发可使用 `.env.local`：

    LBS_PROVIDER=mock
    AMAP_API_KEY=your-local-amap-key

注意：

- 不要使用 `NEXT_PUBLIC_AMAP_API_KEY`；
- 不要把真实 key 暴露到客户端；
- 不要把 `.env.local` 提交到 Git；
- 页面和组件不得直接读取高德 key；
- LBS 调用必须走服务端 route 与 `lib/lbs`。

---

## 10. Current Status｜当前状态

当前项目不是商业化产品，也不是正式公开运营版本。

更准确的状态是：

    Portfolio Demo / MVP in progress

已经完成的方向：

- 基础 Portfolio 闭环；
- 中文 UI 文案中心；
- Settings 本地数据权利；
- 工作/学习地点（通勤锚点）；
- LBS provider 封装；
- Detail 页公共交通参考通勤计算；
- L1 commute-results → L2 Reference Score 最小闭环；
- 本机看房照片持久化；
- JSON 导出 / 导入；
- Demo Mode；
- L2 comparison selector foundation。

尚未完成的方向：

- 正式 Compare 页面；
- 多房源勾选；
- 横向对比表；
- 地图 UI；
- POI / 生活圈真实计算；
- AI 真实 API 接入；
- AI 调用前授权弹窗；
- 云端账号与同步；
- 国内云正式部署；
- 隐私政策与用户协议；
- Chrome 插件；
- 看房视频支持。

---

## 11. Roadmap｜近期路线

### Phase 4A｜L2 Comparison Foundation

目标：把现有房源数据、通勤摘要、参考评分、主观评分整理成正式横向对比模型。

计划边界：

- 先做 Comparison data model；
- 复用现有 `buildComparisonInput` selector；
- 不读取照片 Blob；
- 不读取视频；
- 不处理笔记原文；
- 不调用 AI；
- 不调用高德；
- 不新增持久化 selection key；
- 不把 L2 写成推荐系统。

### Phase 4B｜Compare UI Review

目标：评审是否新增 `/compare` 路由，或者先在 Portfolio 内实现轻量对比区域。

### Phase 4C｜Compare UI Implementation

目标：在不破坏当前闭环的前提下，实现 2–4 套房源的横向比较。

### Later｜L3 AI Explanation

目标：在 L2 comparison 结果稳定后，再接入 AI 解释层。

AI 只接收脱敏后的结构化摘要，不接收完整地址、照片、视频、联系方式或笔记原文。

---

## 12. Portfolio Value｜作品集价值

HouseFolio 作为产品经理作品集，重点展示以下能力：

### 12.1 产品洞察

在“房源信息已经很多”的前提下，识别“候选房源如何决策”这一被忽视的问题。

HouseFolio 不试图重新做一个房源平台，而是切入用户真实找房流程中最混乱的一段：多套候选房源之间的比较和取舍。

### 12.2 分层架构能力

用 L1 LBS、L2 Algorithm、L3 AI 把找房从散乱信息管理升级为结构化决策。

这体现了对复杂产品问题的分层拆解能力。

### 12.3 AI 产品判断

知道 LLM 适合做理解与表达，不适合做通勤计算、评分排序、真假判断和交易责任。

这也是 HouseFolio 区别于简单“AI 套壳应用”的关键。

### 12.4 隐私与合规意识

明确不抓取、不聚合、不撮合、不认证；默认本地优先；只保存必要摘要。

这让 HouseFolio 能在中国大陆租房场景下保持更清晰的产品边界。

### 12.5 工程边界意识

通过 `lib/*` provider boundary 避免页面直接绑定平台 SDK，为未来迁移保留空间。

### 12.6 MVP 克制

不追求一开始覆盖视频、云同步、AI 图片分析、房源认证等高风险能力，而是先跑通可演示、可解释、可维护的主线闭环。

---

## 13. Disclaimer｜免责声明

HouseFolio 是个人作品集项目，用于展示产品设计、AI Coding、前端工程、隐私边界和决策辅助思路。

本项目：

- 不提供真实房源；
- 不审核房源；
- 不认证房源真实性；
- 不撮合租赁交易；
- 不参与合同签署；
- 不收取佣金或保证金；
- 不对租赁结果承担责任。

用户在真实租房场景中应自行核实房源真实性、合同条款、付款安全、房东/中介身份和居住风险。

---

## 14. Author

邱佳俊  
Peking University, School of International Studies  
Product Manager Portfolio Project

```text
HouseFolio is not a listing platform.
HouseFolio is not a broker.
HouseFolio is a private rental decision workspace.
```
