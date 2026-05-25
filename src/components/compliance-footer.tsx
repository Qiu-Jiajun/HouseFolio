import { zhCN } from "@/content/zh-cn";

export function ComplianceFooter() {
  return (
    <footer className="mt-12 rounded-[1.5rem] border border-[#e1d8c9] bg-[#fffaf2] p-6 shadow-sm">
      <p className="text-sm font-medium text-[#5f6240]">
        {zhCN.complianceFooter.title}
      </p>

      <p className="mt-3 text-sm leading-6 text-[#746c5f]">
        {zhCN.complianceFooter.body}
      </p>
    </footer>
  );
}
