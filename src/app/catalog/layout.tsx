import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

const title = "Collections — Authentic Sambalpuri Ikat Sarees & Ladies Wear | Ambika Handloom";
const description = "Browse our curated collection of authentic Sambalpuri Ikat silk sarees, ladies kurta sets, dupattas, dress materials, and handloom cut-piece fabric. Handwoven by master artisans of Odisha. Free shipping across India.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/catalog`,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/catalog`,
    siteName: "Ambika Handloom Collection",
    images: [
      {
        url: `${SITE_URL}/social-banner.jpg`,
        width: 1200,
        height: 630,
        alt: "Ambika Handloom Collection Catalog Saree & Ladies Wear Banner",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/social-banner.jpg`],
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
