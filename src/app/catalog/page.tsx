"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, LayoutGrid, Rows3 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

type GridMode = "grid3" | "grid2" | "list";

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [gridMode, setGridMode] = useState<GridMode>("grid3");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("ah-catalog-grid");
    if (saved === "grid3" || saved === "grid2" || saved === "list") {
      setGridMode(saved);
    }
  }, []);

  const setGrid = (mode: GridMode) => {
    setGridMode(mode);
    localStorage.setItem("ah-catalog-grid", mode);
  };

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const gridClass = {
    grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16",
    grid2: "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20",
    list: "flex flex-col gap-0",
  }[gridMode];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header with animated text reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-3"
          >
            The Collection
          </motion.p>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95]"
            >
              Sambalpuri
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95]"
            >
              Masterpieces
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-obsidian/50 mt-4 max-w-lg leading-relaxed"
          >
            Each piece in our collection is a unique testament to centuries of
            weaving tradition. Handcrafted by master artisans of Odisha.
          </motion.p>
        </motion.div>

        {/* Controls Row: Filter + Grid Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12"
        >
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Grid Mode Toggle */}
          {isClient && (
            <div className="flex items-center gap-1 bg-warm-100 p-1 rounded-lg border border-warm-200">
              <button
                onClick={() => setGrid("grid3")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  gridMode === "grid3"
                    ? "bg-obsidian text-cream shadow-sm"
                    : "text-obsidian/40 hover:text-obsidian"
                }`}
                aria-label="3-column grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGrid("grid2")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  gridMode === "grid2"
                    ? "bg-obsidian text-cream shadow-sm"
                    : "text-obsidian/40 hover:text-obsidian"
                }`}
                aria-label="2-column grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setGrid("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  gridMode === "list"
                    ? "bg-obsidian text-cream shadow-sm"
                    : "text-obsidian/40 hover:text-obsidian"
                }`}
                aria-label="List view"
              >
                <Rows3 size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Product count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs tracking-[0.15em] uppercase text-obsidian/30 mb-8"
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "Masterpiece" : "Masterpieces"}
        </motion.p>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + gridMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={gridClass}
          >
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className={
                  gridMode === "grid3" && i % 3 === 1 ? "md:mt-12" : ""
                }
              >
                <ProductCard
                  product={product}
                  index={i}
                  layout={gridMode === "list" ? "editorial" : "grid"}
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
