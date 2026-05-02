import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { SettingsLocalDataPanel } from "@/components/settings-local-data-panel";
import { WorkLocationSettingsPanel } from "@/components/work-location-settings-panel";
import { zhCN } from "@/content/zh-cn";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <AppNav />

        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-slate-400">
            {zhCN.settings.eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            {zhCN.settings.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
            {zhCN.settings.description}
          </p>
        </div>

        <div className="space-y-6">
          <WorkLocationSettingsPanel />
          <SettingsLocalDataPanel />
        </div>

        <ComplianceFooter />
      </div>
    </main>
  );
}