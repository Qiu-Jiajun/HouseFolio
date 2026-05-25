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
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <AppNav />

        <div className="rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(92,74,48,0.10)]">
          <p className="text-sm font-medium text-[#73744b]">
            {compareRouteCopy.badge}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[#242114]">
              {compareRouteCopy.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#6f675c]">
              {compareRouteCopy.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CompareSelectedListingsPanel selectedIds={selectedIds} />
        </div>

        <ComplianceFooter />
      </section>
    </main>
  );
}
