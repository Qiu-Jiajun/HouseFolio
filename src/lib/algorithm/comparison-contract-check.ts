import type {
  BuildComparisonInputOptions,
  ComparisonInput,
  ComparisonModel,
} from "@/lib/algorithm/comparison";
import {
  buildComparisonInput,
  buildComparisonInputs,
} from "@/lib/algorithm/comparison";
import type {
  ComparisonCommuteSummary,
  ComparisonMissingField,
  ComparisonRiskFlag,
  ComparisonSignal,
  ComparisonSubjectiveSummary,
} from "@/types/comparison";

type ForbiddenComparisonModelKeys =
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
  | "requestUrl"
  | "url"
  | "polyline"
  | "steps"
  | "apiKey"
  | "key"
  | "amapKey"
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
  | "fullNote"
  | "noteText"
  | "rawNote"
  | "phone"
  | "wechat"
  | "idCard"
  | "doorNumber"
  | "roomNumber"
  | "buildingNumber"
  | "unitNumber";

type AllowedComparisonModelKeys =
  | "listingId"
  | "title"
  | "rentMonthly"
  | "areaSqm"
  | "layout"
  | "district"
  | "areaLabel"
  | "status"
  | "sourcePlatform"
  | "sourceUrl"
  | "commuteMinutes"
  | "commuteSource"
  | "commuteSummaries"
  | "lifeCircleScore"
  | "referenceScore"
  | "scoreBreakdown"
  | "subjectiveSummary"
  | "hasNotes"
  | "hasPhotos"
  | "photoCount"
  | "strengths"
  | "weaknesses"
  | "neutralFacts"
  | "missingFields"
  | "riskFlags";

type AssertTrue<T extends true> = T;

type AssertNoForbiddenKeys<T> =
  Extract<keyof T, ForbiddenComparisonModelKeys> extends never ? true : never;

type AssertOnlyAllowedKeys<T> =
  Exclude<keyof T, AllowedComparisonModelKeys> extends never ? true : never;

type AssertAllAllowedKeysAreKnown<T> =
  Exclude<AllowedComparisonModelKeys, keyof T> extends never ? true : never;

type AssertSameShape<A, B> = A extends B ? (B extends A ? true : never) : never;

const comparisonModelHasNoForbiddenKeys: AssertNoForbiddenKeys<ComparisonModel> =
  true;

const comparisonModelUsesOnlyAllowedKeys: AssertOnlyAllowedKeys<ComparisonModel> =
  true;

const comparisonModelContainsAllAllowedKeys: AssertAllAllowedKeysAreKnown<ComparisonModel> =
  true;

const comparisonInputMatchesComparisonModel: AssertSameShape<
  ComparisonInput,
  ComparisonModel
> = true;

const commuteSummaryHasNoForbiddenKeys: AssertNoForbiddenKeys<ComparisonCommuteSummary> =
  true;

const subjectiveSummaryHasNoForbiddenKeys: AssertNoForbiddenKeys<ComparisonSubjectiveSummary> =
  true;

const signalHasNoForbiddenKeys: AssertNoForbiddenKeys<ComparisonSignal> = true;

const allMissingFields = [
  "rentMonthly",
  "areaSqm",
  "layout",
  "district",
  "areaLabel",
  "commuteMinutes",
  "referenceScore",
  "subjectiveSummary",
] as const satisfies readonly ComparisonMissingField[];

type MissingFieldCoverage = AssertTrue<
  Exclude<ComparisonMissingField, (typeof allMissingFields)[number]> extends never
    ? true
    : false
>;

type MissingFieldNoExtra = AssertTrue<
  Exclude<(typeof allMissingFields)[number], ComparisonMissingField> extends never
    ? true
    : false
>;

const missingFieldCoverage: MissingFieldCoverage = true;
const missingFieldNoExtra: MissingFieldNoExtra = true;

const allRiskFlags = [
  "missingLocation",
  "missingCommute",
  "missingSubjectiveRating",
  "highRent",
  "lowArea",
  "longCommute",
] as const satisfies readonly ComparisonRiskFlag[];

type RiskFlagCoverage = AssertTrue<
  Exclude<ComparisonRiskFlag, (typeof allRiskFlags)[number]> extends never
    ? true
    : false
>;

type RiskFlagNoExtra = AssertTrue<
  Exclude<(typeof allRiskFlags)[number], ComparisonRiskFlag> extends never
    ? true
    : false
>;

const riskFlagCoverage: RiskFlagCoverage = true;
const riskFlagNoExtra: RiskFlagNoExtra = true;

const mockOptions: BuildComparisonInputOptions = {
  listing: {
    id: "listing-test",
    title: "Test listing",
    rent: 6500,
    area: 48,
    layout: "One bedroom",
    district: "Haidian",
    addressHint: "Near Wudaokou subway station",
    sourcePlatform: "manual",
    sourceUrl: "https://example.com/listing",
    status: "watching",
    createdAt: "2026-05-04",
    commuteMinutes: 25,
    commuteSource: "cachedTransit",
    lifeCircleScore: 7.8,
    compositeScore: 8.2,
  },
  commuteResults: [
    {
      id: "commute-test",
      listingId: "listing-test",
      anchorId: "anchor-test",
      anchorName: "School",
      mode: "transit",
      provider: "mock",
      isMock: true,
      durationMinutes: 25,
      distanceMeters: 6200,
      summary: "Transit takes about 25 minutes.",
      calculatedAt: "2026-05-04T00:00:00.000Z",
    },
  ],
  subjectiveRatings: {
    listingId: "listing-test",
    light: 4,
    quiet: 3,
    decoration: 5,
    updatedAt: "2026-05-04T00:00:00.000Z",
  },
};

const singleInput: ComparisonInput = buildComparisonInput(mockOptions);
const singleModel: ComparisonModel = buildComparisonInput(mockOptions);
const multipleInputs: ComparisonInput[] = buildComparisonInputs([mockOptions]);
const multipleModels: ComparisonModel[] = buildComparisonInputs([mockOptions]);

void comparisonModelHasNoForbiddenKeys;
void comparisonModelUsesOnlyAllowedKeys;
void comparisonModelContainsAllAllowedKeys;
void comparisonInputMatchesComparisonModel;
void commuteSummaryHasNoForbiddenKeys;
void subjectiveSummaryHasNoForbiddenKeys;
void signalHasNoForbiddenKeys;
void missingFieldCoverage;
void missingFieldNoExtra;
void riskFlagCoverage;
void riskFlagNoExtra;
void singleInput;
void singleModel;
void multipleInputs;
void multipleModels;