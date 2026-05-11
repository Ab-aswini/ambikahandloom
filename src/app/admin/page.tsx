"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { getStats, getOrders, Order } from "@/lib/admin-store";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setStats(getStats());
    setRecentOrders(getOrders().slice(-5).reverse());
  }, []);

  if (!isClient) return null;

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500/10 text-blue-400",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-emerald-500/10 text-emerald-400",
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-amber-500/10 text-amber-400",
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-purple-500/10 text-purple-400",
      href: "/admin/orders",
    },
  ];

  const statusBadge = (status: Order["status"]) => {
    const styles: Record<string, string> = {
      confirmed: "bg-blue-500/10 text-blue-400",
      weaving: "bg-amber-500/10 text-amber-400",
      dispatched: "bg-purple-500/10 text-purple-400",
      delivered: "bg-emerald-500/10 text-emerald-400",
    };
    return styles[status] || "bg-white/10 text-white/40";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-white text-2xl font-medium tracking-tight">
          Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Overview of your handloom business
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={card.href}
              className="block p-5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
                >
                  <card.icon size={18} />
                </div>
                <ArrowRight
                  size={14}
                  className="text-white/10 group-hover:text-white/30 transition-colors"
                />
              </div>
              <p className="text-2xl text-white font-medium">{card.value}</p>
              <p className="text-xs text-white/30 mt-1 tracking-wide uppercase">
                {card.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Package size={18} className="text-white/60" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Manage Products</p>
            <p className="text-white/30 text-xs">Add, edit, or remove sarees</p>
          </div>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <TrendingUp size={18} className="text-white/60" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Site Settings</p>
            <p className="text-white/30 text-xs">
              Payment info, contact, hero text
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-medium">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-wide"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-12 text-center">
            <ShoppingCart size={24} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No orders yet</p>
            <p className="text-white/15 text-xs mt-1">
              Orders will appear here after customers checkout
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                    Order ID
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                    Total
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-white/30 px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-white/70 font-mono">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/50">
                      {order.customer.fullName}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/70">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${statusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
