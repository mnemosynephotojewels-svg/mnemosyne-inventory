-- =====================================================
-- MNEMOSYNE - CREATE ALL TABLES (COMPLETE VERSION)
-- =====================================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "Run" button
-- This version includes ALL columns needed by the app
-- =====================================================

-- Drop existing tables if you want to start fresh (OPTIONAL - removes all data!)
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS finished_products CASCADE;
-- DROP TABLE IF EXISTS packaging_materials CASCADE;
-- DROP TABLE IF EXISTS raw_materials CASCADE;

-- 1. RAW MATERIALS TABLE (Complete with all columns)
CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    description TEXT,
    monthly_threshold NUMERIC DEFAULT 0,
    reorder_link TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PACKAGING MATERIALS TABLE (Complete with all columns)
CREATE TABLE IF NOT EXISTS packaging_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    description TEXT,
    monthly_threshold NUMERIC DEFAULT 0,
    reorder_link TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FINISHED PRODUCTS TABLE (Complete with all columns)
CREATE TABLE IF NOT EXISTS finished_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    sub_category TEXT,
    gender TEXT,
    quantity NUMERIC NOT NULL DEFAULT 0,
    stock NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    bill_of_materials JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    material_name TEXT,
    quantity NUMERIC,
    description TEXT,
    category TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_category ON packaging_materials(category);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_finished_products_category ON finished_products(category);
CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update triggers
DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at
    BEFORE UPDATE ON raw_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
    BEFORE UPDATE ON packaging_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at
    BEFORE UPDATE ON finished_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON raw_materials TO anon, authenticated;
GRANT ALL ON packaging_materials TO anon, authenticated;
GRANT ALL ON finished_products TO anon, authenticated;
GRANT ALL ON activity_logs TO anon, authenticated;

-- Disable RLS (Row Level Security) for simplicity
ALTER TABLE raw_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- Verification: Show all columns for each table
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('raw_materials', 'packaging_materials', 'finished_products', 'activity_logs')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- ✅ COMPLETE! All tables created with ALL columns:
--
-- RAW_MATERIALS (11 columns):
--   - id, name, stock, unit, category, description
--   - monthly_threshold, reorder_link, image_url
--   - created_at, updated_at
--
-- PACKAGING_MATERIALS (11 columns):
--   - id, name, stock, unit, category, description
--   - monthly_threshold, reorder_link, image_url
--   - created_at, updated_at
--
-- FINISHED_PRODUCTS (12 columns):
--   - id, name, category, sub_category, gender
--   - quantity, stock, description, bill_of_materials
--   - image_url, created_at, updated_at
--
-- ACTIVITY_LOGS (6 columns):
--   - id, action, material_name, quantity
--   - description, category, timestamp
-- =====================================================
