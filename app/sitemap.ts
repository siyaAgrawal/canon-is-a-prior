import type { MetadataRoute } from "next";
import { places } from "@/lib/journey";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "https://example.invalid";
  const now = new Date();
  return [{ href: "/" }, ...places].map((s) => ({
    url: `${base}${s.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: s.href === "/" ? 1 : 0.7,
  }));
}
