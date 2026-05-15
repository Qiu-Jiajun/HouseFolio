# Phase 4D-20｜Real prompt builder implementation

Date: 2026-05-15

## Goal

Add a provider-neutral prompt builder for future real AI provider integration.

This phase adds source code, but it does not connect DeepSeek or any real provider.

## Scope

Changed files:

- `src/lib/ai/compare-explanation-prompt.ts`
- `src/lib/ai/compare-explanation-prompt-contract-check.ts`
- `src/lib/ai/index.ts`

Added dev-log:

- `docs/dev-log/2026-05-15-phase-4d-20-real-prompt-builder.md`

## What was implemented

Added `buildCompareExplanationPrompt(input)`.

The function:

- accepts `CompareExplanationInput`
- validates supported listing count
- builds provider-neutral prompt messages
- keeps output mapped to `CompareExplanationOutput`
- includes safety rules
- instructs the model to explain tradeoffs instead of ranking or deciding
- uses Chinese explanation instructions
- remains deterministic and side-effect-free

## What was not implemented

This phase did not implement:

- DeepSeek provider
- real provider adapter
- API route changes
- Compare UI changes
- AI confirmation UI
- localStorage keys
- Settings changes
- output persistence
- provider key handling
- fetch / axios calls
- process.env reads

## Boundary confirmation

The prompt builder stays inside `src/lib/ai`.

It does not live in a client component.

It does not call a model.

It does not import provider code.

It does not read browser storage.

It does not read environment variables.

It does not persist prompt or output.

## Contract check

Added `compare-explanation-prompt-contract-check.ts`.

The contract check confirms:

- prompt builder accepts `CompareExplanationInput`
- prompt payload avoids forbidden provider / storage / sensitive payload keys
- prompt output shape covers `CompareExplanationOutput`
- prompt roles remain provider-neutral

## Result

Phase 4D-20 adds a safe, provider-neutral prompt builder.

HouseFolio is still not connected to DeepSeek.

Recommended next phase:

- Phase 4D-21: DeepSeek provider boundary review