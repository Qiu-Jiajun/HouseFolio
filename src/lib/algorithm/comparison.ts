import type { ScoreBreakdown } from "@/lib/algorithm/score";
import type { StoredCommuteResult } from "@/types/commute-result";
import type {
  Listing,
  ListingCommuteSource,
  ListingStatus,
} from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";

export type ComparisonCommuteSummary = {
  anchorName: string;
  mode: StoredCommuteResult["mode"];
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
};

export type ComparisonSubjectiveSummary = {
  light?: number;
  quiet?: number;
  decoration?: number;
};

export type ComparisonInput = {
  listingId: string;
  title: string;
  rent: number;
  area: number;
  layout: string;
  district: string;
  addressHint: string;
  status: ListingStatus;
  commuteMinutes?: number;
  commuteSource?: ListingCommuteSource;
  lifeCircleScore?: number;
  compositeScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  subjectiveSummary?: ComparisonSubjectiveSummary;
  commuteSummaries: ComparisonCommuteSummary[];
};

export type BuildComparisonInputOptions = {
  listing: Listing;
  scoreBreakdown?: ScoreBreakdown;
  commuteResults?: StoredCommuteResult[];
  subjectiveRatings?: ListingSubjectiveRatings;
};

export function buildComparisonInput({
  listing,
  scoreBreakdown,
  commuteResults = [],
  subjectiveRatings,
}: BuildComparisonInputOptions): ComparisonInput {
  return {
    listingId: listing.id,
    title: listing.title,
    rent: listing.rent,
    area: listing.area,
    layout: listing.layout,
    district: listing.district,
    addressHint: listing.addressHint,
    status: listing.status,
    commuteMinutes: listing.commuteMinutes,
    commuteSource: listing.commuteSource,
    lifeCircleScore: listing.lifeCircleScore,
    compositeScore: listing.compositeScore,
    scoreBreakdown,
    subjectiveSummary: subjectiveRatings
      ? {
          light: subjectiveRatings.light,
          quiet: subjectiveRatings.quiet,
          decoration: subjectiveRatings.decoration,
        }
      : undefined,
    commuteSummaries: commuteResults.map((result) => ({
      anchorName: result.anchorName,
      mode: result.mode,
      durationMinutes: result.durationMinutes,
      distanceMeters: result.distanceMeters,
      summary: result.summary,
    })),
  };
}

export function buildComparisonInputs(
  options: BuildComparisonInputOptions[]
): ComparisonInput[] {
  return options.map((item) => buildComparisonInput(item));
}