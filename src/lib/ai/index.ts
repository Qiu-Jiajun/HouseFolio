export function getAiProviderName() {
  return "not-configured";
}

export {
  generateCompareExplanation,
  generateMockCompareExplanation,
} from "@/lib/ai/compare-explanation";

export {
  buildCompareExplanationInput,
  buildCompareExplanationListingInput,
} from "@/lib/ai/compare-explanation-input";

export { buildCompareExplanationPrompt } from "@/lib/ai/compare-explanation-prompt";

export { mockCompareExplanationProvider } from "@/lib/ai/mock-provider";

export type {
  CompareExplanationProvider,
  CompareExplanationProviderName,
} from "@/lib/ai/provider";

export type {
  CompareExplanationPromptMessage,
  CompareExplanationPromptOutputShape,
  CompareExplanationPromptPayload,
  CompareExplanationPromptRole,
} from "@/lib/ai/compare-explanation-prompt";

export type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";