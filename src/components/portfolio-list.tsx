"use client";

import { useEffect, useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
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
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "watching", label: "Watching" },
  { value: "visited", label: "Visited" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

const sortOptions: {
  value: ListingSortKey;
  label: string;
}[] = [
  { value: "createdAtDesc", label: "Recently added" },
  { value: "rentAsc", label: "Rent: low to high" },
  { value: "rentDesc", label: "Rent: high to low" },
  { value: "commuteAsc", label: "Shortest commute" },
  { value: "scoreDesc", label: "Reference score: high to low" },
];

const statusText: Record<ListingStatus, string> = {
  draft: "Draft",
  watching: "Watching",
  visited: "Visited",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export function PortfolioList() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<ListingStatusFilter>("all");
  const [sortKey, setSortKey] = useState<ListingSortKey>("createdAtDesc");

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

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Total Listings</p>
          <p className="mt-2 text-3xl font-bold">{listings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Currently Visible</p>
          <p className="mt-2 text-3xl font-bold">{visibleListings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">Average Visible Rent</p>
          <p className="mt-2 text-3xl font-bold">CNY {averageVisibleRent}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Portfolio Filters and Sorting
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This is the current L2 algorithm entry point. Sorting uses simple
              rules and reference scores. The score is only an auxiliary signal,
              not a final recommendation or a product promise.
            </p>
          </div>

          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
            Shortlisted: {shortlistedCount}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Filter by status</span>
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
            <span className="text-sm text-slate-300">Sort by</span>
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
            Showing listings with status: {statusText[statusFilter]}.
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Showing all listings.
          </p>
        )}
      </div>

      {visibleListings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">No matching listings</h2>
          <p className="mt-3 text-sm text-slate-400">
            Try changing the filter, or update listing status on the detail page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}