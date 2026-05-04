import type { SaveCommuteResultInput } from "@/types/commute-result";
import type { Listing } from "@/types/listing";
import type { WorkLocation } from "@/types/work-location";

export type TransitCommuteListing = Pick<
  Listing,
  "id" | "title" | "addressHint" | "district"
>;

export type TransitCommuteRequestBody = {
  listing?: TransitCommuteListing;
  workLocations?: WorkLocation[];
  city?: string;
};

export type TransitCommuteFailure = {
  listingId?: string;
  anchorId?: string;
  anchorName?: string;
  reason: string;
};

export type TransitCommuteResponseBody = {
  results: SaveCommuteResultInput[];
  failures: TransitCommuteFailure[];
};