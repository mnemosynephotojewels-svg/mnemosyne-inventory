# ⚡ Enable Real Emails in 5 Minutes

## Why You're Not Getting Emails 📧❌

**Your system is in DEMO MODE because:**
- ❌ No Resend API key configured
- ❌ Edge Function needs the API key

**Right now**: Codes shown on screen only  
**After setup**: Real emails sent ✅

---

## 🚀 3 Steps to Enable Real Emails

### STEP 1: Get Free Resend API Key (2 minutes)

1. Go to: **https://resend.com/**
2. Click **"Sign Up"** (it's FREE!)
3. Verify your email
4. Go to **"API Keys"** section
5. Click **"Create API Key"**
6. **Copy** the key (looks like: `re_abc123...`)

✅ **Free plan**: 3,000 emails/month (way more than you need!)

---

### STEP 2: Add API Key to Supabase (2 minutes)

1. Go to: **https://supabase.com/dashboard/**
2. Open your project: **`anntzpswficnoekklsdr`**
3. Click **"Edge Functions"** (left sidebar)
4. Find: **`make-server-a9dec19d`** function
5. Click **"Settings"** or **"Secrets"**
6. Click **"New Secret"**
7. Enter:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_your_api_key_here` (paste from Step 1)
8. Click **"Save"**
9. **Redeploy** the function (click redeploy button)

---

### STEP 3: Test It! (1 minute)

1. Go to your Mnemosyne app
2. Click **"Forgot Password?"**
3. Enter your email (the one from Account Settings)
4. Check your email inbox! 📬

✅ **Email should arrive within seconds!**

---

## 🎯 Quick Visual Guide

```
┌─────────────────────────────────────────┐
│  BEFORE SETUP (Demo Mode)              │
├─────────────────────────────────────────┤
│  Forgot Password                        │
│  → Code shown on screen                 │
│  → NO email sent                        │
│  → Yellow alert box                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  AFTER SETUP (Real Emails!)            │
├─────────────────────────────────────────┤
│  Forgot Password                        │
│  → Email sent instantly ✅              │
│  → Professional email template          │
│  → Code delivered to inbox 📧          │
└─────────────────────────────────────────┘
```

---

## ✅ What Happens After Setup

### Before (Demo Mode):
```
You: "Send verification code"
System: "Here's your code on screen: 842567"
        [Yellow alert box appears]
```

### After (Real Emails):
```
You: "Send verification code"
System: "Email sent to your@email.com ✅"
[Email arrives in inbox with code]
```

---

## 📧 Sender Email Configuration

**Your Edge Function will send from:**
```
Mnemosyne <onboarding@resend.dev>
```

This works instantly with the test domain!

### Want to Use Your Own Domain?
1. In Resend: Add your domain
2. Configure DNS records
3. Update line 74 in `/supabase/functions/server/index.tsx`:
```typescript
from: 'Mnemosyne <noreply@yourdomain.com>',
```

---

## 🔍 Checking If It Worked

### Method 1: Try Password Reset
- Go to Forgot Password
- Enter email
- **Look for**: "Email sent successfully" (not "Demo Mode")
- **Check inbox!**

### Method 2: Check Console
Open browser console (F12):
- **Before**: "Demo mode - RESEND_API_KEY not configured"
- **After**: "Email sent successfully via Resend!"

### Method 3: Resend Dashboard
- Log into Resend
- Go to "Logs"
- You'll see email send events!

---

## 🆘 Troubleshooting

### "Still showing Demo Mode!"
**Fix**:
1. Make sure API key starts with `re_`
2. Redeploy the Edge Function after adding secret
3. Wait 30 seconds for redeployment
4. Try again

### "Error: Invalid API Key"
**Fix**:
1. Check you copied the full key from Resend
2. No extra spaces before/after the key
3. Key should start with `re_`

### "Email not received"
**Fix**:
1. ✅ Check spam folder
2. ✅ Verify sender email in Resend (`onboarding@resend.dev` is pre-verified)
3. ✅ Using test domain? Can only send to your Resend signup email
4. ✅ Check Resend logs for errors

### "Edge Function not found"
**Fix**: Deploy the function first
```bash
supabase functions deploy make-server-a9dec19d
supabase secrets set RESEND_API_KEY=re_your_key_here
```

---

## 💰 Cost Breakdown

| Feature | Free Tier | Your Needs |
|---------|-----------|------------|
| Emails/day | 100 | ~5-10 |
| Emails/month | 3,000 | ~50-200 |
| Credit card | Not required | ✅ |
| **Cost** | **$0** | **$0** |

**Perfect for Mnemosyne!** ✅

---

## 🎁 Bonus: Email Template Preview

Your password reset emails will look like this:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🏛️ MNEMOSYNE                   ┃
┃                                 ┃
┃  Reset Your Password            ┃
┃                                 ┃
┃  Hi [Name],                     ┃
┃                                 ┃
┃  Your verification code:        ┃
┃                                 ┃
┃     ┌─────────┐                 ┃
┃     │ 842567  │                 ┃
┃     └─────────┘                 ┃
┃                                 ┃
┃  Code expires in 10 minutes     ┃
┃                                 ┃
┃  [Professional footer]          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Professional, branded, beautiful! 🎨

---

## 📝 Quick Checklist

- [ ] Sign up at Resend.com (**FREE**)
- [ ] Get API key (starts with `re_`)
- [ ] Go to Supabase dashboard
- [ ] Add `RESEND_API_KEY` secret
- [ ] Redeploy Edge Function
- [ ] Test password reset
- [ ] Check email inbox
- [ ] **DONE!** ✅

---

## 🎯 TL;DR

1. **Sign up**: https://resend.com (FREE)
2. **Copy** API key
3. **Paste** in Supabase secrets as `RESEND_API_KEY`
4. **Redeploy** Edge Function
5. **Test** → Check inbox → **DONE!** ✅

**Time needed**: 5 minutes  
**Cost**: $0  
**Result**: Real emails! 📧✅

---

**You're 5 minutes away from real email delivery!** 🚀
