import type { LbsTravelMode } from "@/lib/lbs";

export type CommuteResultProvider = "amap" | "mock";

export interface StoredCommuteResult {
  id: string;
  listingId: string;
  anchorId?: string;
  anchorName: string;
  mode: LbsTravelMode;
  provider: CommuteResultProvider;
  isMock: boolean;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
  calculatedAt: string;
}

export interface SaveCommuteResultInput {
  listingId: string;
  anchorId?: string;
  anchorName: string;
  mode: LbsTravelMode;
  provider: CommuteResultProvider;
  isMock: boolean;
  durationMinutes: number;
  distanceMeters: number;
  summary: string;
}