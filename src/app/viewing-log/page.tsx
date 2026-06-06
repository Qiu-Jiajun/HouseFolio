import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { ViewingLogWorkbench } from "@/components/viewing-log-workbench";

export default function ViewingLogPage() {
  return (
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <AppNav />
        <ViewingLogWorkbench />
        <ComplianceFooter />
      </section>
    </main>
  );
}
