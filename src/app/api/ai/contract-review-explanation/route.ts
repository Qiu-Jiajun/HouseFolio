import { NextResponse } from "next/server";
import {
  ContractReviewDeepSeekProviderError,
  contractReviewDeepSeekProvider,
} from "@/lib/ai/contract-review-deepseek-provider";
import {
  ContractReviewAiInputRouteGuardError,
  parseAndSanitizeContractReviewAiInput,
} from "@/lib/contract/ai-safe-input-route-guard";
import type { ContractReviewExplanationOutput } from "@/types/ai-contract-review-explanation";

const MAX_REQUEST_BODY_CHARS = 100_000;

type ContractReviewExplanationApiErrorCode =
  | "unsupported_media_type"
  | "request_too_large"
  | "invalid_request"
  | "missing_configuration"
  | "invalid_configuration"
  | "rate_limited"
  | "request_timeout"
  | "request_failed"
  | "invalid_response"
  | "unknown_failure";

type ContractReviewExplanationApiErrorResponse = {
  readonly error: string;
  readonly code: ContractReviewExplanationApiErrorCode;
};

class ContractReviewApiRequestError extends Error {
  readonly code: ContractReviewExplanationApiErrorCode;
  readonly status: number;
  readonly safeMessage: string;

  constructor(
    code: ContractReviewExplanationApiErrorCode,
    status: number,
    safeMessage: string,
  ) {
    super(safeMessage);
    this.name = "ContractReviewApiRequestError";
    this.code = code;
    this.status = status;
    this.safeMessage = safeMessage;
  }
}

function jsonNoStore<T>(
  body: T,
  status = 200,
): NextResponse<T> {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function jsonError(
  code: ContractReviewExplanationApiErrorCode,
  error: string,
  status: number,
): NextResponse<ContractReviewExplanationApiErrorResponse> {
  return jsonNoStore(
    {
      error,
      code,
    },
    status,
  );
}

function getMediaType(request: Request): string {
  return (
    request.headers
      .get("content-type")
      ?.split(";")[0]
      ?.trim()
      .toLowerCase() ?? ""
  );
}

function getContentLength(request: Request): number | undefined {
  const headerValue = request.headers.get("content-length");

  if (headerValue === null) {
    return undefined;
  }

  const parsed = Number(headerValue);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0
  ) {
    return undefined;
  }

  return parsed;
}

async function readJsonBody(request: Request): Promise<unknown> {
  if (getMediaType(request) !== "application/json") {
    throw new ContractReviewApiRequestError(
      "unsupported_media_type",
      415,
      "请求格式不受支持，请返回检查后重试。",
    );
  }

  const contentLength = getContentLength(request);

  if (
    contentLength !== undefined &&
    contentLength > MAX_REQUEST_BODY_CHARS
  ) {
    throw new ContractReviewApiRequestError(
      "request_too_large",
      413,
      "请求内容过长，请减少内容后重试。",
    );
  }

  let text: string;

  try {
    text = await request.text();
  } catch {
    throw new ContractReviewApiRequestError(
      "invalid_request",
      400,
      "请求内容未通过安全校验，请返回检查后重试。",
    );
  }

  if (
    text.trim().length === 0 ||
    text.length > MAX_REQUEST_BODY_CHARS
  ) {
    throw new ContractReviewApiRequestError(
      text.length > MAX_REQUEST_BODY_CHARS
        ? "request_too_large"
        : "invalid_request",
      text.length > MAX_REQUEST_BODY_CHARS
        ? 413
        : 400,
      text.length > MAX_REQUEST_BODY_CHARS
        ? "请求内容过长，请减少内容后重试。"
        : "请求内容未通过安全校验，请返回检查后重试。",
    );
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ContractReviewApiRequestError(
      "invalid_request",
      400,
      "请求内容未通过安全校验，请返回检查后重试。",
    );
  }
}

function mapRouteError(
  error: unknown,
): NextResponse<ContractReviewExplanationApiErrorResponse> {
  if (error instanceof ContractReviewApiRequestError) {
    return jsonError(
      error.code,
      error.safeMessage,
      error.status,
    );
  }

  if (error instanceof ContractReviewAiInputRouteGuardError) {
    return jsonError(
      "invalid_request",
      error.safeMessage,
      400,
    );
  }

  if (error instanceof ContractReviewDeepSeekProviderError) {
    switch (error.code) {
      case "missing_configuration":
        return jsonError(
          "missing_configuration",
          error.safeMessage,
          503,
        );

      case "invalid_configuration":
        return jsonError(
          "invalid_configuration",
          error.safeMessage,
          503,
        );

      case "rate_limited":
        return jsonError(
          "rate_limited",
          error.safeMessage,
          429,
        );

      case "request_timeout":
        return jsonError(
          "request_timeout",
          error.safeMessage,
          504,
        );

      case "request_failed":
        return jsonError(
          "request_failed",
          error.safeMessage,
          502,
        );

      case "invalid_response":
        return jsonError(
          "invalid_response",
          error.safeMessage,
          502,
        );

      case "unknown_failure":
        return jsonError(
          "unknown_failure",
          error.safeMessage,
          500,
        );
    }
  }

  return jsonError(
    "unknown_failure",
    "AI 服务暂时不可用，请稍后重试。",
    500,
  );
}

export async function POST(
  request: Request,
): Promise<
  NextResponse<
    | ContractReviewExplanationOutput
    | ContractReviewExplanationApiErrorResponse
  >
> {
  try {
    const body = await readJsonBody(request);
    const input =
      parseAndSanitizeContractReviewAiInput(body);

    const output =
      await contractReviewDeepSeekProvider
        .generateContractReviewExplanation(input);

    return jsonNoStore(output);
  } catch (error) {
    return mapRouteError(error);
  }
}