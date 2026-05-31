"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  Scissors,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { Product } from "@/lib/products";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918658476300";

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
    showToast(`${product.name.split("—")[0].trim()} added to your bag!`);
  };

  const handleWhatsAppEnquiry = () => {
    const msg = `Namaste Ambika Handloom 🙏\n\nI am interested in:\n*${product.name}*\nProduct ID: ${product.id}\nPrice: ₹${product.price.toLocaleString("en-IN")}\n\nCould you please share more details?`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sectionPath =
    product.section === "sarees"
      ? "Sarees"
      : product.section === "ladies-wear"
      ? "Ladies Wear"
      : "Cut Pieces";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Breadcrumb — SEO + UX */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-obsidian/40 mb-8"
        >
          <Link href="/" className="hover:text-obsidian transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?section=${product.section}`}
            className="hover:text-obsidian transition-colors"
          >
            {sectionPath}
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?section=${product.section}&category=${product.category}`}
            className="hover:text-obsidian transition-colors"
          >
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-obsidian/60 truncate max-w-[200px]">
            {product.name.split("—")[0].trim()}
          </span>
        </nav>

        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-obsidian/40 hover:text-obsidian transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Collection
        </Link>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* ─── Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0.8, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-100"
            >
              <Image
                src={images[selectedImage]}
                alt={`${product.name} — ${product.categoryLabel} handwoven by artisans from ${product.artisanOrigin}. ${product.fabric}. Available at Ambika Handloom.`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                title={`${product.name} | ${product.categoryLabel} | Ambika Handloom`}
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-crimson-muted text-cream text-xs px-3 py-1.5 rounded-full font-medium">
                  Save ₹
                  {(product.originalPrice - product.price).toLocaleString(
                    "en-IN"
                  )}
                </div>
              )}
              {product.section === "cut-pieces" && (
                <div className="absolute top-4 right-4 bg-indigo-deep text-cream text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                  <Scissors size={10} />
                  Per Meter
                </div>
              )}
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? "border-obsidian"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`View ${product.name} image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} — view ${i + 1} — ${product.categoryLabel} from ${product.artisanOrigin}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      title={`${product.name} — Image ${i + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Category + Section Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 border border-warm-300 px-3 py-1 rounded-full">
                {product.sectionLabel}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-indigo-deep border border-indigo-deep/20 px-3 py-1 rounded-full">
                {product.categoryLabel}
              </span>
            </div>

            {/* Product Name — H1 for SEO */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[0.95]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-obsidian/30 line-through text-lg">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-emerald-600 text-sm font-medium">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    % off
                  </span>
                </>
              )}
              {product.section === "cut-pieces" && (
                <span className="text-sm text-obsidian/50">/ meter</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base leading-relaxed text-obsidian/60">
              {product.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: <MapPin size={14} />,
                  label: "Origin",
                  value: product.artisanOrigin,
                },
                {
                  icon: <Clock size={14} />,
                  label: "Weave Time",
                  value: product.weaveTime,
                },
                {
                  icon: <Star size={14} />,
                  label: "Fabric",
                  value: product.fabric || "Pure Silk",
                },
                {
                  icon: <Scissors size={14} />,
                  label: "Length",
                  value: product.length || "6m",
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-warm-100/60 border border-warm-200 rounded-xl p-3"
                >
                  <div className="flex items-center gap-1.5 text-obsidian/40 mb-1">
                    {spec.icon}
                    <span className="text-[10px] uppercase tracking-wider">
                      {spec.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-obsidian">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Details List */}
            <div className="space-y-2">
              {product.details.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-obsidian/70">{d}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-obsidian text-cream py-4 px-6 text-sm tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-obsidian/10"
                aria-label={`Add ${product.name} to shopping bag`}
              >
                <ShoppingBag size={16} />
                Add to Bag
              </motion.button>

              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 px-6 text-sm tracking-[0.12em] uppercase font-medium hover:bg-[#20bd5a] transition-colors rounded-xl"
                aria-label={`Enquire about ${product.name} on WhatsApp`}
              >
                <MessageCircle size={16} />
                Enquire on WhatsApp
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                {
                  icon: <Shield size={16} />,
                  text: "Secure Payment",
                },
                {
                  icon: <Truck size={16} />,
                  text: "Free Shipping",
                },
                {
                  icon: <Heart size={16} />,
                  text: "Artisan Made",
                },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-100 border border-warm-200 flex items-center justify-center text-indigo-deep">
                    {badge.icon}
                  </div>
                  <span className="text-[10px] text-obsidian/50 uppercase tracking-wider">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Artisan Story ─── */}
        {product.artisanStory && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            aria-labelledby="artisan-story-heading"
            className="mb-16 bg-obsidian text-cream rounded-2xl p-8 md:p-12"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-4">
              The Maker&apos;s Story
            </p>
            <h2
              id="artisan-story-heading"
              className="font-serif text-2xl md:text-3xl tracking-tight mb-6"
            >
              From the Loom of a Master Artisan
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-cream/60 max-w-3xl">
              {product.artisanStory}
            </p>
            <div className="flex items-center gap-2 mt-6">
              <MapPin size={14} className="text-cream/30" />
              <span className="text-sm text-cream/40">{product.artisanOrigin}</span>
            </div>
          </motion.section>
        )}

        {/* ─── Care Instructions ─── */}
        {product.careInstructions && product.careInstructions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            aria-labelledby="care-heading"
            className="mb-16"
          >
            <h2
              id="care-heading"
              className="font-serif text-2xl md:text-3xl tracking-tight mb-6"
            >
              Care Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.careInstructions.map((instruction, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-warm-100/50 border border-warm-200 rounded-xl"
                >
                  <CheckCircle2
                    size={16}
                    className="text-indigo-deep mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-obsidian/70">{instruction}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── FAQ Section (AEO — Answer Engine Optimization) ─── */}
        {product.faqItems && product.faqItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            aria-labelledby="faq-heading"
            className="mb-16"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
              Common Questions
            </p>
            <h2
              id="faq-heading"
              className="font-serif text-2xl md:text-3xl tracking-tight mb-8"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 max-w-3xl">
              {product.faqItems.map((faq, i) => (
                <div
                  key={i}
                  className="border border-warm-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-warm-100/50 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-medium pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        size={16}
                        className="text-obsidian/40 flex-shrink-0"
                      />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-obsidian/60 leading-relaxed border-t border-warm-200 pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── WhatsApp CTA Banner ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/20 rounded-2xl p-8 text-center"
        >
          <p className="text-sm text-obsidian/50 mb-2">Have a question?</p>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-4">
            Chat with Us on WhatsApp
          </h2>
          <p className="text-sm text-obsidian/60 mb-6 max-w-md mx-auto leading-relaxed">
            Our artisan team is available to answer questions about fabric,
            sizing, custom orders, and shipping.
          </p>
          <button
            onClick={handleWhatsAppEnquiry}
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white py-3.5 px-8 text-sm tracking-[0.12em] uppercase font-medium hover:bg-[#20bd5a] transition-colors rounded-xl shadow-lg"
            aria-label="Chat on WhatsApp about this product"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </button>
        </motion.section>
      </div>
    </div>
  );
}
