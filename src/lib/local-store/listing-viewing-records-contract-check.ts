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
    plannedViewingAt: "2026-06-06T09:00",
    preVisitMemo: "Check elevator, noise, and deposit rules before viewing.",
  });

  const plannedTimeUpdated = saveListingViewingRecord({
    listingId: "listing-viewing-contract-check",
    plannedViewingAt: "2026-06-07T14:20",
  });

  const upserted = saveListingViewingRecord({
    listingId: "listing-viewing-contract-check",
    overallRating: 5,
    viewedAt: "2026-06-06T10:30",
  });

  const plannedTimeCleared = saveListingViewingRecord({
    listingId: "listing-viewing-contract-check",
    plannedViewingAt: undefined,
  });

  const matchedRecord = getListingViewingRecord(
    "listing-viewing-contract-check",
  );
  const allRecords = getListingViewingRecords();

  clearListingViewingRecords();

  return {
    expectedOnly,
    plannedTimeUpdated,
    upserted,
    plannedTimeCleared,
    matchedRecord,
    allRecords,
  };
}
