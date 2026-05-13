import type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
  CompareExplanationScoreSummary,
  CompareExplanationSubjectiveSummary,
} from "@/types/ai-compare-explanation";

type AssertTrue<T extends true> = T;

type IsNever<T> = [T] extends [never] ? true : false;

type ForbiddenAiCompareExplanationKeys =
  | "note"
  | "notes"
  | "rawNote"
  | "fullNote"
  | "noteText"
  | "chatRecord"
  | "chatRecords"
  | "landlordName"
  | "agentName"
  | "phone"
  | "wechat"
  | "idCard"
  | "address"
  | "fullAddress"
  | "preciseAddress"
  | "workAddress"
  | "schoolAddress"
  | "doorNumber"
  | "roomNumber"
  | "buildingNumber"
  | "unitNumber"
  | "coordinate"
  | "coordinates"
  | "latitude"
  | "longitude"
  | "lng"
  | "lat"
  | "origin"
  | "destination"
  | "raw"
  | "rawData"
  | "rawJson"
  | "rawResponse"
  | "amapRaw"
  | "poiRaw"
  | "routeRaw"
  | "polyline"
  | "steps"
  | "requestUrl"
  | "apiKey"
  | "key"
  | "prompt"
  | "aiPrompt"
  | "aiResponse"
  | "llmResponse"
  | "photoBlob"
  | "videoBlob"
  | "blob"
  | "objectUrl"
  | "imageBase64"
  | "thumbnailBase64"
  | "exif"
  | "thirdPartyBody"
  | "thirdPartyImage"
  | "thirdPartyScreenshot"
  | "bestListingId"
  | "ranking"
  | "recommendationScore"
  | "finalDecision"
  | "shouldChoose"
  | "verified"
  | "authenticityVerdict";

type AllowedCompareExplanationListingInputKeys =
  | "listingId"
  | "displayTitle"
  | "rentMonthly"
  | "areaSqm"
  | "layout"
  | "district"
  | "areaLabel"
  | "status"
  | "commuteMinutes"
  | "commuteSource"
  | "lifeCircleScore"
  | "referenceScore"
  | "scoreSummary"
  | "subjectiveSummary"
  | "strengths"
  | "weaknesses"
  | "neutralFacts"
  | "missingFields"
  | "riskFlags"
  | "hasNotes"
  | "hasPhotos"
  | "photoCount";

type AllowedCompareExplanationInputKeys =
  | "locale"
  | "generatedAt"
  | "listings";

type AllowedCompareExplanationOutputKeys =
  | "summary"
  | "tradeoffs"
  | "commuteNotes"
  | "riskExplanations"
  | "missingFieldNotes"
  | "checklist"
  | "disclaimer";

type AllowedScoreSummaryKeys = "commute" | "rent" | "lifeCircle" | "subjective";

type AllowedSubjectiveSummaryKeys = "light" | "quiet" | "decoration";

type NoForbiddenKeys<T> = IsNever<Extract<keyof T, ForbiddenAiCompareExplanationKeys>>;

type ExactKeys<T, AllowedKeys extends PropertyKey> = IsNever<
  Exclude<keyof T, AllowedKeys>
>;

type _InputHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationInput>
>;

type _ListingInputHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationListingInput>
>;

type _OutputHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationOutput>
>;

type _ScoreSummaryHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationScoreSummary>
>;

type _SubjectiveSummaryHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationSubjectiveSummary>
>;

type _InputKeysAreAllowlisted = AssertTrue<
  ExactKeys<CompareExplanationInput, AllowedCompareExplanationInputKeys>
>;

type _ListingInputKeysAreAllowlisted = AssertTrue<
  ExactKeys<
    CompareExplanationListingInput,
    AllowedCompareExplanationListingInputKeys
  >
>;

type _OutputKeysAreAllowlisted = AssertTrue<
  ExactKeys<CompareExplanationOutput, AllowedCompareExplanationOutputKeys>
>;

type _ScoreSummaryKeysAreAllowlisted = AssertTrue<
  ExactKeys<CompareExplanationScoreSummary, AllowedScoreSummaryKeys>
>;

type _SubjectiveSummaryKeysAreAllowlisted = AssertTrue<
  ExactKeys<CompareExplanationSubjectiveSummary, AllowedSubjectiveSummaryKeys>
>;