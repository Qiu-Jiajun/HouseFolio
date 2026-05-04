export type ListingStatus =
  | "draft"
  | "watching"
  | "visited"
  | "shortlisted"
  | "rejected";

export type ListingSourcePlatform =
  | "manual"
  | "beike"
  | "58"
  | "douban"
  | "xiaohongshu"
  | "other";

export type ListingCommuteSource = "listing" | "cachedTransit";

export type Listing = {
  id: string;
  title: string;
  sourcePlatform: ListingSourcePlatform;
  sourceUrl?: string;
  rent: number;
  area: number;
  layout: string;
  addressHint: string;
  district: string;
  status: ListingStatus;
  commuteMinutes?: number;
  commuteSource?: ListingCommuteSource;
  lifeCircleScore?: number;
  compositeScore?: number;
  createdAt: string;
};
