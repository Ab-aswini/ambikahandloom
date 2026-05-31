import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.vercel.app";
  const productUrl = `${siteUrl}/catalog/${product.id}`;
  const imageUrl = `${siteUrl}${product.image}`;

  const titleSection =
    product.section === "sarees"
      ? "Sambalpuri Ikat Saree"
      : product.section === "ladies-wear"
      ? "Handloom Ladies Wear"
      : "Ikat Cut Piece Fabric";

  const title = `${product.name} | ${titleSection} | Ambika Handloom`;
  const description = `${product.description} Handcrafted by artisans from ${product.artisanOrigin}. ${product.fabric}, ${product.length}. ₹${product.price.toLocaleString("en-IN")}. ${product.inStock ? "In Stock" : "Out of Stock"}. Free shipping across India.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "Sambalpuri Ikat",
      "Handloom India",
      product.artisanOrigin,
      product.fabric || "Pure Silk",
      product.categoryLabel,
      "Buy handloom online",
      "Authentic Odisha weaving",
      "Ambika Handloom",
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Ambika Handloom",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} — ${product.categoryLabel} by Ambika Handloom. ${product.fabric}, handwoven by artisans from ${product.artisanOrigin}, Odisha.`,
          type: "image/png",
        },
        // Additional product images for image SEO
        ...(product.images || []).slice(1).map((img) => ({
          url: `${siteUrl}${img}`,
          width: 800,
          height: 1000,
          alt: `${product.name} detail — ${product.categoryLabel}, ${product.fabric} from ${product.artisanOrigin}`,
          type: "image/png",
        })),
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: `${product.name} — Authentic ${product.categoryLabel} by Ambika Handloom`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.vercel.app";
  const productUrl = `${siteUrl}/catalog/${product.id}`;

  // ─── Full JSON-LD for Product + Breadcrumb + FAQ + ImageObject ───
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Product schema — drives Google Shopping & rich results
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: [
          ...(product.images || [product.image]).map((img, i) => ({
            "@type": "ImageObject",
            "@id": `${siteUrl}${img}#image-${i}`,
            url: `${siteUrl}${img}`,
            name: `${product.name} — ${i === 0 ? "Main product image" : `Detail view ${i}`}`,
            description: `${product.categoryLabel} handwoven by artisans from ${product.artisanOrigin}, Odisha. ${product.fabric}, ${product.threadCount}.`,
            contentUrl: `${siteUrl}${img}`,
            encodingFormat: "image/png",
            width: 800,
            height: 1000,
            thumbnail: `${siteUrl}${img}`,
            caption: `${product.name} — Authentic ${product.categoryLabel} from Ambika Handloom`,
            creator: {
              "@type": "Organization",
              name: "Ambika Handloom",
              url: siteUrl,
            },
            copyrightHolder: {
              "@type": "Organization",
              name: "Ambika Handloom",
            },
            license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
          })),
        ],
        sku: product.id,
        mpn: product.id,
        brand: {
          "@type": "Brand",
          name: "Ambika Handloom",
        },
        manufacturer: {
          "@type": "Organization",
          name: "Ambika Handloom",
          url: siteUrl,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Subarnapur",
            addressRegion: "Odisha",
            addressCountry: "IN",
          },
        },
        material: product.fabric || "Pure Silk",
        color: "Multicolor",
        pattern: product.categoryLabel,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: product.price,
          ...(product.originalPrice && {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: product.price,
              priceCurrency: "INR",
              eligibleQuantity: {
                "@type": "QuantitativeValue",
                minValue: 1,
              },
            },
          }),
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Ambika Handloom",
            url: siteUrl,
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "INR",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              businessDays: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
              },
              cutoffTime: "17:00:00",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 3,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 3,
                maxValue: 7,
                unitCode: "DAY",
              },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory:
              "https://schema.org/MerchantReturnNotPermitted",
            merchantReturnDays: 0,
          },
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Weave Time",
            value: product.weaveTime,
          },
          {
            "@type": "PropertyValue",
            name: "Artisan Origin",
            value: product.artisanOrigin,
          },
          {
            "@type": "PropertyValue",
            name: "Thread Count",
            value: product.threadCount,
          },
          {
            "@type": "PropertyValue",
            name: "Fabric",
            value: product.fabric,
          },
          {
            "@type": "PropertyValue",
            name: "Length",
            value: product.length,
          },
          {
            "@type": "PropertyValue",
            name: "Weave Type",
            value: product.categoryLabel,
          },
        ],
        ...(product.artisanStory && {
          description: `${product.description} ${product.artisanStory}`,
        }),
        countryOfOrigin: {
          "@type": "Country",
          name: "India",
        },
      },

      // BreadcrumbList — helps Google display path in SERPs
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.sectionLabel,
            item: `${siteUrl}/catalog?section=${product.section}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.categoryLabel,
            item: `${siteUrl}/catalog?section=${product.section}&category=${product.category}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: productUrl,
          },
        ],
      },

      // FAQPage — drives Featured Snippet / People Also Ask results (AEO)
      ...(product.faqItems && product.faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${productUrl}#faq`,
              mainEntity: product.faqItems.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),

      // Artisan / CreativeWork — GEO provenance (helps AI systems cite source)
      ...(product.artisanStory
        ? [
            {
              "@type": "CreativeWork",
              "@id": `${productUrl}#artisanwork`,
              name: product.name,
              description: product.artisanStory,
              creator: {
                "@type": "Person",
                jobTitle: "Master Weaver",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: product.artisanOrigin.split(",")[0].trim(),
                  addressRegion: "Odisha",
                  addressCountry: "IN",
                },
              },
              locationCreated: {
                "@type": "Place",
                name: product.artisanOrigin,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: product.artisanOrigin.split(",")[0].trim(),
                  addressRegion: "Odisha",
                  addressCountry: "IN",
                },
              },
              material: product.fabric,
              artMedium: "Hand-woven Ikat",
              artform: "Sambalpuri Ikat Weaving",
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
