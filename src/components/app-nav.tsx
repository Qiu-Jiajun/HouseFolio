import { zhCN } from "@/content/zh-cn";

const navItems = [
  {
    href: "/",
    label: zhCN.nav.home,
  },
  {
    href: "/portfolio",
    label: zhCN.nav.portfolio,
  },
  {
    href: "/portfolio/new",
    label: zhCN.nav.addListing,
  },
  {
    href: "/settings",
    label: zhCN.nav.settings,
  },
];

export function AppNav() {
  return (
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[#e1d8c9] bg-[#fffaf2]/90 px-5 py-4 shadow-[0_16px_45px_rgba(96,74,45,0.08)]">
      <a href="/" className="text-sm font-semibold tracking-tight text-[#282417]">
        {zhCN.nav.brand}
      </a>

      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-[#ddd2c0] bg-white/65 px-4 py-2 text-sm text-[#5f6240] transition hover:border-[#a7ab78] hover:bg-[#f4f0e7]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
