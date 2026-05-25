import { AddListingForm } from "@/components/add-listing-form";
import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { zhCN } from "@/content/zh-cn";

export default function NewListingPage() {
  return (
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <AppNav />

        <a href="/portfolio" className="text-sm text-[#6f675c] hover:text-[#282417]">
          ← {zhCN.addListingPage.actions.backToPortfolio}
        </a>

        <div className="mt-8 rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(92,74,48,0.10)]">
          <p className="text-sm font-medium text-[#73744b]">
            {zhCN.addListingPage.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#242114]">
            {zhCN.addListingPage.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6f675c]">
            {zhCN.addListingPage.description}
          </p>
        </div>

        <div className="mt-8">
          <AddListingForm />
        </div>

        <ComplianceFooter />
      </section>
    </main>
  );
}
