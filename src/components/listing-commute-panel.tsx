"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  getCommuteResultsForListing,
  upsertCommuteResult,
} from "@/lib/local-store/commute-results";
import { loadWorkLocations } from "@/lib/local-store/work-locations";
import type {
  LbsTravelMode,
} from "@/lib/lbs/provider";
import type { StoredCommuteResult } from "@/types/commute-result";
import type { ListingCommuteSource } from "@/types/listing";
import type {
  ResolvedCommuteLocation,
  TransitCommuteResponseBody,
} from "@/types/transit-commute-route";
import type { WorkLocation } from "@/types/work-location";

type ListingCommutePanelProps = {
  listingId: string;
  listingTitle: string;
  addressHint: string;
  district: string;
  commuteMinutes?: number;
  commuteSource?: ListingCommuteSource;
  lifeCircleScore?: number;
};

function formatOptionalNumber(value: number | undefined, suffix = "") {
  return typeof value === "number"
    ? `${value.toFixed(1)}${suffix}`
    : zhCN.common.pending;
}

function formatCalculatedAt(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDistanceMeters(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} ${zhCN.listingDetailView.l1.kilometer}`;
  }

  return `${Math.round(value)} ${zhCN.listingDetailView.l1.meter}`;
}

function formatCommuteSource(source: ListingCommuteSource | undefined): string | null {
  if (source === "cachedTransit") {
    return zhCN.listingDetailView.l1.commuteSource.cachedTransit;
  }

  if (source === "listing") {
    return zhCN.listingDetailView.l1.commuteSource.listing;
  }

  return null;
}

const TRAVEL_MODES: LbsTravelMode[] = [
  "transit",
  "walking",
  "cycling",
  "driving",
];

function formatTravelMode(mode: LbsTravelMode): string {
  if (mode === "transit") {
    return zhCN.listingDetailView.l1.modeTransit;
  }

  if (mode === "walking") {
    return zhCN.listingDetailView.l1.modeWalking;
  }

  if (mode === "cycling") {
    return zhCN.listingDetailView.l1.modeCycling;
  }

  if (mode === "driving") {
    return zhCN.listingDetailView.l1.modeDriving;
  }

  return mode;
}

function formatPrecision(
  precision: ResolvedCommuteLocation["precision"],
): string {
  return zhCN.listingDetailView.l1.resolvedLocations.precisionLabels[precision];
}

function reloadCommuteResults(listingId: string): StoredCommuteResult[] {
  return getCommuteResultsForListing(listingId);
}

export function ListingCommutePanel({
  listingId,
  listingTitle,
  addressHint,
  district,
  commuteMinutes,
  commuteSource,
  lifeCircleScore,
}: ListingCommutePanelProps) {
  const [commuteResults, setCommuteResults] = useState<StoredCommuteResult[]>(
    [],
  );
  const [workLocations, setWorkLocations] = useState<WorkLocation[]>([]);
  const [selectedAnchorIds, setSelectedAnchorIds] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] =
    useState<LbsTravelMode>("transit");
  const [resolvedLocations, setResolvedLocations] = useState<
    ResolvedCommuteLocation[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const workLocationCount = workLocations.length;
  const selectedWorkLocations = workLocations.filter((workLocation) =>
    selectedAnchorIds.includes(workLocation.id),
  );
  const hasListingAddress = addressHint.trim().length > 0;
  const hasWorkLocations = workLocationCount > 0;
  const canCalculateCommute =
    hasListingAddress &&
    selectedWorkLocations.length > 0 &&
    !isCalculating;
  const commuteSourceText = formatCommuteSource(commuteSource);
  const commuteResultStatusText = commuteResults.some(
    (result) => result.provider === "amap" && !result.isMock,
  )
    ? zhCN.listingDetailView.l1.commuteStatus.amapCalculated
    : commuteResults.length > 0
      ? zhCN.listingDetailView.l1.commuteStatus.localResultAvailable
      : zhCN.listingDetailView.l1.commuteStatus.notCalculated;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const loadedWorkLocations = loadWorkLocations();

      setCommuteResults(reloadCommuteResults(listingId));
      setWorkLocations(loadedWorkLocations);
      setSelectedAnchorIds(
        loadedWorkLocations.slice(0, 3).map((workLocation) => workLocation.id),
      );
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [listingId]);

  function getEmptyStateDescription(): string {
    if (!hasListingAddress) {
      return zhCN.listingDetailView.l1.missingListingAddressDescription;
    }

    if (!hasWorkLocations) {
      return zhCN.listingDetailView.l1.noWorkLocationsDescription;
    }

    return zhCN.listingDetailView.l1.emptyCommuteDescription;
  }

  function handleAnchorToggle(anchorId: string) {
    if (selectedAnchorIds.includes(anchorId)) {
      setSelectedAnchorIds((current) =>
        current.filter((currentId) => currentId !== anchorId),
      );
      setErrorMessage(null);
      return;
    }

    if (selectedAnchorIds.length >= 3) {
      setErrorMessage(zhCN.listingDetailView.l1.anchorSelectionLimit);
      return;
    }

    setSelectedAnchorIds((current) => [...current, anchorId]);
    setErrorMessage(null);
  }

  async function handleCalculateCommute() {
    setStatusMessage(null);
    setErrorMessage(null);
    setResolvedLocations([]);

    if (!hasListingAddress) {
      setErrorMessage(zhCN.listingDetailView.l1.missingListingAddress);
      return;
    }

    if (workLocations.length === 0) {
      setErrorMessage(zhCN.listingDetailView.l1.noWorkLocations);
      return;
    }

    if (selectedWorkLocations.length === 0) {
      setErrorMessage(zhCN.listingDetailView.l1.selectAtLeastOneAnchor);
      return;
    }

    setIsCalculating(true);

    try {
      const response = await fetch("/api/lbs/commute/transit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing: {
            id: listingId,
            title: listingTitle,
            addressHint,
            district,
          },
          workLocations: selectedWorkLocations.map(
            ({ id, name, addressHint: anchorAddressHint }) => ({
              id,
              name,
              addressHint: anchorAddressHint,
            }),
          ),
          city: "北京",
          mode: selectedMode,
        }),
      });

      const payload = (await response.json()) as TransitCommuteResponseBody;
      setResolvedLocations(payload.resolvedLocations ?? []);

      if (!response.ok && payload.results.length === 0) {
        setErrorMessage(zhCN.listingDetailView.l1.calculateFailed);
        return;
      }

      for (const result of payload.results) {
        upsertCommuteResult(result);
      }

      setCommuteResults(reloadCommuteResults(listingId));

      if (payload.results.length > 0 && payload.failures.length > 0) {
        setStatusMessage(zhCN.listingDetailView.l1.calculatePartiallySucceeded);
      } else if (payload.results.length > 0) {
        setStatusMessage(zhCN.listingDetailView.l1.calculateSucceeded);
      } else {
        setErrorMessage(zhCN.listingDetailView.l1.calculateFailed);
      }
    } catch {
      setErrorMessage(zhCN.listingDetailView.l1.calculateFailed);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">
        {zhCN.listingDetailView.l1.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {zhCN.listingDetailView.l1.description}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingDetailView.l1.commuteTime}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {typeof commuteMinutes === "number"
              ? `${commuteMinutes}${zhCN.common.minute}`
              : zhCN.common.pending}
          </p>
          {commuteSourceText ? (
            <p className="mt-1 text-xs text-slate-500">
              {commuteSourceText}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingDetailView.l1.lifeCircleScore}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {formatOptionalNumber(lifeCircleScore)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingDetailView.l1.commuteStatus.title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {commuteResultStatusText}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
        {hasWorkLocations ? (
          <fieldset
            disabled={isCalculating}
            className="mb-5 border-b border-slate-800 pb-5"
          >
            <legend className="text-sm font-medium text-white">
              {zhCN.listingDetailView.l1.anchorSelectorLabel}
            </legend>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {zhCN.listingDetailView.l1.anchorSelectorDescription}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {workLocations.map((workLocation) => {
                const isSelected = selectedAnchorIds.includes(workLocation.id);
                const isSelectionDisabled =
                  !isSelected && selectedAnchorIds.length >= 3;

                return (
                  <label
                    key={workLocation.id}
                    className={`rounded-xl border p-3 ${
                      isCalculating || isSelectionDisabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    } ${
                      isSelected
                        ? "border-slate-400 bg-slate-800"
                        : "border-slate-700 bg-slate-900 hover:border-slate-500"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isSelectionDisabled}
                        onChange={() => handleAnchorToggle(workLocation.id)}
                        className="mt-1 size-4 accent-white"
                      />
                      <span>
                        <span className="block text-sm font-medium text-white">
                          {workLocation.name}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">
                          {workLocation.addressHint}
                        </span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {zhCN.listingDetailView.l1.selectedAnchorCountPrefix}
              {selectedWorkLocations.length}
              {zhCN.listingDetailView.l1.selectedAnchorCountSuffix}
            </p>
          </fieldset>
        ) : null}

        <fieldset disabled={isCalculating}>
          <legend className="text-sm font-medium text-white">
            {zhCN.listingDetailView.l1.modeSelectorLabel}
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TRAVEL_MODES.map((mode) => {
              const isSelected = mode === selectedMode;

              return (
                <label
                  key={mode}
                  className={`rounded-full ${
                    isCalculating
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name={`commute-mode-${listingId}`}
                    value={mode}
                    checked={isSelected}
                    onChange={() => {
                      setSelectedMode(mode);
                      setStatusMessage(null);
                      setErrorMessage(null);
                      setResolvedLocations([]);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`block rounded-full border px-3 py-2 text-center text-xs font-medium transition peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-950 ${
                      isSelected
                        ? "border-white bg-white text-slate-950"
                        : "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900"
                    }`}
                  >
                    {formatTravelMode(mode)}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {zhCN.listingDetailView.l1.modeScoringNote}
          </p>
        </fieldset>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div>
            <p className="text-sm font-medium text-white">
              {zhCN.listingDetailView.l1.cachedCommuteResults}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {zhCN.listingDetailView.l1.anchorCountPrefix}
              {workLocationCount}
              {zhCN.listingDetailView.l1.anchorCountSuffix}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCalculateCommute}
            disabled={!canCalculateCommute}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isCalculating
              ? zhCN.listingDetailView.l1.calculating
              : `${zhCN.listingDetailView.l1.calculateButtonPrefix}${formatTravelMode(selectedMode)}${zhCN.listingDetailView.l1.calculateButtonSuffix}`}
          </button>
        </div>

        {!hasListingAddress ? (
          <p className="mt-3 text-sm leading-6 text-amber-300">
            {zhCN.listingDetailView.l1.missingListingAddress}
          </p>
        ) : null}

        {hasListingAddress && !hasWorkLocations ? (
          <p className="mt-3 rounded-lg border border-red-300/20 bg-[#5f241f] px-3 py-2 text-sm font-medium leading-6 text-[#fff7ed] shadow-sm">
            {zhCN.listingDetailView.l1.noWorkLocations}
          </p>
        ) : null}

        {statusMessage ? (
          <p className="mt-3 text-sm text-emerald-300">{statusMessage}</p>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 text-sm text-amber-300">{errorMessage}</p>
        ) : null}

        {resolvedLocations.length > 0 ? (
          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm font-medium text-white">
              {zhCN.listingDetailView.l1.resolvedLocations.title}
            </p>
            <div className="mt-3 grid gap-3">
              {resolvedLocations.map((location) => {
                const confidencePercent = Math.round(
                  Math.min(Math.max(location.heuristicConfidence, 0), 1) * 100,
                );

                return (
                  <div
                    key={`${location.kind}:${location.id}`}
                    className="rounded-lg bg-slate-950 px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-400">
                        {location.kind === "listing"
                          ? zhCN.listingDetailView.l1.resolvedLocations.listing
                          : zhCN.listingDetailView.l1.resolvedLocations.anchor}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {location.name}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {location.formattedAddress}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {
                        zhCN.listingDetailView.l1.resolvedLocations.precision
                      }
                      ：{formatPrecision(location.precision)} ·{" "}
                      {
                        zhCN.listingDetailView.l1.resolvedLocations
                          .heuristicConfidence
                      }
                      ：{confidencePercent}%
                    </p>
                    {location.isMock ? (
                      <p className="mt-2 text-xs leading-5 text-amber-300">
                        {
                          zhCN.listingDetailView.l1.resolvedLocations
                            .mockNotice
                        }
                      </p>
                    ) : location.heuristicConfidence < 0.75 ? (
                      <p className="mt-2 text-xs leading-5 text-amber-300">
                        {
                          zhCN.listingDetailView.l1.resolvedLocations
                            .lowConfidenceWarning
                        }
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {!isLoaded ? (
          <p className="mt-3 text-sm text-slate-500">{zhCN.common.pending}</p>
        ) : commuteResults.length > 0 ? (
          <div className="mt-4 space-y-3">
            {commuteResults.map((result) => (
              <div
                key={result.id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      {zhCN.listingDetailView.l1.resultAnchor}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.anchorName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      {zhCN.listingDetailView.l1.resultMode}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formatTravelMode(result.mode)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      {zhCN.listingDetailView.l1.resultDuration}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {Math.round(result.durationMinutes)}
                      {zhCN.common.minute}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      {zhCN.listingDetailView.l1.resultDistance}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formatDistanceMeters(result.distanceMeters)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-lg bg-slate-950/70 px-3 py-2 text-sm leading-6 text-slate-200">
                  {result.summary}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {zhCN.listingDetailView.l1.storedAt}:{" "}
                  {formatCalculatedAt(result.calculatedAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-slate-300">
              {zhCN.listingDetailView.l1.emptyCommuteResults}
            </p>
            <p className="text-sm leading-6 text-slate-500">
              {getEmptyStateDescription()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm leading-6 text-slate-400">
          {zhCN.listingDetailView.l1.referenceOnly}
        </p>
      </div>
    </div>
  );
}
