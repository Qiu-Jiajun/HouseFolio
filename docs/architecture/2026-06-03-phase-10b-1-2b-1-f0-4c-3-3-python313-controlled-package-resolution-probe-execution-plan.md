# Phase 10B-1-2B-1-F0-4C-3-3: Python 3.13 Controlled Package-Resolution Probe Execution Plan

## 0. Document Purpose

This is the docs-only execution plan for HouseFolio Phase 10B-1-2B-1-F0-4C-3-3.

It plans a controlled and stoppable Python 3.13 package-resolution probe without:

- installing dependencies
- downloading wheels or sdists
- downloading OCR models
- modifying the formal HouseFolio repository
- contaminating the conversion scratch
- modifying the existing Python 3.13 venv

This document is not:

- an executable script
- a PowerShell command list
- a Codex task packet
- package installation approval
- artifact download approval
- model download approval
- model conversion approval
- Python 3.12 fallback approval

After this document is closed, the next phase may only be:

```text
Phase 10B-1-2B-1-F0-4C-3-4
-> metadata ledger + artifact HEAD ledger
-> scratch-only
-> requires separate approval
```

Do not execute F0-4C-3-4 from this document.

## 1. Harness Constraints

Phase 10 remains additive-only for OCR input enhancement. It must not rewrite Phase 9.

Long-running constraints still apply:

- images stay local to the device
- OCR processes by page
- partial OCR failures preserve successful results
- images and unconfirmed OCR text remain session-only
- OCR text requires human verification before Phase 9 ingestion
- Phase 9 full redacted preview remains required
- Phase 9 AI-send confirmation remains required
- images must not be sent to DeepSeek
- no silent cloud OCR fallback
- first version does not support PDF
- no stage skipping
- no scope expansion

Phase 9M-R constraints also remain active:

- internal rigor, external simplicity
- rules act as signals, not hard gates
- L2 decides `riskLevel`
- AI may explain and add plain-language concern context only
- `reasoning_content` is not displayed, stored, exported, or logged

## 2. Current Stable Point

Formal repository:

```text
E:\Projects\housefolio
```

Current expected stable point:

```text
HEAD
main
origin/main
remote refs/heads/main
=
e3bf7f5791d2790cf1cc37d05a2f3197945b8025
```

Corresponding commit:

```text
e3bf7f5 docs: plan python313 package resolution probe
```

Protected stash:

```text
stash@{0}
-> 8a27c545465dc185f5506311392ab57dc6e67f84

stash@{0}^3
-> 60137e8e3bb7faae9eacac510a6bb2228901a227
```

`.env.local` SHA-256:

```text
d7e36ad25524b5c6fd7dc33b6b203f1eea640b09826b09cec6bb456d2e1979b7
```

Before F0-4C-3-4, verify read-only:

- `HEAD`, `main`, `origin/main`, and remote `refs/heads/main` exactly match
- working tree is clean
- staged changes are empty
- untracked files are empty
- protected stash hashes match
- `.env.local` SHA-256 matches

If any item does not match, stop.

## 3. Conversion Scratch And Venv

Conversion scratch:

```text
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike
```

Approved root entries:

```text
README-boundary.txt
env
downloads
source-models
converted
packaged
evidence
logs
```

Current isolated venv:

```text
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\env\venv
```

Already confirmed baseline:

```text
Python -> 3.13.7 x64 AMD64
pip -> 25.2
package inventory -> pip only
```

The following packages are not currently approved for installation:

```text
paddlex
paddlepaddle
paddle2onnx
onnx
onnxruntime
PyYAML
numpy
```

Do not upgrade pip in the current phase.

## 4. Proxy Closure Baseline

Current local proxy entrypoint:

```text
127.0.0.1:10808
```

The browser can use the Windows system proxy to reach official sites. Terminal tools do not necessarily inherit the same route.

Controlled probes must therefore use an explicit local proxy for each request or process:

```text
proxyMode -> explicit-local-proxy
proxyHost -> 127.0.0.1
proxyPort -> 10808
persistentProxyMutation -> false
```

Do not:

- modify Windows proxy settings
- modify environment variables
- persist `HTTP_PROXY` or `HTTPS_PROXY`
- modify PowerShell profile
- use direct/no-proxy fallback
- use a third-party proxy
- use a third-party mirror
- bypass TLS verification

The proxy blocker is considered resolved for planning purposes only as:

```text
PROXY_BLOCKER -> RESOLVED_WITH_EXPLICIT_LOCAL_PROXY
```

This does not approve package installation or artifact download.

## 5. F0-4C-3-4 Objective

F0-4C-3-4 may answer only this question:

```text
Under Windows x64, Python 3.13.7, official PyPI metadata,
PaddlePaddle official stable/nightly CPU indexes, and explicit local proxy,
does a candidate OCR conversion toolchain have a reviewable Python 3.13
dependency-resolution path?
```

It must not answer:

- whether dependencies are installed
- whether models are downloaded
- whether models can convert successfully
- whether converted results are production-ready
- whether Python 3.12 is preferable

## 6. Candidate Package Scope

| Package | Candidate Role | Current Candidate Version Status |
| --- | --- | --- |
| `paddlex` | official model export and toolchain entrypoint | `3.6.1`, recheck official metadata |
| `paddlepaddle` | Paddle runtime candidate | `3.3.1`, recheck PyPI and Paddle index |
| `paddle2onnx` | Paddle to ONNX conversion candidate | `2.1.0`, recheck official metadata |
| `onnx` | ONNX structure dependency candidate | do not pre-lock version |
| `onnxruntime` | ONNX runtime candidate | do not pre-lock version |
| `PyYAML` | config parsing dependency candidate | do not pre-lock version |
| `numpy` | numeric base dependency candidate | do not pre-lock version |

Important distinctions:

- candidate version does not mean locked version
- visible metadata does not prove dependency closure
- artifact filename presence does not approve artifact download

## 7. F0-4C-3-4 Probe Design

F0-4C-3-4 must run as four consecutive gates. If any gate fails, stop immediately, preserve the scene, and do not continue to the next gate.

### Gate A: Read-Only Environment Integrity

Before any metadata request, verify:

- formal repo stable point matches
- working tree clean
- staged empty
- untracked empty
- protected stash hashes match
- `.env.local` SHA-256 matches
- conversion scratch root contains only approved entries
- `README-boundary.txt` unchanged
- `downloads`, `source-models`, `converted`, and `packaged` remain empty
- venv inventory remains `pip` only
- Python remains `3.13.7 x64 AMD64`
- pip remains `25.2`

### Gate B: Explicit Proxy Connectivity

Use only the explicit local proxy:

```text
127.0.0.1:10808
```

Read-only checks:

- PyPI metadata endpoint is readable
- `files.pythonhosted.org` is reachable
- Paddle stable CPU index is readable
- Paddle nightly CPU index is readable

Forbidden:

- direct/no-proxy fallback
- Windows proxy setting mutation
- environment variable mutation
- persistent `HTTP_PROXY` or `HTTPS_PROXY`
- third-party mirrors
- third-party proxies
- TLS bypass
- `-k`

### Gate C: Official Metadata Parsing

Allowed:

- read official JSON metadata body
- process metadata in memory
- write normalized fields only to evidence

Forbidden:

- saving complete raw JSON response bodies
- accessing wheel bodies
- accessing sdist bodies
- using Range requests
- downloading package artifacts

For each package, record at minimum:

- `packageName`
- `metadataEndpoint`
- `endpointStatus`
- `latestVersion`
- `candidateVersion`
- `requiresPython`
- `releaseExists`
- `releaseFileCount`
- `wheelFileNames`
- `sdistFileNames`
- `yanked`
- `officialArtifactHosts`
- `artifactDigestsFromMetadata`
- `artifactSizesFromMetadata`
- `cp313CompatibilityAssessment`
- `winAmd64CompatibilityAssessment`
- `notes`

### Gate D: Artifact HEAD Review

Only candidate artifact URLs explicitly listed by Gate C may receive a HEAD request.

Allowed to record:

- artifact filename
- official host
- HTTP status
- content type
- content length
- digest from metadata
- Python tag
- ABI tag
- platform tag

Forbidden:

- GET artifact body
- wheel download
- sdist download
- artifact saving
- Range request
- non-official host access

If a HEAD request redirects, continue only to official PyPI or PaddlePaddle controlled hosts. If any third-party host appears, stop.

## 8. Dependency Resolution Boundary

F0-4C-3-4 does not approve invoking pip resolver commands.

Forbidden by default:

```text
pip install
pip install --dry-run
pip install --report
pip download
pip wheel
pip index versions
```

Reason:

- some pip resolver paths may read or temporarily fetch wheel bodies
- package artifact download is not yet approved
- metadata ledger and artifact HEAD ledger must close first

Only after both ledgers close may a separate docs-only stage be introduced:

```text
Phase 10B-1-2B-1-F0-4C-3-5
-> pip resolver body-fetch boundary review
-> docs-only
```

That review must answer:

- whether pip dry-run fetches wheel bodies
- whether a PEP 658 metadata-only path exists
- whether `--no-cache-dir` is required
- whether isolated mode is required
- whether `--only-binary` is required
- whether a report file is allowed
- which temporary directories would be written
- whether the venv would be contaminated
- whether non-official hosts would be accessed

Do not execute pip resolver before that review closes.

## 9. F0-4C-3-4 Write Scope

After separate approval, F0-4C-3-4 may write only to:

```text
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\logs\<runId>\
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\evidence\<runId>\
```

Allowed generated files:

```text
preflight-summary.txt
proxy-connectivity-summary.txt
package-metadata-ledger.json
package-metadata-ledger.txt
artifact-head-ledger.json
artifact-head-ledger.txt
final-probe-summary.txt
```

Forbidden write targets:

```text
downloads
source-models
converted
packaged
env\venv
README-boundary.txt
formal HouseFolio repository
browser-local smoke scratch
```

## 10. Evidence Minimization

Evidence must retain only normalized fields.

Do not record:

- proxy account
- proxy credentials
- subscription address
- VPN node address
- complete raw metadata JSON
- artifact body
- model body
- secret environment variable values
- `.env.local` contents
- real contract images
- real contract text

Proxy information may be recorded only as:

```text
proxyMode -> explicit-local-proxy
proxyHost -> 127.0.0.1
proxyPort -> 10808
persistentProxyMutation -> false
```

## 11. Decision Matrix

### PASS_WITH_CLOSURE

Allowed only if:

- all official metadata endpoints are readable
- all candidate package metadata is parseable
- candidate versions exist
- candidate artifact URLs are explained by official sources
- target artifact HEAD requests are reachable
- no artifact body is accessed
- `downloads` is untouched
- venv is untouched
- formal repo is untouched
- browser-local scratch is untouched
- no proxy settings are persisted

Output:

```text
F0_4C_3_4_RESULT -> PASS_WITH_CLOSURE
PYTHON_313_METADATA_COMPATIBILITY_ENVELOPE -> CONDITIONALLY_ESTABLISHED
NEXT_ACTION -> F0-4C-3-5, pip resolver body-fetch boundary review, docs-only
```

### PASS_WITH_FINDINGS

Use when:

- some candidate versions require adjustment
- some dependencies need separate confirmation
- stable and nightly index information diverges
- some artifact HEAD requests are temporarily unreachable
- Python tag or platform tag needs further interpretation

Do not automatically switch to Python 3.12.

### BLOCKED_FOR_PYTHON_313

This result is valid only if evidence clearly shows:

- a candidate core package lacks a cp313-compatible artifact, or
- the Python 3.13 dependency closure cannot be established

Before using this result, exclude:

- proxy failure
- TLS failure
- unreadable official index
- command formatting error
- cache anomaly
- third-party mirror variance
- stable/nightly route misclassification

Only then may the next step be a separate Python 3.12 side-by-side fallback docs-only review requiring separate user approval.

### STOPPED

Stop immediately if any of these occur:

- repository state mismatch
- protected stash mismatch
- `.env.local` SHA mismatch
- `README-boundary.txt` changed
- unapproved conversion scratch entry appears
- `downloads`, `source-models`, `converted`, or `packaged` becomes non-empty
- venv is no longer `pip` only
- proxy host changes
- non-official host appears
- artifact body download occurs
- Range request occurs
- TLS bypass occurs
- third-party mirror appears
- persistent environment variable mutation appears

## 12. Python 3.12 Fallback

Currently forbidden:

- downloading Python 3.12
- installing Python 3.12
- creating a Python 3.12 venv
- switching system Python
- modifying PATH

Python 3.12 fallback may be reviewed only if all conditions hold:

1. official metadata is readable
2. the Python 3.13 package-resolution probe is approved and executed
3. the real failure is clearly from missing cp313 artifacts or impossible Python 3.13 dependency closure
4. proxy, TLS, allowlist, index, cache, mirror, and command-format issues are excluded
5. the user separately approves a Python 3.12 side-by-side fallback review

## 13. Subsequent Stage Order

Recommended sequence:

```text
F0-4C-3-3
-> Python 3.13 controlled package-resolution probe execution plan
-> docs-only
-> this document

F0-4C-3-4
-> metadata ledger + artifact HEAD ledger
-> scratch-only
-> requires separate approval

F0-4C-3-5
-> pip resolver body-fetch boundary review
-> docs-only
-> only after F0-4C-3-4 passes

package resolver execution
-> separate phase
-> requires separate approval

F0-4D
-> official-source model download
-> scratch-only
-> requires separate approval

F0-4E
-> Paddle2ONNX conversion
-> scratch-only
-> requires separate approval

F0-4F
-> deterministic plain ustar packaging
-> scratch-only
-> requires separate approval

F0-5
-> reproducible model closure evidence review
-> docs-only
```

## 14. Current Stage Conclusion

```text
CURRENT_STAGE
-> Phase 10B-1-2B-1-F0-4C-3-3

DOCUMENT_TYPE
-> docs-only execution plan

PROXY_BLOCKER
-> RESOLVED_WITH_EXPLICIT_LOCAL_PROXY

PACKAGE_INSTALLATION
-> NOT_GRANTED

PACKAGE_ARTIFACT_DOWNLOAD
-> NOT_GRANTED

MODEL_DOWNLOAD
-> NOT_GRANTED

MODEL_CONVERSION
-> NOT_GRANTED

PYTHON_3_12_FALLBACK
-> NOT_GRANTED

NEXT_ACTION
-> review this docs-only plan
-> do not execute F0-4C-3-4 yet
```
