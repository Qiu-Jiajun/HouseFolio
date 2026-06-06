export function getLocalStoreProviderName() {
  return "browser-local";
}

export {
  clearListingViewingRecords,
  getListingViewingRecord,
  getListingViewingRecords,
  LISTING_VIEWING_RECORDS_STORAGE_KEY,
  saveListingViewingRecord,
} from "@/lib/local-store/listing-viewing-records";
