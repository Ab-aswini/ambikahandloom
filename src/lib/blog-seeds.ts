export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-001",
    slug: "journey-of-ikat-saree-from-weaver-to-wardrobe",
    title: "The Journey of an Ikat Saree: From Weaver to Wardrobe",
    excerpt: "Discover the incredible 45-60 day journey of a Sambalpuri Ikat saree — from the hands of master weavers in Odisha to your wardrobe. A story of mathematics, artistry, and heritage.",
    content: `<h2>The Ancient Art of Resist-Dyeing</h2>
<p>In the weaving clusters of Sonepur and Bargarh in western Odisha, master artisans begin a process that transforms raw silk threads into mathematical masterpieces — Sambalpuri Ikat sarees.</p>
<p>The word "Ikat" comes from the Malay-Indonesian term "mengikat," meaning "to tie." This resist-dyeing technique, perfected over 800 years in Odisha, involves tying individual threads with wax-coated string before dipping them into natural dye baths. The result? Patterns that seem to emerge from within the fabric itself.</p>

<h2>Step 1: Thread Preparation (Days 1-5)</h2>
<p>The journey begins with selecting the finest mulberry silk threads. Each thread is carefully measured, grouped, and prepared for the tying process. A single saree requires over 4,000 individual threads, each of which must be precisely positioned.</p>

<h2>Step 2: Tying & Dyeing (Days 5-20)</h2>
<p>This is where the mathematics comes in. The artisan must calculate exactly where each color will appear in the final design — and tie the threads accordingly. Each knot placement determines a pixel in the pattern. After tying, the threads are submerged in natural dyes made from indigo plants, turmeric, and other local botanicals.</p>

<h2>Step 3: The Weaving (Days 20-50)</h2>
<p>Once dyed, the threads are loaded onto a traditional wooden handloom. The weaver works with both warp and weft threads (in double-Ikat, both sets are pre-dyed), requiring extraordinary precision to align the patterns at every intersection.</p>

<h2>Step 4: Finishing & Quality Check (Days 50-60)</h2>
<p>The completed saree is inspected, steamed, and finished. Each piece is unique — no two Ikat sarees are exactly alike, owing to the handmade nature of the resist-dyeing and weaving process.</p>

<h2>Why This Matters</h2>
<p>When you purchase an authentic Sambalpuri Ikat saree from Ambika Handloom, you're not just buying fabric. You're investing in a 45-60 day journey of human skill, mathematical precision, and cultural heritage. You're directly supporting artisan families who have kept this tradition alive for generations.</p>
<p>Every thread tells a story. Every saree is a masterpiece.</p>`,
    coverImage: "/images/saree-product-3.png",
    category: "Heritage",
    tags: ["Sambalpuri Ikat", "weaving process", "handloom heritage", "Odisha textiles", "artisan craft"],
    author: "Ambika Handloom",
    published: true,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "blog-002",
    slug: "how-to-identify-authentic-sambalpuri-sarees",
    title: "How to Identify Authentic Sambalpuri Sarees: A Complete Guide",
    excerpt: "Learn the 7 key signs that distinguish a genuine handwoven Sambalpuri Ikat saree from a powerloom imitation. Protect yourself from fakes with this expert guide.",
    content: `<h2>The Growing Problem of Fake Sambalpuri Sarees</h2>
<p>With the rising popularity of Sambalpuri Ikat sarees, the market has been flooded with powerloom imitations that are passed off as handwoven originals. These fakes not only cheat customers but also undermine the livelihoods of genuine artisans. Here's how to tell the difference.</p>

<h2>1. Check the Reverse Side</h2>
<p>The most reliable test: flip the saree over. In a genuine Ikat saree, the pattern appears <strong>equally clear on both sides</strong>. This is because the threads are dyed before weaving. In a printed or powerloom saree, the reverse side will show a faded or blurred pattern.</p>

<h2>2. Look for Slight Irregularities</h2>
<p>Handwoven Ikat patterns have a characteristic slight blur or "feathering" at the edges of motifs. This is the natural result of the resist-dyeing process. Machine-made patterns are perfectly sharp and uniform — too perfect to be handmade.</p>

<h2>3. Feel the Fabric Weight</h2>
<p>Authentic silk Ikat sarees have a distinctive weight and drape. Pure mulberry silk feels cool to the touch and has a natural sheen that changes with light. Synthetic alternatives feel slippery and have an artificial shine.</p>

<h2>4. Examine the Selvedge (Edge)</h2>
<p>The side edges of a handwoven saree (called selvedge) are slightly uneven and may show where the weaver turned the shuttle. Powerloom sarees have perfectly even, machine-finished edges.</p>

<h2>5. Burn Test</h2>
<p>Pull a small thread from the saree edge and carefully burn it. Pure silk smells like burning hair and leaves a crushable ash. Synthetic fibers melt into a hard bead and smell like burning plastic.</p>

<h2>6. GI Tag Certification</h2>
<p>Sambalpuri Ikat has a Geographical Indication (GI) tag from the Government of India. Look for the GI certification label or ask the seller for provenance documentation.</p>

<h2>7. Price Check</h2>
<p>A genuine handwoven Sambalpuri silk saree takes 45-60 days to create. If the price seems too good to be true (under ₹3,000 for silk), it's almost certainly a powerloom imitation. Authentic pieces typically range from ₹5,000 to ₹25,000 depending on complexity.</p>

<h2>Buy With Confidence</h2>
<p>At Ambika Handloom, every saree comes with artisan provenance details — you'll know exactly which weaver created your masterpiece and which village it was woven in. We source directly from master artisans, guaranteeing authenticity.</p>`,
    coverImage: "/images/saree-hero-1.png",
    category: "Guide",
    tags: ["buying guide", "authentic saree", "handloom vs powerloom", "Sambalpuri identification", "fake saree"],
    author: "Ambika Handloom",
    published: true,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "blog-003",
    slug: "handloom-vs-powerloom-why-the-difference-matters",
    title: "Handloom vs Powerloom: Why the Difference Matters",
    excerpt: "Understanding the critical differences between handloom and powerloom textiles — and why choosing handloom supports artisan families, preserves heritage, and delivers superior quality.",
    content: `<h2>Not All Sarees Are Created Equal</h2>
<p>In today's market, it's easy to confuse handloom and powerloom textiles. Both produce beautiful fabrics, but the similarities end there. The choice between handloom and powerloom has profound implications for quality, heritage, and the lives of artisan communities.</p>

<h2>What is Handloom?</h2>
<p>Handloom weaving is done entirely by hand on a wooden loom operated by foot pedals. The weaver controls every thread, every tension, and every pattern. A single saree takes 30-60 days of dedicated work. The result is a unique textile with character, breathability, and a natural drape that machines simply cannot replicate.</p>

<h2>What is Powerloom?</h2>
<p>Powerloom textiles are machine-produced, often replicating handloom patterns at a fraction of the cost and time. A powerloom can produce 10-15 sarees in the time it takes a handloom weaver to create one. While cheaper, powerloom fabrics lack the organic texture, breathability, and uniqueness of handwoven textiles.</p>

<h2>Key Differences</h2>
<h3>Quality & Comfort</h3>
<p>Handloom fabric is more breathable and comfortable in tropical climates because the varied tension of hand-weaving creates micro-gaps in the fabric. Powerloom fabric, with its uniform machine tension, is denser and less breathable.</p>

<h3>Uniqueness</h3>
<p>Every handloom saree is one-of-a-kind. The natural variations in handwork — slight differences in tension, dye absorption, and pattern alignment — give each piece its unique character. Powerloom sarees are identical copies.</p>

<h3>Environmental Impact</h3>
<p>Handloom weaving uses zero electricity and has a negligible carbon footprint. A single powerloom unit consumes significant electricity and contributes to industrial pollution.</p>

<h3>Economic Impact</h3>
<p>Handloom weaving supports entire artisan communities — each saree sold provides direct income to weavers and their families. Powerloom production concentrates profits in factory owners' hands while displacing traditional artisans.</p>

<h2>The Human Cost of Choosing Powerloom</h2>
<p>India's handloom sector employs over 3.5 million weavers, making it the second-largest employer after agriculture. But with the rise of cheap powerloom imitations, weaver incomes have plummeted. Many families have abandoned the craft entirely.</p>

<p>When you choose a genuine handloom saree from Ambika Handloom, you're casting a vote for heritage preservation, fair wages, and sustainable fashion. You're directly supporting the artisans of Odisha who have kept the Sambalpuri Ikat tradition alive for over 800 years.</p>

<h2>Make the Conscious Choice</h2>
<p>The next time you shop for a saree, ask yourself: do I want a mass-produced copy, or a genuine work of art that supports an entire community? The choice is clear.</p>`,
    coverImage: "/images/saree-detail-2.png",
    category: "Guide",
    tags: ["handloom vs powerloom", "sustainable fashion", "ethical fashion", "weaver support", "handloom benefits"],
    author: "Ambika Handloom",
    published: true,
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
];

export function getBlogPostBySlugServer(slug: string): BlogPost | null {
  return SEED_BLOG_POSTS.find((p) => p.slug === slug) || null;
}
