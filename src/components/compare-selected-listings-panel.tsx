"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CompareExplanationPanel } from "@/components/compare-explanation-panel";
import { CompareTable } from "@/components/compare-table";

import { buildCompareExplanationInput } from "@/lib/ai/compare-explanation-input";
import {
  buildComparisonInputs,
  type ComparisonInput,
} from "@/lib/algorithm/comparison";
import { getAllClientListings } from "@/lib/local-store/listing-lookup";
import {
  compareMockAiExplanationCopy,
  compareSelectedListingsCopy,
  zhCN,
} from "@/content/zh-cn";
import type { CompareExplanationOutput } from "@/types/ai-compare-explanation";
import type { Listing, ListingCommuteSource } from "@/types/listing";

type CompareSelectedListingsPanelProps = {
  selectedIds: string[];
};

type FoundListingsResult = {
  foundListings: Listing[];
  missingIds: string[];
};

type MockAiExplanationStatus = "idle" | "loading" | "success" | "error";

type MockAiExplanationApiResponse =
  | {
      ok: true;
      provider: "mock";
      data: CompareExplanationOutput;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

const missingFieldLabels: Record<ComparisonInput["missingFields"][number], string> = {
  rentMonthly: "月租",
  areaSqm: "面积",
  layout: "户型",
  district: "区域",
  areaLabel: "位置线索",
  commuteMinutes: "通勤时间",
  referenceScore: "参考评分",
  subjectiveSummary: "主观评分",
};

const riskFlagLabels: Record<ComparisonInput["riskFlags"][number], string> = {
  missingLocation: "缺少位置线索",
  missingCommute: "缺少通勤结果",
  missingSubjectiveRating: "缺少主观评分",
  highRent: "月租偏高",
  lowArea: "面积偏小",
  longCommute: "通勤偏长",
};

function findListingsByIds(
  listings: Listing[],
  selectedIds: string[],
): FoundListingsResult {
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));
  const foundListings: Listing[] = [];
  const missingIds: string[] = [];

  for (const id of selectedIds) {
    const listing = listingById.get(id);

    if (listing) {
      foundListings.push(listing);
    } else {
      missingIds.push(id);
    }
  }

  return { foundListings, missingIds };
}

function formatNumber(value: number | undefined, suffix = "") {
  return typeof value === "number"
    ? `${value}${suffix}`
    : zhCN.common.pending;
}

function formatScore(value: number | undefined) {
  return typeof value === "number"
    ? value.toFixed(1)
    : zhCN.common.pending;
}

function getCommuteSourceLabel(source: ListingCommuteSource | undefined) {
  if (source === "cachedTransit") {
    return zhCN.listingCard.commuteSource.cachedTransit;
  }

  if (source === "listing") {
    return zhCN.listingCard.commuteSource.listing;
  }

  return zhCN.common.pending;
}

function renderTagList(items: string[], emptyText: string) {
  if (items.length === 0) {
    return <span className="text-neutral-400">{emptyText}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-600"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function renderMockAiList(title: string, items: string[]) {
  if (items.length === 0) {
    return null;
  }

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5">
      <h3 className="text-base font-semibold text-neutral-950">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-neutral-400">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CompareSelectedListingsPanel({
  selectedIds,
}: CompareSelectedListingsPanelProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mockAiStatus, setMockAiStatus] =
    useState<MockAiExplanationStatus>("idle");
  const [mockAiOutput, setMockAiOutput] =
    useState<CompareExplanationOutput | null>(null);
  const [mockAiError, setMockAiError] = useState<string | null>(null);
  const [mockAiConfirmationVisible, setMockAiConfirmationVisible] =
    useState(false);

  useEffect(() => {
    setListings(getAllClientListings());
    setLoaded(true);
  }, []);

  const { foundListings, missingIds } = useMemo(
    () => findListingsByIds(listings, selectedIds),
    [listings, selectedIds],
  );

  const comparisonModels = useMemo(
    () =>
      buildComparisonInputs(
        foundListings.map((listing) => ({
          listing,
        })),
      ),
    [foundListings],
  );

  async function handleGenerateMockAiExplanation() {
    setMockAiConfirmationVisible(false);
    setMockAiStatus("loading");
    setMockAiOutput(null);
    setMockAiError(null);

    try {
      const response = await fetch("/api/ai/compare-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(buildCompareExplanationInput(comparisonModels)),
      });

      const result =
        (await response.json()) as MockAiExplanationApiResponse;

      if (!response.ok || !result.ok) {
        throw new Error("mock_ai_explanation_failed");
      }

      setMockAiOutput(result.data);
      setMockAiStatus("success");
    } catch {
      setMockAiError(compareMockAiExplanationCopy.errorMessage);
      setMockAiStatus("error");
    }
  }

  if (!loaded) {
    return (
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">
          {compareSelectedListingsCopy.loading}
        </p>
      </section>
    );
  }

  if (selectedIds.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {compareSelectedListingsCopy.empty.noIdsTitle}
        </h2>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          {compareSelectedListingsCopy.empty.noIdsBody}
        </p>
        <Link
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {compareSelectedListingsCopy.returnToPortfolio}
        </Link>
      </section>
    );
  }

  if (selectedIds.length > 4) {
    return (
      <section className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {compareSelectedListingsCopy.empty.tooManyTitle}
        </h2>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          {compareSelectedListingsCopy.empty.tooManyBody}
        </p>
        <Link
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {compareSelectedListingsCopy.returnToPortfolio}
        </Link>
      </section>
    );
  }

  if (comparisonModels.length < 2) {
    return (
      <section className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {compareSelectedListingsCopy.empty.notEnoughFoundTitle}
        </h2>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          {compareSelectedListingsCopy.empty.notEnoughFoundBody}
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          {compareSelectedListingsCopy.foundPrefix}
          {comparisonModels.length}
          {compareSelectedListingsCopy.foundSuffix}
          {missingIds.length > 0
            ? `${compareSelectedListingsCopy.missingPrefix}${missingIds.length}${compareSelectedListingsCopy.missingSuffix}`
            : ""}
        </p>
        <Link
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {compareSelectedListingsCopy.returnToPortfolio}
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {compareSelectedListingsCopy.badge}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            {compareSelectedListingsCopy.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
            {compareSelectedListingsCopy.description}
          </p>
        </div>

        <Link
          href="/portfolio"
          className="inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-500"
        >
          {compareSelectedListingsCopy.returnToPortfolio}
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-600">
        {compareSelectedListingsCopy.foundPrefix}
        {comparisonModels.length}
        {compareSelectedListingsCopy.foundSuffix}
        {missingIds.length > 0 ? (
          <>
            {compareSelectedListingsCopy.missingPrefix}
            {missingIds.length}
            {compareSelectedListingsCopy.missingSuffix}
          </>
        ) : null}
      </div>

      <CompareTable models={comparisonModels} />
      <CompareExplanationPanel models={comparisonModels} />

      <section className="mt-6 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-neutral-500">
              {compareMockAiExplanationCopy.badge}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              {compareMockAiExplanationCopy.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-600">
              {compareMockAiExplanationCopy.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMockAiError(null);
              setMockAiConfirmationVisible(true);
            }}
            disabled={mockAiStatus === "loading"}
            className="inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {mockAiStatus === "loading"
              ? compareMockAiExplanationCopy.loadingAction
              : compareMockAiExplanationCopy.action}
          </button>
        </div>

        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-500">
          {compareMockAiExplanationCopy.boundaryNote}
        </p>

        {mockAiConfirmationVisible ? (
          <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-5">
            <div className="max-w-3xl">
              <h3 className="text-base font-semibold text-neutral-950">
                {compareMockAiExplanationCopy.confirmation.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {compareMockAiExplanationCopy.confirmation.body}
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl bg-neutral-50 p-4">
                <h4 className="text-sm font-semibold text-neutral-900">
                  {compareMockAiExplanationCopy.confirmation.sentDataTitle}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                  {compareMockAiExplanationCopy.confirmation.sentDataItems.map(
                    (item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-neutral-400">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </article>

              <article className="rounded-2xl bg-neutral-50 p-4">
                <h4 className="text-sm font-semibold text-neutral-900">
                  {compareMockAiExplanationCopy.confirmation.notSentDataTitle}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                  {compareMockAiExplanationCopy.confirmation.notSentDataItems.map(
                    (item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-neutral-400">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </article>
            </div>

            <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-500">
              {compareMockAiExplanationCopy.confirmation.disclaimer}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerateMockAiExplanation}
                disabled={mockAiStatus === "loading"}
                className="inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {mockAiStatus === "loading"
                  ? compareMockAiExplanationCopy.loadingAction
                  : compareMockAiExplanationCopy.confirmation.confirmAction}
              </button>

              <button
                type="button"
                onClick={() => setMockAiConfirmationVisible(false)}
                disabled={mockAiStatus === "loading"}
                className="inline-flex rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {compareMockAiExplanationCopy.confirmation.cancelAction}
              </button>
            </div>
          </div>
        ) : null}

        {mockAiError ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {mockAiError}
          </p>
        ) : null}

        {mockAiOutput ? (
          <div className="mt-5">
            <article className="rounded-3xl border border-neutral-200 bg-white p-5">
              <h3 className="text-base font-semibold text-neutral-950">
                {compareMockAiExplanationCopy.sections.summary}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {mockAiOutput.summary}
              </p>
            </article>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {renderMockAiList(
                compareMockAiExplanationCopy.sections.tradeoffs,
                mockAiOutput.tradeoffs,
              )}
              {renderMockAiList(
                compareMockAiExplanationCopy.sections.commuteNotes,
                mockAiOutput.commuteNotes,
              )}
              {renderMockAiList(
                compareMockAiExplanationCopy.sections.riskExplanations,
                mockAiOutput.riskExplanations,
              )}
              {renderMockAiList(
                compareMockAiExplanationCopy.sections.missingFieldNotes,
                mockAiOutput.missingFieldNotes,
              )}
              {renderMockAiList(
                compareMockAiExplanationCopy.sections.checklist,
                mockAiOutput.checklist,
              )}
            </div>

            <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-500">
              {mockAiOutput.disclaimer}
            </p>
          </div>
        ) : null}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {comparisonModels.map((model) => (
          <article
            key={model.listingId}
            className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-500">
                  {model.district} / {model.areaLabel ?? zhCN.common.pending}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
                  {model.title}
                </h3>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-500">
                {zhCN.common.listingStatus[model.status]}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.rent}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-950">
                  {zhCN.common.currencyCny}
                  {model.rentMonthly}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.commute}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-950">
                  {formatNumber(model.commuteMinutes, zhCN.common.minute)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {getCommuteSourceLabel(model.commuteSource)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.referenceScore}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-950">
                  {formatScore(model.referenceScore)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.area}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-800">
                  {formatNumber(model.areaSqm, zhCN.common.sqm)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.layout}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-800">
                  {model.layout}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-neutral-500">
                  {compareSelectedListingsCopy.fields.lifeCircle}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-800">
                  {formatScore(model.lifeCircleScore)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-xs text-neutral-500">
                {compareSelectedListingsCopy.fields.missingFields}
              </p>
              <div className="mt-2">
                {renderTagList(
                  model.missingFields.map((field) => missingFieldLabels[field]),
                  compareSelectedListingsCopy.empty.noMissingFields,
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-xs text-neutral-500">
                {compareSelectedListingsCopy.fields.riskFlags}
              </p>
              <div className="mt-2">
                {renderTagList(
                  model.riskFlags.map((flag) => riskFlagLabels[flag]),
                  compareSelectedListingsCopy.empty.noRiskFlags,
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-600">
        {compareSelectedListingsCopy.referenceNote}
      </p>
    </section>
  );
}
