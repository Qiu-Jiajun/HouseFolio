# Phase 4D-21｜DeepSeek provider boundary review

Date: 2026-05-15

## Goal

Review the DeepSeek provider boundary before implementing any DeepSeek adapter.

This phase is documentation-only.

It defines how a future DeepSeek provider may be introduced behind `lib/ai` while preserving HouseFolio's privacy, architecture, product, and compliance boundaries.

## Current stable baseline

Latest stable point before this phase:

- `9203414 feat: add real ai prompt builder`

Confirmed baseline:

- `HEAD = origin/main = origin/HEAD = 9203414`
- `npm.cmd run build` passed
- `git status` clean
- provider-neutral prompt builder exists
- mock provider chain remains stable
- DeepSeek provider is not implemented
- real API route integration is not implemented
- Compare UI still uses current mock trigger behavior
- AI output remains session-only

## This phase does not implement

This phase must not implement or modify:

- DeepSeek provider source code
- real provider fetch call
- provider environment variables
- route behavior
- Compare UI
- AI confirmation UI
- AI output persistence
- AI output history
- Settings AI data rights section
- localStorage keys
- Supabase
- cloud persistence
- LBS provider
- L2 scoring, ranking, or filtering

No `src` file should be changed in this phase.

## DeepSeek provider position in architecture

Future DeepSeek provider code must live behind:

- `src/lib/ai`

Expected future file:

- `src/lib/ai/deepseek-provider.ts`

Expected future contract check:

- `src/lib/ai/deepseek-provider-contract-check.ts`

Future provider should be called only by server-side code through the AI boundary.

Allowed future chain:

Compare UI
-> internal API route
-> validated redacted input
-> provider-neutral prompt builder
-> `lib/ai/deepseek-provider.ts`
-> normalized `CompareExplanationOutput`
-> session-only UI output

Forbidden future chain:

Compare UI
-> DeepSeek SDK or `fetch` directly

## Provider name and type boundary

Current provider type only supports:

- `mock`

A future DeepSeek implementation may require extending:

- `CompareExplanationProviderName`

from:

- `"mock"`

to:

- `"mock" | "deepseek"`

This must be done deliberately.

It must not imply that client UI can choose arbitrary provider behavior.

Provider selection should remain server-controlled.

## Server-only environment variable boundary

The DeepSeek API key must be server-side only.

Recommended environment variable name:

- `DEEPSEEK_API_KEY`

Forbidden environment variable names:

- `NEXT_PUBLIC_DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_DEEPSEEK_KEY`
- `NEXT_PUBLIC_AI_API_KEY`
- any `NEXT_PUBLIC_*` key for provider credentials

Rules:

- DeepSeek key may exist only in `.env.local` or deployment environment variables.
- The key must never be imported into a client component.
- The key must never be serialized into API response.
- The key must never be logged.
- The key must never be included in error messages.
- The key must never appear in `src/content/zh-cn.ts`.
- The key must never be referenced by Compare UI.

## Runtime and route boundary

A future DeepSeek provider should be called only from server-side runtime.

Future API route:

- should remain under `/api/ai/compare-explanation`
- should validate request body
- should reject forbidden sensitive keys
- should build prompt through `lib/ai/compare-explanation-prompt`
- should call provider through `lib/ai`
- should return normalized output
- should not expose raw provider response

The route must not:

- return provider request URL
- return provider request body
- return raw response JSON
- return response headers
- return API key status details
- return stack trace
- log prompt content
- log full request body
- persist AI output

## Prompt boundary

DeepSeek provider must consume only the provider-neutral prompt payload created by:

- `buildCompareExplanationPrompt(input)`

The provider must not build prompt text directly from UI data.

The provider must not accept:

- raw `Listing`
- raw localStorage data
- raw notes
- full address
- coordinate
- photo or video payload
- source platform raw page text
- provider-unvalidated request body

The provider may transform the provider-neutral prompt payload into a DeepSeek request format, but this transformation must not add new user data.

## Allowed provider input

Allowed input to DeepSeek should be limited to:

- provider-neutral prompt messages
- expected output shape instructions
- safety rules
- language instruction
- short structured listing comparison facts already present in `CompareExplanationInput`

The provider input may include:

- rent
- area
- layout
- coarse district or area label
- commute minutes
- commute source
- L2 reference score
- L2 score summary
- missing field signals
- L2 risk flags
- non-identifying subjective summaries
- has notes boolean
- has photos boolean
- photo count number

## Forbidden provider input

DeepSeek input must not include:

- full user note text
- full address
- door number
- room number
- building number
- unit number
- precise workplace address
- precise school address
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

## Request format boundary

The future DeepSeek provider may construct a request body from the prompt payload.

The request body should include only what the provider requires, such as:

- model
- messages
- response format or instruction
- temperature or similar generation setting if needed

The request body must not include:

- raw HouseFolio storage keys
- user browser metadata
- cookies
- session identifiers
- analytics identifiers
- raw listing object
- raw ComparisonModel dump
- photos
- videos
- coordinates
- precise address

## Response normalization boundary

DeepSeek provider must normalize response into:

- `CompareExplanationOutput`

It must not return raw DeepSeek response to the API route caller.

Allowed normalized fields remain:

- `summary`
- `tradeoffs`
- `commuteNotes`
- `riskExplanations`
- `missingFieldNotes`
- `checklist`
- `disclaimer`

If provider response is malformed, the provider should return or throw a safe normalized error. It should not leak raw response body.

## Error normalization boundary

Future DeepSeek errors must be normalized.

Allowed user-safe error categories:

- AI service unavailable
- provider configuration missing
- request timeout
- rate limited
- invalid model response
- insufficient input
- unknown safe failure

User-facing messages should be generic.

Allowed Chinese directions:

- AI 服务暂时不可用，请稍后重试。
- 当前 AI 服务配置暂不可用。
- 本次响应格式异常，请稍后重试。
- 请求过于频繁，请稍后再试。
- 当前网络不稳定，请稍后重试。

Forbidden error exposure:

- raw DeepSeek error body
- API key status details
- request URL
- request headers
- raw prompt
- raw input payload
- stack trace
- model internals

## Logging boundary

Future provider code must avoid logging sensitive content.

Allowed logs, if any:

- provider name
- safe error code
- request duration
- whether configuration exists as boolean
- response parse success or failure as boolean

Forbidden logs:

- API key
- prompt text
- raw messages
- full request body
- full response body
- full address
- raw notes
- phone or WeChat
- coordinates
- source platform raw text
- photo or video metadata beyond count

For MVP, it is acceptable to avoid provider logging entirely.

## Timeout and retry boundary

First DeepSeek provider version should be simple.

Recommended:

- use one request per user click
- no background retry
- no automatic repeated generation
- route-level timeout if practical
- safe timeout error
- no streaming in first version
- disable UI button while pending

Not recommended in first version:

- streaming response
- multi-provider fallback
- automatic retry
- background pre-generation
- batch generation
- generation for more than 4 listings
- photo/video model call

## Cost and rate-control boundary

First DeepSeek provider version should minimize cost exposure.

Required principles:

- only user-triggered
- only 2–4 listings
- no photos
- no videos
- no raw notes
- no route JSON
- no POI JSON
- no background calls
- no automatic retry
- no persistence loop
- no generate-on-load

Optional later controls:

- simple cooldown
- basic server-side request guard
- daily usage counter if accounts exist later
- cost dashboard if the product becomes public

Current Phase 4D should not introduce account-based quota or cloud tracking.

## Mock fallback boundary

Mock provider should remain available.

Open question for implementation plan:

- Should missing `DEEPSEEK_API_KEY` return a safe configuration error?
- Or should development mode fall back to mock provider?

Initial recommendation:

- route should not silently pretend real AI succeeded if DeepSeek is not configured
- development fallback may be allowed only if UI clearly indicates mock provider
- provider field in response must remain truthful

Allowed provider labels:

- `mock`
- `deepseek`

Not allowed:

- returning `provider: "deepseek"` when mock generated the output

## Client boundary

Client components must not import:

- `deepseek-provider`
- DeepSeek SDK
- provider keys
- provider request builders
- provider-specific response types

Client components may only:

- build or receive redacted compare explanation input
- call internal API route
- render loading state
- render safe error state
- render normalized `CompareExplanationOutput`
- clear output on refresh

Client components must not:

- call DeepSeek directly
- build provider-specific prompt
- persist AI output
- write AI localStorage keys
- expose prompt text for debugging

## Settings boundary

DeepSeek integration alone does not require Settings changes if output remains session-only.

Do not modify:

- `src/lib/privacy/local-data.ts`
- Settings export
- Settings import
- Settings clear data
- localStorage key registry

Settings AI data rights coverage becomes necessary only if AI artifacts are persisted later.

Artifacts include:

- AI output
- AI prompt
- provider response
- AI history
- saved AI report
- user-labeled AI decision note

First DeepSeek version should avoid all of these.

## Compliance and product wording boundary

DeepSeek output remains L3 explanation.

Allowed wording:

- AI 辅助解释
- 参考说明
- 条件化建议
- 风险信号解释
- 待补充信息
- 下一步核实清单
- 不代表最终推荐
- 请自行核实

Forbidden wording:

- 系统推荐
- 推荐分
- 最佳房源
- 最优选择
- 替你决定
- 真房源
- 避坑保真
- 一定安全
- 官方结论

The provider prompt must explicitly prohibit recommendation-system wording.

## Security checklist before implementation

Before implementing DeepSeek provider, confirm:

- no `NEXT_PUBLIC_DEEPSEEK_API_KEY`
- no provider key in client code
- no provider import in `src/components`
- no DeepSeek call in Compare UI
- no raw notes in prompt payload
- no full address in prompt payload
- no coordinate in prompt payload
- no photo/video payload in prompt payload
- no raw provider response returned
- no AI localStorage key
- no Settings change
- build passes

## Static search checklist after implementation

Future DeepSeek implementation must run searches for:

- `NEXT_PUBLIC_DEEPSEEK`
- `DEEPSEEK_API_KEY`
- `deepseek-provider` in `src/components`
- `fetch(` in Compare UI
- `localStorage` with AI-related names
- `sessionStorage` with AI-related names
- `rawResponse`
- `requestUrl`
- `apiKey`
- `Authorization`
- `fullNote`
- `noteText`
- `fullAddress`
- `doorNumber`
- `roomNumber`
- `buildingNumber`
- `unitNumber`
- `longitude`
- `latitude`
- `coordinate`
- `photoBlob`
- `videoBlob`
- `objectUrl`
- `base64`

Some terms may appear in contract-check forbidden lists, but they must not appear as real data payload fields.

## Proposed implementation sequence after this review

Recommended next phase:

- Phase 4D-22: DeepSeek provider minimal implementation

But implementation should remain limited to provider-layer code only.

Phase 4D-22 should not modify:

- route
- Compare UI
- Settings
- localStorage
- prompt builder behavior unless necessary

Expected future files:

- `src/lib/ai/deepseek-provider.ts`
- `src/lib/ai/deepseek-provider-contract-check.ts`
- possibly `src/lib/ai/provider.ts`
- possibly `src/lib/ai/index.ts`
- `docs/dev-log/2026-05-15-phase-4d-22-deepseek-provider.md`

## Result

Phase 4D-21 defines the DeepSeek provider boundary.

HouseFolio may proceed to a minimal provider-layer implementation only after this document is committed and pushed.

The next implementation must keep DeepSeek behind `lib/ai`, keep keys server-only, preserve session-only output, and avoid any route or UI change unless separately reviewed.