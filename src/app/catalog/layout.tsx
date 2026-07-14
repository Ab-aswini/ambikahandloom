import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection — Authentic Sambalpuri Ikat Sarees, Ladies Wear & Fabric",
  description:
    "Browse our curated collection of authentic Sambalpuri Ikat silk sarees, ladies kurta sets, dupattas, dress materials, and handloom cut-piece fabric. Handwoven by master artisans of Odisha. Free shipping across India.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Collection — Authentic Sambalpuri Ikat | Ambika Handloom",
    description:
      "Explore handwoven Sambalpuri Ikat sarees, ladies wear, and cut pieces. Direct from Odisha artisans.",
    url: "/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
