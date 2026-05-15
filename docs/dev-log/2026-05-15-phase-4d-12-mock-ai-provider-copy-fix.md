# Phase 4D-12：Mock AI provider Chinese copy encoding fix

## 0. Phase status

Phase 4D-12 fixed and verified the Mock AI provider Chinese copy.

This phase follows:

- Phase 4D-9: Mock AI API route minimal implementation
- Phase 4D-10: Mock AI API route contract check
- Phase 4D-11: Mock AI API route smoke test

Phase 4D-11 confirmed that the route behavior was correct, but the terminal smoke test output showed garbled Chinese text in the positive mock response.

Phase 4D-12 verifies that the API response body itself is valid UTF-8 and that the mock provider source file contains normal Chinese text.

## 1. Scope

This phase only changes:

    src/lib/ai/mock-provider.ts

This phase adds this log:

    docs/dev-log/2026-05-15-phase-4d-12-mock-ai-provider-copy-fix.md

This phase does not:

- change the Mock AI API route
- change the route contract check
- modify /compare UI
- modify Settings
- add localStorage keys
- connect DeepSeek
- write a real prompt
- persist AI output
- add AI history
- change scoring
- call LBS / Amap
- read photos or videos

## 2. Source file UTF-8 check

Node UTF-8 content check result:

    contains local mock phrase: true
    contains old mojibake marker: false
    ends with newline: true

Conclusion:

    src/lib/ai/mock-provider.ts contains normal UTF-8 Chinese copy.

## 3. Build result

Command:

    npm.cmd run build

Result:

    passed

The route table still includes:

    /api/ai/compare-explanation

## 4. Boundary scans

Platform boundary scan checked:

- DeepSeek
- DEEPSEEK
- process.env
- NEXT_PUBLIC
- fetch
- axios
- localStorage
- sessionStorage
- indexedDB
- IndexedDB
- Supabase
- AMAP
- amap

Result:

    no matches

Risk wording scan checked:

- 最佳房源
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真

Result:

    no matches

## 5. Runtime API UTF-8 verification

A minimal Node-based API request was sent to:

    POST http://localhost:3210/api/ai/compare-explanation

Result:

    HTTP status: 200
    ok: true
    provider: mock

Returned summary:

    这是基于 2 套房源结构化比较信息生成的本地模拟辅助解释，用于验证未来 L3 说明流程，不代表最终推荐。

Returned disclaimer:

    本地模拟解释仅用于辅助比较流程验证，不构成房源推荐、真实性判断或租赁建议。请自行核实房源、合同和交易信息。

String checks:

    contains 本地模拟解释: true
    contains 乱码标记: false

Conclusion:

    The Mock AI API response JSON is valid UTF-8 and contains readable Chinese copy.

## 6. Interpretation

The garbled Chinese observed in the earlier PowerShell smoke test was a terminal display encoding issue, not a route boundary failure.

The source file and API JSON response are now verified with Node UTF-8 parsing.

## 7. Phase 4D-12 conclusion

Phase 4D-12 passes.

The mock provider Chinese copy is now readable and verified through:

- source file UTF-8 check
- build
- platform boundary scan
- risk wording scan
- runtime API response check

The AI boundary remains:

- mock-only
- stateless
- provider-boundary based
- not connected to DeepSeek
- not connected to /compare UI
- not persistent
- not connected to Settings