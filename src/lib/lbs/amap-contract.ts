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

export interface AmapCommuteRequestShape {
  origin: LbsCoordinate;
  destination: LbsCoordinate;
  mode: LbsTravelMode;
  anchorName?: string;
}

export interface AmapCommuteAdapterOutput {
  boundary: AmapRequestBoundary;
  mode: LbsTravelMode;
  durationMinutes: number | null;
  distanceMeters: number | null;
  summary: string;
}

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