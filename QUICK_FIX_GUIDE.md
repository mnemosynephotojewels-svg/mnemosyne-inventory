# 🔧 Quick Fix: Monthly Threshold Column Error

## ❌ Error Message
```
Supabase error: Could not find the 'monthly_threshold' column of 'raw_materials' in the schema cache
```

## ✅ Solution (2 Minutes)

### Option 1: Quick Fix (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select project: `anntzpswficnoekklsdr`

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Run the Fix**
   - Copy the contents of `/supabase/FIX_MONTHLY_THRESHOLD_ERROR.sql`
   - Paste into the SQL Editor
   - Click **"Run"** (or press `Ctrl+Enter`)

4. **Verify Success**
   - You should see: ✅ `SUCCESS: monthly_threshold column is now available`

5. **Refresh Your App**
   - Go back to your Mnemosyne app
   - Refresh the page (`Ctrl+R` or `F5`)
   - Error should be gone!

---

### Option 2: Simple One-Line Fix

If you just want the quickest fix, run this single SQL command:

```sql
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS monthly_threshold INTEGER DEFAULT NULL;
```

Then refresh your app!

---

## 📋 What This Column Does

The `monthly_threshold` column enables the **3-color stock alert system**:

- 🔴 **Red Alert**: Stock = 0 (Out of Stock)
- 🟠 **Orange Alert**: Stock < Monthly Threshold (Low Stock)
- 🟢 **Green**: Stock ≥ Monthly Threshold (Normal)

### Example:
```
Material: Flour
Current Stock: 50 kg
Monthly Threshold: 100 kg
→ Status: 🟠 Low Stock (because 50 < 100)
```

---

## 🎯 Setting Monthly Thresholds

After fixing the error, you can set thresholds in two ways:

### 1. Through the UI
- Go to **Raw Materials** tab
- Click **Edit** on any material
- Set the **Monthly Threshold** value
- Click **Update**

### 2. Through SQL (Bulk Update)
```sql
-- Set threshold for specific material
UPDATE raw_materials 
SET monthly_threshold = 100 
WHERE name = 'Flour';

-- Set default threshold for all materials
UPDATE raw_materials 
SET monthly_threshold = 50 
WHERE monthly_threshold IS NULL;
```

---

## 🔍 Verify the Fix

After running the SQL, verify the column exists:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'raw_materials'
AND column_name = 'monthly_threshold';
```

Expected result:
```
column_name       | data_type | column_default
------------------|-----------|---------------
monthly_threshold | integer   | NULL
```

---

## 📁 Related Files

- `/supabase/FIX_MONTHLY_THRESHOLD_ERROR.sql` - Quick fix script
- `/supabase/init.sql` - Full database schema (includes the fix)
- `/ADD_MONTHLY_THRESHOLD_COLUMN.sql` - Alternative migration script

---

## ⚠️ If Error Persists

1. **Clear browser cache** (`Ctrl+Shift+R`)
2. **Check Supabase connection** - Verify credentials in `/src/app/lib/supabase.ts`
3. **Verify table exists**:
   ```sql
   SELECT * FROM raw_materials LIMIT 1;
   ```
4. **Check column was added**:
   ```sql
   \d raw_materials
   ```

---

## ✅ Summary

**Time to Fix:** ~2 minutes

**Steps:**
1. Open Supabase SQL Editor
2. Run `/supabase/FIX_MONTHLY_THRESHOLD_ERROR.sql`
3. Refresh your app
4. ✅ Done!

**Result:** The monthly threshold feature will work perfectly, and the error will be gone.
