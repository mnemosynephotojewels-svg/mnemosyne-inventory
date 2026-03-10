# 🔧 FIX: Invalid API Key Error

## ❌ Current Problem

Your system is showing: **"Invalid API key"**

This means the Supabase anon key is incorrect.

---

## 🎯 Quick Fix (1 Minute)

### **Step 1: Get Your Correct API Key**

1. Click this link:
   👉 **https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api**

2. Find the section called **"Project API keys"**

3. Look for **"anon public"** (NOT "service_role secret")

4. **Copy the ENTIRE key** - it should:
   - Start with `eyJ`
   - Be 150-250 characters long
   - Look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...`

### **Step 2: Share the Key**

Paste the key here and I'll update your system immediately!

---

## 🔍 What Went Wrong?

The key you provided earlier (`sb_publishable_Ucl5bo_wy3ycTMRJHGSZ9Q_FE1sC35m`) is **NOT** a valid Supabase anon key format.

Supabase anon keys are **JWT tokens** that start with `eyJ`, not `sb_publishable_`.

---

## ✅ How to Identify the Correct Key

When you open the API Settings page, you'll see:

```
Project API keys
─────────────────────────────────────────

anon
public                               ← COPY THIS ONE! ✅

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYm1...
                                     ☝️ This is what you need!

─────────────────────────────────────────

service_role  
secret                               ← NOT THIS ONE! ❌

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYm1...
```

---

## 🧪 Test After Fix

Once I update your key:

1. **Open your Mnemosyne app**
2. **Click "Account Settings"**
3. **Click "Test Database Connection"**
4. **Check console (F12)** for:
   ```
   ✅ API key format is correct (JWT token)
   ✅ Supabase connection successful!
   ```

---

## 📖 Detailed Guide

For complete instructions with screenshots:
👉 See `/GET_CORRECT_KEY.md`

---

## ⏱️ ETA to Fix

- **Your part:** 30 seconds (copy the key)
- **My part:** 10 seconds (update system)
- **Total:** Less than 1 minute!

---

**Ready? Get your key here:**  
👉 https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api

Paste the **"anon public"** key (the one starting with `eyJ`) and I'll fix it immediately! 🚀
