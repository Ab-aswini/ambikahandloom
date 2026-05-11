"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import { getProductById, saveProduct, getProducts } from "@/lib/admin-store";

const emptyProduct: Product = {
  id: "",
  name: "",
  price: 0,
  image: "/images/saree-hero-1.png",
  category: "pure-silk",
  categoryLabel: "Pure Silk",
  weaveTime: "",
  artisanOrigin: "",
  threadCount: "",
  description: "",
  details: [],
  inStock: true,
  artisanStory: "",
  careInstructions: [],
};

const categoryOptions = [
  { value: "pure-silk", label: "Pure Silk" },
  { value: "traditional-ikat", label: "Traditional Ikat" },
  { value: "exclusive-masterpieces", label: "Exclusive Masterpiece" },
];

export default function AdminProductEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [detailsText, setDetailsText] = useState("");
  const [careText, setCareText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isNew) {
      const found = getProductById(id);
      if (found) {
        setProduct(found);
        setDetailsText(found.details.join("\n"));
        setCareText((found.careInstructions || []).join("\n"));
      }
    } else {
      // Generate new ID
      const count = getProducts().length;
      setProduct({
        ...emptyProduct,
        id: `AH-${String(count + 1).padStart(3, "0")}`,
      });
    }
  }, [id, isNew]);

  const handleSave = () => {
    setIsSaving(true);

    const categoryLabel =
      categoryOptions.find((c) => c.value === product.category)?.label ||
      "Pure Silk";

    const updatedProduct: Product = {
      ...product,
      categoryLabel,
      details: detailsText.split("\n").filter((d) => d.trim()),
      careInstructions: careText.split("\n").filter((c) => c.trim()),
    };

    saveProduct(updatedProduct);

    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/products");
    }, 500);
  };

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-white text-xl font-medium tracking-tight">
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              {product.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              href={`/catalog/${product.id}`}
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-colors"
            >
              <Eye size={14} />
              Preview
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !product.name || !product.price}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Basic Information
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                placeholder="e.g. Nilambari — The Midnight Sky"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={product.price || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="18500"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={product.originalPrice || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      originalPrice: parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder="22000 (optional)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Category
                </label>
                <select
                  value={product.category}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      category: e.target.value as Product["category"],
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  aria-label="Product category"
                >
                  {categoryOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#1a1a1a]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Stock Status
                </label>
                <select
                  value={product.inStock ? "in-stock" : "out-of-stock"}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      inStock: e.target.value === "in-stock",
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  aria-label="Stock status"
                >
                  <option value="in-stock" className="bg-[#1a1a1a]">
                    In Stock
                  </option>
                  <option value="out-of-stock" className="bg-[#1a1a1a]">
                    Out of Stock
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Description
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Description
              </label>
              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                rows={4}
                placeholder="Describe the saree's beauty, craftsmanship, and unique qualities..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Product Details (one per line)
              </label>
              <textarea
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                rows={5}
                placeholder={"Pure Mulberry Silk\nDouble Ikat Technique\nNatural Indigo Dye\nGold Zari Border\n6.2m with Blouse Piece"}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none font-mono"
              />
            </div>
          </div>

          {/* Artisan & Care */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Artisan Story & Care
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Artisan Story
              </label>
              <textarea
                value={product.artisanStory || ""}
                onChange={(e) =>
                  setProduct({ ...product, artisanStory: e.target.value })
                }
                rows={4}
                placeholder="Tell the story of the artisan who crafted this piece..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Care Instructions (one per line)
              </label>
              <textarea
                value={careText}
                onChange={(e) => setCareText(e.target.value)}
                rows={4}
                placeholder={"Dry clean only for best results\nStore in a muslin cloth\nAvoid direct sunlight"}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Product Image
            </h3>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5 mb-4">
              {product.image && (
                <Image
                  src={product.image}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              )}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Image URL
              </label>
              <input
                type="text"
                value={product.image}
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.value })
                }
                placeholder="/images/saree-hero-1.png"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Craft Details */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-wider mb-4">
              Craft Details
            </h3>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Weave Time
              </label>
              <input
                type="text"
                value={product.weaveTime}
                onChange={(e) =>
                  setProduct({ ...product, weaveTime: e.target.value })
                }
                placeholder="45 Days"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Artisan Origin
              </label>
              <input
                type="text"
                value={product.artisanOrigin}
                onChange={(e) =>
                  setProduct({ ...product, artisanOrigin: e.target.value })
                }
                placeholder="Sonepur, Odisha"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Thread Count
              </label>
              <input
                type="text"
                value={product.threadCount}
                onChange={(e) =>
                  setProduct({ ...product, threadCount: e.target.value })
                }
                placeholder="120 TPI"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
