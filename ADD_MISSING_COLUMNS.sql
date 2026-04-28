-- =====================================================
-- FIX MISSING COLUMNS ERROR
-- =====================================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "Run" button
-- =====================================================

-- Add missing columns to RAW_MATERIALS table
ALTER TABLE raw_materials 
  ADD COLUMN IF NOT EXISTS reorder_link TEXT;

-- Add missing columns to PACKAGING_MATERIALS table  
ALTER TABLE packaging_materials 
  ADD COLUMN IF NOT EXISTS reorder_link TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT;

-- Add missing columns to FINISHED_PRODUCTS table (just in case)
ALTER TABLE finished_products 
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify columns were added
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('raw_materials', 'packaging_materials', 'finished_products')
  AND column_name IN ('reorder_link', 'image_url', 'description', 'category')
ORDER BY table_name, column_name;

-- =====================================================
-- ✅ DONE! Your tables now have all required columns:
--    - raw_materials: +reorder_link
--    - packaging_materials: +reorder_link, +image_url, +description, +category
--    - finished_products: +description
-- =====================================================
