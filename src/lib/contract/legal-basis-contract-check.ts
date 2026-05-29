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
type RuleLegalBasisIds =
  (typeof contractRiskRules)[number]["legalBasisIds"];

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

type _RuleLegalBasisIdsAreReadonlyStrings = Assert<
  IsExact<RuleLegalBasisIds, readonly string[]>
>;

// Current ContractRiskRule.legalBasisIds is typed as readonly string[], and
// contractRiskRules is annotated as readonly ContractRiskRule[]. This check can
// confirm the current shape, but cannot fully reject a future unknown non-empty
// rule legalBasisId without narrowing risk-rules.ts typing in a later phase.
export const contractLegalBasisAlignmentContractCheck = {
  legalBasisEntriesMatchEntryType: true as _LegalBasisEntriesMatchEntryType,
  contractRiskRulesMatchRuleType: true as _ContractRiskRulesMatchRuleType,
  relatedRiskIdsAreKnownContractRiskIds:
    true as _RelatedRiskIdsAreKnownContractRiskIds,
  legalBasisIdsAreUnique: true as _LegalBasisIdsAreUnique,
  ruleLegalBasisIdsAreReadonlyStrings:
    true as _RuleLegalBasisIdsAreReadonlyStrings,
} as const;
