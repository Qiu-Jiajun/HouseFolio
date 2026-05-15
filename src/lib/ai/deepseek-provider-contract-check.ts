import {
  createDeepSeekCompareExplanationProvider,
  deepSeekCompareExplanationProvider,
} from "@/lib/ai/deepseek-provider";
import type {
  DeepSeekChatModel,
  DeepSeekCompareExplanationProviderConfig,
  DeepSeekProviderErrorCode,
} from "@/lib/ai/deepseek-provider";
import type { CompareExplanationProvider } from "@/lib/ai/provider";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

type Assert<T extends true> = T;

type IsNever<T> = [T] extends [never] ? true : false;

type DeepSeekProviderMatchesInterface = Assert<
  typeof deepSeekCompareExplanationProvider extends CompareExplanationProvider
    ? true
    : false
>;

type DeepSeekProviderNameIsSupported = Assert<
  typeof deepSeekCompareExplanationProvider.name extends "deepseek"
    ? true
    : false
>;

type FactoryReturnMatchesProvider = Assert<
  ReturnType<typeof createDeepSeekCompareExplanationProvider> extends CompareExplanationProvider
    ? true
    : false
>;

type GenerateInput = Parameters<
  typeof deepSeekCompareExplanationProvider.generateCompareExplanation
>[0];

type GenerateOutput = Awaited<
  ReturnType<typeof deepSeekCompareExplanationProvider.generateCompareExplanation>
>;

type GenerateInputMatches = Assert<
  GenerateInput extends CompareExplanationInput ? true : false
>;

type GenerateOutputMatches = Assert<
  GenerateOutput extends CompareExplanationOutput ? true : false
>;

type SupportedDeepSeekModels = Assert<
  DeepSeekChatModel extends "deepseek-v4-flash" | "deepseek-v4-pro"
    ? true
    : false
>;

type SupportedDeepSeekErrors = Assert<
  DeepSeekProviderErrorCode extends
    | "missing_configuration"
    | "request_failed"
    | "request_timeout"
    | "rate_limited"
    | "invalid_response"
    | "unknown_failure"
    ? true
    : false
>;

type ForbiddenConfigKeys = Extract<
  keyof DeepSeekCompareExplanationProviderConfig,
  | "requestUrl"
  | "rawResponse"
  | "providerResponse"
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

type ConfigHasNoForbiddenKeys = Assert<IsNever<ForbiddenConfigKeys>>;

export const deepSeekProviderContractChecks = {
  deepSeekProviderMatchesInterface: true as DeepSeekProviderMatchesInterface,
  deepSeekProviderNameIsSupported: true as DeepSeekProviderNameIsSupported,
  factoryReturnMatchesProvider: true as FactoryReturnMatchesProvider,
  generateInputMatches: true as GenerateInputMatches,
  generateOutputMatches: true as GenerateOutputMatches,
  supportedDeepSeekModels: true as SupportedDeepSeekModels,
  supportedDeepSeekErrors: true as SupportedDeepSeekErrors,
  configHasNoForbiddenKeys: true as ConfigHasNoForbiddenKeys,
};