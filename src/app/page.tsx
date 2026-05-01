const engines = [
  {
    level: "L1",
    title: "LBS 智能层",
    description: "通勤、生活圈、地图，把房源位置转化为空间决策数据。",
  },
  {
    level: "L2",
    title: "算法评分层",
    description: "评分、排序、对比，把多套房源组织成可量化的决策结构。",
  },
  {
    level: "L3",
    title: "AI 决策层",
    description: "总结、建议、解释，把结构化数据转化为人能理解的决策建议。",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-medium text-slate-400">
          HouseFolio · 私人找房决策管理工具
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          用 LBS、算法和 AI，
          <br />
          辅助租客做出更清晰的找房决策。
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-slate-300">
          HouseFolio 不是房源平台，也不是中介服务。它帮助用户管理自己主动收集的候选房源，
          并通过三层决策引擎完成通勤分析、评分对比和 AI 决策建议。
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {engines.map((engine) => (
            <div
              key={engine.level}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {engine.level}
              </div>

              <h2 className="mb-3 text-xl font-semibold">{engine.title}</h2>

              <p className="text-sm leading-6 text-slate-400">
                {engine.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">当前开发阶段</h2>
          <p className="text-sm leading-6 text-slate-400">
            Phase 1A：Next.js 项目骨架初始化。当前目标是先跑通页面和工程结构，
            暂不接入数据库、地图 API 或 AI 服务。
          </p>
        </div>
      </section>
    </main>
  );
}
