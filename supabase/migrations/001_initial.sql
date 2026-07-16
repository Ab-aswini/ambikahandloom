-- =====================================================
-- Ambika Handloom — Supabase Database Schema (CONSOLIDATED)
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- Drop existing tables to allow clean re-injection
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Products Table ───────────────────────────────
CREATE TABLE products (
  id TEXT PRIMARY KEY,                          -- e.g. "AH-001", "AH-LW-001"
  name TEXT NOT NULL,
  price INTEGER NOT NULL,                       -- in INR (rupees as integer)
  original_price INTEGER,                       -- strikethrough price (nullable)
  image TEXT NOT NULL,                          -- main product image URL/path
  images TEXT[] DEFAULT '{}',                   -- gallery image URLs
  category TEXT NOT NULL,                       -- e.g. 'pure-silk', 'ladies-wear-kurta'
  category_label TEXT NOT NULL,                 -- human-readable e.g. "Pure Silk"
  section TEXT NOT NULL DEFAULT 'sarees',       -- 'sarees' | 'ladies-wear' | 'cut-pieces'
  section_label TEXT,                           -- human-readable e.g. "Sarees"
  weave_time TEXT NOT NULL,                     -- e.g. "45 Days"
  artisan_origin TEXT NOT NULL,                 -- e.g. "Sonepur, Odisha"
  thread_count TEXT NOT NULL,                   -- e.g. "120 TPI"
  description TEXT NOT NULL,
  details TEXT[] DEFAULT '{}',                  -- bullet points
  artisan_story TEXT,                           -- artisan narrative
  care_instructions TEXT[] DEFAULT '{}',        -- care tips
  fabric TEXT,                                  -- e.g. "Pure Mulberry Silk"
  length TEXT,                                  -- e.g. "6.2m with Blouse Piece"
  in_stock BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category validation
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN (
    -- Sarees
    'pure-silk', 'traditional-ikat', 'exclusive-masterpieces',
    -- Ladies Wear
    'ladies-wear-kurta', 'ladies-wear-dupatta', 'ladies-wear-dress-material',
    -- Cut Pieces
    'cut-pieces-silk', 'cut-pieces-cotton', 'cut-pieces-blouse'
  ));

-- Section validation
ALTER TABLE products ADD CONSTRAINT products_section_check
  CHECK (section IN ('sarees', 'ladies-wear', 'cut-pieces'));

-- ─── Orders Table ─────────────────────────────────
CREATE TABLE orders (
  id TEXT PRIMARY KEY,                          -- e.g. "AH-M1ABC-XYZ"
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_pincode TEXT NOT NULL,
  is_gift BOOLEAN DEFAULT false,
  gift_message TEXT DEFAULT '',
  total_price INTEGER NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('full', 'advance')),
  payment_utr TEXT,                             -- UPI transaction reference
  admin_note TEXT,                              -- private admin-only note
  tracking_note TEXT,                           -- public tracking message to customer
  status TEXT NOT NULL DEFAULT 'awaiting_verification'
    CHECK (status IN ('awaiting_verification', 'confirmed', 'weaving', 'dispatched', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Order Items Table ────────────────────────────
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- ─── Reviews Table ────────────────────────────────
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,                          -- e.g. "REV-001"
  product_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  image TEXT,                                   -- single review image
  images TEXT[] DEFAULT '{}',                   -- multiple review images
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Site Settings Table (Single Row) ─────────────
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- enforces single row
  payment_upi TEXT DEFAULT 'ambika@upi',
  payment_bank TEXT DEFAULT 'State Bank of India',
  payment_account_no TEXT DEFAULT 'XXXX XXXX 4521',
  payment_ifsc TEXT DEFAULT 'SBIN0012345',
  contact_email TEXT DEFAULT 'hello@ambikahandloom.in',
  contact_phone TEXT DEFAULT '+918658476300',
  contact_whatsapp TEXT DEFAULT '+918658476300',
  contact_address TEXT DEFAULT 'Sonepur Weaver Colony, Subarnapur, Odisha, India — 767017',
  hero_title TEXT DEFAULT 'Woven Heritage. Mastered for the Modern Era.',
  hero_subtitle TEXT DEFAULT 'Authentic Sambalpuri masterpieces sourced directly from master artisans.',
  promotion_enabled BOOLEAN DEFAULT true,
  promotion_badge TEXT DEFAULT 'Special Collection',
  promotion_title TEXT DEFAULT 'Gift Heritage, Celebrate Tradition',
  promotion_subtitle TEXT DEFAULT 'Every Sambalpuri Ikat saree carries centuries of tradition, woven with the love and skill of master artisans.',
  promotion_emoji TEXT DEFAULT '✨',
  promotion_features JSONB DEFAULT '[
    {"emoji": "🎁", "title": "Premium Gift Packaging", "description": "Every saree arrives in an exquisite handcrafted box with a personalized note."},
    {"emoji": "✨", "title": "Certificate of Authenticity", "description": "Each masterpiece comes with a signed certificate from the artisan who wove it."},
    {"emoji": "💌", "title": "Personal Message Card", "description": "Add a heartfelt message on our handmade cotton rag paper card, tucked inside the gift box."}
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Blog Posts Table ─────────────────────────────
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT 'Ambika Handloom',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true);

-- Order items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete order_items" ON order_items FOR DELETE USING (true);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reviews" ON reviews FOR DELETE USING (true);

-- Site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON site_settings FOR UPDATE USING (true);

-- Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update blog_posts" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete blog_posts" ON blog_posts FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- ═══════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════

-- ─── Products (12 items) ──────────────────────────
INSERT INTO products (id, name, price, original_price, image, images, category, category_label, section, section_label, weave_time, artisan_origin, thread_count, description, details, artisan_story, care_instructions, in_stock, sort_order)
VALUES
  ('AH-001', 'Nilambari — The Midnight Sky', 18500, 22000,
   '/images/saree-hero-1.png',
   ARRAY['/images/saree-hero-1.png', '/images/saree-detail-2.png', '/images/saree-product-3.png'],
   'exclusive-masterpieces', 'Exclusive Masterpiece', 'sarees', 'Sarees',
   '45 Days', 'Sonepur, Odisha', '120 TPI',
   'A breathtaking double-ikat masterpiece in deep indigo and crimson. Each thread is individually tie-dyed before weaving, creating patterns that appear to float within the fabric.',
   ARRAY['Pure Mulberry Silk', 'Double Ikat Technique', 'Natural Indigo Dye', 'Gold Zari Border', '6.2m with Blouse Piece'],
   'This saree was handwoven by Master Weaver Shri Harihar Meher from Sonepur, a fourth-generation Ikat artisan whose family has preserved the double-ikat tradition for over 120 years.',
   ARRAY['Dry clean only for best results', 'Store in a muslin cloth to allow the silk to breathe', 'Avoid direct sunlight for prolonged periods', 'Iron on low heat with a pressing cloth', 'Do not wring or twist the fabric'],
   true, 1),

  ('AH-002', 'Raktapadma — The Red Lotus', 14500, NULL,
   '/images/saree-detail-2.png', ARRAY['/images/saree-detail-2.png'],
   'traditional-ikat', 'Traditional Ikat', 'sarees', 'Sarees',
   '30 Days', 'Bargarh, Odisha', '100 TPI',
   'Rich burgundy and gold tones weave together in this traditional Sambalpuri pattern.',
   ARRAY['Pure Tussar Silk', 'Single Ikat Weave', 'Vegetable Dyed', 'Temple Border', '5.8m with Blouse Piece'],
   'Crafted by the women weavers of the Bargarh cooperative.',
   ARRAY['Dry clean recommended', 'Store folded in a cotton bag', 'Avoid contact with perfumes or chemicals', 'Iron on low heat on the reverse side'],
   true, 2),

  ('AH-003', 'Meghmalhar — The Rain Song', 22000, 26000,
   '/images/saree-product-3.png', ARRAY['/images/saree-product-3.png'],
   'exclusive-masterpieces', 'Exclusive Masterpiece', 'sarees', 'Sarees',
   '60 Days', 'Sonepur, Odisha', '140 TPI',
   'An extraordinary purple and gold creation inspired by monsoon ragas.',
   ARRAY['Pure Kosa Silk', 'Double Ikat Technique', 'Handspun Gold Zari', 'Peacock Pallu', '6.5m with Blouse Piece'],
   'Named after the classical raga that celebrates the monsoon, this masterpiece took 60 days to complete.',
   ARRAY['Professional dry clean only', 'Store flat or rolled — never hang for long periods', 'Keep away from moisture and humidity'],
   true, 3),

  ('AH-004', 'Vanashree — The Forest Grace', 16000, NULL,
   '/images/saree-product-4.png', ARRAY['/images/saree-product-4.png'],
   'pure-silk', 'Pure Silk', 'sarees', 'Sarees',
   '35 Days', 'Boudh, Odisha', '110 TPI',
   'Emerald green and copper tones create a mesmerizing interplay in this nature-inspired masterpiece.',
   ARRAY['Pure Mulberry Silk', 'Single Ikat Weave', 'Natural Dyes', 'Temple Border Motif', '6.0m with Blouse Piece'],
   'Inspired by the lush forests of Boudh district, this saree uses natural dyes extracted from local flora.',
   ARRAY['Gentle dry clean only', 'Store in a breathable cotton cover', 'Natural dyes may soften over time — this is a sign of authenticity'],
   true, 4),

  ('AH-005', 'Samudra — The Deep Ocean', 19500, NULL,
   '/images/saree-product-5.png', ARRAY['/images/saree-product-5.png'],
   'traditional-ikat', 'Traditional Ikat', 'sarees', 'Sarees',
   '40 Days', 'Sonepur, Odisha', '120 TPI',
   'Deep navy blue and silver threads create the illusion of moonlight on ocean waves.',
   ARRAY['Pure Mulberry Silk', 'Pasapali Check Pattern', 'Silver Thread Border', 'Natural Indigo Dye', '6.2m with Blouse Piece'],
   'The Pasapali (chessboard) pattern is perhaps the most iconic of all Sambalpuri designs.',
   ARRAY['Dry clean recommended for best preservation', 'Store away from direct light', 'Silver threads may tarnish — gentle buffing restores shine'],
   true, 5),

  ('AH-006', 'Agnishikha — The Flame Crest', 24000, 28000,
   '/images/saree-product-6.png', ARRAY['/images/saree-product-6.png'],
   'exclusive-masterpieces', 'Exclusive Masterpiece', 'sarees', 'Sarees',
   '55 Days', 'Bargarh, Odisha', '130 TPI',
   'A regal maroon and golden yellow symphony featuring the most intricate bandha tie-dye patterns.',
   ARRAY['Pure Kosa Silk', 'Double Ikat Bandha', 'Handwoven Gold Zari', 'Peacock & Floral Motifs', '6.5m with Blouse Piece'],
   'This is the most labor-intensive piece in our collection.',
   ARRAY['Professional silk dry clean only', 'Store in the provided muslin pouch', 'Gold zari should never contact water directly'],
   true, 6)
ON CONFLICT (id) DO NOTHING;

-- ─── Ladies Wear ──────────────────────────────────
INSERT INTO products (id, name, price, original_price, image, category, category_label, section, section_label, weave_time, artisan_origin, thread_count, fabric, length, description, details, artisan_story, in_stock, sort_order)
VALUES
  ('AH-LW-001', 'Ikat Silk Kurta Set — Indigo Bloom', 4800, 6000,
   '/images/saree-hero-1.png',
   'ladies-wear-kurta', 'Ikat Kurta Set', 'ladies-wear', 'Ladies Wear',
   '12 Days', 'Bargarh, Odisha', '90 TPI',
   'Pure Cotton Ikat', 'Kurta 46" + Dupatta 2.5m',
   'An elegant daily-wear kurta set in deep indigo and white Ikat print.',
   ARRAY['Pure Cotton Ikat', 'Hand-woven', 'Natural Dyes', 'Comfortable Fit'],
   'Crafted by the Bargarh women''s weaving cooperative.',
   true, 7),

  ('AH-LW-002', 'Sambalpuri Dupatta — Crimson Peacock', 1800, NULL,
   '/images/saree-detail-2.png',
   'ladies-wear-dupatta', 'Sambalpuri Dupatta', 'ladies-wear', 'Ladies Wear',
   '8 Days', 'Sonepur, Odisha', '85 TPI',
   'Pure Cotton', '2.5m × 0.75m',
   'A stunning hand-woven dupatta in crimson and gold with the iconic peacock motif.',
   ARRAY['Pure Cotton', 'Hand-woven Ikat', 'Peacock Motif', 'Versatile Styling'],
   'Woven by Smt. Meena Pradhan of Sonepur.',
   true, 8),

  ('AH-LW-003', 'Ikat Cotton Dress Material — Golden Temple', 3200, NULL,
   '/images/saree-product-4.png',
   'ladies-wear-dress-material', 'Dress Material', 'ladies-wear', 'Ladies Wear',
   '10 Days', 'Boudh, Odisha', '88 TPI',
   'Pure Cotton', '3m top + 2.5m dupatta',
   'Unstitched dress material in golden-yellow cotton Ikat with a classic temple border pattern.',
   ARRAY['Pure Cotton', 'Ikat Weave', 'Temple Border', 'Unstitched'],
   'Inspired by the ancient temples of Odisha.',
   true, 9)
ON CONFLICT (id) DO NOTHING;

-- ─── Cut Pieces ───────────────────────────────────
INSERT INTO products (id, name, price, original_price, image, category, category_label, section, section_label, weave_time, artisan_origin, thread_count, fabric, length, description, details, artisan_story, in_stock, sort_order)
VALUES
  ('AH-CP-001', 'Sambalpuri Silk Cut Piece — Royal Indigo', 2400, NULL,
   '/images/saree-hero-1.png',
   'cut-pieces-silk', 'Silk Cut Piece', 'cut-pieces', 'Cut Pieces',
   'Per meter', 'Sonepur, Odisha', '120 TPI',
   'Pure Mulberry Silk', 'Per meter (min. 1m)',
   'Premium Sambalpuri Ikat silk fabric sold by the meter.',
   ARRAY['Pure Mulberry Silk', 'Ikat Pattern', 'By the Meter', 'Multi-purpose'],
   'These cut pieces are from the same looms that produce our signature sarees.',
   true, 10),

  ('AH-CP-002', 'Ikat Cotton Cut Piece — Sunrise Geometric', 850, NULL,
   '/images/saree-product-4.png',
   'cut-pieces-cotton', 'Cotton Cut Piece', 'cut-pieces', 'Cut Pieces',
   'Per meter', 'Bargarh, Odisha', '85 TPI',
   'Pure Handloom Cotton', 'Per meter (min. 1m)',
   'Vibrant orange, yellow, and white geometric Ikat cotton fabric by the meter.',
   ARRAY['Pure Handloom Cotton', 'Geometric Ikat', 'By the Meter', 'DIY Friendly'],
   'Woven in the Bargarh district — the heartland of Sambalpuri Ikat.',
   true, 11),

  ('AH-CP-003', 'Silk Blouse Piece — Peacock Zari', 1600, NULL,
   '/images/saree-detail-2.png',
   'cut-pieces-blouse', 'Blouse Piece', 'cut-pieces', 'Cut Pieces',
   '5 Days', 'Bargarh, Odisha', '100 TPI',
   'Pure Tussar Silk', '0.8m × 1.1m',
   'A pre-cut silk blouse piece in Tussar silk with delicate peacock and gold zari accents.',
   ARRAY['Pure Tussar Silk', 'Peacock Motif', 'Gold Zari', 'Pre-cut'],
   'Designed to match the Raktapadma saree (AH-002).',
   true, 12)
ON CONFLICT (id) DO NOTHING;

-- ─── Seed Reviews ─────────────────────────────────
INSERT INTO reviews (id, product_id, customer_name, rating, comment, image)
VALUES
  ('REV-001', 'AH-001', 'Priya S.', 5,
   'Absolutely stunning! The intricacies of the pallu are mesmerizing. Wore it to a wedding and received so many compliments.',
   'https://images.unsplash.com/photo-1583391733958-692b6a93910c?auto=format&fit=crop&w=400&q=80'),
  ('REV-002', 'AH-001', 'Ananya M.', 5,
   'The feel of the silk is incredibly premium. Thank you for the quick delivery and beautiful packaging.',
   NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── Seed Blog Posts ──────────────────────────────
INSERT INTO blog_posts (id, slug, title, excerpt, content, cover_image, category, tags, author, published, created_at, updated_at)
VALUES
  ('blog-001',
   'journey-of-ikat-saree-from-weaver-to-wardrobe',
   'The Journey of an Ikat Saree: From Weaver to Wardrobe',
   'Discover the incredible 45-60 day journey of a Sambalpuri Ikat saree — from the hands of master weavers in Odisha to your wardrobe. A story of mathematics, artistry, and heritage.',
   '<h2>The Ancient Art of Resist-Dyeing</h2><p>In the weaving clusters of Sonepur and Bargarh in western Odisha, master artisans begin a process that transforms raw silk threads into mathematical masterpieces — Sambalpuri Ikat sarees.</p><p>The word "Ikat" comes from the Malay-Indonesian term "mengikat," meaning "to tie." This resist-dyeing technique, perfected over 800 years in Odisha, involves tying individual threads with wax-coated string before dipping them into natural dye baths. The result? Patterns that seem to emerge from within the fabric itself.</p><h2>Step 1: Thread Preparation (Days 1-5)</h2><p>The journey begins with selecting the finest mulberry silk threads. Each thread is carefully measured, grouped, and prepared for the tying process. A single saree requires over 4,000 individual threads, each of which must be precisely positioned.</p><h2>Step 2: Tying & Dyeing (Days 5-20)</h2><p>This is where the mathematics comes in. The artisan must calculate exactly where each color will appear in the final design — and tie the threads accordingly. Each knot placement determines a pixel in the pattern. After tying, the threads are submerged in natural dyes made from indigo plants, turmeric, and other local botanicals.</p><h2>Step 3: The Weaving (Days 20-50)</h2><p>Once dyed, the threads are loaded onto a traditional wooden handloom. The weaver works with both warp and weft threads (in double-Ikat, both sets are pre-dyed), requiring extraordinary precision to align the patterns at every intersection.</p><h2>Step 4: Finishing & Quality Check (Days 50-60)</h2><p>The completed saree is inspected, steamed, and finished. Each piece is unique — no two Ikat sarees are exactly alike, owing to the handmade nature of the resist-dyeing and weaving process.</p><h2>Why This Matters</h2><p>When you purchase an authentic Sambalpuri Ikat saree from Ambika Handloom, you''re not just buying fabric. You''re investing in a 45-60 day journey of human skill, mathematical precision, and cultural heritage. You''re directly supporting artisan families who have kept this tradition alive for generations.</p><p>Every thread tells a story. Every saree is a masterpiece.</p>',
   '/images/saree-product-3.png',
   'Heritage',
   '["Sambalpuri Ikat", "weaving process", "handloom heritage", "Odisha textiles", "artisan craft"]'::jsonb,
   'Ambika Handloom',
   true,
   '2025-12-15T10:00:00Z',
   '2025-12-15T10:00:00Z'),

  ('blog-002',
   'how-to-identify-authentic-sambalpuri-sarees',
   'How to Identify Authentic Sambalpuri Sarees: A Complete Guide',
   'Learn the 7 key signs that distinguish a genuine handwoven Sambalpuri Ikat saree from a powerloom imitation. Protect yourself from fakes with this expert guide.',
   '<h2>The Growing Problem of Fake Sambalpuri Sarees</h2><p>With the rising popularity of Sambalpuri Ikat sarees, the market has been flooded with powerloom imitations that are passed off as handwoven originals. These fakes not only cheat customers but also undermine the livelihoods of genuine artisans. Here''s how to tell the difference.</p><h2>1. Check the Reverse Side</h2><p>The most reliable test: flip the saree over. In a genuine Ikat saree, the pattern appears <strong>equally clear on both sides</strong>. This is because the threads are dyed before weaving. In a printed or powerloom saree, the reverse side will show a faded or blurred pattern.</p><h2>2. Look for Slight Irregularities</h2><p>Handwoven Ikat patterns have a characteristic slight blur or "feathering" at the edges of motifs. This is the natural result of the resist-dyeing process. Machine-made patterns are perfectly sharp and uniform — too perfect to be handmade.</p><h2>3. Feel the Fabric Weight</h2><p>Authentic silk Ikat sarees have a distinctive weight and drape. Pure mulberry silk feels cool to the touch and has a natural sheen that changes with light. Synthetic alternatives feel slippery and have an artificial shine.</p><h2>4. Examine the Selvedge (Edge)</h2><p>The side edges of a handwoven saree (called selvedge) are slightly uneven and may show where the weaver turned the shuttle. Powerloom sarees have perfectly even, machine-finished edges.</p><h2>5. Burn Test</h2><p>Pull a small thread from the saree edge and carefully burn it. Pure silk smells like burning hair and leaves a crushable ash. Synthetic fibers melt into a hard bead and smell like burning plastic.</p><h2>6. GI Tag Certification</h2><p>Sambalpuri Ikat has a Geographical Indication (GI) tag from the Government of India. Look for the GI certification label or ask the seller for provenance documentation.</p><h2>7. Price Check</h2><p>A genuine handwoven Sambalpuri silk saree takes 45-60 days to create. If the price seems too good to be true (under ₹3,000 for silk), it''s almost certainly a powerloom imitation. Authentic pieces typically range from ₹5,000 to ₹25,000 depending on complexity.</p><h2>Buy With Confidence</h2><p>At Ambika Handloom, every saree comes with artisan provenance details — you''ll know exactly which weaver created your masterpiece and which village it was woven in. We source directly from master artisans, guaranteeing authenticity.</p>',
   '/images/saree-hero-1.png',
   'Guide',
   '["buying guide", "authentic saree", "handloom vs powerloom", "Sambalpuri identification", "fake saree"]'::jsonb,
   'Ambika Handloom',
   true,
   '2026-01-10T10:00:00Z',
   '2026-01-10T10:00:00Z'),

  ('blog-003',
   'handloom-vs-powerloom-why-the-difference-matters',
   'Handloom vs Powerloom: Why the Difference Matters',
   'Understanding the critical differences between handloom and powerloom textiles — and why choosing handloom supports artisan families, preserves heritage, and delivers superior quality.',
   '<h2>Not All Sarees Are Created Equal</h2><p>In today''s market, it''s easy to confuse handloom and powerloom textiles. Both produce beautiful fabrics, but the similarities end there. The choice between handloom and powerloom has profound implications for quality, heritage, and the lives of artisan communities.</p><h2>What is Handloom?</h2><p>Handloom weaving is done entirely by hand on a wooden loom operated by foot pedals. The weaver controls every thread, every tension, and every pattern. A single saree takes 30-60 days of dedicated work. The result is a unique textile with character, breathability, and a natural drape that machines simply cannot replicate.</p><h2>What is Powerloom?</h2><p>Powerloom textiles are machine-produced, often replicating handloom patterns at a fraction of the cost and time. A powerloom can produce 10-15 sarees in the time it takes a handloom weaver to create one. While cheaper, powerloom fabrics lack the organic texture, breathability, and uniqueness of handwoven textiles.</p><h2>Key Differences</h2><h3>Quality & Comfort</h3><p>Handloom fabric is more breathable and comfortable in tropical climates because the varied tension of hand-weaving creates micro-gaps in the fabric. Powerloom fabric, with its uniform machine tension, is denser and less breathable.</p><h3>Uniqueness</h3><p>Every handloom saree is one-of-a-kind. The natural variations in handwork — slight differences in tension, dye absorption, and pattern alignment — give each piece its unique character. Powerloom sarees are identical copies.</p><h3>Environmental Impact</h3><p>Handloom weaving uses zero electricity and has a negligible carbon footprint. A single powerloom unit consumes significant electricity and contributes to industrial pollution.</p><h3>Economic Impact</h3><p>Handloom weaving supports entire artisan communities — each saree sold provides direct income to weavers and their families. Powerloom production concentrates profits in factory owners'' hands while displacing traditional artisans.</p><h2>The Human Cost of Choosing Powerloom</h2><p>India''s handloom sector employs over 3.5 million weavers, making it the second-largest employer after agriculture. But with the rise of cheap powerloom imitations, weaver incomes have plummeted. Many families have abandoned the craft entirely.</p><p>When you choose a genuine handloom saree from Ambika Handloom, you''re casting a vote for heritage preservation, fair wages, and sustainable fashion. You''re directly supporting the artisans of Odisha who have kept the Sambalpuri Ikat tradition alive for over 800 years.</p><h2>Make the Conscious Choice</h2><p>The next time you shop for a saree, ask yourself: do I want a mass-produced copy, or a genuine work of art that supports an entire community? The choice is clear.</p>',
   '/images/saree-detail-2.png',
   'Guide',
   '["handloom vs powerloom", "sustainable fashion", "ethical fashion", "weaver support", "handloom benefits"]'::jsonb,
   'Ambika Handloom',
   true,
   '2026-02-20T10:00:00Z',
   '2026-02-20T10:00:00Z')
ON CONFLICT (id) DO NOTHING;
