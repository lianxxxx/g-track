# Workflow

How features and meaningful changes are worked on in g-track. Rules and stack live in [AGENTS.md](../AGENTS.md); system design in [ARCHITECTURE.md](ARCHITECTURE.md).

## Steps

1. **Understand**: Clarify the request and the expected behavior before touching code.
2. **Inspect**: Read the relevant existing code, docs, types, and architecture. Don't assume structure or APIs.
3. **Plan**: For non-trivial work, write a short implementation plan: affected files, data flow, risks. Skip for trivial changes.
4. **Implement**: Make the smallest focused change that solves the requirement.
5. **Reuse**: Follow existing patterns. No new abstractions or dependencies unless the existing ones genuinely can't do the job.
6. **Validate**: Run the relevant lint/build/tests defined in AGENTS.md (`## Validation`).
7. **Review the diff**: Check for accidental changes, dead code, type issues, duplication, hardcoded secrets, and unnecessary complexity.
8. **UI work**: Use the relevant frontend/design skill when available.
9. **Summarize**: State what changed, why, what was validated, and any remaining concerns.

## Rules

- Do not commit or push unless explicitly requested.
- Do not mix unrelated refactors into feature work.
- Do not implement future g-track features (local CLI, Claude Code, Codex) ahead of their phase.
- If the requested change conflicts with [ARCHITECTURE.md](ARCHITECTURE.md) or [AGENTS.md](../AGENTS.md), surface the conflict before implementing.
