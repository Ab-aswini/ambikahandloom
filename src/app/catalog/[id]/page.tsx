"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Layers,
  Shield,
  ShoppingBag,
  Truck,
  Sparkles,
  BookOpen,
  ListChecks,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { products } from "@/lib/products";
import { getProducts, getReviewsByProduct } from "@/lib/admin-store";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import ProductCard from "@/components/ProductCard";

type Tab = "description" | "artisan" | "care";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isZooming, setIsZooming] = useState(false);
  const zoomRef = React.useRef<HTMLDivElement>(null);

  // Lightbox state (mobile zoom + review photos)
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    window.scrollTo(0, 0);
  }, [id]);

  // Apply zoom background via ref after render (avoids inline styles)
  useEffect(() => {
    if (isZooming && zoomRef.current) {
      const src = zoomRef.current.getAttribute("data-src");
      if (src) {
        zoomRef.current.style.backgroundImage = `url(${src})`;
        zoomRef.current.style.backgroundSize = "250%";
        zoomRef.current.style.backgroundPosition = "50% 50%";
      }
    }
  }, [isZooming, selectedImage]);

  if (!isClient) return null;

  // Try localStorage products first, fall back to hardcoded
  const allProducts = typeof window !== "undefined" ? getProducts() : products;
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-cream">
        <h1 className="font-serif text-3xl mb-4 text-obsidian">
          Masterpiece Not Found
        </h1>
        <Link
          href="/catalog"
          className="text-sm tracking-[0.15em] uppercase text-obsidian/60 hover:text-obsidian transition-colors line-reveal"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  // Get reviews
  const productReviews = typeof window !== "undefined" ? getReviewsByProduct(product.id) : [];

  // Get similar products
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  if (similarProducts.length < 3) {
    const additional = allProducts.filter(
      (p) =>
        p.id !== product.id && !similarProducts.find((sp) => sp.id === p.id)
    );
    similarProducts.push(...additional.slice(0, 3 - similarProducts.length));
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product);
      showToast(`${product.name.split("—")[0].trim()} added to your bag`);
      setIsAdding(false);
    }, 400);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    if (zoomRef.current) {
      zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
    }
  };

  const displayImage = selectedImage || product.image;
  // Deduplicate main image and additional images
  const productImages = Array.from(new Set([product.image, ...(product.images || [])]));

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "description", label: "Details", icon: <ListChecks size={14} /> },
    { id: "artisan", label: "Artisan Story", icon: <BookOpen size={14} /> },
    { id: "care", label: "Care Guide", icon: <Sparkles size={14} /> },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-cream">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-obsidian/50 hover:text-obsidian transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Collection
          </Link>
        </motion.div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:h-[800px]">
            {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0 md:w-24 order-2 md:order-1 pb-2 md:pb-0">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  aria-label={`View image ${idx + 1} of ${productImages.length}`}
                  className={`relative aspect-[3/4] w-20 md:w-full shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    displayImage === img ? "border-obsidian" : "border-transparent hover:border-obsidian/30"
                  }`}
                >
                  <Image src={img} alt={`Product view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex-1 aspect-[3/4] md:aspect-auto rounded-2xl overflow-hidden bg-warm-100 cursor-crosshair group order-1 md:order-2"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onClick={() => {
                // Mobile: tap to open fullscreen lightbox
                if (window.innerWidth < 1024) {
                  setLightbox({ images: productImages, index: productImages.indexOf(displayImage) });
                }
              }}
            >
              {/* Crossfade transition on image swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isZooming ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Zoom Overlay — uses ref for dynamic mouse-position tracking */}
              {isZooming && (
                <div
                  ref={zoomRef}
                  className="absolute inset-0 bg-no-repeat pointer-events-none zoom-overlay"
                  data-src={displayImage}
                />
              )}

              {/* Mobile zoom hint */}
              <div className="absolute bottom-4 right-4 lg:hidden pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-obsidian/60 backdrop-blur-md text-cream text-[10px] tracking-[0.1em] uppercase rounded-full">
                  <ZoomIn size={12} /> Tap to zoom
                </span>
              </div>

              <div className="absolute top-6 left-6 pointer-events-none">
                <span className="inline-block px-4 py-2 bg-cream/90 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase font-medium rounded-full text-obsidian">
                  {product.categoryLabel}
                </span>
              </div>
              {product.originalPrice && (
                <div className="absolute top-6 right-6 pointer-events-none">
                  <span className="inline-block px-4 py-2 bg-crimson-muted text-cream text-[10px] tracking-[0.15em] uppercase font-medium rounded-full">
                    Save ₹
                    {(
                      product.originalPrice - product.price
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Product Info (Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight leading-[0.95] text-obsidian">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4 pt-2">
                  <span className="font-serif text-3xl text-obsidian">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-obsidian/30 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Artisan Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-3 gap-4 py-6 border-y border-warm-200"
              >
                <div className="flex flex-col gap-1.5">
                  <Clock size={16} className="text-obsidian/40" />
                  <p className="text-[9px] tracking-[0.15em] uppercase text-obsidian/40">
                    Time
                  </p>
                  <p className="text-sm font-medium text-obsidian">
                    {product.weaveTime}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <MapPin size={16} className="text-obsidian/40" />
                  <p className="text-[9px] tracking-[0.15em] uppercase text-obsidian/40">
                    Origin
                  </p>
                  <p className="text-sm font-medium text-obsidian">
                    {product.artisanOrigin.split(",")[0]}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Layers size={16} className="text-obsidian/40" />
                  <p className="text-[9px] tracking-[0.15em] uppercase text-obsidian/40">
                    Thread
                  </p>
                  <p className="text-sm font-medium text-obsidian">
                    {product.threadCount}
                  </p>
                </div>
              </motion.div>

              {/* Tabbed Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Tab Buttons */}
                <div className="flex gap-1 mb-6 bg-warm-100 rounded-xl p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-cream text-obsidian shadow-sm"
                          : "text-obsidian/40 hover:text-obsidian/60"
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="min-h-[160px]"
                  >
                    {activeTab === "description" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-obsidian/70">
                          {product.description}
                        </p>
                        <ul className="space-y-2.5 pt-2">
                          {product.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-sm text-obsidian/70"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-deep/40 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === "artisan" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-obsidian/70">
                          {product.artisanStory ||
                            "The story of this masterpiece and its creator will be shared soon. Every Sambalpuri saree carries generations of knowledge woven into its very threads."}
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-xs text-obsidian/40">
                          <MapPin size={12} />
                          <span>{product.artisanOrigin}</span>
                        </div>
                      </div>
                    )}

                    {activeTab === "care" && (
                      <ul className="space-y-3">
                        {(
                          product.careInstructions || [
                            "Dry clean recommended",
                            "Store in a breathable fabric bag",
                            "Avoid direct sunlight",
                            "Iron on low heat with a pressing cloth",
                          ]
                        ).map((instruction, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-obsidian/70"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-crimson-muted/40 mt-1.5 flex-shrink-0" />
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Add to Bag CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-4"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="w-full magnetic-btn bg-obsidian text-cream py-5 text-sm tracking-[0.15em] uppercase font-medium flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-indigo-deep transition-all duration-500 relative overflow-hidden"
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                      Securing...
                    </span>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      {product.inStock ? "Add to Bag" : "Out of Stock"}
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-5">
                  <div className="flex items-center gap-2 text-xs text-obsidian/50">
                    <Shield size={14} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-obsidian/50">
                    <Truck size={14} />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Happy Customers / Wall of Love */}
        {productReviews.length > 0 && (
          <div className="mt-32 pt-20 border-t border-warm-200">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
                Wall of Love
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-obsidian">
                Happy Customers
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-warm-200/50 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {"★".repeat(review.rating)}
                      <span className="text-warm-300">{"★".repeat(5 - review.rating)}</span>
                    </div>
                    <span className="text-xs text-obsidian/30 font-medium">Verified Buyer</span>
                  </div>
                  
                  <p className="text-sm text-obsidian/70 italic leading-relaxed mb-6 flex-grow">
                    "{review.comment}"
                  </p>

                  {/* Review Photos */}
                  {(() => {
                    const reviewPhotos = review.images?.length ? review.images : (review.image ? [review.image] : []);
                    return reviewPhotos.length > 0 && (
                      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                        {reviewPhotos.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setLightbox({ images: reviewPhotos, index: idx })}
                            className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0 border border-warm-200 shadow-sm hover:scale-105 transition-transform cursor-pointer group"
                            aria-label={`View ${review.customerName} photo ${idx + 1} fullscreen`}
                          >
                            <Image src={img} alt={`${review.customerName} photo ${idx + 1}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-colors flex items-center justify-center">
                              <ZoomIn size={14} className="text-cream opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-warm-100">
                    <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center shrink-0 border-2 border-cream text-obsidian/40 font-serif text-lg shadow-sm">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-obsidian">{review.customerName}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* You May Also Like */}
        {similarProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-warm-200">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
                  Curated For You
                </p>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-obsidian">
                  Similar Masterpieces
                </h2>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-obsidian/60 hover:text-obsidian transition-colors duration-300 line-reveal"
              >
                View Full Collection
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} layout="grid" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== LIGHTBOX MODAL ===== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-colors"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-10 text-cream/60 text-xs tracking-[0.15em] uppercase">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>

            {/* Previous */}
            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => prev ? {
                    ...prev,
                    index: (prev.index - 1 + prev.images.length) % prev.images.length
                  } : null);
                }}
                className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => prev ? {
                    ...prev,
                    index: (prev.index + 1) % prev.images.length
                  } : null);
                }}
                className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightbox.index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-[90vw] h-[80vh] max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={lightbox.images[lightbox.index]}
                  alt={`Fullscreen view ${lightbox.index + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail strip */}
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {lightbox.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox((prev) => prev ? { ...prev, index: idx } : null);
                    }}
                    className={`w-12 h-12 relative rounded-lg overflow-hidden border-2 transition-all ${
                      idx === lightbox.index ? 'border-cream scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
