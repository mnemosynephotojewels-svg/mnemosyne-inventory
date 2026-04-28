# 🚀 Deploy Mnemosyne to Supabase - Complete Guide

Your Mnemosyne inventory system is currently working in **offline mode** using localStorage. Follow these simple steps to enable **database mode** with Supabase.

## 🎯 What You'll Get After Deployment

- ✅ **Cross-device sync** - Access your inventory from any device
- ✅ **Cloud backup** - All data stored safely in Supabase
- ✅ **Team collaboration** - Multiple users can access the same data
- ✅ **Real-time updates** - Changes sync instantly

---

## 📋 Quick Start (3 Simple Steps)

### Step 1: Install Supabase CLI

Open your terminal and run:

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser. Login with your Supabase account.

### Step 3: Deploy the Edge Function

**On Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**On Windows:**
```bash
deploy.bat
```

**Or manually:**
```bash
supabase link --project-ref jqbmnoxxgocjadllsipn
supabase functions deploy server --no-verify-jwt
```

---

## ✅ Verify Deployment

After deployment, test the connection:

```bash
curl https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d/health
```

You should see:
```json
{"status":"ok"}
```

---

## 🎉 Start Using Database Mode

1. **Refresh your Mnemosyne app** in the browser
2. **Check the browser console** (F12) - you should see:
   ```
   ✅ Loaded from server
   📦 Fetching packaging materials from server...
   ✅ Loaded 3 packaging materials from server
   ```
3. **Add a packaging material** - it will now save to Supabase!

---

## 🔧 Alternative: Deploy via Supabase Dashboard

If you prefer using the web interface:

1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn
2. Click **Edge Functions** in the left sidebar
3. Click **Deploy new function**
4. **Name:** `server`
5. **Copy** the entire contents of `/supabase/functions/server/index.tsx`
6. Click **Deploy**

---

## 📊 Create the Database Table

Your Edge Function uses a simple key-value store. Create the table:

1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor
2. Click **New Query**
3. Paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS kv_store_a9dec19d (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_a9dec19d(key);
```

4. Click **Run**

---

## 🐛 Troubleshooting

### Error: "Supabase Edge Function not deployed yet"

**Solution:** Follow the deployment steps above

### Error: "supabase command not found"

**Solution:** Install Supabase CLI:
```bash
npm install -g supabase
```

### Error: "Not logged in"

**Solution:** Login to Supabase:
```bash
supabase login
```

### Error: "Failed to link to project"

**Solution:** Make sure you have access to the project. Check your Supabase dashboard.

### Error: "Table does not exist"

**Solution:** Create the `kv_store_a9dec19d` table using the SQL above

---

## 📱 Current vs Database Mode

### Current (Offline Mode)
```
⚠️ Supabase Edge Function not deployed yet
ℹ️  Using localStorage for now
✅ Saved to localStorage
⚠️ Data is saved locally only
```

### After Deployment (Database Mode)
```
✅ Loaded from server
📦 Adding packaging material: Box
✅ Saved to localStorage
🌐 Sending to Supabase database...
📡 Response status: 200
✅✅✅ Successfully saved to Supabase database!
🎉 Material is now synced across all devices!
```

---

## 💡 Important Notes

- **Your data is safe** - The app works perfectly in offline mode
- **No data loss** - localStorage keeps everything until you deploy
- **Smooth transition** - Your existing data will be preserved
- **Instant sync** - Once deployed, all devices sync automatically

---

## 🎯 One-Line Deploy

For advanced users, deploy everything with one command:

```bash
npm install -g supabase && supabase login && supabase link --project-ref jqbmnoxxgocjadllsipn && supabase functions deploy server --no-verify-jwt
```

---

## 📞 Need Help?

- 📚 Supabase Docs: https://supabase.com/docs
- 🚀 Edge Functions: https://supabase.com/docs/guides/functions
- 💬 Supabase Discord: https://discord.supabase.com

---

## ✨ After Successful Deployment

Your Mnemosyne inventory system will:

1. ✅ Save all packaging materials to Supabase
2. ✅ Sync across all devices in real-time
3. ✅ Backup data to the cloud automatically
4. ✅ Enable team collaboration
5. ✅ Provide full CRUD operations with persistence

**Enjoy your fully connected Mnemosyne system!** 🎉💎✨
