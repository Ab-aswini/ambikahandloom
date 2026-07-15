-- =====================================================
-- Ambika Handloom — Supabase Database Schema (CONSOLIDATED)
-- Run this FIRST in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Products Table ───────────────────────────────
CREATE TABLE IF NOT EXISTS products (
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

-- Category validation (drop first to make idempotent)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN (
    -- Sarees
    'pure-silk', 'traditional-ikat', 'exclusive-masterpieces',
    -- Ladies Wear
    'ladies-wear-kurta', 'ladies-wear-dupatta', 'ladies-wear-dress-material',
    -- Cut Pieces
    'cut-pieces-silk', 'cut-pieces-cotton', 'cut-pieces-blouse'
  ));

-- Section validation (drop first to make idempotent)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_section_check;
ALTER TABLE products ADD CONSTRAINT products_section_check
  CHECK (section IN ('sarees', 'ladies-wear', 'cut-pieces'));

-- ─── Orders Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
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
  image TEXT,                                   -- single review image
  images TEXT[] DEFAULT '{}',                   -- multiple review images
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Site Settings Table (Single Row) ─────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- enforces single row
  -- Payment
  payment_upi TEXT DEFAULT 'ambika@upi',
  payment_bank TEXT DEFAULT 'State Bank of India',
  payment_account_no TEXT DEFAULT 'XXXX XXXX 4521',
  payment_ifsc TEXT DEFAULT 'SBIN0012345',
  -- Contact
  contact_email TEXT DEFAULT 'hello@ambikahandloom.in',
  contact_phone TEXT DEFAULT '+918658476300',
  contact_whatsapp TEXT DEFAULT '+918658476300',
  contact_address TEXT DEFAULT 'Sonepur Weaver Colony, Subarnapur, Odisha, India — 767017',
  -- Hero
  hero_title TEXT DEFAULT 'Woven Heritage. Mastered for the Modern Era.',
  hero_subtitle TEXT DEFAULT 'Authentic Sambalpuri masterpieces sourced directly from master artisans.',
  -- Dynamic Promotions (admin-configurable for any occasion/festival)
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
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════

-- Products: public read, anon can insert/update (for admin panel with anon key)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Orders: public read (for tracking), public insert (for checkout)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true);

-- Order items: same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete order_items" ON order_items FOR DELETE USING (true);

-- Reviews: public read, public write (admin panel uses anon key)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reviews" ON reviews FOR DELETE USING (true);

-- Site settings: public read, public update (admin panel uses anon key)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON site_settings FOR UPDATE USING (true);

-- ═══════════════════════════════════════════════════
-- STORAGE BUCKET (for product images)
-- ═══════════════════════════════════════════════════
-- NOTE: Run this separately if Supabase SQL Editor doesn't support storage commands.
-- You can also create the bucket from Dashboard → Storage → New Bucket.

-- Create public bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow anyone to upload product images (admin panel uses anon key)
CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- ═══════════════════════════════════════════════════
-- SEED DATA — All 12 Products
-- ═══════════════════════════════════════════════════

-- ─── Sarees (6 products) ──────────────────────────
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

-- ─── Ladies Wear (3 products) ─────────────────────
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

-- ─── Cut Pieces (3 products) ──────────────────────
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
