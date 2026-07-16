import type { MetadataRoute } from "next";
import { products as staticProducts, sections } from "@/lib/products";
import { supabase } from "@/lib/supabase";

// Blog posts seed data (imported statically for SSR sitemap generation)
// These are the same slugs as the seed posts in admin-store.ts
const SEED_BLOG_SLUGS = [
  { slug: "journey-of-ikat-saree-from-weaver-to-wardrobe", updatedAt: "2025-12-15T10:00:00Z" },
  { slug: "how-to-identify-authentic-sambalpuri-sarees", updatedAt: "2026-01-10T10:00:00Z" },
  { slug: "handloom-vs-powerloom-why-the-difference-matters", updatedAt: "2026-02-20T10:00:00Z" },
];

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
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Section catalog pages (Sarees, Ladies Wear, Cut Pieces)
  const sectionPages: MetadataRoute.Sitemap = sections.map((section) => ({
    url: `${siteUrl}/catalog?section=${section.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Blog post pages
  let blogPages: MetadataRoute.Sitemap = [];

  // Try Supabase blog_posts first
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabase && sbUrl && sbUrl !== "https://your-project-id.supabase.co") {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("published", true);
      if (!error && data && data.length > 0) {
        blogPages = data.map((row: { slug: string; updated_at?: string }) => ({
          url: `${siteUrl}/blog/${row.slug}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
      }
    } catch (err) {
      console.error("Sitemap blog Supabase fetch error:", err);
    }
  }

  // Fallback: use seed blog slugs if Supabase didn't provide any
  if (blogPages.length === 0) {
    blogPages = SEED_BLOG_SLUGS.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // Fetch products: try Supabase first, fall back to static array
  let allProducts = staticProducts;
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
        return [...staticPages, ...sectionPages, ...blogPages, ...sbPages, ...staticOnlyPages];
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

  return [...staticPages, ...sectionPages, ...blogPages, ...productPages];
}
