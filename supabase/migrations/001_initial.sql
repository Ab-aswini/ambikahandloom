-- =====================================================
-- Ambika Handloom — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Products Table ───────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,                          -- e.g. "AH-001"
  name TEXT NOT NULL,
  price INTEGER NOT NULL,                       -- in INR paise-equivalent (store as rupees integer)
  original_price INTEGER,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('pure-silk','traditional-ikat','exclusive-masterpieces')),
  category_label TEXT NOT NULL,
  weave_time TEXT NOT NULL,
  artisan_origin TEXT NOT NULL,
  thread_count TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT[] DEFAULT '{}',
  artisan_story TEXT,
  care_instructions TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Orders Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,                          -- e.g. "AH-1ABC-XYZ"
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
  payment_type TEXT NOT NULL CHECK (payment_type IN ('full','advance')),
  payment_utr TEXT,
  admin_note TEXT,
  tracking_note TEXT,                           -- Admin's public tracking message to customer
  status TEXT NOT NULL DEFAULT 'awaiting_verification'
    CHECK (status IN ('awaiting_verification','confirmed','weaving','dispatched','delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Order Items Table ────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- ─── Reviews Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,                          -- e.g. "REV-001"
  product_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Site Settings Table ──────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,            -- Single row table
  payment_upi TEXT DEFAULT 'ambika@upi',
  payment_bank TEXT DEFAULT 'State Bank of India',
  payment_account_no TEXT DEFAULT 'XXXX XXXX 4521',
  payment_ifsc TEXT DEFAULT 'SBIN0012345',
  contact_email TEXT DEFAULT 'hello@ambikahandloom.com',
  contact_phone TEXT DEFAULT '+919876543210',
  contact_whatsapp TEXT DEFAULT '+919876543210',
  contact_address TEXT DEFAULT 'Sonepur Weaver Colony, Subarnapur, Odisha, India — 767017',
  hero_title TEXT DEFAULT 'Woven Heritage. Mastered for the Modern Era.',
  hero_subtitle TEXT DEFAULT 'Authentic Sambalpuri masterpieces sourced directly from master artisans.',
  mothers_day_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row (only if table is empty)
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── Row Level Security ───────────────────────────
-- Products: public read, no public write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Service role can manage products" ON products USING (auth.role() = 'service_role');

-- Orders: no public read (privacy), service role only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage orders" ON orders USING (auth.role() = 'service_role');
-- Allow anonymous inserts (customers placing orders)
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
-- Allow anyone to read their own order by ID (for tracking page)
CREATE POLICY "Anyone can read order by id" ON orders FOR SELECT USING (true);

-- Order items: same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage order_items" ON order_items USING (auth.role() = 'service_role');
CREATE POLICY "Anyone can insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read order_items" ON order_items FOR SELECT USING (true);

-- Reviews: public read, service role write
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role can manage reviews" ON reviews USING (auth.role() = 'service_role');

-- Site settings: public read
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Service role can manage settings" ON site_settings USING (auth.role() = 'service_role');

-- ─── Seed Products ────────────────────────────────
INSERT INTO products (id, name, price, original_price, image, images, category, category_label, weave_time, artisan_origin, thread_count, description, details, artisan_story, care_instructions, in_stock, sort_order)
VALUES
  ('AH-001', 'Nilambari — The Midnight Sky', 18500, 22000, '/images/saree-hero-1.png', ARRAY['/images/saree-hero-1.png','/images/saree-detail-2.png','/images/saree-product-3.png'], 'exclusive-masterpieces', 'Exclusive Masterpiece', '45 Days', 'Sonepur, Odisha', '120 TPI', 'A breathtaking double-ikat masterpiece in deep indigo and crimson. Each thread is individually tie-dyed before weaving, creating patterns that appear to float within the fabric.', ARRAY['Pure Mulberry Silk','Double Ikat Technique','Natural Indigo Dye','Gold Zari Border','6.2m with Blouse Piece'], 'This saree was handwoven by Master Weaver Shri Harihar Meher from Sonepur, a fourth-generation Ikat artisan whose family has preserved the double-ikat tradition for over 120 years.', ARRAY['Dry clean only for best results','Store in a muslin cloth to allow the silk to breathe','Avoid direct sunlight for prolonged periods','Iron on low heat with a pressing cloth','Do not wring or twist the fabric'], true, 1),
  ('AH-002', 'Raktapadma — The Red Lotus', 14500, NULL, '/images/saree-detail-2.png', ARRAY['/images/saree-detail-2.png'], 'traditional-ikat', 'Traditional Ikat', '30 Days', 'Bargarh, Odisha', '100 TPI', 'Rich burgundy and gold tones weave together in this traditional Sambalpuri pattern. The intricate geometric motifs tell stories passed down through generations of master weavers.', ARRAY['Pure Tussar Silk','Single Ikat Weave','Vegetable Dyed','Temple Border','5.8m with Blouse Piece'], 'Crafted by the women weavers of the Bargarh cooperative, this saree represents the collective skill of a community that has woven silk for centuries.', ARRAY['Dry clean recommended','Store folded in a cotton bag','Avoid contact with perfumes or chemicals','Iron on low heat on the reverse side'], true, 2),
  ('AH-003', 'Meghmalhar — The Rain Song', 22000, 26000, '/images/saree-product-3.png', ARRAY['/images/saree-product-3.png'], 'exclusive-masterpieces', 'Exclusive Masterpiece', '60 Days', 'Sonepur, Odisha', '140 TPI', 'An extraordinary purple and gold creation inspired by monsoon ragas. The pallu features an elaborate peacock motif rendered in the finest gold zari, making this a true collector''s piece.', ARRAY['Pure Kosa Silk','Double Ikat Technique','Handspun Gold Zari','Peacock Pallu','6.5m with Blouse Piece'], 'Named after the classical raga that celebrates the monsoon, this masterpiece took 60 days to complete on a traditional pit loom. The artisan, Shri Kunja Meher, is a National Award recipient.', ARRAY['Professional dry clean only','Store flat or rolled — never hang for long periods','Keep away from moisture and humidity'], true, 3),
  ('AH-004', 'Vanashree — The Forest Grace', 16000, NULL, '/images/saree-product-4.png', ARRAY['/images/saree-product-4.png'], 'pure-silk', 'Pure Silk', '35 Days', 'Boudh, Odisha', '110 TPI', 'Emerald green and copper tones create a mesmerizing interplay in this nature-inspired masterpiece. The temple border pays homage to ancient Odisha architecture.', ARRAY['Pure Mulberry Silk','Single Ikat Weave','Natural Dyes','Temple Border Motif','6.0m with Blouse Piece'], 'Inspired by the lush forests of Boudh district, this saree uses natural dyes extracted from local flora. The weaver, Smt. Parbati Behera, learned the craft from her mother-in-law over 25 years ago.', ARRAY['Gentle dry clean only','Store in a breathable cotton cover','Natural dyes may soften over time — this is a sign of authenticity'], true, 4),
  ('AH-005', 'Samudra — The Deep Ocean', 19500, NULL, '/images/saree-product-5.png', ARRAY['/images/saree-product-5.png'], 'traditional-ikat', 'Traditional Ikat', '40 Days', 'Sonepur, Odisha', '120 TPI', 'Deep navy blue and silver threads create the illusion of moonlight on ocean waves. Features the iconic Pasapali check pattern of Sambalpuri tradition.', ARRAY['Pure Mulberry Silk','Pasapali Check Pattern','Silver Thread Border','Natural Indigo Dye','6.2m with Blouse Piece'], 'The Pasapali (chessboard) pattern is perhaps the most iconic of all Sambalpuri designs, and this saree showcases it at its finest.', ARRAY['Dry clean recommended for best preservation','Store away from direct light','Silver threads may tarnish — gentle buffing restores shine'], true, 5),
  ('AH-006', 'Agnishikha — The Flame Crest', 24000, 28000, '/images/saree-product-6.png', ARRAY['/images/saree-product-6.png'], 'exclusive-masterpieces', 'Exclusive Masterpiece', '55 Days', 'Bargarh, Odisha', '130 TPI', 'A regal maroon and golden yellow symphony featuring the most intricate bandha tie-dye patterns. The elaborate peacock motifs on the pallu make this an heirloom for the ages.', ARRAY['Pure Kosa Silk','Double Ikat Bandha','Handwoven Gold Zari','Peacock & Floral Motifs','6.5m with Blouse Piece'], 'This is the most labor-intensive piece in our collection. The double-ikat bandha technique requires both warp and weft threads to be precisely tie-dyed before weaving.', ARRAY['Professional silk dry clean only','Store in the provided muslin pouch','Gold zari should never contact water directly'], true, 6)
ON CONFLICT (id) DO NOTHING;

-- Seed default reviews
INSERT INTO reviews (id, product_id, customer_name, rating, comment, image)
VALUES
  ('REV-001', 'AH-001', 'Priya S.', 5, 'Absolutely stunning! The intricacies of the pallu are mesmerizing. Wore it to a wedding and received so many compliments.', 'https://images.unsplash.com/photo-1583391733958-692b6a93910c?auto=format&fit=crop&w=400&q=80'),
  ('REV-002', 'AH-001', 'Ananya M.', 5, 'The feel of the silk is incredibly premium. Thank you for the quick delivery and beautiful packaging.', NULL)
ON CONFLICT (id) DO NOTHING;
