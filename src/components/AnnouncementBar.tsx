"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Sparkles, Truck } from "lucide-react";
import { getSettings, SiteSettings } from "@/lib/admin-store";

const SESSION_KEY = "ah-announcement-dismissed";

export default function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem(SESSION_KEY) === "true";
    setIsDismissed(wasDismissed);
    // Load admin settings
    setSettings(getSettings());
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  if (isDismissed || !settings) return null;

  // Dynamic content from admin settings
  const isPromoActive = settings.promotionEnabled && settings.promotionBadge;

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
            {isPromoActive ? (
              <>
                <span className="inline-flex items-center gap-1 text-crimson-muted font-medium">
                  <Sparkles size={12} />
                  {settings.promotionBadge}
                </span>
                <span className="hidden sm:inline text-cream/30">•</span>
                <span className="text-cream/80">
                  {settings.promotionTitle}
                </span>
                <span className="hidden md:inline text-cream/30">•</span>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1 font-medium text-cream hover:text-crimson-muted transition-colors underline underline-offset-2 ml-1"
                >
                  Shop Now
                  <ArrowRight size={11} />
                </Link>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 text-crimson-muted font-medium">
                  <Truck size={12} />
                  Free Shipping Across India
                </span>
                <span className="hidden sm:inline text-cream/30">•</span>
                <span className="text-cream/80">
                  Direct from Artisans • Authentic Sambalpuri Ikat
                </span>
                <span className="hidden md:inline text-cream/30">•</span>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1 font-medium text-cream hover:text-crimson-muted transition-colors underline underline-offset-2 ml-1"
                >
                  Browse Collection
                  <ArrowRight size={11} />
                </Link>
              </>
            )}
          </div>

          <button
            onClick={handleDismiss}
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
