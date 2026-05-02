import type {
  CalculateCommuteInput,
  CalculateCommuteResult,
  GeocodeAddressInput,
  GeocodeAddressResult,
  LbsProvider,
  SearchNearbyPoiInput,
  SearchNearbyPoiResult,
} from "./provider";

export class AmapProviderNotImplementedError extends Error {
  constructor(methodName: string) {
    super(`Amap LBS provider method is not implemented yet: ${methodName}`);
    this.name = "AmapProviderNotImplementedError";
  }
}

export const amapLbsProvider: LbsProvider = {
  name: "amap",

  async geocodeAddress(_input: GeocodeAddressInput): Promise<GeocodeAddressResult> {
    throw new AmapProviderNotImplementedError("geocodeAddress");
  },

  async calculateCommute(_input: CalculateCommuteInput): Promise<CalculateCommuteResult> {
    throw new AmapProviderNotImplementedError("calculateCommute");
  },

  async searchNearbyPoi(_input: SearchNearbyPoiInput): Promise<SearchNearbyPoiResult> {
    throw new AmapProviderNotImplementedError("searchNearbyPoi");
  },
};

export function createAmapLbsProvider(): LbsProvider {
  return amapLbsProvider;
}