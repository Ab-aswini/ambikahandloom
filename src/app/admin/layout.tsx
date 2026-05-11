"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0F0F0F]">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/40 hover:text-white transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Page Content */}
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
