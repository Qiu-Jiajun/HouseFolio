"use client";

import { useMemo, useState } from "react";

import { ContractReviewAiConfirmationPanel } from "@/components/contract-review-ai-confirmation-panel";
import { ContractReviewAiExplanationPanel } from "@/components/contract-review-ai-explanation-panel";
import { contractReviewCopy } from "@/content/zh-cn";
import {
  buildContractReviewFullRedactedAiInput,
  type ContractReviewFullRedactedAiInput,
} from "@/lib/contract/ai-safe-input";
import { segmentContractClauses } from "@/lib/contract/clause-segmentation";
import {
  resolveLegalBasisForFinding,
  resolveLegalBasisForFindings,
} from "@/lib/contract/legal-basis-resolver";
import { buildContractReviewModel } from "@/lib/contract/review-model";
import { matchContractRisks } from "@/lib/contract/risk-matcher";
import {
  CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION,
  type ContractReviewFullRedactedExplanationOutput,
} from "@/types/ai-contract-review-explanation";

type AiStatus = "idle" | "preview-ready" | "submitting" | "success" | "safe-error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRiskLevel(value: unknown) {
  return ["high", "medium", "low"].includes(String(value));
}

function isContractReviewFullRedactedExplanationOutput(
  value: unknown,
): value is ContractReviewFullRedactedExplanationOutput {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.outputVersion !==
      CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION ||
    typeof value.summaryZh !== "string" ||
    typeof value.disclaimerZh !== "string" ||
    !Array.isArray(value.ruleSignalExplanations) ||
    !Array.isArray(value.supplementalAttentionItems)
  ) {
    return false;
  }

  const validRuleSignalExplanations =
    value.ruleSignalExplanations.every((finding) => {
      if (!isRecord(finding)) {
        return false;
      }

      return (
        typeof finding.riskId === "string" &&
        typeof finding.clauseId === "string" &&
        isRiskLevel(finding.riskLevel) &&
        typeof finding.titleZh === "string" &&
        typeof finding.explanationZh === "string" &&
        isStringArray(finding.legalBasisNotesZh) &&
        isStringArray(finding.preSigningQuestionsZh) &&
        isStringArray(finding.suggestedClauseDirectionsZh) &&
        typeof finding.negotiationScriptZh === "string" &&
        typeof finding.needsFurtherConfirmation === "boolean"
      );
    });

  if (!validRuleSignalExplanations) {
    return false;
  }

  return value.supplementalAttentionItems.every((attention) => {
    if (!isRecord(attention)) {
      return false;
    }

    return (
      [
        "建议重点核对",
        "信息不足",
        "存在歧义",
        "建议补充约定",
      ].includes(String(attention.attentionType)) &&
      isStringArray(attention.relatedClauseIds) &&
      typeof attention.titleZh === "string" &&
      typeof attention.explanationZh === "string" &&
      isStringArray(attention.preSigningQuestionsZh) &&
      isStringArray(attention.suggestedClauseDirectionsZh) &&
      typeof attention.negotiationScriptZh === "string" &&
      attention.needsFurtherConfirmation === true
    );
  });
}

async function readSafeRouteError(response: Response) {
  try {
    const body: unknown = await response.json();

    if (isRecord(body) && typeof body.error === "string") {
      return body.error;
    }
  } catch {
    return contractReviewCopy.aiStates.safeErrorFallback;
  }

  return contractReviewCopy.aiStates.safeErrorFallback;
}

export function ContractReviewPanel() {
  const [contractText, setContractText] = useState("");
  const [aiPreviewInput, setAiPreviewInput] =
    useState<ContractReviewFullRedactedAiInput | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiOutput, setAiOutput] =
    useState<ContractReviewFullRedactedExplanationOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiConfirmationVisible, setAiConfirmationVisible] = useState(false);

  const segments = useMemo(
    () => segmentContractClauses(contractText),
    [contractText],
  );

  const findings = useMemo(() => matchContractRisks(segments), [segments]);

  const resolvedLegalBasisEntries = useMemo(
    () => resolveLegalBasisForFindings(findings),
    [findings],
  );

  const reviewModel = useMemo(
    () =>
      buildContractReviewModel({
        clauses: segments,
        findings,
        resolvedLegalBasisEntries,
      }),
    [findings, resolvedLegalBasisEntries, segments],
  );

  const localRiskRows = useMemo(
    () =>
      findings.map((finding) => ({
        finding,
        legalBases: resolveLegalBasisForFinding(finding),
      })),
    [findings],
  );

  const hasText = contractText.trim().length > 0;
  const hasFindings = findings.length > 0;
  const isSubmitting = aiStatus === "submitting";
  const riskLevelLabels = contractReviewCopy.localRisk.riskLevelLabels;

  function clearAiSessionState() {
    setAiPreviewInput(null);
    setAiOutput(null);
    setAiError(null);
    setAiConfirmationVisible(false);
    setAiStatus("idle");
  }

  function handleContractTextChange(value: string) {
    setContractText(value);
    clearAiSessionState();
  }

  function handleClearContractText() {
    setContractText("");
    clearAiSessionState();
  }

  function handlePreviewAiInput() {
    if (!hasText || isSubmitting) {
      return;
    }

    try {
      const nextPreviewInput =
        buildContractReviewFullRedactedAiInput(reviewModel);

      setAiPreviewInput(nextPreviewInput);
      setAiOutput(null);
      setAiError(null);
      setAiConfirmationVisible(true);
      setAiStatus("preview-ready");
    } catch {
      setAiPreviewInput(null);
      setAiOutput(null);
      setAiError(contractReviewCopy.aiStates.previewBuildError);
      setAiConfirmationVisible(false);
      setAiStatus("safe-error");
    }
  }

  function handleCancelAiPreview() {
    setAiPreviewInput(null);
    setAiError(null);
    setAiConfirmationVisible(false);
    setAiStatus("idle");
  }

  function handleClearAiOutput() {
    clearAiSessionState();
  }

  async function handleConfirmAiGeneration() {
    if (!aiPreviewInput || isSubmitting) {
      return;
    }

    setAiStatus("submitting");
    setAiError(null);

    try {
      const response = await fetch("/api/ai/contract-review-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(aiPreviewInput),
      });

      if (!response.ok) {
        setAiError(await readSafeRouteError(response));
        setAiStatus("safe-error");
        return;
      }

      const body: unknown = await response.json();

      if (!isContractReviewFullRedactedExplanationOutput(body)) {
        setAiError(contractReviewCopy.aiStates.invalidResponseError);
        setAiStatus("safe-error");
        return;
      }

      setAiOutput(body);
      setAiPreviewInput(null);
      setAiConfirmationVisible(false);
      setAiStatus("success");
    } catch {
      setAiError(contractReviewCopy.aiStates.safeErrorFallback);
      setAiStatus("safe-error");
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#e6ddcf] bg-[#fffaf2] p-5 shadow-[0_24px_80px_rgba(92,74,48,0.10)] sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.75rem] border border-[#e3dacb] bg-white/76 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#73744b]">
                {contractReviewCopy.input.title}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#242114]">
                {contractReviewCopy.input.label}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClearContractText}
              disabled={!hasText}
              className="rounded-full border border-[#d8cdbc] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {contractReviewCopy.input.clear}
            </button>
          </div>

          <label className="mt-5 block">
            <span className="sr-only">{contractReviewCopy.input.label}</span>
            <textarea
              value={contractText}
              onChange={(event) => handleContractTextChange(event.target.value)}
              placeholder={contractReviewCopy.input.placeholder}
              className="min-h-[28rem] w-full resize-y rounded-[1.5rem] border border-[#ddd2c0] bg-[#fffdf8] px-5 py-4 text-base leading-7 text-[#2f2b1d] outline-none transition placeholder:text-[#a79d8d] focus:border-[#8a8f55] focus:ring-2 focus:ring-[#d8deb5]"
            />
          </label>

          <p className="mt-4 rounded-2xl bg-[#f5f0e6] px-4 py-3 text-sm leading-6 text-[#746c5f]">
            {contractReviewCopy.input.helper}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[#d9ddbd] bg-[#f7f8ed] p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#5b6435]">
                {contractReviewCopy.preview.title}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#242114]">
                {hasText
                  ? `${contractReviewCopy.preview.countPrefix}${segments.length}${contractReviewCopy.preview.countSuffix}`
                  : contractReviewCopy.preview.emptyTitle}
              </h2>
            </div>
          </div>

          {!hasText ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#cfd4aa] bg-white/72 p-6">
              <p className="text-base leading-7 text-[#6d714e]">
                {contractReviewCopy.preview.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {segments.map((segment, index) => (
                <article
                  key={segment.id}
                  className="rounded-[1.5rem] border border-[#e3dacb] bg-white/82 p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-[#73744b]">
                    {segment.title.startsWith("片段")
                      ? segment.title
                      : `${contractReviewCopy.preview.segmentFallbackTitle} ${
                          index + 1
                        } · ${segment.title}`}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4f493f]">
                    {segment.text}
                  </p>
                </article>
              ))}

              <section className="rounded-[1.5rem] border border-[#d9ddbd] bg-white/82 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#5b6435]">
                      {contractReviewCopy.localRisk.title}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#242114]">
                      {contractReviewCopy.localRisk.countPrefix}
                      {findings.length}
                      {contractReviewCopy.localRisk.countSuffix}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handlePreviewAiInput}
                    disabled={!hasText || isSubmitting}
                    className="rounded-full bg-[#59613b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4b5332] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {contractReviewCopy.localRisk.previewAction}
                  </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#675f54]">
                  {contractReviewCopy.localRisk.intro}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#7a725f]">
                  {contractReviewCopy.localRisk.previewHelper}
                </p>

                {hasFindings ? (
                  <div className="mt-5 space-y-3">
                    {localRiskRows.map(({ finding, legalBases }) => (
                      <article
                        key={`${finding.riskId}-${finding.clauseId}`}
                        className="rounded-[1.25rem] border border-[#e3dacb] bg-[#fffdf8] p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#eef1d9] px-3 py-1 text-xs font-semibold text-[#4f5b2f]">
                            {contractReviewCopy.localRisk.riskLevelLabel}:{" "}
                            {riskLevelLabels[finding.priority]}
                          </span>
                          <span className="rounded-full bg-[#f0eadc] px-3 py-1 text-xs font-semibold text-[#5f593f]">
                            {contractReviewCopy.localRisk.clauseOrderLabel}:{" "}
                            {finding.clauseIndex + 1}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-semibold leading-6 text-[#2f2b1d]">
                          {contractReviewCopy.localRisk.ruleTitleLabel}:{" "}
                          {finding.ruleReason}
                        </p>

                        <div className="mt-3 space-y-2 text-sm leading-6 text-[#5d574c]">
                          <p>
                            {contractReviewCopy.localRisk.legalBasisLabel}:{" "}
                            {legalBases.length > 0
                              ? legalBases
                                  .map((entry) => entry.title)
                                  .join(" / ")
                              : contractReviewCopy.localRisk.noLegalBasis}
                          </p>
                          <p>
                            {contractReviewCopy.localRisk.matchedPhrasesLabel}:{" "}
                            {finding.matchedPhrases.join(" / ")}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1.25rem] border border-dashed border-[#cfd4aa] bg-[#f7f8ed] p-5">
                    <p className="text-sm font-semibold leading-6 text-[#4f5b2f]">
                      {contractReviewCopy.localRisk.emptyTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#675f54]">
                      {contractReviewCopy.localRisk.emptyDescription}
                    </p>
                  </div>
                )}

                {aiError && !aiConfirmationVisible ? (
                  <p
                    role="alert"
                    className="mt-5 rounded-2xl border border-[#e2b9a5] bg-[#fff4ed] px-4 py-3 text-sm leading-6 text-[#8a4324]"
                  >
                    {aiError}
                  </p>
                ) : null}
              </section>

              {aiConfirmationVisible && aiPreviewInput ? (
                <ContractReviewAiConfirmationPanel
                  input={aiPreviewInput}
                  error={aiError}
                  isSubmitting={isSubmitting}
                  onBackToEdit={handleCancelAiPreview}
                  onCancel={handleCancelAiPreview}
                  onConfirm={handleConfirmAiGeneration}
                />
              ) : null}

              {aiOutput ? (
                <ContractReviewAiExplanationPanel
                  output={aiOutput}
                  onClear={handleClearAiOutput}
                  onRegenerate={handlePreviewAiInput}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
