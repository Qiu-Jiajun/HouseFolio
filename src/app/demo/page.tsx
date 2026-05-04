import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { demoModeData, type DemoListing } from "@/lib/demo";

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

const statusLabel: Record<DemoListing["status"], string> = {
  watching: "关注中",
  visited: "已看房",
  shortlisted: "候选中",
};

function formatRent(value: number) {
  return `${value.toLocaleString("zh-CN")} 元/月`;
}

function getListingCommutes(listingId: string) {
  return demoModeData.commuteSummaries.filter((item) => item.listingId === listingId);
}

function getListingScore(listingId: string) {
  return demoModeData.scoreBreakdowns.find((item) => item.listingId === listingId);
}

function getListingAiSummary(listingId: string) {
  return demoModeData.aiSummaries.find((item) => item.listingId === listingId);
}

export default function DemoPage() {
  const rankedListings = [...demoModeData.listings].sort(
    (a, b) => b.referenceScore - a.referenceScore,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <AppNav />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="rounded-3xl border border-amber-300/40 bg-amber-300/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-amber-200">演示模式</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            用虚构 Portfolio 快速理解 HouseFolio 的找房决策流程
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
            这是一个只读演示页。所有房源、通勤锚点、图片占位和分析文本均为虚构内容，
            不代表真实可租房源，不提供租赁建议，也不会读取或修改你的真实本机数据。
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

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-200">演示通勤锚点</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                用工作/学习地点解释空间折中
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              Demo 使用 2 个虚构通勤锚点，模拟应届毕业生或共同居住者需要在多个目的地之间做取舍的场景。
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {demoModeData.workLocations.map((anchor) => (
              <div
                key={anchor.id}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{anchor.name}</p>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                    {anchor.priorityLabel}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{anchor.addressHint}</p>
                <p className="mt-2 text-xs text-slate-500">
                  类型：{anchor.anchorType === "work" ? "工作地点" : "学习/共同居住锚点"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-200">Demo Portfolio</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                3 套虚构房源的辅助比较
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              当前按参考评分展示。参考评分只用于辅助比较和维度拆解，不代表最终决定。
            </p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {rankedListings.map((listing) => {
              const commutes = getListingCommutes(listing.id);
              const score = getListingScore(listing.id);
              const aiSummary = getListingAiSummary(listing.id);

              return (
                <article
                  key={listing.id}
                  className="flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl shadow-black/20"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-6 text-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-300">演示图片占位</p>
                      <p className="mt-2 text-sm text-slate-400">{listing.photoPlaceholderLabel}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold leading-7 text-white">
                          {listing.title}
                        </h3>
                        <span className="shrink-0 rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                          {statusLabel[listing.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {listing.city} · {listing.district} · {listing.areaLabel}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="text-xs text-slate-500">租金</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {formatRent(listing.rentMonthly)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="text-xs text-slate-500">面积</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {listing.areaSqm}㎡
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="text-xs text-slate-500">户型</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {listing.layout}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-slate-500">地址线索</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {listing.addressHint}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-emerald-100">
                          L1 通勤摘要
                        </p>
                        <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                          {listing.commuteSourceLabel}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        {commutes.map((commute) => (
                          <div key={`${commute.listingId}-${commute.anchorId}`}>
                            <p className="text-sm text-white">
                              {commute.anchorName}：约 {commute.durationMinutes} 分钟
                            </p>
                            <p className="mt-1 text-xs leading-5 text-emerald-100/80">
                              {commute.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-sky-100">
                            L2 参考评分
                          </p>
                          <p className="mt-1 text-xs text-sky-100/80">
                            {listing.referenceScoreNote}
                          </p>
                        </div>
                        <p className="text-4xl font-semibold text-white">
                          {listing.referenceScore}
                        </p>
                      </div>

                      {score ? (
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-200">
                          <p>租金：{score.rentContribution}</p>
                          <p>面积：{score.areaContribution}</p>
                          <p>通勤：{score.commuteContribution}</p>
                          <p>生活圈：{score.lifeCircleContribution}</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 text-sm leading-6 md:grid-cols-2">
                      <div className="rounded-2xl bg-white/[0.04] p-4">
                        <p className="text-xs font-semibold text-slate-400">主要优势</p>
                        <p className="mt-2 text-slate-200">{listing.primaryStrength}</p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-4">
                        <p className="text-xs font-semibold text-slate-400">主要短板</p>
                        <p className="mt-2 text-slate-200">{listing.primaryWeakness}</p>
                      </div>
                    </div>

                    {aiSummary ? (
                      <div className="mt-auto rounded-2xl border border-violet-300/20 bg-violet-300/[0.07] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-violet-100">
                            L3 解释预览
                          </p>
                          <span className="rounded-full bg-violet-300/10 px-3 py-1 text-xs text-violet-100">
                            预生成文本
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-violet-50/90">
                          {aiSummary.summary}
                        </p>

                        <div className="mt-4">
                          <p className="text-xs font-semibold text-violet-100/80">
                            看房 checklist
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-violet-50/80">
                            {aiSummary.checklist.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-violet-100/70">
                          {aiSummary.disclaimer}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-300/20 bg-violet-300/[0.06] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-200">L3 AI 解释层演示</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                把结构化结果翻译成人话建议
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-violet-50/80">
              本区域展示的是预生成演示文本，用于说明未来 AI 辅助解释的产品方向。当前页面不调用任何模型服务。
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {demoModeData.aiSummaries.map((item) => {
              const listing = demoModeData.listings.find(
                (demoListing) => demoListing.id === item.listingId,
              );

              return (
                <div
                  key={item.listingId}
                  className="rounded-2xl border border-violet-300/20 bg-slate-950/50 p-5"
                >
                  <p className="text-sm font-semibold text-white">
                    {listing?.title ?? "演示房源"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-violet-50/85">
                    {item.summary}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-violet-100/80">
                      Trade-off
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-violet-50/75">
                      {item.tradeoffs.map((tradeoff) => (
                        <li key={tradeoff}>{tradeoff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L1 空间关系</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 使用预置通勤摘要解释房源与工作/学习地点之间的关系，不实时调用地图服务。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L2 参考评分</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 展示参考评分与维度拆解，但它只用于辅助比较，不代表最终决定。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-slate-100">L3 人话解释</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Demo 展示预生成分析文本，用来说明 AI 如何把结构化结果转化为条件化建议。
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
            <h2 className="text-xl font-semibold text-white">进入真实模式</h2>
            <p className="mt-2 text-sm text-slate-300">
              真实模式下，你添加的房源、笔记、评分和通勤结果会保存在当前浏览器本机。
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