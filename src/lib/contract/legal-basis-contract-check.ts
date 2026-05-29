import { contractLegalBasisEntries } from "@/lib/contract/legal-basis";
import { contractRiskRules } from "@/lib/contract/risk-rules";
import type {
  ContractRiskId,
  ContractRiskRule,
} from "@/lib/contract/types";
import type { LegalBasisEntry } from "@/lib/contract/legal-basis";

type Assert<T extends true> = T;
type IsAssignable<Actual, Expected> = Actual extends Expected ? true : false;
type IsExact<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;

type HasUniqueIds<
  Entries extends readonly { id: string }[],
  SeenIds extends string = never,
> = Entries extends readonly [
  infer Head extends { id: string },
  ...infer Tail extends readonly { id: string }[],
]
  ? Head["id"] extends SeenIds
    ? false
    : HasUniqueIds<Tail, SeenIds | Head["id"]>
  : true;

type LegalBasisRelatedRiskIds =
  (typeof contractLegalBasisEntries)[number]["relatedRiskIds"][number];
type KnownLegalBasisIds =
  (typeof contractLegalBasisEntries)[number]["id"];
type RuleReferencedLegalBasisIds =
  (typeof contractRiskRules)[number]["legalBasisIds"][number];

type _LegalBasisEntriesMatchEntryType = Assert<
  IsAssignable<typeof contractLegalBasisEntries, readonly LegalBasisEntry[]>
>;

type _ContractRiskRulesMatchRuleType = Assert<
  IsAssignable<typeof contractRiskRules, readonly ContractRiskRule[]>
>;

type _RelatedRiskIdsAreKnownContractRiskIds = Assert<
  IsAssignable<LegalBasisRelatedRiskIds, ContractRiskId>
>;

type _LegalBasisIdsAreUnique = Assert<
  HasUniqueIds<typeof contractLegalBasisEntries>
>;

type _RuleLegalBasisIdsExist = Assert<
  IsAssignable<RuleReferencedLegalBasisIds, KnownLegalBasisIds>
>;

export const contractLegalBasisAlignmentContractCheck = {
  legalBasisEntriesMatchEntryType: true as _LegalBasisEntriesMatchEntryType,
  contractRiskRulesMatchRuleType: true as _ContractRiskRulesMatchRuleType,
  relatedRiskIdsAreKnownContractRiskIds:
    true as _RelatedRiskIdsAreKnownContractRiskIds,
  legalBasisIdsAreUnique: true as _LegalBasisIdsAreUnique,
  ruleLegalBasisIdsExist: true as _RuleLegalBasisIdsExist,
} as const;
