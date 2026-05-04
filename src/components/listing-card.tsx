import { ListingCardCoverPhoto } from "@/components/listing-card-cover-photo";
import { zhCN } from "@/content/zh-cn";
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

const statusText = zhCN.common.listingStatus;

function formatOptionalNumber(value: number | undefined, suffix = "") {
  return typeof value === "number"
    ? `${value.toFixed(1)}${suffix}`
    : zhCN.common.pending;
}

function getCommuteSourceText(source: Listing["commuteSource"]): string | null {
  if (source === "cachedTransit") {
    return zhCN.listingCard.commuteSource.cachedTransit;
  }

  if (source === "listing") {
    return zhCN.listingCard.commuteSource.listing;
  }

  return null;
}

export function ListingCard({ listing }: ListingCardProps) {
  const commuteSourceText = getCommuteSourceText(listing.commuteSource);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-colors hover:border-slate-700">
      <ListingCardCoverPhoto listingId={listing.id} title={listing.title} />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-slate-500">
            {listing.district} / {listing.addressHint}
          </p>
          <h2 className="text-xl font-semibold leading-7 text-white">
            {listing.title}
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {statusText[listing.status]}
        </span>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-xl bg-white p-4 text-slate-950">
          <p className="text-xs font-medium text-slate-500">
            {zhCN.listingCard.fields.rent}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {zhCN.common.currencyCny}
            {listing.rent}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            /{zhCN.common.month}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            {zhCN.listingCard.fields.commute}
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {typeof listing.commuteMinutes === "number"
              ? `${listing.commuteMinutes}${zhCN.common.minute}`
              : zhCN.common.pending}
          </p>
          {commuteSourceText ? (
            <p className="mt-1 text-xs text-slate-500">
              {commuteSourceText}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            {zhCN.listingCard.fields.referenceScore}
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatOptionalNumber(listing.compositeScore)}
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-xs text-slate-500">
            {zhCN.listingCard.fields.area}
          </p>
          <p className="mt-1 font-medium text-slate-200">
            {listing.area}
            {zhCN.common.sqm}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-xs text-slate-500">
            {zhCN.listingCard.fields.layout}
          </p>
          <p className="mt-1 font-medium text-slate-200">{listing.layout}</p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-xs text-slate-500">
            {zhCN.listingCard.fields.lifeCircle}
          </p>
          <p className="mt-1 font-medium text-slate-200">
            {formatOptionalNumber(listing.lifeCircleScore)}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
        <p className="text-xs leading-5 text-slate-500">
          {zhCN.listingCard.referenceScoreNote}
        </p>
      </div>

      <a
        href={`/portfolio/${listing.id}`}
        className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
      >
        {zhCN.listingCard.actions.viewDetails}
      </a>
    </article>
  );
}