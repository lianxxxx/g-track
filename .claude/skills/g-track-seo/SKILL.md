---
name: g-track-seo
description: Audit and update all SEO artifacts in g-track in one run, sitemap, robots, metadata, JSON-LD, llms.txt, OG image. Use when public pages were added/changed/removed, when new authenticated areas appeared, when the product description changed, or when asked to check, sync, or update SEO.
---

# g-track SEO sync

One run that brings every SEO artifact back in sync with the current state of the app. Conventions and file locations live in `docs/SEO.md`, read it first, don't duplicate it here. `src/lib/site.ts` is the single source of truth for site identity.

## 1. Inventory the app

- List all routes in `src/app/` (pages, not API/metadata routes).
- Classify each: **public** (marketing, indexable) or **authenticated** (dashboard, never indexed).
- Note what the product currently is/does from `docs/ARCHITECTURE.md`, features shipped, not planned.

## 2. Audit each artifact against reality

Prefer delegating this step to the `seo-auditor` agent (read-only; returns a per-artifact drift report), then act on its findings. When auditing inline instead, check every row of the table in `docs/SEO.md`:

- **`src/app/sitemap.ts`**: contains exactly the public routes. No missing pages, no auth'd or deleted routes.
- **`src/app/robots.ts`**: every authenticated/API path prefix is disallowed; public paths are not.
- **`src/lib/site.ts`**: name, description still accurate to the product.
- **`src/app/layout.tsx` metadata**: title/description/OG/Twitter still match `site.ts`; `metadataBase` intact.
- **Per-page metadata**: every public page exports its own `title`/`description`.
- **JSON-LD**: present on public pages where a schema.org type genuinely fits; content matches reality; `<` escaped as `\u003c`.
- **`public/llms.txt`**: describes current features accurately. Update when features ship or change.
- **`src/app/opengraph-image.tsx`**: still renders the right name/tagline.

## 3. Fix drift

- Make the smallest edits that restore sync. Follow the checklists in `docs/SEO.md`.
- If the product description changed, update `src/lib/site.ts` once, metadata, manifest, JSON-LD, and OG image inherit it.
- If a new artifact type is warranted (e.g. per-page OG images, a blog needs `generateSitemaps`), propose it before building.

## 4. Validate

- `npm run lint` and `npm run build`. The build output must list `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`.
- Sanity-check generated output when routes changed: the built sitemap/robots content, not just compilation.

## 5. Report

Summarize per artifact: **in sync** (untouched) / **updated** (what and why) / **needs decision** (with recommendation). Mention anything `docs/SEO.md` itself should now say differently, update it too if conventions changed.

## Rules

- Never index authenticated or API routes.
- Never hardcode the site name/URL outside `src/lib/site.ts`.
- Truthful metadata only: describe what exists, not planned features (no CLI/Claude Code/Codex mentions until shipped).
- Do not commit or push unless explicitly requested.
