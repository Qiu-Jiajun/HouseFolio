import { getLbsRuntimeConfig } from "../config/lbs";
import { amapLbsProvider } from "./amap-provider";
import { mockLbsProvider } from "./mock-provider";
import type { LbsProvider, LbsProviderName } from "./provider";

const lbsProviders: Record<LbsProviderName, LbsProvider> = {
  mock: mockLbsProvider,
  amap: amapLbsProvider,
};

export function resolveLbsProvider() {
  const runtimeConfig = getLbsRuntimeConfig();
  const provider = lbsProviders[runtimeConfig.activeProvider] ?? mockLbsProvider;

  return {
    provider,
    runtimeConfig,
  };
}