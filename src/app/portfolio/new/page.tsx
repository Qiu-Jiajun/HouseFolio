import { AddListingForm } from "@/components/add-listing-form";

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <a href="/portfolio" className="text-sm text-slate-400 hover:text-white">
          ← 返回 Portfolio
        </a>

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-400">
            HouseFolio · 添加候选房源
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            新增一套候选房源
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            这是 HouseFolio 的基础输入层。用户主动添加候选房源后，后续才能进入 L1 通勤与生活圈分析、L2 评分排序、L3 AI 决策建议。
          </p>
        </div>

        <div className="mt-8">
          <AddListingForm />
        </div>
      </section>
    </main>
  );
}
