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

export { mockCompareExplanationProvider } from "@/lib/ai/mock-provider";

export type {
  CompareExplanationProvider,
  CompareExplanationProviderName,
} from "@/lib/ai/provider";

export type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";
