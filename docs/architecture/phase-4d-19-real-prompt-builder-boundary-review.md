# Phase 4D-19｜Real prompt builder boundary review

Date: 2026-05-15

## Goal

Define the boundary for a future real prompt builder before writing any prompt-builder source code.

This phase is documentation-only.

It ensures that the future real prompt builder remains provider-neutral, privacy-preserving, and aligned with HouseFolio's L3 boundary:

- explain L2 comparison results
- summarize tradeoffs
- generate checklist-style suggestions
- never score, rank, filter, verify, or decide for the user

## Current stable baseline

Latest stable point before this phase:

- `201c6f9 docs: plan real ai provider implementation`

Confirmed baseline:

- `HEAD = origin/main = origin/HEAD = 201c6f9`
- `npm.cmd run build` passed
- `git status` clean
- Real AI provider is not implemented
- Real prompt builder is not implemented
- Mock AI chain remains stable
- Mock AI output remains session-only

## This phase does not implement

This phase must not implement or modify:

- Prompt builder source code
- DeepSeek provider
- Real provider adapter
- Real AI API route
- Compare UI
- AI confirmation UI
- AI output persistence
- AI output history
- Settings AI data rights section
- localStorage keys
- Supabase
- LBS
- L2 scoring, ranking, or filtering

No `src` file should be changed in this phase.

## Prompt builder position in architecture

The future prompt builder should sit inside:

- `src/lib/ai`

It should not live in:

- `src/components`
- `src/app/compare`
- `src/app/api` as inline prompt text
- `src/content/zh-cn.ts`
- any client component

Expected future file:

- `src/lib/ai/compare-explanation-prompt.ts`

Expected future contract check:

- `src/lib/ai/compare-explanation-prompt-contract-check.ts`

The prompt builder must be provider-neutral.

It should build a safe prompt payload from redacted structured input, but it should not call DeepSeek, read environment variables, call fetch, or know about route behavior.

## Input boundary

The prompt builder may only accept redacted structured data.

Allowed input source:

- `CompareExplanationInput`

The prompt builder must not accept:

- raw `Listing`
- raw `ComparisonModel` if it contains future expanded fields
- raw user notes
- raw localStorage values
- raw IndexedDB data
- raw route request body without validation
- photo or video objects
- provider-specific request shape

Correct future direction:

    CompareExplanationInput
    -> buildCompareExplanationPrompt(input)
    -> provider-neutral prompt payload
    -> provider adapter
    -> normalized CompareExplanationOutput

Wrong direction:

    Compare UI
    -> hand-written prompt string
    -> DeepSeek fetch directly

## Allowed field categories

The future prompt builder may use these redacted categories:

- listing neutral title or display label
- monthly rent
- area size
- layout
- district or coarse area label
- status label
- commute minutes
- commute source
- existing L2 reference score
- existing score breakdown
- missing field signals
- L2-generated risk flags
- non-identifying subjective summary signals
- has notes boolean
- has photos boolean
- photo count number
- comparison count
- static instruction context

Allowed subjective summaries must be short and non-identifying.

Examples of allowed subjective summaries:

- 采光较好
- 夜间可能偏吵
- 厨房偏小
- 通勤压力偏高
- 资料仍待补充
- 看房后主观印象较好
- 小区入口离地铁较远
- 装修状态需要复核

## Forbidden field categories

The future prompt builder must not include:

- full note text
- raw user notes
- full address
- precise workplace address
- precise school address
- door number
- room number
- building number
- unit number
- longitude
- latitude
- coordinates
- Amap raw route JSON
- Amap raw POI JSON
- request URL
- API key
- source platform raw page text
- source platform images
- photo Blob
- video Blob
- object URL
- base64 image data
- EXIF data
- phone number
- WeChat ID
- ID card number
- contract text
- landlord personal information
- agent personal information
- AI prompt history
- previous AI output history
- browser storage internals
- IndexedDB internal keys

If any of these fields appear in input, the prompt builder or upstream validator should reject or ignore them.

## Prompt instruction boundary

The future prompt must instruct the model to:

- explain tradeoffs
- summarize L2 comparison
- use conditional language
- mention uncertainty when data is incomplete
- explain missing fields
- explain L2 risk flags in human-readable language
- provide a checklist of next verification steps
- remain reference-only
- remind user to verify information independently

The prompt must instruct the model not to:

- score listings
- rank listings
- filter listings
- select a final option
- verify listing authenticity
- claim true-listing status
- claim safety guarantee
- override L2 reference score
- infer identity traits
- infer psychological profile
- use full-address reasoning
- use any unavailable information
- make claims beyond the provided structured data

## Output posture

Allowed output posture:

- 如果你更重视通勤稳定性，A 的压力较低。
- 如果你更重视面积和居住舒适度，B 可能值得继续看房。
- C 的资料缺口较多，建议补充后再比较。
- 当前信息不足以判断某些风险，需要继续核实。
- 以下是下一次看房或沟通时可以确认的问题。

Forbidden output posture:

- 系统推荐 A。
- A 是最佳房源。
- 你应该选择 A。
- 这套是真房源。
- 这套一定安全。
- 这套没有风险。
- 推荐分最高，所以直接选它。
- AI 已经帮你判断好了。

## Required output structure

The future prompt should ask the model to return content that can be normalized into the existing `CompareExplanationOutput` structure.

It should prefer structured sections such as:

- overview
- tradeoff summary
- commute analysis
- completeness notes
- risk signal explanation
- next-step checklist
- disclaimer

The output should not be free-form only.

The model should be instructed to avoid markdown tables in the first version unless the UI explicitly supports them.

The provider adapter or downstream normalizer should remain responsible for mapping model response into `CompareExplanationOutput`.

## Language boundary

HouseFolio's UI is Chinese-first.

Future prompt output should generally be Chinese.

The prompt should specify:

- use concise Chinese
- avoid legalistic or alarmist wording
- avoid platform-like recommendation wording
- avoid exaggerated certainty
- use renter-friendly explanation
- keep each section short enough for Compare UI

The prompt should not use:

- 最佳房源
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真
- 一定安全
- 官方结论

## Provider-neutral boundary

The prompt builder must not be DeepSeek-specific.

It should not include:

- DeepSeek endpoint
- model name
- API key
- provider request body fields
- provider headers
- fetch call
- timeout logic
- retry logic

Provider-specific shaping belongs to:

- `src/lib/ai/deepseek-provider.ts`

Prompt construction belongs to:

- `src/lib/ai/compare-explanation-prompt.ts`

## Error boundary

The prompt builder should be deterministic and side-effect-free.

It should not throw raw user data into errors.

If it rejects invalid input, future error messages should be safe and generic.

Allowed error categories:

- empty input
- unsupported listing count
- missing required comparison fields
- forbidden sensitive key detected
- prompt payload too large

Forbidden error details:

- full input body
- raw notes
- raw address
- raw prompt content
- provider request payload

## Size and cost boundary

The future prompt builder should keep payload small.

First version should:

- support 2–4 listings
- avoid raw notes
- avoid long prose input
- summarize missing fields and risk flags
- keep subjective summaries short
- avoid photo/video content
- avoid route JSON or POI JSON
- avoid sending duplicate fields

The prompt should not include entire ComparisonModel dumps if a smaller curated shape is enough.

## Contract check expectations

Future implementation should include a contract check file:

- `src/lib/ai/compare-explanation-prompt-contract-check.ts`

The contract check should confirm:

- prompt builder accepts `CompareExplanationInput`
- prompt payload does not expose forbidden field names
- prompt payload is provider-neutral
- prompt payload does not contain provider keys
- prompt payload does not contain raw notes
- prompt payload does not contain full address fields
- prompt payload does not contain coordinates
- prompt payload does not contain photo/video blob fields
- prompt payload includes instruction against ranking/recommendation/final decision wording

This can be enforced through TypeScript-level checks and static string checks where practical.

## Static search checklist after future implementation

After future prompt-builder implementation, run searches for:

- `fullNote`
- `noteText`
- `rawNote`
- `address`
- `doorNumber`
- `roomNumber`
- `buildingNumber`
- `unitNumber`
- `longitude`
- `latitude`
- `coordinate`
- `rawResponse`
- `requestUrl`
- `apiKey`
- `photoBlob`
- `videoBlob`
- `objectUrl`
- `base64`
- `DeepSeek`
- `NEXT_PUBLIC`
- `fetch(`
- `localStorage`
- `sessionStorage`

The presence of some words may be acceptable in contract-check forbidden lists, but they must not appear as real prompt payload fields.

## Relationship with existing mock provider

The future prompt builder should not break the mock provider chain.

Mock provider should remain available for:

- development fallback
- browser regression without API cost
- UI regression
- route contract testing

The future prompt builder may be introduced before DeepSeek provider exists.

That is intentional.

The prompt builder phase should prove that HouseFolio can construct safe real-provider input without yet sending it to any third-party model.

## Relationship with Settings

The prompt builder must not introduce AI persistence.

Therefore it must not require Settings changes.

Settings AI data rights coverage becomes necessary only if AI outputs, prompts, provider responses, or AI histories are persisted.

First real-provider version remains session-only.

## Relationship with L1 and L2

The prompt builder must preserve the three-layer boundary.

L1 remains responsible for:

- commute calculation
- LBS provider calls
- spatial data

L2 remains responsible for:

- reference score
- comparison model
- missing field detection
- risk flag generation
- sorting and filtering if implemented later

L3 prompt builder may only prepare explanation context.

It must not move L1 or L2 calculation into the model prompt.

## Proposed next phase

Recommended next phase:

- Phase 4D-20: Real prompt builder implementation

Phase 4D-20 may add provider-neutral source files, but must still avoid DeepSeek, route changes, UI changes, localStorage, Settings, and output persistence.

Expected future files:

- `src/lib/ai/compare-explanation-prompt.ts`
- `src/lib/ai/compare-explanation-prompt-contract-check.ts`
- `docs/dev-log/2026-05-15-phase-4d-20-real-prompt-builder.md`

## Result

Phase 4D-19 defines the real prompt builder boundary.

HouseFolio is not ready to call DeepSeek yet.

The project is ready for a provider-neutral prompt builder implementation only after this boundary is committed and pushed.