export const IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS = [
  "housefolio:listings",
  "housefolio:listing-notes",
  "housefolio:listing-ratings",
  "housefolio:listing-status-overrides",
  "housefolio:work-locations",
  "housefolio:commute-results",
] as const;

export type ImportableHouseFolioLocalStorageKey =
  (typeof IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS)[number];

export type HouseFolioLocalDataImportPayload = Partial<
  Record<ImportableHouseFolioLocalStorageKey, unknown>
>;

export type HouseFolioLocalDataImportParseSuccess = {
  ok: true;
  payload: HouseFolioLocalDataImportPayload;
  importableKeys: ImportableHouseFolioLocalStorageKey[];
  ignoredKeys: string[];
};

export type HouseFolioLocalDataImportParseFailure = {
  ok: false;
  reason: "invalid-json" | "invalid-shape" | "no-importable-keys";
  message: string;
};

export type HouseFolioLocalDataImportParseResult =
  | HouseFolioLocalDataImportParseSuccess
  | HouseFolioLocalDataImportParseFailure;

export type HouseFolioLocalDataImportApplyResult = {
  importedKeys: ImportableHouseFolioLocalStorageKey[];
  skippedKeys: ImportableHouseFolioLocalStorageKey[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isImportableHouseFolioKey(
  key: string,
): key is ImportableHouseFolioLocalStorageKey {
  return IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS.includes(
    key as ImportableHouseFolioLocalStorageKey,
  );
}

function extractRecordFromSnapshotItems(
  items: unknown,
): Record<string, unknown> | null {
  if (!Array.isArray(items)) {
    return null;
  }

  const record: Record<string, unknown> = {};

  for (const item of items) {
    if (!isRecord(item)) {
      continue;
    }

    if (typeof item.key !== "string") {
      continue;
    }

    if (item.exists === false) {
      continue;
    }

    record[item.key] = item.value;
  }

  return record;
}

function extractCandidateRecord(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) {
    return null;
  }

  const snapshotRecord = extractRecordFromSnapshotItems(value.items);

  if (snapshotRecord) {
    return snapshotRecord;
  }

  if (isRecord(value.data)) {
    return value.data;
  }

  if (isRecord(value.localStorage)) {
    return value.localStorage;
  }

  return value;
}

export function parseHouseFolioLocalDataImportJson(
  jsonText: string,
): HouseFolioLocalDataImportParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      ok: false,
      reason: "invalid-json",
      message: "导入文件不是有效的 JSON。",
    };
  }

  const candidateRecord = extractCandidateRecord(parsed);

  if (!candidateRecord) {
    return {
      ok: false,
      reason: "invalid-shape",
      message: "导入文件结构不符合 HouseFolio 本地数据格式。",
    };
  }

  const payload: HouseFolioLocalDataImportPayload = {};
  const importableKeys: ImportableHouseFolioLocalStorageKey[] = [];
  const ignoredKeys: string[] = [];

  for (const [key, value] of Object.entries(candidateRecord)) {
    if (isImportableHouseFolioKey(key)) {
      payload[key] = value;
      importableKeys.push(key);
    } else {
      ignoredKeys.push(key);
    }
  }

  if (importableKeys.length === 0) {
    return {
      ok: false,
      reason: "no-importable-keys",
      message: "导入文件中没有可识别的 HouseFolio 本地数据键。",
    };
  }

  return {
    ok: true,
    payload,
    importableKeys,
    ignoredKeys,
  };
}

function serializeImportedLocalStorageValue(value: unknown): string | null {
  if (typeof value === "undefined") {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

export function applyHouseFolioLocalDataImportPayload(
  payload: HouseFolioLocalDataImportPayload,
): HouseFolioLocalDataImportApplyResult {
  if (typeof window === "undefined") {
    throw new Error("HouseFolio local data import can only run in the browser.");
  }

  const importedKeys: ImportableHouseFolioLocalStorageKey[] = [];
  const skippedKeys: ImportableHouseFolioLocalStorageKey[] = [];

  for (const key of IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS) {
    if (!(key in payload)) {
      continue;
    }

    const serializedValue = serializeImportedLocalStorageValue(payload[key]);

    if (serializedValue === null) {
      skippedKeys.push(key);
      continue;
    }

    window.localStorage.setItem(key, serializedValue);
    importedKeys.push(key);
  }

  return {
    importedKeys,
    skippedKeys,
  };
}