import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { ContractReviewPanel } from "@/components/contract-review-panel";
import { contractReviewCopy } from "@/content/zh-cn";

export default function ContractReviewPage() {
  return (
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <AppNav />

        <div className="mb-8 rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(92,74,48,0.10)]">
          <p className="text-sm font-medium text-[#73744b]">
            {contractReviewCopy.badge}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-[#242114] sm:text-4xl">
              {contractReviewCopy.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#6f675c]">
              {contractReviewCopy.description}
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <p className="rounded-[1.5rem] border border-[#d9ddbd] bg-[#f1f4e4] px-5 py-4 text-sm leading-6 text-[#5b6435]">
              {contractReviewCopy.localSessionNote}
            </p>
            <p className="rounded-[1.5rem] border border-[#e3dacb] bg-white/72 px-5 py-4 text-sm leading-6 text-[#746c5f]">
              {contractReviewCopy.disclaimer}
            </p>
          </div>
        </div>

        <ContractReviewPanel />

        <ComplianceFooter />
      </section>
    </main>
  );
}
