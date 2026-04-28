# 🚀 Resend Email Service Setup Guide

This guide will help you set up **Resend** (100% FREE) to send password reset emails for your Mnemosyne Inventory Management System.

---

## 📋 What is Resend?

**Resend** is a modern email API service with a generous free tier:
- ✅ **100 emails/day** (3,000/month) - FREE FOREVER
- ✅ Easy setup (< 5 minutes)
- ✅ Beautiful email templates
- ✅ Reliable delivery
- ✅ Great developer experience

Perfect for your password reset emails!

---

## 🎯 Step 1: Create Resend Account (FREE)

1. **Go to**: [https://resend.com/signup](https://resend.com/signup)
2. **Sign up** with your email or GitHub account
3. **Verify your email** address
4. **Complete onboarding** - it's quick!

---

## 🔑 Step 2: Get Your API Key

1. **Log in** to your Resend dashboard: [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. **Name it**: `Mnemosyne Password Reset`
4. **Permission**: Select "Sending access"
5. Click **"Add"**
6. **COPY YOUR API KEY** - it looks like this:
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **IMPORTANT**: Save this somewhere safe - you can only see it once!

---

## 📧 Step 3: Configure Your Email Domain (Optional but Recommended)

### Option A: Use Resend's Free Domain (Quick Start)
For testing, you can use `onboarding@resend.dev` as the sender email.

**Pros**: 
- ✅ No setup required
- ✅ Works immediately

**Cons**:
- ⚠️ May land in spam folders
- ⚠️ Not professional

### Option B: Use Your Own Domain (Recommended for Production)

1. **Add Your Domain** in Resend:
   - Go to: [https://resend.com/domains](https://resend.com/domains)
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)

2. **Add DNS Records**:
   Resend will show you DNS records to add. Go to your domain registrar and add:
   - SPF Record
   - DKIM Record
   - DMARC Record (optional)

3. **Verify Domain**:
   - Wait a few minutes (DNS propagation)
   - Click **"Verify DNS Records"** in Resend
   - Once verified, you can send from `noreply@yourdomain.com`

---

## ⚙️ Step 4: Deploy Supabase Edge Function

### 4.1 Install Supabase CLI

If you haven't already:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### 4.2 Link Your Supabase Project

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Find your project ref at: https://supabase.com/dashboard/project/_/settings/general
```

### 4.3 Set Environment Variables

Set your Resend API key and app URL as secrets:

```bash
# Set Resend API Key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set your app URL (change to your actual domain)
supabase secrets set APP_URL=https://yourdomain.com
# Or for local development:
supabase secrets set APP_URL=http://localhost:5173
```

### 4.4 Deploy the Edge Function

```bash
# Deploy the send-password-reset function
supabase functions deploy send-password-reset
```

You should see:
```
✓ Deploying Function send-password-reset
✓ Function send-password-reset deployed successfully
```

---

## 🎨 Step 5: Customize Email Template (Optional)

The edge function at `/supabase/functions/send-password-reset/index.ts` contains the email template.

### Update the "From" Email:

Find this line (around line 86):

```typescript
from: 'Mnemosyne <noreply@yourdomain.com>', // Replace with your verified domain
```

**Change it to:**

- **If using Resend's free domain**:
  ```typescript
  from: 'Mnemosyne <onboarding@resend.dev>',
  ```

- **If using your own domain** (recommended):
  ```typescript
  from: 'Mnemosyne <noreply@yourdomain.com>',
  ```

After making changes, redeploy:
```bash
supabase functions deploy send-password-reset
```

---

## 🧪 Step 6: Test Your Setup

### Test the Password Reset Flow:

1. **Run your app** locally or in production
2. Go to **Login Page**
3. Click **"Forgot Password?"**
4. Enter an email that exists in your `users` table
5. Click **"Send Reset Link"**
6. **Check your email** inbox (and spam folder)

### Expected Result:

You should receive a beautifully styled email with:
- Mnemosyne branding (navy blue #0a2647 and gold #d4af37)
- A "Reset Password" button
- A clickable reset link
- 1-hour expiration notice

---

## 🔍 Step 7: Verify in Resend Dashboard

1. Go to [https://resend.com/emails](https://resend.com/emails)
2. You should see your sent email with status:
   - ✅ **Delivered** - Email sent successfully
   - ⏳ **Queued** - Email is being sent
   - ❌ **Failed** - Check error logs

---

## 🛠️ Troubleshooting

### Problem: "RESEND_API_KEY is not set"

**Solution**: Make sure you've set the secret:
```bash
supabase secrets set RESEND_API_KEY=re_your_actual_key
```

Verify it's set:
```bash
supabase secrets list
```

---

### Problem: Email not arriving

**Checklist**:
1. ✅ Check **spam/junk folder**
2. ✅ Verify email exists in `users` table
3. ✅ Check Resend dashboard for delivery status
4. ✅ Make sure edge function is deployed
5. ✅ Check browser console for errors

---

### Problem: Email goes to spam

**Solutions**:
1. **Use your own verified domain** (not `onboarding@resend.dev`)
2. **Add SPF, DKIM, DMARC records** to your domain
3. **Warm up your domain** by sending a few emails daily first
4. **Ask users to whitelist** your email address

---

### Problem: "Failed to invoke function"

**Check**:
```bash
# View function logs
supabase functions logs send-password-reset

# Test function directly
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-password-reset' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com"}'
```

---

## 📊 Monitor Your Email Usage

### Free Tier Limits:
- **100 emails/day** (3,000/month)
- Perfect for small to medium apps

### Check Usage:
1. Go to: [https://resend.com/overview](https://resend.com/overview)
2. See your daily/monthly usage
3. Get alerts before hitting limits

---

## 🎉 You're All Set!

Your password reset emails are now powered by Resend! 

### What happens when a user forgets their password:

1. User enters their email
2. Your app calls the Supabase edge function
3. Edge function generates a secure token
4. Edge function sends beautiful email via Resend
5. User clicks the link in email
6. User resets their password
7. Success! 🎊

---

## 🔗 Useful Links

- **Resend Dashboard**: [https://resend.com/overview](https://resend.com/overview)
- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Status**: [https://resend.com/status](https://resend.com/status)
- **Supabase Functions Docs**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## 💡 Pro Tips

1. **Test emails** regularly to ensure everything works
2. **Monitor Resend dashboard** for delivery issues
3. **Keep your API key secret** - never commit it to Git
4. **Use environment variables** for all sensitive data
5. **Set up domain authentication** for better deliverability
6. **Track email opens** (optional) in Resend dashboard

---

## 🚨 Security Best Practices

✅ **DO**:
- Store API keys as Supabase secrets
- Use HTTPS for your app URL
- Validate email addresses before sending
- Set token expiration (currently 1 hour)
- Don't reveal if an email exists (prevent enumeration)

❌ **DON'T**:
- Hardcode API keys in your code
- Use HTTP for reset links
- Send unlimited reset emails (implement rate limiting)
- Store passwords in plain text
- Skip email validation

---

Need help? Check the Resend documentation or contact their support - they're very responsive!

**Happy emailing! 📧✨**
