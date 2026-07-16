import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in";

const title = "Blog — Sambalpuri Handloom Guides & Stories";
const description = "Explore expert guides on Sambalpuri Ikat sarees, handloom heritage stories, buying tips, care instructions, and style inspiration from Ambika Handloom, Balangir, Odisha.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/blog`,
    siteName: "Ambika Handloom Collection",
    images: [
      {
        url: `${SITE_URL}/social-banner.jpg`,
        width: 1200,
        height: 630,
        alt: "Ambika Handloom Blog — Sambalpuri Handloom Guides & Heritage Stories",
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
