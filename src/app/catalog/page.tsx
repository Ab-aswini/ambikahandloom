"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, LayoutGrid, Rows3, MessageCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { sections, categoryBySections, Product } from "@/lib/products";
import { getProducts, getProductsAsync } from "@/lib/admin-store";

type GridMode = "grid3" | "grid2" | "list";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918658476300";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section") || "sarees";
  const initialCategory = searchParams.get("category") || "all";

  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [gridMode, setGridMode] = useState<GridMode>("grid3");
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change (e.g. clicking top header links)
  useEffect(() => {
    const sectParam = searchParams.get("section");
    if (sectParam) {
      setActiveSection(sectParam);
    }
    const catParam = searchParams.get("category");
    if (catParam) {
      setActiveCategory(catParam);
    } else {
      setActiveCategory("all");
    }
  }, [searchParams]);

  // Load products dynamically from admin-store (Supabase + localStorage)
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("ah-catalog-grid");
    if (saved === "grid3" || saved === "grid2" || saved === "list") {
      setGridMode(saved);
    }
    // Fetch products from Supabase/localStorage
    getProductsAsync()
      .then((fetched) => {
        if (fetched.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProducts(fetched);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const setGrid = (mode: GridMode) => {
    setGridMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("ah-catalog-grid", mode);
    }
  };

  const router = useRouter();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setActiveCategory("all");
    router.push(`/catalog?section=${sectionId}&category=all`, { scroll: false });
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    router.push(`/catalog?section=${activeSection}&category=${categoryId}`, { scroll: false });
  };

  const currentCategories = categoryBySections[activeSection] || [];

  const filteredProducts = products.filter((p: Product) => {
    const sectionMatch = p.section === activeSection;
    const categoryMatch =
      activeCategory === "all" || p.category === activeCategory;
    return sectionMatch && categoryMatch;
  });

  const gridClass = {
    grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16",
    grid2: "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20",
    list: "flex flex-col gap-0",
  }[gridMode];

  const activeSection_ = sections.find((s) => s.id === activeSection);

  const handleWhatsAppCustomOrder = () => {
    const sectionLabel = activeSection_?.label || "collection";
    const msg = `Namaste Ambika Handloom 🙏\n\nI am browsing your *${sectionLabel}* collection and would like to enquire about availability and custom orders.\n\nCould you please help?`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* ─── Section Tabs (3 main sections) ─── */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-4"
          >
            Our Collection
          </motion.p>

          <div className="flex flex-wrap gap-2 mb-8">
            {sections.map((section, i) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleSectionChange(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
                  activeSection === section.id
                    ? "bg-obsidian text-cream border-obsidian"
                    : "bg-transparent text-obsidian/60 border-warm-300 hover:border-obsidian hover:text-obsidian"
                }`}
              >
                <span>{section.emoji}</span>
                {section.label}
              </motion.button>
            ))}
          </div>

          {/* Section heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-3">
                {activeSection_?.label}
              </h1>
              <p className="text-sm md:text-base text-obsidian/50 leading-relaxed">
                {activeSection_?.description} — handcrafted by master artisans of Odisha.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Controls Row: Category Filter + Grid Toggle ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {currentCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`filter-pill px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase font-medium border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-obsidian text-cream border-obsidian"
                    : "bg-transparent text-obsidian/60 border-warm-300 hover:border-obsidian hover:text-obsidian"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp custom order */}
            <button
              onClick={handleWhatsAppCustomOrder}
              className="flex items-center gap-2 text-xs text-[#25D366] border border-[#25D366]/30 px-4 py-2.5 rounded-full hover:bg-[#25D366]/5 transition-colors"
              aria-label="Ask about custom orders on WhatsApp"
            >
              <MessageCircle size={14} />
              Custom Order?
            </button>

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
          </div>
        </motion.div>

        {/* Product count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs tracking-[0.15em] uppercase text-obsidian/30 mb-8"
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "Item" : "Items"}
        </motion.p>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection + activeCategory + gridMode}
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
            <p className="font-serif text-2xl text-obsidian/30 mb-4">
              No pieces found in this category
            </p>
            <button
              onClick={handleWhatsAppCustomOrder}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle size={16} />
              Ask on WhatsApp — We can help!
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-obsidian/20 border-t-obsidian rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
