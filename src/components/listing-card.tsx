import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

const statusText: Record<Listing["status"], string> = {
  draft: "Draft",
  watching: "Watching",
  visited: "Visited",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

function formatOptionalNumber(value: number | undefined, suffix = "") {
  return typeof value === "number" ? `${value.toFixed(1)}${suffix}` : "Pending";
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-slate-500">
            {listing.district} / {listing.addressHint}
          </p>
          <h2 className="text-xl font-semibold text-white">{listing.title}</h2>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {statusText[listing.status]}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">Rent</p>
          <p className="mt-1 font-medium text-white">CNY {listing.rent}/mo</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">Area</p>
          <p className="mt-1 font-medium text-white">{listing.area} sqm</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-slate-500">Layout</p>
          <p className="mt-1 font-medium text-white">{listing.layout}</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-500">L1 Commute</p>
          <p className="mt-1 text-slate-200">
            {typeof listing.commuteMinutes === "number"
              ? `${listing.commuteMinutes} min`
              : "Pending"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">L1 Life Circle</p>
          <p className="mt-1 text-slate-200">
            {formatOptionalNumber(listing.lifeCircleScore)}
          </p>
        </div>

        <div>
          <p className="text-slate-500">L2 Reference Score</p>
          <p className="mt-1 text-slate-200">
            {formatOptionalNumber(listing.compositeScore)}
          </p>
        </div>
      </div>

      <p className="mb-5 text-xs leading-5 text-slate-500">
        Reference score is only for auxiliary comparison. It is not a final recommendation.
      </p>

      <a
        href={`/portfolio/${listing.id}`}
        className="inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
      >
        View details
      </a>
    </article>
  );
}