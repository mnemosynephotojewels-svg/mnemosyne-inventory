# 🔧 Fix Gmail API Permissions Error

## 🎉 GOOD NEWS FIRST!

**Status 412** instead of **422** means:
- ✅ Your template is NOW correctly configured!
- ✅ EmailJS knows where to send emails!
- ✅ The recipient parameter is working!

**The only issue:** Gmail doesn't have permission to send emails on your behalf.

---

## ❌ The Error

```
Status 412: "Gmail_API: Request had insufficient authentication scopes."
```

**Translation:** Your Gmail connection to EmailJS doesn't have "send email" permission.

---

## ✅ The Fix (2 minutes)

You need to **reconnect Gmail** with the correct permissions.

---

## 🚀 Step-by-Step Fix

### Step 1: Go to EmailJS Dashboard

**URL:** https://dashboard.emailjs.com/admin

### Step 2: Click "Email Services" (Left Sidebar)

You should see your Gmail service listed.

### Step 3: Disconnect Gmail

1. Find your **Gmail service** (service_zrcx11y)
2. Look for a **"Disconnect"** or **"Remove"** button
3. Click it to disconnect Gmail
4. Confirm the disconnection

### Step 4: Reconnect Gmail with Correct Permissions

1. Click **"Add New Service"** button
2. Choose **"Gmail"**
3. Click **"Connect Account"**
4. **Sign in with Google**
5. **IMPORTANT:** When Google asks for permissions, make sure you see:
   - ✅ **"Send email on your behalf"**
   - ✅ **"Manage your email"**
   - ✅ **"Read, compose, send emails"**
6. Click **"Allow"** to grant all permissions
7. **Copy the new Service ID** (might be different!)

### Step 5: Update Service ID (If Changed)

If you got a NEW service ID:

**Reply with:** "New Service ID: service_xxxxx"

And I'll update your code instantly!

---

## 📋 Visual Guide

### What You're Looking For:

```
┌────────────────────────────────────────────┐
│ Email Services                             │
├────────────────────────────────────────────┤
│                                            │
│ 📧 Gmail                                   │
│    Service ID: service_zrcx11y             │
│    Status: Connected ✅                    │
│    [Settings] [Disconnect]  ← Click this!  │
│                                            │
└────────────────────────────────────────────┘
```

### After Disconnecting:

```
┌────────────────────────────────────────────┐
│ Email Services                             │
├────────────────────────────────────────────┤
│                                            │
│ No services connected                      │
│                                            │
│ [+ Add New Service]  ← Click this!         │
│                                            │
└────────────────────────────────────────────┘
```

### When Reconnecting:

Google will show permissions screen:

```
┌────────────────────────────────────────────┐
│ EmailJS wants to access your Google Account│
├────────────────────────────────────────────┤
│                                            │
│ This will allow EmailJS to:               │
│                                            │
│ ✅ Send email on your behalf              │
│ ✅ Manage your email                      │
│ ✅ Read, compose, and send emails         │
│                                            │
│ [Cancel]  [Allow]  ← Click Allow!         │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎯 Why This Happens

When you first connected Gmail, you might have only granted **"Read"** permissions.

EmailJS needs **"Send"** permissions to actually send emails.

By disconnecting and reconnecting, Google will ask for permissions again, and this time you can grant the correct ones.

---

## ⚠️ Alternative: Use a Different Email Service

If Gmail is being difficult, you can use a different email service:

### Option A: Outlook/Hotmail

1. Click **"Add New Service"**
2. Choose **"Outlook"**
3. Connect your Outlook/Hotmail account
4. Give me the new Service ID

### Option B: Custom SMTP

Use any email provider's SMTP settings:

1. Click **"Add New Service"**
2. Choose **"Custom SMTP"**
3. Enter your email provider's SMTP settings
4. Give me the new Service ID

---

## 🔍 How to Check Permissions

After reconnecting Gmail:

### Step 1: Test the Connection

EmailJS dashboard should show:
- ✅ Status: Connected
- ✅ Green checkmark
- ✅ "Ready to send"

### Step 2: Send Test Email

1. Open `/test-emailjs-now.html`
2. Enter your email
3. Click "Send Test Email"
4. Expected result: ✅ Email arrives!

---

## 🎯 What Changed

**Before:**
```
Error 422: "The recipients address is empty"
↓
Template wasn't configured with {{to_email}}
```

**Now:**
```
Error 412: "Gmail_API: Request had insufficient authentication scopes"
↓
Template IS configured! ✅
Gmail just needs permission to send ✅
```

**This is PROGRESS!** 🎉

---

## 📊 Checklist

- [ ] Logged into EmailJS dashboard
- [ ] Clicked "Email Services"
- [ ] Found Gmail service
- [ ] Clicked "Disconnect"
- [ ] Clicked "Add New Service"
- [ ] Selected "Gmail"
- [ ] Clicked "Connect Account"
- [ ] Signed in with Google
- [ ] **Allowed "Send email" permission** ⭐
- [ ] Clicked "Allow"
- [ ] Gmail reconnected successfully
- [ ] Ready to test!

---

## 🧪 After Reconnecting

### Test 1: Check EmailJS Dashboard

Your Gmail service should show:
- ✅ **Status: Connected**
- ✅ **Green indicator**
- ✅ **Service ID displayed**

### Test 2: Send Test Email

1. Open `/test-emailjs-now.html`
2. Enter your email
3. Click "Send Test Email"
4. Check inbox!

**Expected:**
- ✅ Status 200: "OK"
- ✅ Toast: "Email sent successfully!"
- ✅ Email arrives in inbox within 30 seconds

### Test 3: Try Password Reset

1. Refresh Mnemosyne app
2. Click "Forgot Password?"
3. Enter email
4. Click "Send Verification Code"
5. Check inbox!

---

## 🆘 Still Not Working?

### If you still get Error 412:

**Check Google Account Security:**

1. Go to: https://myaccount.google.com/permissions
2. Find **"EmailJS"** in the list
3. Click on it
4. Make sure it has **"Send email"** permission
5. If not, remove it and reconnect

### If Gmail keeps blocking:

**Try these:**

1. **Check Gmail Settings:**
   - Go to Gmail → Settings → Forwarding and POP/IMAP
   - Make sure IMAP is enabled

2. **Less Secure Apps:**
   - If using old Gmail account, enable "Less secure apps"
   - Go to: https://myaccount.google.com/lesssecureapps

3. **Use App Password:**
   - Generate an App Password for EmailJS
   - Go to: https://myaccount.google.com/apppasswords

---

## 💬 Tell Me:

After reconnecting Gmail:

1. **"Reconnected and it works!"** → Amazing! 🎉
2. **"Still Error 412"** → Check Google permissions
3. **"Gmail won't connect"** → Try Outlook instead
4. **"Got a new Service ID"** → Give it to me, I'll update code
5. **"Email sent successfully!"** → Perfect! All done! ✅

---

## 🎊 Summary

**The Good News:**
- ✅ Your template is now correctly configured
- ✅ `{{to_email}}` is working
- ✅ You're 95% done!

**The Last Step:**
- 🔄 Reconnect Gmail with "Send email" permission
- 🧪 Test and celebrate!

**You're SO CLOSE!** Just reconnect Gmail and you're done! 🚀

---

## 📝 Quick Recap

```
Error 422 (Before):  Template not configured
                     ↓ FIXED! ✅
                     
Error 412 (Now):     Gmail needs permission
                     ↓ EASY FIX!
                     
Success! (Soon):     Emails sending! 🎉
```

**Disconnect Gmail → Reconnect with permissions → Done!**
