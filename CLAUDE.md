# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

AGENTS.md is the shared source of repository rules (stack, layout, coding rules). This file only adds how Claude Code should work here.

## Working instructions

- Read AGENTS.md and the relevant files in `docs/` before non-trivial work.
- Inspect existing code before editing; do not assume structure or APIs.
- For non-trivial features, briefly plan the change before implementing.
- Prefer small, focused edits over large rewrites.
- Use relevant skills from `.claude/skills/` when applicable.
- Do not add dependencies unless necessary and justified.
- Do not create commits or push unless explicitly asked.
- After meaningful code changes, run the relevant validation (`npm run lint`, `npx tsc --noEmit`, `npm run build` as appropriate) and review the diff.
- If a request conflicts with the existing architecture or project rules, point it out before implementing.
- Do not prematurely implement planned features (local CLI, Claude Code tracking, Codex integration).
