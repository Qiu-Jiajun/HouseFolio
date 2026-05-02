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
  onRatingsSaved?: () => void;
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
        <option value={1}>1 - Very poor</option>
        <option value={2}>2 - Weak</option>
        <option value={3}>3 - Average</option>
        <option value={4}>4 - Good</option>
        <option value={5}>5 - Very good</option>
      </select>
    </label>
  );
}

export function ListingNotesPanel({
  listingId,
  onRatingsSaved,
}: ListingNotesPanelProps) {
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
    setSavedMessage("Note saved locally.");
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
    setSavedMessage("Subjective ratings saved locally.");
    onRatingsSaved?.();
  }

  const averageRating = ((light + quiet + decoration) / 3).toFixed(1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">
        Notes and Subjective Ratings
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        Record your own viewing notes and subjective impressions. Current data is
        stored locally in the browser and is not uploaded to the cloud. Do not
        enter phone numbers, WeChat IDs, ID numbers, exact doorplate numbers, or
        contract text.
      </p>

      {savedMessage ? (
        <div className="mt-5 rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
          {savedMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <RatingSelect label="Light" value={light} onChange={setLight} />
        <RatingSelect label="Quietness" value={quiet} onChange={setQuiet} />
        <RatingSelect
          label="Decoration"
          value={decoration}
          onChange={setDecoration}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950 p-4">
        <p className="text-sm text-slate-400">
          Current subjective average:
          <span className="ml-2 text-lg font-semibold text-white">
            {averageRating}
          </span>
        </p>

        <button
          type="button"
          onClick={handleSaveRatings}
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          Save subjective ratings
        </button>
      </div>

      <form onSubmit={handleSaveNote} className="mt-8">
        <label className="block">
          <span className="text-sm text-slate-300">Viewing note</span>
          <textarea
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            rows={5}
            placeholder="Example: good light, but a little noisy; kitchen is small; landlord asks for one month deposit and three months rent. Do not enter sensitive information."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-slate-400"
          />
        </label>

        <button
          type="submit"
          className="mt-4 rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          Save note
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">Saved notes</h3>

        {notes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No notes yet.</p>
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
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}