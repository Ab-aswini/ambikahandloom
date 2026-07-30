import type { Metadata } from "next";
import { BlogPost, getBlogPostBySlugServer } from "@/lib/blog-seeds";
import { supabase } from "@/lib/supabase";
import BlogPostClientPage from "./BlogPostClientPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { slug: "journey-of-ikat-saree-from-weaver-to-wardrobe" },
    { slug: "how-to-identify-authentic-sambalpuri-sarees" },
    { slug: "handloom-vs-powerloom-why-the-difference-matters" },
    { slug: "celebrating-sambalpuri-din-satyanarayan-bohidar-heritage" },
  ];
}

async function findBlogPost(slug: string): Promise<BlogPost | null> {
  // 1. Try static/seeded blog posts first (fastest fallback, server-safe)
  const staticPost = getBlogPostBySlugServer(slug);
  if (staticPost) return staticPost;

  // 2. Try Supabase for database blog posts
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabase && url && url !== "https://your-project-id.supabase.co") {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          coverImage: data.cover_image ?? "",
          category: data.category ?? "General",
          tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"),
          author: data.author ?? "Ambika Handloom",
          published: data.published ?? false,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error("Server-side blog fetch error:", err);
    }
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPost(slug);
  if (!post) return { title: "Article Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage.startsWith("http") ? post.coverImage : `${siteUrl}${post.coverImage}`;

  const title = `${post.title} | Ambika Handloom Journal`;
  const description = post.excerpt || "Ambika Handloom Collection Blog";

  return {
    title,
    description,
    keywords: [
      ...post.tags,
      "Sambalpuri Ikat Blog",
      "Weaving stories",
      "Handloom knowledge",
      "Odisha artisans",
    ],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Ambika Handloom Collection",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} — Ambika Handloom Journal`,
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await findBlogPost(slug);

  // Mapped object matching client expectation
  const mappedPost = post ? {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    tags: post.tags,
    author: post.author,
    published: post.published,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  } : null;

  return <BlogPostClientPage slug={slug} initialPost={mappedPost} />;
}
