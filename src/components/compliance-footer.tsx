export function ComplianceFooter() {
  return (
    <footer className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-300">
        HouseFolio Phase 1 Demo Boundary
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        HouseFolio is a private rental decision workspace. It does not crawl
        third-party listing pages, does not publish a public listing database,
        does not broker rental transactions, and does not certify listing
        authenticity. Current Phase 1 data uses mock data and browser
        localStorage only.
      </p>
    </footer>
  );
}