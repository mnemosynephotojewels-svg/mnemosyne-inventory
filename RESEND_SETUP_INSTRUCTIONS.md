# Resend Email Service Setup Instructions

This guide will help you set up **Resend** for sending password reset emails in your Mnemosyne Inventory Management System.

## Why Resend?

- ✅ **Free Tier**: 100 emails/day, 3,000/month
- ✅ **No Credit Card Required** for free tier
- ✅ **Simple API**: Clean, modern developer experience
- ✅ **Fast Delivery**: Reliable email sending
- ✅ **Great Documentation**: Easy to get started

---

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **"Sign Up"**
3. Create an account (no credit card required)
4. Verify your email address

---

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Go to **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g., "Mnemosyne Password Reset")
5. Copy the API key (starts with `re_`)
6. **IMPORTANT**: Save this key securely - you won't be able to see it again!

---

## Step 3: Add Domain (Optional but Recommended)

### For Production:
1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the instructions to add DNS records (SPF, DKIM, DMARC)
5. Wait for verification (usually takes a few minutes)

### For Testing:
- You can use the default `onboarding@resend.dev` domain
- Note: This only delivers to the email you signed up with
- For real user testing, you MUST verify a domain

---

## Step 4: Create Database Table for Reset Tokens

Run this SQL in your Supabase SQL Editor:

```sql
-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable Row Level Security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage tokens
CREATE POLICY "Service role can manage password reset tokens"
ON password_reset_tokens
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Create a function to clean up expired tokens automatically
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW()
  OR (used = true AND used_at < NOW() - INTERVAL '7 days');
END;
$$;

-- Optional: Schedule automatic cleanup (run daily)
-- You can set this up in Supabase Dashboard > Database > Cron Jobs
```

---

## Step 5: Deploy Supabase Edge Function

### 5a. Install Supabase CLI (if not already installed)

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use NPM
npm install -g supabase
```

### 5b. Link Your Project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 5c. Set Environment Variables

```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set your app URL (the URL where your frontend is hosted)
supabase secrets set APP_URL=https://yourdomain.com
```

### 5d. Deploy the Edge Function

```bash
# Deploy from your project root
supabase functions deploy send-password-reset
```

---

## Step 6: Update Environment Variables in Your App

Create a `.env.local` file in your project root (if not already exists):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Edge Function URL (after deployment)
VITE_RESET_PASSWORD_FUNCTION_URL=https://your-project.supabase.co/functions/v1/send-password-reset
```

---

## Step 7: Update Email Template (Optional)

Edit `/supabase/functions/send-password-reset/index.ts` to customize:

1. **From Email**: Change `from: 'Mnemosyne <noreply@yourdomain.com>'` to your verified domain
2. **Email Design**: Customize the HTML template
3. **Expiration Time**: Change `60 * 60 * 1000` (1 hour) to your preferred duration

---

## Step 8: Test the Password Reset Flow

1. Go to your app's login page
2. Click **"Forgot Password?"**
3. Enter your email address
4. Check your inbox for the reset email
5. Click the reset link
6. Enter a new password
7. Verify you can log in with the new password

---

## Troubleshooting

### Email Not Received?

1. **Check Spam/Junk folder**
2. **Verify domain** in Resend dashboard (if using custom domain)
3. **Check Resend logs** in dashboard to see if email was sent
4. **Check Supabase logs** in Dashboard > Edge Functions > send-password-reset

### "Failed to send reset email" Error?

1. **Check API key** is set correctly in Supabase secrets
2. **Verify Edge Function** is deployed successfully
3. **Check browser console** for error messages
4. **Check Supabase Edge Function logs** for detailed errors

### Token Invalid/Expired?

1. Tokens expire after 1 hour by default
2. Request a new reset link
3. Check database to ensure token is stored correctly

---

## Cost Estimate

### Resend Free Tier:
- **100 emails/day**
- **3,000 emails/month**
- **Perfect for small to medium applications**

### If You Need More:
- **Pro Plan**: $20/month for 50,000 emails
- **Business Plan**: $80/month for 500,000 emails

For most inventory management systems, the free tier is more than sufficient!

---

## Security Best Practices

✅ **Never expose your API key** in frontend code
✅ **Always use Edge Functions** for server-side operations
✅ **Implement rate limiting** (already included in authService.ts)
✅ **Use secure tokens** (UUID v4, already implemented)
✅ **Set expiration times** (1 hour is recommended)
✅ **Don't reveal if email exists** (prevents user enumeration)

---

## Alternative Free Email Services

If you prefer other options:

1. **SendGrid**: 100 emails/day free
2. **Mailgun**: 5,000 emails/month free for 3 months
3. **Brevo (Sendinblue)**: 300 emails/day free
4. **EmailJS**: Client-side only, completely free

Resend is recommended for its simplicity and modern API.

---

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Mnemosyne Support**: Check your application logs

---

## Quick Start Checklist

- [ ] Create Resend account
- [ ] Get API key
- [ ] Verify domain (or use test domain)
- [ ] Create database table
- [ ] Deploy Edge Function
- [ ] Set environment variables
- [ ] Test password reset flow
- [ ] Celebrate! 🎉
