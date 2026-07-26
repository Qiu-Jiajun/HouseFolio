"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { locationMapPickerCopy } from "@/content/zh-cn";
import {
  loadAmapJsApi,
  type AmapAutoComplete,
  type AmapAutoCompleteSelectEvent,
  type AmapGeocoder,
  type AmapJsApi,
  type AmapLngLatInput,
  type AmapMap,
  type AmapMarker,
  type AmapMarkerDragEvent,
  type AmapPoi,
} from "@/lib/lbs/amap-js-api-loader";

type LocationMapPickerProps = {
  isOpen: boolean;
  city?: string;
  initialKeyword?: string;
  onSelect: (suggestion: {
    name: string;
    district: string;
    address: string;
  }) => void;
  onClose: () => void;
};

type SelectedLocation = {
  name: string;
  district: string;
  address: string;
};

type MapLoadStatus = "idle" | "loading" | "ready" | "error";

function normalizeText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function getGeocodeKeyword(poi: AmapPoi): string {
  return Array.from(
    new Set(
      [poi.district, poi.adname, poi.address, poi.name]
        .map((value) => normalizeText(value))
        .filter((value) => value.length > 0),
    ),
  ).join(" ");
}

function getPoiDistrict(poi: AmapPoi): string {
  return normalizeText(poi.district) || normalizeText(poi.adname);
}

export function LocationMapPicker({
  isOpen,
  city = "北京",
  initialKeyword = "",
  onSelect,
  onClose,
}: LocationMapPickerProps) {
  const reactId = useId().replaceAll(":", "");
  const titleId = `${reactId}-location-map-picker-title`;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const selectedLocationRef = useRef<SelectedLocation | null>(null);
  const sessionGenerationRef = useRef(0);
  const selectionOperationGenerationRef = useRef(0);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [loadStatus, setLoadStatus] = useState<MapLoadStatus>("idle");

  const closePicker = useCallback(() => {
    selectedLocationRef.current = null;
    setSelectedLocation(null);
    setSearchValue("");
    setLoadStatus("idle");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const mapContainer = mapContainerRef.current;
    const searchInput = searchInputRef.current;

    if (!mapContainer || !searchInput) {
      return;
    }

    const activeMapContainer: HTMLDivElement = mapContainer;
    const activeSearchInput: HTMLInputElement = searchInput;
    const sessionGeneration = ++sessionGenerationRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const focusedElement = document.activeElement;
    let isDisposed = false;
    let focusFrameId = 0;
    let amapApi: AmapJsApi | null = null;
    let map: AmapMap | null = null;
    let marker: AmapMarker | null = null;
    let markerDragListener:
      | ((event: AmapMarkerDragEvent) => void)
      | null = null;
    let autoComplete: AmapAutoComplete | null = null;
    let autoCompleteSelectListener:
      | ((event: AmapAutoCompleteSelectEvent) => void)
      | null = null;
    let autoCompleteErrorListener: (() => void) | null = null;
    let geocoder: AmapGeocoder | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let serviceProbeTimeoutId: number | null = null;
    let hasServiceFailed = false;

    const isCurrentSession = () =>
      !isDisposed && sessionGenerationRef.current === sessionGeneration;

    const beginSelectionOperation = () => {
      const operationGeneration = ++selectionOperationGenerationRef.current;
      selectedLocationRef.current = null;
      setSelectedLocation(null);
      return operationGeneration;
    };

    const isCurrentOperation = (operationGeneration: number) =>
      isCurrentSession() &&
      selectionOperationGenerationRef.current === operationGeneration;

    const failService = () => {
      if (!isCurrentSession() || hasServiceFailed) {
        return;
      }

      hasServiceFailed = true;
      if (serviceProbeTimeoutId !== null) {
        window.clearTimeout(serviceProbeTimeoutId);
        serviceProbeTimeoutId = null;
      }
      selectionOperationGenerationRef.current += 1;
      selectedLocationRef.current = null;
      setSelectedLocation(null);
      setLoadStatus("error");
    };

    const finishServiceProbe = () => {
      if (serviceProbeTimeoutId !== null) {
        window.clearTimeout(serviceProbeTimeoutId);
        serviceProbeTimeoutId = null;
      }

      if (isCurrentSession() && !hasServiceFailed) {
        setLoadStatus("ready");
      }
    };

    const updateSelection = (
      nextSelection: SelectedLocation,
      operationGeneration: number,
    ) => {
      if (!isCurrentOperation(operationGeneration)) {
        return;
      }

      selectedLocationRef.current = nextSelection;
      setSelectedLocation(nextSelection);
      setSearchValue(nextSelection.name);
    };

    const reverseGeocode = (
      location: AmapLngLatInput,
      operationGeneration: number,
    ) => {
      if (!geocoder || !isCurrentOperation(operationGeneration)) {
        return;
      }

      geocoder.getAddress(location, (status, result) => {
        if (!isCurrentOperation(operationGeneration)) {
          return;
        }

        if (status === "error") {
          failService();
          return;
        }

        if (status !== "complete" || typeof result === "string") {
          return;
        }

        const regeocode = result.regeocode;
        const nearestPoi = regeocode?.pois?.[0];
        const formattedAddress = normalizeText(regeocode?.formattedAddress);
        const previousSelection = selectedLocationRef.current;
        const name =
          normalizeText(nearestPoi?.name) ||
          formattedAddress ||
          previousSelection?.name ||
          "";

        if (!name) {
          return;
        }

        updateSelection(
          {
            name,
            district: normalizeText(regeocode?.addressComponent?.district),
            address:
              normalizeText(nearestPoi?.address) || formattedAddress || name,
          },
          operationGeneration,
        );
      });
    };

    const placeMarker = (
      location: AmapLngLatInput,
      operationGeneration: number,
    ) => {
      if (!amapApi || !map || !isCurrentOperation(operationGeneration)) {
        return;
      }

      if (marker) {
        marker.setPosition(location);
      } else {
        marker = new amapApi.Marker({
          anchor: "bottom-center",
          draggable: true,
          map,
          position: location,
        });
        markerDragListener = (event) => {
          const dragOperationGeneration = beginSelectionOperation();
          reverseGeocode(event.lnglat, dragOperationGeneration);
        };
        marker.on("dragend", markerDragListener);
      }

      map.setZoomAndCenter(16, location);
    };

    const selectPoi = (
      poi: AmapPoi,
      location: AmapLngLatInput,
      operationGeneration: number,
    ) => {
      const name = normalizeText(poi.name);

      if (!name || !isCurrentOperation(operationGeneration)) {
        return;
      }

      placeMarker(location, operationGeneration);
      updateSelection(
        {
          name,
          district: getPoiDistrict(poi),
          address: normalizeText(poi.address) || name,
        },
        operationGeneration,
      );
    };

    if (focusedElement instanceof HTMLElement) {
      previouslyFocusedElementRef.current = focusedElement;
    }

    document.body.style.overflow = "hidden";
    selectionOperationGenerationRef.current += 1;
    selectedLocationRef.current = null;
    setSelectedLocation(null);
    setSearchValue(initialKeyword);
    setLoadStatus("loading");

    focusFrameId = window.requestAnimationFrame(() => {
      if (isCurrentSession()) {
        searchInput.focus();
        searchInput.select();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closePicker();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    async function initializeMap() {
      try {
        const loadedAmapApi = await loadAmapJsApi();

        if (!isCurrentSession()) {
          return;
        }

        amapApi = loadedAmapApi;
        map = new loadedAmapApi.Map(activeMapContainer, {
          keyboardEnable: false,
          resizeEnable: true,
          zoom: 12,
        });
        map.setCity(city);
        geocoder = new loadedAmapApi.Geocoder({
          city,
          extensions: "all",
          radius: 1_000,
        });
        const placeSearch = new loadedAmapApi.PlaceSearch({
          city,
          pageSize: 1,
        });
        autoComplete = new loadedAmapApi.AutoComplete({
          city,
          input: activeSearchInput,
        });

        autoCompleteSelectListener = (event) => {
          const poi = event.poi;
          const operationGeneration = beginSelectionOperation();

          if (poi.location) {
            selectPoi(poi, poi.location, operationGeneration);
            return;
          }

          const keyword = getGeocodeKeyword(poi);

          if (!keyword || !geocoder) {
            return;
          }

          geocoder.getLocation(keyword, (status, result) => {
            if (!isCurrentOperation(operationGeneration)) {
              return;
            }

            if (status === "error") {
              failService();
              return;
            }

            if (status !== "complete" || typeof result === "string") {
              return;
            }

            const location = result.geocodes?.[0]?.location;

            if (location) {
              selectPoi(poi, location, operationGeneration);
            }
          });
        };
        autoCompleteErrorListener = failService;
        autoComplete.on("select", autoCompleteSelectListener);
        autoComplete.on("error", autoCompleteErrorListener);

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            if (isCurrentSession() && map) {
              map.resize();
            }
          });
          resizeObserver.observe(activeMapContainer);
        }

        const keyword = initialKeyword.trim();
        const initialSearchOperationGeneration = beginSelectionOperation();
        serviceProbeTimeoutId = window.setTimeout(() => {
          failService();
        }, 10_000);

        placeSearch.search(keyword || city, (status, result) => {
          if (!isCurrentSession()) {
            return;
          }

          if (status === "error") {
            failService();
            return;
          }

          finishServiceProbe();

          if (
            !keyword ||
            !isCurrentOperation(initialSearchOperationGeneration) ||
            status !== "complete" ||
            typeof result === "string"
          ) {
            return;
          }

          const poi = result.poiList?.pois[0];

          if (poi?.location) {
            selectPoi(
              poi,
              poi.location,
              initialSearchOperationGeneration,
            );
          }
        });
      } catch {
        failService();
      }
    }

    void initializeMap();

    return () => {
      isDisposed = true;

      if (sessionGenerationRef.current === sessionGeneration) {
        sessionGenerationRef.current += 1;
      }

      window.cancelAnimationFrame(focusFrameId);
      window.removeEventListener("keydown", handleKeyDown, true);
      if (serviceProbeTimeoutId !== null) {
        window.clearTimeout(serviceProbeTimeoutId);
      }
      resizeObserver?.disconnect();

      if (autoComplete && autoCompleteSelectListener) {
        autoComplete.off("select", autoCompleteSelectListener);
      }
      if (autoComplete && autoCompleteErrorListener) {
        autoComplete.off("error", autoCompleteErrorListener);
      }

      if (marker && markerDragListener) {
        marker.off("dragend", markerDragListener);
      }

      if (map) {
        map.destroy();
      }
      document.body.style.overflow = previousBodyOverflow;

      const elementToRestore = previouslyFocusedElementRef.current;
      previouslyFocusedElementRef.current = null;

      if (elementToRestore?.isConnected) {
        window.requestAnimationFrame(() => elementToRestore.focus());
      }
    };
  }, [city, closePicker, initialKeyword, isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedSummary = selectedLocation
    ? `${locationMapPickerCopy.selectedPrefix}${selectedLocation.name}${
        selectedLocation.district
          ? ` · ${selectedLocation.district}`
          : ""
      }`
    : locationMapPickerCopy.selectionHint;

  return (
    <div className="fixed inset-0 z-[89]">
      <button
        type="button"
        aria-label={locationMapPickerCopy.closeLabel}
        className="absolute inset-0 bg-[#17120d]/70"
        onClick={closePicker}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 z-[90] flex h-[85vh] flex-col overflow-hidden rounded-t-[1.5rem] border border-[#e3dacb] bg-[#fffaf2] shadow-[0_28px_90px_rgba(23,18,13,0.32)] lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:right-auto lg:top-1/2 lg:h-[70vh] lg:w-[calc(100%_-_2rem)] lg:max-w-2xl lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[1.5rem]"
      >
        <header className="shrink-0 border-b border-[#e3dacb] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2
              id={titleId}
              className="text-xl font-semibold text-[#241814]"
            >
              {locationMapPickerCopy.dialogTitle}
            </h2>
            <button
              type="button"
              aria-label={locationMapPickerCopy.closeLabel}
              onClick={closePicker}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-[#b9ab98] bg-white text-2xl leading-none text-[#423a31] transition hover:bg-[#f3eadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f5f4d]"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <label
            htmlFor={`${reactId}-location-map-search`}
            className="sr-only"
          >
            {locationMapPickerCopy.searchLabel}
          </label>
          <input
            ref={searchInputRef}
            id={`${reactId}-location-map-search`}
            value={searchValue}
            onChange={(event) => {
              selectionOperationGenerationRef.current += 1;
              selectedLocationRef.current = null;
              setSelectedLocation(null);
              setSearchValue(event.target.value);
            }}
            placeholder={locationMapPickerCopy.searchPlaceholder}
            autoComplete="off"
            disabled={loadStatus === "error"}
            className="mt-3 w-full rounded-xl border border-[#b9ab98] bg-white px-4 py-3 text-sm text-[#241814] outline-none placeholder:text-[#8b7d6d] focus:border-[#6f5f4d] focus:ring-2 focus:ring-[#d8c9b5] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </header>

        <div className="relative min-h-[320px] flex-1 bg-[#e8dfd1]">
          <div
            ref={mapContainerRef}
            tabIndex={-1}
            aria-hidden="true"
            className="h-full min-h-[320px] w-full"
          />

          {loadStatus === "loading" || loadStatus === "idle" ? (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 grid place-items-center bg-[#fffaf2]/90 px-6 text-center text-sm font-medium text-[#4b4037]"
            >
              {locationMapPickerCopy.loadingLabel}
            </div>
          ) : null}

          {loadStatus === "error" ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[#fffaf2] px-6 text-center">
              <div className="max-w-md">
                <h3 className="text-xl font-semibold text-[#241814]">
                  {locationMapPickerCopy.loadErrorTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4b4037]">
                  {locationMapPickerCopy.loadErrorBody}
                </p>
                <button
                  type="button"
                  onClick={closePicker}
                  className="mt-6 rounded-full border border-[#b9ab98] bg-white px-5 py-3 text-sm font-medium text-[#423a31] transition hover:bg-[#f3eadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f5f4d]"
                >
                  {locationMapPickerCopy.manualInputLabel}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {loadStatus !== "error" ? (
          <footer className="shrink-0 border-t border-[#e3dacb] bg-[#fffaf2] px-4 py-4 sm:px-6">
            <p
              role="status"
              aria-live="polite"
              className="text-sm leading-6 text-[#4b4037]"
            >
              {selectedSummary}
            </p>
            <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closePicker}
                className="rounded-full border border-[#b9ab98] bg-white px-5 py-3 text-sm font-medium text-[#423a31] transition hover:bg-[#f3eadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f5f4d]"
              >
                {locationMapPickerCopy.manualInputLabel}
              </button>
              <button
                type="button"
                disabled={!selectedLocation}
                onClick={() => {
                  const selection = selectedLocationRef.current;

                  if (!selection) {
                    return;
                  }

                  onSelect(selection);
                  closePicker();
                }}
                className="rounded-full bg-[#6f4b2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#583a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4b2f] disabled:cursor-not-allowed disabled:bg-[#b9ab98]"
              >
                {locationMapPickerCopy.confirmLabel}
              </button>
            </div>
          </footer>
        ) : null}
      </section>
    </div>
  );
}
