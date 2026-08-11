"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import WeaveExplorer from "@/components/WeaveExplorer";

export default function DiscoverPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/discover`,
        name: "Find Your Perfect Sambalpuri Saree — Interactive Weave Explorer",
        description:
          "Answer 3 simple questions and discover the authentic Sambalpuri Ikat weave that's perfect for you.",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I choose the right Sambalpuri saree?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Consider the occasion (wedding, festival, daily wear), your fabric preference (pure silk for luxury, cotton for comfort), and your budget. Our interactive Weave Explorer helps you find the perfect match in 3 simple steps.",
            },
          },
          {
            "@type": "Question",
            name: "Are Ambika Handloom sarees authentic and GI-tagged?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all our Sambalpuri Ikat sarees are authentic, handwoven by master artisans in Odisha (Sonepur, Bargarh, Balangir), and carry GI-tagged certification. Each piece comes with artisan provenance details.",
            },
          },
          {
            "@type": "Question",
            name: "What is the price range for authentic Sambalpuri sarees?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Authentic handwoven Sambalpuri sarees range from ₹3,500 for cotton weaves to ₹25,000+ for exclusive double-Ikat silk masterpieces. We offer pieces across all price ranges.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-indigo-deep text-xs tracking-[0.2em] uppercase font-medium mb-4">
              <Compass size={14} />
              Interactive Weave Explorer
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.9] mb-4">
              Find Your
              <br />
              <span className="text-indigo-deep">Perfect Weave</span>
            </h1>
            <p className="text-sm md:text-base text-obsidian/60 max-w-xl leading-relaxed">
              Answer 3 simple questions and we&apos;ll match you with the authentic
              Sambalpuri Ikat masterpiece that&apos;s perfect for your style, occasion,
              and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quiz */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-warm-100/50 border border-warm-200 rounded-3xl p-6 md:p-10 lg:p-12"
          >
            <WeaveExplorer fullPage />
          </motion.div>
        </div>
      </section>
    </>
  );
}
