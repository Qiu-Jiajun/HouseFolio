import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";

export type ContractRiskId =
  | "policy_clearance_no_compensation"
  | "landlord_entry_without_notice"
  | "excessive_late_fee_or_auto_termination"
  | "unclear_deposit_deduction"
  | "excessive_early_termination_penalty"
  | "repair_responsibility_shifted_to_tenant";

export type ContractRiskCategory =
  | "stability"
  | "privacy"
  | "payment"
  | "deposit"
  | "termination"
  | "repair";

export type ContractRiskPriority = "high" | "medium" | "low";

export type ContractRiskMatchStrategy = {
  anyKeywords?: readonly string[];
  allKeywords?: readonly string[];
  negativeKeywords?: readonly string[];
};

export type ContractRiskRule = ContractRiskMatchStrategy & {
  id: ContractRiskId;
  category: ContractRiskCategory;
  priority: ContractRiskPriority;
  ruleReason: string;
  legalBasisIds: readonly string[];
  shouldExplainWithAI: boolean;
};

export type ContractRiskFinding = {
  riskId: ContractRiskId;
  clauseId: ContractClauseSegment["id"];
  clauseIndex: number;
  category: ContractRiskCategory;
  priority: ContractRiskPriority;
  matchedPhrases: readonly string[];
  ruleReason: string;
  legalBasisIds: readonly string[];
  shouldExplainWithAI: boolean;
};
