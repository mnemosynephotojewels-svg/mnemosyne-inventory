-- ========================================
-- ADD DESCRIPTION COLUMN TO RAW MATERIALS
-- ========================================
-- 
-- 🎯 COPY THIS AND RUN IN SUPABASE:
-- 👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
-- 
-- Click the SQL Editor tab
-- Paste this entire script
-- Click RUN (or press Ctrl+Enter)

-- Add category column (if it doesn't exist)
ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add description column (if it doesn't exist)
ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify the columns were added
SELECT 'SUCCESS! ✅ Description and Category columns added!' as status;

-- Show all columns to confirm
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;
