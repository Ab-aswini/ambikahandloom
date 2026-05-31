"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <CartProvider>
      <ToastProvider>
        {!isAdmin && <ScrollProgress />}
        {!isAdmin && <Navbar />}
        {!isAdmin && <CartDrawer />}
        {!isAdmin && <WhatsAppFAB />}
        <ToastContainer />
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </ToastProvider>
    </CartProvider>
  );
}
