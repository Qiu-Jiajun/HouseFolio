import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import { contractLegalBasisEntries } from "@/lib/contract/legal-basis";
import { buildContractReviewModel } from "@/lib/contract/review-model";
import type { ContractRiskFinding } from "@/lib/contract/types";

const contractReviewModelClauseFixtures = [
  {
    id: "review-model-clause-1",
    title: "Review model clause 1",
    text: "Review model first clause fixture.",
  },
  {
    id: "review-model-clause-2",
    title: "Review model clause 2",
    text: "Review model second clause fixture.",
  },
] as const satisfies readonly ContractClauseSegment[];

const contractReviewModelFindingFixtures = [
  {
    riskId: "policy_clearance_no_compensation",
    clauseId: "review-model-clause-1",
    clauseIndex: 0,
    category: "stability",
    priority: "high",
    matchedPhrases: ["policy clearance"],
    ruleReason: "review model policy fixture",
    legalBasisIds: ["lease_stability_policy_clearance_context"],
    shouldExplainWithAI: false,
  },
  {
    riskId: "landlord_entry_without_notice",
    clauseId: "review-model-clause-2",
    clauseIndex: 1,
    category: "privacy",
    priority: "medium",
    matchedPhrases: ["entry without notice"],
    ruleReason: "review model entry fixture",
    legalBasisIds: ["landlord_entry_living_privacy_context"],
    shouldExplainWithAI: true,
  },
] as const satisfies readonly ContractRiskFinding[];

function assertReviewModelCheck(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`Contract review model check failed: ${message}`);
  }
}

function getCanonicalLegalBasisEntry(id: string) {
  const entry = contractLegalBasisEntries.find((item) => item.id === id);

  assertReviewModelCheck(
    entry !== undefined,
    `expected canonical legal basis entry for ${id}`,
  );

  return entry;
}

function assertHasExactKeys(
  value: object,
  expectedKeys: readonly string[],
  message: string,
) {
  const keys = Object.keys(value);

  assertReviewModelCheck(
    keys.length === expectedKeys.length,
    `${message}: expected ${expectedKeys.length} keys, received ${keys.length}`,
  );

  expectedKeys.forEach((key) => {
    assertReviewModelCheck(
      keys.includes(key),
      `${message}: missing key ${key}`,
    );
  });
}

export function runContractReviewModelChecks(): void {
  const contractReviewModelLegalBasisFixtures = [
    getCanonicalLegalBasisEntry("lease_stability_policy_clearance_context"),
    getCanonicalLegalBasisEntry("landlord_entry_living_privacy_context"),
  ] as const;

  const emptyModel = buildContractReviewModel({
    clauses: [],
    findings: [],
    resolvedLegalBasisEntries: [],
  });

  assertReviewModelCheck(
    emptyModel.counts.clauseCount === 0,
    "expected empty clause count",
  );
  assertReviewModelCheck(
    emptyModel.counts.findingCount === 0,
    "expected empty finding count",
  );
  assertReviewModelCheck(
    emptyModel.counts.legalBasisEntryCount === 0,
    "expected empty legal basis entry count",
  );

  const clausesSnapshot = JSON.stringify(contractReviewModelClauseFixtures);
  const findingsSnapshot = JSON.stringify(contractReviewModelFindingFixtures);
  const legalBasisSnapshot = JSON.stringify(
    contractReviewModelLegalBasisFixtures,
  );

  const model = buildContractReviewModel({
    clauses: contractReviewModelClauseFixtures,
    findings: contractReviewModelFindingFixtures,
    resolvedLegalBasisEntries: contractReviewModelLegalBasisFixtures,
  });

  assertReviewModelCheck(
    model.clauses === contractReviewModelClauseFixtures,
    "expected clauses reference to match input",
  );
  assertReviewModelCheck(
    model.findings === contractReviewModelFindingFixtures,
    "expected findings reference to match input",
  );
  assertReviewModelCheck(
    model.legalBasisEntries === contractReviewModelLegalBasisFixtures,
    "expected legal basis entries reference to match input",
  );

  contractReviewModelClauseFixtures.forEach((clause, index) => {
    assertReviewModelCheck(
      model.clauses[index] === clause,
      `expected clause order to be preserved at ${index}`,
    );
  });

  contractReviewModelFindingFixtures.forEach((finding, index) => {
    assertReviewModelCheck(
      model.findings[index] === finding,
      `expected finding order to be preserved at ${index}`,
    );
  });

  contractReviewModelLegalBasisFixtures.forEach((entry, index) => {
    assertReviewModelCheck(
      model.legalBasisEntries[index] === entry,
      `expected legal basis entry order to be preserved at ${index}`,
    );
  });

  assertReviewModelCheck(
    model.counts.clauseCount === contractReviewModelClauseFixtures.length,
    "expected clause count to match input length",
  );
  assertReviewModelCheck(
    model.counts.findingCount === contractReviewModelFindingFixtures.length,
    "expected finding count to match input length",
  );
  assertReviewModelCheck(
    model.counts.legalBasisEntryCount ===
      contractReviewModelLegalBasisFixtures.length,
    "expected legal basis entry count to match input length",
  );

  const repeatedModel = buildContractReviewModel({
    clauses: contractReviewModelClauseFixtures,
    findings: contractReviewModelFindingFixtures,
    resolvedLegalBasisEntries: contractReviewModelLegalBasisFixtures,
  });

  assertReviewModelCheck(
    repeatedModel !== model,
    "expected repeated calls to create distinct model wrappers",
  );
  assertReviewModelCheck(
    repeatedModel.counts !== model.counts,
    "expected repeated calls to create distinct counts wrappers",
  );
  assertReviewModelCheck(
    repeatedModel.clauses === model.clauses,
    "expected repeated calls to keep equivalent clauses field",
  );
  assertReviewModelCheck(
    repeatedModel.findings === model.findings,
    "expected repeated calls to keep equivalent findings field",
  );
  assertReviewModelCheck(
    repeatedModel.legalBasisEntries === model.legalBasisEntries,
    "expected repeated calls to keep equivalent legal basis entries field",
  );
  assertReviewModelCheck(
    repeatedModel.counts.clauseCount === model.counts.clauseCount,
    "expected repeated calls to keep equivalent clause count",
  );
  assertReviewModelCheck(
    repeatedModel.counts.findingCount === model.counts.findingCount,
    "expected repeated calls to keep equivalent finding count",
  );
  assertReviewModelCheck(
    repeatedModel.counts.legalBasisEntryCount ===
      model.counts.legalBasisEntryCount,
    "expected repeated calls to keep equivalent legal basis entry count",
  );

  assertHasExactKeys(
    model,
    ["clauses", "findings", "legalBasisEntries", "counts"],
    "expected review model top-level fields",
  );
  assertHasExactKeys(
    model.counts,
    ["clauseCount", "findingCount", "legalBasisEntryCount"],
    "expected review model counts fields",
  );

  assertReviewModelCheck(
    JSON.stringify(contractReviewModelClauseFixtures) === clausesSnapshot,
    "expected clause fixtures to remain unchanged",
  );
  assertReviewModelCheck(
    JSON.stringify(contractReviewModelFindingFixtures) === findingsSnapshot,
    "expected finding fixtures to remain unchanged",
  );
  assertReviewModelCheck(
    JSON.stringify(contractReviewModelLegalBasisFixtures) ===
      legalBasisSnapshot,
    "expected legal basis fixtures to remain unchanged",
  );
}

export const contractReviewModelContractCheck = {
  runner: runContractReviewModelChecks,
} as const;
