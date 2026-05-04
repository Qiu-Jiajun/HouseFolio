# HouseFolio 开发日志｜2026-05-04｜Phase 3B-6B Detail readability polish

## 一、本阶段目标

本阶段目标是完成 Detail 页面 L1 / L2 区域的极小可读性微调。

本阶段属于 Phase 3B light visual polish 的延伸收尾，不进入新功能开发，不改变数据结构，不改变算法，不改变通勤计算链路。

## 二、修改范围

本阶段只修改两个组件：

    src/components/listing-detail-view.tsx
    src/components/listing-commute-panel.tsx

未修改：

    src/app/api/lbs/commute/transit/route.ts
    src/lib/local-store/*
    src/lib/algorithm/*
    src/lib/lbs/*
    src/content/zh-cn.ts
    src/types/*

## 三、完成内容

### 1. Detail L1 readability polish

在 `src/components/listing-commute-panel.tsx` 中完成：

- 提升通勤时间、生活圈评分、地图状态三张指标卡的数字视觉权重；
- 增强已保存通勤结果卡片的边界；
- 调整通勤结果网格间距；
- 为通勤摘要增加深色底块，提高阅读稳定性。

这些修改仅涉及 Tailwind className，不涉及通勤计算逻辑。

### 2. Detail L2 readability polish

在 `src/components/listing-detail-view.tsx` 中完成：

- 强化 Reference Score 总分展示；
- 强化维度拆解卡片边界；
- 提升维度 label 和分数的层级；
- 略微增强进度条高度；
- 强化参考评分 disclaimer 区块的阅读权重。

这些修改仅涉及 Tailwind className，不涉及评分公式和权重。

## 四、验证结果

已执行：

    npm.cmd run build

结果：

    build 通过

已提交：

    28adc91 style: polish detail readability

提交后状态：

    git status clean

## 五、边界确认

本阶段没有做：

- AI / DeepSeek；
- 地图 UI；
- POI / 生活圈真实计算；
- Supabase；
- 部署；
- Chrome 插件；
- 复杂多锚点权重；
- 正式 Phase 4A comparison data model；
- /compare 路由；
- 多房源勾选；
- 横向对比表；
- 全站白色居家风重构；
- PageShell 大重构；
- 照片持久化实现。

## 六、与 v1.5 项目规划文档的关系

用户已经更新 Project Sources 中的《HouseFolio 项目规划文档 v1.5》。

v1.5 新增了“本地照片持久化版”的重要方向：

- 看房照片应是“本地优先 + 持久化 + 可导出备份”的私人资料管理能力；
- 用户第一次选择照片后，应按 listingId 保存到本机 IndexedDB / OPFS；
- 以后打开 Portfolio 或详情页时，应自动读取展示对应照片；
- 页面不得直接操作 IndexedDB、OPFS、Supabase Storage、OSS 或 COS；
- 照片能力必须通过 lib/storage 封装；
- 照片默认不进 AI、不公开分享、不默认云端同步。

但本阶段没有开始照片功能实现。后续如果进入照片方向，应先做架构边界评审和 storage provider 设计文档，再做最小实现。

## 七、建议下一步

建议下一步不要直接做功能实现，而是进入：

    Phase 3D-0：v1.5 local photo persistence boundary review

目标是只做评审与设计文档，确认：

- 本地照片持久化属于基础层，不属于 L1/L2/L3；
- 文件本体优先 IndexedDB / OPFS；
- 页面只调用 lib/storage；
- localStorage 不保存图片本体；
- Settings 未来需要纳入照片数据状态、导出与清除；
- 不默认云端同步；
- 不把照片传给 AI。

完成评审后，再决定是否进入最小实现。