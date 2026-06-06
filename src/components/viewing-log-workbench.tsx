"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
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
type ViewingLogRow = {
  listing: Listing;
  record: ListingViewingRecord | null;
  group: ViewingGroup;
};

const copy = zhCN.viewingLog;
const statusText = zhCN.common.listingStatus;
const statusOptions: ListingStatus[] = [
  "draft",
  "watching",
  "visited",
  "shortlisted",
  "rejected",
];
const viewingGroupOptions: ViewingGroup[] = ["pending", "viewed", "rejected"];
const ratingOptionValues = Array.from({ length: 5 }, (_, index) => index + 1);

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
  return Number.isFinite(parsed) &&
    parsed >= 1 &&
    parsed <= 5 &&
    Number.isInteger(parsed)
    ? parsed
    : undefined;
}

function getCardMemoValue(
  record: ListingViewingRecord | null,
  _group: ViewingGroup,
): string {
  if (!record) {
    return "";
  }

  if (record.viewedAt) {
    return record.postVisitImpression ?? "";
  }

  return record.preVisitMemo ?? "";
}

function groupClassName(group: ViewingGroup): string {
  if (group === "viewed") {
    return "border-[#d4e0c7] bg-[#f2f7ed]";
  }

  if (group === "rejected") {
    return "border-[#d8c3b7] bg-[#f5eee9]";
  }

  return "border-[#f0bdd1] bg-[#fff4f8]";
}

function groupAccentClassName(group: ViewingGroup): string {
  if (group === "viewed") {
    return "border-[#d4e0c7] bg-[#eef5e8] text-[#3f5632]";
  }

  if (group === "rejected") {
    return "border-[#d8c3b7] bg-[#f7eee8] text-[#6b4f45]";
  }

  return "border-[#efb9cf] bg-[#fff1f7] text-[#84234d]";
}

function groupBadgeClassName(group: ViewingGroup): string {
  if (group === "viewed") {
    return "bg-[#52673d] text-[#fffaf2]";
  }

  if (group === "rejected") {
    return "bg-[#876252] text-[#fffaf2]";
  }

  return "bg-[#b7346d] text-[#fffaf2]";
}

function decisionBadgeClassName(group: ViewingGroup): string {
  if (group === "viewed") {
    return "bg-white/80 text-[#51623c]";
  }

  if (group === "rejected") {
    return "bg-white/75 text-[#72584d]";
  }

  return "bg-white/80 text-[#7a4f61]";
}

function getDecisionStatusLabel(listing: Listing): string | null {
  if (listing.status === "visited" || listing.status === "rejected") {
    return null;
  }

  return statusText[listing.status];
}

function formatViewedAt(value: string | undefined): string {
  if (!value) {
    return copy.card.noViewedAt;
  }

  return value.replace("T", " ");
}

function getCurrentLocalDateTimeMinute(): string {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;

  return new Date(now.getTime() - timezoneOffsetMs)
    .toISOString()
    .slice(0, 16);
}

function sortViewingLogRows(rows: ViewingLogRow[], sortKey: SortKey) {
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

function getGroupedRows(rows: ViewingLogRow[]): {
  group: ViewingGroup;
  rows: ViewingLogRow[];
}[] {
  const groupOrder: ViewingGroup[] = ["pending", "viewed", "rejected"];

  return groupOrder
    .map((group) => ({
      group,
      rows: rows.filter((row) => row.group === group),
    }))
    .filter((section) => section.rows.length > 0);
}

function StarRatingControl({
  label,
  value,
  onChange,
  icon,
  filledClassName,
  emptyClassName,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  icon: string;
  filledClassName: string;
  emptyClassName: string;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value ?? 0;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#ded6c8] bg-white px-3 py-1.5">
      <span className="text-xs font-medium text-[#4c5130]">
        {label}: {formatRating(value)}
      </span>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverValue(null)}
        role="radiogroup"
        aria-label={copy.card.incrementRating}
      >
        {[1, 2, 3, 4, 5].map((ratingValue) => (
          <button
            key={ratingValue}
            type="button"
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHoverValue(ratingValue)}
            className={[
              "grid h-8 w-7 place-items-center text-2xl leading-none transition hover:scale-110",
              displayValue >= ratingValue ? filledClassName : emptyClassName,
            ].join(" ")}
            aria-checked={value === ratingValue}
            aria-label={`${label} ${ratingValue}/5`}
            role="radio"
          >
            {icon}
          </button>
        ))}
      </div>
      {value ? (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-xs text-[#82786a] underline decoration-[#c8bca9] underline-offset-2 hover:text-[#4f5131]"
        >
          {copy.card.clearRating}
        </button>
      ) : null}
    </div>
  );
}

function ViewingRating({
  group,
  record,
  onChange,
}: {
  group: ViewingGroup;
  record: ListingViewingRecord | null;
  onChange: (value: number | undefined) => void;
}) {
  const showsOverall = group === "viewed" || Boolean(record?.viewedAt);
  const label = showsOverall ? copy.card.overallRating : copy.card.expectedRating;
  const value = showsOverall ? record?.overallRating : record?.expectedRating;
  const icon = showsOverall ? "★" : "♥";

  return (
    <StarRatingControl
      label={label}
      value={value}
      onChange={onChange}
      icon={icon}
      filledClassName={showsOverall ? "text-[#d9a441]" : "text-[#b7346d]"}
      emptyClassName={showsOverall ? "text-[#d6cfc2]" : "text-[#e6c7d5]"}
    />
  );
}

function ViewingTimeControl({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const initialDateTime = value ?? getCurrentLocalDateTimeMinute();
  const [draftDate, setDraftDate] = useState(initialDateTime.slice(0, 10));
  const [draftTime, setDraftTime] = useState(initialDateTime.slice(11, 16));

  function openPicker() {
    const nextDateTime = value ?? getCurrentLocalDateTimeMinute();

    setDraftDate(nextDateTime.slice(0, 10));
    setDraftTime(nextDateTime.slice(11, 16));
    setIsOpen(true);
  }

  function applyPickerValue() {
    if (draftDate && draftTime) {
      onChange(`${draftDate}T${draftTime}`);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="block w-full rounded-2xl border border-[#d9cdb9] bg-white/80 px-5 py-4 text-left text-sm text-[#5f5a50] transition hover:border-[#b7346d] hover:bg-white"
        aria-expanded={isOpen}
      >
        {formatViewedAt(value)}
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-[#d8cdbc] bg-[#fffaf2] p-4 shadow-[0_18px_55px_rgba(74,57,35,0.20)]">
          <label className="block">
            <span className="text-xs font-medium text-[#5d584d]">
              {copy.card.viewedAtTimeLabel}
            </span>
            <input
              type="time"
              value={draftTime}
              onChange={(event) => setDraftTime(event.target.value)}
              step="60"
              className="mt-2 w-full rounded-xl border border-[#ddd2c0] bg-white px-3 py-2 text-sm text-[#282417] outline-none focus:border-[#8a8f55]"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-[#5d584d]">
              {copy.card.viewedAtDateLabel}
            </span>
            <input
              type="date"
              value={draftDate}
              onChange={(event) => setDraftDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#ddd2c0] bg-white px-3 py-2 text-sm text-[#282417] outline-none focus:border-[#8a8f55]"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyPickerValue}
              className="rounded-full bg-[#727a3f] px-4 py-2 text-xs font-medium text-white"
            >
              {copy.card.applyViewedAt}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className="rounded-full border border-[#d8cdbc] bg-white px-4 py-2 text-xs font-medium text-[#4f5131]"
            >
              {copy.card.clearViewedAt}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ViewingStatusPicker({
  group,
  onChange,
}: {
  group: ViewingGroup;
  onChange: (group: ViewingGroup) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={[
          "rounded-full px-3 py-1 pr-7 text-xs font-medium outline-none transition",
          groupBadgeClassName(group),
          "hover:shadow-[0_0_0_3px_rgba(183,52,109,0.16)] focus-visible:ring-2 focus-visible:ring-[#b7346d]/35",
        ].join(" ")}
        aria-expanded={isOpen}
        aria-label={copy.card.statusPickerLabel}
      >
        {copy.groupLabels[group]}
      </button>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.65rem] text-white">
        v
      </span>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 grid min-w-28 gap-1 rounded-2xl border border-[#d8cdbc] bg-white p-2 shadow-[0_16px_45px_rgba(74,57,35,0.18)]">
          {viewingGroupOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={[
                "rounded-full px-3 py-1.5 text-left text-xs font-medium transition",
                groupBadgeClassName(option),
                option === group ? "ring-2 ring-white/80" : "opacity-90",
              ].join(" ")}
            >
              {copy.groupLabels[option]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CardMemoControl({
  group,
  record,
  onChange,
}: {
  group: ViewingGroup;
  record: ListingViewingRecord | null;
  onChange: (value: string | undefined) => void;
}) {
  const [value, setValue] = useState(getCardMemoValue(record, group));

  useEffect(() => {
    setValue(getCardMemoValue(record, group));
  }, [group, record]);

  return (
    <label className="block rounded-2xl bg-white/80 p-4">
      <span className="text-xs text-[#82786a]">{copy.card.recordSummary}</span>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => onChange(value.trim() || undefined)}
        rows={2}
        placeholder={copy.card.emptyMemo}
        className="mt-2 min-h-12 w-full resize-none bg-transparent text-sm leading-6 text-[#514b40] outline-none placeholder:text-[#6f675c]"
      />
    </label>
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
        {ratingOptionValues.map((option) => (
          <option key={option} value={option}>
            {option} / 5
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

  const groupedRows = useMemo(() => getGroupedRows(rows), [rows]);

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

  function handleCardRatingChange(
    listing: Listing,
    record: ListingViewingRecord | null,
    group: ViewingGroup,
    value: number | undefined,
  ) {
    const shouldSaveOverall = group === "viewed" || Boolean(record?.viewedAt);

    saveListingViewingRecord({
      listingId: listing.id,
      ...(shouldSaveOverall
        ? { overallRating: value }
        : { expectedRating: value }),
    });

    setRecords(getListingViewingRecords());
  }

  function handleCardViewedAtChange(
    listing: Listing,
    value: string | undefined,
  ) {
    saveListingViewingRecord({
      listingId: listing.id,
      viewedAt: value,
    });

    setRecords(getListingViewingRecords());
  }

  function handleCardMemoChange(
    listing: Listing,
    record: ListingViewingRecord | null,
    value: string | undefined,
  ) {
    saveListingViewingRecord({
      listingId: listing.id,
      ...(record?.viewedAt
        ? { postVisitImpression: value }
        : { preVisitMemo: value }),
    });

    setRecords(getListingViewingRecords());
  }

  function handleViewingGroupChange(
    listing: Listing,
    record: ListingViewingRecord | null,
    nextGroup: ViewingGroup,
  ) {
    if (nextGroup === "viewed") {
      saveListingViewingRecord({
        listingId: listing.id,
        viewedAt: record?.viewedAt ?? getCurrentLocalDateTimeMinute(),
      });

      if (listing.status !== "visited" && listing.status !== "shortlisted") {
        saveListingStatus(listing.id, "visited");
      }
    }

    if (nextGroup === "pending") {
      saveListingViewingRecord({
        listingId: listing.id,
        viewedAt: undefined,
      });

      if (listing.status === "visited" || listing.status === "rejected") {
        saveListingStatus(listing.id, "watching");
      }
    }

    if (nextGroup === "rejected") {
      saveListingStatus(listing.id, "rejected");
    }

    refreshData();
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
        <section className="space-y-6">
          {groupedRows.map((section) => (
            <div
              key={section.group}
              className={[
                "rounded-[2rem] border p-4 sm:p-5",
                groupAccentClassName(section.group),
              ].join(" ")}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {copy.groupLabels[section.group]}
                </h2>
                <span className="rounded-full bg-white/80 px-3 py-1 text-sm">
                  {copy.groupCountPrefix}
                  {section.rows.length}
                  {copy.groupCountSuffix}
                </span>
              </div>

              <div className="space-y-4">
                {section.rows.map(({ listing, record, group }) => {
                  const decisionStatusLabel = getDecisionStatusLabel(listing);

                  return (
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
                        <ViewingTimeControl
                          value={record?.viewedAt}
                          onChange={(value) =>
                            handleCardViewedAtChange(listing, value)
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <ViewingStatusPicker
                            group={group}
                            onChange={(nextGroup) =>
                              handleViewingGroupChange(
                                listing,
                                record,
                                nextGroup,
                              )
                            }
                          />
                          {decisionStatusLabel ? (
                            <span
                              className={[
                                "rounded-full px-3 py-1 text-xs",
                                decisionBadgeClassName(group),
                              ].join(" ")}
                            >
                              {decisionStatusLabel}
                            </span>
                          ) : null}
                          {group !== "rejected" ? (
                            <ViewingRating
                              group={group}
                              record={record}
                              onChange={(value) =>
                                handleCardRatingChange(
                                  listing,
                                  record,
                                  group,
                                  value,
                                )
                              }
                            />
                          ) : null}
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
                          <CardMemoControl
                            group={group}
                            record={record}
                            onChange={(value) =>
                              handleCardMemoChange(listing, record, value)
                            }
                          />
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
                  );
                })}
              </div>
            </div>
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
