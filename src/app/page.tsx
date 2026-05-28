"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Truck, Gem, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  // Parallax refs
  const heroRef = useRef<HTMLElement>(null);
  const craftRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Hero parallax — images move at different speeds
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY1 = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroImgY2 = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  // Craft section parallax
  const { scrollYProgress: craftProgress } = useScroll({
    target: craftRef,
    offset: ["start end", "end start"],
  });
  const craftImgY = useTransform(craftProgress, [0, 1], [60, -60]);
  const craftTextX = useTransform(craftProgress, [0, 1], [-30, 0]);

  // CTA section parallax
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const ctaScale = useTransform(ctaProgress, [0, 0.5], [0.95, 1]);
  const ctaOpacity = useTransform(ctaProgress, [0, 0.3], [0, 1]);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-screen pt-24 pb-16">
            {/* Text Content */}
            <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="lg:col-span-5 space-y-8 z-10">
              {/* Mother's Day Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-muted/10 border border-crimson-muted/20 rounded-full text-crimson-muted text-xs tracking-[0.15em] uppercase font-medium">
                  <Heart size={12} className="fill-crimson-muted" />
                  Mother&apos;s Day Special
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.9]"
              >
                Woven
                <br />
                Heritage.
                <br />
                <span className="text-indigo-deep">Mastered</span>
                <br />
                for the
                <br />
                Modern Era.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-sm md:text-base leading-relaxed text-obsidian/60 max-w-md"
              >
                Authentic Sambalpuri masterpieces sourced directly from master
                artisans. Uncompromising pure silk, mesmerizing Ikat
                mathematics, and absolute digital security.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/catalog"
                  className="magnetic-btn inline-flex items-center justify-center gap-3 bg-obsidian text-cream px-8 py-4 text-xs tracking-[0.15em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500"
                >
                  Acquire an Heirloom
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/track"
                  className="magnetic-btn inline-flex items-center justify-center gap-3 border border-obsidian/20 text-obsidian px-8 py-4 text-xs tracking-[0.15em] uppercase font-medium hover:bg-obsidian hover:text-cream transition-all duration-500"
                >
                  Track Your Order
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Images - Asymmetric Grid */}
            <div className="lg:col-span-7 relative h-[60vh] lg:h-[85vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{ y: heroImgY1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute top-0 right-0 w-[65%] h-[70%] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/saree-hero-1.png"
                  alt="Sambalpuri Ikat silk saree in deep indigo and crimson"
                  fill
                  className="object-cover img-hover-scale"
                  priority
                  sizes="(max-width: 768px) 65vw, 40vw"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 60 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{ y: heroImgY2 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="absolute bottom-0 left-0 w-[50%] h-[55%] rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src="/images/saree-detail-2.png"
                  alt="Close-up of intricate Ikat weave pattern"
                  fill
                  className="object-cover img-hover-scale"
                  priority
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </motion.div>

              {/* Floating detail card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute bottom-[30%] left-[35%] glass-effect rounded-xl p-4 shadow-lg hidden md:block animate-float"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40 mb-1">
                  Handcrafted
                </p>
                <p className="font-serif text-lg">45–60 Days</p>
                <p className="text-xs text-obsidian/50">Per Masterpiece</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="border-y border-warm-200 bg-warm-100/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-warm-200">
            {[
              {
                icon: <Gem size={20} />,
                title: "Direct Weaver Sourcing",
                desc: "From loom to your doorstep, no middlemen",
              },
              {
                icon: <Shield size={20} />,
                title: "Encrypted Verification",
                desc: "Zero financial data stored on our servers",
              },
              {
                icon: <Truck size={20} />,
                title: "Live Self-Serve Tracking",
                desc: "Real-time updates on every masterpiece",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-center gap-4 py-6 md:py-8 md:px-8 first:md:pl-0 last:md:pr-0"
              >
                <div className="w-12 h-12 rounded-full bg-cream border border-warm-200 flex items-center justify-center flex-shrink-0 text-indigo-deep">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-obsidian/40 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOTHER'S DAY SECTION ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-cream to-warm-100/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 text-crimson-muted text-xs tracking-[0.2em] uppercase font-medium mb-6">
              <Heart size={14} className="fill-crimson-muted" />
              A Gift She&apos;ll Treasure Forever
              <Heart size={14} className="fill-crimson-muted" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6">
              This Mother&apos;s Day,
              <br />
              <span className="text-crimson-muted">Gift Heritage</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-obsidian/60">
              Every Sambalpuri Ikat saree carries centuries of tradition, woven
              with the love and skill of master artisans. Gift your mother a
              masterpiece that tells a story — a thread-by-thread testament to
              timeless beauty and enduring love.
            </p>
          </motion.div>

          {/* Gift Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                emoji: "🎁",
                title: "Premium Gift Packaging",
                desc: "Every saree arrives in an exquisite handcrafted box with a personalized note for your mother.",
              },
              {
                emoji: "✨",
                title: "Certificate of Authenticity",
                desc: "Each masterpiece comes with a signed certificate from the artisan who wove it with devotion.",
              },
              {
                emoji: "💌",
                title: "Personal Message Card",
                desc: "Add a heartfelt message on our handmade cotton rag paper card, tucked inside the gift box.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center p-8 rounded-2xl bg-cream border border-warm-200 hover:border-crimson-muted/30 transition-colors duration-500 group"
              >
                <span className="text-4xl mb-4 block">{feature.emoji}</span>
                <h3 className="font-serif text-xl tracking-tight mb-3 group-hover:text-crimson-muted transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-obsidian/50 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCROLLING MARQUEE ===== */}
      <section className="py-5 bg-obsidian overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="marquee-content" {...(setIdx > 0 ? { "aria-hidden": "true" } : {})}>
                {[
                  "Handwoven Heritage",
                  "✦",
                  "800 Years of Tradition",
                  "✦",
                  "Pure Silk Artistry",
                  "✦",
                  "From Loom to Legacy",
                  "✦",
                  "Sambalpuri Ikat",
                  "✦",
                  "Artisan Craftsmanship",
                  "✦",
                ].map((text, i) => (
                  <span
                    key={i}
                    className={`mx-6 whitespace-nowrap ${
                      text === "✦"
                        ? "text-crimson-muted text-sm"
                        : "text-cream/60 text-xs tracking-[0.25em] uppercase font-sans"
                    }`}
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COLLECTION ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
                Curated Selection
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95]">
                Featured
                <br />
                Masterpieces
              </h2>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-sm tracking-[0.12em] uppercase text-obsidian/60 hover:text-obsidian transition-colors duration-300 line-reveal self-start md:self-auto"
            >
              View Full Collection
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Editorial Product Cards */}
          <div className="space-y-24 md:space-y-32">
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                layout="editorial"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE CRAFT SECTION ===== */}
      <section ref={craftRef} className="relative py-20 md:py-32 bg-obsidian text-cream overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              style={{ x: craftTextX }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-4">
                The Ancient Art
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95] mb-8">
                Ikat: Where
                <br />
                Mathematics
                <br />
                Meets Artistry
              </h2>
              <div className="space-y-6 text-sm leading-relaxed text-cream/60">
                <p>
                  Ikat (from the Malay-Indonesian word &quot;mengikat&quot;,
                  meaning to tie) is one of the most complex textile arts known
                  to humanity. In Sambalpuri tradition, both warp and weft
                  threads are resist-dyed before weaving — a technique demanding
                  mathematical precision.
                </p>
                <p>
                  Each saree requires 45 to 60 days of dedicated labor, with
                  the artisan calculating every intersection of thread and color
                  before the loom is even threaded. The result is a fabric where
                  patterns appear to emerge from within the silk itself.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-cream/10">
                {[
                  { value: "800+", label: "Years of Tradition" },
                  { value: "4,000+", label: "Threads Per Saree" },
                  { value: "45-60", label: "Days to Weave" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <p className="font-serif text-2xl md:text-3xl text-cream">
                      {stat.value}
                    </p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-cream/40 mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              style={{ y: craftImgY }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/saree-product-3.png"
                alt="Intricate Sambalpuri Ikat weaving process"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-serif text-lg text-cream/90">
                  Master Artisan at the Loom
                </p>
                <p className="text-xs text-cream/50 mt-1">
                  Sonepur, Subarnapur, Odisha
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SPECIFICATIONS DIRECTORY (GEO & AEO optimization) ===== */}
      <section className="py-20 bg-warm-100/30 border-y border-warm-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3 block">
              Technical Directory
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-[0.95] mb-4">
              Weaving Specifications
              <br />
              & Authenticity Directory
            </h2>
            <p className="text-sm text-obsidian/50 max-w-xl leading-relaxed">
              Factual, certified metrics of our authentic Sambalpuri Ikat collection. Generative engine verified direct artisan provenance.
            </p>
          </motion.div>

          <div className="overflow-x-auto rounded-xl border border-warm-200 shadow-sm glass-effect">
            <table className="w-full border-collapse text-left text-sm text-obsidian">
              <thead className="bg-obsidian text-cream text-xs tracking-wider uppercase font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">Saree Name / Design</th>
                  <th scope="col" className="px-6 py-4">Weave Type</th>
                  <th scope="col" className="px-6 py-4">Weaving Duration</th>
                  <th scope="col" className="px-6 py-4">Artisan Colony</th>
                  <th scope="col" className="px-6 py-4">Thread Count</th>
                  <th scope="col" className="px-6 py-4">Pure Silk Spec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-warm-100/50 transition-colors duration-200">
                    <td className="px-6 py-4 font-serif text-base font-medium text-indigo-deep">{product.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                      <span className="px-2 py-1 rounded bg-cream border border-warm-300">
                        {product.categoryLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-obsidian/70">{product.weaveTime}</td>
                    <td className="px-6 py-4 text-obsidian/70">{product.artisanOrigin}</td>
                    <td className="px-6 py-4 font-mono text-xs">{product.threadCount}</td>
                    <td className="px-6 py-4 text-obsidian/70">{product.details[0] || "Pure Silk"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section ref={ctaRef} className="relative py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ scale: ctaScale, opacity: ctaOpacity }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4">
              Begin Your Journey
            </p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6">
              Every Thread Tells
              <br />
              <span className="text-shimmer">A Story</span>
            </h2>
            <p className="text-sm md:text-base text-obsidian/50 leading-relaxed mb-10">
              Explore our complete collection of authentic Sambalpuri Ikat
              masterpieces. Each piece is a unique work of art, handwoven with
              devotion and meant to be treasured across generations.
            </p>
            <Link
              href="/catalog"
              className="magnetic-btn inline-flex items-center gap-3 bg-obsidian text-cream px-10 py-5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500"
            >
              Explore the Full Collection
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
