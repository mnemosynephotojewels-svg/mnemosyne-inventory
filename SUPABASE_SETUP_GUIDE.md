# Mnemosyne - Supabase Database Setup Guide

## Step 1: Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: Mnemosyne Inventory (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier works great
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your Connection Credentials

Once your project is ready:

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
   ```

4. **Copy these values** - you'll need them in Step 4

---

## Step 3: Create Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"+ New query"**
3. Copy and paste the **entire SQL schema** from the `SUPABASE_SCHEMA.sql` file
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: **"Success. No rows returned"**

---

## Step 4: Update Your App Configuration

Open the file `/src/app/lib/supabase.ts` in your project and update these two lines:

```typescript
const FALLBACK_URL = 'https://xxxxxxxxxxxxx.supabase.co';  // ← Paste your Project URL here
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // ← Paste your anon key here
```

Replace the existing values with your new credentials from Step 2.

---

## Step 5: Enable Row Level Security (RLS) - OPTIONAL

For enhanced security, you can enable RLS:

1. Go to **"Table Editor"** in Supabase dashboard
2. For each table (`raw_materials`, `packaging_materials`, `finished_products`, `activity_logs`):
   - Click the table name
   - Click the **"RLS"** button at the top
   - Click **"Disable RLS"** to keep it simple (for now)

**Note:** RLS is disabled by default in our schema for easier development. Enable it later when you're ready to add user-level security.

---

## Step 6: Test Connection

1. Save the `supabase.ts` file with your new credentials
2. Reload your Mnemosyne app
3. Login with: **username: mnemosyne** / **password: mnemosyne000**
4. Try adding a test material
5. Check your Supabase dashboard → **"Table Editor"** to see the data appear!

---

## Troubleshooting

### ❌ "Failed to fetch" error
- **Cause:** Project URL or key is incorrect
- **Fix:** Double-check your credentials in `supabase.ts`

### ❌ "relation does not exist" error
- **Cause:** Tables weren't created
- **Fix:** Re-run the SQL schema from Step 3

### ❌ "JWT expired" error
- **Cause:** You copied the wrong key
- **Fix:** Make sure you copied the **anon/public** key, not the service_role key

### ✅ Success!
You should see data appearing in your Supabase dashboard's Table Editor after adding items in the app.

---

## Database Schema Overview

Your Mnemosyne database includes 4 tables:

1. **`raw_materials`** - Raw materials inventory
2. **`packaging_materials`** - Packaging materials inventory  
3. **`finished_products`** - Finished products with Bill of Materials
4. **`activity_logs`** - Complete activity history

All tables include automatic timestamps (`created_at`, `updated_at`) and proper indexing for performance.

---

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for detailed error messages
2. Check Supabase dashboard → **"Logs"** → **"Database"** for errors
3. Verify your project isn't paused (free tier pauses after 7 days of inactivity)

---

**You're all set! 🎉**
