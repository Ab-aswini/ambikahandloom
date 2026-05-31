"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, CheckCircle2, Scissors, Truck, Shield,
  MessageSquare, Send, ExternalLink, Phone, MapPin, IndianRupee,
  Clock, ChevronDown,
} from "lucide-react";
import {
  getOrderByIdAsync, updateOrderStatusAsync,
  buildTrackingWhatsAppUrl, Order,
} from "@/lib/admin-store";
import { isAdminAuthenticated } from "@/lib/admin-store";

const STATUS_STEPS: { key: Order["status"]; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "awaiting_verification", label: "Awaiting Verification", icon: <Shield size={16} />, color: "text-amber-400 bg-amber-500/10" },
  { key: "confirmed", label: "Confirmed", icon: <CheckCircle2 size={16} />, color: "text-blue-400 bg-blue-500/10" },
  { key: "weaving", label: "Weaving / Processing", icon: <Scissors size={16} />, color: "text-purple-400 bg-purple-500/10" },
  { key: "dispatched", label: "Dispatched", icon: <Truck size={16} />, color: "text-indigo-400 bg-indigo-500/10" },
  { key: "delivered", label: "Delivered", icon: <Package size={16} />, color: "text-emerald-400 bg-emerald-500/10" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNote, setTrackingNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>("awaiting_verification");

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin");
      return;
    }
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    const o = await getOrderByIdAsync(orderId);
    if (o) {
      setOrder(o);
      setSelectedStatus(o.status);
      setTrackingNote(o.trackingNote || o.adminNote || "");
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!order) return;
    setIsSaving(true);
    await updateOrderStatusAsync(order.id, selectedStatus, trackingNote, trackingNote);
    setSavedMsg("✓ Saved successfully");
    setOrder({ ...order, status: selectedStatus, trackingNote, adminNote: trackingNote });
    setTimeout(() => setSavedMsg(""), 3000);
    setIsSaving(false);
  };

  const handleWhatsAppNotify = async () => {
    if (!order || !trackingNote.trim()) return;
    // Save first, then open WhatsApp
    await updateOrderStatusAsync(order.id, selectedStatus, trackingNote, trackingNote);
    const url = buildTrackingWhatsAppUrl(order, trackingNote);
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">Order not found</p>
        <Link href="/admin/orders" className="text-white/30 text-sm mt-2 hover:text-white/60 transition-colors">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-white text-lg font-medium font-mono">{order.id}</h1>
          <p className="text-white/40 text-xs">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Timeline */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <h2 className="text-white/60 text-xs uppercase tracking-wider mb-4">Order Timeline</h2>
            <div className="flex items-center gap-1 flex-wrap">
              {STATUS_STEPS.map((step, i) => {
                const isComplete = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-1">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isCurrent ? step.color : isComplete ? "text-emerald-400 bg-emerald-500/10" : "text-white/20 bg-white/5"
                    }`}>
                      {isComplete ? <CheckCircle2 size={12} /> : step.icon}
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-4 h-0.5 ${isComplete ? "bg-emerald-500/40" : "bg-white/10"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔑 KEY: Update Status + Tracking Note */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white text-sm font-medium flex items-center gap-2">
              <MessageSquare size={16} className="text-white/40" />
              Update Order Status
            </h2>

            {/* Status Selector */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Order["status"])}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
              >
                {STATUS_STEPS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-[#1a1a2e] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>

            {/* Tracking Note */}
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">
                Message to Customer (shown on tracking page)
              </label>
              <textarea
                value={trackingNote}
                onChange={(e) => setTrackingNote(e.target.value)}
                placeholder="e.g. Your saree was dispatched today via DTDC courier. Tracking number: 123456789. Estimated delivery: 3-4 days."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {savedMsg || "Save Update"}
              </button>
              <button
                onClick={handleWhatsAppNotify}
                disabled={!trackingNote.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Save & Notify on WhatsApp
              </button>
            </div>
            <p className="text-white/20 text-xs">
              &ldquo;Notify on WhatsApp&rdquo; saves the update and opens a pre-filled WhatsApp message to the customer.
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <h2 className="text-white/60 text-xs uppercase tracking-wider mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-b-0">
                  <div>
                    <p className="text-white text-sm font-medium">{item.productName}</p>
                    <p className="text-white/30 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white/60 text-sm font-mono">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
              <span className="text-white/40 text-sm flex items-center gap-1.5">
                <IndianRupee size={14} /> Total
              </span>
              <span className="text-white font-medium text-lg font-mono">
                ₹{order.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Customer Info */}
        <div className="space-y-4">
          {/* Customer Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white/60 text-xs uppercase tracking-wider">Customer</h2>
            <div className="space-y-3">
              <div>
                <p className="text-white font-medium">{order.customer.fullName}</p>
              </div>
              <a
                href={`tel:${order.customer.phone}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone size={14} />
                {order.customer.phone}
              </a>
              <a
                href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(order.customer.fullName)}%2C%20regarding%20your%20order%20${order.id}%20from%20Ambika%20Handloom.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#25D366] hover:text-[#20bd5a] transition-colors"
              >
                <ExternalLink size={14} />
                Chat on WhatsApp
              </a>
              <div className="flex items-start gap-2 text-sm text-white/40 pt-2 border-t border-white/5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  {order.customer.address},<br />
                  {order.customer.city}, {order.customer.state} — {order.customer.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
            <h2 className="text-white/60 text-xs uppercase tracking-wider">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Type</span>
                <span className="text-white capitalize">{order.paymentType === "full" ? "Full Payment" : "20% Advance"}</span>
              </div>
              {order.paymentUtr && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">UTR Ref</span>
                  <span className="text-white/70 font-mono text-xs">{order.paymentUtr}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                <span className="text-white/40 flex items-center gap-1"><IndianRupee size={12} /> Amount</span>
                <span className="text-white font-medium">₹{order.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Gift */}
          {order.isGift && (
            <div className="bg-crimson-muted/10 border border-crimson-muted/20 rounded-xl p-5">
              <p className="text-crimson-muted text-xs uppercase tracking-wider mb-2">🎁 Gift Order</p>
              {order.giftMessage && (
                <p className="text-white/60 text-sm italic">&ldquo;{order.giftMessage}&rdquo;</p>
              )}
            </div>
          )}

          {/* Track Link */}
          <a
            href={`/track?id=${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors py-2"
          >
            <Clock size={14} />
            View Customer Tracking Page
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
