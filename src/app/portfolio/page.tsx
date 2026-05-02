import { PortfolioList } from "@/components/portfolio-list";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Home
            </a>

            <a
              href="/portfolio/new"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Add Listing
            </a>

            <a
              href="/settings"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Settings
            </a>
          </div>

          <p className="mt-8 text-sm font-medium text-slate-400">
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
      </section>
    </main>
  );
}