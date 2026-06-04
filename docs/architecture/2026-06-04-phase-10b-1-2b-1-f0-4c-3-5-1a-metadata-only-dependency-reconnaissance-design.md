# HouseFolio Phase 10B-1-2B-1-F0-4C-3-5-1A
## Metadata-Only Dependency Reconnaissance Design

## 0. Document Purpose

This is a docs-only Track A design review.

It designs a future metadata-only dependency reconnaissance probe.

It does not authorize:

- runner creation;
- runner invocation;
- runId creation;
- pip invocation;
- resolver invocation;
- package-network requests;
- metadata GET;
- PEP 658 metadata GET;
- Paddle index GET;
- artifact HEAD;
- artifact GET;
- Range request;
- wheel or sdist body fetch;
- temp write;
- cache write;
- resolver sandbox creation;
- package installation;
- venv mutation;
- Python 3.12 fallback;
- model download;
- model conversion;
- tar packaging;
- formal OCR implementation.

This document creates no runner, runId, network evidence, cache root, temporary root, resolver sandbox, package artifact, model artifact, or application-source change.

## 1. Inheritance and Product Boundary

This design explicitly inherits:

1. `HouseFolio Phase 10 Harness｜多图片本地 OCR 合同输入增强总约束 v1.0.md`
2. `HouseFolio Phase 9M-R Harness｜全文脱敏合同风险提示链路总约束 v1.0`
3. `HouseFolio Phase 10B-1-2B-1-F0-4C-3-4-1-1 接续文档｜Host-Side Gate B–D Controlled Execution 关闭与 Resolver Preflight 启动准备 v1.0`
4. `docs/architecture/2026-06-03-phase-10b-1-2b-1-f0-4c-3-3-python313-controlled-package-resolution-probe-execution-plan.md`
5. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-4-2-0-controlled-python-package-resolver-preflight-design-review.md`
6. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-5-0-pip-resolver-body-fetch-boundary-reconciliation-review.md`

The newest boundary-reconciliation review is authoritative for Track A.

Phase 10 remains additive OCR input enhancement only. It must not rewrite Phase 9.

Continue to preserve:

```text
contract images remain local
OCR remains page-by-page
partial OCR failures preserve successful results
images and unconfirmed OCR text remain session-only
OCR text requires human review
user confirmation is required before Phase 9
Phase 9 full redacted preview remains required
Phase 9 AI-send confirmation remains required
no image is sent to DeepSeek
no silent cloud OCR fallback
first version does not support PDF
```

Continue to preserve Phase 9M-R principles:

```text
internal rigor
external simplicity
rules are signals
L2 owns riskLevel
AI explains only
reasoning_content is not displayed, stored, exported, or logged
```

Track A is a technical reconnaissance design only. It does not change any product behavior or permission.

## 2. Previous-Phase Closeout

```text
PREVIOUS_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-0
Pip Resolver Body-Fetch Boundary Reconciliation Review

PREVIOUS_PHASE_RESULT
=
PASS_WITH_CLOSURE

SELECTED_RECOMMENDATION
=
RECOMMEND_TRACK_A_THEN_TRACK_B_REVIEW

TRACK_A_CLASSIFICATION
=
METADATA_ONLY_RECONNAISSANCE_NOT_FULL_RESOLVER

TRACK_B_CLASSIFICATION
=
SEPARATE_BOUNDARY_RELAXATION_REVIEW_REQUIRED
```

Track B remains conditional and unauthorized. Track B does not begin automatically after this design or after any future Track A result.

## 3. Track A Objective

The future Track A purpose is narrowly defined:

```text
Inspect visible dependency metadata for the Python 3.13 conversion-toolchain
candidate graph using only separately approved official metadata roles,
without invoking pip or a resolver and without fetching package artifact bodies.
```

Track A must help answer:

- Which direct dependency names are visible?
- Which version constraints are visible?
- Which `Requires-Python` declarations are visible?
- Which environment markers are visible?
- Which nodes expose static dependency metadata?
- Which nodes appear sdist-only, dynamically generated, absent, or unresolved?
- Which standard `cp313` wheel candidates are visible?
- Which `cp313t` free-threaded wheels must remain separate?
- Does `paddle2onnx` remain an unresolved cp313 node?
- Which nodes justify escalation to Track B review?

Track A must produce a bounded graph envelope and an unresolved-node ledger. It must not silently replace missing dependency metadata with guesses.

## 4. Mandatory Non-Claims

The following statements must appear prominently in every future Track A plan, runner draft, evidence ledger, and closeout:

```text
Track A metadata-only reconnaissance
≠
pip resolver

Track A metadata-only reconnaissance
≠
full dependency closure

Track A metadata-only reconnaissance
≠
resolver-equivalent backtracking

Track A metadata-only reconnaissance
≠
package-installation viability

Track A metadata-only reconnaissance
≠
build viability

Track A metadata-only reconnaissance
≠
runtime viability

Track A metadata-only reconnaissance
≠
production readiness
```

Any future Track A result must use reconnaissance terminology only.

Forbidden result labels include:

```text
dependency closure proven
resolver pass
installable
buildable
runtime compatible
production ready
```

## 5. Locked Baseline for Static Classification

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

platform
=
Windows

pip
=
25.2

Python 3.12 fallback
=
NOT_GRANTED
```

The future reconnaissance may use this baseline only for bounded static classification. It must not invoke pip, inspect a Python 3.12 environment, create a fallback environment, or mutate the current venv.

## 6. Root-Candidate Scope

The initial visible candidate scope remains:

| Package | Candidate role | Current candidate status |
| --- | --- | --- |
| `paddlex` | official export and conversion entrypoint | `3.6.1`, visible finding only |
| `paddlepaddle` | Paddle runtime candidate | `3.3.1`, visible finding only |
| `paddle2onnx` | conversion candidate | `2.1.0`, unresolved cp313 finding |
| `onnx` | ONNX structure dependency candidate | not pre-locked beyond visible finding |
| `onnxruntime` | ONNX runtime candidate | not pre-locked beyond visible finding |
| `PyYAML` | config dependency candidate | not pre-locked beyond visible finding |
| `numpy` | numeric dependency candidate | not pre-locked beyond visible finding |

```text
candidate version
≠
locked version

visible metadata
≠
dependency closure

visible artifact filename
≠
download approval

visible cp313 text
≠
ABI compatibility proof
```

The root set is closed for the initial future execution. New roots require a separate docs-only scope review.

## 7. Proposed Official Endpoint Roles

No endpoint request is authorized by this document.

| Endpoint role | Purpose | Proposed method | Future authorization status |
| --- | --- | --- | --- |
| PyPI project JSON metadata | inspect project-level metadata | bounded `GET` | separately reviewable |
| PyPI version JSON metadata | inspect exact candidate-version metadata | bounded `GET` | separately reviewable |
| PEP 658 / core metadata | inspect exact approved artifact metadata when separately exposed | bounded `GET` | separately reviewable |
| Paddle stable CPU index metadata | inspect official stable candidates | bounded `GET` | separately reviewable |
| Paddle nightly CPU index metadata | inspect official nightly candidates | bounded `GET` | separately reviewable |
| Artifact review | inspect exact ledger-derived artifact URLs | `HEAD` only | separately reviewable |

The future runner design must define exact:

```text
host
path pattern
endpoint role
HTTP method
redirect policy
response-size cap
request-count cap
timeout
content-type expectation
normalization policy
```

Explicitly forbidden:

```text
artifact GET
Range request
wheel-body fetch
sdist-body fetch
third-party mirrors
third-party CDN fallback
TLS bypass
direct / no-proxy fallback
unapproved redirects
host-only wildcard authorization
```

Host-only matching is insufficient. A permitted host with an unapproved path or role remains forbidden.

## 8. Proposed Metadata-Graph Traversal

### 8.1 Design Principle

The future Track A traversal is breadth-first, bounded, deterministic, and incomplete by design.

It inspects visible metadata and records unresolved branches. It does not solve constraints, backtrack, choose an install set, or execute package-controlled code.

### 8.2 Conservative Numeric Caps

```text
root candidate packages
=
7

maximum graph depth
=
4 dependency edges from each root

maximum node count (unique normalized nodes)
=
64

maximum versions inspected per package
=
2

maximum total metadata requests (GET only)
=
160

maximum artifact HEAD requests
=
24

maximum redirects
=
1 per request
and
12 total

maximum PyPI project JSON response bytes
=
2 MiB

maximum PyPI version JSON response bytes
=
2 MiB

maximum PEP 658 / core-metadata response bytes
=
512 KiB

maximum Paddle index metadata response bytes
=
2 MiB

maximum artifact HEAD response-body bytes
=
0

maximum total metadata response bytes
=
32 MiB

maximum wall-clock duration
=
12 minutes
```

Any cap reached before the graph envelope is described produces unresolved nodes or a boundary stop. Caps must never be silently increased during execution.

### 8.3 Node and Edge Model

A normalized node contains at least:

```text
canonicalPackageName
observedDisplayName
inspectedVersion
sourceEndpointRole
depth
parentNodeKeys
requiresPython
requiresDistObserved
artifactKindsObserved
standardCp313Assessment
freeThreadedCp313tAssessment
winAmd64Assessment
metadataAvailability
reconnaissanceStatus
unresolvedReasons
```

A normalized edge contains at least:

```text
parentNodeKey
childCanonicalPackageName
rawSpecifierNormalized
extrasNormalized
markerExpressionNormalized
markerStaticClassification
edgeStatus
```

### 8.4 Package-Name Canonicalization

Package names must use PEP 503-style canonicalization:

```text
lowercase
collapse each run of hyphen, underscore, or period to one hyphen
```

The original observed display name may be retained as a bounded field. Graph identity uses the canonical name.

### 8.5 Duplicate-Node Normalization

A node key is:

```text
canonical package name
+
normalized inspected version
+
metadata source class
```

The same node reached from multiple parents is stored once with bounded parent references. Duplicate discovery does not consume another node slot, but each actual network request still consumes request quotas.

### 8.6 Cycle Detection

The traversal maintains:

```text
visited node-key set
active ancestor node-key set
```

An edge pointing to an active ancestor is recorded as a cycle edge and is not expanded. An edge pointing to any visited node reuses the existing node and is not expanded again.

Cycles are findings, not failures and not closure proof.

### 8.7 Version Inspection Rule

The traversal does not select a resolver answer.

For each package:

1. inspect an exact version when the parent requirement is exactly pinned and visible;
2. otherwise inspect at most two visible versions compatible with the static `Requires-Python` baseline:
   - the highest visible non-yanked stable version satisfying the visible specifier;
   - one additional boundary-relevant version, if needed, such as the highest lower compatible stable version or an explicitly referenced root candidate;
3. do not inspect prereleases unless the visible requirement explicitly permits prereleases or the package scope explicitly identifies a nightly endpoint;
4. treat stable and Paddle nightly candidates as separate source classes;
5. record all non-inspected candidate space as outside the bounded reconnaissance.

Version ordering uses normalized PEP 440 ordering where parseable. Unparseable versions remain unresolved and are not guessed into order.

This inspection rule is not resolver-equivalent candidate selection.

### 8.8 Environment-Marker Handling

Track A may inspect and normalize visible marker expressions.

Each marker must be classified as exactly one:

```text
marker expression observed
marker statically classified true
marker statically classified false
marker evaluation unresolved
```

Bounded static classification may use only:

```text
Python = 3.13.7
architecture = 64bit
machine = AMD64
platform = Windows
```

Any unsupported, ambiguous, malformed, dynamically generated, implementation-dependent, platform-detail-dependent, or extra-dependent marker remains unresolved.

Track A must not claim complete resolver-equivalent marker evaluation.

### 8.9 `Requires-Python` Handling

Visible `Requires-Python` is normalized and statically classified against Python `3.13.7`.

Classifications:

```text
compatible_visible_declaration
incompatible_visible_declaration
missing_declaration
unparseable_declaration
unresolved_declaration
```

A compatible declaration is not artifact compatibility proof.

### 8.10 Extras and Conditional Dependencies

The initial roots request no extras unless a separately approved design explicitly names them.

Rules:

- dependencies requiring unrequested extras are recorded but not expanded;
- extra-dependent marker expressions are classified unresolved unless the extra is explicitly in scope;
- optional and conditional dependencies are preserved as separate edges;
- no conditional edge is silently treated as unconditional;
- no missing extra is inferred.

### 8.11 Missing and Dynamic Metadata

If dependency metadata is missing, dynamic, inconsistent, or not exposed through an approved metadata role:

```text
mark node unresolved
do not fetch wheel body
do not fetch sdist body
do not send Range
do not invoke build isolation
do not invoke resolver
do not guess dependencies
```

Dynamic metadata includes metadata requiring package execution, build-backend execution, source extraction, or build isolation.

### 8.12 Sdist-Only Handling

An sdist-only candidate is recorded as:

```text
artifactAvailability = sdist_only_visible
metadataReconnaissanceStatus = unresolved_without_body_or_build
```

Track A must not fetch the sdist, inspect its contents, invoke a build backend, or claim build viability.

### 8.13 Artifact Tag Classification

Visible artifact filenames may be statically classified into separate buckets:

```text
standard_cp313_candidate
free_threaded_cp313t_candidate
abi3_candidate_requires_review
platform_independent_candidate
other_or_unresolved_abi
```

`cp313t` must never be merged into standard `cp313`.

Visible `win_amd64` may be classified as a Windows AMD64 filename observation only. It is not complete ABI or runtime compatibility proof.

### 8.14 Unknown-Node Classification

Every node that cannot be completely described within approved roles and caps must use one or more explicit unresolved reasons:

```text
metadata_absent
metadata_dynamic
metadata_role_not_approved
response_cap_reached
request_cap_reached
depth_cap_reached
node_cap_reached
version_inspection_cap_reached
marker_unresolved
requires_python_unresolved
sdist_only
artifact_tags_unresolved
redirect_blocked
endpoint_unavailable
other_bounded_reason
```

Unknown nodes must never disappear from the graph summary.

## 9. PEP 658 Handling Boundary

```text
PEP 658 metadata GET
=
separately reviewable official metadata-role request

PEP 658 metadata GET
≠
artifact GET

PEP 658 metadata GET
≠
wheel-body fetch approval

PEP 658 metadata availability
≠
dependency closure proof
```

A future runner may request an exact approved `.metadata` URL only if:

```text
the URL is derived from an already approved official artifact ledger
the host and path match the reviewed metadata role
the request remains bounded
redirects remain within the approved metadata role
the response body is processed in memory
raw body persistence is forbidden
only normalized bounded fields are written
```

If PEP 658 metadata is unavailable:

```text
mark the node unresolved
do not fetch the wheel body
do not send Range
do not fall back to sdist
do not invoke build isolation
```

PEP 658 response bytes count against both the role-specific response cap and the total metadata response cap.

## 10. Artifact HEAD Boundary

Artifact HEAD is a separate future endpoint role and is not authorized by this document.

Only exact artifact URLs already derived from approved official metadata may be considered. HEAD may record bounded normalized fields such as:

```text
official role
final approved host and path classification
status
content type
content length
filename
visible Python tag
visible ABI tag
visible platform tag
```

Artifact HEAD must not:

```text
send GET
send Range
accept a response body
follow an unapproved redirect
authorize download
prove ABI compatibility
prove installation viability
```

## 11. Proposed Outcome Classifications

### `PASS_WITH_RECONNAISSANCE_ENVELOPE`

Use only when bounded visible metadata is sufficient to describe the reviewed graph envelope without material unresolved nodes.

This result does not mean dependency closure.

### `PASS_WITH_UNRESOLVED_NODES`

Use when useful metadata was gathered but one or more material nodes remain unresolved.

This may justify a separate Track B design review. It does not authorize Track B.

### `BLOCKED_BY_METADATA_BOUNDARY`

Use when Track A cannot gather enough metadata under approved metadata-only roles or conservative caps to produce a useful reconnaissance envelope.

### `STOPPED_BOUNDARY_VIOLATION`

Use on any forbidden request, host, method, redirect, write, mutation, scope drift, or protected-state mismatch.

No outcome may be renamed to imply resolver closure, installation viability, build viability, runtime viability, or production readiness.

## 12. Proposed Future Evidence Allowlist

A future separately approved Track A execution may write only to a new collision-free current-run directory.

Suggested minimum:

```text
logs\<runId>\preflight-summary.txt
logs\<runId>\metadata-connectivity-summary.txt
logs\<runId>\postcheck-summary.txt
logs\<runId>\final-reconnaissance-summary.txt

evidence\<runId>\metadata-graph-ledger.json
evidence\<runId>\metadata-graph-ledger.txt
evidence\<runId>\unresolved-node-ledger.json
evidence\<runId>\unresolved-node-ledger.txt
evidence\<runId>\artifact-head-ledger.json
evidence\<runId>\artifact-head-ledger.txt
```

Optional only if explicitly justified:

```text
evidence\<runId>\metadata-diagnostics-redacted.txt
```

Evidence must remain:

```text
normalized
bounded
redacted
current-run-only
collision-safe
non-overwriting
```

Do not persist:

```text
raw metadata bodies
raw index bodies
artifact bodies
full unreviewed URLs
proxy values
secret values
.env.local contents
unbounded stdout
unbounded stderr
real contract images
real contract text
```

Recommended ledger-level caps:

```text
maximum metadata-graph ledger JSON bytes = 1 MiB
maximum metadata-graph ledger TXT bytes = 1 MiB
maximum unresolved-node ledger JSON bytes = 512 KiB
maximum unresolved-node ledger TXT bytes = 512 KiB
maximum artifact-head ledger JSON bytes = 512 KiB
maximum artifact-head ledger TXT bytes = 512 KiB
maximum optional diagnostics bytes = 256 KiB
```

Do not silently truncate evidence. Stop safely before writing an output that exceeds its approved cap.

## 13. Protected Write Boundary

Future Track A execution may write only into newly owned current-run directories under:

```text
D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\logs\<runId>\

D:\Download\housefolio-phase-10b-1-official-model-conversion-spike\evidence\<runId>\
```

It must not write to:

```text
downloads
source-models
converted
packaged
env\venv
README-boundary.txt
formal HouseFolio repository files
historical logs\<runId>
historical evidence\<runId>
R7 / R7a / R7b transfer files
Windows proxy settings
Git configuration
PowerShell profile
Python installation
PATH
```

This document does not authorize future execution or current-run directory creation.

## 14. Future Track A Stop Conditions

A future Track A execution design must stop immediately on:

```text
repository mutation
staged files
unexpected untracked files
protected stash drift
.env.local drift
README-boundary.txt drift
historical evidence mutation
R7 / R7a / R7b mutation
protected-directory mutation
venv manifest drift
Python baseline drift
pip baseline drift
proxy bypass
direct fallback
third-party proxy
third-party mirror
third-party CDN fallback
TLS bypass
unapproved host
unapproved path
unapproved method
unapproved redirect
response-size quota breach
request-count quota breach
wall-clock quota breach
artifact GET
Range request
wheel-body fetch
sdist-body fetch
raw metadata persistence
raw index persistence
unapproved temp write
cache write
resolver invocation
pip invocation
package installation
venv mutation
model download
model conversion
tar packaging
Python 3.12 fallback
formal OCR implementation
multi-image OCR UI
PDF support
cloud OCR
Phase 9 modification
scope expansion
```

```text
On any stop condition:
do not auto-fix
do not retry
do not broaden permissions
preserve safe evidence
report the exact boundary violation
```

If a boundary violation occurs before the current-run evidence directories are safely owned, do not create them merely to report the violation.

## 15. Next-Phase Decomposition

```text
Phase 10B-1-2B-1-F0-4C-3-5-1A
→ metadata-only dependency reconnaissance design
→ this docs-only round

Phase 10B-1-2B-1-F0-4C-3-5-2A
→ metadata-only runner draft
→ response-only
→ do not execute
→ do not create runId

Phase 10B-1-2B-1-F0-4C-3-5-3A
→ metadata-only runner static review
→ response-only
→ do not execute

Only after separate user approval:
Phase 10B-1-2B-1-F0-4C-3-5-4A
→ controlled metadata-only reconnaissance execution
→ scratch-only
```

```text
Track B remains conditional.
Track B does not begin automatically.
Track B requires a separate user-approved docs-only boundary review.
```

## 16. Current-Phase Stop Conditions

For this docs-only materialization phase, stop if:

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

## 17. Current Authorization Boundary

This document authorizes only its own docs-only materialization, validation, commit, push, and remote closure.

It does not authorize a runner, runId, package-network request, metadata request, PEP 658 request, Paddle index request, artifact HEAD, artifact body request, temporary write, cache write, package installation, resolver sandbox, model action, or Track B action.

## 18. Final Structured Closeout

```text
CURRENT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-1A

CURRENT_PHASE_TYPE
=
DOCS_ONLY_METADATA_RECONNAISSANCE_DESIGN

PREVIOUS_PHASE_RESULT
=
PASS_WITH_CLOSURE

SELECTED_TRACK
=
TRACK_A_METADATA_ONLY_RECONNAISSANCE

TRACK_A_CLASSIFICATION
=
NOT_FULL_RESOLVER

TRACK_B_STATUS
=
CONDITIONAL_NOT_AUTHORIZED

RUNNER_CREATION
=
NOT_GRANTED

RUN_ID_CREATION
=
NOT_GRANTED

PIP_INVOCATION
=
NOT_GRANTED

RESOLVER_INVOCATION
=
NOT_GRANTED

PACKAGE_NETWORK_REQUEST
=
NOT_GRANTED

METADATA_GET
=
NOT_GRANTED

PEP658_METADATA_GET
=
NOT_GRANTED

ARTIFACT_HEAD
=
NOT_GRANTED

ARTIFACT_GET
=
FORBIDDEN

RANGE_REQUEST
=
FORBIDDEN

WHEEL_BODY_FETCH
=
FORBIDDEN

SDIST_BODY_FETCH
=
FORBIDDEN

TEMP_WRITE
=
NOT_GRANTED

CACHE_WRITE
=
FORBIDDEN

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
Phase 10B-1-2B-1-F0-4C-3-5-2A
Metadata-Only Runner Draft

NEXT_PHASE_TYPE
=
RESPONSE_ONLY

NEXT_PHASE_EXECUTION_PERMISSION
=
NOT_GRANTED
```
