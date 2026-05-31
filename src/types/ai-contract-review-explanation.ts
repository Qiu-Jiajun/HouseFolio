import type {
  ContractReviewAiFindingInput,
  ContractReviewFullRedactedAiRuleSignalInput,
} from "@/lib/contract/ai-safe-input";

export const CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION =
  "contract-review-full-redacted-explanation-v2" as const;

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

export type ContractReviewRuleSignalExplanation = {
  readonly riskId: ContractReviewFullRedactedAiRuleSignalInput["riskId"];
  readonly clauseId: string;
  readonly riskLevel: ContractReviewFullRedactedAiRuleSignalInput["riskLevel"];
  readonly titleZh: string;
  readonly explanationZh: string;
  readonly legalBasisNotesZh: readonly string[];
  readonly preSigningQuestionsZh: readonly string[];
  readonly suggestedClauseDirectionsZh: readonly string[];
  readonly negotiationScriptZh: string;
  readonly needsFurtherConfirmation: boolean;
};

export type ContractReviewSupplementalAttentionType =
  | "建议重点核对"
  | "信息不足"
  | "存在歧义"
  | "建议补充约定";

export type ContractReviewSupplementalAttentionItem = {
  readonly attentionType: ContractReviewSupplementalAttentionType;
  readonly relatedClauseIds: readonly string[];
  readonly titleZh: string;
  readonly explanationZh: string;
  readonly preSigningQuestionsZh: readonly string[];
  readonly suggestedClauseDirectionsZh: readonly string[];
  readonly negotiationScriptZh: string;
  readonly needsFurtherConfirmation: true;
};

export type ContractReviewFullRedactedExplanationOutput = {
  readonly outputVersion:
    typeof CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION;
  readonly summaryZh: string;
  readonly ruleSignalExplanations:
    readonly ContractReviewRuleSignalExplanation[];
  readonly supplementalAttentionItems:
    readonly ContractReviewSupplementalAttentionItem[];
  readonly disclaimerZh: string;
};
