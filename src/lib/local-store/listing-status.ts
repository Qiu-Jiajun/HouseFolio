import type { Listing, ListingStatus } from "@/types/listing";

const LOCAL_LISTING_STATUS_KEY = "housefolio:listing-status-overrides";

export type ListingStatusOverride = {
  listingId: string;
  status: ListingStatus;
  updatedAt: string;
};

export function loadListingStatusOverrides(): ListingStatusOverride[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_LISTING_STATUS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ListingStatusOverride[]) : [];
  } catch {
    return [];
  }
}

export function loadListingStatusOverride(
  listingId: string
): ListingStatus | null {
  const override = loadListingStatusOverrides().find(
    (item) => item.listingId === listingId
  );

  return override?.status ?? null;
}

export function saveListingStatus(listingId: string, status: ListingStatus) {
  if (typeof window === "undefined") {
    return;
  }

  const otherOverrides = loadListingStatusOverrides().filter(
    (item) => item.listingId !== listingId
  );

  const nextOverride: ListingStatusOverride = {
    listingId,
    status,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    LOCAL_LISTING_STATUS_KEY,
    JSON.stringify([nextOverride, ...otherOverrides])
  );
}

export function applyListingStatusOverrides(listings: Listing[]): Listing[] {
  const overrides = loadListingStatusOverrides();

  return listings.map((listing) => {
    const override = overrides.find((item) => item.listingId === listing.id);

    if (!override) {
      return listing;
    }

    return {
      ...listing,
      status: override.status,
    };
  });
}