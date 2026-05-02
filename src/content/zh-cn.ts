export const zhCN = {
  common: {
    pending: "待补充",
    currencyCny: "￥",
    month: "月",
    sqm: "㎡",
    minute: "分钟",
    listingStatus: {
      draft: "草稿",
      watching: "关注中",
      visited: "已看房",
      shortlisted: "候选",
      rejected: "已排除",
    },
  },

  nav: {
    brand: "HouseFolio",
    home: "首页",
    portfolio: "候选房源",
    addListing: "添加房源",
    settings: "设置",
  },

  complianceFooter: {
    title: "HouseFolio Phase 1 Demo 边界说明",
    body:
      "HouseFolio 是一个私人找房决策管理工具。它不抓取第三方房源页面，不发布公共房源库，不撮合租赁交易，也不认证房源真实性。当前 Phase 1 仅使用模拟数据与浏览器 localStorage。",
  },

  home: {
    eyebrow: "HouseFolio · 私人找房决策工作台",
    titleLine1: "用 LBS、算法与 AI",
    titleLine2: "让租房决策更清晰。",
    description:
      "HouseFolio 不是房源平台，也不是中介服务。它帮助用户管理自己主动收集的候选房源，并通过三层决策引擎支持空间分析、结构化比较与 AI 辅助解释。",
    actions: {
      openPortfolio: "打开候选房源",
      addListing: "添加房源",
      settings: "设置",
    },
    engines: [
      {
        level: "L1",
        title: "LBS 空间层",
        description:
          "处理通勤、生活圈与地图上下文，把房源位置转化为可比较的空间决策信息。",
      },
      {
        level: "L2",
        title: "算法比较层",
        description:
          "处理参考评分、排序与对比，把多套候选房源转化为结构化的辅助判断依据。",
      },
      {
        level: "L3",
        title: "AI 解释层",
        description:
          "处理总结、建议与解释，把结构化数据转化为更容易理解的人话化决策辅助。",
      },
    ],
    currentPhase: {
      title: "当前阶段",
      body:
        "Phase 1M：建立中文文案中心。当前 Demo 仍只使用模拟数据与浏览器 localStorage，尚未接入 Supabase、地图 API 或 AI 服务。",
    },
  },

  portfolio: {
    eyebrow: "HouseFolio · 候选房源",
    title: "候选房源",
    description:
      "这里展示用户主动添加的候选房源，以及用于演示的模拟房源。当前 Phase 1 仅使用浏览器 localStorage 与 mock 数据。参考评分只是辅助比较信号，不代表最终推荐。",
    actions: {
      addListing: "添加房源",
    },
  },

  portfolioList: {
    stats: {
      totalListings: "房源总数",
      currentlyVisible: "当前显示",
      averageVisibleRent: "当前平均租金",
    },
    controls: {
      title: "筛选与排序",
      description:
        "这是当前 L2 算法层的入口。排序基于简单规则与参考评分。参考评分只是辅助比较信号，不是最终推荐，也不是产品承诺。",
      shortlisted: "候选",
      filterByStatus: "按状态筛选",
      sortBy: "排序方式",
      showingAll: "正在显示全部房源。",
      showingStatusPrefix: "正在显示状态为",
      showingStatusSuffix: "的房源。",
    },
    statusOptions: {
      all: "全部",
      draft: "草稿",
      watching: "关注中",
      visited: "已看房",
      shortlisted: "候选",
      rejected: "已排除",
    },
    sortOptions: {
      createdAtDesc: "最近添加优先",
      rentAsc: "租金从低到高",
      rentDesc: "租金从高到低",
      commuteAsc: "通勤时间最短",
      scoreDesc: "参考评分从高到低",
    },
    empty: {
      title: "没有匹配的房源",
      description: "可以尝试切换筛选条件，或在详情页更新房源状态。",
    },
  },

  listingCard: {
    fields: {
      rent: "租金",
      area: "面积",
      layout: "户型",
      commute: "L1 通勤",
      lifeCircle: "L1 生活圈",
      referenceScore: "L2 参考评分",
    },
    referenceScoreNote:
      "参考评分仅用于辅助比较，不代表最终推荐，也不替用户做决定。",
    actions: {
      viewDetails: "查看详情",
    },
  },

  listingDetail: {
    actions: {
      backToPortfolio: "返回候选房源",
    },
  },

  settings: {
    eyebrow: "HouseFolio · Phase 1K",
    title: "设置与本地数据",
    description:
      "导出或清除当前浏览器中保存的 HouseFolio 本地数据。这个页面是 Demo 阶段隐私与数据权利能力的基础。",
  },
} as const;