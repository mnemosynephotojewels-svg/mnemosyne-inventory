-- Add monthly_threshold column to raw_materials table
-- This column stores the threshold value below which stock is considered "low stock"
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS monthly_threshold INTEGER DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN raw_materials.monthly_threshold IS 'Monthly stock threshold - stock below this value will be marked as low stock (orange). Zero stock is always marked as out of stock (red).';
