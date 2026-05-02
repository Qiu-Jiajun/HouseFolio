import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found. Create it locally and do not commit it.");
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getAmapApiKey() {
  const apiKey = process.env.AMAP_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("AMAP_API_KEY is not configured in .env.local.");
  }

  return apiKey;
}

function parseLocation(location) {
  if (!location) {
    return null;
  }

  const [longitudeText, latitudeText] = location.split(",");
  const longitude = Number(longitudeText);
  const latitude = Number(latitudeText);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function parsePositiveNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function formatCoordinate(coordinate) {
  return `${coordinate.longitude},${coordinate.latitude}`;
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${label} request failed with HTTP ${response.status}.`);
  }

  return response.json();
}

function createGeocodeUrl(address, city = "北京") {
  const url = new URL("https://restapi.amap.com/v3/geocode/geo");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("address", address);
  url.searchParams.set("city", city);
  url.searchParams.set("output", "JSON");

  return url;
}

async function geocodeAddress(address, city = "北京") {
  const data = await fetchJson(createGeocodeUrl(address, city), `Geocode for ${address}`);

  if (data.status !== "1") {
    throw new Error(
      `Geocode failed for ${address}: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"})`,
    );
  }

  const first = data.geocodes?.[0];

  if (!first) {
    throw new Error(`Geocode returned no candidates for ${address}.`);
  }

  const coordinate = parseLocation(first.location);

  if (!coordinate) {
    throw new Error(`Geocode returned invalid coordinate for ${address}.`);
  }

  return {
    address,
    formattedAddress: first.formatted_address ?? address,
    level: first.level ?? null,
    coordinate,
  };
}

function createTransitUrl(origin, destination) {
  const url = new URL("https://restapi.amap.com/v3/direction/transit/integrated");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(origin));
  url.searchParams.set("destination", formatCoordinate(destination));
  url.searchParams.set("city", "北京");
  url.searchParams.set("cityd", "北京");
  url.searchParams.set("extensions", "base");
  url.searchParams.set("strategy", "0");
  url.searchParams.set("output", "JSON");

  return url;
}

function createWalkingUrl(origin, destination) {
  const url = new URL("https://restapi.amap.com/v3/direction/walking");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(origin));
  url.searchParams.set("destination", formatCoordinate(destination));
  url.searchParams.set("output", "JSON");

  return url;
}

function createCyclingUrl(origin, destination) {
  const url = new URL("https://restapi.amap.com/v4/direction/bicycling");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(origin));
  url.searchParams.set("destination", formatCoordinate(destination));
  url.searchParams.set("output", "JSON");

  return url;
}

function createDrivingUrl(origin, destination) {
  const url = new URL("https://restapi.amap.com/v3/direction/driving");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", formatCoordinate(origin));
  url.searchParams.set("destination", formatCoordinate(destination));
  url.searchParams.set("extensions", "base");
  url.searchParams.set("strategy", "0");
  url.searchParams.set("output", "JSON");

  return url;
}

function toSummary(mode, anchorName, durationSeconds, distanceMeters) {
  const durationMinutes = Math.ceil(durationSeconds / 60);

  const modeText = {
    transit: "公共交通",
    walking: "步行",
    cycling: "骑行",
    driving: "驾车",
  }[mode];

  return {
    anchorName,
    matched: true,
    mode,
    durationMinutes,
    distanceMeters: Math.round(distanceMeters),
    summary: `到「${anchorName}」${modeText}约 ${durationMinutes} 分钟，路线距离约 ${(distanceMeters / 1000).toFixed(1)} 公里`,
  };
}

async function calculateTransit(origin, destination, anchorName) {
  const data = await fetchJson(createTransitUrl(origin, destination), "Transit commute");

  if (data.status !== "1") {
    throw new Error(`Transit failed: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"})`);
  }

  const firstTransit = data.route?.transits?.[0];

  if (!firstTransit) {
    return { anchorName, matched: false, mode: "transit", reason: "no transit candidates" };
  }

  const durationSeconds = parsePositiveNumber(firstTransit.duration);
  const distanceMeters = parsePositiveNumber(firstTransit.distance) ?? parsePositiveNumber(data.route?.distance);

  if (!durationSeconds || !distanceMeters) {
    throw new Error("Transit returned invalid duration or distance.");
  }

  return toSummary("transit", anchorName, durationSeconds, distanceMeters);
}

async function calculateWalking(origin, destination, anchorName) {
  const data = await fetchJson(createWalkingUrl(origin, destination), "Walking commute");

  if (data.status !== "1") {
    throw new Error(`Walking failed: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"})`);
  }

  const firstPath = data.route?.paths?.[0];

  if (!firstPath) {
    return { anchorName, matched: false, mode: "walking", reason: "no walking candidates" };
  }

  const durationSeconds = parsePositiveNumber(firstPath.duration);
  const distanceMeters = parsePositiveNumber(firstPath.distance);

  if (!durationSeconds || !distanceMeters) {
    throw new Error("Walking returned invalid duration or distance.");
  }

  return toSummary("walking", anchorName, durationSeconds, distanceMeters);
}

async function calculateCycling(origin, destination, anchorName) {
  const data = await fetchJson(createCyclingUrl(origin, destination), "Cycling commute");

  if (data.errcode !== 0) {
    throw new Error(`Cycling failed: ${data.errmsg ?? "unknown error"} (${data.errcode ?? "no errcode"})`);
  }

  const firstPath = data.data?.paths?.[0];

  if (!firstPath) {
    return { anchorName, matched: false, mode: "cycling", reason: "no cycling candidates" };
  }

  const durationSeconds = parsePositiveNumber(firstPath.duration);
  const distanceMeters = parsePositiveNumber(firstPath.distance);

  if (!durationSeconds || !distanceMeters) {
    throw new Error("Cycling returned invalid duration or distance.");
  }

  return toSummary("cycling", anchorName, durationSeconds, distanceMeters);
}

async function calculateDriving(origin, destination, anchorName) {
  const data = await fetchJson(createDrivingUrl(origin, destination), "Driving commute");

  if (data.status !== "1") {
    throw new Error(`Driving failed: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"})`);
  }

  const firstPath = data.route?.paths?.[0];

  if (!firstPath) {
    return { anchorName, matched: false, mode: "driving", reason: "no driving candidates" };
  }

  const durationSeconds = parsePositiveNumber(firstPath.duration);
  const distanceMeters = parsePositiveNumber(firstPath.distance);

  if (!durationSeconds || !distanceMeters) {
    throw new Error("Driving returned invalid duration or distance.");
  }

  return toSummary("driving", anchorName, durationSeconds, distanceMeters);
}

async function main() {
  loadEnvLocal();

  const provider = process.env.LBS_PROVIDER?.trim();

  if (provider !== "amap") {
    console.warn(`Warning: LBS_PROVIDER is "${provider || "not set"}", expected "amap" for this smoke test.`);
  }

  console.log("Running Amap multi-mode commute smoke test...");
  console.log("The API key, full request URLs, and raw Amap responses will not be printed.");

  const cases = [
    {
      origin: "望京 SOHO 附近",
      destination: "国贸附近",
      anchorName: "伴侣公司",
      city: "北京",
    },
    {
      origin: "五道口地铁站附近",
      destination: "北京大学东门附近",
      anchorName: "学校",
      city: "北京",
    },
  ];

  for (const item of cases) {
    const origin = await geocodeAddress(item.origin, item.city);
    const destination = await geocodeAddress(item.destination, item.city);

    const results = [];

    for (const mode of ["transit", "walking", "cycling", "driving"]) {
      try {
        const result =
          mode === "transit"
            ? await calculateTransit(origin.coordinate, destination.coordinate, item.anchorName)
            : mode === "walking"
              ? await calculateWalking(origin.coordinate, destination.coordinate, item.anchorName)
              : mode === "cycling"
                ? await calculateCycling(origin.coordinate, destination.coordinate, item.anchorName)
                : await calculateDriving(origin.coordinate, destination.coordinate, item.anchorName);

        results.push(result);
      } catch (error) {
        results.push({
          anchorName: item.anchorName,
          matched: false,
          mode,
          reason: error instanceof Error ? error.message : "unknown error",
        });
      }
    }

    console.log("Multi-mode commute:");
    console.log(JSON.stringify(
      {
        origin: origin.formattedAddress,
        destination: destination.formattedAddress,
        anchorName: item.anchorName,
        results,
      },
      null,
      2,
    ));
  }

  console.log("Amap multi-mode commute smoke test finished.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});