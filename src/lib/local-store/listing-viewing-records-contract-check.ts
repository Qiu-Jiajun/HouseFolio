import {
  clearListingViewingRecords,
  getListingViewingRecord,
  getListingViewingRecords,
  saveListingViewingRecord,
} from "./listing-viewing-records";

export function runListingViewingRecordsLocalStoreContractCheck() {
  clearListingViewingRecords();

  const expectedOnly = saveListingViewingRecord({
    listingId: "listing-viewing-contract-check",
    expectedRating: 4,
    preVisitMemo: "周末看房前确认电梯和噪音。",
  });

  const upserted = saveListingViewingRecord({
    listingId: "listing-viewing-contract-check",
    overallRating: 5,
    viewedAt: "2026-06-06T10:30",
  });

  const matchedRecord = getListingViewingRecord(
    "listing-viewing-contract-check",
  );
  const allRecords = getListingViewingRecords();

  clearListingViewingRecords();

  return {
    expectedOnly,
    upserted,
    matchedRecord,
    allRecords,
  };
}
