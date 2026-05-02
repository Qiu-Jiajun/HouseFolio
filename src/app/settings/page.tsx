import { SettingsLocalDataPanel } from "@/components/settings-local-data-panel";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium text-slate-400">
              HouseFolio Phase 1K
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Settings and Local Data
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              Export or clear local HouseFolio data stored in this browser. This
              page is part of the privacy and data-rights foundation for the demo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Home
            </a>
            <a
              href="/portfolio"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
            >
              Portfolio
            </a>
          </div>
        </div>

        <SettingsLocalDataPanel />
      </div>
    </main>
  );
}