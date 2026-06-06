"use client";

import { FormEvent, useEffect, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  getListingViewingRecord,
  saveListingViewingRecord,
} from "@/lib/local-store/listing-viewing-records";

type ListingViewingRecordPanelProps = {
  listingId: string;
};

const copy = zhCN.listingViewingRecordPanel;
const ratingOptionValues = Array.from({ length: 5 }, (_, index) => index + 1);

function toOptionalRating(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed >= 1 &&
    parsed <= 5 &&
    Number.isInteger(parsed)
    ? parsed
    : undefined;
}

function RatingSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
      >
        <option value="">{copy.ratingEmpty}</option>
        {ratingOptionValues.map((option) => (
          <option key={option} value={option}>
            {option} / 5
          </option>
        ))}
      </select>
    </label>
  );
}

export function ListingViewingRecordPanel({
  listingId,
}: ListingViewingRecordPanelProps) {
  const [expectedRating, setExpectedRating] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [preVisitMemo, setPreVisitMemo] = useState("");
  const [postVisitImpression, setPostVisitImpression] = useState("");
  const [viewedAt, setViewedAt] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const record = getListingViewingRecord(listingId);

    setExpectedRating(record?.expectedRating?.toString() ?? "");
    setOverallRating(record?.overallRating?.toString() ?? "");
    setPreVisitMemo(record?.preVisitMemo ?? "");
    setPostVisitImpression(record?.postVisitImpression ?? "");
    setViewedAt(record?.viewedAt ?? "");
    setSavedMessage("");
  }, [listingId]);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveListingViewingRecord({
      listingId,
      expectedRating: toOptionalRating(expectedRating),
      overallRating: toOptionalRating(overallRating),
      preVisitMemo: preVisitMemo.trim() || undefined,
      postVisitImpression: postVisitImpression.trim() || undefined,
      viewedAt: viewedAt || undefined,
    });

    setSavedMessage(copy.savedMessage);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">{copy.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {copy.description}
      </p>

      {savedMessage ? (
        <div className="mt-5 rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
          {savedMessage}
        </div>
      ) : null}

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <RatingSelect
            label={copy.fields.expectedRating}
            value={expectedRating}
            onChange={setExpectedRating}
          />
          <RatingSelect
            label={copy.fields.overallRating}
            value={overallRating}
            onChange={setOverallRating}
          />
        </div>

        <label className="block">
          <span className="text-sm text-slate-300">
            {copy.fields.viewedAt}
          </span>
          <input
            type="datetime-local"
            value={viewedAt}
            onChange={(event) => setViewedAt(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {copy.fields.preVisitMemo}
          </span>
          <textarea
            value={preVisitMemo}
            onChange={(event) => setPreVisitMemo(event.target.value)}
            rows={4}
            placeholder={copy.placeholders.preVisitMemo}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {copy.fields.postVisitImpression}
          </span>
          <textarea
            value={postVisitImpression}
            onChange={(event) => setPostVisitImpression(event.target.value)}
            rows={4}
            placeholder={copy.placeholders.postVisitImpression}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-slate-400"
          />
        </label>

        <button
          type="submit"
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          {copy.saveButton}
        </button>
      </form>
    </section>
  );
}
