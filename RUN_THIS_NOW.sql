-- ========================================
-- COPY EVERYTHING BELOW THIS LINE
-- ========================================

ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;

-- ========================================
-- THAT'S IT! JUST THOSE 2 LINES!
-- ========================================