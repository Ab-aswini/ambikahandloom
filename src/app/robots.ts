import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/checkout",
        "/track",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
