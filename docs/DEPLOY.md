# Deployment

g-track runs on **Vercel** (Next.js) with **Neon** Postgres. Git is the deploy trigger: every push to `main` is a production deploy, every other branch or pull request gets its own preview deploy. Nothing is deployed by hand.

## Environments

| | Local | Preview (branch / PR) | Production (`main`) |
|---|---|---|---|
| URL | `http://localhost:3000` | `https://g-track-git-<branch>-<scope>.vercel.app` (auto) | `https://<project>.vercel.app` (or a custom domain later) |
| Database | Neon `dev` branch | Neon `dev` branch | Neon `main` branch |
| GitHub OAuth app | "g-track (local)", callback `http://localhost:3000/api/auth/callback/github` | none (see below) | "g-track", callback `https://<prod-domain>/api/auth/callback/github` |
| Indexed by search engines | no | no (Vercel sends `X-Robots-Tag: noindex` on previews) | yes, public pages only |

Preview deploys are for checking the build and the UI. **GitHub login does not work on previews**: a GitHub OAuth app accepts exactly one callback domain and preview URLs change per branch. Test auth locally and on production. If that ever matters, the upgrade is a long-lived `staging` branch (its Vercel URL is stable) plus a third OAuth app pointed at it.

## Environment variables

Set these in Vercel under **Settings > Environment Variables**. `NEXT_PUBLIC_*` values are inlined at build time, so they must exist before the build, not after.

| Variable | Production | Preview | Notes |
|---|---|---|---|
| `DATABASE_URL` | Neon `main` pooled URL | Neon `dev` pooled URL | Validated in `src/lib/env.ts`. |
| `BETTER_AUTH_SECRET` | fresh random secret | another random secret | Never reuse the local one. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BETTER_AUTH_URL` | `https://<prod-domain>` | `https://<prod-domain>` | No trailing slash. Required by env validation, so previews need a value even though login is not usable there. |
| `GITHUB_CLIENT_ID` | production OAuth app | production OAuth app | |
| `GITHUB_CLIENT_SECRET` | production OAuth app | production OAuth app | |
| `NEXT_PUBLIC_SITE_URL` | `https://<prod-domain>` | leave unset | Drives canonical URLs, sitemap, OG image, JSON-LD (`src/lib/site.ts`). Unset falls back to localhost, harmless on noindexed previews. |

Local values live in `.env` (gitignored). Template: `.env.example`.

## First-time setup

One-off, in this order. The production domain is only known after the Vercel project exists, and the GitHub OAuth app needs that domain, so the first deploy is expected to fail on missing env vars.

1. **Neon: split dev from prod.** In the Neon console, create a branch named `dev` from `main` (it copies schema and data). Point your local `.env` `DATABASE_URL` at the `dev` branch's pooled connection string. `main` is now production only.
2. **Vercel: create the project.** Add New > Project > import `lianxxxx/g-track`. Framework preset is auto-detected as Next.js, leave build settings default. Deploy. The build fails at env validation; that is fine. Open **Settings > Domains** and copy the production domain.
3. **GitHub: production OAuth app.** github.com/settings/developers > OAuth Apps > New OAuth App. Homepage URL = production domain. Authorization callback URL = `https://<prod-domain>/api/auth/callback/github`. Generate a client secret and copy it once (GitHub shows it only once).
4. **Vercel: env vars.** Add everything from the table above. Tick Production and Preview per the table.
5. **Vercel: redeploy.** Deployments > latest > Redeploy. Wait for green.
6. **Verify** with the checklist below.

## Verify a production deploy

- `/` renders, dark/light toggle and splash work.
- `/login` > Sign in with GitHub > lands on `/dashboard` with your avatar. Sign out works.
- `/robots.txt` disallows `/api/` and `/dashboard`; `/sitemap.xml` lists the production URL, not localhost.
- View source on `/`: `<link rel="canonical">` and `og:url` use the production domain; `/opengraph-image` returns an image.
- Vercel > Deployments > Functions logs show no Better Auth errors after a login.

## Every deploy after that

- Push to `main` = production. Small, safe changes can go straight to `main`.
- Anything risky (GitHub sync, DB changes, auth) goes on a branch + pull request first. Vercel comments the preview URL on the PR; check it, then merge.
- **Schema changes:** run the migration against production **before** pushing the code that depends on it, from your machine. `drizzle-kit` loads `.env` but a shell variable wins over it:

  ```powershell
  $env:DATABASE_URL = "<neon main pooled url>"
  npm run db:migrate
  Remove-Item Env:DATABASE_URL
  ```

  Always `db:generate` then `db:migrate`. Never `db:push` (no migration file, can drop columns, drifts from the migration history).
- Rollback: Vercel > Deployments > pick the last good one > **Promote to Production** (or Instant Rollback). Migrations are not rolled back automatically; keep them additive.

## Not set up (on purpose)

- Custom domain: add in Vercel > Settings > Domains when there is one, then update `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, and the OAuth callback.
- Vercel Analytics / Speed Insights: extra dependency, not needed yet.
- Neon's Vercel integration (a DB branch per preview): overkill for a solo project right now.
