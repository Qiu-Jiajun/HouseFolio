import type {
  LbsAddressPrecision,
  LbsCoordinate,
  LbsTravelMode,
  PoiCategory,
} from "./provider";

export type AmapRequestPurpose = "geocode" | "commute" | "nearby_poi";

export interface AmapRequestBoundary {
  provider: "amap";
  purpose: AmapRequestPurpose;
  createdAt: string;
  shouldPersistRawResponse: false;
  rawResponseRetention: "discard_after_adapter";
}

/**
 * Geocode contract
 */
export interface AmapGeocodeRequestShape {
  addressHint: string;
  city?: string;
  precision?: LbsAddressPrecision;
}

export interface AmapGeocodeCandidateSummary {
  formattedAddress: string;
  coordinate: LbsCoordinate | null;
  precision: LbsAddressPrecision;
  confidence: number;
}

export interface AmapGeocodeAdapterOutput {
  boundary: AmapRequestBoundary;
  selectedCandidate: AmapGeocodeCandidateSummary | null;
  candidatesCount: number;
}

/**
 * Commute contract
 *
 * These types describe the normalized output HouseFolio is allowed to keep.
 * They intentionally do not expose raw Amap route JSON, route polyline,
 * station lists, or complete transfer details.
 */
export type AmapCommuteApiKind =
  | "direction_transit_integrated"
  | "direction_walking"
  | "direction_bicycling"
  | "direction_driving";

export type AmapCommuteStrategy =
  | "default"
  | "least_time"
  | "least_transfer"
  | "least_walking"
  | "least_cost";

export interface AmapCommuteRequestShape {
  origin: LbsCoordinate;
  destination: LbsCoordinate;
  mode: LbsTravelMode;
  city?: string;
  destinationCity?: string;
  strategy?: AmapCommuteStrategy;
  anchorName?: string;
  listingId?: string;
}

export interface AmapCommuteLegSummary {
  mode: LbsTravelMode;
  durationMinutes: number;
  distanceMeters: number;
}

export interface AmapCommuteAdapterOutput {
  boundary: AmapRequestBoundary;
  apiKind: AmapCommuteApiKind;
  mode: LbsTravelMode;
  durationMinutes: number | null;
  distanceMeters: number | null;
  legs: AmapCommuteLegSummary[];
  summary: string;
  selectedRouteIndex: number | null;
}

export interface AmapCommutePersistableSummary {
  provider: "amap";
  mode: LbsTravelMode;
  anchorName?: string;
  listingId?: string;
  durationMinutes: number;
  distanceMeters: number;
  calculatedAt: string;
}

/**
 * Nearby POI contract
 */
export interface AmapNearbyPoiRequestShape {
  center: LbsCoordinate;
  radiusMeters: number;
  categories: PoiCategory[];
}

export interface AmapPoiCategoryCountSummary {
  category: PoiCategory;
  count: number;
}

export interface AmapNearbyPoiAdapterOutput {
  boundary: AmapRequestBoundary;
  radiusMeters: number;
  categories: AmapPoiCategoryCountSummary[];
  lifeCircleScore: number | null;
}

export function createAmapRequestBoundary(purpose: AmapRequestPurpose): AmapRequestBoundary {
  return {
    provider: "amap",
    purpose,
    createdAt: new Date().toISOString(),
    shouldPersistRawResponse: false,
    rawResponseRetention: "discard_after_adapter",
  };
}