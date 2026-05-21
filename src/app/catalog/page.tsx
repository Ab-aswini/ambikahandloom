"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3">
            The Collection
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
            Sambalpuri
            <br />
            Masterpieces
          </h1>
          <p className="text-sm md:text-base text-obsidian/50 mt-4 max-w-lg leading-relaxed">
            Each piece in our collection is a unique testament to centuries of
            weaving tradition. Handcrafted by master artisans of Odisha.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`filter-pill px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase font-medium border transition-all duration-300 ${
                activeFilter === cat.id
                  ? "bg-obsidian text-cream border-obsidian"
                  : "bg-transparent text-obsidian/60 border-warm-300 hover:border-obsidian hover:text-obsidian"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Product count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs tracking-[0.15em] uppercase text-obsidian/30 mb-8"
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "Masterpiece" : "Masterpieces"}
        </motion.p>

        {/* Products Grid - Staggered Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          >
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className={`${i % 3 === 1 ? "md:mt-12" : ""}`}
              >
                <ProductCard
                  product={product}
                  index={i}
                  layout="grid"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-serif text-2xl text-obsidian/30">
              No pieces found in this category
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
