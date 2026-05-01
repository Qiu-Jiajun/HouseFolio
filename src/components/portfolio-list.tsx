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
  { value: "all", label: "全部" },
  { value: "draft", label: "草稿" },
  { value: "watching", label: "关注中" },
  { value: "visited", label: "已看房" },
  { value: "shortlisted", label: "候选" },
  { value: "rejected", label: "已排除" },
];

const sortOptions: {
  value: ListingSortKey;
  label: string;
}[] = [
  { value: "createdAtDesc", label: "最近添加优先" },
  { value: "rentAsc", label: "租金从低到高" },
  { value: "rentDesc", label: "租金从高到低" },
  { value: "commuteAsc", label: "通勤时间最短" },
  { value: "scoreDesc", label: "综合分最高" },
];

const statusText: Record<ListingStatus, string> = {
  draft: "草稿",
  watching: "关注中",
  visited: "已看房",
  shortlisted: "候选",
  rejected: "已排除",
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
          <p className="text-sm text-slate-500">全部房源</p>
          <p className="mt-2 text-3xl font-bold">{listings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">当前显示</p>
          <p className="mt-2 text-3xl font-bold">{visibleListings.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">当前平均租金</p>
          <p className="mt-2 text-3xl font-bold">¥{averageVisibleRent}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Portfolio 筛选与排序
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              这里是 L2 算法层的入口。当前先用规则完成状态筛选和基础排序，
              后续会扩展为综合评分、权重排序和多房源对比。
            </p>
          </div>

          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
            候选池：{shortlistedCount} 套
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">按状态筛选</span>
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
            <span className="text-sm text-slate-300">排序方式</span>
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
            当前仅展示状态为「{statusText[statusFilter]}」的房源。
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            当前展示全部房源。
          </p>
        )}
      </div>

      {visibleListings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">暂无匹配房源</h2>
          <p className="mt-3 text-sm text-slate-400">
            可以切换筛选条件，或返回详情页调整房源状态。
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