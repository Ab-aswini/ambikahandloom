import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

export const metadata: Metadata = {
  title: "Find Your Perfect Sambalpuri Saree | Interactive Weave Explorer — Ambika Handloom",
  description:
    "Discover your ideal authentic Sambalpuri Ikat saree in 3 steps. Match by occasion, fabric & budget. GI-tagged, handwoven in Odisha. Free shipping across India.",
  keywords: [
    "authentic sambalpuri saree online",
    "buy original sambalpuri ikat saree",
    "handloom saree from odisha direct",
    "sambalpuri silk saree price",
    "original odisha handloom weave guide",
    "sambalpuri ikat saree for wedding",
    "pasapalli saree online genuine",
    "bomkai saree authentic",
    "odisha handloom saree quiz",
  ],
  alternates: {
    canonical: `${siteUrl}/discover`,
  },
  openGraph: {
    title: "Find Your Perfect Sambalpuri Saree — Interactive Weave Explorer",
    description:
      "Answer 3 simple questions and discover the authentic Sambalpuri Ikat weave that's perfect for you. Direct from Odisha artisans.",
    url: `${siteUrl}/discover`,
    siteName: "Ambika Handloom Collection",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
