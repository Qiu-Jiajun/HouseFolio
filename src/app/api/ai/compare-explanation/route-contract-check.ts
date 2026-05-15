import type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
  CompareExplanationScoreSummary,
  CompareExplanationSubjectiveSummary,
} from "@/types/ai-compare-explanation";
import type {
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
  IsSame<MockCompareExplanationApiRequest, CompareExplanationInput>
>;

type _RequestHasNoForbiddenTopLevelKeys = Assert<
  HasNoForbiddenKeys<MockCompareExplanationApiRequest>
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
  HasNoKeysOutside<MockCompareExplanationApiSuccessResponse, AllowedSuccessKeys>
>;

type _SuccessResponseUsesMockProvider = Assert<
  IsSame<MockCompareExplanationApiSuccessResponse["provider"], "mock">
>;

type _SuccessResponseDataMatchesOutput = Assert<
  IsSame<MockCompareExplanationApiSuccessResponse["data"], CompareExplanationOutput>
>;

type _ErrorResponseHasOnlyAllowedKeys = Assert<
  HasNoKeysOutside<MockCompareExplanationApiErrorResponse, AllowedErrorKeys>
>;

type _ErrorPayloadHasOnlyAllowedKeys = Assert<
  HasNoKeysOutside<MockCompareExplanationApiErrorResponse["error"], AllowedErrorPayloadKeys>
>;

type _ApiResponseIsExpectedUnion = Assert<
  IsSame<
    MockCompareExplanationApiResponse,
    MockCompareExplanationApiSuccessResponse | MockCompareExplanationApiErrorResponse
  >
>;