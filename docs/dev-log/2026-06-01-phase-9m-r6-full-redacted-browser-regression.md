# HouseFolio Phase 9M-R6 Full-Redacted Contract Review Browser Regression

This closing checkpoint records the completed mock-only browser regression for the full-redacted contract-review UI. It captures the stable point, runtime mode, privacy harness expectations, observed browser behavior, P0 hotfix outcome, and deferred follow-up backlog for Phase 9M-R6 closure.

## Stable Point

- Commit: `3522042362d6865bd4777d170e3a7e3646b9d496`
- Subject: `fix: harden contract review pii redaction`

## Runtime Mode

- The dev server was launched manually with a process-level environment variable only.
- Selector: `CONTRACT_REVIEW_AI_PROVIDER=mock`
- Port: `3217`
- `.env.local` was not modified.
- No real DeepSeek call was made.
- The mock provider path was used.

## Harness Confirmation

- Internal strictness, external simplicity remained the guiding harness.
- Rules changed from a gate to signals.
- L2 owns `riskLevel`.
- AI only explains and adds supplemental attention items.
- User confirmation is required before networking.
- Only one necessary confirmation remains before sending.
- Session-only AI output remains non-persistent.
- `reasoning_content` remains invisible and must never be shown, stored, exported, or logged.

## Browser Regression Results

### Full-Redacted Preview

- `/contract-review` loaded successfully.
- Chinese UI text rendered correctly.
- Contract text could be pasted.
- The preview displayed the full redacted contract, not only matched fragments.
- The preview remained readable.

### PII Masking

Using a clearly fictional regression fixture equivalent to:

```text
出租人将位于北京市朝阳区测试小区 1 号楼 101 室的房屋出租给承租人张三，联系电话为 13800138000。
```

Confirmed:

- Personal name was masked.
- Mobile number was masked.
- Building and room detail were masked.
- Coarse locality context such as `北京市朝阳区测试小区` remained readable.

No real personal information is reproduced here.

### Networking Gate

- Before explicit user confirmation, no request was sent to `/api/ai/contract-review-explanation`.
- After confirmation, exactly one expected POST was generated for each explicit confirmation.
- POST returned HTTP 200.
- Refresh did not automatically trigger a POST.
- Clearing results did not automatically trigger a POST.
- Editing contract text did not automatically trigger a POST.

### Structured Output

- Deterministic L2 rule signals displayed correctly.
- L2-owned `riskLevel` remained visible on rule-signal explanations.
- Supplemental attention items displayed in a separate section.
- Supplemental attention items did not display their own `riskLevel`.
- No `reasoning_content`, internal JSON, or chain-of-thought content was visible.
- Chinese text and layout remained normal.

### State Invalidation and Persistence

- Editing contract text invalidated the previous preview and AI result.
- Regenerating required a fresh confirmation.
- Clearing the current result removed AI output.
- Refreshing the page removed session-only AI output.
- Refresh did not restore prior AI output.
- No unexpected contract-review history appeared.

## Server Log Evidence

Observed local log shape:

```text
GET /contract-review 200
POST /api/ai/contract-review-explanation 200
POST /api/ai/contract-review-explanation 200
```

The two POST requests corresponded to two separate explicit user confirmations during the regression flow.

## Completed P0 Privacy Hotfix

The browser regression originally exposed a P0 privacy gap:

- Name leak.
- Precise building and room detail leak.

The hotfix:

- Conservatively expanded the shared redaction primitive.
- Retained server-side defensive re-redaction.
- Masked the observed name shape through constrained rental context.
- Masked building and room patterns without a unit segment.
- Added negative fixtures to prevent obligation text from being erased.
- Preserved coarse locality context.

## Deferred Follow-Up Backlog

The following items are explicitly deferred and non-blocking for Phase 9M-R6 closure:

- Standalone title such as `房屋租赁合同` may still be segmented as a clause.
- Generic landline-number hardening.
- Ambiguous isolated role-colon names such as `甲方：张三`.
- Ambiguous bare-name coverage.
- Broader address-expression hardening.
- Optional user-visible reminder to remove sensitive information manually before submission.
- OCR.
- PDF.
- Contract photo upload.
- Supabase.
- Chrome extension.
- UI redesign.

Automatic redaction is a best-effort defensive layer, not a guarantee of complete PII removal.

## Closing Decision

- Phase 9M-R6 mock-only browser regression passed.
- The full-redacted UI chain is ready for R6 closing.
- Future work must not reopen the regression unless a new P0 blocker is identified.
- The next step is a Phase 9 overall MVP closing checkpoint, not scope expansion.
