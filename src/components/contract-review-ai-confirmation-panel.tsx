import { contractReviewCopy } from "@/content/zh-cn";
import type { ContractReviewFullRedactedAiInput } from "@/lib/contract/ai-safe-input";

type ContractReviewAiConfirmationPanelProps = {
  readonly input: ContractReviewFullRedactedAiInput;
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onBackToEdit: () => void;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
};

export function ContractReviewAiConfirmationPanel({
  input,
  error,
  isSubmitting,
  onBackToEdit,
  onCancel,
  onConfirm,
}: ContractReviewAiConfirmationPanelProps) {
  const copy = contractReviewCopy.aiConfirmation;
  const riskLevelLabels = contractReviewCopy.localRisk.riskLevelLabels;
  const clauseOrderById = new Map(
    input.redactedClauses.map((clause) => [
      clause.clauseId,
      clause.clauseOrder,
    ]),
  );

  return (
    <section className="rounded-[1.5rem] border border-[#d5cfb8] bg-[#fffdf8] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#73744b]">{copy.title}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d574c]">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-[#eef1d9] px-4 py-2 text-sm font-semibold text-[#4f5b2f]">
            {copy.clauseCountLabel}: {input.redactedClauses.length}
          </div>
          <div className="rounded-full bg-[#f0eadc] px-4 py-2 text-sm font-semibold text-[#5f593f]">
            {copy.ruleSignalCountLabel}: {input.ruleSignals.length}
          </div>
        </div>
      </div>

      <ul className="mt-5 grid gap-2 text-sm leading-6 text-[#5d574c] sm:grid-cols-2">
        {copy.notices.map((notice) => (
          <li key={notice} className="rounded-2xl bg-[#f5f0e6] px-4 py-3">
            {notice}
          </li>
        ))}
      </ul>

      <section className="mt-5 rounded-[1.25rem] border border-[#e3dacb] bg-white/82 p-4">
        <h3 className="text-base font-semibold text-[#2f2b1d]">
          {copy.previewTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#675f54]">
          {copy.previewDescription}
        </p>

        <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {input.redactedClauses.map((clause) => (
            <article
              key={clause.clauseId}
              className="rounded-2xl bg-[#fff8ec] px-4 py-3"
            >
              <p className="text-xs font-semibold text-[#73744b]">
                {copy.fields.clauseOrder}: {clause.clauseOrder}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#4f493f]">
                {clause.redactedClauseText}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[1.25rem] border border-[#d9ddbd] bg-[#f7f8ed] p-4">
        <h3 className="text-base font-semibold text-[#2f2b1d]">
          {copy.ruleSignalsTitle}
        </h3>

        {input.ruleSignals.length > 0 ? (
          <div className="mt-3 space-y-3">
            {input.ruleSignals.map((signal) => (
              <article
                key={`${signal.riskId}-${signal.clauseId}`}
                className="rounded-2xl bg-white/82 px-4 py-3"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f0eadc] px-3 py-1 text-xs font-semibold text-[#5f593f]">
                    {copy.fields.riskLevel}:{" "}
                    {riskLevelLabels[signal.riskLevel]}
                  </span>
                  <span className="rounded-full bg-[#edf1dc] px-3 py-1 text-xs font-semibold text-[#4f5b2f]">
                    {copy.fields.clauseOrder}:{" "}
                    {clauseOrderById.get(signal.clauseId) ??
                      copy.fields.unknownClauseOrder}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#2f2b1d]">
                  {signal.ruleTitleZh}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-white/82 px-4 py-3 text-sm leading-6 text-[#675f54]">
            {copy.noRuleSignals}
          </p>
        )}
      </section>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-[#e2b9a5] bg-[#fff4ed] px-4 py-3 text-sm leading-6 text-[#8a4324]"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackToEdit}
          disabled={isSubmitting}
          className="rounded-full border border-[#d8cdbc] bg-white px-4 py-2 text-sm font-medium text-[#4f5131] transition hover:border-[#b8ad8c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.actions.backToEdit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full border border-[#d8cdbc] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#675f54] transition hover:border-[#b8ad8c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.actions.cancel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="rounded-full bg-[#59613b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4b5332] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? copy.actions.submitting : copy.actions.confirm}
        </button>
      </div>
    </section>
  );
}
