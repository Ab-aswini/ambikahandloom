"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { getBlogPosts, saveBlogPost, generateSlug, BlogPost } from "@/lib/admin-store";

const CATEGORIES = ["Guide", "Heritage", "Style", "Care", "General"];

function generateId() {
  return `blog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function AdminBlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const isNew = postId === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Guide");
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!isNew) {
      const posts = getBlogPosts();
      const found = posts.find((p) => p.id === postId);
      if (found) {
        setExistingPost(found);
        setTitle(found.title);
        setSlug(found.slug);
        setExcerpt(found.excerpt);
        setContent(found.content);
        setCoverImage(found.coverImage);
        setCategory(found.category);
        setTagsInput(found.tags.join(", "));
        setPublished(found.published);
      }
    }
  }, [isNew, postId]);

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (isNew && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isNew]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;

    setSaving(true);
    const now = new Date().toISOString();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const post: BlogPost = {
      id: existingPost?.id || generateId(),
      slug: slug || generateSlug(title),
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      content,
      coverImage: coverImage || "/images/saree-hero-1.png",
      category,
      tags,
      author: "Ambika Handloom",
      published,
      createdAt: existingPost?.createdAt || now,
      updatedAt: now,
    };

    await saveBlogPost(post);

    setTimeout(() => {
      setSaving(false);
      router.push("/admin/blog");
    }, 400);
  }, [title, slug, excerpt, content, coverImage, category, tagsInput, published, existingPost, router]);

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="text-white/30 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-white text-xl font-medium tracking-tight">
              {isNew ? "New Blog Post" : "Edit Blog Post"}
            </h1>
            {!isNew && existingPost && (
              <p className="text-white/30 text-xs mt-0.5">
                Last updated {new Date(existingPost.updatedAt).toLocaleDateString("en-IN")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPublished(!published)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-all ${
              published
                ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/5"
                : "border-amber-400/30 text-amber-400 bg-amber-400/5"
            }`}
          >
            {published ? <Eye size={12} /> : <EyeOff size={12} />}
            {published ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-medium tracking-wide uppercase rounded-lg hover:bg-white/90 transition-colors disabled:opacity-40"
          >
            <Save size={12} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>

      {/* Editor Form */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog post title..."
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-xs">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
        </div>

        {/* Category & Cover Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F0F0F] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
              <ImageIcon size={10} className="inline mr-1" />
              Cover Image URL
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/images/saree-hero-1.png"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
            Excerpt (for previews & meta description)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary of this article (1-2 sentences)..."
            rows={3}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
            Content (HTML)
          </label>
          <p className="text-[10px] text-white/20 mb-2">
            Use &lt;h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;strong&gt; for bold, &lt;ul&gt;/&lt;li&gt; for lists.
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<h2>Section Title</h2>
<p>Your article content here...</p>"
            rows={18}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-y font-mono leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Sambalpuri, handloom, saree care, buying guide"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
