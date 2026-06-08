import type { Listing } from "@/types/listing";

const LOCAL_LISTINGS_KEY = "housefolio:listings";

export function loadLocalListings(): Listing[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_LISTINGS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Listing[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalListing(listing: Listing) {
  if (typeof window === "undefined") {
    return;
  }

  const currentListings = loadLocalListings();
  const nextListings = [listing, ...currentListings];

  window.localStorage.setItem(
    LOCAL_LISTINGS_KEY,
    JSON.stringify(nextListings)
  );
}

export function clearLocalListings() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_LISTINGS_KEY);
}

export function deleteLocalListing(listingId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextListings = loadLocalListings().filter(
    (listing) => listing.id !== listingId
  );

  window.localStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify(nextListings));
}
