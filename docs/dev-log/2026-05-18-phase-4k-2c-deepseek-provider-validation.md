# Phase 4K-2C｜DeepSeek provider compatibility validation

## Status

Phase 4K-2C is complete.

This checkpoint records the compatibility and UTF-8 validation of the local DeepSeek provider before running a real API route smoke test.

## Current stable point before this checkpoint

```text
dc50a6d docs: checkpoint deepseek env safety
Validation result

The DeepSeek provider was checked and confirmed to use the current V4-compatible configuration:

baseUrl: https://api.deepseek.com
endpoint: /chat/completions
default model: deepseek-v4-flash
supported models: deepseek-v4-flash / deepseek-v4-pro
response_format: json_object
thinking: disabled
stream: false
UTF-8 verification

A Node UTF-8 check confirmed that Chinese provider copy is readable and contains the expected strings, including:

请只返回一个 JSON object
JSON object 必须包含以下字段
所有字段必须存在
本次 AI 响应格式异常，请稍后重试。
当前 AI 服务配置暂不可用。
请求过于频繁，请稍后再试。
AI 服务暂时不可用，请稍后重试。
当前网络不稳定，请稍后重试。

Earlier mojibake-like output observed through PowerShell Get-Content was treated as a display-encoding risk, not as proof of file corruption. Node UTF-8 verification is the source of truth for Chinese content.

Secret safety

Confirmed:

.env.local remains ignored and untracked.
No likely real sk-* API key pattern was found in tracked files.
No DeepSeek API key value is recorded in this log.
Boundary

This phase does not:

call DeepSeek
run a real API success test
run browser regression
persist AI output
add AI history
modify Settings
modify README
start Chrome extension work
Next recommended phase

Next phase:

Phase 4K-2：Real DeepSeek API route smoke test

That phase should run only a minimal server route smoke test against /api/ai/compare-explanation with the local DeepSeek key. It should not persist AI output or run broad browser regression.