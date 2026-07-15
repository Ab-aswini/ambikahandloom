"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react";
import { Product } from "@/lib/products";
import { getProductsAsync, deleteProductAsync } from "@/lib/admin-store";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    getProductsAsync()
      .then((fetched) => setProducts(fetched))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProductAsync(id);
      const updated = await getProductsAsync();
      setProducts(updated);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  if (!isClient) return null;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-white/30" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-white text-2xl font-medium tracking-tight">
            Products
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {products.length} masterpieces in collection
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </motion.div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-16 text-center">
          <Package size={32} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm mb-2">No products yet</p>
          <Link
            href="/admin/products/new"
            className="text-xs text-white/50 hover:text-white transition-colors underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                  Product
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                  Price
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-right text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-white/80 font-medium leading-tight">
                          {product.name.split("—")[0].trim()}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5 font-mono">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-white/40">
                      {product.categoryLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="text-sm text-white/70">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-white/20 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                        product.inStock
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Pencil size={14} />
                      </Link>
                      {deleteId === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          aria-label="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
