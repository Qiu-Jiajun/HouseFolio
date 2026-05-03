import { NextResponse } from "next/server";
import { calculateCommute, geocodeAddress } from "@/lib/lbs/service";
import type { SaveCommuteResultInput } from "@/types/commute-result";
import type { Listing } from "@/types/listing";
import type { WorkLocation } from "@/types/work-location";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TransitCommuteListing = Pick<
  Listing,
  "id" | "title" | "addressHint" | "district"
>;

type TransitCommuteRequestBody = {
  listing?: TransitCommuteListing;
  workLocations?: WorkLocation[];
  city?: string;
};

type TransitCommuteFailure = {
  listingId?: string;
  anchorId?: string;
  anchorName?: string;
  reason: string;
};

type TransitCommuteResponseBody = {
  results: SaveCommuteResultInput[];
  failures: TransitCommuteFailure[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidListing(value: unknown): value is TransitCommuteListing {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TransitCommuteListing>;

  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.title) &&
    isNonEmptyString(candidate.addressHint) &&
    typeof candidate.district === "string"
  );
}

function isValidWorkLocation(value: unknown): value is WorkLocation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<WorkLocation>;

  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.name) &&
    isNonEmptyString(candidate.addressHint)
  );
}

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown transit commute calculation error.";
}

function createFailure(
  reason: string,
  listing?: TransitCommuteListing,
  workLocation?: WorkLocation,
): TransitCommuteFailure {
  return {
    listingId: listing?.id,
    anchorId: workLocation?.id,
    anchorName: workLocation?.name,
    reason,
  };
}

function createSaveInput(
  listing: TransitCommuteListing,
  workLocation: WorkLocation,
  commute: Awaited<ReturnType<typeof calculateCommute>>,
): SaveCommuteResultInput {
  return {
    listingId: listing.id,
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

export async function POST(request: Request) {
  let body: TransitCommuteRequestBody;

  try {
    body = (await request.json()) as TransitCommuteRequestBody;
  } catch {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid JSON body.")],
    };

    return NextResponse.json(response, { status: 400 });
  }

  const listing = body.listing;
  const city = isNonEmptyString(body.city) ? body.city.trim() : "北京";
  const workLocations = Array.isArray(body.workLocations)
    ? body.workLocations
    : [];

  if (!isValidListing(listing)) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid listing payload.")],
    };

    return NextResponse.json(response, { status: 400 });
  }

  const validWorkLocations = workLocations.filter(isValidWorkLocation);

  if (validWorkLocations.length === 0) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [
        createFailure("No valid work/study commute anchors found.", listing),
      ],
    };

    return NextResponse.json(response);
  }

  const results: SaveCommuteResultInput[] = [];
  const failures: TransitCommuteFailure[] = [];

  let listingGeocode;

  try {
    listingGeocode = await geocodeAddress({
      addressHint: listing.addressHint,
      city,
    });
  } catch (error) {
    const response: TransitCommuteResponseBody = {
      results,
      failures: validWorkLocations.map((workLocation) =>
        createFailure(getSafeErrorMessage(error), listing, workLocation),
      ),
    };

    return NextResponse.json(response, { status: 502 });
  }

  for (const workLocation of validWorkLocations) {
    try {
      const anchorGeocode = await geocodeAddress({
        addressHint: workLocation.addressHint,
        city,
      });

      const commute = await calculateCommute({
        origin: listingGeocode.coordinate,
        destination: anchorGeocode.coordinate,
        mode: "transit",
        anchorName: workLocation.name,
        listingId: listing.id,
      });

      results.push(createSaveInput(listing, workLocation, commute));
    } catch (error) {
      failures.push(
        createFailure(getSafeErrorMessage(error), listing, workLocation),
      );
    }
  }

  const response: TransitCommuteResponseBody = {
    results,
    failures,
  };

  return NextResponse.json(response);
}