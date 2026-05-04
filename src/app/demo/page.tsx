import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { demoModeData } from "@/lib/demo";

const demoStats = [
  {
    label: "虚构候选房源",
    value: demoModeData.listings.length,
  },
  {
    label: "虚构通勤锚点",
    value: demoModeData.workLocations.length,
  },
  {
    label: "预置通勤摘要",
    value: demoModeData.commuteSummaries.length,
  },
  {
    label: "预生成分析文本",
    value: demoModeData.aiSummaries.length,
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <AppNav />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="rounded-3xl border border-amber-300/40 bg-amber-300/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-amber-200">演示模式</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            用虚构数据快速理解 HouseFolio 的找房决策流程
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
            这是一个只读演示页。所有房源、通勤锚点、图片占位和分析文本均为虚构内容，
            不代表真实房源，不提供租赁建议，也不会读取或修改你的真实本机数据。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {demoStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L1 空间关系</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 会使用预置通勤摘要解释房源与工作/学习地点之间的关系，不实时调用地图服务。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L2 参考评分</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 会展示参考评分与维度拆解，但它只用于辅助比较，不代表系统推荐。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L3 解释预览</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 会展示预生成的分析文本，用来说明未来 AI 辅助解释的产品方向。
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold text-white">数据隔离说明</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-2">
            <p>本页面只读取项目内置的虚构静态数据。</p>
            <p>本页面不读取真实房源、真实笔记、真实照片或真实通勤结果。</p>
            <p>本页面不写入任何真实用户数据。</p>
            <p>本页面不调用高德、AI、云数据库或对象存储。</p>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">下一步</h2>
            <p className="mt-2 text-sm text-slate-300">
              后续阶段会在本页展示 3 套虚构房源、通勤锚点、参考评分和预生成分析文本。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10"
            >
              返回首页
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              进入真实 Portfolio
            </Link>
          </div>
        </section>
      </main>

      <ComplianceFooter />
    </div>
  );
}