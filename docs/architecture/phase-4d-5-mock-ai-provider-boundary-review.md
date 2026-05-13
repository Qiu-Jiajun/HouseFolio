# Phase 4D-5：Mock AI provider boundary review

## 0. Stage summary

Phase 4D-5 reviews the boundary for a future mock AI provider.

This stage only writes this architecture document:

    docs/architecture/phase-4d-5-mock-ai-provider-boundary-review.md

This stage does not implement the mock provider.

It does not:

- connect DeepSeek;
- add a real provider;
- add API routes;
- write prompt builder code;
- call fetch;
- modify /compare UI;
- modify CompareExplanationPanel;
- store AI output;
- add localStorage keys;
- modify Settings;
- modify L2 comparison logic.

The purpose is to define how a mock provider can safely exist as a deterministic, local, provider-neutral simulation layer before any real model integration.

---

## 1. Current baseline

Current latest stable commit:

    b24b365 feat: add redacted ai explanation input builder

Current AI-related foundation:

    src/types/ai-compare-explanation.ts
    src/types/ai-compare-explanation-contract-check.ts
    src/lib/ai/index.ts
    src/lib/ai/compare-explanation-input.ts
    src/lib/ai/compare-explanation-input-contract-check.ts

Current capability:

    ComparisonInput[]
    → buildCompareExplanationInput()
    → CompareExplanationInput

Current state:

- no DeepSeek;
- no real provider;
- no mock provider;
- no API route;
- no prompt builder;
- no UI trigger;
- no AI persistence;
- no Settings change.

---

## 2. Why mock provider comes before real provider

A mock provider allows HouseFolio to validate the L3 compare explanation flow without privacy, cost, API, or compliance risk.

A mock provider can test:

- CompareExplanationInput shape;
- CompareExplanationOutput shape;
- output rendering assumptions;
- error boundary design;
- whether the UI can distinguish static explanation from generated explanation;
- whether product language stays auxiliary;
- whether fallback behavior remains stable.

It should happen before any real provider because real provider work introduces:

- API key handling;
- server-side route requirements;
- provider terms review;
- third-party data disclosure;
- cost control;
- provider error handling;
- prompt leakage risk;
- hallucination risk.

---

## 3. Product boundary

HouseFolio remains a local-first private rental decision tool.

It must not become:

- an AI house-selection system;
- a recommendation engine;
- a real-listing verification system;
- a brokerage assistant;
- a contract advisor;
- a transaction decision tool.

Mock output must not use final-decision language.

Allowed:

- auxiliary explanation;
- trade-off summary;
- missing field explanation;
- next-step checklist;
- conditional wording.

Forbidden:

- best listing;
- final recommendation;
- ranking as decision;
- recommendation score;
- authenticity verdict;
- signing advice;
- legal conclusion.

---

## 4. Mock provider role

The mock provider should do exactly one thing:

    CompareExplanationInput
    → deterministic CompareExplanationOutput

It should be:

- local;
- synchronous or Promise-based without network;
- deterministic;
- provider-neutral;
- side-effect free;
- free of secrets;
- free of environment variables;
- safe for tests and local demos.

It must not:

- call fetch;
- call DeepSeek;
- call OpenAI or any other provider;
- read API keys;
- read localStorage;
- read IndexedDB;
- read photos or videos;
- read raw notes;
- build real prompts;
- persist outputs.

---

## 5. Recommended future file scope

Future implementation may add:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/mock-provider-contract-check.ts

Potential update:

    src/lib/ai/index.ts

But Phase 4D-5 does not create these files.

---

## 6. Provider interface boundary

A future provider interface should be provider-neutral.

Possible interface:

    export type CompareExplanationProvider = {
      generateCompareExplanation(
        input: CompareExplanationInput
      ): Promise<CompareExplanationOutput>;
    };

This interface should not mention:

- DeepSeek;
- model names;
- API keys;
- endpoint URLs;
- token usage;
- provider request format;
- provider response format.

Provider-specific details belong only in future real provider implementation files.

---

## 7. Mock output boundary

The mock provider should return a structured CompareExplanationOutput.

Allowed output fields:

    summary
    tradeoffs
    commuteNotes
    riskExplanations
    missingFieldNotes
    checklist
    disclaimer

Forbidden output fields:

    bestListingId
    ranking
    recommendationScore
    finalDecision
    shouldChoose
    verified
    authenticityVerdict

The mock provider should not invent facts beyond the input.

It may say:

    当前对比包含 X 套房源。
    当前比较应重点关注租金、面积、通勤和资料完整度之间的取舍。
    若存在缺失字段，应先补充信息再做最终判断。

It must not say:

    A 是最佳房源。
    系统推荐 A。
    A 真实可靠。
    可以放心签约。

---

## 8. Deterministic behavior

Mock provider output should be deterministic.

Given the same CompareExplanationInput, it should return the same logical output.

It may compute simple counts:

- number of listings;
- number of missing fields;
- number of risk flags;
- whether any listing has commute data;
- whether any listing has photos;
- whether any listing has subjective summary.

But it must not:

- score listings;
- sort listings;
- choose a winner;
- infer market conditions;
- infer legal risk;
- infer authenticity;
- infer landlord reliability.

---

## 9. Relationship to static explanation panel

Current CompareExplanationPanel is static UI copy.

Future mock provider output is not the same thing.

Recommended relationship:

    Static panel = always available explanation baseline
    Mock provider = simulated generated explanation for testing future flow
    Real provider = later, after separate boundary review

The static panel should remain visible or available as fallback when mock/AI generation fails.

Mock provider should not replace CompareTable.

Mock provider should not hide static explanation boundary copy.

---

## 10. API route boundary

Phase 4D-5 does not add an API route.

Recommended sequence:

1. mock provider library only;
2. contract check;
3. dev-log;
4. later route review;
5. later mock route implementation.

Do not add:

    src/app/api/ai/compare/explanation/route.ts

until route boundary is separately reviewed.

---

## 11. Prompt boundary

Mock provider should not use a real prompt.

It may use deterministic template logic.

Do not add:

- prompt builder;
- system prompt;
- user prompt;
- hidden instruction string;
- provider-style message array;
- token configuration;
- model configuration.

Prompt design belongs to a later real provider phase.

---

## 12. Persistence boundary

Mock provider output should not be persisted.

Do not add:

    housefolio:ai-explanations
    housefolio:compare-ai-results
    housefolio:ai-history
    housefolio:prompt-history
    housefolio:compare-reports

Do not modify:

    src/lib/privacy/local-data.ts
    Settings local data panel
    JSON export
    JSON import whitelist
    clear local data behavior

First mock output should be volatile.

---

## 13. Product language boundary

Mock output must use allowed language:

- 辅助解释;
- 辅助比较;
- 取舍;
- 下一步核实;
- 条件化说明;
- 不代表最终推荐;
- 请自行核实.

Mock output must avoid:

- 最佳房源;
- 最优选择;
- 系统推荐;
- 推荐分;
- 替你决定;
- 真房源;
- 避坑保真;
- 可以放心签约;
- 真实可靠.

---

## 14. Recommended next phase

Next recommended phase:

    Phase 4D-6：Mock AI provider implementation

Possible file scope:

    src/lib/ai/provider.ts
    src/lib/ai/mock-provider.ts
    src/lib/ai/compare-explanation.ts
    src/lib/ai/mock-provider-contract-check.ts
    src/lib/ai/index.ts
    docs/dev-log/2026-05-13-phase-4d-6-mock-ai-provider.md

Still forbidden:

- DeepSeek;
- fetch;
- API route;
- prompt builder;
- UI trigger;
- localStorage;
- Settings update;
- persistence.

---

## 15. Decision summary

Phase 4D-5 decisions:

1. Mock provider should come before real provider.
2. Mock provider should be local and deterministic.
3. Mock provider should consume CompareExplanationInput.
4. Mock provider should return CompareExplanationOutput.
5. Mock provider should not call network or provider APIs.
6. Mock provider should not create prompts.
7. Mock provider should not persist output.
8. Mock provider should not change /compare UI yet.
9. Static explanation remains fallback.
10. Real DeepSeek provider remains out of scope.

---

## 16. Acceptance criteria

Phase 4D-5 is complete only if:

- only this architecture document is added;
- no source code files are modified;
- no provider files are added;
- no API route is added;
- no DeepSeek integration is added;
- no prompt builder is added;
- no localStorage key is added;
- no Settings file is modified;
- no /compare UI file is modified;
- npm.cmd run build passes;
- git status is clean after commit.

Recommended commit message:

    docs: review mock ai provider boundary