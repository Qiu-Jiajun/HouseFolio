# Phase 4D-23｜Real AI API route integration plan

Date: 2026-05-15

## Goal

Plan how the existing mock AI API route can later integrate the real DeepSeek provider safely.

This phase is documentation-only.

It does not change the API route yet.

The purpose is to define route behavior, provider selection, error handling, configuration fallback, and validation rules before changing `/api/ai/compare-explanation`.

## Current stable baseline

Latest stable point before this phase:

- `a192b5a feat: add deepseek ai provider`

Confirmed baseline:

- `HEAD = origin/main = origin/HEAD = a192b5a`
- `npm.cmd run build` passed
- `git status` clean
- DeepSeek provider layer exists under `src/lib/ai`
- DeepSeek provider is not connected to route
- Compare UI still does not trigger real AI
- AI output remains session-only
- Settings is unchanged
- No AI-related localStorage key exists

## This phase does not implement

This phase must not implement or modify:

- `src/app/api/ai/compare-explanation/route.ts`
- Compare UI
- AI confirmation UI
- DeepSeek runtime route call
- localStorage keys
- Settings
- AI output persistence
- AI history
- Supabase
- cloud persistence
- L1 / LBS
- L2 scoring, ranking, or filtering

No `src` file should be changed in this phase.

## Current route state

Current route:

- `POST /api/ai/compare-explanation`

Current behavior:

- accepts `CompareExplanationInput`
- validates request body
- rejects sensitive forbidden keys
- calls mock provider
- returns normalized success or error response
- does not persist AI output
- does not read provider environment variables
- does not call DeepSeek
- does not call fetch / axios
- does not change Settings

Current response concept:

Success:

- `ok: true`
- `provider: "mock"`
- `data: CompareExplanationOutput`

Error:

- `ok: false`
- `error.code`
- `error.message`

This response shape should remain stable.

## Future route integration principle

The route should remain the single internal server boundary for Compare AI explanation.

Correct future chain:

Compare UI
-> `/api/ai/compare-explanation`
-> request validation
-> forbidden-key check
-> redacted input
-> prompt builder
-> provider selection inside server route / lib/ai
-> mock or DeepSeek provider
-> normalized `CompareExplanationOutput`
-> session-only UI output

Forbidden future chain:

Compare UI
-> DeepSeek provider
-> external DeepSeek endpoint

The route must hide provider-specific details from the client.

## Route path decision

The route path should remain:

- `/api/ai/compare-explanation`

Do not create a separate public route such as:

- `/api/ai/deepseek`
- `/api/deepseek`
- `/api/real-ai`
- `/api/provider/deepseek`

Reason:

- The UI should not depend on provider identity.
- The internal route should own provider selection.
- Future provider migration should not require Compare UI rewrite.
- Mock and real providers can share one normalized route contract.

## Provider selection decision

Provider selection should be server-controlled.

The client should not pass arbitrary provider behavior.

Recommended first implementation:

- Keep route path stable.
- Use server-side provider selection.
- If `DEEPSEEK_API_KEY` is configured and route is explicitly set to use real provider, call DeepSeek.
- If DeepSeek is not configured, return a safe configuration error or clearly marked mock fallback depending on chosen mode.

Open implementation choice:

### Option A: Strict real-provider mode

If route is configured for DeepSeek but `DEEPSEEK_API_KEY` is missing:

- return safe error
- do not silently call mock provider
- response provider remains absent or error-only

Pros:

- avoids pretending real AI worked
- clearer production behavior
- safer for compliance and user trust

Cons:

- requires configuration before real test

### Option B: Development mock fallback

If `DEEPSEEK_API_KEY` is missing:

- route may fall back to mock only in development
- response must say `provider: "mock"`
- UI must not call it real AI

Pros:

- easier development without DeepSeek account
- preserves local workflow

Cons:

- risk of confusing mock vs real if copy is unclear

Recommended decision:

- Production-like real provider path should use strict configuration.
- Development fallback is acceptable only if provider label remains truthful.
- The route must never return `provider: "deepseek"` when mock generated the output.

## Provider mode configuration

Do not let client freely select provider.

Possible future server-side setting:

- `AI_COMPARE_PROVIDER=mock`
- `AI_COMPARE_PROVIDER=deepseek`

This variable, if introduced, must be server-only.

Forbidden:

- `NEXT_PUBLIC_AI_COMPARE_PROVIDER`
- UI query parameter that changes provider
- request body field that lets browser choose `deepseek`
- localStorage setting that chooses provider

Initial recommendation:

- Keep provider selection server-side.
- Avoid adding public provider mode in UI.
- Use mock until real route is explicitly implemented and reviewed.

## DeepSeek key handling

DeepSeek key must remain server-only.

Expected key:

- `DEEPSEEK_API_KEY`

Forbidden:

- `NEXT_PUBLIC_DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_DEEPSEEK_KEY`
- `NEXT_PUBLIC_AI_API_KEY`

Route must not:

- return key
- log key
- expose key status details
- include key in error message
- serialize environment variables
- pass key to client

## Request validation boundary

The future route must continue to validate:

- request body is object
- `locale` is supported
- `generatedAt` exists
- `listings` is an array
- listing count is 2-4
- listing objects contain only allowed redacted fields
- forbidden sensitive keys are absent

Forbidden key categories must continue to include:

- raw note fields
- full address fields
- door / room / building / unit number
- coordinates
- longitude / latitude
- Amap raw JSON
- request URL
- API key
- photo / video blob
- object URL
- base64 image data
- EXIF
- phone / WeChat / ID card
- contract text
- landlord / agent personal information
- prompt history
- AI output history

If forbidden keys are found:

- reject request
- return safe error
- do not call mock or DeepSeek provider

## Prompt builder usage

Future route must use:

- `buildCompareExplanationPrompt(input)`

Route should not inline prompt text.

Provider adapter may transform provider-neutral prompt payload into provider-specific request format.

Forbidden:

- hand-written prompt string inside route
- prompt construction inside Compare UI
- direct use of raw request body as prompt
- adding raw notes or full address to prompt

## Response contract

The route response shape should stay stable.

Success response:

- `ok: true`
- `provider: "mock" | "deepseek"`
- `data: CompareExplanationOutput`

Error response:

- `ok: false`
- `error.code`
- `error.message`

Do not return:

- raw provider response
- provider request body
- provider response headers
- provider request URL
- API key status details
- prompt content
- stack trace
- original error object

## Error code plan

Future route may use safe error codes such as:

- `invalid_request`
- `forbidden_sensitive_fields`
- `unsupported_listing_count`
- `missing_provider_configuration`
- `provider_unavailable`
- `provider_timeout`
- `provider_rate_limited`
- `provider_invalid_response`
- `unknown_error`

User-facing messages should remain generic.

Examples:

- AI 服务暂时不可用，请稍后重试。
- 当前 AI 服务配置暂不可用。
- 本次输入信息不足，无法生成有效解释。
- 请求过于频繁，请稍后再试。
- 本次 AI 响应格式异常，请稍后重试。

## Session-only output boundary

The first real route integration must remain session-only.

Route must not:

- write localStorage
- write sessionStorage
- write IndexedDB
- write files
- write database rows
- write Supabase
- write AI history
- write prompt history
- write output history

Therefore, first real route integration should not modify:

- `src/lib/privacy/local-data.ts`
- Settings export
- Settings import
- Settings clear local data
- localStorage key registry
- IndexedDB schema

Settings AI data rights coverage becomes necessary only if AI artifacts are persisted later.

## Logging boundary

Route should avoid logging sensitive content.

Allowed logs, if any:

- safe provider name
- safe error code
- request duration
- provider configured boolean
- response parse success boolean

Forbidden logs:

- request body
- prompt messages
- raw provider response
- API key
- full address
- raw notes
- coordinates
- phone / WeChat
- source platform raw text
- photo / video metadata beyond count

For MVP, no provider logging is acceptable.

## Cost and rate-control boundary

First real route integration should minimize cost exposure.

Required behavior:

- one request per user click
- no route auto-retry
- no background pre-generation
- no generation on page load
- no batch generation
- no generation for more than 4 listings
- no photo/video model call
- no streaming in first version

Recommended UI behavior in a later phase:

- disable button while pending
- show safe loading state
- allow user cancellation before request via confirmation UI
- show safe error state

Route implementation may include:

- timeout
- safe provider error normalization
- no automatic retry

## Mock fallback decision

Recommended route plan:

### Before real UI confirmation exists

- keep route mock-only
- do not connect DeepSeek to browser-triggered flow yet

### After real route integration is implemented

- preserve mock provider for development
- add DeepSeek provider behind server-side provider selection
- response provider must be truthful

If missing key:

- strict mode: return safe configuration error
- dev fallback mode: return mock output with `provider: "mock"`

The route must not silently claim DeepSeek output when it used mock output.

## UI relationship

Phase 4D-23 does not change UI.

Future real route integration should also be cautious:

- route can be implemented before UI switches to real mode
- Compare UI confirmation should be separately planned and implemented
- real provider should not be triggered by current mock-labeled button without copy review

The current mock AI trigger should not become real AI silently.

A later UI phase must clearly distinguish:

- mock AI explanation
- real AI-assisted explanation
- session-only behavior
- third-party provider disclosure

## Expected future implementation file scope

Future Phase 4D-24 may modify:

- `src/app/api/ai/compare-explanation/route.ts`
- `src/app/api/ai/compare-explanation/route-contract-check.ts`
- possibly `src/lib/ai/compare-explanation.ts`
- docs/dev-log for implementation

Future Phase 4D-24 should not modify:

- Compare UI
- Settings
- localStorage registry
- privacy local-data registry
- LBS
- L2 algorithm
- photo/media storage

## Required checks after future route integration

Build:

- `npm.cmd run build`

Static search:

- `NEXT_PUBLIC_DEEPSEEK`
- `DEEPSEEK_API_KEY` in client files
- `deepseek-provider` in `src/components`
- `fetch(` in Compare UI
- `localStorage` with AI-related keys
- `sessionStorage` with AI-related keys
- `rawResponse`
- `requestUrl`
- `apiKey`
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

Route contract check should confirm:

- response provider is truthful
- response data is normalized
- raw provider response not exposed
- raw provider error not exposed
- request type remains redacted
- forbidden sensitive keys are rejected

## Development without DeepSeek account

The project can continue without a DeepSeek API account until real provider smoke testing.

Current user has not registered a DeepSeek API account.

That is acceptable because:

- provider layer exists but is not connected to UI
- route integration can still be planned
- mock provider can continue supporting local regression
- real provider smoke test can be delayed until `DEEPSEEK_API_KEY` exists

Do not block architecture planning on API account registration.

Do not claim real AI works until an API key exists and smoke test passes.

## Proposed next phase

Recommended next phase:

- Phase 4D-24: Real AI API route minimal integration

But it should be limited.

Phase 4D-24 may connect route to provider selection, but should not change Compare UI.

If no DeepSeek API key exists:

- route implementation may keep mock default
- DeepSeek path may remain configuration-gated
- no real smoke test should be claimed

## Result

Phase 4D-23 defines the real AI API route integration plan.

HouseFolio should not silently convert the current mock UI trigger into real AI.

The next implementation must preserve:

- stable route path
- request validation
- forbidden-key rejection
- truthful provider label
- server-only DeepSeek key
- normalized response shape
- session-only output
- no Settings change
- no localStorage AI key