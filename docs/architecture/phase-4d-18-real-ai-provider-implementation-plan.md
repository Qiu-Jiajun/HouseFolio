# Phase 4D-18｜Real AI provider implementation plan

Date: 2026-05-15

## Goal

Create an implementation plan for future real AI provider integration after the preflight boundary review.

This phase is documentation-only.

It defines the sequence, file boundaries, validation standards, and rollback rules for introducing a real AI provider later, without implementing DeepSeek or any real provider in this phase.

## Current stable baseline

Latest stable point:

- `fcca360 docs: review real ai provider preflight`

Confirmed baseline:

- `HEAD = origin/main = origin/HEAD = fcca360`
- `npm.cmd run build` passed
- `git status` clean
- Mock AI route is stable
- Mock AI UI trigger is stable
- Mock AI output is session-only
- Real AI provider is not implemented

## This phase does not implement

This phase must not implement or modify:

- DeepSeek provider
- Real prompt builder
- Real provider API route
- Compare UI confirmation modal
- Compare UI real-AI trigger
- AI output persistence
- AI output history
- Settings AI data rights section
- localStorage keys
- Supabase
- Cloud persistence
- LBS
- L2 scoring, ranking, or filtering

No `src` file should be changed in this phase.

## Core implementation principle

Real AI provider integration must proceed by layers.

The correct direction is:

1. Confirm boundaries.
2. Plan file ownership.
3. Add provider-neutral contracts.
4. Add prompt boundary.
5. Add provider adapter behind `lib/ai`.
6. Add server-only route integration.
7. Add user confirmation UI.
8. Keep first output session-only.
9. Run browser regression.
10. Only consider persistence and Settings later.

The wrong direction is:

1. Add DeepSeek call directly in Compare UI.
2. Put provider key in client code.
3. Send raw notes or full addresses.
4. Save AI output before data-rights design.
5. Let AI rank or decide listings.

## Proposed phase sequence

### Phase 4D-19｜Real prompt builder boundary review

Type: documentation only.

Purpose:

- Define what the real prompt builder may and may not include.
- Confirm prompt receives only redacted structured data.
- Confirm prompt asks for explanation, not ranking or final recommendation.
- Confirm forbidden wording.
- Confirm output structure expectations.

Allowed file changes:

- `docs/architecture/phase-4d-19-real-prompt-builder-boundary-review.md`

Forbidden:

- No prompt builder code.
- No DeepSeek.
- No route.
- No UI.
- No localStorage.

Validation:

- Build passes.
- Git status clean.
- Document explicitly forbids raw notes, full addresses, coordinates, photo/video data, and recommendation wording.

### Phase 4D-20｜Real prompt builder implementation

Type: source implementation, but provider-neutral.

Purpose:

- Add a provider-neutral prompt builder that converts `CompareExplanationInput` into a safe prompt object.
- Do not call any real provider yet.
- Do not read environment variables.
- Do not fetch.
- Do not change UI.

Candidate files:

- `src/lib/ai/compare-explanation-prompt.ts`
- `src/lib/ai/compare-explanation-prompt-contract-check.ts`
- `docs/dev-log/2026-05-15-phase-4d-20-real-prompt-builder.md`

Expected exports:

- `buildCompareExplanationPrompt(input)`
- Possibly `CompareExplanationPromptPayload`

Contract requirements:

- Input must be `CompareExplanationInput`.
- Output must not contain forbidden sensitive keys.
- Output must include instructions that AI should explain, not rank or decide.
- Output must include reference-only disclaimer instruction.
- Output must instruct uncertainty when data is missing.

Forbidden:

- No DeepSeek.
- No provider key.
- No API route change.
- No UI change.
- No persistence.

Validation:

- `npm.cmd run build`
- Contract check compiles
- Static forbidden-key search passes
- Git status clean after commit

### Phase 4D-21｜DeepSeek provider boundary review

Type: documentation only.

Purpose:

- Review DeepSeek-specific provider boundaries before implementation.
- Confirm server-only key name.
- Confirm no `NEXT_PUBLIC` usage.
- Confirm request and response normalization.
- Confirm error normalization.
- Confirm rate/cost controls.
- Confirm no raw provider response is exposed.

Candidate file:

- `docs/architecture/phase-4d-21-deepseek-provider-boundary-review.md`

Questions to answer:

1. Which environment variable stores the key?
2. Which runtime is used?
3. Which model is used?
4. What request body is sent?
5. What response fields are used?
6. How are provider errors normalized?
7. How are timeouts handled?
8. What content is logged?
9. What content is never logged?
10. How do we confirm no key reaches the client?

Forbidden:

- No DeepSeek implementation.
- No prompt builder changes unless required by review.
- No UI.
- No route.
- No persistence.

### Phase 4D-22｜DeepSeek provider minimal implementation

Type: source implementation.

Purpose:

- Implement DeepSeek provider adapter behind `lib/ai`.
- It must not be imported by client components.
- It must not change Compare UI.
- It must not persist output.

Candidate files:

- `src/lib/ai/deepseek-provider.ts`
- `src/lib/ai/deepseek-provider-contract-check.ts`
- `src/lib/ai/provider.ts`
- `src/lib/ai/index.ts`
- `docs/dev-log/2026-05-15-phase-4d-22-deepseek-provider.md`

Expected behavior:

- Reads server-only env var.
- Accepts prompt payload from prompt builder.
- Calls provider from server-side context only.
- Returns normalized `CompareExplanationOutput`.
- Does not expose raw provider response.
- Does not expose request metadata.
- Does not expose key.
- Handles missing configuration safely.

Forbidden:

- No client import.
- No `NEXT_PUBLIC_DEEPSEEK`.
- No localStorage.
- No Settings.
- No output history.
- No photo/video model.
- No raw notes or full addresses.

Validation:

- `npm.cmd run build`
- Contract check confirms provider type boundaries
- Static search confirms no `NEXT_PUBLIC_DEEPSEEK`
- Static search confirms Compare UI does not import provider
- Static search confirms no raw provider response exported

### Phase 4D-23｜Real AI API route integration plan

Type: documentation first.

Purpose:

- Decide whether to extend the current mock route or add provider switching.
- Define the route-level boundary before changing implementation.
- Confirm first real route version remains session-only.

Candidate file:

- `docs/architecture/phase-4d-23-real-ai-api-route-integration-plan.md`

Recommended approach:

- Keep the route path stable:
  - `/api/ai/compare-explanation`
- Keep response shape stable:
  - success: `ok`, `provider`, `data`
  - error: `ok`, `error.code`, `error.message`
- Add server-side provider selection behind `lib/ai`, not in UI.
- Keep mock provider available for development fallback.

Questions to answer:

1. Should route use mock by default when env key is missing?
2. Should route support explicit provider mode?
3. Should route use DeepSeek only when configuration exists?
4. How to prevent client from choosing unsafe provider behavior?
5. How to preserve contract checks?
6. How to test without spending API cost?

### Phase 4D-24｜Real AI API route minimal implementation

Type: source implementation.

Purpose:

- Integrate real provider into internal API route safely.
- Preserve existing mock behavior if needed.
- Do not change UI yet, except possibly no visible change.

Candidate files:

- `src/app/api/ai/compare-explanation/route.ts`
- `src/app/api/ai/compare-explanation/route-contract-check.ts`
- `docs/dev-log/2026-05-15-phase-4d-24-real-ai-api-route.md`

Expected route behavior:

- Validates request body.
- Rejects forbidden sensitive keys.
- Builds prompt from redacted input.
- Calls provider through `lib/ai`.
- Returns normalized output.
- Handles missing provider config with safe error or mock fallback.
- Does not persist output.
- Does not log prompt or full request body.

Forbidden:

- No UI confirmation yet unless separately planned.
- No localStorage.
- No Settings.
- No history.
- No raw provider response.

Validation:

- `npm.cmd run build`
- Route contract check passes
- Smoke test with mock path passes
- Real provider smoke test is optional and must be controlled

### Phase 4D-25｜Real AI UI confirmation plan

Type: documentation first.

Purpose:

- Plan the user-facing confirmation step before real AI calls.
- Ensure copy is centralized.
- Ensure the user understands third-party AI call and session-only output.

Candidate file:

- `docs/architecture/phase-4d-25-real-ai-ui-confirmation-plan.md`

Questions to answer:

1. Is the confirmation inline or modal?
2. Is confirmation required every time or first time per page session?
3. What exact Chinese copy is shown?
4. How does UI distinguish mock from real AI?
5. How does UI show session-only behavior?
6. How does UI avoid recommendation wording?
7. How does UI expose provider error states safely?

### Phase 4D-26｜Real AI UI confirmation implementation

Type: source implementation.

Purpose:

- Add confirmation behavior to Compare UI before real provider call.
- Keep output session-only.
- Do not persist output.
- Do not modify Settings.

Candidate files:

- `src/components/compare-selected-listings-panel.tsx`
- `src/content/zh-cn.ts`
- possibly a small UI component if needed:
  - `src/components/compare-ai-confirmation.tsx`
- `docs/dev-log/2026-05-15-phase-4d-26-real-ai-ui-confirmation.md`

Expected behavior:

- User clicks AI button.
- Confirmation copy appears.
- User confirms.
- Request is sent.
- Button is disabled while pending.
- Safe error state appears if request fails.
- Output clears on refresh.
- No AI data is stored.

Forbidden:

- No localStorage.
- No Settings.
- No AI history.
- No ranking/selection behavior.

Validation:

- `npm.cmd run build`
- Browser regression
- localStorage AI key check returns empty
- Refresh clears output
- Console has no red runtime error

### Phase 4D-27｜Real AI browser regression

Type: manual regression and dev-log.

Purpose:

- Verify real AI provider path in browser.
- Confirm safe behavior and no persistence.

Candidate file:

- `docs/dev-log/2026-05-15-phase-4d-27-real-ai-browser-regression.md`

Manual checks:

- Portfolio opens.
- Select 2–4 listings.
- Navigate to Compare.
- CompareTable remains stable.
- AI confirmation appears.
- User can cancel before sending.
- User can confirm and trigger request.
- Loading state works.
- Output renders.
- Error state is safe if provider fails.
- Refresh clears output.
- Settings unchanged.
- localStorage AI-related key check returns empty.
- Console has no red runtime error.
- Output does not use forbidden wording.

### Phase 4D-28｜Real AI provider closing checkpoint

Type: dev-log.

Purpose:

- Close the first real AI provider integration.
- Confirm session-only boundary.
- Confirm no Settings change because no persistence exists.
- Confirm L3 remains explanation-only.

Candidate file:

- `docs/dev-log/2026-05-15-phase-4d-28-real-ai-provider-closing.md`

## File ownership plan

### `src/types`

Owns stable AI output and input domain contracts.

Already exists:

- `src/types/ai-compare-explanation.ts`
- `src/types/ai-compare-explanation-contract-check.ts`

Potential future additions should be minimal.

### `src/lib/ai`

Owns AI boundary and provider logic.

Existing:

- `src/lib/ai/provider.ts`
- `src/lib/ai/mock-provider.ts`
- `src/lib/ai/compare-explanation.ts`
- `src/lib/ai/compare-explanation-input.ts`
- `src/lib/ai/mock-provider-contract-check.ts`
- `src/lib/ai/index.ts`

Future:

- `src/lib/ai/compare-explanation-prompt.ts`
- `src/lib/ai/compare-explanation-prompt-contract-check.ts`
- `src/lib/ai/deepseek-provider.ts`
- `src/lib/ai/deepseek-provider-contract-check.ts`

Rules:

- Client components must not import provider adapters.
- Provider adapters must not import UI components.
- Prompt builder must not import UI components.
- Provider adapters must not return raw provider response to UI.
- Redacted input builder remains mandatory.

### `src/app/api/ai/compare-explanation`

Owns internal server route.

Existing:

- `src/app/api/ai/compare-explanation/route.ts`
- `src/app/api/ai/compare-explanation/route-contract-check.ts`

Rules:

- Route validates request shape.
- Route rejects forbidden keys.
- Route calls `lib/ai`.
- Route returns normalized response.
- Route does not persist output.
- Route does not expose secrets or raw provider data.

### `src/components`

Owns UI trigger, loading, confirmation, and output rendering.

Existing involved file:

- `src/components/compare-selected-listings-panel.tsx`

Rules:

- UI only calls internal API route.
- UI must not call provider SDK or external AI endpoint.
- UI must not contain provider key.
- UI must not build prompt directly.
- UI must not bypass redacted input builder.
- UI must not persist output.

### `src/content/zh-cn.ts`

Owns user-visible copy.

Future real AI copy should include:

- Confirmation notice.
- Third-party AI disclosure.
- Session-only notice.
- Reference-only disclaimer.
- Safe error messages.

Rules:

- Do not scatter user-facing Chinese copy across TSX files.
- Do not use recommendation-system wording.

### `src/lib/privacy/local-data.ts`

Should remain unchanged until AI output is persisted.

Since first real provider version remains session-only, this file should not change in the first implementation.

## Validation standards before real provider completion

Every source implementation phase must pass:

- `npm.cmd run build`
- `git status`
- relevant contract check compilation
- static forbidden-key checks where applicable
- no new localStorage key unless explicitly approved
- no Settings change unless persistence exists
- no client-side provider key
- no `NEXT_PUBLIC` AI key
- no UI direct provider call

Browser regression phases must verify:

- user-triggered only
- confirmation before real call
- safe loading state
- safe error state
- output renders
- output clears on refresh
- Settings unchanged
- localStorage AI key check empty
- no console red runtime error
- no forbidden wording

## Static search checklist for future implementation

Before committing any real provider implementation, run searches for dangerous patterns.

Suggested checks:

- `NEXT_PUBLIC_DEEPSEEK`
- `DEEPSEEK_API_KEY` in client files
- `fetch(` in Compare UI
- `deepseek` in `src/components`
- `localStorage` with AI-related keys
- `sessionStorage` with AI-related keys
- `prompt` in UI component
- `rawResponse`
- `requestUrl`
- `apiKey`
- `coordinate`
- `longitude`
- `latitude`
- `photoBlob`
- `videoBlob`
- `objectUrl`
- `base64`
- `fullNote`
- `noteText`
- `doorNumber`
- `roomNumber`
- `buildingNumber`

## Rollback rules

If any real provider phase fails:

- Revert only that phase's commit.
- Keep mock AI provider chain intact.
- Keep `/compare` usable without real AI.
- Do not remove stable CompareTable.
- Do not remove static explanation panel.
- Do not change local data schema to recover.
- Do not add persistence as a workaround.

Recommended rollback command pattern:

- `git revert <bad-commit>`

Avoid:

- force push
- reset shared history
- deleting unrelated docs
- rewriting previous stable phases

## Product boundary summary

Real AI provider integration is allowed only as L3 explanation.

It may:

- summarize L2 comparison
- explain tradeoffs
- explain risk flags
- generate checklist
- give conditional suggestions

It may not:

- rank listings
- score listings
- filter listings
- select final option
- verify listing truth
- claim best listing
- claim system recommendation
- replace user judgment

## Decision

Phase 4D-18 defines the future implementation plan.

HouseFolio should not implement DeepSeek directly after this phase unless the next planned boundary and implementation steps are followed.

Recommended immediate next phase:

- Phase 4D-19: Real prompt builder boundary review

This keeps the project aligned with:

- user-triggered AI
- redacted input
- server-only provider keys
- internal API route boundary
- session-only first output
- no Settings change before persistence
- L3 explanation-only positioning