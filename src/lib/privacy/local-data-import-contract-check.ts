import {
  IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS,
  parseHouseFolioLocalDataImportJson,
  type HouseFolioLocalDataImportPayload,
  type ImportableHouseFolioLocalStorageKey,
} from "./local-data-import";

const sampleJson = JSON.stringify({
  data: {
    "housefolio:listings": [
      {
        id: "listing-001",
        title: "测试房源",
      },
    ],
    "housefolio:listing-notes": {
      "listing-001": "测试笔记",
    },
    "housefolio:work-locations": [
      {
        id: "anchor-001",
        name: "测试通勤锚点",
      },
    ],
    "unknown:key": "should be ignored",
  },
});

const parseResult = parseHouseFolioLocalDataImportJson(sampleJson);

if (parseResult.ok) {
  const payload: HouseFolioLocalDataImportPayload = parseResult.payload;
  const importableKeys: ImportableHouseFolioLocalStorageKey[] =
    parseResult.importableKeys;

  void payload;
  void importableKeys;
}

const allowedKeys: readonly ImportableHouseFolioLocalStorageKey[] =
  IMPORTABLE_HOUSEFOLIO_LOCAL_STORAGE_KEYS;

void allowedKeys;

export {};