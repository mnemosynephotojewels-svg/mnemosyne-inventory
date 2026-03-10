-- ============================================================================
-- FIX: Missing 'monthly_threshold' Column Error
-- ============================================================================
-- This SQL fixes the error: "Could not find the 'monthly_threshold' column"
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Check if the column already exists, if not, add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'raw_materials' 
    AND column_name = 'monthly_threshold'
  ) THEN
    -- Add the monthly_threshold column
    ALTER TABLE raw_materials 
    ADD COLUMN monthly_threshold INTEGER DEFAULT NULL;
    
    RAISE NOTICE '✅ Added monthly_threshold column to raw_materials table';
  ELSE
    RAISE NOTICE 'ℹ️ monthly_threshold column already exists';
  END IF;
END $$;

-- Add comment to explain the column purpose
COMMENT ON COLUMN raw_materials.monthly_threshold IS 'Monthly stock threshold - when stock falls below this value, it is marked as low stock (orange alert). Zero stock is always marked as out of stock (red alert). NULL means no threshold set.';

-- Verify the column was added successfully
DO $$
DECLARE
  col_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'raw_materials' 
    AND column_name = 'monthly_threshold'
  ) INTO col_exists;
  
  IF col_exists THEN
    RAISE NOTICE '✅ SUCCESS: monthly_threshold column is now available in raw_materials table';
    RAISE NOTICE '🎉 You can now use the monthly threshold feature!';
    RAISE NOTICE '📝 Refresh your Mnemosyne app to clear the error';
  ELSE
    RAISE NOTICE '❌ ERROR: monthly_threshold column was not added. Please check permissions.';
  END IF;
END $$;

-- ============================================================================
-- INSTRUCTIONS:
-- ============================================================================
-- 1. Go to your Supabase Dashboard: https://app.supabase.com
-- 2. Select your project: anntzpswficnoekklsdr
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this ENTIRE file
-- 6. Click "Run" or press Ctrl+Enter
-- 7. You should see: "✅ SUCCESS: monthly_threshold column is now available"
-- 8. Refresh your Mnemosyne app
-- ============================================================================

-- Optional: Set default monthly thresholds for existing materials
-- Uncomment the following if you want to set default values:

-- UPDATE raw_materials 
-- SET monthly_threshold = 100 
-- WHERE monthly_threshold IS NULL;
