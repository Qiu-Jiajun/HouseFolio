export type ScoreInput = {
  id: string
  rent?: number | null
  area?: number | null
  commuteMinutes?: number | null
  lifeCircleScore?: number | null
  subjectiveAverageScore?: number | null
}

export type ScoreBreakdown = {
  listingId: string
  totalScore: number
  rentScore: number
  areaScore: number
  commuteScore: number
  lifeCircleScore: number
  subjectiveScore: number
  explanation: string
}

export type ScoreWeights = {
  rent: number
  area: number
  commute: number
  lifeCircle: number
  subjective: number
}

/**
 * HouseFolio Phase 1I: L2 reference scoring algorithm.
 *
 * Product boundary:
 * - This is a reference score, not a final recommendation.
 * - Different users may care about different dimensions.
 * - Some users may have veto conditions, so a high score does not mean "best choice".
 * - Later versions should support custom weights and veto rules.
 *
 * Architecture boundary:
 * - This belongs to L2 algorithm layer.
 * - It does not call LLM.
 * - It does not call database.
 * - It does not call map API.
 * - It does not judge whether a listing is real.
 */
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  rent: 0.25,
  area: 0.2,
  commute: 0.25,
  lifeCircle: 0.15,
  subjective: 0.15,
}

function safeNumber(value: number | null | undefined): number | null {
  if (typeof value !== "number") {
    return null
  }

  if (Number.isNaN(value)) {
    return null
  }

  return value
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(10, value))
}

function normalizeHigherIsBetter(
  value: number | null,
  min: number,
  max: number
): number {
  if (value === null) {
    return 5
  }

  if (max === min) {
    return 7
  }

  return clampScore(((value - min) / (max - min)) * 10)
}

function normalizeLowerIsBetter(
  value: number | null,
  min: number,
  max: number
): number {
  if (value === null) {
    return 5
  }

  if (max === min) {
    return 7
  }

  return clampScore(((max - value) / (max - min)) * 10)
}

function getMinMax(values: Array<number | null>): { min: number; max: number } {
  const validValues = values.filter(
    (value): value is number => typeof value === "number" && !Number.isNaN(value)
  )

  if (validValues.length === 0) {
    return { min: 0, max: 0 }
  }

  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
  }
}

function normalizeSubjectiveScore(value: number | null): number {
  if (value === null) {
    return 5
  }

  return clampScore((value / 5) * 10)
}

function buildExplanation(score: ScoreBreakdown): string {
  const dimensions: Array<{ label: string; value: number }> = [
    { label: "rent", value: score.rentScore },
    { label: "area", value: score.areaScore },
    { label: "commute", value: score.commuteScore },
    { label: "life circle", value: score.lifeCircleScore },
    { label: "subjective experience", value: score.subjectiveScore },
  ].sort((a, b) => b.value - a.value)

  const best = dimensions[0]
  const weakest = dimensions[dimensions.length - 1]

  return `Reference score ${score.totalScore.toFixed(
    1
  )}. Relative strength: ${best.label}. Relative weakness: ${weakest.label}. This score is only for auxiliary sorting, not a final recommendation.`
}

export function calculatePortfolioScores(
  listings: ScoreInput[],
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): ScoreBreakdown[] {
  const rentRange = getMinMax(listings.map((listing) => safeNumber(listing.rent)))
  const areaRange = getMinMax(listings.map((listing) => safeNumber(listing.area)))
  const commuteRange = getMinMax(
    listings.map((listing) => safeNumber(listing.commuteMinutes))
  )
  const lifeCircleRange = getMinMax(
    listings.map((listing) => safeNumber(listing.lifeCircleScore))
  )

  return listings.map((listing) => {
    const rentScore = normalizeLowerIsBetter(
      safeNumber(listing.rent),
      rentRange.min,
      rentRange.max
    )

    const areaScore = normalizeHigherIsBetter(
      safeNumber(listing.area),
      areaRange.min,
      areaRange.max
    )

    const commuteScore = normalizeLowerIsBetter(
      safeNumber(listing.commuteMinutes),
      commuteRange.min,
      commuteRange.max
    )

    const normalizedLifeCircleScore = normalizeHigherIsBetter(
      safeNumber(listing.lifeCircleScore),
      lifeCircleRange.min,
      lifeCircleRange.max
    )

    const subjectiveScore = normalizeSubjectiveScore(
      safeNumber(listing.subjectiveAverageScore)
    )

    const totalScore =
      rentScore * weights.rent +
      areaScore * weights.area +
      commuteScore * weights.commute +
      normalizedLifeCircleScore * weights.lifeCircle +
      subjectiveScore * weights.subjective

    const breakdown: ScoreBreakdown = {
      listingId: listing.id,
      totalScore: Number(totalScore.toFixed(1)),
      rentScore: Number(rentScore.toFixed(1)),
      areaScore: Number(areaScore.toFixed(1)),
      commuteScore: Number(commuteScore.toFixed(1)),
      lifeCircleScore: Number(normalizedLifeCircleScore.toFixed(1)),
      subjectiveScore: Number(subjectiveScore.toFixed(1)),
      explanation: "",
    }

    return {
      ...breakdown,
      explanation: buildExplanation(breakdown),
    }
  })
}

export function getScoreByListingId(
  scores: ScoreBreakdown[],
  listingId: string
): ScoreBreakdown | undefined {
  return scores.find((score) => score.listingId === listingId)
}