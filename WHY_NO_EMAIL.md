# ❌ Why You Can't Receive Verification Code Emails

## 🎯 You said: "I already set up Supabase and Resend but still can't send emails"

There are only **3 possible reasons** why emails aren't working:

---

## ❌ REASON 1: Server Function Not Deployed

**What it means:** The code that sends emails isn't running on Supabase.

**How to check:**
```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/health
```

**What you should see:** `{"status":"ok",...}`

**If you see 404 or error:** Function is NOT deployed.

**How to fix:**
1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/functions
2. Look for function named: `make-server-a9dec19d`
3. If it doesn't exist → Deploy it (see instructions below)

---

## ❌ REASON 2: RESEND_API_KEY Not Added to Supabase

**What it means:** Supabase doesn't have your Resend API key.

**How to check:**
1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
2. Scroll to "Secrets" section
3. Look for: `RESEND_API_KEY`

**If you DON'T see it:** API key is NOT configured.

**How to fix:**
1. Get API key from: https://resend.com/api-keys
2. Click "Create API Key" → Name: "Mnemosyne" → Copy it
3. In Supabase, click "Add a new secret"
4. Name: `RESEND_API_KEY` (exactly this!)
5. Value: Paste your API key (starts with `re_`)
6. Click "Save"
7. **WAIT 30 seconds** for changes to apply

---

## ❌ REASON 3: Testing with Wrong Email (MOST COMMON!)

**What it means:** Resend FREE accounts can ONLY send to YOUR email.

**The Rule:**
- ✅ Can send to: The email you used to sign up for Resend
- ❌ Cannot send to: ANY other email address

**Example:**
```
Your Resend account email: john@gmail.com
Testing with: john@gmail.com ← ✅ WORKS!
Testing with: alice@test.com ← ❌ BLOCKED by Resend!
```

**How to check which email you used:**
1. Go to: https://resend.com/settings
2. Look at the email shown in your account
3. Use THAT email for testing

**How to fix:**
- Use the SAME email you signed up with
- OR verify a domain to send to anyone: https://resend.com/domains

---

## 🚀 RUN THE DIAGNOSTIC

Instead of guessing, let the diagnostic tell you EXACTLY what's wrong:

```bash
chmod +x DIAGNOSE_NOW.sh
bash DIAGNOSE_NOW.sh
```

**This will:**
- ✅ Check if function is deployed
- ✅ Check if API key is configured
- ✅ Send a test email to YOUR email
- ✅ Tell you EXACTLY how to fix any issues

---

## 📋 Manual Checklist

Before saying "it still doesn't work", verify ALL of these:

### ☑️ Server Function Deployed?

```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/health
```
Expected: `{"status":"ok"}`

- [ ] I ran this command
- [ ] I got `{"status":"ok"}`

### ☑️ RESEND_API_KEY Configured?

1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
2. Scroll to "Secrets"

- [ ] I see `RESEND_API_KEY` in the list
- [ ] The value starts with `re_`
- [ ] I saved it and waited 30 seconds

### ☑️ Using Correct Email?

1. Go to: https://resend.com/settings
2. Check my account email

- [ ] I'm testing with the SAME email as my Resend account
- [ ] NOT testing with a different email

---

## 🔍 Check Logs

If all 3 are correct but emails still don't arrive:

**Check Supabase Logs:**
https://supabase.com/dashboard/project/anntzpswficnoekklsdr/logs/edge-functions

Look for:
- Error messages
- Failed requests
- API key issues

**Check Resend Dashboard:**
https://resend.com/emails

Look for:
- Recent emails sent
- Delivery status
- Error messages

---

## 💡 Quick Debug in Your App

Open your app, open browser console (F12), then:

1. Click "Forgot Password"
2. Enter email
3. Click "Send Verification Code"
4. Look at console logs

**If you see:**
```
⚠️ Running in demo mode - RESEND_API_KEY issue detected
```
→ RESEND_API_KEY is NOT configured in Supabase

**If you see:**
```
✅ Email sent successfully via server!
```
→ Email was sent! Check spam folder, wait 1-2 minutes

**If you see:**
```
❌ CRITICAL ERROR: Failed to fetch
```
→ Server function is NOT deployed

---

## 🎯 Most Likely Problem

**90% of the time, it's one of these:**

1. **RESEND_API_KEY not added to Supabase**
   - Fix: Add it in Supabase → Settings → Functions → Secrets

2. **Testing with wrong email**
   - Fix: Use YOUR Resend account email

3. **Function not deployed**
   - Fix: Deploy via Supabase dashboard

---

## ⚡ DO THIS NOW

**Run the diagnostic script:**

```bash
bash DIAGNOSE_NOW.sh
```

**It will tell you EXACTLY what's wrong!**

**Then send me the complete output so I can help you fix it!**

---

## 📧 Still Not Working?

If you've done everything above and it still doesn't work, send me:

1. Output of: `bash DIAGNOSE_NOW.sh`
2. Screenshot of: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions (Secrets section)
3. Screenshot of: https://resend.com/api-keys
4. Screenshot of browser console when you try password reset

With that info, I can tell you EXACTLY what's wrong! 🚀
