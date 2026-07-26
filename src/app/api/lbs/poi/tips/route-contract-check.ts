import { POST } from "@/app/api/lbs/poi/tips/route";
import type { LocationSuggestionResponseBody } from "@/types/location-suggestion-route";

function assertLocationSuggestionRouteCheck(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`Location suggestion route check failed: ${message}`);
  }
}

async function withLbsEnvironment<T>(
  providerName: string | undefined,
  callback: () => Promise<T>,
): Promise<T> {
  const originalProviderName = process.env.LBS_PROVIDER;

  if (providerName === undefined) {
    delete process.env.LBS_PROVIDER;
  } else {
    process.env.LBS_PROVIDER = providerName;
  }

  try {
    return await callback();
  } finally {
    if (originalProviderName === undefined) {
      delete process.env.LBS_PROVIDER;
    } else {
      process.env.LBS_PROVIDER = originalProviderName;
    }
  }
}

function createRequest(keywords: unknown, city: unknown = "010"): Request {
  return new Request("http://localhost/api/lbs/poi/tips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      city,
    }),
  });
}

function assertNoSensitiveFields(body: LocationSuggestionResponseBody): void {
  const serialized = JSON.stringify(body);

  for (const forbiddenText of [
    "AMAP_API_KEY",
    "restapi.amap.com",
    "coordinate",
    "latitude",
    "longitude",
  ]) {
    assertLocationSuggestionRouteCheck(
      !serialized.includes(forbiddenText),
      `expected response not to expose ${forbiddenText}`,
    );
  }
}

async function expectMockSuccess(): Promise<void> {
  await withLbsEnvironment("mock", async () => {
    const response = await POST(createRequest("望京"));
    const body = (await response.json()) as LocationSuggestionResponseBody;

    assertLocationSuggestionRouteCheck(
      response.status === 200,
      `expected mock status 200, got ${response.status}`,
    );
    assertLocationSuggestionRouteCheck(
      body.provider === "mock" &&
        body.isMock === true &&
        body.suggestions.length === 1 &&
        body.suggestions[0]?.district === "",
      "expected truthful normalized mock suggestions",
    );
    assertNoSensitiveFields(body);
  });
}

async function expectBeijingAliasSuccess(): Promise<void> {
  await withLbsEnvironment("mock", async () => {
    for (const cityAlias of ["北京", "北京市"]) {
      const response = await POST(createRequest("望京", cityAlias));
      const body = (await response.json()) as LocationSuggestionResponseBody;

      assertLocationSuggestionRouteCheck(
        response.status === 200 &&
          body.provider === "mock" &&
          body.suggestions.length === 1,
        `expected the supported city-name alias ${cityAlias} to be accepted`,
      );
      assertNoSensitiveFields(body);
    }
  });
}

async function expectInvalidCityFailure(): Promise<void> {
  await withLbsEnvironment("mock", async () => {
    const response = await POST(createRequest("望京", "not-a-city"));
    const body = (await response.json()) as LocationSuggestionResponseBody;

    assertLocationSuggestionRouteCheck(
      response.status === 400 && body.suggestions.length === 0,
      "expected an unsupported city value to be rejected",
    );
    assertNoSensitiveFields(body);
  });
}

async function expectOversizedBodyFailure(): Promise<void> {
  await withLbsEnvironment("mock", async () => {
    const response = await POST(
      new Request("http://localhost/api/lbs/poi/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: "望京",
          city: "010",
          padding: "x".repeat(2_000),
        }),
      }),
    );
    const body = (await response.json()) as LocationSuggestionResponseBody;

    assertLocationSuggestionRouteCheck(
      response.status === 413 && body.suggestions.length === 0,
      "expected an oversized body to be rejected",
    );
    assertNoSensitiveFields(body);
  });
}

async function expectValidationFailure(): Promise<void> {
  await withLbsEnvironment("mock", async () => {
    const response = await POST(createRequest("望"));
    const body = (await response.json()) as LocationSuggestionResponseBody;

    assertLocationSuggestionRouteCheck(
      response.status === 400 && body.suggestions.length === 0,
      "expected a one-character keyword to be rejected",
    );
    assertNoSensitiveFields(body);
  });
}

async function expectConfigurationFailure(): Promise<void> {
  await withLbsEnvironment(undefined, async () => {
    const response = await POST(createRequest("望京"));
    const body = (await response.json()) as LocationSuggestionResponseBody;

    assertLocationSuggestionRouteCheck(
      response.status === 503 && body.suggestions.length === 0,
      "expected missing provider configuration to return 503",
    );
    assertNoSensitiveFields(body);
  });
}

export async function runLocationSuggestionRouteChecks(): Promise<void> {
  await expectMockSuccess();
  await expectBeijingAliasSuccess();
  await expectValidationFailure();
  await expectInvalidCityFailure();
  await expectOversizedBodyFailure();
  await expectConfigurationFailure();
}

export const locationSuggestionRouteContractCheck = {
  runner: runLocationSuggestionRouteChecks,
} as const;
