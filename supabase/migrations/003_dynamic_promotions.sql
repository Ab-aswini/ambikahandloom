-- Migration 003: Replace mothers_day_enabled with dynamic promotion system
-- This allows the admin to configure promotions for any occasion/festival
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- 1. Add new promotion columns to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_enabled BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_badge TEXT DEFAULT 'Mother''s Day Special';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_title TEXT DEFAULT 'This Mother''s Day, Gift Heritage';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_subtitle TEXT DEFAULT 'Every Sambalpuri Ikat saree carries centuries of tradition, woven with the love and skill of master artisans. Gift your mother a masterpiece that tells a story — a thread-by-thread testament to timeless beauty and enduring love.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_emoji TEXT DEFAULT '❤️';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotion_features JSONB DEFAULT '[
  {"emoji": "🎁", "title": "Premium Gift Packaging", "description": "Every saree arrives in an exquisite handcrafted box with a personalized note."},
  {"emoji": "✨", "title": "Certificate of Authenticity", "description": "Each masterpiece comes with a signed certificate from the artisan who wove it."},
  {"emoji": "💌", "title": "Personal Message Card", "description": "Add a heartfelt message on our handmade cotton rag paper card, tucked inside the gift box."}
]'::jsonb;

-- 2. Migrate existing mothers_day_enabled value to promotion_enabled
UPDATE site_settings SET promotion_enabled = mothers_day_enabled WHERE mothers_day_enabled IS NOT NULL;

-- 3. Note: We keep the mothers_day_enabled column for backward compatibility
-- The code gracefully falls back: promotion_enabled ?? mothers_day_enabled ?? true
