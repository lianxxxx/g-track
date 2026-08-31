import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated app and API surface: never useful in a search index.
      disallow: ["/api/", "/dashboard"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
