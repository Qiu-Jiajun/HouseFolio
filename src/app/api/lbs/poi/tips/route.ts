import { NextResponse } from "next/server";
import { suggestLocations } from "@/lib/lbs/service";
import { LbsProviderConfigurationError } from "@/lib/lbs/registry";
import type {
  LocationSuggestionRequestBody,
  LocationSuggestionResponseBody,
} from "@/types/location-suggestion-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_KEYWORD_LENGTH = 2;
const MAX_KEYWORD_LENGTH = 80;
const MAX_REQUEST_BODY_CHARS = 2_000;
const CITY_CODE_PATTERN = /^(?:\d{3,4}|\d{6})$/;

function createErrorResponse(message: string): LocationSuggestionResponseBody {
  return {
    suggestions: [],
    message,
  };
}

export async function POST(request: Request) {
  let body: LocationSuggestionRequestBody;

  try {
    const rawBody = await request.text();

    if (rawBody.length > MAX_REQUEST_BODY_CHARS) {
      return NextResponse.json(createErrorResponse("Request body is too large."), {
        status: 413,
      });
    }

    body = JSON.parse(rawBody) as LocationSuggestionRequestBody;
  } catch {
    return NextResponse.json(createErrorResponse("Invalid JSON body."), {
      status: 400,
    });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(createErrorResponse("Invalid request body."), {
      status: 400,
    });
  }

  const keywords =
    typeof body.keywords === "string" ? body.keywords.trim() : "";
  const city =
    body.city === undefined
      ? "010"
      : typeof body.city === "string"
        ? body.city.trim()
        : "";

  if (
    keywords.length < MIN_KEYWORD_LENGTH ||
    keywords.length > MAX_KEYWORD_LENGTH
  ) {
    return NextResponse.json(
      createErrorResponse("Location keywords must contain 2 to 80 characters."),
      { status: 400 },
    );
  }

  if (!CITY_CODE_PATTERN.test(city)) {
    return NextResponse.json(createErrorResponse("Invalid city value."), {
      status: 400,
    });
  }

  try {
    const result = await suggestLocations({
      keywords,
      city,
      cityLimit: true,
      maxResults: 8,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof LbsProviderConfigurationError) {
      return NextResponse.json(
        createErrorResponse("Location suggestion service is unavailable."),
        { status: 503 },
      );
    }

    return NextResponse.json(
      createErrorResponse("Unable to load location suggestions."),
      { status: 502 },
    );
  }
}
