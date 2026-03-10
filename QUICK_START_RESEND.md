# 🚀 Quick Start: Resend Email Setup (5 Minutes)

Get your password reset emails working in just 5 minutes!

---

## ✅ Step 1: Create Resend Account (1 min)

1. Go to **https://resend.com**
2. Click "Sign Up" (GitHub or email)
3. Verify your email
4. **Done!** No credit card needed

---

## 🔑 Step 2: Get API Key (30 seconds)

1. In Resend dashboard → **"API Keys"**
2. Click **"Create API Key"**
3. Name: `Mnemosyne Password Reset`
4. Copy the key (starts with `re_`)
5. **Save it** - you won't see it again!

---

## 💾 Step 3: Create Database Table (1 min)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy the entire content from `/supabase/migrations/create_password_reset_tokens.sql`
3. Paste and click **"Run"**
4. ✅ Success!

---

## 🚀 Step 4: Deploy Edge Function (2 min)

### Option A: Using Supabase CLI (Recommended)

```bash
# Install CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_api_key_here
supabase secrets set APP_URL=https://yourdomain.com

# Deploy function
supabase functions deploy send-password-reset
```

### Option B: Using Supabase Dashboard

1. Go to **Edge Functions** → **Deploy new function**
2. Name: `send-password-reset`
3. Paste code from `/supabase/functions/send-password-reset/index.ts`
4. Go to **Settings** → **Secrets** → Add:
   - `RESEND_API_KEY`: Your Resend API key
   - `APP_URL`: Your app URL (e.g., https://yourdomain.com)
5. Deploy!

---

## ⚙️ Step 5: Update Environment Variables (30 seconds)

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RESET_PASSWORD_FUNCTION_URL=https://your-project.supabase.co/functions/v1/send-password-reset
```

---

## 🎨 Step 6: Customize Email (Optional)

Edit `/supabase/functions/send-password-reset/index.ts`:

```typescript
// Change the FROM email (line ~90)
from: 'Mnemosyne <noreply@yourdomain.com>', // ← Your domain

// Change expiration time (line ~60)
const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ← 1 hour
```

### For Custom Domain (Production):

1. In Resend → **Domains** → **Add Domain**
2. Add DNS records (SPF, DKIM, DMARC)
3. Wait for verification (~5 minutes)
4. Update `from:` email in Edge Function

### For Testing:

Use `onboarding@resend.dev` - it works immediately but only sends to your Resend account email!

---

## 🧪 Step 7: Test It! (1 min)

1. Open your app → **Login page**
2. Click **"Forgot Password?"**
3. Enter your email
4. Check your inbox 📧
5. Click the reset link
6. Enter new password
7. Login with new password
8. **Success!** 🎉

---

## 📊 Free Tier Limits

| Feature | Free Plan |
|---------|-----------|
| Emails/day | 100 |
| Emails/month | 3,000 |
| Cost | $0 |
| Credit card | Not required |

**Perfect for most inventory management systems!**

---

## 🐛 Troubleshooting

### Email not received?

1. ✅ Check spam folder
2. ✅ Verify domain in Resend (if using custom domain)
3. ✅ Check Resend dashboard → **Logs**
4. ✅ Check Supabase → **Edge Functions** → Logs

### "Failed to send email"?

1. ✅ Verify API key is set in Supabase secrets
2. ✅ Check Edge Function is deployed
3. ✅ Check browser console for errors
4. ✅ Check Edge Function logs

### Token invalid/expired?

- Tokens expire after **1 hour**
- Request a new reset link
- Check database: `SELECT * FROM password_reset_tokens;`

---

## 🔒 Security Features

✅ **Secure tokens** (UUID v4)  
✅ **1-hour expiration**  
✅ **One-time use only**  
✅ **No email enumeration** (doesn't reveal if email exists)  
✅ **Rate limiting** (built into authService.ts)  
✅ **Activity logging** (tracks password resets)

---

## 📈 Monitoring

View email delivery in **Resend Dashboard**:
- Delivered emails
- Bounces
- Opens (if enabled)
- Clicks

View function calls in **Supabase Dashboard**:
- Edge Functions → send-password-reset → Logs
- See all requests and errors

---

## 🎓 What You Just Built

✨ **Professional password reset system** with:
- Real email delivery via Resend
- Beautiful branded HTML emails
- Secure token-based authentication
- Automatic token expiration
- Activity logging
- Production-ready error handling

---

## 🎯 Next Steps

Want to improve your setup?

1. **Add custom domain** for branded emails
2. **Set up cron job** to auto-cleanup expired tokens
3. **Customize email template** with your branding
4. **Add email tracking** (opens, clicks)
5. **Monitor delivery rates** in Resend dashboard

---

## 📚 Resources

- **Resend Docs**: https://resend.com/docs
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Full Setup Guide**: See `/RESEND_SETUP_INSTRUCTIONS.md`

---

## 🎉 You're Done!

Your password reset system is now live and sending real emails!

**Questions?** Check the full setup guide in `/RESEND_SETUP_INSTRUCTIONS.md`

---

Made with ❤️ for Mnemosyne Inventory Management System
