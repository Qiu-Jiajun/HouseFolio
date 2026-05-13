import type { ComparisonInput } from "@/lib/algorithm/comparison";
import { compareExplanationCopy } from "@/content/zh-cn";

type CompareExplanationPanelProps = {
  models: ComparisonInput[];
};

function hasAnyMissingFields(models: ComparisonInput[]) {
  return models.some((model) => model.missingFields.length > 0);
}

function hasAnyRiskFlags(models: ComparisonInput[]) {
  return models.some((model) => model.riskFlags.length > 0);
}

export function CompareExplanationPanel({
  models,
}: CompareExplanationPanelProps) {
  if (models.length < 2) {
    return null;
  }

  const hasMissingFields = hasAnyMissingFields(models);
  const hasRiskFlags = hasAnyRiskFlags(models);

  return (
    <section className="mt-6 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-neutral-500">
          {compareExplanationCopy.badge}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          {compareExplanationCopy.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          {compareExplanationCopy.description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-neutral-200 bg-white p-5">
          <h3 className="text-base font-semibold text-neutral-950">
            {compareExplanationCopy.sections.tradeoff.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {compareExplanationCopy.sections.tradeoff.body}
          </p>
        </article>

        <article className="rounded-3xl border border-neutral-200 bg-white p-5">
          <h3 className="text-base font-semibold text-neutral-950">
            {compareExplanationCopy.sections.commute.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {compareExplanationCopy.sections.commute.body}
          </p>
        </article>

        <article className="rounded-3xl border border-neutral-200 bg-white p-5">
          <h3 className="text-base font-semibold text-neutral-950">
            {compareExplanationCopy.sections.confidence.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {hasMissingFields || hasRiskFlags
              ? compareExplanationCopy.sections.confidence.bodyWithSignals
              : compareExplanationCopy.sections.confidence.bodyWithoutSignals}
          </p>
        </article>

        <article className="rounded-3xl border border-neutral-200 bg-white p-5">
          <h3 className="text-base font-semibold text-neutral-950">
            {compareExplanationCopy.sections.checklist.title}
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
            {compareExplanationCopy.sections.checklist.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-neutral-400">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-500">
        {compareExplanationCopy.disclaimer}
      </p>
    </section>
  );
}