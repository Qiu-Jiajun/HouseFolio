import {
  getLbsRuntimeConfig,
  type LbsProviderFallbackReason,
} from "../config/lbs";
import { amapLbsProvider } from "./amap-provider";
import { mockLbsProvider } from "./mock-provider";
import type { LbsProvider, LbsProviderName } from "./provider";

const lbsProviders: Record<LbsProviderName, LbsProvider> = {
  mock: mockLbsProvider,
  amap: amapLbsProvider,
};

export type LbsProviderConfigurationFailureReason =
  | Exclude<
      LbsProviderFallbackReason,
      "mock_selected" | "amap_enabled"
    >
  | "provider_not_registered";

export class LbsProviderConfigurationError extends Error {
  readonly reason: LbsProviderConfigurationFailureReason;
  readonly safeMessage: string;

  constructor(
    reason: LbsProviderConfigurationFailureReason,
    safeMessage = "Commute service configuration is unavailable.",
  ) {
    super(safeMessage);
    this.name = "LbsProviderConfigurationError";
    this.reason = reason;
    this.safeMessage = safeMessage;
  }
}

function isEnabledConfiguration(
  fallbackReason: LbsProviderFallbackReason,
): fallbackReason is "mock_selected" | "amap_enabled" {
  return (
    fallbackReason === "mock_selected" ||
    fallbackReason === "amap_enabled"
  );
}

export function resolveLbsProvider() {
  const runtimeConfig = getLbsRuntimeConfig();

  if (!isEnabledConfiguration(runtimeConfig.fallbackReason)) {
    throw new LbsProviderConfigurationError(
      runtimeConfig.fallbackReason,
    );
  }

  const provider = lbsProviders[runtimeConfig.activeProvider];

  if (!provider) {
    throw new LbsProviderConfigurationError(
      "provider_not_registered",
    );
  }

  return {
    provider,
    runtimeConfig,
  };
}
