# Phase 4D-17｜Real AI provider preflight boundary review

Date: 2026-05-15

## Goal

Define the boundary for a future real AI provider integration before implementing DeepSeek, a real prompt builder, a real provider route, or any real AI UI behavior.

This phase is documentation-only.

It prevents HouseFolio from jumping directly from a stable mock AI explanation chain into a real third-party model call without first confirming privacy, architecture, product wording, trigger behavior, and data-rights boundaries.

## Stable baseline

Latest stable point before this phase:

- `cf30c02 docs: close mock ai ui trigger phase`

Confirmed baseline:

- Mock AI API route exists.
- Mock AI UI trigger exists.
- Mock AI browser regression passed.
- Mock AI output is user-triggered.
- Mock AI output is session-only.
- No AI-related localStorage key exists.
- Settings has no AI data section.
- Working tree was clean.

## Current stable mock AI chain

Current mock chain:

1. User opens Portfolio.
2. User selects 2–4 listings.
3. User navigates to `/compare?ids=...`.
4. Compare page reads local listings.
5. Compare page builds `ComparisonInput[]`.
6. Redacted compare explanation input is built.
7. User clicks mock AI trigger.
8. Client posts to `/api/ai/compare-explanation`.
9. API route calls mock provider only.
10. Mock AI output renders in Compare UI.
11. Refresh clears the output.

This chain is intentionally mock-only.

## This phase does not implement

This phase must not implement or modify:

- DeepSeek provider
- Real AI provider
- Real prompt builder
- Real AI API route
- Compare UI trigger behavior
- AI confirmation dialog
- AI output persistence
- AI output history
- Settings AI data section
- AI export or deletion
- localStorage keys
- Supabase
- Cloud persistence
- LBS provider
- L2 scoring, ranking, or filtering

No `src` file should be changed in this phase.

## Real AI provider must be user-triggered

A future real AI call must only happen after explicit user action.

Allowed trigger:

- User is already on `/compare?ids=...`.
- User has selected 2–4 listings.
- CompareTable is already visible.
- Static explanation is already visible.
- User clicks a clearly labeled AI assistance button.
- User sees a confirmation notice before the first real provider call.
- User confirms the action.

Not allowed:

- Auto-generate AI output on page load.
- Auto-generate AI output after selection.
- Auto-generate AI output after navigating to `/compare`.
- Background prefetch.
- Batch generation for all listings.
- Silent retry that sends data again without user awareness.

## Confirmation copy requirement

Before sending data to a real AI provider, the UI must show clear confirmation copy.

The copy must explain:

1. This is AI-assisted explanatory content.
2. Output is for reference only.
3. It does not replace the user's own judgment.
4. It does not verify listing authenticity.
5. It does not produce a final recommendation.
6. Redacted comparison data will be sent to a third-party AI provider.
7. The user should avoid sensitive information in notes.
8. The first real-provider version will not persist AI output.

Suggested Chinese copy direction:

本次 AI 辅助解释会基于已脱敏的房源对比数据生成参考说明。AI 不会替你决定，不会验证房源真实性，也不代表系统推荐。请勿输入或保存身份证号、手机号、微信号、具体门牌号、合同原文等敏感信息。当前版本不会保存 AI 输出，刷新页面后结果会消失。

If implemented later, this copy must be centralized in `src/content/zh-cn.ts`.

## Allowed data sent to real provider

The first real provider version may only send redacted structured data based on the existing compare explanation input.

Allowed categories:

- Listing neutral title or display label
- Monthly rent
- Area size
- Layout
- District or coarse area label
- Status label
- Commute minutes
- Commute source
- Existing L2 reference score
- Existing score breakdown
- Missing field signals
- L2-generated risk flags
- Non-identifying subjective summary signals
- Has notes boolean
- Has photos boolean
- Photo count number
- Static comparison context needed to explain tradeoffs

Allowed subjective content must be short, non-identifying, and decision-relevant, such as:

- 采光较好
- 夜间可能偏吵
- 厨房偏小
- 通勤压力偏高
- 资料仍待补充
- 看房后主观印象较好

## Forbidden data sent to real provider

The real provider input must not include:

- Full note text
- Raw user notes
- Full address
- Door number
- Room number
- Building number
- Unit number
- Longitude
- Latitude
- Coordinates
- Amap raw route JSON
- Amap raw POI JSON
- Request URL
- API key
- Source platform raw page text
- Source platform images
- Photo Blob
- Video Blob
- Object URL
- Base64 image data
- EXIF data
- Phone number
- WeChat ID
- ID card number
- Contract text
- Landlord or agent personal information
- User's precise workplace or school address
- AI prompt history
- Previous AI output history

Real AI provider integration must continue to rely on the redacted input builder and must not bypass it from UI code.

## Server-side key boundary

Any real provider key must be server-side only.

Required boundary:

- Key may exist only in `.env.local` or deployment environment variables.
- Key must not use a `NEXT_PUBLIC_` prefix.
- Client components must not import provider code directly.
- Compare UI must call an internal API route.
- The internal API route must call `lib/ai`.
- `lib/ai` must call the provider.
- The provider must never return secrets, request URLs, raw provider responses, or debugging payloads to the client.

Expected future chain:

Compare UI
-> internal API route
-> redacted input validation
-> lib/ai real provider
-> normalized CompareExplanationOutput
-> session-only UI output

Forbidden chain:

Compare UI
-> DeepSeek SDK or fetch directly

## Real API route boundary

A future real API route must:

- Accept only the validated redacted input shape.
- Reject requests containing forbidden sensitive keys.
- Reject empty comparison input.
- Reject unsupported listing counts.
- Return a normalized success response.
- Return safe error codes.
- Avoid returning raw provider errors.
- Avoid returning raw provider response.
- Avoid returning provider request metadata.
- Avoid logging prompt content.
- Avoid logging full request body.
- Avoid persisting AI output.

Safe success shape should stay conceptually close to:

- `ok: true`
- `provider: "deepseek"` or equivalent provider id
- `data: CompareExplanationOutput`

Safe error response should expose only:

- `ok: false`
- `error.code`
- `error.message`

## Prompt boundary

The real prompt builder must be a separate reviewed step.

It must not be introduced in this phase.

When introduced later, the real prompt builder must:

- Use only redacted structured data.
- Avoid raw notes.
- Avoid full addresses.
- Avoid coordinates.
- Avoid photo or video data.
- Ask the model to explain tradeoffs, not rank final choices.
- Instruct the model not to claim authenticity verification.
- Instruct the model not to use "best listing", "system recommendation", or "final decision" wording.
- Require conditional framing.
- Require reference-only disclaimer.
- Require uncertainty when data is missing.
- Avoid psychological profiling or identity inference.

Allowed output posture:

- 如果你更重视通勤稳定性，A 的压力较低。
- 如果你更重视面积和居住舒适度，B 可能值得继续看房。
- C 的资料缺口较多，建议补充后再比较。

Forbidden output posture:

- 系统推荐 A。
- A 是最佳房源。
- 你应该选择 A。
- 这套是真房源。
- 这套一定安全。
- 推荐分最高，所以直接选它。

## Session-only output boundary

The first real provider version should remain session-only.

It should not persist AI output.

Therefore the first real provider version should not modify:

- `src/lib/privacy/local-data.ts`
- Settings local data export
- Settings local data import
- Settings clear local data
- Any localStorage key registry
- IndexedDB schema
- Supabase schema

Settings AI data rights coverage becomes necessary only if AI artifacts are persisted.

If output remains session-only:

- Refresh clears AI output.
- Export does not include AI output.
- Clear local data does not need AI-specific logic.
- No AI history section is needed in Settings.

## Error handling boundary

Real provider errors must be user-safe.

Allowed user-facing error categories:

- AI 服务暂时不可用，请稍后重试。
- 本次输入信息不足，无法生成有效解释。
- 请求过于频繁，请稍后再试。
- 当前网络不稳定，请稍后重试。
- 服务配置暂不可用。

Forbidden user-facing error details:

- Raw provider stack trace
- Full provider error body
- API key status details
- Request URL
- Prompt text
- Raw input payload
- Model internal response

Developer diagnostics may use safe error codes, but raw provider details must not appear in UI.

## Cost and rate-control boundary

Before real provider implementation, a minimal control plan is required.

First version should consider:

- One request per user click.
- Disable button while request is pending.
- No auto retry.
- No background generation.
- Optional simple client-side cooldown.
- Optional server-side lightweight request guard.
- No batch processing.
- No generation for more than 4 listings.
- No photo or video model invocation.
- No streaming requirement in the first version.

The first real provider version should prefer a simple non-streaming response unless streaming is separately reviewed.

## Product wording boundary

Real AI output must remain L3 explanation.

Allowed wording:

- AI 辅助解释
- 参考说明
- 条件化建议
- 决策提示
- 待补充信息
- 风险信号解释
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

## Relationship with L1 and L2

A real AI provider must not move L1 or L2 work into L3.

L1 remains responsible for:

- Commute calculation
- LBS provider calls
- Spatial relation data
- Map or POI data if introduced later

L2 remains responsible for:

- Reference score
- Sorting
- Filtering
- Comparison model
- Missing field detection
- Risk flag detection
- Rule-based structure

L3 may only:

- Summarize
- Explain
- Rephrase
- Provide checklist
- Explain tradeoffs
- Explain L2 risk flags in human-readable language
- Give conditional suggestions

L3 must not:

- Calculate commute
- Recalculate score
- Sort listings
- Filter listings
- Verify listing truth
- Decide final choice
- Override L2

## Required questions before implementation

Before any real AI provider implementation, the implementation plan must answer:

1. What exact button or user action triggers the real AI call?
2. What confirmation copy appears before the first call?
3. Which fields are included in the redacted input?
4. Which fields are explicitly forbidden?
5. Where is the provider key stored?
6. Which API route calls `lib/ai`?
7. Which file owns the provider adapter?
8. Which file owns the prompt builder?
9. Which file validates the request shape?
10. Which file validates forbidden keys?
11. How are provider errors normalized?
12. Why does the first version remain session-only?
13. Why Settings remains unchanged in the first real-provider version?
14. How is rate and cost controlled?
15. How does the UI avoid recommendation-system wording?
16. How does implementation prevent UI code from bypassing redaction?

## Proposed next phase

Recommended next phase:

- Phase 4D-18: Real AI provider implementation plan

Phase 4D-18 should still be planning-first.

It must not directly implement DeepSeek unless the implementation plan is explicitly approved.

Possible later sequence:

1. Phase 4D-18: Real AI provider implementation plan.
2. Phase 4D-19: Real prompt builder boundary review.
3. Phase 4D-20: Real prompt builder implementation.
4. Phase 4D-21: DeepSeek provider boundary review.
5. Phase 4D-22: DeepSeek provider minimal implementation.
6. Phase 4D-23: Real API route integration.
7. Phase 4D-24: Real AI UI confirmation and trigger.
8. Phase 4D-25: Browser regression and cost/error checks.

This sequence may be adjusted, but DeepSeek must not be connected without explicit boundary review.

## Result

Phase 4D-17 defines the real AI provider preflight boundary.

HouseFolio is not ready for direct DeepSeek implementation yet.

The project is ready for a separate real AI provider implementation plan, with strict preservation of:

- User-triggered AI calls
- Redacted structured input
- Server-only provider key
- Internal API route boundary
- Session-only output
- No Settings change until persistence exists
- L3 as explanation layer only
- Reference-only and non-recommendation wording