export type ListingNote = {
  id: string;
  listingId: string;
  content: string;
  createdAt: string;
};

export type ListingSubjectiveRatings = {
  listingId: string;
  light: number;
  quiet: number;
  decoration: number;
  updatedAt: string;
};