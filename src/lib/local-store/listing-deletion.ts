import { clearListingPhotos } from "@/lib/storage/photos";
import { deleteCommuteResultsForListing } from "@/lib/local-store/commute-results";
import { deleteLocalListing } from "@/lib/local-store/listings";
import {
  deleteListingNotes,
  deleteListingRatings,
} from "@/lib/local-store/listing-notes";
import { deleteListingStatusOverride } from "@/lib/local-store/listing-status";
import { deleteListingViewingRecord } from "@/lib/local-store/listing-viewing-records";

export async function deleteListingCompletely(
  listingId: string,
): Promise<void> {
  await clearListingPhotos(listingId);

  deleteCommuteResultsForListing(listingId);
  deleteListingNotes(listingId);
  deleteListingRatings(listingId);
  deleteListingStatusOverride(listingId);
  deleteListingViewingRecord(listingId);
  deleteLocalListing(listingId);
}
