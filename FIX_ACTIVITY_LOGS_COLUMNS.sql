-- =====================================================
-- FIX ACTIVITY LOGS - Add Missing Columns
-- =====================================================
-- Add all missing columns to activity_logs table
-- =====================================================

-- Add missing columns to activity_logs
ALTER TABLE activity_logs 
  ADD COLUMN IF NOT EXISTS affected_materials JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS packaging_name TEXT,
  ADD COLUMN IF NOT EXISTS quantity_change NUMERIC,
  ADD COLUMN IF NOT EXISTS details TEXT,
  ADD COLUMN IF NOT EXISTS item_id TEXT;

-- Create index for better performance on affected_materials
CREATE INDEX IF NOT EXISTS idx_activity_logs_affected_materials ON activity_logs USING gin(affected_materials);
CREATE INDEX IF NOT EXISTS idx_activity_logs_item_id ON activity_logs(item_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_product_name ON activity_logs(product_name);

-- Verify columns were added
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'activity_logs'
ORDER BY ordinal_position;

-- =====================================================
-- ✅ DONE! activity_logs now has all required columns:
--    - id
--    - action
--    - material_name
--    - quantity
--    - description
--    - category
--    - timestamp
--    - affected_materials (JSONB) ← NEW
--    - product_name ← NEW
--    - packaging_name ← NEW
--    - quantity_change ← NEW
--    - details ← NEW
--    - item_id ← NEW
-- =====================================================
