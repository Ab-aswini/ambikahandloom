"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ExternalLink,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { adminLogout } from "@/lib/admin-store";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/leads", label: "Quiz Leads", icon: Sparkles },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    adminLogout();
    window.location.href = "/admin";
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] border-r border-white/5 z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Ambika</p>
                <p className="text-white/30 text-[10px] tracking-[0.1em] uppercase">
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white/40 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: "spring", damping: 20 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <ExternalLink size={18} />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
