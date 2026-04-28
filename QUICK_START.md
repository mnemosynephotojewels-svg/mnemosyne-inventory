# 🚀 Mnemosyne - Quick Start Guide

## Setup Your New Supabase Database in 5 Minutes

### ⚡ Step 1: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name it **"Mnemosyne Inventory"**
4. Wait 2-3 minutes for setup

---

### ⚡ Step 2: Copy Your Credentials
In Supabase dashboard:
1. Click **⚙️ Project Settings** (bottom left)
2. Click **"API"** in left menu
3. Copy these two values:

```
Project URL:      https://xxxxxxxxxxxxx.supabase.co
anon/public key:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### ⚡ Step 3: Run Database Setup
1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"+ New query"**
3. Open the file `SUPABASE_SCHEMA.sql` from your project
4. Copy **ALL** the SQL code
5. Paste it into Supabase SQL Editor
6. Click **"Run"** (or Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned"

---

### ⚡ Step 4: Update Your App
1. Open `/src/app/lib/supabase.ts` in your code
2. Find these lines (around line 21-22):

```typescript
const FALLBACK_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const FALLBACK_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

3. Replace them with YOUR credentials from Step 2:

```typescript
const FALLBACK_URL = 'https://xxxxxxxxxxxxx.supabase.co';  // Your URL
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Your key
```

4. **Save the file**

---

### ⚡ Step 5: Test It!
1. Reload your Mnemosyne app
2. Login: **mnemosyne** / **mnemosyne000**
3. Go to **Raw Materials** tab
4. Click **"Add Material"**
5. Add a test item (e.g., "Test Material")
6. Check Supabase dashboard → **"Table Editor"** → **"raw_materials"**
7. You should see your test item! 🎉

---

## ✅ You're Done!

Your Mnemosyne inventory system is now connected to your new Supabase database!

---

## 📚 Need More Help?

- **Full Setup Guide**: See `SUPABASE_SETUP_GUIDE.md`
- **Database Schema**: See `SUPABASE_SCHEMA.sql`
- **Troubleshooting**: Check browser console (F12) for error messages

---

## 🔍 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| "Failed to fetch" | Check credentials in `supabase.ts` |
| "relation does not exist" | Re-run the SQL schema |
| Nothing happening | Open browser console (F12) for details |

---

**Happy Inventory Managing! 📦**
