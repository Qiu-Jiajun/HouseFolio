"use client";

import { useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  clearLocalHouseFolioData,
  downloadLocalHouseFolioData,
  getLocalHouseFolioDataSnapshot,
  type LocalHouseFolioDataExport,
} from "@/lib/privacy/local-data";

const localDataLabels: Record<string, string> = {
  ...zhCN.settingsLocalDataPanel.localDataLabels,
};

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
    setMessage(zhCN.settingsLocalDataPanel.messages.exportStarted);
  }

  function handleClear() {
    const confirmed = window.confirm(
      zhCN.settingsLocalDataPanel.messages.clearConfirm
    );

    if (!confirmed) {
      return;
    }

    clearLocalHouseFolioData();
    refreshSnapshot();
    setMessage(zhCN.settingsLocalDataPanel.messages.cleared);
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
          {zhCN.settingsLocalDataPanel.controls.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {zhCN.settingsLocalDataPanel.controls.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
          >
            {zhCN.settingsLocalDataPanel.controls.exportJson}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-red-900 px-5 py-3 text-sm font-medium text-red-200 hover:bg-red-950"
          >
            {zhCN.settingsLocalDataPanel.controls.clearLocalData}
          </button>

          <button
            type="button"
            onClick={refreshSnapshot}
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            {zhCN.settingsLocalDataPanel.controls.refreshSnapshot}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          {zhCN.settingsLocalDataPanel.snapshot.title}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {snapshot?.items.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <p className="text-sm text-slate-500">{item.key}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {localDataLabels[item.key] ?? item.label}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">
                    {zhCN.settingsLocalDataPanel.snapshot.exists}
                  </p>
                  <p className="mt-1 text-slate-200">
                    {item.exists ? zhCN.common.yes : zhCN.common.no}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {zhCN.settingsLocalDataPanel.snapshot.count}
                  </p>
                  <p className="mt-1 text-slate-200">{item.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">
          {zhCN.settingsLocalDataPanel.complianceBoundary.title}
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
          {zhCN.settingsLocalDataPanel.complianceBoundary.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}