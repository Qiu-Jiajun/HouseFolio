"use client";

import { useEffect, useState } from "react";
import {
  clearLocalHouseFolioData,
  downloadLocalHouseFolioData,
  getLocalHouseFolioDataSnapshot,
  type LocalHouseFolioDataExport,
} from "@/lib/privacy/local-data";

export function SettingsLocalDataPanel() {
  const [snapshot, setSnapshot] = useState<LocalHouseFolioDataExport | null>(
    null
  );
  const [message, setMessage] = useState("");

  function refreshSnapshot() {
    setSnapshot(getLocalHouseFolioDataSnapshot());
  }

  useEffect(() => {
    refreshSnapshot();
  }, []);

  function handleExport() {
    downloadLocalHouseFolioData();
    setMessage("Local HouseFolio data export started.");
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Clear all HouseFolio local data from this browser? Mock listings in code will still remain visible."
    );

    if (!confirmed) {
      return;
    }

    clearLocalHouseFolioData();
    refreshSnapshot();
    setMessage("Local HouseFolio data has been cleared from this browser.");
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-2xl border border-emerald-900 bg-emerald-950 px-5 py-4 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          Local Data Controls
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Current Phase 1 data is stored in this browser only. This page lets you
          export or clear local HouseFolio data. It does not affect mock listings
          stored in source code, and it does not delete any cloud data because
          cloud storage is not connected yet.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
          >
            Export local data as JSON
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-red-900 px-5 py-3 text-sm font-medium text-red-200 hover:bg-red-950"
          >
            Clear local HouseFolio data
          </button>

          <button
            type="button"
            onClick={refreshSnapshot}
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Refresh snapshot
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          Local Storage Snapshot
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {snapshot?.items.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <p className="text-sm text-slate-500">{item.key}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {item.label}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Exists</p>
                  <p className="mt-1 text-slate-200">
                    {item.exists ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Count</p>
                  <p className="mt-1 text-slate-200">{item.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          Compliance Boundary
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
          <li>HouseFolio does not crawl third-party listing pages.</li>
          <li>HouseFolio does not publish a public listing database.</li>
          <li>HouseFolio does not broker rental transactions.</li>
          <li>Current Phase 1 data stays in browser localStorage.</li>
          <li>AI, map APIs, cloud database, and cloud storage are not connected yet.</li>
        </ul>
      </section>
    </div>
  );
}