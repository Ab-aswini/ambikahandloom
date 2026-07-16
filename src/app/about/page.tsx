"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, Heart, Shield, Users, Gem, Clock, Star } from "lucide-react";

const coreValues = [
  {
    icon: Gem,
    title: "Artisanal Integrity",
    description: "Every product is 100% handwoven by master artisans using traditional methods passed down through generations.",
  },
  {
    icon: Heart,
    title: "Heritage Preservation",
    description: "We actively support and preserve the 800-year-old Sambalpuri Ikat weaving tradition of Odisha.",
  },
  {
    icon: Users,
    title: "Direct-to-Consumer",
    description: "We connect rural weavers directly with customers, eliminating exploitative middlemen from the supply chain.",
  },
  {
    icon: Shield,
    title: "Ethical Fair-Pricing",
    description: "Our transparent pricing ensures artisans receive fair wages while customers enjoy genuine artisanal quality.",
  },
];

const stats = [
  { value: "2017", label: "Established" },
  { value: "3.8★", label: "Google Rating" },
  { value: "500+", label: "Happy Customers" },
  { value: "50+", label: "Artisan Partners" },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about#aboutpage`,
        "url": `${siteUrl}/about`,
        "name": "About Ambika Handloom Collection",
        "description": "Learn about Ambika Handloom Collection — a regional specialist in Balangir, Odisha dedicated to authentic Sambalpuri Ikat sarees and handloom textiles.",
        "isPartOf": { "@id": `${siteUrl}/#website` },
        "mainEntity": { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/about#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": `${siteUrl}/about` },
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

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-100 to-cream" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4">
              Our Story
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6">
              Authentic Handloom
              <br />
              from <span className="text-indigo-deep">Odisha</span>:
              <br />
              Heritage Woven
              <br />
              with Care
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-obsidian/60 max-w-xl">
              Connecting rural weavers directly with the modern marketplace —
              preserving tradition, ensuring fair pricing, and bringing you
              authentic Sambalpuri Ikat masterpieces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="border-y border-warm-200 bg-warm-100/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-warm-200">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 text-center"
              >
                <p className="font-serif text-2xl md:text-3xl text-indigo-deep">{stat.value}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4">Who We Are</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[0.95] mb-8">
                A Regional Specialist
                <br />
                Dedicated to
                <br />
                <span className="text-indigo-deep">Handloom Heritage</span>
              </h2>
              <div className="space-y-5 text-sm leading-relaxed text-obsidian/60">
                <p>
                  Welcome to Ambika Sambalpuri Handloom, a regional specialist based
                  in Odisha, India, dedicated to the promotion of traditional hand-woven
                  textiles. We are passionate about handloom sarees, which are the
                  absolute pride of our culture and heritage.
                </p>
                <p>
                  We specialize in offering authentic Sambalpuri and Ikat textiles sourced
                  directly from Odisha&apos;s artisan clusters. Our sarees are made by
                  skilled weavers who use traditional methods to create stunning designs
                  and patterns. Each saree is a masterpiece of art and craftsmanship,
                  reflecting the beauty and elegance of our people.
                </p>
                <p>
                  Whether you need a saree for a special occasion or to enrich your
                  everyday wardrobe, we offer a variety of styles and colors to suit your
                  taste. We invite you to experience the emotional pride of wearing a
                  &ldquo;piece of Odisha&rdquo; and to participate in the preservation of a dying art form.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/saree-product-3.png"
                alt="Sambalpuri Ikat weaving process — master artisan at the handloom in Odisha"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-serif text-lg text-cream/90">Master Artisan at the Loom</p>
                <p className="text-xs text-cream/50 mt-1">Sonepur, Subarnapur District, Odisha</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== OUR CRAFT & HERITAGE ===== */}
      <section className="py-20 md:py-28 bg-obsidian text-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/saree-hero-1.png"
                alt="Authentic Sambalpuri Ikat silk saree in deep indigo and crimson with traditional motifs"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-4">Our Craft & Heritage</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[0.95] mb-8">
                Ancient Ikat
                <br />
                Techniques Meet
                <br />
                Modern Elegance
              </h2>
              <div className="space-y-5 text-sm leading-relaxed text-cream/60">
                <p>
                  By blending handloom heritage with modern elegance, we translate
                  ancient Ikat and Sambalpuri weaving techniques into contemporary
                  ready-to-wear silhouettes and home textiles. Our functional,
                  breathable, high-quality natural cotton fabrics are specifically
                  designed for durability and comfort in tropical climates.
                </p>
                <p>
                  Each saree requires 45 to 60 days of dedicated labor, with the
                  artisan calculating every intersection of thread and color before
                  the loom is even threaded. The result is a fabric where patterns
                  appear to emerge from within the silk itself — a mathematical marvel
                  perfected over 800 years.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-cream/10">
                {[
                  { icon: Clock, value: "45-60 Days", label: "Per Masterpiece" },
                  { icon: Star, value: "4,000+", label: "Threads Per Saree" },
                  { icon: Gem, value: "800+", label: "Years of Tradition" },
                ].map((item, i) => (
                  <div key={i}>
                    <item.icon size={16} className="text-cream/30 mb-2" />
                    <p className="font-serif text-lg text-cream">{item.value}</p>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-cream/30 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MISSION & TRANSPARENCY ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4">Our Mission</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[0.95] mb-6">
              Radical Transparency.
              <br />
              <span className="text-indigo-deep">Fair Pricing.</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-obsidian/60">
              We operate on a mission of radical transparency, connecting rural weavers
              directly with the modern marketplace to eliminate exploitative middlemen.
              This direct-to-consumer model combats the &ldquo;middleman markup&rdquo; found in
              luxury boutiques, allowing us to offer the same artisanal quality at a
              transparent, fair-market rate.
            </p>
          </motion.div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-warm-200 bg-cream hover:border-indigo-deep/20 transition-colors duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-deep/5 border border-indigo-deep/10 flex items-center justify-center mb-5 group-hover:bg-indigo-deep/10 transition-colors duration-500">
                  <value.icon size={20} className="text-indigo-deep" />
                </div>
                <h3 className="font-serif text-lg tracking-tight mb-3">{value.title}</h3>
                <p className="text-sm text-obsidian/50 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISIT OUR STORE ===== */}
      <section className="py-20 md:py-28 bg-warm-100/50 border-y border-warm-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4">Visit Us</p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-[0.95] mb-6">
                Come Discover the Magic
                <br />
                of Handloom Sarees
              </h2>
              <p className="text-sm text-obsidian/60 leading-relaxed mb-8">
                We proudly serve the conscious ethnic consumer who seeks genuine
                hand-woven Ikat over mass-produced powerloom imitations. Visit our
                store in Balangir or shop online — the choice is yours.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-indigo-deep flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Ambika Sambalpuri Handloom</p>
                    <p className="text-sm text-obsidian/50">Balangir, Odisha, India — 767001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-indigo-deep flex-shrink-0" />
                  <a href="tel:+918658476300" className="text-sm text-obsidian/60 hover:text-indigo-deep transition-colors">
                    +91 86584 76300
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-indigo-deep flex-shrink-0" />
                  <a href="mailto:hello@ambikahandloom.in" className="text-sm text-obsidian/60 hover:text-indigo-deep transition-colors">
                    hello@ambikahandloom.in
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-indigo-deep flex-shrink-0" />
                  <p className="text-sm text-obsidian/60">Mon-Sat: 9 AM – 8 PM &nbsp;|&nbsp; Sun: 10 AM – 6 PM</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.app.goo.gl/6xc2EpPMaoHJQsZXA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-obsidian text-cream px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium rounded-lg hover:bg-indigo-deep transition-colors"
                >
                  <MapPin size={14} />
                  Open in Google Maps
                </a>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 border border-obsidian/20 text-obsidian px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium rounded-lg hover:bg-obsidian hover:text-cream transition-all"
                >
                  Browse Collection
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-warm-200 shadow-md h-[400px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.7647891734787!2d83.4880261!3d20.7146534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a240f9f335528d5%3A0x49261e522db29e82!2sAmbika%20Sambalpuri%20Handloom!5e1!3m2!1sen!2sin!4v1784110416177!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Ambika Sambalpuri Handloom Store Location — Balangir, Odisha"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-6">
              Own a Piece of
              <br />
              <span className="text-shimmer">Odisha&apos;s Heritage</span>
            </h2>
            <p className="text-sm text-obsidian/50 leading-relaxed mb-8">
              Every purchase directly supports weaver artisan families and helps
              keep this ancient 800-year-old tradition alive. Explore our collection
              and find your perfect handwoven masterpiece.
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
