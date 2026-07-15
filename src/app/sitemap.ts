import type { MetadataRoute } from "next";
import { products as staticProducts, sections } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";
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

  // Fetch products: try Supabase first, fall back to static array
  let allProducts = staticProducts;
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabase && sbUrl && sbUrl !== "https://your-project-id.supabase.co") {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, image, images, updated_at")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        // Merge: start with Supabase data, append any static-only products
        const sbIds = new Set(data.map((d: { id: string }) => d.id));
        const staticOnly = staticProducts.filter((p) => !sbIds.has(p.id));
        const sbPages: MetadataRoute.Sitemap = data.map((row: { id: string; image: string; images?: string[]; updated_at?: string }) => ({
          url: `${siteUrl}/catalog/${row.id}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: "monthly" as const,
          priority: 0.9,
          images: (row.images || [row.image]).map(
            (img: string) => img.startsWith("http") ? img : `${siteUrl}${img}`
          ),
        }));
        const staticOnlyPages: MetadataRoute.Sitemap = staticOnly.map((product) => ({
          url: `${siteUrl}/catalog/${product.id}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.9,
          images: (product.images || [product.image]).map(
            (img) => `${siteUrl}${img}`
          ),
        }));
        return [...staticPages, ...sectionPages, ...sbPages, ...staticOnlyPages];
      }
    } catch (err) {
      console.error("Sitemap Supabase fetch error:", err);
    }
  }

  // Fallback: use static products only
  const productPages: MetadataRoute.Sitemap = allProducts.map((product) => ({
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
