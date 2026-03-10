# ✅ Supabase Connection Checklist

## Quick Reference - Follow in Order

### 🔹 Phase 1: Get Credentials
- [ ] Opened Supabase dashboard: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
- [ ] Created or selected a project
- [ ] Navigated to Settings → API
- [ ] Copied **Project URL** (format: `https://xxxxx.supabase.co`)
- [ ] Copied **anon public key** (long token starting with `eyJ...`)

---

### 🔹 Phase 2: Update Configuration
- [ ] Opened the `.env` file in project root
- [ ] Replaced `YOUR_SUPABASE_URL` with actual Project URL
- [ ] Replaced `YOUR_SUPABASE_ANON_KEY` with actual anon key
- [ ] Verified NO quotes around the values
- [ ] Verified NO extra spaces
- [ ] Saved the `.env` file

**Example of correct format:**
```env
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

---

### 🔹 Phase 3: Create Database
- [ ] Opened Supabase SQL Editor (left sidebar → SQL Editor)
- [ ] Created a new query
- [ ] Copied the complete SQL script from `🔧_DATABASE_CONNECTION_GUIDE.md`
- [ ] Pasted the SQL into the editor
- [ ] Clicked **RUN** ▶️ button
- [ ] Verified "Success" message appeared
- [ ] Checked Table Editor to confirm 4 tables exist:
  - [ ] `finished_products`
  - [ ] `raw_materials`
  - [ ] `packaging_materials`
  - [ ] `activity_logs`

---

### 🔹 Phase 4: Test Connection
- [ ] Stopped development server (Ctrl+C or Cmd+C)
- [ ] Restarted development server (`npm run dev` or `pnpm dev`)
- [ ] Opened app in browser
- [ ] Opened browser console (F12)
- [ ] Verified message: "🎉 ALL TESTS PASSED! Database is fully configured."
- [ ] Confirmed all 4 tables show ✅ checkmarks in console

---

### 🔹 Phase 5: Functional Testing
- [ ] Logged into the app
- [ ] Created a test raw material
- [ ] Verified it appears in the list
- [ ] Refreshed the page
- [ ] Confirmed data persists after refresh
- [ ] Checked Activity Log for the creation entry
- [ ] Deleted the test item (optional)

---

## ✅ Success Criteria

Your connection is working correctly if ALL of these are true:

1. ✅ No error messages in browser console
2. ✅ Console shows "🎉 ALL TESTS PASSED!" message
3. ✅ Can create new items (Raw Materials, Products, Packaging)
4. ✅ Data persists after page refresh
5. ✅ Activity logs are being created
6. ✅ Can edit and delete items
7. ✅ Dashboard shows correct counts

---

## ❌ Common Issues & Fixes

### Issue 1: "Connection unsuccessful"
**Symptoms:** Error in console, can't load data
**Causes:**
- Wrong URL or key in `.env`
- Extra quotes or spaces in `.env`
- Didn't restart dev server
- Supabase project is paused

**Fix:**
1. Double-check `.env` values match Supabase dashboard
2. Remove any quotes: `"https://..."` → `https://...`
3. Restart dev server
4. Check Supabase project status

---

### Issue 2: "Table doesn't exist"
**Symptoms:** Error: `relation "raw_materials" does not exist`
**Cause:** SQL script wasn't run or failed

**Fix:**
1. Go to Supabase SQL Editor
2. Run the complete SQL script
3. Check for error messages in SQL editor
4. Verify tables in Table Editor

---

### Issue 3: "403 Forbidden" or "Row Level Security"
**Symptoms:** Can't read/write data, 403 errors
**Cause:** RLS policies not created

**Fix:**
1. Ensure you ran the COMPLETE SQL script (all sections)
2. Go to Authentication → Policies in Supabase
3. Verify policies exist for all 4 tables
4. Re-run the policy section of SQL if needed

---

### Issue 4: Data doesn't persist
**Symptoms:** Items disappear after page refresh
**Cause:** Database writes failing

**Fix:**
1. Check browser console for errors
2. Verify `.env` is saved
3. Check Supabase project isn't at usage limit
4. Test with Supabase Table Editor (insert manually)

---

### Issue 5: Environment variables not loading
**Symptoms:** Still seeing placeholder values
**Cause:** `.env` file not being read

**Fix:**
1. Ensure file is named exactly `.env` (not `.env.txt`)
2. File must be in root directory (same level as `package.json`)
3. Restart dev server after ANY `.env` changes
4. Clear browser cache

---

## 🔍 Verification Commands

### Check environment variables are loaded:
Open browser console and type:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Should show your actual values, NOT "YOUR_SUPABASE_URL"

---

### Test database connection directly:
The app automatically runs diagnostics on load. Check console for:
```
═══════════════════════════════════════════
🔍 MNEMOSYNE DATABASE DIAGNOSTIC
═══════════════════════════════════════════
  ✅ Table "raw_materials": OK
  ✅ Table "finished_products": OK
  ✅ Table "packaging_materials": OK
  ✅ Table "activity_logs": OK
═══════════════════════════════════════════
```

---

## 📚 Reference Files

- **START_HERE_FIX_CONNECTION.txt** - Simple step-by-step guide
- **🔧_DATABASE_CONNECTION_GUIDE.md** - Complete detailed guide
- **QUICK_SETUP.md** - Quick reference card
- **SUPABASE_SETUP_INSTRUCTIONS.md** - Technical setup guide
- **.env.example** - Template for environment variables

---

## 🎯 Final Verification

Before marking as complete, verify:

- [x] **.env file** has real credentials (not placeholders)
- [x] **SQL script** executed successfully in Supabase
- [x] **4 tables** exist in Supabase Table Editor
- [x] **Dev server** restarted after .env changes
- [x] **Browser console** shows success message
- [x] **Test data** can be created and persists
- [x] **Activity logs** are working
- [x] **No 403 errors** when performing operations

---

## 🚀 You're Done!

If all items above are checked, your Mnemosyne inventory management system is now fully connected to your new Supabase database!

**Next steps:**
1. Start using the system normally
2. Consider setting up Storage for image uploads
3. Plan for production deployment
4. Backup your database regularly

---

## 📞 Need Help?

**Supabase Documentation:** https://supabase.com/docs  
**Your Organization:** https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi

**Before asking for help, ensure:**
- All checklist items above are completed
- You've checked browser console for specific errors
- You've verified Supabase project is active and not paused
- You've tried the common fixes listed above
