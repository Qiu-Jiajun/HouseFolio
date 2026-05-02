"use client";

import { useEffect, useState } from "react";
import { ListingNotesPanel } from "@/components/listing-notes-panel";
import { ListingStatusPanel } from "@/components/listing-status-panel";
import {
  findClientListingById,
  findClientListingScoreById,
} from "@/lib/local-store/listing-lookup";
import type { ScoreBreakdown } from "@/lib/algorithm/score";
import type { Listing } from "@/types/listing";

type ListingDetailViewProps = {
  listingId: string;
};

const statusText: Record<Listing["status"], string> = {
  draft: "Draft",
  watching: "Watching",
  visited: "Visited",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

function formatOptionalNumber(value: number | undefined, suffix = "") {
  return typeof value === "number" ? `${value.toFixed(1)}${suffix}` : "Pending";
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
    <div className="rounded-xl bg-slate-950 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-sm font-medium text-white">{score.toFixed(1)}</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${Math.max(0, Math.min(100, score * 10))}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">Default weight: {weight}</p>
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
        <p className="text-sm text-slate-500">Reference Score</p>
        <p className="mt-2 text-lg text-white">Pending</p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-xl bg-slate-950 p-4">
        <p className="text-sm text-slate-500">Reference Score</p>
        <p className="mt-2 text-3xl font-semibold text-white">
          {score.totalScore.toFixed(1)}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {score.explanation}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ScoreRow label="Rent contribution" score={score.rentScore} weight="25%" />
        <ScoreRow label="Area contribution" score={score.areaScore} weight="20%" />
        <ScoreRow
          label="Commute contribution"
          score={score.commuteScore}
          weight="25%"
        />
        <ScoreRow
          label="Life circle contribution"
          score={score.lifeCircleScore}
          weight="15%"
        />
        <ScoreRow
          label="Subjective contribution"
          score={score.subjectiveScore}
          weight="15%"
        />
      </div>

      <div className="rounded-xl border border-amber-900 bg-amber-950/40 p-4">
        <p className="text-sm leading-6 text-amber-100">
          This reference score is not a final recommendation. A user may still
          reject a listing because of one hard condition, such as unacceptable
          commute, poor lighting, high rent, or a personal constraint not captured
          by the current formula.
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
        Loading listing information...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">Listing not found</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This listing may not exist, or local browser data may have been cleared.
        </p>
        <a
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          Back to Portfolio
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
              <p className="text-sm text-slate-500">Monthly Rent</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                CNY {listing.rent}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Area</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {listing.area} sqm
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Layout</p>
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
              View original link
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

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            L1 LBS Spatial Analysis
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This area will later show commute time, life-circle score, map position,
            and nearby POI statistics. Current values are placeholder or mock outputs.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Commute Time</p>
              <p className="mt-2 text-lg text-white">
                {typeof listing.commuteMinutes === "number"
                  ? `${listing.commuteMinutes} min`
                  : "Pending"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Life Circle Score</p>
              <p className="mt-2 text-lg text-white">
                {formatOptionalNumber(listing.lifeCircleScore)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Map Status</p>
              <p className="mt-2 text-lg text-white">Not connected</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            L2 Reference Scoring
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This score is a lightweight auxiliary comparison signal based on rent,
            area, commute, life-circle score, and subjective ratings. It is not a
            final recommendation. Users can still veto a listing based on any hard
            requirement.
          </p>

          <ReferenceScorePanel score={scoreBreakdown} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            L3 AI Decision Advice
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Later, after explicit user confirmation and data redaction, this area
            will generate checklist items, risk explanations, and decision advice
            based on basic information, L1/L2 outputs, notes, ratings, and status.
          </p>

          <button
            disabled
            className="mt-5 rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-500"
          >
            AI analysis not connected
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Basic Information</h2>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Source Platform</dt>
              <dd className="mt-1 text-slate-200">{listing.sourcePlatform}</dd>
            </div>

            <div>
              <dt className="text-slate-500">Created At</dt>
              <dd className="mt-1 text-slate-200">{listing.createdAt}</dd>
            </div>

            <div>
              <dt className="text-slate-500">Current Status</dt>
              <dd className="mt-1 text-slate-200">
                {statusText[listing.status]}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Data Scope</dt>
              <dd className="mt-1 text-slate-200">
                Local or mock data. Not uploaded to cloud.
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Compliance Boundary</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The current demo only shows user-added or mock listing information. It
            does not crawl third-party pages, does not publish a listing database,
            does not broker transactions, and does not certify listing authenticity.
          </p>
        </div>
      </aside>
    </div>
  );
}