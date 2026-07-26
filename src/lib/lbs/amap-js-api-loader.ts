export type AmapLngLatInput = AmapLngLat | [number, number];

export interface AmapLngLat {
  getLng(): number;
  getLat(): number;
}

export interface AmapMapOptions {
  center?: AmapLngLatInput;
  keyboardEnable?: boolean;
  resizeEnable?: boolean;
  zoom?: number;
}

export interface AmapMap {
  add(overlay: AmapMarker | AmapMarker[]): void;
  destroy(): void;
  resize(): void;
  setCenter(center: AmapLngLatInput): void;
  setCity(city: string): void;
  setZoomAndCenter(zoom: number, center: AmapLngLatInput): void;
}

export interface AmapMarkerOptions {
  anchor?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  draggable?: boolean;
  map?: AmapMap;
  position?: AmapLngLatInput;
}

export interface AmapMarkerDragEvent {
  lnglat: AmapLngLat;
  target: AmapMarker;
  type: "dragend";
}

export interface AmapMarker {
  getPosition(): AmapLngLat | undefined;
  off(
    eventName: "dragend",
    listener: (event: AmapMarkerDragEvent) => void,
  ): void;
  on(
    eventName: "dragend",
    listener: (event: AmapMarkerDragEvent) => void,
  ): void;
  setPosition(position: AmapLngLatInput): void;
}

export interface AmapPoi {
  address?: string;
  adname?: string;
  district?: string;
  id?: string;
  location?: AmapLngLat;
  name: string;
}

export interface AmapAutoCompleteTip extends AmapPoi {
  adcode?: string;
}

export interface AmapAutoCompleteOptions {
  city?: string;
  citylimit?: boolean;
  input?: HTMLInputElement | string;
}

export interface AmapAutoCompleteResult {
  count?: number;
  tips: AmapAutoCompleteTip[];
}

export interface AmapAutoCompleteSelectEvent {
  poi: AmapAutoCompleteTip;
  type: "select";
}

export interface AmapAutoComplete {
  off(eventName: "error", listener: () => void): void;
  off(
    eventName: "select",
    listener: (event: AmapAutoCompleteSelectEvent) => void,
  ): void;
  on(eventName: "error", listener: () => void): void;
  on(
    eventName: "select",
    listener: (event: AmapAutoCompleteSelectEvent) => void,
  ): void;
  search(
    keyword: string,
    callback: (
      status: AmapServiceStatus,
      result: AmapAutoCompleteResult | string,
    ) => void,
  ): void;
}

export interface AmapPlaceSearchOptions {
  city?: string;
  citylimit?: boolean;
  map?: AmapMap;
  pageSize?: number;
}

export interface AmapPlaceSearchResult {
  poiList?: {
    count?: number;
    pois: AmapPoi[];
  };
}

export interface AmapPlaceSearch {
  search(
    keyword: string,
    callback: (
      status: AmapServiceStatus,
      result: AmapPlaceSearchResult | string,
    ) => void,
  ): void;
}

export interface AmapGeocoderOptions {
  city?: string;
  extensions?: "all" | "base";
  radius?: number;
}

export interface AmapGeocode {
  district?: string;
  formattedAddress?: string;
  location: AmapLngLat;
}

export interface AmapGeocodeResult {
  geocodes?: AmapGeocode[];
  info?: string;
}

export interface AmapAddressComponent {
  district?: string;
}

export interface AmapRegeocode {
  addressComponent?: AmapAddressComponent;
  formattedAddress?: string;
  pois?: AmapPoi[];
}

export interface AmapRegeocodeResult {
  info?: string;
  regeocode?: AmapRegeocode;
}

export interface AmapGeocoder {
  getAddress(
    location: AmapLngLatInput,
    callback: (
      status: AmapServiceStatus,
      result: AmapRegeocodeResult | string,
    ) => void,
  ): void;
  getLocation(
    keyword: string,
    callback: (
      status: AmapServiceStatus,
      result: AmapGeocodeResult | string,
    ) => void,
  ): void;
}

export type AmapServiceStatus = "complete" | "error" | "no_data";

export interface AmapJsApi {
  AutoComplete: new (
    options?: AmapAutoCompleteOptions,
  ) => AmapAutoComplete;
  Geocoder: new (options?: AmapGeocoderOptions) => AmapGeocoder;
  LngLat: new (longitude: number, latitude: number) => AmapLngLat;
  Map: new (
    container: HTMLDivElement | string,
    options?: AmapMapOptions,
  ) => AmapMap;
  Marker: new (options?: AmapMarkerOptions) => AmapMarker;
  PlaceSearch: new (
    options?: AmapPlaceSearchOptions,
  ) => AmapPlaceSearch;
}

export type AmapJsApiLoadErrorCode =
  | "client-only"
  | "invalid-api"
  | "load-failed"
  | "missing-key"
  | "timeout";

export class AmapJsApiLoadError extends Error {
  readonly code: AmapJsApiLoadErrorCode;

  constructor(code: AmapJsApiLoadErrorCode, message: string) {
    super(message);
    this.name = "AmapJsApiLoadError";
    this.code = code;
  }
}

type AmapBrowserWindow = Window & {
  AMap?: AmapJsApi;
  _AMapSecurityConfig?: {
    securityJsCode?: string;
  };
  __housefolioAmapJsApiLoadPromise?: Promise<AmapJsApi>;
};

const AMAP_SCRIPT_ID = "housefolio-amap-js-api";
const AMAP_LOAD_TIMEOUT_MS = 10_000;
const AMAP_PLUGIN_NAMES =
  "AMap.AutoComplete,AMap.PlaceSearch,AMap.Geocoder";

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function isAmapJsApi(value: unknown): value is AmapJsApi {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.Map === "function" &&
    typeof value.Marker === "function" &&
    typeof value.AutoComplete === "function" &&
    typeof value.PlaceSearch === "function" &&
    typeof value.Geocoder === "function" &&
    typeof value.LngLat === "function"
  );
}

function createScriptSource(key: string): string {
  return (
    "https://webapi.amap.com/maps" +
    `?v=2.0&key=${encodeURIComponent(key)}` +
    `&plugin=${AMAP_PLUGIN_NAMES}`
  );
}

function loadAmapScript(
  browserWindow: AmapBrowserWindow,
  key: string,
): Promise<AmapJsApi> {
  return new Promise<AmapJsApi>((resolve, reject) => {
    let script: HTMLScriptElement | null = null;
    let timeoutId: number | null = null;
    let settled = false;

    const finish = (
      outcome:
        | { api: AmapJsApi; status: "resolved" }
        | { error: AmapJsApiLoadError; status: "rejected" },
    ) => {
      if (settled) {
        return;
      }

      settled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (script) {
        script.onload = null;
        script.onerror = null;
      }

      if (outcome.status === "resolved") {
        resolve(outcome.api);
        return;
      }

      script?.remove();
      reject(outcome.error);
    };

    try {
      script = document.createElement("script");
      timeoutId = window.setTimeout(() => {
        finish({
          error: new AmapJsApiLoadError(
            "timeout",
            "高德地图 JS API 加载超时，请稍后重试。",
          ),
          status: "rejected",
        });
      }, AMAP_LOAD_TIMEOUT_MS);

      script.id = AMAP_SCRIPT_ID;
      script.async = true;
      script.src = createScriptSource(key);

      script.onload = () => {
        if (!isAmapJsApi(browserWindow.AMap)) {
          finish({
            error: new AmapJsApiLoadError(
              "invalid-api",
              "高德地图 JS API 已响应，但未提供所需能力。",
            ),
            status: "rejected",
          });
          return;
        }

        finish({ api: browserWindow.AMap, status: "resolved" });
      };

      script.onerror = () => {
        finish({
          error: new AmapJsApiLoadError(
            "load-failed",
            "高德地图 JS API 加载失败，请检查网络与域名白名单。",
          ),
          status: "rejected",
        });
      };

      browserWindow._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_JS_SECURITY_CONFIG,
      };
      document.head.appendChild(script);
    } catch {
      finish({
        error: new AmapJsApiLoadError(
          "load-failed",
          "浏览器阻止了高德地图 JS API 脚本加载。",
        ),
        status: "rejected",
      });
    }
  });
}

export function loadAmapJsApi(): Promise<AmapJsApi> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new AmapJsApiLoadError(
        "client-only",
        "高德地图 JS API 只能在浏览器中加载。",
      ),
    );
  }

  const browserWindow = window as AmapBrowserWindow;

  if (isAmapJsApi(browserWindow.AMap)) {
    return Promise.resolve(browserWindow.AMap);
  }

  if (browserWindow.__housefolioAmapJsApiLoadPromise) {
    return browserWindow.__housefolioAmapJsApiLoadPromise;
  }

  const key = process.env.NEXT_PUBLIC_AMAP_JS_API_KEY?.trim();
  if (!key) {
    return Promise.reject(
      new AmapJsApiLoadError(
        "missing-key",
        "未配置高德地图 JS API key。",
      ),
    );
  }

  const loadAttempt = loadAmapScript(browserWindow, key);
  browserWindow.__housefolioAmapJsApiLoadPromise = loadAttempt;
  void loadAttempt.catch(() => {
    if (browserWindow.__housefolioAmapJsApiLoadPromise === loadAttempt) {
      delete browserWindow.__housefolioAmapJsApiLoadPromise;
    }
  });

  return loadAttempt;
}
