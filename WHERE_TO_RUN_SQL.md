# 🎯 WHERE TO RUN THE SQL - VISUAL GUIDE

## 📍 EXACT LOCATION

### **URL:**
```
https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
```

---

## 🖱️ STEP-BY-STEP WITH SCREENSHOTS

### **1. Open Supabase Dashboard**
- Click the link above
- You'll see the Supabase project dashboard

### **2. Find the SQL Editor**
Look for tabs at the top:
```
[ Table Editor ] [ SQL Editor ] [ Database ] [ API Docs ]
                    ↑
                CLICK HERE
```

### **3. You'll See a Blank SQL Editor**
It looks like this:
```
┌─────────────────────────────────────────────┐
│ SQL Editor                                  │
├─────────────────────────────────────────────┤
│                                             │
│  [Paste your SQL here]                      │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│                     [ RUN ] button here → │
└─────────────────────────────────────────────┘
```

### **4. Paste the SQL**
```sql
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;
```

### **5. Click the "RUN" Button**
- Usually green or blue
- Located at bottom right of the editor
- Keyboard shortcut: **Ctrl+Enter** (Windows) or **Cmd+Enter** (Mac)

---

## ✅ SUCCESS MESSAGE

After clicking RUN, you should see:

```
✅ Success. No rows returned
```

Or:

```
✅ Success
Rows returned: 0
```

This is normal! It means the columns were added successfully.

---

## 🔍 VERIFY IT WORKED

### **Option 1: Check Table Structure**

1. Click **"Table Editor"** tab (next to SQL Editor)
2. Click **"raw_materials"** table in the left sidebar
3. Look at the column headers - you should see:
   ```
   id | name | stock | unit | category | description | image_url | ...
                                  ↑          ↑
                              NEW COLUMNS!
   ```

### **Option 2: Run a Verification Query**

In the SQL Editor, run this:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'raw_materials';
```

You should see a list including:
```
category
description
```

---

## ⚠️ COMMON ISSUES

### **"Table doesn't exist" Error**
- Make sure you've run `/supabase/init.sql` first
- This creates the `raw_materials` table

### **"Already exists" Error**
```
ERROR: column "description" already exists
```
- This is fine! It means you already ran the SQL
- You can ignore this error
- The column already exists and is ready to use

### **"Permission denied" Error**
- Make sure you're logged into the correct Supabase account
- Check that you have admin access to the project

### **Can't Find SQL Editor**
- Make sure you're at the correct URL
- The project ID should be: `jqbmnoxxgocjadllsipn`
- Clear your browser cache and try again

---

## 🎯 ALTERNATIVE: Use Table Editor GUI

If you prefer clicking instead of SQL:

1. Go to **Table Editor** tab
2. Click **"raw_materials"** table
3. Click **"+"** button (Add Column)
4. Add first column:
   - Name: `category`
   - Type: `text`
   - Click Save
5. Click **"+"** again
6. Add second column:
   - Name: `description`
   - Type: `text`
   - Click Save

---

## 🚀 AFTER RUNNING SQL

1. ✅ Close Supabase
2. ✅ Go back to your Mnemosyne app
3. ✅ Press **Ctrl+Shift+R** to refresh
4. ✅ Try adding a material with a description
5. ✅ It will save successfully!

---

## 📝 THE SQL (COPY THIS)

```sql
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE raw_materials ADD COLUMN IF NOT EXISTS description TEXT;
```

---

## 🎉 THAT'S IT!

After running the SQL and refreshing your app, the description field will work perfectly!

---

💎 **Mnemosyne Inventory System** ✨  
**SQL Setup Guide** 📊
