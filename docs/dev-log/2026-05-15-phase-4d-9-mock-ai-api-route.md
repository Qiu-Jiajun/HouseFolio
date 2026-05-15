# Phase 4D-9：Mock AI API route minimal implementation regression

## 0. Phase status

Phase 4D-9 implemented the minimal Mock AI API route.

New route:

    src/app/api/ai/compare-explanation/route.ts

Route path after build:

    /api/ai/compare-explanation

This phase only added the minimal server route and this regression log.

This phase did not:

- connect DeepSeek
- write a real prompt
- modify /compare UI
- add localStorage keys
- modify Settings
- persist AI output
- add AI history
- add provider selection UI
- change comparison scoring
- call LBS / Amap
- read photos or videos

## 1. Implementation summary

The route accepts:

    POST /api/ai/compare-explanation

The route calls:

    generateMockCompareExplanation(input)

from the existing lib/ai boundary.

It returns a structured response:

    {
      ok: true,
      provider: "mock",
      data: CompareExplanationOutput
    }

For errors, it returns:

    {
      ok: false,
      error: {
        code,
        message
      }
    }

Supported error codes:

- invalid_json
- invalid_input
- generation_failed

The route does not expose raw provider errors or stack traces.

## 2. Runtime validation

The route does not trust TypeScript types alone.

It validates runtime JSON input by checking:

- JSON body parse result
- locale is zh-CN
- listing count is 2–4
- listingId and displayTitle are present and bounded
- optional numbers are finite and range-bounded
- optional strings are length-bounded
- array fields are length-bounded
- missing field values are from the approved enum set
- risk flag values are from the approved enum set
- commute source values are from the approved enum set

It rebuilds the accepted CompareExplanationInput from whitelisted fields instead of passing arbitrary request body content directly to the provider.

## 3. Sensitive key rejection

The route explicitly rejects request payloads containing forbidden sensitive keys anywhere in the nested request body.

Examples of rejected key categories:

- precise address fields
- door / room / building / unit numbers
- coordinates
- origin / destination
- raw LBS data
- request URL
- polyline / steps
- provider keys
- prompt / raw AI response
- photo / video Blob
- object URL
- base64 images
- full notes
- phone / WeChat / ID card
- contract text
- landlord / agent names

This preserves the Phase 4D-8 rule that the route may receive only redacted structured comparison input.

## 4. Boundary checks performed

Build result:

    npm.cmd run build

Result:

    passed

Build route table included:

    /api/ai/compare-explanation

Static platform boundary scan checked the route for:

- DeepSeek
- DEEPSEEK
- process.env
- localStorage
- sessionStorage
- indexedDB
- IndexedDB
- Supabase
- NEXT_PUBLIC
- fetch
- axios

Result:

    no matches

Route-specific risk wording scan checked the route for:

- recommendation
- best listing
- system recommendation
- final choice
- verified real listing

Result:

    no matches

## 5. Current route boundary

The route currently does:

- parse JSON
- reject invalid JSON
- reject forbidden sensitive keys
- validate the redacted input shape
- call the mock AI provider through lib/ai
- return structured mock explanation output
- return generic errors

The route currently does not:

- call DeepSeek
- read real AI provider keys
- use NEXT_PUBLIC variables
- construct a real prompt
- call LBS / Amap
- call Supabase
- call fetch / axios
- read localStorage
- read sessionStorage
- read IndexedDB
- read photos
- read videos
- write persistence
- modify Settings
- modify /compare UI
- rank, score, filter, or recommend listings

## 6. L1 / L2 / L3 boundary

The route belongs to L3 only.

It can explain already-structured comparison input.

It cannot:

- calculate commute
- calculate distance
- calculate life circle score
- calculate reference score
- rank listings
- filter listings
- recommend a listing
- verify listing authenticity
- make final decisions

L1 remains responsible for spatial calculation.

L2 remains responsible for scoring, sorting, filtering, and structured comparison.

L3 remains an explanation layer.

## 7. Files changed

Added:

    src/app/api/ai/compare-explanation/route.ts
    docs/dev-log/2026-05-15-phase-4d-9-mock-ai-api-route.md

No Settings file was changed.

No /compare UI file was changed.

No localStorage registry was changed.

No provider implementation beyond the route boundary was changed.

## 8. Acceptance result

Phase 4D-9 is acceptable if the final commit contains only:

- the minimal mock AI API route
- this regression log

and the following remain true:

- npm.cmd run build passes
- static boundary scan has no platform leakage
- route-specific risk wording scan has no recommendation wording
- git status is clean after commit