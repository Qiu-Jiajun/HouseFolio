import Image from "next/image";
import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { PortfolioList } from "@/components/portfolio-list";
import { zhCN } from "@/content/zh-cn";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <AppNav />

        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] shadow-[0_24px_80px_rgba(92,74,48,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
              <p className="text-sm font-medium text-[#73744b]">
                {zhCN.portfolio.eyebrow}
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[#242114] sm:text-5xl">
                {zhCN.portfolio.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6f675c] sm:text-lg">
                {zhCN.portfolio.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {zhCN.portfolio.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#e3dacb] bg-white/70 px-4 py-2 text-sm text-[#696c45]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/portfolio/new"
                  className="rounded-full bg-[#727a3f] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#606936]"
                >
                  {zhCN.portfolio.actions.addListing}
                </a>

                <a
                  href="/compare"
                  className="rounded-full border border-[#d8cdbc] bg-white/80 px-5 py-3 text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c]"
                >
                  {zhCN.portfolio.actions.openCompare}
                </a>
              </div>
            </div>

            <div className="relative min-h-[30rem] border-t border-[#e6ddcf] bg-[#ebe1d2] lg:border-l lg:border-t-0">
              <div className="absolute inset-x-12 top-10 h-28 rounded-[2rem] border border-white/60 bg-[#f7efe4]/80" />
              <div className="absolute bottom-0 right-0 h-56 w-[82%] rounded-tl-[7rem] bg-[#fbf4ea]" />
              <div className="absolute right-12 top-14 h-32 w-20 rounded-t-full border border-[#ddd0bd] bg-[#f9f3e8]" />
              <div className="absolute left-6 right-6 top-6 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fff9ef] shadow-[0_18px_55px_rgba(117,92,58,0.16)] sm:left-10 sm:right-10 sm:top-8">
                <Image
                  src="/images/phase-8b/portfolio-hero-cat-nap.png"
                  alt="温馨客厅里的猫咪午睡插画"
                  width={840}
                  height={560}
                  priority
                  className="h-44 w-full object-cover sm:h-52 lg:h-56"
                />
              </div>
              <div className="absolute bottom-8 left-[12%] right-[10%] rounded-[1.75rem] border border-white/70 bg-white/72 p-5 shadow-[0_18px_55px_rgba(117,92,58,0.16)] backdrop-blur">
                <p className="text-sm font-medium text-[#73744b]">
                  {zhCN.portfolio.noteCard.kicker}
                </p>
                <p className="mt-3 text-xl font-semibold leading-8 text-[#2f2b1d]">
                  {zhCN.portfolio.noteCard.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#766e60]">
                  {zhCN.portfolio.noteCard.body}
                </p>
              </div>
            </div>
          </div>
        </div>

        <PortfolioList />

        <ComplianceFooter />
      </section>
    </main>
  );
}
