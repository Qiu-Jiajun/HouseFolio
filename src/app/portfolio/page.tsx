import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { PortfolioList } from "@/components/portfolio-list";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <AppNav />

        <div className="mb-8">
          <p className="text-sm font-medium text-slate-400">
            HouseFolio · Portfolio
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Candidate Listings
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                This page shows candidate listings added by the user or provided
                as mock data. Current Phase 1 data uses browser localStorage and
                mock listings only. Reference scores are auxiliary comparison
                signals, not final recommendations.
              </p>
            </div>

            <a
              href="/portfolio/new"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
            >
              Add Listing
            </a>
          </div>
        </div>

        <PortfolioList />

        <ComplianceFooter />
      </section>
    </main>
  );
}