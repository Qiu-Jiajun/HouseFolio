"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  getCommuteResultsForListing,
  upsertCommuteResult,
} from "@/lib/local-store/commute-results";
import { loadWorkLocations } from "@/lib/local-store/work-locations";
import type {
  SaveCommuteResultInput,
  StoredCommuteResult,
} from "@/types/commute-result";
import type { WorkLocation } from "@/types/work-location";

type ListingCommutePanelProps = {
  listingId: string;
  listingTitle: string;
  addressHint: string;
  district: string;
  commuteMinutes?: number;
  lifeCircleScore?: number;
};

type TransitCommuteFailure = {
  listingId?: string;
  anchorId?: string;
  anchorName?: string;
  reason: string;
};

type TransitCommuteResponseBody = {
  results: SaveCommuteResultInput[];
  failures: TransitCommuteFailure[];
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

function reloadCommuteResults(listingId: string): StoredCommuteResult[] {
  return getCommuteResultsForListing(listingId);
}

function getErrorMessage(
  failures: TransitCommuteFailure[],
  fallback: string,
): string {
  const firstFailure = failures[0];

  if (!firstFailure) {
    return fallback;
  }

  if (firstFailure.anchorName) {
    return `${firstFailure.anchorName}: ${firstFailure.reason}`;
  }

  return firstFailure.reason;
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCommuteResults(reloadCommuteResults(listingId));
    setIsLoaded(true);
  }, [listingId]);

  async function handleCalculateTransitCommute() {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!addressHint.trim()) {
      setErrorMessage(zhCN.listingDetailView.l1.missingListingAddress);
      return;
    }

    const workLocations: WorkLocation[] = loadWorkLocations();

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
        setErrorMessage(
          getErrorMessage(
            payload.failures,
            zhCN.listingDetailView.l1.calculateFailed,
          ),
        );
        return;
      }

      for (const result of payload.results) {
        upsertCommuteResult(result);
      }

      setCommuteResults(reloadCommuteResults(listingId));

      if (payload.results.length > 0) {
        setStatusMessage(zhCN.listingDetailView.l1.calculateSucceeded);
      } else {
        setErrorMessage(
          getErrorMessage(
            payload.failures,
            zhCN.listingDetailView.l1.calculateFailed,
          ),
        );
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
          <p className="text-sm font-medium text-white">
            {zhCN.listingDetailView.l1.cachedCommuteResults}
          </p>

          <button
            type="button"
            onClick={handleCalculateTransitCommute}
            disabled={isCalculating}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isCalculating
              ? zhCN.listingDetailView.l1.calculating
              : zhCN.listingDetailView.l1.calculateTransitButton}
          </button>
        </div>

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
                className="rounded-lg border border-slate-800 bg-slate-900 p-3"
              >
                <p className="text-sm leading-6 text-slate-200">
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
              {zhCN.listingDetailView.l1.emptyCommuteDescription}
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