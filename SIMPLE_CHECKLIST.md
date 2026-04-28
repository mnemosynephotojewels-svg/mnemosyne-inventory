# ✅ Simple Email Checklist - Do These 3 Things

You said you set up Supabase and Resend but emails don't work.

**Do these 3 things in order:**

---

## ✅ 1. Check Function is Deployed

**Open your terminal and run:**

```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/health
```

**What you should see:**
```json
{"status":"ok","timestamp":"2026-03-05T..."}
```

**If you see 404 or error:**

Your function is NOT deployed. Deploy it:

1. Open: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/functions
2. Look for `make-server-a9dec19d`
3. If it doesn't exist:
   - Click "Create a new function"
   - Name: `make-server-a9dec19d`
   - Copy ALL code from `/supabase/functions/server/index.tsx`
   - Paste into editor
   - Click "Deploy"

---

## ✅ 2. Add RESEND_API_KEY to Supabase

**Open this page:**
https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions

**Scroll to "Secrets" section.**

**Do you see `RESEND_API_KEY` in the list?**

### If YES → Skip to Step 3

### If NO → Add it now:

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name: `Mnemosyne`
4. Copy the key (starts with `re_`)
5. Back in Supabase, click "Add a new secret"
6. Name: `RESEND_API_KEY`
7. Value: Paste the key
8. Click "Save"
9. **WAIT 30 SECONDS** ⏰

---

## ✅ 3. Test with YOUR Resend Email

**CRITICAL:** You MUST use the same email you used for Resend signup!

**Check which email you used:**
1. Go to: https://resend.com/settings
2. Look at the email shown
3. Remember this email!

**Now test:**

```bash
bash DIAGNOSE_NOW.sh
```

When it asks for email, enter the EXACT email from Resend settings.

**Expected:** ✅ Email sent! Check your inbox!

---

## 🎯 Summary

```
Step 1: curl https://...health
        → Should return: {"status":"ok"}
        → If not, deploy function

Step 2: Check Supabase → Settings → Functions → Secrets
        → Should see: RESEND_API_KEY
        → If not, add it from Resend

Step 3: bash DIAGNOSE_NOW.sh
        → Enter YOUR Resend email
        → Check inbox for verification code
```

---

## 🔴 If Still Not Working

Run this and send me the COMPLETE output:

```bash
bash DIAGNOSE_NOW.sh
```

Also tell me:
- What email did you use for Resend signup?
- What email are you testing with?
- Did you see RESEND_API_KEY in Supabase secrets?
- Did the health check return {"status":"ok"}?

With that info, I can fix it immediately! 🚀
