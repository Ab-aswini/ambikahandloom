"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Tag, Clock } from "lucide-react";
import { getPublishedBlogPosts, getBlogPostsAsync, BlogPost } from "@/lib/admin-store";

const categories = ["All", "Guide", "Heritage", "Style", "Care"];

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>(getPublishedBlogPosts);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getBlogPostsAsync()
      .then((all) => setPosts(all.filter((p) => p.published)))
      .catch(console.error);
  }, []);

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

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

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
              Stories & Guides
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95] mb-4">
              The Handloom
              <br />
              <span className="text-indigo-deep">Journal</span>
            </h1>
            <p className="text-sm md:text-base text-obsidian/60 max-w-xl leading-relaxed">
              Expert guides, heritage stories, and artisan insights from the
              world of Sambalpuri Ikat weaving.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-[0.1em] uppercase font-medium rounded-full border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-obsidian text-cream border-obsidian"
                    : "bg-transparent text-obsidian/50 border-warm-200 hover:border-obsidian/30 hover:text-obsidian"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-obsidian/40 text-sm">No articles found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-warm-200">
                      <Image
                        src={post.coverImage || "/images/saree-hero-1.png"}
                        alt={`${post.title} — Ambika Handloom Blog`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-cream/90 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase font-medium rounded-full border border-warm-200">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.1em] uppercase text-obsidian/40 mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={10} />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={10} />
                        {estimateReadTime(post.content)} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-xl md:text-2xl tracking-tight leading-tight mb-3 group-hover:text-indigo-deep transition-colors duration-300">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-obsidian/50 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] text-obsidian/30 tracking-[0.05em]"
                        >
                          <Tag size={8} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <span className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-obsidian/60 group-hover:text-indigo-deep transition-colors duration-300">
                      Read Article
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
