import { ListingCard } from "@/components/listing-card";
import { mockListings } from "@/lib/db/mock-listings";

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

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            我的候选房源
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            这里展示用户主动添加的候选房源。当前阶段使用假数据验证页面结构，
            暂不接入数据库、地图 API 或 AI 服务。
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">候选房源</p>
            <p className="mt-2 text-3xl font-bold">{mockListings.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">平均租金</p>
            <p className="mt-2 text-3xl font-bold">
              ¥
              {Math.round(
                mockListings.reduce((sum, item) => sum + item.rent, 0) /
                  mockListings.length
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">当前阶段</p>
            <p className="mt-2 text-3xl font-bold">Phase 1C</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
