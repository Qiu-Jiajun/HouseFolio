"use client";

import { useMemo, useState } from "react";

import { contractReviewCopy } from "@/content/zh-cn";
import { segmentContractClauses } from "@/lib/contract/clause-segmentation";

export function ContractReviewPanel() {
  const [contractText, setContractText] = useState("");

  const segments = useMemo(
    () => segmentContractClauses(contractText),
    [contractText],
  );

  const hasText = contractText.trim().length > 0;

  return (
    <section className="rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-5 shadow-[0_24px_80px_rgba(92,74,48,0.10)] sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.75rem] border border-[#e3dacb] bg-white/76 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#73744b]">
                {contractReviewCopy.input.title}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#242114]">
                {contractReviewCopy.input.label}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setContractText("")}
              disabled={!hasText}
              className="rounded-full border border-[#d8cdbc] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {contractReviewCopy.input.clear}
            </button>
          </div>

          <label className="mt-5 block">
            <span className="sr-only">{contractReviewCopy.input.label}</span>
            <textarea
              value={contractText}
              onChange={(event) => setContractText(event.target.value)}
              placeholder={contractReviewCopy.input.placeholder}
              className="min-h-[28rem] w-full resize-y rounded-[1.5rem] border border-[#ddd2c0] bg-[#fffdf8] px-5 py-4 text-base leading-7 text-[#2f2b1d] outline-none transition placeholder:text-[#a79d8d] focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
            />
          </label>

          <p className="mt-4 rounded-2xl bg-[#f5f0e6] px-4 py-3 text-sm leading-6 text-[#746c5f]">
            {contractReviewCopy.input.helper}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[#d9ddbd] bg-[#f7f8ed] p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#5b6435]">
                {contractReviewCopy.preview.title}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#242114]">
                {hasText
                  ? `${contractReviewCopy.preview.countPrefix}${segments.length}${contractReviewCopy.preview.countSuffix}`
                  : contractReviewCopy.preview.emptyTitle}
              </h2>
            </div>
          </div>

          {!hasText ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#cfd4aa] bg-white/72 p-6">
              <p className="text-base leading-7 text-[#6d714e]">
                {contractReviewCopy.preview.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {segments.map((segment, index) => (
                <article
                  key={segment.id}
                  className="rounded-[1.5rem] border border-[#e3dacb] bg-white/82 p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-[#73744b]">
                    {segment.title.startsWith("片段")
                      ? segment.title
                      : `${contractReviewCopy.preview.segmentFallbackTitle} ${
                          index + 1
                        } · ${segment.title}`}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4f493f]">
                    {segment.text}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
