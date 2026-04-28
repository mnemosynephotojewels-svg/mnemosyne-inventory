# 🚀 Quick Guide: Connect Your New Supabase Database

## ⚡ 3 Simple Steps

### Step 1: Get Your Credentials (2 minutes)

1. Visit: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
2. Click on your project (or create one)
3. Go to **Settings** ⚙️ → **API** 
4. Copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public key** (long token starting with `eyJ...`)

### Step 2: Add Credentials to .env File (1 minute)

Open the `.env` file in your project root and paste your values:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
```

**💡 Tip:** Remove the placeholder text completely and paste your actual values.

### Step 3: Create Database Tables (3 minutes)

1. Open Supabase SQL Editor: 
   - Click **SQL Editor** in your Supabase dashboard sidebar
   - Or visit: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`

2. Copy the SQL script from **SUPABASE_SETUP_INSTRUCTIONS.md** (Step 3)

3. Paste into the SQL editor and click **RUN** ▶️

---

## ✅ Verify It's Working

After completing the steps above:

1. **Restart your development server**
2. **Open browser console** (F12)
3. Look for this message:
   ```
   🎉 ALL TESTS PASSED! Database is fully configured.
   ```

If you see ✅ green checkmarks, you're all set! 🎉

---

## 🆘 Troubleshooting

### Error: "Connection unsuccessful"
- Double-check your `.env` file has the correct URL and key
- Make sure there are no extra spaces or quotes
- Restart your dev server

### Error: "Table doesn't exist"
- Run the SQL script from Step 3
- Check the Supabase Table Editor to see if tables were created

### Error: "403 Forbidden"
- Make sure you ran the entire SQL script (including the policies section)
- Verify RLS is enabled in your Supabase dashboard

### Still having issues?
- See the complete guide: **SUPABASE_SETUP_INSTRUCTIONS.md**
- Check browser console for detailed error messages
- Verify your Supabase project is active (not paused)

---

## 📚 Additional Resources

- **Complete Setup Guide:** SUPABASE_SETUP_INSTRUCTIONS.md
- **Quick Reference:** QUICK_SETUP.md
- **Existing Database Files:** Check `/supabase/` folder for reference SQL

Your old database URL was: `https://jqbmnoxxgocjadllsipn.supabase.co`  
Make sure your new `.env` file points to your **new** project! 🎯
