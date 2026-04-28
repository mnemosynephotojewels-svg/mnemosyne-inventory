# 🔧 Mnemosyne Supabase Setup Instructions

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase organization: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
2. Select your project (or create a new one if needed)
3. Navigate to **Settings** → **API** in the left sidebar
4. Copy the following values:
   - **Project URL** (should look like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 2: Update Environment Variables

Open the `.env` file in the root of your project and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key-here
```

## Step 3: Create Database Tables

1. Go to your Supabase project **SQL Editor**: 
   `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`

2. Copy and paste the complete SQL script below and click **RUN**:

```sql
-- ===================================================
-- MNEMOSYNE INVENTORY MANAGEMENT DATABASE SCHEMA
-- Complete setup with all tables and policies
-- ===================================================

-- 1. FINISHED PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS finished_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  bom JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RAW MATERIALS TABLE
CREATE TABLE IF NOT EXISTS raw_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  reorder_link TEXT,
  monthly_threshold NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PACKAGING MATERIALS TABLE
CREATE TABLE IF NOT EXISTS packaging_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  reorder_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================================

ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- CREATE POLICIES (Allow all operations for demo)
-- ===================================================

-- Finished Products Policies
DROP POLICY IF EXISTS "Allow all operations on finished_products" ON finished_products;
CREATE POLICY "Allow all operations on finished_products" 
  ON finished_products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Raw Materials Policies
DROP POLICY IF EXISTS "Allow all operations on raw_materials" ON raw_materials;
CREATE POLICY "Allow all operations on raw_materials" 
  ON raw_materials 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Packaging Materials Policies
DROP POLICY IF EXISTS "Allow all operations on packaging_materials" ON packaging_materials;
CREATE POLICY "Allow all operations on packaging_materials" 
  ON packaging_materials 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Activity Logs Policies
DROP POLICY IF EXISTS "Allow all operations on activity_logs" ON activity_logs;
CREATE POLICY "Allow all operations on activity_logs" 
  ON activity_logs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ===================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_item_type ON activity_logs(item_type);

-- ===================================================
-- CREATE FUNCTIONS FOR AUTO-UPDATING TIMESTAMPS
-- ===================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at 
  BEFORE UPDATE ON finished_products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at 
  BEFORE UPDATE ON raw_materials 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at 
  BEFORE UPDATE ON packaging_materials 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================================
-- SUCCESS MESSAGE
-- ===================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Mnemosyne database setup complete!';
  RAISE NOTICE '📊 All tables, policies, and triggers have been created.';
END $$;
```

## Step 4: Enable Storage (Optional - for image uploads)

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `mnemosyne-images`
3. Set it to **Public** bucket
4. Create the following policy for the bucket:

```sql
-- Allow all operations on storage bucket
CREATE POLICY "Allow all operations on mnemosyne-images"
ON storage.objects FOR ALL
USING (bucket_id = 'mnemosyne-images')
WITH CHECK (bucket_id = 'mnemosyne-images');
```

## Step 5: Verify Connection

1. Save all your changes
2. Restart your development server
3. Open the browser console and look for:
   - ✅ "Database tables ready" - means connection is successful
   - ❌ Any error messages - means something needs to be fixed

## Step 6: Test the Application

1. Try creating a raw material
2. Try creating a finished product
3. Check if data appears in the Supabase Table Editor
4. Verify activity logs are being created

## Troubleshooting

### "Connection unsuccessful" error
- Double-check your `.env` file has the correct URL and anon key
- Make sure there are no extra spaces or quotes around the values
- Restart your development server after changing `.env`

### "Table doesn't exist" error
- Make sure you ran the complete SQL script in Step 3
- Check the Supabase Table Editor to verify tables were created

### "403 Forbidden" or "Row Level Security" error
- Make sure you ran the policies section of the SQL script
- Verify RLS is enabled and policies exist in Supabase dashboard

### Images not uploading
- Make sure you created the storage bucket in Step 4
- Verify the bucket is set to public
- Check that storage policies are created

## 🎉 You're All Set!

Your Mnemosyne inventory management system should now be fully connected to your Supabase database. All CRUD operations, activity logging, and data persistence will work seamlessly.
