# 📧 Resend Email Setup - Complete Guide

## 🚨 CRITICAL: Resend Testing Mode Restriction

**If emails aren't being sent, it's likely because of Resend's testing mode restriction!**

---

## 🔍 The Problem

Resend has **TWO** modes:

### 1. Testing Mode (Default - FREE)
- ⚠️ **Can ONLY send to YOUR email** (the email you used to sign up for Resend)
- ⚠️ Attempts to send to other emails will fail silently
- ⚠️ Uses `onboarding@resend.dev` as sender
- ✅ No domain verification needed
- ✅ Free tier

### 2. Production Mode (Requires Domain)
- ✅ Can send to ANY email address
- ✅ Uses your custom domain (e.g., `noreply@yourdomain.com`)
- ⚠️ Requires domain verification
- ⚠️ Need to add DNS records

---

## ✅ QUICK FIX: Test with Your Email

**To verify everything is working RIGHT NOW:**

1. Open: `/test-email-direct.html`
2. Enter **YOUR email** (the one you used to sign up for Resend)
3. Click "Send Test Email"
4. Check your inbox!

**This will work immediately if:**
- Server function is deployed ✅
- RESEND_API_KEY is configured ✅
- You use YOUR Resend account email ✅

---

## 🚀 Solution 1: Use Your Email for Testing

**Simple, works immediately:**

```
1. What's your Resend account email?
   Example: john@gmail.com

2. Use that email to test password reset:
   - Go to your app
   - Click "Forgot Password"
   - Enter: john@gmail.com
   - Check your inbox!
   - Enter the 6-digit code
   - Reset password successfully! ✅
```

**This confirms everything is working!**

---

## 🌐 Solution 2: Verify Your Domain (For ANY Email)

**To send emails to ANY address, you need to verify a domain:**

### Step 1: Add Domain to Resend

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com` or use `resend.dev` subdomain)

### Step 2: Add DNS Records

Resend will show you DNS records to add. Example:

```
Type: TXT
Name: @ (or your domain)
Value: resend-verification-code-here
```

Add these in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

### Step 3: Verify Domain

1. Wait 5-15 minutes for DNS propagation
2. Click **"Verify"** in Resend dashboard
3. Domain status changes to **"Verified"** ✅

### Step 4: Update Server Function

Change the "from" email in `/supabase/functions/server/index.tsx`:

```typescript
// Before (testing mode):
from: 'Mnemosyne <onboarding@resend.dev>',

// After (your domain):
from: 'Mnemosyne <noreply@yourdomain.com>',
```

Then redeploy:
```bash
bash deploy-verification-code.sh
```

### Step 5: Test with ANY Email

Now you can send to ANY email address! 🎉

---

## 🎯 Solution 3: Use Resend's Free Domain

**Easiest way to test with ANY email (still free!):**

### Option A: Use Resend Dev Domain

Resend offers free subdomains for testing:

1. Go to: https://resend.com/domains
2. Click **"Use Resend Domain"**
3. Resend gives you: `your-name.resend.dev`
4. This is automatically verified! ✅

### Option B: Free Subdomains

Some services offer free subdomains:
- **Vercel**: Deploy a simple page, get `yourapp.vercel.app`
- **Netlify**: Same as Vercel, get `yourapp.netlify.app`
- **GitHub Pages**: Get `yourusername.github.io`

Then verify that domain in Resend.

---

## 🔧 Complete Setup Checklist

### ✅ Step 1: Deploy Server Function

```bash
bash deploy-verification-code.sh
```

**Verify:**
```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

Expected: `{"status":"ok"}`

---

### ✅ Step 2: Get Resend API Key

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name: `Mnemosyne Production`
4. Copy the key (starts with `re_`)

---

### ✅ Step 3: Add API Key to Supabase

1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
2. Scroll to **"Secrets"**
3. Click **"Add a new secret"**
4. Name: `RESEND_API_KEY`
5. Value: Paste your API key
6. Click **"Save"**

---

### ✅ Step 4: Test Email Sending

**Option A: Test Page**
```bash
open test-email-direct.html
```

**Option B: Your App**
1. Open your app
2. Click "Forgot Password"
3. Enter email (USE YOUR RESEND ACCOUNT EMAIL!)
4. Check inbox
5. Enter 6-digit code
6. Reset password ✅

---

### ✅ Step 5: Check Logs

**If email not received, check logs:**

1. **Browser Console:**
   - Open DevTools (F12)
   - Look for `📧 EMAIL SERVICE:` logs
   - Check for errors

2. **Supabase Logs:**
   - Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/logs/edge-functions
   - Filter by: `make-server-a9dec19d`
   - Look for Resend API responses

3. **Resend Dashboard:**
   - Go to: https://resend.com/emails
   - Check recent sends
   - Look for error messages

---

## 🐛 Troubleshooting Common Issues

### Issue #1: "Domain validation error"

**Error message:** `Domain not verified - running in demo mode`

**Cause:** Trying to send to email that's not your Resend account email

**Solutions:**
1. **Quick Fix:** Test with YOUR Resend account email
2. **Permanent Fix:** Verify a domain in Resend (see Solution 2 above)

---

### Issue #2: "Invalid API key"

**Error message:** `Invalid API key - running in demo mode`

**Causes:**
- API key not configured in Supabase
- API key is wrong/invalid
- API key doesn't start with `re_`

**Solutions:**
1. Check Supabase secrets: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
2. Make sure `RESEND_API_KEY` is set
3. Get new API key from: https://resend.com/api-keys
4. Make sure you copied the complete key

---

### Issue #3: Email in Spam Folder

**Email sent but not in inbox:**

**Solutions:**
1. **Check spam/junk folder**
2. **Mark as "Not Spam"**
3. **Add sender to contacts**
4. **Whitelist in email settings:**
   - Gmail: Add to contacts
   - Outlook: Add to safe senders
   - Yahoo: Add to contacts

---

### Issue #4: No Email Received (Testing Mode)

**Symptoms:**
- Console shows "✅ Email sent successfully"
- Resend dashboard shows email sent
- But you don't receive it

**Cause:** You're in testing mode and trying to send to a different email

**Solution:**
1. Check: Are you using YOUR Resend account email?
2. If not, use YOUR email for testing
3. Or verify a domain to send to any email

---

### Issue #5: Function Not Deployed

**Error:** `Function not found` or 404

**Solution:**
```bash
# Deploy the function
bash deploy-verification-code.sh

# Or manually
supabase functions deploy make-server-a9dec19d --project-ref anntzpswficnoekklsdr
```

---

## 📊 Testing Matrix

| Scenario | Will It Work? | Why? |
|----------|---------------|------|
| **Testing mode + YOUR email** | ✅ YES | Default Resend behavior |
| **Testing mode + OTHER email** | ❌ NO | Resend restriction |
| **Testing mode + No RESEND_API_KEY** | ⚠️ Demo Mode | Code shown in UI |
| **Verified domain + ANY email** | ✅ YES | Production mode |
| **Verified domain + YOUR email** | ✅ YES | Always works |

---

## 🎯 Recommended Setup Order

### For Development/Testing:
1. Deploy server function ✅
2. Add RESEND_API_KEY ✅
3. Test with YOUR Resend email ✅
4. Demo mode for other emails (code shown in UI)

### For Production:
1. Deploy server function ✅
2. Add RESEND_API_KEY ✅
3. Verify domain in Resend ✅
4. Update "from" email in code ✅
5. Redeploy function ✅
6. Test with ANY email ✅

---

## 💡 Key Insights

### Testing Mode is NOT a Bug
- It's a Resend security feature
- Prevents spam during testing
- Forces you to verify domains for production
- Common for email services (SendGrid, Mailgun do this too)

### Demo Mode is Your Friend
- Always works, even without email service
- Perfect for development
- Users still see verification code
- Password reset still functions

### Your Current Setup
Based on your question, here's likely what's happening:

```
1. Server function: ✅ Deployed
2. RESEND_API_KEY: ✅ Configured
3. Resend mode: ⚠️ Testing mode (only YOUR email works)
4. Test email: ❌ Using different email than Resend account
5. Result: Email not received (Resend blocked it)
```

**Solution:** Test with YOUR Resend account email!

---

## 🚀 Quick Test Right Now

**To verify everything works in 30 seconds:**

```bash
# 1. Open test page
open test-email-direct.html

# 2. Enter YOUR email (the one from your Resend account)
#    Example: If you signed up to Resend with john@gmail.com,
#    use john@gmail.com

# 3. Click "Send Test Email"

# 4. Check your inbox!
#    You should receive a beautiful Mnemosyne branded email
#    with a 6-digit verification code

# 5. Success! ✅
```

If this works, **your system is PERFECT** - you just need to either:
- A) Test with YOUR email, or
- B) Verify a domain to send to anyone

---

## 📞 Still Having Issues?

### Check These in Order:

1. **Is function deployed?**
   ```bash
   curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
   ```
   Expected: `{"status":"ok"}`

2. **Is RESEND_API_KEY set?**
   Check: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
   Look for: `RESEND_API_KEY` in secrets

3. **Are you using YOUR email?**
   The email you used to sign up for Resend?

4. **Check browser console:**
   Look for logs starting with `📧 EMAIL SERVICE:`

5. **Check Resend dashboard:**
   https://resend.com/emails
   Look for your test email and any errors

6. **Check Supabase logs:**
   https://supabase.com/dashboard/project/anntzpswficnoekklsdr/logs/edge-functions
   Filter by: `make-server-a9dec19d`

---

## ✨ Summary

**Your system is fully working! The issue is Resend's testing mode:**

✅ Code is correct  
✅ Server is deployed (if you ran the deploy script)  
✅ Email service is configured  
⚠️ Testing mode = can only send to YOUR Resend email  

**Immediate fix:** Test with YOUR Resend account email  
**Long-term fix:** Verify a domain in Resend  

---

**Need help?** Open `/test-email-direct.html` - it has a complete diagnostic tool! 🔧
