export function getAiProviderName() {
  return "not-configured";
}

export {
  buildCompareExplanationInput,
  buildCompareExplanationListingInput,
} from "@/lib/ai/compare-explanation-input";

export type {
  CompareExplanationInput,
  CompareExplanationListingInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";