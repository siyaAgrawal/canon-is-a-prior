import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The console is an instrument, not a page worth indexing, and the API routes
      // return data rather than documents.
      disallow: ["/ai-console", "/api/"],
    },
  };
}
