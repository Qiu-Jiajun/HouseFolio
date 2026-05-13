import Link from "next/link";
import type { ReactNode } from "react";

import type { ComparisonInput } from "@/lib/algorithm/comparison";
import { compareTableCopy, zhCN } from "@/content/zh-cn";

type CompareTableProps = {
  models: ComparisonInput[];
};

type CompareTableRow = {
  label: string;
  render: (model: ComparisonInput) => ReactNode;
};

type CompareTableGroup = {
  title: string;
  rows: CompareTableRow[];
};

const missingFieldLabels: Record<
  ComparisonInput["missingFields"][number],
  string
> = {
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

function formatNumber(value: number | undefined, suffix = "") {
  return typeof value === "number"
    ? `${value}${suffix}`
    : zhCN.common.pending;
}

function formatCurrency(value: number | undefined) {
  return typeof value === "number"
    ? `${zhCN.common.currencyCny}${value}`
    : zhCN.common.pending;
}

function formatScore(value: number | undefined) {
  return typeof value === "number"
    ? value.toFixed(1)
    : zhCN.common.pending;
}

function formatBoolean(value: boolean | undefined) {
  if (typeof value !== "boolean") {
    return zhCN.common.pending;
  }

  return value ? compareTableCopy.values.yes : compareTableCopy.values.no;
}

function formatCommuteSource(source: ComparisonInput["commuteSource"]) {
  if (source === "cachedTransit") {
    return zhCN.listingCard.commuteSource.cachedTransit;
  }

  if (source === "listing") {
    return zhCN.listingCard.commuteSource.listing;
  }

  return zhCN.common.pending;
}

function formatSubjectiveSummary(
  summary: ComparisonInput["subjectiveSummary"],
) {
  if (!summary) {
    return zhCN.common.pending;
  }

  return [
    `${compareTableCopy.subjective.light}: ${formatScore(summary.light)}`,
    `${compareTableCopy.subjective.quiet}: ${formatScore(summary.quiet)}`,
    `${compareTableCopy.subjective.decoration}: ${formatScore(
      summary.decoration,
    )}`,
  ].join(" / ");
}

function renderText(value: string | number | undefined) {
  if (value === undefined || value === "") {
    return <span className="text-neutral-400">{zhCN.common.pending}</span>;
  }

  return value;
}

function renderStringTags(items: string[], emptyText: string) {
  if (items.length === 0) {
    return <span className="text-neutral-400">{emptyText}</span>;
  }

  return (
    <div className="flex min-w-48 flex-wrap gap-2">
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

function renderSignalTags(
  signals: ComparisonInput["strengths"],
  emptyText: string,
) {
  return renderStringTags(
    signals.map((signal) => signal.label),
    emptyText,
  );
}

const tableGroups: CompareTableGroup[] = [
  {
    title: compareTableCopy.groups.basic,
    rows: [
      {
        label: compareTableCopy.fields.rent,
        render: (model) => formatCurrency(model.rentMonthly),
      },
      {
        label: compareTableCopy.fields.area,
        render: (model) => formatNumber(model.areaSqm, zhCN.common.sqm),
      },
      {
        label: compareTableCopy.fields.layout,
        render: (model) => renderText(model.layout),
      },
      {
        label: compareTableCopy.fields.district,
        render: (model) => renderText(model.district),
      },
      {
        label: compareTableCopy.fields.areaLabel,
        render: (model) => renderText(model.areaLabel),
      },
      {
        label: compareTableCopy.fields.sourcePlatform,
        render: (model) => renderText(model.sourcePlatform),
      },
    ],
  },
  {
    title: compareTableCopy.groups.spatial,
    rows: [
      {
        label: compareTableCopy.fields.commute,
        render: (model) => formatNumber(model.commuteMinutes, zhCN.common.minute),
      },
      {
        label: compareTableCopy.fields.commuteSource,
        render: (model) => formatCommuteSource(model.commuteSource),
      },
      {
        label: compareTableCopy.fields.lifeCircle,
        render: (model) => formatScore(model.lifeCircleScore),
      },
      {
        label: compareTableCopy.fields.commuteSummaryCount,
        render: (model) => `${model.commuteSummaries.length}`,
      },
    ],
  },
  {
    title: compareTableCopy.groups.algorithm,
    rows: [
      {
        label: compareTableCopy.fields.referenceScore,
        render: (model) => formatScore(model.referenceScore),
      },
      {
        label: compareTableCopy.fields.scoreBreakdown,
        render: (model) =>
          model.scoreBreakdown && Object.keys(model.scoreBreakdown).length > 0
            ? compareTableCopy.values.hasScoreBreakdown
            : compareTableCopy.values.noScoreBreakdown,
      },
      {
        label: compareTableCopy.fields.strengths,
        render: (model) =>
          renderSignalTags(model.strengths, compareTableCopy.values.noSignals),
      },
      {
        label: compareTableCopy.fields.weaknesses,
        render: (model) =>
          renderSignalTags(model.weaknesses, compareTableCopy.values.noSignals),
      },
      {
        label: compareTableCopy.fields.neutralFacts,
        render: (model) =>
          renderSignalTags(
            model.neutralFacts,
            compareTableCopy.values.noSignals,
          ),
      },
    ],
  },
  {
    title: compareTableCopy.groups.userData,
    rows: [
      {
        label: compareTableCopy.fields.subjectiveSummary,
        render: (model) => formatSubjectiveSummary(model.subjectiveSummary),
      },
      {
        label: compareTableCopy.fields.hasNotes,
        render: (model) => formatBoolean(model.hasNotes),
      },
      {
        label: compareTableCopy.fields.hasPhotos,
        render: (model) => formatBoolean(model.hasPhotos),
      },
      {
        label: compareTableCopy.fields.photoCount,
        render: (model) => formatNumber(model.photoCount),
      },
    ],
  },
  {
    title: compareTableCopy.groups.risk,
    rows: [
      {
        label: compareTableCopy.fields.missingFields,
        render: (model) =>
          renderStringTags(
            model.missingFields.map((field) => missingFieldLabels[field]),
            compareTableCopy.values.noMissingFields,
          ),
      },
      {
        label: compareTableCopy.fields.riskFlags,
        render: (model) =>
          renderStringTags(
            model.riskFlags.map((flag) => riskFlagLabels[flag]),
            compareTableCopy.values.noRiskFlags,
          ),
      },
    ],
  },
];

export function CompareTable({ models }: CompareTableProps) {
  return (
    <div className="mt-6">
      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-medium text-neutral-500">
          {compareTableCopy.badge}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          {compareTableCopy.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
          {compareTableCopy.description}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-100">
              <th className="sticky left-0 z-10 w-44 bg-neutral-100 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {compareTableCopy.dimensionColumn}
              </th>

              {models.map((model) => (
                <th
                  key={model.listingId}
                  className="min-w-56 px-4 py-4 text-left align-top"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-semibold leading-6 text-neutral-950">
                      {model.title}
                    </span>
                    <span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-500">
                      {zhCN.common.listingStatus[model.status]}
                    </span>
                    <Link
                      href={`/portfolio/${model.listingId}`}
                      className="text-xs font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-950"
                    >
                      {compareTableCopy.viewDetail}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableGroups.map((group) => (
              <>
                <tr key={group.title} className="border-b border-neutral-200">
                  <td
                    colSpan={models.length + 1}
                    className="bg-neutral-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {group.title}
                  </td>
                </tr>

                {group.rows.map((row) => (
                  <tr
                    key={`${group.title}-${row.label}`}
                    className="border-b border-neutral-200 last:border-b-0"
                  >
                    <th className="sticky left-0 z-10 bg-white px-4 py-4 text-left text-xs font-medium text-neutral-500">
                      {row.label}
                    </th>

                    {models.map((model) => (
                      <td
                        key={`${model.listingId}-${group.title}-${row.label}`}
                        className="px-4 py-4 align-top text-neutral-800"
                      >
                        {row.render(model)}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-600">
        {compareTableCopy.boundaryNote}
      </p>
    </div>
  );
}
