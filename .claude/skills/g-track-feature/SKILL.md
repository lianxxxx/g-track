---
name: g-track-feature
description: Standard workflow for implementing a feature or meaningful code change in g-track, features, bug fixes, refactors, integrations, database changes, and meaningful UI changes. Use when asked to build, add, change, fix, or refactor anything in this repo beyond a trivial edit.
---

# g-track feature workflow

Follow this for any non-trivial change. Source of truth for rules and context, read, don't duplicate:

- `AGENTS.md`: stack, layout, project rules, validation commands
- `CLAUDE.md`: Claude Code working instructions
- `docs/ARCHITECTURE.md`: layers, data flow, data model, boundaries
- `docs/WORKFLOW.md`: how changes are planned, built, reviewed

## 1. Understand

- Clarify the requested behavior from the existing context.
- Identify acceptance criteria and affected areas (routes, components, `src/lib/`, `src/db/`, types).
- Don't ask questions the repository already answers.

## 2. Inspect

- Read `AGENTS.md`, `CLAUDE.md`, and the relevant parts of `docs/ARCHITECTURE.md` / `docs/WORKFLOW.md`.
- Read the related existing code before editing: don't assume structure or APIs.
- Reuse existing patterns instead of inventing new ones.

## 3. Plan

- For non-trivial work, write a short plan: affected files, data flow, database/API impact, notable risks.
- Keep scope to the requested feature.

## 4. Implement

- Make the smallest complete change that solves the requirement.
- Preserve end-to-end type safety: no `any`, no unchecked casts.
- No premature abstractions, no speculative support for future features.
- No new dependencies unless clearly necessary and justified.
- Secrets and credentials stay in env vars, never in source.

## 5. Validate

Run the validation commands defined in `AGENTS.md` (`## Validation`):

- `npm run lint` after meaningful code changes.
- `npm run build` for larger or structural changes.
- Relevant tests once a test suite exists.
- Skip expensive checks for documentation-only changes.

## 6. Review

- Review the final diff.
- Check for: accidental edits, dead code, duplication, unsafe casts, hardcoded secrets, unnecessary complexity, architecture violations (see `docs/ARCHITECTURE.md` boundaries).
- For non-trivial changes, spawn the `code-reviewer` agent on the diff and address its findings.
- If `src/db/` changed, also spawn the `db-reviewer` agent.
- For frontend/UI work, use the `impeccable` skill when relevant.

## 7. Report

Briefly summarize:

- what changed
- why it changed
- important files touched
- validation performed
- any remaining concerns

## Rules

- Never create commits or push unless the user explicitly requests it.
- Never mix unrelated refactors into feature work.
- Do not implement planned future features (local CLI, Claude Code tracking, Codex tracking) unless explicitly requested.
- If a request conflicts with `AGENTS.md` or `docs/ARCHITECTURE.md`, surface the conflict before implementing.
- Prefer simple, direct solutions over clever abstractions.
