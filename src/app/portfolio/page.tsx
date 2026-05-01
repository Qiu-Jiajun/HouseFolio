import { PortfolioList } from "@/components/portfolio-list";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <a href="/" className="text-sm text-slate-400 hover:text-white">
            ← 返回首页
          </a>

          <p className="mt-6 text-sm font-medium text-slate-400">
            HouseFolio · Portfolio
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                我的候选房源
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                这里展示用户主动添加的候选房源。当前阶段使用 mock 数据 + 浏览器本地数据，
                暂不接入数据库、地图 API 或 AI 服务。
              </p>
            </div>

            <a
              href="/portfolio/new"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
            >
              添加房源
            </a>
          </div>
        </div>

        <PortfolioList />
      </section>
    </main>
  );
}
