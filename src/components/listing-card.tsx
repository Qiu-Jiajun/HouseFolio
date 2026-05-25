import { ListingCardCoverPhoto } from "@/components/listing-card-cover-photo";
import {
  portfolioCompareSelectionCopy,
  zhCN,
} from "@/content/zh-cn";
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
  selectable?: boolean;
  selected?: boolean;
  selectionDisabled?: boolean;
  onToggleSelect?: (listingId: string) => void;
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

export function ListingCard({
  listing,
  selectable = false,
  selected = false,
  selectionDisabled = false,
  onToggleSelect,
}: ListingCardProps) {
  const commuteSourceText = getCommuteSourceText(listing.commuteSource);

  return (
    <article
      className={[
        "rounded-[1.5rem] border bg-[#fffdf8] p-5 shadow-[0_16px_45px_rgba(96,74,45,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(96,74,45,0.12)]",
        selected ? "border-[#737b3f] ring-2 ring-[#d8deb5]" : "border-[#e4dbcd]",
      ].join(" ")}
    >
      <ListingCardCoverPhoto listingId={listing.id} title={listing.title} />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-[#81786a]">
            {listing.district} / {listing.addressHint}
          </p>
          <h2 className="text-xl font-semibold leading-7 text-[#272318]">
            {listing.title}
          </h2>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full bg-[#f0eadf] px-3 py-1 text-xs text-[#6d6842]">
            {statusText[listing.status]}
          </span>

          {selectable ? (
            <button
              type="button"
              onClick={() => onToggleSelect?.(listing.id)}
              disabled={selectionDisabled}
              aria-pressed={selected}
              className={[
                "rounded-full border px-3 py-1 text-xs transition",
                selected
                  ? "border-[#727a3f] bg-[#727a3f] text-white"
                  : "border-[#d8cfbd] bg-white text-[#5f6240] hover:border-[#a7ab78]",
                selectionDisabled
                  ? "cursor-not-allowed opacity-40 hover:border-[#d8cfbd]"
                  : "",
              ].join(" ")}
            >
              {selected
                ? portfolioCompareSelectionCopy.cardSelected
                : portfolioCompareSelectionCopy.cardSelect}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-2xl bg-[#f4f0e7] p-4 text-[#272318]">
          <p className="text-xs font-medium text-[#82786a]">
            {zhCN.listingCard.fields.rent}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {zhCN.common.currencyCny}
            {listing.rent}
          </p>
          <p className="mt-1 text-xs text-[#82786a]">
            /{zhCN.common.month}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e4dbcd] bg-white p-4">
          <p className="text-xs text-[#82786a]">
            {zhCN.listingCard.fields.commute}
          </p>
          <p className="mt-2 text-xl font-semibold text-[#272318]">
            {typeof listing.commuteMinutes === "number"
              ? `${listing.commuteMinutes}${zhCN.common.minute}`
              : zhCN.common.pending}
          </p>
          {commuteSourceText ? (
            <p className="mt-1 text-xs text-[#82786a]">
              {commuteSourceText}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#e4dbcd] bg-white p-4">
          <p className="text-xs text-[#82786a]">
            {zhCN.listingCard.fields.referenceScore}
          </p>
          <p className="mt-2 text-xl font-semibold text-[#272318]">
            {formatOptionalNumber(listing.compositeScore)}
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-[#faf6ee] p-3">
          <p className="text-xs text-[#82786a]">
            {zhCN.listingCard.fields.area}
          </p>
          <p className="mt-1 font-medium text-[#343025]">
            {listing.area}
            {zhCN.common.sqm}
          </p>
        </div>

        <div className="rounded-2xl bg-[#faf6ee] p-3">
          <p className="text-xs text-[#82786a]">
            {zhCN.listingCard.fields.layout}
          </p>
          <p className="mt-1 font-medium text-[#343025]">{listing.layout}</p>
        </div>

        <div className="rounded-2xl bg-[#faf6ee] p-3">
          <p className="text-xs text-[#82786a]">
            {zhCN.listingCard.fields.lifeCircle}
          </p>
          <p className="mt-1 font-medium text-[#343025]">
            {formatOptionalNumber(listing.lifeCircleScore)}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[#e5dccd] bg-[#fff9ef] px-4 py-3">
        <p className="text-xs leading-5 text-[#7d7466]">
          {zhCN.listingCard.referenceScoreNote}
        </p>
      </div>

      <a
        href={`/portfolio/${listing.id}`}
        className="inline-flex rounded-full bg-[#727a3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#606936]"
      >
        {zhCN.listingCard.actions.viewDetails}
      </a>
    </article>
  );
}
