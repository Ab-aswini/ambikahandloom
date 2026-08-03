import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Ambika Handloom",
  description:
    "Track your Ambika Handloom order in real-time. Enter your Order ID to see the status of your authentic Sambalpuri Ikat saree — from payment verification to delivery at your doorstep.",
  openGraph: {
    title: "Track Your Order | Ambika Handloom",
    description:
      "Real-time order tracking for your authentic Sambalpuri handloom purchase. See every step from verification to delivery.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
