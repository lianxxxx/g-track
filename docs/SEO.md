# SEO

How SEO is set up in g-track and what to keep consistent. System design lives in [ARCHITECTURE.md](ARCHITECTURE.md).

## Scope

g-track is mostly an authenticated dashboard. The SEO surface is the **public marketing pages only** (currently just the landing page). The dashboard and API must never be indexed.

## Where everything lives

| Concern | File | Notes |
|---|---|---|
| Site identity (name, description, URL) | `src/lib/site.ts` | Single source of truth. Everything below imports from it, never hardcode the site name/URL elsewhere. |
| Base URL | `NEXT_PUBLIC_SITE_URL` env var | Set to the production URL when deployed (no trailing slash). Falls back to `http://localhost:3000`. |
| Page metadata, canonical, OG/Twitter | `src/app/layout.tsx` | `metadataBase` + title template. Public pages set their own `title`/`description`; the template appends `· g-track`. |
| robots.txt | `src/app/robots.ts` | Allows `/`, disallows `/api/` and `/dashboard`. |
| sitemap.xml | `src/app/sitemap.ts` | Public routes only. |
| Web app manifest | `src/app/manifest.ts` | |
| Social preview image | `src/app/opengraph-image.tsx` | Generated with `next/og`. |
| Structured data (JSON-LD) | inline `<script type="application/ld+json">` in the page | Landing page uses `SoftwareApplication`. Escape the `<` character as `\u003c` (XSS). |
| llms.txt | `public/llms.txt` | Plain-markdown site summary for AI crawlers. |

## Checklist for a new public page

1. Export `metadata` with a `title` and `description` (the layout template adds the site name).
2. Add the route to `src/app/sitemap.ts`.
3. Add JSON-LD only if a schema.org type genuinely fits the page.
4. Keep `public/llms.txt` accurate if the page changes what g-track is/does.

## Checklist for a new authenticated area

1. Add its path prefix to `disallow` in `src/app/robots.ts`.
2. Do **not** add it to the sitemap.

## Rules

- Never index authenticated or API routes.
- Metadata content (titles, descriptions) describes the product truthfully, no keyword stuffing.
- Update `NEXT_PUBLIC_SITE_URL` in the deployment environment before launch; canonical URLs, the sitemap, and OG tags all derive from it.
