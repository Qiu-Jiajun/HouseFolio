import {
  contractLegalBasisEntries,
  type LegalBasisEntry,
} from "@/lib/contract/legal-basis";
import {
  resolveLegalBasisForFinding,
  resolveLegalBasisForFindings,
} from "@/lib/contract/legal-basis-resolver";
import type { ContractRiskFinding } from "@/lib/contract/types";

type ContractRiskFindingWithText = ContractRiskFinding & {
  text: string;
};

type ContractLegalBasisResolverFixture = {
  finding: ContractRiskFinding;
  expectedLegalBasisIds: readonly string[];
};

const policyBasisId = "lease_stability_policy_clearance_context";
const entryBasisId = "landlord_entry_living_privacy_context";
const depositBasisId = "deposit_handling_refund_context";
const repairBasisId = "repair_responsibility_context";
const unknownBasisId = "unknown_legal_basis_id_for_resolver_check";

function createFinding(
  overrides: Partial<ContractRiskFinding>,
): ContractRiskFinding {
  return {
    riskId: "policy_clearance_no_compensation",
    clauseId: "resolver-check-clause",
    clauseIndex: 0,
    category: "stability",
    priority: "high",
    matchedPhrases: ["resolver-check-phrase"],
    ruleReason: "resolver check fixture",
    legalBasisIds: [policyBasisId],
    shouldExplainWithAI: false,
    ...overrides,
  };
}

export const contractLegalBasisResolverFixtures = [
  {
    finding: createFinding({
      legalBasisIds: [policyBasisId],
    }),
    expectedLegalBasisIds: [policyBasisId],
  },
  {
    finding: createFinding({
      riskId: "excessive_late_fee_or_auto_termination",
      category: "payment",
      priority: "medium",
      legalBasisIds: [],
    }),
    expectedLegalBasisIds: [],
  },
  {
    finding: createFinding({
      legalBasisIds: [unknownBasisId, depositBasisId],
    }),
    expectedLegalBasisIds: [depositBasisId],
  },
] as const satisfies readonly ContractLegalBasisResolverFixture[];

function assertResolverCheck(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `Contract legal basis resolver check failed: ${message}`,
    );
  }
}

function getEntryById(id: string): LegalBasisEntry {
  const entry = contractLegalBasisEntries.find((item) => item.id === id);

  assertResolverCheck(entry !== undefined, `expected canonical entry for ${id}`);

  return entry;
}

function getLegalBasisIds(entries: readonly LegalBasisEntry[]) {
  return entries.map((entry) => entry.id);
}

function assertIdsEqual(
  actual: readonly string[],
  expected: readonly string[],
  message: string,
) {
  assertResolverCheck(
    actual.length === expected.length,
    `${message}: expected ${expected.length} ids, received ${actual.length}`,
  );

  expected.forEach((id, index) => {
    assertResolverCheck(
      actual[index] === id,
      `${message}: expected ${id} at ${index}, received ${actual[index]}`,
    );
  });
}

function assertResolverResultIds(
  entries: readonly LegalBasisEntry[],
  expectedIds: readonly string[],
  message: string,
) {
  assertIdsEqual(getLegalBasisIds(entries), expectedIds, message);
}

function assertFindingSnapshotUnchanged(
  finding: ContractRiskFinding,
  snapshot: string,
  message: string,
) {
  assertResolverCheck(JSON.stringify(finding) === snapshot, message);
}

function assertCanonicalEntriesUnchanged(
  expectedLength: number,
  expectedIds: readonly string[],
) {
  assertResolverCheck(
    contractLegalBasisEntries.length === expectedLength,
    "expected canonical entry count to remain unchanged",
  );
  assertIdsEqual(
    contractLegalBasisEntries.map((entry) => entry.id),
    expectedIds,
    "expected canonical entry order to remain unchanged",
  );
}

export function runContractLegalBasisResolverChecks(): void {
  const canonicalEntryCount = contractLegalBasisEntries.length;
  const canonicalEntryIds = contractLegalBasisEntries.map((entry) => entry.id);
  const policyEntry = getEntryById(policyBasisId);

  contractLegalBasisResolverFixtures.forEach((fixture, index) => {
    assertResolverResultIds(
      resolveLegalBasisForFinding(fixture.finding),
      fixture.expectedLegalBasisIds,
      `resolver fixture ${index}`,
    );
  });

  const emptyFinding = createFinding({ legalBasisIds: [] });
  assertResolverResultIds(
    resolveLegalBasisForFinding(emptyFinding),
    [],
    "empty finding mapping",
  );

  assertResolverResultIds(
    resolveLegalBasisForFindings([]),
    [],
    "empty findings array",
  );

  const mappedFinding = contractLegalBasisResolverFixtures[0].finding;
  const mappedResult = resolveLegalBasisForFinding(mappedFinding);
  assertResolverResultIds(
    mappedResult,
    [policyBasisId],
    "mapped finding",
  );
  assertResolverCheck(
    mappedResult[0] === policyEntry,
    "expected mapped finding to return canonical entry object",
  );

  const unmappedFinding = contractLegalBasisResolverFixtures[1].finding;
  assertResolverResultIds(
    resolveLegalBasisForFinding(unmappedFinding),
    [],
    "intentionally unmapped finding",
  );

  const unknownThenKnownFinding = contractLegalBasisResolverFixtures[2].finding;
  assertResolverResultIds(
    resolveLegalBasisForFinding(unknownThenKnownFinding),
    [depositBasisId],
    "unknown id with known id",
  );

  const duplicateMultiFindingResult = resolveLegalBasisForFindings([
    createFinding({ legalBasisIds: [policyBasisId, depositBasisId] }),
    createFinding({ legalBasisIds: [policyBasisId, repairBasisId] }),
  ]);
  assertResolverResultIds(
    duplicateMultiFindingResult,
    [policyBasisId, depositBasisId, repairBasisId],
    "deduplicated multi-finding result",
  );

  const orderedMultiFindingResult = resolveLegalBasisForFindings([
    createFinding({ legalBasisIds: [entryBasisId] }),
    createFinding({ legalBasisIds: [repairBasisId, depositBasisId] }),
  ]);
  assertResolverResultIds(
    orderedMultiFindingResult,
    [entryBasisId, repairBasisId, depositBasisId],
    "first-encounter and finding order",
  );

  const perFindingOrderResult = resolveLegalBasisForFinding(
    createFinding({ legalBasisIds: [repairBasisId, entryBasisId] }),
  );
  assertResolverResultIds(
    perFindingOrderResult,
    [repairBasisId, entryBasisId],
    "per-finding legal basis id order",
  );

  const repeatFinding = createFinding({
    legalBasisIds: [policyBasisId, depositBasisId],
  });
  assertIdsEqual(
    getLegalBasisIds(resolveLegalBasisForFinding(repeatFinding)),
    getLegalBasisIds(resolveLegalBasisForFinding(repeatFinding)),
    "repeated single-finding calls",
  );
  assertIdsEqual(
    getLegalBasisIds(resolveLegalBasisForFindings([repeatFinding])),
    getLegalBasisIds(resolveLegalBasisForFindings([repeatFinding])),
    "repeated multi-finding calls",
  );

  const mutationCheckFinding = createFinding({
    legalBasisIds: [policyBasisId, depositBasisId],
  });
  const mutationCheckSnapshot = JSON.stringify(mutationCheckFinding);
  resolveLegalBasisForFinding(mutationCheckFinding);
  resolveLegalBasisForFindings([mutationCheckFinding]);
  assertFindingSnapshotUnchanged(
    mutationCheckFinding,
    mutationCheckSnapshot,
    "expected input finding to remain unchanged",
  );

  const textFindingOne: ContractRiskFindingWithText = {
    ...createFinding({ legalBasisIds: [policyBasisId] }),
    text: "first text",
  };
  const textFindingTwo: ContractRiskFindingWithText = {
    ...textFindingOne,
    text: "second text",
  };
  assertIdsEqual(
    getLegalBasisIds(resolveLegalBasisForFinding(textFindingOne)),
    getLegalBasisIds(resolveLegalBasisForFinding(textFindingTwo)),
    "text-only change",
  );

  const phraseFindingOne = createFinding({
    legalBasisIds: [policyBasisId],
    matchedPhrases: ["first phrase"],
  });
  const phraseFindingTwo = createFinding({
    ...phraseFindingOne,
    matchedPhrases: ["second phrase"],
  });
  assertIdsEqual(
    getLegalBasisIds(resolveLegalBasisForFinding(phraseFindingOne)),
    getLegalBasisIds(resolveLegalBasisForFinding(phraseFindingTwo)),
    "matched-phrases-only change",
  );

  assertCanonicalEntriesUnchanged(canonicalEntryCount, canonicalEntryIds);
}

export const contractLegalBasisResolverContractCheck = {
  fixtureCount: contractLegalBasisResolverFixtures.length,
  runner: runContractLegalBasisResolverChecks,
} as const;
