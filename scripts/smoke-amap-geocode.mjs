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

function createGeocodeUrl(address, city) {
  const apiKey = process.env.AMAP_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("AMAP_API_KEY is not configured in .env.local.");
  }

  const url = new URL("https://restapi.amap.com/v3/geocode/geo");

  url.searchParams.set("key", apiKey);
  url.searchParams.set("address", address);
  url.searchParams.set("output", "JSON");

  if (city) {
    url.searchParams.set("city", city);
  }

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

async function geocodeSample(address, city = "北京") {
  const url = createGeocodeUrl(address, city);

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for address: ${address}`);
  }

  const data = await response.json();

  if (data.status !== "1") {
    throw new Error(`Amap geocode failed for ${address}: ${data.info ?? "unknown error"}`);
  }

  const first = data.geocodes?.[0];

  if (!first) {
    return {
      address,
      city,
      matched: false,
      reason: "no candidates",
    };
  }

  return {
    address,
    city,
    matched: true,
    formattedAddress: first.formatted_address ?? null,
    level: first.level ?? null,
    coordinate: parseLocation(first.location),
  };
}

async function main() {
  loadEnvLocal();

  const provider = process.env.LBS_PROVIDER?.trim();

  if (provider !== "amap") {
    console.warn(`Warning: LBS_PROVIDER is "${provider || "not set"}", expected "amap" for this smoke test.`);
  }

  const samples = [
    { address: "望京 SOHO 附近", city: "北京" },
    { address: "五道口地铁站附近", city: "北京" },
    { address: "国贸附近", city: "北京" },
  ];

  console.log("Running Amap geocode smoke test...");
  console.log("The API key and full request URL will not be printed.");

  for (const sample of samples) {
    const result = await geocodeSample(sample.address, sample.city);
    console.log(JSON.stringify(result, null, 2));
  }

  console.log("Amap geocode smoke test finished.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});