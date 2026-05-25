export type ListingStatus =
  | "draft"
  | "watching"
  | "visited"
  | "shortlisted"
  | "rejected";

export type ListingSourcePlatform =
  | "manual"
  | "beike"
  | "lianjia"
  | "58"
  | "anjuke"
  | "woaiwojia"
  | "fangtianxia"
  | "ziroom"
  | "xiangyu"
  | "boyu"
  | "guanyu"
  | "mofang"
  | "baletu"
  | "douban"
  | "xiaohongshu"
  | "xianyu"
  | "wechat_moments"
  | "qq_group"
  | "alumni_forum"
  | "local_agency_store"
  | "landlord_direct"
  | "referral"
  | "community_notice"
  | "public_rental_platform"
  | "talent_apartment_platform"
  | "employer_school_housing"
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
