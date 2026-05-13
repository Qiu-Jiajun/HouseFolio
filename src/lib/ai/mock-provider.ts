import type { CompareExplanationProvider } from "@/lib/ai/provider";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

function countMissingFields(input: CompareExplanationInput): number {
  return input.listings.reduce(
    (total, listing) => total + listing.missingFields.length,
    0,
  );
}

function countRiskFlags(input: CompareExplanationInput): number {
  return input.listings.reduce(
    (total, listing) => total + listing.riskFlags.length,
    0,
  );
}

function hasAnyCommuteData(input: CompareExplanationInput): boolean {
  return input.listings.some(
    (listing) => typeof listing.commuteMinutes === "number",
  );
}

function hasAnyPhotoSummary(input: CompareExplanationInput): boolean {
  return input.listings.some(
    (listing) => listing.hasPhotos === true || (listing.photoCount ?? 0) > 0,
  );
}

function hasAnySubjectiveSummary(input: CompareExplanationInput): boolean {
  return input.listings.some((listing) => Boolean(listing.subjectiveSummary));
}

function buildTradeoffs(input: CompareExplanationInput): string[] {
  const listingCount = input.listings.length;

  return [
    `当前本地模拟解释覆盖 ${listingCount} 套已选房源，重点帮助你理解租金、面积、通勤和资料完整度之间的取舍。`,
    "参考评分只能作为辅助比较入口，不能替代你的硬性条件、实地看房体验和合同核实。",
    "如果某套房源在通勤上更有优势，仍需要结合采光、噪音、维修责任和入住前费用一起判断。",
  ];
}

function buildCommuteNotes(input: CompareExplanationInput): string[] {
  if (!hasAnyCommuteData(input)) {
    return [
      "当前已选房源缺少可用通勤摘要，建议先补充通勤锚点或重新计算公共交通参考通勤。",
    ];
  }

  return [
    "当前已选房源中存在通勤摘要。通勤时间会长期影响日常稳定性，但仍应结合居住体验和预算一起比较。",
  ];
}

function buildRiskExplanations(input: CompareExplanationInput): string[] {
  const riskFlagCount = countRiskFlags(input);

  if (riskFlagCount === 0) {
    return [
      "当前没有明显的结构化风险信号，但这不代表房源已经被验证，仍需要你自行核实房源、合同和交易信息。",
    ];
  }

  return [
    `当前共有 ${riskFlagCount} 个需要人工确认的结构化信号。它们只表示需要进一步核实，不代表房源真假判断。`,
  ];
}

function buildMissingFieldNotes(input: CompareExplanationInput): string[] {
  const missingFieldCount = countMissingFields(input);

  if (missingFieldCount === 0) {
    return [
      "当前结构化字段相对完整，可以继续结合实地看房体验和个人硬性条件判断。",
    ];
  }

  return [
    `当前共有 ${missingFieldCount} 个待补充字段。资料不完整会降低比较置信度，建议先补充关键字段再做最终判断。`,
  ];
}

function buildChecklist(input: CompareExplanationInput): string[] {
  const checklist = [
    "核实实际通勤体验是否稳定。",
    "确认夜间噪音、采光、通风和电梯等待时间。",
    "检查厨房、卫生间和基础设施是否满足日常使用。",
    "确认押金、维修责任、入住前费用和合同条款。",
  ];

  if (!hasAnyPhotoSummary(input)) {
    checklist.push("如条件允许，补充本机看房照片，帮助后续回看现场细节。");
  }

  if (!hasAnySubjectiveSummary(input)) {
    checklist.push("补充采光、安静和装修等主观评分，提升比较置信度。");
  }

  return checklist;
}

export const mockCompareExplanationProvider: CompareExplanationProvider = {
  name: "mock",

  async generateCompareExplanation(
    input: CompareExplanationInput,
  ): Promise<CompareExplanationOutput> {
    return {
      summary: `这是基于 ${input.listings.length} 套房源结构化比较信息生成的本地模拟辅助解释，用于验证未来 L3 说明流程，不代表最终推荐。`,
      tradeoffs: buildTradeoffs(input),
      commuteNotes: buildCommuteNotes(input),
      riskExplanations: buildRiskExplanations(input),
      missingFieldNotes: buildMissingFieldNotes(input),
      checklist: buildChecklist(input),
      disclaimer:
        "本地模拟解释仅用于辅助比较流程验证，不构成房源推荐、真实性判断或租赁建议。请自行核实房源、合同和交易信息。",
    };
  },
};
