# Phase 4L-2：Compare / AI contextual copy boundary scan

Date: 2026-05-19

## 1. Purpose

Phase 4L-1 defined the recommended demo and interview presentation path.

This phase performs a small contextual copy boundary scan for Compare and AI-related files.

The first scan attempt was intentionally conservative and failed because forbidden product-positioning terms appeared in:

    src/lib/ai/compare-explanation-prompt.ts

The finding was useful: those terms appeared in the prompt guardrail surface, where they are expected as negative constraints, not as positive UI or product positioning.

Therefore this phase uses a contextual rule:

    UI / source copy must not contain forbidden positive-positioning terms.
    Prompt files may contain those terms only as nearby negative guardrails.

## 2. Stable baseline

Latest stable commit before this scan:

8af0c15 docs: review demo presentation path

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- Phase 4L-1 pushed to origin/main
- tracked files contained no likely real secret key
- DeepSeek API key remained only in local .env.local

## 3. Files scanned as UI / source copy

These files were scanned with strict forbidden-term rules:

    src/content/zh-cn.ts
    src/components/compare-explanation-panel.tsx
    src/components/compare-selected-listings-panel.tsx
    src/components/compare-table.tsx
    src/app/compare/page.tsx
    src/lib/ai/deepseek-provider.ts
    src/app/api/ai/compare-explanation/route.ts

Result:

    PASS: UI/source copy has no forbidden positive-positioning terms.

## 4. Prompt file scanned contextually

This file was scanned with contextual negative-guardrail rules:

    src/lib/ai/compare-explanation-prompt.ts

The following terms may appear in this prompt only when they are used as negative constraints:

    最佳房源
    最优选择
    系统推荐
    推荐分
    替你决定
    真房源
    避坑保真
    认证真房源

Result:

    PASS: prompt forbidden terms, if present, are treated as negative guardrails.

## 5. Boundary hints checked

The scan also checked that the scanned source surface still contains boundary-oriented hints such as:

    辅助
    不代表最终推荐
    确认
    清除本次
    AI

These markers are not exhaustive correctness proof, but they indicate that the current copy remains oriented around:

- auxiliary comparison
- user confirmation before AI
- session-only AI output control
- no final recommendation framing

## 6. Current copy boundary judgment

The current Compare / AI copy remains acceptable for the current MVP stage.

It continues to frame HouseFolio as:

    辅助比较
    结构化对比
    AI 辅助解释
    用户确认后触发
    不代表最终推荐

It does not appear to frame HouseFolio as:

    房源推荐系统
    AI 选房系统
    真房源认证工具
    避坑保真工具
    替用户决定的工具

The prompt may explicitly list forbidden phrases as model guardrails. That is acceptable because it reduces risk rather than increasing it.

## 7. L2 / L3 boundary confirmed by copy

The current copy remains aligned with the intended split:

    L2 = Reference Score / Compare table / rule-based auxiliary comparison
    L3 = AI explanation / checklist / human-readable summary

L3 is still not positioned as:

    scoring
    ranking
    filtering
    authenticity judgment
    final decision-making

## 8. What this scan does not prove

This scan does not prove:

- real model output will never use forbidden wording
- public launch readiness
- AI safety completeness
- AI cost control
- rate limiting
- production observability
- legal policy readiness
- Settings AI data rights coverage

It only confirms that the current static Compare and AI-related source copy does not positively position HouseFolio using the scanned high-risk terms.

## 9. Follow-up recommendation

The next safe step is:

    Phase 4L-3：Portfolio interview story draft

That phase should convert the current product and engineering milestones into a concise interview narrative.

It should not modify UI, AI, Settings, README, or provider code unless a separate implementation plan is created.