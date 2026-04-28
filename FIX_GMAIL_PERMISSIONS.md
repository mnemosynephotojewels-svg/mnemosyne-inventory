# 🔧 Fix Gmail API Error 412 - Step-by-Step Guide

## Problem
Your Gmail service in EmailJS is getting error 412: "insufficient authentication scopes"

This means Gmail needs you to reconnect and grant additional sending permissions.

---

## ✅ SOLUTION: Reconnect Gmail with Full Permissions

### **Step 1: Go to EmailJS Dashboard**
1. Visit: **https://dashboard.emailjs.com/admin**
2. Log in to your account
3. Click **"Email Services"** in the left sidebar

### **Step 2: Find Your Gmail Service**
1. You should see your Gmail service listed (currently: `service_zrcx11y`)
2. Look for these buttons next to your Gmail service:
   - **"Reconnect"** button (preferred)
   - OR **"Edit"** button
3. Click the **"Reconnect"** or **"Edit"** button

### **Step 3: Disconnect Current Connection (If Needed)**
If you see a "Disconnect" or "Remove" option:
1. Click **"Disconnect"** to remove the current broken connection
2. Then click **"Connect"** or **"Add Gmail Service"** to start fresh

### **Step 4: Complete Gmail OAuth Flow**
1. A Google sign-in popup window will appear
2. **Select your Gmail account**
3. **CRITICAL:** When you see the permissions screen:
   
   ✅ **You MUST grant BOTH of these permissions:**
   - ✅ "View your email address"
   - ✅ "Send email on your behalf" or "Manage your mail" 
   
   **Make sure you scroll down** - sometimes the "Send email" permission is below the fold!

4. Check **ALL boxes** that appear
5. Click **"Allow"** or **"Continue"**

### **Step 5: Verify Connection**
After reconnecting, you should see:
- Status: ✅ **"Connected"** or **"Active"**
- A green checkmark or success indicator

### **Step 6: Test the Email**
1. Go back to your Mnemosyne app
2. Click "Forgot Password?"
3. Enter your email address
4. Click "Send Verification Code"
5. **Check your Gmail inbox** (and spam folder!)

---

## 🚨 Common Issues & Solutions

### Issue 1: "This app isn't verified by Google"
**Solution:**
1. Click **"Advanced"** (bottom left)
2. Click **"Go to EmailJS (unsafe)"** - This is safe, EmailJS is trusted
3. Continue with permission grant

### Issue 2: "You don't have permission to send email"
**Solution:**
1. Make sure you're using the **Gmail account that owns the EmailJS service**
2. Try using a different Gmail account (create a new one if needed)
3. Some Gmail accounts (especially G Suite/Google Workspace) have restrictions

### Issue 3: Still getting error 412 after reconnecting
**Solutions to try:**

**A. Use a Fresh Gmail Account:**
1. Create a brand new Gmail account: https://accounts.google.com/signup
2. In EmailJS, disconnect current Gmail service
3. Connect the NEW Gmail account instead
4. Grant all permissions
5. Update the "From" email in your EmailJS template

**B. Check Google Account Security Settings:**
1. Go to: https://myaccount.google.com/security
2. Scroll to "Third-party apps with account access"
3. Find "EmailJS" in the list
4. Make sure it shows these permissions:
   - ✅ "Send emails"
   - ✅ "Manage mail"
5. If not, remove it and reconnect in EmailJS

**C. Enable Less Secure Apps (Older Gmail Accounts):**
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. **Note:** This option is only available on older Gmail accounts

**D. Generate App Password (If 2FA is enabled):**
If you have 2-factor authentication enabled:
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character app password
5. In EmailJS, when connecting Gmail, use this app password

---

## 🔄 Alternative: Create Dedicated Email Account

**Best Practice for Production:**
1. Create a **new Gmail account** specifically for Mnemosyne
   - Example: `mnemosyne.system@gmail.com`
2. This keeps app emails separate from personal email
3. Connect this NEW account to EmailJS
4. Grant all permissions when connecting
5. Update your Service ID in the code if it changes

**Benefits:**
- ✅ Clean permission state (no previous connection issues)
- ✅ Dedicated inbox for app-related emails
- ✅ Better organization and security
- ✅ Can share access with team members

---

## 📝 After Successful Connection

Your current EmailJS configuration:
- **Public Key:** `dbbr3PM3LhbdU7D6-` ✅
- **Service ID:** `service_zrcx11y` (your Gmail service)
- **Template ID:** `template_y8ypuqa` ✅

**If your Service ID changes** after reconnecting:
1. Note the new Service ID (looks like: `service_xxxxxxx`)
2. Open: `/src/app/services/emailServiceEmailJS.ts`
3. Update line 22:
   ```typescript
   const EMAILJS_SERVICE_ID = 'your_new_service_id';
   ```
4. Save and test again

---

## ✅ Success Checklist

After reconnecting, verify:
- [ ] EmailJS dashboard shows Gmail as "Connected"
- [ ] You granted "Send email on your behalf" permission
- [ ] You can see the service with a green status indicator
- [ ] Test email sends successfully from your app
- [ ] Verification code arrives in your inbox (check spam too!)

---

## 🆘 Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Check the browser console** in your app:
   - Press F12 to open DevTools
   - Look for detailed error messages
   - Share the error message for more specific help

2. **Try the EmailJS Test Feature:**
   - Go to: https://dashboard.emailjs.com/admin/services
   - Find your Gmail service
   - Click "Send Test Email"
   - If this fails, the problem is in EmailJS setup
   - If this works, the problem is in your app code

3. **Contact EmailJS Support:**
   - Email: support@emailjs.com
   - Explain: "Gmail error 412 - insufficient authentication scopes"
   - They can check your account permissions server-side

---

## 💡 Important Notes

- **Gmail has the strictest OAuth requirements** of all email providers
- The error 412 specifically means Gmail needs more permissions
- Reconnecting usually fixes this issue
- Make sure to **scroll down** when granting permissions - don't miss any checkboxes!
- Some corporate Gmail/Google Workspace accounts have restrictions that prevent this from working

**The key is to ensure you grant the "Send email on your behalf" permission during the OAuth flow.**
