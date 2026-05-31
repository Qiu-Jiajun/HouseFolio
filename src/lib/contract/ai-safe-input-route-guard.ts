import {
  CONTRACT_REVIEW_AI_INPUT_LIMITS,
  CONTRACT_REVIEW_AI_INPUT_VERSION,
  contractReviewAiRiskMetadata,
  redactContractClauseExcerpt,
  type ContractReviewAiFindingInput,
  type ContractReviewAiInput,
  type ContractReviewAiLegalBasisInput,
} from "@/lib/contract/ai-safe-input";
import {
  contractLegalBasisEntries,
  type LegalBasisEntry,
} from "@/lib/contract/legal-basis";
import { contractRiskRules } from "@/lib/contract/risk-rules";
import type {
  ContractRiskId,
  ContractRiskRule,
} from "@/lib/contract/types";

export type ContractReviewAiInputRouteGuardErrorCode =
  | "invalid_request";

export class ContractReviewAiInputRouteGuardError extends Error {
  readonly code: ContractReviewAiInputRouteGuardErrorCode;
  readonly safeMessage: string;

  constructor(
    code: ContractReviewAiInputRouteGuardErrorCode,
    safeMessage: string,
  ) {
    super(safeMessage);
    this.name = "ContractReviewAiInputRouteGuardError";
    this.code = code;
    this.safeMessage = safeMessage;
  }
}

export const CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS = {
  maxClauseIdChars: 160,
  maxClauseOrder: 100_000,
  maxRuleTitleZhChars: 160,
  maxLegalBasisIdChars: 160,
  maxLegalBasisTitleZhChars: 240,
} as const;

const topLevelKeys = [
  "payloadVersion",
  "locale",
  "disclaimerMode",
  "findingCount",
  "findings",
] as const;

const findingKeys = [
  "riskId",
  "riskLevel",
  "category",
  "ruleTitleZh",
  "clause",
  "riskSummaryZh",
  "whyItMattersZh",
  "legalBases",
] as const;

const clauseKeys = [
  "clauseId",
  "clauseOrder",
  "redactedClauseExcerpt",
] as const;

const legalBasisKeys = [
  "legalBasisId",
  "legalBasisTitleZh",
  "legalBasisSummaryZh",
  "legalBasisSourceType",
] as const;

const forbiddenRequestKeys = new Set(
  [
    "rawText",
    "contractText",
    "fullContract",
    "clauseText",
    "unredactedClauseText",
    "prompt",
    "aiPrompt",
    "systemPrompt",
    "reasoning_content",
    "reasoningContent",
    "rawResponse",
    "providerResponse",
    "requestBody",
    "responseBody",
    "apiKey",
    "secretKey",
    "authorization",
    "model",
    "provider",
    "baseUrl",
    "timeoutMs",
    "maxTokens",
    "thinking",
    "reasoning_effort",
    "stream",
    "tools",
    "tool_choice",
    "legalConclusion",
    "illegalityVerdict",
    "invalidityVerdict",
    "litigationAdvice",
    "winProbability",
    "shouldSign",
    "finalDecision",
    "recommendation",
  ].map((key) => key.toLowerCase()),
);

const promptBoundaryPattern =
  /<\/?contract_review_ai_safe_input>/gi;

const controlCharacterPattern =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const riskRuleById = new Map<string, ContractRiskRule>(
  contractRiskRules.map((rule) => [rule.id, rule] as const),
);

const legalBasisById = new Map<string, LegalBasisEntry>(
  contractLegalBasisEntries.map((entry) => [entry.id, entry] as const),
);

function invalidRequest(): never {
  throw new ContractReviewAiInputRouteGuardError(
    "invalid_request",
    "请求内容未通过安全校验，请返回检查后重试。",
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  const actualKeys = Object.keys(value);

  return (
    actualKeys.length === expectedKeys.length &&
    actualKeys.every((key) => expectedKeys.includes(key))
  );
}

function hasForbiddenRequestKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenRequestKey(item));
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(
    ([key, childValue]) =>
      forbiddenRequestKeys.has(key.toLowerCase()) ||
      hasForbiddenRequestKey(childValue),
  );
}

function parseRequiredString(
  value: unknown,
  maxChars: number,
): string {
  if (typeof value !== "string") {
    return invalidRequest();
  }

  const trimmed = value.trim();

  if (
    trimmed.length === 0 ||
    trimmed.length > maxChars ||
    controlCharacterPattern.test(trimmed)
  ) {
    return invalidRequest();
  }

  return trimmed;
}

function parsePossiblyEmptyString(
  value: unknown,
  maxChars: number,
): string {
  if (typeof value !== "string") {
    return invalidRequest();
  }

  const trimmed = value.trim();

  if (
    trimmed.length > maxChars ||
    controlCharacterPattern.test(trimmed)
  ) {
    return invalidRequest();
  }

  return trimmed;
}

function parseBoundedPromptText(
  value: unknown,
  maxChars: number,
): string {
  const parsed = parseRequiredString(value, maxChars);

  if (promptBoundaryPattern.test(parsed)) {
    promptBoundaryPattern.lastIndex = 0;
    return invalidRequest();
  }

  promptBoundaryPattern.lastIndex = 0;
  return parsed;
}

function parsePositiveInteger(
  value: unknown,
  maxValue: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0 ||
    value > maxValue
  ) {
    return invalidRequest();
  }

  return value;
}

function truncateText(
  value: string,
  maxChars: number,
): string {
  const normalized = value.trim();

  if (maxChars <= 0) {
    return "";
  }

  if (normalized.length <= maxChars) {
    return normalized;
  }

  if (maxChars === 1) {
    return "…";
  }

  return `${normalized.slice(0, maxChars - 1).trimEnd()}…`;
}

function sanitizeClauseExcerpt(value: unknown): string {
  const parsed = parsePossiblyEmptyString(
    value,
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxExcerptChars,
  );

  return redactContractClauseExcerpt(parsed).replace(
    promptBoundaryPattern,
    "[输入分隔符已转义]",
  );
}

function parseRiskId(value: unknown): ContractRiskId {
  if (
    typeof value !== "string" ||
    !riskRuleById.has(value)
  ) {
    return invalidRequest();
  }

  return value as ContractRiskId;
}

function parseLegalBasisInput(
  value: unknown,
  rule: ContractRiskRule,
  seenLegalBasisIds: Set<string>,
): ContractReviewAiLegalBasisInput {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, legalBasisKeys)
  ) {
    return invalidRequest();
  }

  const legalBasisId = parseRequiredString(
    value.legalBasisId,
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS.maxLegalBasisIdChars,
  );

  if (
    seenLegalBasisIds.has(legalBasisId) ||
    !rule.legalBasisIds.includes(legalBasisId)
  ) {
    return invalidRequest();
  }

  const canonicalEntry = legalBasisById.get(legalBasisId);

  if (!canonicalEntry) {
    return invalidRequest();
  }

  const legalBasisTitleZh = parseRequiredString(
    value.legalBasisTitleZh,
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS.maxLegalBasisTitleZhChars,
  );

  const legalBasisSummaryZh = parseRequiredString(
    value.legalBasisSummaryZh,
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars,
  );

  if (
    legalBasisTitleZh !== canonicalEntry.title ||
    legalBasisSummaryZh !==
      truncateText(
        canonicalEntry.shortSummary,
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars,
      ) ||
    value.legalBasisSourceType !== canonicalEntry.sourceLevel
  ) {
    return invalidRequest();
  }

  seenLegalBasisIds.add(legalBasisId);

  return {
    legalBasisId: canonicalEntry.id,
    legalBasisTitleZh: canonicalEntry.title,
    legalBasisSummaryZh: truncateText(
      canonicalEntry.shortSummary,
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars,
    ),
    legalBasisSourceType: canonicalEntry.sourceLevel,
  };
}

function getExpectedLegalBasisIds(
  rule: ContractRiskRule,
): readonly string[] {
  const seenLegalBasisIds = new Set<string>();
  const legalBasisIds: string[] = [];

  for (const legalBasisId of rule.legalBasisIds) {
    if (
      legalBasisIds.length >=
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasesPerFinding
    ) {
      break;
    }

    if (
      seenLegalBasisIds.has(legalBasisId) ||
      !legalBasisById.has(legalBasisId)
    ) {
      continue;
    }

    seenLegalBasisIds.add(legalBasisId);
    legalBasisIds.push(legalBasisId);
  }

  return legalBasisIds;
}

function parseLegalBases(
  value: unknown,
  rule: ContractRiskRule,
): readonly ContractReviewAiLegalBasisInput[] {
  if (
    !Array.isArray(value) ||
    value.length >
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasesPerFinding
  ) {
    return invalidRequest();
  }

  const expectedLegalBasisIds =
    getExpectedLegalBasisIds(rule);

  if (value.length !== expectedLegalBasisIds.length) {
    return invalidRequest();
  }

  const seenLegalBasisIds = new Set<string>();

  const legalBases = value.map((item) =>
    parseLegalBasisInput(item, rule, seenLegalBasisIds),
  );

  if (
    legalBases.some(
      (legalBasis, index) =>
        legalBasis.legalBasisId !==
        expectedLegalBasisIds[index],
    )
  ) {
    return invalidRequest();
  }

  return legalBases;
}

function parseFinding(
  value: unknown,
  excerptCounter: { value: number },
): ContractReviewAiFindingInput {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, findingKeys)
  ) {
    return invalidRequest();
  }

  const riskId = parseRiskId(value.riskId);
  const rule = riskRuleById.get(riskId);

  if (!rule) {
    return invalidRequest();
  }

  if (
    value.riskLevel !== rule.priority ||
    value.category !== rule.category
  ) {
    return invalidRequest();
  }

  const ruleTitleZh = parseBoundedPromptText(
    value.ruleTitleZh,
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS.maxRuleTitleZhChars,
  );

  const riskSummaryZh = parseBoundedPromptText(
    value.riskSummaryZh,
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars,
  );

  if (
    riskSummaryZh !==
    truncateText(
      rule.ruleReason,
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars,
    )
  ) {
    return invalidRequest();
  }

  const whyItMattersZh = parseBoundedPromptText(
    value.whyItMattersZh,
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxWhyItMattersChars,
  );

  const metadata = contractReviewAiRiskMetadata[riskId];
  const canonicalWhyItMattersZh = truncateText(
    metadata.whyItMattersZh,
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxWhyItMattersChars,
  );

  if (
    ruleTitleZh !== metadata.ruleTitleZh ||
    whyItMattersZh !== canonicalWhyItMattersZh
  ) {
    return invalidRequest();
  }

  if (
    !isRecord(value.clause) ||
    !hasExactKeys(value.clause, clauseKeys)
  ) {
    return invalidRequest();
  }

  const clauseId = parseRequiredString(
    value.clause.clauseId,
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS.maxClauseIdChars,
  );

  const clauseOrder = parsePositiveInteger(
    value.clause.clauseOrder,
    CONTRACT_REVIEW_AI_INPUT_ROUTE_GUARD_LIMITS.maxClauseOrder,
  );

  if (
    !/^clause-[1-9]\d*$/.test(clauseId) ||
    clauseId !== `clause-${clauseOrder}`
  ) {
    return invalidRequest();
  }

  const redactedClauseExcerpt = sanitizeClauseExcerpt(
    value.clause.redactedClauseExcerpt,
  );

  excerptCounter.value += redactedClauseExcerpt.length;

  if (
    excerptCounter.value >
    CONTRACT_REVIEW_AI_INPUT_LIMITS.maxTotalExcerptChars
  ) {
    return invalidRequest();
  }

  return {
    riskId,
    riskLevel: rule.priority,
    category: rule.category,
    ruleTitleZh: metadata.ruleTitleZh,
    clause: {
      clauseId,
      clauseOrder,
      redactedClauseExcerpt,
    },
    riskSummaryZh: truncateText(
      rule.ruleReason,
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars,
    ),
    whyItMattersZh: canonicalWhyItMattersZh,
    legalBases: parseLegalBases(value.legalBases, rule),
  };
}

export function parseAndSanitizeContractReviewAiInput(
  value: unknown,
): ContractReviewAiInput {
  if (
    !isRecord(value) ||
    hasForbiddenRequestKey(value) ||
    !hasExactKeys(value, topLevelKeys) ||
    value.payloadVersion !== CONTRACT_REVIEW_AI_INPUT_VERSION ||
    value.locale !== "zh-CN" ||
    value.disclaimerMode !== "contract-risk-prompt-only" ||
    typeof value.findingCount !== "number" ||
    !Number.isInteger(value.findingCount) ||
    value.findingCount <= 0 ||
    value.findingCount >
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxFindings ||
    !Array.isArray(value.findings) ||
    value.findings.length !== value.findingCount
  ) {
    return invalidRequest();
  }

  const excerptCounter = { value: 0 };

  const findings = value.findings.map((finding) =>
    parseFinding(finding, excerptCounter),
  );

  return {
    payloadVersion: CONTRACT_REVIEW_AI_INPUT_VERSION,
    locale: "zh-CN",
    disclaimerMode: "contract-risk-prompt-only",
    findingCount: findings.length,
    findings,
  };
}