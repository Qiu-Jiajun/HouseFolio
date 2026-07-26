import type { SaveCommuteResultInput } from "@/types/commute-result";
import type { Listing } from "@/types/listing";
import type { WorkLocation } from "@/types/work-location";
import type {
  LbsAddressPrecision,
  LbsProviderName,
  LbsTravelMode,
} from "@/lib/lbs/provider";

export type TransitCommuteListing = Pick<
  Listing,
  "id" | "title" | "addressHint" | "district"
>;

export type TransitCommuteWorkLocation = Pick<
  WorkLocation,
  "id" | "name" | "addressHint"
>;

export type TransitCommuteRequestBody = {
  listing?: TransitCommuteListing;
  workLocations?: TransitCommuteWorkLocation[];
  city?: string;
  mode?: LbsTravelMode;
};

export type TransitCommuteFailure = {
  listingId?: string;
  anchorId?: string;
  anchorName?: string;
  mode?: LbsTravelMode;
  reason: string;
};

export type ResolvedCommuteLocation = {
  kind: "listing" | "anchor";
  id: string;
  name: string;
  provider: LbsProviderName;
  isMock: boolean;
  formattedAddress: string;
  precision: LbsAddressPrecision;
  heuristicConfidence: number;
};

export type TransitCommuteResponseBody = {
  results: SaveCommuteResultInput[];
  failures: TransitCommuteFailure[];
  resolvedLocations: ResolvedCommuteLocation[];
};
