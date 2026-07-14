"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product, products } from "@/lib/products";

const CART_STORAGE_KEY = "ambika_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

// Minimal shape stored in localStorage (no full product objects)
interface StoredCartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Persist only product IDs + quantities to localStorage */
function persistCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  const stored: StoredCartItem[] = items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
  }));
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Silently fail (private browsing, quota exceeded, etc.)
  }
}

/** Restore cart from localStorage, rehydrating full product data */
function restoreCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const stored: StoredCartItem[] = JSON.parse(raw);
    const restored: CartItem[] = [];
    for (const s of stored) {
      const product = products.find((p) => p.id === s.productId);
      if (product && s.quantity > 0) {
        restored.push({ product, quantity: s.quantity });
      }
    }
    return restored;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const restored = restoreCart();
    if (restored.length > 0) {
      setItems(restored);
    }
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      persistCart(items);
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
