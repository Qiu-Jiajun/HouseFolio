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
    <svg key="train" viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path d="M7 4h10a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h3m2 0h3M8 21l2-3m6 0 2 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>,
    <svg key="note" viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path d="M6 5h10l2 2v12H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M14 5v4h4M9 15l5-5 2 2-5 5H9z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>,
    <svg key="shield" viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
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
            <span className="text-3xl leading-none" aria-hidden="true">⌄</span>
          </div>
        </header>

        <section className="relative min-h-[840px] bg-[#fbfaf6]">
          <div className="absolute inset-y-0 right-0 w-[48.5%] bg-[#e6d5c2]" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 w-[210px] bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/75 to-transparent" />
            <div className="absolute left-[70px] top-0 h-[590px] w-[170px] bg-[#f8f5ee] shadow-[inset_0_0_0_1px_rgba(204,198,188,0.8)]" />
            <div className="absolute left-[95px] top-0 h-[590px] w-[92px] bg-white/70" />
            <div className="absolute left-[188px] top-0 h-[590px] w-[14px] bg-[#ddd4c8]" />
            <div className="absolute left-[242px] top-0 h-[590px] w-[52px] bg-white/50" />
            <div className="absolute left-[118px] top-[180px] h-[165px] w-[115px] bg-[#d7e4ed]/45 blur-[1px]" />

            <div className="absolute right-[78px] top-[170px] h-[10px] w-[305px] rounded-full bg-[#c9a172]" />
            <div className="absolute right-[106px] top-[108px] h-[64px] w-[80px] rounded-b-[28px] rounded-t-[34px] bg-[#d6c2ad]" />
            <div className="absolute right-[120px] top-[82px] h-16 w-16 rounded-full border-l-[8px] border-[#6f7d45]" />
            <div className="absolute right-[160px] top-[72px] h-14 w-14 rounded-full border-r-[7px] border-[#6f7d45]" />
            <div className="absolute right-[240px] top-[130px] h-24 w-28 rounded-sm border-[12px] border-[#d0aa7e] bg-[#efe4d6]" />
            <div className="absolute right-[52px] top-[124px] h-28 w-28 rounded-t-xl bg-[#dfc39d]" />

            <div className="absolute right-[60px] top-[360px] h-[9px] w-[305px] rounded-full bg-[#c9a172]" />
            <div className="absolute right-[225px] top-[262px] h-24 w-24 rounded-t-[48px] border-t-[8px] border-[#6f7d45]" />
            <div className="absolute right-[72px] top-[405px] h-[230px] w-[118px] rounded-t-[44px] bg-[#e6cfac]" />
            <div className="absolute right-[108px] top-[314px] h-[82px] w-[82px] rounded-full bg-[#f8efe2]" />
            <div className="absolute right-[130px] top-[345px] h-[120px] w-[38px] bg-[#bd8153]" />
            <div className="absolute right-[200px] top-[435px] h-[115px] w-[82px] rounded-t-full bg-[#f7f0e7]" />

            <div className="absolute bottom-[170px] left-[82px] h-[178px] w-[545px] rounded-[54px] bg-[#ede1d0] shadow-[0_24px_45px_rgba(106,77,49,0.2)]" />
            <div className="absolute bottom-[184px] left-[116px] h-[108px] w-[160px] rounded-[32px] bg-[#f8f1e8]" />
            <div className="absolute bottom-[188px] left-[318px] h-[106px] w-[162px] rounded-[32px] bg-[#f8f1e8]" />
            <div className="absolute bottom-[294px] left-[330px] h-[76px] w-[112px] rounded-[20px] bg-[#72804f]" />
            <div className="absolute bottom-[284px] left-[215px] h-[88px] w-[100px] rounded-[22px] bg-[#fff8ed]" />
            <div className="absolute bottom-[92px] left-[282px] h-[126px] w-[252px] rounded-[50%] bg-[#c79761]" />
            <div className="absolute bottom-[154px] left-[375px] h-[14px] w-[126px] rounded-full bg-[#9a653c]" />
            <div className="absolute bottom-[70px] left-[398px] h-[92px] w-[14px] rotate-12 bg-[#9a653c]" />
            <div className="absolute bottom-[69px] left-[470px] h-[92px] w-[14px] -rotate-12 bg-[#9a653c]" />

            <div className="absolute bottom-[266px] left-[16px] h-[245px] w-[110px]">
              <div className="absolute bottom-0 left-12 h-[150px] w-4 rounded-full bg-[#8a9164]" />
              <div className="absolute left-0 top-14 h-16 w-20 rounded-[50%] border-l-[12px] border-[#8a9164]" />
              <div className="absolute left-16 top-0 h-16 w-20 rounded-[50%] border-r-[12px] border-[#8a9164]" />
              <div className="absolute left-20 top-[86px] h-14 w-16 rounded-[50%] border-r-[10px] border-[#8a9164]" />
            </div>
          </div>

          <div className="relative z-10 w-[55%] px-[146px] pt-[45px]">
            <p className="font-serif text-[94px] font-light italic leading-none tracking-wide text-[#9aa17a]">
              {copy.script}
            </p>
            <h1 className="mt-0 font-serif text-[74px] font-semibold leading-[1.22] tracking-tight text-[#242424]">
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
              <Link href="/portfolio" className="inline-flex h-[64px] items-center gap-4 rounded-[9px] border border-[#bdb7aa] bg-white/65 px-10 text-[20px] font-semibold text-[#2d2d2d] transition hover:bg-white">
                <span className="text-[#6f7848]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-8 w-8">
                    <path d="M5 18V8h4l3-3h7v13z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                    <path d="m10 14 2-2 2 2 3-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                {copy.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="absolute bottom-[150px] left-[145px] z-20 grid w-[980px] grid-cols-3 rounded-[14px] bg-white/88 px-7 py-7 shadow-[0_20px_50px_rgba(88,67,42,0.12)] backdrop-blur-sm">
            {copy.capabilities.map((item, index) => (
              <div key={item.title} className="flex items-center gap-8 px-0">
                <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-[#efeee5] text-[#7d8654]">
                  <CapabilityIcon index={index} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[22px] font-semibold text-[#242424]">{item.title}</strong>
                  <span className="mt-2 block text-[18px] text-[#555]">{item.description}</span>
                </span>
                {index < copy.capabilities.length - 1 ? (
                  <span className="ml-auto h-[75px] w-px bg-[#ddd8cf]" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="absolute bottom-[38px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-full px-8 py-4">
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#efeee5] text-[#7d8654]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-8 w-8">
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
