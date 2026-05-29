import { contractRiskRules } from "@/lib/contract/risk-rules";
import { matchContractRisks } from "@/lib/contract/risk-matcher";
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type {
  ContractRiskFinding,
  ContractRiskId,
  ContractRiskRule,
} from "@/lib/contract/types";

type Assert<T extends true> = T;
type IsAssignable<Actual, Expected> = Actual extends Expected ? true : false;
type IsExact<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;

declare const clauseSegments: readonly ContractClauseSegment[];

type _RulesAreContractRiskRules = Assert<
  IsAssignable<typeof contractRiskRules, readonly ContractRiskRule[]>
>;

type _MatcherAcceptsClauseSegments = Assert<
  IsAssignable<
    typeof clauseSegments,
    Parameters<typeof matchContractRisks>[0]
  >
>;

type _MatcherReturnsFindings = Assert<
  IsExact<ReturnType<typeof matchContractRisks>, ContractRiskFinding[]>
>;

type _RuleIdsMatchContractRiskId = Assert<
  IsExact<(typeof contractRiskRules)[number]["id"], ContractRiskId>
>;

type _LegalBasisIdsRemainReadonlyStringArrays = Assert<
  IsAssignable<
    (typeof contractRiskRules)[number]["legalBasisIds"],
    readonly string[]
  >
>;

export const contractRiskMatcherContractCheck = {
  rulesAreContractRiskRules: true as _RulesAreContractRiskRules,
  matcherAcceptsClauseSegments: true as _MatcherAcceptsClauseSegments,
  matcherReturnsFindings: true as _MatcherReturnsFindings,
  ruleIdsMatchContractRiskId: true as _RuleIdsMatchContractRiskId,
  legalBasisIdsRemainReadonlyStringArrays:
    true as _LegalBasisIdsRemainReadonlyStringArrays,
} as const;
