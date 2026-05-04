"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  getCommuteResultsForListing,
  upsertCommuteResult,
} from "@/lib/local-store/commute-results";
import { loadWorkLocations } from "@/lib/local-store/work-locations";
import type { StoredCommuteResult } from "@/types/commute-result";
import type {
  TransitCommuteResponseBody,
} from "@/types/transit-commute-route";
import type { WorkLocation } from "@/types/work-location";

type ListingCommutePanelProps = {
  listingId: string;
  listingTitle: string;
  addressHint: string;
  district: string;
  commuteMinutes?: number;
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

function formatTravelMode(mode: StoredCommuteResult["mode"]): string {
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

function reloadCommuteResults(listingId: string): StoredCommuteResult[] {
  return getCommuteResultsForListing(listingId);
}

export function ListingCommutePanel({
  listingId,
  listingTitle,
  addressHint,
  district,
  commuteMinutes,
  lifeCircleScore,
}: ListingCommutePanelProps) {
  const [commuteResults, setCommuteResults] = useState<StoredCommuteResult[]>(
    [],
  );
  const [workLocationCount, setWorkLocationCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasListingAddress = addressHint.trim().length > 0;
  const hasWorkLocations = workLocationCount > 0;
  const canCalculateTransit =
    hasListingAddress && hasWorkLocations && !isCalculating;

  useEffect(() => {
    setCommuteResults(reloadCommuteResults(listingId));
    setWorkLocationCount(loadWorkLocations().length);
    setIsLoaded(true);
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

  async function handleCalculateTransitCommute() {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!hasListingAddress) {
      setErrorMessage(zhCN.listingDetailView.l1.missingListingAddress);
      return;
    }

    const workLocations: WorkLocation[] = loadWorkLocations();
    setWorkLocationCount(workLocations.length);

    if (workLocations.length === 0) {
      setErrorMessage(zhCN.listingDetailView.l1.noWorkLocations);
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
          workLocations,
          city: "北京",
        }),
      });

      const payload = (await response.json()) as TransitCommuteResponseBody;

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
          <p className="mt-2 text-lg text-white">
            {typeof commuteMinutes === "number"
              ? `${commuteMinutes}${zhCN.common.minute}`
              : zhCN.common.pending}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingDetailView.l1.lifeCircleScore}
          </p>
          <p className="mt-2 text-lg text-white">
            {formatOptionalNumber(lifeCircleScore)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingDetailView.l1.mapStatus}
          </p>
          <p className="mt-2 text-lg text-white">
            {zhCN.listingDetailView.l1.notConnected}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
            onClick={handleCalculateTransitCommute}
            disabled={!canCalculateTransit}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isCalculating
              ? zhCN.listingDetailView.l1.calculating
              : zhCN.listingDetailView.l1.calculateTransitButton}
          </button>
        </div>

        {!hasListingAddress ? (
          <p className="mt-3 text-sm leading-6 text-amber-300">
            {zhCN.listingDetailView.l1.missingListingAddress}
          </p>
        ) : null}

        {hasListingAddress && !hasWorkLocations ? (
          <p className="mt-3 text-sm leading-6 text-amber-300">
            {zhCN.listingDetailView.l1.noWorkLocations}
          </p>
        ) : null}

        {statusMessage ? (
          <p className="mt-3 text-sm text-emerald-300">{statusMessage}</p>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 text-sm text-amber-300">{errorMessage}</p>
        ) : null}

        {!isLoaded ? (
          <p className="mt-3 text-sm text-slate-500">{zhCN.common.pending}</p>
        ) : commuteResults.length > 0 ? (
          <div className="mt-4 space-y-3">
            {commuteResults.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4"
              >
                <div className="grid gap-3 md:grid-cols-4">
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

                <p className="mt-4 text-sm leading-6 text-slate-200">
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