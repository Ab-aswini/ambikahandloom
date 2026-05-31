"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#FDFBF7] text-obsidian relative overflow-hidden">
      {/* Decorative background element mimicking handloom threads */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-xl mx-auto px-6 text-center z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-crimson-muted font-medium">
            404 — Thread Not Found
          </p>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-obsidian">
            Lost in the
            <br />
            <span className="text-shimmer">Weave</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-obsidian/60 max-w-md mx-auto leading-relaxed"
        >
          Like a misaligned thread in a masterwork Ikat, this page has wandered from the pattern. Let us guide you back to our curated collections.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/catalog"
            title="Browse Our Collection"
            className="magnetic-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-obsidian text-cream px-8 py-4 text-xs tracking-[0.15em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 rounded-xl"
          >
            <ShoppingBag size={14} />
            Explore Collection
          </Link>
          
          <Link
            href="/"
            title="Return to Homepage"
            className="magnetic-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-obsidian/20 text-obsidian px-8 py-4 text-xs tracking-[0.15em] uppercase font-medium hover:bg-obsidian hover:text-cream transition-all duration-500 rounded-xl"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
