import Link from "next/link";
import { zhCN } from "@/content/zh-cn";

const copy = zhCN.home.referenceHero;

const navItems = [
  { label: copy.navItems[0], href: "/portfolio", icon: "home" },
  { label: copy.navItems[1], href: "/portfolio", icon: "compare" },
  { label: copy.navItems[2], href: "/portfolio", icon: "note" },
  { label: copy.navItems[3], href: "/portfolio", icon: "shield" },
  { label: copy.navItems[4], href: "/settings", icon: "data" },
] as const;

function NavIcon({ type }: { type: (typeof navItems)[number]["icon"] }) {
  if (type === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M6.5 10.5V20h11v-9.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "compare") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M5 19V9m7 10V5m7 14v-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="M3 20h18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "note") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M6 4h9l3 3v13H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M14 4v4h4M9 15l5-5 2 2-5 5H9z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="m9 12 2 2 4-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

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
      <section className="mx-auto min-h-screen max-w-[1672px] overflow-hidden rounded-[22px] border border-[#d7d1c8] bg-[#fbfaf6] shadow-[0_26px_80px_rgba(73,57,36,0.14)]">
        <header className="flex h-[101px] items-center justify-between border-b border-[#ddd7ce] bg-white/95 px-[52px]">
          <Link href="/" className="flex items-center gap-3 text-[31px] font-semibold leading-none tracking-normal">
            <span className="relative h-10 w-10 text-[#8c956b]" aria-hidden="true">
              <svg viewBox="0 0 40 40" className="h-10 w-10">
                <path d="M7 19.5 20 8l13 11.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
                <path d="M12 18.5V34h16V18.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
              </svg>
            </span>
            {zhCN.nav.brand}
          </Link>

          <nav className="hidden items-center gap-[46px] text-[20px] font-semibold text-black xl:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 whitespace-nowrap hover:text-[#7d8654]">
                <NavIcon type={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-[18px]">
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
        </header>

        <section
          className="relative min-h-[840px] bg-[#fbfaf6] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/phase-8a/home-hero-living-room.png')",
          }}
        >
          <div className="relative z-10 w-[55%] px-[146px] pt-[145px]">
            <h1 className="font-serif text-[74px] font-bold leading-[1.22] tracking-tight text-[#242424]">
              {copy.titleLine1}
              <br />
              {copy.titleLine2}
            </h1>
            <p className="mt-6 w-[660px] max-w-full text-[23px] leading-[1.7] text-[#4c4c4c]">
              {copy.description}
            </p>
            <div className="mt-9 flex items-center gap-6">
              <Link href="/portfolio" className="inline-flex h-[64px] items-center gap-3 rounded-[9px] bg-[#7d8654] px-9 text-[20px] font-semibold text-white shadow-[0_14px_24px_rgba(91,98,58,0.2)] transition hover:bg-[#687044]">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[28px] font-light leading-none">+</span>
                {copy.primaryAction}
              </Link>
              <Link href="/demo" className="inline-flex h-[64px] items-center gap-4 rounded-[9px] border border-[#bdb7aa] bg-white/65 px-10 text-[20px] font-semibold text-[#2d2d2d] transition hover:bg-white">
                <span className="text-[#6f7848]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-7 w-7">
                    <path d="M5 18V8h4l3-3h7v13z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                    <path d="m10 14 2-2 2 2 3-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                {copy.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="absolute bottom-[150px] left-[145px] z-20 grid w-[920px] grid-cols-3 rounded-[14px] bg-white/88 px-6 py-5 shadow-[0_20px_50px_rgba(88,67,42,0.12)] backdrop-blur-sm">
            {copy.capabilities.map((item, index) => (
              <div
                key={item.title}
                className={[
                  "flex min-w-0 items-center gap-5 px-3",
                  index < copy.capabilities.length - 1
                    ? "border-r border-[#ddd8cf]"
                    : "",
                ].join(" ")}
              >
                <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-[#efeee5] text-[#7d8654]">
                  <CapabilityIcon index={index} />
                </span>
                <span className="min-w-0">
                  <strong className="block whitespace-nowrap text-[20px] font-semibold leading-tight text-[#242424]">{item.title}</strong>
                  <span className="mt-2 block whitespace-nowrap text-[16px] leading-tight text-[#555]">{item.description}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-[38px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-full px-8 py-4">
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#efeee5] text-[#7d8654]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-7 w-7">
                <path d="M7 10V8a5 5 0 0 1 10 0v2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                <path d="M6 10h12v10H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                <path d="M12 14v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </span>
            <span>
              <strong className="block text-[21px] font-semibold text-[#242424]">{copy.localFirstTitle}</strong>
              <span className="mt-2 block text-[17px] text-[#555]">{copy.localFirstBody}</span>
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}

