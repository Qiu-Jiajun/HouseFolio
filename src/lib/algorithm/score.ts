import type { Listing } from "@/types/listing";
import type { ListingSubjectiveRatings } from "@/types/listing-note";

type RatingMap = Record<string, ListingSubjectiveRatings | null>;

type ScoreRange = {
  min: number;
  max: number;
};

const SCORE_WEIGHTS = {
  rent: 0.25,
  area: 0.15,
  commute: 0.25,
  lifeCircle: 0.15,
  subjective: 0.2,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRange(values: number[]): ScoreRange | null {
  const validValues = values.filter((value) => Number.isFinite(value));

  if (validValues.length === 0) {
    return null;
  }

  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
  };
}

function normalizeHigherBetter(
  value: number | undefined,
  range: ScoreRange | null
) {
  if (value === undefined || !range) {
    return 0.5;
  }

  if (range.max === range.min) {
    return 0.5;
  }

  return clamp((value - range.min) / (range.max - range.min), 0, 1);
}

function normalizeLowerBetter(
  value: number | undefined,
  range: ScoreRange | null
) {
  if (value === undefined || !range) {
    return 0.5;
  }

  if (range.max === range.min) {
    return 0.5;
  }

  return clamp(1 - (value - range.min) / (range.max - range.min), 0, 1);
}

function normalizeLifeCircleScore(value: number | undefined) {
  if (value === undefined) {
    return 0.5;
  }

  return clamp(value / 10, 0, 1);
}

function normalizeSubjectiveRating(
  rating: ListingSubjectiveRatings | null | undefined
) {
  if (!rating) {
    return 0.5;
  }

  const average = (rating.light + rating.quiet + rating.decoration) / 3;

  return clamp((average - 1) / 4, 0, 1);
}

function toTenPointScale(value: number) {
  return Math.round(value * 100) / 10;
}

export function calculatePortfolioScores(
  listings: Listing[],
  ratingsByListingId: RatingMap = {}
): Listing[] {
  const rentRange = getRange(listings.map((listing) => listing.rent));
  const areaRange = getRange(listings.map((listing) => listing.area));
  const commuteRange = getRange(
    listings
      .map((listing) => listing.commuteMinutes)
      .filter((value): value is number => value !== undefined)
  );

  return listings.map((listing) => {
    const rentScore = normalizeLowerBetter(listing.rent, rentRange);
    const areaScore = normalizeHigherBetter(listing.area, areaRange);
    const commuteScore = normalizeLowerBetter(
      listing.commuteMinutes,
      commuteRange
    );
    const lifeCircleScore = normalizeLifeCircleScore(listing.lifeCircleScore);
    const subjectiveScore = normalizeSubjectiveRating(
      ratingsByListingId[listing.id]
    );

    const weightedScore =
      rentScore * SCORE_WEIGHTS.rent +
      areaScore * SCORE_WEIGHTS.area +
      commuteScore * SCORE_WEIGHTS.commute +
      lifeCircleScore * SCORE_WEIGHTS.lifeCircle +
      subjectiveScore * SCORE_WEIGHTS.subjective;

    return {
      ...listing,
      compositeScore: toTenPointScale(weightedScore),
    };
  });
}