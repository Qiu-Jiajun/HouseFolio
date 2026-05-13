import { AppNav } from "@/components/app-nav";
import { CompareSelectedListingsPanel } from "@/components/compare-selected-listings-panel";
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

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const selectedIds = parseListingIds(params?.ids);

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

        <CompareSelectedListingsPanel selectedIds={selectedIds} />
      </section>

      <ComplianceFooter />
    </main>
  );
}
