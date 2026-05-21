export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "pure-silk" | "traditional-ikat" | "exclusive-masterpieces";
  categoryLabel: string;
  weaveTime: string;
  artisanOrigin: string;
  threadCount: string;
  description: string;
  details: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "AH-001",
    name: "Nilambari — The Midnight Sky",
    price: 18500,
    originalPrice: 22000,
    image: "/images/saree-hero-1.png",
    category: "exclusive-masterpieces",
    categoryLabel: "Exclusive Masterpiece",
    weaveTime: "45 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "120 TPI",
    description:
      "A breathtaking double-ikat masterpiece in deep indigo and crimson. Each thread is individually tie-dyed before weaving, creating patterns that appear to float within the fabric.",
    details: [
      "Pure Mulberry Silk",
      "Double Ikat Technique",
      "Natural Indigo Dye",
      "Gold Zari Border",
      "6.2m with Blouse Piece",
    ],
    inStock: true,
  },
  {
    id: "AH-002",
    name: "Raktapadma — The Red Lotus",
    price: 14500,
    image: "/images/saree-detail-2.png",
    category: "traditional-ikat",
    categoryLabel: "Traditional Ikat",
    weaveTime: "30 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "100 TPI",
    description:
      "Rich burgundy and gold tones weave together in this traditional Sambalpuri pattern. The intricate geometric motifs tell stories passed down through generations of master weavers.",
    details: [
      "Pure Tussar Silk",
      "Single Ikat Weave",
      "Vegetable Dyed",
      "Temple Border",
      "5.8m with Blouse Piece",
    ],
    inStock: true,
  },
  {
    id: "AH-003",
    name: "Meghmalhar — The Rain Song",
    price: 22000,
    originalPrice: 26000,
    image: "/images/saree-product-3.png",
    category: "exclusive-masterpieces",
    categoryLabel: "Exclusive Masterpiece",
    weaveTime: "60 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "140 TPI",
    description:
      "An extraordinary purple and gold creation inspired by monsoon ragas. The pallu features an elaborate peacock motif rendered in the finest gold zari, making this a true collector's piece.",
    details: [
      "Pure Kosa Silk",
      "Double Ikat Technique",
      "Handspun Gold Zari",
      "Peacock Pallu",
      "6.5m with Blouse Piece",
    ],
    inStock: true,
  },
  {
    id: "AH-004",
    name: "Vanashree — The Forest Grace",
    price: 16000,
    image: "/images/saree-product-4.png",
    category: "pure-silk",
    categoryLabel: "Pure Silk",
    weaveTime: "35 Days",
    artisanOrigin: "Boudh, Odisha",
    threadCount: "110 TPI",
    description:
      "Emerald green and copper tones create a mesmerizing interplay in this nature-inspired masterpiece. The temple border pays homage to ancient Odisha architecture.",
    details: [
      "Pure Mulberry Silk",
      "Single Ikat Weave",
      "Natural Dyes",
      "Temple Border Motif",
      "6.0m with Blouse Piece",
    ],
    inStock: true,
  },
  {
    id: "AH-005",
    name: "Samudra — The Deep Ocean",
    price: 19500,
    image: "/images/saree-product-5.png",
    category: "traditional-ikat",
    categoryLabel: "Traditional Ikat",
    weaveTime: "40 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "120 TPI",
    description:
      "Deep navy blue and silver threads create the illusion of moonlight on ocean waves. Features the iconic Pasapali check pattern of Sambalpuri tradition.",
    details: [
      "Pure Mulberry Silk",
      "Pasapali Check Pattern",
      "Silver Thread Border",
      "Natural Indigo Dye",
      "6.2m with Blouse Piece",
    ],
    inStock: true,
  },
  {
    id: "AH-006",
    name: "Agnishikha — The Flame Crest",
    price: 24000,
    originalPrice: 28000,
    image: "/images/saree-product-6.png",
    category: "exclusive-masterpieces",
    categoryLabel: "Exclusive Masterpiece",
    weaveTime: "55 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "130 TPI",
    description:
      "A regal maroon and golden yellow symphony featuring the most intricate bandha tie-dye patterns. The elaborate peacock motifs on the pallu make this an heirloom for the ages.",
    details: [
      "Pure Kosa Silk",
      "Double Ikat Bandha",
      "Handwoven Gold Zari",
      "Peacock & Floral Motifs",
      "6.5m with Blouse Piece",
    ],
    inStock: true,
  },
];

export const categories = [
  { id: "all", label: "All Masterpieces" },
  { id: "pure-silk", label: "Pure Silk" },
  { id: "traditional-ikat", label: "Traditional Ikat" },
  { id: "exclusive-masterpieces", label: "Exclusive Masterpieces" },
];
