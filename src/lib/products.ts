export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category:
    | "pure-silk"
    | "traditional-ikat"
    | "exclusive-masterpieces"
    | "ladies-wear-kurta"
    | "ladies-wear-dupatta"
    | "ladies-wear-dress-material"
    | "cut-pieces-silk"
    | "cut-pieces-cotton"
    | "cut-pieces-blouse";
  section: "sarees" | "ladies-wear" | "cut-pieces";
  categoryLabel: string;
  sectionLabel: string;
  weaveTime: string;
  artisanOrigin: string;
  threadCount: string;
  description: string;
  details: string[];
  inStock: boolean;
  artisanStory?: string;
  careInstructions?: string[];
  images?: string[];
  fabric?: string;
  length?: string;
  weight?: string;
  faqItems?: { question: string; answer: string }[];
}

export const products: Product[] = [
  {
    id: "AH-001",
    name: "Nilambari — The Midnight Sky",
    price: 18500,
    originalPrice: 22000,
    image: "/images/saree-hero-1.png",
    images: [
      "/images/saree-hero-1.png",
      "/images/saree-detail-2.png",
      "/images/saree-product-3.png",
    ],
    category: "exclusive-masterpieces",
    section: "sarees",
    categoryLabel: "Exclusive Masterpiece",
    sectionLabel: "Sarees",
    weaveTime: "45 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "120 TPI",
    fabric: "Pure Mulberry Silk",
    length: "6.2m with Blouse Piece",
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
    faqItems: [
      {
        question: "Is the Nilambari saree made from pure silk?",
        answer:
          "Yes, the Nilambari saree is crafted from 100% pure Mulberry silk sourced directly from certified silk farms. The silk threads are individually dyed using natural indigo before weaving.",
      },
      {
        question: "How long does it take to weave the Nilambari saree?",
        answer:
          "The Nilambari saree takes 45 days to complete due to the complex double-ikat technique where both warp and weft threads are tie-dyed before weaving.",
      },
      {
        question: "Can the Nilambari saree be dry cleaned?",
        answer:
          "Yes, dry cleaning is the recommended method. Avoid machine washing to preserve the natural dyes and silk luster.",
      },
    ],
  },
  {
    id: "AH-002",
    name: "Raktapadma — The Red Lotus",
    price: 14500,
    image: "/images/saree-detail-2.png",
    category: "traditional-ikat",
    section: "sarees",
    categoryLabel: "Traditional Ikat",
    sectionLabel: "Sarees",
    weaveTime: "30 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "100 TPI",
    fabric: "Pure Tussar Silk",
    length: "5.8m with Blouse Piece",
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
    faqItems: [
      {
        question: "What is the significance of the lotus motif in this saree?",
        answer:
          "The lotus (padma) motif in Sambalpuri tradition represents purity and prosperity. It is considered auspicious and is traditionally gifted during weddings, festivals, and celebrations.",
      },
      {
        question: "Is this saree suitable for daily wear?",
        answer:
          "The Raktapadma is crafted from pure Tussar silk which is more durable than Mulberry silk, making it suitable for both special occasions and festive daily wear.",
      },
    ],
  },
  {
    id: "AH-003",
    name: "Meghmalhar — The Rain Song",
    price: 22000,
    originalPrice: 26000,
    image: "/images/saree-product-3.png",
    category: "exclusive-masterpieces",
    section: "sarees",
    categoryLabel: "Exclusive Masterpiece",
    sectionLabel: "Sarees",
    weaveTime: "60 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "140 TPI",
    fabric: "Pure Kosa Silk",
    length: "6.5m with Blouse Piece",
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
    faqItems: [
      {
        question: "Who is the artisan behind the Meghmalhar saree?",
        answer:
          "The Meghmalhar was woven by Shri Kunja Meher, a National Award recipient from Sonepur whose work has been exhibited at the Crafts Museum in New Delhi. He is one of only a few artisans who can execute the double-ikat peacock pallu.",
      },
      {
        question: "What makes Kosa silk different from Mulberry silk?",
        answer:
          "Kosa silk (also called Tussar or wild silk) is harvested from silkworms feeding on forest trees. It has a natural golden sheen, slightly coarser texture, and excellent durability, making it ideal for elaborate patterns like peacock motifs.",
      },
    ],
  },
  {
    id: "AH-004",
    name: "Vanashree — The Forest Grace",
    price: 16000,
    image: "/images/saree-product-4.png",
    category: "pure-silk",
    section: "sarees",
    categoryLabel: "Pure Silk",
    sectionLabel: "Sarees",
    weaveTime: "35 Days",
    artisanOrigin: "Boudh, Odisha",
    threadCount: "110 TPI",
    fabric: "Pure Mulberry Silk",
    length: "6.0m with Blouse Piece",
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
    faqItems: [
      {
        question: "Are the dyes in Vanashree saree truly natural?",
        answer:
          "Yes, the Vanashree saree uses dyes extracted entirely from plants local to Boudh district including bark, leaves, and roots. The natural dyes are eco-friendly and become more characterful with age.",
      },
    ],
  },
  {
    id: "AH-005",
    name: "Samudra — The Deep Ocean",
    price: 19500,
    image: "/images/saree-product-5.png",
    category: "traditional-ikat",
    section: "sarees",
    categoryLabel: "Traditional Ikat",
    sectionLabel: "Sarees",
    weaveTime: "40 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "120 TPI",
    fabric: "Pure Mulberry Silk",
    length: "6.2m with Blouse Piece",
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
    faqItems: [
      {
        question: "What is the Pasapali pattern in Sambalpuri sarees?",
        answer:
          "Pasapali (meaning chessboard) is the most iconic motif in Sambalpuri tradition. The geometric squares are created through precise tie-dyeing of individual threads before weaving, resulting in a perfectly symmetrical pattern.",
      },
    ],
  },
  {
    id: "AH-006",
    name: "Agnishikha — The Flame Crest",
    price: 24000,
    originalPrice: 28000,
    image: "/images/saree-product-6.png",
    category: "exclusive-masterpieces",
    section: "sarees",
    categoryLabel: "Exclusive Masterpiece",
    sectionLabel: "Sarees",
    weaveTime: "55 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "130 TPI",
    fabric: "Pure Kosa Silk",
    length: "6.5m with Blouse Piece",
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
    faqItems: [
      {
        question: "What is the Bandha technique used in the Agnishikha saree?",
        answer:
          "Bandha is the Odia word for the resist-dyeing technique used in Sambalpuri sarees. In double-ikat bandha, both warp and weft threads are tied and dyed separately before weaving, requiring extreme mathematical precision to create perfect pattern alignment.",
      },
    ],
  },
  // ─── Ladies Wear ──────────────────────────────────
  {
    id: "AH-LW-001",
    name: "Ikat Silk Kurta Set — Indigo Bloom",
    price: 4800,
    originalPrice: 6000,
    image: "/images/saree-hero-1.png",
    category: "ladies-wear-kurta",
    section: "ladies-wear",
    categoryLabel: "Ikat Kurta Set",
    sectionLabel: "Ladies Wear",
    weaveTime: "12 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "90 TPI",
    fabric: "Pure Cotton Ikat",
    length: "Kurta 46\" + Dupatta 2.5m",
    description:
      "An elegant daily-wear kurta set in deep indigo and white Ikat print. Crafted from hand-woven pure cotton, this kurta brings authentic Sambalpuri Ikat artistry to contemporary fashion.",
    details: [
      "Hand-Woven Pure Cotton",
      "Sambalpuri Ikat Print",
      "Natural Indigo Dye",
      "Includes matching dupatta",
      "Sizes: S, M, L, XL",
    ],
    inStock: true,
    artisanStory:
      "Crafted by the Bargarh women's weaving cooperative, this kurta set brings the centuries-old Ikat tradition to everyday fashion. Each piece is hand-woven on pit looms and naturally dyed, making every set unique.",
    careInstructions: [
      "Gentle machine wash or hand wash in cold water",
      "Use mild detergent",
      "Do not wring — gently squeeze and air dry",
      "Iron on medium heat while slightly damp",
      "Store folded to avoid creasing",
    ],
    faqItems: [
      {
        question: "Is the Indigo Bloom kurta available in all sizes?",
        answer:
          "Yes, we offer sizes S, M, L, and XL. Since it is hand-woven, there may be slight size variations. Please check our size guide or WhatsApp us for custom sizing.",
      },
      {
        question: "Is the Ikat print pre-shrunk?",
        answer:
          "Natural cotton Ikat may shrink slightly on first wash. We recommend gentle cold water wash to maintain the fabric integrity.",
      },
    ],
  },
  {
    id: "AH-LW-002",
    name: "Sambalpuri Dupatta — Crimson Peacock",
    price: 1800,
    image: "/images/saree-detail-2.png",
    category: "ladies-wear-dupatta",
    section: "ladies-wear",
    categoryLabel: "Sambalpuri Dupatta",
    sectionLabel: "Ladies Wear",
    weaveTime: "8 Days",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "85 TPI",
    fabric: "Pure Cotton",
    length: "2.5m × 0.75m",
    description:
      "A stunning hand-woven dupatta in crimson and gold with the iconic peacock motif. Pairs beautifully with any ethnic or fusion outfit, adding an authentic Odisha touch to your wardrobe.",
    details: [
      "Hand-Woven Pure Cotton",
      "Peacock Ikat Motif",
      "Vegetable-Dyed Crimson",
      "Fringed Ends",
      "2.5m length",
    ],
    inStock: true,
    artisanStory:
      "Woven by Smt. Meena Pradhan of Sonepur, this dupatta is a testament to the skill of Odisha's women weavers. The peacock motif is rendered with 85 threads per inch, resulting in a crisp, detailed pattern.",
    careInstructions: [
      "Hand wash in cold water with mild soap",
      "Do not bleach or use harsh detergents",
      "Air dry in shade",
      "Iron at low heat",
    ],
    faqItems: [
      {
        question: "What outfits does the Crimson Peacock dupatta pair well with?",
        answer:
          "It pairs beautifully with white or cream salwar suits, plain kurtas, and even Western tops. The crimson and gold palette makes it a versatile statement accessory.",
      },
    ],
  },
  {
    id: "AH-LW-003",
    name: "Ikat Cotton Dress Material — Golden Temple",
    price: 3200,
    image: "/images/saree-product-4.png",
    category: "ladies-wear-dress-material",
    section: "ladies-wear",
    categoryLabel: "Dress Material",
    sectionLabel: "Ladies Wear",
    weaveTime: "10 Days",
    artisanOrigin: "Boudh, Odisha",
    threadCount: "88 TPI",
    fabric: "Pure Cotton",
    length: "3m top + 2.5m dupatta",
    description:
      "Unstitched dress material in golden-yellow cotton Ikat with a classic temple border pattern. Get it stitched to your own measurements for a perfectly fitted ethnic ensemble.",
    details: [
      "Unstitched Dress Material",
      "Pure Cotton Ikat",
      "Temple Border Design",
      "Natural Yellow Dye",
      "Includes matching dupatta",
    ],
    inStock: true,
    artisanStory:
      "Inspired by the ancient temples of Odisha, this dress material uses a temple border pattern that has been passed down through generations of Boudh district weavers. The golden yellow is achieved using natural turmeric-based dyes.",
    careInstructions: [
      "Hand wash before stitching to pre-shrink",
      "Use cold water with mild detergent",
      "Air dry in shade",
      "Iron at medium heat",
    ],
    faqItems: [
      {
        question: "Can I get the Golden Temple dress material stitched by you?",
        answer:
          "We supply the unstitched material. However, we can recommend trusted local tailors in Odisha or guide you on the best cut for this fabric. WhatsApp us for guidance.",
      },
    ],
  },
  // ─── Cut Pieces ───────────────────────────────────
  {
    id: "AH-CP-001",
    name: "Sambalpuri Silk Cut Piece — Royal Indigo",
    price: 2400,
    image: "/images/saree-hero-1.png",
    category: "cut-pieces-silk",
    section: "cut-pieces",
    categoryLabel: "Silk Cut Piece",
    sectionLabel: "Cut Pieces",
    weaveTime: "Per meter",
    artisanOrigin: "Sonepur, Odisha",
    threadCount: "120 TPI",
    fabric: "Pure Mulberry Silk",
    length: "Per meter (min. 1m)",
    description:
      "Premium Sambalpuri Ikat silk fabric sold by the meter. Perfect for blouses, home furnishings, cushion covers, or bespoke fashion. The deep indigo double-ikat weave is identical in quality to our finest sarees.",
    details: [
      "Pure Mulberry Silk",
      "Double Ikat Technique",
      "Natural Indigo Dye",
      "44 inch width",
      "Price per meter — minimum 1 meter",
    ],
    inStock: true,
    artisanStory:
      "These cut pieces are offcuts and dedicated weaves from the same looms that produce our signature sarees. Every meter carries the same artisanal quality and traditional Sambalpuri Ikat patterns.",
    careInstructions: [
      "Dry clean recommended",
      "Store in a muslin or cotton wrap",
      "Avoid direct sunlight",
      "Handle with clean hands to protect the silk",
    ],
    faqItems: [
      {
        question: "What is the minimum quantity for the Royal Indigo silk cut piece?",
        answer:
          "The minimum order is 1 meter. For blouse pieces, 0.8–1m is sufficient. For dupatta or home furnishings, 2–3m is recommended. Contact us on WhatsApp for custom lengths.",
      },
      {
        question: "Can I use this silk cut piece for a blouse to match my saree?",
        answer:
          "Absolutely! Our silk cut pieces are specifically popular for blouse pieces to pair with Sambalpuri sarees. The indigo pattern will complement most of our saree collection beautifully.",
      },
    ],
  },
  {
    id: "AH-CP-002",
    name: "Ikat Cotton Cut Piece — Sunrise Geometric",
    price: 850,
    image: "/images/saree-product-4.png",
    category: "cut-pieces-cotton",
    section: "cut-pieces",
    categoryLabel: "Cotton Cut Piece",
    sectionLabel: "Cut Pieces",
    weaveTime: "Per meter",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "85 TPI",
    fabric: "Pure Handloom Cotton",
    length: "Per meter (min. 1m)",
    description:
      "Vibrant orange, yellow, and white geometric Ikat cotton fabric by the meter. Ideal for kurtas, shirts, home decor, and DIY fashion projects. Lightweight, breathable, and beautifully hand-woven.",
    details: [
      "Pure Handloom Cotton",
      "Single Ikat Weave",
      "Geometric Motifs",
      "Vegetable-Based Dyes",
      "44 inch width — price per meter",
    ],
    inStock: true,
    artisanStory:
      "Woven in the Bargarh district — the heartland of Sambalpuri Ikat — this cotton fabric brings the same centuries-old weaving expertise to an everyday medium. Perfect for those who want Ikat in their daily wardrobe.",
    careInstructions: [
      "Machine wash cold on gentle cycle",
      "Use mild detergent",
      "Air dry in shade",
      "Iron at medium heat",
    ],
    faqItems: [
      {
        question: "Is the Sunrise Geometric cotton Ikat suitable for men's shirts?",
        answer:
          "Yes! The geometric pattern and lightweight cotton make it perfect for men's shirts, nehru jackets, and kurtas as well as women's kurtas and dresses.",
      },
    ],
  },
  {
    id: "AH-CP-003",
    name: "Silk Blouse Piece — Peacock Zari",
    price: 1600,
    image: "/images/saree-detail-2.png",
    category: "cut-pieces-blouse",
    section: "cut-pieces",
    categoryLabel: "Blouse Piece",
    sectionLabel: "Cut Pieces",
    weaveTime: "5 Days",
    artisanOrigin: "Bargarh, Odisha",
    threadCount: "100 TPI",
    fabric: "Pure Tussar Silk",
    length: "0.8m × 1.1m",
    description:
      "A pre-cut silk blouse piece in Tussar silk with delicate peacock and gold zari accents. Ready for the tailor — perfectly sized for a standard blouse with matching border.",
    details: [
      "Pure Tussar Silk",
      "Gold Zari Peacock Border",
      "Pre-cut 0.8m × 1.1m",
      "Matches AH-002 Raktapadma",
      "Ready for stitching",
    ],
    inStock: true,
    artisanStory:
      "Designed to perfectly match the Raktapadma saree (AH-002), this blouse piece is woven as a coordinated set by the same Bargarh women's cooperative. The peacock zari border ensures a harmonious complete look.",
    careInstructions: [
      "Dry clean recommended",
      "Store folded in cotton wrap",
      "Iron on reverse side at low heat",
    ],
    faqItems: [
      {
        question: "Does this blouse piece match any saree in your collection?",
        answer:
          "The Peacock Zari blouse piece is designed to perfectly complement our Raktapadma saree (AH-002). It also pairs well with other burgundy or gold-toned ethnic outfits.",
      },
    ],
  },
];

export const sections = [
  {
    id: "sarees",
    label: "Sarees",
    description: "Authentic Sambalpuri Ikat Silk Sarees",
    emoji: "🥻",
  },
  {
    id: "ladies-wear",
    label: "Ladies Wear",
    description: "Kurtas, Dupattas & Dress Materials",
    emoji: "👗",
  },
  {
    id: "cut-pieces",
    label: "Cut Pieces",
    description: "Silk & Cotton Ikat Fabric by the Meter",
    emoji: "✂️",
  },
];

export const categoryBySections: Record<
  string,
  { id: string; label: string }[]
> = {
  sarees: [
    { id: "all", label: "All Sarees" },
    { id: "pure-silk", label: "Pure Silk" },
    { id: "traditional-ikat", label: "Traditional Ikat" },
    { id: "exclusive-masterpieces", label: "Exclusive Masterpieces" },
  ],
  "ladies-wear": [
    { id: "all", label: "All Ladies Wear" },
    { id: "ladies-wear-kurta", label: "Kurta Sets" },
    { id: "ladies-wear-dupatta", label: "Dupattas" },
    { id: "ladies-wear-dress-material", label: "Dress Materials" },
  ],
  "cut-pieces": [
    { id: "all", label: "All Cut Pieces" },
    { id: "cut-pieces-silk", label: "Silk Fabric" },
    { id: "cut-pieces-cotton", label: "Cotton Fabric" },
    { id: "cut-pieces-blouse", label: "Blouse Pieces" },
  ],
};

// Legacy - kept for backward compat
export const categories = [
  { id: "all", label: "All Masterpieces" },
  { id: "pure-silk", label: "Pure Silk" },
  { id: "traditional-ikat", label: "Traditional Ikat" },
  { id: "exclusive-masterpieces", label: "Exclusive Masterpieces" },
  { id: "ladies-wear-kurta", label: "Kurta Sets" },
  { id: "ladies-wear-dupatta", label: "Dupattas" },
  { id: "ladies-wear-dress-material", label: "Dress Materials" },
  { id: "cut-pieces-silk", label: "Silk Cut Pieces" },
  { id: "cut-pieces-cotton", label: "Cotton Cut Pieces" },
  { id: "cut-pieces-blouse", label: "Blouse Pieces" },
];
