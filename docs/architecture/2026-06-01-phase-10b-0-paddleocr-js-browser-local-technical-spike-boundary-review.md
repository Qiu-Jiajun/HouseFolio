# Phase 10B-0 PaddleOCR.js browser-local technical spike boundary review

## 0. Document position

Phase 10B-0 is a docs-only technical spike boundary review.

This document does not implement OCR, does not install dependencies, does not download models, does not add `src/lib/ocr`, does not modify the contract-review page, and does not decide the final OCR provider.

The candidate reviewed here is:

```text
browser-side PaddleOCR.js
+ PP-OCRv5
+ Worker mode
+ explicit Worker / WASM / OpenCV / model path governance
+ self-hosted static resource review
```

This is only the first-priority feasibility-smoke candidate. PP-OCRv5 browser compatibility, runtime path control, performance, memory behavior, and privacy boundaries still need to be verified in a later spike.

## 1. Current architecture boundary

Phase 9 is closed as the text-only contract-review MVP. Its stable chain remains:

```text
user provides complete contract text
-> browser locally segments clauses
-> browser locally redacts clauses
-> browser locally scans deterministic rule signals
-> user reviews complete redacted preview
-> user explicitly confirms AI generation
-> send full redacted clauses + ruleSignals
-> server defensive re-redaction and canonical validation
-> provider returns structured explanation
-> session-only result display
```

Phase 10 may only enhance the input layer before this text chain. OCR output must become user-reviewed text before it can enter the existing Phase 9 flow.

Phase 10 must not:

- Rewrite Phase 9.
- Create a second review engine.
- Redefine AI input.
- Send contract images to DeepSeek.
- Send unreviewed OCR text to DeepSeek.
- Skip the Phase 9 complete redacted preview.
- Skip the Phase 9 AI-send confirmation.

## 2. Candidate architecture assumption

The candidate architecture to verify later is:

- Browser main thread: owns the image workspace, page ordering, status display, user actions, and final handoff into the existing text-review chain.
- Worker: owns per-page OCR scheduling and runtime isolation.
- Static resources: should first be evaluated as same-origin, self-hosted resources.
- Explicit paths: Worker entry, OCR runtime JavaScript, WASM, OpenCV, PP-OCRv5 models, dictionaries, and any required runtime assets must be governed explicitly.
- Images: must not be uploaded, must not enter DeepSeek, and must not be written to logs.

Allowed:

```text
browser loads OCR runtime / WASM / model static resources on demand
```

Not allowed:

```text
contract images leave the device
```

These two statements are different. Loading approved OCR assets is not the same as uploading user contract images.

## 3. Resource path governance checklist

Phase 10B-1 must verify the real runtime requirements before any implementation proceeds. The following resource categories are audit targets, not assumptions that every category necessarily exists:

- Worker entry path.
- OCR runtime JavaScript path.
- WASM path.
- OpenCV-related resource paths.
- PP-OCRv5 detection model path.
- PP-OCRv5 recognition model path.
- Direction-classification model path, if the candidate runtime requires it.
- Chinese dictionary or other required resource paths.
- Resource version lock strategy.
- Resource hash or integrity strategy, if feasible for the chosen deployment shape.
- Browser cache strategy.
- Same-origin deployment strategy.
- Strategy that forbids default dependency on third-party CDN resources.

The source of truth is the candidate runtime's real requirements. Phase 10B-1 should verify, not infer, these paths.

## 4. Next.js browser-only integration risks

The project currently uses Next.js `16.2.4`, App Router, React `19.2.4`, and the default Turbopack build. Local Next.js docs reviewed for this boundary include `use client`, lazy loading, `public`, CSP, and Turbopack docs.

Spike items to verify:

- Browser-only loading under App Router.
- SSR isolation for any code that touches `window`, `File`, `Blob`, `Worker`, `URL.createObjectURL`, WASM, or OpenCV.
- Whether OCR UI is a Client Component boundary and whether heavy OCR imports are dynamically loaded only after user action.
- Whether `next/dynamic` with `ssr: false` is needed for any browser-only component, and only from a Client Component.
- Whether direct dynamic `import()` is better for a non-React OCR runtime after user action.
- Worker bundling behavior and path resolution under Turbopack.
- Whether `new Worker()` and magic comments affect bundling or runtime loading.
- WASM loading behavior in development and production builds.
- OpenCV loading behavior and whether it creates hidden network requests.
- PP-OCRv5 browser compatibility.
- Browser cache behavior for model and runtime assets.
- First model-load latency.
- Sequential processing time for 10 to 15 pages.
- Peak memory during image decode, OCR, and result merge.
- Object URL and intermediate resource release.
- Page cancellation, failed-page retry, and partial success retention.
- Whether the first version is desktop-first or must support mobile at the same time.

This round does not solve these issues. They are Phase 10B-1 verification items.

## 5. Encapsulation principle

If a later phase proceeds to implementation, OCR must be encapsulated under:

```text
src/lib/ocr
```

Pages and components must not directly depend on:

- PaddleOCR.js concrete APIs.
- Worker low-level protocol.
- WASM paths.
- OpenCV paths.
- Model URLs.
- Third-party OCR SDK details.

The expected abstraction direction is only recorded here and no code is added in this phase:

- `lib/ocr` provider abstraction.
- Per-page recognition interface.
- Progress events.
- Cancellation capability.
- Failed-page retry.
- Error mapping.
- Resource path configuration.

The abstraction must not become a hidden place to add cloud OCR fallback.

## 6. Privacy and network audit boundary

Phase 10B-0 keeps the Phase 10 privacy boundary strict:

- Do not upload real contract images.
- Do not use real contract images for a spike.
- Do not write images to logs.
- Do not write OCR raw text to server logs.
- Do not silently fall back to cloud OCR.
- Do not call a human OCR API.
- Do not call DeepSeek.
- Do not allow images to enter DeepSeek.

Future smoke tests may use only self-made, fictional, non-sensitive test images.

Phase 10B-1 must audit:

- Page network requests.
- Worker network requests.
- Model resource requests.
- Whether requests are limited to approved same-origin static resources.
- Whether any third-party CDN or implicit remote request occurs.

## 7. Phase 10B-1 suggested scope

The next phase may be proposed as:

```text
Phase 10B-1
-> PaddleOCR.js browser-local feasibility smoke plan
-> requires separate review before execution
```

Suggested minimum verification items:

- Single fictional Chinese rental-contract test image.
- Browser Worker isolation.
- Candidate PP-OCRv5 model loading.
- Explicit local static resource paths.
- Network request audit.
- Runtime duration and memory notes.
- Cancellation and resource-release observation.

Do not start a multi-image workspace, formal page integration, or 10 to 15 page stress test before those scopes are separately reviewed.

## 8. Decision gate

Decision for this boundary review:

```text
PaddleOCR.js browser-local
+ PP-OCRv5
+ Worker
+ explicit path governance

enters the first-priority feasibility-smoke candidate set,
but is not yet the final OCR provider selection.
```

The next approved action is documentation review of a Phase 10B-1 feasibility-smoke plan, not implementation.
