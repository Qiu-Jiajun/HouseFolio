import Image from "next/image";
import Link from "next/link";
import {
  HomeMobileNav,
  NavIcon,
  type HomeNavIconType,
} from "@/components/home-mobile-nav";
import { zhCN } from "@/content/zh-cn";

const copy = zhCN.home.referenceHero;

const navItems = [
  { label: copy.navItems[0], href: "/portfolio", icon: "home" },
  { label: copy.navItems[1], href: "/compare", icon: "compare" },
  { label: copy.navItems[2], href: "/viewing-log", icon: "note" },
  { label: copy.navItems[3], href: "/contract-review", icon: "shield" },
  { label: copy.navItems[4], href: "/settings", icon: "settings" },
] as const;

const typedNavItems: readonly {
  label: string;
  href: string;
  icon: HomeNavIconType;
}[] = navItems;

function CapabilityIcon({ index }: { index: number }) {
  const icons = [
    <svg key="train" viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <path d="M7 4h10a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h3m2 0h3M8 21l2-3m6 0 2 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>,
    <svg key="note" viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <path d="M6 5h10l2 2v12H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M14 5v4h4M9 15l5-5 2 2-5 5H9z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>,
    <svg key="shield" viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="m9 12 2 2 4-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>,
  ];

  return icons[index];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f1e7] text-[#242424]">
      <section className="mx-auto min-h-screen max-w-[1672px] overflow-hidden border border-[#d7d1c8] bg-[#fbfaf6] shadow-[0_26px_80px_rgba(73,57,36,0.14)] sm:rounded-[22px]">
        <header className="flex h-[80px] items-center justify-between border-b border-[#ddd7ce] bg-white/95 px-4 sm:px-6 lg:h-[101px] lg:px-[52px]">
          <Link href="/" aria-label="HouseFolio 首页" className="flex h-[48px] min-w-0 items-center gap-2 sm:h-[56px] sm:gap-2.5 lg:h-[64px]">
            <Image
              src="/images/phase-8a/housefolio-logo-icon-large.png"
              alt=""
              width={64}
              height={58}
              sizes="64px"
              quality={85}
              loading="eager"
              className="h-[48px] w-auto shrink-0 object-contain sm:h-[56px] lg:h-[64px]"
            />
            <span
              className="whitespace-nowrap text-[20px] leading-none text-black min-[360px]:text-[23px] sm:text-[27px] lg:text-[32px]"
              style={{
                fontFamily:
                  '"Segoe Script", "Brush Script MT", "Snell Roundhand", "Apple Chancery", Georgia, serif',
              }}
            >
              HouseFolio
            </span>
          </Link>

          <nav className="hidden items-center gap-[46px] text-[20px] font-semibold text-black xl:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 whitespace-nowrap hover:text-[#7d8654]">
                <NavIcon type={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-[18px] sm:flex">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#e0dbd3] bg-white text-[#7d8654]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-7 w-7">
                <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="grid h-[52px] w-[52px] place-items-center overflow-hidden rounded-full bg-[#e7dfca]" aria-hidden="true">
              <span className="relative mt-1 h-11 w-9 rounded-t-full bg-[#c58f67]">
                <span className="absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f6d3b7]" />
                <span className="absolute bottom-0 left-1/2 h-4 w-7 -translate-x-1/2 rounded-t-full bg-[#72804f]" />
              </span>
            </span>
            <span className="text-3xl leading-none" aria-hidden="true">v</span>
          </div>

          <HomeMobileNav
            items={typedNavItems}
            menuLabel={copy.mobileNavMenuLabel}
            openLabel={copy.mobileNavOpenLabel}
            closeLabel={copy.mobileNavCloseLabel}
          />
        </header>

        <section className="relative flex min-h-[calc(100vh-80px)] flex-col bg-[#fbfaf6] pb-8 lg:min-h-[calc(100vh-101px)]">
          <Image
            src="/images/phase-8a/home-hero-living-room.png"
            alt=""
            fill
            preload
            sizes="(max-width: 1672px) 100vw, 1672px"
            quality={75}
            className="object-cover object-center"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full px-6 pt-12 sm:px-10 sm:pt-16 lg:w-[58%] lg:px-16 lg:pt-[clamp(64px,15vh,163px)] xl:px-[146px]">
            <h1 className="whitespace-nowrap font-serif text-[clamp(2rem,10vw,3.5rem)] font-black leading-[1.12] tracking-tight text-[#242424] lg:text-[clamp(42px,calc(5vw-9.6px),74px)] lg:leading-[1.1] xl:w-[590px] xl:text-[74px]">
              {copy.titleLine1}
              <br />
              {copy.titleLine2}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.7] text-[#4c4c4c] sm:text-[19px] lg:mt-7 lg:w-[780px] lg:max-w-full lg:text-[21px] lg:leading-[1.65]">
              {copy.descriptionLead}
              <span className="lg:whitespace-nowrap">{copy.descriptionRisk}</span>
            </p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-9 lg:gap-6">
              <Link href="/portfolio/new" className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[9px] bg-[#7d8654] px-5 text-[17px] font-semibold text-white shadow-[0_14px_24px_rgba(91,98,58,0.2)] transition hover:bg-[#687044] sm:px-6 lg:h-[64px] lg:px-9 lg:text-[20px]">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[28px] font-light leading-none">+</span>
                {copy.primaryAction}
              </Link>
              <Link href="/portfolio" className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[9px] border border-[#d2ccc0] bg-white/70 px-5 text-[17px] font-semibold text-[#2d2d2d] transition hover:bg-white sm:px-6 lg:h-[64px] lg:gap-4 lg:px-10 lg:text-[20px]">
                <span className="text-[#8b9469]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-7 w-7">
                    <path d="M5 18V8h4l3-3h7v13z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                    <path d="m10 14 2-2 2 2 3-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                {copy.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="relative z-20 mx-6 mt-10 grid gap-2 rounded-[14px] bg-white/88 px-4 py-4 shadow-[0_18px_44px_rgba(88,67,42,0.11)] backdrop-blur-sm sm:mx-10 sm:grid-cols-3 sm:gap-0 lg:mx-16 lg:mt-auto lg:max-w-[870px] lg:px-5 xl:mx-[146px]">
            {copy.capabilities.map((item, index) => (
              <div
                key={item.title}
                className={[
                  "flex min-w-0 items-center gap-3 px-1 py-2 sm:gap-4 sm:px-3 sm:py-0",
                  index < copy.capabilities.length - 1
                    ? "sm:border-r sm:border-[#e4dfd6]"
                    : "",
                ].join(" ")}
              >
                <span className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-[#efeee5] text-[#7d8654]">
                  <CapabilityIcon index={index} />
                </span>
                <span className="min-w-0">
                  <strong className="block whitespace-nowrap text-[19px] font-semibold leading-tight text-[#242424]">{item.title}</strong>
                  <span className="mt-1.5 block whitespace-nowrap text-[15px] leading-tight text-[#555]">{item.description}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="relative z-20 mx-6 mt-5 flex items-center gap-4 rounded-2xl px-1 py-4 sm:mx-10 lg:mx-auto lg:mt-8 lg:w-fit lg:gap-5 lg:rounded-full lg:px-8">
            <span className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[#efeee5] text-[#7d8654]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-7 w-7">
                <path d="M7 10V8a5 5 0 0 1 10 0v2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                <path d="M6 10h12v10H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                <path d="M12 14v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </span>
            <span>
              <strong className="block text-[17px] font-semibold text-[#242424] sm:text-[19px] lg:text-[21px]">{copy.localFirstTitle}</strong>
              <span className="mt-1.5 block text-[14px] leading-6 text-[#555] sm:text-[15px] lg:mt-2 lg:text-[17px]">{copy.localFirstBody}</span>
            </span>
          </div>

          <div className="relative z-20 mx-6 mt-6 pb-4 text-center text-xs text-[#8a8173] lg:mx-auto lg:mt-8 lg:pb-0">
            <a
              href={zhCN.complianceFooter.icpUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 transition hover:text-[#5f6240]"
            >
              {zhCN.complianceFooter.icpText}
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}

