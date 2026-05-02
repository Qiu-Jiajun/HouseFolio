import { zhCN } from "@/content/zh-cn";

export function ComplianceFooter() {
  return (
    <footer className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-medium text-slate-300">
        {zhCN.complianceFooter.title}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {zhCN.complianceFooter.body}
      </p>
    </footer>
  );
}