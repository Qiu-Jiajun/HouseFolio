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

const resolvedLbsProvider = resolveLbsProvider();
const activeLbsProvider = resolvedLbsProvider.provider;
const lbsRuntimeConfig = resolvedLbsProvider.runtimeConfig;

export function getLbsProvider(): LbsProvider {
  return activeLbsProvider;
}

export function getLbsConfigSnapshot() {
  return lbsRuntimeConfig;
}

export async function geocodeAddress(
  input: GeocodeAddressInput,
): Promise<GeocodeAddressResult> {
  return activeLbsProvider.geocodeAddress(input);
}

export async function calculateCommute(
  input: CalculateCommuteInput,
): Promise<CalculateCommuteResult> {
  return activeLbsProvider.calculateCommute(input);
}

export async function searchNearbyPoi(
  input: SearchNearbyPoiInput,
): Promise<SearchNearbyPoiResult> {
  return activeLbsProvider.searchNearbyPoi(input);
}

export function isUsingMockLbsProvider(): boolean {
  return activeLbsProvider.name === "mock";
}