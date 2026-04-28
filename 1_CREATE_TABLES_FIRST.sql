-- =====================================================
-- MNEMOSYNE - DATABASE SCHEMA
-- =====================================================
-- RUN THIS FIRST before loading sample data!
-- This creates all 4 required tables
-- =====================================================

-- =====================================================
-- 1. RAW MATERIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    description TEXT,
    monthly_threshold NUMERIC,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);

-- =====================================================
-- 2. PACKAGING MATERIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS packaging_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    monthly_threshold NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);

-- =====================================================
-- 3. FINISHED PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS finished_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    sub_category TEXT,
    gender TEXT,
    quantity NUMERIC NOT NULL DEFAULT 0,
    stock NUMERIC NOT NULL DEFAULT 0,
    bill_of_materials JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_finished_products_category ON finished_products(category);
CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_finished_products_gender ON finished_products(gender);

-- =====================================================
-- 4. ACTIVITY LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    material_name TEXT,
    quantity NUMERIC,
    description TEXT,
    category TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON activity_logs(category);

-- =====================================================
-- 5. UPDATE TIMESTAMP TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to raw_materials
DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at
    BEFORE UPDATE ON raw_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to packaging_materials
DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
    BEFORE UPDATE ON packaging_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to finished_products
DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at
    BEFORE UPDATE ON finished_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Note: For now, we'll keep RLS disabled for simplicity
-- You can enable it later if you need user-specific access control

ALTER TABLE raw_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated and anon roles
GRANT ALL ON raw_materials TO anon, authenticated;
GRANT ALL ON packaging_materials TO anon, authenticated;
GRANT ALL ON finished_products TO anon, authenticated;
GRANT ALL ON activity_logs TO anon, authenticated;

-- =====================================================
-- 8. VERIFICATION
-- =====================================================

-- Check that all tables were created successfully
SELECT 
    'raw_materials' as table_name, 
    COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'raw_materials' AND table_schema = 'public'

UNION ALL

SELECT 
    'packaging_materials' as table_name, 
    COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'packaging_materials' AND table_schema = 'public'

UNION ALL

SELECT 
    'finished_products' as table_name, 
    COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'finished_products' AND table_schema = 'public'

UNION ALL

SELECT 
    'activity_logs' as table_name, 
    COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'activity_logs' AND table_schema = 'public';

-- =====================================================
-- ✅ SCHEMA CREATION COMPLETE!
-- =====================================================
-- 
-- You should see:
--   raw_materials:       10 columns ✅
--   packaging_materials:  7 columns ✅
--   finished_products:   10 columns ✅
--   activity_logs:        6 columns ✅
--
-- Next step: Run SAMPLE_DATA.sql to load sample data
-- =====================================================
