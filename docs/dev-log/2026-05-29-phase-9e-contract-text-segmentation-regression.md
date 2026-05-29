# Phase 9E Regression Log｜Contract Text Input and Clause Segmentation

## Phase

Phase 9E：文本输入与条款切分最小实现

## Stable base

Before this phase, the latest stable point was:

    d0390bf docs: plan contract legal basis

Phase 9A–9D had already completed the contract assistant boundary review, AI/RAG architecture review, risk rule model design, and legal basis minimal implementation plan.

## Goal

Implement the first minimal functional surface for the contract assistant:

    /contract-review
    contract text textarea
    local clause segmentation preview
    session-only processing notice
    legal disclaimer
    homepage / navigation entry correction

This phase does not implement AI, rules, legal basis display, OCR, PDF parsing, photo upload, contract history, or persistence.

## Files changed

Added:

    src/app/contract-review/page.tsx
    src/components/contract-review-panel.tsx
    src/lib/contract/clause-segmentation.ts

Modified:

    src/content/zh-cn.ts
    src/components/app-nav.tsx
    src/app/page.tsx

## Implementation summary

The new /contract-review route provides a renter-facing pre-signing contract check entry. It uses the current Phase 8D visual language:

    warm cream background
    rounded panels
    soft green accents
    gentle borders
    subtle shadows
    AppNav
    ComplianceFooter

The page includes:

    contract text textarea
    local/session-only helper copy
    legal disclaimer
    empty state
    clause preview list
    clear-current-text button

The homepage top-menu item “签约前检查” was corrected from:

    /portfolio

to:

    /contract-review

A single AppNav entry was added for:

    签约前检查 -> /contract-review

## Clause segmentation boundary

The clause segmentation function is local and pure:

    src/lib/contract/clause-segmentation.ts

It returns only:

    id
    title
    text

It normalizes line endings, trims input, splits by blank lines and common clause markers, and returns neutral clause segments.

It does not:

    classify risk
    assign risk level
    cite legal basis
    call AI
    send text to an API
    persist contract text

## Legal and product boundary

The page clearly states:

    本功能仅用于辅助识别常见租房合同风险点和签约前检查建议，不构成正式法律意见，不替代律师、仲裁机构、法院或行政机关判断。

The page also states that pasted text is processed locally in the current page session and is not saved as contract history.

## Validation

npm.cmd run build passed.

The route table includes:

    /contract-review

Forbidden file existence checks confirmed that the following files/routes were not added:

    src/app/api/ai/contract-review-explanation
    src/app/api/ai/contract-review-explanation/route.ts
    src/lib/contract/risk-rules.ts
    src/lib/contract/legal-basis.ts
    src/lib/contract/risk-matcher.ts

Forbidden scope scan found no Phase 9E contract-review implementation use of:

    DeepSeek
    contract-review AI route
    OCR
    PDF parsing
    file upload
    photo upload
    contract history storage
    localStorage
    IndexedDB
    risk rules
    legal basis
    risk matcher

Existing hits in src/content/zh-cn.ts for localStorage/photo belong to pre-existing Settings/photo copy and are unrelated to Phase 9E.

## Browser regression checklist

Manual browser regression should confirm:

    1. Homepage “签约前检查” enters /contract-review.
    2. AppNav shows one “签约前检查” entry.
    3. /contract-review visually matches the Phase 8D HouseFolio style.
    4. Empty textarea shows an empty state.
    5. Pasted contract text generates local clause segments.
    6. Clear button clears only current page state.
    7. Refreshing the page does not retain pasted contract text.
    8. The page has no AI button, no risk labels, no legal basis display, no upload control, and no save-history control.

## Result

Phase 9E completed the minimal contract text input and clause segmentation surface while preserving the legal, privacy, AI, and storage boundaries required by HouseFolio Phase 9.