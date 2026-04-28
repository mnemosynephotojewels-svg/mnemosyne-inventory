# 🎯 Mnemosyne - Complete Database Setup Guide

## 📋 Current Status

Your Mnemosyne inventory system is **fully operational** using localStorage. To enable cross-device synchronization, follow these steps:

---

## ⚠️ CRITICAL: About the Key You Provided

The key you provided (`sb_publishable_Ucl5bo_wy3ycTMRJHGSZ9Q_FE1sC35m`) is **NOT a valid Supabase anon key format**.

### What You Need:

1. **Project URL:** `https://jqbmnoxxgocjadllsipn.supabase.co` ✅ (Already configured)
2. **Anon Public Key:** A JWT token that looks like this:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYm1ub3h4Z29jamFkbGxzaXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODEzMzYsImV4cCI6MjA4NzA1NzMzNn0.YegLMa2ZJ4hCuYr2l56rDDQC4_QtqtGaL6ww1nB3tHM
   ```

**✅ Your current anon key is already configured** in the system. You don't need to change it unless you want to update it with a newer one.

---

## 🚀 Step-by-Step Setup (5 Minutes)

### Step 1: Open Supabase SQL Editor

1. Click this link:
   👉 **https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor**

2. Log in to your Supabase account

3. Click the **"SQL Editor"** tab on the left sidebar

### Step 2: Create Database Tables

1. Click **"+ New Query"** button

2. **Copy the ENTIRE script below** and paste it into the editor:

```sql
-- Mnemosyne Inventory System - Complete Database Setup
-- ====================================================

-- PACKAGING MATERIALS TABLE
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

-- RAW MATERIALS TABLE
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

-- FINISHED PRODUCTS TABLE
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

-- ACTIVITY LOGS TABLE
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

-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
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

3. Click the **"RUN"** button (or press `Ctrl + Enter`)

4. Wait for the success message: `Success. No rows returned`

---

### Step 3: Verify Database Setup

#### Option A: Use the Built-in Test Tool

1. **Open your Mnemosyne app**

2. **Click "Account Settings"** (top right)

3. **Click "Test Database Connection"**

4. **Press F12** to open the console

5. **Check the results:**
   - ✅ All tests pass = You're ready!
   - ❌ Any failures = See troubleshooting below

#### Option B: Manual Test

1. **Go to Packaging Materials tab**

2. **Click "Add Material"**

3. Fill in:
   - Name: `Test Box`
   - Stock: `100`
   - Unit: `boxes`

4. **Click "Add Material"**

5. **Open Console (F12)** and check for:
   ```
   ✅✅✅ Successfully saved to Supabase database!
   🎉 Material is now synced across all devices!
   ```

6. **Verify in Supabase:**
   - Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
   - Click "Table Editor"
   - Select "packaging_materials"
   - You should see your test item!

---

## ✅ Success Checklist

- [ ] Ran SQL script in Supabase SQL Editor
- [ ] Saw "Success" message
- [ ] Tested database connection using the app's test tool
- [ ] All 3 diagnostic tests passed
- [ ] Added a test material
- [ ] Saw success message in console
- [ ] Verified data appears in Supabase Table Editor

---

## 🎉 What You Get After Setup

### Before Database Setup:
```
✅ Works on current browser
✅ Instant saves
✅ Offline access
⚠️  Data stays in THIS browser only
⚠️  No cross-device sync
⚠️  Data lost if browser data cleared
```

### After Database Setup:
```
✅ Works on ALL browsers
✅ Works on ALL devices
✅ Instant saves (still fast!)
✅ Offline access (still works!)
✅ Cross-device synchronization
✅ Cloud backup (never lose data!)
✅ Team collaboration ready
✅ Real-time updates across devices
```

---

## 🔍 Understanding Your Keys

### Where to Find Your Supabase Keys:

1. Go to: **https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api**

2. You'll see:

#### Project URL:
```
https://jqbmnoxxgocjadllsipn.supabase.co
```
✅ Already configured in your app!

#### anon public (Anonymous Key):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
✅ Already configured in your app!

**Note:** The key you provided (`sb_publishable_...`) is not the correct format for Supabase anon keys. The system is already using the correct JWT token.

---

## 🆘 Troubleshooting

### Problem: "Table does not exist" error

**Solution:**
1. Go back to Step 2
2. Run the SQL script again
3. Make sure you see "Success" message
4. Refresh your Mnemosyne app (F5)

### Problem: "Permission denied" or "RLS policy" error

**Solution:**
1. Go to: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/auth/policies
2. For each table (packaging_materials, raw_materials, etc.):
   - Click the table name
   - Verify "Allow all operations" policy exists
   - If not, run the SQL script again

### Problem: "Network error" or "Cannot reach Supabase"

**Solution:**
1. Check your internet connection
2. Verify your Supabase project is active:
   - Go to: https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn
   - Make sure project status is "Active" (green)
3. Try the database test tool again

### Problem: Data not syncing across devices

**Solution:**
1. Make sure both devices are using the same Supabase project
2. Run the database diagnostic on both devices
3. Check that all tables exist in Supabase
4. Clear browser cache and reload the app

---

## 📊 Testing Your Setup

### Test 1: Add Data on Device A
1. Open Mnemosyne on your computer
2. Add a new packaging material
3. Check console for success message

### Test 2: View Data on Device B
1. Open Mnemosyne on your phone/tablet
2. Go to Packaging Materials
3. You should see the material you just added!

### Test 3: Update Data on Device B
1. Update the stock on your phone
2. Go back to your computer
3. Refresh the page
4. The stock should be updated!

---

## 🎯 Quick Commands

### View Database Tables:
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

### View API Settings:
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api

### View Security Policies:
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/auth/policies

### SQL Editor:
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor

---

## 💡 Pro Tips

1. **Always test after setup:** Use the built-in database test tool in Account Settings

2. **Keep localStorage enabled:** The app uses dual storage for maximum reliability

3. **Check console messages:** Press F12 to see detailed sync logs

4. **Bookmark your Supabase dashboard:** For easy access to your data

5. **Regular backups:** While Supabase provides cloud backup, you can also export data from the Reports tab

---

## 📝 Current Configuration

**Project ID:** `jqbmnoxxgocjadllsipn`
**Project URL:** `https://jqbmnoxxgocjadllsipn.supabase.co`
**Anon Key:** ✅ Configured (JWT format)
**Tables:** 4 (packaging_materials, raw_materials, finished_products, activity_logs)
**Storage Mode:** Dual (localStorage + Supabase)

---

## 🎊 You're All Set!

Your Mnemosyne system is ready for enterprise-level inventory management with:
- ✅ Real-time cross-device sync
- ✅ Cloud backup and recovery
- ✅ Offline-first architecture  
- ✅ Team collaboration
- ✅ Comprehensive activity logging
- ✅ Advanced reporting and analytics

**Need help?** Check the console logs (F12) - they provide detailed diagnostic information!

💎 **Happy inventory tracking with Mnemosyne!** ✨
