"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ListingCardCoverPhoto } from "@/components/listing-card-cover-photo";
import { zhCN } from "@/content/zh-cn";
import { getAllClientListings } from "@/lib/local-store/listing-lookup";
import { loadListingRatings } from "@/lib/local-store/listing-notes";
import { saveListingStatus } from "@/lib/local-store/listing-status";
import {
  getListingViewingRecord,
  getListingViewingRecords,
  saveListingViewingRecord,
} from "@/lib/local-store/listing-viewing-records";
import type { Listing, ListingStatus } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";
import type { ListingViewingRecord } from "@/types/listing-viewing-record";

type ViewingGroup = "pending" | "viewed" | "rejected";
type GroupFilter = "all" | ViewingGroup;
type SortKey = "createdAtDesc" | "rentAsc" | "rentDesc" | "viewedAtDesc";

const copy = zhCN.viewingLog;
const statusText = zhCN.common.listingStatus;
const statusOptions: ListingStatus[] = [
  "draft",
  "watching",
  "visited",
  "shortlisted",
  "rejected",
];

function toViewingGroup(
  listing: Listing,
  record: ListingViewingRecord | null,
): ViewingGroup {
  if (listing.status === "rejected") {
    return "rejected";
  }

  return record?.viewedAt ? "viewed" : "pending";
}

function formatRating(value: number | undefined): string {
  return typeof value === "number" ? `${value}/5` : zhCN.common.pending;
}

function formatCommute(listing: Listing): string {
  return typeof listing.commuteMinutes === "number"
    ? `${listing.commuteMinutes}${zhCN.common.minute}`
    : zhCN.common.pending;
}

function toOptionalRating(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5
    ? parsed
    : undefined;
}

function getRecordSummary(record: ListingViewingRecord | null): string {
  if (!record) {
    return copy.card.emptyMemo;
  }

  return (
    record.postVisitImpression || record.preVisitMemo || copy.card.emptyMemo
  );
}

function groupClassName(group: ViewingGroup): string {
  if (group === "viewed") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (group === "rejected") {
    return "border-slate-200 bg-slate-100 opacity-80";
  }

  return "border-sky-100 bg-[#f8fbff]";
}

function sortViewingLogRows(
  rows: {
    listing: Listing;
    record: ListingViewingRecord | null;
    group: ViewingGroup;
  }[],
  sortKey: SortKey,
) {
  return [...rows].sort((a, b) => {
    if (sortKey === "rentAsc") {
      return a.listing.rent - b.listing.rent;
    }

    if (sortKey === "rentDesc") {
      return b.listing.rent - a.listing.rent;
    }

    if (sortKey === "viewedAtDesc") {
      return (b.record?.viewedAt ?? "").localeCompare(a.record?.viewedAt ?? "");
    }

    return b.listing.createdAt.localeCompare(a.listing.createdAt);
  });
}

function ViewingRating({
  group,
  record,
}: {
  group: ViewingGroup;
  record: ListingViewingRecord | null;
}) {
  const showsOverall = group === "viewed" || Boolean(record?.viewedAt);
  const label = showsOverall ? copy.card.overallRating : copy.card.expectedRating;
  const value = showsOverall ? record?.overallRating : record?.expectedRating;

  return (
    <span className="rounded-full border border-[#ded6c8] bg-white px-3 py-1 text-xs font-medium text-[#4c5130]">
      {label}: {formatRating(value)}
    </span>
  );
}

function RatingSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[#5d584d]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
      >
        <option value="">{copy.drawer.ratingEmpty}</option>
        {copy.drawer.ratingOptions.map((option, index) => (
          <option key={option} value={index + 1}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyRatings({
  ratings,
}: {
  ratings: ListingSubjectiveRatings | null;
}) {
  return (
    <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffaf2] p-4">
      <p className="text-sm font-medium text-[#282417]">
        {copy.drawer.subjectiveRatings.title}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#5f5a50]">
        <span>
          {copy.drawer.subjectiveRatings.light}:{" "}
          {ratings ? ratings.light : zhCN.common.pending}
        </span>
        <span>
          {copy.drawer.subjectiveRatings.quiet}:{" "}
          {ratings ? ratings.quiet : zhCN.common.pending}
        </span>
        <span>
          {copy.drawer.subjectiveRatings.decoration}:{" "}
          {ratings ? ratings.decoration : zhCN.common.pending}
        </span>
      </div>
    </div>
  );
}

export function ViewingLogWorkbench() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [records, setRecords] = useState<ListingViewingRecord[]>([]);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAtDesc");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedRatings, setSelectedRatings] =
    useState<ListingSubjectiveRatings | null>(null);
  const [drawerStatus, setDrawerStatus] = useState<ListingStatus>("watching");
  const [expectedRating, setExpectedRating] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [preVisitMemo, setPreVisitMemo] = useState("");
  const [postVisitImpression, setPostVisitImpression] = useState("");
  const [viewedAt, setViewedAt] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  function refreshData() {
    setListings(getAllClientListings());
    setRecords(getListingViewingRecords());
  }

  useEffect(() => {
    refreshData();
  }, []);

  const recordByListingId = useMemo(() => {
    return new Map(records.map((record) => [record.listingId, record]));
  }, [records]);

  const rows = useMemo(() => {
    const groupedRows = listings.map((listing) => {
      const record = recordByListingId.get(listing.id) ?? null;

      return {
        listing,
        record,
        group: toViewingGroup(listing, record),
      };
    });

    return sortViewingLogRows(
      groupedRows.filter(
        (row) => groupFilter === "all" || row.group === groupFilter,
      ),
      sortKey,
    );
  }, [groupFilter, listings, recordByListingId, sortKey]);

  const groupCounts = useMemo(() => {
    return listings.reduce(
      (counts, listing) => {
        const record = recordByListingId.get(listing.id) ?? null;
        const group = toViewingGroup(listing, record);

        return {
          ...counts,
          [group]: counts[group] + 1,
        };
      },
      { pending: 0, viewed: 0, rejected: 0 },
    );
  }, [listings, recordByListingId]);

  function openDrawer(listing: Listing) {
    const record = getListingViewingRecord(listing.id);

    setSelectedListing(listing);
    setSelectedRatings(loadListingRatings(listing.id));
    setDrawerStatus(listing.status);
    setExpectedRating(record?.expectedRating?.toString() ?? "");
    setOverallRating(record?.overallRating?.toString() ?? "");
    setPreVisitMemo(record?.preVisitMemo ?? "");
    setPostVisitImpression(record?.postVisitImpression ?? "");
    setViewedAt(record?.viewedAt ?? "");
    setSavedMessage("");
  }

  function closeDrawer() {
    setSelectedListing(null);
    setSavedMessage("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedListing) {
      return;
    }

    if (drawerStatus !== selectedListing.status) {
      saveListingStatus(selectedListing.id, drawerStatus);
    }

    saveListingViewingRecord({
      listingId: selectedListing.id,
      expectedRating: toOptionalRating(expectedRating),
      overallRating: toOptionalRating(overallRating),
      preVisitMemo: preVisitMemo.trim() || undefined,
      postVisitImpression: postVisitImpression.trim() || undefined,
      viewedAt: viewedAt || undefined,
    });

    refreshData();
    setSavedMessage(copy.drawer.savedMessage);
    setSelectedListing({
      ...selectedListing,
      status: drawerStatus,
    });
  }

  const selectedRecord = selectedListing
    ? recordByListingId.get(selectedListing.id) ?? null
    : null;

  return (
    <>
      <section className="mb-6 rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-6 shadow-[0_24px_80px_rgba(92,74,48,0.10)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-[#73744b]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#242114]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6f675c]">
              {copy.description}
            </p>
          </div>

          <Link
            href="/portfolio/new"
            className="rounded-full bg-[#727a3f] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#606936]"
          >
            {copy.actions.addListing}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-[#5d584d]">
              {copy.controls.filter}
            </span>
            <select
              value={groupFilter}
              onChange={(event) =>
                setGroupFilter(event.target.value as GroupFilter)
              }
              className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
            >
              {copy.controls.groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-[#5d584d]">
              {copy.controls.sort}
            </span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
            >
              {copy.controls.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-3">
        {copy.groups.map((group) => (
          <div
            key={group.value}
            className="rounded-2xl border border-[#e5dccd] bg-white/78 p-5 shadow-sm"
          >
            <p className="text-sm text-[#80786a]">{group.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#282417]">
              {groupCounts[group.value as ViewingGroup]}
            </p>
          </div>
        ))}
      </section>

      {rows.length === 0 ? (
        <section className="rounded-[2rem] border border-[#e3dacb] bg-[#fffaf2] p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#282417]">
            {copy.empty.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#746c5f]">
            {copy.empty.description}
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {rows.map(({ listing, record, group }) => (
            <article
              key={listing.id}
              className={[
                "grid gap-5 rounded-[1.5rem] border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(96,74,45,0.10)] lg:grid-cols-[14rem_1fr_auto]",
                groupClassName(group),
              ].join(" ")}
            >
              <div>
                <ListingCardCoverPhoto
                  listingId={listing.id}
                  title={listing.title}
                />
                <div className="rounded-2xl border border-[#e2d8ca] bg-white/75 p-4 text-sm text-[#5f5a50]">
                  {record?.viewedAt
                    ? `${copy.card.viewedAt}: ${record.viewedAt}`
                    : copy.card.noViewedAt}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[#5f6240]">
                    {copy.groupLabels[group]}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[#6d6842]">
                    {statusText[listing.status]}
                  </span>
                  <ViewingRating group={group} record={record} />
                </div>

                <h2 className="mt-3 text-2xl font-semibold leading-8 text-[#272318]">
                  {listing.title}
                </h2>
                <p className="mt-1 text-sm text-[#81786a]">
                  {listing.district} / {listing.addressHint}
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-[#82786a]">
                      {copy.card.rent}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#272318]">
                      {zhCN.common.currencyCny}
                      {listing.rent}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-[#82786a]">
                      {copy.card.commute}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#272318]">
                      {formatCommute(listing)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-[#82786a]">
                      {copy.card.recordSummary}
                    </p>
                    <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-[#514b40]">
                      {getRecordSummary(record)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap content-start gap-3 lg:w-32 lg:flex-col">
                <button
                  type="button"
                  onClick={() => openDrawer(listing)}
                  className="rounded-full bg-[#727a3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#606936]"
                >
                  {copy.actions.editRecord}
                </button>
                <Link
                  href={`/portfolio/${listing.id}`}
                  className="rounded-full border border-[#d8cdbc] bg-white/80 px-4 py-2 text-center text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c]"
                >
                  {copy.actions.viewDetail}
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedListing ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45">
          <button
            type="button"
            aria-label={copy.drawer.close}
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={closeDrawer}
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-[#f8f4ec] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#73744b]">{copy.drawer.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#242114]">
                  {selectedListing.title}
                </h2>
                <p className="mt-1 text-sm text-[#6f675c]">
                  {selectedListing.district} / {selectedListing.addressHint}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full border border-[#d8cdbc] bg-white px-4 py-2 text-sm text-[#4f5131]"
              >
                {copy.drawer.close}
              </button>
            </div>

            {savedMessage ? (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {savedMessage}
              </div>
            ) : null}

            <div className="mb-5 rounded-2xl border border-[#e2d8ca] bg-white p-4">
              <ListingCardCoverPhoto
                listingId={selectedListing.id}
                title={selectedListing.title}
              />
              <p className="text-sm leading-6 text-[#6f675c]">
                {selectedRecord?.viewedAt
                  ? `${copy.drawer.photoSummaryViewed}${selectedRecord.viewedAt}`
                  : copy.drawer.photoSummaryPending}
              </p>
            </div>

            <ReadOnlyRatings ratings={selectedRatings} />

            <form onSubmit={handleSave} className="mt-5 space-y-5">
              <label className="block">
                <span className="text-sm text-[#5d584d]">
                  {copy.drawer.fields.status}
                </span>
                <select
                  value={drawerStatus}
                  onChange={(event) =>
                    setDrawerStatus(event.target.value as ListingStatus)
                  }
                  className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusText[status]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <RatingSelect
                  label={copy.drawer.fields.expectedRating}
                  value={expectedRating}
                  onChange={setExpectedRating}
                />
                <RatingSelect
                  label={copy.drawer.fields.overallRating}
                  value={overallRating}
                  onChange={setOverallRating}
                />
              </div>

              <label className="block">
                <span className="text-sm text-[#5d584d]">
                  {copy.drawer.fields.viewedAt}
                </span>
                <input
                  type="datetime-local"
                  value={viewedAt}
                  onChange={(event) => setViewedAt(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#5d584d]">
                  {copy.drawer.fields.preVisitMemo}
                </span>
                <textarea
                  value={preVisitMemo}
                  onChange={(event) => setPreVisitMemo(event.target.value)}
                  rows={4}
                  placeholder={copy.drawer.placeholders.preVisitMemo}
                  className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm leading-6 text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#5d584d]">
                  {copy.drawer.fields.postVisitImpression}
                </span>
                <textarea
                  value={postVisitImpression}
                  onChange={(event) =>
                    setPostVisitImpression(event.target.value)
                  }
                  rows={4}
                  placeholder={copy.drawer.placeholders.postVisitImpression}
                  className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm leading-6 text-[#282417] outline-none focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#727a3f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#606936]"
                >
                  {copy.drawer.saveButton}
                </button>
                <Link
                  href={`/portfolio/${selectedListing.id}`}
                  className="rounded-full border border-[#d8cdbc] bg-white px-5 py-3 text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c]"
                >
                  {copy.actions.viewDetail}
                </Link>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
