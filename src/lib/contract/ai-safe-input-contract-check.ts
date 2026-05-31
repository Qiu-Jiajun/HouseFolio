import {
  CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS,
  CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION,
  CONTRACT_REVIEW_AI_INPUT_LIMITS,
  CONTRACT_REVIEW_AI_INPUT_VERSION,
  ContractReviewFullRedactedAiInputError,
  buildContractReviewFullRedactedAiInput,
  buildContractReviewAiInput,
  redactContractClauseExcerpt,
  redactContractClauseText,
  type ContractReviewFullRedactedAiInput,
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

type _FullRedactedBuilderReturnsAiSafeInput = Assert<
  IsExact<
    ReturnType<typeof buildContractReviewFullRedactedAiInput>,
    ContractReviewFullRedactedAiInput
  >
>;

type _RedactorReturnsString = Assert<
  IsExact<ReturnType<typeof redactContractClauseExcerpt>, string>
>;

type _FullRedactedRedactorReturnsString = Assert<
  IsExact<ReturnType<typeof redactContractClauseText>, string>
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

function assertFullRedactedBuilderError(
  modelInput: Parameters<typeof buildContractReviewModel>[0],
  expectedCode: ContractReviewFullRedactedAiInputError["code"],
) {
  try {
    buildContractReviewFullRedactedAiInput(
      buildContractReviewModel(modelInput),
    );
  } catch (error) {
    assertAiSafeInputCheck(
      error instanceof ContractReviewFullRedactedAiInputError,
      `expected full-redacted builder error ${expectedCode}`,
    );
    assertAiSafeInputCheck(
      error.code === expectedCode,
      `expected full-redacted builder error ${expectedCode}, received ${error.code}`,
    );
    return;
  }

  throw new Error(
    `Contract AI-safe input check failed: expected full-redacted builder error ${expectedCode}`,
  );
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

  const fullRedactedClauses = [
    {
      id: "clause-1",
      title: "条款 1",
      text:
        "甲方姓名：张三\r\n联系电话：13812345678\r\n身份证号：110101199001011234\r\n邮箱：tenant@example.com",
    },
    {
      id: "clause-2",
      title: "条款 2",
      text:
        "房屋地址：北京市海淀区1号楼2单元301室\r\n收款账户：6222021234567890123",
    },
  ] as const satisfies readonly ContractClauseSegment[];

  const emptyRuleSignalsInput = buildContractReviewFullRedactedAiInput(
    buildContractReviewModel({
      clauses: fullRedactedClauses,
      findings: [],
      resolvedLegalBasisEntries: [],
    }),
  );

  assertAiSafeInputCheck(
    emptyRuleSignalsInput.payloadVersion ===
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_VERSION,
    "expected full-redacted payload version",
  );
  assertAiSafeInputCheck(
    emptyRuleSignalsInput.locale === "zh-CN",
    "expected full-redacted zh-CN locale",
  );
  assertAiSafeInputCheck(
    emptyRuleSignalsInput.reviewMode === "full-redacted-contract",
    "expected full-redacted review mode",
  );
  assertAiSafeInputCheck(
    emptyRuleSignalsInput.redactedClauses.length === 2,
    "expected all clauses to enter redactedClauses",
  );
  assertAiSafeInputCheck(
    emptyRuleSignalsInput.ruleSignals.length === 0,
    "expected ruleSignals to allow empty findings",
  );
  assertAiSafeInputCheck(
    emptyRuleSignalsInput.redactedClauses.every((clause) =>
      clause.redactedClauseText.includes("\n"),
    ),
    "expected full-clause redactor to preserve internal line breaks",
  );

  const fullRedactedText = emptyRuleSignalsInput.redactedClauses
    .map((clause) => clause.redactedClauseText)
    .join("\n");

  [
    "张三",
    "13812345678",
    "110101199001011234",
    "tenant@example.com",
    "北京市海淀区1号楼2单元301室",
    "6222021234567890123",
  ].forEach((forbiddenText) => {
    assertAiSafeInputCheck(
      !fullRedactedText.includes(forbiddenText),
      `expected full redacted text to remove ${forbiddenText}`,
    );
  });

  [
    "[姓名已脱敏]",
    "[手机号已脱敏]",
    "[身份证号已脱敏]",
    "[邮箱已脱敏]",
    "[房屋地址已脱敏]",
    "[账号信息已脱敏]",
  ].forEach((expectedMask) => {
    assertAiSafeInputCheck(
      fullRedactedText.includes(expectedMask),
      `expected full redacted text to include ${expectedMask}`,
    );
  });

  assertHasExactKeys(
    emptyRuleSignalsInput,
    [
      "payloadVersion",
      "locale",
      "reviewMode",
      "redactedClauses",
      "ruleSignals",
    ],
    "expected full-redacted top-level allowlist fields",
  );
  assertHasExactKeys(
    emptyRuleSignalsInput.redactedClauses[0],
    ["clauseId", "clauseOrder", "redactedClauseText"],
    "expected full-redacted clause allowlist fields",
  );

  const fullSignalFinding = createFinding({
    clauseId: "clause-1",
    clauseIndex: 0,
    legalBasisIds: ["lease_stability_policy_clearance_context"],
  });
  const fullSignalModel = buildContractReviewModel({
    clauses: fullRedactedClauses,
    findings: [fullSignalFinding],
    resolvedLegalBasisEntries: [canonicalPolicyBasis],
  });
  const fullSignalModelSnapshot = JSON.stringify(fullSignalModel);
  const fullSignalInput =
    buildContractReviewFullRedactedAiInput(fullSignalModel);
  const legacySignalReference =
    buildContractReviewAiInput(fullSignalModel).findings[0];
  const fullSignal = fullSignalInput.ruleSignals[0];

  assertAiSafeInputCheck(
    fullSignal !== undefined,
    "expected full-redacted rule signal",
  );
  assertHasExactKeys(
    fullSignal,
    [
      "riskId",
      "riskLevel",
      "category",
      "clauseId",
      "ruleTitleZh",
      "riskSummaryZh",
      "whyItMattersZh",
      "legalBases",
    ],
    "expected full-redacted rule signal allowlist fields",
  );
  assertAiSafeInputCheck(
    fullSignal.riskId === fullSignalFinding.riskId &&
      fullSignal.riskLevel === fullSignalFinding.priority &&
      fullSignal.category === fullSignalFinding.category &&
      fullSignal.clauseId === fullSignalFinding.clauseId,
    "expected full-redacted rule signal to map canonical finding fields",
  );
  assertAiSafeInputCheck(
    fullSignal.ruleTitleZh === legacySignalReference?.ruleTitleZh &&
      fullSignal.whyItMattersZh === legacySignalReference?.whyItMattersZh,
    "expected full-redacted rule signal metadata to match canonical metadata",
  );
  assertAiSafeInputCheck(
    fullSignal.riskSummaryZh === legacySignalReference?.riskSummaryZh,
    "expected full-redacted rule signal summary to derive from rule reason",
  );
  assertAiSafeInputCheck(
    fullSignal.legalBases[0]?.legalBasisId ===
      "lease_stability_policy_clearance_context",
    "expected full-redacted rule signal legal basis mapping",
  );
  assertAiSafeInputCheck(
    JSON.stringify(fullSignalModel) === fullSignalModelSnapshot,
    "expected full-redacted builder not to mutate input model",
  );

  const fullOverflowLegalBases = Array.from(
    {
      length:
        CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
          .maxLegalBasesPerSignal + 2,
    },
    (_, index) =>
      createFixtureLegalBasisEntry(
        `full-redacted-legal-basis-${index + 1}`,
        "乙".repeat(
          CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
            .maxLegalBasisSummaryChars + 20,
        ),
      ),
  );

  const legalBasisSignalInput = buildContractReviewFullRedactedAiInput(
    buildContractReviewModel({
      clauses: [fullRedactedClauses[0]],
      findings: [
        createFinding({
          clauseId: "clause-1",
          clauseIndex: 0,
          legalBasisIds: fullOverflowLegalBases.map((entry) => entry.id),
          ruleReason: "甲".repeat(
            CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
              .maxRiskSummaryChars + 20,
          ),
        }),
      ],
      resolvedLegalBasisEntries: fullOverflowLegalBases,
    }),
  );

  const legalBasisSignal = legalBasisSignalInput.ruleSignals[0];

  assertAiSafeInputCheck(
    legalBasisSignal !== undefined,
    "expected legal basis limit signal",
  );
  assertAiSafeInputCheck(
    legalBasisSignal.legalBases.length ===
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS.maxLegalBasesPerSignal,
    "expected full-redacted legal basis per-signal limit",
  );
  assertAiSafeInputCheck(
    legalBasisSignal.legalBases.every(
      (entry) =>
        entry.legalBasisSummaryZh.length <=
        CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
          .maxLegalBasisSummaryChars,
    ),
    "expected full-redacted legal basis summary length limit",
  );
  assertAiSafeInputCheck(
    legalBasisSignal.riskSummaryZh.length <=
      CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS.maxRiskSummaryChars,
    "expected full-redacted risk summary length limit",
  );

  assertFullRedactedBuilderError(
    {
      clauses: [],
      findings: [],
      resolvedLegalBasisEntries: [],
    },
    "empty_contract",
  );

  assertFullRedactedBuilderError(
    {
      clauses: Array.from(
        {
          length:
            CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
              .maxRedactedClauseCount + 1,
        },
        (_, index): ContractClauseSegment => ({
          id: `clause-${index + 1}`,
          title: `条款 ${index + 1}`,
          text: "普通条款文本",
        }),
      ),
      findings: [],
      resolvedLegalBasisEntries: [],
    },
    "too_many_clauses",
  );

  assertFullRedactedBuilderError(
    {
      clauses: [
        {
          id: "clause-1",
          title: "条款 1",
          text: "甲".repeat(
            CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
              .maxRedactedClauseChars + 1,
          ),
        },
      ],
      findings: [],
      resolvedLegalBasisEntries: [],
    },
    "clause_too_long",
  );

  assertFullRedactedBuilderError(
    {
      clauses: Array.from(
        {
          length:
            Math.floor(
              CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
                .maxTotalRedactedChars /
                CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
                  .maxRedactedClauseChars,
            ) + 1,
        },
        (_, index): ContractClauseSegment => ({
          id: `clause-${index + 1}`,
          title: `条款 ${index + 1}`,
          text: "甲".repeat(
            CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS
              .maxRedactedClauseChars,
          ),
        }),
      ),
      findings: [],
      resolvedLegalBasisEntries: [],
    },
    "total_text_too_long",
  );

  assertFullRedactedBuilderError(
    {
      clauses: [fullRedactedClauses[0]],
      findings: Array.from(
        {
          length:
            CONTRACT_REVIEW_FULL_REDACTED_AI_INPUT_LIMITS.maxRuleSignals + 1,
        },
        () =>
          createFinding({
            clauseId: "clause-1",
            clauseIndex: 0,
            legalBasisIds: [],
          }),
      ),
      resolvedLegalBasisEntries: [],
    },
    "too_many_rule_signals",
  );

  assertFullRedactedBuilderError(
    {
      clauses: [
        {
          id: "custom-clause-1",
          title: "条款 1",
          text: "普通条款文本",
        },
      ],
      findings: [],
      resolvedLegalBasisEntries: [],
    },
    "invalid_clause_id",
  );

  assertFullRedactedBuilderError(
    {
      clauses: [fullRedactedClauses[0]],
      findings: [
        createFinding({
          clauseId: "clause-404",
          clauseIndex: 403,
          legalBasisIds: [],
        }),
      ],
      resolvedLegalBasisEntries: [],
    },
    "invalid_rule_signal",
  );
}

export const contractReviewAiSafeInputContractCheck = {
  builderReturnsAiSafeInput: true as _BuilderReturnsAiSafeInput,
  fullRedactedBuilderReturnsAiSafeInput:
    true as _FullRedactedBuilderReturnsAiSafeInput,
  redactorReturnsString: true as _RedactorReturnsString,
  fullRedactedRedactorReturnsString:
    true as _FullRedactedRedactorReturnsString,
  runner: runContractReviewAiSafeInputChecks,
} as const;
