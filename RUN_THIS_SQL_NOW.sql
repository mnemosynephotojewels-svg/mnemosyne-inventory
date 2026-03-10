-- ============================================
-- COPY THIS ENTIRE SCRIPT AND RUN IT IN SUPABASE
-- ============================================
-- Go to: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
-- Paste this entire file and click RUN

-- Add missing columns to raw_materials table
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;

-- Verify the columns were added
SELECT 'SUCCESS! Columns added to raw_materials table' as status;

-- Show the updated table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'raw_materials'
ORDER BY ordinal_position;
