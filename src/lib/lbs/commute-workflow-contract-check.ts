import type { WorkLocation } from "@/types/work-location";
import type { Listing } from "@/types/listing";
import { calculateAndStoreCommuteResults } from "./commute-workflow";
import type { CalculateCommuteFn, GeocodeAddressFn } from "./commute-workflow";

const contractCheckListing: Pick<Listing, "id" | "title" | "addressHint" | "district"> = {
  id: "listing-contract-check",
  title: "Contract check listing",
  addressHint: "望京 SOHO 附近",
  district: "朝阳区",
};

const contractCheckWorkLocations: WorkLocation[] = [
  {
    id: "anchor-company",
    name: "我的公司",
    addressHint: "国贸附近",
    createdAt: "2026-05-02T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "anchor-school",
    name: "学校",
    addressHint: "五道口地铁站附近",
    createdAt: "2026-05-02T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
];

const mockGeocodeAddress: GeocodeAddressFn = async (input) => {
  return {
    provider: "mock",
    isMock: true,
    addressHint: input.addressHint,
    formattedAddress: input.addressHint,
    precision: input.precision ?? "poi",
    coordinate: {
      latitude: input.addressHint.includes("五道口") ? 39.992894 : 39.90986,
      longitude: input.addressHint.includes("五道口") ? 116.337742 : 116.45885,
    },
    confidence: 0.8,
  };
};

const mockCalculateCommute: CalculateCommuteFn = async (input) => {
  return {
    provider: "mock",
    isMock: true,
    mode: input.mode,
    durationMinutes: input.anchorName === "学校" ? 48 : 37,
    distanceMeters: input.anchorName === "学校" ? 13326 : 14138,
    summary: `到「${input.anchorName ?? "通勤锚点"}」公共交通约 ${
      input.anchorName === "学校" ? 48 : 37
    } 分钟`,
  };
};

export async function runCommuteWorkflowContractCheck() {
  return calculateAndStoreCommuteResults({
    listing: contractCheckListing,
    workLocations: contractCheckWorkLocations,
    mode: "transit",
    city: "北京",
    geocodeAddress: mockGeocodeAddress,
    calculateCommute: mockCalculateCommute,
  });
}