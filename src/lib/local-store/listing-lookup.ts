import type { Listing } from "@/types/listing";
import { mockListings } from "@/lib/db/mock-listings";
import { loadLocalListings } from "@/lib/local-store/listings";
import { applyListingStatusOverrides } from "@/lib/local-store/listing-status";

export function getAllClientListings(): Listing[] {
  const listings = [...loadLocalListings(), ...mockListings];
  return applyListingStatusOverrides(listings);
}

export function findClientListingById(id: string): Listing | undefined {
  return getAllClientListings().find((listing) => listing.id === id);
}