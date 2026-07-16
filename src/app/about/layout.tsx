import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

const title = "About Us — Authentic Sambalpuri Handloom from Odisha";
const description = "Ambika Handloom Collection — a regional specialist in Balangir, Odisha, dedicated to authentic Sambalpuri Ikat sarees & handloom textiles. Direct from artisans, fair pricing, heritage preservation. 3.8★ Google rated.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/about`,
    siteName: "Ambika Handloom Collection",
    images: [
      {
        url: `${SITE_URL}/social-banner.jpg`,
        width: 1200,
        height: 630,
        alt: "About Ambika Handloom — Authentic Sambalpuri Handloom from Balangir, Odisha",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
