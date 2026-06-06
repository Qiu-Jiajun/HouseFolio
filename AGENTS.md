<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:housefolio-phase-11 -->
# HouseFolio Phase 11 Codex Instructions

Before planning, reviewing, or modifying Phase 11 code, read:

```
docs/architecture/2026-06-06-phase-11-viewing-log-harness-v1.0.md
```

Phase 11 adds:

```
/viewing-log
看房计划与记录助手
```

Hard rules:

* `/viewing-log` is a convenience projection over the same canonical listing data used by `/portfolio` and `/portfolio/[id]`.
* It is not a second database.
* Use `listingId` as the only relationship key.
* Do not duplicate title, rent, address, photos, commute, notes, status, or ratings.
* Any field shown or edited in the `/viewing-log` drawer must also surface in `/portfolio/[id]`.
* Pages and components must not directly manipulate localStorage, IndexedDB, or platform SDKs. Use shared business-layer functions.
* `/viewing-log` must not display system reference score, recommendation score, or system stars.
* Unviewed listings show user-entered `期待值`.
* Viewed listings show user-entered `总体评分`.
* Preserve the two ratings independently.
* `已排除` does not imply `已看房`.
* Any new local data must be covered by Settings view, JSON export, JSON import, and local clear.
* User-facing Chinese copy belongs in `src/content/zh-cn.ts` where practical.
* Use adaptive Codex batching: prefer one cohesive module task when scope is clear and risk is low.
* Do not touch the Phase 10 OCR worktree, runner, scratch workspace, or evidence.

Pause with:

```
PAUSE_FOR_REVIEW
```

when:

* canonical authority is unclear;
* old JSON import compatibility is uncertain;
* diff expands beyond approved files;
* build fails;
* task crosses into OCR or fragile shared state.
<!-- END:housefolio-phase-11 -->
