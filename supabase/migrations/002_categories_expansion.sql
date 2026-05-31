-- Migration 002: Expand product categories to support 3 sections
-- Sections: sarees | ladies-wear | cut-pieces
-- Run this on your Supabase dashboard under SQL Editor

-- 1. Drop existing category constraint if any
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- 2. Add new section column
ALTER TABLE products ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'sarees'
  CHECK (section IN ('sarees', 'ladies-wear', 'cut-pieces'));

-- 3. Add new category values to the check constraint
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN (
    -- Sarees
    'pure-silk',
    'traditional-ikat',
    'exclusive-masterpieces',
    -- Ladies Wear
    'ladies-wear-kurta',
    'ladies-wear-dupatta',
    'ladies-wear-dress-material',
    -- Cut Pieces
    'cut-pieces-silk',
    'cut-pieces-cotton',
    'cut-pieces-blouse'
  ));

-- 4. Add new metadata columns for product detail pages
ALTER TABLE products ADD COLUMN IF NOT EXISTS section_label TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS length TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS artisan_story TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 5. Seed Ladies Wear products
INSERT INTO products (id, name, price, original_price, image, category, section, category_label, section_label, weave_time, artisan_origin, thread_count, fabric, "length", description, in_stock, artisan_story)
VALUES
  (
    'AH-LW-001',
    'Ikat Silk Kurta Set — Indigo Bloom',
    4800, 6000,
    '/images/saree-hero-1.png',
    'ladies-wear-kurta', 'ladies-wear',
    'Ikat Kurta Set', 'Ladies Wear',
    '12 Days', 'Bargarh, Odisha', '90 TPI',
    'Pure Cotton Ikat',
    'Kurta 46" + Dupatta 2.5m',
    'An elegant daily-wear kurta set in deep indigo and white Ikat print. Crafted from hand-woven pure cotton, this kurta brings authentic Sambalpuri Ikat artistry to contemporary fashion.',
    TRUE,
    'Crafted by the Bargarh women''s weaving cooperative, this kurta set brings the centuries-old Ikat tradition to everyday fashion.'
  ),
  (
    'AH-LW-002',
    'Sambalpuri Dupatta — Crimson Peacock',
    1800, NULL,
    '/images/saree-detail-2.png',
    'ladies-wear-dupatta', 'ladies-wear',
    'Sambalpuri Dupatta', 'Ladies Wear',
    '8 Days', 'Sonepur, Odisha', '85 TPI',
    'Pure Cotton',
    '2.5m × 0.75m',
    'A stunning hand-woven dupatta in crimson and gold with the iconic peacock motif. Pairs beautifully with any ethnic or fusion outfit.',
    TRUE,
    'Woven by Smt. Meena Pradhan of Sonepur, this dupatta is a testament to the skill of Odisha''s women weavers.'
  ),
  (
    'AH-LW-003',
    'Ikat Cotton Dress Material — Golden Temple',
    3200, NULL,
    '/images/saree-product-4.png',
    'ladies-wear-dress-material', 'ladies-wear',
    'Dress Material', 'Ladies Wear',
    '10 Days', 'Boudh, Odisha', '88 TPI',
    'Pure Cotton',
    '3m top + 2.5m dupatta',
    'Unstitched dress material in golden-yellow cotton Ikat with a classic temple border pattern.',
    TRUE,
    'Inspired by the ancient temples of Odisha, this dress material uses a temple border pattern passed down through Boudh district weavers.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  section = EXCLUDED.section,
  section_label = EXCLUDED.section_label;

-- 6. Seed Cut Pieces products
INSERT INTO products (id, name, price, original_price, image, category, section, category_label, section_label, weave_time, artisan_origin, thread_count, fabric, "length", description, in_stock, artisan_story)
VALUES
  (
    'AH-CP-001',
    'Sambalpuri Silk Cut Piece — Royal Indigo',
    2400, NULL,
    '/images/saree-hero-1.png',
    'cut-pieces-silk', 'cut-pieces',
    'Silk Cut Piece', 'Cut Pieces',
    'Per meter', 'Sonepur, Odisha', '120 TPI',
    'Pure Mulberry Silk',
    'Per meter (min. 1m)',
    'Premium Sambalpuri Ikat silk fabric sold by the meter. Perfect for blouses, home furnishings, cushion covers, or bespoke fashion.',
    TRUE,
    'These cut pieces are offcuts and dedicated weaves from the same looms that produce our signature sarees.'
  ),
  (
    'AH-CP-002',
    'Ikat Cotton Cut Piece — Sunrise Geometric',
    850, NULL,
    '/images/saree-product-4.png',
    'cut-pieces-cotton', 'cut-pieces',
    'Cotton Cut Piece', 'Cut Pieces',
    'Per meter', 'Bargarh, Odisha', '85 TPI',
    'Pure Handloom Cotton',
    'Per meter (min. 1m)',
    'Vibrant orange, yellow, and white geometric Ikat cotton fabric by the meter. Ideal for kurtas, shirts, home decor, and DIY fashion projects.',
    TRUE,
    'Woven in the Bargarh district — the heartland of Sambalpuri Ikat — this cotton fabric brings the same centuries-old weaving expertise to an everyday medium.'
  ),
  (
    'AH-CP-003',
    'Silk Blouse Piece — Peacock Zari',
    1600, NULL,
    '/images/saree-detail-2.png',
    'cut-pieces-blouse', 'cut-pieces',
    'Blouse Piece', 'Cut Pieces',
    '5 Days', 'Bargarh, Odisha', '100 TPI',
    'Pure Tussar Silk',
    '0.8m × 1.1m',
    'A pre-cut silk blouse piece in Tussar silk with delicate peacock and gold zari accents. Ready for the tailor.',
    TRUE,
    'Designed to perfectly match the Raktapadma saree (AH-002), this blouse piece is woven as a coordinated set by the same Bargarh cooperative.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  section = EXCLUDED.section,
  section_label = EXCLUDED.section_label;

-- 7. Update existing saree products with section = 'sarees'
UPDATE products SET
  section = 'sarees',
  section_label = 'Sarees'
WHERE id IN ('AH-001', 'AH-002', 'AH-003', 'AH-004', 'AH-005', 'AH-006');
