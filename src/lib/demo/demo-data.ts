export type DemoCommuteMode = "transit";

export type DemoListingStatus = "watching" | "visited" | "shortlisted";

export type DemoListing = {
  id: string;
  title: string;
  city: string;
  district: string;
  areaLabel: string;
  rentMonthly: number;
  areaSqm: number;
  layout: string;
  addressHint: string;
  status: DemoListingStatus;
  sourceLabel: string;
  sourceUrlLabel: string;
  commuteMinutes: number;
  commuteSourceLabel: string;
  lifeCircleScore: number;
  referenceScore: number;
  referenceScoreNote: string;
  primaryStrength: string;
  primaryWeakness: string;
  photoPlaceholderLabel: string;
};

export type DemoWorkLocation = {
  id: string;
  name: string;
  addressHint: string;
  anchorType: "work" | "study";
  priorityLabel: string;
};

export type DemoCommuteSummary = {
  listingId: string;
  anchorId: string;
  anchorName: string;
  mode: DemoCommuteMode;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
  calculatedAt: string;
  provider: "demo";
  isMock: true;
};

export type DemoScoreBreakdown = {
  listingId: string;
  total: number;
  rentContribution: number;
  areaContribution: number;
  commuteContribution: number;
  lifeCircleContribution: number;
  subjectiveContribution: number;
  strengths: string[];
  weaknesses: string[];
  disclaimer: string;
};

export type DemoAiSummary = {
  listingId: string;
  summary: string;
  checklist: string[];
  tradeoffs: string[];
  riskNotes: string[];
  disclaimer: string;
};

export type DemoModeMeta = {
  isDemo: true;
  version: string;
  source: "fictional";
  disclaimer: string;
};

export const demoModeMeta: DemoModeMeta = {
  isDemo: true,
  version: "phase-3i-3",
  source: "fictional",
  disclaimer:
    "这是 HouseFolio 演示数据。所有房源、通勤锚点、笔记、图片占位和分析文本均为虚构内容，不代表真实房源，不提供租赁建议。",
};

export const demoWorkLocations: DemoWorkLocation[] = [
  {
    id: "demo-anchor-wangjing",
    name: "演示公司 A",
    addressHint: "望京附近",
    anchorType: "work",
    priorityLabel: "主要通勤锚点",
  },
  {
    id: "demo-anchor-wudaokou",
    name: "演示学校 / 公司 B",
    addressHint: "五道口附近",
    anchorType: "study",
    priorityLabel: "共同居住者通勤锚点",
  },
];

export const demoListings: DemoListing[] = [
  {
    id: "demo-listing-a",
    title: "演示房源 A｜通勤更稳",
    city: "北京",
    district: "朝阳",
    areaLabel: "望京南附近",
    rentMonthly: 7600,
    areaSqm: 42,
    layout: "一居室",
    addressHint: "望京南地铁站附近（虚构）",
    status: "shortlisted",
    sourceLabel: "演示数据",
    sourceUrlLabel: "无真实链接",
    commuteMinutes: 24,
    commuteSourceLabel: "演示本地通勤结果",
    lifeCircleScore: 8.6,
    referenceScore: 84,
    referenceScoreNote: "参考评分仅用于辅助比较，不代表最终推荐。",
    primaryStrength: "到主要通勤锚点更稳定，生活圈成熟。",
    primaryWeakness: "租金略高，面积一般。",
    photoPlaceholderLabel: "演示图片占位，不对应真实房源。",
  },
  {
    id: "demo-listing-b",
    title: "演示房源 B｜面积更舒展",
    city: "北京",
    district: "海淀",
    areaLabel: "五道口附近",
    rentMonthly: 7200,
    areaSqm: 55,
    layout: "一居室",
    addressHint: "五道口地铁站附近（虚构）",
    status: "visited",
    sourceLabel: "演示数据",
    sourceUrlLabel: "无真实链接",
    commuteMinutes: 34,
    commuteSourceLabel: "演示本地通勤结果",
    lifeCircleScore: 8.1,
    referenceScore: 80,
    referenceScoreNote: "参考评分仅用于辅助比较，不代表最终推荐。",
    primaryStrength: "面积更大，对共同居住者通勤更友好。",
    primaryWeakness: "到主要工作锚点通勤时间更长。",
    photoPlaceholderLabel: "演示图片占位，不对应真实房源。",
  },
  {
    id: "demo-listing-c",
    title: "演示房源 C｜预算压力较低",
    city: "北京",
    district: "朝阳",
    areaLabel: "酒仙桥附近",
    rentMonthly: 6200,
    areaSqm: 38,
    layout: "开间",
    addressHint: "酒仙桥商圈附近（虚构）",
    status: "watching",
    sourceLabel: "演示数据",
    sourceUrlLabel: "无真实链接",
    commuteMinutes: 42,
    commuteSourceLabel: "演示本地通勤结果",
    lifeCircleScore: 7.2,
    referenceScore: 72,
    referenceScoreNote: "参考评分仅用于辅助比较，不代表最终推荐。",
    primaryStrength: "租金压力较低，预算弹性更好。",
    primaryWeakness: "通勤压力偏高，信息完整度较弱。",
    photoPlaceholderLabel: "演示图片占位，不对应真实房源。",
  },
];

export const demoCommuteSummaries: DemoCommuteSummary[] = [
  {
    listingId: "demo-listing-a",
    anchorId: "demo-anchor-wangjing",
    anchorName: "演示公司 A",
    mode: "transit",
    durationMinutes: 24,
    distanceMeters: 5200,
    summary: "公共交通约 24 分钟，适合作为通勤优先方案。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
  {
    listingId: "demo-listing-a",
    anchorId: "demo-anchor-wudaokou",
    anchorName: "演示学校 / 公司 B",
    mode: "transit",
    durationMinutes: 46,
    distanceMeters: 18200,
    summary: "到第二通勤锚点时间较长，需要共同居住者权衡。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
  {
    listingId: "demo-listing-b",
    anchorId: "demo-anchor-wangjing",
    anchorName: "演示公司 A",
    mode: "transit",
    durationMinutes: 34,
    distanceMeters: 14800,
    summary: "到主要通勤锚点时间中等，稳定性取决于换乘体验。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
  {
    listingId: "demo-listing-b",
    anchorId: "demo-anchor-wudaokou",
    anchorName: "演示学校 / 公司 B",
    mode: "transit",
    durationMinutes: 18,
    distanceMeters: 3600,
    summary: "到第二通勤锚点较近，适合共同居住折中。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
  {
    listingId: "demo-listing-c",
    anchorId: "demo-anchor-wangjing",
    anchorName: "演示公司 A",
    mode: "transit",
    durationMinutes: 42,
    distanceMeters: 11200,
    summary: "通勤时间偏长，适合预算优先但需接受通勤压力的情况。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
  {
    listingId: "demo-listing-c",
    anchorId: "demo-anchor-wudaokou",
    anchorName: "演示学校 / 公司 B",
    mode: "transit",
    durationMinutes: 50,
    distanceMeters: 20600,
    summary: "到第二通勤锚点压力较高，不适合作为双锚点均衡方案。",
    calculatedAt: "2026-05-05T00:00:00.000Z",
    provider: "demo",
    isMock: true,
  },
];

export const demoScoreBreakdowns: DemoScoreBreakdown[] = [
  {
    listingId: "demo-listing-a",
    total: 84,
    rentContribution: 16,
    areaContribution: 13,
    commuteContribution: 24,
    lifeCircleContribution: 18,
    subjectiveContribution: 13,
    strengths: ["主要通勤更稳", "生活圈成熟", "决策信息较完整"],
    weaknesses: ["租金略高", "面积一般"],
    disclaimer: "参考评分仅用于辅助比较，不代表系统推荐或最终决定。",
  },
  {
    listingId: "demo-listing-b",
    total: 80,
    rentContribution: 18,
    areaContribution: 19,
    commuteContribution: 17,
    lifeCircleContribution: 16,
    subjectiveContribution: 10,
    strengths: ["面积更舒展", "第二通勤锚点更友好", "租金相对可控"],
    weaknesses: ["主要通勤时间更长", "需要进一步核实早高峰体验"],
    disclaimer: "参考评分仅用于辅助比较，不代表系统推荐或最终决定。",
  },
  {
    listingId: "demo-listing-c",
    total: 72,
    rentContribution: 23,
    areaContribution: 11,
    commuteContribution: 12,
    lifeCircleContribution: 14,
    subjectiveContribution: 12,
    strengths: ["租金压力较低", "预算弹性更好"],
    weaknesses: ["双锚点通勤压力偏高", "信息完整度较弱", "需要重点核实噪音和楼况"],
    disclaimer: "参考评分仅用于辅助比较，不代表系统推荐或最终决定。",
  },
];

export const demoAiSummaries: DemoAiSummary[] = [
  {
    listingId: "demo-listing-a",
    summary:
      "如果你优先考虑本人主要通勤稳定性，演示房源 A 更容易进入候选。但它不是绝对最优，租金和面积都需要和预算约束一起看。",
    checklist: ["确认早高峰换乘是否拥挤", "核实夜间噪音", "确认实际采光和窗外遮挡"],
    tradeoffs: ["通勤优势明显", "租金压力略高", "面积不占优"],
    riskNotes: ["不要只因通勤短就忽略租金压力。"],
    disclaimer: "这是预生成 AI 辅助分析演示文本，基于虚构数据，仅用于展示产品方向。",
  },
  {
    listingId: "demo-listing-b",
    summary:
      "如果共同居住者的通勤也很重要，演示房源 B 更像折中方案。它的面积优势明显，但到主要工作锚点的通勤需要实际体验。",
    checklist: ["实际走一遍到地铁站的路线", "确认电梯等待时间", "确认厨房和卫生间通风"],
    tradeoffs: ["面积更大", "双人居住更舒展", "主要通勤不如 A 稳"],
    riskNotes: ["不要只看面积，需要核实通勤路径稳定性。"],
    disclaimer: "这是预生成 AI 辅助分析演示文本，基于虚构数据，仅用于展示产品方向。",
  },
  {
    listingId: "demo-listing-c",
    summary:
      "如果预算是硬约束，演示房源 C 可以保留观察。但它的通勤压力和信息完整度都较弱，适合继续核实，不适合直接下决定。",
    checklist: ["确认房源信息是否完整", "重点核实楼道和隔音", "确认通勤是否能长期接受"],
    tradeoffs: ["租金更低", "通勤压力更高", "生活圈和信息完整度偏弱"],
    riskNotes: ["低租金不等于低风险，需要补足看房信息。"],
    disclaimer: "这是预生成 AI 辅助分析演示文本，基于虚构数据，仅用于展示产品方向。",
  },
];

export const demoModeData = {
  meta: demoModeMeta,
  listings: demoListings,
  workLocations: demoWorkLocations,
  commuteSummaries: demoCommuteSummaries,
  scoreBreakdowns: demoScoreBreakdowns,
  aiSummaries: demoAiSummaries,
};