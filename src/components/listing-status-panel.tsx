"use client";

import { useEffect, useState } from "react";
import type { ListingStatus } from "@/types/listing";
import { saveListingStatus } from "@/lib/local-store/listing-status";

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
    label: "草稿",
    description: "刚添加，还没有认真评估。",
  },
  {
    value: "watching",
    label: "关注中",
    description: "值得继续观察，但还没进入最终候选。",
  },
  {
    value: "visited",
    label: "已看房",
    description: "已经线下看过，等待复盘。",
  },
  {
    value: "shortlisted",
    label: "候选",
    description: "进入最终对比池，可以参与后续 L2 对比。",
  },
  {
    value: "rejected",
    label: "已排除",
    description: "暂不考虑，但保留决策记录。",
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
    setSavedMessage("状态已保存到本地。");
  }

  const currentOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">房源状态管理</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        状态用于标记这套房源在你的找房决策流程中的位置。当前阶段仅保存到浏览器本地。
      </p>

      <label className="mt-5 block">
        <span className="text-sm text-slate-300">当前状态</span>
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
          <p className="text-sm text-slate-500">状态说明</p>
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