import {
  IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS,
  parseHouseFolioLocalDataImportJson,
  type HouseFolioLocalDataImportPayload,
  type ImportableHouseFolioLocalStorageKey,
} from "./local-data-import";

const directKeyJson = JSON.stringify({
  "housefolio:listings": [
    {
      id: "listing-001",
      title: "测试房源",
    },
  ],
  "unknown:key": "should be ignored",
});

const wrappedDataJson = JSON.stringify({
  data: {
    "housefolio:listing-notes": {
      "listing-001": "测试笔记",
    },
    "housefolio:listing-viewing-records": [
      {
        listingId: "listing-001",
        expectedRating: 4,
        plannedViewingAt: "2026-06-06T09:00",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
});

const exportedSnapshotJson = JSON.stringify({
  app: "HouseFolio",
  version: "phase-1-local-demo",
  exportedAt: new Date().toISOString(),
  storageScope: "browser-localStorage",
  items: [
    {
      key: "housefolio:listings",
      label: "User-added listings",
      exists: true,
      count: 1,
      value: [
        {
          id: "listing-001",
          title: "测试房源",
        },
      ],
    },
    {
      key: "housefolio:work-locations",
      label: "Work/study locations and commute anchors",
      exists: true,
      count: 1,
      value: [
        {
          id: "anchor-001",
          name: "测试通勤锚点",
        },
      ],
    },
    {
      key: "housefolio:commute-results",
      label: "Commute result summaries",
      exists: false,
      count: 0,
      value: null,
    },
    {
      key: "unknown:key",
      label: "Unknown key",
      exists: true,
      count: 1,
      value: "should be ignored",
    },
  ],
});

const directParseResult = parseHouseFolioLocalDataImportJson(directKeyJson);
const wrappedParseResult = parseHouseFolioLocalDataImportJson(wrappedDataJson);
const snapshotParseResult =
  parseHouseFolioLocalDataImportJson(exportedSnapshotJson);

if (directParseResult.ok) {
  const payload: HouseFolioLocalDataImportPayload = directParseResult.payload;
  const importableKeys: ImportableHouseFolioLocalStorageKey[] =
    directParseResult.importableKeys;

  void payload;
  void importableKeys;
}

if (wrappedParseResult.ok) {
  const payload: HouseFolioLocalDataImportPayload = wrappedParseResult.payload;
  const importableKeys: ImportableHouseFolioLocalStorageKey[] =
    wrappedParseResult.importableKeys;

  void payload;
  void importableKeys;
}

if (snapshotParseResult.ok) {
  const payload: HouseFolioLocalDataImportPayload = snapshotParseResult.payload;
  const importableKeys: ImportableHouseFolioLocalStorageKey[] =
    snapshotParseResult.importableKeys;

  void payload;
  void importableKeys;
}

const allowedKeys: readonly ImportableHouseFolioLocalStorageKey[] =
  IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS;

void allowedKeys;

export {};
