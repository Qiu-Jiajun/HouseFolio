# Phase 4D-22｜DeepSeek provider minimal implementation

Date: 2026-05-15

## Goal

Add a minimal DeepSeek provider adapter behind `lib/ai`.

This phase implements provider-layer code only.

## Scope

Changed files:

- `src/lib/ai/provider.ts`
- `src/lib/ai/deepseek-provider.ts`
- `src/lib/ai/deepseek-provider-contract-check.ts`

Added dev-log:

- `docs/dev-log/2026-05-15-phase-4d-22-deepseek-provider.md`

## What was implemented

Added `createDeepSeekCompareExplanationProvider()` and `deepSeekCompareExplanationProvider`.

The provider:

- lives under `src/lib/ai`
- uses `CompareExplanationInput`
- builds provider-neutral prompt payload through `buildCompareExplanationPrompt`
- calls DeepSeek chat completions endpoint only when provider is explicitly used
- reads `DEEPSEEK_API_KEY` only inside provider-layer code
- normalizes model response into `CompareExplanationOutput`
- returns safe provider-layer errors
- does not expose raw DeepSeek response
- does not persist AI output

## Model and endpoint

Current official DeepSeek API docs show:

- base URL: `https://api.deepseek.com`
- chat completions path: `/chat/completions`
- model names include `deepseek-v4-flash` and `deepseek-v4-pro`
- JSON Output is supported through `response_format: { type: "json_object" }`

The first provider-layer implementation defaults to:

- `deepseek-v4-flash`
- non-streaming response
- thinking disabled
- JSON output

## What was not implemented

This phase did not:

- change `/api/ai/compare-explanation`
- connect Compare UI to DeepSeek
- add AI confirmation UI
- add output persistence
- add AI history
- add localStorage keys
- modify Settings
- modify privacy local-data registry
- add Supabase or cloud storage
- add browser-visible provider selection

## Boundary confirmation

The provider is not imported by Compare UI.

The provider is not connected to the API route yet.

The mock provider chain remains stable.

The first real provider usage still requires separate route integration and UI confirmation phases.

## Result

Phase 4D-22 adds a minimal DeepSeek provider adapter behind `lib/ai`.

HouseFolio is still not triggering real AI from the browser.

Recommended next phase:

- Phase 4D-23: Real AI API route integration plan