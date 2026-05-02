import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";

const engines = [
  {
    level: "L1",
    title: "LBS Layer",
    description:
      "Commute, life circle, and map context. Turn listing location into spatial decision data.",
  },
  {
    level: "L2",
    title: "Algorithm Layer",
    description:
      "Reference score, sorting, and comparison. Turn multiple listings into structured decision inputs.",
  },
  {
    level: "L3",
    title: "AI Layer",
    description:
      "Summaries, advice, and explanations. Turn structured data into human-readable decision support.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <AppNav />

        <p className="mb-4 text-sm font-medium text-slate-400">
          HouseFolio · Private rental decision workspace
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Use LBS, algorithms, and AI
          <br />
          to make rental decisions clearer.
        </h1>

        <p className="mb-8 max-w-3xl text-lg leading-8 text-slate-300">
          HouseFolio is not a listing platform or brokerage service. It helps
          users manage candidate listings they collected themselves, then uses
          a three-layer decision engine to support spatial analysis, structured
          comparison, and AI-assisted explanations.
        </p>

        <div className="mb-10 flex flex-wrap gap-3">
          <a
            href="/portfolio"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
          >
            Open Portfolio
          </a>

          <a
            href="/portfolio/new"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Add Listing
          </a>

          <a
            href="/settings"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Settings
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
          <h2 className="mb-3 text-xl font-semibold">Current Phase</h2>
          <p className="text-sm leading-6 text-slate-400">
            Phase 1L: global navigation and compliance footer. The demo still
            uses mock data and browser localStorage. Supabase, map APIs, and AI
            services are intentionally not connected yet.
          </p>
        </div>

        <ComplianceFooter />
      </section>
    </main>
  );
}