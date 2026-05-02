import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { SettingsLocalDataPanel } from "@/components/settings-local-data-panel";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <AppNav />

        <div className="mb-8">
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

        <SettingsLocalDataPanel />

        <ComplianceFooter />
      </div>
    </main>
  );
}