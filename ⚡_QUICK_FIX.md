# ⚡ QUICK FIX - Supabase Connection

## 🎯 Problem
Database connection error: "connection unsuccessful"

## ✅ Solution (5 minutes)

### 1️⃣ Get Credentials
```
1. Go to: https://supabase.com/dashboard/org/owtcnryoqjxbljhlcuhi
2. Click your project → Settings → API
3. Copy: Project URL + anon key
```

### 2️⃣ Update .env
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-key...
```

### 3️⃣ Create Tables
```
1. Go to Supabase → SQL Editor
2. Copy SQL from: 🔧_DATABASE_CONNECTION_GUIDE.md
3. Run it ▶️
```

### 4️⃣ Restart
```bash
npm run dev
```

## ✅ Check Success
Open browser console (F12), look for:
```
🎉 ALL TESTS PASSED! Database is fully configured.
```

## 📚 Full Guides
- `START_HERE_FIX_CONNECTION.txt` - Visual guide
- `🔧_DATABASE_CONNECTION_GUIDE.md` - Complete guide
- `CONNECTION_CHECKLIST.md` - Step-by-step checklist

---

**That's it! 5 minutes to fix. 🚀**
