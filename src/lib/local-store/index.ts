export function getLocalStoreProviderName() {
  return "browser-local";
}

export { deleteListingCompletely } from "@/lib/local-store/listing-deletion";
export {
  LEGACY_MOCK_LISTINGS_CLEANED_STORAGE_KEY,
  runLegacyMockListingCleanupOnce,
} from "@/lib/local-store/legacy-mock-cleanup";

export {
  clearListingViewingRecords,
  deleteListingViewingRecord,
  getListingViewingRecord,
  getListingViewingRecords,
  LISTING_VIEWING_RECORDS_STORAGE_KEY,
  saveListingViewingRecord,
} from "@/lib/local-store/listing-viewing-records";
