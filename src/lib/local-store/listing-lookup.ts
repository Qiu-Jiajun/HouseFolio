import type { Listing } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";
import { calculatePortfolioScores } from "@/lib/algorithm/score";
import { mockListings } from "@/lib/db/mock-listings";
import { loadLocalListings } from "@/lib/local-store/listings";
import { loadListingRatings } from "@/lib/local-store/listing-notes";
import { applyListingStatusOverrides } from "@/lib/local-store/listing-status";

function buildRatingsMap(listings: Listing[]) {
  const ratingsByListingId: Record<string, ListingSubjectiveRatings | null> =
    {};

  listings.forEach((listing) => {
    ratingsByListingId[listing.id] = loadListingRatings(listing.id);
  });

  return ratingsByListingId;
}

export function getAllClientListings(): Listing[] {
  const listings = applyListingStatusOverrides([
    ...loadLocalListings(),
    ...mockListings,
  ]);

  return calculatePortfolioScores(listings, buildRatingsMap(listings));
}

export function findClientListingById(id: string): Listing | undefined {
  return getAllClientListings().find((listing) => listing.id === id);
}