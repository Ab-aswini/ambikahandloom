import type { MetadataRoute } from "next";
import { products, sections } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.vercel.app";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/track`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/checkout`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Section catalog pages (Sarees, Ladies Wear, Cut Pieces)
  const sectionPages: MetadataRoute.Sitemap = sections.map((section) => ({
    url: `${siteUrl}/catalog?section=${section.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Individual product pages — highest priority for e-commerce
  // Note: Next.js MetadataRoute.Sitemap images field only accepts string[]
  // Full image metadata (title, caption, geo) is handled via JSON-LD on each product page
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/catalog/${product.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: (product.images || [product.image]).map(
      (img) => `${siteUrl}${img}`
    ),
  }));

  return [...staticPages, ...sectionPages, ...productPages];
}
