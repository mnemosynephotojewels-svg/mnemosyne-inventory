-- =====================================================
-- SQL MIGRATION: Add Stock Tracking Columns
-- =====================================================
-- Run this in your Supabase SQL Editor
-- This adds stock tracking fields to activity_logs table
-- =====================================================

-- Add previous_stock column (stock before deduction)
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS previous_stock NUMERIC;

-- Add new_stock column (stock after deduction)
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS new_stock NUMERIC;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activity_logs' 
  AND column_name IN ('previous_stock', 'new_stock');

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added previous_stock and new_stock columns to activity_logs table';
END $$;
