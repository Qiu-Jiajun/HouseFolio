# HouseFolio Phase 10B-1-2B-1-F0-4C-3-5-0
## Pip Resolver Body-Fetch Boundary Reconciliation Review

## 0. Document Purpose

This is a docs-only boundary reconciliation review.

It exists because the previous resolver-preflight runner-draft phase returned `BLOCKED_BY_BOUNDARY`.

It does not authorize:

- pip invocation;
- resolver invocation;
- network requests;
- metadata GET;
- artifact HEAD;
- artifact GET;
- Range requests;
- wheel or sdist fetch;
- temp or cache writes;
- resolver sandbox creation;
- package installation;
- venv mutation;
- Python 3.12 fallback;
- model download;
- model conversion;
- tar packaging;
- formal OCR implementation.

This document reconciles the strict read-only boundary with the actual behavior required by a standard pip resolver. It creates no runner, runId, resolver workspace, package artifact, or runtime evidence.

## 1. Upstream Inheritance

This review explicitly inherits:

1. `HouseFolio Phase 10 Harness｜多图片本地 OCR 合同输入增强总约束 v1.0.md`
2. `HouseFolio Phase 9M-R Harness｜全文脱敏合同风险提示链路总约束 v1.0`
3. `HouseFolio Phase 10B-1-2B-1-F0-4C-3-4-1-1 接续文档｜Host-Side Gate B–D Controlled Execution 关闭与 Resolver Preflight 启动准备 v1.0`
4. `docs/architecture/2026-06-03-phase-10b-1-2b-1-f0-4c-3-3-python313-controlled-package-resolution-probe-execution-plan.md`
5. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-4-2-0-controlled-python-package-resolver-preflight-design-review.md`

The committed resolver-preflight design review is authoritative for the current boundary.

Phase 10 remains an additive local OCR input enhancement. It must not rewrite Phase 9, upload contract images, bypass human OCR-text review, bypass the Phase 9 full redacted preview, bypass the Phase 9 AI-send confirmation, introduce cloud OCR, or add first-version PDF support.

## 2. Previous-Phase Closeout

```text
PREVIOUS_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-4-2-2
Resolver Preflight Runner Draft

PREVIOUS_PHASE_RESULT
=
BLOCKED_BY_BOUNDARY

COMPLETE_RUNNER_DRAFT
=
NOT_PROVIDED_BECAUSE_BLOCKED_BY_BOUNDARY
```

The blocked conclusion is accepted. It must not be bypassed by adding wrapper complexity around a resolver primitive whose underlying behavior remains incompatible with the approved boundary.

A wrapper can verify before-and-after state, constrain evidence, and stop after a violation. It cannot retroactively prevent or erase an artifact-body fetch, Range request, temporary write, cache write, build isolation, or source-build action already performed by the wrapped resolver.

## 3. Authoritative Findings

```text
Resolver-only
≠
read-only

No installation
≠
no filesystem mutation

Metadata resolution
≠
no artifact-body access

pip --dry-run
≠
zero network access

pip --no-cache-dir
≠
zero temporary writes

pip --only-binary
≠
zero wheel-body access

pip --no-deps
≠
dependency-closure validation
```

A standard pip resolver primitive cannot currently satisfy the previously approved strict boundary.

The reasons are structural:

- resolving a candidate requires dependency metadata;
- dependency metadata may be served separately, lazily read from a wheel, or generated from a source distribution;
- separate metadata access still requires a metadata GET and temporary materialization in standard pip paths;
- lazy-wheel access uses artifact Range GET requests and reads wheel-body bytes;
- ordinary wheel preparation may download the wheel into a temporary directory;
- source-distribution preparation may create build environments, install build requirements, generate metadata, or build from source;
- disabling persistent cache does not prove that ephemeral cache or temporary directories are absent;
- dry-run suppresses final installation but does not suppress the preceding resolution and candidate-preparation work.

Therefore, a standard pip resolution result cannot be obtained while simultaneously requiring:

```text
no metadata GET
no artifact GET
no Range request
no artifact-body fetch
no temp write
no cache write
no build isolation
no source build
```

## 4. Current Python and Package Findings

```text
Python
=
3.13.7

architecture
=
64bit

machine
=
AMD64

pip
=
25.2

Python 3.12 fallback
=
NOT_GRANTED
```

Previously observed top-level candidates remain findings, not dependency closure:

| Package | Candidate version | Current observation |
| --- | ---: | --- |
| `paddlex` | `3.6.1` | platform-independent wheel observed |
| `paddlepaddle` | `3.3.1` | standard `cp313-win_amd64` wheel observed |
| `paddle2onnx` | `2.1.0` | `CP313_ASSESSMENT = UNKNOWN_OR_ABSENT` |
| `onnx` | `1.21.0` | `cp313-cp313t-win_amd64` wheel observed |
| `onnxruntime` | `1.26.0` | standard `cp313-win_amd64` wheel observed |
| `PyYAML` | `6.0.3` | standard `cp313-win_amd64` wheel observed |
| `numpy` | `2.4.6` | standard `cp313` and `cp313t` wheels observed |

Two P0 findings remain open:

```text
paddle2onnx 2.1.0
CP313_ASSESSMENT
=
UNKNOWN_OR_ABSENT
```

```text
onnx-1.21.0-cp313-cp313t-win_amd64.whl
```

The free-threaded `cp313t` ABI line must remain separate from the standard Python 3.13 interpreter baseline.

## 5. Two-Track Distinction

### 5.1 Track A: Metadata-Only Dependency Reconnaissance

Track A is a possible future read-oriented reconnaissance design using only separately approved official metadata roles:

```text
official PyPI JSON metadata
PEP 658 / core-metadata endpoint
official Paddle stable index metadata
official Paddle nightly index metadata
artifact HEAD only
normalized bounded ledger
```

```text
Metadata-only dependency reconnaissance
≠
full pip resolver

Metadata-only dependency reconnaissance
≠
dependency closure proven

Metadata-only dependency reconnaissance
≠
package installation viability proven
```

Track A may establish:

- visible direct dependency names;
- visible version constraints;
- `Requires-Python` declarations;
- wheel and sdist availability visible from official metadata;
- standard `cp313` versus free-threaded `cp313t` separation;
- obvious incompatibilities;
- dependency nodes whose metadata is missing, ambiguous, conditional, dynamically generated, or otherwise unresolved;
- whether escalation to a resolver sandbox review is justified.

Track A may not claim:

- full resolver-equivalent backtracking;
- complete environment-marker evaluation across all candidates;
- closure when a dependency's metadata is unavailable or dynamically generated;
- installation viability;
- build viability;
- runtime viability;
- ABI compatibility beyond reviewed static tags;
- production readiness.

Track A must label its result as metadata reconnaissance, not dependency resolution.

### 5.2 Track B: Controlled Resolver Sandbox Probe

Track B is a possible future controlled resolver-probe design requiring explicit, separately reviewed relaxation of the current strict boundary.

Only within a future owned resolver sandbox, Track B may need separately approved permission for:

```text
official artifact-body fetch
bounded temporary files
bounded cache files
bounded resolver report
bounded diagnostics
```

Even after a future relaxation review, Track B must still forbid:

```text
package installation
formal venv mutation
existing conversion-scratch pollution
historical evidence mutation
third-party mirrors
third-party CDN fallback
TLS bypass
model download
model conversion
tar packaging
formal OCR implementation
Python 3.12 fallback
```

Track B is not authorized by this document.

Track B would need an independently reviewed resolver primitive, exact network roles, maximum byte and file limits, explicit temporary and cache roots, process containment, artifact lifecycle rules, postcheck requirements, and a non-cleanup retention policy for its execution phase.

## 6. Resolver Sandbox Design Question

Candidate sibling workspace for review only:

```text
D:\Download\housefolio-phase-10b-1-python-resolver-preflight-sandbox
```

Possible future owned root entries for review only:

```text
README-boundary.txt
temp
cache
artifacts
reports
logs
evidence
```

This workspace is not created or authorized by this document.

### 6.1 Isolation Benefits

A separate sibling workspace is preferable to a subdirectory of the existing conversion scratch because it:

- keeps resolver-specific body-fetch, temp, cache, and report permissions separate from model-conversion permissions;
- prevents resolver artifacts from appearing inside protected `downloads`, `source-models`, `converted`, or `packaged`;
- gives the resolver probe a distinct evidence boundary and retention policy;
- makes before-and-after manifests easier to interpret;
- prevents an approved resolver write from being mistaken for approved model-conversion input;
- allows a future maximum-size budget to apply only to resolver-owned data.

### 6.2 Evidence Clarity and Collision Safety

A future sandbox design must:

- refuse creation when the candidate root already exists unless a prior docs-only bootstrap phase explicitly approves reuse;
- create collision-free runIds;
- refuse reuse of any existing runId;
- own only current-run directories and files;
- preserve all historical runs;
- never overwrite or delete on collision;
- record normalized before-and-after manifests for every owned and protected root.

### 6.3 Cleanup and Historical Retention

Execution and cleanup must be separate phases.

The controlled execution phase must not delete:

- downloaded resolver artifacts;
- temporary or cache files that demonstrate actual resolver behavior;
- reports;
- logs;
- evidence;
- stopped or failed runIds.

A later cleanup review may propose retention or deletion rules only after evidence closure and separate user approval.

### 6.4 Artifact Lifecycle and Maximum Size

A future Track B design must define before execution:

- per-artifact maximum bytes;
- total artifact maximum bytes;
- total temp maximum bytes;
- total cache maximum bytes;
- maximum file count;
- maximum request count;
- official-host and endpoint-role allowlists;
- redirect limits;
- time limits;
- whether partial downloads are retained;
- whether artifact bodies may leave the sandbox;
- when artifacts become eligible for separately approved cleanup.

No artifact may move from the resolver sandbox into the existing conversion scratch without a separate boundary review.

### 6.5 Protected State

The following must remain protected from a future resolver sandbox:

```text
E:\Projects\housefolio
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike
existing venv
README-boundary.txt
historical logs and evidence
R7 / R7a / R7b transfer files
Windows proxy settings
Git configuration
PowerShell profile
Python installation and PATH
```

## 7. Boundary Matrix

| Capability | Current strict boundary | Track A metadata-only | Track B resolver sandbox | Current authorization |
| --- | --- | --- | --- | --- |
| PyPI JSON GET | Forbidden in this phase | Separately reviewable, bounded official role | May be required | Not granted |
| PEP 658 metadata GET | Forbidden in this phase | Separately reviewable, bounded official role | May be required | Not granted |
| Paddle index metadata GET | Forbidden in this phase | Separately reviewable, bounded official role | May be required | Not granted |
| artifact HEAD | Forbidden in this phase | Separately reviewable for exact ledger URLs | May be required | Not granted |
| artifact GET | Forbidden | Forbidden | Requires explicit future relaxation | Not granted |
| Range request | Forbidden | Forbidden | Requires explicit future relaxation | Not granted |
| wheel body fetch | Forbidden | Forbidden | Requires explicit future relaxation | Not granted |
| sdist body fetch | Forbidden | Forbidden | Requires explicit future relaxation | Not granted |
| temp write | Forbidden | Evidence-only writes after separate approval; no resolver temp | Bounded sandbox-only after explicit review | Not granted |
| cache write | Forbidden | Forbidden | Bounded sandbox-only after explicit review | Not granted |
| resolver report write | Forbidden | Not applicable to full resolver | Bounded sandbox-only after explicit review | Not granted |
| package installation | Forbidden | Forbidden | Forbidden | Forbidden |
| venv mutation | Forbidden | Forbidden | Forbidden | Forbidden |
| build isolation | Forbidden | Forbidden | Must stop or receive distinct future review | Not granted |
| source build | Forbidden | Forbidden | Must stop or receive distinct future review | Not granted |
| model download | Forbidden | Forbidden | Forbidden | Forbidden |
| Python 3.12 fallback | Not granted | Not granted | Not granted | Not granted |

## 8. Risk Analysis

| Risk | Why it matters | Track A handling | Track B handling | Stop / escalation rule |
| --- | --- | --- | --- | --- |
| artifact-body access | Violates current strict boundary and creates retained package material | Forbidden | Allow only after explicit body-fetch review and sandbox limits | Stop on any unapproved body byte |
| unbounded temporary writes | Can pollute host temp, exhaust disk, or hide resolver actions | No resolver temp; bounded evidence only | Explicit sandbox temp root and quotas | Stop on path or quota breach |
| cache pollution | Can persist artifacts or metadata outside reviewed evidence | Cache disabled and independently monitored | Explicit sandbox cache root and quotas | Stop on write outside owned cache |
| build isolation | Creates environments and may install build dependencies | Forbidden; mark node unresolved | Disabled or separately escalated | Stop before build environment creation |
| source build | Executes package-controlled build logic and expands risk | Forbidden; mark sdist-dependent node unresolved | Forbidden unless a later dedicated review authorizes it | Stop before source build |
| third-party host drift | Breaks provenance and proxy boundary | Exact official endpoint roles | Exact official endpoint and artifact roles | Stop before following redirect |
| redirect drift | Can silently change method, path, or host role | Reviewed bounded redirects only | Reviewed bounded redirects only | Stop on unapproved final role |
| ABI confusion between cp313 and cp313t | Could incorrectly classify a free-threaded wheel as compatible | Separate assessments | Resolver result must be independently checked | Stop or mark incompatible on ambiguity |
| `paddle2onnx` unresolved cp313 status | May be the blocking toolchain node | Preserve `UNKNOWN_OR_ABSENT`; inspect visible metadata only | Resolve only in separately approved sandbox | Escalate only after Track A exhaustion |
| false dependency-closure claim | Could authorize an invalid toolchain | Explicitly classify as reconnaissance | Report actual resolver scope and limitations | Reject any overclaim |
| formal-vs-sandbox contamination | Could mutate repository, venv, or conversion scratch | No sandbox or resolver writes | Sibling sandbox with manifests and path guards | Stop on any protected-root mutation |
| historical evidence deletion | Destroys auditability and failed-run context | Preserve all history | Preserve all history; execution does not clean | Stop on missing or mutated history |

## 9. Decision Matrix

```text
SELECTED_RECOMMENDATION
=
RECOMMEND_TRACK_A_THEN_TRACK_B_REVIEW
```

### 9.1 Why Track A Comes First

Track A is the smallest next step that can improve decision quality without immediately relaxing permission for artifact-body fetch, Range requests, resolver cache, or resolver temp writes.

It can clarify:

- visible dependency names and constraints;
- obvious Python 3.13 blockers;
- whether `paddle2onnx` remains unresolved because metadata is absent or because a compatible candidate is visibly unavailable;
- whether standard `cp313` candidates exist independently of `cp313t`;
- how many unresolved or dynamically generated metadata nodes remain.

Track A cannot prove closure, and its documents and evidence must say so explicitly.

### 9.2 Why Track B Review May Still Be Necessary

If Track A leaves material unresolved nodes, only a real resolver can evaluate candidate selection and backtracking with resolver-equivalent behavior. A real resolver may require artifact bodies, temporary files, cache files, and reports.

That requires a separately reviewed Track B sandbox boundary. Track B execution must not begin automatically after Track A.

### 9.3 Why Immediate Track B Execution Is Rejected

Immediate Track B execution is rejected because no approved sandbox root, byte quota, file quota, artifact lifecycle, resolver primitive, endpoint-role policy, runner, static review, or execution permission currently exists.

## 10. Proposed Follow-Up Stages

### 10.1 Track A Stages

```text
Phase 10B-1-2B-1-F0-4C-3-5-1A
→ metadata-only dependency reconnaissance design
→ docs-only

Phase 10B-1-2B-1-F0-4C-3-5-2A
→ metadata-only runner draft
→ response-only
→ do not execute

Phase 10B-1-2B-1-F0-4C-3-5-3A
→ metadata-only runner static review
→ response-only
→ do not execute

Only after separate approval:
Phase 10B-1-2B-1-F0-4C-3-5-4A
→ controlled metadata-only reconnaissance execution
→ scratch-only
```

### 10.2 Conditional Track B Stages

Only if Track A leaves material unresolved nodes and the user separately approves Track B design review:

```text
Phase 10B-1-2B-1-F0-4C-3-5-1B
→ resolver sandbox boundary design
→ docs-only

Phase 10B-1-2B-1-F0-4C-3-5-2B
→ resolver sandbox bootstrap plan
→ docs-only

Phase 10B-1-2B-1-F0-4C-3-5-3B
→ resolver sandbox runner draft
→ response-only
→ do not execute

Phase 10B-1-2B-1-F0-4C-3-5-4B
→ resolver sandbox runner static review
→ response-only
→ do not execute

Only after separate approval:
Phase 10B-1-2B-1-F0-4C-3-5-5B
→ controlled resolver sandbox execution
→ isolated scratch-only
```

## 11. Current-Phase Stop Conditions

For this docs-only phase, stop on:

```text
repository baseline mismatch
working tree not clean before writing
staged files exist before writing
untracked files exist before writing
protected stash mismatch
.env.local SHA mismatch
historical runId missing or mutated
R7 / R7a / R7b missing or mutated
existing conversion scratch protected directories not empty
unexpected file scope expansion
```

```text
On stop:
do not auto-fix
do not delete
do not clean
do not broaden scope
report the exact mismatch
```

## 12. Current Authorization Boundary

This document authorizes only its own docs-only materialization, validation, commit, and push.

It does not authorize Track A design, runner drafting, execution, or network access. It does not authorize Track B sandbox creation, runner drafting, execution, body fetch, temporary writes, cache writes, reports, diagnostics, installation, or build behavior.

No recommendation in this document is execution permission.

## 13. Final Structured Closeout

```text
CURRENT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-0

CURRENT_PHASE_TYPE
=
DOCS_ONLY_BOUNDARY_RECONCILIATION

PREVIOUS_RUNNER_DRAFT_RESULT
=
BLOCKED_BY_BOUNDARY

SELECTED_RECOMMENDATION
=
RECOMMEND_TRACK_A_THEN_TRACK_B_REVIEW

TRACK_A_CLASSIFICATION
=
METADATA_ONLY_RECONNAISSANCE_NOT_FULL_RESOLVER

TRACK_B_CLASSIFICATION
=
SEPARATE_BOUNDARY_RELAXATION_REVIEW_REQUIRED

PIP_INVOCATION
=
NOT_GRANTED

RESOLVER_INVOCATION
=
NOT_GRANTED

NETWORK_REQUEST
=
NOT_GRANTED

ARTIFACT_BODY_FETCH
=
NOT_GRANTED

TEMP_WRITE
=
NOT_GRANTED

CACHE_WRITE
=
NOT_GRANTED

RESOLVER_SANDBOX_CREATION
=
NOT_GRANTED

PACKAGE_INSTALLATION
=
FORBIDDEN

VENV_MUTATION
=
FORBIDDEN

MODEL_DOWNLOAD
=
FORBIDDEN

MODEL_CONVERSION
=
FORBIDDEN

PYTHON_3_12_FALLBACK
=
NOT_GRANTED

HISTORICAL_RUN_ID_DELETION
=
FORBIDDEN

R7_R7A_R7B_TRANSFER_FILE_DELETION
=
FORBIDDEN

NEXT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-1A
Metadata-Only Dependency Reconnaissance Design

NEXT_PHASE_TYPE
=
DOCS_ONLY

NEXT_PHASE_EXECUTION_PERMISSION
=
NOT_GRANTED
```
