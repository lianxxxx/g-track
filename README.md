# g-track

g-track is a developer activity tracking app. It pulls a developer's activity from GitHub (commits, pull requests, issues, and code reviews), normalizes it into a unified event model, and visualizes it as a dashboard with an activity heatmap and charts.

Sign-in is handled through GitHub OAuth. Each user's dashboard is private; only the marketing pages are public.

## Status

Live at [g-trackph.vercel.app](https://g-trackph.vercel.app). Sign in with GitHub, hit Sync, and the dashboard shows:

- a full-year contribution heatmap (from GitHub's contribution calendar, private contributions included when your profile allows it)
- total contributions, current streak, and busiest day
- your recent commits, pull requests, issues, and reviews from about the last 90 days (public repos)

## Stack

- [Next.js](https://nextjs.org) (App Router) with TypeScript
- Tailwind CSS
- Neon PostgreSQL with Drizzle ORM
- Better Auth with GitHub OAuth
- GitHub API via Octokit
- Zod for validation at boundaries

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

Requires Node.js 24 (24.22.1 or later, see `.nvmrc`).

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

Environment variables go in `.env` (gitignored), template in `.env.example`. Production values are set in Vercel, see [docs/DEPLOY.md](docs/DEPLOY.md).

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): system design, layers, and data model
- [docs/WORKFLOW.md](docs/WORKFLOW.md): how changes are planned, built, and reviewed
- [docs/DEPLOY.md](docs/DEPLOY.md): Vercel + Neon environments, env vars, deploy and migration flow
- [docs/SEO.md](docs/SEO.md): SEO conventions and checklists
- [AGENTS.md](AGENTS.md): project rules for AI coding agents
