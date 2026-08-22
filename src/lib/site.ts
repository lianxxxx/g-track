/**
 * Single source of truth for site identity, used by metadata, robots,
 * sitemap, manifest, and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production
 * (e.g. https://g-track.dev); the localhost fallback keeps local builds working.
 */
export const site = {
  name: "g-track",
  title: "g-track: developer activity tracking",
  description:
    "Track and visualize your developer activity. g-track pulls your GitHub commits, pull requests, issues, and reviews into one dashboard with an activity heatmap and charts.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
