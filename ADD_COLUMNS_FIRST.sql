-- ========================================
-- RUN THIS FIRST IN SUPABASE!
-- ========================================
-- This will add the missing columns so description can save
-- 
-- Go to: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
-- Copy and paste this entire script
-- Click RUN

-- Add category column to raw_materials
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;

-- Add description column to raw_materials
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify the columns were added
SELECT 'SUCCESS! Columns added!' as status;

-- Show all columns in the table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;
