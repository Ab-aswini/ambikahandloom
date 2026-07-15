"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      showToast("Welcome to the Ambika family! You'll hear from us soon.");
      setEmail("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <footer className="bg-obsidian text-cream/80">
      {/* Newsletter Section */}
      <div className="border-b border-cream/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/30 mb-4">
              Stay Connected
            </p>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-cream mb-3">
              Join the Inner Circle
            </h3>
            <p className="text-sm text-cream/40 mb-8 max-w-md mx-auto">
              Be the first to discover new masterpieces, artisan stories, and
              exclusive previews from our weaving ateliers.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-5 py-3.5 bg-cream/5 border border-cream/10 rounded-xl text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-cream/30 transition-colors"
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-cream text-obsidian text-sm font-medium tracking-[0.08em] uppercase rounded-xl hover:bg-cream/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <Send size={14} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-[10px] text-cream/20 mt-4">
              No spam, ever. Only artisan stories and new collection alerts.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 overflow-hidden rounded-full border border-cream/10 bg-white">
                  <Image
                    src="/logo.png"
                    alt="Ambika Collection Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-cream">
                  Ambika Handloom
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-cream/50 max-w-sm">
                Preserving the ancient art of Sambalpuri Ikat weaving. Every
                thread tells a story of heritage, every saree is a masterpiece
                woven with devotion.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 hover:bg-cream/5 transition-all duration-300"
                  aria-label="Website"
                  title="Website"
                >
                  <Globe size={16} />
                </a>
                <a
                  href="mailto:hello@ambikahandloom.in"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 hover:bg-cream/5 transition-all duration-300"
                  aria-label="Email"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="tel:+918658476300"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 hover:bg-cream/5 transition-all duration-300"
                  aria-label="Phone"
                  title="Phone"
                >
                  <Phone size={16} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-xs tracking-[0.2em] uppercase text-cream/30 mb-6">
                Quick Links
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/catalog", label: "Collection" },
                  { href: "/checkout", label: "Checkout" },
                  { href: "/track", label: "Track Order" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-cream transition-colors duration-300 group inline-flex items-center gap-2"
                  >
                    {link.label}
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xs tracking-[0.2em] uppercase text-cream/30 mb-6">
                Atelier
              </h4>
              <div className="flex items-start gap-3 text-sm text-cream/50">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Sonepur Weaver Colony
                  <br />
                  Subarnapur, Odisha
                  <br />
                  India — 767017
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} Ambika Handloom. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-cream/30">
              End-to-End Encrypted
            </span>
            <span className="text-xs text-cream/30">•</span>
            <span className="text-xs text-cream/30">
              Zero Financial Data Stored
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
