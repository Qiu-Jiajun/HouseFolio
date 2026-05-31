import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type { LegalBasisEntry } from "@/lib/contract/legal-basis";
import type { ContractRiskFinding } from "@/lib/contract/types";

export type ContractReviewModel = {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly legalBasisEntries: readonly LegalBasisEntry[];
  readonly counts: {
    readonly clauseCount: number;
    readonly findingCount: number;
    readonly legalBasisEntryCount: number;
  };
};

export function buildContractReviewModel(input: {
  readonly clauses: readonly ContractClauseSegment[];
  readonly findings: readonly ContractRiskFinding[];
  readonly resolvedLegalBasisEntries: readonly LegalBasisEntry[];
}): ContractReviewModel {
  return {
    clauses: input.clauses,
    findings: input.findings,
    legalBasisEntries: input.resolvedLegalBasisEntries,
    counts: {
      clauseCount: input.clauses.length,
      findingCount: input.findings.length,
      legalBasisEntryCount: input.resolvedLegalBasisEntries.length,
    },
  };
}
