# ⚠️ URGENT: Supabase Connection Not Configured

## 🚨 Current Error
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

## ✅ Quick Fix (Choose ONE method)

---

## 🎯 METHOD 1: Update .env File (Recommended)

### Step 1: Get Your Credentials
1. Open: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
2. Select your project (or create one)
3. Go to: **Settings** → **API**
4. Copy these two values:
   - **Project URL** (Example: `https://abc123xyz.supabase.co`)
   - **anon public** key (Long token starting with `eyJ...`)

### Step 2: Edit .env File
1. Open the file named `.env` in your project root
2. Find these lines:
   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
3. Paste your values after the `=` sign:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
   ```
4. **Save the file**

### Step 3: Restart Dev Server
```bash
# Stop the server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
# or
pnpm dev
```

---

## 🎯 METHOD 2: Edit Supabase.ts Directly (Temporary)

If the .env file doesn't work:

### Step 1: Get Your Credentials
(Same as Method 1 above)

### Step 2: Edit the Config File
1. Open: `/src/app/lib/supabase.ts`
2. Find these lines (around line 24-25):
   ```typescript
   const FALLBACK_URL = 'YOUR_SUPABASE_URL_HERE';
   const FALLBACK_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```
3. Replace with your actual values:
   ```typescript
   const FALLBACK_URL = 'https://your-project-id.supabase.co';
   const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key';
   ```
4. **Save the file**

### Step 3: Reload
The app should automatically reload and connect!

---

## 📋 After Adding Credentials

### Run the Database Setup SQL

1. Open Supabase SQL Editor:
   - Go to your Supabase project
   - Click **SQL Editor** in the sidebar

2. Copy and paste this SQL script:

```sql
-- MNEMOSYNE DATABASE SETUP

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

-- Enable Row Level Security
ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "Allow all operations on finished_products" ON finished_products;
CREATE POLICY "Allow all operations on finished_products" ON finished_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on raw_materials" ON raw_materials;
CREATE POLICY "Allow all operations on raw_materials" ON raw_materials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on packaging_materials" ON packaging_materials;
CREATE POLICY "Allow all operations on packaging_materials" ON packaging_materials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on activity_logs" ON activity_logs;
CREATE POLICY "Allow all operations on activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_finished_products_name ON finished_products(name);
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON raw_materials(name);
CREATE INDEX IF NOT EXISTS idx_packaging_materials_name ON packaging_materials(name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- Create Auto-Update Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers
DROP TRIGGER IF EXISTS update_finished_products_updated_at ON finished_products;
CREATE TRIGGER update_finished_products_updated_at BEFORE UPDATE ON finished_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_raw_materials_updated_at ON raw_materials;
CREATE TRIGGER update_raw_materials_updated_at BEFORE UPDATE ON raw_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packaging_materials_updated_at ON packaging_materials;
CREATE TRIGGER update_packaging_materials_updated_at BEFORE UPDATE ON packaging_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. Click **RUN** ▶️

4. Verify tables were created in the **Table Editor**

---

## ✅ How to Know It's Working

After completing the steps above, reload the app. You should see in the console:

```
🎉 ALL TESTS PASSED! Database is fully configured.
```

If you still see errors, check that:
- [ ] Your Supabase URL and key are correct
- [ ] There are no spaces or quotes around the values
- [ ] You restarted the dev server
- [ ] Your Supabase project is active (not paused)

---

## 🆘 Still Having Issues?

### Check browser console (F12) for:
- Environment variables loading: Type `console.log(import.meta.env.VITE_SUPABASE_URL)`
- Should show your actual URL, not undefined

### Common mistakes:
- ❌ `.env` file has quotes: `VITE_SUPABASE_URL="https://..."`
- ✅ Correct format: `VITE_SUPABASE_URL=https://...`

- ❌ Extra spaces: `VITE_SUPABASE_URL= https://...`
- ✅ No spaces: `VITE_SUPABASE_URL=https://...`

- ❌ Wrong file name: `.env.txt` or `env`
- ✅ Exactly: `.env`

---

## 📚 More Help

- **START_HERE_FIX_CONNECTION.txt** - Detailed visual guide
- **🔧_DATABASE_CONNECTION_GUIDE.md** - Complete setup guide
- **CONNECTION_CHECKLIST.md** - Troubleshooting checklist

---

**🚀 Once configured, your Mnemosyne system will be fully operational!**
