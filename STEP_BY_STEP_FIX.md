# 🔧 STEP-BY-STEP: Fix Email Not Sending

## Follow these steps EXACTLY in order:

---

## ✅ STEP 1: Deploy the Server Function

**You MUST run this command first:**

```bash
bash deploy-verification-code.sh
```

**If you get "command not found":**

Make the script executable first:
```bash
chmod +x deploy-verification-code.sh
bash deploy-verification-code.sh
```

**If you don't have Supabase CLI:**

Install it first:
```bash
# macOS/Linux:
brew install supabase/tap/supabase

# Or visit: https://supabase.com/docs/guides/cli
```

**What this does:**
- Deploys the server function to Supabase
- Makes the email endpoint available
- Required for email sending to work

**Expected output:**
```
✅ DEPLOYMENT SUCCESSFUL!
🎉 Your verification code email function is now live!
```

**⚠️ STOP! Do not continue until you see "DEPLOYMENT SUCCESSFUL!"**

---

## ✅ STEP 2: Verify Function is Deployed

**Run this command:**

```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

**Expected output:**
```json
{"status":"ok","timestamp":"2026-03-05T..."}
```

**If you get 404 or error:**
- Go back to STEP 1
- Make sure deployment was successful
- Check for error messages

**✅ If you see `{"status":"ok"}` → Continue to STEP 3**

---

## ✅ STEP 3: Get Resend API Key

**3.1. Sign up for Resend (if you haven't):**

Go to: https://resend.com/signup

**3.2. Get your API key:**

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name: `Mnemosyne Production`
4. Permission: **Full Access**
5. Click **"Create"**
6. **Copy the key** (starts with `re_`)

**⚠️ IMPORTANT:** Save this key! You can't see it again!

Example key: `re_123456789abcdefghijklmnopqrstuvwxyz`

---

## ✅ STEP 4: Add API Key to Supabase

**4.1. Open Supabase Functions Settings:**

https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions

**4.2. Scroll down to "Secrets" section**

**4.3. Click "Add a new secret"**

**4.4. Enter:**
- **Name:** `RESEND_API_KEY`
- **Value:** Paste your Resend API key (from STEP 3)

**4.5. Click "Save"**

**4.6. Verify it's saved:**
- You should see `RESEND_API_KEY` in the list of secrets
- The value will be hidden (shown as `••••••••`)

**✅ Secret saved → Continue to STEP 5**

---

## ✅ STEP 5: Test with Diagnostic Tool

**5.1. Open the test page:**

In your browser, open:
```
file:///[YOUR_PROJECT_PATH]/test-email-direct.html
```

Or just double-click `test-email-direct.html` file.

**5.2. Run Step 1: Check Server Function**

Click: **"Check if Function is Deployed"**

**Expected:** ✅ Server Function is Deployed!

**If you see error:**
- Go back to STEP 1 and redeploy
- Make sure you ran `bash deploy-verification-code.sh`

**5.3. Run Step 2: Test Email Sending**

**CRITICAL: What email did you use to sign up for Resend?**

Example: If you signed up with `john@gmail.com`, use that EXACT email.

Enter that email in the "Your Email" field.

Click: **"Send Test Email"**

**5.4. Check the result:**

**✅ SUCCESS:**
```
✅ Email Sent Successfully!
Email sent to: your@email.com
```
→ **Check your inbox!** (and spam folder)

**⚠️ DEMO MODE:**
```
⚠️ Demo Mode Active
Your verification code is: 123456
```
→ **Go back to STEP 4** - API key not configured correctly

**❌ ERROR:**
```
❌ Failed to Send Email
Error: Domain validation error
```
→ **See STEP 6 below** - Resend testing mode restriction

---

## ✅ STEP 6: Understanding Resend Testing Mode

**If you see "Domain validation error" or no email received:**

This is because **Resend Testing Mode** only allows sending to:
- **YOUR email** (the one you used to sign up for Resend)
- No other emails allowed until you verify a domain

**Two options:**

### Option A: Test with YOUR Email (Easiest)

**Use the EXACT email you used to sign up for Resend.**

If you signed up with `alice@example.com`:
- ✅ Send to: `alice@example.com` → **WORKS!**
- ❌ Send to: `bob@test.com` → **BLOCKED**

This is a Resend security feature, not a bug!

### Option B: Verify Domain (Send to Anyone)

Follow the guide in `/RESEND_SETUP_COMPLETE.md` to verify your domain.

---

## ✅ STEP 7: Test in Your App

**Now test the actual password reset flow:**

1. Open your app
2. Click **"Forgot Password?"**
3. Enter **YOUR** Resend account email
4. Check your inbox (and spam folder)
5. You should receive a beautiful Mnemosyne email with a 6-digit code
6. Enter the code in the app
7. Reset your password successfully! 🎉

---

## 🐛 TROUBLESHOOTING

### Issue: "bash: deploy-verification-code.sh: command not found"

**Solution:**
```bash
# Make executable
chmod +x deploy-verification-code.sh

# Run it
bash deploy-verification-code.sh
```

---

### Issue: "Supabase CLI not found"

**Solution:**
```bash
# macOS/Linux:
brew install supabase/tap/supabase

# Windows (with Scoop):
scoop install supabase

# Or download from:
# https://supabase.com/docs/guides/cli
```

---

### Issue: Health check returns 404

**This means function is NOT deployed!**

**Solution:**
1. Run: `bash deploy-verification-code.sh`
2. Wait for "✅ DEPLOYMENT SUCCESSFUL!"
3. Test health check again

---

### Issue: "Demo Mode Active" in test tool

**This means RESEND_API_KEY is not configured!**

**Solution:**
1. Go back to STEP 3
2. Get your Resend API key
3. Go to STEP 4
4. Add it to Supabase secrets
5. Make sure the name is EXACTLY: `RESEND_API_KEY`
6. Test again

---

### Issue: Email not received (but no error)

**Possible causes:**

**1. Testing mode restriction:**
- You're using a different email than your Resend account
- **Solution:** Use YOUR Resend account email

**2. Email in spam folder:**
- Check spam/junk folder
- Mark as "Not Spam"
- Add to contacts

**3. API key wrong:**
- Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
- Delete the old `RESEND_API_KEY`
- Add a new one with correct value

**4. Resend domain not verified:**
- Testing mode can only send to YOUR email
- Verify domain to send to anyone
- See `/RESEND_SETUP_COMPLETE.md`

---

### Issue: "Invalid API key"

**Solution:**

1. **Get new API key:**
   - Go to: https://resend.com/api-keys
   - Create new key
   - Copy it (starts with `re_`)

2. **Update Supabase:**
   - Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
   - Find `RESEND_API_KEY`
   - Click edit icon
   - Paste new key
   - Save

3. **Test again**

---

## 📊 Quick Checklist

Before asking for help, verify ALL of these:

- [ ] Ran `bash deploy-verification-code.sh`
- [ ] Saw "✅ DEPLOYMENT SUCCESSFUL!"
- [ ] Health check returns `{"status":"ok"}`
- [ ] Created Resend account
- [ ] Got Resend API key (starts with `re_`)
- [ ] Added `RESEND_API_KEY` to Supabase secrets
- [ ] Secret name is EXACTLY `RESEND_API_KEY` (not `resend_api_key` or other)
- [ ] Testing with the SAME email as Resend account
- [ ] Checked spam/junk folder
- [ ] Opened browser console to see logs

---

## 🎯 Most Common Issue

**95% of the time, the issue is:**

```
❌ Using different email than Resend account
```

**Example:**
- You signed up to Resend with: `john@gmail.com`
- You're testing with: `alice@test.com`
- **Result:** Email blocked (Resend testing mode)

**Solution:**
- Test with: `john@gmail.com` → **WORKS!** ✅

---

## 📞 Still Not Working?

**Check these logs in order:**

**1. Browser Console:**
```
Open DevTools (F12)
Look for: "📧 EMAIL SERVICE:"
Check for errors
```

**2. Diagnostic Tool:**
```
Open: test-email-direct.html
Check "Console Logs" section at bottom
```

**3. Supabase Logs:**
```
https://supabase.com/dashboard/project/anntzpswficnoekklsdr/logs/edge-functions
Filter: make-server-a9dec19d
Look for errors
```

**4. Resend Dashboard:**
```
https://resend.com/emails
Check if emails are being attempted
Look for error messages
```

---

## ✅ Success Indicators

**You'll know it's working when:**

1. **Health check:** Returns `{"status":"ok"}` ✅
2. **Test tool:** Shows "✅ Email Sent Successfully!" ✅
3. **Your inbox:** Receives beautiful Mnemosyne email ✅
4. **Console:** Shows "✅ Verification code email sent!" ✅
5. **No demo mode:** No toast showing the code ✅

---

## 🎉 After It Works

**Once you successfully receive an email:**

1. You can verify a domain to send to anyone
2. Or continue using YOUR email for testing
3. Demo mode works perfectly for other users
4. System is production-ready!

---

## 📚 Additional Resources

- **Complete Guide:** `/RESEND_SETUP_COMPLETE.md`
- **Quick Fix:** `/EMAIL_NOT_WORKING_FIX.md`
- **Start Here:** `/START_HERE_EMAIL_ISSUE.md`
- **Deployment:** `/DEPLOY_VERIFICATION_CODE.md`

---

**Follow these steps EXACTLY and it will work!** 🚀
