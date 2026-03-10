-- ==================================================
-- ADD DESCRIPTION COLUMN TO RAW MATERIALS
-- ==================================================
-- 
-- 📍 WHERE TO RUN THIS:
-- https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
--
-- Just copy these 2 lines, paste, and click RUN!
-- ==================================================

ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;