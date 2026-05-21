"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <CartDrawer />
        <ToastContainer />
        <main>{children}</main>
        <Footer />
      </ToastProvider>
    </CartProvider>
  );
}
