import { NextResponse } from "next/server";

import { generateMockCompareExplanation } from "@/lib/ai";
import type {
  CompareExplanationCommuteSource,
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationMissingField,
  CompareExplanationOutput,
  CompareExplanationRiskFlag,
  CompareExplanationScoreSummary,
  CompareExplanationSubjectiveSummary,
} from "@/types/ai-compare-explanation";

type ApiErrorCode = "invalid_json" | "invalid_input" | "generation_failed";

type ApiErrorResponse = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

type ApiSuccessResponse = {
  ok: true;
  provider: "mock";
  data: CompareExplanationOutput;
};

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type MockCompareExplanationApiRequest = CompareExplanationInput;
export type MockCompareExplanationApiErrorCode = ApiErrorCode;
export type MockCompareExplanationApiErrorResponse = ApiErrorResponse;
export type MockCompareExplanationApiSuccessResponse = ApiSuccessResponse;
export type MockCompareExplanationApiResponse = ApiResponse;

const MIN_LISTINGS = 2;
const MAX_LISTINGS = 4;
const MAX_SHORT_TEXT_LENGTH = 120;
const MAX_TITLE_LENGTH = 80;
const MAX_ARRAY_ITEMS = 8;

const allowedCommuteSources = new Set<CompareExplanationCommuteSource>([
  "listing",
  "cachedTransit",
]);

const allowedMissingFields = new Set<CompareExplanationMissingField>([
  "rentMonthly",
  "areaSqm",
  "layout",
  "district",
  "areaLabel",
  "commuteMinutes",
  "referenceScore",
  "subjectiveSummary",
]);

const allowedRiskFlags = new Set<CompareExplanationRiskFlag>([
  "missingLocation",
  "missingCommute",
  "missingSubjectiveRating",
  "highRent",
  "lowArea",
  "longCommute",
]);

const forbiddenRequestKeys = new Set([
  "address",
  "fullAddress",
  "preciseAddress",
  "preciseAnchor",
  "doorNumber",
  "roomNumber",
  "buildingNumber",
  "unitNumber",
  "latitude",
  "longitude",
  "lng",
  "lat",
  "coordinate",
  "coordinates",
  "origin",
  "destination",
  "raw",
  "rawData",
  "rawJson",
  "rawResponse",
  "requestUrl",
  "url",
  "polyline",
  "steps",
  "apiKey",
  "key",
  "prompt",
  "aiPrompt",
  "aiResponse",
  "llmResponse",
  "photoBlob",
  "videoBlob",
  "blob",
  "objectUrl",
  "imageBase64",
  "thumbnailBase64",
  "fullNote",
  "noteText",
  "phone",
  "phoneNumber",
  "wechat",
  "weChat",
  "idCard",
  "contractText",
  "landlordName",
  "agentName",
]);

function jsonError(
  code: ApiErrorCode,
  message: string,
  status: number,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasForbiddenRequestKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasForbiddenRequestKey);
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(
    ([key, nestedValue]) =>
      forbiddenRequestKeys.has(key) || hasForbiddenRequestKey(nestedValue),
  );
}

function parseRequiredString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function parseOptionalString(
  value: unknown,
  maxLength: number,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return parseRequiredString(value, maxLength);
}

function parseOptionalNumber(
  value: unknown,
  min: number,
  max: number,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (value < min || value > max) {
    return null;
  }

  return value;
}

function parseOptionalEnum<T extends string>(
  value: unknown,
  allowedValues: ReadonlySet<T>,
): T | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  if (!allowedValues.has(value as T)) {
    return null;
  }

  return value as T;
}

function parseStringArray(value: unknown): string[] | null {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.length > MAX_ARRAY_ITEMS) {
    return null;
  }

  const parsed: string[] = [];

  for (const item of value) {
    const text = parseRequiredString(item, MAX_SHORT_TEXT_LENGTH);

    if (text === null) {
      return null;
    }

    parsed.push(text);
  }

  return parsed;
}

function parseEnumArray<T extends string>(
  value: unknown,
  allowedValues: ReadonlySet<T>,
): T[] | null {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.length > MAX_ARRAY_ITEMS) {
    return null;
  }

  const parsed: T[] = [];

  for (const item of value) {
    if (typeof item !== "string" || !allowedValues.has(item as T)) {
      return null;
    }

    parsed.push(item as T);
  }

  return parsed;
}

function parseScoreSummary(
  value: unknown,
): CompareExplanationScoreSummary | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    return null;
  }

  const commute = parseOptionalNumber(value.commute, 0, 100);
  const rent = parseOptionalNumber(value.rent, 0, 100);
  const lifeCircle = parseOptionalNumber(value.lifeCircle, 0, 100);
  const subjective = parseOptionalNumber(value.subjective, 0, 100);

  if (
    commute === null ||
    rent === null ||
    lifeCircle === null ||
    subjective === null
  ) {
    return null;
  }

  return {
    ...(commute === undefined ? {} : { commute }),
    ...(rent === undefined ? {} : { rent }),
    ...(lifeCircle === undefined ? {} : { lifeCircle }),
    ...(subjective === undefined ? {} : { subjective }),
  };
}

function parseSubjectiveSummary(
  value: unknown,
): CompareExplanationSubjectiveSummary | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    return null;
  }

  const light = parseOptionalNumber(value.light, 0, 5);
  const quiet = parseOptionalNumber(value.quiet, 0, 5);
  const decoration = parseOptionalNumber(value.decoration, 0, 5);

  if (light === null || quiet === null || decoration === null) {
    return null;
  }

  return {
    ...(light === undefined ? {} : { light }),
    ...(quiet === undefined ? {} : { quiet }),
    ...(decoration === undefined ? {} : { decoration }),
  };
}

function parseBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parseListingInput(
  value: unknown,
): CompareExplanationListingInput | null {
  if (!isRecord(value)) {
    return null;
  }

  const listingId = parseRequiredString(value.listingId, MAX_TITLE_LENGTH);
  const displayTitle = parseRequiredString(value.displayTitle, MAX_TITLE_LENGTH);

  if (listingId === null || displayTitle === null) {
    return null;
  }

  const rentMonthly = parseOptionalNumber(value.rentMonthly, 0, 1_000_000);
  const areaSqm = parseOptionalNumber(value.areaSqm, 0, 2_000);
  const layout = parseOptionalString(value.layout, MAX_SHORT_TEXT_LENGTH);
  const district = parseOptionalString(value.district, MAX_SHORT_TEXT_LENGTH);
  const areaLabel = parseOptionalString(value.areaLabel, MAX_SHORT_TEXT_LENGTH);
  const status = parseOptionalString(value.status, MAX_SHORT_TEXT_LENGTH);
  const commuteMinutes = parseOptionalNumber(value.commuteMinutes, 0, 1_000);
  const commuteSource = parseOptionalEnum(
    value.commuteSource,
    allowedCommuteSources,
  );
  const lifeCircleScore = parseOptionalNumber(value.lifeCircleScore, 0, 100);
  const referenceScore = parseOptionalNumber(value.referenceScore, 0, 100);
  const scoreSummary = parseScoreSummary(value.scoreSummary);
  const subjectiveSummary = parseSubjectiveSummary(value.subjectiveSummary);
  const strengths = parseStringArray(value.strengths);
  const weaknesses = parseStringArray(value.weaknesses);
  const neutralFacts = parseStringArray(value.neutralFacts);
  const missingFields = parseEnumArray(value.missingFields, allowedMissingFields);
  const riskFlags = parseEnumArray(value.riskFlags, allowedRiskFlags);
  const photoCount = parseOptionalNumber(value.photoCount, 0, 10_000);

  if (
    rentMonthly === null ||
    areaSqm === null ||
    layout === null ||
    district === null ||
    areaLabel === null ||
    status === null ||
    commuteMinutes === null ||
    commuteSource === null ||
    lifeCircleScore === null ||
    referenceScore === null ||
    scoreSummary === null ||
    subjectiveSummary === null ||
    strengths === null ||
    weaknesses === null ||
    neutralFacts === null ||
    missingFields === null ||
    riskFlags === null ||
    photoCount === null
  ) {
    return null;
  }

  return {
    listingId,
    displayTitle,
    ...(rentMonthly === undefined ? {} : { rentMonthly }),
    ...(areaSqm === undefined ? {} : { areaSqm }),
    ...(layout === undefined ? {} : { layout }),
    ...(district === undefined ? {} : { district }),
    ...(areaLabel === undefined ? {} : { areaLabel }),
    ...(status === undefined ? {} : { status }),
    ...(commuteMinutes === undefined ? {} : { commuteMinutes }),
    ...(commuteSource === undefined ? {} : { commuteSource }),
    ...(lifeCircleScore === undefined ? {} : { lifeCircleScore }),
    ...(referenceScore === undefined ? {} : { referenceScore }),
    ...(scoreSummary === undefined ? {} : { scoreSummary }),
    ...(subjectiveSummary === undefined ? {} : { subjectiveSummary }),
    strengths,
    weaknesses,
    neutralFacts,
    missingFields,
    riskFlags,
    ...(parseBoolean(value.hasNotes) === undefined
      ? {}
      : { hasNotes: parseBoolean(value.hasNotes) }),
    ...(parseBoolean(value.hasPhotos) === undefined
      ? {}
      : { hasPhotos: parseBoolean(value.hasPhotos) }),
    ...(photoCount === undefined ? {} : { photoCount }),
  };
}

function parseCompareExplanationInput(
  value: unknown,
): CompareExplanationInput | null {
  if (!isRecord(value)) {
    return null;
  }

  if (value.locale !== "zh-CN") {
    return null;
  }

  const generatedAt = parseRequiredString(value.generatedAt, MAX_TITLE_LENGTH);

  if (generatedAt === null) {
    return null;
  }

  if (
    !Array.isArray(value.listings) ||
    value.listings.length < MIN_LISTINGS ||
    value.listings.length > MAX_LISTINGS
  ) {
    return null;
  }

  const listings = value.listings.map(parseListingInput);

  if (listings.some((listing) => listing === null)) {
    return null;
  }

  return {
    locale: "zh-CN",
    generatedAt,
    listings: listings as CompareExplanationListingInput[],
  };
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Invalid JSON request body.", 400);
  }

  if (hasForbiddenRequestKey(body)) {
    return jsonError("invalid_input", "Invalid compare explanation input.", 400);
  }

  const input = parseCompareExplanationInput(body);

  if (input === null) {
    return jsonError("invalid_input", "Invalid compare explanation input.", 400);
  }

  try {
    const output = await generateMockCompareExplanation(input);

    return NextResponse.json({
      ok: true,
      provider: "mock",
      data: output,
    });
  } catch {
    return jsonError("generation_failed", "Failed to generate mock output.", 500);
  }
}