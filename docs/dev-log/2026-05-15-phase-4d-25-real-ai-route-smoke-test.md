# 2026-05-15｜Phase 4D-25｜Real AI API route smoke test

## 1. Phase objective

Phase 4D-25 validates the real-provider-capable AI compare explanation API route at route level.

This phase only verifies:

- default mock path
- DeepSeek missing-config path

This phase intentionally does not verify:

- real DeepSeek success response
- real DeepSeek API key
- real browser AI regression
- Compare UI changes
- Settings changes
- AI output persistence
- AI localStorage keys
- AI history
- AI export or deletion

## 2. Startup baseline

Startup check passed before this phase:

- HEAD = 804bbb9
- origin/main contains 804bbb9
- git status clean
- npm.cmd run build passed

The stable baseline was:

- 804bbb9 feat: add real ai route provider selection

## 3. Test 1: default mock path

### Environment

AI_COMPARE_PROVIDER was not set to deepseek.

DEEPSEEK_API_KEY was removed from the shell environment.

The dev server was started on:

- http://localhost:3210

### Initial invalid input finding

The first manually written payload returned:

- HTTP 400
- error.code = invalid_input
- message = Invalid compare explanation input.

Root cause:

The payload used a subjectiveSummary shape that did not match the route validator.

Invalid subjectiveSummary shape:

    averageRating
    highlights
    concerns

The current route validator only accepts:

    light
    quiet
    decoration

The payload also originally used missingFields = photo, but photo is not an allowed CompareExplanationMissingField.

The smoke payload was corrected to match the current runtime validator.

### Final default mock result

The corrected default mock path returned:

- ok = true
- provider = mock
- data.summary exists
- data.disclaimer exists

The response did not contain forbidden markers:

- DEEPSEEK_API_KEY
- NEXT_PUBLIC_DEEPSEEK
- apiKey
- requestUrl
- rawResponse
- bestListingId
- ranking
- recommendationScore
- finalDecision
- shouldChoose

Result:

- PASS: correct default mock path smoke test passed

Note:

PowerShell displayed Chinese mock output as mojibake. This is a PowerShell console encoding display issue and was not treated as a Phase 4D-25 code issue.

## 4. Test 2: DeepSeek missing-config path

### Environment

The existing mock dev server on port 3210 had to be stopped first.

Next.js 16 prevented starting a second dev server for the same project directory and reported:

    Another next dev server is already running.
    Local: http://localhost:3210

After stopping the existing dev server, a new dev server was started on:

- http://localhost:3211

Shell environment:

- AI_COMPARE_PROVIDER = deepseek
- DEEPSEEK_API_KEY was removed

Port check confirmed:

- localhost:3211 TcpTestSucceeded = True

### Final missing-config result

The DeepSeek missing-config request returned:

- HTTP 503 Service Unavailable
- ok = false
- error.code = missing_provider_configuration
- error.message = 当前 AI 服务配置暂不可用。

The response did not contain forbidden markers:

- DEEPSEEK_API_KEY
- NEXT_PUBLIC_DEEPSEEK
- apiKey
- requestUrl
- rawResponse
- Authorization
- Bearer
- deepseek.com
- sk-

Result:

- PASS: DeepSeek missing-config path smoke test passed

## 5. Boundary confirmation

This phase did not:

- call real DeepSeek successfully
- require a DeepSeek account
- use a real DeepSeek API key
- modify Compare UI
- modify Settings
- add localStorage keys
- persist AI output
- add AI history
- change user-facing AI trigger behavior
- change prompt builder
- change provider implementation
- change route implementation

## 6. Current conclusion

Phase 4D-25 confirms that the real-provider-capable route behaves correctly in the two allowed no-account smoke paths:

1. Default mock provider path works.
2. DeepSeek provider selection returns safe missing-config error when configured without DEEPSEEK_API_KEY.

The next safe step should be a closing checkpoint or a preflight review for the next phase. Do not proceed to real DeepSeek success testing until a real account and key exist and a separate boundary review is completed.