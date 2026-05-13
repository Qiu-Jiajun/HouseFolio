export type CompareExplanationLocale = "zh-CN";

export type CompareExplanationCommuteSource = "listing" | "cachedTransit";

export type CompareExplanationMissingField =
  | "rentMonthly"
  | "areaSqm"
  | "layout"
  | "district"
  | "areaLabel"
  | "commuteMinutes"
  | "referenceScore"
  | "subjectiveSummary";

export type CompareExplanationRiskFlag =
  | "missingLocation"
  | "missingCommute"
  | "missingSubjectiveRating"
  | "highRent"
  | "lowArea"
  | "longCommute";

export type CompareExplanationScoreSummary = {
  commute?: number;
  rent?: number;
  lifeCircle?: number;
  subjective?: number;
};

export type CompareExplanationSubjectiveSummary = {
  light?: number;
  quiet?: number;
  decoration?: number;
};

export type CompareExplanationListingInput = {
  listingId: string;
  displayTitle: string;
  rentMonthly?: number;
  areaSqm?: number;
  layout?: string;
  district?: string;
  areaLabel?: string;
  status?: string;
  commuteMinutes?: number;
  commuteSource?: CompareExplanationCommuteSource;
  lifeCircleScore?: number;
  referenceScore?: number;
  scoreSummary?: CompareExplanationScoreSummary;
  subjectiveSummary?: CompareExplanationSubjectiveSummary;
  strengths: string[];
  weaknesses: string[];
  neutralFacts: string[];
  missingFields: CompareExplanationMissingField[];
  riskFlags: CompareExplanationRiskFlag[];
  hasNotes?: boolean;
  hasPhotos?: boolean;
  photoCount?: number;
};

export type CompareExplanationInput = {
  locale: CompareExplanationLocale;
  generatedAt: string;
  listings: CompareExplanationListingInput[];
};

export type CompareExplanationOutput = {
  summary: string;
  tradeoffs: string[];
  commuteNotes: string[];
  riskExplanations: string[];
  missingFieldNotes: string[];
  checklist: string[];
  disclaimer: string;
};