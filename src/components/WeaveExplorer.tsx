"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  Check,
} from "lucide-react";
import { Product } from "@/lib/products";
import { getProducts, getProductsAsync, saveQuizResult } from "@/lib/admin-store";

// ─── Quiz Data ──────────────────────────────────────────────

const OCCASIONS = [
  {
    id: "wedding",
    emoji: "🎉",
    label: "Wedding & Grand Celebrations",
    sublabel: "Exclusive silk masterpieces for your biggest moments",
    categories: ["exclusive-masterpieces", "pure-silk"],
    sections: ["sarees"],
    image: "/images/saree-hero-1.png",
  },
  {
    id: "festival",
    emoji: "🪔",
    label: "Festival & Puja",
    sublabel: "Traditional Ikat elegance for auspicious occasions",
    categories: ["pure-silk", "traditional-ikat"],
    sections: ["sarees"],
    image: "/images/saree-product-4.png",
  },
  {
    id: "daily",
    emoji: "👔",
    label: "Daily Elegance & Office",
    sublabel: "Kurtas, dupattas & dress materials for everyday grace",
    categories: ["ladies-wear-kurta", "ladies-wear-dupatta", "ladies-wear-dress-material"],
    sections: ["ladies-wear"],
    image: "/images/kurta-indigo-bloom.png",
  },
  {
    id: "custom",
    emoji: "✂️",
    label: "Custom Creation & Stitching",
    sublabel: "Premium Ikat fabric by the meter for your designs",
    categories: ["cut-pieces-silk", "cut-pieces-cotton", "cut-pieces-blouse"],
    sections: ["cut-pieces"],
    image: "/images/silk-cutpiece-indigo.png",
  },
];

const FABRICS = [
  {
    id: "silk",
    emoji: "🦋",
    label: "Pure Mulberry Silk",
    sublabel: "Luxurious drape, natural sheen",
  },
  {
    id: "cotton",
    emoji: "🌿",
    label: "Pure Cotton",
    sublabel: "Breathable comfort for everyday",
  },
  {
    id: "any",
    emoji: "✨",
    label: "Both Work for Me",
    sublabel: "Show me everything that matches",
  },
];

const BUDGETS = [
  {
    id: "under-5k",
    label: "Under ₹5,000",
    sublabel: "Accessible artisan craft",
    min: 0,
    max: 5000,
  },
  {
    id: "5k-15k",
    label: "₹5,000 – ₹15,000",
    sublabel: "Premium handloom quality",
    min: 5000,
    max: 15000,
  },
  {
    id: "above-15k",
    label: "₹15,000+",
    sublabel: "Heirloom investment pieces",
    min: 15000,
    max: Infinity,
  },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918658476300";

// ─── Component ──────────────────────────────────────────────

interface WeaveExplorerProps {
  fullPage?: boolean;
}

export default function WeaveExplorer({ fullPage = false }: WeaveExplorerProps) {
  const [step, setStep] = useState(0); // 0=occasion, 1=fabric, 2=budget, 3=results
  const [occasion, setOccasion] = useState<string | null>(null);
  const [fabric, setFabric] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(getProducts);
  const [resultsSaved, setResultsSaved] = useState(false);

  useEffect(() => {
    getProductsAsync()
      .then((fetched) => {
        if (fetched.length > 0) setAllProducts(fetched);
      })
      .catch(console.error);
  }, []);

  const filterProducts = useCallback(
    (occ: string, fab: string, bud: string) => {
      const occasionData = OCCASIONS.find((o) => o.id === occ);
      const budgetData = BUDGETS.find((b) => b.id === bud);
      if (!occasionData || !budgetData) return [];

      let filtered = allProducts.filter((p) => p.inStock);

      // Filter by section + category
      filtered = filtered.filter(
        (p) =>
          occasionData.sections.includes(p.section) ||
          occasionData.categories.includes(p.category)
      );

      // Filter by fabric
      if (fab === "silk") {
        filtered = filtered.filter(
          (p) =>
            p.fabric?.toLowerCase().includes("silk") ||
            p.details.some((d) => d.toLowerCase().includes("silk")) ||
            p.category.includes("silk")
        );
      } else if (fab === "cotton") {
        filtered = filtered.filter(
          (p) =>
            p.fabric?.toLowerCase().includes("cotton") ||
            p.details.some((d) => d.toLowerCase().includes("cotton")) ||
            p.category.includes("cotton")
        );
      }

      // Filter by price
      filtered = filtered.filter(
        (p) => p.price >= budgetData.min && p.price < budgetData.max
      );

      return filtered;
    },
    [allProducts]
  );

  const handleOccasion = (id: string) => {
    setOccasion(id);
    setStep(1);
  };

  const handleFabric = (id: string) => {
    setFabric(id);
    setStep(2);
  };

  const handleBudget = (id: string) => {
    setBudget(id);
    const matched = filterProducts(occasion!, fabric!, id);

    // If no exact match, show closest alternatives from same section
    if (matched.length === 0) {
      const occasionData = OCCASIONS.find((o) => o.id === occasion);
      if (occasionData) {
        const alternatives = allProducts
          .filter(
            (p) =>
              p.inStock &&
              (occasionData.sections.includes(p.section) ||
                occasionData.categories.includes(p.category))
          )
          .slice(0, 3);
        setResults(alternatives);
      }
    } else {
      setResults(matched.slice(0, 4));
    }

    setStep(3);

    // Save quiz result to database
    const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label || occasion || "";
    const fabricLabel = FABRICS.find((f) => f.id === fabric!)?.label || fabric || "";
    const budgetLabel = BUDGETS.find((b) => b.id === id)?.label || id;

    saveQuizResult({
      occasion: occasionLabel,
      fabric: fabricLabel,
      budget: budgetLabel,
      matchedProductIds: (matched.length > 0 ? matched : []).map((p) => p.id).slice(0, 4),
      completedAt: new Date().toISOString(),
    })
      .then(() => setResultsSaved(true))
      .catch(console.error);
  };

  const handleReset = () => {
    setStep(0);
    setOccasion(null);
    setFabric(null);
    setBudget(null);
    setResults([]);
    setResultsSaved(false);
  };

  const handleWhatsApp = (product: Product) => {
    const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label || "";
    const fabricLabel = FABRICS.find((f) => f.id === fabric)?.label || "";
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label || "";

    const msg = `Namaste Ambika Handloom 🙏\n\nI just used your Weave Explorer and I'm interested in:\n🥻 *${product.name}*\nProduct ID: ${product.id}\nPrice: ₹${product.price.toLocaleString("en-IN")}\n\nMy preferences:\n• Occasion: ${occasionLabel}\n• Fabric: ${fabricLabel}\n• Budget: ${budgetLabel}\n\nCould you share more details?`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const stepLabels = ["Occasion", "Fabric", "Budget", "Your Match"];
  const totalSteps = 4;

  return (
    <div className={fullPage ? "" : ""}>
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                i <= step ? "text-indigo-deep font-medium" : "text-obsidian/25"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                  i < step
                    ? "bg-indigo-deep text-cream border-indigo-deep"
                    : i === step
                    ? "border-indigo-deep text-indigo-deep bg-indigo-deep/10"
                    : "border-warm-300 text-obsidian/30"
                }`}
              >
                {i < step ? <Check size={10} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-warm-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-deep rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Occasion ─── */}
        {step === 0 && (
          <motion.div
            key="occasion"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
              What&apos;s the Occasion?
            </h3>
            <p className="text-sm text-obsidian/50 mb-8">
              Tell us what you&apos;re shopping for, and we&apos;ll find your perfect weave.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => handleOccasion(occ.id)}
                  className="group relative overflow-hidden rounded-2xl border border-warm-200 hover:border-indigo-deep/40 transition-all duration-500 text-left bg-cream hover:shadow-lg"
                >
                  <div className="relative h-32 sm:h-36 overflow-hidden">
                    <Image
                      src={occ.image}
                      alt={occ.label}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/80 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="text-2xl mb-1">{occ.emoji}</span>
                    <span className="font-serif text-lg tracking-tight group-hover:text-indigo-deep transition-colors">
                      {occ.label}
                    </span>
                    <span className="text-xs text-obsidian/40 mt-0.5">
                      {occ.sublabel}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-obsidian/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-indigo-deep" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: Fabric ─── */}
        {step === 1 && (
          <motion.div
            key="fabric"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-1.5 text-xs text-obsidian/40 hover:text-obsidian transition-colors mb-6"
            >
              <ArrowLeft size={12} /> Back
            </button>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
              Fabric Preference?
            </h3>
            <p className="text-sm text-obsidian/50 mb-8">
              Each fabric has its own character. What speaks to you?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FABRICS.map((fab) => (
                <button
                  key={fab.id}
                  onClick={() => handleFabric(fab.id)}
                  className="group p-6 rounded-2xl border border-warm-200 hover:border-indigo-deep/40 bg-cream hover:shadow-lg transition-all duration-500 text-left"
                >
                  <span className="text-3xl mb-3 block">{fab.emoji}</span>
                  <span className="font-serif text-lg tracking-tight block group-hover:text-indigo-deep transition-colors">
                    {fab.label}
                  </span>
                  <span className="text-xs text-obsidian/40 mt-1 block">
                    {fab.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: Budget ─── */}
        {step === 2 && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-obsidian/40 hover:text-obsidian transition-colors mb-6"
            >
              <ArrowLeft size={12} /> Back
            </button>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
              What&apos;s Your Budget?
            </h3>
            <p className="text-sm text-obsidian/50 mb-8">
              Every piece is a handwoven masterpiece — we have options for every range.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BUDGETS.map((bud) => (
                <button
                  key={bud.id}
                  onClick={() => handleBudget(bud.id)}
                  className="group p-6 rounded-2xl border border-warm-200 hover:border-indigo-deep/40 bg-cream hover:shadow-lg transition-all duration-500 text-left"
                >
                  <span className="font-serif text-2xl tracking-tight block group-hover:text-indigo-deep transition-colors">
                    {bud.label}
                  </span>
                  <span className="text-xs text-obsidian/40 mt-2 block">
                    {bud.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 4: Results ─── */}
        {step === 3 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight">
                  {results.length > 0
                    ? "Your Perfect Match"
                    : "Curated Alternatives"}
                </h3>
                <p className="text-sm text-obsidian/50 mt-1">
                  {results.length > 0
                    ? `We found ${results.length} piece${results.length > 1 ? "s" : ""} that match your taste.`
                    : "We're adding new pieces weekly — here's what's closest to your taste."}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-obsidian/40 hover:text-indigo-deep transition-colors border border-warm-200 rounded-full px-4 py-2"
              >
                <RotateCcw size={12} /> Retake Quiz
              </button>
            </div>

            {/* Product Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-2xl border border-warm-200 overflow-hidden bg-cream hover:shadow-xl transition-all duration-500"
                >
                  <Link href={`/catalog/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={`${product.name} — ${product.categoryLabel} by Ambika Handloom`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {product.originalPrice && (
                        <span className="absolute top-3 left-3 bg-crimson-muted text-cream text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-medium">
                          Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40 mb-1">
                      {product.categoryLabel}
                    </p>
                    <h4 className="font-serif text-lg tracking-tight leading-tight mb-2">
                      {product.name.split("—")[0].trim()}
                    </h4>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-serif text-xl text-indigo-deep">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-obsidian/30 line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/catalog/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-obsidian text-cream text-xs tracking-[0.1em] uppercase font-medium px-4 py-3 rounded-xl hover:bg-indigo-deep transition-colors"
                      >
                        <ShoppingBag size={13} /> View Details
                      </Link>
                      <button
                        onClick={() => handleWhatsApp(product)}
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs px-4 py-3 rounded-xl hover:bg-[#20bd5a] transition-colors"
                        aria-label={`Ask about ${product.name} on WhatsApp`}
                      >
                        <MessageCircle size={13} />
                      </button>
                    </div>

                    {/* Amazon Coming Soon */}
                    <button
                      disabled
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 border border-warm-200 text-obsidian/25 text-xs tracking-[0.1em] uppercase px-4 py-2.5 rounded-xl cursor-not-allowed"
                      title="Amazon store coming soon!"
                    >
                      <ExternalLink size={12} /> Buy on Amazon — Coming Soon
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-warm-200">
              <span className="text-[10px] tracking-[0.15em] uppercase text-obsidian/30 self-center mr-2">
                Your picks:
              </span>
              {occasion && (
                <span className="text-xs bg-indigo-deep/10 text-indigo-deep px-3 py-1.5 rounded-full">
                  {OCCASIONS.find((o) => o.id === occasion)?.emoji}{" "}
                  {OCCASIONS.find((o) => o.id === occasion)?.label}
                </span>
              )}
              {fabric && (
                <span className="text-xs bg-indigo-deep/10 text-indigo-deep px-3 py-1.5 rounded-full">
                  {FABRICS.find((f) => f.id === fabric)?.emoji}{" "}
                  {FABRICS.find((f) => f.id === fabric)?.label}
                </span>
              )}
              {budget && (
                <span className="text-xs bg-indigo-deep/10 text-indigo-deep px-3 py-1.5 rounded-full">
                  {BUDGETS.find((b) => b.id === budget)?.label}
                </span>
              )}
              {resultsSaved && (
                <span className="text-[10px] text-obsidian/20 self-center ml-auto">
                  ✓ Preferences saved
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
