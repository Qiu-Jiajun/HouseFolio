import type { ContractReviewAiFindingInput } from "@/lib/contract/ai-safe-input";

export type ContractReviewFindingExplanation = {
  readonly riskId: ContractReviewAiFindingInput["riskId"];
  readonly riskLevel: ContractReviewAiFindingInput["riskLevel"];
  readonly titleZh: string;
  readonly explanationZh: string;
  readonly legalBasisNotesZh: readonly string[];
  readonly preSigningQuestionsZh: readonly string[];
  readonly suggestedClauseDirectionsZh: readonly string[];
  readonly negotiationScriptZh: string;
  readonly needsFurtherConfirmation: boolean;
};

export type ContractReviewExplanationOutput = {
  readonly summaryZh: string;
  readonly findingExplanations: readonly ContractReviewFindingExplanation[];
  readonly disclaimerZh: string;
};
