import type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
  CompareExplanationScoreSummary,
  CompareExplanationSubjectiveSummary,
} from "@/types/ai-compare-explanation";
import type { CompareExplanationProviderName } from "@/lib/ai/provider";
import {
  CompareExplanationProviderConfigurationError,
  getServerConfiguredProviderName,
} from "@/app/api/ai/compare-explanation/route";
import type {
  CompareExplanationApiErrorResponse,
  CompareExplanationApiRequest,
  CompareExplanationApiResponse,
  CompareExplanationApiSuccessResponse,
  MockCompareExplanationApiErrorResponse,
  MockCompareExplanationApiRequest,
  MockCompareExplanationApiResponse,
  MockCompareExplanationApiSuccessResponse,
} from "@/app/api/ai/compare-explanation/route";

type Assert<T extends true> = T;

type IsSame<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T,
>() => T extends B ? 1 : 2
  ? true
  : false;

type HasNoKeysOutside<T, AllowedKeys extends PropertyKey> =
  Exclude<keyof T, AllowedKeys> extends never ? true : false;

type HasNoForbiddenKeys<T> =
  Extract<keyof T, ForbiddenAiRouteKeys> extends never ? true : false;

type ForbiddenAiRouteKeys =
  | "address"
  | "fullAddress"
  | "preciseAddress"
  | "preciseAnchor"
  | "doorNumber"
  | "roomNumber"
  | "buildingNumber"
  | "unitNumber"
  | "latitude"
  | "longitude"
  | "lng"
  | "lat"
  | "coordinate"
  | "coordinates"
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
  | "phone"
  | "phoneNumber"
  | "wechat"
  | "weChat"
  | "idCard"
  | "contractText"
  | "landlordName"
  | "agentName";

type AllowedSuccessKeys = "ok" | "provider" | "data";
type AllowedErrorKeys = "ok" | "error";
type AllowedErrorPayloadKeys = "code" | "message";

type _RequestMatchesRedactedInput = Assert<
  IsSame<CompareExplanationApiRequest, CompareExplanationInput>
>;

type _LegacyRequestAliasMatchesRedactedInput = Assert<
  IsSame<MockCompareExplanationApiRequest, CompareExplanationInput>
>;

type _RequestHasNoForbiddenTopLevelKeys = Assert<
  HasNoForbiddenKeys<CompareExplanationApiRequest>
>;

type _ListingInputHasNoForbiddenKeys = Assert<
  HasNoForbiddenKeys<CompareExplanationListingInput>
>;

type _ScoreSummaryHasNoForbiddenKeys = Assert<
  HasNoForbiddenKeys<CompareExplanationScoreSummary>
>;

type _SubjectiveSummaryHasNoForbiddenKeys = Assert<
  HasNoForbiddenKeys<CompareExplanationSubjectiveSummary>
>;

type _OutputHasNoForbiddenKeys = Assert<
  HasNoForbiddenKeys<CompareExplanationOutput>
>;

type _SuccessResponseHasOnlyAllowedKeys = Assert<
  HasNoKeysOutside<CompareExplanationApiSuccessResponse, AllowedSuccessKeys>
>;

type _SuccessResponseProviderIsTruthfulProviderName = Assert<
  IsSame<
    CompareExplanationApiSuccessResponse["provider"],
    CompareExplanationProviderName
  >
>;

type _SuccessResponseDataMatchesOutput = Assert<
  IsSame<CompareExplanationApiSuccessResponse["data"], CompareExplanationOutput>
>;

type _LegacySuccessAliasMatchesCurrentSuccess = Assert<
  IsSame<MockCompareExplanationApiSuccessResponse, CompareExplanationApiSuccessResponse>
>;

type _ErrorResponseHasOnlyAllowedKeys = Assert<
  HasNoKeysOutside<CompareExplanationApiErrorResponse, AllowedErrorKeys>
>;

type _ErrorPayloadHasOnlyAllowedKeys = Assert<
  HasNoKeysOutside<CompareExplanationApiErrorResponse["error"], AllowedErrorPayloadKeys>
>;

type _LegacyErrorAliasMatchesCurrentError = Assert<
  IsSame<MockCompareExplanationApiErrorResponse, CompareExplanationApiErrorResponse>
>;

type _ApiResponseIsExpectedUnion = Assert<
  IsSame<
    CompareExplanationApiResponse,
    CompareExplanationApiSuccessResponse | CompareExplanationApiErrorResponse
  >
>;

type _LegacyApiResponseAliasMatchesCurrentResponse = Assert<
  IsSame<MockCompareExplanationApiResponse, CompareExplanationApiResponse>
>;
function assertCompareExplanationRouteCheck(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `Compare explanation API route check failed: ${message}`,
    );
  }
}

function withAiCompareProvider(
  value: string | undefined,
  callback: () => void,
): void {
  const originalProviderName = process.env.AI_COMPARE_PROVIDER;

  if (value === undefined) {
    delete process.env.AI_COMPARE_PROVIDER;
  } else {
    process.env.AI_COMPARE_PROVIDER = value;
  }

  try {
    callback();
  } finally {
    if (originalProviderName === undefined) {
      delete process.env.AI_COMPARE_PROVIDER;
    } else {
      process.env.AI_COMPARE_PROVIDER = originalProviderName;
    }
  }
}

function expectConfiguredProvider(
  value: string,
  expectedProvider: CompareExplanationProviderName,
): void {
  withAiCompareProvider(value, () => {
    assertCompareExplanationRouteCheck(
      getServerConfiguredProviderName() === expectedProvider,
      `expected ${value} to resolve ${expectedProvider}`,
    );
  });
}

function expectProviderConfigurationError(
  value: string | undefined,
  expectedCode:
    | "missing_provider_configuration"
    | "invalid_provider_configuration",
): void {
  withAiCompareProvider(value, () => {
    let capturedError: unknown;

    try {
      getServerConfiguredProviderName();
    } catch (error) {
      capturedError = error;
    }

    assertCompareExplanationRouteCheck(
      capturedError instanceof
        CompareExplanationProviderConfigurationError,
      `expected ${String(value)} to throw configuration error`,
    );

    assertCompareExplanationRouteCheck(
      capturedError.code === expectedCode,
      `expected ${String(value)} to throw ${expectedCode}`,
    );
  });
}

export function runCompareExplanationApiRouteChecks(): void {
  expectConfiguredProvider("deepseek", "deepseek");
  expectConfiguredProvider("mock", "mock");

  expectProviderConfigurationError(
    undefined,
    "missing_provider_configuration",
  );
  expectProviderConfigurationError("", "missing_provider_configuration");
  expectProviderConfigurationError(
    "unknown",
    "invalid_provider_configuration",
  );
  expectProviderConfigurationError(
    "DEEPSEEK",
    "invalid_provider_configuration",
  );
  expectProviderConfigurationError(
    " deepseek ",
    "invalid_provider_configuration",
  );
}

export const compareExplanationApiRouteContractCheck = {
  runner: runCompareExplanationApiRouteChecks,
} as const;
