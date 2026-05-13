"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import {
  portfolioCompareSelectionCopy,
  zhCN,
} from "@/content/zh-cn";
import {
  filterListingsByStatus,
  sortListings,
  type ListingSortKey,
  type ListingStatusFilter,
} from "@/lib/algorithm/portfolio";
import { getAllClientListings } from "@/lib/local-store/listing-lookup";
import type { Listing, ListingStatus } from "@/types/listing";

const statusOptions: {
  value: ListingStatusFilter;
  label: string;
}[] = [
  { value: "all", label: zhCN.portfolioList.statusOptions.all },
  { value: "draft", label: zhCN.portfolioList.statusOptions.draft },
  { value: "watching", label: zhCN.portfolioList.statusOptions.watching },
  { value: "visited", label: zhCN.portfolioList.statusOptions.visited },
  { value: "shortlisted", label: zhCN.portfolioList.statusOptions.shortlisted },
  { value: "rejected", label: zhCN.portfolioList.statusOptions.rejected },
];

const sortOptions: {
  value: ListingSortKey;
  label: string;
}[] = [
  {
    value: "createdAtDesc",
    label: zhCN.portfolioList.sortOptions.createdAtDesc,
  },
  { value: "rentAsc", label: zhCN.portfolioList.sortOptions.rentAsc },
  { value: "rentDesc", label: zhCN.portfolioList.sortOptions.rentDesc },
  { value: "commuteAsc", label: zhCN.portfolioList.sortOptions.commuteAsc },
  { value: "scoreDesc", label: zhCN.portfolioList.sortOptions.scoreDesc },
];

const statusText: Record<ListingStatus, string> = zhCN.common.listingStatus;
const maxCompareSelection = 4;
const minCompareSelection = 2;

export function PortfolioList() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<ListingStatusFilter>("all");
  const [sortKey, setSortKey] = useState<ListingSortKey>("createdAtDesc");
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);

  useEffect(() => {
    setListings(getAllClientListings());
  }, []);

  const visibleListings = useMemo(() => {
    const filteredListings = filterListingsByStatus(listings, statusFilter);
    return sortListings(filteredListings, sortKey);
  }, [listings, statusFilter, sortKey]);

  const averageVisibleRent = useMemo(() => {
    if (visibleListings.length === 0) {
      return 0;
    }

    return Math.round(
      visibleListings.reduce((sum, item) => sum + item.rent, 0) /
        visibleListings.length
    );
  }, [visibleListings]);

  const shortlistedCount = useMemo(() => {
    return listings.filter((listing) => listing.status === "shortlisted")
      .length;
  }, [listings]);

  const selectedCount = selectedListingIds.length;
  const canCompare =
    selectedCount >= minCompareSelection && selectedCount <= maxCompareSelection;

  function toggleCompareSelection(listingId: string) {
    setSelectedListingIds((current) => {
      if (current.includes(listingId)) {
        return current.filter((id) => id !== listingId);
      }

      if (current.length >= maxCompareSelection) {
        return current;
      }

      return [...current, listingId];
    });
  }

  function clearCompareSelection() {
    setSelectedListingIds([]);
  }

  function goToCompare() {
    if (!canCompare) {
      return;
    }

    const ids = selectedListingIds.map((id) => encodeURIComponent(id)).join(",");
    router.push(`/compare?ids=${ids}`);
  }

  const compareHint =
    selectedCount === 0
      ? portfolioCompareSelectionCopy.hints.none
      : selectedCount === 1
        ? portfolioCompareSelectionCopy.hints.tooFew
        : selectedCount >= maxCompareSelection
          ? portfolioCompareSelectionCopy.hints.maxReached
          : portfolioCompareSelectionCopy.hints.ready;

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            {zhCN.portfolioList.stats.totalListings}
          </p>
          <p className="mt-2 text-3xl font-bold">{listings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            {zhCN.portfolioList.stats.currentlyVisible}
          </p>
          <p className="mt-2 text-3xl font-bold">{visibleListings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            {zhCN.portfolioList.stats.averageVisibleRent}
          </p>
          <p className="mt-2 text-3xl font-bold">
            {zhCN.common.currencyCny}
            {averageVisibleRent}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {zhCN.portfolioList.controls.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {zhCN.portfolioList.controls.description}
            </p>
          </div>

          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
            {zhCN.portfolioList.controls.shortlisted}: {shortlistedCount}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">
              {zhCN.portfolioList.controls.filterByStatus}
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ListingStatusFilter)
              }
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">
              {zhCN.portfolioList.controls.sortBy}
            </span>
            <select
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as ListingSortKey)
              }
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {statusFilter !== "all" ? (
          <p className="mt-4 text-sm text-slate-500">
            {zhCN.portfolioList.controls.showingStatusPrefix}
            “{statusText[statusFilter]}”
            {zhCN.portfolioList.controls.showingStatusSuffix}
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            {zhCN.portfolioList.controls.showingAll}
          </p>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">
              {portfolioCompareSelectionCopy.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {portfolioCompareSelectionCopy.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
              {portfolioCompareSelectionCopy.selectedPrefix}
              {selectedCount}
              {portfolioCompareSelectionCopy.selectedSuffix}
            </span>

            <button
              type="button"
              onClick={clearCompareSelection}
              disabled={selectedCount === 0}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {portfolioCompareSelectionCopy.clearAction}
            </button>

            <button
              type="button"
              onClick={goToCompare}
              disabled={!canCompare}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {portfolioCompareSelectionCopy.compareAction}
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">{compareHint}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {portfolioCompareSelectionCopy.referenceNote}
        </p>
      </div>

      {visibleListings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">
            {zhCN.portfolioList.empty.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {zhCN.portfolioList.empty.description}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleListings.map((listing) => {
            const selected = selectedListingIds.includes(listing.id);
            const selectionDisabled =
              !selected && selectedListingIds.length >= maxCompareSelection;

            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                selectable
                selected={selected}
                selectionDisabled={selectionDisabled}
                onToggleSelect={toggleCompareSelection}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
