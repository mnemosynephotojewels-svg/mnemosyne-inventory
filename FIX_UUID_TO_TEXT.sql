-- =====================================================
-- FIX UUID ERROR - Change ID columns from UUID to TEXT
-- =====================================================
-- The app generates custom string IDs, not UUIDs
-- This changes all ID columns from UUID type to TEXT type
-- =====================================================

-- 1. Drop existing tables and recreate with TEXT IDs
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS finished_products CASCADE;
DROP TABLE IF EXISTS packaging_materials CASCADE;
DROP TABLE IF EXISTS raw_materials CASCADE;

-- 2. RAW MATERIALS TABLE (with TEXT id)
CREATE TABLE raw_materials (
    id TEXT PRIMARY KEY,
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

-- 3. PACKAGING MATERIALS TABLE (with TEXT id)
CREATE TABLE packaging_materials (
    id TEXT PRIMARY KEY,
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

-- 4. FINISHED PRODUCTS TABLE (with TEXT id)
CREATE TABLE finished_products (
    id TEXT PRIMARY KEY,
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

-- 5. ACTIVITY LOGS TABLE (with TEXT id)
CREATE TABLE activity_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    material_name TEXT,
    quantity NUMERIC,
    description TEXT,
    category TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_raw_materials_category ON raw_materials(category);
CREATE INDEX idx_raw_materials_name ON raw_materials(name);
CREATE INDEX idx_packaging_materials_category ON packaging_materials(category);
CREATE INDEX idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX idx_finished_products_category ON finished_products(category);
CREATE INDEX idx_finished_products_name ON finished_products(name);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update triggers
CREATE TRIGGER update_raw_materials_updated_at
    BEFORE UPDATE ON raw_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packaging_materials_updated_at
    BEFORE UPDATE ON packaging_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Verification: Show table structure
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
-- ✅ DONE! All tables recreated with TEXT IDs
-- Now your app can use custom string IDs like:
-- "raw-1773037715378-pevgvgoug" ✅
-- =====================================================
