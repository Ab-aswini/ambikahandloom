"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-obsidian text-cream/80">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-cream mb-4">
                Ambika Handloom
              </h3>
              <p className="text-sm leading-relaxed text-cream/50 max-w-sm">
                Preserving the ancient art of Sambalpuri Ikat weaving. Every
                thread tells a story of heritage, every saree is a masterpiece
                woven with devotion.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Globe size={16} />
                </a>
                <a
                  href="mailto:hello@ambikahandloom.com"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 transition-colors duration-300"
                  aria-label="Email"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="tel:+919876543210"
                  className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:border-cream/60 transition-colors duration-300"
                  aria-label="Phone"
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
                    className="text-sm text-cream/50 hover:text-cream transition-colors duration-300"
                  >
                    {link.label}
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
