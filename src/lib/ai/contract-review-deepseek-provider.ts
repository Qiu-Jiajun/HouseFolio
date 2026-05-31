import { buildContractReviewExplanationPrompt } from "@/lib/ai/contract-review-explanation-prompt";
import type {
  ContractReviewAiFindingInput,
  ContractReviewAiInput,
} from "@/lib/contract/ai-safe-input";
import type {
  ContractReviewExplanationOutput,
  ContractReviewFindingExplanation,
} from "@/types/ai-contract-review-explanation";

export type ContractReviewDeepSeekModel =
  | "deepseek-v4-flash"
  | "deepseek-v4-pro";

export type ContractReviewDeepSeekProviderErrorCode =
  | "missing_configuration"
  | "invalid_configuration"
  | "request_failed"
  | "request_timeout"
  | "rate_limited"
  | "invalid_response"
  | "unknown_failure";

export class ContractReviewDeepSeekProviderError extends Error {
  readonly code: ContractReviewDeepSeekProviderErrorCode;
  readonly safeMessage: string;

  constructor(
    code: ContractReviewDeepSeekProviderErrorCode,
    safeMessage: string,
  ) {
    super(safeMessage);
    this.name = "ContractReviewDeepSeekProviderError";
    this.code = code;
    this.safeMessage = safeMessage;
  }
}

export type ContractReviewDeepSeekProviderConfig = {
  readonly baseUrl?: string;
  readonly model?: ContractReviewDeepSeekModel;
  readonly secretKey?: string;
  readonly timeoutMs?: number;
  readonly fetcher?: typeof fetch;
  readonly maxTokens?: number;
};

export type ContractReviewDeepSeekProvider = {
  readonly name: "deepseek";
  generateContractReviewExplanation(
    input: ContractReviewAiInput,
  ): Promise<ContractReviewExplanationOutput>;
};

type DeepSeekChatCompletionResponse = {
  readonly choices?: readonly {
    readonly finish_reason?: string | null;
    readonly message?: {
      readonly content?: string | null;
      readonly reasoning_content?: string | null;
    };
  }[];
};

export const CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS = {
  maxSummaryZhChars: 800,
  maxDisclaimerZhChars: 600,
  maxTitleZhChars: 160,
  maxExplanationZhChars: 1000,
  maxLegalBasisNotes: 6,
  maxPreSigningQuestions: 8,
  maxSuggestedClauseDirections: 6,
  maxListItemChars: 320,
  maxNegotiationScriptZhChars: 800,
  maxResponseContentChars: 30000,
  maxConfiguredMaxTokens: 20000,
  maxTimeoutMs: 120000,
} as const;

export const DEFAULT_CONTRACT_REVIEW_DEEPSEEK_MODEL: ContractReviewDeepSeekModel =
  "deepseek-v4-flash";

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_MAX_TOKENS = 6000;

const allowedModels = new Set<ContractReviewDeepSeekModel>([
  "deepseek-v4-flash",
  "deepseek-v4-pro",
]);

const forbiddenOutputKeys = new Set([
  "reasoning_content",
  "reasoningContent",
  "rawResponse",
  "providerResponse",
  "prompt",
  "aiPrompt",
  "systemPrompt",
  "contractText",
  "fullContract",
  "clauseText",
  "redactedClauseExcerpt",
  "legalConclusion",
  "illegalityVerdict",
  "invalidityVerdict",
  "litigationAdvice",
  "winProbability",
  "shouldSign",
  "finalDecision",
  "recommendation",
  "apiKey",
  "secretKey",
]);

const topLevelOutputKeys = [
  "summaryZh",
  "findingExplanations",
  "disclaimerZh",
] as const;

const findingOutputKeys = [
  "riskId",
  "riskLevel",
  "titleZh",
  "explanationZh",
  "legalBasisNotesZh",
  "preSigningQuestionsZh",
  "suggestedClauseDirectionsZh",
  "negotiationScriptZh",
  "needsFurtherConfirmation",
] as const;

function invalidResponse(): never {
  throw new ContractReviewDeepSeekProviderError(
    "invalid_response",
    "本次 AI 响应未通过安全校验，请稍后重试。",
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

function hasForbiddenOutputKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenOutputKey(item));
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(
    ([key, childValue]) =>
      forbiddenOutputKeys.has(key) || hasForbiddenOutputKey(childValue),
  );
}

function parseRequiredString(value: unknown, maxChars: number): string {
  if (typeof value !== "string") {
    return invalidResponse();
  }

  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > maxChars) {
    return invalidResponse();
  }

  return trimmed;
}

function parseStringArray(
  value: unknown,
  maxItems: number,
): readonly string[] {
  if (!Array.isArray(value) || value.length > maxItems) {
    return invalidResponse();
  }

  return value.map((item) =>
    parseRequiredString(
      item,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxListItemChars,
    ),
  );
}

function parseFindingExplanation(
  value: unknown,
  inputFinding: ContractReviewAiFindingInput,
): ContractReviewFindingExplanation {
  if (!isRecord(value) || !hasExactKeys(value, findingOutputKeys)) {
    return invalidResponse();
  }

  if (
    value.riskId !== inputFinding.riskId ||
    value.riskLevel !== inputFinding.riskLevel
  ) {
    return invalidResponse();
  }

  if (typeof value.needsFurtherConfirmation !== "boolean") {
    return invalidResponse();
  }

  return {
    riskId: inputFinding.riskId,
    riskLevel: inputFinding.riskLevel,
    titleZh: parseRequiredString(
      value.titleZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxTitleZhChars,
    ),
    explanationZh: parseRequiredString(
      value.explanationZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxExplanationZhChars,
    ),
    legalBasisNotesZh: parseStringArray(
      value.legalBasisNotesZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxLegalBasisNotes,
    ),
    preSigningQuestionsZh: parseStringArray(
      value.preSigningQuestionsZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxPreSigningQuestions,
    ),
    suggestedClauseDirectionsZh: parseStringArray(
      value.suggestedClauseDirectionsZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxSuggestedClauseDirections,
    ),
    negotiationScriptZh: parseRequiredString(
      value.negotiationScriptZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxNegotiationScriptZhChars,
    ),
    needsFurtherConfirmation: value.needsFurtherConfirmation,
  };
}

export function parseContractReviewExplanationOutput(
  content: string,
  input: ContractReviewAiInput,
): ContractReviewExplanationOutput {
  if (
    content.trim().length === 0 ||
    content.length >
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxResponseContentChars
  ) {
    return invalidResponse();
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    return invalidResponse();
  }

  if (
    !isRecord(parsed) ||
    hasForbiddenOutputKey(parsed) ||
    !hasExactKeys(parsed, topLevelOutputKeys) ||
    !Array.isArray(parsed.findingExplanations) ||
    parsed.findingExplanations.length !== input.findings.length
  ) {
    return invalidResponse();
  }

  return {
    summaryZh: parseRequiredString(
      parsed.summaryZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxSummaryZhChars,
    ),
    findingExplanations: parsed.findingExplanations.map((finding, index) =>
      parseFindingExplanation(finding, input.findings[index]),
    ),
    disclaimerZh: parseRequiredString(
      parsed.disclaimerZh,
      CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxDisclaimerZhChars,
    ),
  };
}

function getDeepSeekSecretKey(
  config: ContractReviewDeepSeekProviderConfig,
): string {
  const secretKey = (config.secretKey || process.env.DEEPSEEK_API_KEY || "").trim();

  if (!secretKey) {
    throw new ContractReviewDeepSeekProviderError(
      "missing_configuration",
      "当前 AI 服务配置暂不可用。",
    );
  }

  return secretKey;
}

function isAllowedModel(value: string): value is ContractReviewDeepSeekModel {
  return allowedModels.has(value as ContractReviewDeepSeekModel);
}

function getDeepSeekModel(
  config: ContractReviewDeepSeekProviderConfig,
): ContractReviewDeepSeekModel {
  const configuredModel =
    config.model ||
    process.env.CONTRACT_REVIEW_AI_MODEL ||
    DEFAULT_CONTRACT_REVIEW_DEEPSEEK_MODEL;

  if (!isAllowedModel(configuredModel)) {
    throw new ContractReviewDeepSeekProviderError(
      "invalid_configuration",
      "当前 AI 模型配置暂不可用。",
    );
  }

  return configuredModel;
}

function getPositiveInteger(
  value: number | undefined,
  fallback: number,
  maxValue: number,
): number {
  if (value === undefined) {
    return fallback;
  }

  if (!Number.isInteger(value) || value <= 0 || value > maxValue) {
    throw new ContractReviewDeepSeekProviderError(
      "invalid_configuration",
      "当前 AI 服务配置暂不可用。",
    );
  }

  return value;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === "AbortError"
  );
}

async function parseDeepSeekTransportResponse(
  response: Response,
  input: ContractReviewAiInput,
): Promise<ContractReviewExplanationOutput> {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    return invalidResponse();
  }

  if (!isRecord(data) || !Array.isArray(data.choices) || data.choices.length !== 1) {
    return invalidResponse();
  }

  const choice = data.choices[0];

  if (!isRecord(choice) || choice.finish_reason !== "stop") {
    return invalidResponse();
  }

  const message = choice.message;

  if (!isRecord(message) || typeof message.content !== "string") {
    return invalidResponse();
  }

  return parseContractReviewExplanationOutput(message.content, input);
}

async function callDeepSeekChatCompletion(
  input: ContractReviewAiInput,
  config: ContractReviewDeepSeekProviderConfig,
): Promise<ContractReviewExplanationOutput> {
  const secretKey = getDeepSeekSecretKey(config);
  const model = getDeepSeekModel(config);
  const baseUrl = normalizeBaseUrl(config.baseUrl || DEFAULT_DEEPSEEK_BASE_URL);
  const timeoutMs = getPositiveInteger(
    config.timeoutMs,
    DEFAULT_TIMEOUT_MS,
    CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxTimeoutMs,
  );
  const maxTokens = getPositiveInteger(
    config.maxTokens,
    DEFAULT_MAX_TOKENS,
    CONTRACT_REVIEW_DEEPSEEK_PROVIDER_LIMITS.maxConfiguredMaxTokens,
  );
  const fetcher = config.fetcher || fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const prompt = buildContractReviewExplanationPrompt(input);

    const response = await fetcher(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model,
        messages: prompt.messages,
        response_format: {
          type: "json_object",
        },
        thinking: {
          type: "enabled",
        },
        reasoning_effort: "high",
        stream: false,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new ContractReviewDeepSeekProviderError(
        "rate_limited",
        "请求过于频繁，请稍后再试。",
      );
    }

    if (!response.ok) {
      throw new ContractReviewDeepSeekProviderError(
        "request_failed",
        "AI 服务暂时不可用，请稍后重试。",
      );
    }

    return await parseDeepSeekTransportResponse(response, input);
  } catch (error) {
    if (error instanceof ContractReviewDeepSeekProviderError) {
      throw error;
    }

    if (isAbortError(error)) {
      throw new ContractReviewDeepSeekProviderError(
        "request_timeout",
        "当前网络不稳定，请稍后重试。",
      );
    }

    throw new ContractReviewDeepSeekProviderError(
      "unknown_failure",
      "AI 服务暂时不可用，请稍后重试。",
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function createContractReviewDeepSeekProvider(
  config: ContractReviewDeepSeekProviderConfig = {},
): ContractReviewDeepSeekProvider {
  return {
    name: "deepseek",

    generateContractReviewExplanation(input: ContractReviewAiInput) {
      return callDeepSeekChatCompletion(input, config);
    },
  };
}

export const contractReviewDeepSeekProvider =
  createContractReviewDeepSeekProvider();
