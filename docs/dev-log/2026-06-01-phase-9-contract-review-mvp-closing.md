# HouseFolio Phase 9 Contract Review MVP Closing Checkpoint

This document closes the Phase 9 text-only rental-contract risk-warning MVP. It records the stable point, product boundary, final architecture, completed implementation inventory, privacy safeguards, mock-only browser regression result, deferred backlog, and freeze line for the Phase 9 closure.

## Stable Point

- Commit: `d23053c0bdfdd2d872d2bb1979e28a761ac92a17`
- Subject: `docs: record phase 9m r6 browser regression`

This is the verified stable point before the Phase 9 overall closing docs commit.

## Product Positioning

HouseFolio remains:

- A local-first private rental decision-management tool for renters in mainland China.
- Not a housing-listing platform.
- Not an agency platform.
- Not a listing aggregation platform.
- Not a listing-verification platform.
- Not an AI lawyer.
- Not a legal-conclusion generator.
- Not a litigation, complaint, arbitration, or compensation tool.

The Phase 9 feature is:

- A pre-signing rental-contract risk-warning assistant.
- A common-risk signal detector.
- A plain-language explanation assistant.
- A signing-preparation checklist assistant.

## Phase 9 User Value

Phase 9 helps renters:

- Notice clauses worth questioning.
- Understand practical consequences.
- Prepare pre-signing questions.
- Identify wording that should be clarified.
- Prepare safer wording directions.
- Obtain negotiation-script references.
- Make a more informed independent decision.

Clarifications:

- 事前规避 > 事后维权.
- Human-readable explanation > legalistic tables.
- High-risk detail > equal treatment of every minor issue.
- Rule basis > unrestricted model improvisation.

## Final Architecture

### L1: Input, Segmentation and Redaction

- User-pasted text only.
- Local normalization.
- Local clause segmentation.
- Local redaction.
- Complete redacted preview before sending.
- Original unredacted contract text is not uploaded.

### L2: Rules, Risk Levels and Legal-Basis Mapping

- Deterministic rule signals.
- `riskId`.
- L2-owned `riskLevel`.
- Legal-basis mapping.
- Rules are signals, not an AI visibility gate.
- `ruleSignals = []` must still allow full-contract AI-assisted review.

### L3: AI Explanation

- Plain-language explanation.
- Signing questions.
- Safer wording directions.
- Negotiation-script suggestions.
- Supplemental attention items without `riskLevel`.
- No legal conclusions.
- No risk-level overrides.
- No `reasoning_content` exposure.

## Final Full-Redacted Flow

```text
user pastes complete contract
-> browser locally segments all clauses
-> browser locally redacts all clauses
-> browser scans local rule signals
-> user views complete redacted preview
-> user explicitly confirms once
-> upload full redacted clauses + signals
-> server performs defensive re-redaction and canonical validation
-> provider produces structured explanation
-> UI displays rule-signal explanations + supplemental attention items
-> session-only results
-> clear and refresh remove AI output
```

## Completed Implementation Inventory

- `/contract-review` page.
- Contract text paste input.
- Clause segmentation.
- Seed risk rules.
- Risk matcher.
- Deterministic rule ordering.
- Legal-basis seeds.
- Legal-basis mapping.
- Legal-basis resolver.
- Structured review model.
- AI-safe input builder.
- Full-redacted input builder.
- Server-side route guard.
- Request-size limits.
- `Cache-Control: no-store`.
- Explicit mock / deepseek provider selector.
- Deterministic mock provider.
- DeepSeek provider with reasoning isolation.
- Full-redacted UI integration.
- Confirmation preview.
- Structured result display.
- Clear-current-result behavior.
- Text-change invalidation.
- Fresh confirmation on regeneration.
- Session-only non-persistence.
- Browser regression checkpoint.

## Completed P0 Privacy Safeguards

- Phone masking.
- ID-card masking.
- Bank-card masking.
- Email masking.
- Structured name masking.
- Constrained observed rental-context name masking.
- Precise building / unit / room-level address masking.
- Server-side defensive re-redaction.
- Negative fixtures preventing ordinary obligation text from being erased.
- No surname-enumeration strategy.
- No global arbitrary-Chinese-token masking.
- Coarse locality may remain readable.

Automatic redaction is conservative, best-effort, and defense-in-depth. It is not a guarantee that all PII expressions will be detected.

## Completed Mock-Only Browser Regression

The mock-only browser regression passed:

- Page loads.
- Chinese text renders correctly.
- Full-redacted preview is readable.
- Observed name, phone, and precise room-detail leak is fixed.
- Coarse locality remains readable.
- No request before confirmation.
- Exactly one POST per explicit confirmation.
- HTTP 200 from mock-only route.
- Deterministic L2 signals displayed.
- L2 `riskLevel` preserved.
- Supplemental attention items shown separately without `riskLevel`.
- `reasoning_content` not visible.
- Text changes invalidate prior preview and AI output.
- Regeneration requires a fresh confirmation.
- Clearing results works.
- Refresh removes session-only output.
- Refresh does not automatically POST.
- No unexpected contract-review history appears.

## Explicitly Deferred Non-Blocking Backlog

### Phase 9.1 Privacy and UX Hardening Backlog

- Standalone title such as `房屋租赁合同` may still segment as a clause.
- Generic landline-number hardening.
- Ambiguous isolated role-colon names such as `甲方：张三`.
- Ambiguous bare-name coverage.
- Broader address-expression hardening.
- Optional stronger user-visible reminder to manually remove sensitive information before submission.
- Optional report export.
- Optional local contract-review history.
- Settings coverage only if persistence is introduced later.

### Phase 10 Input Enhancement Backlog

- OCR provider boundary review.
- OCR provider selection.
- Single contract-photo OCR.
- User correction of OCR text before review.
- Multi-page PDF evaluation.
- Contract-photo upload evaluation.

### Out-of-Scope

- Supabase.
- Cloud contract history.
- Large legal RAG.
- Nationwide policy auto-adaptation.
- Chrome extension.
- Deployment expansion.
- UI redesign.
- Lawyer review workflow.
- Automated complaint.
- Automated litigation.
- Automated compensation.

## Freeze Line

Only reopen Phase 9 implementation for new P0 blockers such as:

- Obvious original PII leakage.
- Networking before confirmation.
- Mock path invoking DeepSeek.
- Silent fallback to mock on misconfiguration.
- AI overriding L2 `riskLevel`.
- No-rule contracts unable to continue review.
- Session-only output accidentally persisting.
- `reasoning_content` exposure.
- Core page failure.

All non-P0 improvements must remain deferred.

## Closing Decision

- Phase 9M-R is closed.
- Phase 9 text-only contract-risk-warning MVP is ready to close.
- No further feature implementation should occur before the Phase 9 closing docs commit.
- After this docs-only checkpoint is reviewed and committed, Phase 9 is complete.
- The next product phase is Phase 10 OCR input enhancement review.
- Do not begin Phase 10 implementation automatically.
