import { contractRiskRules } from "@/lib/contract/risk-rules";
import type { ContractClauseSegment } from "@/lib/contract/clause-segmentation";
import type {
  ContractRiskFinding,
  ContractRiskPriority,
  ContractRiskRule,
} from "@/lib/contract/types";

const priorityRank: Record<ContractRiskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function normalizeForMatching(value: string) {
  return value
    .toLocaleLowerCase("zh-CN")
    .replace(/[，。！？；：（）【】《》“”‘’、]/g, " ")
    .replace(/[,.!?;:()[\]{}"'`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyword(value: string) {
  return normalizeForMatching(value);
}

function includesKeyword(normalizedText: string, keyword: string) {
  const normalizedKeyword = normalizeKeyword(keyword);

  return Boolean(normalizedKeyword) && normalizedText.includes(normalizedKeyword);
}

function collectMatchedPhrases(
  normalizedText: string,
  keywords: readonly string[] | undefined,
) {
  if (!keywords) {
    return [];
  }

  return keywords.filter((keyword) => includesKeyword(normalizedText, keyword));
}

function matchesRule(normalizedText: string, rule: ContractRiskRule) {
  const hasNegativeKeyword = rule.negativeKeywords?.some((keyword) =>
    includesKeyword(normalizedText, keyword),
  );

  if (hasNegativeKeyword) {
    return null;
  }

  const allMatches = collectMatchedPhrases(normalizedText, rule.allKeywords);
  const anyMatches = collectMatchedPhrases(normalizedText, rule.anyKeywords);
  const requiresAll = (rule.allKeywords?.length ?? 0) > 0;
  const requiresAny = (rule.anyKeywords?.length ?? 0) > 0;

  if (requiresAll && allMatches.length !== rule.allKeywords?.length) {
    return null;
  }

  if (requiresAny && anyMatches.length === 0) {
    return null;
  }

  return Array.from(new Set([...allMatches, ...anyMatches]));
}

export function matchContractRisks(
  clauses: readonly ContractClauseSegment[],
): ContractRiskFinding[] {
  const findings: Array<ContractRiskFinding & { ruleOrder: number }> = [];

  clauses.forEach((clause, clauseIndex) => {
    const normalizedText = normalizeForMatching(clause.text);

    contractRiskRules.forEach((rule, ruleOrder) => {
      const matchedPhrases = matchesRule(normalizedText, rule);

      if (!matchedPhrases) {
        return;
      }

      findings.push({
        riskId: rule.id,
        clauseId: clause.id,
        clauseIndex,
        category: rule.category,
        priority: rule.priority,
        matchedPhrases,
        ruleReason: rule.ruleReason,
        legalBasisIds: rule.legalBasisIds,
        shouldExplainWithAI: rule.shouldExplainWithAI,
        ruleOrder,
      });
    });
  });

  return findings
    .sort((left, right) => {
      return (
        priorityRank[left.priority] - priorityRank[right.priority] ||
        left.clauseIndex - right.clauseIndex ||
        left.ruleOrder - right.ruleOrder
      );
    })
    .map(({ ruleOrder, ...finding }) => finding);
}
