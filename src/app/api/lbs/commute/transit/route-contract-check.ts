import { POST } from "@/app/api/lbs/commute/transit/route";
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

function createRequest(): Request {
  return new Request("http://localhost/api/lbs/commute/transit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listing: {
        id: "listing-1",
        title: "测试房源",
        addressHint: "测试地址",
        district: "测试区域",
      },
      workLocations: [
        {
          id: "anchor-1",
          name: "测试通勤锚点",
          addressHint: "测试锚点地址",
          createdAt: "2026-06-07T00:00:00.000Z",
          updatedAt: "2026-06-07T00:00:00.000Z",
        },
      ],
      city: "北京",
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
}

async function expectMockSuccess(): Promise<void> {
  await withLbsEnvironment("mock", undefined, async () => {
    const response = await POST(createRequest());
    const body = (await response.json()) as TransitCommuteResponseBody;

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
        body.results[0]?.isMock === true,
      "expected truthful mock commute result",
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

    assertNoSensitiveFailureText(body);
  });
}

export async function runTransitCommuteApiRouteChecks(): Promise<void> {
  await expectMockSuccess();
  await expectConfigurationFailure(undefined);
  await expectConfigurationFailure("");
  await expectConfigurationFailure("unknown");
  await expectConfigurationFailure("amap");
}

export const transitCommuteApiRouteContractCheck = {
  runner: runTransitCommuteApiRouteChecks,
} as const;
