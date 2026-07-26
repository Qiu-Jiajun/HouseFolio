import { POST } from "@/app/api/lbs/commute/transit/route";
import type { LbsTravelMode } from "@/lib/lbs/provider";
import type { TransitCommuteResponseBody } from "@/types/transit-commute-route";

function assertTransitCommuteRouteCheck(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `Transit commute API route check failed: ${message}`,
    );
  }
}

async function withLbsEnvironment<T>(
  providerName: string | undefined,
  amapApiKey: string | undefined,
  callback: () => Promise<T>,
): Promise<T> {
  const originalProviderName = process.env.LBS_PROVIDER;
  const originalAmapApiKey = process.env.AMAP_API_KEY;

  if (providerName === undefined) {
    delete process.env.LBS_PROVIDER;
  } else {
    process.env.LBS_PROVIDER = providerName;
  }

  if (amapApiKey === undefined) {
    delete process.env.AMAP_API_KEY;
  } else {
    process.env.AMAP_API_KEY = amapApiKey;
  }

  try {
    return await callback();
  } finally {
    if (originalProviderName === undefined) {
      delete process.env.LBS_PROVIDER;
    } else {
      process.env.LBS_PROVIDER = originalProviderName;
    }

    if (originalAmapApiKey === undefined) {
      delete process.env.AMAP_API_KEY;
    } else {
      process.env.AMAP_API_KEY = originalAmapApiKey;
    }
  }
}

function createRequest(
  mode?: unknown,
  overrides?: {
    listing?: unknown;
    workLocations?: unknown;
    city?: unknown;
  },
): Request {
  return new Request("http://localhost/api/lbs/commute/transit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listing:
        overrides?.listing ??
        {
          id: "listing-1",
          title: "测试房源",
          addressHint: "测试地址",
          district: "测试区域",
        },
      workLocations:
        overrides?.workLocations ??
        [
          {
            id: "anchor-1",
            name: "测试通勤锚点",
            addressHint: "测试锚点地址",
          },
        ],
      city: overrides?.city ?? "北京",
      ...(mode === undefined ? {} : { mode }),
    }),
  });
}

function assertNoSensitiveFailureText(
  body: TransitCommuteResponseBody,
): void {
  const serialized = JSON.stringify(body);

  assertTransitCommuteRouteCheck(
    !serialized.includes("AMAP_API_KEY"),
    "expected response not to expose AMAP_API_KEY",
  );

  assertTransitCommuteRouteCheck(
    !serialized.includes("restapi.amap.com"),
    "expected response not to expose Amap URL",
  );

  assertTransitCommuteRouteCheck(
    !serialized.includes("coordinate"),
    "expected response not to expose coordinates",
  );

  assertTransitCommuteRouteCheck(
    !serialized.includes("latitude") && !serialized.includes("longitude"),
    "expected response not to expose latitude or longitude",
  );
}

async function expectMockSuccess(mode?: LbsTravelMode): Promise<void> {
  await withLbsEnvironment("mock", undefined, async () => {
    const response = await POST(createRequest(mode));
    const body = (await response.json()) as TransitCommuteResponseBody;
    const expectedMode = mode ?? "transit";

    assertTransitCommuteRouteCheck(
      response.status === 200,
      `expected mock status 200, got ${response.status}`,
    );

    assertTransitCommuteRouteCheck(
      body.results.length === 1,
      "expected one mock commute result",
    );

    assertTransitCommuteRouteCheck(
      body.results[0]?.provider === "mock" &&
        body.results[0]?.isMock === true &&
        body.results[0]?.mode === expectedMode,
      "expected truthful mock commute result",
    );

    assertTransitCommuteRouteCheck(
      body.resolvedLocations.length === 2 &&
        body.resolvedLocations.every(
          (location) =>
            location.provider === "mock" &&
            location.isMock === true &&
            Number.isFinite(location.heuristicConfidence),
        ),
      "expected safe resolved location summaries",
    );

    assertNoSensitiveFailureText(body);
  });
}

async function expectConfigurationFailure(
  providerName: string | undefined,
): Promise<void> {
  await withLbsEnvironment(providerName, undefined, async () => {
    const response = await POST(createRequest());
    const body = (await response.json()) as TransitCommuteResponseBody;

    assertTransitCommuteRouteCheck(
      response.status === 503,
      `expected ${String(providerName)} status 503, got ${response.status}`,
    );

    assertTransitCommuteRouteCheck(
      body.results.length === 0,
      "expected configuration failure not to return results",
    );

    assertTransitCommuteRouteCheck(
      body.failures.length === 1,
      "expected one configuration failure",
    );

    assertTransitCommuteRouteCheck(
      body.failures[0]?.reason ===
        "Commute service configuration is unavailable.",
      "expected safe configuration failure reason",
    );

    assertTransitCommuteRouteCheck(
      body.resolvedLocations.length === 0,
      "expected configuration failure not to resolve locations",
    );

    assertNoSensitiveFailureText(body);
  });
}

async function expectInvalidModeFailure(): Promise<void> {
  await withLbsEnvironment("mock", undefined, async () => {
    const response = await POST(createRequest("flying"));
    const body = (await response.json()) as TransitCommuteResponseBody;

    assertTransitCommuteRouteCheck(
      response.status === 400,
      `expected invalid mode status 400, got ${response.status}`,
    );

    assertTransitCommuteRouteCheck(
      body.results.length === 0 &&
        body.failures[0]?.reason === "Invalid travel mode.",
      "expected invalid mode to be rejected",
    );

    assertNoSensitiveFailureText(body);
  });
}

async function expectRequestBoundaryFailure(
  request: Request,
  expectedStatus: number,
  expectedReason: string,
): Promise<void> {
  await withLbsEnvironment("mock", undefined, async () => {
    const response = await POST(request);
    const body = (await response.json()) as TransitCommuteResponseBody;

    assertTransitCommuteRouteCheck(
      response.status === expectedStatus,
      `expected request boundary status ${expectedStatus}, got ${response.status}`,
    );
    assertTransitCommuteRouteCheck(
      body.results.length === 0 &&
        body.failures[0]?.reason === expectedReason,
      `expected request boundary failure: ${expectedReason}`,
    );
    assertNoSensitiveFailureText(body);
  });
}

export async function runTransitCommuteApiRouteChecks(): Promise<void> {
  await expectMockSuccess();
  await expectMockSuccess("transit");
  await expectMockSuccess("walking");
  await expectMockSuccess("cycling");
  await expectMockSuccess("driving");
  await expectInvalidModeFailure();
  await expectRequestBoundaryFailure(
    createRequest(undefined, {
      workLocations: Array.from({ length: 4 }, (_, index) => ({
        id: `anchor-${index}`,
        name: `测试通勤锚点 ${index}`,
        addressHint: `测试锚点地址 ${index}`,
      })),
    }),
    400,
    "Invalid work/study commute anchors.",
  );
  await expectRequestBoundaryFailure(
    createRequest(undefined, {
      listing: {
        id: "listing-1",
        title: "x".repeat(161),
        addressHint: "测试地址",
        district: "测试区域",
      },
    }),
    400,
    "Invalid listing payload.",
  );
  await expectRequestBoundaryFailure(
    createRequest(undefined, {
      city: "x".repeat(33),
    }),
    400,
    "Invalid city value.",
  );
  await expectConfigurationFailure(undefined);
  await expectConfigurationFailure("");
  await expectConfigurationFailure("unknown");
  await expectConfigurationFailure("amap");
}

export const transitCommuteApiRouteContractCheck = {
  runner: runTransitCommuteApiRouteChecks,
} as const;
