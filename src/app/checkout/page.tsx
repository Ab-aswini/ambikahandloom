"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shield, Lock, ArrowLeft, CheckCircle2, Copy, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", giftMessage: "",
  });

  const generateOrderId = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AH-${ts}-${r}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(generateOrderId());
    setIsSubmitted(true);
    clearCart();
    showToast("Order placed successfully!");
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    showToast("Order ID copied", "info");
  };

  if (items.length === 0 && !isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="font-serif text-3xl text-obsidian/30 mb-4">Your bag is empty</p>
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm tracking-[0.12em] uppercase text-indigo-deep hover:text-obsidian transition-colors">
            <ArrowLeft size={14} />Browse Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </motion.div>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">Order Confirmed</h1>
          <p className="text-sm text-obsidian/50 mb-8">Your masterpiece is being prepared with care.</p>
          <div className="bg-warm-100 rounded-xl p-6 mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/40 mb-2">Your Order ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-serif text-2xl tracking-wider">{orderId}</span>
              <button onClick={copyOrderId} className="p-2 hover:bg-warm-200 rounded-lg" aria-label="Copy order ID"><Copy size={16} className="text-obsidian/40" /></button>
            </div>
          </div>
          <div className="bg-indigo-deep/5 border border-indigo-deep/10 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Lock size={14} className="text-indigo-deep" />Secure Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-obsidian/50">UPI</span><span className="font-medium">ambika@upi</span></div>
              <div className="flex justify-between"><span className="text-obsidian/50">Bank</span><span className="font-medium">State Bank of India</span></div>
              <div className="flex justify-between"><span className="text-obsidian/50">A/C No.</span><span className="font-medium">XXXX XXXX 4521</span></div>
              <div className="flex justify-between"><span className="text-obsidian/50">IFSC</span><span className="font-medium">SBIN0012345</span></div>
            </div>
            <p className="text-[10px] text-obsidian/30 mt-4">Mention your Order ID in the payment reference.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/track" className="magnetic-btn inline-flex items-center justify-center gap-2 bg-obsidian text-cream px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500">Track Your Order</Link>
            <Link href="/" className="magnetic-btn inline-flex items-center justify-center gap-2 border border-obsidian/20 px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium hover:bg-obsidian hover:text-cream transition-all duration-500">Continue Browsing</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-obsidian/40 hover:text-obsidian transition-colors mb-6"><ArrowLeft size={14} />Back to Collection</Link>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight">Secure Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-200/30 rounded-xl">
                <Shield size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700">End-to-End Encrypted | Zero Financial Data Stored</p>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-4">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Full Name" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" /></div>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" />
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" />
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-4">Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full Address" rows={3} className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30 resize-none" /></div>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" />
                  <input type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" />
                  <input type="text" required value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="PIN Code" className="w-full px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30" />
                </div>
              </div>

              <div>
                <button type="button" onClick={() => setIsGift(!isGift)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full text-left transition-all ${isGift ? "border-crimson-muted/30 bg-crimson-muted/5" : "border-warm-200"}`}>
                  <Gift size={16} className={isGift ? "text-crimson-muted" : "text-obsidian/30"} />
                  <span className="text-sm">This is a Mother&apos;s Day gift</span>
                </button>
                <AnimatePresence>
                  {isGift && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <textarea value={formData.giftMessage} onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })} placeholder="Write a heartfelt message for your mother..." rows={3} className="w-full mt-3 px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30 resize-none" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full bg-obsidian text-cream py-4 px-6 text-sm tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 flex items-center justify-center gap-3">
                <Lock size={14} />Place Secure Order
              </motion.button>
              <p className="text-center text-[10px] text-obsidian/30">Payment instructions will be displayed after order confirmation.</p>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="sticky top-32 bg-warm-100/50 border border-warm-200 rounded-2xl p-6">
              <h3 className="text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-warm-200">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div><p className="font-serif text-sm leading-tight">{item.product.name.split("—")[0].trim()}</p><p className="text-[10px] text-obsidian/40 mt-0.5">Qty: {item.quantity}</p></div>
                      <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-warm-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-obsidian/50">Subtotal</span><span>₹{totalPrice.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-sm"><span className="text-obsidian/50">Shipping</span><span className="text-emerald-600">Complimentary</span></div>
                <div className="flex justify-between pt-3 border-t border-warm-200"><span className="text-sm font-medium">Total</span><span className="font-serif text-xl">₹{totalPrice.toLocaleString("en-IN")}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
