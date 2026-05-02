export type LocalStorageItemSnapshot = {
  key: string;
  label: string;
  exists: boolean;
  count: number;
  value: unknown;
};

export type LocalHouseFolioDataExport = {
  app: "HouseFolio";
  version: "phase-1-local-demo";
  exportedAt: string;
  storageScope: "browser-localStorage";
  items: LocalStorageItemSnapshot[];
};

export const HOUSEFOLIO_LOCAL_STORAGE_KEYS = [
  {
    key: "housefolio:listings",
    label: "User-added listings",
  },
  {
    key: "housefolio:listing-notes",
    label: "Listing notes",
  },
  {
    key: "housefolio:listing-ratings",
    label: "Subjective ratings",
  },
  {
    key: "housefolio:listing-status-overrides",
    label: "Listing status overrides",
  },
] as const;

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function countValue(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length;
  }

  if (value === null || typeof value === "undefined") {
    return 0;
  }

  return 1;
}

export function getLocalHouseFolioDataSnapshot(): LocalHouseFolioDataExport {
  if (typeof window === "undefined") {
    return {
      app: "HouseFolio",
      version: "phase-1-local-demo",
      exportedAt: new Date().toISOString(),
      storageScope: "browser-localStorage",
      items: [],
    };
  }

  const items = HOUSEFOLIO_LOCAL_STORAGE_KEYS.map((item) => {
    const raw = window.localStorage.getItem(item.key);
    const parsed = raw ? safeParseJson(raw) : null;

    return {
      key: item.key,
      label: item.label,
      exists: raw !== null,
      count: countValue(parsed),
      value: parsed,
    };
  });

  return {
    app: "HouseFolio",
    version: "phase-1-local-demo",
    exportedAt: new Date().toISOString(),
    storageScope: "browser-localStorage",
    items,
  };
}

export function downloadLocalHouseFolioData() {
  if (typeof window === "undefined") {
    return;
  }

  const snapshot = getLocalHouseFolioDataSnapshot();
  const json = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `housefolio-local-data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function clearLocalHouseFolioData() {
  if (typeof window === "undefined") {
    return;
  }

  HOUSEFOLIO_LOCAL_STORAGE_KEYS.forEach((item) => {
    window.localStorage.removeItem(item.key);
  });
}