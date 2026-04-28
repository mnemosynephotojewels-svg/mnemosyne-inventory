# 🔧 FIX: Add Stock Tracking Columns to Database

## ❌ Error You're Seeing

```
❌ Supabase error: Could not find the 'new_stock' column of 'activity_logs' in the schema cache
❌ ERROR IN DEDUCTION PROCESS
❌ Error: Error: Failed to create activity log
```

## 🎯 Solution

The `activity_logs` table is missing two new columns that we just added to the code:
- `previous_stock` - Stock before deduction
- `new_stock` - Stock after deduction

## 📝 Steps to Fix

### **Step 1: Open Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)

### **Step 2: Run the SQL Migration**

Copy and paste this SQL into the SQL Editor:

```sql
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
```

### **Step 3: Click "Run"**

Click the **Run** button in the SQL Editor.

### **Step 4: Verify Success**

You should see output showing:
```
column_name      | data_type
-----------------+-----------
previous_stock   | numeric
new_stock        | numeric
```

### **Step 5: Test the Application**

1. Refresh your Mnemosyne application
2. Try deducting a raw material
3. The deduction should now work correctly
4. Click on the activity in the Activity Log tab
5. You should see the **Previous Stock**, **Deducted**, and **New Stock** display

## ✅ What This Does

These new columns allow the system to track:
- **Previous Stock**: What the stock was before the deduction
- **Deducted Amount**: How much was deducted
- **New Stock**: What the stock is after the deduction

This provides a complete audit trail for all inventory changes!

## 🎨 Visual Result

After fixing, when you click on a deduction activity, you'll see:

```
┌─────────────────────────────────────────────┐
│ Previous Stock │  Deducted   │  New Stock  │
│      100       │     -20     │     80      │
└─────────────────────────────────────────────┘
```

## 🚨 If You Still Get Errors

If you still see errors after running the SQL:

1. **Clear your browser cache** - The schema cache might be stale
2. **Refresh the page** - Force a full page reload (Ctrl+Shift+R / Cmd+Shift+R)
3. **Check RLS Policies** - Make sure RLS is still disabled on `activity_logs`

Run this to verify RLS is disabled:
```sql
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
```

## 📊 Optional: View All Columns

To see all columns in the activity_logs table:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'activity_logs'
ORDER BY ordinal_position;
```

---

**Last Updated:** March 9, 2026  
**Status:** Ready to apply
