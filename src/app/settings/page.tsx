import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { SettingsLocalDataPanel } from "@/components/settings-local-data-panel";
import { SettingsPhotoDataPanel } from "@/components/settings-photo-data-panel";
import { WorkLocationSettingsPanel } from "@/components/work-location-settings-panel";
import { zhCN } from "@/content/zh-cn";

export default function SettingsPage() {
  return (
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <AppNav />

        <div className="mb-8 rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(92,74,48,0.10)]">
          <p className="mb-3 text-sm font-medium text-[#73744b]">
            {zhCN.settings.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#242114]">
            {zhCN.settings.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6f675c]">
            {zhCN.settings.description}
          </p>
        </div>

        <div className="space-y-6">
          <WorkLocationSettingsPanel />
          <SettingsLocalDataPanel />
          <SettingsPhotoDataPanel />
        </div>

        <ComplianceFooter />
      </div>
    </main>
  );
}
