-- Migration: Add missing 'description' column to raw_materials table
-- Run this SQL in Supabase Dashboard: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

-- ===================================
-- ADD DESCRIPTION COLUMN IF MISSING
-- ===================================

-- Add description column to raw_materials if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'raw_materials' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Added description column to raw_materials';
  ELSE
    RAISE NOTICE 'ℹ️  Description column already exists';
  END IF;
END $$;

-- Add category column if it doesn't exist (just in case)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'raw_materials' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE raw_materials ADD COLUMN category TEXT;
    RAISE NOTICE '✅ Added category column to raw_materials';
  ELSE
    RAISE NOTICE 'ℹ️  Category column already exists';
  END IF;
END $$;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🎉 Migration complete! Your raw_materials table is now up to date!';
  RAISE NOTICE '📝 Refresh your Mnemosyne app to continue';
END $$;
