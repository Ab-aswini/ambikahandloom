import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Cormorant_Garamond, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees",
  description:
    "Discover authentic Sambalpuri Ikat silk sarees sourced directly from master artisans of Odisha. Uncompromising pure silk, mesmerizing Ikat mathematics, and absolute digital security. Woven Heritage. Mastered for the Modern Era.",
  metadataBase: new URL("https://ambikahandloom.com"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sambalpuri Ikat",
    "Sambalpuri Silk Saree",
    "Odisha Handloom Saree",
    "Double Ikat Silk Saree",
    "Pure Mulberry Silk",
    "Handcrafted Saree India",
    "Pasapali Silk Saree",
    "Temple Border Saree",
    "Odisha Weavers Direct",
    "Traditional Indian Silk",
  ],
  openGraph: {
    title: "Ambika Handloom — Woven Heritage. Mastered for the Modern Era.",
    description:
      "Authentic Sambalpuri masterpieces sourced directly from master artisans. Uncompromising pure silk, mesmerizing Ikat mathematics.",
    url: "https://ambikahandloom.com",
    siteName: "Ambika Handloom",
    images: [
      {
        url: "/images/saree-hero-1.png",
        width: 1200,
        height: 630,
        alt: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees",
    description:
      "Discover authentic Sambalpuri Ikat silk sarees sourced directly from master artisans of Odisha. Uncompromising pure silk.",
    images: ["/images/saree-hero-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global JSON-LD graph structure for SEO, AEO, and GEO optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ambikahandloom.com/#organization",
        "name": "Ambika Handloom",
        "url": "https://ambikahandloom.com",
        "logo": "https://ambikahandloom.com/images/logo.png",
        "email": "hello@ambikahandloom.com",
        "telephone": "+919876543210",
        "description": "Preserving the ancient art of Sambalpuri Ikat weaving. Every thread tells a story of heritage, every saree is a masterpiece woven with devotion.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sonepur Weaver Colony",
          "addressLocality": "Subarnapur",
          "addressRegion": "Odisha",
          "postalCode": "767017",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://instagram.com/ambikahandloom",
          "https://facebook.com/ambikahandloom"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://ambikahandloom.com/#website",
        "url": "https://ambikahandloom.com",
        "name": "Ambika Handloom",
        "description": "Authentic Sambalpuri Ikat Silk Sarees from Odisha",
        "publisher": {
          "@id": "https://ambikahandloom.com/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://ambikahandloom.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes Ambika Handloom sarees authentic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every saree from Ambika Handloom is sourced directly from master weavers in Sonepur and Bargarh (Odisha) and comes with a certificate of authenticity. We deal exclusively in 100% pure silk (Mulberry, Tussar, Kosa) with handcrafted details, bypassing all middlemen."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to weave a Sambalpuri Ikat saree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Due to the intricate double-ikat and single-ikat resist dyeing mathematics, it takes our master weavers between 45 to 60 days of intensive physical labor to weave a single masterwork saree."
            }
          },
          {
            "@type": "Question",
            "name": "What is the security protocol for online purchases?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ambika Handloom enforces a strict zero-retention policy for customer financial data. All transactions are fully encrypted, and no sensitive payment details are stored on our servers."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
