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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

export const metadata: Metadata = {
  title: {
    default: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees, Ladies Wear & Fabric",
    template: "%s | Ambika Handloom",
  },
  description:
    "Buy authentic Sambalpuri Ikat silk sarees, ladies kurta sets, dupattas, and ikat cut pieces directly from master artisans of Odisha. Pure silk, natural dyes, free shipping across India. Woven heritage. Mastered for the modern era.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sambalpuri Ikat Saree",
    "Sambalpuri Silk Saree buy online",
    "Odisha Handloom Saree",
    "Double Ikat Silk Saree",
    "Pure Mulberry Silk Saree",
    "Handcrafted Saree India",
    "Pasapali Silk Saree",
    "Temple Border Saree Odisha",
    "Odisha Weavers Direct",
    "Traditional Indian Silk Saree",
    "Ikat Kurta Set online",
    "Sambalpuri Dupatta",
    "Handloom Ladies Wear India",
    "Ikat Cotton Cut Piece",
    "Sambalpuri Silk Fabric",
    "Ambika Handloom Odisha",
    "Sonepur weaver saree",
    "Bargarh Ikat saree",
  ],
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/logo.png", color: "#1A2B4C" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Ambika Handloom — Authentic Sambalpuri Ikat Sarees, Ladies Wear & Fabric",
    description:
      "Authentic Sambalpuri Ikat sarees, ladies wear, and handloom fabric sourced directly from master artisans of Odisha. Pure silk, natural dyes, free shipping India-wide.",
    url: SITE_URL,
    siteName: "Ambika Handloom",
    images: [
      {
        url: `/images/saree-hero-1.png`,
        width: 1200,
        height: 630,
        alt: "Ambika Handloom — Authentic Sambalpuri Ikat Silk Sarees from Odisha, India",
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambika Handloom — Authentic Sambalpuri Ikat Sarees & Ladies Wear",
    description:
      "Buy authentic Sambalpuri Ikat silk sarees, ladies kurta sets, and handloom fabric directly from artisans of Odisha.",
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
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global JSON-LD — SEO (Organization, WebSite), AEO (FAQPage), GEO (LocalBusiness, provenance)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${siteUrl}/#organization`,
        "name": "Ambika Handloom",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "contentUrl": `${siteUrl}/logo.png`,
          "name": "Ambika Handloom Logo",
          "caption": "Ambika Handloom — Authentic Sambalpuri Ikat Sarees from Odisha"
        },
        "image": `${siteUrl}/images/saree-hero-1.png`,
        "telephone": "+918658476300",
        "description": "Ambika Handloom sells authentic Sambalpuri Ikat silk sarees, ladies wear, and handloom fabric directly from master artisans of Sonepur and Bargarh, Odisha.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sonepur Weaver Colony",
          "addressLocality": "Subarnapur",
          "addressRegion": "Odisha",
          "postalCode": "767017",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 20.8326,
          "longitude": 83.9110
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Ambika Handloom Collection",
          "itemListElement": [
            { "@type": "OfferCatalog", "name": "Sambalpuri Ikat Sarees" },
            { "@type": "OfferCatalog", "name": "Ladies Wear — Kurtas, Dupattas, Dress Materials" },
            { "@type": "OfferCatalog", "name": "Cut Pieces — Silk and Cotton Ikat Fabric" }
          ]
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English", "Odia", "Hindi"],
          "contactOption": "https://schema.org/TollFree"
        },
        "knowsAbout": [
          "Sambalpuri Ikat Weaving",
          "Double Ikat Technique",
          "Pure Mulberry Silk",
          "Tussar Silk",
          "Kosa Silk",
          "Natural Dyes",
          "Odisha Handloom Heritage"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Ambika Handloom",
        "description": "Authentic Sambalpuri Ikat Sarees, Ladies Wear and Handloom Fabric from Odisha, India",
        "inLanguage": "en-IN",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/catalog?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a Sambalpuri Ikat saree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sambalpuri Ikat is a traditional handloom saree from the Sambalpur region of Odisha, India. It uses a resist-dyeing technique where threads are tied and dyed before weaving, creating patterns that appear from within the fabric. Sambalpuri Ikat has a GI (Geographical Indication) tag from the Government of India."
            }
          },
          {
            "@type": "Question",
            "name": "Does Ambika Handloom sell ladies wear and cut pieces apart from sarees?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Ambika Handloom offers three collections: Sarees (Sambalpuri Ikat silk), Ladies Wear (Ikat kurta sets, dupattas, and dress materials), and Cut Pieces (pure silk and cotton Ikat fabric sold by the meter). All products are handwoven by artisans from Odisha."
            }
          },
          {
            "@type": "Question",
            "name": "What makes Ambika Handloom sarees authentic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every product from Ambika Handloom is sourced directly from master weavers in Sonepur and Bargarh, Odisha. We use 100% pure silk (Mulberry, Tussar, Kosa) and natural dyes, bypassing all middlemen. Each piece comes with artisan provenance details."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to weave a Sambalpuri Ikat saree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Due to the complex double-ikat resist-dyeing process where individual threads are tie-dyed before weaving, a single masterpiece saree takes between 30 to 60 days of intensive work by a master artisan."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer free shipping across India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Ambika Handloom offers free shipping across all states in India. Orders are dispatched within 2-3 business days and delivered in 5-7 business days via premium insured courier."
            }
          },
          {
            "@type": "Question",
            "name": "Can I place a custom order for a specific saree design or color?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Ambika Handloom accepts custom orders for specific patterns, colors, and fabric combinations. Please WhatsApp us with your requirements and our artisan team will guide you through the process. Custom orders take 45-90 days."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
