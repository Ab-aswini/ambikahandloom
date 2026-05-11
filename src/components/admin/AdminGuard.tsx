"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { isAdminAuthenticated, adminLogin } from "@/lib/admin-store";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (adminLogin(password)) {
      setIsAuthenticated(true);
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <div className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/5">
              <Lock size={22} className="text-white/60" />
            </div>
            <h1 className="text-white text-xl font-medium tracking-tight mb-2">
              Admin Access
            </h1>
            <p className="text-white/40 text-sm">
              Ambika Handloom — Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs"
              >
                <AlertCircle size={12} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-[#0A0A0A] text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-8">
            Protected access • Session-based authentication
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
