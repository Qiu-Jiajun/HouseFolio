import { resolveLbsProvider } from "./registry";
import type {
  CalculateCommuteInput,
  CalculateCommuteResult,
  GeocodeAddressInput,
  GeocodeAddressResult,
  LbsProvider,
  SearchNearbyPoiInput,
  SearchNearbyPoiResult,
} from "./provider";

function resolveActiveLbsProvider(): LbsProvider {
  return resolveLbsProvider().provider;
}

export function getLbsProvider(): LbsProvider {
  return resolveActiveLbsProvider();
}

export function getLbsConfigSnapshot() {
  return resolveLbsProvider().runtimeConfig;
}

export async function geocodeAddress(
  input: GeocodeAddressInput,
): Promise<GeocodeAddressResult> {
  return resolveActiveLbsProvider().geocodeAddress(input);
}

export async function calculateCommute(
  input: CalculateCommuteInput,
): Promise<CalculateCommuteResult> {
  return resolveActiveLbsProvider().calculateCommute(input);
}

export async function searchNearbyPoi(
  input: SearchNearbyPoiInput,
): Promise<SearchNearbyPoiResult> {
  return resolveActiveLbsProvider().searchNearbyPoi(input);
}

export function isUsingMockLbsProvider(): boolean {
  return resolveActiveLbsProvider().name === "mock";
}
