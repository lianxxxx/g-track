# g-track

g-track is a developer activity tracking app. It pulls a developer's activity from GitHub (commits, pull requests, issues, and code reviews), normalizes it into a unified event model, and visualizes it as a dashboard with an activity heatmap and charts.

Sign-in is handled through GitHub OAuth. Each user's dashboard is private; only the marketing pages are public.

## Status

Early development. The project structure, documentation, and SEO foundation are in place. Authentication, GitHub sync, the database schema, and the dashboard are being built next.

## Stack

- [Next.js](https://nextjs.org) (App Router) with TypeScript
- Tailwind CSS
- Neon PostgreSQL with Drizzle ORM
- Better Auth with GitHub OAuth
- GitHub API via Octokit
- Zod for validation at boundaries
- Recharts for data visualization

## Project structure

| Directory | Purpose |
|---|---|
| `src/app/` | Routes, pages, and API handlers |
| `src/components/` | Presentational UI and charts |
| `src/lib/` | Shared utilities, auth config, GitHub client |
| `src/db/` | Drizzle schema, migrations, and queries |
| `src/types/` | Shared TypeScript types |
| `docs/` | Architecture, workflow, and SEO documentation |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other useful commands:

```bash
npm run lint     # run ESLint
npm run build    # production build
```

Environment variables go in `.env.local` (gitignored). `NEXT_PUBLIC_SITE_URL` should be set to the production URL when deployed; it falls back to `http://localhost:3000` locally.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): system design, layers, and data model
- [docs/WORKFLOW.md](docs/WORKFLOW.md): how changes are planned, built, and reviewed
- [docs/SEO.md](docs/SEO.md): SEO conventions and checklists
- [AGENTS.md](AGENTS.md): project rules for AI coding agents
