# Phase 4D-11：Mock AI API route smoke test

## 0. Phase status

Phase 4D-11 performed a runtime smoke test for the Mock AI API route:

    POST /api/ai/compare-explanation

Current stable baseline before smoke test:

    e45f32f test: add mock ai api route contract check

This phase did not change runtime code.

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

## 1. Smoke test method

The first one-job script produced a false readiness failure.

Observed dev server output showed:

    Next.js Ready
    GET / 200

So the failure was from the script readiness detection, not from the route.

The smoke test was then repeated with a two-terminal method:

Terminal A:

    npm.cmd run dev -- --port 3210

Terminal B:

    Invoke-WebRequest / Invoke-SmokePost requests against:
    http://localhost:3210/api/ai/compare-explanation

## 2. Positive request result

Test case:

    Positive request should return ok true and provider mock

Input:

- locale: zh-CN
- generatedAt
- two listings
- structured rent / area / layout / district / areaLabel
- commute summary
- score summary
- subjective summary
- strengths / weaknesses / neutral facts
- missingFields / riskFlags
- photo summary flags

Result:

    HTTP 200
    ok: true
    provider: mock
    data: CompareExplanationOutput

Conclusion:

    The route can receive valid redacted structured input, call the mock provider through lib/ai, and return a structured mock output.

## 3. Invalid JSON result

Test case:

    Invalid JSON should return invalid_json

Input:

    { invalid json

Result:

    HTTP 400
    error.code: invalid_json
    message: Invalid JSON request body.

Conclusion:

    The route rejects malformed JSON without exposing internals.

## 4. Invalid listing count result

Test case:

    Invalid listing count should return invalid_input

Input:

- locale: zh-CN
- generatedAt
- only one listing

Result:

    HTTP 400
    error.code: invalid_input
    message: Invalid compare explanation input.

Conclusion:

    The route enforces the 2–4 listings input boundary.

## 5. Sensitive key rejection result

Test case:

    Sensitive coordinate key should return invalid_input

Input included:

    coordinate = "116.1,39.9"

Result:

    HTTP 400
    error.code: invalid_input
    message: Invalid compare explanation input.

Conclusion:

    The route rejects forbidden sensitive keys before invoking the provider.

## 6. Git state after smoke test

Final git status after the smoke test:

    On branch main
    Your branch is up to date with origin/main.
    nothing to commit, working tree clean

Conclusion:

    Runtime smoke test did not modify project files.

## 7. Known follow-up

The positive mock output returned structurally correct JSON, but the mock provider Chinese text appears garbled in the terminal response.

This is not a route boundary failure.

It should be handled in a separate small phase, because Phase 4D-11 is only a runtime route smoke test.

Recommended follow-up:

    Phase 4D-12: Mock AI provider Chinese copy encoding fix

That follow-up should only repair mock provider user-facing Chinese copy and then rerun build plus the same smoke test.

## 8. Phase 4D-11 conclusion

Phase 4D-11 passes.

The Mock AI API route has been verified at runtime for:

- valid redacted structured input
- invalid JSON rejection
- invalid listing count rejection
- forbidden sensitive key rejection
- final clean git status

The route remains:

- mock-only
- stateless
- provider-boundary based
- not connected to DeepSeek
- not connected to /compare UI
- not persistent
- not connected to Settings