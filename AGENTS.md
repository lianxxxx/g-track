<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# g-track

Developer activity tracking app. Pulls a developer's activity (starting with GitHub) and visualizes it.

Deeper context: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (system design, data model) and [docs/WORKFLOW.md](docs/WORKFLOW.md) (how we plan, build, and review). Read them before non-trivial changes. SEO conventions live in [docs/SEO.md](docs/SEO.md). Deployment (Vercel + Neon, env vars, migrations) lives in [docs/DEPLOY.md](docs/DEPLOY.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · GitHub OAuth + API · Neon PostgreSQL · Drizzle ORM · Better Auth · Zod · Recharts

Planned later (do not build ahead of time): Node.js TypeScript CLI, Claude Code activity integration, Codex integration.

## Project layout

- `src/app/`: routes and API handlers
- `src/components/`: React components
- `src/lib/`: shared utilities, API clients, auth config
- `src/db/`: Drizzle schema, migrations, queries
- `src/types/`: shared TypeScript types

## Rules

- **Keep it simple.** Prefer the boring, direct solution. No premature abstractions, extract a helper/layer only when a second real use case exists.
- **Type safety end to end.** No `any` or unchecked casts. Use Zod for untrusted input at application boundaries where runtime validation is needed (API route bodies, env vars, webhooks); derive types from schemas where practical. Prefer existing typed SDK responses (e.g. GitHub's) over re-validating them.
- **Small, reviewable changes.** One concern per commit/PR. Don't mix refactors with features. Agents must not create commits or push unless the user explicitly requests it.
- **No unnecessary dependencies.** The stack above covers the current scope; adding a dependency requires clear justification the existing stack can't meet.
- **Database access goes through Drizzle** in `src/db/`: no raw SQL scattered in routes or components.
- **Secrets stay in env vars** (`.env*` is gitignored). Never hardcode tokens or connection strings.
- **Don't build for the planned features yet** (CLI, Claude Code, Codex). No speculative interfaces or "provider" layers for integrations that don't exist.

## Validation

- Run `npm run lint` after meaningful code changes.
- Run `npm run build` before considering larger or structural changes complete.
- Run the relevant tests once the project has a test suite.
- Do not run unnecessary expensive checks for documentation-only or trivial non-code changes.
