import {
  CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION,
  type ContractReviewExplanationOutput,
  type ContractReviewFullRedactedExplanationOutput,
} from "@/types/ai-contract-review-explanation";
import type {
  ContractReviewAiInput,
  ContractReviewFullRedactedAiInput,
} from "@/lib/contract/ai-safe-input";

const CONTRACT_REVIEW_MOCK_DISCLAIMER_ZH =
  "以上内容仅用于签约前识别和沟通常见风险，不构成正式法律意见，也不能替代专业人士判断。";

export const contractReviewMockProvider = {
  async generateContractReviewExplanation(
    input: ContractReviewAiInput,
  ): Promise<ContractReviewExplanationOutput> {
    return {
      summaryZh:
        "已根据本地规则信号整理签约前核对重点。请结合完整合同、房屋实际状态和双方沟通记录进一步确认。",
      findingExplanations: input.findings.map((finding) => ({
        riskId: finding.riskId,
        riskLevel: finding.riskLevel,
        titleZh: finding.ruleTitleZh,
        explanationZh:
          "该项来自 HouseFolio 本地规则信号。建议结合对应条款上下文进一步核实。",
        legalBasisNotesZh: [
          "法规依据仅用于说明常见规则背景，不构成正式法律意见。",
        ],
        preSigningQuestionsZh: [
          "该事项的触发条件、处理方式和费用承担是否已经书面约定？",
        ],
        suggestedClauseDirectionsZh: [
          "建议将触发条件、通知方式、处理期限和费用承担写入合同或补充协议。",
        ],
        negotiationScriptZh:
          "为了避免后续理解不一致，能否把这一事项的触发条件和处理方式补充写清楚？",
        needsFurtherConfirmation: true,
      })),
      disclaimerZh: CONTRACT_REVIEW_MOCK_DISCLAIMER_ZH,
    };
  },

  async generateFullRedactedContractReviewExplanation(
    input: ContractReviewFullRedactedAiInput,
  ): Promise<ContractReviewFullRedactedExplanationOutput> {
    return {
      outputVersion:
        CONTRACT_REVIEW_FULL_REDACTED_EXPLANATION_OUTPUT_VERSION,
      summaryZh:
        "已根据完整脱敏合同和本地规则信号整理签约前核对重点。请结合完整合同、房屋实际状态和双方沟通记录进一步确认。",
      ruleSignalExplanations: input.ruleSignals.map((ruleSignal) => ({
        riskId: ruleSignal.riskId,
        clauseId: ruleSignal.clauseId,
        riskLevel: ruleSignal.riskLevel,
        titleZh: ruleSignal.ruleTitleZh,
        explanationZh:
          "该项来自 HouseFolio 本地规则信号。建议结合对应条款上下文进一步确认。",
        legalBasisNotesZh: [
          "规则信号中的法规依据仅用于说明常见规则背景，不构成正式法律意见。",
        ],
        preSigningQuestionsZh: [
          "该条款的触发条件、处理方式和费用承担是否已经明确？",
        ],
        suggestedClauseDirectionsZh: [
          "建议补充写明触发条件、通知方式、处理期限和费用承担。",
        ],
        negotiationScriptZh:
          "为了避免后续理解不一致，能否把这项条款的触发条件和处理方式补充写清楚？",
        needsFurtherConfirmation: true,
      })),
      supplementalAttentionItems: [
        {
          attentionType: "建议补充约定",
          relatedClauseIds: [],
          titleZh:
            "建议确认合同未写明但签约前通常需要核对的事项",
          explanationZh:
            "完整脱敏合同中可能仍存在规则未命中的空白事项。该项不是 L2 规则命中，也不是法律结论，只是建议签约前补充核对。",
          preSigningQuestionsZh: [
            "除已列明条款外，双方是否还需要补充约定交付清单、维修响应和费用承担？",
          ],
          suggestedClauseDirectionsZh: [
            "建议将双方已口头确认但合同未写明的事项补充为书面条款。",
          ],
          negotiationScriptZh:
            "我们能否把已经谈好的交付、维修和费用承担事项补充写清楚，避免后续只靠口头理解？",
          needsFurtherConfirmation: true,
        },
      ],
      disclaimerZh: CONTRACT_REVIEW_MOCK_DISCLAIMER_ZH,
    };
  },
} as const;
