"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-obsidian/30 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-warm-200">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">
                  Your Bag
                </h2>
                <p className="text-sm text-obsidian/50 mt-1">
                  {totalItems} {totalItems === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-warm-100 rounded-full transition-colors duration-300"
                aria-label="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-serif text-xl text-obsidian/40 mb-2">
                    Your bag is empty
                  </p>
                  <p className="text-sm text-obsidian/30 mb-6">
                    Discover our exquisite collection
                  </p>
                  <Link
                    href="/catalog"
                    onClick={() => setIsCartOpen(false)}
                    className="text-sm tracking-[0.12em] uppercase text-indigo-deep hover:text-crimson-muted transition-colors duration-300 line-reveal"
                  >
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4"
                    >
                      <div className="w-24 h-32 relative rounded-lg overflow-hidden flex-shrink-0 bg-warm-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-serif text-base leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-obsidian/40 mt-1 tracking-[0.12em] uppercase">
                            {item.product.categoryLabel}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 border border-warm-300 rounded-full flex items-center justify-center hover:border-obsidian transition-colors duration-300"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 border border-warm-300 rounded-full flex items-center justify-center hover:border-obsidian transition-colors duration-300"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-obsidian/30 hover:text-crimson-muted transition-colors duration-300"
                              aria-label="Remove item"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-warm-200 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-[0.12em] uppercase text-obsidian/50">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-obsidian/40">
                  Shipping & verification calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center gap-3 w-full bg-obsidian text-cream py-4 px-6 text-sm tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 magnetic-btn"
                >
                  Secure Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
