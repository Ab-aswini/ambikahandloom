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
  artisanStory?: string;
  careInstructions?: string[];
  images?: string[];
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
    artisanStory:
      "This saree was handwoven by Master Weaver Shri Harihar Meher from Sonepur, a fourth-generation Ikat artisan whose family has preserved the double-ikat tradition for over 120 years. Each morning before dawn, he prepares the natural indigo dye from locally sourced plants, continuing a ritual passed down from his great-grandfather.",
    careInstructions: [
      "Dry clean only for best results",
      "Store in a muslin cloth to allow the silk to breathe",
      "Avoid direct sunlight for prolonged periods",
      "Iron on low heat with a pressing cloth",
      "Do not wring or twist the fabric",
    ],
    images: [
      "/images/saree-hero-1.png",
      "/images/saree-detail-2.png",
      "/images/saree-product-3.png",
    ],
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
    artisanStory:
      "Crafted by the women weavers of the Bargarh cooperative, this saree represents the collective skill of a community that has woven silk for centuries. The lotus motif, known locally as 'padma', is considered auspicious and is traditionally gifted during festivals and celebrations.",
    careInstructions: [
      "Dry clean recommended",
      "Store folded in a cotton bag",
      "Avoid contact with perfumes or chemicals",
      "Iron on low heat on the reverse side",
      "Air dry in shade if hand washed",
    ],
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
    artisanStory:
      "Named after the classical raga that celebrates the monsoon, this masterpiece took 60 days to complete on a traditional pit loom. The peacock pallu alone required 12 days of meticulous tie-dyeing. The artisan, Shri Kunja Meher, is a National Award recipient whose work has been displayed at the Crafts Museum, New Delhi.",
    careInstructions: [
      "Professional dry clean only",
      "Store flat or rolled — never hang for long periods",
      "Keep away from moisture and humidity",
      "Use acid-free tissue between folds",
      "Iron on lowest setting with a silk pressing cloth",
    ],
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
    artisanStory:
      "Inspired by the lush forests of Boudh district, this saree uses natural dyes extracted from local flora. The temple border motif is modeled after the ancient Bhairabsingh Temple, a 14th-century architectural marvel. The weaver, Smt. Parbati Behera, learned the craft from her mother-in-law over 25 years ago.",
    careInstructions: [
      "Gentle dry clean only",
      "Store in a breathable cotton cover",
      "Natural dyes may soften over time — this is a sign of authenticity",
      "Avoid chlorinated water",
      "Iron on reverse side with medium-low heat",
    ],
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
    artisanStory:
      "The Pasapali (chessboard) pattern is perhaps the most iconic of all Sambalpuri designs, and this saree showcases it at its finest. Woven by Shri Gobinda Meher, the silver thread border required sourcing fine silver-coated threads from Varanasi, combining two of India's greatest weaving traditions.",
    careInstructions: [
      "Dry clean recommended for best preservation",
      "Store away from direct light",
      "Silver threads may tarnish — gentle buffing restores shine",
      "Do not soak in water",
      "Use a padded hanger if hanging briefly",
    ],
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
    artisanStory:
      "This is the most labor-intensive piece in our collection. The double-ikat bandha technique requires both warp and weft threads to be precisely tie-dyed before weaving — a process so complex that only a handful of artisans in Bargarh can execute it. Shri Laxmidhar Meher, the weaver, considers each of these sarees a meditation in patience.",
    careInstructions: [
      "Professional silk dry clean only",
      "Store in the provided muslin pouch",
      "Gold zari should never contact water directly",
      "Steam gently to remove wrinkles — avoid direct iron",
      "Re-fold along different lines every 6 months to prevent crease marks",
    ],
  },
];

export const categories = [
  { id: "all", label: "All Masterpieces" },
  { id: "pure-silk", label: "Pure Silk" },
  { id: "traditional-ikat", label: "Traditional Ikat" },
  { id: "exclusive-masterpieces", label: "Exclusive Masterpieces" },
];
