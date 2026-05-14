import type {
  ComparisonInput,
  ComparisonScoreBreakdown,
} from "@/lib/algorithm/comparison";
import type { ComparisonSignal } from "@/types/comparison";
import type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationScoreSummary,
} from "@/types/ai-compare-explanation";

const COMPARE_EXPLANATION_LOCALE = "zh-CN" as const;

function getNumericBreakdownValue(
  scoreBreakdown: ComparisonScoreBreakdown | undefined,
  key: string,
): number | undefined {
  if (!scoreBreakdown) {
    return undefined;
  }

  const value = scoreBreakdown[key];

  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  return value;
}

function buildScoreSummary(
  scoreBreakdown: ComparisonScoreBreakdown | undefined,
): CompareExplanationScoreSummary | undefined {
  const summary: CompareExplanationScoreSummary = {
    commute: getNumericBreakdownValue(scoreBreakdown, "commuteScore"),
    rent: getNumericBreakdownValue(scoreBreakdown, "rentScore"),
    lifeCircle: getNumericBreakdownValue(scoreBreakdown, "lifeCircleScore"),
    subjective: getNumericBreakdownValue(scoreBreakdown, "subjectiveScore"),
  };

  const hasAnyScore = Object.values(summary).some(
    (value) => typeof value === "number",
  );

  return hasAnyScore ? summary : undefined;
}

function signalToText(signal: ComparisonSignal): string {
  return signal.label || signal.code;
}

function mapSignals(signals: ComparisonSignal[]): string[] {
  return signals.map((signal) => signalToText(signal));
}

export function buildCompareExplanationListingInput(
  model: ComparisonInput,
): CompareExplanationListingInput {
  return {
    listingId: model.listingId,
    displayTitle: model.title,

    rentMonthly: model.rentMonthly,
    areaSqm: model.areaSqm,
    layout: model.layout,
    district: model.district,
    areaLabel: model.areaLabel,
    status: model.status,

    commuteMinutes: model.commuteMinutes,
    commuteSource: model.commuteSource,
    lifeCircleScore: model.lifeCircleScore,

    referenceScore: model.referenceScore,
    scoreSummary: buildScoreSummary(model.scoreBreakdown),
    subjectiveSummary: model.subjectiveSummary,

    strengths: mapSignals(model.strengths),
    weaknesses: mapSignals(model.weaknesses),
    neutralFacts: mapSignals(model.neutralFacts),

    missingFields: [...model.missingFields],
    riskFlags: [...model.riskFlags],

    hasNotes: model.hasNotes,
    hasPhotos: model.hasPhotos,
    photoCount: model.photoCount,
  };
}

export function buildCompareExplanationInput(
  models: ComparisonInput[],
  generatedAt = new Date().toISOString(),
): CompareExplanationInput {
  return {
    locale: COMPARE_EXPLANATION_LOCALE,
    generatedAt,
    listings: models.map((model) => buildCompareExplanationListingInput(model)),
  };
}