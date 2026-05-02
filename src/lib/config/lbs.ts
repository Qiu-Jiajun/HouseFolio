import type { LbsProviderName } from "../lbs/provider";

export type LbsProviderFallbackReason =
  | "mock_selected"
  | "not_configured"
  | "unsupported_provider"
  | "amap_missing_key"
  | "amap_enabled";

export interface LbsRuntimeConfig {
  configuredProvider: string;
  activeProvider: LbsProviderName;
  isMock: boolean;
  amapApiKeyConfigured: boolean;
  fallbackReason: LbsProviderFallbackReason;
}

function normalizeProviderName(value: string | undefined): string {
  return value?.trim().toLowerCase() || "not-configured";
}

export function getLbsRuntimeConfig(): LbsRuntimeConfig {
  const configuredProvider = normalizeProviderName(process.env.LBS_PROVIDER);
  const amapApiKeyConfigured = Boolean(process.env.AMAP_API_KEY?.trim());

  if (configuredProvider === "mock") {
    return {
      configuredProvider,
      activeProvider: "mock",
      isMock: true,
      amapApiKeyConfigured,
      fallbackReason: "mock_selected",
    };
  }

  if (configuredProvider === "not-configured") {
    return {
      configuredProvider,
      activeProvider: "mock",
      isMock: true,
      amapApiKeyConfigured,
      fallbackReason: "not_configured",
    };
  }

  if (configuredProvider === "amap" && !amapApiKeyConfigured) {
    return {
      configuredProvider,
      activeProvider: "mock",
      isMock: true,
      amapApiKeyConfigured,
      fallbackReason: "amap_missing_key",
    };
  }

  if (configuredProvider === "amap") {
    return {
      configuredProvider,
      activeProvider: "amap",
      isMock: false,
      amapApiKeyConfigured,
      fallbackReason: "amap_enabled",
    };
  }

  return {
    configuredProvider,
    activeProvider: "mock",
    isMock: true,
    amapApiKeyConfigured,
    fallbackReason: "unsupported_provider",
  };
}