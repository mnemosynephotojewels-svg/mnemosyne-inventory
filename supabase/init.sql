-- Mnemosyne Inventory System - Database Initialization
-- Run this SQL in Supabase Dashboard: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

-- ===================================
-- PACKAGING MATERIALS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS packaging_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  reorder_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow all operations on packaging_materials" ON packaging_materials;
CREATE POLICY "Allow all operations on packaging_materials" 
  ON packaging_materials 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_created ON packaging_materials(created_at DESC);

-- ===================================
-- RAW MATERIALS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS raw_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  reorder_link TEXT,
  monthly_threshold INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on raw_materials" ON raw_materials;
CREATE POLICY "Allow all operations on raw_materials" 
  ON raw_materials 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);

-- ===================================
-- FINISHED PRODUCTS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS finished_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  bill_of_materials JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on finished_products" ON finished_products;
CREATE POLICY "Allow all operations on finished_products" 
  ON finished_products 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);

-- ===================================
-- ACTIVITY LOGS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  quantity NUMERIC,
  product_name TEXT,
  material_name TEXT,
  packaging_name TEXT,
  affected_materials JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on activity_logs" ON activity_logs;
CREATE POLICY "Allow all operations on activity_logs" 
  ON activity_logs 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- ===================================
-- TRIGGERS FOR UPDATED_AT
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
DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
  BEFORE UPDATE ON packaging_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- ===================================
-- SUCCESS MESSAGE
-- ===================================

DO $$
BEGIN
  RAISE NOTICE '✅ Mnemosyne database tables created successfully!';
  RAISE NOTICE '🎉 You can now use the app with full database sync!';
  RAISE NOTICE '📝 Refresh your Mnemosyne app to start using Supabase';
END $$;