-- =====================================================
-- FIX ROW LEVEL SECURITY (RLS) ERROR
-- =====================================================
-- Disable RLS on all tables to allow insert/update/delete
-- =====================================================

-- Disable RLS on all tables
ALTER TABLE raw_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies (just in case)
DROP POLICY IF EXISTS "Enable all access for anon" ON raw_materials;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON raw_materials;
DROP POLICY IF EXISTS "Enable all access for anon" ON packaging_materials;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON packaging_materials;
DROP POLICY IF EXISTS "Enable all access for anon" ON finished_products;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON finished_products;
DROP POLICY IF EXISTS "Enable all access for anon" ON activity_logs;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON activity_logs;

-- Grant full permissions to anon and authenticated roles
GRANT ALL PRIVILEGES ON raw_materials TO anon;
GRANT ALL PRIVILEGES ON raw_materials TO authenticated;
GRANT ALL PRIVILEGES ON packaging_materials TO anon;
GRANT ALL PRIVILEGES ON packaging_materials TO authenticated;
GRANT ALL PRIVILEGES ON finished_products TO anon;
GRANT ALL PRIVILEGES ON finished_products TO authenticated;
GRANT ALL PRIVILEGES ON activity_logs TO anon;
GRANT ALL PRIVILEGES ON activity_logs TO authenticated;

-- Also grant usage on sequences if any
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('raw_materials', 'packaging_materials', 'finished_products', 'activity_logs');

-- =====================================================
-- ✅ DONE! RLS disabled on all tables
-- All tables should show: rls_enabled = false
-- =====================================================
