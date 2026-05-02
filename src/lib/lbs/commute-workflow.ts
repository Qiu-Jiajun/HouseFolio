import { upsertCommuteResult } from "@/lib/local-store/commute-results";
import type { SaveCommuteResultInput, StoredCommuteResult } from "@/types/commute-result";
import type { Listing } from "@/types/listing";
import type { WorkLocation } from "@/types/work-location";
import type {
  CalculateCommuteInput,
  CalculateCommuteResult,
  GeocodeAddressInput,
  GeocodeAddressResult,
  LbsTravelMode,
} from "./provider";

export type GeocodeAddressFn = (
  input: GeocodeAddressInput,
) => Promise<GeocodeAddressResult>;

export type CalculateCommuteFn = (
  input: CalculateCommuteInput,
) => Promise<CalculateCommuteResult>;

export type CommuteWorkflowFailure = {
  listingId: string;
  anchorId?: string;
  anchorName: string;
  mode: LbsTravelMode;
  reason: string;
};

export type CalculateAndStoreCommuteResultsInput = {
  listing: Pick<Listing, "id" | "title" | "addressHint" | "district">;
  workLocations: WorkLocation[];
  mode?: LbsTravelMode;
  city?: string;
  geocodeAddress: GeocodeAddressFn;
  calculateCommute: CalculateCommuteFn;
};

export type CalculateAndStoreCommuteResultsOutput = {
  storedResults: StoredCommuteResult[];
  failures: CommuteWorkflowFailure[];
};

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown commute workflow error.";
}

function createSaveInput(
  listingId: string,
  workLocation: WorkLocation,
  commute: CalculateCommuteResult,
): SaveCommuteResultInput {
  return {
    listingId,
    anchorId: workLocation.id,
    anchorName: workLocation.name,
    mode: commute.mode,
    provider: commute.provider,
    isMock: commute.isMock,
    durationMinutes: commute.durationMinutes,
    distanceMeters: commute.distanceMeters,
    summary: commute.summary,
  };
}

export async function calculateAndStoreCommuteResults(
  input: CalculateAndStoreCommuteResultsInput,
): Promise<CalculateAndStoreCommuteResultsOutput> {
  const mode = input.mode ?? "transit";
  const city = input.city ?? "北京";
  const storedResults: StoredCommuteResult[] = [];
  const failures: CommuteWorkflowFailure[] = [];

  if (!input.listing.addressHint.trim()) {
    return {
      storedResults,
      failures: input.workLocations.map((workLocation) => ({
        listingId: input.listing.id,
        anchorId: workLocation.id,
        anchorName: workLocation.name,
        mode,
        reason: "Listing address hint is empty.",
      })),
    };
  }

  if (input.workLocations.length === 0) {
    return {
      storedResults,
      failures: [],
    };
  }

  let listingGeocode: GeocodeAddressResult;

  try {
    listingGeocode = await input.geocodeAddress({
      addressHint: input.listing.addressHint,
      city,
    });
  } catch (error) {
    return {
      storedResults,
      failures: input.workLocations.map((workLocation) => ({
        listingId: input.listing.id,
        anchorId: workLocation.id,
        anchorName: workLocation.name,
        mode,
        reason: getSafeErrorMessage(error),
      })),
    };
  }

  for (const workLocation of input.workLocations) {
    if (!workLocation.addressHint.trim()) {
      failures.push({
        listingId: input.listing.id,
        anchorId: workLocation.id,
        anchorName: workLocation.name,
        mode,
        reason: "Work/study location address hint is empty.",
      });

      continue;
    }

    try {
      const anchorGeocode = await input.geocodeAddress({
        addressHint: workLocation.addressHint,
        city,
      });

      const commute = await input.calculateCommute({
        origin: listingGeocode.coordinate,
        destination: anchorGeocode.coordinate,
        mode,
        anchorName: workLocation.name,
        listingId: input.listing.id,
      });

      const storedResult = upsertCommuteResult(
        createSaveInput(input.listing.id, workLocation, commute),
      );

      storedResults.push(storedResult);
    } catch (error) {
      failures.push({
        listingId: input.listing.id,
        anchorId: workLocation.id,
        anchorName: workLocation.name,
        mode,
        reason: getSafeErrorMessage(error),
      });
    }
  }

  return {
    storedResults,
    failures,
  };
}