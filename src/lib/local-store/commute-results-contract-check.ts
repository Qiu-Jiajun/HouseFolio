import {
  clearCommuteResults,
  deleteCommuteResult,
  deleteCommuteResultsForListing,
  getCommuteResultForListingAnchorAndMode,
  getCommuteResultsForListing,
  upsertCommuteResult,
} from "./commute-results";

export function runCommuteResultsLocalStoreContractCheck() {
  const result = upsertCommuteResult({
    listingId: "listing-contract-check",
    anchorId: "anchor-school",
    anchorName: "学校",
    mode: "transit",
    provider: "amap",
    isMock: false,
    durationMinutes: 42,
    distanceMeters: 12800,
    summary: "到「学校」公共交通约 42 分钟，路线距离约 12.8 公里",
  });

  const listingResults = getCommuteResultsForListing("listing-contract-check");

  const matchedResult = getCommuteResultForListingAnchorAndMode(
    "listing-contract-check",
    "anchor-school",
    "transit",
  );

  deleteCommuteResult(result.id);

  deleteCommuteResultsForListing("listing-contract-check");

  clearCommuteResults();

  return {
    result,
    listingResults,
    matchedResult,
  };
}