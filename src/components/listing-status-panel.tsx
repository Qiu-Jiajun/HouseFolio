"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import { saveListingStatus } from "@/lib/local-store/listing-status";
import type { ListingStatus } from "@/types/listing";

type ListingStatusPanelProps = {
  listingId: string;
  status: ListingStatus;
  onStatusChange: (status: ListingStatus) => void;
};

const statusOptions: {
  value: ListingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "draft",
    label: zhCN.listingStatusPanel.options.draft.label,
    description: zhCN.listingStatusPanel.options.draft.description,
  },
  {
    value: "watching",
    label: zhCN.listingStatusPanel.options.watching.label,
    description: zhCN.listingStatusPanel.options.watching.description,
  },
  {
    value: "visited",
    label: zhCN.listingStatusPanel.options.visited.label,
    description: zhCN.listingStatusPanel.options.visited.description,
  },
  {
    value: "shortlisted",
    label: zhCN.listingStatusPanel.options.shortlisted.label,
    description: zhCN.listingStatusPanel.options.shortlisted.description,
  },
  {
    value: "rejected",
    label: zhCN.listingStatusPanel.options.rejected.label,
    description: zhCN.listingStatusPanel.options.rejected.description,
  },
];

export function ListingStatusPanel({
  listingId,
  status,
  onStatusChange,
}: ListingStatusPanelProps) {
  const [currentStatus, setCurrentStatus] = useState<ListingStatus>(status);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  function handleStatusChange(nextStatus: ListingStatus) {
    setCurrentStatus(nextStatus);
    saveListingStatus(listingId, nextStatus);
    onStatusChange(nextStatus);
    setSavedMessage(zhCN.listingStatusPanel.savedMessage);
  }

  const currentOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">
        {zhCN.listingStatusPanel.title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {zhCN.listingStatusPanel.description}
      </p>

      <label className="mt-5 block">
        <span className="text-sm text-slate-300">
          {zhCN.listingStatusPanel.currentStatus}
        </span>
        <select
          value={currentStatus}
          onChange={(event) =>
            handleStatusChange(event.target.value as ListingStatus)
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

      {currentOption ? (
        <div className="mt-5 rounded-xl bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.listingStatusPanel.statusDescription}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {currentOption.description}
          </p>
        </div>
      ) : null}

      {savedMessage ? (
        <div className="mt-5 rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
          {savedMessage}
        </div>
      ) : null}
    </div>
  );
}