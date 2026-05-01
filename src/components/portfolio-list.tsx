"use client";

import { useEffect, useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { getAllClientListings } from "@/lib/local-store/listing-lookup";
import type { Listing } from "@/types/listing";

export function PortfolioList() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(getAllClientListings());
  }, []);

  const averageRent = useMemo(() => {
    if (listings.length === 0) {
      return 0;
    }

    return Math.round(
      listings.reduce((sum, item) => sum + item.rent, 0) / listings.length
    );
  }, [listings]);

  const localAddedCount = listings.filter((listing) =>
    listing.id.startsWith("listing-")
  ).length - 3;

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">候选房源</p>
          <p className="mt-2 text-3xl font-bold">{listings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">平均租金</p>
          <p className="mt-2 text-3xl font-bold">¥{averageRent}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">本地新增</p>
          <p className="mt-2 text-3xl font-bold">
            {Math.max(localAddedCount, 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
}