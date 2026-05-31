"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronDown, ChevronUp, Package, MessageCircle, AlertCircle, Save, Check } from "lucide-react";
import { getOrders, updateOrderStatus, Order, OrderItem } from "@/lib/admin-store";

const statusFlow: Order["status"][] = [
  "awaiting_verification",
  "confirmed",
  "weaving",
  "dispatched",
  "delivered",
];

const statusStyles: Record<string, string> = {
  awaiting_verification: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  confirmed: "bg-blue-500/10 text-blue-400 border border-blue-500/10",
  weaving: "bg-amber-500/10 text-amber-400 border border-amber-500/10",
  dispatched: "bg-purple-500/10 text-purple-400 border border-purple-500/10",
  delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    setOrders(getOrders().reverse());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"], currentNote?: string) => {
    updateOrderStatus(orderId, newStatus, currentNote);
    setOrders(getOrders().reverse());
  };

  const handleNoteSave = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status, noteInput[orderId] || "");
    setOrders(getOrders().reverse());
  };

  const openWhatsApp = (phone: string, orderId: string, status: Order["status"]) => {
    let msg = `Namaste! We are contacting you regarding Ambika Handloom Order *${orderId}*. `;
    if (status === "awaiting_verification") msg += "Could you please share your payment screenshot so we can confirm it?";
    if (status === "confirmed") msg += "Your payment is verified and your order is confirmed!";
    if (status === "dispatched") msg += "Great news! Your beautiful saree has been dispatched.";
    
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isClient) return null;

  const pendingVerification = orders.filter(o => o.status === "awaiting_verification");
  const otherOrders = orders.filter(o => o.status !== "awaiting_verification");

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <div>
          <h1 className="text-white text-2xl font-medium tracking-tight">
            Orders
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>
        {pendingVerification.length > 0 && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-lg text-sm font-medium">
            <AlertCircle size={16} />
            {pendingVerification.length} needs verification
          </div>
        )}
      </motion.div>

      {orders.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-16 text-center">
          <ShoppingCart size={32} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm mb-1">No orders yet</p>
          <p className="text-white/15 text-xs">
            Orders will appear here when customers complete checkout
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Action Required Section */}
          {pendingVerification.length > 0 && (
            <div>
              <h2 className="text-xs tracking-[0.15em] uppercase text-rose-400/80 mb-3 flex items-center gap-2">
                <AlertCircle size={14} /> Action Required: Verify Payments
              </h2>
              <div className="space-y-3">
                {pendingVerification.map((order, i) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    i={i} 
                    expandedId={expandedId} 
                    setExpandedId={setExpandedId}
                    handleStatusChange={handleStatusChange}
                    handleNoteSave={handleNoteSave}
                    openWhatsApp={openWhatsApp}
                    noteInput={noteInput}
                    setNoteInput={setNoteInput}
                    highlight={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Other Orders */}
          {otherOrders.length > 0 && (
            <div>
              <h2 className="text-xs tracking-[0.15em] uppercase text-white/30 mb-3">
                Other Orders
              </h2>
              <div className="space-y-3">
                {otherOrders.map((order, i) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    i={i} 
                    expandedId={expandedId} 
                    setExpandedId={setExpandedId}
                    handleStatusChange={handleStatusChange}
                    handleNoteSave={handleNoteSave}
                    openWhatsApp={openWhatsApp}
                    noteInput={noteInput}
                    setNoteInput={setNoteInput}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  i: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  handleStatusChange: (orderId: string, newStatus: Order["status"], currentNote?: string) => void;
  handleNoteSave: (orderId: string, status: Order["status"]) => void;
  openWhatsApp: (phone: string, orderId: string, status: Order["status"]) => void;
  noteInput: Record<string, string>;
  setNoteInput: (noteInput: Record<string, string>) => void;
  highlight?: boolean;
}

// Order Card Component
function OrderCard({ 
  order, i, expandedId, setExpandedId, handleStatusChange, handleNoteSave, openWhatsApp, noteInput, setNoteInput, highlight = false
}: OrderCardProps) {
  const isExpanded = expandedId === order.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className={`bg-white/[0.03] border rounded-xl overflow-hidden ${highlight ? 'border-rose-500/30' : 'border-white/5'}`}
    >
      {/* Order Row */}
      <button
        onClick={() => {
          setExpandedId(isExpanded ? null : order.id);
          if (!noteInput[order.id]) setNoteInput({ ...noteInput, [order.id]: order.adminNote || "" });
        }}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${highlight ? 'hover:bg-rose-500/5' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-rose-500/10' : 'bg-white/5'}`}>
            <Package size={16} className={highlight ? 'text-rose-400' : 'text-white/30'} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm text-white/80 font-mono">
                {order.id}
              </p>
              {order.paymentType === "advance" && (
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] rounded-sm uppercase tracking-wider">Adv. Booked</span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">
              {order.customer.fullName} •{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {order.paymentUtr && (
            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/50 hidden md:block">
              UTR: {order.paymentUtr}
            </span>
          )}
          <span className="text-sm text-white/50 hidden sm:block">
            ₹{order.totalPrice.toLocaleString("en-IN")}
          </span>
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${statusStyles[order.status]}`}
          >
            {order.status.replace("_", " ")}
          </span>
          {isExpanded ? (
            <ChevronUp size={16} className="text-white/20" />
          ) : (
            <ChevronDown size={16} className="text-white/20" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              
              {/* Payment Verification Highlight */}
              {order.status === "awaiting_verification" && (
                <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-rose-400 mb-1 flex items-center gap-2"><AlertCircle size={14}/> Payment Verification</h3>
                    <p className="text-xs text-rose-400/60">Check your bank app for this exact amount and transaction ID.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-rose-400/50 mb-0.5">Amount to verify</p>
                      <p className="font-serif text-lg text-rose-300">₹{(order.paymentType === "advance" ? Math.round(order.totalPrice*0.2) : order.totalPrice).toLocaleString("en-IN")}</p>
                    </div>
                    {order.paymentUtr && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-rose-400/50 mb-0.5">Customer UTR</p>
                        <p className="font-mono text-base text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded">{order.paymentUtr}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Customer Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/30">Customer</h4>
                    <button 
                      onClick={() => openWhatsApp(order.customer.phone, order.id, order.status)}
                      className="flex items-center gap-1.5 text-[10px] bg-[#25D366]/20 text-[#25D366] px-2 py-1 rounded hover:bg-[#25D366]/30 transition-colors"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-white/80 font-medium">{order.customer.fullName}</p>
                    <p className="text-white/40">{order.customer.email}</p>
                    <p className="text-white/40">{order.customer.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
                    Delivery Address
                  </h4>
                  <p className="text-sm text-white/60">
                    {order.customer.address}
                    <br />
                    {order.customer.city}, {order.customer.state}
                    <br />
                    {order.customer.pincode}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-white/50 truncate pr-2">
                          {item.productName.split("—")[0].trim()} ×{item.quantity}
                        </span>
                        <span className="text-white/60 flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                      <span className="text-white/40 font-medium">Total Value</span>
                      <span className="text-white/80 font-medium">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Message */}
              {order.isGift && order.giftMessage && (
                <div className="mb-6 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">🎁 Gift Message</p>
                  <p className="text-sm text-white/60 italic">&quot;{order.giftMessage}&quot;</p>
                </div>
              )}

              {/* Status & Admin Note Management */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Update Order Status</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {statusFlow.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status, noteInput[order.id])}
                        className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all border ${
                          order.status === status
                            ? statusStyles[status] + " font-bold"
                            : "bg-white/5 border-transparent text-white/30 hover:text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {status === "awaiting_verification" ? "Pending Ver." : status}
                        {order.status === status && <Check size={12} className="inline ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Note for Customer (Visible on Tracking Page)</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={noteInput[order.id] !== undefined ? noteInput[order.id] : (order.adminNote || "")}
                      onChange={(e) => setNoteInput({...noteInput, [order.id]: e.target.value})}
                      placeholder="e.g., Your saree is off the loom and being packed!"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/30"
                    />
                    <button 
                      onClick={() => handleNoteSave(order.id, order.status)}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <Save size={14} /> Save
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
