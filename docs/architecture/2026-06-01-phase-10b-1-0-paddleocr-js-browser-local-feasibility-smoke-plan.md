# Phase 10B-1-0 PaddleOCR.js browser-local feasibility smoke plan

## 0. Document position

Phase 10B-1-0 is a docs-only feasibility smoke plan.

This phase does not install dependencies, does not access the npm registry, does not download package tarballs, does not download models, does not write a smoke harness, does not create test images, does not start browser OCR, does not create a scratch workspace, and does not modify any HouseFolio formal page.

The candidate remains:

```text
browser-side PaddleOCR.js
+ PP-OCRv5
+ Worker mode
+ explicit WASM / OpenCV / ONNX Runtime Web / model path governance
+ self-hosted static resource review
```

This is a feasibility-smoke candidate only. It is not the final OCR provider selection.

## 1. Why the next step must be isolated

PaddleOCR.js is a new candidate for HouseFolio. Static assets, Worker behavior, WASM loading, OpenCV.js loading, ONNX Runtime Web assets, model paths, browser compatibility, memory cost, and network behavior have not yet been verified in this repository.

The next step must therefore verify technical feasibility before any formal `/contract-review` integration. Directly wiring this candidate into the production contract-review page would risk polluting the HouseFolio dependency tree, `package-lock.json`, `public` assets, formal UI, and privacy boundary before the provider is known to be viable.

The recommended future feasibility smoke should first happen outside this repository in an isolated scratch workspace:

```text
D:\Download\housefolio-phase-10b-1-paddleocr-js-smoke
```

This document only recommends that strategy. It does not create the scratch workspace.

## 2. Proposed controlled split

Future work should be split into two separately approved steps.

```text
Phase 10B-1-1A
-> Candidate package and asset inspection
-> isolated scratch workspace
-> controlled dependency and resource audit only
```

```text
Phase 10B-1-1B
-> Single synthetic image browser-local smoke
-> isolated scratch workspace
-> verify one fictional Chinese contract image with browser-local OCR
```

Do not execute either step in Phase 10B-1-0.

## 3. Phase 10B-1-1A inspection plan

The future package and asset inspection should verify real package metadata and real package contents. It must not rely on README summaries alone.

Inspection scope:

- Exact official candidate package name.
- Candidate package version.
- License.
- Package exports.
- Dependency tree.
- ONNX Runtime Web dependency shape.
- OpenCV.js dependency shape.
- Whether extra Worker files are required.
- WASM file list.
- Model file list.
- Chinese dictionary or other resource list, if required.
- Default resource paths.
- Whether any third-party CDN defaults exist.
- Whether any implicit remote requests exist.
- Whether resource paths can be explicitly overridden.
- Minimum browser capability required at runtime.
- WebAssembly, WebGPU, and CPU fallback boundaries.

Required evidence in that future step:

- Package metadata.
- Tarball contents.
- Actual runtime and asset file list.
- Explicit note of every network-capable default.

This phase does not access npm, download tarballs, or create directories.

## 4. Phase 10B-1-1B single-image smoke plan

The future single-image smoke should use:

```text
input: one self-made, fictional, non-sensitive Chinese contract test image
execution: OCR runs locally in a browser Worker
output: isolated smoke page displays recognized text, runtime duration, and errors
network: only approved localhost or same-origin static resources
```

The smoke must not:

- Upload images.
- Call cloud OCR.
- Call a human OCR API.
- Call DeepSeek.
- Access third-party CDN resources at runtime.
- Send POST, PUT, or PATCH requests.

The single-image smoke is not a reduction of the final Phase 10 product scope. It only answers whether the low-level provider deserves later formal multi-image implementation work. The formal product still returns to multi-image input, per-page OCR, failed-page retry, merged page separators, user correction, explicit OCR-text confirmation, complete Phase 9 redacted preview, and Phase 9 AI-send confirmation.

## 5. Synthetic test image rules

Future smoke images may only be:

- Self-made.
- Fictional.
- Free of names.
- Free of phone numbers.
- Free of ID-card numbers.
- Free of bank-card numbers.
- Free of real doorplate details.
- Free of contract numbers.
- Free of signatures.
- Free of seals.
- Free of real company or institution information.

Suggested fictional text content:

```text
Article 1: The lease term is twelve months.
Article 2: The deposit is one month of rent.
Article 3: Repair responsibilities shall be separately confirmed by both parties.
```

This phase does not create the image.

## 6. Worker boundary verification

Future smoke work should verify:

- Whether OCR actually runs in a Worker.
- Whether the main page remains responsive.
- Worker initialization behavior.
- Worker destruction behavior.
- Whether repeated recognition reuses a runtime.
- Whether cancellation can terminate the Worker.
- How Worker errors map to user-understandable states.

This plan does not lock any implementation API.

## 7. Explicit path governance plan

Future smoke work must record the real paths required by the candidate runtime:

- OCR runtime JavaScript path.
- Worker entry path.
- WASM path.
- OpenCV.js path.
- ONNX Runtime Web related resource paths.
- PP-OCRv5 detection model path.
- PP-OCRv5 recognition model path.
- Direction-classification model path, if required.
- Chinese dictionary or other resource path, if required.

The source of truth must be the real candidate package contents. Do not assume from memory that any resource category necessarily exists.

Any formal HouseFolio integration must use:

- Explicit configuration.
- Fixed versions.
- Same-origin self-hosting.
- Auditable paths.

It must not use:

- Floating `latest`.
- Implicit CDN.
- Third-party CDN runtime fallback.
- Silent remote loading.

## 8. Network audit plan

Future smoke work must audit:

- Browser main page requests.
- Worker-initiated requests.
- Model resource requests.
- WASM requests.
- OpenCV.js requests.
- ONNX Runtime Web requests.
- Third-party domain requests.
- POST / PUT / PATCH requests.
- DeepSeek requests.
- Human OCR API requests.

Minimum pass standard:

- The image exists only in browser memory or a local object URL.
- Runtime requests are limited to approved localhost or same-origin static resources.
- No image upload occurs.
- No third-party CDN request occurs.
- No human OCR API or DeepSeek request occurs.

## 9. Performance recording plan

Future smoke work should record:

- Browser and version.
- Operating system.
- CPU and memory overview.
- Candidate package version.
- Total model asset size.
- First initialization time.
- Single-image recognition time.
- Second recognition time.
- Whether caching is observed.
- Whether the main thread visibly stalls.
- Whether the Worker can be normally destroyed.
- Whether resources are released after cancellation or page leave.
- Observable errors.

This phase does not produce performance data.

## 10. Minimum acceptance criteria for the future smoke

The future single-image smoke passes only if:

1. One fictional Chinese contract test image can complete browser-local OCR.
2. OCR runs in a Worker and the main page remains responsive.
3. The image is not uploaded.
4. No cloud OCR is called.
5. DeepSeek is not called.
6. Runtime does not request third-party CDN resources.
7. All runtime, WASM, OpenCV, ONNX Runtime Web, and model resource paths can be listed explicitly.
8. The page can display recognized text.
9. The page can display initialization time and recognition time.
10. The Worker can be destroyed or terminated normally.
11. HouseFolio formal pages are not modified.
12. The smoke result is not described as the final provider selection.

## 11. Failure exit criteria

Stop and return to technical review if any of the following occurs:

- PP-OCRv5 cannot run in the browser.
- Resource paths cannot be governed explicitly.
- A non-disableable third-party CDN dependency exists.
- A non-disableable image upload path exists.
- A silent human OCR fallback exists.
- Worker mode is not viable.
- Memory or initialization cost is clearly unacceptable.
- Next.js integration would be highly coupled to the candidate package.
- The smoke cannot be completed without heavily polluting the formal HouseFolio repository.

After failure, do not automatically switch to:

- Human OCR.
- PaddleOCR-VL.
- Third-party OCR APIs.
- Other npm packages.
- Desktop packaging.
- Local companion processes.

Any replacement path must return to a new docs-only boundary review.

## 12. Formal integration encapsulation principle

If a future phase proceeds to formal implementation, it must be encapsulated under:

```text
src/lib/ocr
```

Pages and components must not directly call:

- PaddleOCR.js.
- Worker low-level protocol.
- WASM.
- OpenCV.js.
- ONNX Runtime Web.
- Model URLs.
- Third-party OCR SDK details.

Possible `src/lib/ocr` abstraction areas, for later design only:

- Provider abstraction.
- Runtime lifecycle.
- Per-page recognition.
- Progress events.
- Cancellation.
- Failed-page retry.
- Error mapping.
- Resource path configuration.
- Network boundary.

No `src/lib/ocr` code is written in this phase.

## 13. Decision gate

Phase 10B-1-0 produces only a plan. After this document, do not directly install dependencies or run OCR.

The next allowed step, only after separate user confirmation, is:

```text
Phase 10B-1-1A
-> Candidate package and asset inspection
-> isolated scratch workspace
```

Phase 10B-1-1B must remain separate and should not begin until 10B-1-1A evidence has been reviewed.
