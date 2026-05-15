import type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

export type CompareExplanationPromptRole = "system" | "user";

export type CompareExplanationPromptMessage = {
  role: CompareExplanationPromptRole;
  content: string;
};

export type CompareExplanationPromptOutputShape = {
  [Key in keyof CompareExplanationOutput]: "string" | "string[]";
};

export type CompareExplanationPromptPayload = {
  locale: CompareExplanationInput["locale"];
  generatedAt: string;
  listingCount: number;
  messages: CompareExplanationPromptMessage[];
  expectedOutputShape: CompareExplanationPromptOutputShape;
  safetyRules: string[];
};

const EXPECTED_OUTPUT_SHAPE: CompareExplanationPromptOutputShape = {
  summary: "string",
  tradeoffs: "string[]",
  commuteNotes: "string[]",
  riskExplanations: "string[]",
  missingFieldNotes: "string[]",
  checklist: "string[]",
  disclaimer: "string",
};

const SAFETY_RULES = [
  "只解释已提供的 L1/L2 脱敏结构化对比数据。",
  "不要为房源重新打分、排序、筛选或做最终选择。",
  "不要声称验证了房源真实性或安全性。",
  "不要使用“最佳房源”“系统推荐”“推荐分”“替你决定”等措辞。",
  "信息不足时必须说明不确定性，并提示用户继续核实。",
  "输出必须保持参考说明性质，不代表最终推荐。",
];

function formatNumber(value: number | undefined, suffix = ""): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value}${suffix}`
    : "待补充";
}

function formatText(value: string | undefined): string {
  return value && value.trim().length > 0 ? value : "待补充";
}

function formatStringList(values: string[]): string {
  return values.length > 0 ? values.join("、") : "暂无";
}

function formatScoreSummary(
  listing: CompareExplanationListingInput,
): string {
  const score = listing.scoreSummary;

  if (!score) {
    return "待补充";
  }

  return [
    `通勤 ${formatNumber(score.commute)}`,
    `租金 ${formatNumber(score.rent)}`,
    `生活圈 ${formatNumber(score.lifeCircle)}`,
    `主观 ${formatNumber(score.subjective)}`,
  ].join("；");
}

function formatSubjectiveSummary(
  listing: CompareExplanationListingInput,
): string {
  const subjective = listing.subjectiveSummary;

  if (!subjective) {
    return "待补充";
  }

  return [
    `采光 ${formatNumber(subjective.light)}`,
    `安静 ${formatNumber(subjective.quiet)}`,
    `装修 ${formatNumber(subjective.decoration)}`,
  ].join("；");
}

function buildListingBlock(
  listing: CompareExplanationListingInput,
  index: number,
): string {
  return [
    `房源 ${index + 1}：${listing.displayTitle}`,
    `- 月租：${formatNumber(listing.rentMonthly, " 元/月")}`,
    `- 面积：${formatNumber(listing.areaSqm, " 平米")}`,
    `- 户型：${formatText(listing.layout)}`,
    `- 区域：${formatText(listing.district || listing.areaLabel)}`,
    `- 状态：${formatText(listing.status)}`,
    `- 通勤：${formatNumber(listing.commuteMinutes, " 分钟")}`,
    `- 通勤来源：${formatText(listing.commuteSource)}`,
    `- 生活圈参考分：${formatNumber(listing.lifeCircleScore)}`,
    `- L2 参考分：${formatNumber(listing.referenceScore)}`,
    `- L2 拆解：${formatScoreSummary(listing)}`,
    `- 主观摘要：${formatSubjectiveSummary(listing)}`,
    `- 优势信号：${formatStringList(listing.strengths)}`,
    `- 劣势信号：${formatStringList(listing.weaknesses)}`,
    `- 中性事实：${formatStringList(listing.neutralFacts)}`,
    `- 待补充字段：${listing.missingFields.length > 0 ? listing.missingFields.join("、") : "暂无"}`,
    `- 风险信号：${listing.riskFlags.length > 0 ? listing.riskFlags.join("、") : "暂无"}`,
    `- 是否有笔记：${listing.hasNotes ? "是" : "否"}`,
    `- 是否有本机照片：${listing.hasPhotos ? "是" : "否"}`,
    `- 本机照片数量：${formatNumber(listing.photoCount)}`,
  ].join("\n");
}

function buildSystemMessage(): string {
  return [
    "你是 HouseFolio 的 L3 AI 辅助解释层。",
    "你的任务是把 L1/L2 已有的脱敏结构化对比结果解释成用户能理解的中文参考说明。",
    "你只能解释、总结、提示核实事项，不能重新打分、排序、筛选或替用户决定。",
    "你不能声称房源真实、安全、可靠，也不能替用户承担最终租房判断。",
    "你必须使用条件化表达，例如“如果你更重视通勤”“如果你更重视面积”。",
    "你必须在信息不足时说明不确定性。",
    "输出应映射到 CompareExplanationOutput：summary、tradeoffs、commuteNotes、riskExplanations、missingFieldNotes、checklist、disclaimer。",
  ].join("\n");
}

function buildUserMessage(input: CompareExplanationInput): string {
  return [
    `语言：${input.locale}`,
    `生成时间：${input.generatedAt}`,
    `房源数量：${input.listings.length}`,
    "",
    "以下是已经脱敏的结构化对比数据：",
    "",
    input.listings.map((listing, index) => buildListingBlock(listing, index)).join("\n\n"),
    "",
    "请基于以上数据生成中文 AI 辅助解释。",
    "请保持参考说明性质。",
    "请输出概览、取舍说明、通勤提示、风险信号解释、待补充字段说明、下一步核实清单和免责声明。",
    "不要使用“最佳房源”“系统推荐”“推荐分”“替你决定”“真房源”“避坑保真”“一定安全”等措辞。",
  ].join("\n");
}

function assertSupportedInput(input: CompareExplanationInput): void {
  if (!Array.isArray(input.listings) || input.listings.length < 2) {
    throw new Error("Prompt builder requires at least two listings.");
  }

  if (input.listings.length > 4) {
    throw new Error("Prompt builder supports at most four listings.");
  }
}

export function buildCompareExplanationPrompt(
  input: CompareExplanationInput,
): CompareExplanationPromptPayload {
  assertSupportedInput(input);

  return {
    locale: input.locale,
    generatedAt: input.generatedAt,
    listingCount: input.listings.length,
    messages: [
      {
        role: "system",
        content: buildSystemMessage(),
      },
      {
        role: "user",
        content: buildUserMessage(input),
      },
    ],
    expectedOutputShape: EXPECTED_OUTPUT_SHAPE,
    safetyRules: [...SAFETY_RULES],
  };
}