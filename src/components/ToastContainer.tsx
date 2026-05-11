"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <Check size={16} className="text-emerald-600" />,
    info: <AlertCircle size={16} className="text-indigo-deep" />,
    error: <X size={16} className="text-crimson-muted" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-effect rounded-xl px-5 py-4 shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
              {icons[toast.type]}
            </div>
            <p className="text-sm font-medium text-obsidian flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-obsidian/30 hover:text-obsidian transition-colors duration-300 flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
