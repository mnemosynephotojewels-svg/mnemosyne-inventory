# 🔧 Fix "Recipients Address is Empty" Error

## ❌ The Problem

EmailJS error: `"The recipients address is empty"`

**This means**: Your EmailJS template doesn't know WHERE to send the email!

---

## ✅ The Solution (30 seconds)

You need to configure the **"To email"** field in your EmailJS template.

---

## 🚀 Quick Fix Steps

### 1. Go to EmailJS Dashboard

**URL**: https://dashboard.emailjs.com/admin

### 2. Click "Email Templates" (left sidebar)

### 3. Click on your `password_reset` template

### 4. Find the "To email" Field (at the top)

You should see:
```
┌─────────────────────────────────┐
│ To email: [               ]     │  ← This is empty!
└─────────────────────────────────┘
```

### 5. Enter This EXACT Value:

```
{{to_email}}
```

**IMPORTANT**: Type it EXACTLY like that, with the curly braces!

### 6. Click "Save"

### 7. Test Again!

Go back to `/test-emailjs-now.html` and try sending an email again!

---

## 🎯 What This Does

When you put `{{to_email}}` in the "To email" field:

- EmailJS will look for a parameter called `to_email`
- Your code sends: `to_email: "user@example.com"`
- EmailJS uses that email as the recipient
- ✅ Email gets sent!

---

## 📸 Visual Guide

**Before (WRONG)** ❌:
```
┌─────────────────────────────────────────┐
│ Template Settings                       │
├─────────────────────────────────────────┤
│ To email: [                       ]     │ ← Empty!
│ Subject:  Your Password Reset Code      │
│ Content:  [Your HTML here...]           │
└─────────────────────────────────────────┘
```

**After (CORRECT)** ✅:
```
┌─────────────────────────────────────────┐
│ Template Settings                       │
├─────────────────────────────────────────┤
│ To email: {{to_email}}                  │ ← Fixed!
│ Subject:  Your Password Reset Code      │
│ Content:  [Your HTML here...]           │
└─────────────────────────────────────────┘
```

---

## 🔍 Detailed Steps with Screenshots

### Step-by-Step:

1. **Login**: https://dashboard.emailjs.com/
2. **Click**: "Email Templates" (left menu)
3. **Find**: Your `password_reset` template (or `template_y8ypuqa`)
4. **Click**: On the template name to edit it
5. **Look**: At the very top of the page
6. **Find**: "To email" input field
7. **Type**: `{{to_email}}` (with double curly braces)
8. **Scroll down**: Click "Save Changes" button
9. **Done**: Try sending email again!

---

## ✅ Full Template Settings

Make sure your template has these settings:

| Field | Value |
|-------|-------|
| **To email** | `{{to_email}}` ⭐ **THIS IS THE FIX!** |
| **From name** | Mnemosyne (or anything) |
| **Subject** | Your Password Reset Code - Mnemosyne |
| **Reply to** | (can be empty) |
| **Bcc** | (can be empty) |

---

## 🧪 Test It Again

After adding `{{to_email}}` to the "To email" field:

1. **Save** the template in EmailJS
2. **Open**: `/test-emailjs-now.html`
3. **Enter**: Your email address
4. **Click**: "Send Test Email"
5. **Result**: ✅ Email should arrive!

---

## 🎯 Why This Happens

EmailJS templates need TWO things:

1. ✅ **Content Variables**: `{{verification_code}}`, `{{to_name}}`, etc.
   - You already have these in your HTML content
   - These work fine

2. ❌ **Recipient Variable**: `{{to_email}}` in the "To email" field
   - This was MISSING
   - That's why you got the error

---

## 📋 Complete Template Configuration

Here's what ALL your template fields should look like:

```
Template Name: password_reset
Template ID: template_y8ypuqa

┌─────────────────────────────────────────────────────────┐
│ SETTINGS (at the top)                                   │
├─────────────────────────────────────────────────────────┤
│ To email:     {{to_email}}           ⭐ ADD THIS!       │
│ From name:    Mnemosyne                                 │
│ Subject:      Your Password Reset Code - Mnemosyne     │
│ Reply to:     (leave empty or add your email)          │
│ Bcc:          (leave empty)                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CONTENT (the HTML)                                      │
├─────────────────────────────────────────────────────────┤
│ [Your full HTML template from Step 3]                  │
│                                                         │
│ Variables used in content:                             │
│ • {{to_name}}                                          │
│ • {{verification_code}}                                │
│ • {{expiry_time}}                                      │
│ • {{app_name}}                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Common Mistakes

### ❌ WRONG:
```
To email: user@example.com           ← Hardcoded email
To email: to_email                   ← Missing {{ }}
To email: {to_email}                 ← Single braces
To email: {{recipient}}              ← Wrong variable name
```

### ✅ CORRECT:
```
To email: {{to_email}}               ← Perfect!
```

---

## 🎯 Quick Checklist

Before testing again:

- [ ] Logged into EmailJS dashboard
- [ ] Opened "Email Templates"
- [ ] Clicked on `password_reset` template
- [ ] Found "To email" field at the top
- [ ] Entered: `{{to_email}}` (exact spelling!)
- [ ] Clicked "Save Changes"
- [ ] Ready to test!

---

## 🧪 Test Flow

After fixing the template:

```
1. You click "Send Test Email"
   ↓
2. Your code sends: { to_email: "john@example.com", ... }
   ↓
3. EmailJS reads the template
   ↓
4. EmailJS sees: To email: {{to_email}}
   ↓
5. EmailJS replaces {{to_email}} with "john@example.com"
   ↓
6. EmailJS sends to: john@example.com
   ↓
7. ✅ Email delivered!
```

---

## 💡 Pro Tip

You can also use dynamic "From name":

```
From name: {{app_name}}
```

Then your code's `app_name: 'Mnemosyne'` will be used!

---

## 🆘 Still Not Working?

If you still get errors after adding `{{to_email}}`:

1. **Double-check spelling**: Must be `to_email` (with underscore)
2. **Check the curly braces**: Must be `{{` and `}}` (double)
3. **Save the template**: Click "Save Changes" button
4. **Refresh the test page**: Reload `/test-emailjs-now.html`
5. **Check EmailJS Activity Log**: See what error it shows

---

## 📞 Tell Me

After you fix the template, tell me:

- **"Fixed it!"** - I'll help you test
- **"Still broken"** - Send me the exact error message
- **"Can't find the field"** - I'll send you detailed screenshots

---

## ✅ Summary

**Problem**: EmailJS doesn't know where to send the email  
**Solution**: Add `{{to_email}}` to the "To email" field  
**Location**: EmailJS Dashboard → Email Templates → Your Template  
**Time to fix**: 30 seconds  

**Go fix it now!** 🚀

Then test again at: `/test-emailjs-now.html`
