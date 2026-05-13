import { mockCompareExplanationProvider } from "@/lib/ai/mock-provider";
import type { CompareExplanationProvider } from "@/lib/ai/provider";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

export async function generateCompareExplanation(
  input: CompareExplanationInput,
  provider: CompareExplanationProvider = mockCompareExplanationProvider,
): Promise<CompareExplanationOutput> {
  return provider.generateCompareExplanation(input);
}

export async function generateMockCompareExplanation(
  input: CompareExplanationInput,
): Promise<CompareExplanationOutput> {
  return mockCompareExplanationProvider.generateCompareExplanation(input);
}
