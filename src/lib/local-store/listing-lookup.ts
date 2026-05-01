import type { Listing } from "@/types/listing";
import { mockListings } from "@/lib/db/mock-listings";
import { loadLocalListings } from "@/lib/local-store/listings";

export function getAllClientListings(): Listing[] {
  return [...loadLocalListings(), ...mockListings];
}

export function findClientListingById(id: string): Listing | undefined {
  return getAllClientListings().find((listing) => listing.id === id);
}
