# Phase 4D-10：Mock AI API route contract check

## 0. Phase status

Phase 4D-10 adds a type-level contract check for the Mock AI API route.

This phase follows Phase 4D-9, where the minimal route was added:

    src/app/api/ai/compare-explanation/route.ts

This phase does not:

- connect DeepSeek
- write a real prompt
- modify /compare UI
- add localStorage keys
- modify Settings
- persist AI output
- add AI history
- change comparison scoring
- call LBS / Amap
- read photos or videos

## 1. Files changed

Updated:

    src/app/api/ai/compare-explanation/route.ts

Added:

    src/app/api/ai/compare-explanation/route-contract-check.ts
    docs/dev-log/2026-05-15-phase-4d-10-mock-ai-api-route-contract-check.md

## 2. Route type exports

The route now exports type aliases for contract checking:

- MockCompareExplanationApiRequest
- MockCompareExplanationApiErrorCode
- MockCompareExplanationApiErrorResponse
- MockCompareExplanationApiSuccessResponse
- MockCompareExplanationApiResponse

These are type-only exports.

No runtime route behavior was changed.

## 3. Contract check coverage

The contract check verifies:

- request type matches CompareExplanationInput
- success response data matches CompareExplanationOutput
- success response provider is fixed to "mock"
- success response has only ok / provider / data
- error response has only ok / error
- error payload has only code / message
- response union is exactly success or error
- request and key nested domain structures do not expose forbidden sensitive keys

Forbidden key categories include:

- precise address fields
- coordinates
- origin / destination
- raw LBS data
- request URL
- route polyline / steps
- provider keys
- prompts
- raw AI responses
- photo / video Blob
- object URL
- image base64
- full notes
- phone / WeChat / ID card
- contract text
- landlord / agent names

## 4. Boundary result

The route remains a stateless mock API boundary over lib/ai.

It still does not:

- import DeepSeek
- read process.env
- use NEXT_PUBLIC variables
- call fetch / axios
- call Supabase
- call Amap
- read or write localStorage
- read or write IndexedDB
- modify Settings
- modify /compare UI
- persist output

## 5. Acceptance criteria

This phase is acceptable if:

- npm.cmd run build passes
- platform boundary scan has no matches
- risk wording scan has no matches
- git diff shows only route type exports, route contract check, and this log
- final git status is clean after commit