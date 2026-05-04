"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import { getListingPhotoStorageSummary } from "@/lib/storage/photos";
import type { ListingPhotoStorageSummary } from "@/types/listing-photo";

function formatBytes(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (sizeBytes >= 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${sizeBytes} B`;
}

export function SettingsPhotoDataPanel() {
  const [summary, setSummary] = useState<ListingPhotoStorageSummary | null>(
    null,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function refreshPhotoSummary() {
    setErrorMessage("");

    try {
      const nextSummary = await getListingPhotoStorageSummary();
      setSummary(nextSummary);
    } catch {
      setErrorMessage(zhCN.settingsPhotoDataPanel.states.loadFailed);
      setSummary(null);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    void refreshPhotoSummary();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {zhCN.settingsPhotoDataPanel.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {zhCN.settingsPhotoDataPanel.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            {zhCN.settingsPhotoDataPanel.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void refreshPhotoSummary();
          }}
          className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          {zhCN.settingsPhotoDataPanel.actions.refresh}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-xl border border-amber-900 bg-amber-950 px-4 py-3 text-sm text-amber-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.settingsPhotoDataPanel.metrics.photoCount}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {isLoaded && summary ? summary.photoCount : zhCN.common.pending}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.settingsPhotoDataPanel.metrics.totalSize}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {isLoaded && summary
              ? formatBytes(summary.totalSizeBytes)
              : zhCN.common.pending}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            {zhCN.settingsPhotoDataPanel.metrics.storageLocation}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {zhCN.settingsPhotoDataPanel.values.localIndexedDb}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-800/80 bg-amber-950/40 p-4">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-amber-100">
          <li>{zhCN.settingsPhotoDataPanel.notices.localOnly}</li>
          <li>{zhCN.settingsPhotoDataPanel.notices.noCloudSync}</li>
          <li>{zhCN.settingsPhotoDataPanel.notices.noAi}</li>
          <li>{zhCN.settingsPhotoDataPanel.notices.browserDataWarning}</li>
          <li>{zhCN.settingsPhotoDataPanel.notices.backupLater}</li>
        </ul>
      </div>
    </section>
  );
}