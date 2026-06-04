# HouseFolio Phase 10B-1-2B-1-F0-4C-3-5-1A-F0
## Metadata-Only Reconnaissance Boundary Correction Review

## 0. Document Purpose

This is a docs-only Track A boundary-correction review.

It records the corrections required by the first static review of the
response-only metadata-only runner draft.

This document does not create, save, materialize, invoke, dot-source, or
partially test a corrected runner. It does not authorize a runId, pip, a
resolver, package-network access, metadata requests, PEP 658 or PEP 714
metadata requests, Paddle index requests, artifact requests, temporary
writes, cache writes, package installation, venv mutation, model actions, or
Python 3.12 fallback.

The previous response-only runner draft remains historical review material.
It must not be executed, saved, dot-sourced, partially tested, or treated as
approved.

## 1. Inherited Boundary

This review inherits the product, privacy, and sequencing boundaries repeated
in:

1. `HouseFolio Phase 10 Harness`;
2. `HouseFolio Phase 9M-R Harness`;
3. the Host-Side Gate B-D controlled-execution continuation;
4. `docs/architecture/2026-06-03-phase-10b-1-2b-1-f0-4c-3-3-python313-controlled-package-resolution-probe-execution-plan.md`;
5. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-4-2-0-controlled-python-package-resolver-preflight-design-review.md`;
6. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-5-0-pip-resolver-body-fetch-boundary-reconciliation-review.md`;
7. `docs/architecture/2026-06-04-phase-10b-1-2b-1-f0-4c-3-5-1a-metadata-only-dependency-reconnaissance-design.md`.

The newest Track A design remains authoritative except where this correction
review explicitly tightens the future runner boundary.

Track A remains:

```text
TRACK_A_METADATA_ONLY_RECONNAISSANCE
METADATA_ONLY_RECONNAISSANCE_NOT_FULL_RESOLVER
```

Track B remains:

```text
CONDITIONAL_NOT_AUTHORIZED
```

The correction review must not weaken these non-claims:

```text
Track A metadata-only reconnaissance
!=
pip resolver

Track A metadata-only reconnaissance
!=
full dependency closure

Track A metadata-only reconnaissance
!=
resolver-equivalent backtracking

Track A metadata-only reconnaissance
!=
package-installation viability

Track A metadata-only reconnaissance
!=
build viability

Track A metadata-only reconnaissance
!=
runtime viability

Track A metadata-only reconnaissance
!=
production readiness
```

## 2. Previous-Round Closeout

```text
PREVIOUS_RUNNER_DRAFT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-2A

PREVIOUS_RUNNER_DRAFT_RESULT
=
DRAFT_READY_FOR_STATIC_REVIEW

STATIC_REVIEW_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-3A-R1

STATIC_REVIEW_RESULT
=
BLOCKED_PENDING_BOUNDARY_CORRECTIONS

PREVIOUS_RUNNER_EXECUTION_PERMISSION
=
NOT_GRANTED
```

The previous runner draft remains response-only historical material. Static
review blocked it before execution permission, and this document does not
materialize or correct that runner.

## 3. Correction Matrix

| ID | Severity | Static-review finding | Required boundary correction | Future runner implication |
| -- | -------- | --------------------- | ---------------------------- | ------------------------- |
| F0-C1 | P0 | `ProxyHandler` entry is not proof that the proxy was actually applied | Check `proxy_bypass(req.host)` first, delegate to base `proxy_open()`, verify HTTPS tunnel host or HTTP `has_proxy()`, then mark proxy assertion | Every initial request and redirect must fail closed before network dispatch when proxy application is not proven |
| F0-C2 | P0 | PyPI-specific JSON API and Simple Repository API were treated as interchangeable | Add exact `PYPI_SIMPLE_PROJECT_JSON` role with required JSON `Accept` header | PEP 658 and PEP 714 sidecar discovery must originate from an approved Simple API file record |
| F0-C3 | P0 | PEP 658 sidecar permission was derived from PyPI-specific JSON fields rather than the approved Simple API signal chain | Prefer `core-metadata`, optionally accept legacy `dist-info-metadata`, derive the exact `.metadata` URL from an approved Simple API file record, and verify advertised SHA-256 | No approved signal or hash mismatch produces unresolved or boundary stop; artifact-body fallback remains forbidden |
| F0-C4 | P0 | Global host temp and cache snapshots cannot solely attribute child-process writes | Validate scratch top-level allowlist, use current-run evidence directory for child working directory and temp/cache variables, then require it to remain empty immediately after child return | PowerShell may write normalized evidence only after the empty child-write guard passes |
| F0-C5 | P1 | Capped strings were silently sliced | On any field cap, record `field_cap_reached` unresolved or stop before evidence write | No silent truncation is permitted in normalized output or diagnostics |
| F0-C6 | P0 | Visible `Requires-Python` was recorded without complete required static classification | Classify every visible declaration against Python `3.13.7` and reject incompatible versions as compatible candidates | Candidate inspection must preserve incompatible, missing, unparseable, and unresolved states explicitly |
| F0-C7 | P0 | Envelope overflow fallback could re-emit the oversized ledgers | Return a minimal stop envelope containing no nodes, edges, unresolved ledger, or artifact ledger | Overflow handling must itself stay under the bounded-output boundary |
| F0-C8 | P1 | `HEAD` evidence could imply that the server returned zero body bytes | Record only `requestMethod = HEAD` and `responseBodyReadAttempted = false` | Do not claim `serverReturnedBodyBytes = 0` without independent proof that does not fetch artifact-body bytes |
| F0-C9 | P0 | Venv validation confirmed one pip metadata directory but did not prove complete site-packages inventory | Capture and compare the complete approved site-packages baseline inventory | Any unexpected distribution, file, or directory is a protected-state mismatch |
| F0-C10 | P0 | Nightly Paddle role was disabled even though prior controlled evidence grounded the exact nightly CPU path | Enable stable and nightly as distinct exact endpoint roles | Stable and nightly remain separate source classes and must never be silently merged |

## 4. F0-C1 Proxy Fail-Closed Correction

```text
ProxyHandler entry
!=
proxy application proof
```

For every initial request and every redirected request, a future runner must:

1. parse and validate the exact endpoint role before dispatch;
2. evaluate `proxy_bypass(req.host)`;
3. stop with `STOPPED_BOUNDARY_VIOLATION` when bypass is true;
4. delegate to the base `ProxyHandler.proxy_open()`;
5. validate proxy application after delegation:
   - HTTPS requires the approved tunnel host;
   - HTTP requires `has_proxy()`;
6. only after the post-delegation check, mark the request as proxy asserted;
7. stop before dispatch if any assertion is absent or ambiguous.

The only approved proxy remains:

```text
http://127.0.0.1:10808
```

The future runner must not use environment-derived proxy fallback, direct
fallback, no-proxy fallback, a third-party proxy, Windows proxy mutation, Git
proxy mutation, persistent proxy mutation, or TLS verification bypass.

## 5. F0-C2 Simple Repository API Role

The future endpoint-role model adds:

```text
PYPI_SIMPLE_PROJECT_JSON
```

Exact role shape:

```text
scheme
=
https

host
=
pypi.org

path pattern
=
/simple/<canonical-name>/

method
=
GET

Accept
=
application/vnd.pypi.simple.v1+json
```

For this role:

- the canonical package name must be PEP 503 normalized before URL formation;
- the path must equal the exact expected project path;
- the `Accept` header must equal the approved JSON media type;
- redirects must remain inside the same role and preserve the header;
- an HTML response is not silently accepted as Simple JSON;
- role drift, path drift, host drift, method drift, or Accept-header drift
  stops before further processing.

```text
PyPI-specific JSON API
!=
Simple Repository API

PEP 658 / PEP 714 sidecar discovery
->
must come from Simple API metadata signal
```

## 6. F0-C3 PEP 658 and PEP 714 Correction

A future runner must use this sidecar permission chain:

1. request an approved exact `PYPI_SIMPLE_PROJECT_JSON` endpoint;
2. inspect only a bounded in-memory Simple API JSON file record;
3. prefer the `core-metadata` signal;
4. optionally support the legacy `dist-info-metadata` signal;
5. require the signal to be explicit and attached to that exact file record;
6. derive the exact sidecar URL by appending `.metadata` to that approved
   file-record URL;
7. validate the exact official sidecar URL under `PEP658_METADATA`;
8. require the same endpoint role across any approved redirect;
9. verify the metadata SHA-256 when the Simple API signal provides one;
10. process the sidecar body in memory only;
11. persist normalized bounded fields only.

The future runner must not derive PEP 658 or PEP 714 permission from:

```text
host alone
artifact filename alone
PyPI-specific JSON alone
guessed .metadata URL
arbitrary artifact URL transformation
```

If no approved Simple API signal exists:

```text
mark unresolved
do not fetch wheel body
do not send Range
do not fetch sdist
do not invoke build isolation
```

A provided metadata SHA-256 mismatch is an immediate:

```text
STOPPED_BOUNDARY_VIOLATION
```

## 7. F0-C4 Scratch-Root and Child Temp Guard

Before current-run ownership or child-process creation, a future runner must
validate the conversion scratch top-level entry allowlist:

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

The future runner may create exactly:

```text
logs\<runId>\
evidence\<runId>\
```

The Python child may use the newly owned current-run evidence directory only
as:

```text
WorkingDirectory
TEMP
TMP
TMPDIR
PIP_CACHE_DIR
```

Immediately after the Python subprocess exits and before PowerShell writes any
normalized evidence:

```text
evidence\<runId>\
must remain empty
```

Any child-created file or directory produces:

```text
STOPPED_BOUNDARY_VIOLATION
```

No additional child temp directory, cache directory, Python bytecode file,
diagnostic file, raw response file, or partial output file is authorized.

Global host TEMP and global pip-cache snapshots may remain informational
integrity signals. They are not sufficient as the sole attribution mechanism
for child-process mutation.

## 8. F0-C5 No-Silent-Truncation Correction

A future runner must never silently slice, abbreviate, or discard a bounded
field.

Before accepting a field, it must:

1. calculate the encoded byte length;
2. compare the value against the field-specific cap;
3. either retain the complete field within cap;
4. record an explicit `field_cap_reached` unresolved reason; or
5. stop before evidence write when the field is required for safe
   classification.

The runner must not replace a capped value with a partial string that can be
mistaken for complete evidence.

This applies to:

```text
package names
versions
requirements
markers
filenames
safe diagnostics
parent references
normalized endpoint observations
```

## 9. F0-C6 Requires-Python Static Classification

Every visible `Requires-Python` declaration must be normalized and classified
against:

```text
Python
=
3.13.7
```

Allowed classifications:

```text
compatible_visible_declaration
incompatible_visible_declaration
missing_declaration
unparseable_declaration
unresolved_declaration
```

Rules:

- a statically incompatible version must not be presented as a compatible
  candidate;
- an unparseable or unsupported declaration remains unresolved;
- a missing declaration is not silently treated as compatible;
- a compatible visible declaration is not ABI proof;
- `cp313t` remains separate from standard `cp313`;
- visible `win_amd64` remains an observation, not runtime compatibility proof.

## 10. F0-C7 Minimal Cap-Overflow Envelope

On normalized-envelope cap breach, the embedded Python process must return a
minimal stop envelope only.

The minimal envelope may contain only bounded scalar fields such as:

```text
schema
classification = STOPPED_BOUNDARY_VIOLATION
safeReason = normalized_envelope_cap_reached
track
trackClassification
nonClaims
```

It must not re-emit:

```text
nodes
edges
unresolved ledger
artifact ledger
request ledger
raw metadata
```

PowerShell must validate that an overflow envelope is minimal before any
evidence write.

## 11. F0-C8 Artifact HEAD Evidence Semantics

For every approved artifact HEAD observation, the future runner must record:

```text
requestMethod
=
HEAD

responseBodyReadAttempted
=
false
```

It may record bounded normalized response headers that do not require body
access.

It must not claim:

```text
serverReturnedBodyBytes
=
0
```

unless that statement is independently proven without fetching
artifact-body bytes. The runner must never read, consume, save, hash, or
inspect an artifact response body.

## 12. F0-C9 Venv Inventory Baseline

The future runner must validate:

```text
site-packages inventory
=
approved baseline only
```

The approved baseline must be represented as a complete bounded recursive
manifest of the protected venv and a complete normalized site-packages
distribution inventory.

It is insufficient to confirm only that one `pip-*.dist-info` directory
exists.

The runner must stop on:

```text
unexpected distribution
unexpected site-packages file or directory
missing approved baseline file
venv manifest drift
Python executable drift
pip metadata drift
```

No future Track A child may invoke pip to obtain this inventory.

## 13. F0-C10 Paddle Stable and Nightly Exact Roles

Prior controlled evidence grounded both exact paths:

```text
https://www.paddlepaddle.org.cn/packages/stable/cpu/

https://www.paddlepaddle.org.cn/packages/nightly/cpu/
```

The corrected future runner design enables both as distinct exact endpoint
roles:

```text
PADDLE_STABLE_INDEX
PADDLE_NIGHTLY_INDEX
```

Stable and nightly:

- use separate exact URLs;
- use separate source classes;
- receive separate normalized observations;
- receive separate request and response caps;
- preserve divergence as a finding;
- are never merged into one candidate source;
- do not authorize Paddle artifact GET or HEAD by host alone.

Silent omission of the nightly role is not permitted in the corrected runner
draft.

## 14. Revised Endpoint-Role Model

| Role | Method | Required validation |
| --- | --- | --- |
| `PYPI_PROJECT_JSON` | `GET` | exact PyPI-specific `/pypi/<canonical-name>/json` project path |
| `PYPI_VERSION_JSON` | `GET` | exact PyPI-specific `/pypi/<canonical-name>/<version>/json` version path |
| `PYPI_SIMPLE_PROJECT_JSON` | `GET` | exact `/simple/<canonical-name>/`, exact JSON `Accept` header |
| `PEP658_METADATA` | `GET` | exact sidecar derived from an approved Simple API file record and verified against advertised SHA-256 when provided |
| `PADDLE_STABLE_INDEX` | `GET` | exact `https://www.paddlepaddle.org.cn/packages/stable/cpu/` path |
| `PADDLE_NIGHTLY_INDEX` | `GET` | exact `https://www.paddlepaddle.org.cn/packages/nightly/cpu/` path |
| `ARTIFACT_HEAD` | `HEAD` | exact ledger-derived official artifact URL; no response-body read attempt |

Every role must validate:

```text
scheme
host
exact or role-approved path pattern
method
endpoint role
redirect policy
response-size cap
request-count cap
timeout
content-type expectation
required request headers
proxy application proof
```

Continue to forbid:

```text
artifact GET
Range
wheel-body fetch
sdist-body fetch
third-party host
third-party mirror
CDN fallback
TLS bypass
direct fallback
no-proxy fallback
unapproved redirects
host-only wildcard authorization
```

## 15. Revised Current-Run Ownership Design

When and only when a later execution phase receives separate user approval,
the future runner may:

1. establish all read-only preflight checks;
2. capture complete protected-state baselines;
3. create one collision-free `runId` using `yyyyMMdd-HHmmss-fff`;
4. refuse any existing `logs\<runId>` or `evidence\<runId>`;
5. create only the two newly owned current-run directories;
6. use `evidence\<runId>` as the child's working and temp/cache directory;
7. require `evidence\<runId>` to remain empty after the child returns;
8. only then write approved normalized evidence through PowerShell
   `.NET WriteAllText` with UTF-8 and no BOM.

No child-created current-run entry is accepted, renamed, normalized, or
cleaned. Detection is a stop, and the runner does not delete it.

The evidence allowlist remains limited to:

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

Raw metadata, raw index bodies, artifact bodies, proxy values, secret values,
full unreviewed URLs, raw stdout, raw stderr, and unbounded diagnostics remain
forbidden.

## 16. Revised Stop Conditions

A future corrected runner must stop immediately on:

```text
proxy_bypass true
proxy not actually applied after base ProxyHandler call
Simple API role drift
Simple API Accept-header drift
PEP 658 hash mismatch
silent field truncation
scratch-root entry drift
unexpected current-run evidence entry after child return
statically incompatible Requires-Python candidate presented as compatible
non-minimal overflow envelope
nightly role silently omitted without documented narrowing
```

It must also preserve all existing Track A stops, including:

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
venv inventory or manifest drift
Python baseline drift
pip baseline drift
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
cache write
resolver invocation
pip invocation
package installation
venv mutation
model download
model conversion
tar packaging
Python 3.12 fallback
scope expansion
```

On any stop:

```text
do not auto-fix
do not retry
do not broaden permission
do not silently truncate
do not delete child-created entries
do not delete current-run evidence
do not delete historical evidence
report the exact safe redacted reason
```

## 17. Boundary Decision

```text
SELECTED_DECISION
=
CORRECTION_BOUNDARY_READY_FOR_RUNNER_R2
```

The correction boundary is sufficient for a response-only corrected runner
draft because it now defines:

- fail-closed post-delegation proxy application proof;
- a separate Simple Repository API JSON role;
- an explicit Simple API to PEP 658 / PEP 714 sidecar permission chain;
- hash verification when advertised;
- a child-specific empty temp/cache ownership guard;
- explicit no-silent-truncation behavior;
- complete `Requires-Python` classification;
- minimal overflow behavior;
- accurate artifact HEAD evidence semantics;
- complete venv inventory validation;
- distinct exact Paddle stable and nightly roles.

This decision authorizes only a response-only corrected runner draft. It does
not authorize runner materialization, partial testing, execution, runId
creation, network access, or evidence creation.

## 18. Next-Phase Decomposition

```text
Phase 10B-1-2B-1-F0-4C-3-5-2A-R2
->
corrected metadata-only runner draft
->
response-only
->
do not execute
->
do not save
```

Then:

```text
Phase 10B-1-2B-1-F0-4C-3-5-3A-R2
->
corrected runner static review
->
response-only
->
do not execute
```

Only after independent static review passes and the user separately approves:

```text
Phase 10B-1-2B-1-F0-4C-3-5-4A
->
controlled metadata-only reconnaissance execution
->
scratch-only
```

Track B remains conditional and unauthorized.

## 19. Current Authorization Boundary

This document authorizes only its own docs-only materialization, validation,
commit, push, and remote closure.

It does not authorize:

```text
corrected runner creation
runner invocation
runId creation
pip invocation
resolver invocation
package-network request
metadata GET
PEP 658 or PEP 714 metadata GET
Paddle index GET
artifact HEAD
artifact GET
Range request
wheel-body fetch
sdist-body fetch
temp write
cache write
package installation
venv mutation
model download
model conversion
tar packaging
Python 3.12 fallback
Track B action
```

## 20. Final Structured Closeout

```text
CURRENT_PHASE
=
Phase 10B-1-2B-1-F0-4C-3-5-1A-F0

CURRENT_PHASE_TYPE
=
DOCS_ONLY_BOUNDARY_CORRECTION_REVIEW

PREVIOUS_RUNNER_STATIC_REVIEW_RESULT
=
BLOCKED_PENDING_BOUNDARY_CORRECTIONS

SELECTED_DECISION
=
CORRECTION_BOUNDARY_READY_FOR_RUNNER_R2

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
Phase 10B-1-2B-1-F0-4C-3-5-2A-R2
Corrected Metadata-Only Runner Draft

NEXT_PHASE_TYPE
=
RESPONSE_ONLY

NEXT_PHASE_EXECUTION_PERMISSION
=
NOT_GRANTED

NEXT_PHASE_SAVE_PERMISSION
=
NOT_GRANTED
```
