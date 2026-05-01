import type { Listing, ListingStatus } from "@/types/listing";

export type ListingStatusFilter = "all" | ListingStatus;

export type ListingSortKey =
  | "createdAtDesc"
  | "rentAsc"
  | "rentDesc"
  | "commuteAsc"
  | "scoreDesc";

export function filterListingsByStatus(
  listings: Listing[],
  statusFilter: ListingStatusFilter
): Listing[] {
  if (statusFilter === "all") {
    return listings;
  }

  return listings.filter((listing) => listing.status === statusFilter);
}

function compareOptionalNumberAsc(
  a: number | undefined,
  b: number | undefined
): number {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  return a - b;
}

function compareOptionalNumberDesc(
  a: number | undefined,
  b: number | undefined
): number {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  return b - a;
}

export function sortListings(
  listings: Listing[],
  sortKey: ListingSortKey
): Listing[] {
  const nextListings = [...listings];

  return nextListings.sort((a, b) => {
    switch (sortKey) {
      case "rentAsc":
        return a.rent - b.rent;

      case "rentDesc":
        return b.rent - a.rent;

      case "commuteAsc":
        return compareOptionalNumberAsc(a.commuteMinutes, b.commuteMinutes);

      case "scoreDesc":
        return compareOptionalNumberDesc(a.compositeScore, b.compositeScore);

      case "createdAtDesc":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}