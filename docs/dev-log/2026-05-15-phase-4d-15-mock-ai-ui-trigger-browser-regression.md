# Phase 4D-15｜Mock AI UI trigger browser regression

Date: 2026-05-15

## Goal

Validate the mock AI compare explanation UI trigger in browser before moving to any real AI provider work.

This phase only covers browser manual regression and documentation.

## Scope

Allowed:

- Run local dev server.
- Manually test `/portfolio` → `/compare?ids=...`.
- Verify mock AI UI trigger behavior.
- Verify mock AI output is session-only.
- Verify no AI-related localStorage persistence.
- Record regression result in dev-log.

Not allowed in this phase:

- Do not change route behavior.
- Do not change mock provider behavior.
- Do not connect DeepSeek.
- Do not write real prompt builder.
- Do not add localStorage keys.
- Do not modify Settings.
- Do not persist AI output.
- Do not change source code unless a regression blocker is found.

## Startup baseline

Startup check passed before this regression:

- `git status` was clean.
- `HEAD` was `807b5d7 feat: add mock ai compare ui trigger`.
- `origin/main` also pointed to `807b5d7`.
- `807b5d7` was confirmed to be contained in `origin/main`.
- `npm.cmd run build` passed.

Confirmed route table included:

- `/api/ai/compare-explanation`
- `/api/lbs/commute/transit`
- `/compare`
- `/portfolio`
- `/portfolio/[id]`
- `/portfolio/new`
- `/settings`
- `/demo`

## Manual browser regression

Dev server:

- `npm.cmd run dev -- --port 3210`
- Browser URL: `http://localhost:3210`

Manual checks:

| Check | Result |
|---|---|
| `/portfolio` opens normally | PASS |
| Select 2–4 listings | PASS |
| Navigate to `/compare?ids=...` | PASS |
| CompareTable visible | PASS |
| Static explanation panel visible | PASS |
| Mock AI trigger block visible | PASS |
| Click trigger shows loading state | PASS |
| Mock AI output renders | PASS |
| Output wording remains mock-only / auxiliary-only | PASS |
| Refresh clears mock AI output | PASS |
| CompareTable remains after refresh | PASS |
| Portfolio / detail navigation works | PASS |
| Settings has no AI data section | PASS |
| Browser console has no red runtime error | PASS |
| localStorage AI-related key check returns `[]` | PASS |

## localStorage persistence check

The following browser console check was used:

```js
Object.keys(localStorage).filter((key) =>
  key.toLowerCase().includes("ai") ||
  key.toLowerCase().includes("explanation") ||
  key.toLowerCase().includes("history") ||
  key.toLowerCase().includes("prompt") ||
  key.toLowerCase().includes("report")
)

Observed result:

[]

Conclusion:

The mock AI output is not persisted.
No AI-related localStorage key was introduced.
Settings does not need to be updated in this phase.
Boundary confirmation

Confirmed:

Mock AI generation is user-triggered.
Mock AI output is not automatically generated.
Mock AI output disappears after refresh.
CompareTable remains stable after refresh.
Static explanation panel remains stable.
No source code change was required.
No route change was required.
No mock provider change was required.
No DeepSeek integration was introduced.
No real prompt was introduced.
No Settings change was introduced.
No AI output persistence was introduced.
Product and compliance notes

The browser regression confirms that the current mock AI UI trigger stays inside the intended Phase 4D boundary:

L3 remains an explanation layer.
L3 does not score, rank, filter, or decide for the user.
The output remains auxiliary and mock-only.
The UI does not claim system recommendation, best listing, true listing verification, or final decision authority.
The current behavior is suitable as a temporary mock AI interaction before any real provider boundary review.
Result

Phase 4D-15 passed.

Next recommended phase:

Phase 4D-16: Mock AI UI trigger closing checkpoint / handoff, or
Phase 4D-16: Real AI provider preflight boundary review,

depending on whether the next step should remain documentation-only or begin preparing the DeepSeek/provider boundary review.

Do not connect DeepSeek directly after this phase without a dedicated boundary review.