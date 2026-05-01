"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  loadListingNotes,
  loadListingRatings,
  saveListingNote,
  saveListingRatings,
} from "@/lib/local-store/listing-notes";
import type {
  ListingNote,
  ListingSubjectiveRatings,
} from "@/types/listing-note";

type ListingNotesPanelProps = {
  listingId: string;
};

function RatingSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
      >
        <option value={1}>1 分 · 很差</option>
        <option value={2}>2 分 · 偏弱</option>
        <option value={3}>3 分 · 一般</option>
        <option value={4}>4 分 · 较好</option>
        <option value={5}>5 分 · 很好</option>
      </select>
    </label>
  );
}

export function ListingNotesPanel({ listingId }: ListingNotesPanelProps) {
  const [notes, setNotes] = useState<ListingNote[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [light, setLight] = useState(3);
  const [quiet, setQuiet] = useState(3);
  const [decoration, setDecoration] = useState(3);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setNotes(loadListingNotes(listingId));

    const existingRatings = loadListingRatings(listingId);

    if (existingRatings) {
      setLight(existingRatings.light);
      setQuiet(existingRatings.quiet);
      setDecoration(existingRatings.decoration);
    }
  }, [listingId]);

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedMessage("");

    const trimmedContent = noteContent.trim();

    if (!trimmedContent) {
      return;
    }

    const nextNote: ListingNote = {
      id: `note-${Date.now()}`,
      listingId,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    saveListingNote(nextNote);
    setNotes(loadListingNotes(listingId));
    setNoteContent("");
    setSavedMessage("笔记已保存到本地。");
  }

  function handleSaveRatings() {
    const nextRatings: ListingSubjectiveRatings = {
      listingId,
      light,
      quiet,
      decoration,
      updatedAt: new Date().toISOString(),
    };

    saveListingRatings(nextRatings);
    setSavedMessage("主观评分已保存到本地。");
  }

  const averageRating = ((light + quiet + decoration) / 3).toFixed(1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">用户笔记与主观评分</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        这里记录用户自己的看房判断。当前阶段数据仅保存在浏览器本地，不上传云端。
        请不要填写手机号、微信号、身份证号、具体门牌号或合同原文。
      </p>

      {savedMessage ? (
        <div className="mt-5 rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
          {savedMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <RatingSelect label="采光评分" value={light} onChange={setLight} />
        <RatingSelect label="安静评分" value={quiet} onChange={setQuiet} />
        <RatingSelect
          label="装修评分"
          value={decoration}
          onChange={setDecoration}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950 p-4">
        <p className="text-sm text-slate-400">
          当前主观均分：
          <span className="ml-2 text-lg font-semibold text-white">
            {averageRating}
          </span>
        </p>

        <button
          type="button"
          onClick={handleSaveRatings}
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          保存主观评分
        </button>
      </div>

      <form onSubmit={handleSaveNote} className="mt-8">
        <label className="block">
          <span className="text-sm text-slate-300">看房笔记</span>
          <textarea
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            rows={5}
            placeholder="例如：采光不错，但临街有些吵；厨房偏小；房东要求押一付三。不要填写手机号、微信号、具体门牌号等敏感信息。"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-slate-400"
          />
        </label>

        <button
          type="submit"
          className="mt-4 rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          保存笔记
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">历史笔记</h3>

        {notes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">暂无笔记。</p>
        ) : (
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <article
                key={note.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm leading-6 text-slate-300">
                  {note.content}
                </p>
                <p className="mt-3 text-xs text-slate-600">
                  {new Date(note.createdAt).toLocaleString("zh-CN")}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}