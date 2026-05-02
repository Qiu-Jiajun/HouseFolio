import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { PortfolioList } from "@/components/portfolio-list";
import { zhCN } from "@/content/zh-cn";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <AppNav />

        <div className="mb-8">
          <p className="text-sm font-medium text-slate-400">
            {zhCN.portfolio.eyebrow}
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {zhCN.portfolio.title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {zhCN.portfolio.description}
              </p>
            </div>

            <a
              href="/portfolio/new"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
            >
              {zhCN.portfolio.actions.addListing}
            </a>
          </div>
        </div>

        <PortfolioList />

        <ComplianceFooter />
      </section>
    </main>
  );
}