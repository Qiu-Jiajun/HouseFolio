import { AddListingForm } from "@/components/add-listing-form";
import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { zhCN } from "@/content/zh-cn";

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-4xl">
        <AppNav />

        <a href="/portfolio" className="text-sm text-slate-400 hover:text-white">
          ← {zhCN.addListingPage.actions.backToPortfolio}
        </a>

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-400">
            {zhCN.addListingPage.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {zhCN.addListingPage.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
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