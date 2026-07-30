"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-obsidian text-cream border-b border-cream/10 relative z-50 overflow-hidden text-xs py-2.5 px-4"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center justify-center gap-2 text-center text-cream/90 flex-wrap">
            <span className="inline-flex items-center gap-1 text-crimson-muted font-medium">
              <Sparkles size={12} />
              Sambalpuri Din (August 1st)
            </span>
            <span className="hidden sm:inline text-cream/30">•</span>
            <span className="text-cream/80">
              Honoring Guru Satyanarayan Bohidar &amp; Western Odisha&apos;s Handloom Heritage
            </span>
            <span className="hidden md:inline text-cream/30">•</span>
            <Link
              href="/blog/celebrating-sambalpuri-din-satyanarayan-bohidar-heritage"
              className="inline-flex items-center gap-1 font-medium text-cream hover:text-crimson-muted transition-colors underline underline-offset-2 ml-1"
            >
              Read Special Story
              <ArrowRight size={11} />
            </Link>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-cream/40 hover:text-cream transition-colors p-1 rounded-full flex-shrink-0"
            aria-label="Close announcement banner"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
