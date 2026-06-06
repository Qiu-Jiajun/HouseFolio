import type { ListingViewingRecord } from "@/types/listing-viewing-record";

export const LISTING_VIEWING_RECORDS_STORAGE_KEY =
  "housefolio:listing-viewing-records";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRating(value: unknown): number | undefined {
  if (typeof value !== "number") {
    return undefined;
  }

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return undefined;
  }

  return value;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function normalizeListingViewingRecord(
  value: unknown,
): ListingViewingRecord | null {
  if (!isRecord(value) || typeof value.listingId !== "string") {
    return null;
  }

  const listingId = value.listingId.trim();

  if (!listingId) {
    return null;
  }

  return {
    listingId,
    expectedRating: normalizeRating(value.expectedRating),
    overallRating: normalizeRating(value.overallRating),
    preVisitMemo: normalizeOptionalString(value.preVisitMemo),
    postVisitImpression: normalizeOptionalString(value.postVisitImpression),
    viewedAt: normalizeOptionalString(value.viewedAt),
    updatedAt:
      normalizeOptionalString(value.updatedAt) ?? new Date(0).toISOString(),
  };
}

function saveListingViewingRecords(records: ListingViewingRecord[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    LISTING_VIEWING_RECORDS_STORAGE_KEY,
    JSON.stringify(records),
  );
}

export function getListingViewingRecords(): ListingViewingRecord[] {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(
    LISTING_VIEWING_RECORDS_STORAGE_KEY,
  );

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const recordsByListingId = new Map<string, ListingViewingRecord>();

    for (const item of parsed) {
      const normalizedRecord = normalizeListingViewingRecord(item);

      if (!normalizedRecord) {
        continue;
      }

      if (!recordsByListingId.has(normalizedRecord.listingId)) {
        recordsByListingId.set(normalizedRecord.listingId, normalizedRecord);
      }
    }

    return Array.from(recordsByListingId.values());
  } catch {
    return [];
  }
}

export function getListingViewingRecord(
  listingId: string,
): ListingViewingRecord | null {
  return (
    getListingViewingRecords().find((record) => record.listingId === listingId) ??
    null
  );
}

function mergeListingViewingRecord(
  existingRecord: ListingViewingRecord | null,
  nextRecord: Omit<ListingViewingRecord, "updatedAt"> &
    Partial<Pick<ListingViewingRecord, "updatedAt">>,
): ListingViewingRecord {
  const mergedRecord: ListingViewingRecord = {
    ...(existingRecord ?? {
      listingId: nextRecord.listingId,
      updatedAt: new Date(0).toISOString(),
    }),
    listingId: nextRecord.listingId,
    updatedAt: new Date().toISOString(),
  };

  if ("expectedRating" in nextRecord) {
    mergedRecord.expectedRating = nextRecord.expectedRating;
  }

  if ("overallRating" in nextRecord) {
    mergedRecord.overallRating = nextRecord.overallRating;
  }

  if ("preVisitMemo" in nextRecord) {
    mergedRecord.preVisitMemo = nextRecord.preVisitMemo;
  }

  if ("postVisitImpression" in nextRecord) {
    mergedRecord.postVisitImpression = nextRecord.postVisitImpression;
  }

  if ("viewedAt" in nextRecord) {
    mergedRecord.viewedAt = nextRecord.viewedAt;
  }

  return mergedRecord;
}

export function saveListingViewingRecord(
  nextRecord: Omit<ListingViewingRecord, "updatedAt"> &
    Partial<Pick<ListingViewingRecord, "updatedAt">>,
): ListingViewingRecord {
  const listingId = nextRecord.listingId.trim();

  if (!listingId) {
    throw new Error("listingId is required.");
  }

  const currentRecords = getListingViewingRecords();
  const existingRecord =
    currentRecords.find((record) => record.listingId === listingId) ?? null;
  const mergedRecord = mergeListingViewingRecord(existingRecord, {
    ...nextRecord,
    listingId,
  });
  const otherRecords = currentRecords.filter(
    (record) => record.listingId !== listingId,
  );

  saveListingViewingRecords([mergedRecord, ...otherRecords]);

  return mergedRecord;
}

export function clearListingViewingRecords(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(LISTING_VIEWING_RECORDS_STORAGE_KEY);
}
