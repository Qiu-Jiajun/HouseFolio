"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import { getCommuteResultsForListing } from "@/lib/local-store/commute-results";
import type { StoredCommuteResult } from "@/types/commute-result";

type ListingCommutePanelProps = {
  listingId: string;
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

export function ListingCommutePanel({
  listingId,
  commuteMinutes,
  lifeCircleScore,
}: ListingCommutePanelProps) {
  const [commuteResults, setCommuteResults] = useState<StoredCommuteResult[]>(
    [],
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCommuteResults(getCommuteResultsForListing(listingId));
    setIsLoaded(true);
  }, [listingId]);

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
        <p className="text-sm font-medium text-white">
          {zhCN.listingDetailView.l1.cachedCommuteResults}
        </p>

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