# 🔧 FIX "reorder_link column not found" ERROR

## ❌ Current Error:
```
Could not find the 'reorder_link' column of 'raw_materials' in the schema cache
Error adding raw material: Error: Failed to create raw material
```

---

## ✅ QUICK FIX (Recommended)

### If your tables already exist:

**Use: `ADD_MISSING_COLUMNS.sql`**

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/johzztbxgtafpwaenkio/sql
2. Click **"+ New query"**
3. Copy & paste **ALL** of `ADD_MISSING_COLUMNS.sql`
4. Click **"Run"**
5. ✅ Done! Refresh your app

This adds the missing columns to your existing tables WITHOUT deleting any data.

---

## 🆕 FRESH START (If you want to rebuild)

### If you want to recreate tables from scratch:

**Use: `CREATE_ALL_TABLES_COMPLETE.sql`**

⚠️ **WARNING:** This will DELETE all existing data if you uncomment the DROP statements!

1. Open Supabase SQL Editor
2. In the SQL file, **uncomment** these lines (remove the `--`):
   ```sql
   DROP TABLE IF EXISTS activity_logs CASCADE;
   DROP TABLE IF EXISTS finished_products CASCADE;
   DROP TABLE IF EXISTS packaging_materials CASCADE;
   DROP TABLE IF EXISTS raw_materials CASCADE;
   ```
3. Copy & paste **ALL** of `CREATE_ALL_TABLES_COMPLETE.sql`
4. Click **"Run"**
5. ✅ All tables recreated with correct schema

---

## 📋 What Columns Are Added?

### Raw Materials:
- ✅ `reorder_link` (TEXT) - Link to supplier/reorder page

### Packaging Materials:
- ✅ `reorder_link` (TEXT)
- ✅ `image_url` (TEXT)
- ✅ `description` (TEXT)
- ✅ `category` (TEXT)

### Finished Products:
- ✅ `description` (TEXT)

---

## 🚀 After Running SQL:

1. **Refresh your app** (F5)
2. **Login** (mnemosyne / mnemosyne000)
3. **Try adding a raw material** - Error will be GONE! ✅

---

## 🎯 Recommended Steps:

1. Run **`ADD_MISSING_COLUMNS.sql`** first (keeps your data)
2. Refresh app and test
3. If still having issues, run **`CREATE_ALL_TABLES_COMPLETE.sql`** (fresh start)

---

**Choose your file and run it in Supabase SQL Editor now!** 🚀
