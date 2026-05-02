import type {
  SaveCommuteResultInput,
  StoredCommuteResult,
} from "@/types/commute-result";

const COMMUTE_RESULTS_STORAGE_KEY = "housefolio:commute-results";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createCommuteResultId(input: SaveCommuteResultInput): string {
  const anchorPart = input.anchorId || input.anchorName;
  return `${input.listingId}:${anchorPart}:${input.mode}`;
}

function normalizeCommuteResult(input: SaveCommuteResultInput): StoredCommuteResult {
  return {
    id: createCommuteResultId(input),
    listingId: input.listingId,
    anchorId: input.anchorId,
    anchorName: input.anchorName,
    mode: input.mode,
    provider: input.provider,
    isMock: input.isMock,
    durationMinutes: input.durationMinutes,
    distanceMeters: input.distanceMeters,
    summary: input.summary,
    calculatedAt: new Date().toISOString(),
  };
}

export function loadCommuteResults(): StoredCommuteResult[] {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(COMMUTE_RESULTS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as StoredCommuteResult[];
  } catch {
    return [];
  }
}

export function saveCommuteResults(results: StoredCommuteResult[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    COMMUTE_RESULTS_STORAGE_KEY,
    JSON.stringify(results),
  );
}

export function upsertCommuteResult(input: SaveCommuteResultInput): StoredCommuteResult {
  const nextResult = normalizeCommuteResult(input);
  const existingResults = loadCommuteResults();
  const filteredResults = existingResults.filter((result) => result.id !== nextResult.id);

  saveCommuteResults([nextResult, ...filteredResults]);

  return nextResult;
}

export function deleteCommuteResult(resultId: string): void {
  const existingResults = loadCommuteResults();
  const filteredResults = existingResults.filter((result) => result.id !== resultId);

  saveCommuteResults(filteredResults);
}

export function deleteCommuteResultsForListing(listingId: string): void {
  const existingResults = loadCommuteResults();
  const filteredResults = existingResults.filter((result) => result.listingId !== listingId);

  saveCommuteResults(filteredResults);
}

export function getCommuteResultsForListing(listingId: string): StoredCommuteResult[] {
  return loadCommuteResults().filter((result) => result.listingId === listingId);
}

export function getCommuteResultForListingAnchorAndMode(
  listingId: string,
  anchorNameOrId: string,
  mode: StoredCommuteResult["mode"],
): StoredCommuteResult | null {
  return (
    loadCommuteResults().find((result) => {
      const anchorMatches =
        result.anchorId === anchorNameOrId || result.anchorName === anchorNameOrId;

      return result.listingId === listingId && anchorMatches && result.mode === mode;
    }) ?? null
  );
}

export function clearCommuteResults(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(COMMUTE_RESULTS_STORAGE_KEY);
}

export { COMMUTE_RESULTS_STORAGE_KEY };