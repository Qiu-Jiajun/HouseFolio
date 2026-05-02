import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { zhCN } from "@/content/zh-cn";

const engines = zhCN.home.engines;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <AppNav />

        <p className="mb-4 text-sm font-medium text-slate-400">
          {zhCN.home.eyebrow}
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          {zhCN.home.titleLine1}
          <br />
          {zhCN.home.titleLine2}
        </h1>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-300">
          {zhCN.home.description}
        </p>

        <div className="mb-10 flex flex-wrap gap-3">
          <a
            href="/portfolio"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
          >
            {zhCN.home.actions.openPortfolio}
          </a>

          <a
            href="/portfolio/new"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            {zhCN.home.actions.addListing}
          </a>

          <a
            href="/settings"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            {zhCN.home.actions.settings}
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {engines.map((engine) => (
            <div
              key={engine.level}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {engine.level}
              </div>

              <h2 className="mb-3 text-xl font-semibold">{engine.title}</h2>

              <p className="text-sm leading-6 text-slate-400">
                {engine.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">
            {zhCN.home.currentPhase.title}
          </h2>
          <p className="text-sm leading-6 text-slate-400">
            {zhCN.home.currentPhase.body}
          </p>
        </div>

        <ComplianceFooter />
      </section>
    </main>
  );
}