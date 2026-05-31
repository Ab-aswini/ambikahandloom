"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Shield, Lock, ArrowLeft, CheckCircle2, Gift, Send, FileText, Smartphone } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { saveOrder, getSettings, updateOrderUtr, SiteSettings, buildOrderWhatsAppUrl, Order } from "@/lib/admin-store";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "advance">("full");
  const [utr, setUtr] = useState("");
  const [isUtrSubmitted, setIsUtrSubmitted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Snapshot the order totals before clearing the cart
  const [savedTotalPrice, setSavedTotalPrice] = useState(0);
  const [savedPayableAmount, setSavedPayableAmount] = useState(0);
  const [savedPaymentType, setSavedPaymentType] = useState<"full" | "advance">("full");
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", giftMessage: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(getSettings());
  }, []);

  const advanceAmount = Math.round(totalPrice * 0.2);
  const payableAmount = paymentType === "full" ? totalPrice : advanceAmount;

  const generateOrderId = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AH-${ts}-${r}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    // Build the full order object
    const newOrder: Order = {
      id: newOrderId,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      })),
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      isGift,
      giftMessage: formData.giftMessage,
      totalPrice,
      paymentType,
      status: "awaiting_verification",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order (syncs to Supabase + localStorage fallback)
    saveOrder(newOrder);

    // Snapshot totals BEFORE clearing the cart (fixes ₹0 display bug)
    setSavedTotalPrice(totalPrice);
    setSavedPayableAmount(payableAmount);
    setSavedPaymentType(paymentType);

    setIsSubmitted(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-open WhatsApp with full order details pre-filled
    setTimeout(() => {
      const waUrl = buildOrderWhatsAppUrl(newOrder, settings ?? undefined);
      window.open(waUrl, '_blank');
    }, 800);
  };

  const handleUtrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) return;
    updateOrderUtr(orderId, utr);
    setIsUtrSubmitted(true);
    showToast("Payment details submitted for verification!");
  };


  const openWhatsApp = () => {
    const phone = (settings?.contactWhatsapp || settings?.contactPhone || "+918658476300").replace(/\D/g, '');
    const msg = `Namaste Ambika Handloom 🙏\n\nI have made the payment for my Order *${orderId}*.\nPlease find the payment screenshot attached.\n\nThank you!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
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

  // PAYMENT VERIFICATION PORTAL
  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-28 md:pt-36 pb-20 bg-[#FDFBF7]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10 print:hidden">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </motion.div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-3">Order Reserved Successfully</h1>
            <p className="text-sm text-obsidian/60 max-w-md mx-auto leading-relaxed">
              To avoid high payment gateway fees and offer you the best price, we verify payments manually. Your money is completely secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:block print:w-full">
            {/* Left Col - Order Summary for Print & Review */}
            <div className="bg-white border border-obsidian/5 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-serif text-xl mb-1">Order Summary</h2>
                  <p className="text-xs tracking-[0.15em] uppercase text-obsidian/40">ID: {orderId}</p>
                </div>
                <button onClick={() => window.print()} className="p-2 bg-warm-100 hover:bg-warm-200 rounded-lg transition-colors print:hidden" aria-label="Print Invoice">
                  <FileText size={18} className="text-obsidian/70" />
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="text-sm border-b border-obsidian/5 pb-4">
                  <p className="text-obsidian/50 mb-1">Billed To:</p>
                  <p className="font-medium">{formData.fullName}</p>
                  <p className="text-obsidian/70">{formData.phone}</p>
                  <p className="text-obsidian/70">{formData.email}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm"><span className="text-obsidian/60">Total Value</span><span>₹{savedTotalPrice.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-sm"><span className="text-obsidian/60">Payment Mode</span><span>{savedPaymentType === "full" ? "Full Payment" : "20% Advance Booking"}</span></div>
                <div className="flex justify-between pt-4 border-t border-obsidian/5"><span className="font-medium">Amount to Pay</span><span className="font-serif text-xl">₹{savedPayableAmount.toLocaleString("en-IN")}</span></div>
                {savedPaymentType === "advance" && (
                  <p className="text-xs text-obsidian/40 text-right mt-1">Remaining ₹{(savedTotalPrice - Math.round(savedTotalPrice * 0.2)).toLocaleString("en-IN")} due before dispatch.</p>
                )}
              </div>
            </div>

            {/* Right Col - Payment Actions */}
            <div className="space-y-6 print:hidden">
              {!isUtrSubmitted ? (
                <>
                  <div className="bg-indigo-deep text-cream rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={120} /></div>
                    <h3 className="text-lg font-medium mb-6 relative z-10">Make Payment via UPI/Bank</h3>
                    
                    <div className="space-y-4 mb-8 relative z-10">
                      <div>
                        <p className="text-xs text-cream/60 uppercase tracking-wider mb-1">UPI ID</p>
                        <div className="flex items-center gap-3">
                          <p className="font-mono text-xl">{settings?.paymentUpi || "ambika@upi"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-cream/20 pt-4 mt-4">
                        <div><p className="text-[10px] text-cream/50 uppercase">Bank Name</p><p className="text-sm">{settings?.paymentBank}</p></div>
                        <div><p className="text-[10px] text-cream/50 uppercase">IFSC Code</p><p className="text-sm">{settings?.paymentIfsc}</p></div>
                        <div className="col-span-2"><p className="text-[10px] text-cream/50 uppercase">A/C Number</p><p className="text-sm">{settings?.paymentAccountNo}</p></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-obsidian/5 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Smartphone size={16} className="text-emerald-600"/>Verify Payment</h3>
                    
                    <button onClick={openWhatsApp} className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors mb-6 shadow-sm">
                      <Send size={18} /> Send Screenshot on WhatsApp
                    </button>

                    <div className="relative flex items-center py-2 mb-6">
                      <div className="flex-grow border-t border-obsidian/10"></div>
                      <span className="flex-shrink-0 mx-4 text-xs text-obsidian/30 uppercase tracking-wider">or verify here</span>
                      <div className="flex-grow border-t border-obsidian/10"></div>
                    </div>

                    <form onSubmit={handleUtrSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs text-obsidian/60 mb-2">Enter 12-digit UPI Reference No. (UTR)</label>
                        <input type="text" required value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 312345678901" className="w-full px-4 py-3 bg-warm-50 border border-obsidian/10 rounded-xl text-sm focus:outline-none focus:border-obsidian/30 transition-colors" />
                      </div>
                      <button type="submit" className="w-full bg-obsidian text-cream py-3 rounded-xl text-sm font-medium hover:bg-obsidian/90 transition-colors">
                        Submit for Verification
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Shield className="text-emerald-500" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-emerald-900 mb-2">Verification Pending</h3>
                  <p className="text-sm text-emerald-700/70 mb-8">
                    Thank you! We have received your payment reference. It usually takes 1-2 hours to verify and confirm your order.
                  </p>
                  <Link href="/track" className="magnetic-btn inline-flex items-center justify-center gap-2 bg-obsidian text-cream px-6 py-3 text-xs tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 rounded-xl w-full">
                    Track Order Status
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // CHECKOUT FORM
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
                <p className="text-xs text-emerald-700">Zero Financial Data Stored • Verified Artisanal Products</p>
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
                <h3 className="text-xs tracking-[0.2em] uppercase text-obsidian/40 mb-4">Payment Option</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setPaymentType("full")} className={`text-left p-4 rounded-xl border-2 transition-all ${paymentType === "full" ? "border-obsidian bg-obsidian/5" : "border-warm-200 bg-white hover:border-obsidian/30"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Full Payment</span>
                      {paymentType === "full" && <CheckCircle2 size={16} className="text-obsidian" />}
                    </div>
                    <p className="text-xs text-obsidian/60 mb-2">Pay the complete amount via UPI or Bank Transfer.</p>
                    <p className="font-serif text-lg">₹{totalPrice.toLocaleString("en-IN")}</p>
                  </button>

                  <button type="button" onClick={() => setPaymentType("advance")} className={`text-left p-4 rounded-xl border-2 transition-all ${paymentType === "advance" ? "border-emerald-600 bg-emerald-50" : "border-warm-200 bg-white hover:border-obsidian/30"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-emerald-800">20% Advance Booking</span>
                      {paymentType === "advance" && <CheckCircle2 size={16} className="text-emerald-600" />}
                    </div>
                    <p className="text-xs text-emerald-700/70 mb-2">Reserve your masterpiece. Pay the rest before dispatch.</p>
                    <p className="font-serif text-lg text-emerald-800">₹{advanceAmount.toLocaleString("en-IN")}</p>
                  </button>
                </div>
              </div>

              <div>
                <button type="button" onClick={() => setIsGift(!isGift)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full text-left transition-all ${isGift ? "border-crimson-muted/30 bg-crimson-muted/5" : "border-warm-200 bg-white"}`}>
                  <Gift size={16} className={isGift ? "text-crimson-muted" : "text-obsidian/30"} />
                  <span className="text-sm">This is a Gift</span>
                </button>
                <AnimatePresence>
                  {isGift && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <textarea value={formData.giftMessage} onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })} placeholder="Write a heartfelt message..." rows={3} className="w-full mt-3 px-4 py-3.5 bg-warm-100 border border-warm-200 rounded-xl text-sm placeholder:text-obsidian/30 resize-none" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full bg-obsidian text-cream py-4 px-6 text-sm tracking-[0.12em] uppercase font-medium hover:bg-indigo-deep transition-colors duration-500 flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-obsidian/10">
                <Lock size={14} />Proceed to Payment
              </motion.button>
              <p className="text-center text-[10px] text-obsidian/40 uppercase tracking-wider">Step 1 of 2 — No payment required yet</p>
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
                <div className="flex justify-between text-sm"><span className="text-obsidian/50">Shipping</span><span className="text-emerald-600 font-medium">Complimentary</span></div>
                <div className="flex justify-between pt-3 border-t border-warm-200"><span className="text-sm font-medium">Total Value</span><span className="font-serif text-xl">₹{totalPrice.toLocaleString("en-IN")}</span></div>
                
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center text-emerald-800">
                  <span className="text-xs font-medium uppercase tracking-wider">Amount Due Today</span>
                  <span className="font-serif text-lg">₹{payableAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
