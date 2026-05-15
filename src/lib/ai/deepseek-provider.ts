import { buildCompareExplanationPrompt } from "@/lib/ai/compare-explanation-prompt";
import type { CompareExplanationProvider } from "@/lib/ai/provider";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

export type DeepSeekChatModel = "deepseek-v4-flash" | "deepseek-v4-pro";

export type DeepSeekProviderErrorCode =
  | "missing_configuration"
  | "request_failed"
  | "request_timeout"
  | "rate_limited"
  | "invalid_response"
  | "unknown_failure";

export class DeepSeekProviderError extends Error {
  code: DeepSeekProviderErrorCode;
  safeMessage: string;

  constructor(code: DeepSeekProviderErrorCode, safeMessage: string) {
    super(safeMessage);
    this.name = "DeepSeekProviderError";
    this.code = code;
    this.safeMessage = safeMessage;
  }
}

export type DeepSeekCompareExplanationProviderConfig = {
  baseUrl?: string;
  model?: DeepSeekChatModel;
  secretKey?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

export type DeepSeekCompareExplanationProvider = CompareExplanationProvider & {
  name: "deepseek";
};

type DeepSeekChatMessage = {
  role: "system" | "user";
  content: string;
};

type DeepSeekChatCompletionChoice = {
  message?: {
    content?: string | null;
  };
};

type DeepSeekChatCompletionResponse = {
  choices?: DeepSeekChatCompletionChoice[];
};

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL: DeepSeekChatModel = "deepseek-v4-flash";
const DEFAULT_TIMEOUT_MS = 15000;

function getDeepSeekSecretKey(config: DeepSeekCompareExplanationProviderConfig) {
  return config.secretKey || process.env.DEEPSEEK_API_KEY;
}

function buildJsonOutputInstruction(): string {
  return [
    "请只返回一个 JSON object，不要输出 Markdown，不要输出代码块。",
    "JSON object 必须包含以下字段：",
    "- summary: string",
    "- tradeoffs: string[]",
    "- commuteNotes: string[]",
    "- riskExplanations: string[]",
    "- missingFieldNotes: string[]",
    "- checklist: string[]",
    "- disclaimer: string",
    "所有字段必须存在。数组字段如果没有内容，请返回空数组。",
  ].join("\n");
}

function buildDeepSeekMessages(input: CompareExplanationInput): DeepSeekChatMessage[] {
  const prompt = buildCompareExplanationPrompt(input);

  return [
    ...prompt.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    {
      role: "user",
      content: buildJsonOutputInstruction(),
    },
  ];
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseCompareExplanationOutput(content: string): CompareExplanationOutput {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new DeepSeekProviderError(
      "invalid_response",
      "本次 AI 响应格式异常，请稍后重试。",
    );
  }

  if (!parsed || typeof parsed !== "object") {
    throw new DeepSeekProviderError(
      "invalid_response",
      "本次 AI 响应格式异常，请稍后重试。",
    );
  }

  const record = parsed as Record<string, unknown>;

  return {
    summary: normalizeString(record.summary),
    tradeoffs: normalizeStringArray(record.tradeoffs),
    commuteNotes: normalizeStringArray(record.commuteNotes),
    riskExplanations: normalizeStringArray(record.riskExplanations),
    missingFieldNotes: normalizeStringArray(record.missingFieldNotes),
    checklist: normalizeStringArray(record.checklist),
    disclaimer: normalizeString(record.disclaimer),
  };
}

async function callDeepSeekChatCompletion(
  input: CompareExplanationInput,
  config: DeepSeekCompareExplanationProviderConfig,
): Promise<CompareExplanationOutput> {
  const secretKey = getDeepSeekSecretKey(config);

  if (!secretKey) {
    throw new DeepSeekProviderError(
      "missing_configuration",
      "当前 AI 服务配置暂不可用。",
    );
  }

  const baseUrl = config.baseUrl || DEFAULT_DEEPSEEK_BASE_URL;
  const model = config.model || DEFAULT_DEEPSEEK_MODEL;
  const timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS;
  const fetcher = config.fetcher || fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model,
        messages: buildDeepSeekMessages(input),
        response_format: {
          type: "json_object",
        },
        thinking: {
          type: "disabled",
        },
        stream: false,
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new DeepSeekProviderError(
        "rate_limited",
        "请求过于频繁，请稍后再试。",
      );
    }

    if (!response.ok) {
      throw new DeepSeekProviderError(
        "request_failed",
        "AI 服务暂时不可用，请稍后重试。",
      );
    }

    const data = (await response.json()) as DeepSeekChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new DeepSeekProviderError(
        "invalid_response",
        "本次 AI 响应格式异常，请稍后重试。",
      );
    }

    return parseCompareExplanationOutput(content);
  } catch (error) {
    if (error instanceof DeepSeekProviderError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new DeepSeekProviderError(
        "request_timeout",
        "当前网络不稳定，请稍后重试。",
      );
    }

    throw new DeepSeekProviderError(
      "unknown_failure",
      "AI 服务暂时不可用，请稍后重试。",
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function createDeepSeekCompareExplanationProvider(
  config: DeepSeekCompareExplanationProviderConfig = {},
): DeepSeekCompareExplanationProvider {
  return {
    name: "deepseek",

    generateCompareExplanation(input: CompareExplanationInput) {
      return callDeepSeekChatCompletion(input, config);
    },
  };
}

export const deepSeekCompareExplanationProvider =
  createDeepSeekCompareExplanationProvider();