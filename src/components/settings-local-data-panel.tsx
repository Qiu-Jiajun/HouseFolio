"use client";

import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { zhCN } from "@/content/zh-cn";
import {
  clearLocalHouseFolioData,
  downloadLocalHouseFolioData,
  getLocalHouseFolioDataSnapshot,
  type LocalHouseFolioDataExport,
} from "@/lib/privacy/local-data";
import {
  applyHouseFolioLocalDataImportPayload,
  parseHouseFolioLocalDataImportJson,
} from "@/lib/privacy/local-data-import";

const localDataLabels: Record<string, string> = {
  ...zhCN.settingsLocalDataPanel.localDataLabels,
};

type MessageTone = "success" | "error";

type PendingImportConfirmation = {
  payload: Parameters<typeof applyHouseFolioLocalDataImportPayload>[0];
  importableCount: number;
  ignoredCount: number;
};

export function SettingsLocalDataPanel() {
  const [snapshot, setSnapshot] = useState<LocalHouseFolioDataExport | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [pendingImportConfirmation, setPendingImportConfirmation] =
    useState<PendingImportConfirmation | null>(null);
  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  function refreshSnapshot() {
    setSnapshot(getLocalHouseFolioDataSnapshot());
  }

  function showSuccess(nextMessage: string) {
    setMessageTone("success");
    setMessage(nextMessage);
  }

  function showError(nextMessage: string) {
    setMessageTone("error");
    setMessage(nextMessage);
  }

  useEffect(() => {
    refreshSnapshot();
  }, []);

  function handleExport() {
    downloadLocalHouseFolioData();
    showSuccess(zhCN.settingsLocalDataPanel.messages.exportStarted);
  }

  function confirmClear() {
    clearLocalHouseFolioData();
    refreshSnapshot();
    setIsClearDialogOpen(false);
    showSuccess(zhCN.settingsLocalDataPanel.messages.cleared);
  }

  function handleImportFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedImportFile(file);
    setMessage("");
  }

  async function handleImport() {
    if (!selectedImportFile) {
      showError(zhCN.settingsLocalDataPanel.importJson.errors.noFileSelected);
      return;
    }

    setIsImporting(true);

    try {
      const fileText = await selectedImportFile.text();
      const parseResult = parseHouseFolioLocalDataImportJson(fileText);

      if (!parseResult.ok) {
        showError(parseResult.message);
        return;
      }

      setPendingImportConfirmation({
        payload: parseResult.payload,
        importableCount: parseResult.importableKeys.length,
        ignoredCount: parseResult.ignoredKeys.length,
      });
    } catch {
      showError(zhCN.settingsLocalDataPanel.importJson.errors.importFailed);
    } finally {
      setIsImporting(false);
    }
  }

  function confirmImport() {
    if (!pendingImportConfirmation) {
      return;
    }

    try {
      const applyResult = applyHouseFolioLocalDataImportPayload(
        pendingImportConfirmation.payload
      );

      refreshSnapshot();
      setSelectedImportFile(null);

      if (importFileInputRef.current) {
        importFileInputRef.current.value = "";
      }

      showSuccess(
        `${zhCN.settingsLocalDataPanel.importJson.messages.success} ${zhCN.settingsLocalDataPanel.importJson.importedKeys}: ${applyResult.importedKeys.length}`
      );
    } catch {
      showError(zhCN.settingsLocalDataPanel.importJson.errors.importFailed);
    } finally {
      setPendingImportConfirmation(null);
    }
  }

  const messageClassName =
    messageTone === "error"
      ? "rounded-2xl border border-red-900 bg-red-950 px-5 py-4 text-sm text-red-200"
      : "rounded-2xl border border-emerald-900 bg-emerald-950 px-5 py-4 text-sm text-emerald-200";

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={messageClassName}
          role={messageTone === "error" ? "alert" : "status"}
        >
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
            onClick={() => setIsClearDialogOpen(true)}
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
          {zhCN.settingsLocalDataPanel.importJson.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {zhCN.settingsLocalDataPanel.importJson.description}
        </p>

        <p className="mt-3 rounded-2xl border border-amber-900 bg-amber-950 px-4 py-3 text-sm leading-6 text-amber-100">
          {zhCN.settingsLocalDataPanel.importJson.warning}
        </p>

        <div className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-slate-200">
            {zhCN.settingsLocalDataPanel.importJson.fileLabel}
          </label>

          <input
            ref={importFileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFileChange}
            className="block w-full cursor-pointer rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-slate-200"
          />

          <p className="text-sm text-slate-500">
            {selectedImportFile
              ? `${zhCN.settingsLocalDataPanel.importJson.selectedFilePrefix}${selectedImportFile.name}`
              : zhCN.settingsLocalDataPanel.importJson.noFileSelected}
          </p>

          <button
            type="button"
            onClick={handleImport}
            disabled={!selectedImportFile || isImporting}
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting
              ? zhCN.settingsLocalDataPanel.importJson.importing
              : zhCN.settingsLocalDataPanel.importJson.action}
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

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        title={zhCN.settingsLocalDataPanel.messages.clearDialogTitle}
        description={zhCN.settingsLocalDataPanel.messages.clearConfirm}
        confirmLabel={zhCN.settingsLocalDataPanel.messages.clearDialogConfirm}
        cancelLabel={zhCN.settingsLocalDataPanel.messages.clearDialogCancel}
        onCancel={() => setIsClearDialogOpen(false)}
        onConfirm={confirmClear}
      />

      <ConfirmDialog
        isOpen={pendingImportConfirmation !== null}
        title={zhCN.settingsLocalDataPanel.importJson.confirmDialogTitle}
        description={
          <>
            <span className="block">
              {zhCN.settingsLocalDataPanel.importJson.confirmMessage}
            </span>
            {pendingImportConfirmation ? (
              <span className="mt-3 block rounded-xl bg-[#f4f0e7] px-4 py-3 text-xs leading-6 text-[#5f5a50]">
                {`${zhCN.settingsLocalDataPanel.importJson.recognizedKeys}: ${pendingImportConfirmation.importableCount}`}
                <br />
                {`${zhCN.settingsLocalDataPanel.importJson.ignoredKeys}: ${pendingImportConfirmation.ignoredCount}`}
              </span>
            ) : null}
          </>
        }
        confirmLabel={zhCN.settingsLocalDataPanel.importJson.confirmDialogAction}
        cancelLabel={zhCN.settingsLocalDataPanel.importJson.confirmDialogCancel}
        onCancel={() => setPendingImportConfirmation(null)}
        onConfirm={confirmImport}
      />
    </div>
  );
}