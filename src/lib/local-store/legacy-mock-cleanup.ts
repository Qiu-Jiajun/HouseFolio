import { deleteListingCompletely } from "@/lib/local-store/listing-deletion";

export const LEGACY_MOCK_LISTINGS_CLEANED_STORAGE_KEY =
  "housefolio:legacy-mock-listings-cleaned-v1";

const legacyMockListingIds = ["listing-001", "listing-002", "listing-003"];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export async function runLegacyMockListingCleanupOnce(): Promise<void> {
  if (!isBrowser()) {
    return;
  }

  if (
    window.localStorage.getItem(LEGACY_MOCK_LISTINGS_CLEANED_STORAGE_KEY) ===
    "true"
  ) {
    return;
  }

  try {
    for (const listingId of legacyMockListingIds) {
      await deleteListingCompletely(listingId);
    }

    window.localStorage.setItem(
      LEGACY_MOCK_LISTINGS_CLEANED_STORAGE_KEY,
      "true"
    );
  } catch (error) {
    console.warn("Legacy mock listing cleanup did not complete.", error);
  }
}
