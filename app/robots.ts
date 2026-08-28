import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/dashboard", "/events/", "/recommendations", "/email", "/upgrade", "/login", "/signup"]
    },
    sitemap: "https://emptyhanded.app/sitemap.xml"
  };
}
