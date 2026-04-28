# 📧 EmailJS Setup Guide - The EASIEST Solution!

## 🎯 Why EmailJS?

EmailJS is the **simplest** way to send emails from your app:

✅ **No backend required** - Works 100% from frontend  
✅ **5-minute setup** - Faster than any other solution  
✅ **FREE tier** - 200 emails/month (perfect for password resets!)  
✅ **No credit card** - Completely free to start  
✅ **Works with Gmail, Outlook, etc** - Use your existing email  
✅ **No server deployment** - No Edge Functions needed  

**This is BY FAR the easiest solution to get emails working!**

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Sign Up for EmailJS (1 minute)

1. Go to: **https://www.emailjs.com/signup**
2. Sign up (free - no credit card)
3. Verify your email
4. Log in to dashboard

---

### Step 2: Add Email Service (2 minutes)

1. In EmailJS dashboard, click **"Add New Service"**
2. Choose your email provider:
   - **Gmail** (easiest - recommended!)
   - Outlook
   - Yahoo
   - Custom SMTP
3. Click **"Connect Account"**
4. For Gmail:
   - Click "Connect Gmail"
   - Allow EmailJS to send emails
   - Done!
5. **Copy** the **Service ID** (looks like: `service_abc123`)

---

### Step 3: Create Email Template (1 minute)

1. Click **"Email Templates"** in sidebar
2. Click **"Create New Template"**
3. **Template Name**: `password_reset`
4. **Subject**: `Your Password Reset Code - Mnemosyne`
5. **Content**: Paste this HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
    .container { background: white; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 32px; font-weight: bold; color: #0a2647; letter-spacing: 2px; }
    .code-box { background: linear-gradient(135deg, #0a2647 0%, #144272 100%); color: #d4af37; padding: 24px; text-align: center; font-size: 42px; font-weight: bold; letter-spacing: 12px; border-radius: 12px; margin: 24px 0; font-family: 'Courier New', monospace; }
    .message { color: #333; line-height: 1.7; font-size: 16px; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 2px solid #eee; color: #666; font-size: 13px; }
    .warning { background: #fff3cd; border-left: 4px solid: #ffc107; padding: 16px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏛️ MNEMOSYNE</div>
      <p style="color: #666; margin-top: 8px;">Photo Memory Jewels</p>
    </div>

    <div class="message">
      <p>Hello <strong>{{to_name}}</strong>,</p>
      <p>We received a request to reset your password for your Mnemosyne account.</p>
      <p>Use the verification code below to reset your password:</p>
    </div>

    <div class="code-box">
      {{verification_code}}
    </div>

    <div class="warning">
      <p style="margin: 0; color: #856404; font-weight: 600;">⏱️ This code expires in {{expiry_time}}</p>
      <p style="margin: 8px 0 0 0; color: #856404; font-size: 13px;">For your security, this code will only work once.</p>
    </div>

    <div class="message">
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
    </div>

    <div class="footer">
      <p><strong>Mnemosyne Inventory System</strong></p>
      <p>Secure password management for your precious inventory</p>
      <p style="margin-top: 12px; color: #999; font-size: 11px;">This is an automated security message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
```

6. **Save Template**
7. **Copy** the **Template ID** (looks like: `template_xyz789`)

---

### Step 4: Get Your Public Key (30 seconds)

1. Click **"Account"** in top-right
2. Go to **"General"** or **"API Keys"**
3. **Copy** your **Public Key** (looks like: `abc123XYZ`)

---

### Step 5: Update Your Code (1 minute)

**Option A: Use EmailJS (I'll do this for you)**

Click the button below and I'll update your code automatically:

**[✅ Use EmailJS for Emails]**

**Option B: Manual Update**

Edit `/src/app/services/emailServiceEmailJS.ts` and replace:

```typescript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Paste your Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Paste your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Paste your Template ID
```

Then update `/src/app/services/authService.ts` to use EmailJS instead of Resend.

---

### Step 6: Test It! (30 seconds)

1. Try password reset in Mnemosyne
2. Check your email inbox
3. **Email should arrive within seconds!** 📧

---

## 🎁 Template Variables Reference

These variables are automatically filled in:

| Variable | What it does | Example |
|----------|--------------|---------|
| `{{to_email}}` | Recipient's email | `user@example.com` |
| `{{to_name}}` | Recipient's name | `John Doe` |
| `{{verification_code}}` | The 6-digit code | `842567` |
| `{{app_name}}` | Your app name | `Mnemosyne` |
| `{{expiry_time}}` | Code expiry | `10 minutes` |

---

## 💰 Cost Comparison

| Service | Free Tier | Setup Time | Difficulty |
|---------|-----------|------------|------------|
| **EmailJS** | 200/month | 5 min | ⭐ Easy |
| Resend + Supabase | 3,000/month | 15 min | ⭐⭐⭐ Hard |
| SendGrid | 100/day | 10 min | ⭐⭐ Medium |

**For Mnemosyne**: EmailJS is perfect! You'll send ~5-10 emails/month.

---

## 🧪 Testing Your Setup

### Quick Test in Browser Console

After setup, test with:

```javascript
// In browser console (F12)
import { testEmailJS } from './services/emailServiceEmailJS';
testEmailJS();
```

This will show your configuration status!

---

## 🔍 Troubleshooting

### Problem: "EmailJS is not defined"

**Solution**: Make sure you completed Step 5 (update code)

---

### Problem: "Invalid template ID"

**Solution**: 
1. Check you copied the **Template ID** correctly
2. Make sure template is **active** in EmailJS dashboard
3. No extra spaces in the ID

---

### Problem: "Email not received"

**Solution**:
1. ✅ Check spam folder
2. ✅ Verify Gmail is connected in EmailJS
3. ✅ Check EmailJS dashboard > Activity Log
4. ✅ Make sure you verified your EmailJS account
5. ✅ Wait a few minutes (can be delayed)

---

### Problem: "Service unavailable"

**Solution**:
1. Reconnect your Gmail in EmailJS dashboard
2. Make sure you allowed EmailJS to send emails
3. Check you're not over the free tier limit (200/month)

---

## 📊 EmailJS Dashboard Features

### Activity Log
- See all sent emails
- Check delivery status
- View error messages
- Download reports

### Email Services
- Manage connected accounts
- Add multiple email services
- Test connections

### Templates
- Edit email designs
- Preview before sending
- Version control

---

## 🎨 Customizing Your Email Template

Want to change the design?

1. Go to EmailJS dashboard
2. Click **"Email Templates"**
3. Edit your template
4. Change colors, text, layout
5. **Save**
6. No code changes needed!

---

## 🔐 Security Notes

### Is EmailJS Secure? ✅

- ✅ Public Key is safe to expose (it's meant to be public)
- ✅ Emails sent through EmailJS servers (not your frontend)
- ✅ No API secrets exposed
- ✅ HTTPS encryption
- ✅ Rate limiting built-in

### Best Practices

- ✅ Use environment variables for keys (optional)
- ✅ Enable rate limiting in EmailJS dashboard
- ✅ Monitor activity logs
- ✅ Don't include sensitive data in emails

---

## 📧 Supported Email Providers

EmailJS works with:

✅ **Gmail** (recommended - easiest!)  
✅ Outlook / Office 365  
✅ Yahoo Mail  
✅ AOL Mail  
✅ iCloud Mail  
✅ Zoho Mail  
✅ Custom SMTP (any email server)  

---

## 🆚 EmailJS vs Resend

| Feature | EmailJS | Resend |
|---------|---------|--------|
| Setup | 5 min | 15 min + Edge Function |
| Free Emails | 200/month | 3,000/month |
| Backend Required | No | Yes (Supabase) |
| Difficulty | ⭐ Easy | ⭐⭐⭐ Hard |
| Email Providers | Any | Resend only |
| For Mnemosyne | ✅ Perfect | ⚠️ Overkill |

**Recommendation**: Start with EmailJS. It's easier and enough for your needs!

---

## 🎉 After Setup Checklist

- [ ] Signed up for EmailJS
- [ ] Connected Gmail (or other email)
- [ ] Created email template
- [ ] Copied Public Key
- [ ] Copied Service ID
- [ ] Copied Template ID
- [ ] Updated code with IDs
- [ ] Tested password reset
- [ ] Email received successfully!
- [ ] 🎊 Celebrating!

---

## 🚀 Ready to Get Started?

**Right now, do this:**

1. **Open**: https://www.emailjs.com/signup
2. **Sign up** (30 seconds)
3. **Connect Gmail** (1 minute)
4. **Create template** (2 minutes - copy HTML above)
5. **Get your IDs** (30 seconds)
6. **Tell me** and I'll update your code!

**Total time**: 5 minutes  
**Total cost**: $0  
**Result**: Emails working! 🎉

---

## 💬 Need Help?

Tell me:
1. "Setup EmailJS for me" - I'll guide you through it
2. "I have my EmailJS IDs" - Give me the IDs and I'll update your code
3. "EmailJS not working" - I'll help debug

**EmailJS is the easiest solution - let's get it working!** 🚀
