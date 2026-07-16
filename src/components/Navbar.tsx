"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();

  // ── Smart auto-hide: hide on scroll down, show on scroll up ──
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 50);

    // Don't hide when mobile menu is open
    if (isMobileMenuOpen) return;

    if (latest > 300 && latest > previous) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  // ── Lock body scroll when mobile menu is open ──
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, searchParams, closeMobileMenu]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog?section=sarees", label: "Sarees" },
    { href: "/catalog?section=ladies-wear", label: "Ladies Wear" },
    { href: "/catalog?section=cut-pieces", label: "Cut Pieces" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/track", label: "Track Order" },
  ];

  // ── Fixed isActive: properly matches query params for catalog sections ──
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    const [hrefBase, hrefQuery] = href.split("?");

    // For catalog links — match both path and section param
    if (hrefBase === "/catalog" && hrefQuery) {
      const hrefParams = new URLSearchParams(hrefQuery);
      const hrefSection = hrefParams.get("section");
      const currentSection = searchParams.get("section") || "sarees"; // Fallback to sarees

      // On catalog page, match the specific section
      if (pathname === "/catalog" || pathname.startsWith("/catalog/")) {
        return currentSection === hrefSection;
      }
      return false;
    }

    // For other links — prefix match
    return pathname.startsWith(hrefBase);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-effect shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 overflow-hidden rounded-full border border-obsidian/10 flex items-center justify-center group-hover:border-crimson-muted transition-colors duration-500 bg-white">
                <Image
                  src="/logo.png"
                  alt="Ambika Collection Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl md:text-2xl tracking-tight font-medium">
                Ambika Handloom
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-sans tracking-[0.12em] uppercase transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-obsidian font-medium"
                      : "text-obsidian/50 hover:text-obsidian"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-obsidian"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative magnetic-btn p-2 group"
                aria-label="Open shopping bag"
              >
                <ShoppingBag
                  size={20}
                  className="text-obsidian/70 group-hover:text-obsidian transition-colors duration-300"
                />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-muted text-cream text-[10px] font-medium rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══ Mobile Menu — Frosted Glass with Staggered Cascade ═══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 mobile-menu-frosted pt-24"
          >
            {/* Decorative golden thread line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute left-8 top-28 bottom-8 w-px bg-gradient-to-b from-crimson-muted/40 via-crimson-muted/20 to-transparent origin-top"
            />

            <div className="flex flex-col items-start gap-1 py-12 px-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block font-serif text-4xl sm:text-5xl tracking-tight py-3 transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-crimson-muted"
                        : "text-obsidian hover:text-crimson-muted"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="mobile-active-dot"
                        className="inline-block w-2 h-2 bg-crimson-muted rounded-full ml-3 align-middle"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="w-20 h-px bg-obsidian/10 my-6 origin-left"
              />

              {/* Mobile Cart Action */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setIsCartOpen(true);
                  }}
                  className="flex items-center gap-3 text-sm tracking-[0.12em] uppercase text-obsidian/50 hover:text-obsidian transition-colors"
                >
                  <ShoppingBag size={16} />
                  Your Bag
                  {totalItems > 0 && (
                    <span className="w-5 h-5 bg-crimson-muted text-cream text-[10px] font-medium rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </motion.div>

              {/* Artisan Badge in Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-auto pt-12"
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-obsidian/30">
                  Handwoven in Odisha, India
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
