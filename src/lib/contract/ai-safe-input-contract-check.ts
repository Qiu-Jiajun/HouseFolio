import {
  CONTRACT_REVIEW_AI_INPUT_LIMITS,
  CONTRACT_REVIEW_AI_INPUT_VERSION,
  buildContractReviewAiInput,
  redactContractClauseExcerpt,
  type ContractReviewAiInput,
} from "@/lib/contract/ai-safe-input";
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import {
  contractLegalBasisEntries,
  type LegalBasisEntry,
} from "@/lib/contract/legal-basis";
import { buildContractReviewModel } from "@/lib/contract/review-model";
import type { ContractRiskFinding } from "@/lib/contract/types";

type Assert<T extends true> = T;
type IsExact<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;

type _BuilderReturnsAiSafeInput = Assert<
  IsExact<ReturnType<typeof buildContractReviewAiInput>, ContractReviewAiInput>
>;

type _RedactorReturnsString = Assert<
  IsExact<ReturnType<typeof redactContractClauseExcerpt>, string>
>;

function assertAiSafeInputCheck(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`Contract AI-safe input check failed: ${message}`);
  }
}

function assertHasExactKeys(
  value: object,
  expectedKeys: readonly string[],
  message: string,
) {
  const keys = Object.keys(value);

  assertAiSafeInputCheck(
    keys.length === expectedKeys.length,
    `${message}: expected ${expectedKeys.length} keys, received ${keys.length}`,
  );

  expectedKeys.forEach((key) => {
    assertAiSafeInputCheck(
      keys.includes(key),
      `${message}: missing key ${key}`,
    );
  });
}

function getCanonicalLegalBasisEntry(id: string) {
  const entry = contractLegalBasisEntries.find((item) => item.id === id);

  assertAiSafeInputCheck(
    entry !== undefined,
    `expected canonical legal basis entry for ${id}`,
  );

  return entry;
}

function createFinding(
  overrides: Partial<ContractRiskFinding> = {},
): ContractRiskFinding {
  return {
    riskId: "policy_clearance_no_compensation",
    clauseId: "ai-safe-clause-1",
    clauseIndex: 0,
    category: "stability",
    priority: "high",
    matchedPhrases: ["政策清退", "不予补偿"],
    ruleReason:
      "涉及清退、征收或腾退安排时，补偿和搬离责任需要优先问清楚，避免后续影响居住稳定性。",
    legalBasisIds: ["lease_stability_policy_clearance_context"],
    shouldExplainWithAI: false,
    ...overrides,
  };
}

function createFixtureLegalBasisEntry(
  id: string,
  shortSummary = "用于验证 AI-safe 输入裁剪行为的法规依据背景。",
): LegalBasisEntry {
  return {
    id,
    title: `法规依据背景 ${id}`,
    sourceName: "fixture source",
    sourceLevel: "official_guidance",
    jurisdiction: "national",
    articleRef: "fixture article",
    shortSummary,
    relevanceScope: ["lease_stability"],
    relatedRiskIds: ["policy_clearance_no_compensation"],
    versionLabel: "fixture version",
    lastVerifiedAt: "2026-05-31",
    officialSourceHint: "fixture source hint",
    userFacingCaveat: "仅用于 contract-check fixture。",
  };
}

function assertTextRedacted(
  input: string,
  forbiddenText: string,
  expectedMask: string,
) {
  const output = redactContractClauseExcerpt(input);

  assertAiSafeInputCheck(
    output.includes(expectedMask),
    `expected redacted output to include ${expectedMask}`,
  );

  assertAiSafeInputCheck(
    !output.includes(forbiddenText),
    `expected redacted output to remove ${forbiddenText}`,
  );
}

export function runContractReviewAiSafeInputChecks(): void {
  assertAiSafeInputCheck(
    CONTRACT_REVIEW_AI_INPUT_VERSION === "contract-review-ai-safe-v1",
    "expected stable AI-safe input version",
  );

  assertTextRedacted(
    "联系电话：13812345678",
    "13812345678",
    "[手机号已脱敏]",
  );
  assertTextRedacted(
    "身份证号：110101199001011234",
    "110101199001011234",
    "[身份证号已脱敏]",
  );
  assertTextRedacted(
    "邮箱：tenant@example.com",
    "tenant@example.com",
    "[邮箱已脱敏]",
  );
  assertTextRedacted(
    "房屋位于北京市海淀区1号楼2单元301室。",
    "1号楼2单元301室",
    "[房屋地址已脱敏]",
  );
  assertTextRedacted(
    "甲方姓名：张三",
    "张三",
    "[姓名已脱敏]",
  );
  assertTextRedacted(
    "合同编号：HF-2026-0001",
    "HF-2026-0001",
    "[合同编号已脱敏]",
  );
  assertTextRedacted(
    "收款账户：6222021234567890123",
    "6222021234567890123",
    "[账号信息已脱敏]",
  );
  assertTextRedacted(
    "甲方签字：张三",
    "张三",
    "[签字信息已脱敏]",
  );

  const canonicalPolicyBasis = getCanonicalLegalBasisEntry(
    "lease_stability_policy_clearance_context",
  );

  const baseClauses = [
    {
      id: "ai-safe-clause-1",
      title: "片段 1",
      text:
        "甲方姓名：张三。联系电话：13812345678。如因政策清退导致无法继续居住，甲方不予补偿。",
    },
    {
      id: "ai-safe-clause-2",
      title: "片段 2",
      text: "甲方有权自行进入房屋，可随时检查，乙方不得拒绝。",
    },
  ] as const satisfies readonly ContractClauseSegment[];

  const baseFindings = [
    createFinding(),
    createFinding({
      riskId: "landlord_entry_without_notice",
      clauseId: "ai-safe-clause-2",
      clauseIndex: 1,
      category: "privacy",
      priority: "medium",
      matchedPhrases: ["甲方有权自行进入", "乙方不得拒绝"],
      ruleReason:
        "进入房屋的条件、提前沟通方式和紧急情形建议签约前确认，避免影响日常居住边界。",
      legalBasisIds: ["landlord_entry_living_privacy_context"],
    }),
  ] as const satisfies readonly ContractRiskFinding[];

  const baseModel = buildContractReviewModel({
    clauses: baseClauses,
    findings: baseFindings,
    resolvedLegalBasisEntries: [
      canonicalPolicyBasis,
      getCanonicalLegalBasisEntry("landlord_entry_living_privacy_context"),
    ],
  });

  const baseModelSnapshot = JSON.stringify(baseModel);
  const baseInput = buildContractReviewAiInput(baseModel);

  assertAiSafeInputCheck(
    baseInput.payloadVersion === "contract-review-ai-safe-v1",
    "expected payloadVersion",
  );
  assertAiSafeInputCheck(baseInput.locale === "zh-CN", "expected zh-CN locale");
  assertAiSafeInputCheck(
    baseInput.disclaimerMode === "contract-risk-prompt-only",
    "expected disclaimerMode",
  );
  assertAiSafeInputCheck(
    baseInput.findingCount === baseInput.findings.length,
    "expected findingCount to match findings length",
  );

  assertHasExactKeys(
    baseInput,
    ["payloadVersion", "locale", "disclaimerMode", "findingCount", "findings"],
    "expected top-level allowlist fields",
  );

  const firstFinding = baseInput.findings[0];

  assertAiSafeInputCheck(
    firstFinding !== undefined,
    "expected first AI-safe finding",
  );

  assertHasExactKeys(
    firstFinding,
    [
      "riskId",
      "riskLevel",
      "category",
      "ruleTitleZh",
      "clause",
      "riskSummaryZh",
      "whyItMattersZh",
      "legalBases",
    ],
    "expected finding allowlist fields",
  );

  assertHasExactKeys(
    firstFinding.clause,
    ["clauseId", "clauseOrder", "redactedClauseExcerpt"],
    "expected clause allowlist fields",
  );

  const firstLegalBasis = firstFinding.legalBases[0];

  assertAiSafeInputCheck(
    firstLegalBasis !== undefined,
    "expected first AI-safe legal basis",
  );

  assertHasExactKeys(
    firstLegalBasis,
    [
      "legalBasisId",
      "legalBasisTitleZh",
      "legalBasisSummaryZh",
      "legalBasisSourceType",
    ],
    "expected legal basis allowlist fields",
  );

  assertAiSafeInputCheck(
    firstFinding.clause.redactedClauseExcerpt.includes("[姓名已脱敏]"),
    "expected clause excerpt to redact labeled name",
  );
  assertAiSafeInputCheck(
    firstFinding.clause.redactedClauseExcerpt.includes("[手机号已脱敏]"),
    "expected clause excerpt to redact phone number",
  );
  assertAiSafeInputCheck(
    !firstFinding.clause.redactedClauseExcerpt.includes("张三"),
    "expected clause excerpt not to include original name",
  );
  assertAiSafeInputCheck(
    !firstFinding.clause.redactedClauseExcerpt.includes("13812345678"),
    "expected clause excerpt not to include original phone number",
  );
  assertAiSafeInputCheck(
    firstFinding.clause.clauseOrder === 1,
    "expected clause order to derive from clauseIndex",
  );
  assertAiSafeInputCheck(
    firstFinding.legalBases[0]?.legalBasisId ===
      "lease_stability_policy_clearance_context",
    "expected canonical legal basis mapping",
  );
  assertAiSafeInputCheck(
    JSON.stringify(baseModel) === baseModelSnapshot,
    "expected builder not to mutate input model",
  );

  const orderInput = buildContractReviewAiInput(
    buildContractReviewModel({
      clauses: baseClauses,
      findings: [baseFindings[1], baseFindings[0]],
      resolvedLegalBasisEntries: [],
    }),
  );

  assertAiSafeInputCheck(
    orderInput.findings[0]?.riskId === "landlord_entry_without_notice",
    "expected builder to preserve upstream finding order",
  );
  assertAiSafeInputCheck(
    orderInput.findings[1]?.riskId === "policy_clearance_no_compensation",
    "expected builder not to add new sorting logic",
  );

  const overflowClauses = Array.from(
    { length: CONTRACT_REVIEW_AI_INPUT_LIMITS.maxFindings + 3 },
    (_, index): ContractClauseSegment => ({
      id: `overflow-clause-${index + 1}`,
      title: `超长片段 ${index + 1}`,
      text: `政策清退 ${"甲".repeat(
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxExcerptChars * 2,
      )}`,
    }),
  );

  const overflowFindings = overflowClauses.map((clause, index) =>
    createFinding({
      clauseId: clause.id,
      clauseIndex: index,
      legalBasisIds: [],
    }),
  );

  const overflowInput = buildContractReviewAiInput(
    buildContractReviewModel({
      clauses: overflowClauses,
      findings: overflowFindings,
      resolvedLegalBasisEntries: [],
    }),
  );

  assertAiSafeInputCheck(
    overflowInput.findings.length ===
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxFindings,
    "expected finding limit",
  );

  overflowInput.findings.forEach((finding) => {
    assertAiSafeInputCheck(
      finding.clause.redactedClauseExcerpt.length <=
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxExcerptChars,
      "expected per-excerpt character limit",
    );
  });

  const totalExcerptChars = overflowInput.findings.reduce(
    (total, finding) => total + finding.clause.redactedClauseExcerpt.length,
    0,
  );

  assertAiSafeInputCheck(
    totalExcerptChars <=
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxTotalExcerptChars,
    "expected total excerpt character limit",
  );

  const overflowLegalBases = Array.from({ length: 5 }, (_, index) =>
    createFixtureLegalBasisEntry(
      `fixture-legal-basis-${index + 1}`,
      "乙".repeat(
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars + 20,
      ),
    ),
  );

  const legalBasisLimitInput = buildContractReviewAiInput(
    buildContractReviewModel({
      clauses: [baseClauses[0]],
      findings: [
        createFinding({
          legalBasisIds: overflowLegalBases.map((entry) => entry.id),
          ruleReason: "丙".repeat(
            CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars + 20,
          ),
        }),
      ],
      resolvedLegalBasisEntries: overflowLegalBases,
    }),
  );

  const legalBasisLimitFinding = legalBasisLimitInput.findings[0];

  assertAiSafeInputCheck(
    legalBasisLimitFinding !== undefined,
    "expected legal basis limit finding",
  );
  assertAiSafeInputCheck(
    legalBasisLimitFinding.legalBases.length ===
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasesPerFinding,
    "expected legal basis per-finding limit",
  );
  assertAiSafeInputCheck(
    legalBasisLimitFinding.legalBases.every(
      (entry) =>
        entry.legalBasisSummaryZh.length <=
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars,
    ),
    "expected legal basis summary length limit",
  );
  assertAiSafeInputCheck(
    legalBasisLimitFinding.riskSummaryZh.length <=
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars,
    "expected risk summary length limit",
  );

  const duplicateBasisInput = buildContractReviewAiInput(
    buildContractReviewModel({
      clauses: [baseClauses[0]],
      findings: [
        createFinding({
          legalBasisIds: [
            "lease_stability_policy_clearance_context",
            "lease_stability_policy_clearance_context",
          ],
        }),
      ],
      resolvedLegalBasisEntries: [canonicalPolicyBasis],
    }),
  );

  assertAiSafeInputCheck(
    duplicateBasisInput.findings[0]?.legalBases.length === 1,
    "expected duplicate legal basis ids to be deduplicated",
  );
}

export const contractReviewAiSafeInputContractCheck = {
  builderReturnsAiSafeInput: true as _BuilderReturnsAiSafeInput,
  redactorReturnsString: true as _RedactorReturnsString,
  runner: runContractReviewAiSafeInputChecks,
} as const;
