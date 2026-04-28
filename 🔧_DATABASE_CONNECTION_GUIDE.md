# 🔧 Fix Supabase Connection - Complete Guide

## 🎯 Current Issue
Your Mnemosyne app is showing "connection unsuccessful" because the old Supabase credentials are no longer valid. We need to connect to your new Supabase project.

---

## ✅ Solution: 3 Quick Steps

### 📝 Step 1: Get Your New Credentials (2 min)

1. Visit your Supabase dashboard:
   ```
   https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
   ```

2. **Create or select your project**

3. In the left sidebar, go to: **Settings** ⚙️ → **API**

4. Copy these two values:
   - **Project URL** (Example: `https://abcdefgh.supabase.co`)
   - **Project API Keys** → `anon` `public` key (Long token starting with `eyJ...`)

---

### 🔑 Step 2: Update .env File (1 min)

1. Open the `.env` file in the root of your project

2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-long-anon-key
```

⚠️ **Important:** 
- Remove `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` completely
- Paste your actual values (no quotes needed)
- Save the file

---

### 🗄️ Step 3: Create Database Tables (3 min)

1. **Open Supabase SQL Editor:**
   - Go to your Supabase project
   - Click **SQL Editor** in the left sidebar
   - Or visit: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`

2. **Copy the SQL script below** and paste it into the editor:

```sql
-- ═══════════════════════════════════════════════════
-- MNEMOSYNE INVENTORY MANAGEMENT - DATABASE SETUP
-- Complete schema with tables, policies, and triggers
-- ═══════════════════════════════════════════════════

-- ───────────────────────────────────────────────────
-- 1. CREATE TABLES
-- ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS finished_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  image_url TEXT,
  description TEXT,
  bom JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ───────────────────────────────────────────────────
-- 2. ENABLE ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────

ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ───────────────────────────────────────────────────
-- 3. CREATE POLICIES (Allow all operations)
-- ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow all operations on finished_products" ON finished_products;
CREATE POLICY "Allow all operations on finished_products" 
  ON finished_products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on raw_materials" ON raw_materials;
CREATE POLICY "Allow all operations on raw_materials" 
  ON raw_materials 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on packaging_materials" ON packaging_materials;
CREATE POLICY "Allow all operations on packaging_materials" 
  ON packaging_materials 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on activity_logs" ON activity_logs;
CREATE POLICY "Allow all operations on activity_logs" 
  ON activity_logs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ───────────────────────────────────────────────────
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_item_type ON activity_logs(item_type);

-- ───────────────────────────────────────────────────
-- 5. CREATE AUTO-UPDATE TIMESTAMP FUNCTION
-- ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ───────────────────────────────────────────────────
-- 6. CREATE TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ───────────────────────────────────────────────────

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

-- ═══════════════════════════════════════════════════
-- ✅ SETUP COMPLETE!
-- ═══════════════════════════════════════════════════
```

3. **Click the "RUN" button** ▶️ to execute the script

4. **Verify success:**
   - You should see a success message
   - Go to **Table Editor** to confirm all 4 tables exist:
     - `finished_products`
     - `raw_materials`
     - `packaging_materials`
     - `activity_logs`

---

## 🚀 Step 4: Test Your Connection

1. **Restart your development server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   pnpm dev
   ```

2. **Open your app in the browser**

3. **Check the browser console** (Press F12):
   - Look for this message:
     ```
     🎉 ALL TESTS PASSED! Database is fully configured.
     ```
   - You should see ✅ checkmarks for all 4 tables

4. **Try creating a test item:**
   - Go to Raw Materials tab
   - Click "Add Raw Material"
   - Create a test item
   - It should save successfully!

---

## 🎉 Success Indicators

✅ **Connection is working if you see:**
- No error messages in the browser console
- "🎉 ALL TESTS PASSED!" message
- Data persists after page refresh
- Activity logs are being created

❌ **Still having issues? See troubleshooting below**

---

## 🆘 Troubleshooting

### Issue: "Connection unsuccessful"

**Cause:** `.env` file has incorrect credentials

**Fix:**
1. Double-check your Supabase URL and anon key
2. Make sure there are NO quotes around values
3. Make sure there are NO spaces at the beginning/end
4. Restart dev server after changing `.env`

Example of CORRECT format:
```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123
```

Example of INCORRECT format:
```env
VITE_SUPABASE_URL="https://abc123.supabase.co"  ❌ (has quotes)
VITE_SUPABASE_URL= https://abc123.supabase.co   ❌ (space after =)
```

---

### Issue: "Table doesn't exist" error

**Cause:** Database tables haven't been created

**Fix:**
1. Go to Supabase SQL Editor
2. Run the complete SQL script from Step 3
3. Verify tables exist in Table Editor

---

### Issue: "403 Forbidden" or "RLS policy" error

**Cause:** Row Level Security policies not set correctly

**Fix:**
1. Make sure you ran the ENTIRE SQL script (all sections)
2. Check that policies exist:
   - Go to Supabase dashboard → Authentication → Policies
   - Should see 4 policies (one for each table)

---

### Issue: Data not persisting after refresh

**Cause:** Database writes failing

**Fix:**
1. Check browser console for error messages
2. Verify your `.env` file is saved
3. Make sure Supabase project is not paused
4. Check Supabase project usage isn't exceeded

---

## 📚 Additional Files

- **SUPABASE_SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **QUICK_SETUP.md** - Quick reference card
- **CONNECT_NEW_DATABASE.md** - Connection overview
- **.env.example** - Template for environment variables

---

## 🔍 What Changed?

Your old database URL:
```
https://jqbmnoxxgocjadllsipn.supabase.co
```

This has been replaced with environment variables that you need to set in the `.env` file. This allows you to:
- ✅ Connect to your new Supabase project
- ✅ Keep credentials secure
- ✅ Easily switch between projects

---

## 💡 Pro Tips

1. **Keep `.env` file secure** - Never commit it to version control
2. **Backup your Supabase URL and key** - Store them securely
3. **Check Supabase project status** - Make sure it's not paused
4. **Monitor usage** - Free tier has limits

---

## 🎯 Next Steps After Connection

Once your database is connected:

1. ✅ Test all CRUD operations (Create, Read, Update, Delete)
2. ✅ Verify Activity Logs are working
3. ✅ Test image uploads (if using Storage)
4. ✅ Check Reports and Dashboard data
5. ✅ Deploy to production (if ready)

---

## 🚨 Still Need Help?

If you're still experiencing issues:

1. **Check browser console** - Look for specific error messages
2. **Check Supabase logs** - Go to Supabase dashboard → Logs
3. **Verify network** - Make sure you can access supabase.co
4. **Check project status** - Ensure Supabase project is active

---

**📧 Need more assistance? Check the Supabase documentation:**
https://supabase.com/docs

**Your organization URL:**
https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi

---

## ✅ Checklist

Before asking for help, make sure you've completed:

- [ ] Created/selected a Supabase project
- [ ] Copied the correct Project URL and anon key
- [ ] Updated the `.env` file with actual credentials
- [ ] Saved the `.env` file
- [ ] Ran the complete SQL script in Supabase SQL Editor
- [ ] Verified all 4 tables exist in Table Editor
- [ ] Restarted the development server
- [ ] Checked browser console for error messages
- [ ] Verified Supabase project is not paused

---

🎉 **Good luck! Your Mnemosyne inventory system will be up and running soon!**
