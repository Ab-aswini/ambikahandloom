"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff, FileText, ArrowRight } from "lucide-react";
import { getBlogPosts, getBlogPostsAsync, deleteBlogPost, saveBlogPost, BlogPost } from "@/lib/admin-store";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPosts(getBlogPosts());
    getBlogPostsAsync().then(setPosts).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    await deleteBlogPost(id);
    setPosts(getBlogPosts());
  };

  const togglePublished = async (post: BlogPost) => {
    const updated = {
      ...post,
      published: !post.published,
      updatedAt: new Date().toISOString(),
    };
    await saveBlogPost(updated);
    setPosts(getBlogPosts());
  };

  if (!isClient) return null;

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-white text-2xl font-medium tracking-tight">Blog Posts</h1>
          <p className="text-white/40 text-sm mt-1">
            {publishedCount} published · {draftCount} drafts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-medium tracking-wide uppercase rounded-lg hover:bg-white/90 transition-colors"
        >
          <Plus size={14} />
          New Post
        </Link>
      </motion.div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-xl">
          <FileText size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-sm mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
          >
            Create your first post
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
            >
              {/* Status */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published ? "bg-emerald-400" : "bg-amber-400"}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-white/30">
                    {post.category}
                  </span>
                  <span className="text-white/10">·</span>
                  <span className="text-[10px] text-white/30">
                    {new Date(post.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-white/10">·</span>
                  <span className={`text-[10px] tracking-[0.1em] uppercase ${post.published ? "text-emerald-400/70" : "text-amber-400/70"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePublished(post)}
                  className="p-2 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="p-2 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-400/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
