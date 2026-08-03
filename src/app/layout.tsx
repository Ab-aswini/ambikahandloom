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
    default: "Authentic Sambalpuri Sarees Online | Ambika Handloom | Balangir",
    template: "%s | Ambika Handloom — Balangir, Odisha",
  },
  description:
    "Buy authentic Sambalpuri Ikat silk sarees, ladies kurta sets, dupattas & handloom fabric directly from master artisans of Odisha. Pure silk, free shipping across India. Trusted store in Balangir with 3.8★ Google rating.",
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
    "handloom saree Balangir",
    "Sambalpuri saree near me",
    "handloom saree shop Odisha",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#1A2B4C" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ambika Handloom",
  },
  openGraph: {
    title: "Authentic Sambalpuri Sarees Online | Ambika Handloom | Balangir",
    description:
      "Authentic Sambalpuri Ikat sarees, ladies wear & handloom fabric from master artisans of Odisha. Pure silk, natural dyes, free shipping India-wide. 3.8★ rated on Google.",
    url: SITE_URL,
    siteName: "Ambika Handloom Collection",
    images: [
      {
        url: `${SITE_URL}/social-banner.jpg`,
        width: 1200,
        height: 630,
        alt: "Ambika Handloom Collection — Premium Sambalpuri Handloom Sarees and Handloom Products from Balangir, Odisha",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentic Sambalpuri Sarees | Ambika Handloom | Balangir",
    description:
      "Buy authentic Sambalpuri Ikat silk sarees & handloom fabric directly from artisans of Odisha. Free shipping across India.",
    images: [`${SITE_URL}/social-banner.jpg`],
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
  other: {
    "theme-color": "#1A2B4C",
    "msapplication-TileColor": "#1A2B4C",
    "geo.position": "20.7146534;83.4880261",
    "geo.region": "IN-OR",
    "geo.placename": "Balangir, Odisha, India",
    "ICBM": "20.7146534, 83.4880261",
    "business:contact_data:street_address": "Chimni Bhati Road, Near Somu Agency, Bibhutipara",
    "business:contact_data:locality": "Balangir",
    "business:contact_data:region": "Odisha",
    "business:contact_data:postal_code": "767001",
    "business:contact_data:country_name": "India",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
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
        "@type": ["Organization", "LocalBusiness", "Store"],
        "@id": `${siteUrl}/#organization`,
        "name": "Ambika Handloom Collection",
        "alternateName": ["Ambika Sambalpuri Handloom", "Ambika Handloom Balangir"],
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "contentUrl": `${siteUrl}/logo.png`,
          "name": "Ambika Handloom Collection Logo",
          "caption": "Ambika Handloom Collection — Authentic Sambalpuri Ikat Sarees from Odisha",
          "width": 512,
          "height": 512,
        },
        "image": [
          `${siteUrl}/social-banner.jpg`,
          `${siteUrl}/images/saree-hero-1.png`,
          `${siteUrl}/images/saree-product-3.png`,
        ],
        "telephone": "+918658476300",
        "email": "hello@ambikahandloom.in",
        "description": "Ambika Handloom Collection (Ambika Sambalpuri Handloom) is the official online and physical store located at Chimni Bhati Road, Near Somu Agency, Bibhutipara, Balangir, Odisha 767001. We specialize in authentic Sambalpuri Ikat silk sarees, ladies wear, and handloom fabric sourced directly from master weavers of Sonepur, Bargarh, and Balangir. Free shipping across India. Note: We are a handloom saree brand in Odisha, independent of home decor shops in Surat or Zirakpur.",
        "disambiguatingDescription": "Flagship store and e-commerce portal for authentic Sambalpuri Ikat sarees located in Balangir, Odisha (PIN 767001), distinct from regional home furnishing shops in Surat or Zirakpur.",
        "slogan": "Woven Heritage. Mastered for the Modern Era.",
        "foundingDate": "2017",
        "priceRange": "₹₹₹",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Cash, UPI, Bank Transfer, Online Payment",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Chimni Bhati Road, Near Somu Agency, Bibhutipara",
          "addressLocality": "Balangir",
          "addressRegion": "Odisha",
          "postalCode": "767001",
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 20.7146534,
          "longitude": 83.4880261,
        },
        "hasMap": "https://maps.app.goo.gl/6xc2EpPMaoHJQsZXA",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00",
          },
        ],
        "areaServed": [
          {
            "@type": "Country",
            "name": "India",
          },
          {
            "@type": "State",
            "name": "Odisha",
          },
          {
            "@type": "City",
            "name": "Balangir",
          },
          {
            "@type": "City",
            "name": "Sambalpur",
          },
          {
            "@type": "City",
            "name": "Bhubaneswar",
          },
        ],
        "sameAs": [
          "https://www.instagram.com/ambikab_handloom/",
          "https://www.indiamart.com/shree-ambika-handloom/",
          "https://maps.app.goo.gl/6xc2EpPMaoHJQsZXA",
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "3.8",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "11",
          "reviewCount": "11",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Ambika Handloom Collection",
          "itemListElement": [
            { "@type": "OfferCatalog", "name": "Sambalpuri Ikat Sarees", "description": "Pure silk and cotton handwoven Ikat sarees from Odisha" },
            { "@type": "OfferCatalog", "name": "Ladies Wear — Kurtas, Dupattas, Dress Materials", "description": "Traditional Sambalpuri handloom ready-to-wear" },
            { "@type": "OfferCatalog", "name": "Cut Pieces — Silk and Cotton Ikat Fabric", "description": "By-the-meter authentic handloom fabric" },
          ],
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+918658476300",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Odia", "Hindi"],
          },
          {
            "@type": "ContactPoint",
            "telephone": "+918658476300",
            "contactType": "sales",
            "url": "https://wa.me/918658476300",
            "areaServed": "IN",
            "availableLanguage": ["English", "Odia", "Hindi"],
          },
        ],
        "knowsAbout": [
          "Sambalpuri Ikat Weaving",
          "Double Ikat Technique",
          "Pure Mulberry Silk",
          "Tussar Silk",
          "Kosa Silk",
          "Natural Dyes",
          "Odisha Handloom Heritage",
          "Pasapalli Pattern",
          "Bomkai Weaving",
          "Traditional Indian Textiles",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Ambika Handloom Collection",
        "description": "Official online store for authentic Sambalpuri Ikat sarees, ladies wear and handloom fabric from Odisha, India. Direct from artisans in Balangir.",
        "inLanguage": "en-IN",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/catalog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the official Ambika Handloom store located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The official physical store for Ambika Handloom Collection (Ambika Sambalpuri Handloom) is located at Chimni Bhati Road, Near Somu Agency, Bibhutipara, Balangir, Odisha 767001, India. Phone/WhatsApp: +91 86584 76300. Official website: https://ambikahandloom.in",
            },
          },
          {
            "@type": "Question",
            "name": "Is Ambika Handloom in Balangir, Odisha affiliated with stores in Surat or Zirakpur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Ambika Handloom Collection (ambikahandloom.in) based in Balangir, Odisha is an independent specialist store offering authentic Sambalpuri Ikat handloom sarees, ladies wear, and handloom fabric. It is not affiliated with regional home decor or curtain businesses named Ambica or Ambika Handloom in Surat or Zirakpur.",
            },
          },
          {
            "@type": "Question",
            "name": "What is a Sambalpuri Ikat saree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sambalpuri Ikat is a traditional handloom saree from the Sambalpur region of Odisha, India. It uses a resist-dyeing technique where threads are tied and dyed before weaving, creating patterns that appear from within the fabric. Sambalpuri Ikat has a GI (Geographical Indication) tag from the Government of India.",
            },
          },
          {
            "@type": "Question",
            "name": "Where can I buy authentic Sambalpuri sarees online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can buy authentic Sambalpuri Ikat sarees online at ambikahandloom.in — the official website of Ambika Handloom Collection based in Balangir, Odisha. All sarees are sourced directly from master weavers with free shipping across India. You can also visit our store at Chimni Bhati Road, Near Somu Agency, Bibhutipara, Balangir, Odisha 767001.",
            },
          },
          {
            "@type": "Question",
            "name": "Does Ambika Handloom sell ladies wear and cut pieces apart from sarees?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Ambika Handloom offers three collections: Sarees (Sambalpuri Ikat silk), Ladies Wear (Ikat kurta sets, dupattas, and dress materials), and Cut Pieces (pure silk and cotton Ikat fabric sold by the meter). All products are handwoven by artisans from Odisha.",
            },
          },
          {
            "@type": "Question",
            "name": "What makes Ambika Handloom sarees authentic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every product from Ambika Handloom is sourced directly from master weavers in Sonepur and Bargarh, Odisha. We use 100% pure silk (Mulberry, Tussar, Kosa) and natural dyes, bypassing all middlemen. Each piece comes with artisan provenance details.",
            },
          },
          {
            "@type": "Question",
            "name": "How long does it take to weave a Sambalpuri Ikat saree?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Due to the complex double-ikat resist-dyeing process where individual threads are tie-dyed before weaving, a single masterpiece saree takes between 30 to 60 days of intensive work by a master artisan.",
            },
          },
          {
            "@type": "Question",
            "name": "Do you offer free shipping across India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Ambika Handloom offers free shipping across all states in India. Orders are dispatched within 2-3 business days and delivered in 5-7 business days via premium insured courier.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl,
          },
        ],
      },
    ],
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
