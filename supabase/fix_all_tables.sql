-- FIX ALL TABLES - Comprehensive Migration Script
-- Run this SQL in Supabase Dashboard: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
-- This will add any missing columns to existing tables

-- ===================================
-- FIX RAW MATERIALS TABLE
-- ===================================

-- Add category column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'raw_materials' AND column_name = 'category'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN category TEXT;
    RAISE NOTICE '✅ Added category column to raw_materials';
  END IF;
END $$;

-- Add description column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'raw_materials' AND column_name = 'description'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Added description column to raw_materials';
  END IF;
END $$;

-- Add image_url column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'raw_materials' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN image_url TEXT;
    RAISE NOTICE '✅ Added image_url column to raw_materials';
  END IF;
END $$;

-- Add reorder_link column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'raw_materials' AND column_name = 'reorder_link'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN reorder_link TEXT;
    RAISE NOTICE '✅ Added reorder_link column to raw_materials';
  END IF;
END $$;

-- Add updated_at column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'raw_materials' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ Added updated_at column to raw_materials';
  END IF;
END $$;

-- ===================================
-- FIX FINISHED PRODUCTS TABLE
-- ===================================

-- Add image_url column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finished_products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE finished_products ADD COLUMN image_url TEXT;
    RAISE NOTICE '✅ Added image_url column to finished_products';
  END IF;
END $$;

-- Add updated_at column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finished_products' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE finished_products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ Added updated_at column to finished_products';
  END IF;
END $$;

-- ===================================
-- FIX PACKAGING MATERIALS TABLE
-- ===================================

-- Add image_url column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packaging_materials' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE packaging_materials ADD COLUMN image_url TEXT;
    RAISE NOTICE '✅ Added image_url column to packaging_materials';
  END IF;
END $$;

-- Add reorder_link column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packaging_materials' AND column_name = 'reorder_link'
  ) THEN
    ALTER TABLE packaging_materials ADD COLUMN reorder_link TEXT;
    RAISE NOTICE '✅ Added reorder_link column to packaging_materials';
  END IF;
END $$;

-- Add updated_at column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packaging_materials' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE packaging_materials ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ Added updated_at column to packaging_materials';
  END IF;
END $$;

-- ===================================
-- CREATE INDEXES IF MISSING
-- ===================================

-- Raw materials indexes
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_raw_materials_created ON raw_materials(created_at DESC);

-- Finished products indexes
CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_finished_products_created ON finished_products(created_at DESC);

-- Packaging materials indexes
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_created ON packaging_materials(created_at DESC);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- ===================================
-- UPDATE TRIGGERS
-- ===================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for each table
DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at
  BEFORE UPDATE ON raw_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at
  BEFORE UPDATE ON finished_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
  BEFORE UPDATE ON packaging_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- VERIFY TABLE STRUCTURES
-- ===================================

-- Show raw_materials structure
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📋 RAW MATERIALS TABLE STRUCTURE:';
END $$;

SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;

-- Show finished_products structure
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📋 FINISHED PRODUCTS TABLE STRUCTURE:';
END $$;

SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'finished_products'
ORDER BY ordinal_position;

-- Show packaging_materials structure
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📋 PACKAGING MATERIALS TABLE STRUCTURE:';
END $$;

SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'packaging_materials'
ORDER BY ordinal_position;

-- ===================================
-- SUCCESS MESSAGE
-- ===================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ================================';
  RAISE NOTICE '✅ ALL TABLES FIXED SUCCESSFULLY!';
  RAISE NOTICE '🎉 ================================';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '1. Refresh your Mnemosyne app';
  RAISE NOTICE '2. Try adding a raw material';
  RAISE NOTICE '3. Check console for success message';
  RAISE NOTICE '';
  RAISE NOTICE '💎 Mnemosyne is ready to use!';
END $$;
