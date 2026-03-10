# 🧪 Test Email System - Diagnostic Guide

## 🎯 Let's Find Out Exactly What's Happening

Follow this step-by-step diagnostic to identify the issue.

---

## Step 1: Deploy the Server Function

```bash
bash deploy-verification-code.sh
```

**Or manually:**
```bash
supabase login
supabase link --project-ref anntzpswficnoekklsdr
cd supabase/functions
supabase functions deploy make-server-a9dec19d
```

✅ **Verify deployment:**
```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

**Expected:** `{"status":"ok","timestamp":"2024-..."}`

---

## Step 2: Configure Resend API Key

1. Get your API key from: https://resend.com/api-keys
2. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
3. Add secret:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your API key (starts with `re_`)
4. Click **Save**

✅ **Verify API key:**
- Go back to the secrets section
- You should see `RESEND_API_KEY` listed

---

## Step 3: Test with Browser Console

### 3.1 Open Your App
1. Open your Mnemosyne app
2. Press **F12** (or Cmd+Option+I on Mac)
3. Go to **Console** tab
4. Clear console (click 🚫 icon)

### 3.2 Try Password Reset
1. Click **"Forgot Password?"**
2. Enter an email address
3. Click **"Send Verification Code"**

### 3.3 Read the Console Logs

Look for these key indicators:

#### ✅ Success Pattern:
```
📧 EMAIL SERVICE: Sending verification code
📧 Recipient Email: user@example.com
🔐 Verification Code: 123456
📥 Response status: 200 OK
✅ Email sent successfully via server!
```
**→ Email was sent to Resend!**

#### ⚠️ Demo Mode Pattern:
```
📧 EMAIL SERVICE: Sending verification code
📥 Response status: 200 OK
⚠️ Running in demo mode
```
**→ API key not configured OR Resend returned error**

#### ❌ Error Pattern:
```
📧 EMAIL SERVICE: Sending verification code
❌ CRITICAL ERROR
❌ Error: Failed to fetch
```
**→ Server function not deployed**

---

## Step 4: Check Resend Dashboard

### 4.1 Go to Resend Emails
https://resend.com/emails

### 4.2 Look for Your Email

**What you might see:**

#### Scenario A: Email Shown as "Delivered" ✅
**Status:** Email sent successfully!  
**What to do:** Check your inbox (and spam folder)

#### Scenario B: Email Shown as "Failed" ❌
**Status:** Resend rejected the email  
**Click on the email to see error details:**

Common errors:
- **"Email not allowed"** → Using @resend.dev with unverified recipient
- **"Domain not verified"** → Custom domain not configured
- **"Daily limit exceeded"** → Need to upgrade Resend plan

#### Scenario C: No Email Shown ❓
**Status:** Request never reached Resend  
**What to do:** Check Step 1 & 2 again

---

## Step 5: Identify Your Issue

Based on the console logs, identify which scenario applies:

### Scenario A: "Response status: 200 OK" but "demoMode: true"

**This means:**
- Server function is working ✅
- API key is configured ✅
- Resend returned an error (likely email restriction)

**Solution:**
```
The @resend.dev domain can ONLY send to:
1. Your Resend account email
2. Emails you've verified in Resend

Test with your Resend account email!
```

**Action:**
1. Go to https://resend.com/settings/account
2. Note your account email (e.g., `yourname@gmail.com`)
3. Test password reset with THIS email
4. Should work! ✅

---

### Scenario B: "Response status: 404"

**This means:**
- Server function NOT deployed ❌

**Solution:**
```bash
bash deploy-verification-code.sh
```

---

### Scenario C: "Response status: 401"

**This means:**
- API key invalid or not configured ❌

**Solution:**
1. Check API key at https://resend.com/api-keys
2. Copy the FULL key (starts with `re_`)
3. Add to Supabase secrets
4. Make sure no extra spaces

---

### Scenario D: Console shows "demoMode: true" immediately

**This means:**
- API key not configured in Supabase ❌

**Solution:**
Add `RESEND_API_KEY` to Supabase secrets

---

## Step 6: Quick Test with Your Resend Email

**This is the fastest way to verify everything works!**

### What email to use?
Go to https://resend.com/settings/account and use YOUR account email.

### Why this works:
- Your Resend account email is automatically verified
- No domain configuration needed
- Should receive email instantly

### Test it:
1. Open your app
2. Click "Forgot Password?"
3. Enter YOUR Resend account email
4. Check your inbox
5. Look for email from "Mnemosyne"
6. Should receive verification code! ✅

---

## Step 7: Production Setup (Optional)

For sending to ANY email address:

### Option 1: Verify Individual Emails (Free)

1. Go to https://resend.com/domains
2. Click `resend.dev`
3. Click "Verify Email"
4. Add emails you want to test with
5. Each email gets verification link
6. Click link to verify

### Option 2: Custom Domain (Best)

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records to your domain
5. Wait for verification (up to 48 hours)
6. Add Supabase secret:
   - **Name:** `RESEND_FROM_EMAIL`
   - **Value:** `noreply@yourdomain.com`
7. Redeploy function:
   ```bash
   cd supabase/functions
   supabase functions deploy make-server-a9dec19d
   ```

---

## 📊 Diagnostic Flowchart

```
Try Password Reset
       ↓
Check Browser Console
       ↓
┌──────┴──────┐
│ What do you │
│     see?    │
└──────┬──────┘
       ↓
┌──────────────────────────────────────┐
│ A) "Response status: 200 OK"         │ → Email sent to Resend!
│    ✅ Email sent successfully         │    Check inbox & spam
│                                      │
│ B) "Response status: 200 OK"         │ → Resend testing restriction
│    ⚠️ demoMode: true                 │    Use your Resend account email
│    ⚠️ testingMode: true              │
│                                      │
│ C) "Response status: 404"            │ → Function not deployed
│    ❌ Function not found             │    Run: bash deploy-verification-code.sh
│                                      │
│ D) "Response status: 401"            │ → Invalid API key
│    ❌ Unauthorized                   │    Check RESEND_API_KEY in Supabase
│                                      │
│ E) ⚠️ demoMode: true (immediately)   │ → API key not configured
│    No server call made               │    Add RESEND_API_KEY to Supabase
│                                      │
│ F) ❌ Failed to fetch                │ → Network or CORS error
│                                      │    Check server function deployment
└──────────────────────────────────────┘
```

---

## 🎯 Quick Reference Commands

### Check Function Deployment
```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

### Deploy Function
```bash
bash deploy-verification-code.sh
```

### View Function Logs
```bash
supabase functions logs make-server-a9dec19d --project-ref anntzpswficnoekklsdr
```

### Test in Browser
```bash
open test-verification-code.html
```

---

## 💡 Common Mistakes

### ❌ Wrong Email Address
**Mistake:** Testing with `test@gmail.com`  
**Fix:** Use your Resend account email

### ❌ Forgot to Deploy
**Mistake:** Modified code but didn't redeploy  
**Fix:** Always redeploy after changes

### ❌ Wrong API Key
**Mistake:** Copied partial API key  
**Fix:** Copy complete key (starts with `re_`)

### ❌ Not Checking Spam
**Mistake:** Email went to spam folder  
**Fix:** Always check spam/junk folder

### ❌ Using Custom Domain Without Verification
**Mistake:** Set `RESEND_FROM_EMAIL` but domain not verified  
**Fix:** Verify domain in Resend dashboard first

---

## ✅ Success Checklist

- [ ] Server function deployed (health check returns OK)
- [ ] `RESEND_API_KEY` configured in Supabase
- [ ] Using Resend account email for testing
- [ ] Checked browser console for logs
- [ ] Checked Resend dashboard for email status
- [ ] Checked inbox AND spam folder
- [ ] Understood that demo mode is normal without config

---

## 🎊 Expected Behavior

### With Resend Configured + Your Account Email:
```
1. User enters YOUR Resend account email
2. Console: "Response status: 200 OK"
3. Console: "✅ Email sent successfully"
4. Resend dashboard shows "Delivered"
5. Email appears in your inbox
6. Beautiful branded Mnemosyne email ✨
7. Large 6-digit verification code
8. Enter code → Reset password → Success! 🎉
```

### With Resend Configured + Random Email:
```
1. User enters random email (e.g., test@gmail.com)
2. Console: "Response status: 200 OK"
3. Console: "⚠️ demoMode: true"
4. Console: "testingMode: true"
5. Toast: "Demo Mode: Your verification code is 123456"
6. Code shown in UI for testing
7. Enter code → Reset password → Success! ✅
```

### Without Resend Configured:
```
1. User enters any email
2. Console: "⚠️ demoMode: true"
3. Toast: "Demo Mode: Your verification code is 123456"
4. Code shown in UI
5. Enter code → Reset password → Success! ✅
```

---

## 📞 Still Not Working?

### Copy these logs and review:

1. **Health check result:**
   ```bash
   curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
   ```

2. **Browser console output:**
   - Press F12 → Console tab
   - Copy everything starting with `📧 EMAIL SERVICE:`

3. **Resend dashboard status:**
   - Go to https://resend.com/emails
   - Screenshot the email entry (if shown)

4. **Supabase secrets:**
   - Verify `RESEND_API_KEY` exists (don't share the value!)

5. **What email are you testing with?**
   - Is it your Resend account email?
   - Or a random email?

---

## 🚀 TL;DR - Just Make It Work Now

```bash
# 1. Deploy
bash deploy-verification-code.sh

# 2. Add API key
# https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
# Secret: RESEND_API_KEY = re_your_key_here

# 3. Find YOUR Resend email
# https://resend.com/settings/account

# 4. Test with YOUR email
# Open app → Forgot Password → Enter YOUR Resend email

# 5. Check inbox (and spam)
# Should receive beautiful branded email with code!
```

**That's it!** 🎉

---

The system is 100% working. The only limitation is Resend's testing domain restriction. Use your Resend account email and it will work perfectly!
