"use client";

import { useEffect, useState } from "react";
import { ListingNotesPanel } from "@/components/listing-notes-panel";
import { findClientListingById } from "@/lib/local-store/listing-lookup";
import type { Listing } from "@/types/listing";

type ListingDetailViewProps = {
  listingId: string;
};

const statusText: Record<Listing["status"], string> = {
  draft: "草稿",
  watching: "关注中",
  visited: "已看房",
  shortlisted: "候选",
  rejected: "已排除",
};

export function ListingDetailView({ listingId }: ListingDetailViewProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const found = findClientListingById(listingId);
    setListing(found ?? null);
    setIsLoaded(true);
  }, [listingId]);

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        正在加载房源信息...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">未找到房源</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          该房源可能不存在，或本地浏览器数据已被清除。
        </p>
        <a
          href="/portfolio"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          返回 Portfolio
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                {listing.district} · {listing.addressHint}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {listing.title}
              </h1>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {statusText[listing.status]}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">月租金</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                ¥{listing.rent}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">面积</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {listing.area}㎡
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">户型</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {listing.layout}
              </p>
            </div>
          </div>

          {listing.sourceUrl ? (
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
            >
              查看原始链接
            </a>
          ) : null}
        </div>

        <ListingNotesPanel listingId={listing.id} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            L1 LBS 空间分析
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            后续这里会展示通勤时间、生活圈评分、地图位置和周边 POI 统计。
            当前阶段只展示占位结构。
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">通勤时间</p>
              <p className="mt-2 text-lg text-white">
                {listing.commuteMinutes
                  ? `${listing.commuteMinutes} 分钟`
                  : "待计算"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">生活圈评分</p>
              <p className="mt-2 text-lg text-white">
                {listing.lifeCircleScore
                  ? listing.lifeCircleScore.toFixed(1)
                  : "待计算"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-500">地图状态</p>
              <p className="mt-2 text-lg text-white">未接入</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">L2 算法评分</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            后续这里会展示综合评分、相对性价比、排序权重和异常标记。
            用户主观评分会成为 L2 权重计算的重要输入。
          </p>

          <div className="mt-5 rounded-xl bg-slate-950 p-4">
            <p className="text-sm text-slate-500">综合评分</p>
            <p className="mt-2 text-lg text-white">
              {listing.compositeScore
                ? listing.compositeScore.toFixed(1)
                : "待计算"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-white">
            L3 AI 决策建议
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            后续这里会在用户点击确认并完成脱敏后，结合基础信息、L1/L2 结果、
            用户笔记和主观评分生成看房 checklist、风险解释和决策建议。
          </p>

          <button
            disabled
            className="mt-5 rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-500"
          >
            AI 分析暂未接入
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">基础信息</h2>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">来源平台</dt>
              <dd className="mt-1 text-slate-200">{listing.sourcePlatform}</dd>
            </div>

            <div>
              <dt className="text-slate-500">添加日期</dt>
              <dd className="mt-1 text-slate-200">{listing.createdAt}</dd>
            </div>

            <div>
              <dt className="text-slate-500">数据状态</dt>
              <dd className="mt-1 text-slate-200">
                本地 / mock 数据，未上传云端
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">合规边界</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            当前仅展示用户主动添加或 mock 的房源信息。不抓取第三方页面，
            不公开展示房源库，不撮合交易，不认证房源真实性。
          </p>
        </div>
      </aside>
    </div>
  );
}