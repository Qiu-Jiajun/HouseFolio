import type { Listing } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";
import type { ScoreBreakdown, ScoreInput } from "@/lib/algorithm/score";
import {
  calculatePortfolioScores,
  getScoreByListingId,
} from "@/lib/algorithm/score";
import { mockListings } from "@/lib/db/mock-listings";
import { loadLocalListings } from "@/lib/local-store/listings";
import { loadListingRatings } from "@/lib/local-store/listing-notes";
import { applyListingStatusOverrides } from "@/lib/local-store/listing-status";

function getBaseClientListings(): Listing[] {
  return applyListingStatusOverrides([
    ...loadLocalListings(),
    ...mockListings,
  ]);
}

function getSubjectiveAverageScore(
  ratings: ListingSubjectiveRatings | null
): number | null {
  if (!ratings) {
    return null;
  }

  return (ratings.light + ratings.quiet + ratings.decoration) / 3;
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
  return attachReferenceScores(getBaseClientListings());
}

export function findClientListingById(id: string): Listing | undefined {
  return getAllClientListings().find((listing) => listing.id === id);
}

export function findClientListingScoreById(
  id: string
): ScoreBreakdown | undefined {
  const listings = getBaseClientListings();
  const scores = getPortfolioScoreBreakdowns(listings);

  return getScoreByListingId(scores, id);
}