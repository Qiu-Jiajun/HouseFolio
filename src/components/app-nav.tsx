export function AppNav() {
  return (
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
      <a href="/" className="text-sm font-semibold tracking-tight text-white">
        HouseFolio
      </a>

      <div className="flex flex-wrap gap-2">
        <a
          href="/"
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Home
        </a>

        <a
          href="/portfolio"
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Portfolio
        </a>

        <a
          href="/portfolio/new"
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Add Listing
        </a>

        <a
          href="/settings"
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Settings
        </a>
      </div>
    </nav>
  );
}