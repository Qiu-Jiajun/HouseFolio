export type ListingStatus = "draft" | "watching" | "visited" | "shortlisted" | "rejected";

export type Listing = {
  id: string;
  title: string;
  rent?: number;
  area?: number;
  sourceUrl?: string;
  status: ListingStatus;
};
