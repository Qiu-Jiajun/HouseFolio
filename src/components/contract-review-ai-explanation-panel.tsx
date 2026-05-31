import { contractReviewCopy } from "@/content/zh-cn";
import type { ContractReviewFullRedactedExplanationOutput } from "@/types/ai-contract-review-explanation";

type ContractReviewAiExplanationPanelProps = {
  readonly output: ContractReviewFullRedactedExplanationOutput;
  readonly onClear: () => void;
  readonly onRegenerate: () => void;
};

function TextList({
  title,
  items,
}: {
  readonly title: string;
  readonly items: readonly string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-[#3b3829]">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-2xl bg-[#f7f8ed] px-4 py-3 text-sm leading-6 text-[#59613b]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatRelatedClauseIds(clauseIds: readonly string[]) {
  return clauseIds
    .map((clauseId) =>
      clauseId.startsWith("clause-")
        ? clauseId.slice("clause-".length)
        : clauseId,
    )
    .join(" / ");
}

export function ContractReviewAiExplanationPanel({
  output,
  onClear,
  onRegenerate,
}: ContractReviewAiExplanationPanelProps) {
  const copy = contractReviewCopy.aiOutput;
  const riskLevelLabels = contractReviewCopy.localRisk.riskLevelLabels;

  return (
    <section className="rounded-[1.5rem] border border-[#d9ddbd] bg-[#f7f8ed] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5b6435]">{copy.title}</p>
          <h3 className="mt-3 text-xl font-semibold text-[#242114]">
            {copy.summaryTitle}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4f493f]">
            {output.summaryZh}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded-full border border-[#c9cf9e] bg-white px-4 py-2 text-sm font-medium text-[#4f5b2f] transition hover:border-[#aab46f]"
          >
            {copy.regenerateAction}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-[#d8cdbc] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#675f54] transition hover:border-[#b8ad8c]"
          >
            {copy.clearAction}
          </button>
        </div>
      </div>

      <section className="mt-5 rounded-[1.25rem] border border-[#d9ddbd] bg-white/72 p-4">
        <h3 className="text-base font-semibold text-[#2f2b1d]">
          {copy.ruleSignals.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#675f54]">
          {copy.ruleSignals.description}
        </p>

        {output.ruleSignalExplanations.length > 0 ? (
          <div className="mt-4 space-y-4">
            {output.ruleSignalExplanations.map((finding) => (
              <article
                key={`${finding.riskId}-${finding.clauseId}`}
                className="rounded-[1.25rem] border border-[#e3dacb] bg-white/82 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef1d9] px-3 py-1 text-xs font-semibold text-[#4f5b2f]">
                    {riskLevelLabels[finding.riskLevel]}
                  </span>
                  <span className="rounded-full bg-[#f0eadc] px-3 py-1 text-xs font-semibold text-[#5f593f]">
                    {finding.needsFurtherConfirmation
                      ? copy.needsFurtherConfirmation.yes
                      : copy.needsFurtherConfirmation.no}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#2f2b1d]">
                  {finding.titleZh}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4f493f]">
                  {finding.explanationZh}
                </p>

                <div className="mt-4 space-y-4">
                  <TextList
                    title={copy.sections.legalBasisNotes}
                    items={finding.legalBasisNotesZh}
                  />
                  <TextList
                    title={copy.sections.preSigningQuestions}
                    items={finding.preSigningQuestionsZh}
                  />
                  <TextList
                    title={copy.sections.suggestedClauseDirections}
                    items={finding.suggestedClauseDirectionsZh}
                  />

                  <div>
                    <h4 className="text-sm font-semibold text-[#3b3829]">
                      {copy.sections.negotiationScript}
                    </h4>
                    <p className="mt-2 rounded-2xl bg-[#fff8ec] px-4 py-3 text-sm leading-7 text-[#4f493f]">
                      {finding.negotiationScriptZh}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-[#f7f8ed] px-4 py-3 text-sm leading-6 text-[#675f54]">
            {copy.ruleSignals.empty}
          </p>
        )}
      </section>

      <section className="mt-5 rounded-[1.25rem] border border-[#e3dacb] bg-[#fffdf8] p-4">
        <h3 className="text-base font-semibold text-[#2f2b1d]">
          {copy.supplementalAttention.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#675f54]">
          {copy.supplementalAttention.description}
        </p>

        {output.supplementalAttentionItems.length > 0 ? (
          <div className="mt-4 space-y-4">
            {output.supplementalAttentionItems.map((attention, index) => (
              <article
                key={`${attention.attentionType}-${attention.titleZh}-${index}`}
                className="rounded-[1.25rem] border border-[#e3dacb] bg-white/82 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef1d9] px-3 py-1 text-xs font-semibold text-[#4f5b2f]">
                    {attention.attentionType}
                  </span>
                  <span className="rounded-full bg-[#f0eadc] px-3 py-1 text-xs font-semibold text-[#5f593f]">
                    {copy.needsFurtherConfirmation.yes}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#2f2b1d]">
                  {attention.titleZh}
                </h3>

                {attention.relatedClauseIds.length > 0 ? (
                  <p className="mt-2 text-xs font-semibold text-[#73744b]">
                    {copy.supplementalAttention.relatedClauses}:{" "}
                    {formatRelatedClauseIds(attention.relatedClauseIds)}
                  </p>
                ) : null}

                <p className="mt-3 text-sm leading-7 text-[#4f493f]">
                  {attention.explanationZh}
                </p>

                <div className="mt-4 space-y-4">
                  <TextList
                    title={copy.sections.preSigningQuestions}
                    items={attention.preSigningQuestionsZh}
                  />
                  <TextList
                    title={copy.sections.suggestedClauseDirections}
                    items={attention.suggestedClauseDirectionsZh}
                  />

                  <div>
                    <h4 className="text-sm font-semibold text-[#3b3829]">
                      {copy.sections.negotiationScript}
                    </h4>
                    <p className="mt-2 rounded-2xl bg-[#fff8ec] px-4 py-3 text-sm leading-7 text-[#4f493f]">
                      {attention.negotiationScriptZh}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-[#f5f0e6] px-4 py-3 text-sm leading-6 text-[#675f54]">
            {copy.supplementalAttention.empty}
          </p>
        )}
      </section>

      <div className="mt-5 rounded-2xl bg-[#fffdf8] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#3b3829]">
          {copy.disclaimerTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#675f54]">
          {output.disclaimerZh}
        </p>
      </div>
    </section>
  );
}
