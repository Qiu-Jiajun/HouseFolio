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
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
      <a href="/" className="text-sm font-semibold tracking-tight text-white">
        {zhCN.nav.brand}
      </a>

      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}