# HouseFolio Phase 10B-1-2B-1-F0-4C-3-4-2-0
## Controlled Python Package Resolver Preflight Design Review

## 0. Document Purpose

This document is a docs-only resolver preflight design review.

It does not grant permission to:

- invoke a resolver;
- invoke pip;
- download artifact bodies;
- install packages;
- mutate venv;
- switch Python versions;
- download OCR models;
- start conversion;
- start packaging;
- modify formal OCR source code.

This phase creates no resolver runId, logs, evidence, runner, package state, model state, or application-source change. Its only authorized repository output is this architecture document.

## 1. Upstream Inheritance

This design review explicitly inherits and remains subordinate to:

1. `HouseFolio Phase 10 Harness｜多图片本地 OCR 合同输入增强总约束 v1.0.md`
2. `HouseFolio Phase 9M-R Harness｜全文脱敏合同风险提示链路总约束 v1.0`
3. `HouseFolio Phase 10B-1-2B-1-F0-4C-3-4-1-1 接续文档｜Host-Side Gate B–D Controlled Execution 关闭与 Resolver Preflight 启动准备 v1.0`
4. `docs/architecture/2026-06-03-phase-10b-1-2b-1-f0-4c-3-3-python313-controlled-package-resolution-probe-execution-plan.md`

Phase 10 remains an additive OCR input enhancement only. It must not rewrite Phase 9.

The inherited product and privacy boundaries remain active:

- contract images remain local to the device;
- OCR works page by page and preserves successful-page results when another page fails;
- images and unconfirmed OCR text remain session-only;
- OCR text requires human review and explicit confirmation before entering Phase 9;
- the Phase 9 full redacted preview and AI-send confirmation remain mandatory;
- images must not be sent to DeepSeek;
- there is no silent cloud OCR fallback;
- the first version does not support PDF;
- Phase 9 rules remain signals rather than hard gates;
- L2 continues to own `riskLevel`;
- AI may explain and add plain-language concern context only;
- `reasoning_content` is not displayed, stored, exported, or logged.

No stage may be skipped and no scope may be expanded implicitly.

## 2. Current Accurate Stop Point

```text
Previous phase
=
Phase 10B-1-2B-1-F0-4C-3-4-1-1

Previous phase result
=
CLOSED_WITH_PASS_WITH_FINDINGS

Successful runId
=
20260604-124646-352

Historical failed runId
=
20260604-115858-865
```

Both runIds are protected historical evidence and must be retained. The successful run does not erase the failed run, and neither run may be rewritten, merged, cleaned, or deleted.

## 3. Objective

The resolver preflight design review exists to answer:

```text
How can a later controlled probe inspect dependency-closure feasibility
for the Python 3.13 toolchain
without silently downloading artifacts,
installing packages,
mutating venv,
writing caches,
polluting scratch protected directories,
or destroying historical evidence?
```

This document defines the review boundary for answering that question later. It does not answer dependency closure by executing a resolver in this phase.

## 4. Python Baseline

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
```

```text
Python 3.13 remains the first-choice path.

Python 3.12 fallback
=
NOT_GRANTED
```

The existing isolated venv is protected. This review grants no permission to invoke pip, upgrade pip, add packages, remove packages, change the interpreter, or create a fallback venv.

## 5. Known Metadata-Ledger Findings

The previously observed package candidates are:

| Package | Candidate version | Current observation |
| --- | ---: | --- |
| `paddlex` | `3.6.1` | platform-independent wheel observed |
| `paddlepaddle` | `3.3.1` | standard `cp313-win_amd64` wheel observed |
| `paddle2onnx` | `2.1.0` | `CP313_ASSESSMENT = UNKNOWN_OR_ABSENT` |
| `onnx` | `1.21.0` | `cp313-cp313t-win_amd64` wheel observed |
| `onnxruntime` | `1.26.0` | standard `cp313-win_amd64` wheel observed |
| `PyYAML` | `6.0.3` | standard `cp313-win_amd64` wheel observed |
| `numpy` | `2.4.6` | standard `cp313` and `cp313t` wheels observed |

These observations have deliberately limited meaning:

```text
metadata visible
≠
dependency closure proven

artifact HEAD 200
≠
artifact download approved

wheel filename observed
≠
ABI compatibility proven
```

Candidate visibility is not a lock, approval, installation result, runtime result, or production-readiness result.

## 6. P0 Technical Risks

### 6.1 Risk A: `paddle2onnx`

```text
paddle2onnx 2.1.0
CP313_ASSESSMENT
=
UNKNOWN_OR_ABSENT
```

A later separately approved probe must determine whether the Python 3.13 path is absent, unresolved, sdist-dependent, or build-chain dependent. It must distinguish a real cp313 compatibility boundary from proxy, TLS, index, redirect, command-format, cache, mirror, or runner failures.

An sdist-only or build-chain-dependent path is not an acceptable silent fallback. Discovery of such a path must stop the probe before build isolation, source build, artifact-body fetch, or package mutation.

### 6.2 Risk B: `onnx`

```text
onnx-1.21.0-cp313-cp313t-win_amd64.whl
```

The `cp313t` tag indicates the free-threaded ABI line. It must not be assumed compatible with the current standard Python 3.13 baseline. A filename that mentions cp313 does not prove compatibility with the active interpreter ABI.

A later probe must keep standard `cp313` and free-threaded `cp313t` assessments separate and must not select or approve a `cp313t` artifact for the current standard interpreter without independent proof.

## 7. Central Design Judgment

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
```

A resolver may access additional metadata, fetch wheel or sdist bodies, create cache or temporary files, enter build isolation, invoke build backends, or write diagnostic and report files even when the operator intends no installation.

Flags or labels such as dry-run, report, resolver-only, or no-install do not independently prove a read-only execution boundary.

Therefore, resolver invocation remains forbidden until:

1. a separate resolver-preflight runner draft is produced response-only;
2. its complete behavior and write boundary receive an independent static review;
3. every network, cache, temporary-file, build-isolation, and evidence path is explicit;
4. the user separately approves controlled execution.

## 8. Boundary: Allowed and Forbidden Actions

### 8.1 Allowed Docs-Only Actions

This phase allows only:

- read-only repository and scratch-state verification;
- read-only review of upstream constraints and existing evidence;
- architecture reasoning about resolver risks and controls;
- creation, validation, commit, and push of this one approved architecture document;
- running the existing repository build as a validation step;
- read-only postchecks proving protected state remained unchanged.

### 8.2 Prohibited Runtime Actions

The following remain forbidden:

```text
resolver invocation
pip invocation
artifact GET
Range request
wheel body fetch
sdist body fetch
artifact persistence
pip cache write
temp write outside an explicit allowlist
build isolation
source build
package installation
package uninstall
package upgrade
venv mutation
Python 3.12 fallback
model download
model conversion
tar packaging
formal OCR implementation
multi-image OCR UI
PDF support
cloud OCR
Phase 9 modification
```

No runtime prohibition may be relaxed by interpreting this design document as execution approval.

## 9. Protected Evidence

The following historical evidence must remain present and unchanged:

```text
logs\20260604-124646-352
evidence\20260604-124646-352

logs\20260604-115858-865
evidence\20260604-115858-865

R7 transfer file
R7a transfer file
R7b transfer file
```

The currently protected transfer files are:

```text
D:\Download\HouseFolio-F0-4C-3-4-R7-function-definition.ps1
D:\Download\HouseFolio-F0-4C-3-4-R7a-host-variable-hotfix-function-definition.ps1
D:\Download\HouseFolio-F0-4C-3-4-R7b-manifest-binding-hotfix-function-definition.ps1
```

No later runner may treat the successful runId as permission to remove the failed runId or replace prior transfer files.

## 10. Future Resolver-Preflight Evidence Allowlist

This design-review phase creates no runId and no resolver-preflight evidence.

For a later separately approved controlled resolver-preflight execution, the proposed minimum write allowlist is:

```text
logs\<runId>\preflight-summary.txt
logs\<runId>\resolver-environment-summary.txt
logs\<runId>\postcheck-summary.txt
logs\<runId>\final-probe-summary.txt

evidence\<runId>\resolver-preflight-ledger.json
evidence\<runId>\resolver-preflight-ledger.txt
```

Optional only after review:

```text
evidence\<runId>\resolver-diagnostics-redacted.txt
```

Diagnostics must be normalized, redacted, and length-limited. They must not contain credentials, secret environment values, complete raw metadata bodies, artifact bodies, full unreviewed URLs, contract data, or unbounded resolver output.

The future runner must own exactly one collision-free runId and must never exclude, rewrite, or reuse an existing runId.

## 11. Forbidden Write Locations

Writes are explicitly prohibited to:

```text
downloads
source-models
converted
packaged
env\venv
README-boundary.txt
formal HouseFolio source files
historical logs\<runId>
historical evidence\<runId>
R7 / R7a / R7b transfer files
```

Any cache, temporary, report, lock, build, or diagnostic output outside the separately approved allowlist is a boundary violation, even if automatically created by a tool.

## 12. Proposed Resolver-Preflight Ledger Schema

A future separately reviewed resolver-preflight ledger must include at least:

```text
runId
pythonVersion
pythonArchitecture
pipVersion
proxyMode
repositoryClean
protectedDirsEmptyBefore
protectedDirsEmptyAfter
venvManifestUnchanged
cacheMutationObserved
tempMutationObserved
artifactBodyFetchObserved
sdistPathObserved
buildIsolationObserved
candidatePackages
dependencyNamesObserved
dependencyClosureStatus
paddle2onnxCp313Assessment
onnxAbiAssessment
python312FallbackAssessment
nonActions
```

Recommended field semantics:

| Field | Required meaning |
| --- | --- |
| `runId` | collision-free identifier owned only by the approved execution |
| `pythonVersion` | exact observed interpreter version |
| `pythonArchitecture` | exact architecture, machine, and standard/free-threaded ABI assessment |
| `pipVersion` | exact protected baseline version, observed without invoking pip |
| `proxyMode` | approved explicit-local-proxy mode only |
| `repositoryClean` | before-and-after clean-state result |
| `protectedDirsEmptyBefore` / `protectedDirsEmptyAfter` | recursive emptiness checks for all four protected directories |
| `venvManifestUnchanged` | before-and-after manifest comparison |
| `cacheMutationObserved` | boolean plus bounded explanation |
| `tempMutationObserved` | boolean plus allowlist classification |
| `artifactBodyFetchObserved` | boolean; `true` forces stop |
| `sdistPathObserved` | boolean plus package names, without fetching bodies |
| `buildIsolationObserved` | boolean; `true` forces stop |
| `candidatePackages` | bounded normalized candidate records |
| `dependencyNamesObserved` | bounded normalized dependency-name set |
| `dependencyClosureStatus` | explicit proven, unresolved, blocked, or stopped classification |
| `paddle2onnxCp313Assessment` | absent, unresolved, sdist-dependent, build-chain-dependent, or proven compatible |
| `onnxAbiAssessment` | separate standard-cp313 and cp313t assessment |
| `python312FallbackAssessment` | always `NOT_GRANTED` in the resolver-preflight execution |
| `nonActions` | explicit record of prohibited actions not executed |

The ledger must not claim dependency closure when only top-level candidates or filenames were observed.

## 13. Stop Conditions

A future controlled resolver-preflight execution must stop immediately on any of the following:

### 13.1 Repository and Protected-Baseline Stops

- repository mutation;
- staged files;
- unexpected untracked files;
- protected stash drift;
- `.env.local` drift;
- historical evidence mutation;
- R7 / R7a / R7b mutation;
- protected directory mutation;
- venv manifest drift;
- Python baseline drift;
- pip baseline drift.

### 13.2 Network and Source Stops

- proxy bypass or direct fallback;
- third-party proxy;
- third-party mirror;
- unapproved redirect;
- TLS verification bypass;
- access to a host outside the reviewed role-based allowlist;
- artifact body fetch;
- artifact GET;
- Range request.

### 13.3 Filesystem and Resolver-Behavior Stops

- pip cache write;
- any unapproved cache write;
- unapproved temp write;
- build isolation;
- source build;
- wheel or sdist persistence;
- package installation;
- package uninstall;
- package upgrade;
- any venv mutation.

### 13.4 Scope and Fallback Stops

- fallback-version switch;
- Python 3.12 download, installation, venv creation, or PATH change;
- model download;
- model conversion;
- tar packaging;
- formal OCR implementation;
- multi-image OCR UI implementation;
- PDF support;
- cloud OCR;
- Phase 9 modification;
- any other scope expansion.

```text
On any stop condition:
do not auto-fix
do not retry
do not broaden permissions
preserve evidence
report the exact boundary violation
```

Stopping must preserve the complete before/after integrity evidence that is still safe to write within the approved current-run allowlist.

## 14. Python 3.12 Fallback Conditions

```text
Python 3.12 fallback
=
NOT_GRANTED
```

A future Python 3.12 side-by-side fallback design review is allowed only if all of the following are satisfied:

```text
1. Python 3.13 resolver preflight was separately approved and executed.
2. Official metadata and artifact HEAD evidence are closed.
3. The failure is specifically caused by cp313 artifact absence,
   ABI mismatch, or unresolved dependency closure.
4. Proxy, TLS, allowlist, index, cache, mirror,
   runner, and command-format failures are excluded.
5. No artifact download, package install, or venv pollution occurred.
6. The user separately approves a Python 3.12 fallback design review.
```

Meeting these conditions would authorize only a docs-only fallback design review, not a Python 3.12 download, installation, environment creation, or execution.

## 15. Next-Phase Decomposition

```text
Phase 10B-1-2B-1-F0-4C-3-4-2-1
→ formal plan materialization
→ this docs-only round

Phase 10B-1-2B-1-F0-4C-3-4-2-2
→ resolver preflight runner draft
→ response-only
→ do not execute
→ do not create runId

Phase 10B-1-2B-1-F0-4C-3-4-2-3
→ resolver preflight runner static review
→ independent review
→ do not execute

Only if static review passes:
Phase 10B-1-2B-1-F0-4C-3-4-2-4
→ controlled resolver preflight execution
→ scratch-only
→ requires separate user approval
```

The runner draft must remain response-only. Materializing, loading, invoking, or partially testing it requires separate review and approval.

## 16. Design Review Conclusion

The resolver-preflight architecture is viable only as a sequence of separately reviewed and separately approved stages. A tool's promise not to install packages is insufficient evidence of read-only behavior.

The future runner must prove, rather than assume:

- network access remains on approved official endpoints through the explicit local proxy;
- no artifact body or Range request occurs;
- all writes stay within the current-run allowlist;
- no pip cache, unapproved temp, build-isolation, source-build, or venv mutation occurs;
- protected historical evidence, transfer files, and scratch directories remain unchanged;
- standard `cp313` and free-threaded `cp313t` are assessed separately;
- unresolved `paddle2onnx` behavior is reported without silent fallback.

Until those controls receive static review and separate execution approval, resolver execution remains forbidden.

## 17. Final Structured Closeout

```text
CURRENT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-4-2-0

CURRENT_PHASE_RESULT
=
DESIGN_REVIEW_PASS_WITH_CONDITIONS

FORMAL_PLAN_MATERIALIZATION
=
AUTHORIZED_DOCS_ONLY

RESOLVER_EXECUTION
=
NOT_GRANTED

PACKAGE_INSTALLATION
=
FORBIDDEN

ARTIFACT_DOWNLOAD
=
FORBIDDEN

MODEL_DOWNLOAD
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
Phase 10B-1-2B-1-F0-4C-3-4-2-2
Resolver Preflight Runner Draft

NEXT_PHASE_EXECUTION_PERMISSION
=
NOT_GRANTED
```
