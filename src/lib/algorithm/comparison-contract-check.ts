import type {
  BuildComparisonInputOptions,
  ComparisonInput,
  ComparisonModel,
} from "@/lib/algorithm/comparison";
import {
  buildComparisonInput,
  buildComparisonInputs,
} from "@/lib/algorithm/comparison";

type ForbiddenComparisonModelKeys =
  | "coordinate"
  | "coordinates"
  | "origin"
  | "destination"
  | "raw"
  | "rawResponse"
  | "requestUrl"
  | "url"
  | "polyline"
  | "steps"
  | "apiKey"
  | "key"
  | "prompt"
  | "aiPrompt"
  | "aiResponse"
  | "photoBlob"
  | "videoBlob"
  | "blob"
  | "objectUrl"
  | "imageBase64"
  | "fullNote"
  | "noteText"
  | "doorNumber"
  | "roomNumber"
  | "buildingNumber";

type AssertNoForbiddenKeys<T> =
  Extract<keyof T, ForbiddenComparisonModelKeys> extends never ? true : never;

const comparisonModelHasNoForbiddenKeys: AssertNoForbiddenKeys<ComparisonModel> =
  true;

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
const multipleInputs: ComparisonInput[] = buildComparisonInputs([mockOptions]);

void comparisonModelHasNoForbiddenKeys;
void singleInput;
void multipleInputs;