"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/products";
import { getProductByIdAsync } from "@/lib/admin-store";
import ProductDetailClient from "./ProductDetailClient";

/**
 * Client-side fallback for products not found on the server.
 * Tries to load the product from localStorage (admin-added products)
 * when Supabase is not configured and the product is not in the static array.
 */
export default function DynamicProductLoader({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductByIdAsync(productId)
      .then((found) => {
        if (found) {
          setProduct(found);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin mx-auto text-obsidian/30" size={32} />
          <p className="text-sm text-obsidian/40 tracking-wider uppercase">
            Loading product…
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
