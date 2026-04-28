# ⚡ Resend Quick Start - 5 Minutes Setup

## 🎯 Goal
Send password reset emails for FREE using Resend (100 emails/day, 3,000/month)

---

## ✅ Quick Checklist

### 1️⃣ Get Resend API Key (2 minutes)
```
1. Sign up: https://resend.com/signup
2. Create API Key: https://resend.com/api-keys
3. Copy your key: re_xxxxxxxxxxxxxxxx
```

### 2️⃣ Set Supabase Secrets (1 minute)
```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set your app URL
supabase secrets set APP_URL=http://localhost:5173
# Or production: supabase secrets set APP_URL=https://yourdomain.com
```

### 3️⃣ Deploy Edge Function (1 minute)
```bash
# Deploy the function
supabase functions deploy send-password-reset
```

### 4️⃣ Update Email Sender (1 minute)

Edit `/supabase/functions/send-password-reset/index.ts` line 86:

**For testing (uses Resend's free domain):**
```typescript
from: 'Mnemosyne <onboarding@resend.dev>',
```

**For production (use your own domain):**
```typescript
from: 'Mnemosyne <noreply@yourdomain.com>',
```

Then redeploy:
```bash
supabase functions deploy send-password-reset
```

### 5️⃣ Test It! (30 seconds)
1. Go to your app's login page
2. Click "Forgot Password?"
3. Enter an email from your users table
4. Check your inbox (and spam folder)

---

## ✨ That's it!

Your password reset emails are now working with Resend!

**Check email delivery**: [https://resend.com/emails](https://resend.com/emails)

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "RESEND_API_KEY is not set" | Run: `supabase secrets set RESEND_API_KEY=your_key` |
| Email not arriving | Check spam folder, verify email exists in `users` table |
| Function error | Run: `supabase functions logs send-password-reset` |
| Email goes to spam | Use your own verified domain (not `onboarding@resend.dev`) |

---

## 📚 Full Documentation

For detailed setup, domain verification, and advanced configuration:
👉 See `/EMAIL_SERVICE_SETUP_RESEND.md`

---

**Need your Resend API key?** → [https://resend.com/api-keys](https://resend.com/api-keys)
