"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronDown, ChevronUp, Package } from "lucide-react";
import { getOrders, updateOrderStatus, Order } from "@/lib/admin-store";

const statusFlow: Order["status"][] = [
  "confirmed",
  "weaving",
  "dispatched",
  "delivered",
];

const statusStyles: Record<string, string> = {
  confirmed: "bg-blue-500/10 text-blue-400",
  weaving: "bg-amber-500/10 text-amber-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setOrders(getOrders().reverse());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrders().reverse());
  };

  if (!isClient) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-white text-2xl font-medium tracking-tight">
          Orders
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {orders.length} total orders
        </p>
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
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden"
            >
              {/* Order Row */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Package size={16} className="text-white/30" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white/80 font-mono">
                      {order.id}
                    </p>
                    <p className="text-xs text-white/30">
                      {order.customer.fullName} •{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/50 hidden sm:block">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                  {expandedId === order.id ? (
                    <ChevronUp size={16} className="text-white/20" />
                  ) : (
                    <ChevronDown size={16} className="text-white/20" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Details */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
                            Customer
                          </h4>
                          <div className="space-y-1.5 text-sm">
                            <p className="text-white/60">
                              {order.customer.fullName}
                            </p>
                            <p className="text-white/40">
                              {order.customer.email}
                            </p>
                            <p className="text-white/40">
                              {order.customer.phone}
                            </p>
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
                            Delivery Address
                          </h4>
                          <p className="text-sm text-white/40">
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
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-white/50 truncate pr-2">
                                  {item.productName.split("—")[0].trim()} ×
                                  {item.quantity}
                                </span>
                                <span className="text-white/60 flex-shrink-0">
                                  ₹
                                  {(item.price * item.quantity).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                              <span className="text-white/40 font-medium">
                                Total
                              </span>
                              <span className="text-white/80 font-medium">
                                ₹{order.totalPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gift Message */}
                      {order.isGift && order.giftMessage && (
                        <div className="mt-4 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                            🎁 Gift Message
                          </p>
                          <p className="text-sm text-white/50 italic">
                            &quot;{order.giftMessage}&quot;
                          </p>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="mt-4 flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-white/30">
                          Update Status:
                        </span>
                        {statusFlow.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(order.id, status)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
                              order.status === status
                                ? statusStyles[status] + " font-medium"
                                : "bg-white/5 text-white/30 hover:text-white/50 hover:bg-white/10"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
