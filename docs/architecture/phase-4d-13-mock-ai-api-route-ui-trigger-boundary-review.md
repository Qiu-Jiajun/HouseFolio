# Phase 4D-13：Mock AI API route UI trigger boundary review

## 0. Review status

This document records the boundary review for a future /compare UI trigger that calls the Mock AI API route.

Current stable baseline before this review:

    bdfb251 fix: repair mock ai provider copy

Current completed AI boundary chain:

- Phase 4D-8: Mock AI API route boundary review
- Phase 4D-9: Mock AI API route minimal implementation
- Phase 4D-10: Mock AI API route contract check
- Phase 4D-11: Mock AI API route smoke test
- Phase 4D-12: Mock AI provider Chinese copy encoding fix

Phase 4D-13 is documentation-only.

This phase does not:

- modify /compare UI
- add an AI button
- call the API route from client code
- modify the API route
- modify mock provider
- connect DeepSeek
- write a real prompt
- add localStorage keys
- modify Settings
- persist AI output
- add AI history
- change comparison scoring

## 1. Why this boundary review exists

The project now has a working mock AI route:

    POST /api/ai/compare-explanation

The route has already passed:

- build
- contract check
- runtime smoke test
- sensitive-key rejection
- UTF-8 Chinese output verification

The next likely implementation step is to let the /compare page trigger this mock route.

That is a product-sensitive step because adding a button can accidentally imply:

- system recommendation
- AI decision-making
- automatic generation
- persistent AI report
- real provider readiness
- DeepSeek integration
- user consent coverage
- Settings data-rights coverage

Therefore, the UI trigger must be reviewed before implementation.

## 2. Correct product framing

The future UI trigger should be framed as:

    生成模拟 AI 辅助解释

or:

    生成模拟辅助解释

It should not be framed as:

- AI 推荐
- 让 AI 帮我选
- 生成最终建议
- 推荐最佳房源
- 系统推荐
- 智能决策
- 真房源判断
- 风险鉴定

The button is only for validating the future L3 explanation flow.

It is not a real AI product launch.

## 3. Correct L1 / L2 / L3 boundary

The UI trigger belongs to L3.

It may:

- call the mock route with already-redacted comparison input
- display a structured mock explanation
- explain tradeoffs
- explain missing fields
- explain risk flags
- generate a checklist
- show a clear auxiliary-comparison disclaimer

It must not:

- calculate commute
- recalculate reference score
- sort listings
- filter listings
- decide which listing is best
- verify authenticity
- modify selected listings
- modify comparison model
- modify stored data
- call real model providers

L1 remains responsible for spatial calculation.

L2 remains responsible for scoring, sorting, filtering, and structured comparison.

L3 only explains already-redacted structured input.

## 4. Trigger behavior

The future trigger should be user-initiated only.

Allowed behavior:

- user clicks a button
- client builds redacted CompareExplanationInput
- client sends POST request to /api/ai/compare-explanation
- route returns mock CompareExplanationOutput
- client renders output in page state
- output disappears on refresh

Disallowed behavior:

- auto-run on page load
- background generation
- prefetch AI output
- regenerate automatically when selection changes
- write output to localStorage
- write output to sessionStorage
- write output to IndexedDB
- write output to database
- write output to Settings
- create AI history
- send full comparison model directly without redaction
- send notes text
- send address or coordinates
- send photos or videos

## 5. Data flow boundary

The future UI implementation should use the existing redacted input builder.

Preferred flow:

    Compare page state
    -> ComparisonInput[] / ComparisonModel[]
    -> buildCompareExplanationInput()
    -> POST /api/ai/compare-explanation
    -> CompareExplanationOutput
    -> session-only UI render

The UI should not manually construct large raw payloads inline if a reusable redacted input builder already exists.

The UI should not pass raw listings, raw notes, raw photos, raw routes, or raw ComparisonModel objects to the API route.

## 6. User-facing disclaimer

The future UI trigger area should include a short disclaimer before or near the button.

Suggested wording:

    模拟 AI 辅助解释仅用于验证未来 L3 说明流程。它基于已脱敏的结构化比较信息生成，不代表最终推荐，也不判断房源真实性。

The output area should also preserve a disclaimer from the API result.

The UI must make clear:

- this is mock output
- this is auxiliary comparison
- this is not a final recommendation
- this does not verify listings
- user must verify listings, contracts, and transaction details

## 7. Loading / error states

The future UI should handle:

- idle
- loading
- success
- invalid input
- route failure
- generic failure

Allowed error messaging:

    暂时无法生成模拟辅助解释，请稍后重试。

or:

    当前比较资料不足，无法生成模拟辅助解释。

Disallowed error behavior:

- show stack trace
- show raw API error
- show request payload
- show provider internals
- show environment variable names
- suggest DeepSeek is connected
- suggest real AI generation has failed

## 8. Output display boundary

The future UI may display:

- summary
- tradeoffs
- commuteNotes
- riskExplanations
- missingFieldNotes
- checklist
- disclaimer

The future UI must not display:

- raw request
- raw prompt
- raw model response
- provider internals
- coordinates
- route data
- notes text
- photos
- videos
- hidden metadata
- history ID
- persistence ID

The output should sit after the existing static explanation or replace it only after a separate implementation decision.

A safer first version:

- keep existing static explanation panel
- add a separate mock AI explanation block below it
- make mock status visually explicit

## 9. Persistence boundary

The first UI trigger implementation must be session-only.

It must not add localStorage keys.

Explicitly do not add:

- housefolio:ai-compare-explanations
- housefolio:ai-output-history
- housefolio:compare-ai-history
- housefolio:ai-consent
- housefolio:ai-provider
- housefolio:last-ai-explanation

If a later phase persists AI output, it must update:

- src/lib/privacy/local-data.ts
- Settings export
- Settings import
- Settings clear
- data rights documentation
- AI deletion behavior

That is not part of the first mock UI trigger.

## 10. Settings boundary

No Settings change is needed for a session-only mock UI trigger.

Settings must only be revisited if future phases add:

- persisted AI output
- AI history
- AI usage logs
- saved consent records
- provider selection
- cloud sync of AI artifacts

Therefore, Phase 4D-14 or any first UI implementation should not modify Settings.

## 11. Consent boundary

Because the first UI trigger calls only a local mock route and does not call DeepSeek or any real model provider, a full third-party AI consent modal is not required.

However, the UI should still disclose:

- this is mock output
- only redacted structured comparison input is sent to the local route
- no AI output is saved
- no real provider is called

A real-provider consent modal must be reviewed separately before DeepSeek or any external model is used.

## 12. Implementation file scope for future phase

A safe future implementation phase may modify only:

- src/components/compare-selected-listings-panel.tsx
- possibly src/content/zh-cn.ts
- possibly docs/dev-log for regression

It may import existing functions from:

- src/lib/ai/compare-explanation-input.ts
- src/types/ai-compare-explanation.ts

It should not modify:

- src/app/api/ai/compare-explanation/route.ts
- src/lib/ai/mock-provider.ts
- src/lib/ai/provider.ts
- src/lib/algorithm/comparison.ts
- src/lib/privacy/local-data.ts
- Settings files
- local storage files

If route changes are needed, stop and open a separate route-boundary phase.

## 13. Future implementation acceptance criteria

A future Mock AI UI trigger implementation should pass:

- npm.cmd run build
- /compare still loads
- no localStorage key added
- no Settings change
- no DeepSeek import
- no prompt builder
- no real provider key
- static boundary scan for DeepSeek / process.env / NEXT_PUBLIC in touched UI files
- manual browser check:
  - select 2–4 listings
  - open /compare
  - click mock AI explanation button
  - loading state appears
  - mock explanation renders
  - no persistence after refresh
  - existing compare table remains intact
  - disclaimer is visible

## 14. Suggested next phase

If Phase 4D-13 is accepted, the next safe phase can be:

    Phase 4D-14：Mock AI UI trigger minimal implementation

That phase should still avoid:

- DeepSeek
- real prompt builder
- AI output persistence
- Settings changes
- localStorage keys
- route changes
- recommendation wording

The first UI trigger should remain a mock-only, session-only L3 explanation demo.

## 15. Phase 4D-13 conclusion

A /compare UI trigger for the Mock AI API route is reasonable as the next small step because the server route has already passed boundary, contract, smoke, and UTF-8 checks.

However, the first UI trigger must remain:

- user-triggered
- mock-only
- session-only
- redacted-input based
- auxiliary-comparison framed
- non-recommending
- non-persistent
- isolated from Settings
- isolated from DeepSeek

Phase 4D-13 itself is complete only when this document exists, build passes, git status is reviewed, and the document is committed.