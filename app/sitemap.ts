import type { MetadataRoute } from "next";
import { allPlaces } from "@/lib/journey";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "https://example.invalid";
  const now = new Date();
  return [{ href: "/" }, ...allPlaces].map((s) => ({
    url: `${base}${s.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: s.href === "/" ? 1 : 0.7,
  }));
}
