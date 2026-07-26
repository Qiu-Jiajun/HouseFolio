import { NextResponse } from "next/server";
import { calculateCommute, geocodeAddress } from "@/lib/lbs/service";
import { LbsProviderConfigurationError } from "@/lib/lbs/registry";
import type {
  GeocodeAddressResult,
  LbsTravelMode,
} from "@/lib/lbs/provider";
import type { SaveCommuteResultInput } from "@/types/commute-result";
import type {
  ResolvedCommuteLocation,
  TransitCommuteFailure,
  TransitCommuteListing,
  TransitCommuteRequestBody,
  TransitCommuteResponseBody,
  TransitCommuteWorkLocation,
} from "@/types/transit-commute-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRAVEL_MODES: LbsTravelMode[] = [
  "transit",
  "walking",
  "cycling",
  "driving",
];
const MAX_REQUEST_BODY_CHARS = 20_000;
const MAX_WORK_LOCATIONS = 3;
const MAX_ID_LENGTH = 160;
const MAX_TITLE_LENGTH = 160;
const MAX_NAME_LENGTH = 120;
const MAX_ADDRESS_HINT_LENGTH = 240;
const MAX_DISTRICT_LENGTH = 80;
const MAX_CITY_LENGTH = 32;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringWithin(value: unknown, maxLength: number): boolean {
  return isNonEmptyString(value) && value.trim().length <= maxLength;
}

function isStringWithin(value: unknown, maxLength: number): boolean {
  return typeof value === "string" && value.trim().length <= maxLength;
}

function isValidTravelMode(value: unknown): value is LbsTravelMode {
  return (
    typeof value === "string" &&
    TRAVEL_MODES.includes(value as LbsTravelMode)
  );
}

function isValidListing(value: unknown): value is TransitCommuteListing {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TransitCommuteListing>;

  return (
    isNonEmptyStringWithin(candidate.id, MAX_ID_LENGTH) &&
    isNonEmptyStringWithin(candidate.title, MAX_TITLE_LENGTH) &&
    isNonEmptyStringWithin(
      candidate.addressHint,
      MAX_ADDRESS_HINT_LENGTH,
    ) &&
    isStringWithin(candidate.district, MAX_DISTRICT_LENGTH)
  );
}

function isValidWorkLocation(
  value: unknown,
): value is TransitCommuteWorkLocation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TransitCommuteWorkLocation>;

  return (
    isNonEmptyStringWithin(candidate.id, MAX_ID_LENGTH) &&
    isNonEmptyStringWithin(candidate.name, MAX_NAME_LENGTH) &&
    isNonEmptyStringWithin(
      candidate.addressHint,
      MAX_ADDRESS_HINT_LENGTH,
    )
  );
}

function getGenericGeocodeFailureReason(): string {
  return "Unable to calculate commute from the provided address hints.";
}

function getGenericAnchorFailureReason(): string {
  return "Unable to calculate commute for this commute anchor.";
}

function getGenericConfigurationFailureReason(): string {
  return "Commute service configuration is unavailable.";
}

function createConfigurationFailureResponse(
  listing: TransitCommuteListing,
  workLocations: TransitCommuteWorkLocation[],
  mode: LbsTravelMode,
) {
  const response: TransitCommuteResponseBody = {
    results: [],
    failures: workLocations.map((workLocation) =>
      createFailure(
        getGenericConfigurationFailureReason(),
        listing,
        workLocation,
        mode,
      ),
    ),
    resolvedLocations: [],
  };

  return NextResponse.json(response, { status: 503 });
}

function createFailure(
  reason: string,
  listing?: TransitCommuteListing,
  workLocation?: TransitCommuteWorkLocation,
  mode?: LbsTravelMode,
): TransitCommuteFailure {
  return {
    listingId: listing?.id,
    anchorId: workLocation?.id,
    anchorName: workLocation?.name,
    mode,
    reason,
  };
}

function createResolvedLocation(
  kind: ResolvedCommuteLocation["kind"],
  id: string,
  name: string,
  geocode: GeocodeAddressResult,
): ResolvedCommuteLocation {
  return {
    kind,
    id,
    name,
    provider: geocode.provider,
    isMock: geocode.isMock,
    formattedAddress: geocode.formattedAddress,
    precision: geocode.precision,
    heuristicConfidence: geocode.confidence,
  };
}

function createSaveInput(
  listing: TransitCommuteListing,
  workLocation: TransitCommuteWorkLocation,
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
    const rawBody = await request.text();

    if (rawBody.length > MAX_REQUEST_BODY_CHARS) {
      const response: TransitCommuteResponseBody = {
        results: [],
        failures: [createFailure("Request body is too large.")],
        resolvedLocations: [],
      };

      return NextResponse.json(response, { status: 413 });
    }

    body = JSON.parse(rawBody) as TransitCommuteRequestBody;
  } catch {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid JSON body.")],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid request body.")],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  const listing = body.listing;
  const city = isNonEmptyString(body.city) ? body.city.trim() : "北京";
  const mode = body.mode === undefined ? "transit" : body.mode;
  const workLocations = Array.isArray(body.workLocations)
    ? body.workLocations
    : [];

  if (!isValidTravelMode(mode)) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid travel mode.")],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (city.length > MAX_CITY_LENGTH) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid city value.", undefined, undefined, mode)],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (!isValidListing(listing)) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [createFailure("Invalid listing payload.", undefined, undefined, mode)],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (
    workLocations.length > MAX_WORK_LOCATIONS ||
    !workLocations.every(isValidWorkLocation)
  ) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [
        createFailure(
          "Invalid work/study commute anchors.",
          listing,
          undefined,
          mode,
        ),
      ],
      resolvedLocations: [],
    };

    return NextResponse.json(response, { status: 400 });
  }

  const validWorkLocations = workLocations;

  if (validWorkLocations.length === 0) {
    const response: TransitCommuteResponseBody = {
      results: [],
      failures: [
        createFailure(
          "No valid work/study commute anchors found.",
          listing,
          undefined,
          mode,
        ),
      ],
      resolvedLocations: [],
    };

    return NextResponse.json(response);
  }

  const results: SaveCommuteResultInput[] = [];
  const failures: TransitCommuteFailure[] = [];
  const resolvedLocations: ResolvedCommuteLocation[] = [];

  let listingGeocode;

  try {
    listingGeocode = await geocodeAddress({
      addressHint: listing.addressHint,
      city,
    });
  } catch (error) {
    if (error instanceof LbsProviderConfigurationError) {
      return createConfigurationFailureResponse(
        listing,
        validWorkLocations,
        mode,
      );
    }

    const response: TransitCommuteResponseBody = {
      results,
      failures: validWorkLocations.map((workLocation) =>
        createFailure(
          getGenericGeocodeFailureReason(),
          listing,
          workLocation,
          mode,
        ),
      ),
      resolvedLocations,
    };

    return NextResponse.json(response, { status: 502 });
  }

  resolvedLocations.push(
    createResolvedLocation(
      "listing",
      listing.id,
      listing.title,
      listingGeocode,
    ),
  );

  for (const workLocation of validWorkLocations) {
    try {
      const anchorGeocode = await geocodeAddress({
        addressHint: workLocation.addressHint,
        city,
      });

      resolvedLocations.push(
        createResolvedLocation(
          "anchor",
          workLocation.id,
          workLocation.name,
          anchorGeocode,
        ),
      );

      const commute = await calculateCommute({
        origin: listingGeocode.coordinate,
        destination: anchorGeocode.coordinate,
        mode,
        city,
        destinationCity: city,
        anchorName: workLocation.name,
        listingId: listing.id,
      });

      results.push(createSaveInput(listing, workLocation, commute));
    } catch (error) {
      if (error instanceof LbsProviderConfigurationError) {
        return createConfigurationFailureResponse(
          listing,
          validWorkLocations,
          mode,
        );
      }

      failures.push(
        createFailure(
          getGenericAnchorFailureReason(),
          listing,
          workLocation,
          mode,
        ),
      );
    }
  }

  const response: TransitCommuteResponseBody = {
    results,
    failures,
    resolvedLocations,
  };

  return NextResponse.json(response);
}
