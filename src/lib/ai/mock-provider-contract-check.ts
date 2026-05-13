import type {
  generateCompareExplanation,
  generateMockCompareExplanation,
} from "@/lib/ai/compare-explanation";
import type { mockCompareExplanationProvider } from "@/lib/ai/mock-provider";
import type { CompareExplanationProvider } from "@/lib/ai/provider";
import type {
  CompareExplanationInput,
  CompareExplanationOutput,
} from "@/types/ai-compare-explanation";

type AssertTrue<T extends true> = T;

type IsAssignable<From, To> = [From] extends [To] ? true : false;

type IsNever<T> = [T] extends [never] ? true : false;

type ForbiddenMockProviderOutputKeys =
  | "bestListingId"
  | "ranking"
  | "recommendationScore"
  | "finalDecision"
  | "shouldChoose"
  | "verified"
  | "authenticityVerdict"
  | "prompt"
  | "aiPrompt"
  | "rawResponse"
  | "providerResponse"
  | "apiKey"
  | "requestUrl";

type AllowedCompareExplanationOutputKeys =
  | "summary"
  | "tradeoffs"
  | "commuteNotes"
  | "riskExplanations"
  | "missingFieldNotes"
  | "checklist"
  | "disclaimer";

type ExactKeys<T, AllowedKeys extends PropertyKey> = IsNever<
  Exclude<keyof T, AllowedKeys>
>;

type NoForbiddenKeys<T> = IsNever<Extract<keyof T, ForbiddenMockProviderOutputKeys>>;

type _MockProviderSatisfiesProvider = AssertTrue<
  IsAssignable<typeof mockCompareExplanationProvider, CompareExplanationProvider>
>;

type _GenerateAcceptsCompareExplanationInput = AssertTrue<
  IsAssignable<
    Parameters<typeof generateCompareExplanation>[0],
    CompareExplanationInput
  >
>;

type _GenerateReturnsCompareExplanationOutput = AssertTrue<
  IsAssignable<
    Awaited<ReturnType<typeof generateCompareExplanation>>,
    CompareExplanationOutput
  >
>;

type _GenerateMockAcceptsCompareExplanationInput = AssertTrue<
  IsAssignable<
    Parameters<typeof generateMockCompareExplanation>[0],
    CompareExplanationInput
  >
>;

type _GenerateMockReturnsCompareExplanationOutput = AssertTrue<
  IsAssignable<
    Awaited<ReturnType<typeof generateMockCompareExplanation>>,
    CompareExplanationOutput
  >
>;

type _OutputHasNoForbiddenKeys = AssertTrue<
  NoForbiddenKeys<CompareExplanationOutput>
>;

type _OutputKeysAreAllowlisted = AssertTrue<
  ExactKeys<CompareExplanationOutput, AllowedCompareExplanationOutputKeys>
>;
