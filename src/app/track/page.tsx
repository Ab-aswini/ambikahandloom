"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Scissors, Truck, CheckCircle2, Clock, ArrowLeft, Shield, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/lib/admin-store";

interface OrderStatus {
  orderId: string;
  currentStep: number;
  adminNote?: string;
  steps: { title: string; desc: string; date: string; icon: React.ReactNode }[];
}

const statusToStep: Record<string, number> = {
  awaiting_verification: 0,
  confirmed: 1,
  weaving: 2,
  dispatched: 3,
  delivered: 4,
};

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

    setTimeout(() => {
      setIsSearching(false);

      const realOrder = getOrderById(inputId.toUpperCase());
      if (realOrder) {
        const step = statusToStep[realOrder.status] ?? 0;
        const orderDate = new Date(realOrder.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
        setOrderStatus({
          orderId: realOrder.id,
          currentStep: step,
          adminNote: realOrder.adminNote,
          steps: [
            { title: "Verification Pending", desc: "Your payment reference is under manual review.", date: orderDate, icon: <Shield size={18} /> },
            { title: "Order Confirmed", desc: `Payment verified. Order placed by ${realOrder.customer.fullName}.`, date: step >= 1 ? orderDate : "Pending", icon: <Package size={18} /> },
            { title: "Weaving / Processing", desc: "Your masterpiece is being prepared.", date: step >= 2 ? "In progress" : "Pending", icon: <Scissors size={18} /> },
            { title: "Dispatched Securely", desc: "Carefully packaged and dispatched with premium insured shipping.", date: step >= 3 ? "In transit" : "Pending", icon: <Truck size={18} /> },
          ],
        });
      } else {
        setNotFound(true);
      }
    }, 1200);
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
            <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} placeholder="Enter Order ID (e.g. AH-XXXXX)" className="w-full px-6 py-4 pr-14 bg-warm-100 border border-warm-200 rounded-2xl text-base placeholder:text-obsidian/30 font-serif tracking-wide focus:outline-none focus:border-obsidian/30 transition-colors" />
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
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] tracking-[0.15em] uppercase font-medium rounded-full border border-emerald-200">Active</span>
                </div>
                <p className="font-serif text-xl tracking-wider">{orderStatus.orderId}</p>
                
                {orderStatus.adminNote && (
                  <div className="mt-4 p-4 bg-white/60 rounded-xl border border-obsidian/5 flex items-start gap-3">
                    <MessageSquare size={16} className="text-obsidian/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-obsidian/40 mb-1">Update from Store</p>
                      <p className="text-sm text-obsidian/80 italic">&quot;{orderStatus.adminNote}&quot;</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Steps */}
              <div className="space-y-0 relative z-10">
                {orderStatus.steps.map((step, i) => {
                  const isComplete = i < orderStatus.currentStep;
                  const isCurrent = i === orderStatus.currentStep;
                  const isPending = i > orderStatus.currentStep;

                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.1 }} className="flex gap-4 md:gap-6 relative">
                      {/* Timeline Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isComplete ? "bg-emerald-100 text-emerald-600 shadow-sm" : isCurrent ? "bg-indigo-deep text-cream shadow-md" : "bg-warm-200 text-obsidian/30"}`}>
                          {isComplete ? <CheckCircle2 size={18} /> : step.icon}
                        </div>
                        {i < orderStatus.steps.length - 1 && (
                          <div className={`absolute top-10 bottom-0 w-0.5 -ml-px left-5 ${isComplete ? "bg-emerald-200" : "bg-warm-200"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-12 ${i === orderStatus.steps.length - 1 ? "pb-0" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-serif text-lg ${isPending ? "text-obsidian/30" : ""}`}>{step.title}</h3>
                          {isCurrent && <span className="w-2 h-2 bg-indigo-deep rounded-full animate-pulse-soft" />}
                        </div>
                        <p className={`text-sm mb-1 ${isPending ? "text-obsidian/20" : "text-obsidian/60"}`}>{step.desc}</p>
                        <p className={`text-xs ${isPending ? "text-obsidian/15" : "text-obsidian/30 font-medium"}`}>{step.date}</p>
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
