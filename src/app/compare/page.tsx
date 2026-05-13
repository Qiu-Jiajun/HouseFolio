import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { compareRouteCopy } from "@/content/zh-cn";

type ComparePageSearchParams = {
  ids?: string | string[];
};

type ComparePageProps = {
  searchParams?: Promise<ComparePageSearchParams>;
};

function parseListingIds(rawIds: string | string[] | undefined): string[] {
  const joined = Array.isArray(rawIds) ? rawIds.join(",") : rawIds ?? "";

  return Array.from(
    new Set(
      joined
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function getCompareRouteState(ids: string[]) {
  if (ids.length === 0) {
    return {
      title: compareRouteCopy.noSelectionTitle,
      body: compareRouteCopy.noSelectionBody,
      tone: "muted",
    };
  }

  if (ids.length < 2) {
    return {
      title: compareRouteCopy.tooFewTitle,
      body: compareRouteCopy.tooFewBody,
      tone: "warning",
    };
  }

  if (ids.length > 4) {
    return {
      title: compareRouteCopy.tooManyTitle,
      body: compareRouteCopy.tooManyBody,
      tone: "warning",
    };
  }

  return {
    title: compareRouteCopy.readyTitle,
    body: compareRouteCopy.readyBody,
    tone: "ready",
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const selectedIds = parseListingIds(params?.ids);
  const state = getCompareRouteState(selectedIds);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <AppNav />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">
            {compareRouteCopy.badge}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              {compareRouteCopy.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-neutral-600">
              {compareRouteCopy.subtitle}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
          <div
            className={[
              "rounded-3xl border p-6",
              state.tone === "ready"
                ? "border-neutral-300 bg-neutral-50"
                : "border-dashed border-neutral-300 bg-white",
            ].join(" ")}
          >
            <p className="text-sm font-medium text-neutral-500">
              {compareRouteCopy.selectedCountPrefix}：{selectedIds.length}
              {compareRouteCopy.selectedCountSuffix}
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              {state.title}
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
              {state.body}
            </p>

            {selectedIds.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600"
                  >
                    {id}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="mt-6 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-600">
              {compareRouteCopy.routeOnlyNote}
            </p>

            <div className="mt-6">
              <Link
                href="/portfolio"
                className="inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                {compareRouteCopy.returnToPortfolio}
              </Link>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-neutral-500">
            {compareRouteCopy.referenceNote}
          </p>
        </div>
      </section>

      <ComplianceFooter />
    </main>
  );
}