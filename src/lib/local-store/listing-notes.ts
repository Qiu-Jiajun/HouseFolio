import type {
  ListingNote,
  ListingSubjectiveRatings,
} from "@/types/listing-note";

const LOCAL_NOTES_KEY = "housefolio:listing-notes";
const LOCAL_RATINGS_KEY = "housefolio:listing-ratings";

function loadAllNotes(): ListingNote[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_NOTES_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ListingNote[]) : [];
  } catch {
    return [];
  }
}

function saveAllNotes(notes: ListingNote[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
}

export function loadListingNotes(listingId: string): ListingNote[] {
  return loadAllNotes()
    .filter((note) => note.listingId === listingId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveListingNote(note: ListingNote) {
  const currentNotes = loadAllNotes();
  saveAllNotes([note, ...currentNotes]);
}

export function deleteListingNotes(listingId: string): void {
  const nextNotes = loadAllNotes().filter(
    (note) => note.listingId !== listingId
  );

  saveAllNotes(nextNotes);
}

function loadAllRatings(): ListingSubjectiveRatings[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_RATINGS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ListingSubjectiveRatings[]) : [];
  } catch {
    return [];
  }
}

function saveAllRatings(ratings: ListingSubjectiveRatings[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(ratings));
}

export function loadListingRatings(
  listingId: string
): ListingSubjectiveRatings | null {
  return loadAllRatings().find((item) => item.listingId === listingId) ?? null;
}

export function saveListingRatings(nextRatings: ListingSubjectiveRatings) {
  const otherRatings = loadAllRatings().filter(
    (item) => item.listingId !== nextRatings.listingId
  );

  saveAllRatings([nextRatings, ...otherRatings]);
}

export function deleteListingRatings(listingId: string): void {
  const nextRatings = loadAllRatings().filter(
    (item) => item.listingId !== listingId
  );

  saveAllRatings(nextRatings);
}
