import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

const statusText: Record<Listing["status"], string> = {
  draft: "草稿",
  watching: "关注中",
  visited: "已看房",
  shortlisted: "候选",
  rejected: "已排除",
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-slate-500">
            {listing.district} · {listing.addressHint}
          </p>
          <h2 className="text-xl font-semibold text-white">{listing.title}</h2>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {statusText[listing.status]}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">租金</p>
          <p className="mt-1 font-medium text-white">¥{listing.rent}/月</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">面积</p>
          <p className="mt-1 font-medium text-white">{listing.area}㎡</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">户型</p>
          <p className="mt-1 font-medium text-white">{listing.layout}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-500">L1 通勤</p>
          <p className="mt-1 text-slate-200">
            {listing.commuteMinutes ? `${listing.commuteMinutes} 分钟` : "待计算"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">L1 生活圈</p>
          <p className="mt-1 text-slate-200">
            {listing.lifeCircleScore ? listing.lifeCircleScore.toFixed(1) : "待计算"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">L2 综合分</p>
          <p className="mt-1 text-slate-200">
            {listing.compositeScore ? listing.compositeScore.toFixed(1) : "待计算"}
          </p>
        </div>
      </div>
    </article>
  );
}
