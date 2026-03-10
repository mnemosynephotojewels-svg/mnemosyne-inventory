-- =====================================================
-- OPTIONAL: KV STORE TABLE (Key-Value Storage)
-- =====================================================
-- This is OPTIONAL - only create if you need backend key-value storage
-- Your inventory system works fine without this!
-- =====================================================

CREATE TABLE IF NOT EXISTS kv_store_a9dec19d (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_a9dec19d(key);

-- Auto-update timestamp trigger
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_a9dec19d;
CREATE TRIGGER update_kv_store_updated_at
    BEFORE UPDATE ON kv_store_a9dec19d
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON kv_store_a9dec19d TO anon, authenticated;

-- Disable RLS
ALTER TABLE kv_store_a9dec19d DISABLE ROW LEVEL SECURITY;

-- ✅ Done! KV Store table created (optional feature)
