import type {
  CalculateCommuteInput,
  CalculateCommuteResult,
  GeocodeAddressInput,
  GeocodeAddressResult,
  LbsCoordinate,
  LbsProvider,
  PoiCategory,
  PoiCategorySummary,
  SearchNearbyPoiInput,
  SearchNearbyPoiResult,
} from "./provider";

const DEFAULT_POI_CATEGORIES: PoiCategory[] = [
  "subway",
  "bus_stop",
  "convenience_store",
  "restaurant",
  "supermarket",
  "hospital",
  "park",
];

const METERS_PER_MINUTE_BY_MODE = {
  walking: 80,
  cycling: 220,
  transit: 520,
  driving: 650,
} as const;

function hashText(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createMockCoordinate(input: GeocodeAddressInput): LbsCoordinate {
  const seed = hashText(`${input.city ?? "北京"}-${input.addressHint}`);

  return {
    latitude: roundCoordinate(39.82 + (seed % 2400) / 10000),
    longitude: roundCoordinate(116.2 + ((seed >>> 8) % 2800) / 10000),
  };
}

function calculateDistanceMeters(origin: LbsCoordinate, destination: LbsCoordinate): number {
  const earthRadiusMeters = 6_371_000;
  const originLat = (origin.latitude * Math.PI) / 180;
  const destinationLat = (destination.latitude * Math.PI) / 180;
  const latDelta = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const lonDelta = ((destination.longitude - origin.longitude) * Math.PI) / 180;

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(lonDelta / 2) ** 2;

  return Math.round(
    earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)),
  );
}

function createPoiSummary(category: PoiCategory, index: number, seed: number): PoiCategorySummary {
  const count = 1 + ((seed >>> (index % 8)) % 12);
  const score = roundScore(clamp(count / 1.5, 1, 10));

  return {
    category,
    count,
    score,
  };
}

export const mockLbsProvider: LbsProvider = {
  name: "mock",

  async geocodeAddress(input: GeocodeAddressInput): Promise<GeocodeAddressResult> {
    return {
      provider: "mock",
      isMock: true,
      addressHint: input.addressHint,
      formattedAddress: `${input.city ?? "北京"} · ${input.addressHint}`,
      precision: input.precision ?? "unknown",
      coordinate: createMockCoordinate(input),
      confidence: 0.7,
    };
  },

  async calculateCommute(input: CalculateCommuteInput): Promise<CalculateCommuteResult> {
    const distanceMeters = calculateDistanceMeters(input.origin, input.destination);
    const baseDuration = Math.ceil(distanceMeters / METERS_PER_MINUTE_BY_MODE[input.mode]);
    const transferBuffer = input.mode === "transit" ? 8 : input.mode === "driving" ? 5 : 0;
    const durationMinutes = Math.max(1, baseDuration + transferBuffer);

    return {
      provider: "mock",
      isMock: true,
      mode: input.mode,
      durationMinutes,
      distanceMeters,
      summary: `Mock ${input.mode} commute${input.anchorName ? ` to ${input.anchorName}` : ""}: ${durationMinutes} min`,
    };
  },

  async searchNearbyPoi(input: SearchNearbyPoiInput): Promise<SearchNearbyPoiResult> {
    const radiusMeters = input.radiusMeters ?? 500;
    const categories = input.categories?.length ? input.categories : DEFAULT_POI_CATEGORIES;
    const seed = hashText(`${input.center.latitude}-${input.center.longitude}-${radiusMeters}`);

    const categorySummaries = categories.map((category, index) =>
      createPoiSummary(category, index, seed),
    );

    const averageScore =
      categorySummaries.reduce((sum, item) => sum + item.score, 0) / categorySummaries.length;

    return {
      provider: "mock",
      isMock: true,
      radiusMeters,
      categories: categorySummaries,
      lifeCircleScore: roundScore(clamp(averageScore, 1, 10)),
    };
  },
};

export function createMockLbsProvider(): LbsProvider {
  return mockLbsProvider;
}