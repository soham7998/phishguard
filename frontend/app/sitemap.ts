import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://phishguard.dev";
  const now = new Date();

  return [
    { url: base,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/playground`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/docs`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/pricing`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs#quickstart`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs#authentication`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs#errors`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
