# ⚡ Quick Setup Guide

## 3 Steps to Fix Database Connection

### 1️⃣ Get Your Credentials
- Go to: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
- Select your project → **Settings** → **API**
- Copy **Project URL** and **anon public key**

### 2️⃣ Update .env File
Edit the `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3️⃣ Run SQL Script
- Open: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
- Copy the entire SQL script from `SUPABASE_SETUP_INSTRUCTIONS.md` (Step 3)
- Paste and click **RUN**

### ✅ Done!
Restart your dev server and the connection should work!

---

## Need More Help?
See the complete guide in `SUPABASE_SETUP_INSTRUCTIONS.md`
