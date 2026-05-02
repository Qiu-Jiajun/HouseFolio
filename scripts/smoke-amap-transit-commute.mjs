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

function createGeocodeUrl(address, city = "北京") {
  const url = new URL("https://restapi.amap.com/v3/geocode/geo");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("address", address);
  url.searchParams.set("city", city);
  url.searchParams.set("output", "JSON");

  return url;
}

function createTransitUrl(origin, destination, city = "北京", cityd = "北京") {
  const url = new URL("https://restapi.amap.com/v3/direction/transit/integrated");

  url.searchParams.set("key", getAmapApiKey());
  url.searchParams.set("origin", `${origin.longitude},${origin.latitude}`);
  url.searchParams.set("destination", `${destination.longitude},${destination.latitude}`);
  url.searchParams.set("city", city);
  url.searchParams.set("cityd", cityd);
  url.searchParams.set("extensions", "base");
  url.searchParams.set("strategy", "0");
  url.searchParams.set("output", "JSON");

  return url;
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

  return {
    latitude,
    longitude,
  };
}

function parsePositiveNumber(value) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
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

async function geocodeAddress(address, city = "北京") {
  const url = createGeocodeUrl(address, city);
  const data = await fetchJson(url, `Geocode for ${address}`);

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

async function calculateTransitCommute(origin, destination, anchorName) {
  const url = createTransitUrl(origin.coordinate, destination.coordinate);
  const data = await fetchJson(url, `Transit commute to ${anchorName}`);

  if (data.status !== "1") {
    throw new Error(
      `Transit failed for ${anchorName}: ${data.info ?? "unknown error"} (${data.infocode ?? "no infocode"})`,
    );
  }

  const firstTransit = data.route?.transits?.[0];

  if (!firstTransit) {
    return {
      anchorName,
      matched: false,
      reason: "no transit candidates",
    };
  }

  const durationSeconds = parsePositiveNumber(firstTransit.duration);
  const distanceMeters =
    parsePositiveNumber(firstTransit.distance) ?? parsePositiveNumber(data.route?.distance);

  if (!durationSeconds || !distanceMeters) {
    throw new Error(`Transit returned invalid duration or distance for ${anchorName}.`);
  }

  const durationMinutes = Math.ceil(durationSeconds / 60);

  return {
    anchorName,
    matched: true,
    origin: origin.formattedAddress,
    destination: destination.formattedAddress,
    mode: "transit",
    durationMinutes,
    distanceMeters: Math.round(distanceMeters),
    summary: `到「${anchorName}」公共交通约 ${durationMinutes} 分钟，路线距离约 ${(distanceMeters / 1000).toFixed(1)} 公里`,
  };
}

async function main() {
  loadEnvLocal();

  const provider = process.env.LBS_PROVIDER?.trim();

  if (provider !== "amap") {
    console.warn(`Warning: LBS_PROVIDER is "${provider || "not set"}", expected "amap" for this smoke test.`);
  }

  console.log("Running Amap transit commute smoke test...");
  console.log("The API key, full request URL, and raw Amap response will not be printed.");

  const listing = await geocodeAddress("望京 SOHO 附近", "北京");

  const anchors = [
    {
      anchorName: "伴侣公司",
      address: "国贸附近",
      city: "北京",
    },
    {
      anchorName: "学校",
      address: "五道口地铁站附近",
      city: "北京",
    },
  ];

  console.log("Origin:");
  console.log(JSON.stringify(listing, null, 2));

  for (const anchor of anchors) {
    const destination = await geocodeAddress(anchor.address, anchor.city);
    const commute = await calculateTransitCommute(listing, destination, anchor.anchorName);

    console.log("Commute:");
    console.log(JSON.stringify(commute, null, 2));
  }

  console.log("Amap transit commute smoke test finished.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});