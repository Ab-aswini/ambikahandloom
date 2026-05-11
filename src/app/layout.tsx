import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees",
  description:
    "Discover authentic Sambalpuri Ikat silk sarees sourced directly from master artisans of Odisha. Uncompromising pure silk, mesmerizing Ikat mathematics, and absolute digital security. Woven Heritage. Mastered for the Modern Era.",
  keywords: [
    "Sambalpuri",
    "Ikat",
    "Silk Saree",
    "Handloom",
    "Odisha",
    "Traditional Weaving",
    "Pure Silk",
    "Indian Saree",
    "Mothers Day Gift",
  ],
  openGraph: {
    title: "Ambika Handloom — Woven Heritage. Mastered for the Modern Era.",
    description:
      "Authentic Sambalpuri masterpieces sourced directly from master artisans. Uncompromising pure silk, mesmerizing Ikat mathematics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
