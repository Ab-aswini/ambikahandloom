"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export default function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Show pulse after 5 seconds to draw attention
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const quickMessages = [
    {
      emoji: "🛍️",
      label: "Browse Collection",
      msg: "Namaste! I would like to browse your Sambalpuri Ikat collection. Could you share what's available?",
    },
    {
      emoji: "✂️",
      label: "Custom Order",
      msg: "Namaste! I'm interested in placing a custom order for a Sambalpuri saree. Could you guide me on the process?",
    },
    {
      emoji: "📦",
      label: "Track My Order",
      msg: "Namaste! I want to track my order. Could you please help me with the status?",
    },
    {
      emoji: "💰",
      label: "Pricing & Offers",
      msg: "Namaste! Could you please share your current pricing and any ongoing offers on sarees, kurtas, or cut pieces?",
    },
  ];

  const handleMessage = (msg: string) => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick Message Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-warm-200 w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif text-lg font-semibold">A</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Ambika Handloom</p>
                  <p className="text-white/70 text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
                    Usually replies in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close WhatsApp chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="p-4 bg-[#ece5dd]">
              <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-800 leading-relaxed">
                  🙏 Namaste! Welcome to Ambika Handloom. How can we help you today?
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5 text-right">10:00 AM ✓✓</p>
              </div>
            </div>

            {/* Quick options */}
            <div className="p-3 bg-white space-y-2">
              <p className="text-[10px] text-obsidian/40 uppercase tracking-wider px-1">Quick Messages</p>
              {quickMessages.map((qm) => (
                <button
                  key={qm.label}
                  onClick={() => handleMessage(qm.msg)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-warm-200 hover:bg-[#25D366]/5 hover:border-[#25D366]/30 transition-all text-left group"
                >
                  <span className="text-lg">{qm.emoji}</span>
                  <span className="text-sm text-obsidian/70 group-hover:text-obsidian transition-colors">
                    {qm.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-warm-100/50 border-t border-warm-200">
              <p className="text-[10px] text-obsidian/30 text-center">
                Powered by WhatsApp · Replies in minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="relative">
        {/* Pulse ring when closed */}
        {!isOpen && showPulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowPulse(false);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors"
          aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="msg"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
