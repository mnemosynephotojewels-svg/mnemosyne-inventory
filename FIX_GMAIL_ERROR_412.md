# 🚨 FIX: Gmail API Error 412 (Insufficient Authentication Scopes)

## The Problem

When you click "Send Verification Code", you're getting this error:
```
status 412: "insufficient authentication scopes"
```

This happens because Gmail's API requires special OAuth permissions that EmailJS can't automatically provide.

---

## ✅ THE SOLUTION: Switch to Personal Email Service

EmailJS offers a **Personal Email** service that's simpler and doesn't require OAuth. Here's how to switch:

### Step 1: Go to EmailJS Dashboard
1. Open https://dashboard.emailjs.com/admin
2. Log in with your EmailJS account

### Step 2: Add Personal Email Service
1. Click **"Email Services"** in the left sidebar
2. Click **"Add New Service"** button
3. Select **"Personal Email"** from the list (NOT Gmail)
4. Click **"Connect Account"**

### Step 3: Configure Your Email
1. **Your Email**: Enter the email you want to send FROM (e.g., `your-email@gmail.com`)
2. **SMTP Server**: Gmail users should use `smtp.gmail.com`
3. **Port**: Use `465` (SSL) or `587` (TLS)
4. **Username**: Your full email address
5. **Password**: 
   - For Gmail: Use an **App Password** (see below)
   - For other email: Use your regular password

### Step 4: Get Gmail App Password (Gmail Users Only)
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Search for "App passwords" or go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Name it "EmailJS" or "Mnemosyne"
6. Click **Generate**
7. Copy the 16-character password
8. Paste it into EmailJS as your password

### Step 5: Test the Service
1. Click **"Create Service"**
2. EmailJS will send a test email
3. Check your inbox to verify it works
4. If successful, you'll see ✅ next to the service

### Step 6: Update Your Code
1. Copy the **Service ID** from EmailJS (looks like `service_xxxxxx`)
2. Open `/src/app/services/emailServiceEmailJS.ts`
3. Update this line:
   ```typescript
   const EMAILJS_SERVICE_ID = 'service_zrcx11y'; // Replace with your new Service ID
   ```
4. Save the file

---

## 🧪 Test It Out

1. Reload your Mnemosyne application
2. Click "Forgot Password?"
3. Enter your email
4. Click "Send Verification Code"
5. Check the browser console - you should see:
   ```
   ✅ Email sent successfully!
   ```
6. Check your email inbox for the verification code

---

## 📧 Other Email Providers

### Yahoo
- SMTP: `smtp.mail.yahoo.com`
- Port: 587
- Use App Password

### Outlook/Hotmail
- SMTP: `smtp-mail.outlook.com`
- Port: 587
- Use regular password

### Custom Domain
- Ask your email provider for SMTP settings
- Usually: `smtp.yourdomain.com`
- Port: 465 or 587

---

## ❓ Troubleshooting

### "Authentication failed"
- Double-check your email and password
- For Gmail, make sure you're using an **App Password**, not your regular password
- Make sure 2-Step Verification is enabled in your Google account

### "Connection timeout"
- Check your port (try 587 if 465 doesn't work)
- Make sure your firewall isn't blocking SMTP

### "Still getting 412 error"
- Make sure you updated `EMAILJS_SERVICE_ID` in the code
- Clear your browser cache and reload
- Check the browser console for the new Service ID

### "Code not showing up"
- Don't worry! The system falls back to "demo mode"
- Look for a yellow warning toast with the code
- Check the browser console for: `🔐 YOUR VERIFICATION CODE: XXXXXX`
- Use that code to reset your password

---

## 💡 Why Personal Email is Better

| Feature | Gmail API | Personal Email |
|---------|-----------|----------------|
| Setup Complexity | ❌ Complex OAuth | ✅ Simple SMTP |
| Permissions | ❌ Requires scopes | ✅ No special permissions |
| Reliability | ⚠️ Can break | ✅ Very reliable |
| Speed | ⚠️ Slower | ✅ Faster |
| Setup Time | ❌ 10-15 minutes | ✅ 2-3 minutes |

---

## 🎉 Success!

Once you complete these steps:
- ✅ Verification codes will be sent to real email addresses
- ✅ No more 412 errors
- ✅ Faster and more reliable
- ✅ No OAuth headaches

---

## 📝 Quick Reference

Your current EmailJS configuration:
```typescript
Public Key: dbbr3PM3LhbdU7D6-
Service ID: service_zrcx11y  ← UPDATE THIS
Template ID: template_y8ypuqa
```

After switching to Personal Email, you'll get a new Service ID like `service_abc123`.

---

## 🆘 Still Stuck?

1. Check the browser console (F12) for detailed error messages
2. Verify your EmailJS service is showing as "Active" in the dashboard
3. Try sending a test email from the EmailJS dashboard
4. Make sure your template has these variables:
   - `{{to_email}}` or `{{recipient_email}}`
   - `{{verification_code}}`
   - `{{to_name}}`

---

**Last updated**: March 5, 2026
