import { buildCompareExplanationPrompt } from "@/lib/ai/compare-explanation-prompt";
import type {
  CompareExplanationPromptPayload,
  CompareExplanationPromptRole,
} from "@/lib/ai/compare-explanation-prompt";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

type Assert<T extends true> = T;

type IsNever<T> = [T] extends [never] ? true : false;

type PromptBuilderInput = Parameters<typeof buildCompareExplanationPrompt>[0];

type PromptBuilderInputMatches = Assert<
  PromptBuilderInput extends CompareExplanationInput ? true : false
>;

type ForbiddenPromptPayloadKeys = Extract<
  keyof CompareExplanationPromptPayload,
  | "apiKey"
  | "key"
  | "requestUrl"
  | "rawResponse"
  | "providerResponse"
  | "endpoint"
  | "headers"
  | "model"
  | "localStorageKey"
  | "sessionStorageKey"
  | "photoBlob"
  | "videoBlob"
  | "objectUrl"
  | "base64"
  | "coordinates"
  | "longitude"
  | "latitude"
  | "fullNote"
  | "rawNote"
  | "noteText"
  | "fullAddress"
  | "doorNumber"
  | "roomNumber"
  | "buildingNumber"
  | "unitNumber"
>;

type PromptPayloadHasNoForbiddenKeys = Assert<
  IsNever<ForbiddenPromptPayloadKeys>
>;

type MissingOutputShapeKeys = Exclude<
  keyof CompareExplanationOutput,
  keyof CompareExplanationPromptPayload["expectedOutputShape"]
>;

type ExtraOutputShapeKeys = Exclude<
  keyof CompareExplanationPromptPayload["expectedOutputShape"],
  keyof CompareExplanationOutput
>;

type PromptPayloadIncludesAllOutputKeys = Assert<
  IsNever<MissingOutputShapeKeys>
>;

type PromptPayloadDoesNotAddOutputKeys = Assert<
  IsNever<ExtraOutputShapeKeys>
>;

type PromptRolesAreProviderNeutral = Assert<
  CompareExplanationPromptRole extends "system" | "user" ? true : false
>;

const sampleInput: CompareExplanationInput = {
  locale: "zh-CN",
  generatedAt: "2026-05-15T00:00:00.000Z",
  listings: [
    {
      listingId: "listing-a",
      displayTitle: "候选房源 A",
      rentMonthly: 6800,
      areaSqm: 42,
      layout: "一居室",
      district: "海淀区",
      areaLabel: "五道口附近",
      status: "重点比较",
      commuteMinutes: 28,
      commuteSource: "cachedTransit",
      lifeCircleScore: 82,
      referenceScore: 78,
      scoreSummary: {
        commute: 86,
        rent: 72,
        lifeCircle: 82,
        subjective: 76,
      },
      subjectiveSummary: {
        light: 4,
        quiet: 3,
        decoration: 4,
      },
      strengths: ["通勤压力较低"],
      weaknesses: ["租金偏高"],
      neutralFacts: ["资料较完整"],
      missingFields: [],
      riskFlags: ["highRent"],
      hasNotes: true,
      hasPhotos: true,
      photoCount: 2,
    },
    {
      listingId: "listing-b",
      displayTitle: "候选房源 B",
      rentMonthly: 5900,
      areaSqm: 36,
      layout: "开间",
      district: "朝阳区",
      areaLabel: "望京附近",
      status: "待复核",
      commuteMinutes: 42,
      commuteSource: "listing",
      lifeCircleScore: 76,
      referenceScore: 70,
      scoreSummary: {
        commute: 68,
        rent: 84,
        lifeCircle: 76,
        subjective: 70,
      },
      subjectiveSummary: {
        light: 3,
        quiet: 4,
        decoration: 3,
      },
      strengths: ["租金压力较低"],
      weaknesses: ["通勤时间偏长"],
      neutralFacts: ["需要补充看房记录"],
      missingFields: ["subjectiveSummary"],
      riskFlags: ["longCommute"],
      hasNotes: false,
      hasPhotos: false,
      photoCount: 0,
    },
  ],
};

export const compareExplanationPromptContractSample =
  buildCompareExplanationPrompt(sampleInput);

export const compareExplanationPromptContractChecks = {
  promptBuilderInputMatches: true as PromptBuilderInputMatches,
  promptPayloadHasNoForbiddenKeys: true as PromptPayloadHasNoForbiddenKeys,
  promptPayloadIncludesAllOutputKeys: true as PromptPayloadIncludesAllOutputKeys,
  promptPayloadDoesNotAddOutputKeys: true as PromptPayloadDoesNotAddOutputKeys,
  promptRolesAreProviderNeutral: true as PromptRolesAreProviderNeutral,
};