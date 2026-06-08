import type { Listing } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";
import type { ScoreBreakdown, ScoreInput } from "@/lib/algorithm/score";
import {
  calculatePortfolioScores,
  getScoreByListingId,
} from "@/lib/algorithm/score";
import { loadLocalListings } from "@/lib/local-store/listings";
import { loadListingRatings } from "@/lib/local-store/listing-notes";
import { applyListingStatusOverrides } from "@/lib/local-store/listing-status";
import { getCommuteResultsForListing } from "@/lib/local-store/commute-results";

function getBaseClientListings(): Listing[] {
  return applyListingStatusOverrides(loadLocalListings());
}

function getSubjectiveAverageScore(
  ratings: ListingSubjectiveRatings | null
): number | null {
  if (!ratings) {
    return null;
  }

  return (ratings.light + ratings.quiet + ratings.decoration) / 3;
}

function getCachedTransitCommuteMinutes(listingId: string): number | null {
  const transitResults = getCommuteResultsForListing(listingId).filter(
    (result) =>
      result.mode === "transit" &&
      typeof result.durationMinutes === "number" &&
      !Number.isNaN(result.durationMinutes)
  );

  if (transitResults.length === 0) {
    return null;
  }

  const shortestTransitMinutes = Math.min(
    ...transitResults.map((result) => result.durationMinutes)
  );

  return Math.round(shortestTransitMinutes);
}

function attachCachedTransitCommuteMinutes(listings: Listing[]): Listing[] {
  return listings.map((listing) => {
    const cachedTransitCommuteMinutes = getCachedTransitCommuteMinutes(
      listing.id
    );

    if (cachedTransitCommuteMinutes === null) {
      return {
        ...listing,
        commuteSource:
          typeof listing.commuteMinutes === "number" ? "listing" : undefined,
      };
    }

    return {
      ...listing,
      commuteMinutes: cachedTransitCommuteMinutes,
      commuteSource: "cachedTransit",
    };
  });
}

function getClientListingsForScoring(): Listing[] {
  return attachCachedTransitCommuteMinutes(getBaseClientListings());
}

function toScoreInput(listing: Listing): ScoreInput {
  const ratings = loadListingRatings(listing.id);

  return {
    id: listing.id,
    rent: listing.rent,
    area: listing.area,
    commuteMinutes: listing.commuteMinutes ?? null,
    lifeCircleScore: listing.lifeCircleScore ?? null,
    subjectiveAverageScore: getSubjectiveAverageScore(ratings),
  };
}

function getPortfolioScoreBreakdowns(listings: Listing[]): ScoreBreakdown[] {
  const scoreInputs = listings.map(toScoreInput);
  return calculatePortfolioScores(scoreInputs);
}

function attachReferenceScores(listings: Listing[]): Listing[] {
  const scores = getPortfolioScoreBreakdowns(listings);

  return listings.map((listing) => {
    const score = getScoreByListingId(scores, listing.id);

    return {
      ...listing,
      compositeScore: score?.totalScore ?? listing.compositeScore,
    };
  });
}

export function getAllClientListings(): Listing[] {
  return attachReferenceScores(getClientListingsForScoring());
}

export function findClientListingById(id: string): Listing | undefined {
  return getAllClientListings().find((listing) => listing.id === id);
}

export function findClientListingScoreById(
  id: string
): ScoreBreakdown | undefined {
  const listings = getClientListingsForScoring();
  const scores = getPortfolioScoreBreakdowns(listings);

  return getScoreByListingId(scores, id);
}
