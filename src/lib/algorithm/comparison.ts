import type { ScoreBreakdown } from "@/lib/algorithm/score";
import type { StoredCommuteResult } from "@/types/commute-result";
import type { Listing } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";
import type {
  ComparisonCommuteSummary,
  ComparisonMissingField,
  ComparisonModel,
  ComparisonRiskFlag,
  ComparisonScoreBreakdown,
  ComparisonSubjectiveSummary,
} from "@/types/comparison";

export type {
  ComparisonCommuteSummary,
  ComparisonMissingField,
  ComparisonModel,
  ComparisonRiskFlag,
  ComparisonScoreBreakdown,
  ComparisonSubjectiveSummary,
} from "@/types/comparison";

export type ComparisonInput = ComparisonModel;

export type BuildComparisonInputOptions = {
  listing: Listing;
  scoreBreakdown?: ScoreBreakdown;
  commuteResults?: StoredCommuteResult[];
  subjectiveRatings?: ListingSubjectiveRatings;
};

function buildSubjectiveSummary(
  subjectiveRatings?: ListingSubjectiveRatings
): ComparisonSubjectiveSummary | undefined {
  if (!subjectiveRatings) {
    return undefined;
  }

  return {
    light: subjectiveRatings.light,
    quiet: subjectiveRatings.quiet,
    decoration: subjectiveRatings.decoration,
  };
}

function buildCommuteSummaries(
  commuteResults: StoredCommuteResult[]
): ComparisonCommuteSummary[] {
  return commuteResults.map((result) => ({
    anchorName: result.anchorName,
    mode: result.mode,
    durationMinutes: result.durationMinutes,
    distanceMeters: result.distanceMeters,
    summary: result.summary,
  }));
}

function buildMissingFields({
  listing,
  commuteResults,
  subjectiveRatings,
}: {
  listing: Listing;
  commuteResults: StoredCommuteResult[];
  subjectiveRatings?: ListingSubjectiveRatings;
}): ComparisonMissingField[] {
  const missingFields: ComparisonMissingField[] = [];

  if (!listing.rent) {
    missingFields.push("rentMonthly");
  }

  if (!listing.area) {
    missingFields.push("areaSqm");
  }

  if (!listing.layout) {
    missingFields.push("layout");
  }

  if (!listing.district) {
    missingFields.push("district");
  }

  if (!listing.addressHint) {
    missingFields.push("areaLabel");
  }

  if (!listing.commuteMinutes && commuteResults.length === 0) {
    missingFields.push("commuteMinutes");
  }

  if (!listing.compositeScore) {
    missingFields.push("referenceScore");
  }

  if (!subjectiveRatings) {
    missingFields.push("subjectiveSummary");
  }

  return missingFields;
}

function buildRiskFlags({
  listing,
  commuteResults,
  subjectiveRatings,
}: {
  listing: Listing;
  commuteResults: StoredCommuteResult[];
  subjectiveRatings?: ListingSubjectiveRatings;
}): ComparisonRiskFlag[] {
  const riskFlags: ComparisonRiskFlag[] = [];

  if (!listing.addressHint) {
    riskFlags.push("missingLocation");
  }

  if (!listing.commuteMinutes && commuteResults.length === 0) {
    riskFlags.push("missingCommute");
  }

  if (!subjectiveRatings) {
    riskFlags.push("missingSubjectiveRating");
  }

  return riskFlags;
}

function toComparisonScoreBreakdown(
  scoreBreakdown?: ScoreBreakdown
): ComparisonScoreBreakdown | undefined {
  return scoreBreakdown as ComparisonScoreBreakdown | undefined;
}

export function buildComparisonInput({
  listing,
  scoreBreakdown,
  commuteResults = [],
  subjectiveRatings,
}: BuildComparisonInputOptions): ComparisonInput {
  return {
    listingId: listing.id,
    title: listing.title,

    rentMonthly: listing.rent,
    areaSqm: listing.area,
    layout: listing.layout,
    district: listing.district,
    areaLabel: listing.addressHint ? "已填写地址线索" : undefined,
    status: listing.status,
    sourcePlatform: listing.sourcePlatform,
    sourceUrl: listing.sourceUrl,

    commuteMinutes: listing.commuteMinutes,
    commuteSource: listing.commuteSource,
    commuteSummaries: buildCommuteSummaries(commuteResults),
    lifeCircleScore: listing.lifeCircleScore,

    referenceScore: listing.compositeScore,
    scoreBreakdown: toComparisonScoreBreakdown(scoreBreakdown),

    subjectiveSummary: buildSubjectiveSummary(subjectiveRatings),

    strengths: [],
    weaknesses: [],
    neutralFacts: [],
    missingFields: buildMissingFields({
      listing,
      commuteResults,
      subjectiveRatings,
    }),
    riskFlags: buildRiskFlags({
      listing,
      commuteResults,
      subjectiveRatings,
    }),
  };
}

export function buildComparisonInputs(
  options: BuildComparisonInputOptions[]
): ComparisonInput[] {
  return options.map((item) => buildComparisonInput(item));
}