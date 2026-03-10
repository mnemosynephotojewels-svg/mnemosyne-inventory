-- ============================================================
-- MNEMOSYNE - ADD DESCRIPTION COLUMN TO RAW MATERIALS
-- ============================================================
-- 
-- 📍 RUN THIS IN SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
--
-- ✅ This will add the missing description and category columns
-- ✅ Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================

-- Add category column
ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add description column
ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify columns were added successfully
DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS! Description and Category columns added to raw_materials table';
  RAISE NOTICE '🎉 You can now save descriptions in your Mnemosyne app!';
  RAISE NOTICE '🔄 Refresh your app (Ctrl+Shift+R) to start using it';
END $$;

-- Show all columns in the table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;