"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Scissors, Truck, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderStatus {
  orderId: string;
  currentStep: number;
  steps: { title: string; desc: string; date: string; icon: React.ReactNode }[];
}

export default function TrackPage() {
  const [inputId, setInputId] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputId.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    // Simulated tracking
    setTimeout(() => {
      setIsSearching(false);
      if (inputId.toUpperCase().startsWith("AH-")) {
        setOrderStatus({
          orderId: inputId.toUpperCase(),
          currentStep: 1,
          steps: [
            { title: "Order Placed", desc: "Your order has been confirmed and payment verified.", date: "May 10, 2026 · 10:30 PM", icon: <Package size={18} /> },
            { title: "Weaving in Progress", desc: "Your masterpiece is being handwoven by a master artisan in Sonepur, Odisha.", date: "Estimated: May 25, 2026", icon: <Scissors size={18} /> },
            { title: "Dispatched Securely", desc: "Carefully packaged and dispatched with premium insured shipping.", date: "Estimated: June 15, 2026", icon: <Truck size={18} /> },
          ],
        });
      } else {
        setNotFound(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-obsidian/40 hover:text-obsidian transition-colors mb-6">
            <ArrowLeft size={14} />Back to Home
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">Track Your Order</h1>
          <p className="text-sm text-obsidian/50 mb-10">Enter your Order ID to see real-time status updates on your masterpiece.</p>
        </motion.div>

        {/* Search */}
        <motion.form onSubmit={handleTrack} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="relative">
            <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} placeholder="Enter Order ID (e.g. AH-XXXXX)" className="w-full px-6 py-4 pr-14 bg-warm-100 border border-warm-200 rounded-2xl text-base placeholder:text-obsidian/30 font-serif tracking-wide" />
            <button type="submit" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian text-cream rounded-xl flex items-center justify-center hover:bg-indigo-deep transition-colors" aria-label="Track order">
              {isSearching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Clock size={16} /></motion.div> : <Search size={16} />}
            </button>
          </div>
        </motion.form>

        {/* Not Found */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-10">
              <p className="font-serif text-xl text-obsidian/30 mb-2">Order not found</p>
              <p className="text-sm text-obsidian/30">Please check your Order ID and try again. Valid IDs start with &quot;AH-&quot;.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        <AnimatePresence>
          {orderStatus && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="bg-warm-100/50 border border-warm-200 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40">Order ID</p>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] tracking-[0.15em] uppercase font-medium rounded-full">Active</span>
                </div>
                <p className="font-serif text-xl tracking-wider">{orderStatus.orderId}</p>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-0">
                {orderStatus.steps.map((step, i) => {
                  const isComplete = i < orderStatus.currentStep;
                  const isCurrent = i === orderStatus.currentStep;
                  const isPending = i > orderStatus.currentStep;

                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.2 }} className="flex gap-4 md:gap-6">
                      {/* Timeline Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? "bg-emerald-100 text-emerald-600" : isCurrent ? "bg-indigo-deep text-cream" : "bg-warm-200 text-obsidian/30"}`}>
                          {isComplete ? <CheckCircle2 size={18} /> : step.icon}
                        </div>
                        {i < orderStatus.steps.length - 1 && (
                          <div className={`w-0.5 h-20 ${isComplete ? "bg-emerald-200" : "bg-warm-200"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-serif text-lg ${isPending ? "text-obsidian/30" : ""}`}>{step.title}</h3>
                          {isCurrent && <span className="w-2 h-2 bg-indigo-deep rounded-full animate-pulse-soft" />}
                        </div>
                        <p className={`text-sm mb-1 ${isPending ? "text-obsidian/20" : "text-obsidian/50"}`}>{step.desc}</p>
                        <p className={`text-xs ${isPending ? "text-obsidian/15" : "text-obsidian/30"}`}>{step.date}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help */}
        {!orderStatus && !notFound && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-16">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={24} className="text-obsidian/20" />
            </div>
            <p className="font-serif text-xl text-obsidian/20 mb-2">Enter your Order ID above</p>
            <p className="text-sm text-obsidian/20">Your Order ID was provided at checkout</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
