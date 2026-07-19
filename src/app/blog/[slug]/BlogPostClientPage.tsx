"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User, Share2 } from "lucide-react";
import { getBlogPostBySlug, getPublishedBlogPosts, getBlogPostsAsync, BlogPost } from "@/lib/admin-store";

interface BlogPostClientPageProps {
  slug: string;
  initialPost: BlogPost | null;
}

export default function BlogPostClientPage({ slug, initialPost }: BlogPostClientPageProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    // If we have an initial post, use it to populate related posts right away
    if (initialPost) {
      setPost(initialPost);
      const related = getPublishedBlogPosts()
        .filter((p) => p.slug !== slug)
        .slice(0, 2);
      setRelatedPosts(related);
      setLoading(false);
    } else {
      // Try sync first
      const found = getBlogPostBySlug(slug);
      if (found) {
        setPost(found);
        const related = getPublishedBlogPosts()
          .filter((p) => p.slug !== slug)
          .slice(0, 2);
        setRelatedPosts(related);
        setLoading(false);
      }
    }

    // Then try async to get freshest data
    getBlogPostsAsync()
      .then((all) => {
        const asyncFound = all.find((p) => p.slug === slug);
        if (asyncFound) {
          setPost(asyncFound);
          setRelatedPosts(
            all.filter((p) => p.published && p.slug !== slug).slice(0, 2)
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, initialPost]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-3xl">Article Not Found</h1>
        <Link href="/blog" className="text-sm text-indigo-deep hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[800px] mx-auto px-6 md:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-obsidian/40 hover:text-obsidian transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-indigo-deep/5 border border-indigo-deep/10 text-[10px] tracking-[0.15em] uppercase font-medium text-indigo-deep rounded-full mb-4">
              {post.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[0.95] mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-xs text-obsidian/40">
              <span className="inline-flex items-center gap-1.5">
                <User size={12} />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {estimateReadTime(post.content)} min read
              </span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 hover:text-obsidian transition-colors"
              >
                <Share2 size={12} />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 -mt-2 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-warm-200 shadow-md"
        >
          <Image
            src={post.coverImage || "/images/saree-hero-1.png"}
            alt={`${post.title} — Ambika Handloom Blog`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </motion.div>
      </section>

      {/* Article Content */}
      <article className="max-w-[800px] mx-auto px-6 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-obsidian
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-obsidian/70 prose-p:leading-relaxed prose-p:text-[15px]
            prose-strong:text-obsidian prose-strong:font-semibold
            prose-a:text-indigo-deep prose-a:no-underline hover:prose-a:underline
            prose-ul:text-obsidian/70 prose-ol:text-obsidian/70
            prose-li:text-[15px]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-warm-200">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-100 border border-warm-200 text-xs text-obsidian/50 rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-warm-100/50 border-t border-warm-200">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-10">
              More from the Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related, i) => (
                <motion.article
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link href={`/blog/${related.slug}`} className="group flex gap-5">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-warm-200">
                      <Image
                        src={related.coverImage || "/images/saree-hero-1.png"}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="128px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-obsidian/30 mb-1 block">
                        {related.category}
                      </span>
                      <h4 className="font-serif text-base tracking-tight leading-tight group-hover:text-indigo-deep transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-obsidian/40 mt-1.5 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
