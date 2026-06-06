export type ListingViewingRecord = {
  listingId: string;
  expectedRating?: number;
  overallRating?: number;
  preVisitMemo?: string;
  postVisitImpression?: string;
  viewedAt?: string;
  updatedAt: string;
};
