"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Layers, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

interface ProductCardProps {
  product: Product;
  index: number;
  layout?: "editorial" | "grid";
}

export default function ProductCard({
  product,
  index,
  layout = "grid",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name.split("—")[0].trim()} added to your bag`);
  };

  if (layout === "editorial") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
          index % 2 === 1 ? "md:direction-rtl" : ""
        }`}
      >
        <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-warm-100 group cursor-pointer">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover img-hover-scale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1.5 bg-cream/90 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase font-medium rounded-full">
                {product.categoryLabel}
              </span>
            </div>

            {/* Quick Add */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-obsidian text-cream p-3 rounded-full shadow-lg"
              aria-label="Add to bag"
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>

        <div className={`${index % 2 === 1 ? "md:order-1" : ""} space-y-6`}>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
              {product.categoryLabel}
            </p>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight">
              {product.name}
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-obsidian/60 max-w-md">
            {product.description}
          </p>

          {/* Artisan Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-obsidian/30" />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40">
                  Weave Time
                </p>
                <p className="text-sm font-medium">{product.weaveTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-obsidian/30" />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40">
                  Origin
                </p>
                <p className="text-sm font-medium">{product.artisanOrigin.split(",")[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-obsidian/30" />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40">
                  Thread
                </p>
                <p className="text-sm font-medium">{product.threadCount}</p>
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-obsidian/30 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="magnetic-btn bg-obsidian text-cream px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-warm-100 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover img-hover-scale"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 bg-cream/90 backdrop-blur-sm text-[9px] tracking-[0.15em] uppercase font-medium rounded-full">
            {product.categoryLabel}
          </span>
        </div>

        {product.originalPrice && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 bg-crimson-muted text-cream text-[9px] tracking-[0.15em] uppercase font-medium rounded-full">
              Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Quick Add */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-obsidian text-cream p-2.5 rounded-full shadow-lg"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag size={16} />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-serif text-lg tracking-tight leading-tight group-hover:text-indigo-deep transition-colors duration-300">
          {product.name}
        </h3>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-[10px] tracking-[0.1em] uppercase text-obsidian/40">
          <span>{product.weaveTime}</span>
          <span>•</span>
          <span>{product.artisanOrigin.split(",")[0]}</span>
          <span>•</span>
          <span>{product.threadCount}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-serif text-lg">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-obsidian/30 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
