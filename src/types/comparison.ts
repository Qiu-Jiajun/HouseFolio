import type { StoredCommuteResult } from "@/types/commute-result";
import type { ListingCommuteSource, ListingStatus } from "@/types/listing";

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

export type ComparisonScoreBreakdown = Readonly<
  Record<string, number | string | boolean | null | undefined>
>;

export type ComparisonSignalLevel = "info" | "positive" | "warning";

export type ComparisonSignal = {
  code: string;
  label: string;
  level: ComparisonSignalLevel;
};

export type ComparisonMissingField =
  | "rentMonthly"
  | "areaSqm"
  | "layout"
  | "district"
  | "areaLabel"
  | "commuteMinutes"
  | "referenceScore"
  | "subjectiveSummary";

export type ComparisonRiskFlag =
  | "missingLocation"
  | "missingCommute"
  | "missingSubjectiveRating"
  | "highRent"
  | "lowArea"
  | "longCommute";

export type ComparisonModel = {
  listingId: string;
  title: string;

  rentMonthly: number;
  areaSqm: number;
  layout: string;
  district: string;
  areaLabel?: string;
  status: ListingStatus;
  sourcePlatform?: string;
  sourceUrl?: string;

  commuteMinutes?: number;
  commuteSource?: ListingCommuteSource;
  commuteSummaries: ComparisonCommuteSummary[];
  lifeCircleScore?: number;

  referenceScore?: number;
  scoreBreakdown?: ComparisonScoreBreakdown;

  subjectiveSummary?: ComparisonSubjectiveSummary;

  hasNotes?: boolean;
  hasPhotos?: boolean;
  photoCount?: number;

  strengths: ComparisonSignal[];
  weaknesses: ComparisonSignal[];
  neutralFacts: ComparisonSignal[];
  missingFields: ComparisonMissingField[];
  riskFlags: ComparisonRiskFlag[];
};