"use client";

import { FormEvent, useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  addWorkLocation,
  deleteWorkLocation,
  loadWorkLocations,
} from "@/lib/local-store/work-locations";
import type { WorkLocation } from "@/types/work-location";

export function WorkLocationSettingsPanel() {
  const [workLocations, setWorkLocations] = useState<WorkLocation[]>([]);
  const [name, setName] = useState("");
  const [addressHint, setAddressHint] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function refreshWorkLocations() {
    setWorkLocations(loadWorkLocations());
  }

  useEffect(() => {
    refreshWorkLocations();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError(zhCN.workLocationSettingsPanel.errors.nameRequired);
      return;
    }

    if (!addressHint.trim()) {
      setError(zhCN.workLocationSettingsPanel.errors.addressHintRequired);
      return;
    }

    addWorkLocation({
      name: name.trim(),
      addressHint: addressHint.trim(),
      note: note.trim() || undefined,
    });

    setName("");
    setAddressHint("");
    setNote("");
    refreshWorkLocations();
    setMessage(zhCN.workLocationSettingsPanel.savedMessage);
  }

  function handleDelete(workLocationId: string) {
    const confirmed = window.confirm(
      zhCN.workLocationSettingsPanel.deleteConfirm
    );

    if (!confirmed) {
      return;
    }

    deleteWorkLocation(workLocationId);
    refreshWorkLocations();
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {zhCN.workLocationSettingsPanel.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {zhCN.workLocationSettingsPanel.description}
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-900 bg-amber-950/40 p-4">
        <p className="text-sm leading-6 text-amber-100">
          {zhCN.workLocationSettingsPanel.boundary}
        </p>
      </div>

      {message ? (
        <div className="mb-5 rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.workLocationSettingsPanel.form.name.label}
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={zhCN.workLocationSettingsPanel.form.name.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.workLocationSettingsPanel.form.addressHint.label}
          </span>
          <input
            value={addressHint}
            onChange={(event) => setAddressHint(event.target.value)}
            placeholder={
              zhCN.workLocationSettingsPanel.form.addressHint.placeholder
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-slate-300">
            {zhCN.workLocationSettingsPanel.form.note.label}
          </span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder={zhCN.workLocationSettingsPanel.form.note.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-slate-400"
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
          >
            {zhCN.workLocationSettingsPanel.form.save}
          </button>
        </div>
      </form>

      <div className="mt-8">
        {workLocations.length === 0 ? (
          <p className="rounded-xl bg-slate-950 p-4 text-sm text-slate-500">
            {zhCN.workLocationSettingsPanel.empty}
          </p>
        ) : (
          <div className="grid gap-4">
            {workLocations.map((workLocation) => (
              <article
                key={workLocation.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {workLocation.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {zhCN.workLocationSettingsPanel.cards.addressHint}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {workLocation.addressHint}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(workLocation.id)}
                    className="rounded-full border border-red-900 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-950"
                  >
                    {zhCN.workLocationSettingsPanel.cards.delete}
                  </button>
                </div>

                {workLocation.note ? (
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">
                      {zhCN.workLocationSettingsPanel.cards.note}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {workLocation.note}
                    </p>
                  </div>
                ) : null}

                <p className="mt-4 text-xs text-slate-600">
                  {zhCN.workLocationSettingsPanel.cards.createdAt}:{" "}
                  {new Date(workLocation.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}