import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://emptyhanded.app", changeFrequency: "weekly", priority: 1 },
    { url: "https://emptyhanded.app/privacy", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://emptyhanded.app/terms", changeFrequency: "yearly", priority: 0.3 }
  ];
}
