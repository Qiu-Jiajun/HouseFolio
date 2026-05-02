import type {
  CalculateCommuteInput,
  CalculateCommuteResult,
  GeocodeAddressInput,
  GeocodeAddressResult,
  LbsAddressPrecision,
  LbsCoordinate,
  LbsProvider,
  LbsTravelMode,
  SearchNearbyPoiInput,
  SearchNearbyPoiResult,
} from "./provider";

interface AmapGeocodeItem {
  formatted_address?: string;
  country?: string;
  province?: string;
  city?: string | string[];
  district?: string | string[];
  township?: string | string[];
  neighborhood?: {
    name?: string | string[];
    type?: string | string[];
  };
  building?: {
    name?: string | string[];
    type?: string | string[];
  };
  adcode?: string;
  street?: string | string[];
  number?: string | string[];
  location?: string;
  level?: string;
}

interface AmapGeocodeResponse {
  status?: string;
  count?: string;
  info?: string;
  infocode?: string;
  geocodes?: AmapGeocodeItem[];
}

interface AmapTransitPlan {
  duration?: string;
  distance?: string;
  cost?: string;
  walking_distance?: string;
}

interface AmapTransitRoute {
  origin?: string;
  destination?: string;
  distance?: string;
  taxi_cost?: string;
  transits?: AmapTransitPlan[];
}

interface AmapTransitResponse {
  status?: string;
  count?: string;
  info?: string;
  infocode?: string;
  route?: AmapTransitRoute;
}

interface AmapWalkingPath {
  distance?: string;
  duration?: string;
}

interface AmapWalkingRoute {
  origin?: string;
  destination?: string;
  paths?: AmapWalkingPath[];
}

interface AmapWalkingResponse {
  status?: string;
  count?: string;
  info?: string;
  infocode?: string;
  route?: AmapWalkingRoute;
}

interface AmapCyclingPath {
  distance?: number | string;
  duration?: number | string;
}

interface AmapCyclingData {
  origin?: string;
  destination?: string;
  paths?: AmapCyclingPath[];
}

interface AmapCyclingResponse {
  data?: AmapCyclingData;
  errcode?: number;
  errdetail?: string | null;
  errmsg?: string;
  ext?: unknown;
}

export class AmapProviderNotImplementedError extends Error {
  constructor(methodName: string) {
    super(`Amap LBS provider method is not implemented yet: ${methodName}`);
    this.name = "AmapProviderNotImplementedError";
  }
}

export class AmapProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AmapProviderError";
  }
}

function getAmapApiKey(): string {
  const key = process.env.AMAP_API_KEY?.trim();

  if (!key) {
    throw new AmapProviderError("AMAP_API_KEY is not configured.");
  }

  return key;
}

function parseAmapLocation(location: string | undefined): LbsCoordinate | null {
  if (!location) {
    return null;
  }

  const [longitudeText, latitudeText] = location.split(",");
  const longitude = Number(longitudeText);
  const latitude = Number(latitudeText);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function formatCoordinate(coordinate: LbsCoordinate): string {
  return `${coordinate.longitude},${coordinate.latitude}`;
}

function parsePositiveNumber(value: number | string | undefined): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function inferPrecision(level: string | undefined, fallback?: LbsAddressPrecision): LbsAddressPrecision {
  if (fallback && fallback !== "unknown") {
    return fallback;
  }

  const normalizedLevel = level?.trim();

  if (!normalizedLevel) {
    return "unknown";
  }

  if (normalizedLevel.includes("门牌号")) {
    return "exact";
  }

  if (normalizedLevel.includes("道路") || normalizedLevel.includes("兴趣点")) {
    return "poi";
  }

  if (normalizedLevel.includes("区县")) {
    return "district";
  }

  if (normalizedLevel.includes("开发区") || normalizedLevel.includes("乡镇")) {
    return "business_area";
  }

  return "unknown";
}

function calculateConfidence(item: AmapGeocodeItem): number {
  const level = item.level ?? "";
  const hasLocation = Boolean(item.location);

  if (!hasLocation) {
    return 0;
  }

  if (level.includes("门牌号")) {
    return 0.92;
  }

  if (level.includes("兴趣点")) {
    return 0.84;
  }

  if (level.includes("道路")) {
    return 0.76;
  }

  if (level.includes("区县")) {
    return 0.62;
  }

  return 0.7;
}

function createGeocodeUrl(input: GeocodeAddressInput): string {
  const url = new URL("https://restapi.amap.com/v3/geocode/geo");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("address", input.addressHint);
  url.searchParams.set("output", "JSON");

  if (input.city?.trim()) {
    url.searchParams.set("city", input.city.trim());
  }

  return url.toString();
}

function createTransitCommuteUrl(input: CalculateCommuteInput): string {
  const url = new URL("https://restapi.amap.com/v3/direction/transit/integrated");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(input.origin));
  url.searchParams.set("destination", formatCoordinate(input.destination));
  url.searchParams.set("city", "北京");
  url.searchParams.set("cityd", "北京");
  url.searchParams.set("extensions", "base");
  url.searchParams.set("strategy", "0");
  url.searchParams.set("output", "JSON");

  return url.toString();
}

function createWalkingCommuteUrl(input: CalculateCommuteInput): string {
  const url = new URL("https://restapi.amap.com/v3/direction/walking");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(input.origin));
  url.searchParams.set("destination", formatCoordinate(input.destination));
  url.searchParams.set("output", "JSON");

  return url.toString();
}

function createCyclingCommuteUrl(input: CalculateCommuteInput): string {
  const url = new URL("https://restapi.amap.com/v4/direction/bicycling");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(input.origin));
  url.searchParams.set("destination", formatCoordinate(input.destination));
  url.searchParams.set("output", "JSON");

  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new AmapProviderError(`Amap request failed with HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

function createCommuteSummary(
  mode: LbsTravelMode,
  input: CalculateCommuteInput,
  durationMinutes: number,
  distanceMeters: number,
): string {
  const anchorText = input.anchorName ? `到「${input.anchorName}」` : "该路线";

  const modeTextByMode: Record<LbsTravelMode, string> = {
    transit: "公共交通",
    walking: "步行",
    cycling: "骑行",
    driving: "驾车",
  };

  return `${anchorText}${modeTextByMode[mode]}约 ${durationMinutes} 分钟，路线距离约 ${(distanceMeters / 1000).toFixed(1)} 公里`;
}

export const amapLbsProvider: LbsProvider = {
  name: "amap",

  async geocodeAddress(input: GeocodeAddressInput): Promise<GeocodeAddressResult> {
    const data = await fetchJson<AmapGeocodeResponse>(createGeocodeUrl(input));

    if (data.status !== "1") {
      throw new AmapProviderError(`Amap geocode request failed: ${data.info ?? "unknown error"}.`);
    }

    const firstCandidate = data.geocodes?.[0];

    if (!firstCandidate) {
      throw new AmapProviderError("Amap geocode returned no candidates.");
    }

    const coordinate = parseAmapLocation(firstCandidate.location);

    if (!coordinate) {
      throw new AmapProviderError("Amap geocode returned an invalid coordinate.");
    }

    return {
      provider: "amap",
      isMock: false,
      addressHint: input.addressHint,
      formattedAddress: firstCandidate.formatted_address ?? input.addressHint,
      precision: inferPrecision(firstCandidate.level, input.precision),
      coordinate,
      confidence: calculateConfidence(firstCandidate),
    };
  },

  async calculateCommute(input: CalculateCommuteInput): Promise<CalculateCommuteResult> {
    if (input.mode === "transit") {
      const data = await fetchJson<AmapTransitResponse>(createTransitCommuteUrl(input));

      if (data.status !== "1") {
        throw new AmapProviderError(
          `Amap transit request failed: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"}).`,
        );
      }

      const firstTransit = data.route?.transits?.[0];

      if (!firstTransit) {
        throw new AmapProviderError("Amap transit route returned no candidate plans.");
      }

      const durationSeconds = parsePositiveNumber(firstTransit.duration);
      const distanceMeters =
        parsePositiveNumber(firstTransit.distance) ?? parsePositiveNumber(data.route?.distance);

      if (!durationSeconds || !distanceMeters) {
        throw new AmapProviderError("Amap transit route returned invalid duration or distance.");
      }

      const durationMinutes = Math.ceil(durationSeconds / 60);

      return {
        provider: "amap",
        isMock: false,
        mode: "transit",
        durationMinutes,
        distanceMeters: Math.round(distanceMeters),
        summary: createCommuteSummary("transit", input, durationMinutes, distanceMeters),
      };
    }

    if (input.mode === "walking") {
      const data = await fetchJson<AmapWalkingResponse>(createWalkingCommuteUrl(input));

      if (data.status !== "1") {
        throw new AmapProviderError(
          `Amap walking request failed: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"}).`,
        );
      }

      const firstPath = data.route?.paths?.[0];

      if (!firstPath) {
        throw new AmapProviderError("Amap walking route returned no candidate paths.");
      }

      const durationSeconds = parsePositiveNumber(firstPath.duration);
      const distanceMeters = parsePositiveNumber(firstPath.distance);

      if (!durationSeconds || !distanceMeters) {
        throw new AmapProviderError("Amap walking route returned invalid duration or distance.");
      }

      const durationMinutes = Math.ceil(durationSeconds / 60);

      return {
        provider: "amap",
        isMock: false,
        mode: "walking",
        durationMinutes,
        distanceMeters: Math.round(distanceMeters),
        summary: createCommuteSummary("walking", input, durationMinutes, distanceMeters),
      };
    }

    if (input.mode === "cycling") {
      const data = await fetchJson<AmapCyclingResponse>(createCyclingCommuteUrl(input));

      if (data.errcode !== 0) {
        throw new AmapProviderError(
          `Amap cycling request failed: ${data.errmsg ?? "unknown error"} (${data.errcode ?? "no errcode"}).`,
        );
      }

      const firstPath = data.data?.paths?.[0];

      if (!firstPath) {
        throw new AmapProviderError("Amap cycling route returned no candidate paths.");
      }

      const durationSeconds = parsePositiveNumber(firstPath.duration);
      const distanceMeters = parsePositiveNumber(firstPath.distance);

      if (!durationSeconds || !distanceMeters) {
        throw new AmapProviderError("Amap cycling route returned invalid duration or distance.");
      }

      const durationMinutes = Math.ceil(durationSeconds / 60);

      return {
        provider: "amap",
        isMock: false,
        mode: "cycling",
        durationMinutes,
        distanceMeters: Math.round(distanceMeters),
        summary: createCommuteSummary("cycling", input, durationMinutes, distanceMeters),
      };
    }

    throw new AmapProviderNotImplementedError(`calculateCommute:${input.mode}`);
  },

  async searchNearbyPoi(_input: SearchNearbyPoiInput): Promise<SearchNearbyPoiResult> {
    throw new AmapProviderNotImplementedError("searchNearbyPoi");
  },
};

export function createAmapLbsProvider(): LbsProvider {
  return amapLbsProvider;
}