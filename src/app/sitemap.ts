import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Only public marketing pages belong here. The dashboard and API are
// authenticated and excluded (see robots.ts). Add new public routes as
// they are created: see docs/SEO.md.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
