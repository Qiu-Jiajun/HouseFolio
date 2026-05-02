export type LbsProviderName = "mock" | "amap";

export type LbsTravelMode = "walking" | "cycling" | "transit" | "driving";

export type LbsAddressPrecision =
  | "city"
  | "district"
  | "business_area"
  | "poi"
  | "school_area"
  | "community"
  | "exact"
  | "unknown";

export type PoiCategory =
  | "subway"
  | "bus_stop"
  | "convenience_store"
  | "restaurant"
  | "supermarket"
  | "hospital"
  | "park"
  | "school";

export interface LbsCoordinate {
  latitude: number;
  longitude: number;
}

export interface GeocodeAddressInput {
  addressHint: string;
  city?: string;
  precision?: LbsAddressPrecision;
}

export interface GeocodeAddressResult {
  provider: LbsProviderName;
  isMock: boolean;
  addressHint: string;
  formattedAddress: string;
  precision: LbsAddressPrecision;
  coordinate: LbsCoordinate;
  confidence: number;
}

export interface CalculateCommuteInput {
  origin: LbsCoordinate;
  destination: LbsCoordinate;
  mode: LbsTravelMode;
  anchorName?: string;
  listingId?: string;
}

export interface CalculateCommuteResult {
  provider: LbsProviderName;
  isMock: boolean;
  mode: LbsTravelMode;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
}

export interface SearchNearbyPoiInput {
  center: LbsCoordinate;
  radiusMeters?: number;
  categories?: PoiCategory[];
}

export interface PoiCategorySummary {
  category: PoiCategory;
  count: number;
  score: number;
}

export interface SearchNearbyPoiResult {
  provider: LbsProviderName;
  isMock: boolean;
  radiusMeters: number;
  categories: PoiCategorySummary[];
  lifeCircleScore: number;
}

export interface LbsProvider {
  name: LbsProviderName;
  geocodeAddress(input: GeocodeAddressInput): Promise<GeocodeAddressResult>;
  calculateCommute(input: CalculateCommuteInput): Promise<CalculateCommuteResult>;
  searchNearbyPoi(input: SearchNearbyPoiInput): Promise<SearchNearbyPoiResult>;
}