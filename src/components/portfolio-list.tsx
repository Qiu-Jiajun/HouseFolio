"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListingDeleteConfirmationDialog } from "@/components/listing-delete-confirmation-dialog";
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
import { deleteListingCompletely } from "@/lib/local-store/listing-deletion";
import { runLegacyMockListingCleanupOnce } from "@/lib/local-store/legacy-mock-cleanup";
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
  const [listingIdPendingDeletion, setListingIdPendingDeletion] =
    useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadListings() {
      await runLegacyMockListingCleanupOnce();

      if (isActive) {
        setListings(getAllClientListings());
      }
    }

    void loadListings();

    return () => {
      isActive = false;
    };
  }, []);

  function refreshListings() {
    setListings(getAllClientListings());
  }

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

  function openDeleteDialog(listingId: string) {
    setDeleteError("");
    setListingIdPendingDeletion(listingId);
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setListingIdPendingDeletion(null);
  }

  async function confirmDeleteListing() {
    if (!listingIdPendingDeletion || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteListingCompletely(listingIdPendingDeletion);
      setSelectedListingIds((current) =>
        current.filter((id) => id !== listingIdPendingDeletion)
      );
      refreshListings();
      setListingIdPendingDeletion(null);
    } catch {
      setDeleteError(zhCN.listingDetailView.dangerZone.error);
    } finally {
      setIsDeleting(false);
    }
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
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e5dccd] bg-white/78 p-5 shadow-sm">
          <p className="text-sm text-[#80786a]">
            {zhCN.portfolioList.stats.totalListings}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#282417]">
            {listings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5dccd] bg-white/78 p-5 shadow-sm">
          <p className="text-sm text-[#80786a]">
            {zhCN.portfolioList.stats.currentlyVisible}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#282417]">
            {visibleListings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5dccd] bg-white/78 p-5 shadow-sm">
          <p className="text-sm text-[#80786a]">
            {zhCN.portfolioList.stats.averageVisibleRent}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#282417]">
            {zhCN.common.currencyCny}
            {averageVisibleRent}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-[1.75rem] border border-[#e3dacb] bg-[#fffaf2]/90 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#282417]">
              {zhCN.portfolioList.controls.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#746c5f]">
              {zhCN.portfolioList.controls.description}
            </p>
          </div>

          <div className="rounded-full border border-[#dfd5c4] bg-white/80 px-4 py-2 text-sm text-[#65683e]">
            {zhCN.portfolioList.controls.shortlisted}: {shortlistedCount}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-[#5d584d]">
              {zhCN.portfolioList.controls.filterByStatus}
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ListingStatusFilter)
              }
              className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none transition focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-[#5d584d]">
              {zhCN.portfolioList.controls.sortBy}
            </span>
            <select
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as ListingSortKey)
              }
              className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-white px-4 py-3 text-sm text-[#282417] outline-none transition focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
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
          <p className="mt-4 text-sm text-[#82786a]">
            {zhCN.portfolioList.controls.showingStatusPrefix}
            “{statusText[statusFilter]}”
            {zhCN.portfolioList.controls.showingStatusSuffix}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[#82786a]">
            {zhCN.portfolioList.controls.showingAll}
          </p>
        )}
      </div>

      <div className="mb-7 rounded-[1.75rem] border border-[#d9ddbd] bg-[#f1f4e4] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#5b6435]">
              {portfolioCompareSelectionCopy.title}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d714e]">
              {portfolioCompareSelectionCopy.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/75 px-4 py-2 text-sm text-[#5a6135]">
              {portfolioCompareSelectionCopy.selectedPrefix}
              {selectedCount}
              {portfolioCompareSelectionCopy.selectedSuffix}
            </span>

            <button
              type="button"
              onClick={clearCompareSelection}
              disabled={selectedCount === 0}
              className="rounded-full border border-[#c7cca2] bg-transparent px-4 py-2 text-sm text-[#5a6135] transition hover:border-[#9ba36c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {portfolioCompareSelectionCopy.clearAction}
            </button>

            <button
              type="button"
              onClick={goToCompare}
              disabled={!canCompare}
              className="rounded-full bg-[#727a3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#606936] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {portfolioCompareSelectionCopy.compareAction}
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#697048]">{compareHint}</p>
        <p className="mt-2 text-xs leading-5 text-[#838962]">
          {portfolioCompareSelectionCopy.referenceNote}
        </p>
      </div>

      {deleteError ? (
        <p className="mb-5 rounded-2xl border border-[#8f1f1b] bg-[#fff3ef] px-5 py-4 text-sm leading-6 text-[#7b1f1a]">
          {deleteError}
        </p>
      ) : null}

      {visibleListings.length === 0 ? (
        <div className="rounded-[2rem] border border-[#e3dacb] bg-[#fffaf2] p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#282417]">
            {zhCN.portfolioList.empty.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#746c5f]">
            {zhCN.portfolioList.empty.description}
          </p>
          <a
            href="/portfolio/new"
            className="mt-6 inline-flex rounded-full bg-[#727a3f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#606936]"
          >
            {zhCN.portfolioList.empty.action}
          </a>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
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
                onDelete={openDeleteDialog}
                deleteDisabled={isDeleting}
              />
            );
          })}
        </div>
      )}

      <ListingDeleteConfirmationDialog
        isOpen={listingIdPendingDeletion !== null}
        isDeleting={isDeleting}
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          void confirmDeleteListing();
        }}
      />
    </>
  );
}
