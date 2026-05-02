import {
  calculateCommute,
  geocodeAddress,
  isUsingMockLbsProvider,
  searchNearbyPoi,
} from "./service";

export async function runMockLbsContractCheck() {
  const origin = await geocodeAddress({
    addressHint: "望京 SOHO 附近",
    city: "北京",
    precision: "poi",
  });

  const destination = await geocodeAddress({
    addressHint: "五道口地铁站附近",
    city: "北京",
    precision: "poi",
  });

  const commute = await calculateCommute({
    origin: origin.coordinate,
    destination: destination.coordinate,
    mode: "transit",
    anchorName: "学校",
  });

  const nearby = await searchNearbyPoi({
    center: origin.coordinate,
    radiusMeters: 500,
    categories: ["subway", "convenience_store", "restaurant", "park"],
  });

  return {
    providerIsMock: isUsingMockLbsProvider(),
    origin,
    destination,
    commute,
    nearby,
  };
}