"use client";

import { useEffect, useState } from "react";
import { ListingNotesPanel } from "@/components/listing-notes-panel";
import { ListingStatusPanel } from "@/components/listing-status-panel";
import { ListingCommutePanel } from "@/components/listing-commute-panel";
import { zhCN } from "@/content/zh-cn";
import type { ScoreBreakdown } from "@/lib/algorithm/score";
import {
  findClientListingById,
  findClientListingScoreById,
} from "@/lib/local-store/listing-lookup";
import type { Listing } from "@/types/listing";

type ListingDetailViewProps = {
  listingId: string;
};

const statusText = zhCN.common.listingStatus;
const sourcePlatformText: Record<string, string> = {
  ...zhCN.common.sourcePlatform,
};

function formatOptionalNumber(value: number | undefined, suffix = "") {
  return typeof value === "number"
    ? `${value.toFixed(1)}${suffix}`
    : zhCN.common.pending;
}

function ScoreRow({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-base font-semibold text-white">{score.toFixed(1)}</p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${Math.max(0, Math.min(100, score * 10))}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {zhCN.listingDetailView.l2.defaultWeight}: {weight}
      </p>
    </div>
  );
}

function ReferenceScorePanel({
  score,
}: {
  score: ScoreBreakdown | undefined;
}) {
  if (!score) {
    return (
      <div className="mt-5 rounded-xl bg-slate-950 p-4">
        <p className="text-sm text-slate-500">
          {zhCN.listingDetailView.l2.referenceScore}
        </p>
        <p className="mt-2 text-lg text-white">{zhCN.common.pending}</p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <p className="text-sm text-slate-400">
          {zhCN.listingDetailView.l2.referenceScore}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
          {score.totalScore.toFixed(1)}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {score.explanation}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ScoreRow
          label={zhCN.listingDetailView.l2.rows.rent}
          score={score.rentScore}
          weight="25%"
        />
        <ScoreRow
          label={zhCN.listingDetailView.l2.rows.area}
          score={score.areaScore}
          weight="20%"
        />
        <ScoreRow
          label={zhCN.listingDetailView.l2.rows.commute}
          score={score.commuteScore}
          weight="25%"
        />
        <ScoreRow
          label={zhCN.listingDetailView.l2.rows.lifeCircle}
          score={score.lifeCircleScore}
          weight="15%"
        />
        <ScoreRow
          label={zhCN.listingDetailView.l2.rows.subjective}
          score={score.subjectiveScore}
          weight="15%"
        />
      </div>

      <div className="rounded-xl border border-amber-800/80 bg-amber-950/50 p-5">
        <p className="text-sm leading-6 text-amber-100">
          {zhCN.listingDetailView.l2.disclaimer}
        </p>
      </div>
    </div>
  );
}

export function ListingDetailView({ listingId }: ListingDetailViewProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<
    ScoreBreakdown | undefined
  >(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  function refreshListingState(id: string) {
    const found = findClientListingById(id);
    const score = findClientListingScoreById(id);

    setListing(found ?? null);
    setScoreBreakdown(score);
  }

  useEffect(() => {
    refreshListingState(listingId);
    setIsLoaded(true);
  }, [listingId]);

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        {zhCN.listingDetailView.loading}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          {zhCN.listingDetailView.notFound.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {zhCN.listingDetailView.notFound.description}
        </p>
        <a
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          {zhCN.listingDetailView.notFound.action}
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                {listing.district} / {listing.addressHint}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {listing.title}
              </h1>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {statusText[listing.status]}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">
                {zhCN.listingDetailView.summaryCards.monthlyRent}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {zhCN.common.currencyCny}
                {listing.rent}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">
                {zhCN.listingDetailView.summaryCards.area}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {listing.area}
                {zhCN.common.sqm}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">
                {zhCN.listingDetailView.summaryCards.layout}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {listing.layout}
              </p>
            </div>
          </div>

          {listing.sourceUrl ? (
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
            >
              {zhCN.listingDetailView.summaryCards.originalLink}
            </a>
          ) : null}
        </div>

        <ListingStatusPanel
          listingId={listing.id}
          status={listing.status}
          onStatusChange={(nextStatus) =>
            setListing({
              ...listing,
              status: nextStatus,
            })
          }
        />

        <ListingNotesPanel
          listingId={listing.id}
          onRatingsSaved={() => {
            refreshListingState(listing.id);
          }}
        />

        <ListingCommutePanel
          listingId={listing.id}
          listingTitle={listing.title}
          addressHint={listing.addressHint}
          district={listing.district}
          commuteMinutes={listing.commuteMinutes}
          commuteSource={listing.commuteSource}
          lifeCircleScore={listing.lifeCircleScore}
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {zhCN.listingDetailView.l2.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {zhCN.listingDetailView.l2.description}
          </p>

          <ReferenceScorePanel score={scoreBreakdown} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {zhCN.listingDetailView.l3.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {zhCN.listingDetailView.l3.description}
          </p>

          <button
            disabled
            className="mt-5 rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-500"
          >
            {zhCN.listingDetailView.l3.disabledButton}
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            {zhCN.listingDetailView.basicInfo.title}
          </h2>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">
                {zhCN.listingDetailView.basicInfo.sourcePlatform}
              </dt>
              <dd className="mt-1 text-slate-200">
                {sourcePlatformText[listing.sourcePlatform] ??
                  listing.sourcePlatform}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                {zhCN.listingDetailView.basicInfo.createdAt}
              </dt>
              <dd className="mt-1 text-slate-200">{listing.createdAt}</dd>
            </div>

            <div>
              <dt className="text-slate-500">
                {zhCN.listingDetailView.basicInfo.currentStatus}
              </dt>
              <dd className="mt-1 text-slate-200">
                {statusText[listing.status]}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                {zhCN.listingDetailView.basicInfo.dataScope}
              </dt>
              <dd className="mt-1 text-slate-200">
                {zhCN.listingDetailView.basicInfo.dataScopeValue}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            {zhCN.listingDetailView.complianceBoundary.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {zhCN.listingDetailView.complianceBoundary.body}
          </p>
        </div>
      </aside>
    </div>
  );
}