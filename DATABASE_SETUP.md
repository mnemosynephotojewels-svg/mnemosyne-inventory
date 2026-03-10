# 🔧 Mnemosyne Database Setup - Complete Guide

## ⚠️ IMPORTANT: Get Your Correct Supabase Keys

The key format you provided appears incomplete. Here's how to get your **correct** keys:

### 📍 Step 1: Get Your Supabase Keys

1. **Go to Supabase Dashboard:**
   👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api

2. **Find these keys:**
   - **Project URL:** Should be `https://jqbmnoxxgocjadllsipn.supabase.co`
   - **anon public key:** A long JWT token starting with `eyJ...`
   
   The anon key should look like:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```
   
   ✅ **Correct format:** `eyJ...` (very long, ~200+ characters)
   ❌ **Incorrect format:** `sb_publishable_...` (this is NOT the anon key)

---

## 🚀 Step 2: Create Database Tables

### Option A: Automatic Setup (EASIEST)

1. **Open Supabase SQL Editor:**
   👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

2. **Click "New Query"**

3. **Copy & Paste** this entire SQL script:

```sql
-- Mnemosyne Inventory System - Database Initialization
-- ===================================
-- PACKAGING MATERIALS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS packaging_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  reorder_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on packaging_materials" 
  ON packaging_materials 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_created ON packaging_materials(created_at DESC);

-- ===================================
-- RAW MATERIALS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS raw_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  reorder_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on raw_materials" 
  ON raw_materials 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);

-- ===================================
-- FINISHED PRODUCTS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS finished_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  bill_of_materials JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on finished_products" 
  ON finished_products 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);

-- ===================================
-- ACTIVITY LOGS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  quantity NUMERIC,
  product_name TEXT,
  material_name TEXT,
  packaging_name TEXT,
  affected_materials JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on activity_logs" 
  ON activity_logs 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- ===================================
-- TRIGGERS FOR UPDATED_AT
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at
  BEFORE UPDATE ON packaging_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at
  BEFORE UPDATE ON raw_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at
  BEFORE UPDATE ON finished_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "RUN"** (or press Ctrl+Enter)

5. **Verify Success:** You should see:
   ```
   Success. No rows returned
   ```

---

## ✅ Step 3: Verify Database Setup

### Test the Connection:

1. **Open your Mnemosyne app**

2. **Open Browser Console** (Press F12)

3. **Go to Packaging Materials tab**

4. **Click "Add Material"** and add a test item

5. **Check Console Messages:**

   ✅ **SUCCESS - You should see:**
   ```
   📦 Adding packaging material: Test Box
   ✅ Saved to localStorage
   🌐 Sending to Supabase database...
   ✅✅✅ Successfully saved to Supabase database!
   🎉 Material is now synced across all devices!
   ```

   ❌ **PROBLEM - If you see:**
   ```
   ⚠️ Database table not created yet
   📋 Please create the table in Supabase Dashboard
   ```
   → Go back to Step 2 and run the SQL script

---

## 🔍 Step 4: Verify Data in Supabase

1. **Go to Table Editor:**
   👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

2. **Click on "packaging_materials" table**

3. **You should see your test data!**

---

## 🎯 Quick Checklist

- [ ] Got correct anon key from API settings (starts with `eyJ...`)
- [ ] Ran SQL script in SQL Editor
- [ ] Saw "Success" message
- [ ] Tested adding a material
- [ ] Saw success message in console
- [ ] Verified data in Table Editor

---

## 🆘 Troubleshooting

### Problem: "Table does not exist" error

**Solution:** Run the SQL script again from Step 2

### Problem: "Permission denied" error

**Solution:** 
1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/auth/policies
2. Make sure RLS policies are enabled with "Allow all" policy

### Problem: Can't find anon key

**Solution:**
1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api
2. Look for "Project API keys"
3. Copy the "anon public" key (the long one)

---

## 📞 Your Current Project

**Project ID:** `jqbmnoxxgocjadllsipn`
**Project URL:** `https://jqbmnoxxgocjadllsipn.supabase.co`

**Database Tables Created:**
1. ✅ `packaging_materials`
2. ✅ `raw_materials`
3. ✅ `finished_products`
4. ✅ `activity_logs`

---

## 🎉 After Setup

Once complete, your Mnemosyne system will have:
- ✅ **Cross-device synchronization** - Access from any device
- ✅ **Cloud backup** - Never lose data
- ✅ **Offline mode** - Works without internet
- ✅ **Real-time sync** - Updates across all devices
- ✅ **Team collaboration** - Multiple users can access the same inventory

---

## 📝 Need Help?

The key you provided (`sb_publishable_Ucl5bo_wy3ycTMRJHGSZ9Q_FE1sC35m`) doesn't appear to be a valid Supabase anon key format. 

**Please get the correct key from:**
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api

Look for the **"anon" key** under "Project API keys" section.
