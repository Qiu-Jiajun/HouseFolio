import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

export type CompareExplanationProviderName = "mock";

export type CompareExplanationProvider = {
  name: CompareExplanationProviderName;
  generateCompareExplanation(
    input: CompareExplanationInput,
  ): Promise<CompareExplanationOutput>;
};
