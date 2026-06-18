import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllYarnSlugs } from "@/lib/yarn-queries";
import { getAllPatternSlugs } from "@/lib/pattern-queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [yarnSlugs, patternSlugs] = await Promise.all([
    getAllYarnSlugs(),
    getAllPatternSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/yarn`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/patterns`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const yarnRoutes: MetadataRoute.Sitemap = yarnSlugs.map((slug) => ({
    url: `${SITE_URL}/yarn/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const patternRoutes: MetadataRoute.Sitemap = patternSlugs.map((slug) => ({
    url: `${SITE_URL}/patterns/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...yarnRoutes, ...patternRoutes];
}
