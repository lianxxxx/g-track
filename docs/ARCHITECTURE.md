# Architecture

## Purpose

g-track is a developer activity tracking app. It pulls a developer's activity from external sources (GitHub first), normalizes it into a common event model, stores what's relevant, and visualizes it as a dashboard and activity heatmap.

## MVP flow

1. User signs in with GitHub (Better Auth + GitHub OAuth).
2. g-track fetches the user's GitHub activity via Octokit using their OAuth token.
3. Raw GitHub data is normalized into `activity_events`.
4. Relevant data is stored in Neon Postgres via Drizzle; daily aggregates are derived from it.
5. The dashboard reads the stored data and renders the heatmap and charts.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Neon PostgreSQL · Drizzle ORM · Better Auth · GitHub OAuth/API via Octokit · Zod

## Layers

| Layer | Lives in | Responsibility |
|---|---|---|
| Routes & pages | `src/app/` | Pages, layouts, API route handlers. Server Components read data through `src/db/` queries. No external API calls from UI code. |
| Components | `src/components/` | Presentational UI and hand-built SVG charts (heatmap, stat charts). No data access. |
| Auth | `src/lib/auth*` | Better Auth config, GitHub OAuth provider, session helpers, access to the stored GitHub token. |
| GitHub integration | `src/lib/github*` | Octokit client, fetching activity, mapping GitHub payloads → `activity_events`. The only place that knows GitHub API shapes. |
| Sync | `src/app/api/sync` | Orchestrates fetch → normalize → store: the contribution calendar into `contribution_days`, events into `activity_events` (pruning rebased commit copies), then updates sync state. |
| Database | `src/db/` | Drizzle schema, migrations, query functions. The only layer that touches the database. |
| Validation | Zod at boundaries | Route bodies, env vars, any untrusted input. GitHub responses use Octokit's types, not re-validation. |
| Types | `src/types/` | Shared TypeScript types not derived from schema. |

## Data flow

```
Browser
  │  sign in with GitHub
  ▼
Auth (src/lib/auth) ──── GitHub OAuth ────► GitHub
  │  session + GitHub access token
  ▼
Sync (server)
  │
  ├─► GitHub client (src/lib/github) ── Octokit ──► GitHub API
  │        │  commits, PRs, issues, reviews, ...
  │        ▼
  │     normalize ──► activity_events rows
  │
  ▼
Drizzle queries (src/db) ──► Neon Postgres
  │     users/auth · projects · activity_events · contribution_days · integrations
  ▼
Dashboard (src/app + src/components)
        heatmap · activity charts
```

## Data model

- **users / auth tables**: owned by Better Auth (user, session, account incl. GitHub token, verification).
- **projects**: the unit activity is attributed to (a GitHub repository for now), linked to a user.
- **activity_events**: the normalized event model and the core of the system. One row per activity: `user_id`, `project_id`, `source` (`github` today), `type` (commit, pr_opened, pr_merged, issue, review, …), `occurred_at`, `external_id` (for dedup), plus minimal metadata. Every source, current and future, feeds this table; the dashboard reads its recent activity list from it.
- **contribution_days**: per-user daily counts from GitHub's contribution calendar, the numbers behind the graph on a GitHub profile. A full year, and private contributions are included as counts when the user has "Include private contributions on my profile" on. Powers the heatmap and the dashboard stats (total, streak, busiest day).
- **integrations / sync state**: per-user, per-source connection and sync cursor (`last_synced_at`, last seen event, status) so fetches are incremental and failures are visible.

## Sources

- **Current:** GitHub only, through the Events API. It reaches back about 90 days and 300 events, so a sync is a rolling window rather than a full history. Event payloads no longer carry a push's commit list, so each push is expanded through the compare API (`before...head`) to get the individual commits.
- **Contribution calendar:** fetched through the GraphQL API (`viewer.contributionsCollection.contributionCalendar`) on every sync. It works with the default `read:user` scope, so full-year history and private counts need no extra permissions. The response is Zod-validated because GraphQL has no generated types.
- **Future (planned, not built):** local Git, Claude Code, Codex. They will eventually write to `activity_events` too, that is why the event model is normalized. Do **not** implement or abstract for them now: no provider interfaces, no source registries, no placeholder modules. The `source` column is the only concession.
- **Local CLI:** a Node.js TypeScript CLI will be introduced only when local activity tracking is actually built. Nothing for it exists before then.

## Boundaries

- All database access goes through Drizzle in `src/db/`. No raw SQL or DB clients in routes, components, or `src/lib/`.
- External integrations (GitHub, auth) live in their own modules under `src/lib/`; the rest of the app consumes their typed functions, not Octokit or Better Auth directly.
- Keep the architecture simple. Add a layer, table, or abstraction only when a real requirement appears, not in anticipation of one.
