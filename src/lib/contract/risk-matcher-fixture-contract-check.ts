import { matchContractRisks } from "@/lib/contract/risk-matcher";
import { contractRiskRules } from "@/lib/contract/risk-rules";
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type {
  ContractRiskFinding,
  ContractRiskId,
} from "@/lib/contract/types";

type PositiveContractRiskFixture = {
  expectedRiskId: ContractRiskId;
  clause: ContractClauseSegment;
};

type NegativeContractRiskFixture = {
  id: string;
  clause: ContractClauseSegment;
};

type SortingContractRiskFixture = {
  clauses: readonly ContractClauseSegment[];
  expectedRiskOrder: readonly ContractRiskId[];
};

export const seedContractRiskIds = [
  "policy_clearance_no_compensation",
  "landlord_entry_without_notice",
  "excessive_late_fee_or_auto_termination",
  "unclear_deposit_deduction",
  "excessive_early_termination_penalty",
  "repair_responsibility_shifted_to_tenant",
] as const satisfies readonly ContractRiskId[];

export const positiveContractRiskFixtures = [
  {
    expectedRiskId: "policy_clearance_no_compensation",
    clause: {
      id: "positive-policy-clearance",
      title: "片段 1",
      text: "如因政策清退或房屋腾退导致无法继续居住，甲方不予补偿，乙方应配合搬离。",
    },
  },
  {
    expectedRiskId: "landlord_entry_without_notice",
    clause: {
      id: "positive-landlord-entry",
      title: "片段 2",
      text: "甲方有权自行进入房屋，可随时检查房屋使用情况，乙方不得拒绝。",
    },
  },
  {
    expectedRiskId: "excessive_late_fee_or_auto_termination",
    clause: {
      id: "positive-late-fee",
      title: "片段 3",
      text: "乙方逾期支付租金的，应每日承担滞纳金；逾期后甲方可自动解除合同。",
    },
  },
  {
    expectedRiskId: "unclear_deposit_deduction",
    clause: {
      id: "positive-deposit-deduction",
      title: "片段 4",
      text: "乙方退租时如存在其他损失，甲方可视情况扣除押金，押金不退。",
    },
  },
  {
    expectedRiskId: "excessive_early_termination_penalty",
    clause: {
      id: "positive-early-termination",
      title: "片段 5",
      text: "乙方提前退租的，应支付违约金，且押金不退。",
    },
  },
  {
    expectedRiskId: "repair_responsibility_shifted_to_tenant",
    clause: {
      id: "positive-repair-shift",
      title: "片段 6",
      text: "租期内房屋及设施设备损坏产生的一切维修，维修费用由乙方承担，包括自然损耗。",
    },
  },
] as const satisfies readonly PositiveContractRiskFixture[];

export const negativeContractRiskFixtures = [
  {
    id: "negative-landlord-entry-consent",
    clause: {
      id: "negative-landlord-entry-consent",
      title: "安全片段 1",
      text: "甲方进入房屋应提前通知并经乙方同意，紧急情况除外。",
    },
  },
  {
    id: "negative-deposit-details",
    clause: {
      id: "negative-deposit-details",
      title: "安全片段 2",
      text: "押金在双方结清费用后按约定退还，如需扣除应列明扣除项目并提供扣除明细。",
    },
  },
  {
    id: "negative-repair-landlord",
    clause: {
      id: "negative-repair-landlord",
      title: "安全片段 3",
      text: "自然损耗由甲方承担，甲方负责主体维修；非乙方原因造成的问题由甲方处理。",
    },
  },
  {
    id: "negative-late-payment-cure",
    clause: {
      id: "negative-late-payment-cure",
      title: "安全片段 4",
      text: "乙方逾期付款时，双方协商处理，并给予合理宽限期。",
    },
  },
  {
    id: "negative-early-termination-loss",
    clause: {
      id: "negative-early-termination-loss",
      title: "安全片段 5",
      text: "乙方提前退租费用由双方另行约定，并以实际合理损失为限。",
    },
  },
] as const satisfies readonly NegativeContractRiskFixture[];

export const sortingContractRiskFixture = {
  clauses: [
    {
      id: "sorting-deposit",
      title: "排序片段 1",
      text: "乙方退租时如存在其他损失，甲方可扣除押金。",
    },
    {
      id: "sorting-landlord-entry",
      title: "排序片段 2",
      text: "甲方有权自行进入房屋，乙方不得拒绝。",
    },
    {
      id: "sorting-policy",
      title: "排序片段 3",
      text: "如遇政府清退，甲方不予补偿，乙方应配合搬离。",
    },
    {
      id: "sorting-repair",
      title: "排序片段 4",
      text: "租期内全部维修由乙方承担维修费用。",
    },
  ],
  expectedRiskOrder: [
    "landlord_entry_without_notice",
    "policy_clearance_no_compensation",
    "unclear_deposit_deduction",
    "repair_responsibility_shifted_to_tenant",
  ],
} as const satisfies SortingContractRiskFixture;

export const forbiddenRuleReasonWords = [
  "违法",
  "无效",
  "霸王条款",
  "一定可撤销",
  "保证避坑",
  "保证无遗漏",
  "自动维权",
  "自动索赔",
  "法院会支持",
  "可以直接起诉",
  "高危",
  "中危",
  "低危",
] as const;

function assertFixture(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Contract risk matcher fixture failed: ${message}`);
  }
}

function getFindingsForClause(
  findings: readonly ContractRiskFinding[],
  clauseId: string,
) {
  return findings.filter((finding) => finding.clauseId === clauseId);
}

function assertHasRisk(
  findings: readonly ContractRiskFinding[],
  clauseId: string,
  expectedRiskId: ContractRiskId,
) {
  const finding = getFindingsForClause(findings, clauseId).find(
    (item) => item.riskId === expectedRiskId,
  );

  assertFixture(finding !== undefined, `expected ${clauseId} to match ${expectedRiskId}`);
  assertFixture(
    finding.matchedPhrases.length > 0,
    `expected ${clauseId} / ${expectedRiskId} to include matched phrases`,
  );
}

function assertNoFindingForClause(
  findings: readonly ContractRiskFinding[],
  clauseId: string,
) {
  const clauseFindings = getFindingsForClause(findings, clauseId);

  assertFixture(
    clauseFindings.length === 0,
    `expected ${clauseId} to have no findings`,
  );
}

function assertSortedRiskIds(
  findings: readonly ContractRiskFinding[],
  expectedRiskOrder: readonly ContractRiskId[],
) {
  const actualRiskOrder = findings.map((finding) => finding.riskId);

  assertFixture(
    actualRiskOrder.length === expectedRiskOrder.length,
    `expected ${expectedRiskOrder.length} sorted findings, received ${actualRiskOrder.length}`,
  );

  expectedRiskOrder.forEach((riskId, index) => {
    assertFixture(
      actualRiskOrder[index] === riskId,
      `expected sorted finding ${index + 1} to be ${riskId}, received ${actualRiskOrder[index]}`,
    );
  });
}

function assertEverySeedRuleHasPositiveFixture() {
  const fixtureRiskIds = new Set(
    positiveContractRiskFixtures.map((fixture) => fixture.expectedRiskId),
  );

  seedContractRiskIds.forEach((riskId) => {
    assertFixture(
      fixtureRiskIds.has(riskId),
      `expected positive fixture for ${riskId}`,
    );
  });
}

function assertNoForbiddenRuleReasonWords() {
  contractRiskRules.forEach((rule) => {
    forbiddenRuleReasonWords.forEach((word) => {
      assertFixture(
        !rule.ruleReason.includes(word),
        `ruleReason for ${rule.id} contains forbidden wording`,
      );
    });
  });
}

export function runContractRiskMatcherFixtureCheck(): void {
  assertEverySeedRuleHasPositiveFixture();
  assertNoForbiddenRuleReasonWords();

  const positiveFindings = matchContractRisks(
    positiveContractRiskFixtures.map((fixture) => fixture.clause),
  );

  positiveContractRiskFixtures.forEach((fixture) => {
    assertHasRisk(
      positiveFindings,
      fixture.clause.id,
      fixture.expectedRiskId,
    );
  });

  const negativeFindings = matchContractRisks(
    negativeContractRiskFixtures.map((fixture) => fixture.clause),
  );

  negativeContractRiskFixtures.forEach((fixture) => {
    assertNoFindingForClause(negativeFindings, fixture.clause.id);
  });

  const sortingFindings = matchContractRisks(sortingContractRiskFixture.clauses);
  assertSortedRiskIds(
    sortingFindings,
    sortingContractRiskFixture.expectedRiskOrder,
  );
}

export const contractRiskMatcherFixtureContractCheck = {
  seedRiskCount: seedContractRiskIds.length,
  positiveFixtureCount: positiveContractRiskFixtures.length,
  negativeFixtureCount: negativeContractRiskFixtures.length,
  sortingFixtureClauseCount: sortingContractRiskFixture.clauses.length,
  runner: runContractRiskMatcherFixtureCheck,
} as const;
