-- =====================================================
-- MNEMOSYNE INVENTORY MANAGEMENT SYSTEM
-- Supabase Database Schema
-- =====================================================
-- 
-- This SQL script creates all necessary tables for the
-- Mnemosyne inventory management system.
--
-- Tables:
--   1. raw_materials
--   2. packaging_materials
--   3. finished_products
--   4. activity_logs
--
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. RAW MATERIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS raw_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  category TEXT,
  description TEXT,
  image_url TEXT,
  reorder_link TEXT,
  monthly_threshold NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_raw_materials_created_at ON raw_materials(created_at);

-- Add comment
COMMENT ON TABLE raw_materials IS 'Stores raw materials inventory with stock tracking and monthly thresholds';

-- =====================================================
-- 2. PACKAGING MATERIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS packaging_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'units',
  image_url TEXT,
  reorder_link TEXT,
  monthly_threshold NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_created_at ON packaging_materials(created_at);

-- Add comment
COMMENT ON TABLE packaging_materials IS 'Stores packaging materials inventory with stock tracking';

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_finished_products_category ON finished_products(category);
CREATE INDEX IF NOT EXISTS idx_finished_products_gender ON finished_products(gender);
CREATE INDEX IF NOT EXISTS idx_finished_products_created_at ON finished_products(created_at);
CREATE INDEX IF NOT EXISTS idx_finished_products_bill_of_materials ON finished_products USING GIN(bill_of_materials);

-- Add comment
COMMENT ON TABLE finished_products IS 'Stores finished products with Bill of Materials (BOM) in JSONB format';
COMMENT ON COLUMN finished_products.bill_of_materials IS 'Array of objects: [{"material_id": "uuid", "quantity": number, "type": "raw|packaging"}]';

-- =====================================================
-- 4. ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  product_name TEXT,
  material_name TEXT,
  packaging_name TEXT,
  quantity NUMERIC,
  quantity_change NUMERIC,
  affected_materials JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  details TEXT,
  category TEXT,
  item_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_item_id ON activity_logs(item_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_affected_materials ON activity_logs USING GIN(affected_materials);

-- Add comment
COMMENT ON TABLE activity_logs IS 'Comprehensive activity log tracking all inventory operations';
COMMENT ON COLUMN activity_logs.affected_materials IS 'Array of objects: [{"materialName": "string", "quantity": number}]';

-- =====================================================
-- 5. AUTOMATIC TIMESTAMP UPDATES
-- =====================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for raw_materials
DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at
  BEFORE UPDATE ON raw_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for packaging_materials
DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
  BEFORE UPDATE ON packaging_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for finished_products
DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at
  BEFORE UPDATE ON finished_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) - DISABLED FOR NOW
-- =====================================================
-- Note: RLS is disabled to allow open access during development
-- Enable this later when you add user authentication

-- Disable RLS on all tables (default for development)
ALTER TABLE raw_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. SAMPLE DATA (OPTIONAL - DELETE IF NOT NEEDED)
-- =====================================================
-- Uncomment the section below to add sample data for testing

/*
-- Sample Raw Materials
INSERT INTO raw_materials (name, stock, unit, category, description, monthly_threshold) VALUES
('Cotton Fabric', 500, 'meters', 'Textiles', 'High-quality cotton fabric', 100),
('Polyester Thread', 1000, 'spools', 'Sewing Supplies', 'Durable polyester thread', 200),
('Metal Buttons', 2000, 'pieces', 'Hardware', 'Silver metal buttons', 500);

-- Sample Packaging Materials
INSERT INTO packaging_materials (name, stock, unit, monthly_threshold) VALUES
('Cardboard Boxes', 200, 'boxes', 50),
('Plastic Bags', 500, 'bags', 100),
('Tissue Paper', 300, 'sheets', 75);

-- Sample Finished Product
INSERT INTO finished_products (name, category, sub_category, gender, quantity, stock, bill_of_materials) VALUES
('Classic T-Shirt', 'Apparel', 'Tops', 'Unisex', 50, 50, 
 '[{"material_id": "get-id-from-raw-materials", "quantity": 2, "type": "raw"}]'::jsonb);

-- Sample Activity Log
INSERT INTO activity_logs (action, material_name, quantity, description, category) VALUES
('MATERIAL_ADDED', 'Cotton Fabric', 500, 'Initial stock added', 'raw_material');
*/

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================
-- 
-- Your Mnemosyne database is ready to use!
--
-- Next steps:
-- 1. Update your app's supabase.ts with new credentials
-- 2. Test the connection by adding a material
-- 3. Check the Table Editor to see your data
--
-- =====================================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('raw_materials', 'packaging_materials', 'finished_products', 'activity_logs')
ORDER BY table_name;
